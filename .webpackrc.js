export default {
  entry: {
    app: './src/index.js',
  },
  ignoreMomentLocale: true,
  html: {
    template: './src/index.ejs',
    user_agent_type: 'weixin',
  },
  disableDynamicImport: false,
};
