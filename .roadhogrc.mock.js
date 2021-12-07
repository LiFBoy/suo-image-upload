import mockjs from 'mockjs';
import { delay } from 'roadhog-api-doc';
import { getHeaderDetail, getBodyDetail } from './mock/example.js';

const wrapSuccessResponse = (data = null) => (req, res) => {
  const params = req.method === 'GET' ? req.query : req.body;

  res.send({
    code: 200,
    msg: '操作成功',
    data: typeof data === 'function' ? data(params) : data,
  });
};

const wrapErrorResponse = (data = null) => (req, res) => {
  const params = req.method === 'GET' ? req.query : req.body;

  res.send({
    code: 404,
    msg: '这是操作失败的内容',
    data: typeof data === 'function' ? data(params) : data,
  });
};

const wrapRandomResponse = (data = null) => (req, res) => {
  const { code } = mockjs.mock({ 'code|1': [200, 404] });
  const msg = code === 200 ? '操作成功' : '这是操作失败的内容';
  const params = req.method === 'GET' ? req.query : req.body;
  const newData = code === 200 ? (typeof data === 'function' ? data(params) : data) : {};

  res.send({
    code,
    msg,
    data: newData,
  });
};

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // demo
  'GET /example/getHeaderDetail': wrapSuccessResponse(getHeaderDetail),
  'GET /example/getHeaderThrowError': wrapErrorResponse(),
  'GET /example/getBodyDetail': wrapSuccessResponse(getBodyDetail),
  'POST /example/submitBody': wrapSuccessResponse(),
};

export default (noProxy ? {} : delay(proxy, 500));
