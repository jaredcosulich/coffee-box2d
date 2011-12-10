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


# A convex polygon. The position of the polygon (m_position) is the
# position of the centroid. The vertices of the incoming polygon are pre-rotated
# according to the local rotation. The vertices are also shifted to be centered
# on the centroid. Since the local rotation is absorbed into the vertex
# coordinates, the polygon rotation is equal to the body rotation. However,
# the polygon position is centered on the polygon centroid. This simplifies
# some collision algorithms.


exports.b2PolyShape = b2PolyShape = class b2PolyShape extends b2Shape
    constructor: (def, body, newOrigin) ->
        @m_R = new b2Mat22()
        @m_position = new b2Vec2()

        # The constructor for b2Shape
        @m_userData = def.userData

        @m_friction = def.friction
        @m_restitution = def.restitution
        @m_body = body

        @m_proxyId = b2Pair.b2_nullProxy

        @m_maxRadius = 0.0

        @m_categoryBits = def.categoryBits
        @m_maskBits = def.maskBits
        @m_groupIndex = def.groupIndex


        # initialize instance variables for references
        @syncAABB = new b2AABB()
        @syncMat = new b2Mat22()
        @m_localCentroid = new b2Vec2()
        @m_localOBB = new b2OBB()

        aabb = new b2AABB()

        # Vertices
        @m_vertices = new Array(b2Settings.b2_maxPolyVertices)
        @m_coreVertices = new Array(b2Settings.b2_maxPolyVertices)

        # Normals
        @m_normals = new Array(b2Settings.b2_maxPolyVertices)

        @m_type = b2Shape.e_polyShape

        localR = new b2Mat22(def.localRotation)

        # Get the vertices transformed into the body frame.
        if def.type == b2Shape.e_boxShape
            @m_localCentroid.x = def.localPosition.x - newOrigin.x
            @m_localCentroid.y = def.localPosition.y - newOrigin.y

            box = def
            @m_vertexCount = 4
            hX = box.extents.x
            hY = box.extents.y

            hcX = Math.max(0.0, hX - 2.0 * b2Settings.b2_linearSlop)
            hcY = Math.max(0.0, hY - 2.0 * b2Settings.b2_linearSlop)

            tVec = @m_vertices[0] = new b2Vec2()
            tVec.x = localR.col1.x * hX + localR.col2.x * hY
            tVec.y = localR.col1.y * hX + localR.col2.y * hY
            tVec = @m_vertices[1] = new b2Vec2()
            tVec.x = localR.col1.x * -hX + localR.col2.x * hY
            tVec.y = localR.col1.y * -hX + localR.col2.y * hY
            tVec = @m_vertices[2] = new b2Vec2()
            tVec.x = localR.col1.x * -hX + localR.col2.x * -hY
            tVec.y = localR.col1.y * -hX + localR.col2.y * -hY
            tVec = @m_vertices[3] = new b2Vec2()
            tVec.x = localR.col1.x * hX + localR.col2.x * -hY
            tVec.y = localR.col1.y * hX + localR.col2.y * -hY

            tVec = @m_coreVertices[0] = new b2Vec2()
            tVec.x = localR.col1.x * hcX + localR.col2.x * hcY
            tVec.y = localR.col1.y * hcX + localR.col2.y * hcY
            tVec = @m_coreVertices[1] = new b2Vec2()
            tVec.x = localR.col1.x * -hcX + localR.col2.x * hcY
            tVec.y = localR.col1.y * -hcX + localR.col2.y * hcY
            tVec = @m_coreVertices[2] = new b2Vec2()
            tVec.x = localR.col1.x * -hcX + localR.col2.x * -hcY
            tVec.y = localR.col1.y * -hcX + localR.col2.y * -hcY
            tVec = @m_coreVertices[3] = new b2Vec2()
            tVec.x = localR.col1.x * hcX + localR.col2.x * -hcY
            tVec.y = localR.col1.y * hcX + localR.col2.y * -hcY
        else
            poly = def

            @m_vertexCount = poly.vertexCount
            b2Shape.PolyCentroid(poly.vertices, poly.vertexCount, b2PolyShape.tempVec)
            centroidX = b2PolyShape.tempVec.x
            centroidY = b2PolyShape.tempVec.y
            @m_localCentroid.x = def.localPosition.x + (localR.col1.x * centroidX + localR.col2.x * centroidY) - newOrigin.x
            @m_localCentroid.y = def.localPosition.y + (localR.col1.y * centroidX + localR.col2.y * centroidY) - newOrigin.y

            for i in [0...@m_vertexCount]
            	@m_vertices[i] = new b2Vec2()
            	@m_coreVertices[i] = new b2Vec2()

            	hX = poly.vertices[i].x - centroidX
            	hY = poly.vertices[i].y - centroidY
            	@m_vertices[i].x = localR.col1.x * hX + localR.col2.x * hY
            	@m_vertices[i].y = localR.col1.y * hX + localR.col2.y * hY

            	uX = @m_vertices[i].x
            	uY = @m_vertices[i].y
            	length = Math.sqrt(uX*uX + uY*uY)
            	if length > Number.MIN_VALUE
            		uX *= 1.0 / length
            		uY *= 1.0 / length

            	@m_coreVertices[i].x = @m_vertices[i].x - 2.0 * b2Settings.b2_linearSlop * uX
            	@m_coreVertices[i].y = @m_vertices[i].y - 2.0 * b2Settings.b2_linearSlop * uY

        # Compute bounding box. TODO_ERIN optimize OBB
        minVertexX = Number.MAX_VALUE
        minVertexY = Number.MAX_VALUE
        maxVertexX = -Number.MAX_VALUE
        maxVertexY = -Number.MAX_VALUE
        @m_maxRadius = 0.0
        for i in [0...@m_vertexCount]
        	v = @m_vertices[i]
        	minVertexX = Math.min(minVertexX, v.x)
        	minVertexY = Math.min(minVertexY, v.y)
        	maxVertexX = Math.max(maxVertexX, v.x)
        	maxVertexY = Math.max(maxVertexY, v.y)
        	@m_maxRadius = Math.max(@m_maxRadius, v.Length())

        @m_localOBB.R.SetIdentity()
        @m_localOBB.center.Set((minVertexX + maxVertexX) * 0.5, (minVertexY + maxVertexY) * 0.5)
        @m_localOBB.extents.Set((maxVertexX - minVertexX) * 0.5, (maxVertexY - minVertexY) * 0.5)

        # Compute the edge normals and next index map.
        i1 = 0
        i2 = 0
        for  i in [0...@m_vertexCount]
        	@m_normals[i] =  new b2Vec2()
        	i1 = i
        	i2 = if i + 1 < @m_vertexCount then i + 1 else 0
        	@m_normals[i].x = @m_vertices[i2].y - @m_vertices[i1].y
        	@m_normals[i].y = -(@m_vertices[i2].x - @m_vertices[i1].x)
        	@m_normals[i].Normalize()

        # Ensure the polygon in convex. TODO_ERIN compute convex hull.
        for i in [0...@m_vertexCount]
        	i1 = i
        	i2 = if i + 1 < @m_vertexCount then i + 1 else 0

        @m_R.SetM(@m_body.m_R)
        @m_position.x = @m_body.m_position.x + (@m_R.col1.x * @m_localCentroid.x + @m_R.col2.x * @m_localCentroid.y)
        @m_position.y = @m_body.m_position.y + (@m_R.col1.y * @m_localCentroid.x + @m_R.col2.y * @m_localCentroid.y)

        b2PolyShape.tAbsR.col1.x = @m_R.col1.x * @m_localOBB.R.col1.x + @m_R.col2.x * @m_localOBB.R.col1.y
        b2PolyShape.tAbsR.col1.y = @m_R.col1.y * @m_localOBB.R.col1.x + @m_R.col2.y * @m_localOBB.R.col1.y
        b2PolyShape.tAbsR.col2.x = @m_R.col1.x * @m_localOBB.R.col2.x + @m_R.col2.x * @m_localOBB.R.col2.y
        b2PolyShape.tAbsR.col2.y = @m_R.col1.y * @m_localOBB.R.col2.x + @m_R.col2.y * @m_localOBB.R.col2.y
        b2PolyShape.tAbsR.Abs()

        hX = b2PolyShape.tAbsR.col1.x * @m_localOBB.extents.x + b2PolyShape.tAbsR.col2.x * @m_localOBB.extents.y
        hY = b2PolyShape.tAbsR.col1.y * @m_localOBB.extents.x + b2PolyShape.tAbsR.col2.y * @m_localOBB.extents.y

        positionX = @m_position.x + (@m_R.col1.x * @m_localOBB.center.x + @m_R.col2.x * @m_localOBB.center.y)
        positionY = @m_position.y + (@m_R.col1.y * @m_localOBB.center.x + @m_R.col2.y * @m_localOBB.center.y)

        aabb.minVertex.x = positionX - hX
        aabb.minVertex.y = positionY - hY
        aabb.maxVertex.x = positionX + hX
        aabb.maxVertex.y = positionY + hY

        broadPhase = @m_body.m_world.m_broadPhase
        if broadPhase.InRange(aabb)
        	@m_proxyId = broadPhase.CreateProxy(aabb, @)
        else
        	@m_proxyId = b2Pair.b2_nullProxy

        if (@m_proxyId == b2Pair.b2_nullProxy)
        	@m_body.Freeze()


b2PolyShape.tempVec = new b2Vec2()
b2PolyShape.tAbsR = new b2Mat22()



