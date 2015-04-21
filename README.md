EphemCalc
=========

Parse JPL planetary ephemerides and calculate the position of planets (and moon) at a given time.

This module is based on [Project Pluto](http://www.projectpluto.com/jpl_eph.htm)'s code for calculating planetary positions from JPL ephemerides.

Required
--------

This module uses publicly available planetery ephemerides which can be downloaded from NASA's Jet Propulsion Laboratory [FTP server](ftp://ssd.jpl.nasa.gov/pub/eph/planets/Linux/). More information on which file to chose can be found [here](ftp://ssd.jpl.nasa.gov/pub/eph/planets/README.txt).

Usage
-----

Require the module.

```javascript
var ephem = require('ephem-calc');
```

Load ephemerides which you downloaded, by providing a path to it:

```javascript
ephem.load('./eph/linux_p1550p2650.430');
```

Find Mars, observing from Earth, at this instant:

```javascript
ephem.find(ephem.MARS, ephem.EARTH, ephem.julian(new Date), function (err, position, velocity) {
  console.log(ephem.equirial(position));
  console.log(ephem.magnitude(velocity) + 'km/s');
});
```

Functions
---------

Function | Parameters | Description
---|---|---
load | path, callback | Load planetary ephemerides file
unload | | Unload file
find | body, observer, time, callback | Find the position of body looking from observer at time
julian | date | convert Date to Julian day (J2000 epoch)
equatorial | position | Cartesian to Equitorisal position returned by find
magnitude | velocity | Magnitude of velocity returned by find

Planets
-------

EphemCalc provides a convenient name to code mapping via exported constants

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