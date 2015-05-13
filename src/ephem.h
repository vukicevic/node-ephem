#ifndef EPHEM_H
#define EPHEM_H

#include <nan.h>

#define JPL_MAX_N_CONSTANTS 1018

class Ephem : public node::ObjectWrap {
 public:
  static void Init(v8::Handle<v8::Object> exports);

 private:
  explicit Ephem(char* filename);
  ~Ephem();

  static NAN_METHOD(New);
  static NAN_METHOD(Find);
  static NAN_METHOD(Constants);
  static NAN_METHOD(Status);
  static NAN_METHOD(Observe);

  static v8::Persistent<v8::Function> constructor;

  static inline double Magnitude(double x, double y, double z);

  void *p;
  int status;
  char constants[JPL_MAX_N_CONSTANTS][6];
  double values[JPL_MAX_N_CONSTANTS];
};

#endif