import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Form, Drawer, Input, Button, Space, Modal } from 'antd';
import { PlusCircleFilled, MinusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/ext-language_tools';
import './index.less';

type StepType = {
  name: string;
  script: string;
};

type FlowJobType = {
  ref: any;
  jobIndex: number;
  groupIndex: number;
  stagename: string;
  job: string;
  agentScript: string;
  steps?: StepType[];
  delJobs: (groupIndex: number, jobIndex: number) => void;
  modifyJobs: (stage: any, groupIndex: number, jobIndex: number) => void;
};

const FlowJob: React.FC<FlowJobType> = forwardRef((props: FlowJobType, ref: any) => {
  const [job, setJob] = useState(props.job);
  const [visible, setVisible] = useState(false);
  const [scaleCodeNumber, setScaleCodeNumber] = useState<undefined | number>(undefined);

  const [form] = Form.useForm();

  const validateFieldsData = () => {
    return new Promise((resolve, reject) => {
      form
        .validateFields()
        .then((values) => {
          resolve(values);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  useImperativeHandle(ref, () => {
    return {
      getFieldsData: () => {
        return validateFieldsData();
      },
    };
  });

  const handleConfigClose = () => {
    setScaleCodeNumber(undefined);
    const { groupIndex, jobIndex, modifyJobs } = props;
    const formData = form.getFieldsValue();
    formData.name = formData.job;
    delete formData.job;
    modifyJobs(formData, groupIndex, jobIndex);
    setVisible(false);
  };

  const handleDeleteStage = () => {
    Modal.confirm({
      content: '确认删除该节点吗？',
      onOk: () => {
        const { groupIndex, jobIndex, delJobs } = props;
        delJobs(groupIndex, jobIndex);
        setVisible(false);
      },
    });
  };

  return (
    <div className="flow-job">
      <div className="node" onClick={() => setVisible(true)}>
        {job || '未命名'}
      </div>
      <Drawer
        title={
          <Space align="center">
            <span>{job}节点配置信息</span>
            <DeleteOutlined style={{ color: 'red' }} onClick={handleDeleteStage} />
          </Space>
        }
        placement="right"
        onClose={handleConfigClose}
        visible={visible}
        width={scaleCodeNumber == undefined ? '' : '100%'}
        forceRender={true}
        bodyStyle={{ overflow: scaleCodeNumber !== undefined ? 'hidden' : 'auto' }}
      >
        <Form form={form} layout="vertical" name="flow-job-config" initialValues={{ ...props }}>
          {
            <Form.Item
              requiredMark={false}
              label="任务名称"
              name="job"
              key="job"
              rules={[{ required: true, message: '请输入任务名称' }]}
              style={{ display: scaleCodeNumber == undefined ? 'block' : 'none' }}
            >
              <Input placeholder="请输入任务名称" onChange={(e) => setJob(e.currentTarget.value)} />
            </Form.Item>
          }
          {scaleCodeNumber == undefined && (
            <Form.Item
              label="运行节点标识"
              name="agentScript"
              key="agentScript"
              rules={[{ required: false, message: '请输入运行节点标识' }]}
            >
              <Input placeholder="请输入运行节点标识" />
            </Form.Item>
          )}

          <Form.List name="steps">
            {(fields, { add, remove }, {}) => {
              return (
                <>
                  <div
                    className="add-step"
                    style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}
                  >
                    {scaleCodeNumber == undefined && (
                      <>
                        <div className="label" style={{ fontWeight: 'bold' }}>
                          任务步骤
                        </div>
                        <Button onClick={() => add()} type="link">
                          <PlusCircleFilled /> 添加步骤
                        </Button>
                      </>
                    )}
                  </div>
                  {fields.map((field, index) => {
                    if (scaleCodeNumber !== undefined && scaleCodeNumber !== field.name) {
                      return null;
                    }
                    return (
                      <div key={index}>
                        {scaleCodeNumber == undefined && (
                          <Form.Item
                            name={[field.name, 'name']}
                            fieldKey={[field.name, 'name']}
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message: '请输入步骤名称',
                              },
                            ]}
                          >
                            <Input placeholder="请输入步骤名称" />
                          </Form.Item>
                        )}

                        <Button
                          type="primary"
                          style={{ marginBottom: '20px' }}
                          onClick={() => {
                            if (scaleCodeNumber == undefined) {
                              setScaleCodeNumber(field.name);
                              return;
                            }
                            setScaleCodeNumber(undefined);
                          }}
                        >
                          {scaleCodeNumber == undefined ? '放大' : '缩小'}
                        </Button>

                        <Form.Item
                          name={[field.name, 'script']}
                          fieldKey={[field.name, 'script']}
                          validateTrigger={['onChange', 'onBlur']}
                          valuePropName="value"
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: '请输入执行脚本',
                            },
                          ]}
                        >
                          <AceEditor
                            mode="sh"
                            theme="twilight"
                            height={scaleCodeNumber === undefined ? '200px' : '65vh'}
                            width={scaleCodeNumber === undefined ? '460px' : ''}
                            name="UNIQUE_ID_OF_DIV"
                            editorProps={{ $blockScrolling: true }}
                          />
                        </Form.Item>
                        <Form.Item>
                          <div
                            onClick={() => remove(field.name)}
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              alignItems: 'center',
                              color: 'red',
                            }}
                          >
                            {scaleCodeNumber == undefined && (
                              <>
                                <MinusCircleOutlined />

                                <span style={{ padding: '0 5px' }}>删除</span>
                              </>
                            )}
                          </div>
                        </Form.Item>
                      </div>
                    );
                  })}
                </>
              );
            }}
          </Form.List>
        </Form>
      </Drawer>
    </div>
  );
});

export default FlowJob;
