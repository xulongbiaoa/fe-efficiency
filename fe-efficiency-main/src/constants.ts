export const CODE_MESSAGE = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
export const dictsKeys = [
  'MODEL_BRAND_DICT', //车品牌
  'MODEL_MARK_DICT', //车型标识
  'VEHICLE_USE_TYPE_DICT', //车辆使用类型
  'VEHICLE_USE_STATE_DICT', //车辆状态 (未销售,已经销售)
  'DEVICE_TYPE_DICT', //设备类型 (TBOX , CDCU)
  'DEVICE_INSTALL_STATE_DICT', //设备安装状态  (未安装,已安装)
  'SIM_BIND_STATE_DICT', //绑定状态 （未绑定,已绑定
  'SIM_CERT_STATE_DICT', //SIM实名状态 (待认证,认证中,已认证,认证失败)
  'SIM_ACTIVATE_STATE_DICT', //激活状态 (待激活,已激活,未激活,不可用)，
  'DEVICE_REMOVE_TAG_DICT', // 可用 不可用
  'SIM_CARRIER_DICT', //移动 联通 电信
  'OWNER_CUSTOM_TYPE_DICT', //客户类型
  'OWNER_CERT_TYPE_DICT', //证件类型
];
export const maleDict = [
  {
    key: '1',
    name: '男',
  },
  {
    key: '2',
    name: '女',
  },
];
