import { Modal, Form, Input, message, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState, useRef } from 'react';

import { searchBranch } from '@/services/app/sprint-manage';

import useDebounceSearch from '@/hooks/useDebounceSearch';
interface IGroupModal {
  loading?: boolean;
  modalVisible: boolean;
  onOk: (params: any) => any;
  onClose: () => void;
  version: string;
  currAppId: number;
  appStageId: number;
}
const MrModal: React.FC<IGroupModal> = ({
  loading,
  modalVisible = true,
  version,
  onOk,
  onClose,
  currAppId,
}) => {
  const isMount = useRef<boolean>(false);
  const [form] = Form.useForm();
  const [branchList, setBranchList] = useState<any[]>([]);
  const handleInput = async (inputValue: string) => {
    try {
      if (!isMount.current) {
        return;
      }
      const res = await searchBranch({ appId: currAppId, search: inputValue });
      // console.log("searchBranch: ", res)
      if (res.success) {
        setBranchList(res.data);
      }
    } catch (error) {}
  };
  const { setInputValue } = useDebounceSearch(handleInput);

  useEffect(() => {
    if (modalVisible) {
      isMount.current = true;
      handleInput('');
    }
    return () => {
      isMount.current = false;
      form.resetFields();
    };
  }, [modalVisible]);

  return modalVisible ? (
    <Modal
      visible={true}
      title={'提交MR'}
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
          type: 3,
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
            fieldNames={{ label: 'name', value: 'name' }}
            showSearch
            onSearch={setInputValue}
            placeholder="请选择源分支名称（默认为迭代分支）"
            options={branchList}
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

        <Form.Item
          rules={[{ required: true }]}
          label="提交信息"
          name="description"
          labelCol={{ span: 4 }}
        >
          <TextArea placeholder="请输入提交信息" />
        </Form.Item>
      </Form>
    </Modal>
  ) : null;
};
export default MrModal;
