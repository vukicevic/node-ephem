#include <node.h>
#include <nan.h>
#include "../lib/jpleph.h"

#define JPL_MAX_N_CONSTANTS 1018

using v8::Number;
using v8::Function;
using v8::Local;
using v8::Null;
using v8::Value;
using v8::Object;
using v8::FunctionTemplate;
using v8::Handle;
using v8::String;

static void *p;

NAN_METHOD(load) {
  NanScope();

  Local<Function> cb = args[1].As<Function>();
  Local<Value> argv[2];

  if (p) {
    jpl_close_ephemeris(p);
  }

  char constants[JPL_MAX_N_CONSTANTS][6];
  double values[JPL_MAX_N_CONSTANTS];

  p = jpl_init_ephemeris(*NanAsciiString(args[0]), constants, values);

  if (!p) {
    argv[0] = jpl_init_error_code() == -1 ? NanNew("FileOpenError") : NanNew("FileReadError");
  } else {
    Local<Object> map = NanNew<Object>();

    for (int i = 0; i < JPL_MAX_N_CONSTANTS; i++) {
      std::string c(constants[i], 6);
      map->Set(NanNew(c), NanNew(values[i]));
    }

    argv[0] = NanNull();
    argv[1] = map;
  }

  NanMakeCallback(NanGetCurrentContext()->Global(), cb, 2, argv);

  NanReturnUndefined();
}

NAN_METHOD(unload) {
  NanScope();

  jpl_close_ephemeris(p);

  NanReturnValue(NanTrue());
}

NAN_METHOD(find) {
  NanScope();

  if (args.Length() < 4 || !args[3]->IsFunction()) {
    NanThrowTypeError("WrondArgumentsProvided");
    NanReturnUndefined();
  }

  Local<Function> cb = args[3].As<Function>();
  Local<Value> argv[3];

  argv[1] = NanNull();
  argv[2] = NanNull();

  if (!p) {
    argv[0] = NanNew("EphemerisNotLoaded");
  } else if (!args[0]->IsNumber() || !args[1]->IsNumber() || !args[2]->IsNumber()) {
    argv[0] = NanNew("InvalidArguments");
  } else {
    int body     = args[0]->NumberValue();
    int observer = args[1]->NumberValue();
    double time  = args[2]->NumberValue();

    double result[6];

    int code = jpl_pleph(p, time, body, observer, result, 1);

    if (code == 0) {
      Local<Object> pos = NanNew<Object>();
      Local<Object> vel = NanNew<Object>();

      pos->Set(NanNew("x"), NanNew(result[0]));
      pos->Set(NanNew("y"), NanNew(result[1]));
      pos->Set(NanNew("z"), NanNew(result[2]));

      vel->Set(NanNew("dx"), NanNew(result[3]));
      vel->Set(NanNew("dy"), NanNew(result[4]));
      vel->Set(NanNew("dz"), NanNew(result[5]));

      argv[0] = NanNull();
      argv[1] = pos;
      argv[2] = vel;
    } else {
      argv[0] = code == -1 ? NanNew("DateOutOfRange") : NanNew("CalculationError");
    }
  }

  NanMakeCallback(NanGetCurrentContext()->Global(), cb, 3, argv);

  NanReturnUndefined();
}

void InitAll(Handle<Object> exports) {

    exports->Set(NanNew<String>("load"),
                 NanNew<FunctionTemplate>(load)->GetFunction());

    exports->Set(NanNew<String>("unload"),
                 NanNew<FunctionTemplate>(unload)->GetFunction());

    exports->Set(NanNew<String>("find"),
                 NanNew<FunctionTemplate>(find)->GetFunction());

}

NODE_MODULE(ephem, InitAll);
