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
var b2DistanceJointDef;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
exports.b2DistanceJointDef = b2DistanceJointDef = b2DistanceJointDef = (function() {
  __extends(b2DistanceJointDef, b2JointDef);
  b2DistanceJointDef.prototype.anchorPoint1 = new b2Vec2();
  b2DistanceJointDef.prototype.anchorPoint2 = new b2Vec2();
  function b2DistanceJointDef() {
    this.type = b2Joint.e_unknownJoint;
    this.userData = null;
    this.body1 = null;
    this.body2 = null;
    this.collideConnected = false;
    this.anchorPoint1 = new b2Vec2();
    this.anchorPoint2 = new b2Vec2();
    this.type = b2Joint.e_distanceJoint;
  }
  return b2DistanceJointDef;
})();