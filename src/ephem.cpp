#include "ephem.h"

#include <node.h>
#include <nan.h>

#include "../lib/jpleph.h"

using namespace v8;

Persistent<Function> Ephem::constructor;

Ephem::Ephem(char* filename) {
  p = jpl_init_ephemeris(filename, constants, values);
}

Ephem::~Ephem() {}

void Ephem::Init(Handle<Object> exports) {
  NanScope();

  Local<FunctionTemplate> tpl = NanNew<FunctionTemplate>(New);
  tpl->SetClassName(NanNew("Ephem"));
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  NODE_SET_PROTOTYPE_METHOD(tpl, "find", Find);
  NODE_SET_PROTOTYPE_METHOD(tpl, "constants", Constants);

  NanAssignPersistent(constructor, tpl->GetFunction());
  exports->Set(NanNew("load"), tpl->GetFunction());
}

NAN_METHOD(Ephem::New) {
  NanScope();

  if (args.IsConstructCall()) {
    Ephem* obj = new Ephem(*NanAsciiString(args[0]));
    obj->Wrap(args.This());
    NanReturnValue(args.This());
  } else {
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons = NanNew<Function>(constructor);
    NanReturnValue(cons->NewInstance(argc, argv));
  }
}

NAN_METHOD(Ephem::Find) {
  NanScope();

  Ephem* obj = ObjectWrap::Unwrap<Ephem>(args.Holder());

  if (args.Length() < 3) {
    NanReturnUndefined();
  } else if (!obj->p) {
    NanReturnUndefined();
  } else if (!args[0]->IsNumber() || !args[1]->IsNumber() || !args[2]->IsNumber()) {
    NanReturnUndefined();
  } else {
    int body     = args[0]->NumberValue();
    int observer = args[1]->NumberValue();
    double time  = args[2]->NumberValue();

    double result[6];

    int code = jpl_pleph(obj->p, time, body, observer, result, 0);

    if (code == 0) {
      Local<Object> pos = NanNew<Object>();

      pos->Set(NanNew("x"), NanNew(result[0]));
      pos->Set(NanNew("y"), NanNew(result[1]));
      pos->Set(NanNew("z"), NanNew(result[2]));

      NanReturnValue(pos);
    } else {
      NanReturnUndefined();
    }
  }
}

NAN_METHOD(Ephem::Constants) {
  NanScope();

  Ephem* obj = ObjectWrap::Unwrap<Ephem>(args.Holder());

  if (obj->p) {
    Local<Object> map = NanNew<Object>();

    for (int i = 0; i < JPL_MAX_N_CONSTANTS; i++) {
      std::string c(obj->constants[i], 6);
      map->Set(NanNew(c), NanNew(obj->values[i]));
    }

    NanReturnValue(map);
  } else {
    NanReturnUndefined();
  }
}

void InitAll(Handle<Object> exports) {
  Ephem::Init(exports);
}

NODE_MODULE(ephem, InitAll);