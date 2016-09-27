class App {
  constructor(server) {
    this.server = server;
    this.messages = {};
    this.index = 0;
    this.boxCount = 1;
    this.init();
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
    }, 4000);
  }

  clearMessages() {
    $('#chats').empty();
    console.log('clearMessages');
  }

  renderMessage() {
    var i = this.index;
    console.log(this.messages.results);
    for (i; i < this.messages.results.length; i++) {
      var ele = this.messages.results[i];

      // for (var j = 0; j < ele.roomname.length; j++) {
      
      // }

      var example = 'abcdefghijklmnopqrstuvwxyz0123456789';

      if (!ele.username || example.indexOf(ele.username[0].toLowerCase()) === -1) {
        // console.log(ele.username);
        ele.username = 'anonymous';
      }
      if (!ele.roomname || example.indexOf(ele.roomname[0].toLowerCase()) === -1) {
        // console.log(ele.roomname);
        ele.roomname = 'default';

      }

ele.roomname = ele.roomname.replace(/\s+/g, '_');

      if (!ele.text || example.indexOf(ele.text[0].toLowerCase()) === -1) {
        // console.log(ele.text);
        ele.text = 'Nice Try';
      }

      if (!document.getElementById(ele.roomname)) {
        console.log('creating room', ele.roomname);
        this.renderRoom(ele.roomname);
      }
      
      $('#' + ele.roomname + ' .messages').append('<p>' + ele.username + ': ' + ele.text + '<p>');
    }
  }

  renderRoom(roomname) {
    roomname = roomname || prompt('Name Your Room');
    
    if (document.getElementById(roomname)) {
      alert('Room already exists');
      var roomname = prompt('Name Your Room');
      this.renderRoom(roomname);
      return;
    }

    if (roomname === null) {
      return;
    }

    $('#main').append('<div class="chatbox" id='+roomname+'></div>');
    $('#'+roomname).append('<div class="closeWindow">X</div>');
    $('#'+roomname).append('<div class="roomname">'+roomname+'</div>');
    $('#'+roomname).append('<div class="messages"><p></p></div>');
    $('#'+roomname).append('<div class="messageType"></div>');
    $('#'+roomname).append('<div class="sendButton">Send</div>');
    
    $(function() {
      $('#'+roomname).draggable();
    });
    
    $('.sendButton').on('click', () => {
      var message = {};
      message.username = 'eric';
      message.roomname = 'eric';
      message.text = 'hi this is awesome';
      // message.text = $('.messageType').text;
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

}

$(document).ready( () => {
var app = new App('https://api.parse.com/1/classes/messages');

var m = {
  username: 'eric',
  text: 'kaboom',
  roomname: 'wheee'
};

var mes = {results:[m,m,m,m,m,m,m]};

});



















