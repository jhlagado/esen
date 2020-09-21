import { i32 } from 'binaryen';
import { builtin, esential } from 'esential/src';

const { lib, module, load, compile } = esential();

lib(({ func }) => {
  const add = builtin(module.i32.add, i32);

  const addition = func(
    { params: { a: i32, b: i32 } },
    ({ vars: { a, b, u }, result }) => {
      result(
        //
        u(add(a(), b())),
        u(),
      );
    },
  );
  return {
    addition,
  };
});

const exported = load(compile());
console.log(module.emitText());
console.log(exported.addition(41, 1));
