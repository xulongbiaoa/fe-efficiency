import { Card, Button, Form, Input, Col, Row, message, Select } from 'antd';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import styles from './index.module.less';
import { getBaseinfo, updateBaseinfo } from '@/services/app/env-overview';
import moment from 'moment';
import { getMember } from '@/services/app/sprint-manage';
import useDebounceSearch from '@/hooks/useDebounceSearch';

const BaseInfo: React.FC<{
  type: string;
  title: string;
  currEnvId: number;
}> = ({ title, currEnvId }) => {
  const [info, setInfo] = useState<any>({});
  const [members, setMembers] = useState<any>([]);
  const [editAble, setEditAble] = useState(false);

  const [form] = Form.useForm();

  const handleInput = async (inputValue: string) => {
    try {
      const res = await getMember({ nickName: inputValue });
      if (res.success) {
        setMembers(res.data);
      }
    } catch (error) {}
  };

  const { setInputValue } = useDebounceSearch(handleInput);

  const handleDisItem = (value: any, component: ReactNode) => {
    if (editAble) {
      return component;
    }
    return value;
  };

  const handleGetBaseInfo = async () => {
    try {
      const res = await getBaseinfo(currEnvId);
      if (res.success) {
        setInfo(res.data);
      }
    } catch (error) {}
  };

  const handleEditBaseInfo = async () => {
    try {
      const validate = await form.validateFields();
      if (!validate) {
        return;
      }

      const params = { ...form.getFieldsValue() };
      params.manager = { name: params.manager?.label, userId: String(params.manager?.value) };

      const res = await updateBaseinfo(currEnvId, params);
      if (res.success) {
        message.success('操作成功');
        setEditAble(false);
        handleGetBaseInfo();
      }
    } catch (error) {}
  };

  useEffect(() => {
    handleGetBaseInfo();
  }, [currEnvId]);

  useEffect(() => {
    form.setFieldsValue({
      ...info,
      manager: { label: info?.manager?.name, value: info?.manager?.userId },
    });
    setInputValue(info?.manager?.name);
  }, [info]);
  return (
    <Card
      bordered={false}
      title={title}
      style={{ minHeight: 500 }}
      extra={
        <div style={{ display: 'flex' }}>
          <Button
            className={styles['operation-button']}
            type="primary"
            onClick={() => {
              setEditAble((edit) => {
                if (edit) {
                  form.setFieldsValue(info);
                }
                return !edit;
              });
            }}
          >
            {!editAble ? '编辑' : '取消'}
          </Button>
          {editAble && (
            <Button
              className={styles['operation-button']}
              type="primary"
              onClick={handleEditBaseInfo}
            >
              保存
            </Button>
          )}
        </div>
      }
    >
      <div>
        <div>
          <Form form={form}>
            <Row gutter={[20, 0]}>
              <Col span={12}>
                <Form.Item
                  label="名称"
                  rules={[{ required: true, max: 20 }]}
                  name={'name'}
                  style={{ fontWeight: 400, fontSize: 14 }}
                >
                  {handleDisItem(info?.name, <Input />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="标识" name="envIdent" style={{ fontWeight: 400, fontSize: 14 }}>
                  {handleDisItem(
                    info?.envIdent,
                    <Select
                      filterOption={false}
                      options={[
                        { label: 'dev01', value: 'dev01', name: '开发环境' },
                        { label: 'test02', value: 'test02', name: '测试环境' },
                        { label: 'online01', value: 'online01', name: '线上环境' },
                      ]}
                      onChange={(_value, record: any) => {
                        form.setFieldsValue({ name: record.name });
                      }}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="负责人"
                  name={'manager'}
                  style={{ fontWeight: 400, fontSize: 14 }}
                >
                  {handleDisItem(
                    info?.manager?.name,
                    <Select
                      filterOption={false}
                      fieldNames={{ label: 'name', value: 'userId' }}
                      showSearch
                      onSearch={(value: string) => {
                        setInputValue(value);
                      }}
                      labelInValue
                      options={members}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="创建时间" style={{ fontWeight: 400, fontSize: 14 }}>
                  {info?.createTime && moment(info?.createTime).format('YYYY-MM-DD HH:mm:ss')}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="环境描述"
                  name={'describe'}
                  rules={[{ max: 100 }]}
                  style={{ fontWeight: 400, fontSize: 14 }}
                >
                  {handleDisItem(
                    <div style={{ wordBreak: 'break-word', lineHeight: '2.2em' }}>
                      {info?.describe}
                    </div>,
                    <Input />,
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </Card>
  );
};
export default BaseInfo;
