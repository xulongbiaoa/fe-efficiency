import React, { useState, useEffect, useCallback } from 'react';
import { Card, message, Table, Button, Input, Modal } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import {
  getStageList,
  checkStagePipelineList,
  createPipelineWithStage,
  deletePipelineWithStage,
  pipelineDefmark,
} from '@/services/app/process-manage';
import { updatePipelineParams } from '@/services/pipeline/detail';
import { getParamsToJson, setUrlWithoutFreshBrowser } from '@/utils';
import StageNode from './components/StageNode';
import PipelineModal from './components/PipelineModal';
import type { TStageNode } from './components/StageNode';
import columns from './components/column';
import type { ColumnDataType } from './components/column';
import arrowRight from '@/images/arrow-right.png';
import styles from './index.module.less';
import { history } from 'umi';

const ArrowRight = () => {
  return (
    <div style={{ width: '30px', height: '20px', margin: '0 10px' }}>
      <img src={arrowRight} style={{ objectFit: 'contain', width: '100%' }} />
    </div>
  );
};

interface IAppDetailInfo {
  currAppId: number;
  setCurrAppId: (appId: number) => void;
}

const ProcessManage: React.FC<IAppDetailInfo> = (props: IAppDetailInfo) => {
  const [stages, setStages] = useState<TStageNode[]>([]);
  const [title, setTitle] = useState<string>('');
  const [activeId, setActiveId] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [pipelineList, setPipelineList] = useState<any[]>([]);
  const [isPipelineModal, setIsPipelineModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  // 获取流水线列表
  const reqCheckStagePipelineList = (data: { appId: number; stageId: number; name: string }) => {
    return checkStagePipelineList(data).then((res) => {
      if (res && res.success) {
        setPipelineList([...res.data]);
      }
    });
  };
  const delayQuery = useCallback(
    debounce((query: string) => {
      reqCheckStagePipelineList({ appId: props.currAppId, stageId: activeId, name: query });
    }, 500),
    [props.currAppId, activeId],
  );

  // 获取阶段列表
  const reqGetStageList = () => {
    setLoading(true);
    return getStageList(props.currAppId).then((res) => {
      setLoading(false);
      if (res && res.success && res.data && res.data.length > 0) {
        const { activeNodeId } = getParamsToJson();
        const activeData: TStageNode = activeNodeId
          ? [...res.data].filter((item) => item.id === Number(activeNodeId))[0]
          : res.data[0];
        if (activeData) {
          setStages(res.data);
          setTitle(`${activeData.name}`);
          setActiveId(activeData.id);
          setUrlWithoutFreshBrowser({ activeNodeId: activeData.id });
          reqCheckStagePipelineList({
            appId: props.currAppId,
            stageId: activeData.id,
            name: search,
          });
        }
      }
    });
  };

  const handleNodeClick = (nodeInfo: TStageNode) => {
    const { id, name } = nodeInfo;
    if (name !== title) {
      message.info(`切换到${name}`);
      setTitle(`${name}`);
      setSearch('');
      setActiveId(id);
      setUrlWithoutFreshBrowser({ activeNodeId: id });
      reqCheckStagePipelineList({
        appId: props.currAppId,
        stageId: id,
        name: '',
      });
      return;
    }
  };

  const handleCreateNewPipeline = () => {
    setIsPipelineModal(true);
  };

  const handleClose = () => {
    setIsPipelineModal(false);
  };

  const handleOk = (action: string, processName: string, pipelineItem: any) => {
    const { id, instId } = pipelineItem;
    let data = { stageId: activeId };
    switch (action) {
      case 'create':
        data = Object.assign(data, { name: processName, op: 0, pipelineTplId: id });
        break;
      case 'relevancy':
        data = Object.assign(data, {
          name: processName,
          op: 1,
          pipelineTplId: id,
          pipelineInstId: instId,
        });
        break;
      case 'copy':
        data = Object.assign(data, {
          name: processName,
          op: 2,
          pipelineTplId: id,
          pipelineInstId: instId,
        });
        break;
    }
    return createPipelineWithStage(data as any).then((res) => {
      if (res && res.success) {
        setIsPipelineModal(false);
        reqCheckStagePipelineList({
          appId: props.currAppId,
          stageId: activeId,
          name: '',
        });
      }
    });
  };

  const handleSearchPipleLine = (e: any) => {
    const name = e.target.value;
    setSearch(name);
    delayQuery(name);
  };

  const handleCheckDetail = (record: ColumnDataType) => {
    const { pipelineTplId, pipelineInstId } = record;
    console.log(record);
    let url;
    if (pipelineInstId !== undefined) {
      url = `/pipeline/edit?pipelineId=${pipelineInstId}`;
    } else {
      url = `/pipeline/edit?templateId=${pipelineTplId}`;
    }
    history.push(url);
  };

  const handleDeletePipeline = (record: ColumnDataType) => {
    const { id } = record;
    Modal.confirm({
      title: '确认删除该流水线吗？',
      onOk: () => {
        return deletePipelineWithStage([id]).then((res) => {
          if (res && res.success) {
            message.success('流水线删除成功');
            reqCheckStagePipelineList({
              appId: props.currAppId,
              stageId: activeId,
              name: '',
            });
          }
        });
      },
    });
  };
  const hanleSwitchChange = (e: any, record: any) => {
    const { id } = record;
    return pipelineDefmark(id, { defMark: Number(e) }).then((res) => {
      if (res && res.success) {
        reqGetStageList();
      }
    });
  };

  const handleChangeName = (name: string, record: any) => {
    const { id } = record;
    console.log(name, record);
    return updatePipelineParams(Number(id), { name }).then((res) => {
      if (res && res.success) {
        reqCheckStagePipelineList({ appId: props.currAppId, stageId: activeId, name: search });
      }
    });
  };

  useEffect(() => {
    reqGetStageList();
  }, [props.currAppId]);

  return (
    <div className={styles.processManageContainer}>
      <Card title="交付流程" className={styles.noBorder} bordered={false}>
        <div className={styles.stageContainer}>
          {stages.map((node: TStageNode, index: number, arr: TStageNode[]) => {
            return (
              <React.Fragment key={index}>
                <StageNode nodeInfo={node} activeId={activeId} onClick={handleNodeClick} />
                {index !== arr.length - 1 && <ArrowRight />}
              </React.Fragment>
            );
          })}
        </div>
      </Card>
      <Card
        title={`${title}流水线`}
        className={styles.noBorder}
        bordered={false}
        extra={
          <div>
            <Input
              style={{ width: '300px', marginRight: 10 }}
              placeholder="输入关键词搜索"
              suffix={<SearchOutlined />}
              value={search}
              onChange={handleSearchPipleLine}
              allowClear
            />
            <Button type="primary" onClick={handleCreateNewPipeline} icon={<PlusOutlined />}>
              新建
            </Button>
          </div>
        }
      >
        <div className={styles.table}>
          <Table
            rowKey="id"
            size="small"
            loading={loading}
            bordered={true}
            columns={columns({
              handleChangeName,
              hanleSwitchChange,
              handleDeletePipeline,
              handleCheckDetail,
            })}
            dataSource={pipelineList}
            pagination={false}
          />
        </div>
      </Card>
      <PipelineModal
        template={[]}
        modalVisible={isPipelineModal}
        onClose={handleClose}
        onOk={handleOk}
      />
    </div>
  );
};

export default ProcessManage;
