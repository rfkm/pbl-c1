express = require 'express'
app = express()
server = require('http').Server app
io = require('socket.io')(server)
device  = require('express-device')

runningPortNumber = process.env.PORT or 3000

app.use express.static "#{__dirname}/public"

app.engine('.html', require('ejs').__express)
app.set('view engine', 'html')
app.set 'views', "#{__dirname}/views"
app.use device.capture()

app.use (req, res, next) ->
	console.log method: req.method, url: req.url, device: req.device
	next()

app.get "/", (req, res) ->
	res.render 'index', {}

io.sockets.on 'connection', (socket) ->
	io.sockets.emit 'blast', {mst: "someone connected"}

	socket.on 'blast', (data, fun) ->
		console.log data
		io.sockets.emit 'blast', {msg: data.msg}
		fn()

server.listen runningPortNumber
