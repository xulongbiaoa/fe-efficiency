import React, { useState, useEffect } from 'react';
import { Button, message, Form, Select } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { getDeployStrategy, updateDeployStrategy } from '@/services/app/deploy-order';
import BaseCard from '../baseCard';

interface IParamsInfo {
  type: string;
  title: string;
  currEnvId: number;
}

const { Option } = Select;

const ContentEditor: React.FC<IParamsInfo> = (props: IParamsInfo) => {
  const [readOnly, setReadOnly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const reqGetDeployStrategy = () => {
    return getDeployStrategy(Number(props.currEnvId)).then((res) => {
      if (res && res.success) {
        form.setFieldsValue({ ...res.data });
      }
    });
  };

  const handleClick = () => {
    if (readOnly) {
      setReadOnly(false);
      message.info('可编辑');
    } else {
      const stratId = form.getFieldValue('id');
      console.log(444, stratId);
      form.validateFields().then((values) => {
        console.log(values);
        setLoading(true);
        updateDeployStrategy(stratId, values).then(() => {
          setReadOnly(true);
          setLoading(false);
          reqGetDeployStrategy();
          message.info('已保存');
        });
      });
    }
  };

  useEffect(() => {
    reqGetDeployStrategy();
  }, [props.currEnvId]);

  const renderButton = () => {
    return (
      <Button
        type="primary"
        onClick={handleClick}
        loading={loading}
        icon={readOnly ? <EditOutlined /> : <SaveOutlined />}
      >
        {readOnly ? '编辑' : '保存'}
      </Button>
    );
  };
  return (
    <BaseCard title={props.title} renderAction={() => renderButton()}>
      <Form name="deploy-stra" form={form}>
        <Form.Item name="needApproval" label="是否需要审批" rules={[{ required: true }]}>
          <Select allowClear style={{ width: 200 }} disabled={readOnly}>
            <Option value={1}>是</Option>
            <Option value={0}>否</Option>
          </Select>
        </Form.Item>
        <Form.Item name="triggerPlan" label="部署计划" rules={[{ required: true }]}>
          <Select allowClear style={{ width: 200 }} disabled={readOnly}>
            <Option value={3}>手动</Option>
            <Option value={1}>立即</Option>
          </Select>
        </Form.Item>
      </Form>
    </BaseCard>
  );
};

export default ContentEditor;
