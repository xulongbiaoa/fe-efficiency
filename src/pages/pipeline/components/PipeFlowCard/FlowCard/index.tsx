import React, { useState } from 'react';
import {
  SyncOutlined,
  ClockCircleFilled,
  CheckCircleFilled,
  CloseCircleFilled,
  StopOutlined,
  FileTextOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
import { getLogStepList, getLogStepDetail } from '@/services/pipeline/detail';
import LogView from '@/components/logView';
import moment from 'moment';
import { CARD_STATE_MAP } from '../const';
import './index.less';

interface IFlowCard {
  id: number;
  name?: string;
  runLogId: number;
  runStatus?: string;
  durationMillis?: number;
  outputResources?: {
    resourceName: string;
    resourceType: string;
    url?: string;
  }[];
}

const FlowCard: React.FC<IFlowCard> = ({
  id,
  name,
  runStatus = 'INIT',
  runLogId,
  durationMillis,
  outputResources,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const reqGetLogMenu = async () => {
    return await getLogStepList({
      runLogId,
      stageId: id,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const reqGetLogItem = async (id: number) => {
    return await getLogStepDetail({ runStepLogId: id });
  };

  const openLogModal = () => {
    setModalVisible(true);
  };

  const renderIcon = (status: string) => {
    switch (status) {
      case 'INIT':
        return <ClockCircleFilled />;
      case 'DEPLOY_INIT':
        return <ClockCircleFilled />;
      case 'IN_PROGRESS':
        return <SyncOutlined spin />;
      case 'SUCCESS':
        return <CheckCircleFilled />;
      case 'FAIL':
        return <CloseCircleFilled />;
      case 'ABORTED':
        return <StopOutlined />;
      default:
        return null;
    }
  };

  const renderOutputResources = () => {
    if (outputResources && Array.isArray(outputResources) && outputResources.length > 0) {
      return (
        <>
          {outputResources.map((resource, index) => {
            const { resourceName, resourceType, url = '/' } = resource;
            switch (resourceType) {
              case 'LOG':
                return (
                  <div className="resources" onClick={openLogModal} key={index}>
                    <FileTextOutlined />
                    &nbsp;
                    <span>{resourceName}</span>
                  </div>
                );
              case 'URL':
                return (
                  <div className="resources" onClick={() => window.open(url)} key={index}>
                    <FileSearchOutlined />
                    &nbsp;
                    <span>{resourceName}</span>
                  </div>
                );
              default:
                return null;
            }
          })}
        </>
      );
    }
    return null;
  };

  return (
    <div className="flow-card">
      <div className={`state-bar ${CARD_STATE_MAP[runStatus]?.className || ''}`} />
      <div className="card-head">
        <span className={`state ${CARD_STATE_MAP[runStatus]?.className || ''}`}>
          {renderIcon(runStatus)}
        </span>
        <span className="name">{name}</span>
      </div>
      <div className="card-body">{CARD_STATE_MAP[runStatus]?.text || runStatus}</div>
      <div className="card-footer">
        <div className="check-log">{renderOutputResources()}</div>
        <div className="duration">{moment(Number(durationMillis || 0)).format('mm分ss秒SSS')}</div>
      </div>
      <LogView
        title="日志"
        modalVisible={modalVisible}
        getLogMenu={reqGetLogMenu as any}
        onClose={() => setModalVisible(false)}
        getLogItem={reqGetLogItem as any}
      />
    </div>
  );
};

export default FlowCard;
