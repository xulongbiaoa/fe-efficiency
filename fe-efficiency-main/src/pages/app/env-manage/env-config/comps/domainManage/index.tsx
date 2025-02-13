import {
  getDomainList,
  createDomain,
  deleteDomain,
  enableDomain,
  restoreDomain,
  updateDomain,
  getDomainStatusType,
} from '@/services/domain';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Badge, Button, Card, message, Modal, Space } from 'antd';
import { useMemo, useState, useRef, useEffect } from 'react';
import type { TableListPagination } from '@/datas/data';
import CreateSprintModal from './component/optionModal/createModal';
import OrderModal from './component/optionModal/orderModal';

import { setUrlWithoutFreshBrowser, delUrlParamsWithoutFreshBrowser } from '@/utils/index';

const TableItem: React.FC<{
  currEnvId: number;
  type: string;
  title: string;
}> = ({ currEnvId }) => {
  const [modalDis, setModalDis] = useState<'none' | 'create' | 'order'>('none');
  const [currentDomain, setCurrentDomain] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [domainStatus, setDomainStatus] = useState<any[]>([]);
  const actionRef = useRef<any>();
  const formRef = useRef<any>();

  const handleGetDomainStatusType = async () => {
    try {
      const res = await getDomainStatusType();
      if (res.success) {
        setDomainStatus(res?.data?.zone_status || []);
      }
    } catch (error) {}
  };

  const handleDeleteDomain = async (id: number) => {
    try {
      const res = await deleteDomain(id);
      if (res.success) {
        message.success('删除成功');
        actionRef.current?.reload();
      }
    } catch (error) {}
  };
  const handleEnabledDomain = async (id: number, isEnable: number) => {
    try {
      const res = await enableDomain(id, isEnable);
      if (res.success) {
        message.success('操作成功');
        actionRef.current?.reload();
      }
    } catch (error) {}
  };
  const handleRestoreDomain = async (id: number) => {
    try {
      const res = await restoreDomain(id);
      if (res.success) {
        message.success('操作成功');
        actionRef.current?.reload();
      }
    } catch (error) {}
  };

  const columns: ProColumns<any>[] = [
    { title: 'ID', dataIndex: 'id', hideInSearch: true, width: 50 },
    {
      title: '名称',
      dataIndex: 'name',
      hideInSearch: true,
      render: (_, record) => {
        if (record?.envIdent?.includes('online')) {
          return `${record?.name}${record?.feIdent == 2 ? '.api' : ''}.${
            record?.networkSegmentName
          }`;
        }
        return `${record?.name}-${record?.envIdent}${record?.feIdent == 2 ? '.api' : ''}.${
          record?.networkSegmentName
        }`;
      },
    },

    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      valueEnum: domainStatus?.reduce((acc, cur) => {
        acc[cur.key] = cur.name;
        return acc;
      }, {}),
    },

    {
      title: 'TTL(s)',
      dataIndex: 'ttl',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '描述',
      dataIndex: 'description',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '审核人',
      dataIndex: 'approvalUname',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (_, record) => {
        return (
          <Space>
            <Button
              style={{ marginRight: 0, marginLeft: 0, padding: 0 }}
              type="link"
              onClick={() => {
                setCurrentDomain(record);
                setModalDis('order');
              }}
            >
              {record?.orderStatus === 0 && <Badge status="processing" />}
              {record?.orderStatus === 2 && <Badge status="error" />}
              工单
            </Button>
            {record.status == 1 && (
              <Button
                style={{ marginRight: 0, marginLeft: 0, padding: 0 }}
                type="link"
                onClick={() => {
                  Modal.confirm({
                    title: '确认要禁用该域名吗？',
                    content: '审核成功后，域名将会被禁用。',
                    onOk: () => handleEnabledDomain(record.id, 2),
                  });
                }}
              >
                禁用
              </Button>
            )}
            {record.status == 2 && (
              <Button
                style={{ marginRight: 0, marginLeft: 0, padding: 0 }}
                type="link"
                onClick={() => {
                  Modal.confirm({
                    title: '确认要启用该域名吗？',
                    content: '审核成功后，域名将会被启用。',
                    onOk: () => handleEnabledDomain(record.id, 1),
                  });
                }}
              >
                启用
              </Button>
            )}
            {record.status == 3 && (
              <Button
                style={{ marginRight: 0, marginLeft: 0, padding: 0 }}
                type="link"
                onClick={() => {
                  Modal.confirm({
                    title: '确认要恢复该域名吗？',
                    content: '审核成功后，域名将会恢复。',
                    onOk: () => handleRestoreDomain(record.id),
                  });
                }}
              >
                恢复
              </Button>
            )}
            {record?.orderStatus != 0 && (
              <Button
                style={{ marginRight: 0, marginLeft: 0, padding: 0 }}
                type="link"
                onClick={() => {
                  Modal.confirm({
                    title: '确认要删除该域名吗？',
                    content: '审核成功后，域名将保留两天后删除。',
                    onOk: () => handleDeleteDomain(record.id),
                  });
                }}
              >
                删除
              </Button>
            )}
            {record?.orderStatus != 0 && (
              <Button
                style={{ marginRight: 0, marginLeft: 0, padding: 0 }}
                type="link"
                onClick={() => {
                  setCurrentDomain(record);
                  setModalDis('create');
                }}
              >
                修改
              </Button>
            )}
          </Space>
        );
      },
    },
  ];
  const url = useMemo(() => {
    return getDomainList(currEnvId);
  }, [currEnvId]);

  const handleCreateDomain = async (data: any) => {
    try {
      data.envId = currEnvId;
      let res;
      setLoading(true);
      if (currentDomain?.id) {
        res = await updateDomain(currentDomain?.id, data);
      } else {
        res = await createDomain(data);
      }

      if (res.success) {
        message.success('操作成功');
        setModalDis('none');
        actionRef.current?.reload();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetDomainStatusType();
  }, []);
  useEffect(() => {
    actionRef.current?.reload();
  }, [currEnvId]);

  return (
    <Card bordered={false}>
      <ProTable<any, TableListPagination>
        search={false}
        request={url as any}
        rowKey="id"
        showSorterTooltip={false}
        actionRef={actionRef}
        formRef={formRef}
        pagination={{
          pageSize: 10,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setModalDis('create');
            }}
          >
            新增
          </Button>,
        ]}
        columns={columns}
        onSubmit={(params) => {
          delUrlParamsWithoutFreshBrowser(['search', 'status']);
          setUrlWithoutFreshBrowser(params);
        }}
        onReset={() => {
          delUrlParamsWithoutFreshBrowser(['search', 'status']);
          formRef.current.setFieldsValue({ search: undefined, status: undefined });
          formRef.current.submit();
        }}
      />

      <CreateSprintModal
        currentEnv={currEnvId}
        modalVisible={modalDis === 'create'}
        onClose={() => {
          setModalDis('none');
          setLoading(false);
          setCurrentDomain(null);
        }}
        onOk={handleCreateDomain}
        loading={loading}
        currentDomain={currentDomain}
      />
      <OrderModal
        zoneId={currentDomain?.id}
        orderId={currentDomain?.orderId}
        loading={loading}
        approvalUid={currentDomain?.approvalUid}
        modalVisible={modalDis === 'order'}
        onClose={() => {
          setModalDis('none');
          setCurrentDomain(null);
          setLoading(false);
          actionRef.current?.reload();
        }}
      />
    </Card>
  );
};

export default TableItem;
