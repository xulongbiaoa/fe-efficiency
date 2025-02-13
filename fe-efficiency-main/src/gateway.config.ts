const env = APP_ENV;
// 本地配置
let vehicleServer = '';
let incServer = '';
let socketServer = '';
let userServer = '';
let openLoginDomain = '';
let poolCode = '';
let appCode = '';
console.log('env:', env);
switch (env) {
  case 'dev':
    vehicleServer = `//iov-admin-gw-dev01.api.deepway.com`;
    incServer = `//iov-admin-gw-dev01.api.deepway-inc.com`;
    socketServer = '';
    userServer = '//iov-gw-dev01.api.deepway.com';
    openLoginDomain = '//ihome-dev01.deepway-inc.com';
    poolCode = '123456iop';
    appCode = 'b7e3ef2eef064048a72b6b0ac4481b7b';
    break;
  case 'test':
    vehicleServer = `//iov-admin-gw-test02.api.deepway.com`;
    incServer = `//iov-admin-gw-test02.api.deepway-inc.com`;
    socketServer = '';
    userServer = '//iov-gw-test02.api.deepway.com';
    openLoginDomain = '//ihome-test02.deepway-inc.com';
    poolCode = '123456iop';
    appCode = 'b7e3ef2eef064048a72b6b0ac4481b7b';
    break;
  case 'pre':
    vehicleServer = `//iov-admin-gw-pre01.api.deepway.com`;
    incServer = `//iov-admin-gw-pre01.api.deepway-inc.com`;
    socketServer = '';
    userServer = '//iov-gw-pre01.api.deepway.com';
    openLoginDomain = '//ihome-pre01.deepway-inc.com';
    poolCode = '996b1e9203ed45908af05a6db4185625';
    appCode = '08ff88e551c24fa7b6137f3d9397f133';
    break;
  case 'prod':
    vehicleServer = `//iov-admin-gw.api.deepway.com`;
    incServer = `//iov-admin-gw.api.deepway-inc.com`;
    socketServer = '';
    userServer = '//iov-gw.api.deepway.com';
    openLoginDomain = '//ihome.deepway-inc.com';
    poolCode = '996b1e9203ed45908af05a6db4185625';
    appCode = '1e5617e9d4cf4126b5dfa7931a3cadca';
    break;
  default:
    vehicleServer = `//iov-admin-gw.api.deepway.com`;
    incServer = `//iov-admin-gw.api.deepway-inc.com`;
    socketServer = '';
    userServer = '//iov-gw.api.deepway.com';
    openLoginDomain = '//ihome.deepway-inc.com';
    poolCode = '996b1e9203ed45908af05a6db4185625';
    appCode = '7def1b88331a4f06a1d792c25e201b07';
}

export default {
  vehicleServer,
  incServer,
  socketServer,
  userServer,
  openLoginDomain,
  poolCode,
  appCode,
};
