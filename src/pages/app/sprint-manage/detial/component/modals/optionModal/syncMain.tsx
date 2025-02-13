import { Modal, Form, Input, message, Select } from 'antd';

import React, { useEffect } from 'react';

interface ISyncMainModal {
  loading?: boolean;
  modalVisible: boolean;
  onOk: (params: any) => any;
  onClose: () => void;
  version: string;
  mainBranchOptions: any[];
}
const SyncMainModal: React.FC<ISyncMainModal> = ({
  loading,
  modalVisible = true,
  version,
  onOk,
  onClose,
  mainBranchOptions = [],
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [modalVisible]);

  return modalVisible ? (
    <Modal
      visible={true}
      title={'同步主干'}
      okButtonProps={{ loading }}
      onCancel={onClose}
      onOk={async () => {
        await form.validateFields();
        const values = form.getFieldsValue();
        if (!values.targetBranch) {
          message.error('参数不能为空');
          return;
        }
        onOk({
          type: 2,
          ...values,
        });
      }}
    >
      <Form form={form}>
        <Form.Item
          rules={[{ required: true }]}
          label="源分支"
          labelCol={{ span: 4 }}
          name="sourceBranch"
        >
          <Select
            showSearch
            placeholder="请选择源分支名称（默认为迭代分支）"
            options={mainBranchOptions}
          />
        </Form.Item>

        <Form.Item
          rules={[{ required: true }]}
          label="目标分支"
          name="targetBranch"
          labelCol={{ span: 4 }}
          initialValue={version}
        >
          <Input disabled placeholder="请选择分支" />
        </Form.Item>
      </Form>
    </Modal>
  ) : null;
};
export default SyncMainModal;
