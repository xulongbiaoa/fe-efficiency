/**
 * @param {Object} n 当前点
 * @param {Object} next 下个点
 * @returns 两个点的角度
 */
export const getAngle = (n: any, next: any) => {
  let ret;
  const w1 = (n.lat / 180) * Math.PI;
  const j1 = (n.lng / 180) * Math.PI;

  const w2 = (next.lat / 180) * Math.PI;
  const j2 = (next.lng / 180) * Math.PI;

  ret =
    4 * Math.sin((w1 - w2) / 2) ** 2 -
    (Math.sin((j1 - j2) / 2) * (Math.cos(w1) - Math.cos(w2))) ** 2;
  ret = Math.sqrt(ret);

  const temp = Math.sin((j1 - j2) / 2) * (Math.cos(w1) + Math.cos(w2));
  ret /= temp;

  ret = (Math.atan(ret) / Math.PI) * 180;
  ret += 90;

  if (j1 - j2 < 0) {
    if (w1 - w2 >= 0) {
      ret = -ret + 180;
    }
  } else if (w1 - w2 < 0) {
    ret = 180 + ret;
  } else {
    ret = -ret;
  }
  return ret;
};
