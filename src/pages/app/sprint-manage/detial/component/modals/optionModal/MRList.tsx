import { Modal, Button } from 'antd';
import React from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import styles from './../../../index.module.less';
import type { TableListPagination } from '@/datas/data';

interface IGroupModal {
  loading?: boolean;
  modalVisible: boolean;

  onClose: () => void;
}
const MrListModal: React.FC<IGroupModal> = ({ loading, modalVisible = true, onClose }) => {
  const columns: ProColumns<any>[] = [
    { title: 'ID', dataIndex: 'id', width: 50, align: 'center' },
    {
      title: '源分支',
      dataIndex: 'name',
      hideInSearch: true,
      width: 120,
      render: (name) => {
        return (
          <Button style={{ paddingLeft: 0 }} type="link" href={``}>
            {name}
          </Button>
        );
      },
    },
    {
      width: 120,
      title: '源版本',
      dataIndex: 'branch',
    },
    {
      width: 120,
      title: '目标版本',
      dataIndex: 'status',
      render: (status: any) => {
        return status;
      },
    },

    {
      title: '提交人',
      width: 120,
      dataIndex: 'owner',
      hideInSearch: true,
      render: (owner: any) => {
        return { owner };
      },
    },
    {
      title: '提交信息',
      dataIndex: 'option',
      valueType: 'option',
      width: 100,
      render: () => {
        return [];
      },
    },
    {
      title: '提交时间',
      dataIndex: 'option',
      valueType: 'option',
      width: 100,
      render: () => {
        return [];
      },
    },
    {
      title: '状态',
      dataIndex: 'option',
      valueType: 'option',
      width: 100,
      render: () => {
        return [];
      },
    },
  ];

  return modalVisible ? (
    <Modal
      width={800}
      visible={true}
      title={'MR列表'}
      okButtonProps={{ loading }}
      onCancel={onClose}
      footer={false}
      className={styles.MRList}
    >
      <ProTable<any, TableListPagination>
        request={() => [] as any}
        rowKey="id"
        bordered
        showSorterTooltip={false}
        pagination={{
          pageSize: 10,
        }}
        toolBarRender={false}
        search={false}
        columns={columns}
      />
    </Modal>
  ) : null;
};
export default MrListModal;
