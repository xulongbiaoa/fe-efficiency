import { Card, Button, Form, Input, Col, Row, message, Select } from 'antd';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import styles from './index.module.less';

import {
  getResourceConfig,
  editResourceConfig,
  getAvailableResources,
} from '@/services/app/resource-config';
import { sourcePoolList, getNamespaceList } from '@/services/envs/sourcepool';
import PodTable from './component/podTable';
import { cloneDeep } from 'lodash';
const Config: React.FC<{
  type: string;
  title: string;
  currEnvId: number;
}> = (props) => {
  const { title, currEnvId } = props;

  const [info, setInfo] = useState<any>({});
  const [cpuUnit, setCpuUnit] = useState(info?.cpuUnit);
  const [memoryUnit, setMemoryUnit] = useState(info?.memoryUnit);
  const [nodeSelector, setNodeSelector] = useState(info?.nodeSelector || []);
  const [poolOptions, setPoolOptions] = useState<any>([]);
  const [editAble, setEditAble] = useState(false);
  const [form] = Form.useForm();
  const [availables, setAvailables] = useState<any>({});
  const [nameSpaceOptions, setNameSpaceOptions] = useState<any>([]);

  useEffect(() => {
    setNodeSelector(
      info?.nodeSelector?.map((item: any) => {
        item.id = Math.random();
        return item;
      }) || [],
    );
  }, [info]);
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

  const handleDisItem = (value: any, component: ReactNode) => {
    if (editAble) {
      return component;
    }
    return value;
  };

  const handleGteNameSpaceList = async (id: any) => {
    try {
      const res = await getNamespaceList(id);
      if (res.success) {
        setNameSpaceOptions(
          res.data?.map((item: any) => {
            return { label: item.name, value: item.name };
          }) || [],
        );
      }
    } catch (error) {}
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
      }
    } catch (error) {}
  };

  const handleGetAvailableResources = async (data: any) => {
    try {
      const res = await getAvailableResources(data?.resourcePoolId);
      if (res.success) {
        setAvailables({
          ...res.data,
          availableInst: Math.min(
            Math.floor(
              parseFloat(handleToUnit(res.data?.availableMemory, res.data.memoryUnit, 'm')) /
                parseFloat(handleToUnit(data?.memory, data.memoryUnit, 'm')),
            ),
            Math.floor(
              handleToUnit(res.data?.availableCpu, res.data.cpuUnit, 'Mi') /
                handleToUnit(data.cpu, data.cpuUnit, 'Mi'),
            ),
          ),
        });
      }
    } catch (error) {}
  };
  const handleGetDetial = async () => {
    try {
      const res = await getResourceConfig(currEnvId);
      if (res.success) {
        setInfo({ ...res.data, poolTypeId: res.data?.resourcePoolId });
        handleGteNameSpaceList(res.data?.resourcePoolId);
        handleGetAvailableResources(res.data);
      }
    } catch (error) {}
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

  const handleSave = async () => {
    try {
      const validate = await form.validateFields();
      const newNodeSelector = cloneDeep(nodeSelector);
      const hasEmptyValue = newNodeSelector.some(
        (obj: any) => Object.values(obj).includes('') || Object.values(obj).includes(undefined),
      );

      if (validate && !hasEmptyValue) {
        const res = await editResourceConfig(info?.id, {
          ...form.getFieldsValue(),
          nodeSelector: newNodeSelector?.map((item: any) => {
            delete item.id;
            return item;
          }),
        });
        if (res.success) {
          message.success('操作成功');
          setEditAble(false);
          handleGetDetial();
        } else {
          handleGetAvailableResources({
            ...info,
            resourcePoolId: form.getFieldsValue()?.poolTypeId,
          });
        }
      } else if (hasEmptyValue) {
        message.error('请填写完整的pod资源策略');
      }
    } catch (error) {}
  };

  useEffect(() => {
    handleGetDetial();
    handleGetPoolList();
  }, [currEnvId]);

  useEffect(() => {
    setCpuUnit(info.cpuUnit);
    setMemoryUnit(info?.memoryUnit);
    form.setFieldsValue(info);
  }, [info]);
  useEffect(() => {
    const values = form.getFieldsValue();
    setAvailables({
      ...availables,
      availableInst: Math.min(
        Math.floor(
          parseFloat(handleToUnit(availables?.availableMemory, availables.memoryUnit, memoryUnit)) /
            values?.memory,
        ),
        Math.floor(handleToUnit(availables.availableCpu, availables.cpuUnit, cpuUnit) / values.cpu),
      ),
    });
  }, [cpuUnit, memoryUnit]);
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
                handleGetAvailableResources(info);
                if (edit) {
                  form.resetFields();
                  form.setFieldsValue(info);
                  setNodeSelector(info?.nodeSelector);
                  setAvailables({
                    ...availables,
                    availableInst: Math.min(
                      Math.floor(
                        parseFloat(
                          handleToUnit(availables?.availableMemory, availables.memoryUnit, 'm'),
                        ) / parseFloat(handleToUnit(info?.memory, info.memoryUnit, 'm')),
                      ),
                      Math.floor(
                        handleToUnit(availables.availableCpu, availables.cpuUnit, 'Mi') /
                          handleToUnit(info.cpu, info.cpuUnit, 'Mi'),
                      ),
                    ),
                  });
                }

                return !edit;
              });
            }}
          >
            {!editAble ? '编辑' : '取消'}
          </Button>
          {editAble && (
            <Button className={styles['operation-button']} type="primary" onClick={handleSave}>
              保存
            </Button>
          )}
        </div>
      }
    >
      <div>
        <div>
          <Form
            form={form}
            onChange={() => {
              const values = form.getFieldsValue();
              setAvailables({
                ...availables,
                availableInst: Math.min(
                  Math.floor(
                    parseFloat(
                      handleToUnit(availables?.availableMemory, availables.memoryUnit, memoryUnit),
                    ) / parseFloat(values?.memory),
                  ),
                  Math.floor(
                    handleToUnit(availables.availableCpu, availables.cpuUnit, cpuUnit) /
                      parseFloat(values?.cpu),
                  ),
                ),
              });
            }}
          >
            <Row gutter={[20, 0]}>
              <Col span={12}>
                <Form.Item label="类型" style={{ fontWeight: 400, fontSize: 14 }}>
                  {info?.resourceType}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[20, 0]}>
              <Col span={12}>
                <Form.Item
                  name="poolTypeId"
                  label="资源池"
                  style={{ fontWeight: 400, fontSize: 14 }}
                  rules={editAble ? [{ required: true, message: '请选择资源池' }] : []}
                >
                  {handleDisItem(
                    poolOptions.find((item: any) => {
                      return item.value == info?.resourcePoolId;
                    })?.label,
                    <Select
                      onChange={(value) => {
                        handleGetAvailableResources({ ...info, resourcePoolId: value });
                        form.setFieldsValue({ namespace: undefined });
                        handleGteNameSpaceList(value);
                      }}
                      options={poolOptions}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={'namespace'}
                  label="命名空间"
                  style={{ fontWeight: 400, fontSize: 14 }}
                  rules={editAble ? [{ required: true, message: '请选择资源池' }] : []}
                >
                  {handleDisItem(info?.namespace, <Select showSearch options={nameSpaceOptions} />)}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name={'namespace'}
                  label="pod资源策略"
                  style={{ fontWeight: 400, fontSize: 14 }}
                  rules={editAble ? [{ required: true, message: '' }] : []}
                >
                  {handleDisItem(
                    <PodTable
                      readOnly={true}
                      setDataSource={setNodeSelector}
                      dataSource={nodeSelector}
                    />,
                    <PodTable
                      readOnly={false}
                      setDataSource={setNodeSelector}
                      dataSource={nodeSelector}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="配额"
                  required={editAble}
                  style={{ fontWeight: 400, fontSize: 14 }}
                >
                  <Form.Item
                    name="cpu"
                    label="CPU"
                    style={{ margin: 0 }}
                    noStyle={!editAble}
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
                            parseFloat(
                              handleToUnit(availables?.availableCpu, availables?.cpuUnit, cpuUnit),
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
                    {handleDisItem(
                      info?.cpu + info?.cpuUnit + '/',
                      <Input addonAfter={cpuAfter} />,
                    )}
                  </Form.Item>

                  {editAble ? (
                    <div style={{ marginTop: 10, marginBottom: 10, marginLeft: 64 }}>
                      {'可用: ' +
                        handleToUnit(availables?.availableCpu, availables?.cpuUnit, cpuUnit) +
                        cpuUnit}
                    </div>
                  ) : (
                    ''
                  )}

                  <Form.Item
                    name="memory"
                    label="MEM"
                    noStyle={!editAble}
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
                              handleToUnit(
                                availables?.availableMemory,
                                availables?.memoryUnit,
                                memoryUnit,
                              ),
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
                    {handleDisItem(
                      info?.memory + info?.memoryUnit + '/',
                      <Input addonAfter={memAfter} />,
                    )}
                  </Form.Item>
                  {editAble ? (
                    <div style={{ marginTop: 10, marginBottom: 10, marginLeft: 64 }}>
                      {'可用: ' +
                        handleToUnit(
                          availables?.availableMemory,
                          availables?.memoryUnit,
                          memoryUnit,
                        ) +
                        memoryUnit}
                    </div>
                  ) : (
                    ''
                  )}
                  {/* <Form.Item
                    name="disk"
                    noStyle={!editAble}
                    wrapperCol={{ span: 8 }}
                    style={{ margin: 0 }}
                  >
                    {handleDisItem(info.disk + '*', <Input />)}
                  </Form.Item>
                  {editAble ? (
                    <div style={{ marginTop: 10, marginBottom: 10 }}>
                      {'可用:' + (availables?.disk || '')}
                    </div>
                  ) : (
                    ''
                  )} */}
                  <Form.Item
                    name="inst"
                    label="实例数"
                    noStyle={!editAble}
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
                    {handleDisItem('*' + info?.inst, <Input />)}
                  </Form.Item>
                  {editAble ? (
                    <div style={{ marginTop: 10, marginBottom: 10, marginLeft: 64 }}>
                      {'可用: ' + availables?.availableInst}
                    </div>
                  ) : (
                    ''
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
export default Config;
