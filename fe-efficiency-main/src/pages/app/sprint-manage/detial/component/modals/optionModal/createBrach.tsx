import { Input, Modal, Form, Select } from 'antd';
import React, { useEffect, useState } from 'react';

import { getMember } from '@/services/app/sprint-manage';
interface IGroupModal {
  modalVisible: boolean;
  loading?: boolean;
  onClose: () => void;
  onOk: (groupName: string) => any;
  form: any;
}
const GroupModal: React.FC<IGroupModal> = ({
  modalVisible = true,
  loading,
  onClose,
  onOk,
  form,
}) => {
  const [options, setOptions] = useState([]);
  const handleGetSelect = async () => {
    try {
      const res = await getMember({});
      if (res.success) {
        setOptions(res.data.rows);
      }
    } catch (error) {}
  };
  useEffect(() => {
    handleGetSelect();
  }, []);

  return modalVisible ? (
    <Modal
      visible={true}
      title={'创建分支'}
      okButtonProps={{ loading }}
      onCancel={onClose}
      onOk={() => {
        onOk(form.getFieldsValue());
      }}
    >
      <Form form={form}>
        <Form.Item required label="名称" labelCol={{ span: 4 }} name="sprintName">
          <Input type="text" placeholder="请输入迭代名" />
        </Form.Item>

        <Form.Item required label="基线" labelCol={{ span: 4 }} name="base">
          <Select options={options} placeholder="请选择基线分支" />
        </Form.Item>
      </Form>
    </Modal>
  ) : null;
};
export default GroupModal;
