var url = "wss://server-sender-2--gabrielmakiewic.repl.co"
var ws = new WebSocket(url)

var keys = {};
onkeydown = onkeyup = function(e){
  e = e || event;
  keys[e.keyCode] = e.type == 'keydown';
}

client = {
  chat: {
    send: function(msg) {
    	ws.send(JSON.stringify([1, msg]))
    	if(msg.startsWith("/adminlogin")) {
    		msg = msg.split(" ")
    		msg.shift()
    		msg = msg.join(" ")
    		localStorage.adminlogin = msg
    	}
    },
    local: function(msg) {
    	var childs = document.getElementById('chat-messages').children
    	if(childs.length > 10) {
    		childs[0].remove()
    	}
    	var omsg = document.createElement("ul")
    	omsg.innerHTML = msg
    	document.getElementById('chat-messages').appendChild(omsg)
    	console.log(msg)
    },
    clear: function() {
      var childs = document.getElementById('chat-messages').children
    	for(var i = 0; i < childs.length; i++) {
    		childs[i].remove()
        console.clear()
    	}
    }
  }
}


function setNick(nick) {
	ws.send(JSON.stringify([0, nick]))
}

function clockStart() {
	var today = new Date();
	var hours = today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
	var minutes = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
	document.getElementById("clock").innerHTML = `${hours}:${minutes}`
	setTimeout(clockStart, 1000);
}

function sendButton() {
	var area = document.getElementById('sendArea')
	client.chat.send(area.value)
	area.value = ""
}

function setNickButton() {
	var nickArea = document.getElementById('nickArea').value
	setNick(nickArea)
	localStorage.nick = nickArea
}

function reconnect() {
	ws.close()
	ws = new WebSocket(url)
	connectConfig()
}

function testEnter() {
  if (keys[13] && !keys[16]) {
        sendButton()
        document.activeElement.blur()
        return false;
    } else {
        return true;
    }
}


function connectConfig() {
	ws.onopen = () => {
		if(localStorage.adminlogin) {
			client.chat.send("/adminlogin " + localStorage.adminlogin)
		}
		if(localStorage.nick.length >= 1) {
			setNick(localStorage.nick)
			document.getElementById('nickArea').value = localStorage.nick
		}
	}
	ws.onclose = () => {
		client.chat.local("Disconnected.")
		client.chat.local("To connect click this button <button onclick='reconnect(); this.remove()'>Reconnect</button>")
	}
	ws.onmessage = e => {
		client.chat.local(e.data)
	}
}
connectConfig()
