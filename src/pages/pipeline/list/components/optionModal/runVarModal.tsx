import { Input, message, Modal, Select } from 'antd';
import React, { useEffect } from 'react';
import { Form } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
interface IGroupModal {
  pipelineVar: any;
  modalVisible: boolean;
  loading?: boolean;
  onClose: () => void;
  onOk: (data: any) => any;
  ids: number[];
  runType: 'one' | 'more';
}
const GroupModal: React.FC<IGroupModal> = ({
  modalVisible,
  loading,
  onClose,
  onOk,
  pipelineVar,
  ids,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [modalVisible]);

  return modalVisible ? (
    <Modal
      visible={true}
      title={'运行配置'}
      okButtonProps={{ loading }}
      onCancel={onClose}
      onOk={() => {
        const values = Object.assign({}, form.getFieldsValue());
        const remark = values.remark;
        delete values.remark;
        const flag: boolean = Object.values(values).every((item) => {
          return !!item;
        });

        if (!flag) {
          message.error('变量参数不能为空');
          return;
        }
        const params = JSON.stringify(values)
          .slice(1, JSON.stringify(values).length - 1)
          .replaceAll('"', '');

        onOk({ ...(params ? { params } : {}), ids: ids.join(','), remark });
      }}
    >
      <Form form={form}>
        {(pipelineVar?.defParam || []).map((item: any) => {
          if (item.varRuningFlag === 0) {
            return null;
          }
          return (
            <Form.Item
              label={item.varDesc}
              key={item.varName}
              name={item.varName}
              initialValue={item.varDefValue}
              required
            >
              {item.varOptions?.length > 0 ? (
                <Select
                  options={item.varOptions.split(',').map((option: any) => {
                    return { label: option, value: option };
                  })}
                />
              ) : (
                <Input />
              )}
            </Form.Item>
          );
        })}
        <Form.Item label="运行备注" name="remark">
          <TextArea />
        </Form.Item>
      </Form>
    </Modal>
  ) : null;
};
export default GroupModal;
