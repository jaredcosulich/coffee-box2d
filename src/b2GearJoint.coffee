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


exports.b2GearJoint = b2GearJoint = class b2GearJoint extends b2Joint
    constructor: () ->
        @m_node1 = new b2JointNode()
        @m_node2 = new b2JointNode()

        @m_type = def.type
        @m_prev = null
        @m_next = null
        @m_body1 = def.body1
        @m_body2 = def.body2
        @m_collideConnected = def.collideConnected
        @m_islandFlag = false
        @m_userData = def.userData

        @m_groundAnchor1 = new b2Vec2()
        @m_groundAnchor2 = new b2Vec2()
        @m_localAnchor1 = new b2Vec2()
        @m_localAnchor2 = new b2Vec2()
        @m_J = new b2Jacobian()

        @m_revolute1 = null
        @m_prismatic1 = null
        @m_revolute2 = null
        @m_prismatic2 = null

        @m_ground1 = def.joint1.m_body1
        @m_body1 = def.joint1.m_body2
        if (def.joint1.m_type == b2Joint.e_revoluteJoint)
        	@m_revolute1 = def.joint1
        	@m_groundAnchor1.SetV( @m_revolute1.m_localAnchor1 )
        	@m_localAnchor1.SetV( @m_revolute1.m_localAnchor2 )
        	coordinate1 = @m_revolute1.GetJointAngle()
        else
        	@m_prismatic1 = def.joint1
        	@m_groundAnchor1.SetV( @m_prismatic1.m_localAnchor1 )
        	@m_localAnchor1.SetV( @m_prismatic1.m_localAnchor2 )
        	coordinate1 = @m_prismatic1.GetJointTranslation()

        @m_ground2 = def.joint2.m_body1
        @m_body2 = def.joint2.m_body2
        if (def.joint2.m_type == b2Joint.e_revoluteJoint)
        	@m_revolute2 = def.joint2
        	@m_groundAnchor2.SetV( @m_revolute2.m_localAnchor1 )
        	@m_localAnchor2.SetV( @m_revolute2.m_localAnchor2 )
        	coordinate2 = @m_revolute2.GetJointAngle()
        else
        	@m_prismatic2 = def.joint2
        	@m_groundAnchor2.SetV( @m_prismatic2.m_localAnchor1 )
        	@m_localAnchor2.SetV( @m_prismatic2.m_localAnchor2 )
        	coordinate2 = @m_prismatic2.GetJointTranslation()

        @m_ratio = def.ratio

        @m_constant = coordinate1 + @m_ratio * coordinate2

        @m_impulse = 0.0
       
    GetAnchor1: () ->
    	tMat = @m_body1.m_R
    	return new b2Vec2(
            (@m_body1.m_position.x + (tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y)),
            (@m_body1.m_position.y + (tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y))
        )
    
    GetAnchor2: () ->
        tMat = @m_body2.m_R
        return new b2Vec2(
            (@m_body2.m_position.x + (tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y)),
            (@m_body2.m_position.y + (tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y))
        )

    GetReactionForce: (invTimeStep) -> return new b2Vec2()

    GetReactionTorque: (invTimeStep) -> return 0.0

    GetRatio: () -> return @m_ratio

    PrepareVelocitySolver: () ->
    	g1 = @m_ground1
    	g2 = @m_ground2
    	b1 = @m_body1
    	b2 = @m_body2
    	
    	K = 0.0
    	@m_J.SetZero()

    	if @m_revolute1
            @m_J.angular1 = -1.0
            K += b1.m_invI
    	else
            tMat = g1.m_R
            tVec = @m_prismatic1.m_localXAxis1
            ugX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y
            ugY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y
            tMat = b1.m_R
            rX = tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y
            rY = tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y
            crug = rX * ugY - rY * ugX
            @m_J.linear1.Set(-ugX, -ugY)
            @m_J.angular1 = -crug
            K += b1.m_invMass + b1.m_invI * crug * crug

    	if @m_revolute2
    		@m_J.angular2 = -@m_ratio
    		K += @m_ratio * @m_ratio * b2.m_invI
    	else
    		tMat = g2.m_R
    		tVec = @m_prismatic2.m_localXAxis1
    		ugX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y
    		ugY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y
    		tMat = b2.m_R
    		rX = tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y
    		rY = tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y
    		crug = rX * ugY - rY * ugX
    		@m_J.linear2.Set(-@m_ratio*ugX, -@m_ratio*ugY)
    		@m_J.angular2 = -@m_ratio * crug
    		K += @m_ratio * @m_ratio * (b2.m_invMass + b2.m_invI * crug * crug)

    	# Compute effective mass.
    	@m_mass = 1.0 / K

    	# Warm starting.
    	b1.m_linearVelocity.x += b1.m_invMass * @m_impulse * @m_J.linear1.x
    	b1.m_linearVelocity.y += b1.m_invMass * @m_impulse * @m_J.linear1.y
    	b1.m_angularVelocity += b1.m_invI * @m_impulse * @m_J.angular1
    	b2.m_linearVelocity.x += b2.m_invMass * @m_impulse * @m_J.linear2.x
    	b2.m_linearVelocity.y += b2.m_invMass * @m_impulse * @m_J.linear2.y
    	b2.m_angularVelocity += b2.m_invI * @m_impulse * @m_J.angular2

    SolveVelocityConstraints: (step) ->
        b1 = @m_body1
        b2 = @m_body2

        Cdot = @m_J.Compute(b1.m_linearVelocity, b1.m_angularVelocity, b2.m_linearVelocity, b2.m_angularVelocity)

        impulse = -@m_mass * Cdot
        @m_impulse += impulse

        b1.m_linearVelocity.x += b1.m_invMass * impulse * @m_J.linear1.x
        b1.m_linearVelocity.y += b1.m_invMass * impulse * @m_J.linear1.y
        b1.m_angularVelocity  += b1.m_invI * impulse * @m_J.angular1
        b2.m_linearVelocity.x += b2.m_invMass * impulse * @m_J.linear2.x
        b2.m_linearVelocity.y += b2.m_invMass * impulse * @m_J.linear2.y
        b2.m_angularVelocity  += b2.m_invI * impulse * @m_J.angular2

    SolvePositionConstraints: () ->
    	linearError = 0.0

    	b1 = @m_body1
    	b2 = @m_body2

    	if (@m_revolute1)
    		coordinate1 = @m_revolute1.GetJointAngle()
    	else
    		coordinate1 = @m_prismatic1.GetJointTranslation()
    	
    	if (@m_revolute2)
    		coordinate2 = @m_revolute2.GetJointAngle()
    	else
    		coordinate2 = @m_prismatic2.GetJointTranslation()
    	
    	C = @m_constant - (coordinate1 + @m_ratio * coordinate2)

    	impulse = -@m_mass * C

    	b1.m_position.x += b1.m_invMass * impulse * @m_J.linear1.x
    	b1.m_position.y += b1.m_invMass * impulse * @m_J.linear1.y
    	b1.m_rotation += b1.m_invI * impulse * @m_J.angular1
    	b2.m_position.x += b2.m_invMass * impulse * @m_J.linear2.x
    	b2.m_position.y += b2.m_invMass * impulse * @m_J.linear2.y
    	b2.m_rotation += b2.m_invI * impulse * @m_J.angular2
    	b1.m_R.Set(b1.m_rotation)
    	b2.m_R.Set(b2.m_rotation)

    	return linearError < b2Settings.b2_linearSlop


    m_ground1: null
    m_ground2: null

    # One of these is NULL.
    m_revolute1: null
    m_prismatic1: null

    # One of these is NULL.
    m_revolute2: null
    m_prismatic2: null

    m_groundAnchor1: new b2Vec2()
    m_groundAnchor2: new b2Vec2()

    m_localAnchor1: new b2Vec2()
    m_localAnchor2: new b2Vec2()

    m_J: new b2Jacobian()

    m_constant: null
    m_ratio: null

    # Effective mass
    m_mass: null

    # Impulse for accumulation/warm starting.
    m_impulse: null

