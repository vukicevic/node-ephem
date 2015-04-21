var ephem = require('bindings')('ephem.node');

var r2d = 180 / Math.PI;
var a2k = 1.49597870691E+8;

function format(deg) {
  var d = Math.floor(deg);
  var m = Math.floor((deg - d) * 60);
  var s = (deg - d - m/60) * 3600;

  return [d, m, s];
}

/* Planet Codes */
module.exports.MERCURY = 1;
module.exports.VENUS   = 2;
module.exports.EARTH   = 3;
module.exports.MARS    = 4;
module.exports.JUPITER = 5;
module.exports.SATURN  = 6;
module.exports.URANUS  = 7;
module.exports.NEPTUNE = 8;
module.exports.PLUTO   = 9;
module.exports.MOON    = 10;
module.exports.SUN     = 11;

/* Load ephemerides from PATH, CALLBACK */
module.exports.load    = ephem.load;

/* Unload ephemerides */
module.exports.unload  = ephem.unload;

/* Find PLANET looking from OBSERVER at TIME, CALLBACK */
module.exports.find    = ephem.find;

/* Date to julian day.
 *
 * Take the unix epoch, milliseconds since Jan 1st 1970, divide by the number
 * of miliseconds in a day, take away half a day because the julian day starts
 * at noon, and add the value of the julian day of the start of the unix epoch.
 */
module.exports.julian = function (date) {
  return date.valueOf() / 86400000 - 0.5 + 2440588;
};

/* Cartesian to equitorial coordinates */
module.exports.equitorial = function (p) {
  if (p) {
    var r = Math.sqrt(p.x*p.x + p.y*p.y + p.z*p.z);

    return {

        'Δ' : r * a2k
      , 'α' : format(r2d * Math.atan2(p.y, p.x) / 15)
      , 'δ' : format(90 - r2d * Math.acos(p.z / r))

    }
  }
};

/* Magnitude of velocity vector */
module.exports.magnitude = function(v) {
  if (v) {
    return (Math.sqrt(v.dx*v.dx + v.dy*v.dy + v.dz*v.dz) * a2k)/86400;
  }
}