var ws = new WebSocket("wss://server-sender--gabrielmakiewic.repl.co")
ws.onmessage = e => {
  console.log(e.data)
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
