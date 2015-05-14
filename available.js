var fs   = require('fs');

var list = {

    'DE102'  : 'lnxm1410p3002.102'
  , 'DE200'  : 'lnxm1600p2170.200'
  , 'DE202'  : 'lnxp1900p2050.202'
  , 'DE403'  : 'lnxp1600p2200.403'
  , 'DE405'  : 'lnxp1600p2200.405'
  , 'DE406'  : 'lnxm3000p3000.406'
  , 'DE410'  : 'lnxp1960p2020.410'
  , 'DE413'  : 'lnxp1900p2050.413'
  , 'DE414'  : 'lnxp1600p2200.414'
  , 'DE418'  : 'lnxp1900p2050.418'
  , 'DE421'  : 'lnxp1900p2053.421'
  , 'DE422'  : 'lnxm3000p3000.422'
  , 'DE423'  : 'lnxp1800p2200.423'
  , 'DE430'  : 'linux_p1550p2650.430'
  , 'DE430t' : 'linux_p1550p2650.430t'
  , 'DE431'  : 'lnxm13000p17000.431'

};

function available (path) {
  var files     = fs.readdirSync(path);
  var available = {};

  Object.keys(list).forEach(function (de) {
    if (files.indexOf(list[de]) >= 0)
      available[de] = list[de];
  });

  return available;
};

module.exports = available;