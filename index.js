const WebSocket = require('ws')
const wss = new WebSocket.Server({
	port: 8070
})
const adminlogin = "test"
var cmdChar = "/"
var clients = []
var id = 0
const opCodes = {
	setNick: 0,
	send: 1,
  getId: 2
};
/*
var ws = new WebSocket("wss://server-sender--gabrielmakiewic.repl.co")
ws.onmessage = e => {
  console.log(e.data)
}
*/
wss.on('connection', ws => {
	var client = {
		ws,
		admin: false,
		id,
		nick: "",
		disconnected: false,
		before: this.id,
		send: function send(msg) {
			if(client.disconnected == false) {
				ws.send(msg);
				console.log(msg)
			}
		}
	}
	clients.push(client)
	client = clients[client.id]
	id++
	ws.on('message', message => {
		if(!message.startsWith("[") && !message.endsWith("]")) {
			console.log("Message from " + client.before + ": " + message)
		} else {
			var controls = JSON.parse(message);
			switch (controls[0]) {
        case opCodes.getId:
        return
        break;
				case opCodes.setNick:
					if(controls[1].length >= 1 && controls[1].length <= 12) {
						client.nick = controls[1]
            if(client.admin == true) {
              client.before = client.nick
            } else {
              client.before = `(${client.id}) ${client.nick}`
              client.send(`Set nickname to "${client.nick}".`)
            }
					} else {
						client.send("Nick can't be longer than 12 letters and can't be shorter than 1.")
					}
					break;
				case opCodes.send:
					var msg = controls[1]
					if(client.admin == false) {
						msg = msg.replace(/</g, "&lt;")
						msg = msg.replace(/>/g, "&gt;")
					}
					if(msg.toString().length >= 1 && msg.toString().length <= 512 && !msg.startsWith(cmdChar)) {
						msg = msg.trim()
						console.log(msg)
						for(var i = 0; i < clients.length; i++) {
							if(clients[i].disconnected == false) {
								clients[i].send(`${client.before}: ${msg}`)
							}
						}
          } else if(msg.toString().length >= 1 && msg.toString().length <= 512 && msg.startsWith(cmdChar)) {
						var command = msg.substr(1);
						var commandVars = command.split(" ")
						commandVars.shift()
						var afterCommand = commandVars.join(" ")
						var cmdCheck = command.split(" ")[0]
						if(cmdCheck == "adminlogin") {
							if(afterCommand == adminlogin) {
								client.admin = true
								client.send("Logged in.")
							} else {
								client.send("Wrong password")
								client.admin = false
							}
						}
          }
					break;
			}
		}
	})
	ws.on('close', function(reasonCode, description) {
		console.log("Client " + client.id + " closed.")
		client.disconnected = true
	})
})
