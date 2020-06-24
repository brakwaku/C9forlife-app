const socket = io('http://localhost:PORT')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', name)

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`You: ${message}`)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

/*

  <!-- <head>
    <%- include('../../includes/header.ejs') %>
    <script defer src="http://localhost:PORT/socket.io/socket.io.js"></script>
    <script defer src="/scripts/chat.js"></script>
  </head>
  
  <body>
    <%- include('../../includes/nav.ejs') %>
    <div class="jumbotron text-center"></div>
      <div class="container" id="message-container">
        <form id="send-container">
          <input type="text" id="message-input">
          <button type="submit" id="send-button">Send</button>
        </form>
      <button class="btn btn-danger">Get Help</button>
    </div>
    <%- include('../../includes/end.ejs') %> -->

*/