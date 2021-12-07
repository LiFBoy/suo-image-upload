import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'dva-no-router';
import fundebug from 'fundebug-javascript';
import ImagePicker from 'antd-mobile/lib/image-picker';
import 'antd-mobile/lib/image-picker/style/css';
import './ImageUpload.less';
import Toast from 'nbugs-mobile-toast';
import { chooseImage, uploadImage, previewImage, funErrorLogSave } from '../../utils/wxUpload';

let serverIdList = [];

@connect(({ global, ...rest }) => ({
  className: global.className,
  ...rest.imageUpload,
}))
class ImageUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      _fileList: [],
    };

    this.onChange = this.onChange.bind(this);
    this.onImageClick = this.onImageClick.bind(this);
    this.chooseImg = this.chooseImg.bind(this);
  }

  componentWillMount() {
    this.init(this.props);
  }

  componentDidMount() {
    const { deleteable } = this.props;
    if (!deleteable) {
      this.hideRemoveIcon();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.init(nextProps);
  }

  onChange(images, operationType, index) {
    funErrorLogSave(
      {
        params_info: '图片上传change事件',
        params_images: images,
        params_index: index,
        params_operationType: operationType,
      },
      'ImageUpload_onChange_success_fun'
    );
    const me = this;
    if (operationType === 'remove') {
      try {
        me.removeImg(index)
          .then(() => {
            me.exportUrls();
          })
          .catch(err => {
            me.exportError(err);
          });
      } catch (error) {
        funErrorLogSave(
          {
            params_error: error,
            params_images: images,
            params_index: index,
            params_operationType: operationType,
          },
          'ImageUpload_onChange_error_fun'
        );
      }
    }
  }

  // 图片预览
  onImageClick(index) {
    const { showHD } = this.props;
    const { _fileList } = this.state;
    const { url = '' } = _fileList[index] || {};

    funErrorLogSave(
      {
        params_info: '图片预览',
        params_showHD: showHD,
        params_index: index,
        params_fileList: _fileList,
        params_url: url,
      },
      'ImageUpload_onImageClick_success_fun'
    );

    if (!showHD) {
      return false;
    }

    try {
      previewImage({
        current: url,
        urls: _fileList.map(item => {
          return item.url;
        }),
      });
    } catch (error) {
      funErrorLogSave(
        {
          params_error: error,
          params_showHD: showHD,
          params_index: index,
          params_fileList: _fileList,
          params_url: url,
        },
        'ImageUpload_onImageClick_error_fun'
      );
    }
  }

  // 隐藏图片移除按钮
  hideRemoveIcon = () => {
    /* eslint-disable no-param-reassign */
    const icons = document.getElementsByClassName('am-image-picker-item-remove');
    const iconArr = Array.from(icons);
    iconArr.forEach(ele => {
      ele.style.display = 'none';
    });
    /* eslint-enable */
  };

  // 错误抛出至组件调用方
  exportError = (err, requestParams) => {
    const { onError } = this.props;
    if (fundebug) {
      fundebug.notifyError(err, {
        name: '图片上传接口报错',
        metaData: {
          type: '',
          requestParams: JSON.stringify(requestParams),
          err,
        },
      });
    }
    if (typeof onError === 'function') {
      onError({ err });
    }
  };

  // 抛出urls
  exportUrls() {
    const { _fileList } = this.state;
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      onChange({ images: _fileList });
    }
  }

  // 删除图片
  removeImg(index) {
    const { _fileList } = this.state;
    return new Promise(resolve => {
      _fileList.splice(index, 1);
      this.setState(
        {
          _fileList,
        },
        () => {
          resolve(_fileList);
        }
      );
    }).catch(error => {
      funErrorLogSave(
        { params_error: error, params_index: index, params_fileList: _fileList },
        'ImageUpload_RemoveImgCatch_error_fun'
      );
    });
  }

  chooseImg(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    const { _fileList } = this.state;
    const { multiple, maxCount, sizeType } = this.props;

    try {
      chooseImage({
        count: multiple ? maxCount - _fileList.length : 1,
        sizeType: sizeType || ['original', 'compressed'],
      })
        .then(res => {
          const { localIds } = res;
          if (Array.isArray(localIds) && localIds.length) {
            Toast.loading('上传中', 100);
            return this.uploadToWX(localIds);
          }
        })
        .catch(err => {
          Toast.hide();
          console.log('选择图片失败');
          this.exportError(`选择图片失败：${err}`);
          Toast.info(`选择图片失败：${err}`);
          funErrorLogSave(
            {
              params_error: err,
              params_fileList: _fileList,
              params_multiple: multiple,
              params_maxCount: maxCount,
            },
            'ImageUpload_chooseImg_chooseImageCatch_error_fun'
          );
        });
    } catch (error) {
      funErrorLogSave(
        {
          params_error: error,
          params_fileList: _fileList,
          params_multiple: multiple,
          params_maxCount: maxCount,
        },
        'ImageUpload_chooseImg_chooseImageTryCatch_error_fun'
      );
    }
  }

  // 上传至微信服务
  uploadToWX(localIds) {
    if (!localIds.length) {
      return this.uploadToBusiness(serverIdList);
    }
    const localId = localIds.shift();

    try {
      return uploadImage({
        localId,
        isShowProgressTips: 1,
      })
        .then(res => {
          const { serverId } = res;
          serverIdList.push(serverId);
          this.uploadToWX(localIds);
        })
        .catch(err => {
          serverIdList = [];
          Toast.hide();
          console.log('上传图片至微信失败', {
            localId,
          });
          this.exportError(`上传图片至微信失败：${err}`);
          Toast.info(`上传图片至微信失败：${err}`);
          funErrorLogSave(
            { params_error: err, params_localId: localId, params_localIds: localIds },
            'ImageUpload_uploadToWXCatch_error_fun'
          );
        });
    } catch (error) {
      funErrorLogSave(
        { params_error: error, params_localId: localId, params_localIds: localIds },
        'ImageUpload_uploadToWXTryCatch_error_fun'
      );
    }
  }

  // 上传至公司服务
  uploadToBusiness(serverIds) {
    const { _fileList } = this.state;
    const { dispatch, imgSize, fileSize, corpid, pictureWatermarkUrl } = this.props;
    try {
      return dispatch({
        type: 'imageUpload/getImgUrl',
        params: {
          corpid,
          serverIds,
          pictureWatermarkUrl,
        },
      })
        .then(ImgUrls => {
          funErrorLogSave({ params_ImgUrls: ImgUrls }, 'ImageUpload_uploadToBusiness_success_fun');
          if (!imgSize) {
            this.setState(prevState => {
              const tempList = prevState._fileList.concat(
                ImgUrls.map(imgInfo => {
                  if (fileSize) {
                    return {
                      ...imgInfo,
                      imgSize: {
                        width: 0,
                        height: 0,
                      },
                    };
                  } else {
                    return {
                      url: imgInfo,
                      imgSize: {
                        width: 0,
                        height: 0,
                      },
                    };
                  }
                })
              );
              return {
                _fileList: tempList,
              };
            });
            return false;
          }
          const promiseList = ImgUrls.map(imgInfo => {
            return dispatch({
              type: 'imageUpload/getImgInfo',
              params: {
                imgUrl: fileSize ? imgInfo.url : imgInfo,
              },
            });
          });
          return Promise.all(promiseList).then(res => {
            this.setState({
              _fileList: _fileList.concat(res),
            });
          });
        })
        .then(() => {
          Toast.hide();
          this.exportUrls();
        })
        .catch(err => {
          Toast.hide();
          const requestParams = {
            wxCorpId: corpid,
            mediaIds: serverIds,
          };
          console.log('图片上传服务失败', requestParams);
          this.exportError(`图片上传服务失败：${err}`, requestParams);
          Toast.info(`图片上传服务失败：${err}`);
          funErrorLogSave(
            {
              params_error: err,
              params_fileList: _fileList,
              params_imgSize: imgSize,
              params_corpid: corpid,
            },
            'ImageUpload_uploadToBusinessCatch_error_fun'
          );
        })
        .finally(() => {
          serverIdList = [];
        });
    } catch (error) {
      funErrorLogSave(
        {
          params_error: error,
          params_fileList: _fileList,
          params_imgSize: imgSize,
          params_corpid: corpid,
        },
        'ImageUpload_uploadToBusinessTryCatch_error_fun'
      );
    }
  }

  init(props) {
    const { fileList } = props;
    this.setState(
      {
        _fileList: fileList.map(item => {
          const { url = '' } = item;
          return {
            ...item,
            url,
          };
        }),
      },
      () => {
        funErrorLogSave({ _fileList: this.state._fileList }, 'ImageUpload_init_success_fun');
      }
    );
  }

  render() {
    const { className, accept, maxCount, selectable, multiple, length } = this.props;
    const { _fileList } = this.state;
    const appCls = classNames(['nbugs-mobile-image-upload', className]);

    return (
      <div className={appCls}>
        <ImagePicker
          files={_fileList}
          accept={accept}
          length={length}
          selectable={_fileList.length < maxCount && selectable}
          multiple={multiple}
          onChange={this.onChange}
          onImageClick={this.onImageClick}
          onFail={this.exportError}
          onAddImageClick={this.chooseImg}
        />
      </div>
    );
  }
}

export default ImageUpload;

window.nbugsMobileImageUploadOnClosePreviewWrap = () => {
  document.querySelector('#nbugs-mobile-image-upload-preview-wrap').innerHTML = '';
};
