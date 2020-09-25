import { LibFunc } from 'esential';

export const resultLib: LibFunc = ({ func }) => {
  //
  const return1000 = func(
    { params: {} },

    result => {
      result(1000);
    },
  );

  const return2000 = func(
    {},

    (result, { u }) => {
      result(
        //
        u(2000),
        u,
      );
    },
  );

  return {
    return1000,
    return2000,
  };
};
