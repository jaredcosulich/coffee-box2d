/*
Copyright (c) 2006-2007 Erin Catto http:

This software is provided 'as-is', without any express or implied
warranty.  In no event will the authors be held liable for any damages
arising from the use of this software.
Permission is granted to anyone to use this software for any purpose,
including commercial applications, and to alter it and redistribute it
freely, subject to the following restrictions:
1. The origin of this software must not be misrepresented you must not
claim that you wrote the original software. If you use this software
in a product, an acknowledgment in the product documentation would be
appreciated but is not required.
2. Altered source versions must be plainly marked, and must not be
misrepresented the original software.
3. This notice may not be removed or altered from any source distribution.
*/
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
  b2Mat22.prototype.SetVV = function(c1, c2) {
    this.col1.SetV(c1);
    return this.col2.SetV(c2);
  };
  b2Mat22.prototype.Copy = function() {
    return new b2Mat22(0, this.col1, this.col2);
  };
  b2Mat22.prototype.SetM = function(m) {
    this.col1.SetV(m.col1);
    return this.col2.SetV(m.col2);
  };
  b2Mat22.prototype.AddM = function(m) {
    this.col1.x += m.col1.x;
    this.col1.y += m.col1.y;
    this.col2.x += m.col2.x;
    return this.col2.y += m.col2.y;
  };
  b2Mat22.prototype.SetIdentity = function() {
    this.col1.x = 1.0;
    this.col2.x = 0.0;
    this.col1.y = 0.0;
    return this.col2.y = 1.0;
  };
  b2Mat22.prototype.SetZero = function() {
    this.col1.x = 0.0;
    this.col2.x = 0.0;
    this.col1.y = 0.0;
    return this.col2.y = 0.0;
  };
  b2Mat22.prototype.Invert = function(out) {
    var a, b, c, d, det;
    a = this.col1.x;
    b = this.col2.x;
    c = this.col1.y;
    d = this.col2.y;
    det = a * d - b * c;
    det = 1.0 / det;
    out.col1.x = det * d;
    out.col2.x = -det * b;
    out.col1.y = -det * c;
    out.col2.y = det * a;
    return out;
  };
  b2Mat22.prototype.Solve = function(out, bX, bY) {
    var a11, a12, a21, a22, det;
    a11 = this.col1.x;
    a12 = this.col2.x;
    a21 = this.col1.y;
    a22 = this.col2.y;
    det = a11 * a22 - a12 * a21;
    det = 1.0 / det;
    out.x = det * (a22 * bX - a12 * bY);
    out.y = det * (a11 * bY - a21 * bX);
    return out;
  };
  b2Mat22.prototype.Abs = function() {
    this.col1.Abs();
    return this.col2.Abs();
  };
  b2Mat22.prototype.col1 = new b2Vec2();
  b2Mat22.prototype.col2 = new b2Vec2();
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