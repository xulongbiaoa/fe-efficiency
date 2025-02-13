import { Input, Modal, Form, Select } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import useDebounceSearch from '@/hooks/useDebounceSearch';
import { searchBranch } from '@/services/app/sprint-manage';
interface IGroupModal {
  modalVisible: boolean;
  loading?: boolean;
  onClose: () => void;
  onOk: (groupName: string) => any;
  currAppId: number;
}
const AddFeature: React.FC<IGroupModal> = ({
  modalVisible = true,
  loading,
  currAppId,
  onClose,
  onOk,
}) => {
  const [options, setOptions] = useState([]);
  const [op, setOp] = useState<number>(0);
  const [form] = Form.useForm();
  const isMount = useRef<boolean>(false);

  const handleInput = async (inputValue: string) => {
    try {
      if (!isMount.current) {
        return;
      }
      const res = await searchBranch({ appId: currAppId, search: inputValue });
      if (res.success) {
        setOptions(res.data);
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
      title={'添加Feature'}
      okButtonProps={{ loading }}
      onCancel={onClose}
      onOk={async () => {
        await form.validateFields();
        onOk(form.getFieldsValue());
      }}
    >
      <Form form={form}>
        <Form.Item rules={[{ required: true }]} label="名称" labelCol={{ span: 4 }} name="name">
          <Input type="text" placeholder="请输入feature名称" />
        </Form.Item>

        <Form.Item label="分支" required labelCol={{ span: 4 }}>
          <div style={{ display: 'flex' }}>
            <Form.Item name="op" noStyle initialValue={0}>
              <Select
                onChange={(value: number) => {
                  setOp(value);
                }}
                style={{ width: 100 }}
                options={[
                  { label: '新建分支', value: 0 },
                  { label: '选择分支', value: 1 },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="branch"
              noStyle
              rules={[{ required: true, message: '请输入或者选择分支' }]}
            >
              {op == 0 ? (
                <Input placeholder="请输入分支名创建分支或者选择分支" />
              ) : (
                <Select
                  fieldNames={{ label: 'name', value: 'name' }}
                  showSearch
                  onSearch={setInputValue}
                  options={options}
                  placeholder="请输入分支名创建分支或者选择分支"
                />
              )}
            </Form.Item>
          </div>
        </Form.Item>
        <Form.Item rules={[{ required: true }]} label="描述" labelCol={{ span: 4 }} name="desc">
          <Input placeholder="请输入Feature描述" />
        </Form.Item>
      </Form>
    </Modal>
  ) : null;
};
export default AddFeature;
