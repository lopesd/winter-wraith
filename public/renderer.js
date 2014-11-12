function Renderer (params) {
    this.canvas = params.canvas
    this.ctx = this.canvas.getContext('2d')

    var renderer = this
    var canvas = this.canvas
    this.draw = function (data) {
        // clear
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

        // draw
        data.units.forEach(function (unit) {
            unit.draw(renderer.ctx)
        })
    }
}
