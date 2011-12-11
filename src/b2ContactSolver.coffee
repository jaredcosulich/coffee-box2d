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


exports.b2ContactSolver = b2ContactSolver = class b2ContactSolver
    m_allocator: null
    m_constraints: new Array()
    m_constraintCount: 0

    constructor: () ->
        @m_constraints = new Array()

        @m_allocator = allocator

        @m_constraintCount = 0
        @m_constraintCount += contacts[i].GetManifoldCount() for i in [0...contactCount]
        
        # fill array
        @m_constraints[i] = new b2ContactConstraint() for i in [0...@m_constraintCount]

        for i in [0...contactCount]
        	contact = contacts[i]
        	b1 = contact.m_shape1.m_body
        	b2 = contact.m_shape2.m_body
        	manifoldCount = contact.GetManifoldCount()
        	manifolds = contact.GetManifolds()
        	friction = contact.m_friction
        	restitution = contact.m_restitution

        	v1X = b1.m_linearVelocity.x
        	v1Y = b1.m_linearVelocity.y
        	v2X = b2.m_linearVelocity.x
        	v2Y = b2.m_linearVelocity.y
        	w1 = b1.m_angularVelocity
        	w2 = b2.m_angularVelocity

        	for j in [0...manifoldCount]
        		manifold = manifolds[ j ]

        		normalX = manifold.normal.x
        		normalY = manifold.normal.y

        		c = @m_constraints[ count ]
        		c.body1 = b1
        		c.body2 = b2
        		c.manifold = manifold
        		c.normal.x = normalX
        		c.normal.y = normalY
        		c.pointCount = manifold.pointCount
        		c.friction = friction
        		c.restitution = restitution

        		for k in [0...c.pointCount]
        			cp = manifold.points[ k ]
        			ccp = c.points[ k ]

        			ccp.normalImpulse = cp.normalImpulse
        			ccp.tangentImpulse = cp.tangentImpulse
        			ccp.separation = cp.separation

        			r1X = cp.position.x - b1.m_position.x
        			r1Y = cp.position.y - b1.m_position.y
        			r2X = cp.position.x - b2.m_position.x
        			r2Y = cp.position.y - b2.m_position.y

        			tVec = ccp.localAnchor1
        			tMat = b1.m_R
        			tVec.x = r1X * tMat.col1.x + r1Y * tMat.col1.y
        			tVec.y = r1X * tMat.col2.x + r1Y * tMat.col2.y

        			tVec = ccp.localAnchor2
        			tMat = b2.m_R
        			tVec.x = r2X * tMat.col1.x + r2Y * tMat.col1.y
        			tVec.y = r2X * tMat.col2.x + r2Y * tMat.col2.y

        			r1Sqr = r1X * r1X + r1Y * r1Y
        			r2Sqr = r2X * r2X + r2Y * r2Y

        			rn1 = r1X*normalX + r1Y*normalY
        			rn2 = r2X*normalX + r2Y*normalY
        			kNormal = b1.m_invMass + b2.m_invMass
        			kNormal += b1.m_invI * (r1Sqr - rn1 * rn1) + b2.m_invI * (r2Sqr - rn2 * rn2)
        			ccp.normalMass = 1.0 / kNormal

        			tangentX = normalY
        			tangentY = -normalX

        			rt1 = r1X*tangentX + r1Y*tangentY
        			rt2 = r2X*tangentX + r2Y*tangentY
        			kTangent = b1.m_invMass + b2.m_invMass
        			kTangent += b1.m_invI * (r1Sqr - rt1 * rt1) + b2.m_invI * (r2Sqr - rt2 * rt2)
        			ccp.tangentMass = 1.0 /  kTangent

        			# Setup a velocity bias for restitution.
        			ccp.velocityBias = 0.0
        			ccp.velocityBias = -60.0 * ccp.separation if (ccp.separation > 0.0)
				
        			tX = v2X + (-w2*r2Y) - v1X - (-w1*r1Y)
        			tY = v2Y + (w2*r2X) - v1Y - (w1*r1X)
        			vRel = c.normal.x*tX + c.normal.y*tY
        			ccp.velocityBias += -c.restitution * vRel if (vRel < -b2Settings.b2_velocityThreshold)

        		++count
