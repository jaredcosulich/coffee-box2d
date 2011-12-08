/**
 * Copyright 2010 Josh Adell. All rights reserved.
 *
 * Based on Box2d2 -  Jonas Wagner
 *   http://29a.ch/2010/4/17/box2d-2-flash-ported-javascript
 *
 * This software is provided 'as-is', without any express or
 * implied warranty. In no event will the authors be held liable 
 * for any damages arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose, 
 * including commercial applications, and to alter it and redistribute 
 * it freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you 
 *       must not claim that you wrote the original software. If you 
 *       use this software in a product, an acknowledgment in the product 
 *       documentation would be appreciated but is not required.
 *
 *    2. Altered source versions must be plainly marked as such, and must 
 *       not be misrepresented as being the original software.
 *
 *    3. This notice may not be removed or altered from any source 
 *       distribution.
 */

function extend(a, b) {
    for(var c in b) {
        a[c] = b[c];
    }
}


var b2Settings = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2Settings.prototype.__constructor = function(){}
b2Settings.prototype.__varz = function(){
}
b2Settings.USHRT_MAX =  0x0000ffff;
b2Settings.b2_pi =  Math.PI;
b2Settings.b2_maxManifoldPoints =  2;
b2Settings.b2_maxPolygonVertices =  8;
b2Settings.b2_maxProxies =  512;
b2Settings.b2_maxPairs =  8 * b2Settings.b2_maxProxies;
b2Settings.b2_linearSlop =  0.005;
b2Settings.b2_angularSlop =  2.0 / 180.0 * b2Settings.b2_pi;
b2Settings.b2_toiSlop =  8.0 * b2Settings.b2_linearSlop;
b2Settings.b2_maxTOIContactsPerIsland =  32;
b2Settings.b2_velocityThreshold =  1.0;
b2Settings.b2_maxLinearCorrection =  0.2;
b2Settings.b2_maxAngularCorrection =  8.0 / 180.0 * b2Settings.b2_pi;
b2Settings.b2_maxLinearVelocity =  200.0;
b2Settings.b2_maxLinearVelocitySquared =  b2Settings.b2_maxLinearVelocity * b2Settings.b2_maxLinearVelocity;
b2Settings.b2_maxAngularVelocity =  250.0;
b2Settings.b2_maxAngularVelocitySquared =  b2Settings.b2_maxAngularVelocity * b2Settings.b2_maxAngularVelocity;
b2Settings.b2_contactBaumgarte =  0.2;
b2Settings.b2_timeToSleep =  0.5;
b2Settings.b2_linearSleepTolerance =  0.01;
b2Settings.b2_angularSleepTolerance =  2.0 / 180.0;
b2Settings.b2Assert = function (a) {
		if (!a){
			var nullVec;
			nullVec.x++;
		}
	}
exports.b2Settings = b2Settings;