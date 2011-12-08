var b2Settings;
exports.b2Settings = b2Settings = (function() {
  function b2Settings() {}
  b2Settings.prototype.USHRT_MAX = 0x0000ffff;
  b2Settings.prototype.b2_pi = Math.PI;
  b2Settings.prototype.b2_massUnitsPerKilogram = 1.0;
  b2Settings.prototype.b2_timeUnitsPerSecond = 1.0;
  b2Settings.prototype.b2_lengthUnitsPerMeter = 30.0;
  b2Settings.prototype.b2_maxManifoldPoints = 2;
  b2Settings.prototype.b2_maxShapesPerBody = 64;
  b2Settings.prototype.b2_maxPolyVertices = 8;
  b2Settings.prototype.b2_maxProxies = 1024;
  b2Settings.prototype.b2_maxPairs = 8 * b2Settings.b2_maxProxies;
  b2Settings.prototype.b2_linearSlop = 0.005 * b2Settings.b2_lengthUnitsPerMeter;
  b2Settings.prototype.b2_angularSlop = 2.0 / 180.0 * b2Settings.b2_pi;
  b2Settings.prototype.b2_velocityThreshold = 1.0 * b2Settings.b2_lengthUnitsPerMeter / b2Settings.b2_timeUnitsPerSecond;
  b2Settings.prototype.b2_maxLinearCorrection = 0.2 * b2Settings.b2_lengthUnitsPerMeter;
  b2Settings.prototype.b2_maxAngularCorrection = 8.0 / 180.0 * b2Settings.b2_pi;
  b2Settings.prototype.b2_contactBaumgarte = 0.2;
  b2Settings.prototype.b2_timeToSleep = 0.5 * b2Settings.b2_timeUnitsPerSecond;
  b2Settings.prototype.b2_linearSleepTolerance = 0.01 * b2Settings.b2_lengthUnitsPerMeter / b2Settings.b2_timeUnitsPerSecond;
  b2Settings.prototype.b2_angularSleepTolerance = 2.0 / 180.0 / b2Settings.b2_timeUnitsPerSecond;
  b2Settings.prototype.b2Assert = function(a) {
    if (!a) {
      vnullVec;
      return nullVec.x++;
    }
  };
  return b2Settings;
})();