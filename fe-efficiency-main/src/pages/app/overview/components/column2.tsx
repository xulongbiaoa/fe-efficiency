import type { ColumnsType } from 'antd/es/table';
import { sprintStatus } from '../../const';
import moment from 'moment';
import { Tag } from 'antd';
export type DataType = {
  id?: number;
  name?: string;
  status?: string;
  owner: {
    id: number;
    uid: string;
    name: string;
  };
};

type TSprint = {
  jumpToSprintDetail: (record: DataType) => void;
};

const cloumns = (props: TSprint): ColumnsType<DataType> => [
  {
    title: '迭代ID',
    dataIndex: 'id',
    key: 'id',
    render: (text) => <div className="column-name">{text}</div>,
  },
  {
    title: '迭代名称',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <div className="column-name">{text}</div>,
  },
  {
    title: '主研发',
    dataIndex: 'owner',
    key: 'owner',
    render: (owner) => <div className="column-name">{owner ? owner.name : '--'}</div>,
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    render: (status) => {
      if (!status) {
        return '--';
      }
      return (
        <div className="column-name">
          <Tag color={sprintStatus[status]?.color}>{sprintStatus[status]?.text}</Tag>
        </div>
      );
    },
  },
  {
    title: '最后更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    render: (time) => (
      <div className="column-name">{time ? moment(time).format('yyyy-MM-DD HH:mm:ss') : '--'}</div>
    ),
  },
  {
    title: '操作',
    dataIndex: 'Action',
    key: 'action',
    render: (text, record) => {
      return <a onClick={() => props.jumpToSprintDetail(record)}>详情</a>;
    },
  },
];

export default cloumns;
