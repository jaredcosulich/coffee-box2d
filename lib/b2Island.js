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
var b2Island;
exports.b2Island = b2Island = b2Island = (function() {
  function b2Island(bodyCapacity, contactCapacity, jointCapacity, allocator) {
    var i;
    this.m_bodyCapacity = bodyCapacity;
    this.m_contactCapacity = contactCapacity;
    this.m_jointCapacity = jointCapacity;
    this.m_bodyCount = 0;
    this.m_contactCount = 0;
    this.m_jointCount = 0;
    this.m_bodies = new Array(bodyCapacity);
    for (i = 0; 0 <= bodyCapacity ? i < bodyCapacity : i > bodyCapacity; 0 <= bodyCapacity ? i++ : i--) {
      this.m_bodies[i] = null;
    }
    this.m_contacts = new Array(contactCapacity);
    for (i = 0; 0 <= contactCapacity ? i < contactCapacity : i > contactCapacity; 0 <= contactCapacity ? i++ : i--) {
      this.m_contacts[i] = null;
    }
    this.m_joints = new Array(jointCapacity);
    for (i = 0; 0 <= jointCapacity ? i < jointCapacity : i > jointCapacity; 0 <= jointCapacity ? i++ : i--) {
      this.m_joints[i] = null;
    }
    this.m_allocator = allocator;
  }
  return b2Island;
})();
b2Island.m_positionIterationCount = 0;