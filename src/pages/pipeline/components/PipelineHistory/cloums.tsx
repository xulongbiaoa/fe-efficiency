import { Steps, Popover } from 'antd';
import type { StepsProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  SyncOutlined,
  ClockCircleFilled,
  CheckCircleFilled,
  CloseCircleFilled,
  StopOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Step } = Steps;

export type DataType = {
  id?: number;
  pipelineInstanceId?: string;
  runNum?: string;
  runStatus?: string; // "INIT IN_PROGRESS SUCCESS FAIL"
  runDesc?: string;
  runParam?: any;
  triggerDesc?: string;
  triggerInfo?: any;
  runStageTopoVo?: { name: string; runStatus: string }[];
  createBy?: string;
  updateBy?: string;
  createTime?: string;
  updateTime?: string;
  runDurationMillis?: number | string;
  deleted?: number;
};

type CloumnsPropsType = {
  checkHistory: (params: DataType) => void;
};

const renderIcon = (status: string) => {
  switch (status) {
    case 'INIT':
      return (
        <span style={{ color: '#d9d9d9' }}>
          <ClockCircleFilled /> 等待中
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span style={{ color: '#87d2ff' }}>
          <SyncOutlined spin /> 运行中
        </span>
      );
    case 'SUCCESS':
      return (
        <span style={{ color: '#64d16d' }}>
          <CheckCircleFilled /> 运行成功
        </span>
      );
    case 'FAIL':
      return (
        <span style={{ color: '#e6524b' }}>
          <CloseCircleFilled /> 运行失败
        </span>
      );
    case 'TASK_TIMEOUT':
      return (
        <span style={{ color: '#e6524b' }}>
          <CloseCircleFilled /> 运行超时
        </span>
      );
    case 'ABORTED':
      return (
        <span style={{ color: '#f87872' }}>
          <StopOutlined /> 运行取消
        </span>
      );
    case 'UNKNOWN':
      return <span style={{ color: '#999' }}>未知</span>;
    case 'QUEUING':
      return <span style={{ color: '#444' }}>队列中</span>;
    default:
      return status;
  }
};

const customDot: StepsProps['progressDot'] = (dot, { status }) => (
  <Popover content={<span>{status}</span>}>{dot}</Popover>
);
const mapStatus = (runStatus: string) => {
  switch (runStatus) {
    case 'INIT':
      return 'wait';
    case 'IN_PROGRESS':
      return 'process';
    case 'SUCCESS':
      return 'finish';
    case 'FAIL':
      return 'error';
    case 'ABORTED':
      return 'error';
    case 'UNKNOWN':
      return 'wait';
    case 'QUEUING':
      return 'wait';
    default:
      return '';
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const renderStep = (steps: { name: string; runStatus: string }[], currentStatus?: string) => {
  if (steps && Array.isArray(steps)) {
    return (
      <Steps progressDot={customDot} size="small">
        {steps.length > 0 &&
          steps.map((step) => {
            return (
              <Step title={step.name} key={step.name} status={mapStatus(step.runStatus) as any} />
            );
          })}
      </Steps>
    );
  }
  return;
};

const cloumns = (props: CloumnsPropsType): ColumnsType<DataType> => [
  {
    title: '运行记录',
    dataIndex: 'runNum',
    fixed: 'left',
    key: 'runNum',
    width: 100,
    render: (text) => <div className="column-name">#{text}</div>,
  },
  {
    title: '状态',
    dataIndex: 'runStatus',
    key: 'runStatus',
    width: 120,
    render: (state) => <div className="column-name">{renderIcon(state)}</div>,
  },
  {
    title: '运行详情',
    dataIndex: 'runResultTopo',
    key: 'runResultTopo',
    width: 450,
    render: (steps, record) => (
      <div className="column-name" style={{ transform: 'translateX(-25%) scale(0.7)' }}>
        {renderStep(JSON.parse(steps), record.runStatus)}
      </div>
    ),
  },
  {
    title: '触发信息',
    key: 'triggerDesc',
    dataIndex: 'triggerDesc',
    render: (text) => <div className="column-name">{text}</div>,
  },
  {
    title: '持续时间',
    key: 'runDurationMillis',
    dataIndex: 'runDurationMillis',
    render: (time) => <div className="column-name">{moment(time).format('mm分ss秒')}</div>,
  },
  {
    title: '开始时间',
    key: 'createTime',
    dataIndex: 'createTime',
    render: (duration) => (
      <div className="column-name">{moment(duration).format('YYYY-MM-DD HH:mm:ss')}</div>
    ),
  },
  {
    title: '运行备注',
    key: 'runDesc',
    dataIndex: 'runDesc',
    render: (text) => <div className="column-name">{text}</div>,
  },
  {
    title: '操作',
    dataIndex: 'Action',
    key: 'action',
    fixed: 'right',
    width: 100,
    render: (text, record) => {
      return <a onClick={() => props.checkHistory(record)}>查看</a>;
    },
  },
];

export default cloumns;
