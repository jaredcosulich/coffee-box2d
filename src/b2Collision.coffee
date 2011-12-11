exports.b2Collision = b2Collision = class b2Collision
    # Null Feature
    #
    # Find the separation between poly1 and poly2 for a give edge normal on poly1.
    #
    # Find the max separation between poly1 and poly2 using edge normals
    # from poly1.
    #
    # Find edge normal of max separation on A - return if separating axis is found
    # Find edge normal of max separation on B - return if separation axis is found
    # Choose reference edge(minA, minB)
    # Find incident edge
    # Clip
    # The normal points from 1 to 2
       
b2Collision.b2_nullFeature = 0x000000ff
b2Collision.ClipSegmentToLine = (vOut, vIn, normal, offset) ->
    # Start with no output points
    numOut = 0

    vIn0 = vIn[0].v
    vIn1 = vIn[1].v

    # Calculate the distance of end points to the line
    distance0 = b2Math.b2Dot(normal, vIn[0].v) - offset
    distance1 = b2Math.b2Dot(normal, vIn[1].v) - offset

    # If the points are behind the plane
    vOut[numOut++] = vIn[0] if (distance0 <= 0.0)
    vOut[numOut++] = vIn[1] if (distance1 <= 0.0)

    # If the points are on different sides of the plane
    if (distance0 * distance1 < 0.0)
        # Find intersection point of edge and plane
        interp = distance0 / (distance0 - distance1)
        # expanded for performance
        tVec = vOut[numOut].v
        tVec.x = vIn0.x + interp * (vIn1.x - vIn0.x)
        tVec.y = vIn0.y + interp * (vIn1.y - vIn0.y)
    
        if (distance0 > 0.0)
            vOut[numOut].id = vIn[0].id
        else
            vOut[numOut].id = vIn[1].id
        ++numOut

    return numOut

b2Collision.b2CollidePolyTempVec = new b2Vec2()

