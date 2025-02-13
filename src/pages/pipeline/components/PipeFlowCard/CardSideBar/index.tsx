import React from 'react';
import { Button, message } from 'antd';
import {
  SyncOutlined,
  ClockCircleFilled,
  CheckCircleFilled,
  CloseCircleFilled,
  StopOutlined,
} from '@ant-design/icons';
import { CARD_STATE_MAP } from '../const';
import moment from 'moment';
import './index.less';

import { runRePolling } from '@/services/pipeline/detail';
interface ICardSideBar {
  runNum: string;
  runStatus: string;
  triggerDesc: string;
  duration: string | number;
  createTime: string;
  runClientInfo: any;
  runExternalName: string;
  runlogid: number;
}

const renderIcon = (status: string) => {
  switch (status) {
    case 'INIT':
      return (
        <span style={{ color: '#d9d9d9' }}>
          <ClockCircleFilled />
        </span>
      );
    case 'QUEUING':
    case 'IN_PROGRESS':
      return (
        <span style={{ color: '#87d2ff' }}>
          <SyncOutlined spin />
        </span>
      );
    case 'SUCCESS':
      return (
        <span style={{ color: '#64d16d' }}>
          <CheckCircleFilled />
        </span>
      );
    case 'FAIL':
      return (
        <span style={{ color: '#e6524b' }}>
          <CloseCircleFilled />
        </span>
      );
    case 'ABORTED':
      return (
        <span style={{ color: '#f87872' }}>
          <StopOutlined />
        </span>
      );
    case 'TASK_TIMEOUT':
      return (
        <span style={{ color: '#f87872' }}>
          <CloseCircleFilled />
        </span>
      );

    default:
      return null;
  }
};

const CardSideBar: React.FC<ICardSideBar> = ({
  runNum,
  runStatus,
  triggerDesc,
  duration,
  createTime,
  runClientInfo,
  runExternalName,
  runlogid,
}) => {
  const handleRepolling = async () => {
    try {
      const res = await runRePolling(runlogid);
      if (res.success) {
        message.success('操作成功');
      }
    } catch (error) {}
  };

  return (
    <div className="card-side-bar">
      <div className="side-bar-head">
        <a
          className="run-num"
          target="_blank"
          href={`${runClientInfo?.endPoint}/job/${runExternalName}/${runNum}`}
          rel="noreferrer"
        >
          #{runNum}
        </a>
        <div className="run-status">
          {renderIcon(runStatus)}&nbsp;
          {CARD_STATE_MAP[runStatus] && CARD_STATE_MAP[runStatus]?.text}
        </div>
      </div>
      <ul className="side-bar-content">
        <li>
          <span className="label">触发信息</span>
          <span>{triggerDesc}</span>
        </li>
        <li>
          <span className="label">开始时间</span>
          <span>{moment(createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
        </li>
        <li>
          <span className="label">持续时间</span>
          <span>{moment(Number(duration)).format('mm分ss秒')}</span>
        </li>
      </ul>
      <Button
        style={{ margin: 0, padding: 0 }}
        type="link"
        disabled={runStatus == 'INIT' || runStatus == 'IN_PROGRESS' || runStatus == 'PROCESSING'}
        onClick={handleRepolling}
      >
        重新轮询
      </Button>
    </div>
  );
};

export default CardSideBar;
