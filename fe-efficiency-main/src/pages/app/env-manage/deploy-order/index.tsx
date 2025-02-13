/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  Card,
  Row,
  Col,
  Descriptions,
  Button,
  message,
  Steps,
  Modal,
  Typography,
  Tooltip,
  Tag,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import type { ProColumns } from '@ant-design/pro-table';
import Chart from './chart/index';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import ApprovalModal from './modals/approvalModal';
import { EyeOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import {
  getOrderDetial,
  getDeployDiffList,
  getDeployBatchList,
  getOrderRunList,
  deployBatchRestart,
  deployOrderApproval,
  stopDeploy,
  startDeploy,
} from '@/services/app/deploy-order';
import { setUrlWithoutFreshBrowser } from '@/utils';
import ProTable from '@ant-design/pro-table';
import { history, useModel } from 'umi';
import moment from 'moment';
import { isArray } from 'lodash';
import { usePrevious } from '@ant-design/pro-utils';
const jsDiff = require('diff');

const diffContent = ({ newValue, oldValue, key, unit }: any) => {
  if (newValue[key] === oldValue) {
    return null;
  }
  return (
    <>
      <span style={{ marginRight: 10 }}>
        {oldValue[key] || '-'}
        {unit ? oldValue[unit] || '-' : ''}
      </span>
      →
      <span style={{ marginLeft: 10 }}>
        {newValue[key] || '-'}
        {unit ? newValue[unit] || '-' : ''}
      </span>
    </>
  );
};

const { Step } = Steps;

const titleMop = {
  code: {
    title: '代码版本',
    render(item: any) {
      return {
        newCommitId: item?.commitId,
        oldCommitId: item?.sourceCommitId,
        newBranch: item?.branch,
        oldBranch: item?.sourceBranch,
        newValue: (item?.branch || '-') + ' (' + (item?.commitId?.slice(0, 7) || '-') + ')',
        oldValue:
          (item?.sourceBranch || '-') + ' (' + (item?.sourceCommitId?.slice(0, 7) || '-') + ')',
        href: item?.gitUrl,
        hideLineNumbers: true,
      };
    },
  },
  deployPolicy: {
    title: '部署策略',
    render(item: any) {
      // if (
      //   item?.triggerPlan === item?.sourceTriggerPlan &&
      //   item?.needApproval === item?.sourceNeedApproval
      // ) {
      //   return {
      //     newValue: '',
      //     oldValue: '',
      //     hideLineNumbers: true,
      //   };
      // }
      return {
        newValue: item ? { triggerPlan: item.triggerPlan, needApproval: item.needApproval } : '',
        oldValue: item
          ? { triggerPlan: item.sourceTriggerPlan, needApproval: item.sourceNeedApproval }
          : '',
        hideLineNumbers: true,
      };
    },
  },
  config: {
    title: '资源配置',
    render(item: any) {
      // if (item?.configJson === item?.sourceConfigJson) {
      //   return {
      //     newValue: '',
      //     oldValue: '',
      //   };
      // }
      return {
        newValue: item?.configJson ? JSON.parse(item?.configJson) : '',
        oldValue: item?.sourceConfigJson ? JSON.parse(item?.sourceConfigJson) : '',
      };
    },
  },
  files: {
    title: '环境编排',
    render(item: any) {
      return {
        newValue: item?.fileValue,
        oldValue: item?.sourceFileValue,
        length: item.length,
        disableWordDiff: false,
      };
    },
  },
};
const CodeDiffer = ({ type, item, setContent, setDiffVisible }: any) => {
  const data = titleMop[type]?.render(item);
  const diffRes = ({ oldValue, newValue }: any, fileName: any) => {
    const diff: any = [{}, {}, {}];
    jsDiff
      .diffLines(oldValue || '', newValue || '', { ignoreWhitespace: true })
      .forEach((diffData: any) => {
        if (diffData.added) {
          diff[0].count
            ? (diff[0] = {
                count: (diff[0]?.count || 0) + (diffData?.count || 0),
                added: true,
              })
            : (diff[0] = { count: diffData?.count || 0, added: true });
        }
        if (diffData.removed) {
          diff[1].count
            ? (diff[1] = {
                count: (diff[1]?.count || 0) + (diffData?.count || 0),
                removed: true,
              })
            : (diff[1] = { count: diffData?.count || 0, removed: true });
        } else {
          diff[2].count
            ? (diff[2] = { count: (diff[2]?.count || 0) + (diffData?.count || 0) })
            : (diff[2] = { count: diffData?.count || 0 });
        }
      });

    return (
      <div>
        <span style={{ marginRight: 20 }}>
          <Tooltip title={fileName}>
            {oldValue === null && <Tag color="success">新增</Tag>}
            {oldValue !== null && newValue !== null && <Tag color="processing">修改</Tag>}
            {newValue === null && <Tag color="error">删除</Tag>}

            <div style={{ display: 'inline-block', width: 150 }}>{fileName?.slice(0, 20)}</div>
          </Tooltip>
        </span>
        {diff.map((part: any) => {
          const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
          if (!part.removed && !part.added) {
            return null;
          }
          return (
            <span key={part.value} style={{ color, marginRight: 20 }}>
              {part.added && <PlusOutlined style={{ marginRight: 2, fontSize: 10 }} />}
              {part.removed && <MinusOutlined style={{ marginRight: 2, fontSize: 10 }} />}
              {part.count}
            </span>
          );
        })}
        <a
          onClick={() => {
            setContent({ fileName, oldValue, newValue });
            setDiffVisible(true);
          }}
        >
          <EyeOutlined />
        </a>
      </div>
    );
  };

  const renderDetail = () => {
    if (type == 'files') {
      return item
        ?.filter((fileInfo: any) => {
          return fileInfo.fileValue !== fileInfo.sourceFileValue;
        })
        .map((file: any) => {
          return (
            <div key={file?.id}>
              <div style={{ borderBottom: '1px solid #ccc', marginBottom: 10, paddingBottom: 5 }}>
                {diffRes(titleMop[type]?.render(file), file?.fileName)}
              </div>
            </div>
          );
        });
    } else if (type == 'code') {
      return (
        <div>
          <a
            href={`${data?.href?.replace('.git', '')}/-/commit/${data?.oldCommitId}`}
            rel="noreferrer"
            target={'_blank'}
            style={{ marginRight: 10 }}
          >
            {data?.oldValue}
          </a>
          →
          <a
            style={{ marginLeft: 10 }}
            href={`${data?.href?.replace('.git', '')}/-/commit/${data?.newCommitId}`}
            rel="noreferrer"
            target={'_blank'}
          >
            {data?.newValue}
          </a>
          <a
            target={'_blank'}
            rel="noreferrer"
            style={{ marginLeft: 20 }}
            href={`${data?.href?.replace('.git', '')}/-/compare/${data?.oldCommitId}...${
              data?.newCommitId
            }`}
          >
            diff
          </a>
        </div>
      );
    } else if (type == 'config') {
      // {(data?.newValue?.nodeSelector||[])?.map((item1: any) => {
      //   return item1.key + ' ' + item1.operator + ' ' + item1.values;
      // })}

      const newNodeSelector = JSON.parse(data?.newValue?.nodeSelector || '[]');
      const oldNodeSelector = JSON.parse(data?.oldValue?.nodeSelector || '[]');

      return (
        <Descriptions column={1}>
          <Descriptions.Item
            label="资源池"
            style={{
              display: data?.newValue.envIdent != data?.oldValue.envIdent ? 'block' : 'none',
            }}
          >
            {diffContent({ oldValue: data?.oldValue, newValue: data?.newValue, key: 'envIdent' })}
          </Descriptions.Item>
          <Descriptions.Item
            label="命名空间"
            style={{
              display: data?.newValue.namespace != data?.oldValue.namespace ? 'block' : 'none',
            }}
          >
            {diffContent({ oldValue: data?.oldValue, newValue: data?.newValue, key: 'namespace' })}
          </Descriptions.Item>
          <Descriptions.Item
            label="资源配额"
            style={{
              display:
                data?.newValue.cpu != data?.oldValue.cpu ||
                data?.newValue.memory != data?.oldValue.memory ||
                data?.newValue.instNum != data?.oldValue.instNum
                  ? 'block'
                  : 'none',
            }}
          >
            <Descriptions column={1}>
              <Descriptions.Item
                label="cpu"
                style={{
                  display: data?.newValue.cpu != data?.oldValue.cpu ? 'block' : 'none',
                }}
              >
                {diffContent({
                  oldValue: data?.oldValue,
                  newValue: data?.newValue,
                  key: 'cpu',
                  unit: 'cpuUnit',
                })}
              </Descriptions.Item>
              <Descriptions.Item
                label="memory"
                style={{
                  display: data?.newValue.memory != data?.oldValue.memory ? 'block' : 'none',
                }}
              >
                {diffContent({
                  oldValue: data?.oldValue,
                  newValue: data?.newValue,
                  key: 'memory',
                  unit: 'memoryUnit',
                })}
              </Descriptions.Item>
              <Descriptions.Item
                label="实例数"
                style={{
                  display: data?.newValue.instNum != data?.oldValue.instNum ? 'block' : 'none',
                }}
              >
                {diffContent({
                  oldValue: data?.oldValue,
                  newValue: data?.newValue,
                  key: 'instNum',
                })}
              </Descriptions.Item>
            </Descriptions>
          </Descriptions.Item>
          <Descriptions.Item
            label="pod资源配置"
            style={{
              display:
                JSON.stringify(data?.newValue?.nodeSelector) !=
                JSON.stringify(data?.oldValue?.nodeSelector)
                  ? 'block'
                  : 'none',
            }}
          >
            <div style={{ width: '50%' }}>
              {oldNodeSelector.map((item1: any) => {
                return (
                  <div
                    style={{
                      border: '1px solid #ccc',
                      minHeight: 100,
                      padding: 10,
                      marginRight: 10,
                      marginBottom: 10,
                    }}
                    key={item1.key}
                  >
                    <div>{`标识 : ${item1.key}`}</div>
                    <div> {`操作符 : ${item1.operator}`}</div>
                    <div> {`值: ${item1.values}`}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ width: 20 }}>{'->'}</div>
            <div style={{ width: '50%' }}>
              {newNodeSelector.map((item1: any) => {
                return (
                  <div
                    style={{
                      border: '1px solid #ccc',
                      padding: 10,
                      marginBottom: 10,
                      maxHeight: 100,
                      minHeight: 100,
                      overflow: 'scroll',
                    }}
                    key={item1.key}
                  >
                    <div>{`标识 : ${item1.key}`}</div>
                    <div> {`操作符 : ${item1.operator}`}</div>
                    <div> {`值: ${item1.values}`}</div>
                  </div>
                );
              })}
            </div>

            {/* {JSON.stringify(data?.oldValue?.nodeSelector)} */}
          </Descriptions.Item>
        </Descriptions>
      );
    }

    return (
      <Descriptions column={1}>
        <Descriptions.Item
          label="是否审批"
          style={{
            display: data?.newValue.needApproval != data?.oldValue.needApproval ? 'block' : 'none',
          }}
        >
          {diffContent({ oldValue: data?.oldValue, newValue: data?.newValue, key: 'needApproval' })}
        </Descriptions.Item>
        <Descriptions.Item
          label="部署计划"
          style={{
            display: data?.newValue.triggerPlan != data?.oldValue.triggerPlan ? 'block' : 'none',
          }}
        >
          {diffContent({ oldValue: data?.oldValue, newValue: data?.newValue, key: 'triggerPlan' })}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  if (data.newValue as object) {
    if (JSON.stringify(data.newValue || {}) === JSON.stringify(data.oldValue || {})) {
      return null;
    }
  } else {
    if (data.newValue === data.oldValue) {
      if (data?.length === undefined || data?.length === 0) {
        return null;
      }
    }
  }

  return (
    <div style={{ border: '1px solid #f0f0f0', display: 'flex' }}>
      <div
        style={{
          fontSize: 14,
          fontWeight: 'bold',
          width: 100,
          marginLeft: 0,
          padding: 20,
          borderRight: '1px solid #f0f0f0',
        }}
      >
        {titleMop[type]?.title}
      </div>
      <div style={{ marginTop: 20, marginLeft: 20, marginRight: 20, flex: 1 }}>
        {renderDetail()}
      </div>
    </div>
  );
};
const OrderDetial: React.FC<{
  currAppId: number;
  currSprintId: number;
  setCurrSprintId: (id: number) => void;
  currEnvId: number;
}> = ({ currEnvId }) => {
  // currAppId, currSprintId, setCurrSprintId
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { deployId } = history.location.query as any;
  const [timer, setTimer] = useState<any>(null);
  const deployStatus = {
    0: '待审批',
    1: '审批中',
    2: '审批通过待部署',
    3: '系统自动通过待部署',
    4: '审批拒绝',
    5: '部署中',
    6: '部署成功',
    7: '部署失败',
  };
  const [diffVisible, setDiffVisible] = useState<boolean>(false);
  const [content, setContent] = useState<any>({});
  const [data, setData] = useState<any>({});
  const [approvalId, setApprovalId] = useState<number | undefined>(undefined);
  const runRef = useRef() as any;
  const historyRef = useRef() as any;
  const poolingRef = useRef() as any;
  const [loading, setLoading] = useState<boolean>(false);

  const [diff, setDiff] = useState<any>(null);

  const [approvalLoading, setApprovalLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<'none' | 'approval'>('none');
  const preventEnvId = usePrevious(currEnvId);

  const handlePooling = async () => {
    try {
      poolingRef.current = setTimeout(async () => {
        const res = await getOrderDetial(deployId);
        runRef.current?.reload();
        if (res.success) {
          setData(res?.data);
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          res.data.orderStatus === 5 && handlePooling();
        }
      }, 5000);
    } catch (error) {}
  };

  const handleGetDiff = async () => {
    try {
      const res = await getDeployDiffList({ deployOrderId: deployId, envId: currEnvId });
      if (res.success) {
        const resData = res?.data;
        res.data.files =
          res.data.files?.filter((fileInfo: any) => {
            return fileInfo.fileValue !== fileInfo.sourceFileValue;
          }) || [];
        setDiff(resData);
      }
    } catch (error) {}
  };

  const getDetail = async () => {
    try {
      const res = await getOrderDetial(deployId);
      if (res.success) {
        setData(res.data);
        if (res.data.orderStatus === 5) {
          handlePooling();
        }
      }
    } catch (error) {}
  };

  const reStart = async (record: any) => {
    try {
      const res = await deployBatchRestart({ id: record?.id, deployId: Number(deployId) });
      if (res.success) {
        message.success('重跑成功');
        getDetail();
        runRef.current?.reload();
        historyRef.current?.reload();
      }
    } catch (error) {}
  };
  const handleRestart = (record: any) => {
    Modal.confirm({
      title: '是否确认重跑',
      onOk: () => {
        reStart(record);
      },
    });
  };
  const runColumns: ProColumns<any>[] = [
    {
      title: '批次',
      dataIndex: '',
      width: 50,
      render: () => {
        return 1;
      },
    },

    {
      title: '实例',
      dataIndex: 'insts',
      width: 150,
      render: (insts: any) => {
        if (isArray(insts)) {
          return insts?.map((item: any) => {
            return <div key={item?.ip}>{item?.ip}</div>;
          });
        }
        return insts;
      },
    },
    {
      title: '流程',
      dataIndex: 'process',
      render: (process: any) => {
        if (!process || process === '-') {
          return '-';
        }
        return <Chart record={JSON.parse(process)} />;
      },
    },

    {
      title: '操作',
      align: 'center',
      dataIndex: 'option',
      valueType: 'option',
      width: 100,
      render: (_, record) => {
        return [
          <a
            key={'reStart'}
            onClick={() => {
              handleRestart(record);
            }}
          >
            重跑
          </a>,
          <a key={'log'} rel="noreferrer" href={record?.logUrl} target="_blank">
            日志
          </a>,
        ];
      },
    },
  ];
  const historyColumns: ProColumns<any>[] = [
    {
      title: 'Id',
      dataIndex: 'id',
      width: 50,
      render: (id) => {
        return (
          <Button
            type="link"
            onClick={() => {
              setUrlWithoutFreshBrowser({ deployId: id });
              window.location.href = window.location.href;
            }}
          >
            {id}
          </Button>
        );
      },
    },
    {
      title: '时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '类型',
      dataIndex: 'orderType',
      valueEnum: { 1: '部署', 2: '回滚', 3: '重启' },
    },

    {
      title: '姓名',
      dataIndex: 'createUname',
      hideInSearch: true,
    },
  ];
  const handleApproval = async (approvalData: any) => {
    try {
      setApprovalLoading(true);
      approvalData.envId = Number(currEnvId);
      approvalData.deployOrderId = data.id;
      approvalData.approvalId = approvalId;
      const res = (await deployOrderApproval(approvalData)) as any;
      if (res.success) {
        message.success('操作成功');
        getDetail();
        setModalVisible('none');
      }
      setApprovalLoading(false);
    } catch (error) {
      setApprovalLoading(false);
    }
  };

  const handleGetTimeLange = (startTime: number, endTime: number) => {
    if (!endTime || !startTime) {
      return '-';
    }
    const range = ['day', 'hour', 'minute', 'second'];
    const dateUnit: any = range
      .map((item: any, index: number) => {
        const value = moment(endTime).diff(moment(startTime), item);
        const disUnit = { 0: '天', 1: '小时', 2: '分钟', 3: '秒' };
        return value ? value + disUnit[index] : 0;
      })
      .filter((item) => {
        return item;
      });
    return dateUnit[0] || '0s';
  };

  const handleStop = () => {
    Modal.confirm({
      title: '是否确认要终止部署？',
      content: (
        <Typography.Text type="danger">
          注：仅会关闭部署单，不会将环境恢复至部署前的状态如有问题，需要手动回滚
        </Typography.Text>
      ),
      onOk: async () => {
        try {
          const res = await stopDeploy(data?.id);
          if (res.success) {
            getDetail();
            clearTimeout(poolingRef.current);
            message.success('操作成功');
          }
        } catch (error) {}
      },
    });
  };
  const createTimer = () => {
    setTimer(3);
    setTimeout(() => {
      getDetail();
      setTimer(undefined);
    }, 3000);
  };

  const handleDeploy = async () => {
    try {
      createTimer();
      const res = await startDeploy(data?.id);
      if (res.success) {
        message.success('操作成功');
        getDetail();
      }
    } catch (error) {}
  };

  useEffect(() => {
    handleGetDiff();
    return () => {
      clearTimeout(poolingRef.current);
    };
  }, []);

  useEffect(() => {
    clearTimeout(poolingRef.current);
    if (preventEnvId !== currEnvId && preventEnvId != undefined) {
      const { appId, unitCode } = history.location.query as any;
      history.push(
        `/app-manage/env-manage/view?appId=${appId}&unitCode=${unitCode}&envId=${currEnvId}`,
      );
      return;
    }
    getDetail();
  }, [currEnvId]);

  const configDiff = Object.keys(diff || {}).map((item) => {
    return (
      <CodeDiffer
        setDiffVisible={setDiffVisible}
        setContent={setContent}
        key={item}
        type={item}
        item={diff[item]}
      />
    );
  });

  return (
    <>
      <Row gutter={20}>
        <Col span={16}>
          <Card
            bordered={false}
            title={'环境部署: ' + +data?.id || '-'}
            className={styles.overview}
            loading={loading}
            extra={
              <>
                <Button
                  type="primary"
                  disabled={
                    (data?.orderStatus !== 2 && data?.orderStatus !== 3) ||
                    timer ||
                    data.triggerPlan !== 3
                  }
                  style={{ marginRight: 20 }}
                  onClick={handleDeploy}
                >
                  执行部署
                </Button>
                <Button
                  type="primary"
                  disabled={data?.orderStatus > 5 || data?.orderStatus == 4}
                  onClick={handleStop}
                >
                  终止部署
                </Button>
              </>
            }
          >
            <div className={styles.status}>
              {/* <div className={styles['status-name']}>devops-manager</div> */}
              <div className={styles['status-desc']}>
                <Descriptions column={2}>
                  <Descriptions.Item
                    label="部署环境"
                    contentStyle={{ fontWeight: 400, fontSize: 14 }}
                    labelStyle={{ fontWeight: 400, fontSize: 14 }}
                  >
                    {data?.envIdent}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="部署版本"
                    contentStyle={{ fontWeight: 400, fontSize: 14 }}
                    labelStyle={{ fontWeight: 400, fontSize: 14 }}
                  >
                    {data?.branch} {data?.commit?.slice(0, 7)}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="部署描述"
                    contentStyle={{ fontWeight: 400, fontSize: 14 }}
                    labelStyle={{ fontWeight: 400, fontSize: 14 }}
                  >
                    {data?.description}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="部署制品"
                    contentStyle={{ fontWeight: 400, fontSize: 14 }}
                    labelStyle={{ fontWeight: 400, fontSize: 14 }}
                  >
                    {data.image}
                  </Descriptions.Item>

                  <Descriptions.Item
                    label="提交人"
                    contentStyle={{ fontWeight: 400, fontSize: 14, whiteSpace: 'nowrap' }}
                    labelStyle={{ fontWeight: 400, fontSize: 14 }}
                  >
                    {data?.createUname}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="提交时间"
                    contentStyle={{ fontWeight: 400, fontSize: 14, whiteSpace: 'nowrap' }}
                    labelStyle={{ fontWeight: 400, fontSize: 14 }}
                  >
                    {data?.createTime && moment(data?.createTime).format('YYYY-MM-DD HH:mm:ss')}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="状态"
                    contentStyle={{ fontWeight: 400, fontSize: 14, whiteSpace: 'nowrap' }}
                    labelStyle={{ fontWeight: 400, fontSize: 14 }}
                  >
                    {data?.orderStatus !== undefined ? deployStatus[data?.orderStatus] : ''}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="结束时间"
                    contentStyle={{ fontWeight: 400, fontSize: 14, whiteSpace: 'nowrap' }}
                    labelStyle={{ fontWeight: 400, fontSize: 14 }}
                  >
                    {data?.endTime ? moment(data?.endTime).format('YYYY-MM-DD HH:mm:ss') : '-'} (
                    {handleGetTimeLange(data?.createTime, data?.endTime)})
                  </Descriptions.Item>
                </Descriptions>
              </div>

              <Card title="变更" className={styles.card} bordered={false} style={{ padding: 0 }}>
                <div style={{ border: '1px solid #f0f0f0', minHeight: 50 }}>{configDiff}</div>
              </Card>
              {data?.approval ? (
                <Card
                  title=""
                  className={styles.card}
                  bordered={false}
                  style={{ padding: 0, marginTop: 20 }}
                >
                  <div className={styles['status-name']}>审批</div>

                  <Steps progressDot current={data.orderStatus - 1}>
                    <Step
                      title={data?.createUname}
                      status={'finish'}
                      description={
                        <>
                          <div className={styles['text-finish']}>{'提交工单'}</div>
                        </>
                      }
                    />
                    {data.approval?.map((item: any) => {
                      let status: string = '';
                      const approvalUsers = item.approvableUser;

                      switch (item.approvalStatus) {
                        case 0:
                          status = 'wait';
                          break;
                        case 1:
                          status = 'finish';
                          break;
                        case 2:
                          status = 'error';
                          break;
                      }
                      return (
                        <Step
                          title={
                            item.approvalStatus !== 0
                              ? item.approvalUname
                              : approvalUsers.map((user: any) => user.uname).join('/')
                          }
                          status={status as any}
                          key={item.id}
                          description={
                            <>
                              <div className={styles['text-' + status]}>{item?.approvalDesc}</div>

                              <div>
                                <Button
                                  type="link"
                                  disabled={data.orderStatus === 7}
                                  onClick={() => {
                                    setApprovalId(item.id);
                                    setModalVisible('approval');
                                  }}
                                >
                                  {item.approvalStatus === 0 &&
                                    approvalUsers
                                      .map((user: any) => user.uid)
                                      .includes(String(currentUser?.userId)) &&
                                    '审批'}
                                </Button>
                              </div>
                            </>
                          }
                        />
                      );
                    })}
                  </Steps>
                </Card>
              ) : (
                ''
              )}
              <Card title="执行" className={styles.card} bordered={false} style={{ padding: 0 }}>
                <ProTable
                  actionRef={runRef}
                  search={false}
                  toolBarRender={false}
                  columns={runColumns}
                  request={getDeployBatchList(deployId) as any}
                  rowKey="id"
                />
              </Card>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="部署历史" className={styles.events} loading={loading}>
            <ProTable
              rowKey="id"
              actionRef={historyRef}
              // className={styles['events-table']}
              request={getOrderRunList(currEnvId) as any}
              showHeader={false}
              bordered={false}
              search={false}
              toolBarRender={false}
              columns={historyColumns}
              pagination={{ pageSize: 20 }}
            />
          </Card>
        </Col>
      </Row>

      <ApprovalModal
        loading={approvalLoading}
        modalVisible={modalVisible === 'approval'}
        onOk={handleApproval}
        onClose={() => {
          setModalVisible('none');
          setLoading(false);
        }}
      />
      <Modal
        visible={diffVisible}
        width="80%"
        // title="查看文件变更"
        onCancel={() => {
          setDiffVisible(false);
        }}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        bodyStyle={{ height: '60vh', overflow: 'scroll' }}
      >
        <ReactDiffViewer
          leftTitle={(content?.fileName || '') + '(变更前)'}
          rightTitle={(content?.fileName || '') + '(变更后)'}
          oldValue={content?.oldValue || ''}
          newValue={content?.newValue || ''}
          compareMethod={DiffMethod.LINES}
          codeFoldMessageRenderer={() => {
            return <div>展开</div>;
          }}
        />
      </Modal>
    </>
  );
};
export default OrderDetial;
