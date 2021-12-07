export const ENV = (document.querySelector('meta[name="x-server-env"]') || { content: 'dev' })
  .content;
