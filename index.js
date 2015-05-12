var ephem = require('bindings')('ephem.node');

var r2d = 180 / Math.PI;       // degrees per radian
var a2k = 149597870700 / 1000; // au in km
var c2k = 299792458 / 1000;    // speed of light in km/s
var s2d = 86400;               // seconds per day

/* Split angle into (degrees)hours (arc)minutes (arc)seconds */
function format(deg, hours) {
  if (hours)
    deg = (24 + deg/15) % 24;

  var o = deg < 0 ? Math.ceil : Math.floor;
  var d = o(deg);
  var m = o((deg - d) * 60);
  var s = (deg - d - m/60) * 3600;

  return [d, Math.abs(m), parseFloat(Math.abs(s).toFixed(hours?2:1))];
};

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
    var a = r2d * Math.atan2(p.y, p.x);
    var d = r2d * Math.atan2(p.z, magnitude(p.x, p.y, 0)); //Math.asin(p.z / r)

    return {

        'Δ' : r * a2k
      , 'α' : format(a, true)
      , 'δ' : format(d, false)

    }
  }
};

/* Magnitude of vector */
function magnitude (x, y, z) {
  return Math.sqrt(x*x + y*y + z*z);
};

/* Right Ascension/Declination of Body from Earth, adjusted for light-time
 *
 * The position of a body at time T is not the position percieved from
 * Earth due to the finite speed of light. We are seeing a time delayed
 * position at T-dt. To find dt, first find the distance D at T, use D as a
 * starting point, calculate dt dividing D by c (speed of light). Find the
 * distance of the body again at time T-dt, updating D. Repeat 3 times to
 * converge on dt. Finally, find position of body@T-dt from Earth@T.
 */
function radec (eph, body, time) {
  // Position of Earth@T
  var op = eph.find(3, 11, time);

  for (var bp, dt = 0, i = 0; i < 4; i++) {
    // Postion of body@T-dt
    bp = eph.find(body, 11, time - dt);

    // Calculate dt light-time correction. The time it takes
    // light to travel a distance between two points in days.
    // Constant is portion of day for light to travel 1 AU
    dt = magnitude(bp.x - op.x, bp.y - op.y, bp.z - op.z) * 0.005775518331089534;
  }

  return equatorial({ 'x' : bp.x - op.x, 'y' : bp.y - op.y, 'z' : bp.z - op.z });
};

var bodies = {

    'MERCURY' : 1
  , 'VENUS'   : 2
  , 'EARTH'   : 3
  , 'MARS'    : 4
  , 'JUPITER' : 5
  , 'SATURN'  : 6
  , 'URANUS'  : 7
  , 'NEPTUNE' : 8
  , 'PLUTO'   : 9
  , 'MOON'    : 10
  , 'SUN'     : 11

};

module.exports = {

    'bodies'     : bodies
  , 'equatorial' : equatorial
  , 'julian'     : julian
  , 'radec'      : radec
  , 'load'       : ephem.load

};