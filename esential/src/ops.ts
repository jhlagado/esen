import { Module } from 'binaryen';
import { asArray, isSignature, setTypeDef } from '.';
import { opsSignatures } from './ops-sigs';
import { literalize } from './literals';
import { Dict, TypeDef } from './types';
import { Signature } from 'typescript';

const builtinCallableMap = new Map<string, any>();

export const builtinCallable = (
  module: Module,
  func: Function,
  paramTypeDefs: Dict<TypeDef> | TypeDef[],
  resultTypeDef: TypeDef,
): Function => {
  return (...params: any[]) => {
    const typeArray = asArray(paramTypeDefs);
    const params1 = params.map((param, index) => literalize(module, param, typeArray[index]));
    const expr = func(...params1);
    setTypeDef(expr, resultTypeDef);
    return expr;
  };
};

export const builtinProxy = (
  module: Module,
  sigs: Dict<any>,
  moduleBase: any = module,
  path: string = '',
) =>
  new Proxy(sigs, {
    get(_target, name: string): any {
      let realName = name;
      let sig = sigs[realName];
      if (sig == null) {
        realName = `${name}_s`;
        sig = sigs[realName];
      }
      if (sig == null) {
        throw new Error(`No builtin with the name ${name}`);
      } else {
        const path1 = path + '.' + realName;
        if (isSignature(sig)) {
          if (builtinCallableMap.has(path1)) return builtinCallableMap.get(path1);
          const b = builtinCallable(module, moduleBase[realName], sig.params, sig.result);
          builtinCallableMap.set(path1, b);
          return b;
        } else {
          return builtinProxy(module, sigs[name], moduleBase[name], path1);
        }
      }
    },
  });

export const getOps = (module: Module) => builtinProxy(module, opsSignatures);
export const getOps1 = (module: Module, key: string) =>
  builtinProxy(module, (opsSignatures as any)[key] as Dict<Signature>, (module as any)[key], key);
