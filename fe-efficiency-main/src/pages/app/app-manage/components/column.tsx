import { Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { appLevels, appStatus } from '../../const';

export type TAppData = {
  id: 1;
  name: string;
  unitCode: string;
  type: number;
  level: string;
  createTime: string;
  status: number;
  devMode: string | null;
};

type CloumnsPropsType = {
  jumpToAppManage: (params: TAppData) => void;
  deleteAppAction: (params: TAppData) => void;
};

const cloumns = (props: CloumnsPropsType): ColumnsType<TAppData> => [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 50,
    render: (text) => <div className="column-name">{text}</div>,
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <div className="column-name">{text}</div>,
  },
  {
    title: '等级',
    dataIndex: 'level',
    key: 'level',
    width: 50,
    render: (text) => (
      <div className="column-name">
        {appLevels.filter((item) => item.value === Number(text))[0]?.name || '--'}
      </div>
    ),
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    width: 100,
    render: (text) => (
      <div className="column-name">
        {appStatus.filter((item) => item.value === Number(text))[0]?.name || '--'}
      </div>
    ),
  },
  {
    title: '负责人',
    key: 'owner',
    dataIndex: 'owner',
    width: 150,
    render: (owner) => <div className="column-name">{owner ? owner.name : '--'}</div>,
  },
  {
    title: '操作',
    dataIndex: 'Action',
    key: 'action',
    fixed: 'right',
    width: 100,
    render: (text, record) => {
      return (
        <Space>
          <a
            onClick={() => {
              props.jumpToAppManage(record);
            }}
          >
            管理
          </a>
          <a
            onClick={() => {
              props.deleteAppAction(record);
            }}
          >
            删除
          </a>
        </Space>
      );
    },
  },
];

export default cloumns;
