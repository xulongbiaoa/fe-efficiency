import { Modal, Form, Input, Radio } from 'antd';
import React from 'react';

// import Chart from './../chart/index';
interface IGroupModal {
  modalVisible: boolean;
  loading?: boolean;
  onClose: () => void;
  onOk: (groupName: string) => any;
}
const AddFeature: React.FC<IGroupModal> = ({ modalVisible = true, loading, onClose, onOk }) => {
  const [form] = Form.useForm();

  return modalVisible ? (
    <Modal
      visible={true}
      title={'工单审批'}
      okButtonProps={{ loading }}
      onCancel={onClose}
      onOk={async () => {
        const validate = await form.validateFields();
        if (validate) {
          onOk(form.getFieldsValue());
        }
      }}
    >
      <Form form={form}>
        <Form.Item
          rules={[{ required: true }]}
          label="审批"
          labelCol={{ span: 5 }}
          name="approvalStatus"
          initialValue={1}
        >
          <Radio.Group>
            <Radio value={1}>通过</Radio>
            <Radio value={2}>拒绝</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          rules={[{ required: true }]}
          label="描述"
          labelCol={{ span: 5 }}
          name="approvalDesc"
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  ) : null;
};
export default AddFeature;
