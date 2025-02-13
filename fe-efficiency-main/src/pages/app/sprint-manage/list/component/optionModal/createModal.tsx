import { Input, Modal, Form, Select } from 'antd';
import React, { useEffect, useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { getMember } from '@/services/app/sprint-manage';
import { history } from 'umi';
interface IGroupModal {
  loading?: boolean;
  currentUser: any;
  modalVisible: boolean;
  onOk: (groupName: string) => any;
  onClose: () => void;
}
const GroupModal: React.FC<IGroupModal> = ({
  loading,
  currentUser,
  modalVisible = true,
  onOk,
  onClose,
}) => {
  const [options, setOptions] = useState<any[]>([]);
  const [value, setValue] = useState<string>('');
  const { devMode } = history.location.query as any;
  const onChange = useCallback(
    debounce(async (val: string) => {
      try {
        if (!val) {
          setOptions([]);
          return;
        }
        const res = await getMember({ nickName: val });
        if (res.success) {
          if (res.data) {
            setOptions(res.data);
          }
        }
      } catch (error) {}
    }, 500),

    [],
  );
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({ userUuid: currentUser?.userId });
  }, []);
  useEffect(() => {
    form.resetFields();
    setOptions([]);
  }, [modalVisible]);
  useEffect(() => {
    onChange(value);
  }, [value]);

  return modalVisible ? (
    <Modal
      visible={true}
      title={'创建迭代'}
      okButtonProps={{ loading }}
      onCancel={onClose}
      onOk={async () => {
        const values = form.getFieldsValue();
        await form.validateFields();
        delete values.owner;
        values.members = (values?.members || []).map((item: any) => {
          return { uuid: item.key, name: item.value };
        });
        onOk(values);
      }}
    >
      <Form form={form} style={{ height: 280 }}>
        <Form.Item rules={[{ required: true }]} label="迭代名" labelCol={{ span: 4 }} name="name">
          <Input type="text" placeholder="请输入迭代名" />
        </Form.Item>
        {devMode === '20' && (
          <Form.Item required label="版本号" labelCol={{ span: 4 }}>
            <div style={{ display: 'flex' }}>
              <Form.Item name="version" initialValue="1.0.0" noStyle>
                <Input style={{ flex: 1 }} />
              </Form.Item>
            </div>
          </Form.Item>
        )}

        <Form.Item
          label="主研发"
          labelCol={{ span: 4 }}
          rules={[{ required: true }]}
          initialValue={currentUser?.userId}
          name="owner"
          required
        >
          <Select disabled options={[{ label: currentUser?.name, value: currentUser?.userId }]} />
        </Form.Item>
        <Form.Item
          rules={[{ required: false }]}
          label="迭代成员"
          labelCol={{ span: 4 }}
          name="members"
        >
          <Select
            mode="multiple"
            allowClear
            placeholder={'请查询并选择迭代成员'}
            style={{ width: '100%' }}
            labelInValue
            onSearch={(str: string) => {
              setValue(str);
            }}
          >
            {options
              .filter((item: any) => {
                return item.name && item.userId;
              })
              .map((item: any) => {
                return (
                  <Select.Option key={item.userId} value={item.name}>
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
export default GroupModal;
