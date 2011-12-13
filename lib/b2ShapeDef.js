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
var b2ShapeDef;
exports.b2ShapeDef = b2ShapeDef = b2ShapeDef = (function() {
  b2ShapeDef.prototype.type = 0;
  b2ShapeDef.prototype.userData = null;
  b2ShapeDef.prototype.localPosition = null;
  b2ShapeDef.prototype.localRotation = null;
  b2ShapeDef.prototype.friction = null;
  b2ShapeDef.prototype.restitution = null;
  b2ShapeDef.prototype.density = null;
  function b2ShapeDef() {
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
  }
  b2ShapeDef.prototype.ComputeMass = function(massData) {
    var box, circle, poly;
    massData.center = new b2Vec2(0.0, 0.0);
    if (this.density === 0.0) {
      massData.mass = 0.0;
      massData.center.Set(0.0, 0.0);
      massData.I = 0.0;
    }
    switch (this.type) {
      case b2Shape.e_circleShape:
        circle = this;
        massData.mass = this.density * b2Settings.b2_pi * circle.radius * circle.radius;
        massData.center.Set(0.0, 0.0);
        return massData.I = 0.5 * massData.mass * circle.radius * circle.radius;
      case b2Shape.e_boxShape:
        box = this;
        massData.mass = 4.0 * this.density * box.extents.x * box.extents.y;
        massData.center.Set(0.0, 0.0);
        return massData.I = massData.mass / 3.0 * b2Math.b2Dot(box.extents, box.extents);
      case b2Shape.e_polyShape:
        poly = this;
        return b2Shape.PolyMass(massData, poly.vertices, poly.vertexCount, this.density);
      default:
        massData.mass = 0.0;
        massData.center.Set(0.0, 0.0);
        return massData.I = 0.0;
    }
  };
  b2ShapeDef.prototype.categoryBits = 0;
  b2ShapeDef.prototype.maskBits = 0;
  b2ShapeDef.prototype.groupIndex = 0;
  return b2ShapeDef;
})();