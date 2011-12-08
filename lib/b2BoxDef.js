var b2BoxDef;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
exports.b2BoxDef = b2BoxDef = b2BoxDef = (function() {
  __extends(b2BoxDef, b2ShapeDef);
  b2BoxDef.prototype.extents = null;
  function b2BoxDef() {
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
    this.type = b2Shape.e_boxShape;
    this.extents = new b2Vec2(1.0, 1.0);
  }
  return b2BoxDef;
})();