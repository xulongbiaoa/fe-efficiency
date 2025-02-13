import React, { useState, useEffect } from 'react';
import { Tabs, Button, Space, Divider, message } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useHistory } from 'react-router';
import { getParamsToJson } from '@/utils';
import {
  getPipelineInstanceDetail,
  getTemplateDetail,
  savePipelineInstanceConfig,
  saveTemplateInstanceConfig,
} from '@/services/pipeline/detail';
import PipelineForm from '../components/PipelineForm';
import PipeFlow from '../components/PipeFlow';
import events from '@/hooks/useEventBus';
import { EditContext } from './editContext';
import { PIPELINE_MODE } from '../enum';
import './index.less';

const { TabPane } = Tabs;

// type defaultDataType = {
//   baseInfo: any;
//   defParam: any[];
//   defStage: {
//     name: string;
//     category: string;
//     pipelineStruct: any;
//   };
// };

type submitDataType = {
  baseInfo: any;
  defParam: any[];
  pipelineStruct: {
    agentScript: string;
    stages: any[];
  };
};

const defaultPipelineData = (mode: string) => {
  const defaultData = {
    baseInfo: {},
    defParam: [],
    defStage: {
      name: '',
      category: undefined,
      pipelineStruct: {
        agentScript: '',
        stages: [],
      },
    },
  };
  if (mode === PIPELINE_MODE.CREATE_TEMPLATE || mode === PIPELINE_MODE.EDIT_TEMPLATE) {
    defaultData.baseInfo = {
      name: defaultData.defStage.name,
      category: defaultData.defStage.category,
    };
  } else {
    defaultData.baseInfo = {
      pipelineName: `$流水线-${moment().format('YYYY-MM-DD')}`,
      pipelineTags: [],
      pipelineEnv: 'DEV',
      groupId: '',
    };
  }
  return defaultData;
};

const checkErrors = (obj: any) => {
  let flag = false;
  Object.keys(obj).forEach((key) => {
    if (obj[key] === 'error') {
      flag = true;
    }
  });
  console.log(flag);
  return flag;
};

