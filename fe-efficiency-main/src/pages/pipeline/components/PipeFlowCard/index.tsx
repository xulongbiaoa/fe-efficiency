import React, { useEffect, useState, useRef } from 'react';
import CardSideBar from './CardSideBar';
import FlowCardGroup from './FlowCardGroup';
import FlowCard from './FlowCard';
import { getPipelineDetail } from '@/services/pipeline/detail';
import './index.less';

interface IPipeFlowCard {
  runLogId: number;
  actionRun?: boolean;
}

type stageResultType = {
  id: number;
  name: string;
  runStatus: string;
  startTimeMillis?: string;
  durationMillis?: number;
  outputResources?: { resourceName: string; resourceType: string }[];
  parallel?: any[];
};

const EmptyPlace = ({ word }: { word: string }) => {
  return (
    <div style={{ textAlign: 'center', marginTop: '200px', width: '100%', color: '#999' }}>
      {word}
    </div>
  );
};

const PipeFlowCard: React.FC<IPipeFlowCard> = (props: IPipeFlowCard) => {
  const [flowCardData, setFlowCardData] = useState<any>(null);
  const timRef = useRef<any>(null);

  const reqGetPipelineDetail = async () => {
    try {
      if (!props.runLogId) {
        return;
      }

      const { data } = await getPipelineDetail({ runLogId: props.runLogId });
      setFlowCardData(data);

      if (['QUEUING', 'IN_PROGRESS', 'INIT'].indexOf(data.runStatus) > -1) {
        timRef.current = setTimeout(() => {
          reqGetPipelineDetail();
        }, 1000);
      }

      if (['SUCCESS', 'FAIL', 'ABORTED'].indexOf(data.runStatus) > -1) {
        if (timRef.current) {
          clearTimeout(timRef.current);
          timRef.current = null;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderFlowCardGroup = () => {
    if (!flowCardData.runResultInfo) {
      return <EmptyPlace word="暂无数据" />;
    }
    const { stageResults } = JSON.parse(flowCardData.runResultInfo);
    return (
      stageResults.length > 0 &&
      stageResults.map((item: stageResultType) => {
        const { id, name = '' } = item;
        return (
          <FlowCardGroup name={name} key={id}>
            {item.parallel ? (
              item.parallel.map((_item: stageResultType) => {
                return (
                  <FlowCard
                    key={_item.id}
                    id={_item.id}
                    name={_item.name}
                    runLogId={props.runLogId}
                    runStatus={_item.runStatus}
                    durationMillis={_item.durationMillis}
                    outputResources={_item.outputResources}
                  />
                );
              })
            ) : (
              <FlowCard
                key={id}
                id={id}
                name={name}
                runLogId={props.runLogId}
                runStatus={item.runStatus}
                durationMillis={item.durationMillis}
                outputResources={item.outputResources}
              />
            )}
          </FlowCardGroup>
        );
      })
    );
  };
  useEffect(() => {
    reqGetPipelineDetail();
    return () => {
      clearTimeout(timRef.current);
      timRef.current = null;
    };
  }, []);

  return flowCardData ? (
    <div className="pipe-flow-card">
      <div className="side-bar">
        <CardSideBar
          runlogid={flowCardData.id}
          runNum={flowCardData.runNum}
          runStatus={flowCardData.runStatus}
          triggerDesc={flowCardData.triggerDesc}
          duration={flowCardData.runDurationMillis}
          createTime={flowCardData.createTime}
          runClientInfo={JSON.parse(flowCardData.runClientInfo || '{}')}
          runExternalName={flowCardData.runExternalName}
        />
      </div>
      {flowCardData.runStatus === 'QUEUING' ? (
        <EmptyPlace word="正在排队中..." />
      ) : (
        <div className="content">{renderFlowCardGroup()}</div>
      )}
    </div>
  ) : (
    <div className="empty">暂无运行详情</div>
  );
};

export default PipeFlowCard;
