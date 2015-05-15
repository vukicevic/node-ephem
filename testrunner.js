var assert = require('assert');
var reader = require('readline');
var fs     = require('fs');

var ephem  = require('./index');
var avail  = require('./available');

var rl = reader.createInterface({
    'input'  : process.stdin
  , 'output' : process.stdout
});

rl.write('Welcome to the node-ephem test runner\n\n');

rl.question('Enter a path to where the DE ephemeris files reside: ', function (path) {
  rl.write('\n');

  var files = avail(path);

  for (var i = 0; i < files.length; i++)
    if (files[i].test)
      rl.write((i+1) + ') ' + files[i].name + '\n');

  rl.question('\nEnter the number of the ephemeris file to test: ', function (number) {
    if (files[number - 1] && files[number - 1].test != null)
      startTest(files[number - 1]);
    else
      rl.write('\nInvalid selection.\n');

    rl.close();
  });

});

function startTest(de) {

  var rd = reader.createInterface({
      'input'    : fs.createReadStream(de.test)
    , 'output'   : process.stdout
    , 'terminal' : false
  });

  var map      = [null, 'x', 'y', 'z', 'dx', 'dy', 'dz'];
  var stats    = { 'run' : 0, 'errors' : 0, 'exceeded' : 0, 'start' : Date.now() };
  var loaded   = ephem.load(de.file);
  var meta     = loaded.status();
  var start    = false;

  function parse (line) {
    return {
        'day'    : parseFloat(line.substring(15,26).trim())
      , 'target' : parseInt(line.substring(26,29).trim())
      , 'center' : parseInt(line.substring(29,32).trim())
      , 'var'    : map[line.substring(32,35).trim()]
      , 'val'    : line.substring(35,65).trim()
    }
  };

  function equals (value, test) {
    var l = test.length;
    var d = test.indexOf('.') + 1;
    var e = 1 / Math.pow(10, l - d);

    for (var i = l-1; i >= d; i--)
      if (test.charAt(i) == '0')
        e *= 10;
      else
        break;

    //var p = test * 1e-14; //machine precision error

    return Math.abs(value - parseFloat(test)) < Math.max(e, 5e-14);
  };

  process.stdout.write('\nRUNNING TESTS');

  rd.on('line', function (line) {
    if (!start) {
      start = line === 'EOT';
    } else {
      var p = parse(line);

      if (p.day >= meta.start && p.day <= meta.end) {
        var r = loaded.find(p.target, p.center, p.day);

        if (equals(r[p.var], p.val)) {
          process.stdout.write('.');
        } else {
          process.stdout.write('X');
          stats.errors++;
        }

        stats.run++;
      } else {
        stats.exceeded++;
      }
    }
  });

  rd.on('close', function () {
    process.stdout.write('FINISHED\n\n');

    if (stats.exceeded) {
      process.stdout.write('WARNING: The test file contains ' + stats.exceeded + ' items outside the range of this ephemeris.\n\n');
    }

    process.stdout.write('Tests Complete.\n');
    process.stdout.write('Executed ' + stats.run + ' tests in ' + (Date.now() - stats.start) + 'ms\n');
    process.stdout.write('Errors: ' + stats.errors + '\n\n');

    process.stdout.write('INFO: Some errors are likely due to machine precision issues.\n\n');
  });
}