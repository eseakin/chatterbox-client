class App {
  constructor(server) {
    this.server = server;
    this.messages = {};
    this.index = 0;
    this.boxCount = 1;
    this.init();
    this.zCount = 1;
    this.roomname;
    console.log('constructor');
  }

  init() {
    this.fetch();
    $('.newRoomButton').on('click', () => {
      this.renderRoom();
    });
    
    console.log('init');
  }

  send(message) {
    console.log('sending', JSON.stringify(message));
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent', data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  fetch() {
    setInterval( ()=>{
      $.ajax({
        // This is the url you should use to communicate with the parse API server.
        url: 'https://api.parse.com/1/classes/messages',
        type: 'GET',
        contentType: 'application/json',
        data: 'order=-createdAt',
        success: (data) => {
          this.messages = data;
          console.log('data', this.messages);
          this.renderMessage();
          console.log('chatterbox: messages pulled');
        },
        error: (data) => {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to pull message', data);
        }
      });
    }, 2000);
  }

  clearMessages() {
    $('#chats').empty();
    console.log('clearMessages');
  }

  renderMessage() {
    var i = this.index;
    // console.log(this.messages.results);
    for (i; i < this.messages.results.length; i++) {
      var ele = this.messages.results[i];
      this.index++;

      var example = 'abcdefghijklmnopqrstuvwxyz0123456789';

      if (!ele.username || example.indexOf(ele.username[0].toLowerCase()) === -1) {
        // console.log(ele.username);
        ele.username = 'anonymous';
      }
      if (!ele.roomname || example.indexOf(ele.roomname[0].toLowerCase()) === -1) {
        // console.log(ele.roomname);
        ele.roomname = 'default';
      }

      if (!ele.text || example.indexOf(ele.text[0].toLowerCase()) === -1) {
        // console.log(ele.text);
        ele.text = 'Nice Try';
      }

      if (!document.getElementById(ele.roomname)) {
        console.log('creating room', ele.roomname);
        this.renderRoom(ele.roomname);
      }
      $('div[id=\"'+ele.roomname+'\"]' + ' .messages').append('<p></p>')
      $('div[id=\"'+ele.roomname+'\"]' + ' .messages p').last().text(ele.username + ': ' + ele.text);
    }
  }

  renderRoom(roomname, x, y) {
    roomname = roomname || prompt('Name Your Room');

    if (roomname === null) {
      return;
    }
    //remove spaces
    // roomname = roomname.replace(/\s+/g, '_');
    // roomname = roomname.replace(/"/g, '\\\"');
    
    if (document.getElementById(roomname)) {
      alert('Room already exists');
      var roomname = prompt('Name Your Room');
      this.renderRoom(roomname);
      return;
    }

    $('#main').append('<div class="chatbox" id=\"'+roomname+'\"></div>');
    $('div[id=\"'+roomname+'\"]').append('<div class="closeWindow">X</div>');
    $('div[id=\"'+roomname+'\"]').append('<div class="roomname"></div>');
    $('div[id=\"'+roomname+'\"] .roomname').text(roomname);
    $('div[id=\"'+roomname+'\"]').append('<div class="messages"></div>');
    $('div[id=\"'+roomname+'\"]').append('<textarea class="messageType"></textarea>');
    $('div[id=\"'+roomname+'\"]').append('<div class="sendButton">Send</div>');

    $('div[id=\"'+roomname+'\"]').css('top', this.randomNum(0,window.innerHeight - 300) + 'px');
    $('div[id=\"'+roomname+'\"]').css('left', this.randomNum(0,window.innerWidth - 300) + 'px');
    $('div[id=\"'+roomname+'\"]').css('background-color', 'rgb(' + this.randomNum(0,200) + ',' + this.randomNum(0,200) + ',' + this.randomNum(0,200) + ')');

    
    $(() => {
      $('div[id=\"'+roomname+'\"]').draggable();
    });

    $('div[id=\"'+roomname+'\"]').on('click', (event) => {
      // console.log($(event.target));
      $('div[id=\"'+roomname+'\"]').css('z-index', this.zCount);
      this.zCount++;
    });
    
    $('.sendButton').on('click', (event) => {
      var message = {};
      // message.username = 'joker';
      // message.roomname = 'jokerface';
      // message.text = 'lasers pew pew';
      // console.log('clicked send on ',$(event.target).parent().attr('id'));
      message.text = $(event.target).siblings('.messageType').val();
      message.username = 'joker';
      message.roomname = $(event.target).parent().attr('id');
      $(event.target).siblings('.messageType').val('');
      // console.log('sending this ',message)
      this.send(message);
      console.log('sendButton');
    });    

    $('.closeWindow').on('click', (event) => {
      $(event.target).parent().remove();
      //MAKE THIS WORRRRRK
      // setTimer(function() {
      //   $(event.target).parent().remove();
      // }.bind(this), 1000);
    });
    console.log('renderRoom');
  }

  handleUsernameClick() {
    console.log('handleUsernameClick');
  }

  addRoom(roomName) {

    console.log('addRoom');
  }

  randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

}

$(document).ready( () => {
var app = new App('https://api.parse.com/1/classes/messages');
});



















