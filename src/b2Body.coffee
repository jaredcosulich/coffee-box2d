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



# A rigid body. Internal computation are done in terms
# of the center of mass position. The center of mass may
# be offset from the body's origin.

exports.b2Body = b2Body = class b2Body
    constructor: (bd, world) ->
        @sMat0 = new b2Mat22()
        @m_position = new b2Vec2()
        @m_R = new b2Mat22(0)
        @m_position0 = new b2Vec2()

        @m_flags = 0
        @m_position.SetV( bd.position )
        @m_rotation = bd.rotation
        @m_R.Set(@m_rotation)
        @m_position0.SetV(@m_position)
        @m_rotation0 = @m_rotation
        @m_world = world

        @m_linearDamping = b2Math.b2Clamp(1.0 - bd.linearDamping, 0.0, 1.0)
        @m_angularDamping = b2Math.b2Clamp(1.0 - bd.angularDamping, 0.0, 1.0)

        @m_force = new b2Vec2(0.0, 0.0)
        @m_torque = 0.0

        @m_mass = 0.0

        massDatas = new Array(b2Settings.b2_maxShapesPerBody)
        massDatas[i] = new b2MassData() for i in [0...b2Settings.b2_maxShapesPerBody]

        # Compute the shape mass properties, the bodies total mass and COM.
        @m_shapeCount = 0
        @m_center = new b2Vec2(0.0, 0.0)
        for i in [0...b2Settings.b2_maxShapesPerBody]
        	sd = bd.shapes[i]
        	break if (sd == null) 
        	massData = massDatas[ i ]
        	sd.ComputeMass(massData)
        	@m_mass += massData.mass
        	@m_center.x += massData.mass * (sd.localPosition.x + massData.center.x)
        	@m_center.y += massData.mass * (sd.localPosition.y + massData.center.y)
        	++@m_shapeCount

        # Compute center of mass, and shift the origin to the COM.
        if @m_mass > 0.0
        	@m_center.Multiply( 1.0 / @m_mass )
        	@m_position.Add( b2Math.b2MulMV(@m_R, @m_center) )
        else
        	@m_flags |= b2Body.e_staticFlag

        # Compute the moment of inertia.
        @m_I = 0.0
        for i in [0...@m_shapeCount]
        	sd = bd.shapes[i]
        	massData = massDatas[ i ]
        	@m_I += massData.I
        	r = b2Math.SubtractVV( b2Math.AddVV(sd.localPosition, massData.center), @m_center )
        	@m_I += massData.mass * b2Math.b2Dot(r, r)

        if @m_mass > 0.0
        	@m_invMass = 1.0 / @m_mass
        else
        	@m_invMass = 0.0

        if @m_I > 0.0 && bd.preventRotation == false
        	@m_invI = 1.0 / @m_I
        else
        	@m_I = 0.0
        	@m_invI = 0.0

        # Compute the center of mass velocity.
        @m_linearVelocity = b2Math.AddVV(bd.linearVelocity, b2Math.b2CrossFV(bd.angularVelocity, @m_center))
        @m_angularVelocity = bd.angularVelocity

        @m_jointList = null
        @m_contactList = null
        @m_prev = null
        @m_next = null

        # Create the shapes.
        @m_shapeList = null
        for i in [0...@m_shapeCount]
        	sd = bd.shapes[i]
        	shape = b2Shape.Create(sd, @, @m_center)
        	shape.m_next = @m_shapeList
        	@m_shapeList = shape

        @m_sleepTime = 0.0
        @m_flags |= b2Body.e_allowSleepFlag if bd.allowSleep 

        @m_flags |= b2Body.e_sleepFlag if bd.isSleeping 

        if (@m_flags & b2Body.e_sleepFlag) || @m_invMass == 0.0
        	@m_linearVelocity.Set(0.0, 0.0)
        	@m_angularVelocity = 0.0

        @m_userData = bd.userData
        
        
    # Get the list of all shapes attached to this body.
    GetShapeList: () -> return @m_shapeList




    Freeze: () ->
        @m_flags |= b2Body.e_frozenFlag
        @m_linearVelocity.SetZero()
        @m_angularVelocity = 0.0

        s = @m_shapeList
        while s?
            s.DestroyProxy()
            s = s.m_next


    m_flags: 0

    m_position: new b2Vec2()
    m_rotation: null
    m_R: new b2Mat22(0)

    #Conservative advancement data.
    m_position0: new b2Vec2()
    m_rotation0: null

    m_linearVelocity: null
    m_angularVelocity: null

    m_force: null
    m_torque: null

    m_center: null

    m_world: null
    m_prev: null
    m_next: null

    m_shapeList: null
    m_shapeCount: 0

    m_jointList: null
    m_contactList: null

    m_mass: null
    m_invMass: null
    m_I: null
    m_invI: null

    m_linearDamping: null
    m_angularDamping: null

    m_sleepTime: null

    m_userData: null
	
	
b2Body.e_staticFlag = 0x0001
b2Body.e_frozenFlag = 0x0002
b2Body.e_islandFlag = 0x0004
b2Body.e_sleepFlag = 0x0008
b2Body.e_allowSleepFlag = 0x0010
b2Body.e_destroyFlag = 0x0020


