import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { message, Tabs } from 'antd';
import { getParamsToJson } from '@/utils';
import { SessionInstance } from '@/utils/storage';
import { runPipeline } from '@/services/pipeline/list';
import { getPipelineDetail, getPipelineInstanceDetail } from '@/services/pipeline/detail';
import PipelineHeader from '../components/PipelineHeader/idnex';
import PipelineHistory from '../components/PipelineHistory';
import PipelFlowCard from '../components/PipeFlowCard';
import type { DataType } from '../components/PipelineHistory/cloums';
import './index.less';

const { TabPane } = Tabs;

const defaultPanes = [
  {
    title: '最近运行',
    type: 'current',
  },
  {
    title: '运行历史',
    type: 'history',
  },
];

const { pipelineId, lastRunLogId } = getParamsToJson();

const lineInfo = SessionInstance?.get('currentDetailInfo');
if (!lineInfo?.currentPipelineId || lineInfo?.currentPipelineId !== pipelineId) {
  SessionInstance?.set('currentDetailInfo', {
    currentRunLogId: Number(lastRunLogId),
    currentPipelineId: pipelineId,
  });
}

const PipelineDetail: React.FC = () => {
  const [activeKey, setActieKey] = useState<string>(defaultPanes[0].type);
  const history = useHistory();

  const { targetRunLogId } = (history.location as any).query;

  const [panes, setPanes] = useState(
    defaultPanes.filter((item) => {
      return !(targetRunLogId !== undefined && item.type === 'current');
    }),
  );
  const [currentRunId, setCurrentRunId] = useState<number>(
    SessionInstance?.get('currentDetailInfo').currentRunLogId,
  );
  const [currentCheckId, setCurrentCheckId] = useState<number>();

  const onChange = (key: string) => {
    setActieKey(key);
  };

  // 查看tab
  const addNewTab = (item: DataType) => {
    const newPanObj = {
      title: `#${item.runNum || 999}`,
      type: 'random',
    };
    const newPanes = [
      ...defaultPanes.filter((pane: any) => {
        return !(targetRunLogId !== undefined && pane.type === 'current');
      }),
      newPanObj,
    ];
    setCurrentCheckId(item.id);
    setPanes(newPanes);
    setActieKey(newPanObj.type);
  };

  // 编辑
  const handleEditCallback = () => {
    history.push(`/pipeline/edit?pipelineId=${pipelineId}&mode=edit_pipeline`);
  };

  // 运行
  const handleRunCallback = (params: {
    ids: number[];
    remark: string;
    [key: string]: string | number[];
  }) => {
    return runPipeline(params)
      .then((res) => {
        if (res.success) {
          message.success('流水线触发成功');
          setCurrentRunId(res.data);
          setActieKey('current');
          SessionInstance?.set('currentDetailInfo', {
            currentRunLogId: Number(res.data),
            currentPipelineId: pipelineId,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderContent = () => {
    switch (activeKey) {
      case 'current':
        return (
          <div className="tab-container">
            <PipelFlowCard runLogId={currentRunId} key={currentRunId} />
          </div>
        );
      case 'history':
        return (
          <div className="tab-container">
            <PipelineHistory onCheckCallback={addNewTab} />
          </div>
        );
      case 'random':
        return currentCheckId ? (
          <div className="tab-container">
            <PipelFlowCard runLogId={currentCheckId} key={currentCheckId} />
          </div>
        ) : null;
      default:
        return null;
    }
  };

  const handleGetDetial = async (runLogId: number) => {
    try {
      const res = await getPipelineDetail({ runLogId });
      if (res.success) {
        addNewTab({ id: targetRunLogId, runNum: res.data.runNum });
      }
    } catch (error) {}
  };
  const getRunlogId = async () => {
    try {
      const res = await getPipelineInstanceDetail({ id: pipelineId });
      if (res.success) {
        setCurrentRunId(res.data?.baseInfo?.lastRunLogId);
        SessionInstance?.set('currentDetailInfo', {
          currentRunLogId: Number(res.data?.baseInfo?.lastRunLogId),
          currentPipelineId: pipelineId,
        });
      }
    } catch (error) {}
  };
  useEffect(() => {
    if (targetRunLogId) {
      handleGetDetial(targetRunLogId);
    }
  }, []);

  useEffect(() => {
    getRunlogId();
  }, [pipelineId]);

  return (
    <>
      <div className="pipeline-header-container">
        <PipelineHeader onEditCallback={handleEditCallback} onRunCallback={handleRunCallback} />
        <div className="tabs">
          <Tabs onChange={onChange} activeKey={activeKey}>
            {panes.map((pane) => {
              return (
                <TabPane
                  tab={<span style={{ margin: '0 15px' }}>{pane.title}</span>}
                  key={pane.type}
                >
                  {renderContent()}
                </TabPane>
              );
            })}
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default PipelineDetail;
