import React from 'react';
import ReactDOM from 'react-dom';
import ImageUpload from './component';

const AUTHCENTER = window.authcenter || null;

const fileList = [
  {
    url: 'https://jybxiaochong.oss-cn-hangzhou.aliyuncs.com/d415c6d6d6c04424ba6f70d64b0f11bd',
    imgSize: {
      width: 400,
      height: 300,
    },
  },
  {
    url: 'https://jybxiaochong.oss-cn-hangzhou.aliyuncs.com/83f52d9859bd4b41bbb70a8d12fca4ef',
    imgSize: {
      width: 400,
      height: 300,
    },
  },
];

class Test extends React.Component {
  state = {
    fileListState: [...fileList],
  };

  componentWillMount() {
    console.log(AUTHCENTER, 'AUTHCENTER');
    AUTHCENTER.ready(() => {
      AUTHCENTER.initWxConfig(window.token, () => {});
    });
  }

  onChange = data => {
    console.log('​Test -> onChange -> data', data);
    this.setState({
      fileListState: data.images,
    });
  };

  render() {
    const { fileListState } = this.state;
    // return <div>333</div>;
    return (
      <ImageUpload
        corpid="ww82eccfe49dd5fb65"
        className="customer-class-name"
        fileList={fileListState}
        sizeType={['compressed']}
        length={3}
        imgSize
        maxCount={9}
        multiple
        fileSize
        onChange={this.onChange.bind(this)}
      />
    );
  }
}

ReactDOM.render(<Test />, document.getElementById('root'));
