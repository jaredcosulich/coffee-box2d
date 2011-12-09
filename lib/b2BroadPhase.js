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
/*
var b2BroadPhase = Class.create()
b2BroadPhase.prototype = 
{
//public:
	initialize: function(worldAABB, callback){
		// initialize instance variables for references
		@m_pairManager = new b2PairManager()
		@m_proxyPool = new Array(b2Settings.b2_maxPairs)
		@m_bounds = new Array(2*b2Settings.b2_maxProxies)
		@m_queryResults = new Array(b2Settings.b2_maxProxies)
		@m_quantizationFactor = new b2Vec2()
		//

		//b2Settings.b2Assert(worldAABB.IsValid())
		var i = 0

		@m_pairManager.Initialize(@, callback)

		@m_worldAABB = worldAABB

		@m_proxyCount = 0

		// query results
		for (i = 0 i < b2Settings.b2_maxProxies i++){
			@m_queryResults[i] = 0
		}

		// bounds array
		@m_bounds = new Array(2)
		for (i = 0 i < 2 i++){
			@m_bounds[i] = new Array(2*b2Settings.b2_maxProxies)
			for (var j = 0 j < 2*b2Settings.b2_maxProxies j++){
				@m_bounds[i][j] = new b2Bound()
			}
		}

		//var d = b2Math.SubtractVV(worldAABB.maxVertex, worldAABB.minVertex)
		var dX = worldAABB.maxVertex.x
		var dY = worldAABB.maxVertex.y
		dX -= worldAABB.minVertex.x
		dY -= worldAABB.minVertex.y

		@m_quantizationFactor.x = b2Settings.USHRT_MAX / dX
		@m_quantizationFactor.y = b2Settings.USHRT_MAX / dY

		var tProxy
		for (i = 0 i < b2Settings.b2_maxProxies - 1 ++i)
		{
			tProxy = new b2Proxy()
			@m_proxyPool[i] = tProxy
			tProxy.SetNext(i + 1)
			tProxy.timeStamp = 0
			tProxy.overlapCount = b2BroadPhase.b2_invalid
			tProxy.userData = null
		}
		tProxy = new b2Proxy()
		@m_proxyPool[b2Settings.b2_maxProxies-1] = tProxy
		tProxy.SetNext(b2Pair.b2_nullProxy)
		tProxy.timeStamp = 0
		tProxy.overlapCount = b2BroadPhase.b2_invalid
		tProxy.userData = null
		@m_freeProxy = 0

		@m_timeStamp = 1
		@m_queryResultCount = 0
	},
	//~b2BroadPhase()

	// Use @ to see if your proxy is in range. If it is not in range,
	// it should be destroyed. Otherwise you may get O(m^2) pairs, where m
	// is the number of proxies that are out of range.
	InRange: function(aabb){
		//var d = b2Math.b2MaxV(b2Math.SubtractVV(aabb.minVertex, @m_worldAABB.maxVertex), b2Math.SubtractVV(@m_worldAABB.minVertex, aabb.maxVertex))
		var dX
		var dY
		var d2X
		var d2Y

		dX = aabb.minVertex.x
		dY = aabb.minVertex.y
		dX -= @m_worldAABB.maxVertex.x
		dY -= @m_worldAABB.maxVertex.y

		d2X = @m_worldAABB.minVertex.x
		d2Y = @m_worldAABB.minVertex.y
		d2X -= aabb.maxVertex.x
		d2Y -= aabb.maxVertex.y

		dX = b2Math.b2Max(dX, d2X)
		dY = b2Math.b2Max(dY, d2Y)

		return b2Math.b2Max(dX, dY) < 0.0
	},

	// Get a single proxy. Returns NULL if the id is invalid.
	GetProxy: function(proxyId){
		if (proxyId == b2Pair.b2_nullProxy || @m_proxyPool[proxyId].IsValid() == false)
		{
			return null
		}

		return @m_proxyPool[ proxyId ]
	},

	// Create and destroy proxies. These call Flush first.
	CreateProxy: function(aabb, userData){
		var index = 0
		var proxy

		//b2Settings.b2Assert(@m_proxyCount < b2_maxProxies)
		//b2Settings.b2Assert(@m_freeProxy != b2Pair.b2_nullProxy)

		var proxyId = @m_freeProxy
		proxy = @m_proxyPool[ proxyId ]
		@m_freeProxy = proxy.GetNext()

		proxy.overlapCount = 0
		proxy.userData = userData

		var boundCount = 2 * @m_proxyCount

		var lowerValues = new Array()
		var upperValues = new Array()
		@ComputeBounds(lowerValues, upperValues, aabb)

		for (var axis = 0 axis < 2 ++axis)
		{
			var bounds = @m_bounds[axis]
			var lowerIndex = 0
			var upperIndex = 0
			var lowerIndexOut = [lowerIndex]
			var upperIndexOut = [upperIndex]
			@Query(lowerIndexOut, upperIndexOut, lowerValues[axis], upperValues[axis], bounds, boundCount, axis)
			lowerIndex = lowerIndexOut[0]
			upperIndex = upperIndexOut[0]

			// Replace memmove calls
			//memmove(bounds + upperIndex + 2, bounds + upperIndex, (edgeCount - upperIndex) * sizeof(b2Bound))
			var tArr = new Array()
			var j = 0
			var tEnd = boundCount - upperIndex
			var tBound1
			var tBound2
			// make temp array
			for (j = 0 j < tEnd j++){
				tArr[j] = new b2Bound()
				tBound1 = tArr[j]
				tBound2 = bounds[upperIndex+j]
				tBound1.value = tBound2.value
				tBound1.proxyId = tBound2.proxyId
				tBound1.stabbingCount = tBound2.stabbingCount
			}
			// move temp array back in to bounds
			tEnd = tArr.length
			var tIndex = upperIndex+2
			for (j = 0 j < tEnd j++){
				//bounds[tIndex+j] = tArr[j]
				tBound2 = tArr[j]
				tBound1 = bounds[tIndex+j]
				tBound1.value = tBound2.value
				tBound1.proxyId = tBound2.proxyId
				tBound1.stabbingCount = tBound2.stabbingCount
			}
			//memmove(bounds + lowerIndex + 1, bounds + lowerIndex, (upperIndex - lowerIndex) * sizeof(b2Bound))
			// make temp array
			tArr = new Array()
			tEnd = upperIndex - lowerIndex
			for (j = 0 j < tEnd j++){
				tArr[j] = new b2Bound()
				tBound1 = tArr[j]
				tBound2 = bounds[lowerIndex+j]
				tBound1.value = tBound2.value
				tBound1.proxyId = tBound2.proxyId
				tBound1.stabbingCount = tBound2.stabbingCount
			}
			// move temp array back in to bounds
			tEnd = tArr.length
			tIndex = lowerIndex+1
			for (j = 0 j < tEnd j++){
				//bounds[tIndex+j] = tArr[j]
				tBound2 = tArr[j]
				tBound1 = bounds[tIndex+j]
				tBound1.value = tBound2.value
				tBound1.proxyId = tBound2.proxyId
				tBound1.stabbingCount = tBound2.stabbingCount
			}

			// The upper index has increased because of the lower bound insertion.
			++upperIndex

			// Copy in the new bounds.
			bounds[lowerIndex].value = lowerValues[axis]
			bounds[lowerIndex].proxyId = proxyId
			bounds[upperIndex].value = upperValues[axis]
			bounds[upperIndex].proxyId = proxyId

			bounds[lowerIndex].stabbingCount = lowerIndex == 0 ? 0 : bounds[lowerIndex-1].stabbingCount
			bounds[upperIndex].stabbingCount = bounds[upperIndex-1].stabbingCount

			// Adjust the stabbing count between the new bounds.
			for (index = lowerIndex index < upperIndex ++index)
			{
				bounds[index].stabbingCount++
			}

			// Adjust the all the affected bound indices.
			for (index = lowerIndex index < boundCount + 2 ++index)
			{
				var proxy2 = @m_proxyPool[ bounds[index].proxyId ]
				if (bounds[index].IsLower())
				{
					proxy2.lowerBounds[axis] = index
				}
				else
				{
					proxy2.upperBounds[axis] = index
				}
			}
		}

		++@m_proxyCount

		//b2Settings.b2Assert(@m_queryResultCount < b2Settings.b2_maxProxies)

		for (var i = 0 i < @m_queryResultCount ++i)
		{
			//b2Settings.b2Assert(@m_queryResults[i] < b2_maxProxies)
			//b2Settings.b2Assert(@m_proxyPool[@m_queryResults[i]].IsValid())

			@m_pairManager.AddBufferedPair(proxyId, @m_queryResults[i])
		}

		@m_pairManager.Commit()

		// Prepare for next query.
		@m_queryResultCount = 0
		@IncrementTimeStamp()

		return proxyId
	},

	DestroyProxy: function(proxyId){

		//b2Settings.b2Assert(0 < @m_proxyCount && @m_proxyCount <= b2_maxProxies)

		var proxy = @m_proxyPool[ proxyId ]
		//b2Settings.b2Assert(proxy.IsValid())

		var boundCount = 2 * @m_proxyCount

		for (var axis = 0 axis < 2 ++axis)
		{
			var bounds = @m_bounds[axis]

			var lowerIndex = proxy.lowerBounds[axis]
			var upperIndex = proxy.upperBounds[axis]
			var lowerValue = bounds[lowerIndex].value
			var upperValue = bounds[upperIndex].value

			// replace memmove calls
			//memmove(bounds + lowerIndex, bounds + lowerIndex + 1, (upperIndex - lowerIndex - 1) * sizeof(b2Bound))
			var tArr = new Array()
			var j = 0
			var tEnd = upperIndex - lowerIndex - 1
			var tBound1
			var tBound2
			// make temp array
			for (j = 0 j < tEnd j++){
				tArr[j] = new b2Bound()
				tBound1 = tArr[j]
				tBound2 = bounds[lowerIndex+1+j]
				tBound1.value = tBound2.value
				tBound1.proxyId = tBound2.proxyId
				tBound1.stabbingCount = tBound2.stabbingCount
			}
			// move temp array back in to bounds
			tEnd = tArr.length
			var tIndex = lowerIndex
			for (j = 0 j < tEnd j++){
				//bounds[tIndex+j] = tArr[j]
				tBound2 = tArr[j]
				tBound1 = bounds[tIndex+j]
				tBound1.value = tBound2.value
				tBound1.proxyId = tBound2.proxyId
				tBound1.stabbingCount = tBound2.stabbingCount
			}
			//memmove(bounds + upperIndex-1, bounds + upperIndex + 1, (edgeCount - upperIndex - 1) * sizeof(b2Bound))
			// make temp array
			tArr = new Array()
			tEnd = boundCount - upperIndex - 1
			for (j = 0 j < tEnd j++){
				tArr[j] = new b2Bound()
				tBound1 = tArr[j]
				tBound2 = bounds[upperIndex+1+j]
				tBound1.value = tBound2.value
				tBound1.proxyId = tBound2.proxyId
				tBound1.stabbingCount = tBound2.stabbingCount
			}
			// move temp array back in to bounds
			tEnd = tArr.length
			tIndex = upperIndex-1
			for (j = 0 j < tEnd j++){
				//bounds[tIndex+j] = tArr[j]
				tBound2 = tArr[j]
				tBound1 = bounds[tIndex+j]
				tBound1.value = tBound2.value
				tBound1.proxyId = tBound2.proxyId
				tBound1.stabbingCount = tBound2.stabbingCount
			}

			// Fix bound indices.
			tEnd = boundCount - 2
			for (var index = lowerIndex index < tEnd ++index)
			{
				var proxy2 = @m_proxyPool[ bounds[index].proxyId ]
				if (bounds[index].IsLower())
				{
					proxy2.lowerBounds[axis] = index
				}
				else
				{
					proxy2.upperBounds[axis] = index
				}
			}

			// Fix stabbing count.
			tEnd = upperIndex - 1
			for (var index2 = lowerIndex index2 < tEnd ++index2)
			{
				bounds[index2].stabbingCount--
			}

			// @Query for pairs to be removed. lowerIndex and upperIndex are not needed.
			// make lowerIndex and upper output using an array and do @ for others if compiler doesn't pick them up
			@Query([0], [0], lowerValue, upperValue, bounds, boundCount - 2, axis)
		}

		//b2Settings.b2Assert(@m_queryResultCount < b2Settings.b2_maxProxies)

		for (var i = 0 i < @m_queryResultCount ++i)
		{
			//b2Settings.b2Assert(@m_proxyPool[@m_queryResults[i]].IsValid())

			@m_pairManager.RemoveBufferedPair(proxyId, @m_queryResults[i])
		}

		@m_pairManager.Commit()

		// Prepare for next query.
		@m_queryResultCount = 0
		@IncrementTimeStamp()

		// Return the proxy to the pool.
		proxy.userData = null
		proxy.overlapCount = b2BroadPhase.b2_invalid
		proxy.lowerBounds[0] = b2BroadPhase.b2_invalid
		proxy.lowerBounds[1] = b2BroadPhase.b2_invalid
		proxy.upperBounds[0] = b2BroadPhase.b2_invalid
		proxy.upperBounds[1] = b2BroadPhase.b2_invalid

		proxy.SetNext(@m_freeProxy)
		@m_freeProxy = proxyId
		--@m_proxyCount
	},


	// Call @MoveProxy times like, then when you are done
	// call @Commit to finalized the proxy pairs (for your time step).
	MoveProxy: function(proxyId, aabb){
		var axis = 0
		var index = 0
		var bound
		var prevBound
		var nextBound
		var nextProxyId = 0
		var nextProxy

		if (proxyId == b2Pair.b2_nullProxy || b2Settings.b2_maxProxies <= proxyId)
		{
			//b2Settings.b2Assert(false)
			return
		}

		if (aabb.IsValid() == false)
		{
			//b2Settings.b2Assert(false)
			return
		}

		var boundCount = 2 * @m_proxyCount

		var proxy = @m_proxyPool[ proxyId ]
		// Get new bound values
		var newValues = new b2BoundValues()
		@ComputeBounds(newValues.lowerValues, newValues.upperValues, aabb)

		// Get old bound values
		var oldValues = new b2BoundValues()
		for (axis = 0 axis < 2 ++axis)
		{
			oldValues.lowerValues[axis] = @m_bounds[axis][proxy.lowerBounds[axis]].value
			oldValues.upperValues[axis] = @m_bounds[axis][proxy.upperBounds[axis]].value
		}

		for (axis = 0 axis < 2 ++axis)
		{
			var bounds = @m_bounds[axis]

			var lowerIndex = proxy.lowerBounds[axis]
			var upperIndex = proxy.upperBounds[axis]

			var lowerValue = newValues.lowerValues[axis]
			var upperValue = newValues.upperValues[axis]

			var deltaLower = lowerValue - bounds[lowerIndex].value
			var deltaUpper = upperValue - bounds[upperIndex].value

			bounds[lowerIndex].value = lowerValue
			bounds[upperIndex].value = upperValue

			//
			// Expanding adds overlaps
			//

			// Should we move the lower bound down?
			if (deltaLower < 0)
			{
				index = lowerIndex
				while (index > 0 && lowerValue < bounds[index-1].value)
				{
					bound = bounds[index]
					prevBound = bounds[index - 1]

					var prevProxyId = prevBound.proxyId
					var prevProxy = @m_proxyPool[ prevBound.proxyId ]

					prevBound.stabbingCount++

					if (prevBound.IsUpper() == true)
					{
						if (@TestOverlap(newValues, prevProxy))
						{
							@m_pairManager.AddBufferedPair(proxyId, prevProxyId)
						}

						prevProxy.upperBounds[axis]++
						bound.stabbingCount++
					}
					else
					{
						prevProxy.lowerBounds[axis]++
						bound.stabbingCount--
					}

					proxy.lowerBounds[axis]--

					// swap
					//var temp = bound
					//bound = prevEdge
					//prevEdge = temp
					bound.Swap(prevBound)
					//b2Math.b2Swap(bound, prevEdge)
					--index
				}
			}

			// Should we move the upper bound up?
			if (deltaUpper > 0)
			{
				index = upperIndex
				while (index < boundCount-1 && bounds[index+1].value <= upperValue)
				{
					bound = bounds[ index ]
					nextBound = bounds[ index + 1 ]
					nextProxyId = nextBound.proxyId
					nextProxy = @m_proxyPool[ nextProxyId ]

					nextBound.stabbingCount++

					if (nextBound.IsLower() == true)
					{
						if (@TestOverlap(newValues, nextProxy))
						{
							@m_pairManager.AddBufferedPair(proxyId, nextProxyId)
						}

						nextProxy.lowerBounds[axis]--
						bound.stabbingCount++
					}
					else
					{
						nextProxy.upperBounds[axis]--
						bound.stabbingCount--
					}

					proxy.upperBounds[axis]++
					// swap
					//var temp = bound
					//bound = nextEdge
					//nextEdge = temp
					bound.Swap(nextBound)
					//b2Math.b2Swap(bound, nextEdge)
					index++
				}
			}

			//
			// Shrinking removes overlaps
			//

			// Should we move the lower bound up?
			if (deltaLower > 0)
			{
				index = lowerIndex
				while (index < boundCount-1 && bounds[index+1].value <= lowerValue)
				{
					bound = bounds[ index ]
					nextBound = bounds[ index + 1 ]

					nextProxyId = nextBound.proxyId
					nextProxy = @m_proxyPool[ nextProxyId ]

					nextBound.stabbingCount--

					if (nextBound.IsUpper())
					{
						if (@TestOverlap(oldValues, nextProxy))
						{
							@m_pairManager.RemoveBufferedPair(proxyId, nextProxyId)
						}

						nextProxy.upperBounds[axis]--
						bound.stabbingCount--
					}
					else
					{
						nextProxy.lowerBounds[axis]--
						bound.stabbingCount++
					}

					proxy.lowerBounds[axis]++
					// swap
					//var temp = bound
					//bound = nextEdge
					//nextEdge = temp
					bound.Swap(nextBound)
					//b2Math.b2Swap(bound, nextEdge)
					index++
				}
			}

			// Should we move the upper bound down?
			if (deltaUpper < 0)
			{
				index = upperIndex
				while (index > 0 && upperValue < bounds[index-1].value)
				{
					bound = bounds[index]
					prevBound = bounds[index - 1]

					prevProxyId = prevBound.proxyId
					prevProxy = @m_proxyPool[ prevProxyId ]

					prevBound.stabbingCount--

					if (prevBound.IsLower() == true)
					{
						if (@TestOverlap(oldValues, prevProxy))
						{
							@m_pairManager.RemoveBufferedPair(proxyId, prevProxyId)
						}

						prevProxy.lowerBounds[axis]++
						bound.stabbingCount--
					}
					else
					{
						prevProxy.upperBounds[axis]++
						bound.stabbingCount++
					}

					proxy.upperBounds[axis]--
					// swap
					//var temp = bound
					//bound = prevEdge
					//prevEdge = temp
					bound.Swap(prevBound)
					//b2Math.b2Swap(bound, prevEdge)
					index--
				}
			}
		}
	},

	Commit: function(){
		@m_pairManager.Commit()
	},

	// @Query an AABB for overlapping proxies, returns the user data and
	// the count, up to the supplied maximum count.
	QueryAABB: function(aabb, userData, maxCount){
		var lowerValues = new Array()
		var upperValues = new Array()
		@ComputeBounds(lowerValues, upperValues, aabb)

		var lowerIndex = 0
		var upperIndex = 0
		var lowerIndexOut = [lowerIndex]
		var upperIndexOut = [upperIndex]
		@Query(lowerIndexOut, upperIndexOut, lowerValues[0], upperValues[0], @m_bounds[0], 2*@m_proxyCount, 0)
		@Query(lowerIndexOut, upperIndexOut, lowerValues[1], upperValues[1], @m_bounds[1], 2*@m_proxyCount, 1)

		//b2Settings.b2Assert(@m_queryResultCount < b2Settings.b2_maxProxies)

		var count = 0
		for (var i = 0 i < @m_queryResultCount && count < maxCount ++i, ++count)
		{
			//b2Settings.b2Assert(@m_queryResults[i] < b2Settings.b2_maxProxies)
			var proxy = @m_proxyPool[ @m_queryResults[i] ]
			//b2Settings.b2Assert(proxy.IsValid())
			userData[i] = proxy.userData
		}

		// Prepare for next query.
		@m_queryResultCount = 0
		@IncrementTimeStamp()

		return count
	},

	Validate: function(){
		var pair
		var proxy1
		var proxy2
		var overlap

		for (var axis = 0 axis < 2 ++axis)
		{
			var bounds = @m_bounds[axis]

			var boundCount = 2 * @m_proxyCount
			var stabbingCount = 0

			for (var i = 0 i < boundCount ++i)
			{
				var bound = bounds[i]
				//b2Settings.b2Assert(i == 0 || bounds[i-1].value <= bound->value)
				//b2Settings.b2Assert(bound->proxyId != b2_nullProxy)
				//b2Settings.b2Assert(@m_proxyPool[bound->proxyId].IsValid())

				if (bound.IsLower() == true)
				{
					//b2Settings.b2Assert(@m_proxyPool[bound.proxyId].lowerBounds[axis] == i)
					stabbingCount++
				}
				else
				{
					//b2Settings.b2Assert(@m_proxyPool[bound.proxyId].upperBounds[axis] == i)
					stabbingCount--
				}

				//b2Settings.b2Assert(bound.stabbingCount == stabbingCount)
			}
		}

	},

//private:
	ComputeBounds: function(lowerValues, upperValues, aabb)
	{
		//b2Settings.b2Assert(aabb.maxVertex.x > aabb.minVertex.x)
		//b2Settings.b2Assert(aabb.maxVertex.y > aabb.minVertex.y)

		//var minVertex = b2Math.b2ClampV(aabb.minVertex, @m_worldAABB.minVertex, @m_worldAABB.maxVertex)
		var minVertexX = aabb.minVertex.x
		var minVertexY = aabb.minVertex.y
		minVertexX = b2Math.b2Min(minVertexX, @m_worldAABB.maxVertex.x)
		minVertexY = b2Math.b2Min(minVertexY, @m_worldAABB.maxVertex.y)
		minVertexX = b2Math.b2Max(minVertexX, @m_worldAABB.minVertex.x)
		minVertexY = b2Math.b2Max(minVertexY, @m_worldAABB.minVertex.y)

		//var maxVertex = b2Math.b2ClampV(aabb.maxVertex, @m_worldAABB.minVertex, @m_worldAABB.maxVertex)
		var maxVertexX = aabb.maxVertex.x
		var maxVertexY = aabb.maxVertex.y
		maxVertexX = b2Math.b2Min(maxVertexX, @m_worldAABB.maxVertex.x)
		maxVertexY = b2Math.b2Min(maxVertexY, @m_worldAABB.maxVertex.y)
		maxVertexX = b2Math.b2Max(maxVertexX, @m_worldAABB.minVertex.x)
		maxVertexY = b2Math.b2Max(maxVertexY, @m_worldAABB.minVertex.y)

		// Bump lower bounds downs and upper bounds up. @ ensures correct sorting of
		// lower/upper bounds that would have equal values.
		// TODO_ERIN implement fast float to uint16 conversion.
		lowerValues[0] = (@m_quantizationFactor.x * (minVertexX - @m_worldAABB.minVertex.x)) & (b2Settings.USHRT_MAX - 1)
		upperValues[0] = ((@m_quantizationFactor.x * (maxVertexX - @m_worldAABB.minVertex.x))& 0x0000ffff) | 1

		lowerValues[1] = (@m_quantizationFactor.y * (minVertexY - @m_worldAABB.minVertex.y)) & (b2Settings.USHRT_MAX - 1)
		upperValues[1] = ((@m_quantizationFactor.y * (maxVertexY - @m_worldAABB.minVertex.y))& 0x0000ffff) | 1
	},

	// @ one is only used for validation.
	TestOverlapValidate: function(p1, p2){

		for (var axis = 0 axis < 2 ++axis)
		{
			var bounds = @m_bounds[axis]

			//b2Settings.b2Assert(p1.lowerBounds[axis] < 2 * @m_proxyCount)
			//b2Settings.b2Assert(p1.upperBounds[axis] < 2 * @m_proxyCount)
			//b2Settings.b2Assert(p2.lowerBounds[axis] < 2 * @m_proxyCount)
			//b2Settings.b2Assert(p2.upperBounds[axis] < 2 * @m_proxyCount)

			if (bounds[p1.lowerBounds[axis]].value > bounds[p2.upperBounds[axis]].value)
				return false

			if (bounds[p1.upperBounds[axis]].value < bounds[p2.lowerBounds[axis]].value)
				return false
		}

		return true
	},

	TestOverlap: function(b, p)
	{
		for (var axis = 0 axis < 2 ++axis)
		{
			var bounds = @m_bounds[axis]

			//b2Settings.b2Assert(p.lowerBounds[axis] < 2 * @m_proxyCount)
			//b2Settings.b2Assert(p.upperBounds[axis] < 2 * @m_proxyCount)

			if (b.lowerValues[axis] > bounds[p.upperBounds[axis]].value)
				return false

			if (b.upperValues[axis] < bounds[p.lowerBounds[axis]].value)
				return false
		}

		return true
	},

	Query: function(lowerQueryOut, upperQueryOut, lowerValue, upperValue, bounds, boundCount, axis){

		var lowerQuery = b2BroadPhase.BinarySearch(bounds, boundCount, lowerValue)
		var upperQuery = b2BroadPhase.BinarySearch(bounds, boundCount, upperValue)

		// Easy case: lowerQuery <= lowerIndex(i) < upperQuery
		// Solution: search query range for min bounds.
		for (var j = lowerQuery j < upperQuery ++j)
		{
			if (bounds[j].IsLower())
			{
				@IncrementOverlapCount(bounds[j].proxyId)
			}
		}

		// Hard case: lowerIndex(i) < lowerQuery < upperIndex(i)
		// Solution: use the stabbing count to search down the bound array.
		if (lowerQuery > 0)
		{
			var i = lowerQuery - 1
			var s = bounds[i].stabbingCount

			// Find the s overlaps.
			while (s)
			{
				//b2Settings.b2Assert(i >= 0)

				if (bounds[i].IsLower())
				{
					var proxy = @m_proxyPool[ bounds[i].proxyId ]
					if (lowerQuery <= proxy.upperBounds[axis])
					{
						@IncrementOverlapCount(bounds[i].proxyId)
						--s
					}
				}
				--i
			}
		}

		lowerQueryOut[0] = lowerQuery
		upperQueryOut[0] = upperQuery
	},


	IncrementOverlapCount: function(proxyId){
		var proxy = @m_proxyPool[ proxyId ]
		if (proxy.timeStamp < @m_timeStamp)
		{
			proxy.timeStamp = @m_timeStamp
			proxy.overlapCount = 1
		}
		else
		{
			proxy.overlapCount = 2
			//b2Settings.b2Assert(@m_queryResultCount < b2Settings.b2_maxProxies)
			@m_queryResults[@m_queryResultCount] = proxyId
			++@m_queryResultCount
		}
	},
	IncrementTimeStamp: function(){
		if (@m_timeStamp == b2Settings.USHRT_MAX)
		{
			for (var i = 0 i < b2Settings.b2_maxProxies ++i)
			{
				@m_proxyPool[i].timeStamp = 0
			}
			@m_timeStamp = 1
		}
		else
		{
			++@m_timeStamp
		}
	},

//public:
	m_pairManager: new b2PairManager(),

	m_proxyPool: new Array(b2Settings.b2_maxPairs),
	m_freeProxy: 0,

	m_bounds: new Array(2*b2Settings.b2_maxProxies),

	m_queryResults: new Array(b2Settings.b2_maxProxies),
	m_queryResultCount: 0,

	m_worldAABB: null,
	m_quantizationFactor: new b2Vec2(),
	m_proxyCount: 0,
	m_timeStamp: 0}
b2BroadPhase.s_validate = false
b2BroadPhase.b2_invalid = b2Settings.USHRT_MAX
b2BroadPhase.b2_nullEdge = b2Settings.USHRT_MAX
b2BroadPhase.BinarySearch = function(bounds, count, value)
	{
		var low = 0
		var high = count - 1
		while (low <= high)
		{
			var mid = Math.floor((low + high) / 2)
			if (bounds[mid].value > value)
			{
				high = mid - 1
			}
			else if (bounds[mid].value < value)
			{
				low = mid + 1
			}
			else
			{
				return (mid)
			}
		}

		return (low)
	}*/