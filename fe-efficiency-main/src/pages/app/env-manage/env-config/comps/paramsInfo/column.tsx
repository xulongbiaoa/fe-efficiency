import type { ColumnsType } from 'antd/es/table';

export type paramsType = {
  id: number;
  variableName: string;
  variableValue: string;
  describe: string;
};

const cloumns = (): ColumnsType<paramsType> => [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 50,
    render: (text) => <div className="column-name">{text}</div>,
  },
  {
    title: '名称',
    dataIndex: 'variableName',
    key: 'variableName',
    render: (text) => <div className="column-name">{text}</div>,
  },
  {
    title: '默认值',
    dataIndex: 'variableValue',
    key: 'variableValue',
    render: (text) => <div className="column-name">{text}</div>,
  },
  {
    title: '描述',
    key: 'description',
    dataIndex: 'description',
    render: (text) => <div className="column-name">{text}</div>,
  },
  {
    title: '操作',
    dataIndex: 'Action',
    key: 'action',
    fixed: 'right',
    width: 100,
    render: () => {
      return <div>--</div>;
    },
  },
];

export default cloumns;
