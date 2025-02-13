import { Modal, Form, Select } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import useDebounceSearch from '@/hooks/useDebounceSearch';
import { getRollbackList } from '@/services/app/env-overview';
import moment from 'moment';
interface IGroupModal {
  modalVisible: boolean;
  loading?: boolean;
  onClose: () => void;
  onOk: (groupName: string) => any;
  envId: number;
}
const AddFeature: React.FC<IGroupModal> = ({
  modalVisible = true,
  loading,
  envId,
  onClose,
  onOk,
}) => {
  const [options, setOptions] = useState([]);

  const [form] = Form.useForm();
  const isMount = useRef<boolean>(false);

  const handleInput = async () => {
    try {
      if (!isMount.current) {
        return;
      }
      const res = await getRollbackList(envId);
      if (res.success) {
        setOptions(res.data);
      }
    } catch (error) {}
  };

  const { setInputValue } = useDebounceSearch(handleInput);

  useEffect(() => {
    if (modalVisible) {
      isMount.current = true;
      handleInput();
    }
    return () => {
      isMount.current = false;
      form.resetFields();
    };
  }, [modalVisible]);

  return modalVisible ? (
    <Modal
      visible={true}
      title={'部署回滚'}
      okButtonProps={{ loading }}
      onCancel={onClose}
      onOk={async () => {
        await form.validateFields();
        onOk({ ...form.getFieldsValue(), envId });
      }}
    >
      <Form form={form}>
        <Form.Item
          rules={[{ required: true }]}
          label="回滚版本"
          labelCol={{ span: 5 }}
          name="rollBackId"
        >
          <Select showSearch onSearch={setInputValue} placeholder="版本">
            {options.map((item: any) => {
              return (
                <Select.Option key={item.id} value={item.id}>
                  {`${item?.id}-${item.commit?.slice(0, 7)}-${item?.description}-${moment(
                    item.createTime,
                  ).format('YYYY-MM-DD HH:mm:ss')}`}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  ) : null;
};
export default AddFeature;
