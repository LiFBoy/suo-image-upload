import { upload, getImgInfo } from '../../service/upload';
import { funErrorLogSave } from '../../utils/wxUpload';

const initState = {
  className: '', // 附加样式
  imgSize: false, // 是否需要图片尺寸信息
  onError: null,
  showHD: true,
  accept: 'image/*',
  maxCount: 9,
  length: 4, // 单行图片数量
  selectable: true,
  deleteable: true,
  multiple: false,
  onChange: null,
  fileList: [],
  sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  fileSize: false, // 是否需要图片大小
};

export default {
  namespace: 'imageUpload',

  state: initState,

  effects: {
    *uploadImg({ params }, { call }) {
      try {
        const { fileItem } = params;
        const formData = new FormData();
        formData.append('type', 'jssdk');
        formData.append('files[]', fileItem);
        const { urls } = yield call(upload, formData);
        return urls;
      } catch (error) {
        funErrorLogSave({ error, params_params: params }, 'ModelsUpload_uploadImg_error_action');
      }
    },
    *getImgUrl({ params }, { call, select }) {
      const { fileSize } = yield select(state => state.imageUpload);
      const { corpid, serverIds, pictureWatermarkUrl } = params;
      const requestParams = {
        wxCorpId: corpid,
        mediaIds: serverIds,
        pictureWatermarkUrl,
      };
      try {
        const { urls, uploadFiles } = yield call(upload, requestParams);
        return fileSize ? uploadFiles : urls;
      } catch (error) {
        funErrorLogSave(
          { error, params_requestParams: requestParams },
          'ModelsUpload_getImgUrl_error_action'
        );
      }
    },
    *getImgInfo({ params }, { call }) {
      try {
        const { imgUrl } = params;
        const { ImageWidth = {}, ImageHeight = {}, FileSize } = yield call(getImgInfo, params);
        return {
          url: imgUrl,
          imgSize: {
            width: ImageWidth.value || 0,
            height: ImageHeight.value || 0,
          },
          fileSize: FileSize.value || 0,
        };
      } catch (error) {
        funErrorLogSave({ error, params_params: params }, 'ModelsUpload_getImgInfo_error_action');
      }
    },
  },

  reducers: {
    resetState() {
      return initState;
    },
    saveState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
