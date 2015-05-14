var ephem = require('bindings')('ephem.node');

var r2d = 180 / Math.PI;       // degrees per radian
var a2k = 149597870.700; // au in km

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
    var r = Math.sqrt(p.x*p.x + p.y*p.y + p.z*p.z);
    var a = r2d * Math.atan2(p.y, p.x);
    var d = r2d * Math.atan2(p.z, Math.sqrt(p.x*p.x + p.y*p.y)); //Math.asin(p.z / r)

    return {

        'Δ' : r * a2k
      , 'α' : format(a, true)
      , 'δ' : format(d, false)

    }
  }
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
  , 'load'       : ephem.load

};