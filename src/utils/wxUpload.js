const WX = window.wx;

function wrapPromise(fnName, params) {
  return new Promise((fullfilled, reject) => {
    if (typeof WX[fnName] !== 'function') {
      return reject(new Error(`wx.${fnName} is not function`));
    }
    WX[fnName]({
      ...params,
      success(res) {
        const { errMsg } = res;
        if (errMsg === `${fnName}:ok`) {
          fullfilled(res);
        } else {
          reject(errMsg);
        }
      },
      fail(err) {
        reject(err.errMsg);
      },
    });
  });
}

// 拍照或从手机相册中选图
export function chooseImage(params) {
  return wrapPromise('chooseImage', params);
}

// 上传图片
export function uploadImage(params) {
  return wrapPromise('uploadImage', params);
}

// 预览图片
export function previewImage(params) {
  return wrapPromise('previewImage', params);
}

/**
 * 图片上传组件-日志收集统一入口
 * @param params
 * @param postion
 */
export function funErrorLogSave(params, postion) {
  if (typeof window.ThrowError === 'function') {
    window.ThrowError(
      {
        ...params,
        params_session: {
          agentId: sessionStorage.getItem('agent_agentid'),
          suiteId: sessionStorage.getItem('agent_suiteid'),
        },
      },
      {
        params_project: 'nbugs-mobile-image-upload',
        params_project_name: '图片上传组件',
        params_page_postion: postion || null,
      }
    );
  }
}
