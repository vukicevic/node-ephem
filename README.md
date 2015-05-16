node-ephem
==========

Parse JPL DE planetary ephemerides and calculate the position of planets (and moon) at a given time.

This module is based on [Project Pluto](http://www.projectpluto.com/jpl_eph.htm)'s code for calculating planetary positions from JPL ephemerides.

Required
--------

This module uses publicly available planetery ephemeride files which can be downloaded from NASA's Jet Propulsion Laboratory [FTP server](http://tinyurl.com/qabeu3g). More information on which file to chose can be found [here](http://tinyurl.com/olea84t).

Usage
-----

Require the module.

```javascript
var ephem = require('node-ephem');
```

Load ephemerides which you downloaded, by providing a path to it:

```javascript
var e430 = ephem.load('./eph/linux_p1550p2650.430');
```

Find Mars, relative to the Sun, at this instant:

```javascript
var position = e430.find(ephem.bodies.MARS, ephem.bodies.SUN, ephem.julian(new Date));
```

Find RA/Dec of Neptune at this moment, adjusted for light-time:

```javascript
var radec = ephem.equatorial(e430.observe(ephem.bodies.MERCURY, ephem.bodies.EARTH, ephem.julian(new Date)));
```

Functions
---------

node-ephem exports:

Function | Parameters | Description
---|---|---
load | path | Load planetary ephemerides file, returns ephemeris object
julian | date | convert Date to Julian day (J2000 epoch, TT)
equatorial | position | Cartesian to Equаtorial

ephemeris object:

Function | Parameters | Description
---|---|---
find | body, observer, time | Find the position of body looking from observer at time
observe | body, observer, time | Find position of body adjusted for light-time
status | | Returns constants from loaded epehmeris file and status

Planets
-------
node-ephem provides a convenient name to code mapping via exported constants

Planet | Code
--- | ---
ephem.bodies.MERCURY | 1
ephem.bodies.VENUS | 2
ephem.bodies.EARTH | 3
ephem.bodies.MARS | 4
ephem.bodies.JUPITER | 5
ephem.bodies.SATURN | 6
ephem.bodies.URANUS | 7
ephem.bodies.NEPTUNE | 8
ephem.bodies.PLUTO | 9
ephem.bodies.MOON | 10
ephem.bodies.SUN | 11

Testrunner
----------

A testrunner is included which executes the test files available for DE files. Download the testpo file and place in the same directory as the ephemeris file, then run:

```
node testrunner.js
```

Follow the instructions.