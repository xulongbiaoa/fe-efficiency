import {
  Card,
  Row,
  Col,
  Descriptions,
  Form,
  Button,
  message,
  Modal,
  Tooltip,
  Typography,
} from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import styles from './index.module.less';
import type { ProColumns } from '@ant-design/pro-table';

import {
  getInsList,
  getBaseinfo,
  getDomainList,
  getEnvSummary,
  getEventList,
  insRestart,
  createDeployOrder,
  rollBack,
  getDeployOrder,
} from '@/services/app/env-overview';

import DeployModal from './modals/deployModal';
import ReloadModal from './modals/rollbackModal';
import ProTable from '@ant-design/pro-table';
import { history } from 'umi';
import moment from 'moment';
const { Paragraph } = Typography;

const Operation: React.FC<{ pageLoading: boolean; domainList: any[]; currEnvId: number }> = ({
  pageLoading,
  currEnvId,
  domainList,
}) => {
  return (
    <div className={styles['status-operation']}>
      <Tooltip
        overlay={
          <div>
            {domainList?.map((item) => {
              return (
                <Paragraph key={item.id} copyable style={{ color: '#fff' }}>
                  {item?.envIdent?.includes('online')
                    ? `${item?.name}${item?.feIdent == 2 ? '.api' : ''}.${item?.networkSegmentName}`
                    : `${item?.name}-${item?.envIdent}${item?.feIdent == 2 ? '.api' : ''}.${
                        item?.networkSegmentName
                      }`}
                </Paragraph>
              );
            })}
          </div>
        }
      >
        <a style={{ marginRight: 20 }}>域名列表</a>
      </Tooltip>

      <a
        onClick={async () => {
          const { unitCode, appId } = history.location?.query as any;

          const res: any = await getDeployOrder(currEnvId);
          if (pageLoading) {
            message.error('环境加载中....');
            return;
          }
          if (!res?.data) {
            message.error('环境未部署');
            return;
          }

          history.push(
            `/app-manage/env-manage/deploy-order?appId=${appId}&unitCode=${unitCode}&envId=${currEnvId}&deployId=${res?.data}`,
          );
        }}
      >
        查看部署单
      </a>
    </div>
  );
};

