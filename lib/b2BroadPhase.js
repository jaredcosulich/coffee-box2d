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
  b2BroadPhase.prototype.CreateProxy = function(aabb, userData) {
    var axis, boundCount, bounds, i, index, j, lowerIndex, lowerIndexOut, lowerValues, proxy, proxy2, proxyId, tArr, tBound1, tBound2, tEnd, tIndex, upperIndex, upperIndexOut, upperValues, _ref;
    proxyId = this.m_freeProxy;
    proxy = this.m_proxyPool[proxyId];
    this.m_freeProxy = proxy.GetNext();
    proxy.overlapCount = 0;
    proxy.userData = userData;
    boundCount = 2 * this.m_proxyCount;
    lowerValues = new Array();
    upperValues = new Array();
    this.ComputeBounds(lowerValues, upperValues, aabb);
    for (axis = 0; axis < 2; axis++) {
      bounds = this.m_bounds[axis];
      lowerIndex = 0;
      upperIndex = 0;
      lowerIndexOut = [lowerIndex];
      upperIndexOut = [upperIndex];
      this.Query(lowerIndexOut, upperIndexOut, lowerValues[axis], upperValues[axis], bounds, boundCount, axis);
      lowerIndex = lowerIndexOut[0];
      upperIndex = upperIndexOut[0];
      tArr = new Array();
      tEnd = boundCount - upperIndex;
      for (j = 0; 0 <= tEnd ? j < tEnd : j > tEnd; 0 <= tEnd ? j++ : j--) {
        tArr[j] = new b2Bound();
        tBound1 = tArr[j];
        tBound2 = bounds[upperIndex + j];
        tBound1.value = tBound2.value;
        tBound1.proxyId = tBound2.proxyId;
        tBound1.stabbingCount = tBound2.stabbingCount;
      }
      tEnd = tArr.length;
      tIndex = upperIndex + 2;
      for (j = 0; 0 <= tEnd ? j < tEnd : j > tEnd; 0 <= tEnd ? j++ : j--) {
        tBound2 = tArr[j];
        tBound1 = bounds[tIndex + j];
        tBound1.value = tBound2.value;
        tBound1.proxyId = tBound2.proxyId;
        tBound1.stabbingCount = tBound2.stabbingCount;
      }
      tArr = new Array();
      tEnd = upperIndex - lowerIndex;
      for (j = 0; 0 <= tEnd ? j < tEnd : j > tEnd; 0 <= tEnd ? j++ : j--) {
        tArr[j] = new b2Bound();
        tBound1 = tArr[j];
        tBound2 = bounds[lowerIndex + j];
        tBound1.value = tBound2.value;
        tBound1.proxyId = tBound2.proxyId;
        tBound1.stabbingCount = tBound2.stabbingCount;
      }
      tEnd = tArr.length;
      tIndex = lowerIndex + 1;
      for (j = 0; 0 <= tEnd ? j < tEnd : j > tEnd; 0 <= tEnd ? j++ : j--) {
        tBound2 = tArr[j];
        tBound1 = bounds[tIndex + j];
        tBound1.value = tBound2.value;
        tBound1.proxyId = tBound2.proxyId;
        tBound1.stabbingCount = tBound2.stabbingCount;
      }
      ++upperIndex;
      bounds[lowerIndex].value = lowerValues[axis];
      bounds[lowerIndex].proxyId = proxyId;
      bounds[upperIndex].value = upperValues[axis];
      bounds[upperIndex].proxyId = proxyId;
      bounds[lowerIndex].stabbingCount = lowerIndex === 0 ? 0 : bounds[lowerIndex - 1].stabbingCount;
      bounds[upperIndex].stabbingCount = bounds[upperIndex - 1].stabbingCount;
      index = lowerIndex;
      while (index < upperIndex) {
        bounds[index].stabbingCount++;
        ++index;
      }
      index = lowerIndex;
      while (index < boundCount + 2) {
        proxy2 = this.m_proxyPool[bounds[index].proxyId];
        if (bounds[index].IsLower()) {
          proxy2.lowerBounds[axis] = index;
        } else {
          proxy2.upperBounds[axis] = index;
        }
        ++index;
      }
    }
    ++this.m_proxyCount;
    for (i = 0, _ref = this.m_queryResultCount; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      this.m_pairManager.AddBufferedPair(proxyId, this.m_queryResults[i]);
    }
    this.m_pairManager.Commit();
    this.m_queryResultCount = 0;
    this.IncrementTimeStamp();
    return proxyId;
  };
  b2BroadPhase.prototype.Commit = function() {
    return this.m_pairManager.Commit();
  };
  b2BroadPhase.prototype.ComputeBounds = function(lowerValues, upperValues, aabb) {
    var maxVertexX, maxVertexY, minVertexX, minVertexY;
    minVertexX = aabb.minVertex.x;
    minVertexY = aabb.minVertex.y;
    minVertexX = b2Math.b2Min(minVertexX, this.m_worldAABB.maxVertex.x);
    minVertexY = b2Math.b2Min(minVertexY, this.m_worldAABB.maxVertex.y);
    minVertexX = b2Math.b2Max(minVertexX, this.m_worldAABB.minVertex.x);
    minVertexY = b2Math.b2Max(minVertexY, this.m_worldAABB.minVertex.y);
    maxVertexX = aabb.maxVertex.x;
    maxVertexY = aabb.maxVertex.y;
    maxVertexX = b2Math.b2Min(maxVertexX, this.m_worldAABB.maxVertex.x);
    maxVertexY = b2Math.b2Min(maxVertexY, this.m_worldAABB.maxVertex.y);
    maxVertexX = b2Math.b2Max(maxVertexX, this.m_worldAABB.minVertex.x);
    maxVertexY = b2Math.b2Max(maxVertexY, this.m_worldAABB.minVertex.y);
    lowerValues[0] = (this.m_quantizationFactor.x * (minVertexX - this.m_worldAABB.minVertex.x)) & (b2Settings.USHRT_MAX - 1);
    upperValues[0] = ((this.m_quantizationFactor.x * (maxVertexX - this.m_worldAABB.minVertex.x)) & 0x0000ffff) | 1;
    lowerValues[1] = (this.m_quantizationFactor.y * (minVertexY - this.m_worldAABB.minVertex.y)) & (b2Settings.USHRT_MAX - 1);
    return upperValues[1] = ((this.m_quantizationFactor.y * (maxVertexY - this.m_worldAABB.minVertex.y)) & 0x0000ffff) | 1;
  };
  b2BroadPhase.prototype.Query = function(lowerQueryOut, upperQueryOut, lowerValue, upperValue, bounds, boundCount, axis) {
    var i, j, lowerQuery, proxy, s, upperQuery;
    lowerQuery = b2BroadPhase.BinarySearch(bounds, boundCount, lowerValue);
    upperQuery = b2BroadPhase.BinarySearch(bounds, boundCount, upperValue);
    j = lowerQuery;
    while (j < upperQuery) {
      if (bounds[j].IsLower()) {
        this.IncrementOverlapCount(bounds[j].proxyId);
      }
      ++j;
    }
    if (lowerQuery > 0) {
      i = lowerQuery - 1;
      s = bounds[i].stabbingCount;
      while (s) {
        if (bounds[i].IsLower()) {
          proxy = this.m_proxyPool[bounds[i].proxyId];
          if (lowerQuery <= proxy.upperBounds[axis]) {
            this.IncrementOverlapCount(bounds[i].proxyId);
            --s;
          }
        }
        --i;
      }
    }
    lowerQueryOut[0] = lowerQuery;
    return upperQueryOut[0] = upperQuery;
  };
  b2BroadPhase.prototype.IncrementOverlapCount = function(proxyId) {
    var proxy;
    proxy = this.m_proxyPool[proxyId];
    if (proxy.timeStamp < this.m_timeStamp) {
      proxy.timeStamp = this.m_timeStamp;
      return proxy.overlapCount = 1;
    } else {
      proxy.overlapCount = 2;
      this.m_queryResults[this.m_queryResultCount] = proxyId;
      return ++this.m_queryResultCount;
    }
  };
  b2BroadPhase.prototype.IncrementTimeStamp = function() {
    var i, _ref;
    if (this.m_timeStamp === b2Settings.USHRT_MAX) {
      for (i = 0, _ref = b2Settings.b2_maxProxies; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        this.m_proxyPool[i].timeStamp = 0;
      }
      return this.m_timeStamp = 1;
    } else {
      return ++this.m_timeStamp;
    }
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