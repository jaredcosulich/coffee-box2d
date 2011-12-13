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
b2Collision.EdgeSeparation = function(poly1, edge1, poly2) {
  var count2, dot, i, minDot, normalLocal2X, normalLocal2Y, normalX, normalY, separation, tMat, tVec, tX, v1X, v1Y, v2X, v2Y, vert1s, vert2s, vertexIndex2;
  vert1s = poly1.m_vertices;
  count2 = poly2.m_vertexCount;
  vert2s = poly2.m_vertices;
  normalX = poly1.m_normals[edge1].x;
  normalY = poly1.m_normals[edge1].y;
  tX = normalX;
  tMat = poly1.m_R;
  normalX = tMat.col1.x * tX + tMat.col2.x * normalY;
  normalY = tMat.col1.y * tX + tMat.col2.y * normalY;
  normalLocal2X = normalX;
  normalLocal2Y = normalY;
  tMat = poly2.m_R;
  tX = normalLocal2X * tMat.col1.x + normalLocal2Y * tMat.col1.y;
  normalLocal2Y = normalLocal2X * tMat.col2.x + normalLocal2Y * tMat.col2.y;
  normalLocal2X = tX;
  vertexIndex2 = 0;
  minDot = Number.MAX_VALUE;
  for (i = 0; 0 <= count2 ? i < count2 : i > count2; 0 <= count2 ? i++ : i--) {
    tVec = vert2s[i];
    dot = tVec.x * normalLocal2X + tVec.y * normalLocal2Y;
    if (dot < minDot) {
      minDot = dot;
      vertexIndex2 = i;
    }
  }
  tMat = poly1.m_R;
  v1X = poly1.m_position.x + (tMat.col1.x * vert1s[edge1].x + tMat.col2.x * vert1s[edge1].y);
  v1Y = poly1.m_position.y + (tMat.col1.y * vert1s[edge1].x + tMat.col2.y * vert1s[edge1].y);
  tMat = poly2.m_R;
  v2X = poly2.m_position.x + (tMat.col1.x * vert2s[vertexIndex2].x + tMat.col2.x * vert2s[vertexIndex2].y);
  v2Y = poly2.m_position.y + (tMat.col1.y * vert2s[vertexIndex2].x + tMat.col2.y * vert2s[vertexIndex2].y);
  v2X -= v1X;
  v2Y -= v1Y;
  separation = v2X * normalX + v2Y * normalY;
  return separation;
};
b2Collision.FindMaxSeparation = function(edgeIndex, poly1, poly2, conservative) {
  var bestEdge, bestSeparation, count1, dLocal1X, dLocal1Y, dX, dY, dot, edge, i, increment, maxDot, nextEdge, prevEdge, s, sNext, sPrev;
  count1 = poly1.m_vertexCount;
  dX = poly2.m_position.x - poly1.m_position.x;
  dY = poly2.m_position.y - poly1.m_position.y;
  dLocal1X = dX * poly1.m_R.col1.x + dY * poly1.m_R.col1.y;
  dLocal1Y = dX * poly1.m_R.col2.x + dY * poly1.m_R.col2.y;
  edge = 0;
  maxDot = -Number.MAX_VALUE;
  for (i = 0; 0 <= count1 ? i < count1 : i > count1; 0 <= count1 ? i++ : i--) {
    dot = poly1.m_normals[i].x * dLocal1X + poly1.m_normals[i].y * dLocal1Y;
    if (dot > maxDot) {
      maxDot = dot;
      edge = i;
    }
  }
  s = b2Collision.EdgeSeparation(poly1, edge, poly2);
  if (s > 0.0 && conservative === false) {
    return s;
  }
  prevEdge = edge - 1 >= 0 ? edge - 1 : count1 - 1;
  sPrev = b2Collision.EdgeSeparation(poly1, prevEdge, poly2);
  if (sPrev > 0.0 && conservative === false) {
    return sPrev;
  }
  nextEdge = edge + 1 < count1 ? edge + 1 : 0;
  sNext = b2Collision.EdgeSeparation(poly1, nextEdge, poly2);
  if (sNext > 0.0 && conservative === false) {
    return sNext;
  }
  bestEdge = 0;
  increment = 0;
  if (sPrev > s && sPrev > sNext) {
    increment = -1;
    bestEdge = prevEdge;
    bestSeparation = sPrev;
  } else if (sNext > s) {
    increment = 1;
    bestEdge = nextEdge;
    bestSeparation = sNext;
  } else {
    edgeIndex[0] = edge;
    return s;
  }
  while (true) {
    if (increment === -1) {
      edge = bestEdge - 1 >= 0 ? bestEdge - 1 : count1 - 1;
    } else {
      edge = bestEdge + 1 < count1 ? bestEdge + 1 : 0;
    }
    s = b2Collision.EdgeSeparation(poly1, edge, poly2);
    if (s > 0.0 && conservative === false) {
      return s;
    }
    if (s > bestSeparation) {
      bestEdge = edge;
      bestSeparation = s;
    } else {
      break;
    }
  }
  edgeIndex[0] = bestEdge;
  return bestSeparation;
};
b2Collision.FindIncidentEdge = function(c, poly1, edge1, poly2) {
  var count1, count2, dot, i, i1, i2, invLength, minDot, normal1Local1X, normal1Local1Y, normal1Local2X, normal1Local2Y, normal1X, normal1Y, normal2Local2X, normal2Local2Y, tClip, tMat, tVec, tX, vert1s, vert2s, vertex11, vertex12, vertex21, vertex22;
  count1 = poly1.m_vertexCount;
  vert1s = poly1.m_vertices;
  count2 = poly2.m_vertexCount;
  vert2s = poly2.m_vertices;
  vertex11 = edge1;
  vertex12 = edge1 + 1 === count1 ? 0 : edge1 + 1;
  tVec = vert1s[vertex12];
  normal1Local1X = tVec.x;
  normal1Local1Y = tVec.y;
  tVec = vert1s[vertex11];
  normal1Local1X -= tVec.x;
  normal1Local1Y -= tVec.y;
  tX = normal1Local1X;
  normal1Local1X = normal1Local1Y;
  normal1Local1Y = -tX;
  invLength = 1.0 / Math.sqrt(normal1Local1X * normal1Local1X + normal1Local1Y * normal1Local1Y);
  normal1Local1X *= invLength;
  normal1Local1Y *= invLength;
  normal1X = normal1Local1X;
  normal1Y = normal1Local1Y;
  tX = normal1X;
  tMat = poly1.m_R;
  normal1X = tMat.col1.x * tX + tMat.col2.x * normal1Y;
  normal1Y = tMat.col1.y * tX + tMat.col2.y * normal1Y;
  normal1Local2X = normal1X;
  normal1Local2Y = normal1Y;
  tMat = poly2.m_R;
  tX = normal1Local2X * tMat.col1.x + normal1Local2Y * tMat.col1.y;
  normal1Local2Y = normal1Local2X * tMat.col2.x + normal1Local2Y * tMat.col2.y;
  normal1Local2X = tX;
  vertex21 = 0;
  vertex22 = 0;
  minDot = Number.MAX_VALUE;
  for (i = 0; 0 <= count2 ? i < count2 : i > count2; 0 <= count2 ? i++ : i--) {
    i1 = i;
    i2 = i + 1 < count2 ? i + 1 : 0;
    tVec = vert2s[i2];
    normal2Local2X = tVec.x;
    normal2Local2Y = tVec.y;
    tVec = vert2s[i1];
    normal2Local2X -= tVec.x;
    normal2Local2Y -= tVec.y;
    tX = normal2Local2X;
    normal2Local2X = normal2Local2Y;
    normal2Local2Y = -tX;
    invLength = 1.0 / Math.sqrt(normal2Local2X * normal2Local2X + normal2Local2Y * normal2Local2Y);
    normal2Local2X *= invLength;
    normal2Local2Y *= invLength;
    dot = normal2Local2X * normal1Local2X + normal2Local2Y * normal1Local2Y;
    if (dot < minDot) {
      minDot = dot;
      vertex21 = i1;
      vertex22 = i2;
    }
  }
  tClip;
  tClip = c[0];
  tVec = tClip.v;
  tVec.SetV(vert2s[vertex21]);
  tVec.MulM(poly2.m_R);
  tVec.Add(poly2.m_position);
  tClip.id.features.referenceFace = edge1;
  tClip.id.features.incidentEdge = vertex21;
  tClip.id.features.incidentVertex = vertex21;
  tClip = c[1];
  tVec = tClip.v;
  tVec.SetV(vert2s[vertex22]);
  tVec.MulM(poly2.m_R);
  tVec.Add(poly2.m_position);
  tClip.id.features.referenceFace = edge1;
  tClip.id.features.incidentEdge = vertex21;
  return tClip.id.features.incidentVertex = vertex22;
};
b2Collision.b2CollidePolyTempVec = new b2Vec2();
b2Collision.b2CollidePoly = function(manifold, polyA, polyB, conservative) {
  var clipPoints1, clipPoints2, count1, cp, dvX, dvY, edge1, edgeA, edgeAOut, edgeB, edgeBOut, flip, frontNormalX, frontNormalY, frontOffset, i, incidentEdge, invLength, k_absoluteTol, k_relativeTol, np, pointCount, poly1, poly2, separation, separationA, separationB, sideNormalX, sideNormalY, sideOffset1, sideOffset2, tMat, tVec, tX, v11, v11X, v11Y, v12, v12X, v12Y, vert1s, _ref;
  manifold.pointCount = 0;
  edgeA = 0;
  edgeAOut = [edgeA];
  separationA = b2Collision.FindMaxSeparation(edgeAOut, polyA, polyB, conservative);
  edgeA = edgeAOut[0];
  if (separationA > 0.0 && conservative === false) {
    return;
  }
  edgeB = 0;
  edgeBOut = [edgeB];
  separationB = b2Collision.FindMaxSeparation(edgeBOut, polyB, polyA, conservative);
  edgeB = edgeBOut[0];
  if (separationB > 0.0 && conservative === false) {
    return;
  }
  edge1 = 0;
  flip = 0;
  k_relativeTol = 0.98;
  k_absoluteTol = 0.001;
  if (separationB > k_relativeTol * separationA + k_absoluteTol) {
    poly1 = polyB;
    poly2 = polyA;
    edge1 = edgeB;
    flip = 1;
  } else {
    poly1 = polyA;
    poly2 = polyB;
    edge1 = edgeA;
    flip = 0;
  }
  incidentEdge = [new ClipVertex(), new ClipVertex()];
  b2Collision.FindIncidentEdge(incidentEdge, poly1, edge1, poly2);
  count1 = poly1.m_vertexCount;
  vert1s = poly1.m_vertices;
  v11 = vert1s[edge1];
  v12 = edge1 + 1 < count1 ? vert1s[edge1 + 1] : vert1s[0];
  dvX = v12.x - v11.x;
  dvY = v12.y - v11.y;
  sideNormalX = v12.x - v11.x;
  sideNormalY = v12.y - v11.y;
  tX = sideNormalX;
  tMat = poly1.m_R;
  sideNormalX = tMat.col1.x * tX + tMat.col2.x * sideNormalY;
  sideNormalY = tMat.col1.y * tX + tMat.col2.y * sideNormalY;
  invLength = 1.0 / Math.sqrt(sideNormalX * sideNormalX + sideNormalY * sideNormalY);
  sideNormalX *= invLength;
  sideNormalY *= invLength;
  frontNormalX = sideNormalX;
  frontNormalY = sideNormalY;
  tX = frontNormalX;
  frontNormalX = frontNormalY;
  frontNormalY = -tX;
  v11X = v11.x;
  v11Y = v11.y;
  tX = v11X;
  tMat = poly1.m_R;
  v11X = tMat.col1.x * tX + tMat.col2.x * v11Y;
  v11Y = tMat.col1.y * tX + tMat.col2.y * v11Y;
  v11X += poly1.m_position.x;
  v11Y += poly1.m_position.y;
  v12X = v12.x;
  v12Y = v12.y;
  tX = v12X;
  tMat = poly1.m_R;
  v12X = tMat.col1.x * tX + tMat.col2.x * v12Y;
  v12Y = tMat.col1.y * tX + tMat.col2.y * v12Y;
  v12X += poly1.m_position.x;
  v12Y += poly1.m_position.y;
  frontOffset = frontNormalX * v11X + frontNormalY * v11Y;
  sideOffset1 = -(sideNormalX * v11X + sideNormalY * v11Y);
  sideOffset2 = sideNormalX * v12X + sideNormalY * v12Y;
  clipPoints1 = [new ClipVertex(), new ClipVertex()];
  clipPoints2 = [new ClipVertex(), new ClipVertex()];
  np = 0;
  b2Collision.b2CollidePolyTempVec.Set(-sideNormalX, -sideNormalY);
  np = b2Collision.ClipSegmentToLine(clipPoints1, incidentEdge, b2Collision.b2CollidePolyTempVec, sideOffset1);
  if (np < 2) {
    return;
  }
  b2Collision.b2CollidePolyTempVec.Set(sideNormalX, sideNormalY);
  np = b2Collision.ClipSegmentToLine(clipPoints2, clipPoints1, b2Collision.b2CollidePolyTempVec, sideOffset2);
  if (np < 2) {
    return;
  }
  if (flip) {
    manifold.normal.Set(-frontNormalX, -frontNormalY);
  } else {
    manifold.normal.Set(frontNormalX, frontNormalY);
  }
  pointCount = 0;
  for (i = 0, _ref = b2Settings.b2_maxManifoldPoints; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
    tVec = clipPoints2[i].v;
    separation = (frontNormalX * tVec.x + frontNormalY * tVec.y) - frontOffset;
    if (separation <= 0.0 || conservative === true) {
      cp = manifold.points[pointCount];
      cp.separation = separation;
      cp.position.SetV(clipPoints2[i].v);
      cp.id.Set(clipPoints2[i].id);
      cp.id.features.flip = flip;
      ++pointCount;
    }
  }
  return manifold.pointCount = pointCount;
};