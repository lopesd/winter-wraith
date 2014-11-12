var WebSocket = require("ws")
var node_static = require("node-static")
var http = require("http")

all_clients = []
lonely_clients = []
all_sessions = []

/** Client class **/
function Client (socket) {
    var that = this
    this.socket = socket
    this.partner = null
    this.session = null

    this.socket.on('message', function(message) {
        console.log("received message from client: " + JSON.stringify(message))
    }) 

    this.socket.on('close', function() {
        console.log("closing socket.")
    })

    return this
}

/** Session class **/
function Session (client_a, client_b) {
    var session = this
    this.clients = [client_a, client_b]
    client_a.session = this
    client_b.session = this
    client_a.partner = client_b
    client_b.partner = client_a

    this.gameState = {
        units: [
            {x: 100, y: 100, size: 10, color: 'blue'},
            {x: 200, y: 300, size: 15, color: 'red'}
        ]
    }

    function notifyGameChange () {
        session.clients.forEach(function (client) {
            client.socket.send(JSON.stringify(session.gameState))
        })        
    }
    notifyGameChange()

    client_a.socket.on('message', function (actionData) {
        console.log("received action data from client: " + actionData)
        actionData = JSON.parse(actionData)
        if (actionData.action == 'mouseupleft') {
            session.gameState.units[0].x = actionData.loc.x
            session.gameState.units[0].y = actionData.loc.y
            notifyGameChange()
        }
    })

    client_b.socket.on('message', function (actionData) {
        console.log("received action data from client: " + actionData)
        actionData = JSON.parse(actionData)
        if (actionData.action == 'mouseupleft') {
            session.gameState.units[1].x = actionData.loc.x
            session.gameState.units[1].y = actionData.loc.y
            notifyGameChange()
        }
    })

    return this
}

function pair_lonely_clients () {
    while (lonely_clients.length >= 2) {
        all_sessions.push(new Session(lonely_clients[0], lonely_clients[1]))
        lonely_clients.shift()
        lonely_clients.shift()
    }
    
    if (lonely_clients.length == 0) {
        return true
    } else {
        return false
    }
}

/** Game server **/
var server = new WebSocket.Server({port: 8080})
server.on('connection', function(socket) {
    console.log("Connecting to new client.")
    var new_client = new Client(socket)
    all_clients.push(new_client)
    lonely_clients.push(new_client)

    pair_lonely_clients()
}) 


/** Static server **/
var static_server = new node_static.Server('.')
http.createServer(function (request, response) {
    request.addListener('end', function () {
        static_server.serve(request, response)
    }).resume()
}).listen(8081)

console.log("Server listening on port 8080")
