import React from 'react';
import './index.less';

interface IFlowCardGroup {
  name: string;
  children: React.ReactNode;
}

const FlowCardGroup: React.FC<IFlowCardGroup> = (props: IFlowCardGroup) => {
  const renderChildren = () => {
    return React.Children.map(props.children, function (child) {
      return (
        <div className="stage-container">
          <div className="task-container">{child}</div>
        </div>
      );
    });
  };
  return (
    <div className="flow-card-group-container">
      <div className="card-group-head">{props.name}</div>
      <div className="card-group-content">{renderChildren()}</div>
    </div>
  );
};

export default FlowCardGroup;
