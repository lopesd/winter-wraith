/**
 * game_server.js
 * 
 * Usage example:
 * var server = new GameServer()
 * server.registerListener('gamechange', function (change) {})
 *
 * Events that support listening:
 *   gamechange
 *   connectionclosed
 *
 * TODO: functionality for removing and muting listeners, if it becomes necessary
 * TODO: abstract the registerListener functionality to a base class
 */

function GameServer () {
    var gameServer = this
    var ws = new WebSocket("ws://192.168.1.137:8080")
    
    ws.onmessage = function(e) { 
        var data = JSON.parse(e.data)
        gameServer._callListeners('gamechange', data)
    }

    ws.onclose = function() { 
        gameServer._callListeners('connectionclosed')
    }

    this._listeners = {}
    this._callListeners = function (eventName, eventData) {
        if (gameServer._listeners[eventName] !== undefined) {
            gameServer._listeners[eventName].forEach(function (listener) {
                listener(eventData)
            })
        }
    }

    this.registerListener = function (eventName, listener) {
        if (gameServer._listeners[eventName] === undefined) {
            gameServer._listeners[eventName] = []
        }
        gameServer._listeners[eventName].push(listener)
    }

    this.send = function (data) {
        ws.send(data)
    }

}
