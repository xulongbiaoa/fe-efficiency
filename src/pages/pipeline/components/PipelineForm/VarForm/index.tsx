import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { PlusCircleOutlined, DeleteFilled, PlusCircleFilled } from '@ant-design/icons';
import { Table, Modal, Form, Row, Col, Input, Switch, Button, message } from 'antd';
import charColumns from './charCloumns';
import './index.less';

const colLayout = {
  lg: 8,
  xl: 8,
  xxl: 8,
};

const colLayout2 = {
  lg: 3,
  xl: 3,
  xxl: 3,
};

const colLayout4 = {
  lg: 16,
  xl: 16,
  xxl: 16,
};

export type DataType = {
  varDesc: string;
  varName: string;
  varDefValue: string | number;
  varOptions: any[];
  varRuningFlag: number;
};

type VarEditFormType = {
  mode: string;
  editData: DataType | null | undefined;
};

type VarFormType = {
  title?: string;
  data?: DataType[];
};

// 默认数据
const defaultFormVal: DataType = {
  varDesc: '',
  varName: '',
  varDefValue: '',
  varOptions: [{ value: '', isDefault: true }],
  varRuningFlag: 1,
};

// 格式化数据 varOptions {value: string, isDefault: boolean}
const formatVarVal = (data: DataType) => {
  let { varOptions } = data;
  const varDefValue = data.varDefValue;
  if (varOptions) {
    varOptions = varOptions.map((val) => {
      return {
        value: val,
        isDefault: Boolean(varDefValue === val),
      };
    });
  }
  return { ...data, varOptions };
};

// 数据解析
const parseVarVal = (data: DataType) => {
  let { varOptions } = data;
  const defaultValId = varOptions.findIndex((item) => item.isDefault);
  const varDefValue = varOptions[defaultValId].value || '';
  varOptions = varOptions.map((item: { value: string; isDefault: boolean }) => item.value);
  return { ...data, varDefValue, varOptions };
};

// 新建弹窗
const VarEditForm = forwardRef((props: VarEditFormType, ref: any) => {
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => {
    return {
      getFromData: () => {
        return form.validateFields();
      },
    };
  });

  const handleDealSwitch = (e: boolean, index: number) => {
    const fieldsVal = form.getFieldsValue();
    const { varOptions } = fieldsVal;
    if (Boolean(e) === false) {
      varOptions[index].isDefault = true;
      message.warn('至少保证一个默认值');
    } else {
      varOptions.forEach((item: { value: any; isDefault: boolean }) => (item.isDefault = false));
      varOptions[index].isDefault = true;
    }
    return form.setFieldsValue({ ...fieldsVal, varOptions });
  };

  return (
    <Form
      name="var_form"
      autoComplete="off"
      initialValues={!props.editData ? defaultFormVal : formatVarVal(props.editData)}
      form={form}
      layout="vertical"
    >
      <Row gutter={24}>
        <Col {...colLayout} span={6}>
          <Form.Item
            label="变量名称"
            name="varName"
            key="varName"
            rules={[
              {
                required: true,
                whitespace: true,
                message: '请输入变量名称',
              },
            ]}
          >
            <Input placeholder="请输入变量名称" />
          </Form.Item>
        </Col>
        <Col {...colLayout} span={6}>
          <Form.Item
            label="变量描述"
            name="varDesc"
            key="varDesc"
            rules={[
              {
                required: true,
                whitespace: true,
                message: '请输入变量描述',
              },
            ]}
          >
            <Input placeholder="请输入变量描述" />
          </Form.Item>
        </Col>
        <Col {...colLayout} span={6}>
          <Form.Item
            label="运行时设置"
            name="varRuningFlag"
            key="varRuningFlag"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ paddingBottom: 10, color: 'rgba(0, 0, 0, 0.85)' }} gutter={24}>
        <Col {...colLayout4} span={6}>
          <div>变量值</div>
        </Col>
        <Col {...colLayout2} span={6}>
          <div>默认值</div>
        </Col>
        <Col {...colLayout2} span={6}>
          <div>操作</div>
        </Col>
      </Row>
      <Row>
        <Form.List name="varOptions">
          {(fields, { add, remove }, {}) => {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                {fields.map((field, index) => {
                  return (
                    <Row gutter={24} key={index}>
                      <Col {...colLayout4} span={6}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'value']}
                          fieldKey={[field.name, 'value']}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: '请输入选项值',
                            },
                          ]}
                        >
                          <Input placeholder="请输入选项值" />
                        </Form.Item>
                      </Col>
                      <Col {...colLayout2} span={6}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'isDefault']}
                          fieldKey={[field.name, 'isDefault']}
                          valuePropName="checked"
                        >
                          <Switch onChange={(e) => handleDealSwitch(e, index)} />
                        </Form.Item>
                      </Col>
                      <Col {...colLayout2} span={6}>
                        <div
                          style={{ color: '#999', fontSize: 20, fontWeight: 'bold' }}
                          onClick={() => {
                            if (fields.length > 1) {
                              remove(field.name);
                            } else {
                              message.warning('至少保留一项！');
                            }
                          }}
                        >
                          <DeleteFilled />
                        </div>
                      </Col>
                    </Row>
                  );
                })}
                <Form.Item>
                  <Button
                    onClick={() => add({ value: '', isDefault: false })}
                    type="link"
                    style={{ marginLeft: '-20px' }}
                  >
                    <PlusCircleFilled /> 新建变量
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>
      </Row>
    </Form>
  );
});

