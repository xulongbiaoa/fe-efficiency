import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, message } from 'antd';
import Activitys from './component/activitys';
import BaseInfo from './component/baseInfo';
import Stages from './component/stages';
import StatusCard from './component/statusCard';
import type { ISprintDetial } from '@/services/app/sprint-detial';
import { getSprintDetial, devActivity } from '@/services/app/sprint-detial';
import { addFeature, deleteFeature } from '@/services/app/sprint-detial';
import { setUrlWithoutFreshBrowser, delUrlParamsWithoutFreshBrowser } from '@/utils/index';

import { isNumber } from 'lodash';
import { usePrevious } from '@ant-design/pro-utils';
import { history } from 'umi';

const SprintDetial: React.FC<{
  currAppId: number;
  currSprintId: number;
  setCurrSprintId: (id: number) => void;
  setEnvId: (id: number) => void;
}> = ({ currAppId, currSprintId, setCurrSprintId, setEnvId }) => {
  const [sprintInfo, setSprinInfo] = useState<ISprintDetial | Record<string, never>>({});
  const [selectStage, setSelectStage] = useState<number | undefined>();
  const [isStagePush, setIsStagePush] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const prevenrId = usePrevious(currSprintId);
  const selectFeatureIdRef: any = useRef();

  const [disModal, setDisModal] = useState<
    'triggerPipeline' | 'submitMR' | 'syncMain' | 'rollback' | 'none'
  >('none');

  const handleGetSprintDetial = async (selectStageId?: number, isPush?: boolean) => {
    try {
      const params: any = { id: currSprintId, selectStageId: selectStage };

      if (selectFeatureIdRef.current !== undefined) {
        params.selectFeatureId = selectFeatureIdRef.current;
      }

      if (selectStageId !== undefined) {
        params.selectStageId = selectStageId;
      }

      if (prevenrId !== currSprintId && prevenrId !== undefined) {
        setSelectStage(undefined);
        selectFeatureIdRef.current = undefined;
        delete params.selectStageId;
        delete params.selectFeatureId;
      }
      setLoading(true);
      if (currSprintId == undefined) {
        message.error('迭代id不存在');
        return;
      }
      const res = await getSprintDetial(params);
      if (res.success) {
        setSprinInfo(res.data as any);
        if (res.data.selectStageId) {
          setSelectStage(res.data.selectStageId);
          if (isPush) {
            setIsStagePush(true);
          }
        }

        selectFeatureIdRef.current = res.data.selectFeatureId;
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleStartActivity = async (params: any) => {
    try {
      setModalLoading(true);
      const res: any = await devActivity({
        ...params,
        sprintStageId: selectStage,
        featureId: selectFeatureIdRef.current,
      });

      if (res.success) {
        message.success('操作成功');
        setDisModal('none');
        handleGetSprintDetial(
          undefined,
          params.type === 4 && !sprintInfo.envInfo?.ident.includes('dev'),
        );
      }
      setModalLoading(false);
    } catch (error) {
      setModalLoading(false);
    }
  };

  const handleToggleStage = async (stage: number) => {
    setSelectStage(stage);
    selectFeatureIdRef.current = undefined;
    handleGetSprintDetial(stage);
  };

  const handleAddFeature = async (data: any) => {
    data.sprintId = currSprintId;
    try {
      setModalLoading(true);
      const res = await addFeature(data);
      if (res.success) {
        message.success('操作成功');
        selectFeatureIdRef.current = res.data.id;
        handleGetSprintDetial();
      }
      setModalLoading(false);
    } catch (error) {
      setModalLoading(false);
    }
  };
  const handleDelFeature = async (id: number) => {
    try {
      setModalLoading(true);
      const res = await deleteFeature(id);

      // if (id == selectFeatureIdRef.current) {
      delUrlParamsWithoutFreshBrowser(['selectFeatureId']);
      selectFeatureIdRef.current = undefined;
      // }

      if (res.success) {
        message.success('操作成功');
        handleGetSprintDetial();
      }
      setModalLoading(false);
    } catch (error) {
      setModalLoading(false);
    }
  };

  const handleChangeFeature = async (id: number) => {
    selectFeatureIdRef.current = id;

    handleGetSprintDetial();
  };

  useEffect(() => {
    delUrlParamsWithoutFreshBrowser(['selectStageId', 'selectFeatureId']);

    if (selectStage !== undefined) {
      setUrlWithoutFreshBrowser({ selectStageId: selectStage });
    }
    if (selectFeatureIdRef.current != null) {
      setUrlWithoutFreshBrowser({ selectFeatureId: selectFeatureIdRef.current });
    }
  }, [selectStage, selectFeatureIdRef.current]);

  useEffect(() => {
    const {
      selectStageId,
      selectFeatureId: newSelectFeatureId,
      sprintId,
    } = history.location.query as any;

    if (currSprintId !== 0 && isNumber(currSprintId) && !isNaN(currSprintId)) {
      if (currSprintId === sprintId) {
        handleGetSprintDetial();
        return;
      }
      selectFeatureIdRef.current = newSelectFeatureId;
      handleGetSprintDetial(selectStageId);
    }
  }, [currSprintId]);
  const appStageId = useMemo(() => {
    return sprintInfo?.stages?.filter((item) => item.id === selectStage)[0]?.appStageId;
  }, [selectStage, sprintInfo?.stages]);

  return (
    <Card loading={loading}>
      <BaseInfo
        currSprintId={currSprintId}
        status={sprintInfo?.status as any}
        name={sprintInfo?.name}
        version={sprintInfo?.version}
        owner={sprintInfo?.roleMembers as any}
        handleGetSprintDetial={handleGetSprintDetial}
        setCurrSprintId={setCurrSprintId}
      />
      <Stages
        stages={sprintInfo?.stages || []}
        selectStageId={sprintInfo?.selectStageId}
        handleToggleStage={handleToggleStage}
      />
      <StatusCard
        isLast={Number((sprintInfo?.stages || []).slice(-1)[0]?.id) === selectStage}
        codeInfo={sprintInfo?.codeInfo}
        envInfo={sprintInfo?.envInfo}
        build={sprintInfo?.build}
        features={sprintInfo?.features || []}
        selectFeatureId={selectFeatureIdRef.current}
        selectStageIdent={
          sprintInfo?.stages?.filter((item) => {
            return item.id === selectStage;
          })[0]?.ident
        }
        selectStage={selectStage as number}
        stages={sprintInfo?.stages || []}
        loading={modalLoading}
        currAppId={currAppId}
        status={sprintInfo?.status as any}
        repo={sprintInfo?.codeInfo?.repo || ''}
        handleAddFeature={handleAddFeature}
        handleDelFeature={handleDelFeature}
        handleChangeFeature={handleChangeFeature}
        handleStartActivity={handleStartActivity}
        version={sprintInfo?.version}
        branch={sprintInfo?.branch}
      />
      <Activitys
        loading={modalLoading}
        envInfo={sprintInfo?.envInfo}
        stages={sprintInfo?.stages || []}
        status={sprintInfo?.status as any}
        currAppId={currAppId}
        setEnvId={setEnvId}
        features={sprintInfo?.features || []}
        selectFeatureId={selectFeatureIdRef.current}
        disModal={disModal}
        setDisModal={setDisModal}
        selectStage={selectStage}
        handleStartActivity={handleStartActivity}
        handleGetSprintDetial={handleGetSprintDetial}
        version={sprintInfo?.codeInfo?.branch}
        optionOper={sprintInfo?.optionOper}
        appStageId={appStageId}
        repo={sprintInfo?.codeInfo?.repo || ''}
        setIsStagePush={setIsStagePush}
        isStagePush={isStagePush}
      />
    </Card>
  );
};
export default SprintDetial;
