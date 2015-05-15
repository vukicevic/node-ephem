var fs = require('fs');
var ph = require('path');

var list = {
    '102'  : 'lnxm1410p3002.102'
  , '200'  : 'lnxm1600p2170.200'
  , '202'  : 'lnxp1900p2050.202'
  , '403'  : 'lnxp1600p2200.403'
  , '405'  : 'lnxp1600p2200.405'
  , '406'  : 'lnxm3000p3000.406'
  , '410'  : 'lnxp1960p2020.410'
  , '413'  : 'lnxp1900p2050.413'
  , '414'  : 'lnxp1600p2200.414'
  , '418'  : 'lnxp1900p2050.418'
  , '421'  : 'lnxp1900p2053.421'
  , '422'  : 'lnxm3000p3000.422'
  , '423'  : 'lnxp1800p2200.423'
  , '430'  : 'linux_p1550p2650.430'
  , '430t' : 'linux_p1550p2650.430t'
  , '431'  : 'lnxm13000p17000.431'
};

function available (path) {
  var files     = fs.readdirSync(path);
  var available = [];

  Object.keys(list).forEach(function (de) {
    if (files.indexOf(list[de]) >= 0) {
      available.push({
          'name' : 'DE' + de
        , 'file' : path + ph.sep + list[de]
        , 'test' : files.indexOf('testpo.' + de) >= 0 ? path + ph.sep + 'testpo.' + de : null
      });
    }
  });

  return available;
};

module.exports = available;