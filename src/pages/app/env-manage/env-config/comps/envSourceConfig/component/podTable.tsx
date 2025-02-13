import React, { useContext, useEffect, useRef, useState } from 'react';
import type { InputRef } from 'antd';
import { Form, Input, Popconfirm, Select, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { PlusOutlined } from '@ant-design/icons';
const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  index: number;
  valueEnum: [];
  type: 'input' | 'select';
  handleSave: (record: Item) => void;
  readOnly: boolean;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  type,
  valueEnum,
  handleSave,
  readOnly,
  index,
  ...restProps
}) => {
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (dataIndex) {
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    }
  }, [record?.[dataIndex]]);

  const save = async (index1: any) => {
    try {
      const values = form.getFieldsValue();
      values.id = (record as any).id;
      handleSave({ ...values });
      await form.validateFields([index1]);
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable && !readOnly) {
    if (index !== 0 || (index === 0 && dataIndex !== 'key')) {
      childNode =
        type === 'input' ? (
          <Form.Item
            style={{ margin: 0 }}
            name={dataIndex}
            rules={[
              {
                required: true,
                message: `${title}是必填项`,
              },
            ]}
          >
            <Input
              ref={inputRef}
              onPressEnter={() => save(dataIndex)}
              onBlur={() => save(dataIndex)}
            />
          </Form.Item>
        ) : (
          <Form.Item
            style={{ margin: 0 }}
            name={dataIndex}
            rules={[
              {
                required: true,
                message: `${title}是必填项`,
              },
            ]}
          >
            <Select
              options={valueEnum}
              ref={inputRef as any}
              onSelect={() => save(dataIndex)}
              onBlur={() => save(dataIndex)}
            />
          </Form.Item>
        );
    } else {
      childNode = (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingRight: 24, minWidth: '100%', minHeight: '25px' }}
        >
          {children}
        </div>
      );
    }
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  operator: string;
  values: string;
  id?: number;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const App: React.FC<{
  dataSource: any[];
  setDataSource: (nodeSelector: any[]) => void;
  readOnly: boolean;
}> = (props) => {
  const operationMap = [
    { label: 'in list', value: 'In' },
    { label: 'not in list', value: 'NotIn' },
    { label: 'is set', value: 'Exists' },
    { label: 'is not set', value: 'DoesNotExist' },
    { label: '<', value: 'Gt' },
    { label: '>', value: 'Lt' },
  ];

  const { dataSource, setDataSource, readOnly } = props;

  const [count, setCount] = useState(2);

  const handleDelete = (id: React.Key) => {
    const newData = dataSource.filter((item) => item.id !== id);
    setDataSource(newData);
  };

  const defaultColumns: any[] = [
    {
      title: '标识',
      dataIndex: 'key',
      type: 'input',
      width: '30%',
      editable: true,
    },
    {
      title: '操作符',
      dataIndex: 'operator',
      type: 'select',
      editable: true,
      valueEnum: operationMap,
    },
    {
      title: '值',
      dataIndex: 'values',
      type: 'input',
      editable: true,
    },
  ];
  if (!readOnly) {
    defaultColumns.push({
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: any, index: number) => {
        return index !== 0 ? (
          <Popconfirm title="是否确认删除?" onConfirm={() => handleDelete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        ) : (
          ''
        );
      },
    });
  }

  const handleAdd = () => {
    const newData: DataType = {
      id: Math.random(),
      key: '',
      operator: `In`,
      values: '',
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData[index] = {
      ...item,
      ...row,
    };
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType, index: number) => ({
        record,
        index,
        editable: col.editable,
        dataIndex: col.dataIndex,
        valueEnum: col.valueEnum,
        title: col.title,
        type: col.type,
        handleSave,
        readOnly,
      }),
    };
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {!readOnly && (
          <a style={{ marginBottom: 16 }} onClick={handleAdd}>
            新增 <PlusOutlined />
          </a>
        )}
      </div>

      <Table
        pagination={false}
        rowKey={'id'}
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
      />
    </div>
  );
};

export default App;
