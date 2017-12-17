// Canvas width, height
var width = 960;
var height = 540;

function block( width, height, color, x, y, health = 1, type = "color" ) {
	// Recieves: block width, height, color (hex, img), x & y position (top left point)
	// health (for collisions), and type (color=color, image=image)
	// Update spdX and spdY for movement
	this.width = width;
	this.height = height;
	this.spdX = 0;
	this.spdY = 0;
	this.x = x;
	this.y = y;
	this.health = health;
	this.center = {
		x : this.x + (this.width / 2),
		y : this.y + ( this.height / 2 )
	};
	if ( type == "image" ) {
		this.image = new Image();
		this.image.src = color;
	}

	//edges
	this.top_edge = this.y;
	this.bottom_edge = this.top_edge + this.height;
	this.left_edge = this.x;
	this.right_edge = this.left_edge + this.width;

	this.update = function() {
		this.top_edge = this.y;
		this.bottom_edge = this.top_edge + this.height;
		this.left_edge = this.x;
		this.right_edge = this.left_edge + this.width;

		ctx = myGameArea.context;
		if ( type == "color" ) {
			ctx.fillStyle = color;
			ctx.fillRect( this.x, this.y, this.width, this.height );
		}
		else if ( type == "image" ) {
			ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
		}
	}

	this.newPos = function() {
		this.x += this.spdX;
		this.y += this.spdY;
	}

	this.collision = function( bouncingRect ) {
		var centerRect = this;
		var hit = {
			left_right : false,
			top_bottom : false
		};

		if ( !bouncingRect.free ) {
			return null;
		}

		var coll = RectangleRectangleCollision( bouncingRect, centerRect );

		if ( coll !== null ) {
			//play the sound
			this.sound.play();
		}

		return coll;
	}
}

function sound( src ) {
	//https://www.w3schools.com/graphics/game_sound.asp
	this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild( this.sound );
    this.play = function(){
    	if ( GAME_SETTINGS.sound.on ) {
	        this.sound.play();
	    }
    }
    this.stop = function(){
        this.sound.pause();
    }
}

