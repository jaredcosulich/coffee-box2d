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



exports.b2CircleShape = b2CircleShape = class b2CircleShape extends b2Shape
    constructor: (def, body, localCenter) ->
        @m_R = new b2Mat22()
        @m_position = new b2Vec2()

        @m_userData = def.userData

        @m_friction = def.friction
        @m_restitution = def.restitution
        @m_body = body

        @m_proxyId = b2Pair.b2_nullProxy

        @m_maxRadius = 0.0

        @m_categoryBits = def.categoryBits
        @m_maskBits = def.maskBits
        @m_groupIndex = def.groupIndex

        @m_localPosition = new b2Vec2()

        circle = def

        @m_localPosition.Set(def.localPosition.x - localCenter.x, def.localPosition.y - localCenter.y)
        @m_type = b2Shape.e_circleShape
        @m_radius = circle.radius

        @m_R.SetM(@m_body.m_R)
        rX = @m_R.col1.x * @m_localPosition.x + @m_R.col2.x * @m_localPosition.y
        rY = @m_R.col1.y * @m_localPosition.x + @m_R.col2.y * @m_localPosition.y
        
        @m_position.x = @m_body.m_position.x + rX
        @m_position.y = @m_body.m_position.y + rY
        @m_maxRadius = Math.sqrt(rX*rX+rY*rY) + @m_radius

        aabb = new b2AABB()
        aabb.minVertex.Set(@m_position.x - @m_radius, @m_position.y - @m_radius)
        aabb.maxVertex.Set(@m_position.x + @m_radius, @m_position.y + @m_radius)

        broadPhase = @m_body.m_world.m_broadPhase
        if broadPhase.InRange(aabb)
            @m_proxyId = broadPhase.CreateProxy(aabb, @)
        else
        	@m_proxyId = b2Pair.b2_nullProxy

        @m_body.Freeze() if @m_proxyId == b2Pair.b2_nullProxy
        
