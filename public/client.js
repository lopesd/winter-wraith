$(document).ready(function () {
    var gameServer = new GameServer()
    var gameLogic = new GameLogic()

    // HANDLE MESSAGES FROM THE SERVER
    gameServer.registerListener('gamechange', function (change) {
        console.log("game change received: " + JSON.stringify(change))
        gameLogic.handleChange(change)
    })


    // SEND MOUSE INPUT TO SERVER
    var catcher = new InputCatcher({canvas: document.getElementById("main_canvas")})
    catcher.registerListener("mouseupleft", function (m) {
        console.log(JSON.stringify(m))
        var actionData = {
            action: 'mouseupleft',
            loc: m,
        }
        gameServer.send(JSON.stringify(actionData))
    })
    
    catcher.registerListener("mouseupright", function (m) {
        console.log(JSON.stringify(m))
        var actionData = {
            action: 'mouseupright',
            loc: m,
        }
        gameServer.send(JSON.stringify(actionData))
    })

    // START DRAWING LOOP
    var renderer = new Renderer({canvas: document.getElementById("main_canvas")})
    var interval = 30;
    setInterval(function () {
        renderer.draw(gameLogic)
    }, interval); // TODO: only draw if there is a need to?
});
