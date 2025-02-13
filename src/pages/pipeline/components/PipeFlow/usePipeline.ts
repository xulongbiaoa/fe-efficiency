import { useState, useEffect } from 'react';
import { cloneDeep } from 'lodash';

type sourceStageType1 = {
  name: string;
  agentScript: string;
  steps: { name: string; script: string }[];
};

type sourceStageType2 = {
  name: string;
  agentScript: string;
  parallel: sourceStageType1[];
};

export type stageType = {
  stageName: string;
  stageAgentScript: string;
  jobs: {
    name: string;
    agentScript: string;
    steps: { name: string; script: string }[];
  }[];
};

const formatFn = (stages: any[]) => {
  const newStages: stageType[] = [];
  if (stages && stages.length) {
    stages.forEach((item: sourceStageType1 & sourceStageType2, index: number) => {
      const tmpStage: stageType = {
        stageName: item.name || `阶段${index + 1}`,
        stageAgentScript: item.agentScript || '',
        jobs: item.parallel ? [...item.parallel] : [item],
      };
      newStages.push(tmpStage);
    });
  }
  return newStages;
};

const insertEle = (arr: any[], index: number, ele: any) => {
  arr.splice(index, 0, cloneDeep(ele));
  return [...arr];
};

const replaceEle = (arr: any[], index: number, ele: any) => {
  arr.splice(index, 1, ele);
  return [...arr];
};

const deleteEle = (arr: any[], index: number) => {
  arr.splice(index, 1);
  return [...arr];
};

const autoId = (function () {
  const idsCache = [];
  let n = 0;
  return function () {
    n = n + 1;
    idsCache.push(n);
    return n;
  };
})();

const createEmptyStage = (name: string) => {
  const emptyStage = {
    stageName: `stage_${name}`,
    stageAgentScript: '',
    jobs: [
      {
        name: name,
        agentScript: '',
        steps: [],
      },
    ],
  };
  return emptyStage;
};

const createEmptyJob = (name: string) => {
  return {
    name: name,
    agentScript: '',
    steps: [],
  };
};

const usePipeline = ({
  data,
  initFn = formatFn,
}: {
  data: any[];
  initFn?: ([]: any) => stageType[];
}) => {
  const [stages, setStages] = useState(initFn(data));

  useEffect(() => {
    setStages(initFn(data));
  }, [data]);

  // 添加 stage
  const addStages = (afterInsertId?: number) => {
    const name = `job_${autoId()}`;
    if (afterInsertId === undefined) {
      setStages([...stages, createEmptyStage(name)]);
    } else {
      const newStages = insertEle(stages, afterInsertId, createEmptyStage(name));
      setStages(newStages);
    }
  };

  // 删除
  const delJobs = (groupIndex: number, jobIndex: number) => {
    const restJobs = deleteEle(stages[groupIndex].jobs, jobIndex);
    if (restJobs.length === 0) {
      const newStages = deleteEle(stages, groupIndex);
      setStages([...newStages]);
    } else {
      stages[groupIndex].jobs = restJobs;
      setStages([...stages]);
    }
  };

  // 修改
  const modifyJobs = (stage: any, groupIndex: number, jobIndex: number) => {
    const newJobs = replaceEle(stages[groupIndex].jobs, jobIndex, stage);
    stages[groupIndex].jobs = [...newJobs];
    setStages([...stages]);
  };

  // 添加 job
  const addJobs = (groupIndex: number) => {
    const name = `job_${autoId()}`;
    stages[groupIndex].jobs.push(createEmptyJob(name));
    setStages([...stages]);
  };

  return {
    stages,
    addStages,
    delJobs,
    modifyJobs,
    addJobs,
  };
};

export default usePipeline;
