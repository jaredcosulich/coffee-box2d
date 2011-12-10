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


exports.b2Shape = b2Shape = class b2Shape
    constructor: (def, body) ->
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

    TestPoint: (p) -> return false

    GetUserData: () -> return @m_userData

    GetType: () -> return @m_type
    
    # Get the parent body of this shape.
    GetBody: () -> return @m_body
    
    GetPosition: () -> return @m_position
    
    GetRotationMatrix: () -> return @m_R
    
    # Remove and then add proxy from the broad-phase.
    # this is used to refresh the collision filters.
    ResetProxy: (broadPhase) ->

    # Get the next shape in the parent body's shape list.
    GetNext: () -> return @m_next
    

        
b2Shape.Create = (def, body, center) ->
    switch def.type
        when b2Shape.e_circleShape
            new b2CircleShape(def, body, center)
        when b2Shape.e_boxShape, b2Shape.e_polyShape
            new b2PolyShape(def, body, center)
        else 
            null

b2Shape.e_unknownShape = -1
b2Shape.e_circleShape = 0
b2Shape.e_boxShape = 1
b2Shape.e_polyShape = 2
b2Shape.e_meshShape = 3
b2Shape.e_shapeTypeCount = 4

