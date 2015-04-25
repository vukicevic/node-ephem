node-ephem
==========

Parse JPL planetary ephemerides and calculate the position of planets (and moon) at a given time.

This module is based on [Project Pluto](http://www.projectpluto.com/jpl_eph.htm)'s code for calculating planetary positions from JPL ephemerides.

Required
--------

This module uses publicly available planetery ephemerides which can be downloaded from NASA's Jet Propulsion Laboratory [FTP server](ftp://ssd.jpl.nasa.gov/pub/eph/planets/Linux/). More information on which file to chose can be found [here](ftp://ssd.jpl.nasa.gov/pub/eph/planets/README.txt).

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
var position = e430.find(ephem.MARS, ephem.SUN, ephem.julian(new Date));
console.log(position);
```

Find RA/Dec of Neptune at this moment, adjusted for light-time:

```javascript
var radec = ephem.radec(e431, ephem.NEPTUNE, ephem.julian(new Date));
console.log(radec);
```

Functions
---------

node-ephem exports:

Function | Parameters | Description
---|---|---
load | path | Load planetary ephemerides file, returns ephemeris object
radec | ephObj, body, time | Find RA/Dec of body adjusted for light-time
julian | date | convert Date to Julian day (J2000 epoch, TT)
equatorial | position | Cartesian to Equаtorial

ephemeris object:

Function | Parameters | Description
---|---|---
find | body, observer, time | Find the position of body looking from observer at time
constants | | Returns constants from loaded ephemeris file

Planets
-------

node-ephem provides a convenient name to code mapping via exported constants

Planet | Code
--- | ---
ephem.MERCURY | 1
ephem.VENUS | 2
ephem.EARTH | 3
ephem.MARS | 4
ephem.JUPITER | 5
ephem.SATURN | 6
ephem.URANUS | 7
ephem.NEPTUNE | 8
ephem.PLUTO | 9
ephem.MOON | 10
ephem.SUN | 11