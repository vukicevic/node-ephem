var ephem = require('./index');

//ephem.load('./eph/lnxp1900p2050.202');
//ephem.load('./eph/lnxp2000.403');
//ephem.load('./eph/lnx1900.405');
//ephem.load('./eph/linux_p1550p2650.430');
ephem.load('./eph/lnxm13000p17000.431');

ephem.find(ephem.MARS, ephem.EARTH, 2457134, function (err, position, velocity) {
  console.log(position);
  console.log(ephem.equitorial(position));
  console.log(ephem.magnitude(velocity));
});