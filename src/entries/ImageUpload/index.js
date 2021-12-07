import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fundebug from 'fundebug-javascript';
import ImageUpload from './ImageUpload';
import createDva from '../../dva/dva';
import { version } from '../../../package.json';

require('fundebug-revideo');

fundebug.init({
  apikey: '20f82fb93c321d79a6094be3e4b19da5a3901681693f8784cd0e62d6e7bbb3c3',
  appversion: version,
  releasestage: 'production',
  silentHttp: true,
  // metaData: store.session(`workFlow_userInfo`), // 自定义信息
  silent: false, // 如果您暂时不需要使用 Fundebug，可以选择配置安静模式，将 silent 属性设为 true。这样的话，Fundebug 不会收集错误信息，因此也不会发送报警邮件。
  domain: 'https://s.xiaoyuanhao.com',
});

// 解决外部引用时的传参问题
export default class ImageUploadWrap extends Component {
  /* eslint-disable react/require-default-props, react/no-unused-prop-types */
  static propTypes = {
    corpid: PropTypes.string.isRequired,
    imgSize: PropTypes.bool,
    className: PropTypes.string,
    onError: PropTypes.func,
    showHD: PropTypes.bool,
    accept: PropTypes.string,
    maxCount: PropTypes.number,
    selectable: PropTypes.bool,
    deleteable: PropTypes.bool,
    multiple: PropTypes.bool,
    onChange: PropTypes.func,
    fileList: PropTypes.array,
    pictureWatermarkUrl: PropTypes.string,
    length: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sizeType: PropTypes.array,
    fileSize: PropTypes.bool,
  };
  /* eslint-enable */

  constructor(props) {
    super(props);

    this.dvaInstance = createDva(<ImageUpload />);

    this.handleUpdateState(props);
  }

  componentWillReceiveProps(nextProps) {
    this.handleUpdateState(nextProps);
  }

  handleUpdateState = props => {
    const { app } = this.dvaInstance;

    app._store.dispatch({
      type: 'imageUpload/saveState',
      payload: props,
    });
  };

  render() {
    const { Provider, app } = this.dvaInstance;

    return (
      <Provider store={app._store}>
        <ImageUpload />
      </Provider>
    );
  }
}
