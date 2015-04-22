var ephem = require('bindings')('ephem.node');

var r2d = 180 / Math.PI;
var a2k = 1.49597870691E+8;
var c2k = 299792458/1000;

/* Split angle into (degrees)hours (arc)minutes (arc)seconds */
function format(deg) {
  var d = Math.floor(deg);
  var m = Math.floor((deg - d) * 60);
  var s = (deg - d - m/60) * 3600;

  return [d, m, s];
}

/* Date to julian day with Terrestrial Time (TT) adjustment
 *
 * Take the unix epoch, milliseconds since Jan 1st 1970, divide by the number
 * of miliseconds in a day, take away half a day because the julian day starts
 * at noon, and add the value of the julian day of the start of the unix epoch.
 *
 * TT = UTC + 67.184s;
 */
function julian (date) {
  return (date.valueOf() + 67184) / 86400000 - 0.5 + 2440588;
};

/* Cartesian to equitorial coordinates */
function equatorial (p) {
  if (p) {
    var r = magnitude(p.x, p.y, p.z);

    return {

        'Δ' : r * a2k
      , 'α' : format(r2d * Math.atan2(p.y, p.x) / 15)
      , 'δ' : format(90 - r2d * Math.acos(p.z / r))

    }
  }
};

/* Magnitude of vector */
function magnitude (x, y, z) {
  return Math.sqrt(x*x + y*y + z*z);
}

/* Right Ascension/Declination of Body from Earth, adjusted for light-time
 *
 * The position of a body at time T is not the position percieved from
 * Earth due to the finite speed of light. We are seeing a time delayed
 * position at T-dt. To find dt, first find the distance D at T, use D as a
 * starting point, calculate dt dividing D by c (speed of light). Find the
 * distance of the body again at time T-dt, updating D. Repeat 3 times to
 * converge on dt. Finally, find position of body@T-dt from Earth@T.
 */
function radec (body, time, callback) {
  var dt = 0,
      op, // observer position
      bp; // body/planet position

  // Position of Earth@T
  ephem.find(3, 11, time, function (err, position, velocity) { op = position });

  var iter = function (err, position, velocity) {
    bp  = position;
    // Earth-Body distance in km @T-dt, divide by speed of light km/s, divide by seconds/day to get dt in Julian days
    dt = (magnitude(bp.x - op.x, bp.y - op.y, bp.z - op.z) * a2k / c2k) / 86400;
  };

  // Inital calculation of dt using D@T
  ephem.find(body, 11, time - dt, iter);

  // First correction of dt
  ephem.find(body, 11, time - dt, iter);

  // Second correction of dt
  ephem.find(body, 11, time - dt, iter);

  // Find RA/Dec, adjusted for light-time
  ephem.find(body, 11, time - dt, function (err, position, velocity) {
    callback(null, equatorial({ 'x' : position.x - op.x, 'y' : position.y - op.y, 'z' : position.z - op.z }));
  });

}

module.exports = {

    'MERCURY'    : 1
  , 'VENUS'      : 2
  , 'EARTH'      : 3
  , 'MARS'       : 4
  , 'JUPITER'    : 5
  , 'SATURN'     : 6
  , 'URANUS'     : 7
  , 'NEPTUNE'    : 8
  , 'PLUTO'      : 9
  , 'MOON'       : 10
  , 'SUN'        : 11

  , 'equatorial' : equatorial
  , 'julian'     : julian

  , 'radec'      : radec

  , 'load'       : ephem.load
  , 'unload'     : ephem.unload
  , 'find'       : ephem.find

};