//BUTTON PARAMETERS:
//type = "image"
//v1 = default image
//v2 = cursor-hover image
//
//type = "text"
//v1 = text value
//v2 = font size
function button( x1, x2, y1, y2, type = "image", v1 = "", v2 = "", callback = function(){ alert("CLICKED"); }, ff = "arial", c1 = "#000", c2 = null ) {
	this.x = x1;
	this.y = y1;
	this.width = 0;
	this.height = 0;
	// width, height, color, x, y, health = 1, type = "color"
	this.bb = new block(this.width, this.height, "rgba(255, 0, 0, 0)", this.x, this.y, 1, "color");

	if ( type === "image" ) {
		this.v1 = new Image();
		this.v2 = new Image();
	} else if ( type === "text" ) {
		this.v1 = v1;
		this.v2 = parseInt(v2);
	}
	this.effects = {
		hover_x : x2,
		hover_y : y2,
		hover_width : 0,
		hover_height : 0
	}
	this.text_vals = {
		color1 : c1,
		color2 : ( (c2 == null) ? c1 : c2 ),
		font_face : ff,
		font_width_measured : false,	//use this to measure the text width after all it's display values have been set
		text_baseline : "middle",	//https://stackoverflow.com/questions/14289331/html5-canvas-doesnt-fill-text-at-coordinates-0-0
		text_align : "center",
		position : {
			x : x1,
			y : y1
		}
	};

	this.text_vals.color2 = ( (c2 == null) ? c1 : c2 );

	//alert("c1: " + this.text_vals.color1 + "\nc2: " + this.text_vals.color2 );

	this.type = type;
	this.hovering = false;
	this.action = callback;

	if ( type === "image" ) {

		this.v1.onload = function(e) {
			return function() {
				e.width = e.v1.width;
				e.height = e.v1.height;
			}
		}(this);
		this.v1.src = v1;

		this.v2.onload = function(e) {
			return function() {
				e.effects.hover_width = e.v2.width;
				e.effects.hover_height = e.v2.height;
			}
		}(this);
		this.v2.src = v2;
	}

	else if ( type === "text" ) {
		this.width = myGameArea.context.measureText(v1).width;
		this.height = parseInt(v2);
		this.bb.height = this.height;
		this.y -= (this.height/2);
		this.bb.y = this.y;
	}

	this.update = function() {
		ctx = myGameArea.context;

		//HOVERING
		if ( this.hovering ) 
		{
			document.body.style.cursor = "pointer";
			if ( this.type === "image" ) {
				ctx.drawImage(this.v2, this.effects.hover_x, this.effects.hover_y, this.effects.hover_width, this.effects.hover_height);
			}
			else if ( this.type === "text" ) {

				ctx.font = (this.v2 + (this.v2 * .1) ) + "px " + this.text_vals.font_face;
				ctx.textBaseline = this.text_vals.text_baseline; //https://stackoverflow.com/questions/14289331/html5-canvas-doesnt-fill-text-at-coordinates-0-0
				myGameArea.context.textAlign = this.text_vals.text_align;
				var gradient = ctx.createLinearGradient(this.text_vals.position.x, this.y,  this.text_vals.position.x, this.y + this.height);
				gradient.addColorStop( "0", this.text_vals.color1 );
				gradient.addColorStop( "0.75", this.text_vals.color2 );
				myGameArea.context.fillStyle = gradient;
				ctx.fillText( v1, this.text_vals.position.x, this.text_vals.position.y );

				this.bb.update();
			}
		} 

		//DEFAULT
		else 
		{
			document.body.style.cursor = "";
			if ( this.type === "image" ) {
				ctx.drawImage(this.v1, this.x, this.y, this.width, this.height);
			}
			else if ( this.type === "text" ) {
				ctx.font = this.v2 + "px " + this.text_vals.font_face;
				ctx.textBaseline = this.text_vals.text_baseline; //https://stackoverflow.com/questions/14289331/html5-canvas-doesnt-fill-text-at-coordinates-0-0
				ctx.textAlign = this.text_vals.text_align;
				//ctx.fillStyle = this.text_vals.color1;
				var gradient = ctx.createLinearGradient( this.text_vals.position.x, this.y,  this.text_vals.position.x, this.y + this.height);
				gradient.addColorStop( "0", this.text_vals.color1 );
				gradient.addColorStop( "0.75", this.text_vals.color2 );
				ctx.fillStyle = gradient;
				ctx.fillText( v1, this.text_vals.position.x, this.text_vals.position.y );

				// ctx.beginPath();
				// ctx.moveTo(this.text_vals.position.x, this.y);
				// ctx.lineTo(this.text_vals.position.x,this.y + this.height);
				// ctx.stroke();

				this.bb.update();
			}
		}

		if ( this.type === "text" && this.text_vals.font_width_measured == false ) {
			this.width = myGameArea.context.measureText(v1).width;
			this.text_vals.font_width_measured = true;
			this.bb.width = this.width;
			this.x = this.x - (this.width / 2);
			this.bb.x = this.x;
		}
	}
}

function menu() {
	this.buttons = [];
	this.add = function( x1, x2, y1, y2, type, image, image_hover, callback, ff, color1, color2 ) {
		this.buttons.push( new button( x1, x2, y1, y2, type, image, image_hover, callback, ff, color1, color2 ) );
	}

	this.update = function() {
		for ( var i = 0; i < this.buttons.length; ++i ) {
			this.buttons[i].update();
		}
	}

	this.hovering = function( x, y ) {
		for ( var i = 0; i < this.buttons.length; ++i ) {
			if (x < this.buttons[i].x + this.buttons[i].width && x > this.buttons[i].x && y < this.buttons[i].y + this.buttons[i].height && y > this.buttons[i].y )  {
				//hovering
				this.buttons[i].hovering = true;
			} else {
				this.buttons[i].hovering = false;
			}
		}
	}

	this.click = function( x, y ) {
		for ( var i = 0; i < this.buttons.length; ++i ) {
			if (x < this.buttons[i].x + this.buttons[i].width && x > this.buttons[i].x && y < this.buttons[i].y + this.buttons[i].height && y > this.buttons[i].y )  {
				this.buttons[i].action();
				return true;
			}
		}

		return false;
	}
}