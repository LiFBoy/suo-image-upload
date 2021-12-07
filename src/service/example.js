import { stringify } from 'qs';
import request from '../utils/request';

const api = 'https://www.easy-mock.com/mock/5c0675b8a2222f2bf0a7b8af/nbugs-component-example';

export async function queryHeaderDetail(params) {
  return request(`${api}/example/getHeaderDetail?${stringify(params)}`);
}

export async function queryHeaderThrowError(params) {
  return request(`${api}/example/getHeaderThrowError?${stringify(params)}`);
}

export async function queryBodyDetail(params) {
  return request(`${api}/example/getBodyDetail?${stringify(params)}`);
}

export async function submitBody(params) {
  return request(`${api}/example/submitBody`, {
    method: 'POST',
    data: params,
  });
}
