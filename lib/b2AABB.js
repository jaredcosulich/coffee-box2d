var b2AABB;
exports.b2AABB = b2AABB = b2AABB = (function() {
  b2AABB.prototype.minVertex = new b2Vec2();
  b2AABB.prototype.maxVertex = new b2Vec2();
  function b2AABB() {
    this.minVertex = new b2Vec2();
    this.maxVertex = new b2Vec2();
  }
  b2AABB.prototype.IsValid = function() {
    var dX, dY, valid;
    dX = this.maxVertex.x;
    dY = this.maxVertex.y;
    dX = this.maxVertex.x;
    dY = this.maxVertex.y;
    dX -= this.minVertex.x;
    dY -= this.minVertex.y;
    valid = dX >= 0.0 && dY >= 0.0;
    valid = valid && this.minVertex.IsValid() && this.maxVertex.IsValid();
    return valid;
  };
  return b2AABB;
})();