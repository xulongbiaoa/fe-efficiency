import React from 'react';
import { DatabaseOutlined } from '@ant-design/icons';
import './index.less';

interface IFlowDataSource {
  openDataSource: () => void;
}
const FlowDataSource: React.FC<IFlowDataSource> = (props: IFlowDataSource) => {
  return (
    <div className="flow-data-source">
      <div className="title"></div>
      <div className="node-container">
        <div className="data-source-node" onClick={props.openDataSource}>
          <DatabaseOutlined />
          &nbsp;
          <span>数据源</span>
        </div>
      </div>
    </div>
  );
};

export default FlowDataSource;
