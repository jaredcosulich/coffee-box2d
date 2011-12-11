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
var b2ContactConstraintPoint;
exports.b2ContactConstraintPoint = b2ContactConstraintPoint = b2ContactConstraintPoint = (function() {
  b2ContactConstraintPoint.prototype.localAnchor1 = new b2Vec2();
  b2ContactConstraintPoint.prototype.localAnchor2 = new b2Vec2();
  b2ContactConstraintPoint.prototype.normalImpulse = null;
  b2ContactConstraintPoint.prototype.tangentImpulse = null;
  b2ContactConstraintPoint.prototype.positionImpulse = null;
  b2ContactConstraintPoint.prototype.normalMass = null;
  b2ContactConstraintPoint.prototype.tangentMass = null;
  b2ContactConstraintPoint.prototype.separation = null;
  b2ContactConstraintPoint.prototype.velocityBias = null;
  function b2ContactConstraintPoint() {
    this.localAnchor1 = new b2Vec2();
    this.localAnchor2 = new b2Vec2();
  }
  return b2ContactConstraintPoint;
})();