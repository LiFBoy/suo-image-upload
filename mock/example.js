import { mock } from 'mockjs';

export const getHeaderDetail = () =>
  mock({
    name: '@cname()',
    age: '@integer(1,100)',
  });

export const getBodyDetail = () =>
  mock({
    name: '@cname()',
    age: '@integer(1,100)',
  });
