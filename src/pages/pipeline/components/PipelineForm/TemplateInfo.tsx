/* eslint-disable @typescript-eslint/no-shadow */
import React, { useContext, useLayoutEffect } from 'react';
import { Form, Input, Row, Col, message, Divider } from 'antd';
import { useEventBus } from '@/hooks/useEventBus';
import { EditContext } from '../../edit/editContext';

const colLayout = {
  lg: 12,
  xl: 12,
  xxl: 12,
};

export type TemplateInfoType = {
  name: string;
  category: string;
};

interface ITemplateInfo {
  mode: string;
  baseInfo?: TemplateInfoType;
}

const TemplateInfo: React.FC<ITemplateInfo> = (props: ITemplateInfo) => {
  const { submitData, setSubmitData } = useContext(EditContext) as any;
  const [form] = Form.useForm();

  useLayoutEffect(() => {
    const newData = Object.assign({}, props.baseInfo);
    form.setFieldsValue(newData);
  }, [props.baseInfo]);

  const handleSaveVarData = () => {
    return form
      .validateFields()
      .then((values) => {
        submitData.baseInfo = values;
        setSubmitData({ ...submitData });
      })
      .catch(() => {
        message.error({ content: '模板信息存在未填写项', duration: 1 });
        submitData.baseInfo = 'error';
        setSubmitData({ ...submitData });
      });
  };

  useEventBus('collect:data', () => {
    return handleSaveVarData();
  });

  return (
    <div>
      <h4>模板</h4>
      <div style={{ color: '#999' }}>选择模板分类，并为模板设置唯一名称</div>
      <Divider />
      <Form layout="vertical" initialValues={props.baseInfo} form={form}>
        <Row>
          <Col {...colLayout}>
            <Form.Item
              label="模板名称"
              name="name"
              key="name"
              rules={[{ required: true, message: '请输入流水线名称' }]}
            >
              <Input placeholder="请输入名称" allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...colLayout}>
            <Form.Item
              label="分类"
              name="category"
              key="category"
              rules={[{ required: true, message: '请选择分类' }]}
            >
              <Input placeholder="请输入名称" allowClear />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default TemplateInfo;
