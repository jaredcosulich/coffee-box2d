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


exports.b2PairManager = b2PairManager = class b2PairManager
    constructor: () ->
        @m_hashTable = new Array(b2Pair.b2_tableCapacity)
        @m_hashTable[i] = b2Pair.b2_nullPair for i in [0...b2Pair.b2_tableCapacity]

        @m_pairs = new Array(b2Settings.b2_maxPairs)
        
        @m_pairs[i] = new b2Pair() for i in [0...b2Settings.b2_maxPairs]

        @m_pairBuffer = new Array(b2Settings.b2_maxPairs)
        @m_pairBuffer[i] = new b2BufferedPair() for i in [0...b2Settings.b2_maxPairs]

        for i in [0...b2Settings.b2_maxPairs]
        	@m_pairs[i].proxyId1 = b2Pair.b2_nullProxy
        	@m_pairs[i].proxyId2 = b2Pair.b2_nullProxy
        	@m_pairs[i].userData = null
        	@m_pairs[i].status = 0
        	@m_pairs[i].next = (i + 1)

        @m_pairs[b2Settings.b2_maxPairs-1].next = b2Pair.b2_nullPair
        @m_pairCount = 0
        
    Initialize: (broadPhase, callback) ->
        @m_broadPhase = broadPhase
        @m_callback = callback
    	
    # As proxies are created and moved, many pairs are created and destroyed. Even worse, the same
    # pair may be added and removed multiple times in a single time step of the physics engine. To reduce
    # traffic in the pair manager, we try to avoid destroying pairs in the pair manager until the
    # end of the physics step. @ is done by buffering all the @RemovePair requests. @AddPair
    # requests are processed immediately because we need the hash table entry for quick lookup.
    # 
    # All user user callbacks are delayed until the buffered pairs are confirmed in @Commit.
    # @ is very important because the user callbacks may be very expensive and client logic
    # may be harmed if pairs are added and removed within the same time step.
    # 
    # Buffer a pair for addition.
    # We may add a pair that is not in the pair manager or pair buffer.
    # We may add a pair that is already in the pair manager and pair buffer.
    # If the added pair is not a new pair, then it must be in the pair buffer (because @RemovePair was called).
    AddBufferedPair: (proxyId1, proxyId2) ->
    	pair = @AddPair(proxyId1, proxyId2)

    	# If @ pair is not in the pair buffer ...
    	if pair.IsBuffered() == false
    		pair.SetBuffered()
    		@m_pairBuffer[@m_pairBufferCount].proxyId1 = pair.proxyId1
    		@m_pairBuffer[@m_pairBufferCount].proxyId2 = pair.proxyId2
    		++@m_pairBufferCount

    	# Confirm @ pair for the subsequent call to @Commit.
    	pair.ClearRemoved()

    	@ValidateBuffer() if b2BroadPhase.s_validate


    Commit: () ->
        removeCount = 0

        proxies = @m_broadPhase.m_proxyPool

        for i in [0...@m_pairBufferCount]
            pair = @Find(@m_pairBuffer[i].proxyId1, @m_pairBuffer[i].proxyId2)
            pair.ClearBuffered()

            proxy1 = proxies[ pair.proxyId1 ]
            proxy2 = proxies[ pair.proxyId2 ]

            if pair.IsRemoved()
            	# It is possible a pair was added then removed before a commit. Therefore,
            	# we should be careful not to tell the user the pair was removed when the
            	# the user didn't receive a matching add.
            	@m_callback.PairRemoved(proxy1.userData, proxy2.userData, pair.userData) if pair.IsFinal() == true

            	# Store the ids so we can actually remove the pair below.
            	@m_pairBuffer[removeCount].proxyId1 = pair.proxyId1
            	@m_pairBuffer[removeCount].proxyId2 = pair.proxyId2
            	++removeCount
            else
            	if pair.IsFinal() == false
            		pair.userData = @m_callback.PairAdded(proxy1.userData, proxy2.userData)
            		pair.SetFinal()

        @RemovePair(@m_pairBuffer[i].proxyId1, @m_pairBuffer[i].proxyId2) for i in [0...removeCount]

        @m_pairBufferCount = 0

        @ValidateTable() if b2BroadPhase.s_validate


