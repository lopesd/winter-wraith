// UNIT CLASS ---------------------------------
function Unit (params) {
    this.x = params.x || 100
    this.y = params.y || 100
    this.size = params.size || 20
    this.color = params.color || 'red'
}

Unit.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size)
}

function GameLogic () {
    var gameLogic = this
    this.units = []

    this.handleChange = function (change) {
        gameLogic.units = []
        change.units.forEach(function (unit) {
            console.log("creating unit: " + JSON.stringify(unit))
            gameLogic.units.push(new Unit(unit))
        })
    }
}
