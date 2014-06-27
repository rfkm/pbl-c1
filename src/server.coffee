express = require 'express'
app = express()
server = require('http').Server app
io = require('socket.io')()
ioredis = require('socket.io-redis')
io.adapter(ioredis({host: 'localhost', port: 6379}))
uuid = require('node-uuid')
EventEmitter = require('eventemitter2').EventEmitter2

runningPortNumber = process.env.PORT or 3000
wsPort = process.env.WS_PORT or 4321

app.use express.static "#{__dirname}/public"
app.engine('.html', require('ejs').__express)
app.set('view engine', 'html')
app.set 'views', "#{__dirname}/views"

class Matcher extends EventEmitter
	queue: []
	convs: {}
	rconvs: {}
	count: 0
	limit: 10
	addQueue: (uid) ->
		@queue.push uid
		process.nextTick =>
			@match()
	removeQueue: (uid) ->
		if @rconvs[uid]?
			cid = @rconvs[uid]
			ps = @convs[cid]
			for p in ps
				@emit 'end:' + p, cid, ps
				delete @rconvs[p]
			delete @convs[cid]
			@count--
		else
			for q,i  in @queue when q is uid
				@queue.splice i, 1
		process.nextTick =>
			@match()
	match: ->
		if @count <= @limit and @queue.length >= 2
			cid = uuid.v4()
			u1 = @queue.shift()
			u2 = @queue.shift()
			@convs[cid] = [u1, u2]
			@rconvs[u1] = cid
			@rconvs[u2] = cid
			@count++
			@emit "start:" + u1, cid, [u1, u2]
			@emit "start:" + u2, cid, [u1, u2]
			
		
matcher = new Matcher

io.on 'connection', (socket) ->
	console.log 'a user connected'
	uid = null
	socket.on "join-request", (data, fn) ->
		uid = uuid.v4()
		matcher.addQueue uid
		cid = null
		matcher.on 'start:' + uid, (cid, uids) ->
			socket.emit 'start', cid
			socket.join(cid)
			socket.on 'voice', (s) ->
				socket.broadcast.emit 'voice', s
		matcher.on 'end:' + uid, (cid, uids) ->
			socket.emit 'end', cid
			socket.leave(cid)
			socket.removeAllListeners()
				
		fn uid
	socket.on "disconnect", ->
		console.log 'disconnect'
		if uid?
			matcher.removeQueue uid

io.listen wsPort

server.listen runningPortNumber, ->
	console.log 'listening on *:' + runningPortNumber

