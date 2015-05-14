#include "ephem.h"

#include <node.h>
#include <nan.h>
#include <math.h>
#include <float.h>

#include "../lib/jpleph.h"

using namespace v8;

Persistent<Function> Ephem::constructor;

Ephem::Ephem(char* filename) {
  p = jpl_init_ephemeris(filename, constants, values);
  status = jpl_init_error_code();
}

Ephem::~Ephem() {}

void Ephem::Init(Handle<Object> exports) {
  NanScope();

  Local<FunctionTemplate> tpl = NanNew<FunctionTemplate>(New);
  tpl->SetClassName(NanNew("Ephem"));
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  NODE_SET_PROTOTYPE_METHOD(tpl, "find", Find);
  NODE_SET_PROTOTYPE_METHOD(tpl, "constants", Constants);
  NODE_SET_PROTOTYPE_METHOD(tpl, "status", Status);
  NODE_SET_PROTOTYPE_METHOD(tpl, "observe", Observe);

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

    int code = jpl_pleph(obj->p, time, body, observer, result, 1);

    if (code == 0) {
      Local<Object> pos = NanNew<Object>();

      pos->Set(NanNew("x"), NanNew(result[0]));
      pos->Set(NanNew("y"), NanNew(result[1]));
      pos->Set(NanNew("z"), NanNew(result[2]));

      pos->Set(NanNew("dx"), NanNew(result[3]));
      pos->Set(NanNew("dy"), NanNew(result[4]));
      pos->Set(NanNew("dz"), NanNew(result[5]));

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

NAN_METHOD(Ephem::Status) {
  NanScope();

  Ephem* obj = ObjectWrap::Unwrap<Ephem>(args.Holder());

  NanReturnValue(obj->status);
}

/* Right Ascension/Declination of Body from Earth, adjusted for light-time
 *
 * The position of a body at time T is not the position percieved from
 * Earth due to the finite speed of light. We are seeing a time delayed
 * position at T-dt. To find dt, first find the distance D at T, use D as a
 * starting point, calculate dt dividing D by c (speed of light). Find the
 * distance of the body again at time T-dt, updating D. Repeat until dt
 * converges. Finally finding position of body@T-dt observing from Earth@T.
 */
NAN_METHOD(Ephem::Observe) {
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

    double op[6];
    double bp[6];

    double dt, tt = 0;
    // da is # days it takes for light to travel 1 AU
    double da = 0.005775518331089534;

    // Position of Earth@T
    int rc = jpl_pleph(obj->p, time, observer, 11, op, 0);

    //Iterate until dt converges
    do {
      dt = tt;

      // Postion of body@T-dt
      rc = jpl_pleph(obj->p, time - dt, body, 11, bp, 0);

      // Calculate dt light-time correction. The time it takes
      // light to travel a distance between two points in days
      tt = Magnitude(bp[0] - op[0], bp[1] - op[1], bp[2] - op[2]) * da;
    } while (fabs(tt - dt) > DBL_EPSILON);

    if (rc == 0) {
      Local<Object> pos = NanNew<Object>();

      pos->Set(NanNew("x"), NanNew(bp[0] - op[0]));
      pos->Set(NanNew("y"), NanNew(bp[1] - op[1]));
      pos->Set(NanNew("z"), NanNew(bp[2] - op[2]));

      NanReturnValue(pos);
    } else {
      NanReturnUndefined();
    }
  }
}

double Ephem::Magnitude (double x, double y, double z) {
  return sqrt(x*x + y*y + z*z);
}

void InitAll(Handle<Object> exports) {
  Ephem::Init(exports);
}

NODE_MODULE(ephem, InitAll);