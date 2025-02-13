/* eslint-disable @typescript-eslint/no-shadow */
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { getPiplelineHistoryList } from '@/services/pipeline/detail';
import { getParamsToJson } from '@/utils';
import columns from './cloums';
import type { DataType } from './cloums';
import './index.less';

interface IPipelineHistory {
  onCheckCallback: (item: DataType) => void;
}

const PipelineHistory: React.FC<IPipelineHistory> = (props: IPipelineHistory) => {
  const [data, setData] = useState<DataType[]>([]);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const { pipelineId } = getParamsToJson();

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const reqGetPiplelineHistoryList = async (pageNo: number) => {
    const params = {
      instanceId: Number(pipelineId),
      pageNo,
      pageSize: 20,
    };

    try {
      const {
        data: { rows, totalPage },
      } = await getPiplelineHistoryList(params);
      setData(rows);
      setTotalPage(totalPage);
    } catch (e) {
      console.log(e);
    }
  };

  const checkHistory = (item: DataType) => {
    props.onCheckCallback(item);
  };

  const handleChangeCurrPage = (e: number) => {
    setPageNo(e);
    reqGetPiplelineHistoryList(e);
  };

  useEffect(() => {
    reqGetPiplelineHistoryList(pageNo);
  }, []);

  return (
    <div className="pipeline-history-container">
      {data && Array.isArray(data) && data.length > 0 ? (
        <Table
          rowKey="id"
          columns={columns({ checkHistory })}
          dataSource={data}
          scroll={{ x: 1300 }}
          pagination={{
            current: pageNo,
            pageSize: 20,
            total: totalPage * 20,
            onChange: handleChangeCurrPage,
          }}
        />
      ) : (
        <div className="empty">暂无运行历史</div>
      )}
    </div>
  );
};

export default PipelineHistory;
