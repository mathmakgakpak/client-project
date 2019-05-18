var url = "wss://server-sender-2--gabrielmakiewic.repl.co"
var ws = new WebSocket(url)

function localSend(msg) {
	var childs = document.getElementById('chat-messages').children
	if(childs.length > 20) {
		childs[0].remove()
		childs[1].remove()
	}
	var omsg = document.createElement("span")
	var br = document.createElement("br")
	omsg.innerHTML = msg
	document.getElementById('chat-messages').appendChild(omsg)
	document.getElementById('chat-messages').appendChild(br)
	console.log(msg)
}

function setNick(nick) {
	ws.send(JSON.stringify([0, nick]))
}

function send(msg) {
	ws.send(JSON.stringify([1, msg]))
	if(msg.startsWith("/adminlogin")) {
		msg = msg.split(" ")
		msg.shift()
		msg = msg.join(" ")
		localStorage.adminlogin = msg
	}
}

function sendButton() {
	var area = document.getElementById('sendArea')
	send(area.value)
	area.value = ""
}

function setNickButton() {
	var nickArea = document.getElementById('nickArea').value
	if(nickArea.length >= 1 && nickArea.length <= 12) {
		setNick(nickArea)
		localStorage.nick = nickArea
	} else {
		console.warn("Nick cant be longer than 12 letters and can't be shorter than 1.")
	}
}

function reconnect() {
	ws.close()
	ws = new WebSocket(url)
	connectConfig()
}

function connectConfig() {
	ws.onopen = () => {
		if(localStorage.adminlogin) {
			send("/adminlogin " + localStorage.adminlogin)
		}
		if(localStorage.nick.length >= 1) {
			setNick(localStorage.nick)
			document.getElementById('nickArea').value = localStorage.nick
		}
	}
	ws.onclose = () => {
		localSend("Disconnected.")
		localSend("To connect click this button <button onclick='reconnect()'>Reconnect</button>")
	}
	ws.onmessage = e => {
		localSend(e.data)
	}
}
connectConfig()
window.addEventListener('keyup', function(e) {
	var chat = document.getElementById('sendArea');
	var nick = document.getElementById('nickArea');
		if(e.keyCode === 13) {
			if(document.activeElement === chat) {
				sendButton()
				document.activeElement.blur()
			} else {
				chat.focus()
			}
		}
}, false);
