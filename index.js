var ephem = require('bindings')('ephem.node');

var converter = (function () {
  var r2d = 180 / Math.PI;
  var a2k = 1.49597870691E+8;

  function format(deg) {
    var d = Math.floor(deg);
    var m = Math.floor((deg - d) * 60);
    var s = (deg - d - m/60) * 3600;

    return [d, m, s];
  }

  return function (pos) {
    if (pos) {
      var r = Math.sqrt(pos.x*pos.x + pos.y*pos.y + pos.z*pos.z);

      return {
          'Δ' : r * a2k
        , 'α' : format(r2d * Math.atan2(pos.y, pos.x) / 15)
        , 'δ' : format(90 - r2d * Math.acos(pos.z / r))
      }
    }
  }
})();

module.exports = function (filename, callback) {
  ephem.load(filename, callback);

  return function (time, body, callback) {
    ephem.find(time, body, function (err, position, velocity) {
      callback(err, converter(position));
    });
  };
}