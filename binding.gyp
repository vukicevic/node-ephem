{
  "targets": [
    {
      "target_name": "ephem",
      "sources": [ "src/ephem.cpp", "lib/jpleph.cpp" ],
      "include_dirs" : [ "<!(node -e \"require('nan')\")" ]
    }
  ]
}
