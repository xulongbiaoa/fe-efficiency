import React from 'react';
import './index.less';

interface IFlowGroup {
  name: string;
  addJobs: () => void;
  children: React.ReactNode;
}

const FlowGroup: React.FC<IFlowGroup> = (props: IFlowGroup) => {
  const renderChildren = () => {
    return React.Children.map(props.children, function (child) {
      return (
        <>
          <div className="stage-container">
            <div className="task-container">{child}</div>
          </div>
        </>
      );
    });
  };

  return (
    <div className="flow-group-container">
      <div className="group-head"></div>
      <div className="group-content">
        {renderChildren()}
        <div className="stage-container add-task">
          <div className="task-container">
            <div className="add-task-node" onClick={() => props.addJobs()}>
              添加任务
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowGroup;
