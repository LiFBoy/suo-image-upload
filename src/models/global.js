const initState = {
  className: '', // 附加样式
};

export default {
  namespace: 'global',

  state: initState,

  effects: {},

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
