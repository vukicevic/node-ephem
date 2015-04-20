var ephem = require('./index');

//lnxp1900p2050.202
//linux_p1550p2650.430

var calc = ephem('/home/nenad/workspace/sandbox/jpleph/eph/linux_p1550p2650.430');

calc(2457132.5, 4, function (err, coords) {
  console.log(err);
  console.log(coords);
});