/**
 * Usage example:
 * var catcher = new InputCatcher({canvas})
 * catcher.registerListener('mousedownleft', function (coords) {})
 *
 * Events that support listening:
 * mouse[down|up][left|middle|right]
 * mousemove
 *
 * TODO: functionality for removing and muting listeners, if it becomes necessary
 *
 */

function InputCatcher (params) {
    this.canvas = params.canvas
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.ctx = this.canvas.getContext('2d')

    // https://github.com/simonsarris/Canvas-tutorials/blob/master/shapes.js
    // Aids in finding the mouse position consistently relative to the canvas
    var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
    if (document.defaultView && document.defaultView.getComputedStyle) {
        this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['paddingLeft'], 10)      || 0;
        this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['paddingTop'], 10)       || 0;
        this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['borderLeftWidth'], 10)  || 0;
        this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['borderTopWidth'], 10)   || 0;
    }
    var html = document.body.parentNode;
    this.htmlTop = html.offsetTop;
    this.htmlLeft = html.offsetLeft;        

    // disable text selection
    this.canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
    // override right click
    this.canvas.oncontextmenu = function (e) {e.preventDefault();};

    var catcher = this

    this._listeners = {}

    this._callListeners = function (mouseAction, e, ignoreButton) {
        ignoreButton = ignoreButton || false
        var mouse = catcher.getMousePosition(e)
        var eventString = mouseAction 
        if (!ignoreButton) {
            var buttonString = e.button == 0? 'left' : e.button == 1? 'middle' : 'left'
            eventString = eventString + buttonString
        }
        if (catcher._listeners[eventString] !== undefined) {
            catcher._listeners[eventString].forEach(function (listener) {
                listener(mouse)
            })
        }
    }

    this.canvas.addEventListener('mousedown', function(e) {
        catcher._callListeners('mousedown', e)
    }, true);

    this.canvas.addEventListener('mousemove', function(e) {    
        catcher._callListeners('mousemove', e, true)
    }, true);

    this.canvas.addEventListener('mouseup', function(e) {
        catcher._callListeners('mouseup', e)
    }, true);

    this.registerListener = function (eventName, listener) {
        if (catcher._listeners[eventName] === undefined) {
            catcher._listeners[eventName] = []
        }
        catcher._listeners[eventName].push(listener)
    }
}

InputCatcher.prototype.getMousePosition = function(e) {
    var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
    
    // TODO : I bet we can safely pre-compute this
    if (element.offsetParent !== undefined) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
    }

    offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
    offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;
    
    return {x: mx, y: my};
}
