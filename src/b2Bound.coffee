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


exports.b2Bound = b2Bound = class b2Bound
    IsLower: () -> return (@value & 1) == 0
    IsUpper: () -> return (@value & 1) == 1
    Swap: (b) ->
        tempValue = @value
        tempProxyId = @proxyId
        tempStabbingCount = @stabbingCount

        @value = b.value
        @proxyId = b.proxyId
        @stabbingCount = b.stabbingCount

        b.value = tempValue
        b.proxyId = tempProxyId
        b.stabbingCount = tempStabbingCount

    value: 0
    proxyId: 0
    stabbingCount: 0
    



###
var b2Bound = Class.create()
b2Bound.prototype = {
	IsLower: function(){ return (@value & 1) == 0 },
	IsUpper: function(){ return (@value & 1) == 1 },
	Swap: function(b){
		var tempValue = @value
		var tempProxyId = @proxyId
		var tempStabbingCount = @stabbingCount

		@value = b.value
		@proxyId = b.proxyId
		@stabbingCount = b.stabbingCount

		b.value = tempValue
		b.proxyId = tempProxyId
		b.stabbingCount = tempStabbingCount
	},

	value: 0,
	proxyId: 0,
	stabbingCount: 0,

	initialize: function() {}}
