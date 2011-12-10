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
var b2PairManager;
exports.b2PairManager = b2PairManager = b2PairManager = (function() {
  function b2PairManager() {
    var i, _ref, _ref2, _ref3, _ref4;
    this.m_hashTable = new Array(b2Pair.b2_tableCapacity);
    for (i = 0, _ref = b2Pair.b2_tableCapacity; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      this.m_hashTable[i] = b2Pair.b2_nullPair;
    }
    this.m_pairs = new Array(b2Settings.b2_maxPairs);
    for (i = 0, _ref2 = b2Settings.b2_maxPairs; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
      this.m_pairs[i] = new b2Pair();
    }
    this.m_pairBuffer = new Array(b2Settings.b2_maxPairs);
    for (i = 0, _ref3 = b2Settings.b2_maxPairs; 0 <= _ref3 ? i < _ref3 : i > _ref3; 0 <= _ref3 ? i++ : i--) {
      this.m_pairBuffer[i] = new b2BufferedPair();
    }
    for (i = 0, _ref4 = b2Settings.b2_maxPairs; 0 <= _ref4 ? i < _ref4 : i > _ref4; 0 <= _ref4 ? i++ : i--) {
      this.m_pairs[i].proxyId1 = b2Pair.b2_nullProxy;
      this.m_pairs[i].proxyId2 = b2Pair.b2_nullProxy;
      this.m_pairs[i].userData = null;
      this.m_pairs[i].status = 0;
      this.m_pairs[i].next = i + 1;
    }
    this.m_pairs[b2Settings.b2_maxPairs - 1].next = b2Pair.b2_nullPair;
    this.m_pairCount = 0;
  }
  b2PairManager.prototype.Initialize = function(broadPhase, callback) {
    this.m_broadPhase = broadPhase;
    return this.m_callback = callback;
  };
  b2PairManager.prototype.AddBufferedPair = function(proxyId1, proxyId2) {
    var pair;
    pair = this.AddPair(proxyId1, proxyId2);
    if (pair.IsBuffered() === false) {
      pair.SetBuffered();
      this.m_pairBuffer[this.m_pairBufferCount].proxyId1 = pair.proxyId1;
      this.m_pairBuffer[this.m_pairBufferCount].proxyId2 = pair.proxyId2;
      ++this.m_pairBufferCount;
    }
    pair.ClearRemoved();
    if (b2BroadPhase.s_validate) {
      return this.ValidateBuffer();
    }
  };
  b2PairManager.prototype.Commit = function() {
    var i, pair, proxies, proxy1, proxy2, removeCount, _ref;
    removeCount = 0;
    proxies = this.m_broadPhase.m_proxyPool;
    for (i = 0, _ref = this.m_pairBufferCount; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      pair = this.Find(this.m_pairBuffer[i].proxyId1, this.m_pairBuffer[i].proxyId2);
      pair.ClearBuffered();
      proxy1 = proxies[pair.proxyId1];
      proxy2 = proxies[pair.proxyId2];
      if (pair.IsRemoved()) {
        if (pair.IsFinal() === true) {
          this.m_callback.PairRemoved(proxy1.userData, proxy2.userData, pair.userData);
        }
        this.m_pairBuffer[removeCount].proxyId1 = pair.proxyId1;
        this.m_pairBuffer[removeCount].proxyId2 = pair.proxyId2;
        ++removeCount;
      } else {
        if (pair.IsFinal() === false) {
          pair.userData = this.m_callback.PairAdded(proxy1.userData, proxy2.userData);
          pair.SetFinal();
        }
      }
    }
    for (i = 0; 0 <= removeCount ? i < removeCount : i > removeCount; 0 <= removeCount ? i++ : i--) {
      this.RemovePair(this.m_pairBuffer[i].proxyId1, this.m_pairBuffer[i].proxyId2);
    }
    this.m_pairBufferCount = 0;
    if (b2BroadPhase.s_validate) {
      return this.ValidateTable();
    }
  };
  return b2PairManager;
})();