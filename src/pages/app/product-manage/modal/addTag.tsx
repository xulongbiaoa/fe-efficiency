import { Modal, Form, Select, Divider, Space, Input, Button } from 'antd';
import React, { useEffect, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';

interface IGroupModal {
  modalVisible: boolean;
  loading?: boolean;
  onClose: () => void;
  onOk: (groupName: string) => any;
  addItem: (item: string) => void;
  defaultTags: any[];
}
const AddTag: React.FC<IGroupModal> = ({
  modalVisible = true,
  loading,
  defaultTags,
  onClose,
  onOk,
  addItem,
}) => {
  const [form] = Form.useForm();
  const isMount = useRef<boolean>(false);
  const inputRef: any = useRef();

  useEffect(() => {
    return () => {
      isMount.current = false;
      form.resetFields();
    };
  }, [modalVisible]);

  return modalVisible ? (
    <Modal
      visible={true}
      title={'修改标签'}
      okButtonProps={{ loading }}
      onCancel={onClose}
      onOk={async () => {
        await form.validateFields();
        onOk({ ...form.getFieldsValue() });
      }}
    >
      <Form form={form}>
        <Form.Item
          rules={[{ required: true }]}
          label="标签"
          labelCol={{ span: 5 }}
          name="artifactTag"
        >
          <Select
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <Space style={{ padding: '0 8px 4px' }}>
                  <Input
                    placeholder="请输入标签"
                    ref={(ref) => {
                      inputRef.current = ref;
                    }}
                  />
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      addItem(inputRef.current.input.value);
                    }}
                  >
                    新增标签
                  </Button>
                </Space>
              </>
            )}
            // fieldNames={{ label: 'name', value: 'key' }}
          >
            {defaultTags.map((item) => {
              return (
                <Select.Option key={item.key} value={item.value}>
                  {item.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  ) : null;
};
export default AddTag;
