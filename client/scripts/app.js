class App {
  constructor(server) {
    this.server = server;
    this.messages = {};
    this.oldMessagesEnd;
    this.index = 99;
    this.boxCount = 1;
    this.username = 'Maverick';
    this.init();
    this.zCount = 1;
    this.initFlag = false;
    this.roomname;
    this.friends = [];
    console.log('constructor');
  }

  init() {
    $('body').on('click', '.newRoomButton', () => {
      var name = prompt('What do you want to name your room?' || 'default');
      // console.log('button clicked');


      this.renderRoom(name);
    });
    
    this.fetch();
    console.log('init');
    setInterval( ()=>{
      this.fetch();
    }, 5000);
  }

  send(message) {
    console.log('sending', JSON.stringify(message));
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: (data) => {
        console.log('chatterbox: Message sent', data);
        this.fetch();
      },
      error: (data) => {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  fetch() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      contentType: 'application/json',
      data: 'order=-createdAt',
      success: (data) => {
        if (this.initFlag) {
          this.oldMessagesEnd = this.messages.results[0].objectId;
          // console.log('old message id', this.oldMessagesEnd);
        }
        this.messages = data;
        
        if (!this.initFlag) {
          this.initFlag = true;
        }

        for (var i = 0; i < this.messages.results.length; i++) {
          if (this.oldMessagesEnd === this.messages.results[i].objectId) {
            this.index = i - 1;
            // console.log('found id match', i);
            break;
          }
        }

        // console.log('data', this.messages);
        this.renderMessage();
        console.log('chatterbox: messages pulled');
      },
      error: (data) => {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to pull message', data);
      }
    });
  }

  clearMessages() {
    $('#chats').empty();
    console.log('clearMessages');
  }

  renderMessage() {
    var i = this.index;
    // console.log(this.messages.results);
    for (i; i >= 0; i--) {
      var ele = this.messages.results[i];
      // console.log('this.index', this.index);
      this.index--;

      var example = 'abcdefghijklmnopqrstuvwxyz0123456789';
      // if (!ele.username || example.indexOf(ele.username[0].toLowerCase()) === -1) {
        // console.log(ele.username);
      if (!ele.username) {
        ele.username = 'anonymous';
      }
      if (!ele.roomname || example.indexOf(ele.roomname[0].toLowerCase()) === -1 || ele.roomname === null) {
        // console.log(ele.roomname);
        ele.roomname = 'default';
      }

      ele.roomname = ele.roomname.replace(/\s+/g, '_');
      ele.username = ele.username.replace(/\s+/g, '_');

      this.renderRoom(ele.roomname);
      
      $('#'+ele.roomname + ' .messages').append('<p><span class="username" data-username=\"' + ele.username + '\" /><span class="message" /></p>');
      // $('#'+ele.roomname + ' .messages .username').last().text(ele.username);

      if (this.friends.indexOf(ele.username) !== -1) {
        $('#'+ele.roomname + ' .messages .username').last().text(ele.username);
        $('#'+ele.roomname + ' .messages .username').last().addClass('friend')
      } else {
        $('#'+ele.roomname + ' .messages .username').last().text(ele.username);
      }

      $('#'+ele.roomname + ' .messages  .message').last().text(': ' + ele.text);

      // console.log('message rendered to ', ele.roomname)
    }
  }

  renderRoom(roomname) {
    roomname = roomname || 'default';

    if (roomname === null) {
      return;
    }
    //remove spaces
    roomname = roomname.replace(/\s+/g, '_');
    // roomname = roomname.replace(/"/g, '\\\"');

    var $roomname = document.getElementById(roomname);
    console.log('$roomname', $roomname)
    
    if (document.getElementById(roomname)) {
      console.log('room exists')
      if ($($roomname).is(':hidden')) {
        $($roomname).slideDown();
      }
      return;
    }

    console.log('room does not exist, creating')
    if (document.getElementById(roomname)) {
      alert('Room already exists');
      var roomname = prompt('Name Your Room');
      this.renderRoom(roomname);
      return;
    }

    $('#main').append('<div class="chatbox" id=\"' + roomname + '\"></div>');
    $('#'+roomname).append('<div class="closeWindow">X</div>');
    $('#'+roomname).append('<div class="roomname"></div>');
    $('#'+roomname + ' .roomname').text(roomname);
    $('#'+roomname).append('<div class="messages"></div>');
    $('#'+roomname).append('<textarea class="messageType"></textarea>');
    $('#'+roomname).append('<div class="sendButton">Send</div>');

    $('#'+roomname).css('top', this.randomNum(0, window.innerHeight - 300) + 'px');
    $('#'+roomname).css('left', this.randomNum(0, window.innerWidth - 300) + 'px');
    $('#'+roomname).css('background-color', 'rgb(' + this.randomNum(0, 200) + ',' + this.randomNum(0, 200) + ',' + this.randomNum(0, 200) + ')');

    
    
    $('#' + roomname).draggable();
    
    $('#' + roomname).on('click', (event) => {
      // console.log($(event.target));
      $('#' + roomname).css('z-index', this.zCount);
      this.zCount++;
    });

    //friends list click handler
    $('#'+roomname).on('click', '.username', (event) => {
      // console.log($(event.target));
      var friendIndex = this.friends.indexOf($(event.target).text());
      var friend = $(event.target).text();
      console.log('my friend is ', friend)
      if (friendIndex === -1) {
        this.friends.push(friend);
      } else {
        this.friends.splice(friendIndex, 1);
      }

      $('.username[data-username=\"'+friend+'\"]').each(function(){
        $(this).toggleClass('friend');
      });

      console.log('friends toggled');
    });
    
    $('#'+roomname).on('click', '.sendButton',(event) => {
      var username = '';

      var string = window.location.search;

      var userIndex = string.indexOf('username=');
      this.username = string.slice(userIndex + 9)
      console.log('new user', this.username)



      var message = {};
      message.text = $(event.target).siblings('.messageType').val();
      message.username = this.username;
      message.roomname = $(event.target).parent().attr('id');
      $(event.target).siblings('.messageType').val('');
      console.log('sending this ', message);
      this.send(message);
      console.log('sendButton');
    });    

    $('.closeWindow').on('click', (event) => {
      $(event.target).parent().slideUp();
      //Fade Out
      // setTimer(function() {
      //   $(event.target).parent().remove();
      // }.bind(this), 1000);
    });
    console.log('renderRoom');

    // if(this.messages.results)
  }

  randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  //we could add data from the beginning and select everything with that data... toggle friend class.
}

$(document).ready( () => {
  var app = new App('https://api.parse.com/1/classes/messages');
});

















