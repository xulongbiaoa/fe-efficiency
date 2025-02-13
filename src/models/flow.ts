/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from 'react';

type stepType = {
  name: string;
  agent_script: string;
  steps: { name: string; script: string }[];
};

export default () => {
  const [stages] = useState<stepType[]>([]);

  // 添加任务
  const addStage = (step: stepType, insertIndex?: number, parallel: boolean = false) => {};

  // 删除任务
  const deleteStage = (stageIndex: number) => {};

  // 更新任务
  const updateStage = (newStage: stepType, index: number) => {};

  // 批量更新任务
  //   const batchUpdateStage = (newStages: any) => {
  //     setStages([...newStages]);
  //   };

  return {
    stages,
    addStage,
    deleteStage,
    updateStage,
  };
};
