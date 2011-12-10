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
var b2BroadPhase;
exports.b2BroadPhase = b2BroadPhase = b2BroadPhase = (function() {
  function b2BroadPhase(worldAABB, callback) {
    var dX, dY, i, j, tProxy, _ref, _ref2, _ref3;
    this.m_pairManager = new b2PairManager();
    this.m_proxyPool = new Array(b2Settings.b2_maxPairs);
    this.m_bounds = new Array(2 * b2Settings.b2_maxProxies);
    this.m_queryResults = new Array(b2Settings.b2_maxProxies);
    this.m_quantizationFactor = new b2Vec2();
    this.m_pairManager.Initialize(this, callback);
    this.m_worldAABB = worldAABB;
    this.m_proxyCount = 0;
    for (i = 0, _ref = b2Settings.b2_maxProxies; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      this.m_queryResults[i] = 0;
    }
    this.m_bounds = new Array(2);
    for (i = 0; i < 2; i++) {
      this.m_bounds[i] = new Array(2 * b2Settings.b2_maxProxies);
      for (j = 0, _ref2 = 2 * b2Settings.b2_maxProxies; 0 <= _ref2 ? j < _ref2 : j > _ref2; 0 <= _ref2 ? j++ : j--) {
        this.m_bounds[i][j] = new b2Bound();
      }
    }
    dX = worldAABB.maxVertex.x;
    dY = worldAABB.maxVertex.y;
    dX -= worldAABB.minVertex.x;
    dY -= worldAABB.minVertex.y;
    this.m_quantizationFactor.x = b2Settings.USHRT_MAX / dX;
    this.m_quantizationFactor.y = b2Settings.USHRT_MAX / dY;
    for (i = 0, _ref3 = b2Settings.b2_maxProxies - 1; 0 <= _ref3 ? i < _ref3 : i > _ref3; 0 <= _ref3 ? i++ : i--) {
      tProxy = new b2Proxy();
      this.m_proxyPool[i] = tProxy;
      tProxy.SetNext(i + 1);
      tProxy.timeStamp = 0;
      tProxy.overlapCount = b2BroadPhase.b2_invalid;
      tProxy.userData = null;
    }
    tProxy = new b2Proxy();
    this.m_proxyPool[b2Settings.b2_maxProxies - 1] = tProxy;
    tProxy.SetNext(b2Pair.b2_nullProxy);
    tProxy.timeStamp = 0;
    tProxy.overlapCount = b2BroadPhase.b2_invalid;
    tProxy.userData = null;
    this.m_freeProxy = 0;
    this.m_timeStamp = 1;
    this.m_queryResultCount = 0;
  }
  b2BroadPhase.prototype.InRange = function(aabb) {
    var d2X, d2Y, dX, dY;
    dX = aabb.minVertex.x;
    dY = aabb.minVertex.y;
    dX -= this.m_worldAABB.maxVertex.x;
    dY -= this.m_worldAABB.maxVertex.y;
    d2X = this.m_worldAABB.minVertex.x;
    d2Y = this.m_worldAABB.minVertex.y;
    d2X -= aabb.maxVertex.x;
    d2Y -= aabb.maxVertex.y;
    dX = b2Math.b2Max(dX, d2X);
    dY = b2Math.b2Max(dY, d2Y);
    return b2Math.b2Max(dX, dY) < 0.0;
  };
  b2BroadPhase.prototype.Commit = function() {
    return this.m_pairManager.Commit();
  };
  return b2BroadPhase;
})();
b2BroadPhase.s_validate = false;
b2BroadPhase.b2_invalid = b2Settings.USHRT_MAX;
b2BroadPhase.b2_nullEdge = b2Settings.USHRT_MAX;
b2BroadPhase.BinarySearch = function(bounds, count, value) {
  var high, low, mid;
  low = 0;
  high = count - 1;
  while (low <= high) {
    mid = Math.floor((low + high) / 2);
    if (bounds[mid].value > value) {
      high = mid - 1;
    } else if (bounds[mid].value < value) {
      low = mid + 1;
    } else {
      return mid;
    }
  }
  return low;
};