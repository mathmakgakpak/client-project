const WebSocket = require('ws')
const fs = require('fs')
const wss = new WebSocket.Server({
	port: 8070
})
const WatchJS = require("melanke-watchjs")
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;
const adminlogin = "test"
var cmdChar = "/"
var clients = []
var id = 0
const opCodes = {
	setNick: 0,
	send: 1
};
/*
var ws = new WebSocket("wss://server-sender--gabrielmakiewic.repl.co")
ws.onmessage = e => {
  console.log(e.data)
}
*/
wss.on('connection', (ws, req) => {
  if (!fs.existsSync("./bans.txt")) {
    fs.writeFile("./bans.txt", '', function(err) {
      if(err) {
        return console.log(err);
      }
    });
  }
	function sendToUsers(msg) {
		for(var i = 0; i < clients.length; i++) {
			clients[i].send(msg)
		}
	}
	sendToUsers(id + " joined to chat.")
	var client = {
		ws,
    req,
		admin: false,
		id,
		nick: "",
		before: this.id,
		send: function(msg) {
			ws.send(msg)
		},
		ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress.replace('::ffff:', '')
	}



  var banned = fs.readFileSync("./bans.txt").toString().split("\n");


    for(i = 0; i < banned.length; i++) {
      if(banned[i] == client.ip) {
        client.send("You are banned. Apeal for unban on: https://discord.gg/DTGAq4b")
        client.ws.close()
      }}
	clients.push(client)
	client.send("Your id is " + client.id)
	watch(client, function() {
		for(var i = 0; i <= clients.length; i++) {
			if(clients[i].id == user.id) {
				clients[i] = client
			}
		}
	});
	//client = clients[client.id]
	id++
	ws.on('message', message => {
		if(!message.startsWith("[") && !message.endsWith("]")) {
			console.log("Message from " + client.before + ": " + message)
		} else {
			var controls = JSON.parse(message);
			switch (controls[0]) {
				case opCodes.setNick:
					if(controls[1].length >= 1 && controls[1].length <= 12 || client.admin) {
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
        function getPlayerById(id) {
          var target = clients.find(function(target) {
              return target.id == id;
          });
          return target
        }
					var msg = controls[1].trim()
					if(client.admin == false) {
						msg = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;")
					}
					if(msg.toString().length >= 1 && msg.toString().length <= 512 && !client.admin && !msg.startsWith(cmdChar)) {
						console.log(`${client.before}: ${msg}`)
						sendToUsers(`${client.before}: ${msg}`)
					} else if(msg.toString().length >= 1 && msg.toString().length <= 999999 && client.admin && !msg.startsWith(cmdChar)) {
						console.log(`${client.before}: ${msg}`)
						sendToUsers(`${client.before}: ${msg}`)
					} else if(msg.toString().length >= 1 && msg.startsWith(cmdChar)) {
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
						} else if(cmdCheck == "kick" && client.admin == true) {
                var kickId = Number(commandVars[0])
                var player = getPlayerById(kickId)
                if(player) {
                  player.ws.close()
                } else if(!kickId) {
                  client.send(cmdChar + "kick [id]")
                } else if(!player) {
                  client.send("Player not found.")
                }
            } else if(cmdCheck == "banip" && client.admin == true) {
              var ip = commandVars[0]

              if (ip) {
                if (fs.existsSync("./bans.txt")) {
                  fs.appendFileSync("./bans.txt", `${ip}\n`);
            } else {

              fs.writeFile("./bans.txt", `${ip}\n`, function(err) {
                if(err) {
                  return console.log(err);
                }
              });

          }

          function sendStaff(message) {
            clients.forEach(function(client) {
              if (client.admin) {
                client.send(message)
              }
            })
          }

          sendStaff(`Banned ip: ${ip}`)
          clients.forEach(function(client) {
            if (client.ip == ip) {
              client.ws.close()
            }
          })




              } else {
                client.send(cmdChar + "banip [ip]")
              }
            } else if(cmdCheck == "whois" && client.admin == true) {
              var id = Number(commandVars[0])
              var target = getPlayerById(id)
              if(target) {
                client.send(`-> id: ${target.id}\n` +
                    `-> nick: ${target.nick}\n` +
                    `-> admin: ${target.admin}\n` +
                    `-> ip: ${target.ip}\n` +
                    `-> origin: ${target.req.url}`)
              } else if(!id) {
                client.send(cmdChar + "whois [id]")
              } else if(!target){
                client.send("Player not found.")
              }
            } else {
              client.send("Command is not defined.")
            }
					}
					break;
			}
		}
	})
	ws.on('close', function(reasonCode, description) {
		var user = client
		for(var i = 0; i < clients.length; i++) {
			if(clients[i].id === user.id) {
				clients[i].ws.close()
				clients.splice(i, 1);
				return
			}
		}
		console.log("Client " + user.id + " disconnected.")
		sendToUsers("Client " + user.id + " disconnected.")
		return;
	})
})
