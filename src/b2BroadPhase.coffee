###
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
###




# @ broad phase uses the Sweep and Prune algorithm in:
# Collision Detection in Interactive 3D Environments by Gino van den Bergen
# Also, some ideas, such integral values for fast compares comes from
# Bullet (http:/www.bulletphysics.com).


# Notes:
# - we use bound arrays instead of linked lists for cache coherence.
# - we use quantized integral values for fast compares.
# - we use short indices rather than pointers to save memory.
# - we use a stabbing count for fast overlap queries (less than order N).
# - we also use a time stamp on each proxy to speed up the registration of
#   overlap query results.
# - where possible, we compare bound indices instead of values to reduce
#   cache misses (TODO_ERIN).
# - no broadphase is perfect and neither is @ one: it is not great for huge
#   worlds (use a multi-SAP instead), it is not great for large objects.


exports.b2BroadPhase = b2BroadPhase = class b2BroadPhase
    constructor: (worldAABB, callback) ->
        @m_pairManager = new b2PairManager()
        @m_proxyPool = new Array(b2Settings.b2_maxPairs)
        @m_bounds = new Array(2*b2Settings.b2_maxProxies)
        @m_queryResults = new Array(b2Settings.b2_maxProxies)
        @m_quantizationFactor = new b2Vec2()

        @m_pairManager.Initialize(@, callback)

        @m_worldAABB = worldAABB

        @m_proxyCount = 0

        # query results
        @m_queryResults[i] = 0 for i in [0...b2Settings.b2_maxProxies]

        # bounds array
        @m_bounds = new Array(2)
        for i in [0...2]
        	@m_bounds[i] = new Array(2 * b2Settings.b2_maxProxies)
        	@m_bounds[i][j] = new b2Bound() for j in [0...(2 * b2Settings.b2_maxProxies)]

        dX = worldAABB.maxVertex.x
        dY = worldAABB.maxVertex.y
        dX -= worldAABB.minVertex.x
        dY -= worldAABB.minVertex.y

        @m_quantizationFactor.x = b2Settings.USHRT_MAX / dX
        @m_quantizationFactor.y = b2Settings.USHRT_MAX / dY

        for i in [0...b2Settings.b2_maxProxies - 1]
        	tProxy = new b2Proxy()
        	@m_proxyPool[i] = tProxy
        	tProxy.SetNext(i + 1)
        	tProxy.timeStamp = 0
        	tProxy.overlapCount = b2BroadPhase.b2_invalid
        	tProxy.userData = null

        tProxy = new b2Proxy()
        @m_proxyPool[b2Settings.b2_maxProxies-1] = tProxy
        tProxy.SetNext(b2Pair.b2_nullProxy)
        tProxy.timeStamp = 0
        tProxy.overlapCount = b2BroadPhase.b2_invalid
        tProxy.userData = null
        @m_freeProxy = 0

        @m_timeStamp = 1
        @m_queryResultCount = 0

    # Use this to see if your proxy is in range. If it is not in range,
    # it should be destroyed. Otherwise you may get O(m^2) pairs, where m
    # is the number of proxies that are out of range.
    InRange: (aabb) ->
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

    # Create and destroy proxies. These call Flush first.
    CreateProxy: (aabb, userData) ->
        proxyId = @m_freeProxy
        proxy = @m_proxyPool[ proxyId ]
        @m_freeProxy = proxy.GetNext()

        proxy.overlapCount = 0
        proxy.userData = userData

        boundCount = 2 * @m_proxyCount

        lowerValues = new Array()
        upperValues = new Array()
        @ComputeBounds(lowerValues, upperValues, aabb)

        for axis in [0...2]
        	bounds = @m_bounds[axis]
        	lowerIndex = 0
        	upperIndex = 0
        	lowerIndexOut = [lowerIndex]
        	upperIndexOut = [upperIndex]
        	@Query(lowerIndexOut, upperIndexOut, lowerValues[axis], upperValues[axis], bounds, boundCount, axis)
        	lowerIndex = lowerIndexOut[0]
        	upperIndex = upperIndexOut[0]

        	# Replace memmove calls
        	tArr = new Array()
        	tEnd = boundCount - upperIndex
        	# make temp array
        	for j in [0...tEnd]
        		tArr[j] = new b2Bound()
        		tBound1 = tArr[j]
        		tBound2 = bounds[upperIndex+j]
        		tBound1.value = tBound2.value
        		tBound1.proxyId = tBound2.proxyId
        		tBound1.stabbingCount = tBound2.stabbingCount
        	
        	# move temp array back in to bounds
        	tEnd = tArr.length
        	tIndex = upperIndex+2
        	for j in [0...tEnd]
        		tBound2 = tArr[j]
        		tBound1 = bounds[tIndex+j]
        		tBound1.value = tBound2.value
        		tBound1.proxyId = tBound2.proxyId
        		tBound1.stabbingCount = tBound2.stabbingCount

        	# make temp array
        	tArr = new Array()
        	tEnd = upperIndex - lowerIndex
        	for j in [0...tEnd]
        		tArr[j] = new b2Bound()
        		tBound1 = tArr[j]
        		tBound2 = bounds[lowerIndex+j]
        		tBound1.value = tBound2.value
        		tBound1.proxyId = tBound2.proxyId
        		tBound1.stabbingCount = tBound2.stabbingCount

        	# move temp array back in to bounds
        	tEnd = tArr.length
        	tIndex = lowerIndex+1
        	for j in [0...tEnd]
        		tBound2 = tArr[j]
        		tBound1 = bounds[tIndex+j]
        		tBound1.value = tBound2.value
        		tBound1.proxyId = tBound2.proxyId
        		tBound1.stabbingCount = tBound2.stabbingCount

        	# The upper index has increased because of the lower bound insertion.
        	++upperIndex

        	# Copy in the new bounds.
        	bounds[lowerIndex].value = lowerValues[axis]
        	bounds[lowerIndex].proxyId = proxyId
        	bounds[upperIndex].value = upperValues[axis]
        	bounds[upperIndex].proxyId = proxyId

        	bounds[lowerIndex].stabbingCount = if lowerIndex == 0 then 0 else bounds[lowerIndex-1].stabbingCount
        	bounds[upperIndex].stabbingCount = bounds[upperIndex-1].stabbingCount

        	# Adjust the stabbing count between the new bounds.
        	index = lowerIndex
        	while index < upperIndex
        	    bounds[index].stabbingCount++
        	    ++index

        	# Adjust the all the affected bound indices.
        	index = lowerIndex
        	while index < boundCount + 2
        		proxy2 = @m_proxyPool[ bounds[index].proxyId ]
        		if (bounds[index].IsLower())
        			proxy2.lowerBounds[axis] = index
        		else
        			proxy2.upperBounds[axis] = index
        		++index

        ++@m_proxyCount

        for i in [0...@m_queryResultCount]
        	@m_pairManager.AddBufferedPair(proxyId, @m_queryResults[i])

        @m_pairManager.Commit()

        # Prepare for next query.
        @m_queryResultCount = 0
        @IncrementTimeStamp()

        return proxyId

    
    Commit: () -> @m_pairManager.Commit()

    ComputeBounds: (lowerValues, upperValues, aabb) ->
        minVertexX = aabb.minVertex.x
        minVertexY = aabb.minVertex.y
        minVertexX = b2Math.b2Min(minVertexX, @m_worldAABB.maxVertex.x)
        minVertexY = b2Math.b2Min(minVertexY, @m_worldAABB.maxVertex.y)
        minVertexX = b2Math.b2Max(minVertexX, @m_worldAABB.minVertex.x)
        minVertexY = b2Math.b2Max(minVertexY, @m_worldAABB.minVertex.y)

        maxVertexX = aabb.maxVertex.x
        maxVertexY = aabb.maxVertex.y
        maxVertexX = b2Math.b2Min(maxVertexX, @m_worldAABB.maxVertex.x)
        maxVertexY = b2Math.b2Min(maxVertexY, @m_worldAABB.maxVertex.y)
        maxVertexX = b2Math.b2Max(maxVertexX, @m_worldAABB.minVertex.x)
        maxVertexY = b2Math.b2Max(maxVertexY, @m_worldAABB.minVertex.y)

        # Bump lower bounds downs and upper bounds up. This ensures correct sorting of
        # lower/upper bounds that would have equal values.
        # TODO_ERIN implement fast float to uint16 conversion.
        lowerValues[0] = (@m_quantizationFactor.x * (minVertexX - @m_worldAABB.minVertex.x)) & (b2Settings.USHRT_MAX - 1)
        upperValues[0] = ((@m_quantizationFactor.x * (maxVertexX - @m_worldAABB.minVertex.x))& 0x0000ffff) | 1

        lowerValues[1] = (@m_quantizationFactor.y * (minVertexY - @m_worldAABB.minVertex.y)) & (b2Settings.USHRT_MAX - 1)
        upperValues[1] = ((@m_quantizationFactor.y * (maxVertexY - @m_worldAABB.minVertex.y))& 0x0000ffff) | 1

    Query: (lowerQueryOut, upperQueryOut, lowerValue, upperValue, bounds, boundCount, axis) ->
        lowerQuery = b2BroadPhase.BinarySearch(bounds, boundCount, lowerValue)
        upperQuery = b2BroadPhase.BinarySearch(bounds, boundCount, upperValue)

        # Easy case: lowerQuery <= lowerIndex(i) < upperQuery
        # Solution: search query range for min bounds.
        j = lowerQuery
        while j < upperQuery
            @IncrementOverlapCount(bounds[j].proxyId) if (bounds[j].IsLower())
            ++j

        # Hard case: lowerIndex(i) < lowerQuery < upperIndex(i)
        # Solution: use the stabbing count to search down the bound array.
        if (lowerQuery > 0)
            i = lowerQuery - 1
            s = bounds[i].stabbingCount

            # Find the s overlaps.
            while (s)
                if (bounds[i].IsLower())
                    proxy = @m_proxyPool[ bounds[i].proxyId ]
                    if (lowerQuery <= proxy.upperBounds[axis])
                        @IncrementOverlapCount(bounds[i].proxyId)
                        --s
                --i

        lowerQueryOut[0] = lowerQuery
        upperQueryOut[0] = upperQuery


    IncrementOverlapCount: (proxyId) ->
        proxy = this.m_proxyPool[ proxyId ]
        if (proxy.timeStamp < this.m_timeStamp)
            proxy.timeStamp = this.m_timeStamp
            proxy.overlapCount = 1
        else
            proxy.overlapCount = 2
            this.m_queryResults[this.m_queryResultCount] = proxyId
            ++this.m_queryResultCount


    IncrementTimeStamp: () ->
        if (this.m_timeStamp == b2Settings.USHRT_MAX)
            for i in [0...b2Settings.b2_maxProxies]
            	this.m_proxyPool[i].timeStamp = 0
            this.m_timeStamp = 1
        else
        	++this.m_timeStamp



b2BroadPhase.s_validate = false
b2BroadPhase.b2_invalid = b2Settings.USHRT_MAX
b2BroadPhase.b2_nullEdge = b2Settings.USHRT_MAX
b2BroadPhase.BinarySearch = (bounds, count, value) ->
		low = 0
		high = count - 1
		while low <= high
			mid = Math.floor((low + high) / 2)
			if bounds[mid].value > value
				high = mid - 1
			else if (bounds[mid].value < value)
				low = mid + 1
			else
				return (mid)
		return (low)
