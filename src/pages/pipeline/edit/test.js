// 源数据
const mockData = {
  agentScript: '',
  stages: [
    {
      name: '阶段1',
      agentScript: 'any',
      steps: [{ name: '步骤1', script: ' ...${item}.. ' }],
    },
    {
      name: '并行阶段',
      agentScript: 'any',
      parallel: [
        {
          name: '阶段1',
          agentScript: 'any',
          steps: [{ name: '步骤1', script: ' ...${item}.. ' }],
        },
        {
          name: '阶段2 ',
          agentScript: 'any',
          steps: [{ name: '步骤2', script: 'shell' }],
        },
      ],
    },
    {
      name: '构建 ',
      agentScript: 'any',
      steps: [{ name: '步骤2', script: 'shell' }],
    },
  ],
};

// 格式化后数据
const mockDatas = {
  agentScript: '',
  stages: [
    {
      stageName: '质量',
      agentScript: 'any',
      jobs: [
        {
          name: '阶段1',
          agentScript: 'any',
          steps: [{ name: '步骤1', script: ' ...${item}.. ' }],
        },
      ],
    },
    {
      stageName: '并行阶段',
      agentScript: 'any',
      jobs: [
        {
          name: '阶段1',
          agentScript: 'any',
          steps: [{ name: '步骤1', script: ' ...${item}.. ' }],
        },
        {
          name: '阶段2 ',
          agentScript: 'any',
          steps: [{ name: '步骤2', script: 'shell' }],
        },
      ],
    },
    {
      stageName: '并行阶段',
      agentScript: 'any',
      jobs: [
        {
          name: '构建 ',
          agentScript: 'any',
          steps: [{ name: '步骤2', script: 'shell' }],
        },
      ],
    },
  ],
};

let testData = {
  baseInfo: {
    pipelineName: 'DEV',
    pipelineTags: [],
    pipelineEnv: 'DEV',
    groupId: 'GROUP',
  },
  defParam: [],
  defStage: {
    name: '模板名',
    category: '分类名',
    tplFlag: 1,
    pipelineStruct: mockData,
    pipelineScript: '',
  },
};

export default testData;
