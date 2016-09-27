class App {
  constructor(server) {
    this.server = server;
    this.init();
    console.log('constructor');
  }

  init() {
    $(document).ready(function() {
      $('.newRoomButton').on('click', function() {
        app.renderRoom();
      });

      app.renderRoom();
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

  fetch(id) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message pulled', data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to pull message', data);
      }
    });
  }

  clearMessages() {
    $('#chats').empty();
    console.log('clearMessages');
  }

  renderMessage(message) {
    $('#chats').append('<div class="message">' + message.text + '</div>');
    console.log('renderMessage');
  }

  renderRoom() {
    $('#main').append('<div class="chatbox"><div class="closeWindow">X</div><div class="messages"><p></p></div><div class="messageType"></div><div class="sendButton">Send</div></div>');
    
    $(function() {
      $('.chatbox').draggable();
    });
    
    $('.sendButton').on('click', function() {
      var message = {};
      message.username = 'eric';
      message.roomname = 'eric';
      message.text = 'hi this is awesome';
      // message.text = $('.messageType').text;
      app.send(message);
      console.log('sendButton');  
    });    

    $('.closeWindow').on('click', function(event) {
      $(event.target).parent().remove();
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

var app = new App('https://api.parse.com/1/classes/messages');


var m = {
  username: 'eric',
  text: 'hi there this is a message',
  roomname: 'Space'
};




















