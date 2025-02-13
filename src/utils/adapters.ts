import type { AdaptedTableResponseResult, TableResponseResult } from '@/app.global';

export const tableRequestParamsAdapter = (params: any = {}) => {
  const { current = 1, ...rest } = params;
  return {
    pageNo: current,
    ...rest,
  };
};
export const tableResponseAdapter = <T>(
  resultFromAPI: TableResponseResult<T>,
): AdaptedTableResponseResult<T> => {
  const { rows = [], pageNo = 1, pageSize = 20, totalRows = 1 } = resultFromAPI.data;
  return {
    success: resultFromAPI.success,
    extra: resultFromAPI.extra,
    data: rows,
    current: pageNo,
    pageSize,
    total: totalRows,
  } as AdaptedTableResponseResult<T>;
};
export const dictAdapter = (values: any[]) => {
  const valueEnum = {};
  if (values && values.length > 0) {
    values.forEach((item: any) => {
      valueEnum[item.key] = { text: item.name };
    });
  }
  return valueEnum;
};
