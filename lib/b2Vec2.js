var b2Vec2;
exports.b2Vec2 = b2Vec2 = b2Vec2 = (function() {
  function b2Vec2() {}
  b2Vec2.prototype.x = null;
  b2Vec2.prototype.y = null;
  b2Vec2.prototype.initialize = function(x_, y_) {
    this.x = x_;
    return this.y = y_;
  };
  b2Vec2.prototype.SetZero = function() {
    this.x = 0.0;
    return this.y = 0.0;
  };
  return b2Vec2;
})();