export interface Vehicle {
  id: number;
  vin: string;
  brand: string;
  remark: string;
  loadBearing: string;
  onlineStatus: number;
  ip: string;
}

export type TableListItem = {
  uid?: number;
  name?: string;
  content?: string;
  email?: string;
  status?: number;
  tel?: string;
  type?: number;
  createdTime?: number;
  updatedTime?: number;
  userNo?: string;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};

export type TravelListItem = {
  VIN?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  mileageStart?: number;
  mileageEnd?: number;
  mileagePart?: number;
  maxSpeed?: number;
};
