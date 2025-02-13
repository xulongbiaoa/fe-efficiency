import React from 'react';
import { PlusCircleFilled } from '@ant-design/icons';
import './index.less';

interface IFlowSplitLine {
  add?: () => void;
  withoutIcon?: boolean;
}

const FlowSplitLine: React.FC<IFlowSplitLine> = ({ add, withoutIcon = true }: IFlowSplitLine) => {
  return (
    <div className="flow-group-split-line">
      <div className="button" onClick={() => add && add()}>
        {withoutIcon ? <PlusCircleFilled /> : null}
      </div>
    </div>
  );
};

export default FlowSplitLine;