const SprintDetial: React.FC<{
  currAppId: number;
  currEnvId: number;
}> = ({ currEnvId, currAppId }) => {
  // currAppId, currSprintId, setCurrSprintId
  const [form] = Form.useForm();
  const insRef: any = useRef();
  const eventRef: any = useRef();
  const poolingRes = useRef<any>();
  const [baseInfo, setBaseInfo] = useState<any>({});
  const [pageLoading, setpageLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<any>({});
  const [domainList, setDomainList] = useState<any[]>([]);

  const handleGetDomainList = async (envId: number) => {
    try {
      const res = await getDomainList(envId);
      if (res.success) {
        setDomainList(res.data?.rows || []);
      }
    } catch (error) {}
  };
  const [loading, setLoading] = useState<boolean>(false);

  const [modalVisible, setModalVisible] = useState<'none' | 'deploy' | 'rollback'>('none');

  const handleInsReStart = async (id: number) => {
    try {
      const res = await insRestart(id);
      if (res.success) {
        message.success('操作成功');
      }
    } catch (error) {}
  };

  const insColumns: ProColumns<any>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 240,
    },

    {
      title: 'IP地址',
      dataIndex: 'ip',
    },
    {
      title: '容器状态',
      dataIndex: 'status',
      hideInSearch: true,
    },
    {
      title: '重启次数',
      dataIndex: 'restart',
      hideInSearch: true,
    },
    {
      title: '存活时间',
      dataIndex: 'activeTime',

      render: (activeTime: any) => {
        if (activeTime) {
          return moment(activeTime).fromNow().slice(0, -1);
        } else {
          return '-';
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: any) => {
        return [
          <Button
            type="link"
            key={'reStart'}
            onClick={() => {
              Modal.confirm({
                title: '是否确认重启实例',
                onOk: () => {
                  handleInsReStart(record.id);
                },
              });
            }}
          >
            重启
          </Button>,
        ];
      },
    },
  ];
  const eventsColumns: ProColumns<any>[] = [
    {
      title: '时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '内容',
      dataIndex: 'eventName',
      render: (content) => {
        return content ? '服务' + content : '';
      },
    },

    {
      title: '状态',
      dataIndex: 'eventStatus',
    },
  ];
  const handleDeploy = async (data: {
    envId: number;
    describe: string;
    branch: string;
    commit: string;
    image: string;
    versionType: number;
    operationType: number;
  }) => {
    try {
      setLoading(true);
      const res = (await createDeployOrder(data)) as any;
      if (res.success) {
        message.success('操作成功');
        setModalVisible('none');
        const { appId, unitCode } = history.location.query as any;
        history.push(
          `/app-manage/env-manage/deploy-order?appId=${appId}&unitCode=${unitCode}&envId=${currEnvId}&deployId=${res.data}`,
        );
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleGetBaseInfo = () => {
    try {
      return getBaseinfo(currEnvId);
    } catch (error) {
      return {};
    }
  };
  const handleGetSummary: any = () => {
    try {
      return getEnvSummary(currEnvId);
    } catch (error) {
      return {};
    }
  };

  const handlePooling = async () => {
    try {
      setpageLoading(true);
      poolingRes.current = setTimeout(async () => {
        const res = await handleGetSummary();
        insRef.current?.reload();
        eventRef.current?.reload();
        if (res.success) {
          setSummary(res?.data);
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          !res.data.envStatus?.includes('部署成功') && handlePooling();
        }
        setpageLoading(false);
      }, 5000);
    } catch (error) {
      setpageLoading(false);
    }
  };

  const handleGetData = async () => {
    try {
      setpageLoading(true);
      const [baseInfoRes, summaryRes]: any = await Promise.all([
        handleGetBaseInfo(),
        handleGetSummary(),
      ]);
      if (!summaryRes.data.envStatus?.includes('部署成功')) {
        handlePooling();
      }

      setBaseInfo(baseInfoRes?.data || {});
      setSummary(summaryRes?.data || {});
      setpageLoading(false);
    } catch (error) {
      setpageLoading(false);
    }
  };
  const handleRollBack = async (data: any) => {
    try {
      setLoading(true);
      const res = (await rollBack(data)) as any;
      if (res.success) {
        message.success('操作成功');
        handleGetData();
        setLoading(false);
        setModalVisible('none');
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleDisVersion = (version: string) => {
    if (!version) {
      return '';
    }

    return version.slice(0, 7);
  };

  useEffect(() => {
    clearTimeout(poolingRes.current);
    handleGetData();
    handleGetDomainList(currEnvId);
    insRef.current?.reload();
    eventRef.current?.reload();
  }, [currEnvId]);

  useEffect(() => {
    return () => {
      clearTimeout(poolingRes.current);
    };
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      ...baseInfo,
      manager: { label: baseInfo?.manager?.name, value: baseInfo?.manager?.userId },
    });
  }, [baseInfo]);

  return (
    <>
      <Row gutter={20}>
        <Col span={16}>
          <Card
            bordered={false}
            title="环境总览"
            extra={
              <>
                <Button
                  className={styles['operation-button']}
                  type="primary"
                  onClick={() => {
                    setModalVisible('deploy');
                  }}
                >
                  部署
                </Button>
                <Button
                  className={styles['operation-button']}
                  type="primary"
                  onClick={() => {
                    setModalVisible('rollback');
                  }}
                >
                  回滚
                </Button>
              </>
            }
            className={styles.overview}
          >
            <div className={styles.status}>
              <div className={styles['status-name']}>
                {summary?.appName}
                <Operation
                  domainList={domainList}
                  pageLoading={pageLoading}
                  currEnvId={currEnvId}
                />
              </div>
              <div className={styles['status-desc']}>
                <Descriptions column={2}>
                  <Descriptions.Item
                    label="状态"
                    contentStyle={{ fontWeight: 700, fontSize: 10 }}
                    labelStyle={{ fontWeight: 700, fontSize: 10 }}
                  >
                    {summary?.envStatus}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="实例"
                    style={{ width: 200 }}
                    contentStyle={{ fontWeight: 700, fontSize: 10 }}
                    labelStyle={{ fontWeight: 700, fontSize: 10 }}
                  >
                    {summary?.instance}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="版本"
                    contentStyle={{ fontWeight: 700, fontSize: 10, whiteSpace: 'nowrap' }}
                    labelStyle={{ fontWeight: 700, fontSize: 10 }}
                  >
                    <a
                      target="_blank"
                      href={`${summary?.devRepo?.replace('.git', '')}/-/tree/${summary?.branch}`}
                      rel="noreferrer"
                    >
                      {summary?.branch}&nbsp;
                    </a>
                    <a
                      target="_blank"
                      href={`${summary?.devRepo?.replace('.git', '')}/-/commit/${summary?.commit}`}
                      rel="noreferrer"
                    >
                      {handleDisVersion(summary?.commit)}
                    </a>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="时间"
                    contentStyle={{ fontWeight: 700, fontSize: 10, whiteSpace: 'nowrap' }}
                    labelStyle={{ fontWeight: 700, fontSize: 10 }}
                  >
                    <div style={{ width: 80, whiteSpace: 'pre-wrap' }}>
                      {summary?.deployTime && moment(summary?.deployTime).format('MM-DD HH:mm')}
                    </div>
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            loading={pageLoading}
            title="基本信息"
            extra={
              <div style={{ display: 'flex' }}>
                <Button
                  className={styles['operation-button']}
                  type="primary"
                  onClick={() => {
                    history.push('/app-manage/env-manage/env-config' + location.search);
                  }}
                >
                  编辑
                </Button>
              </div>
            }
          >
            <Form form={form}>
              <Form.Item label="名称" name="name" style={{ margin: 0 }}>
                {baseInfo?.name}
              </Form.Item>
              <Form.Item label="级别" name="envIdent" style={{ margin: 0 }}>
                {baseInfo?.envIdent}
              </Form.Item>
              <Form.Item label="资源池" name="resourcePool" style={{ margin: 0 }}>
                {baseInfo?.resourcePool}
              </Form.Item>
              <Form.Item label="命名空间" style={{ margin: 0 }}>
                {' '}
                {baseInfo?.namespace}
              </Form.Item>
              <Form.Item label="资源配额" style={{ margin: 0 }}>
                {(baseInfo?.cpu || '-') +
                  (baseInfo?.cpuUnit || '-') +
                  '/' +
                  (baseInfo?.memory || '-') +
                  (baseInfo?.memoryUnit || '-') +
                  '/*' +
                  (baseInfo?.inst || '-')}
              </Form.Item>
              <Form.Item label="环境描述" name="describe" style={{ margin: 0 }}>
                <div style={{ wordBreak: 'break-word', lineHeight: '2.2em' }}>
                  {baseInfo?.describe}
                </div>
              </Form.Item>

              <Form.Item label="负责人" name="manager" style={{ margin: 0 }}>
                {baseInfo?.manager?.name}
              </Form.Item>
              <Form.Item label="创建时间" style={{ margin: 0 }}>
                {baseInfo?.createTime && moment(baseInfo?.createTime).format('YYYY-MM-DD HH:mm:ss')}
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
      <Row gutter={20} style={{ marginTop: 20 }}>
        <Col span={16}>
          <Card bordered={false} title="实例信息" className={styles.ins}>
            <ProTable
              rowKey={'id'}
              actionRef={insRef}
              request={getInsList(currEnvId)}
              search={false}
              toolBarRender={false}
              columns={insColumns}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="环境事件" className={styles.events}>
            <ProTable
              // className={styles['events-table']}
              actionRef={eventRef}
              request={getEventList(currEnvId)}
              showHeader={false}
              bordered={false}
              search={false}
              toolBarRender={false}
              columns={eventsColumns}
              rowKey={'id'}
            />
          </Card>
        </Col>
      </Row>
      <DeployModal
        modalVisible={modalVisible === 'deploy'}
        loading={loading}
        onOk={handleDeploy}
        onClose={() => {
          setModalVisible('none');
          setLoading(false);
        }}
        currAppId={currAppId}
        envId={currEnvId}
      />
      <ReloadModal
        loading={loading}
        modalVisible={modalVisible === 'rollback'}
        onOk={handleRollBack}
        onClose={() => {
          setModalVisible('none');
          setLoading(false);
        }}
        envId={currEnvId}
      />
    </>
  );
};
export default SprintDetial;
