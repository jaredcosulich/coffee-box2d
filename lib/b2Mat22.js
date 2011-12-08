var b2Mat22;
exports.b2Mat22 = b2Mat22 = b2Mat22 = (function() {
  function b2Mat22(angle, c1, c2) {
    var c, s;
    if (angle == null) {
      angle = 0;
    }
    this.col1 = new b2Vec2();
    this.col2 = new b2Vec2();
    if ((c1 != null) && (c2 != null)) {
      this.col1.SetV(c1);
      this.col2.SetV(c2);
    } else {
      c = Math.cos(angle);
      s = Math.sin(angle);
      this.col1.x = c;
      this.col2.x = -s;
      this.col1.y = s;
      this.col2.y = c;
    }
  }
  b2Mat22.prototype.Set = function(angle) {
    var c, s;
    c = Math.cos(angle);
    s = Math.sin(angle);
    this.col1.x = c;
    this.col2.x = -s;
    this.col1.y = s;
    return this.col2.y = c;
  };
  return b2Mat22;
})();
/*
var b2Mat22 = Class.create()
b2Mat22.prototype = 
{
	initialize: function(angle, c1, c2)
	{
		if (angle==null) angle = 0
		// initialize instance variables for references
		@col1 = new b2Vec2()
		@col2 = new b2Vec2()
		//

		if (c1!=null && c2!=null){
			@col1.SetV(c1)
			@col2.SetV(c2)
		}
		else{
			var c = Math.cos(angle)
			var s = Math.sin(angle)
			@col1.x = c @col2.x = -s
			@col1.y = s @col2.y = c
		}
	},

	Set: function(angle)
	{
		var c = Math.cos(angle)
		var s = Math.sin(angle)
		@col1.x = c @col2.x = -s
		@col1.y = s @col2.y = c
	},

	SetVV: function(c1, c2)
	{
		@col1.SetV(c1)
		@col2.SetV(c2)
	},

	Copy: function(){
		return new b2Mat22(0, @col1, @col2)
	},

	SetM: function(m)
	{
		@col1.SetV(m.col1)
		@col2.SetV(m.col2)
	},

	AddM: function(m)
	{
		@col1.x += m.col1.x
		@col1.y += m.col1.y
		@col2.x += m.col2.x
		@col2.y += m.col2.y
	},

	SetIdentity: function()
	{
		@col1.x = 1.0 @col2.x = 0.0
		@col1.y = 0.0 @col2.y = 1.0
	},

	SetZero: function()
	{
		@col1.x = 0.0 @col2.x = 0.0
		@col1.y = 0.0 @col2.y = 0.0
	},

	Invert: function(out)
	{
		var a = @col1.x
		var b = @col2.x
		var c = @col1.y
		var d = @col2.y
		//var B = new b2Mat22()
		var det = a * d - b * c
		//b2Settings.b2Assert(det != 0.0)
		det = 1.0 / det
		out.col1.x =  det * d	out.col2.x = -det * b
		out.col1.y = -det * c	out.col2.y =  det * a
		return out
	},

	// @Solve A * x = b
	Solve: function(out, bX, bY)
	{
		//float32 a11 = @col1.x, a12 = @col2.x, a21 = @col1.y, a22 = @col2.y
		var a11 = @col1.x
		var a12 = @col2.x
		var a21 = @col1.y
		var a22 = @col2.y
		//float32 det = a11 * a22 - a12 * a21
		var det = a11 * a22 - a12 * a21
		//b2Settings.b2Assert(det != 0.0)
		det = 1.0 / det
		out.x = det * (a22 * bX - a12 * bY)
		out.y = det * (a11 * bY - a21 * bX)

		return out
	},

	Abs: function()
	{
		@col1.Abs()
		@col2.Abs()
	},

	col1: new b2Vec2(),
	col2: new b2Vec2()}*/