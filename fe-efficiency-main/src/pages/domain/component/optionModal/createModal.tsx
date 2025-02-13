import { Input, Modal, Form, Select, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';

import styles from './../index.module.less';
import TextArea from 'antd/lib/input/TextArea';

import { domainSegmentList } from '@/services/domain';

interface IGroupModal {
  loading?: boolean;
  currentDomain: any;
  modalVisible: boolean;

  onOk: (groupName: string) => any;
  onClose: () => void;
}

const GroupModal: React.FC<IGroupModal> = ({
  loading,
  currentDomain,
  modalVisible = true,
  onOk,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [domainfo, setDomainfo] = useState<any>({
    inNet: 1,
    networkSegmentId: '',
  });

  const channelOptionMap = {
    1: [
      { label: '5秒', value: 5 },
      { label: '30秒', value: 30 },
      { label: '1分钟', value: 60 },
      { label: '5分钟', value: 300 },
      { label: '1小时', value: 3600 },
      { label: '12小时', value: 43200 },
      { label: '1天', value: 86400 },
    ],
    2: [
      { label: '5分钟', value: 300 },
      { label: '10分钟', value: 600 },
      { label: '1小时', value: 3600 },
      { label: '6小时', value: 21600 },
      { label: '12小时', value: 43200 },
      { label: '1天', value: 86400 },
      { label: '7天', value: 604800 },
    ],
    3: [
      { label: '10分钟', value: 600 },
      { label: '30分钟', value: 1800 },
      { label: '1小时', value: 3600 },
      { label: '12小时', value: 43200 },
      { label: '1天', value: 86400 },
    ],
  };

  const [segmentList, setSegmentList] = useState<any[]>([]);
  const [ident, setIdent] = useState<any>();
  const [channel, setChannel] = useState<any>();
  const [showApi, setShowApi] = useState<boolean>(false);
  const handleDomainChange = async (key: string, value: any) => {
    await setDomainfo((info: any) => {
      return { ...info, [key]: value };
    });
  };

  const handleGetsegent = async (v?: any) => {
    try {
      const res = await domainSegmentList(v || domainfo?.inNet);
      const inNet = v || domainfo?.inNet;

      if (res.success) {
        let data = res?.data?.rows || [];
        data = data.map((item: any) => {
          if (currentDomain?.networkSegmentId == item?.id) {
            switch (item?.channel) {
              case 1:
                setChannel(3);
                break;
              case 2:
                if (inNet != 1) {
                  setChannel(2);
                } else {
                  setChannel(1);
                }
                break;

              default:
                break;
            }
          }
          return {
            label: item?.name,
            value: item?.id,
            channel: item?.channel,
          };
        });

        setSegmentList(data);
      }
    } catch (error) {}
  };
  const AfterElement = (
    <>
      <Select
        bordered
        style={{ width: 100, borderRight: '1px solid #d9d9d9' }}
        defaultValue={ident}
        disabled
        options={[
          { label: 'dev01', value: 'dev01' },
          { label: 'test01', value: 'test01' },
          { label: 'test02', value: 'test02' },
          { label: 'online01', value: '' },
        ]}
      />
      {showApi && (
        <div style={{ display: 'inline-block', width: 100, borderRight: '1px solid #d9d9d9' }}>
          .api
        </div>
      )}

      <Select
        style={{ width: 120, borderRight: '1px solid #d9d9d9' }}
        value={domainfo.inNet}
        options={[
          { label: '内网', value: 1 },
          { label: '外网', value: 2 },
        ]}
        onChange={(v) => {
          handleDomainChange('inNet', v);
          handleDomainChange('networkSegmentId', '');
          handleGetsegent(v);
        }}
      />
      <Select
        value={domainfo.networkSegmentId}
        style={{ width: 200 }}
        options={segmentList}
        onChange={(v, option) => {
          handleDomainChange('networkSegmentId', v);
          switch (option?.channel) {
            case 1:
              setChannel(3);
              break;
            case 2:
              if (domainfo?.inNet != 1) {
                setChannel(2);
              } else {
                setChannel(1);
              }

              break;
            default:
              break;
          }
          form.setFieldsValue({ ttl: '' });
        }}
      />
    </>
  );

  useEffect(() => {
    if (modalVisible) {
      handleGetsegent(currentDomain?.inNet);
    }
    if (modalVisible && currentDomain?.id) {
      form.setFieldsValue(currentDomain);
      setIdent('-' + currentDomain?.envIdent);
      setDomainfo({
        ident: currentDomain?.envIdent,
        inNet: currentDomain?.inNet,
        networkSegmentId: currentDomain?.networkSegmentId,
      });
      if (currentDomain?.feIdent == 2) {
        setShowApi(true);
      }
    }
    return () => {
      form.resetFields();
      setShowApi(false);
    };
  }, [modalVisible]);

  return modalVisible ? (
    <Modal
      className={styles['create-domain-modal']}
      visible={true}
      title={currentDomain?.id ? '修改域名' : '新增域名'}
      okButtonProps={{ loading }}
      onCancel={() => {
        onClose();
        setDomainfo({
          inNet: 1,
          networkSegmentId: '',
        });
      }}
      onOk={async () => {
        const values = form.getFieldsValue();
        await form.validateFields();
        onOk({ ...values, ...domainfo });
      }}
    >
      <Form form={form} style={{ height: 280 }}>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item rules={[{ required: true }]} label="名称" name="name">
              <Input type="text" placeholder="请输入域名" addonAfter={AfterElement} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="前后端选择"
              labelCol={{ span: 24 }}
              rules={[{ required: true }]}
              initialValue={1}
              name="feIdent"
              required
            >
              <Select
                onChange={(v) => {
                  setShowApi(v == 2);
                }}
                options={[
                  { label: '前端', value: 1 },
                  { label: '后端', value: 2 },
                  { label: '混合', value: 3 },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="TTL"
              labelCol={{ span: 24 }}
              rules={[{ required: true }]}
              name="ttl"
              required
            >
              <Select disabled={!channel} options={channelOptionMap[channel] || []} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item labelCol={{ span: 24 }} label="描述" name="description">
              <TextArea autoSize={{ minRows: 4 }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  ) : null;
};
export default GroupModal;
