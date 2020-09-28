import { esential } from '@jhlagado/esential';
import { indirectLib } from './indirect-lib';

const size = { initial: 10, maximum: 100 };
const instance = new WebAssembly.Table({ ...size, element: 'anyfunc' });

const { lib, load, compile, module } = esential({ table: { ...size, instance } });
lib(indirectLib);

const exported = load(compile());

it('should add 2 numbers indirectly', () => {
  expect(exported.indirect123(300, 200)).toBe(500);
});