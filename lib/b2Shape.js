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
var b2Shape;
exports.b2Shape = b2Shape = b2Shape = (function() {
  function b2Shape(def, body) {
    this.m_R = new b2Mat22();
    this.m_position = new b2Vec2();
    this.m_userData = def.userData;
    this.m_friction = def.friction;
    this.m_restitution = def.restitution;
    this.m_body = body;
    this.m_proxyId = b2Pair.b2_nullProxy;
    this.m_maxRadius = 0.0;
    this.m_categoryBits = def.categoryBits;
    this.m_maskBits = def.maskBits;
    this.m_groupIndex = def.groupIndex;
  }
  b2Shape.prototype.TestPoint = function(p) {
    return false;
  };
  b2Shape.prototype.GetUserData = function() {
    return this.m_userData;
  };
  b2Shape.prototype.GetType = function() {
    return this.m_type;
  };
  b2Shape.prototype.GetBody = function() {
    return this.m_body;
  };
  b2Shape.prototype.GetPosition = function() {
    return this.m_position;
  };
  b2Shape.prototype.GetRotationMatrix = function() {
    return this.m_R;
  };
  b2Shape.prototype.ResetProxy = function(broadPhase) {};
  b2Shape.prototype.GetNext = function() {
    return this.m_next;
  };
  return b2Shape;
})();
b2Shape.Create = function(def, body, center) {
  switch (def.type) {
    case b2Shape.e_circleShape:
      return new b2CircleShape(def, body, center);
    case b2Shape.e_boxShape:
    case b2Shape.e_polyShape:
      return new b2PolyShape(def, body, center);
    default:
      return null;
  }
};
b2Shape.e_unknownShape = -1;
b2Shape.e_circleShape = 0;
b2Shape.e_boxShape = 1;
b2Shape.e_polyShape = 2;
b2Shape.e_meshShape = 3;
b2Shape.e_shapeTypeCount = 4;