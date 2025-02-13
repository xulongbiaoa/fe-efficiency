import { Modal, Form, Select } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { searchPipeline } from '@/services/app/sprint-manage';

import useDebounceSearch from '@/hooks/useDebounceSearch';
interface IGroupModal {
  loading?: boolean;
  modalVisible: boolean;
  onOk: (params: any) => any;
  onClose: () => void;
  currAppId: number;
  selectStage: number | undefined;
  appStageId: number;
}
const PinelineModal: React.FC<IGroupModal> = ({
  loading,
  modalVisible,
  onOk,
  onClose,
  currAppId,
  appStageId,
}) => {
  const [form] = Form.useForm();
  const isMount = useRef<boolean>(false);
  const [pipelineList, setPipelineList] = useState<any[]>([]);
  const handleInput = async (inputValue: string) => {
    try {
      if (!isMount.current) {
        return;
      }
      const res = await searchPipeline({
        appId: currAppId,
        stageId: appStageId,
        name: inputValue,
      });
      if (res.success) {
        setPipelineList(res.data);
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
      title={'触发流水线'}
      okButtonProps={{ loading }}
      onCancel={onClose}
      onOk={async () => {
        await form.validateFields();
        const values = form.getFieldsValue();

        // if (!values.pipelineId || !values.originBranch) {
        //   message.error('参数不能为空');
        //   return;
        // }

        onOk({
          type: 1,
          stagePipelineId: values.pipelineId,
        });
      }}
    >
      <Form form={form}>
        <Form.Item
          rules={[{ required: true }]}
          label="流水线"
          labelCol={{ span: 4 }}
          name="pipelineId"
        >
          <Select onSearch={setInputValue} showSearch placeholder="请查询并选择流水线">
            {pipelineList.map((item) => {
              return (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        {/* <Form.Item label="参数设置" name="originBranch" labelCol={{ span: 4 }}>
          <AutoComplete placeholder="请输入目标分支名称" />
        </Form.Item> */}
      </Form>
    </Modal>
  ) : null;
};
export default PinelineModal;
