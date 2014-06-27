io = require 'socket.io-client'
$ = require 'jquery'
Vue = require 'vue'

wsPort = process.env.WS_PORT or 4321

bSize = 4096

# HACK: Prevent GC. See https://bugs.webkit.org/show_bug.cgi?id=112521
hhh = null
sap = null


$ ->
	global.navigator.getUserMedia = global.navigator.getUserMedia or global.navigator.webkitGetUserMedia or global.navigator.mozGetUserMedia or global.navigator.msGetUserMedia
	global.AudioContext = global.AudioContext or global.webkitAudioContext or globalpw.mozAudioContext or global.msAudioContext

	new Vue
		el: "#container"
		data:
			username: null
			userid: null
			state: 0
			waiting: false
			calling: false
			talking: false
			cid: null
		socket: null
		computed:
			standby: ->
				@state is 0
			waiting: ->
				@state is 1
			calling: ->
				@state is 2
			talking: ->
				@state is 3
		methods:
			join: ->
				if not @waiting
					@state = 1
					
					@$options.socket.emit "join-request", (@username or "anonymous"), (uid) =>
						@state = 2
						@userid = uid
						@$options.socket.once "start", (cid) =>
							@cid = cid
							@state = 3

							pbuf = []
							acx = new global.AudioContext
							osc = acx.createOscillator()
							src = acx.createScriptProcessor bSize, 1, 1
							sap = (e) ->
								out = e.outputBuffer.getChannelData(0)
								b = pbuf.shift()
								for k, v of b
									out[k] = v
							
							src.onaudioprocess = sap
							src.connect acx.destination
							osc.connect src
							osc.start(0)
							
							@$options.socket.on 'voice', (s) ->
								pbuf.push s

							global.navigator.getUserMedia {audio: true}, (stream) =>
								AudioContext = global.AudioContext
								ac = new AudioContext
								sNode = ac.createScriptProcessor bSize, 1, 1
								hhh = (e) =>
									input = e.inputBuffer.getChannelData 0
									output = e.outputBuffer.getChannelData 0
									for i in [0...bSize]
										output[i] = 0
									@$options.socket.emit 'voice', input
								
								sNode.onaudioprocess = hhh
								mss = ac.createMediaStreamSource(stream)
								mss.connect sNode
									
								sNode.connect ac.destination
							, (e) ->
								console.log e
								

							@$options.socket.once "end", =>
								@state = 0
								@cid = null
								@$options.socket.removeAllListeners()
			cancel: ->
				@waiting = false
				@$options.socket.emit "cancel", (@username or "anonymous")
		created: ->
			@$options.socket = io(location.hostname + ":" + wsPort)

			@$options.socket.on 'connect', ->
				console.log 'connected'
				
			@$options.socket.on 'disconnect', =>
				console.log 'disconnected'
				@$options.socket.removeAllListeners()
				@userid = null
				@waiting = false
				@calling = false
				@talking = false
