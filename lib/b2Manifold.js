/*
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
*/
var b2Manifold;
exports.b2Manifold = b2Manifold = b2Manifold = (function() {
  b2Manifold.prototype.points = null;
  b2Manifold.prototype.normal = null;
  b2Manifold.prototype.pointCount = 0;
  function b2Manifold() {
    var i, _ref;
    this.points = new Array(b2Settings.b2_maxManifoldPoints);
    for (i = 0, _ref = b2Settings.b2_maxManifoldPoints; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      this.points[i] = new b2ContactPoint();
    }
    this.normal = new b2Vec2();
  }
  return b2Manifold;
})();