const VarForm = forwardRef((props: VarFormType, ref: any) => {
  const [data, setData] = useState<DataType[]>(props.data || []);
  const [modifyRecord, setModifyRecord] = useState<DataType | null>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState<string>('新建变量');
  const [mode, setMode] = useState<string>('add');
  const varRef: any = useRef();

  useImperativeHandle(ref, () => {
    return {
      getVariableData: () => {
        return Promise.resolve(data);
      },
    };
  });

  // 新建
  const handleCreateNew = () => {
    setMode('add');
    setTitle('新建变量');
    setModifyRecord(null);
    setIsModalVisible(true);
  };

  // 弹窗编辑数据
  const modifyData = (record: DataType) => {
    setMode('edit');
    setTitle('修改变量');
    setModifyRecord(record);
    setIsModalVisible(true);
  };

  // 确定添加
  const handleOk = () => {
    varRef.current?.getFromData().then((values: any) => {
      const { varName } = values;
      if (mode === 'add') {
        const editIndex = data.findIndex((item) => item.varName === varName);
        if (editIndex >= 0) {
          return message.error('变量名称已存在');
        } else {
          const newData: DataType[] = [...data, parseVarVal(values)];
          setData(newData);
          setIsModalVisible(false);
          return;
        }
      } else {
        const editIndex = data.findIndex((item) => item.varName === modifyRecord?.varName);
        if (editIndex >= 0) {
          data[editIndex] = parseVarVal(values);
        }
        setData([...data]);
        setIsModalVisible(false);
        return;
      }
    });
  };

  // 删除
  const deleteData = (record: DataType) => {
    const { varName } = record;
    const _id = data.findIndex((item) => item.varName === varName);
    data.splice(_id, 1);
    setData([...data]);
  };

  // 表格内编辑数据
  const editData = (record: DataType, key: string, val: any) => {
    const { varName } = record;
    data.forEach((item) => {
      if (item.varName === varName) {
        item[key] = Number(val);
      }
    });
    setData([...data]);
  };

  return (
    <div className="var-form-container">
      <div className="head-title">
        <div className="title">{props?.title}</div>
        <div className="add" onClick={handleCreateNew}>
          <PlusCircleOutlined /> 新建变量
        </div>
      </div>
      <div className="table">
        <Table
          rowKey="varName"
          columns={charColumns({ editData, deleteData, modifyData } as any)}
          dataSource={data as any}
          pagination={false}
        />
      </div>
      <Modal
        title={title}
        width={800}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <VarEditForm ref={varRef} mode={mode} editData={modifyRecord} />
      </Modal>
    </div>
  );
});

export default VarForm;
