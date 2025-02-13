import React, { useContext, useEffect, useRef, useState } from 'react';
import { message, Modal, Form, Input } from 'antd';
import FlowDataSource from './FlowDataSource';
import FlowSplitLine from './FlowSplitLine';
import FlowJob from './FlowJob';
import FlowGroup from './FlowGroup';
import CreateNewJob from './CreateNewJob';
import usePipeline from './usePipeline';
import type { stageType } from './usePipeline';
import { useEventBus } from '@/hooks/useEventBus';
import { EditContext } from '../../edit/editContext';
import './index.less';

export const parseFn = (stages: stageType[]) => {
  const parseData: any = [];
  stages.forEach((item: stageType) => {
    const { stageName, jobs, stageAgentScript } = item;
    if (jobs.length > 1) {
      const tmp = {
        name: stageName,
        agentScript: stageAgentScript,
        parallel: [...jobs],
      };
      parseData.push(tmp);
    } else {
      parseData.push(jobs[0]);
    }
  });
  return parseData;
};

interface IPipeFlow {
  pipelineStruct: {
    agentScript: string;
    stages: any[];
  };
}

const PipeFlow: React.FC<IPipeFlow> = (props: IPipeFlow) => {
  console.log(props.pipelineStruct.agentScript);
  const { submitData, setSubmitData } = useContext(EditContext) as any;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { stages, addStages, delJobs, modifyJobs, addJobs } = usePipeline({
    data: props.pipelineStruct.stages,
  });

  const flowJobRefs: any = useRef({});

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ agentScript: props.pipelineStruct.agentScript });
  }, [props.pipelineStruct]);

  const handleSaveVarData = () => {
    const flowJosGetDataTask = Object.keys(flowJobRefs.current).map((job) =>
      flowJobRefs.current[job]?.getFieldsData(),
    );
    return Promise.all(flowJosGetDataTask)
      .then(() => {
        submitData.pipelineStruct.stages = parseFn(stages);
        setSubmitData({ ...submitData });
      })
      .catch((error) => {
        if (error) {
          message.error(`【${error.values.job || ''}】存在未填写项`);
          submitData.pipelineStruct = 'error';
          setSubmitData({ ...submitData });
        }
      });
  };

  useEventBus('collect:data', () => {
    // 先校验数据源节点
    form
      .validateFields()
      .then((values) => {
        const { agentScript } = values;
        submitData.pipelineStruct = {
          agentScript,
          stages: [],
        };
        return handleSaveVarData();
      })
      .catch(() => {
        message.error(`数据源内代理机器名称未填写`);
        submitData.pipelineStruct = 'error';
      });
  });

  const renderFlow = () => {
    if (stages.length === 0) {
      return (
        <React.Fragment>
          <FlowSplitLine />
          <CreateNewJob add={() => addStages()} />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        {stages.map((stage: stageType, index: number) => {
          return (
            <React.Fragment key={index}>
              <FlowSplitLine add={() => addStages(index)} />
              <FlowGroup name={stage.stageName} addJobs={() => addJobs(index)}>
                {stage.jobs.map((job, jobIndex: number) => {
                  return (
                    <FlowJob
                      ref={(el: any) => (flowJobRefs.current[job.name] = el)}
                      key={job.name}
                      jobIndex={jobIndex}
                      groupIndex={index}
                      stagename={stage.stageName}
                      job={job.name}
                      agentScript={job.agentScript}
                      steps={job.steps}
                      delJobs={delJobs}
                      modifyJobs={modifyJobs}
                    />
                  );
                })}
              </FlowGroup>
            </React.Fragment>
          );
        })}
        <FlowSplitLine withoutIcon={false} />
        <CreateNewJob add={() => addStages()} />
      </React.Fragment>
    );
  };

  const handleOk = () => {
    setIsModalVisible(true);
  };

  return (
    <>
      <div className="pipeline-flow">
        <div className="side-bar">
          <FlowDataSource openDataSource={handleOk} />
        </div>
        <div className="content">{renderFlow()}</div>
      </div>
      <Modal
        title="设置数据源"
        width={600}
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        forceRender={true}
        destroyOnClose
      >
        <Form name="agent_form" form={form} layout="vertical">
          <Form.Item
            label="代理机器"
            name="agentScript"
            key="agentScript"
            initialValue={props.pipelineStruct.agentScript || ''}
            rules={[
              {
                required: true,
                message: '请输入名称',
              },
            ]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PipeFlow;
