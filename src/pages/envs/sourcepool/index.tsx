import React, { useState, useEffect } from 'react';
import { Space } from 'antd';
import K8STable from './comps/k8sTable';
import { getParamsToJson } from '@/utils';
import { sourcePoolOverview } from '@/services/envs/sourcepool';
import kubernetes from '@/images/kubernetes.png';
import styles from './index.module.less';

type sourceNodeType = {
  id: number;
  poolName: String;
  poolType: String;
  poolCount: Number;
  icon: any;
};

const iconMap = {
  k8s: kubernetes,
};

const SourcePool: React.FC = () => {
  const [sourceNodes, setSourceNodes] = useState<sourceNodeType[]>([]);
  const [currPoolType, setCurrPoolType] = useState<String>(getParamsToJson()?.poolType || 'k8s');

  const reqSourcePoolOverview = () => {
    return sourcePoolOverview().then((res) => {
      if (res && res.success) {
        setSourceNodes(res.data);
      }
    });
  };

  const handleClickNode = (node: sourceNodeType) => {
    setCurrPoolType(node.poolType);
  };

  useEffect(() => {
    reqSourcePoolOverview();
  }, []);

  const renderTable = () => {
    switch (currPoolType) {
      case 'k8s':
        return <K8STable reloadSummary={() => reqSourcePoolOverview()}></K8STable>;
      default:
        return null;
    }
  };

  return (
    <div className={styles['sourcepool-container']}>
      <a className={styles['source-node']}>
        <Space size="large" wrap>
          {sourceNodes.map((node: sourceNodeType) => {
            return (
              <div
                className={`${styles['node-item']} ${
                  currPoolType === node.poolType ? styles['selected'] : ''
                }`}
                onClick={() => handleClickNode(node)}
                key={node.id}
              >
                <div className={styles['head']}>
                  <img src={iconMap[node.poolType as string]} />
                  {node.poolName}
                </div>
                <div className={styles['content']}>{node.poolCount}</div>
              </div>
            );
          })}
        </Space>
      </a>
      <div className={styles['source-table']}>{renderTable()}</div>
    </div>
  );
};

export default SourcePool;
