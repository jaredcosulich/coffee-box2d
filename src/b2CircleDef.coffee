###
var b2CircleDef = Class.create();
Object.extend(b2CircleDef.prototype, b2ShapeDef.prototype);
Object.extend(b2CircleDef.prototype, 
{
	initialize: function()
	{
		// The constructor for b2ShapeDef
		this.type = b2Shape.e_unknownShape;
		this.userData = null;
		this.localPosition = new b2Vec2(0.0, 0.0);
		this.localRotation = 0.0;
		this.friction = 0.2;
		this.restitution = 0.0;
		this.density = 0.0;
		this.categoryBits = 0x0001;
		this.maskBits = 0xFFFF;
		this.groupIndex = 0;	
		//

		this.type = b2Shape.e_circleShape;
		this.radius = 1.0;
	},

	radius: null});

