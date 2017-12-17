var default_scene = {
	setup : function( ) {
		this.scene_ready = true;
	},

	scene_ready : false,

	run : function( ) {

	},

	clicked : function() {
		// click position will be relative to the canvas and will still be called when the mouse has moved outside the bounds of the canvas
		alert("_default_scene MOUSE CLICKED x:" + mousePos.x + " y: " + mousePos.y );
	},

	button_press : function( e ) {

		alert("_default_scene BUTTON PRESSED " + e.keyCode);
	}
}