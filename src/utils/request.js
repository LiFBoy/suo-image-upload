import axios from 'axios';

const defaultOptions = {
  method: 'get',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

export default (url, options) => {
  return axios({
    url,
    ...defaultOptions,
    ...options,
  }).then(response => {
    const { status } = response;
    if (status !== 200) {
      return Promise.reject(new Error(`http请求失败，状态码：${status}`));
    }

    const { data } = response;

    return Promise.resolve(data);
  });
};
