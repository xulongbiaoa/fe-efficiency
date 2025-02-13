/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
const uuids = [
  // TODO 正式权限上线后删除
  'e01f855654b04209b406432623799303', //周洪宇
  '984b227cf5b148a1a4096116e702bab0', //建甲
  '6f539a72181142b489dc84b97c4bbacd', //凤伟
  '6b9c1cfe93de4fe08521b7a8d1300886', //李权宇
  'a90a84db004d427bb834890f9deb7ff0', //王学猛
  '200ff66676ae4369b116f517677f8b53', //德振
];
// @ts-ignore
const env = APP_ENV;
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    canBase:
      (currentUser && uuids.indexOf(currentUser.userId) > -1) || env === 'dev' || env === 'test',
  };
}
