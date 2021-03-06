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
var b2MouseJointDef;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
exports.b2MouseJointDef = b2MouseJointDef = b2MouseJointDef = (function() {
  __extends(b2MouseJointDef, b2JointDef);
  b2MouseJointDef.prototype.target = new b2Vec2();
  b2MouseJointDef.prototype.maxForce = null;
  b2MouseJointDef.prototype.frequencyHz = null;
  b2MouseJointDef.prototype.dampingRatio = null;
  b2MouseJointDef.prototype.timeStep = null;
  function b2MouseJointDef() {
    this.type = b2Joint.e_unknownJoint;
    this.userData = null;
    this.body1 = null;
    this.body2 = null;
    this.collideConnected = false;
    this.target = new b2Vec2();
    this.type = b2Joint.e_mouseJoint;
    this.maxForce = 0.0;
    this.frequencyHz = 5.0;
    this.dampingRatio = 0.7;
    this.timeStep = 1.0 / 60.0;
  }
  return b2MouseJointDef;
})();