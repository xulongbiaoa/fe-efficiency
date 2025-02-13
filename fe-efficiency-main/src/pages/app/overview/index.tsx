import React, { useState, useEffect } from 'react';
import { Checkbox, Space, Table, Button, message } from 'antd';
import { useHistory } from 'react-router';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { getEnvList } from '@/services/app/env-manage';
import { getSprintListNew } from '@/services/app/sprint-manage';
import CreateModal from '@/pages/app/sprint-manage/list/component/optionModal/createModal';
import { createSprint } from '@/services/app/sprint-manage';
import columns1 from './components/column1';
import columns2 from './components/column2';
import type { DataType } from './components/column2';
import styles from './index.module.less';
import { useModel } from 'umi';

const options = [
  { label: '与我相关', value: 'me' },
  { label: '进行中', value: 'ing' },
];

interface IOverView {
  currAppId: number;
  setCurrAppId: (appId: number) => void;
  setCurrSprintId: (sprintId: number) => void;
}

const Overview: React.FC<IOverView> = (props: IOverView) => {
  const [envData, setEnvData] = useState<any>([]);
  const [sprintData, setSprintData] = useState<any>([]);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [createModalDis, setCreateModalDis] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    initialState: { currentUser },
  }: any = useModel('@@initialState');
  const history = useHistory();

  const reqGetEnvList = () => {
    return getEnvList(props.currAppId).then((res) => {
      if (res && res.success) {
        setEnvData(
          res.data?.filter((item: any) => {
            return Number(item.status) !== 9;
          }),
        );
      }
    });
  };

  const reqGetSprintList = (params: { scope: number; pageNo: number; status?: number }) => {
    const defaultParams = {
      appId: props.currAppId,
      scope: 0,
      search: '',
      pageNo: 1,
      pageSize: 10,
    };
    const _params = Object.assign(defaultParams, params);
    return getSprintListNew(_params).then((res) => {
      if (res && res.success) {
        setSprintData([...res.data.rows]);
        setTotalPage(res.data.totalPage);
      }
    });
  };

  const onChange = (e: CheckboxValueType[]) => {
    let params = { pageNo, scope: 0 };
    if ([...e].indexOf('me') > -1) {
      params = Object.assign(params, { scope: 1 });
    }
    if ([...e].indexOf('ing') > -1) {
      params = Object.assign(params, { status: 1 });
    }
    return reqGetSprintList(params);
  };
  const handleCreateSprint = async (data: any) => {
    try {
      setLoading(true);
      const res = await createSprint(props.currAppId, data);
      if (res.success) {
        setLoading(false);
        message.success('操作成功');
        props.setCurrSprintId(res.data.id);
        history.push(
          `/app-manage/sprint-manage/sprint-detial${history.location.search}&sprintId=${res.data.id}`,
        );
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleChangeCurrPage = (e: any) => {
    return setPageNo(e);
  };

  const jumpToSprintDetail = (record: DataType) => {
    const { id } = record;
    props.setCurrSprintId(id as number);
    history.push(
      `/app-manage/sprint-manage/sprint-detial${history.location.search}&sprintId=${id}`,
    );
    return;
  };
  useEffect(() => {
    reqGetEnvList();
    reqGetSprintList({ scope: 0, pageNo });
  }, [props.currAppId]);
  return (
    <div className={styles.overviewContainer}>
      <section className={styles.wrap}>
        <div className={styles.header}>
          <div className={styles.title}>环境部署</div>
        </div>
        <Table
          rowKey="id"
          size="small"
          bordered={true}
          columns={columns1()}
          dataSource={envData}
          pagination={false}
        />
      </section>
      <section className={styles.wrap}>
        <div className={styles.header}>
          <div className={styles.title}>迭代列表</div>
          <Space size="large">
            <Button
              type="link"
              key="primary"
              onClick={() => {
                setCreateModalDis(true);
              }}
            >
              创建迭代
            </Button>
            <Checkbox.Group options={options} onChange={onChange} />
          </Space>
        </div>
        <Table
          rowKey="id"
          size="small"
          bordered={true}
          columns={columns2({ jumpToSprintDetail })}
          dataSource={sprintData}
          pagination={{
            current: pageNo,
            pageSize: 10,
            total: totalPage * 10,
            onChange: handleChangeCurrPage,
          }}
        />
      </section>
      <CreateModal
        modalVisible={createModalDis}
        currentUser={currentUser}
        onOk={handleCreateSprint}
        loading={loading}
        onClose={() => {
          setCreateModalDis(false);
          setLoading(false);
        }}
      />
    </div>
  );
};

export default Overview;
