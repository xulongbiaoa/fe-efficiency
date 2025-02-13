/* eslint-disable @typescript-eslint/no-shadow */
import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Select, Row, Col, message, Divider } from 'antd';
import { getStaticDicQuery, getStaticGroupAndTag } from '@/services/pipeline/detail';
import { useEventBus } from '@/hooks/useEventBus';
import { EditContext } from '../../edit/editContext';

const { Option } = Select;

const colLayout = {
  lg: 12,
  xl: 12,
  xxl: 12,
};

export type PipelineInfoType = {
  id?: number;
  pipelineName?: string;
  pipelineTags?: any[];
  pipelineEnv?: string;
  groupId?: number | string;
};

interface IPipelineInfo {
  mode: string;
  baseInfo?: PipelineInfoType;
}

const dicCache = {
  collectData: [],
  tagData: [],
  envData: [],
};

const PipelineInfo: React.FC<IPipelineInfo> = (props: IPipelineInfo) => {
  const { submitData, setSubmitData } = useContext(EditContext) as any;
  const [collectData, setCollectData] = useState(dicCache.collectData);
  const [tagData, setTagData] = useState(dicCache.tagData);
  const [envData, setEnvData] = useState(dicCache.envData);

  const [form] = Form.useForm();

  const handleSaveVarData = () => {
    return form
      .validateFields()
      .then((values) => {
        submitData.baseInfo = values;
        setSubmitData({ ...submitData });
      })
      .catch(() => {
        message.error('流水线信息存在未填写项');
        submitData.baseInfo = 'error';
        setSubmitData({ ...submitData });
      });
  };
  useEventBus('collect:data', () => {
    return handleSaveVarData();
  });

  const reqGetStaticDic = async () => {
    const fnArr = [
      getStaticGroupAndTag('PIPELINE_GROUP_DICT'),
      getStaticGroupAndTag('PIPELINE_TAG_DICT'),
      getStaticDicQuery({ parentKeys: 'PIPELINE_RUN_ENV_DICT' }),
    ];
    try {
      const [collectData, tagData, envData] = await Promise.all(fnArr);
      setCollectData(collectData.data?.rows || []);
      setTagData(tagData.data?.rows || []);
      setEnvData(envData.data?.PIPELINE_RUN_ENV_DICT || []);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (collectData.length <= 0) {
      reqGetStaticDic();
    }
    form.setFieldsValue(props.baseInfo);
  }, [props.baseInfo]);

  return (
    <div>
      <h4>流水线</h4>
      <div style={{ color: '#999' }}>流水线执行基本参数配置</div>
      <Divider />
      <Form layout="vertical" initialValues={props.baseInfo} form={form}>
        <Row>
          <Col {...colLayout}>
            <Form.Item
              label="流水线名称"
              name="pipelineName"
              key="pipelineName"
              rules={[{ required: true, message: '请输入流水线名称' }]}
            >
              <Input placeholder="请输入名称" allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...colLayout}>
            <Form.Item
              label="运行环境"
              name="pipelineEnv"
              key="pipelineEnv"
              rules={[{ required: true, message: '请选择运行环境' }]}
            >
              <Select allowClear style={{ width: '100%' }}>
                {envData.map((item: { key: string; name: string }) => {
                  return (
                    <Option value={item.key} key={item.key}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...colLayout}>
            <Form.Item label="标签" name="pipelineTags" key="pipelineTags">
              <Select mode="multiple" allowClear style={{ width: '100%' }}>
                {tagData.map((item: { dictKey: string; dictName: string }) => {
                  return (
                    <Option value={item.dictKey} key={item.dictKey}>
                      {item.dictName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...colLayout}>
            <Form.Item label="分组" name="groupId" key="groupId">
              <Select allowClear style={{ width: '100%' }}>
                {collectData.map((item: { id: string; dictName: string }) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.dictName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default PipelineInfo;
