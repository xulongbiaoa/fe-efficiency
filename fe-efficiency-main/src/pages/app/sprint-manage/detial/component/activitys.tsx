import type { TableListPagination } from '@/datas/data';
import type { ISprintDetial } from '@/services/app/sprint-detial';
import { getActivityList, deployOperate } from '@/services/app/sprint-detial';
import { DownOutlined } from '@ant-design/icons';

import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Dropdown, message, Menu } from 'antd';

import { useEffect, useMemo, useState, useRef } from 'react';
import styles from './../index.module.less';
import ProcessChart from './chart/processChart';
import SubmitMRModal from './modals/optionModal/submitMR';
import SyncMainModal from './modals/optionModal/syncMain';
import TriggerPipelineModal from './modals/optionModal/triggerPipeline';
import RollBackMoal from './../../../env-manage/overview/modals/rollbackModal';
import { history } from 'umi';
interface IDetial {
  loading: boolean;
  optionOper: ISprintDetial['optionOper'];
  envInfo: ISprintDetial['envInfo'];
  features: any[];
  version: string;
  currAppId: number;
  selectStage: number | undefined;
  selectFeatureId: number;
  appStageId: number;
  disModal: any;
  status: number;
  repo: string;
  stages: any[];
  handleGetSprintDetial: (params: any) => void;
  handleStartActivity: (params: any) => void;
  setDisModal: (value: any) => void;
  setEnvId: (id: number) => void;
  setIsStagePush: (isStagePush: boolean) => void;
  isStagePush: boolean;
}

