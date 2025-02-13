import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { getVarList } from '@/services/app/env-config';
import columns from './column';
import type { paramsType } from './column';
import BaseCard from '../baseCard';

interface IParamsInfo {
  type: string;
  title: string;
  currEnvId: number;
}

const ParamsInfo: React.FC<IParamsInfo> = (props: IParamsInfo) => {
  const [data, setData] = useState<paramsType[]>([]);
  const [loading, setLoading] = useState(false);

  const reqGetVarList = () => {
    setLoading(true);
    return getVarList(props.currEnvId).then((res) => {
      if (res && res.success) {
        setData(res.data);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    reqGetVarList();
  }, [props.currEnvId]);

  return (
    <BaseCard title={props.title}>
      <Table
        rowKey="id"
        size="small"
        loading={loading}
        bordered={false}
        columns={columns()}
        dataSource={data}
        pagination={false}
      />
    </BaseCard>
  );
};

export default ParamsInfo;
