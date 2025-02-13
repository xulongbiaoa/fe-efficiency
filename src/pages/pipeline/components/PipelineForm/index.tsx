import React from 'react';
import { Tabs } from 'antd';
import PipelineInfo from './PipelineInfo';
import TemplateInfo from './TemplateInfo';
import Variables from './Variables';
import type { DataType } from './VarForm';
import type { PipelineInfoType } from './PipelineInfo';
import type { TemplateInfoType } from './TemplateInfo';
import { PIPELINE_MODE } from '../../enum';
import './index.less';

const { TabPane } = Tabs;
interface IPipelineForm {
  baseInfo: PipelineInfoType & TemplateInfoType;
  varInfo: DataType[];
  mode: string;
}

const PipelineForm: React.FC<IPipelineForm> = (props: IPipelineForm) => {
  return (
    <div className="pipeline-form-container">
      <div className="form-tabs">
        <Tabs tabPosition="left">
          {props.mode === PIPELINE_MODE.CREATE_TEMPLATE ||
          props.mode === PIPELINE_MODE.EDIT_TEMPLATE ? (
            <TabPane tab="模板信息" key="1">
              <TemplateInfo baseInfo={props.baseInfo} mode={props.mode}></TemplateInfo>
            </TabPane>
          ) : (
            <TabPane tab="流水线信息" key="2">
              <PipelineInfo baseInfo={props.baseInfo} mode={props.mode}></PipelineInfo>
            </TabPane>
          )}
          <TabPane tab="变量" key="3">
            <Variables varInfo={props.varInfo}></Variables>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default PipelineForm;