const Activity: React.FC<IDetial> = ({
  optionOper = [],
  envInfo,
  disModal,
  version,
  currAppId,
  selectStage,
  loading,
  appStageId,
  selectFeatureId,
  status,
  repo,
  stages,
  handleStartActivity,
  handleGetSprintDetial,
  setDisModal,
  setEnvId,
  setIsStagePush,
  isStagePush,
}) => {
  const [polling, setPolling] = useState<number | undefined>(undefined);
  const { devMode } = history.location.query as any;
  const [opeLoading, setOpeLoading] = useState(false);
  const latestStatePush = useRef(0);
  const isMount = useRef<boolean>(false);
  const actionRef: any = useRef();
  let nextStageId: number | undefined;
  for (let i = 0; i < stages.length; i++) {
    if (selectStage && stages[i].id > selectStage) {
      nextStageId = stages[i].id;
      break;
    }
  }
  const handlePooling = (data: any[]) => {
    latestStatePush.current = 0;
    if (!isMount) {
      return;
    }
    if (data.some((item) => item.activityStatus === 1)) {
      setPolling(1000);
      return;
    }
    data.forEach((record) => {
      if (record.activityType === 'STAGE_PUSH') {
        if (latestStatePush.current < record.id) {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          latestStatePush.current = record.id;
        }
      }
    });

    setPolling(undefined);
  };

  const url = useMemo(() => {
    return getActivityList(selectStage as number, selectFeatureId, handlePooling);
  }, [selectStage, selectFeatureId]);

  const columns: ProColumns<any>[] = [
    {
      title: '',
      dataIndex: 'id',
      width: 100,
      hideInSearch: true,
      render: (_, record) => {
        return (
          <ProcessChart
            latestStatePush={latestStatePush}
            envId={envInfo?.id}
            setEnvId={setEnvId}
            nextStageId={nextStageId}
            handleGetSprintDetial={handleGetSprintDetial as any}
            repo={repo}
            width={600}
            record={record || {}}
            setIsStagePush={setIsStagePush}
            isStagePush={isStagePush}
          />
        );
      },
    },
  ];

  const handleEnvDeploy = async () => {
    try {
      setOpeLoading(true);
      if (selectStage) {
        const res = await deployOperate({
          sprintStageId: selectStage as number,
          featureId: selectFeatureId,
          operationType: 1,
        });

        if (res.success) {
          message.success('环境部署启动成功');
          actionRef?.current?.reload();
        }
      }
      setOpeLoading(false);
    } catch (error) {
      setOpeLoading(false);
    }
  };
  const handleReopen = async () => {
    try {
      setOpeLoading(true);
      if (selectStage) {
        const res = await deployOperate({
          sprintStageId: selectStage as number,
          featureId: selectFeatureId,
          operationType: 3,
        });

        if (res.success) {
          message.success('环境重启启动成功');
          actionRef?.current?.reload();
        }
      }
      setOpeLoading(false);
    } catch (error) {
      setOpeLoading(false);
    }
  };
  const handleRollBack = async (data: any) => {
    try {
      setOpeLoading(true);
      data.deployOrderId = data.rollBackId;
      delete data.rollBackId;

      if (selectStage) {
        const res = (await deployOperate({
          ...data,
          sprintStageId: selectStage as number,
          featureId: selectFeatureId,
          operationType: 2,
        })) as any;
        if (res.success) {
          message.success('环境回滚启动成功');
          actionRef?.current?.reload();
          setDisModal('none');
        }
      }
      setOpeLoading(false);
    } catch (error) {
      setOpeLoading(false);
    }
  };

  const mainBranchOptions = useMemo(() => {
    return optionOper
      .filter((item) => {
        return item.type === 'SYNC_MAIN';
      })[0]
      ?.meta?.trunkSelector.split('|')
      .map((item: string) => {
        return {
          label: item,
          value: item,
        };
      });
  }, [optionOper]);
  useEffect(() => {
    isMount.current = true;
    return () => {
      isMount.current = false;
    };
  }, []);
  return (
    <div className={styles.activity}>
      <div className={styles['header-container']}>
        <div className={styles['header-title']}>研发活动</div>

        <div className={styles['header-buttons']}>
          {devMode != '20' && (
            <Dropdown
              disabled={status == 0 || status === 2 || status === 3}
              destroyPopupOnHide
              placement={'bottom'}
              overlay={
                <Menu>
                  <Menu.Item key={1} onClick={handleEnvDeploy}>
                    环境部署
                  </Menu.Item>
                  <Menu.Item key={2} onClick={handleReopen}>
                    环境重启
                  </Menu.Item>
                  <Menu.Item
                    key={3}
                    onClick={() => {
                      setDisModal('rollback');
                    }}
                  >
                    部署回滚
                  </Menu.Item>
                </Menu>
              }
            >
              <Button type="primary" className={styles['buttons-item']}>
                环境部署
                <DownOutlined />
              </Button>
            </Dropdown>
          )}

          {optionOper.map((item) => {
            if (item.type === 'NEXT') {
              return null;
            }
            return (
              <Button
                key={item.type}
                type="primary"
                disabled={status == 0 || status === 2 || status === 3}
                className={styles['buttons-item']}
                onClick={() => {
                  switch (item.type) {
                    case 'SYNC_MAIN':
                      setDisModal('syncMain');
                      break;
                    case 'MR':
                      setDisModal('submitMR');
                      break;
                    case 'PIPELINE':
                      setDisModal('triggerPipeline');
                      break;
                    case 'NEXT':
                      break;
                  }
                }}
              >
                {item.name}
              </Button>
            );
          })}
        </div>
      </div>
      <ProTable<any, TableListPagination>
        polling={polling}
        toolBarRender={false}
        showHeader={false}
        request={url}
        rowKey="id"
        showSorterTooltip={false}
        className={styles.table}
        actionRef={actionRef}
        pagination={{
          pageSize: 10,
        }}
        columns={columns}
        search={false}
      />

      <SubmitMRModal
        loading={loading}
        modalVisible={disModal === 'submitMR'}
        onClose={() => {
          setDisModal('none');
        }}
        onOk={handleStartActivity}
        version={version}
        currAppId={currAppId}
        appStageId={appStageId}
      />
      <TriggerPipelineModal
        modalVisible={disModal === 'triggerPipeline'}
        onClose={() => {
          setDisModal('none');
        }}
        onOk={handleStartActivity}
        currAppId={currAppId}
        selectStage={selectStage}
        loading={loading}
        appStageId={appStageId}
      />
      <SyncMainModal
        loading={loading}
        modalVisible={disModal === 'syncMain'}
        onClose={() => {
          setDisModal('none');
        }}
        onOk={handleStartActivity}
        version={version}
        mainBranchOptions={mainBranchOptions}
      />
      <RollBackMoal
        loading={opeLoading}
        modalVisible={disModal === 'rollback'}
        onClose={() => {
          setDisModal('none');
        }}
        onOk={handleRollBack}
        envId={envInfo?.id}
      />
    </div>
  );
};
export default Activity;
