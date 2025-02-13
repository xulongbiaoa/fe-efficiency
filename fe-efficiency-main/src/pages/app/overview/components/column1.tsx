import type { ColumnsType } from 'antd/es/table';
import { deployStatus } from '../../const';
import moment from 'moment';

export type DataType = {
  id?: number;
  ident?: string;
  name?: string;
  status?: string; // "INIT IN_PROGRESS SUCCESS FAIL"
  deployType?: string;
  deployName?: any;
  deployInfo: {
    branch: string;
    version: string;
    versionTime: string;
  };
};

const cloumns = (): ColumnsType<DataType> => [
  {
    title: '部署环境',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <div className="column-name">{text}</div>,
  },
  {
    title: '部署时间',
    dataIndex: 'time',
    key: 'time',
    render: (text, record: DataType) => (
      <div className="column-name">
        {record.deployInfo?.versionTime
          ? moment(record.deployInfo?.versionTime || 0).format('YYYY-MM-DD HH:mm:ss')
          : '--'}
      </div>
    ),
  },
  {
    title: '部署状态',
    dataIndex: 'status',
    key: 'status',
    render: (text) => (
      <div className="column-name">
        {deployStatus.filter((item) => item.value === Number(text))[0]?.name || '--'}
      </div>
    ),
  },
  //   {
  //     title: '迭代名称',
  //     key: 'status',
  //     dataIndex: 'status',
  //     render: (text) => <div className="column-name">{text}</div>,
  //   },
  {
    title: '分支名称',
    key: 'branch',
    dataIndex: 'branch',
    render: (text, record: DataType) => (
      <div className="column-name">{record.deployInfo?.branch || '--'}</div>
    ),
  },
  {
    title: '分支版本号',
    dataIndex: 'version',
    key: 'version',
    render: (text, record: DataType) => (
      <div className="column-name">{record.deployInfo?.version || '--'}</div>
    ),
  },
];

export default cloumns;
