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


exports.b2Pair = b2Pair = class b2Pair
    SetBuffered: ()	-> @status |= b2Pair.e_pairBuffered 
    ClearBuffered: () -> @status &= ~b2Pair.e_pairBuffered	
    IsBuffered: () -> (@status & b2Pair.e_pairBuffered) == b2Pair.e_pairBuffered

    SetRemoved: () -> @status |= b2Pair.e_pairRemoved
    ClearRemoved: () -> @status &= ~b2Pair.e_pairRemoved
    IsRemoved: () -> (@status & b2Pair.e_pairRemoved) == b2Pair.e_pairRemoved

    SetFinal: () -> @status |= b2Pair.e_pairFinal
    IsFinal: () -> (@status & b2Pair.e_pairFinal) == b2Pair.e_pairFinal

    userData: null
    proxyId1: 0
    proxyId2: 0
    next: 0
    status: 0
    
b2Pair.b2_nullPair = b2Settings.USHRT_MAX
b2Pair.b2_nullProxy = b2Settings.USHRT_MAX
b2Pair.b2_tableCapacity = b2Settings.b2_maxPairs
b2Pair.b2_tableMask = b2Pair.b2_tableCapacity - 1
b2Pair.e_pairBuffered = 0x0001
b2Pair.e_pairRemoved = 0x0002
b2Pair.e_pairFinal = 0x0004


###
var b2Pair = Class.create()
b2Pair.prototype = 
{


	SetBuffered: function()	{ @status |= b2Pair.e_pairBuffered },
	ClearBuffered: function()	{ @status &= ~b2Pair.e_pairBuffered },
	IsBuffered: function(){ return (@status & b2Pair.e_pairBuffered) == b2Pair.e_pairBuffered },

	SetRemoved: function()		{ @status |= b2Pair.e_pairRemoved },
	ClearRemoved: function()	{ @status &= ~b2Pair.e_pairRemoved },
	IsRemoved: function(){ return (@status & b2Pair.e_pairRemoved) == b2Pair.e_pairRemoved },

	SetFinal: function()		{ @status |= b2Pair.e_pairFinal },
	IsFinal: function(){ return (@status & b2Pair.e_pairFinal) == b2Pair.e_pairFinal },

	userData: null,
	proxyId1: 0,
	proxyId2: 0,
	next: 0,
	status: 0,

	// STATIC

	// enum

	initialize: function() {}}
b2Pair.b2_nullPair = b2Settings.USHRT_MAX
b2Pair.b2_nullProxy = b2Settings.USHRT_MAX
b2Pair.b2_tableCapacity = b2Settings.b2_maxPairs
b2Pair.b2_tableMask = b2Pair.b2_tableCapacity - 1
b2Pair.e_pairBuffered = 0x0001
b2Pair.e_pairRemoved = 0x0002
b2Pair.e_pairFinal = 0x0004