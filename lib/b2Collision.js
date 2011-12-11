var b2Collision;
exports.b2Collision = b2Collision = b2Collision = (function() {
  function b2Collision() {}
  return b2Collision;
})();
b2Collision.b2_nullFeature = 0x000000ff;
b2Collision.ClipSegmentToLine = function(vOut, vIn, normal, offset) {
  var distance0, distance1, interp, numOut, tVec, vIn0, vIn1;
  numOut = 0;
  vIn0 = vIn[0].v;
  vIn1 = vIn[1].v;
  distance0 = b2Math.b2Dot(normal, vIn[0].v) - offset;
  distance1 = b2Math.b2Dot(normal, vIn[1].v) - offset;
  if (distance0 <= 0.0) {
    vOut[numOut++] = vIn[0];
  }
  if (distance1 <= 0.0) {
    vOut[numOut++] = vIn[1];
  }
  if (distance0 * distance1 < 0.0) {
    interp = distance0 / (distance0 - distance1);
    tVec = vOut[numOut].v;
    tVec.x = vIn0.x + interp * (vIn1.x - vIn0.x);
    tVec.y = vIn0.y + interp * (vIn1.y - vIn0.y);
    if (distance0 > 0.0) {
      vOut[numOut].id = vIn[0].id;
    } else {
      vOut[numOut].id = vIn[1].id;
    }
    ++numOut;
  }
  return numOut;
};
b2Collision.b2CollidePolyTempVec = new b2Vec2();