var ephem = require('./index');

//ephem.load('./eph/lnxp1900p2050.202');
//ephem.load('./eph/lnxp2000.403');
//ephem.load('./eph/lnx1900.405');
//ephem.load('./eph/linux_p1550p2650.430');
ephem.load('./eph/lnxm13000p17000.431');

var time = ephem.julian(new Date("2015-04-21T12:00:00.000Z"));

ephem.find(ephem.MARS, ephem.PLUTO, time, function (err, position, velocity) {
  console.log(position);
});

ephem.radec(ephem.MARS, time, function (err, position) {
  console.log(position);
});