export interface ResponseResult<T = any> {
  extra: any;
  success: boolean;
  data: T;
  errorCode: string;
  errorMessage: string;
}
export interface TableData<T> {
  pageNo: number;
  rows: T;
  pageSize: number;
  totalRows: number;
}
// API返回的表格数据
export type TableResponseResult<T> = ResponseResult<TableData<T>>;

// 经过adapter处理后能够被proTable消费的数据
export interface AdaptedTableResponseResult<T> {
  success: boolean;
  extra: any;
  data: T;
  current: number;
  pageSize: number;
  total: number;
}

declare global {
  interface Window {
    BMap: any;
    BMapGL: any;
    BMapGLLib: any;
  }
}
