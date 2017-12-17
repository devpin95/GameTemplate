// Add functions to calculate generic global values e.g. track mouse position, click position, generic button down actions, etc.

//http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
//tracking the mouse coordinates
//------------------------------------------------------------------------------------------------------------

function getMousePos(canvas, e) {
    var rect = document.getElementById("game").getBoundingClientRect();
    return {
    	x: e.clientX - rect.left,
    	y: e.clientY - rect.top
	};
}

document.getElementById("game").addEventListener('mousemove', function(e) {
	mousePos = getMousePos(document.getElementById("game"), e);
    //myPaddle.newPos( mousePos.x, mousePos.y );
}, false);

//------------------------------------------------------------------------------------------------------------
