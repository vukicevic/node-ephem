var assert = require('assert');
var reader = require('readline');
var fs     = require('fs');
var ephem  = require('./index');

var rd    = reader.createInterface({
    input: fs.createReadStream('./eph/testpo.430t'),
    output: process.stdout,
    terminal: false
});

var e430t = ephem.load('./eph/linux_p1550p2650.430t');

var start = false;

var parse = function (line) {
  return {

      'd' : parseFloat(line.substring(15,26).trim())
    , 't' : parseInt(line.substring(26,29).trim())
    , 'c' : parseInt(line.substring(29,32).trim())
    , 'x' : parseInt(line.substring(32,35).trim())
    , 'v' : parseFloat(line.substring(35,65).trim())

  }
};

var map   = [null, 'x', 'y', 'z', 'dx', 'dy', 'dz'];

var equal = function (x, y) {
  return Math.abs(x - y) < 2e-11;
};

var stats = e430t.status();

rd.on('line', function(line) {
  if (!start) {
    start = line === 'EOT';
  } else {
    var p = parse(line);

    if (p.d >= stats.start && p.d <= stats.end) {
      var r = e430t.find(p.t, p.c, p.d);
      assert(equal(r[map[p.x]], p.v));
    } else {
      console.log('Julian day out of range: ' + p.d);
    }
  }
});