import React from 'react';

import './index.less';

interface ICreateNewJob {
  add: () => void;
}

const CreateNewJob: React.FC<ICreateNewJob> = (props: ICreateNewJob) => {
  return (
    <div className="create-new-job-container">
      <div className="node-container">
        <div className="create-new-job-node" onClick={() => props.add && props.add()}>
          <span>新的任务</span>
        </div>
      </div>
    </div>
  );
};

export default CreateNewJob;
