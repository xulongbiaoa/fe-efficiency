import { DeleteOutlined, EditFilled } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Switch, Space } from 'antd';

type DataType = {
  var_name: string;
  var_def_value: number | string;
  private: boolean;
  var_runing_flag: boolean;
};

type charCloumnsProps = {
  editData?: (record: DataType, key: string, val: any) => void;
  modifyData?: (record: DataType) => void;
  deleteData?: (record: DataType) => void;
};

const charCloumns = (props: charCloumnsProps): ColumnsType<DataType> => [
  {
    title: '变量名称',
    dataIndex: 'varName',
    key: 'varName',
    render: (text) => {
      return <div>{text}</div>;
    },
  },
  {
    title: '默认值',
    dataIndex: 'varDefValue',
    key: 'varDefValue',
    render: (text) => {
      return <div>{text}</div>;
    },
  },
  {
    title: '可选值',
    dataIndex: 'varOptions',
    key: 'varOptions',
    render: (vars) => {
      return `${vars && Array.isArray(vars) ? vars.join('，') : vars}`;
    },
  },
  {
    title: '运行时设置',
    dataIndex: 'varRuningFlag',
    key: 'varRuningFlag',
    width: 120,
    render: (text, record) => {
      return (
        <Switch
          checked={text}
          onChange={(e) => props.editData && props.editData(record, 'varRuningFlag', e)}
        />
      );
    },
  },
  {
    title: '操作',
    dataIndex: 'Action',
    key: 'action',
    render: (text, record) => {
      return (
        <Space size="large">
          <div
            style={{ color: '#0984f9' }}
            onClick={() => props.modifyData && props.modifyData(record)}
          >
            <EditFilled />
          </div>
          <div
            style={{ color: 'red' }}
            onClick={() => props.deleteData && props.deleteData(record)}
          >
            <DeleteOutlined />
          </div>
        </Space>
      );
    },
  },
];

export default charCloumns;
