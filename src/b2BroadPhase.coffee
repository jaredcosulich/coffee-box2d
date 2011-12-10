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

    # Use @ to see if your proxy is in range. If it is not in range,
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
    
    Commit: () -> @m_pairManager.Commit()

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
