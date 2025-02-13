import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message } from 'antd';
import columns from './column';
import ClusterModal from './ClusterModal';
import type { k8sType } from './column';
import {
  sourcePoolList,
  createSourcePool,
  updateSourcePool,
  deleteSourcePool,
} from '@/services/envs/sourcepool';
import styles from './index.module.less';

const TYPE = 'k8s';

const formatData = (data: any): any[] => {
  const tmp: any[] = [];
  if (data && Array.isArray(data) && data.length > 0) {
    data.forEach((item) => {
      tmp.push({
        ...item.data,
        id: item.id,
        manager: item.manager,
        status: item.status,
        name: item.name,
      });
    });
  }
  return tmp;
};

interface IK8STable {
  reloadSummary: () => void;
}

const K8STable: React.FC<IK8STable> = (props: IK8STable) => {
  const [data, setData] = useState<k8sType[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState<number>(1);
  // const [totalPage, setTotalPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(10);
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState('edit');
  const [config, setConfig] = useState({ id: 0, name: '', kubeConfig: '~/.kube/config' });

  const reqSourcePoolList = (pageNum: number) => {
    setLoading(true);
    return sourcePoolList({
      pageNo: pageNum,
      pageSize: 20,
      type: TYPE,
    }).then((res) => {
      setLoading(false);
      if (res && res.data) {
        setData(formatData(res.data.rows));
        // setTotalPage(res.data.totalPage);
        setTotalRows(res.data.totalRows);
      }
    });
  };

  const deleteSource = (record: k8sType) => {
    const { id, name } = record;
    Modal.confirm({
      title: `确认删除 ${name} 吗？`,
      onOk: () => {
        return deleteSourcePool(id, TYPE).then((res) => {
          if (res && res.success) {
            message.success('已成功删除');
            reqSourcePoolList(pageNo);
            props.reloadSummary();
          }
        });
      },
    });
  };

  const editSource = (record: k8sType) => {
    const { id, name, kubeConfig } = record;
    setType('edit');
    setConfig({
      id,
      name,
      kubeConfig,
    });
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSubmit = (submitConfig: {
    id?: number;
    type: string;
    name: string;
    kubeConfig: string;
  }) => {
    if (type === 'add') {
      return createSourcePool({
        type: TYPE,
        name: submitConfig.name,
        data: {
          kubeConfig: submitConfig.kubeConfig,
        },
      }).then(() => {
        reqSourcePoolList(pageNo);
        setVisible(false);
        props.reloadSummary();
      });
    }

    if (type === 'edit') {
      const { id } = submitConfig;
      return updateSourcePool(id as any, {
        type: TYPE,
        name: submitConfig.name,
        data: {
          kubeConfig: submitConfig.kubeConfig,
        },
      }).then(() => {
        reqSourcePoolList(pageNo);
        setVisible(false);
      });
    }
    return;
  };

  const handleImportCluster = () => {
    setType('add');
    setConfig({
      id: 0,
      name: '',
      kubeConfig: '~/.kube/config',
    });
    setVisible(true);
  };

  const handleChangeCurrPage = (e: any) => {
    setPageNo(e);
  };

  useEffect(() => {
    reqSourcePoolList(1);
  }, []);

  return (
    <>
      <div className={styles['k8s-table-container']}>
        <div className={styles['header']}>
          <span className={styles['title']}>Kubenetes集群</span>
          <Button type="primary" onClick={handleImportCluster}>
            导入集群
          </Button>
        </div>
        <Table
          rowKey="id"
          size="small"
          loading={loading}
          bordered={true}
          columns={columns({
            editSource,
            deleteSource,
          })}
          dataSource={data}
          pagination={{
            position: ['bottomRight'],
            size: 'small',
            current: pageNo,
            pageSize: 10,
            total: totalRows,
            showSizeChanger: false,
            onChange: handleChangeCurrPage,
          }}
        />
      </div>
      <ClusterModal
        visible={visible}
        type={type}
        config={config}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      ></ClusterModal>
    </>
  );
};

export default K8STable;
