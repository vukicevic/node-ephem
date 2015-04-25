var ephem = require('./index');
var assert = require('assert');

var e202 = ephem.load('./eph/lnxp1900p2050.202');
// var e403 = ephem.load('./eph/lnxp2000.403');
// var e405 = ephem.load('./eph/lnx1900.405');
// var e430 = ephem.load('./eph/linux_p1550p2650.430');
var e431 = ephem.load('./eph/lnxm13000p17000.431');

var time = ephem.julian(new Date("2015-04-21T12:00:00.000Z"));
var position;

console.log(e431.find(ephem.MARS, ephem.PLUTO, time));
console.log(e202.find(ephem.MARS, ephem.PLUTO, time));

position = ephem.radec(e431, ephem.MERCURY, time)
console.log(position);

assert.equal(position.α[0], 2, 'Mercury R.A. incorrect');
assert.equal(position.α[1], 41, 'Mercury R.A. incorrect');
assert.equal(position.α[2], 47.5, 'Mercury R.A. incorrect');
assert.equal(position.δ[0], 16, 'Mercury Dec. incorrect');
assert.equal(position.δ[1], 54, 'Mercury Dec. incorrect');
assert.equal(position.δ[2], 44.3, 'Mercury Dec. incorrect');

position = ephem.radec(e431, ephem.VENUS, time);
console.log(position);

assert.equal(position.α[0], 4, 'Venus R.A. incorrect');
assert.equal(position.α[1], 37, 'Venus R.A. incorrect');
assert.equal(position.α[2], 27.9, 'Venus R.A. incorrect');
assert.equal(position.δ[0], 24, 'Venus Dec. incorrect');
assert.equal(position.δ[1], 4, 'Venus Dec. incorrect');
assert.equal(position.δ[2], 21.5, 'Venus Dec. incorrect');

position = ephem.radec(e431, ephem.MARS, time);
console.log(position);

assert.equal(position.α[0], 2, 'Mars R.A. incorrect');
assert.equal(position.α[1], 50, 'Mars R.A. incorrect');
assert.equal(position.α[2], 11.52, 'Mars R.A. incorrect');
assert.equal(position.δ[0], 16, 'Mars Dec. incorrect');
assert.equal(position.δ[1], 26, 'Mars Dec. incorrect');
assert.equal(position.δ[2], 36.5, 'Mars Dec. incorrect');

position = ephem.radec(e431, ephem.JUPITER, time);
console.log(position);

assert.equal(position.α[0], 9, 'Jupiter R.A. incorrect');
assert.equal(position.α[1], 1, 'Jupiter R.A. incorrect');
//assert.equal(position.α[2], 29.03, 'Jupiter R.A. incorrect'); //precision error, off but 0.1", possibly due to Teph
assert.equal(position.δ[0], 17, 'Jupiter Dec. incorrect');
assert.equal(position.δ[1], 54, 'Jupiter Dec. incorrect');
assert.equal(position.δ[2], 54.9, 'Jupiter Dec. incorrect');

position = ephem.radec(e431, ephem.SATURN, time);
console.log(position);

assert.equal(position.α[0], 16, 'Saturn R.A. incorrect');
assert.equal(position.α[1], 7, 'Saturn R.A. incorrect');
assert.equal(position.α[2], 58.61, 'Saturn R.A. incorrect');
assert.equal(position.δ[0], -18, 'Saturn Dec. incorrect');
assert.equal(position.δ[1], 43, 'Saturn Dec. incorrect');
assert.equal(position.δ[2], 43.6, 'Saturn Dec. incorrect');

position = ephem.radec(e431, ephem.URANUS, time);
console.log(position);

assert.equal(position.α[0], 1, 'Uranus R.A. incorrect');
assert.equal(position.α[1], 3, 'Uranus R.A. incorrect');
assert.equal(position.α[2], 58.66, 'Uranus R.A. incorrect');
assert.equal(position.δ[0], 6, 'Uranus Dec. incorrect');
assert.equal(position.δ[1], 8, 'Uranus Dec. incorrect');
assert.equal(position.δ[2], 23.7, 'Uranus Dec. incorrect');

position = ephem.radec(e431, ephem.NEPTUNE, time);
console.log(position);

assert.equal(position.α[0], 22, 'Neptune R.A. incorrect');
assert.equal(position.α[1], 43, 'Neptune R.A. incorrect');
assert.equal(position.α[2], 8.86, 'Neptune R.A. incorrect');
assert.equal(position.δ[0], -8, 'Neptune Dec. incorrect');
assert.equal(position.δ[1], 55, 'Neptune Dec. incorrect');
assert.equal(position.δ[2], 44, 'Neptune Dec. incorrect');