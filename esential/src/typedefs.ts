import { TypeDef } from './types';
import { ExpressionRef, Type, createType, none } from 'binaryen';
import { isPrim } from './utils';

const expressionTypeDefs = new Map<ExpressionRef, TypeDef>();

export const setTypeDef = (expr: ExpressionRef, typeDef: TypeDef) => {
  expressionTypeDefs.set(expr, typeDef);
};

export const getTypeDef = (expr: ExpressionRef, failThrow = true): TypeDef => {
  if (expressionTypeDefs.has(expr)) {
    return expressionTypeDefs.get(expr) as Type;
  }
  if (failThrow) {
    throw new Error(`Could not find typeDef for ${expr}`);
  } else {
    return none;
  }
};

export const asType = (typeDef: TypeDef): Type => {
  if (isPrim<Type>(typeDef)) {
    return typeDef;
  } else {
    const typeArray: Type[] = Array.isArray(typeDef) ? typeDef : Object.values(typeDef);
    return createType(typeArray);
  }
};
