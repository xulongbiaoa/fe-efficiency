import { Modal, Form, Select, Input } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { searchBranch } from '@/services/app/sprint-manage';

import { getImageList } from '@/services/app/env-overview';
import useDebounceSearch from '@/hooks/useDebounceSearch';

// import Chart from './../chart/index';
interface IGroupModal {
  modalVisible: boolean;
  loading?: boolean;
  onClose: () => void;
  onOk: (data: {
    envId: number;
    describe: string;
    branch: string;
    commit: string;
    image: string;
    versionType: number;
    operationType: number;
  }) => any;
  envId: number;
  currAppId: number;
}
const AddFeature: React.FC<IGroupModal> = ({
  modalVisible = true,
  loading,
  envId,
  currAppId,
  onClose,
  onOk,
}) => {
  const [branchOptions, setBranchOptions] = useState([]);

  const [imageOptions, setImageOptions] = useState([]);
  const [version, setVersion] = useState<number>(0);
  // const [pause, setPause] = useState<number>(0);

  const [form] = Form.useForm();
  const isMount = useRef<boolean>(false);

  const handleInput = async (search: string) => {
    try {
      if (!isMount.current) {
        return;
      }

      const resBranch = await searchBranch({ appId: currAppId, search });
      if (resBranch.success) {
        setBranchOptions(resBranch.data);
      }

      const resImage = await getImageList(envId);
      if (resImage.success) {
        setImageOptions(resImage.data);
      }
    } catch (error) {}
  };
  const { setInputValue } = useDebounceSearch(handleInput);

  useEffect(() => {
    if (modalVisible) {
      setVersion(0);
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
      title={'环境部署'}
      width={800}
      okButtonProps={{ loading }}
      onCancel={onClose}
      onOk={async () => {
        await form.validateFields();
        const values = { ...form.getFieldsValue() };
        delete values.version;
        values.versionType = version == 0 ? 1 : 2;
        values.envId = envId;

        if (version === 0) {
          const Index = values.branch?.lastIndexOf('/');
          values.commit = values.branch.slice(Index + 1);
          values.branch = values.branch.slice(0, Index);
        } else {
          const Index = values.image?.lastIndexOf('/');
          values.commit = values.image.slice(Index + 1);
          values.image = values.image.slice(0, Index);
        }

        onOk({ ...values, operationType: 1 });
      }}
    >
      <Form form={form}>
        {/* <Form.Item rules={[{ required: true }]} label="部署环境" labelCol={{ span: 5 }} name="name">
          <Input disabled />
        </Form.Item> */}

        <Form.Item label="部署版本" required labelCol={{ span: 5 }}>
          <div style={{ display: 'flex' }}>
            <Form.Item name="version" noStyle initialValue={0}>
              <Select
                onChange={(value: number) => {
                  setVersion(value);
                  form.setFieldsValue({ branch: '', image: '' });
                }}
                style={{ width: 100, marginRight: 20 }}
                options={[
                  { label: '源代码', value: 0 },
                  { label: '制品', value: 1 },
                ]}
              />
            </Form.Item>
            <Form.Item
              name={version === 0 ? 'branch' : 'image'}
              noStyle
              rules={[{ required: true, message: '请输入或者选择分支' }]}
            >
              {version == 0 ? (
                <Select
                  allowClear
                  placeholder="源码 branch / commit"
                  showSearch
                  onSearch={(value) => {
                    setInputValue(value);
                  }}
                >
                  {branchOptions.map((item: any) => {
                    return (
                      <Select.Option key={item.name} value={item.name + '/' + item?.commit.id}>
                        {item.name} / {item?.commit.id.slice(0, 7)}
                      </Select.Option>
                    );
                  })}
                </Select>
              ) : (
                <Select
                  // fieldNames={{ label: 'image', value: 'id' }}
                  showSearch
                  allowClear
                  // options={imageOptions}
                  placeholder="请选择制品"
                >
                  {imageOptions.map((item: any) => {
                    return (
                      <Select.Option key={item.id} value={item.image + '/' + item.commit}>
                        {item?.image?.slice(37)}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </div>
        </Form.Item>
        <Form.Item
          rules={[
            { required: true },
            {
              validator: (rule, value, callback) => {
                if (value.trim().length !== value.length) {
                  callback('禁止前后有空格');
                } else {
                  callback();
                }
              },
            },
          ]}
          label="部署描述"
          labelCol={{ span: 5 }}
          name="describe"
        >
          <Input />
        </Form.Item>
        {/* <Form.Item
          rules={[{ required: true }]}
          label="分批数"
          labelCol={{ span: 5 }}
          name="desc"
          initialValue={1}
        >
          <Input type={'number'} />
        </Form.Item>
        <Form.Item
          label="验证策略"
          rules={[{ required: true }]}
          labelCol={{ span: 5 }}
          initialValue={0}
          name="policy"
        >
          <Select
            onChange={(value: number) => {
              setVersion(value);
            }}
            style={{ width: 100 }}
            options={[
              { label: '不验证', value: 0 },
              { label: '每批次验证', value: 1 },
            ]}
          />
        </Form.Item>
        <Form.Item label="验证流水线" required labelCol={{ span: 5 }}>
          <div style={{ display: 'flex' }}>
            <Form.Item name="pause" noStyle>
              <Select
                fieldNames={{ label: 'name', value: 'name' }}
                showSearch
                onSearch={setInputValue}
                options={options}
                placeholder="请输入验证流水线"
              />
            </Form.Item>
          </div>
          <Form.Item noStyle>
            <Chart record={verifyData} />
          </Form.Item>
        </Form.Item>
        <Form.Item label="批次间暂停" required labelCol={{ span: 5 }}>
          <div style={{ display: 'flex' }}>
            <Form.Item name="pause" noStyle>
              <Select
                onChange={(value: number) => {
                  setPause(value);
                }}
                defaultValue={0}
                style={{ width: 100 }}
                options={[
                  { label: '不暂停', value: 0 },
                  { label: '指定时长', value: 1 },
                  { label: '永久暂停', value: 2 },
                ]}
              />
            </Form.Item>
            <Form.Item name="branch" noStyle rules={[{ required: true, message: '请输入时长' }]}>
              {pause == 1 && (
                <Select
                  fieldNames={{ label: 'name', value: 'name' }}
                  showSearch
                  onSearch={setInputValue}
                  options={options}
                  placeholder="时长"
                  style={{ width: 200, marginLeft: 20, marginRight: 20 }}
                />
              )}
              <Form.Item noStyle>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {pause == 1 && '分钟'}
                </div>
              </Form.Item>
            </Form.Item>
          </div>
        </Form.Item> */}
      </Form>
    </Modal>
  ) : null;
};
export default AddFeature;