const PipelineEdit: React.FC = () => {
  const { pipelineId, templateId, mode } = getParamsToJson();
  const [pipelineData, setPipelineData] = useState<any>(defaultPipelineData(mode));
  const [submitData, setSubmitData] = useState<submitDataType>({} as any);
  const [pass, setPass] = useState(true);
  const history = useHistory();

  const updatePipeline = async (formatData: any) => {
    try {
      const res = await savePipelineInstanceConfig({
        id: pipelineId ? Number(pipelineId) : '',
        data: formatData,
      });
      if (res.success) {
        const str = pipelineId ? '流水线编辑成功' : '流水线创建成功';
        message.success({
          content: str,
          duration: 1,
          onClose: () => {
            // history.push(`/pipeline/list`);
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateTemplate = async (formatData: any) => {
    try {
      const res = await saveTemplateInstanceConfig({
        id: templateId ? Number(templateId) : '',
        data: formatData,
      });
      if (res.success) {
        const str = templateId ? '模板编辑成功' : '模板创建成功';
        message.success({
          content: str,
          duration: 1,
          onClose: () => {
            // history.push(`/pipeline/template-list`);
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 模版数据处理
  const dealTemplateInstanceDetail = async () => {
    try {
      const res = await getTemplateDetail({ id: Number(templateId) });
      if (res.success) {
        const { data } = res;
        const { defParam, defStage } = data;

        if (defParam && defParam.length > 0) {
          [...defParam].map((def) => {
            const { varDefValue, varOptions } = def;
            if (!varOptions) {
              def.varOptions = [varDefValue];
            } else {
              const varOptionsArr = varOptions.split(',');
              if (varOptionsArr.indexOf(varDefValue) === -1) {
                varOptionsArr.push(varDefValue);
              }
              def.varOptions = varOptionsArr;
            }
            return def;
          });
        }

        if (defStage?.pipelineStruct) {
          defStage.pipelineStruct = JSON.parse(defStage.pipelineStruct);
        }
        setPipelineData({
          baseInfo: {
            name: defStage.name || '',
            category: defStage.category || '',
          },
          defParam,
          defStage,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  // 流水线实列数据处理
  const dealPipelineInstanceDetail = async () => {
    try {
      const res = await getPipelineInstanceDetail({ id: Number(pipelineId) });
      if (res.success) {
        const { data } = res;
        const { baseInfo, defParam, defStage } = data;
        if (baseInfo?.pipelineTags) {
          baseInfo.pipelineTags = baseInfo.pipelineTags.split(',');
        }

        if (defParam && defParam.length > 0) {
          [...defParam].map((def) => {
            const { varDefValue, varOptions } = def;
            if (!varOptions) {
              def.varOptions = [varDefValue];
            } else {
              const varOptionsArr = varOptions.split(',');
              if (varOptionsArr.indexOf(varDefValue) === -1) {
                varOptionsArr.push(varDefValue);
              }
              def.varOptions = varOptionsArr;
            }
            return def;
          });
        }

        if (defStage?.pipelineStruct) {
          defStage.pipelineStruct = JSON.parse(defStage.pipelineStruct);
        }
        setPipelineData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 数据提交处理
  const resSavePipelineInstanceConfig = async () => {
    const formatData: any = {};
    const { baseInfo, defParam, pipelineStruct } = submitData;
    const { agentScript, stages } = pipelineStruct;

    // 处理标签
    const joinTags = (info: any) => {
      const tempInfo = { ...info };
      if (Array.isArray(tempInfo.pipelineTags)) {
        tempInfo.pipelineTags = tempInfo.pipelineTags.join(',');
      }

      return tempInfo;
    };

    // 处理变量
    const dealVarsParams = (defParams: any[]) => {
      const newDefParam: any[] = [];
      defParams.forEach((def) => {
        const { varOptions } = def;
        newDefParam.push({
          ...def,
          varOptions: varOptions.length === 1 ? '' : varOptions.join(','),
        });
      });
      return newDefParam;
    };

    if (mode === PIPELINE_MODE.CREATE_TEMPLATE || mode === PIPELINE_MODE.EDIT_TEMPLATE) {
      // 模板数据整合
      formatData.defParam = dealVarsParams(defParam || pipelineData.defParam);
      formatData.defStage = {
        name: baseInfo?.name,
        category: baseInfo?.category,
        pipelineStruct: JSON.stringify({
          ...pipelineData.defStage.pipelineStruct,
          agentScript,
          stages,
        }),
      };
      updateTemplate(formatData);
    } else {
      // 流水线数据整合
      formatData.baseInfo = joinTags(baseInfo || pipelineData.baseInfo);
      formatData.defParam = dealVarsParams(defParam || pipelineData.defParam);
      if (stages) {
        const { name, category } = pipelineData.defStage;
        formatData.defStage = {
          name,
          category,
          pipelineStruct: JSON.stringify({
            ...pipelineData.defStage.pipelineStruct,
            agentScript,
            stages,
          }),
        };
      }
      updatePipeline(formatData);
    }
  };

  const goBack = () => {
    history.goBack();
  };

  const handleSubmit = () => {
    events.emit('collect:data');
    setTimeout(() => {
      console.log(submitData);
      if (checkErrors(submitData)) {
        // 检测到此次提交中存在错误后将submitData重置
        return setSubmitData({} as any);
      }
      // 提交更新
      resSavePipelineInstanceConfig();
    }, 20);
  };

  // 获取流水线实列详情
  const reqGetPipelineInstanceDetail = () => {
    if (templateId) {
      return dealTemplateInstanceDetail();
    }
    if (pipelineId) {
      return dealPipelineInstanceDetail();
    }
    return null;
  };

  useEffect(() => {
    reqGetPipelineInstanceDetail();
  }, []);

  return (
    <EditContext.Provider value={{ submitData, setSubmitData, pass, setPass }}>
      <div className="pipeline-edit-container">
        <div className="tabs">
          <div className="left">
            <Space split={<Divider type="vertical" />}>
              <div onClick={goBack}>
                <LeftOutlined />
                <span> 返回 </span>
              </div>
              <div>{pipelineData.baseInfo.pipelineName}</div>
            </Space>
          </div>
          <Tabs defaultActiveKey="2" centered size="large">
            <TabPane tab="基本信息" key="1" forceRender>
              <div className="tab-container">
                {pipelineData && (
                  <PipelineForm
                    varInfo={pipelineData.defParam}
                    baseInfo={pipelineData.baseInfo}
                    mode={mode}
                  />
                )}
              </div>
            </TabPane>
            <TabPane tab="流程配置" key="2" forceRender>
              <div className="tab-container">
                {pipelineData && <PipeFlow pipelineStruct={pipelineData.defStage.pipelineStruct} />}
              </div>
            </TabPane>
          </Tabs>
          <div className="right">
            {mode === PIPELINE_MODE.EDIT_PIPELINE && (
              <Button
                type="primary"
                style={{ marginRight: 10 }}
                onClick={() => {
                  history.push(`/pipeline/detail?pipelineId=${pipelineId}`);
                }}
              >
                详情
              </Button>
            )}
            <Button type="primary" onClick={handleSubmit}>
              保存
            </Button>
          </div>
        </div>
      </div>
    </EditContext.Provider>
  );
};

export default PipelineEdit;
