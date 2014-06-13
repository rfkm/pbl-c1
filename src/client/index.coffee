io = require 'socket.io-client'
$ = require 'jquery'
console.log 'loaded'

wsPort = process.env.WS_PORT or 4321

$ ->
	s = io(location.hostname + ":" + wsPort)
	s.on 'chat', ->
		console.log arguments
	$('#send').click ->
		console.log 'click'
		s.emit 'chat', "hello"
		false
