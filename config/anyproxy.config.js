const AnyProxy = require('anyproxy');
const chalk = require('chalk');

// 需要代理的域名列表
const proxyList = [
  'fe-m.community-sit.easyj.top',
  'test.m.xiaoyuanhao.com',
  'fe-group.community-sit.easyj.top',
];

const rule = {
  *beforeSendRequest(requestDetail) {
    const newOptions = { ...requestDetail.requestOptions };

    if (proxyList.indexOf(newOptions.hostname) >= 0) {
      newOptions.hostname = '127.0.0.1';
      newOptions.port = 8000;
    }

    return yield {
      requestOptions: newOptions,
    };
  },
};

const options = {
  port: 8001,
  rule,
  wsIntercept: true,
};
const proxyServer = new AnyProxy.ProxyServer(options);

proxyServer.on('ready', () => {
  console.log();
  console.log(chalk.green('=============================='));
  console.log(chalk.green('anyproxy is running...'));
  console.log(chalk.green('=============================='));
  console.log();
});

proxyServer.on('error', e => {
  console.log();
  console.log(chalk.red('=============================='));
  console.log(chalk.red('anyproxy found error:'));
  console.log(e);
  console.log(chalk.red('=============================='));
  console.log();
});

proxyServer.start();
