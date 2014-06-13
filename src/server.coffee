express = require 'express'
app = express()
server = require('http').Server app
io = require('socket.io')()
device  = require('express-device')


runningPortNumber = process.env.PORT or 3000
wsPort = process.env.WS_PORT or 4321

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

io.on 'connection', (socket) ->
	console.log 'a user connected'
	socket.on 'chat', (data) ->
		console.log data
		socket.emit 'chat', { msg: data.msg }


io.listen wsPort

server.listen runningPortNumber, ->
	console.log 'listening on *:' + runningPortNumber
