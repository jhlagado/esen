import { ModDef, Dict, LibFunc } from '../types';
import { builtin, literal, asPages } from '../utils';
import { i32 } from 'binaryen';
import { ops } from '../core';
import { ioLib } from './io-lib';

const load = builtin(ops.i32.load, i32);
const store = builtin(ops.i32.store, i32);

export const memoryLib: LibFunc = (
  { memory, lib, func }: ModDef,
  { width = 500, height = 500 }: Dict<any> = {},
) => {
  const { log } = lib(ioLib);
  const numBuffers = 2;
  const bytesPerPixel = 4;
  const bytes = width * height * bytesPerPixel * numBuffers;
  const pages = asPages(bytes);

  memory({ namespace: 'env', name: 'memory', initial: pages, maximum: pages });

  const mem256 = func({ result: [i32] }, ({ $, block, result }) => {
    $.u = block(store(0, 0, literal(0), literal(346)), load(0, 0, literal(0)));
    result(log(literal(1)), $.u);
  });

  return {
    mem256,
  };
};