//global values
var g_width = 960
var g_height = 540
// game frames per second
var g_fps = 1000/50; //50 fps

var SCENES = {
	// create JS objects, must have a run() and setup() functions implemented that will be called from the main game loop
	// setup must initialize the scene
	// run will be the scenes main logic loop
	// each scene must also have a scene_ready bool (true=setup, false=not yet setup)
	DEFAULT_SCENE: default_scene
};

//game states
var GAME_STATE = {
	// GAME_STATE holds game values that must persist throughout the session
	// such as the current and previous scene. Add stuff here that you must keep track of
	// between scenes e.g. total wins, losses, score, etc.
	PREVIOUS_SCENE : null,
	ACTIVE_SCENE : null,
	reset : function() {
		// reset the values of GAME_STATE
	}, 
	change_scene : function( next_scene ) {
		// go to the next scene and move the current_scene to the previous scene
		var swap = function (x){return x};
		this.PREVIOUS_SCENE = swap(this.ACTIVE_SCENE, this.ACTIVE_SCENE = next_scene);
	}
}

var KEYCODES = {
	// Give ASCII values a useful name that can be referenced anywhere
}

// keep track of the mouse position
var mousePos = {
	x : width / 2,
	y : height / 2
};

var GAME_SETTINGS = {
	// add boolean game setting here e.g. IsPaused
}