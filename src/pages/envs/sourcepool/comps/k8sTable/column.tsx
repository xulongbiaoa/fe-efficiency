import { Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';

export type k8sType = {
  id: number;
  name: string;
  nodes: string;
  cpu: string;
  cpuUsed: string;
  memory: string;
  memoryUsed: string;
  kubeConfig: string;
  manager: { userId: string; name: string };
  status: number;
};

type CloumnsPropsType = {
  editSource: (params: k8sType) => void;
  deleteSource: (params: k8sType) => void;
};

const cloumns = (props: CloumnsPropsType): ColumnsType<k8sType> => [
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
    width: 300,
    render: (text) => (
      <div className="column-name">
        <a style={{ width: '300px', overflow: 'hidden', display: 'block' }}>{text}</a>
      </div>
    ),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status) => <div className="column-name">{status}</div>,
  },
  {
    title: 'Nodes',
    key: 'nodes',
    dataIndex: 'nodes',
    render: (text) => <div className="column-name">{text}</div>,
  },
  {
    title: 'CPU',
    key: 'cpu',
    dataIndex: 'cpu',
    render: (cpu, record) => (
      <div className="column-name">
        {record.cpuUsed} / {cpu}
      </div>
    ),
  },
  {
    title: 'MEM',
    key: 'memory',
    dataIndex: 'memory',
    render: (memory, record) => (
      <div className="column-name">
        {record.memoryUsed} / {memory}
      </div>
    ),
  },
  {
    title: 'KubeConfig',
    key: 'kubeConfig',
    dataIndex: 'kubeConfig',
    render: () => <div className="column-name">********</div>,
  },
  {
    title: '负责人',
    key: 'manager',
    dataIndex: 'manager',
    render: (manager) => <div className="column-name">{(manager && manager.name) || '--'}</div>,
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
              props.editSource(record);
            }}
          >
            编辑
          </a>
          <a
            onClick={() => {
              props.deleteSource(record);
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
