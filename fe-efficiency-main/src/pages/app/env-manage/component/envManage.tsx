import { Input, Modal, Form, Select, Radio } from 'antd';
import React, { useEffect, useState } from 'react';

import { sourcePoolList, getNamespaceList } from '@/services/envs/sourcepool';
import { getAvailableResources } from '@/services/app/resource-config';
// import useDebounceSearch from '@/hooks/useDebounceSearch';
// import { searchBranch } from '@/services/app/sprint-manage';
interface IGroupModal {
  loading?: boolean;
  modalVisible: boolean;
  currAppId: number;
  onOk: (params: any) => any;
  onClose: () => void;
  currentEnv:
    | {
        id: number;
        ident: string;
        name: string;
        status: string;
        deployType: string;
        deployName: string;
        deployInfo: {
          branch: string;
          version: string;
          versionTime: string;
          branchUrl: string;
        };
      }
    | Record<string, never>;
}
const GroupModal: React.FC<IGroupModal> = ({
  loading,
  modalVisible = true,
  currentEnv,
  onOk,
  onClose,
  // currAppId,
}) => {
  const [form] = Form.useForm();

  const [availables, setAvailables] = useState<any>({});
  const [poolOptions, setPoolOptions] = useState<any>([]);
  const [nameSpaceOptions, setNameSpaceOptions] = useState<any>([]);
  const [resourcePoolId, setResourcePoolId] = useState<any>(undefined);
  const [cpuUnit, setCpuUnit] = useState('c');
  const [memoryUnit, setMemoryUnit] = useState('Gi');

  const handleToUnit = (value: number, from: string, to: string): any => {
    if (from === to) {
      return value;
    } else if (from === 'c') {
      return value * 1000;
    } else if (from === 'm') {
      return value / 1000;
    } else if (from === 'Gi') {
      return value * 1024;
    } else if (from === 'Mi') {
      return value / 1024;
    }
    return '';
  };

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    setAvailables({
      ...availables,
      availableInst: Math.min(
        Math.floor(
          parseFloat(handleToUnit(availables?.availableMemory, availables.memoryUnit, memoryUnit)) /
            parseFloat(values?.memory),
        ),
        Math.floor(
          handleToUnit(availables.availableCpu, availables.cpuUnit, cpuUnit) /
            parseFloat(values?.cpu),
        ),
      ),
    });
  };
  const cpuAfter = (
    <Form.Item noStyle name="cpuUnit" initialValue={'c'}>
      <Select
        onChange={(value) => {
          setCpuUnit(value);
        }}
      >
        <Select.Option value="c">c</Select.Option>
        <Select.Option value="m">m</Select.Option>
      </Select>
    </Form.Item>
  );
  const memAfter = (
    <Form.Item noStyle name="memoryUnit" initialValue={'Gi'}>
      <Select
        onChange={(value) => {
          setMemoryUnit(value);
        }}
      >
        <Select.Option value="Gi">Gi</Select.Option>
        <Select.Option value="Mi">Mi</Select.Option>
      </Select>
    </Form.Item>
  );

  const handleGetAvailableResources = async (id: any) => {
    try {
      const res = await getAvailableResources(id);
      if (res.success) {
        setAvailables({
          ...res.data,
        });
      }
    } catch (error) {}
  };
  const handleGetNameSpaceList = async (id: any) => {
    try {
      const res = await getNamespaceList(id);
      if (res.success) {
        setNameSpaceOptions(
          res.data?.map((item: any) => {
            return { label: item.name, value: item.name };
          }) || [],
        );
        return;
      }
      setNameSpaceOptions([]);
    } catch (error) {
      setNameSpaceOptions([]);
      console.log(error);
    }
  };
  const handleGetPoolList = async () => {
    try {
      const res = await sourcePoolList({
        pageNo: 1,
        pageSize: 20,
        type: 'k8s',
      });
      if (res.success) {
        setPoolOptions(
          res.data?.rows?.map((item: any) => {
            return { label: item.name, value: item.id };
          }) || [],
        );
        form.setFieldsValue({
          poolTypeId: res.data?.rows[0]?.id,
        });
        setResourcePoolId(res.data?.rows[0]?.id);
        handleGetNameSpaceList(res.data?.rows[0]?.id);
        handleGetAvailableResources(res.data?.rows[0]?.id);
      }
    } catch (error) {}
  };

  useEffect(() => {
    form.resetFields();
    if (modalVisible) {
      handleGetPoolList();
    }
  }, [modalVisible]);

  useEffect(() => {
    handleFormChange();
  }, [cpuUnit, memoryUnit]);

  return modalVisible ? (
    <Modal
      visible={true}
      title={'创建环境'}
      okButtonProps={{ loading }}
      onCancel={onClose}
      onOk={async () => {
        const values = form.getFieldsValue();
        await form.validateFields();
        onOk(values);
      }}
    >
      <Form
        form={form}
        onChange={() => {
          handleFormChange();
        }}
      >
        <Form.Item
          rules={[{ required: true }]}
          initialValue={currentEnv?.name}
          label="环境名称"
          labelCol={{ span: 4 }}
          name="name"
        >
          <Input type="text" placeholder="请输入环境名称" />
        </Form.Item>
        <Form.Item
          rules={[{ required: true }]}
          initialValue={0}
          label="是否审批"
          labelCol={{ span: 4 }}
          name="needApproval"
        >
          <Radio.Group>
            <Radio value={0}>不需要</Radio>
            <Radio value={1}>需要</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          rules={[{ required: true }]}
          label="资源池"
          labelCol={{ span: 4 }}
          name="poolTypeId"
        >
          <Select
            onChange={(value) => {
              form.setFieldsValue({
                namespace: undefined,
              });
              handleGetNameSpaceList(value);
            }}
            options={poolOptions}
            placeholder="请选择资源池"
          />
        </Form.Item>
        {resourcePoolId && (
          <Form.Item
            rules={[{ required: true }]}
            label="命名空间"
            labelCol={{ span: 4 }}
            name="namespace"
          >
            <Select showSearch options={nameSpaceOptions} placeholder="请选择命名空间" />
          </Form.Item>
        )}

        <Form.Item
          name="cpu"
          label="CPU"
          style={{ margin: 0 }}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 10 }}
          rules={[
            { required: true, message: '' },
            {
              validator: (rule, value, callback) => {
                if (isNaN(Number(value))) {
                  callback('只可输入数字');
                } else if (!isNaN(Number(value)) && Number(value) <= 0) {
                  callback('CPU不能为空或小于等于0');
                } else {
                  callback();
                }
              },
            },
            {
              validator: (rule, value, callback) => {
                if (
                  value >
                  parseFloat(handleToUnit(availables?.availableCpu, availables?.cpuUnit, cpuUnit))
                ) {
                  callback('不能大于可用数');
                } else {
                  callback();
                }
              },
            },
          ]}
        >
          <Input addonAfter={cpuAfter} />
        </Form.Item>

        <div style={{ marginTop: 10, marginBottom: 10, marginLeft: 64 }}>
          {'可用: ' +
            handleToUnit(availables?.availableCpu, availables?.cpuUnit, cpuUnit) +
            cpuUnit}
        </div>

        <Form.Item
          name="memory"
          label="MEM"
          wrapperCol={{ span: 10 }}
          labelCol={{ span: 4 }}
          style={{ margin: 0 }}
          rules={[
            { required: true, message: '' },
            {
              validator: (rule, value, callback) => {
                if (isNaN(Number(value))) {
                  callback('只可输入数字');
                } else if (!isNaN(Number(value)) && Number(value) <= 0) {
                  callback('MEM不能为空或小于等于0');
                } else {
                  callback();
                }
              },
            },
            {
              validator: (rule, value, callback) => {
                if (
                  value >
                  parseFloat(
                    handleToUnit(availables?.availableMemory, availables?.memoryUnit, memoryUnit),
                  )
                ) {
                  callback('不能大于可用数');
                } else {
                  callback();
                }
              },
            },
          ]}
        >
          <Input addonAfter={memAfter} />
        </Form.Item>

        <div style={{ marginTop: 10, marginBottom: 10, marginLeft: 64 }}>
          {'可用: ' +
            handleToUnit(availables?.availableMemory, availables?.memoryUnit, memoryUnit) +
            memoryUnit}
        </div>

        <Form.Item
          name="inst"
          label="实例数"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 10 }}
          style={{ margin: 0 }}
          rules={[
            { required: true, message: '' },

            {
              validator: (rule, value, callback) => {
                if (isNaN(Number(value))) {
                  callback('只可输入数字');
                } else if (!isNaN(Number(value)) && Number(value) < 1) {
                  callback('实例数不能小于1');
                } else {
                  callback();
                }
              },
            },
            {
              validator: (rule, value, callback) => {
                const availableInst = availables.availableInst;

                if (value > parseFloat(availableInst)) {
                  callback('不能大于可用数');
                } else {
                  callback();
                }
              },
            },
          ]}
        >
          <Input />
        </Form.Item>

        <div style={{ marginTop: 10, marginBottom: 10, marginLeft: 64 }}>
          {'可用: ' + (availables?.availableInst || '')}
        </div>

        {/* <Form.Item
          rules={[{ required: true }]}
          label="环境级别"
          labelCol={{ span: 4 }}
          name="ident"
        >
          <Input type="text" placeholder="请输入环境级别" />
        </Form.Item> */}
      </Form>
    </Modal>
  ) : null;
};
export default GroupModal;
