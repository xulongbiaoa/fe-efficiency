import { getSprintList, createSprint, deleteSprint } from '@/services/app/sprint-manage';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Card, Tabs, Typography, message, Modal, Tag, Space, Input } from 'antd';
import { useMemo, useState, useRef, useEffect } from 'react';
import type { TableListPagination } from '@/datas/data';
import CreateSprintModal from './component/optionModal/createModal';
import type { MouseEvent } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { useModel, history } from 'umi';
import { setUrlWithoutFreshBrowser, delUrlParamsWithoutFreshBrowser } from '@/utils/index';
import { updateSprint } from '@/services/app/sprint-detial';
const { Text } = Typography;
const TableItem: React.FC<{
  currAppId: number;
  setCurrSprintId: (id?: number, name?: string) => void;
}> = ({ currAppId, setCurrSprintId }) => {
  const [currentTag, setCurrentTag] = useState<string>('0');

  const [createModalDis, setCreateModalDis] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const actionRef = useRef<any>();
  const formRef = useRef<any>();
  const { devMode } = history.location.query as any;
  const {
    initialState: { currentUser },
  }: any = useModel('@@initialState');

  const handleDeleteSprint = async (e: MouseEvent, id: number) => {
    try {
      const res = await deleteSprint(id);
      if (res.success) {
        message.success('删除成功');
        actionRef.current?.reload();
        setCurrSprintId(undefined, undefined);
      }
    } catch (error) {}
  };
  const RenderText = (props: { text: string; onChange: (params: string) => void }) => {
    const [name, setName] = useState(props.text);
    const [edit, setEdit] = useState(false);
    const handleNameChange = (e: any) => {
      setName(e.target.value);
    };

    const handleSave = () => {
      if (!name) {
        message.error('名称不可为空');
        return;
      }
      if (name !== props.text) {
        props.onChange(name);
      }
      setEdit(false);
    };

    const handleCancel = () => {
      setName(props.text);
      setEdit(false);
    };

    const renderStatic = () => {
      return (
        <Space>
          <Text ellipsis>{name}</Text>
          <Button type="link" onClick={() => setEdit(true)}>
            <EditOutlined />
          </Button>
        </Space>
      );
    };
    const renderEdit = () => {
      return (
        <Space>
          <Input value={name} onChange={handleNameChange} allowClear />
          <Button type="link" onClick={handleSave}>
            保存
          </Button>
          <span
            style={{ marginLeft: '-15px', cursor: 'pointer', color: '#999' }}
            onClick={handleCancel}
          >
            取消
          </span>
        </Space>
      );
    };
    return <Space>{edit ? renderEdit() : renderStatic()}</Space>;
  };
  const handleEdit = async (id: number, data: any) => {
    try {
      const res = await updateSprint(id, data);
      if (res.success) {
        message.success('操作成功');
        actionRef.current?.reload();
      }
    } catch (error) {}
  };
  const columns: ProColumns<any>[] = [
    { title: 'ID', dataIndex: 'id', hideInSearch: true },
    {
      title: 'id或名称',
      dataIndex: 'search',
      hideInTable: true,
      initialValue: history.location.query?.search,
    },
    {
      title: '名称',
      dataIndex: 'name',
      hideInSearch: true,
      width: 300,
      render: (name: any, record: any) => {
        return (
          <RenderText
            text={name}
            onChange={(sprintName: any) => {
              handleEdit(record.id, { name: sprintName });
            }}
          />
        );
      },
    },
    {
      title: '版本',
      dataIndex: 'version',
      hideInSearch: true,
      hideInTable: devMode !== '20',
      width: 80,
      // render: (name: any, record: any) => {
      //   return (
      //     <RenderText
      //       text={name}
      //       onChange={(sprintName: any) => {
      //         handleEdit(record.id, { name: sprintName });
      //       }}
      //     />
      //   );
      // },
    },
    // {
    //   width: 150,
    //   title: '分支',
    //   dataIndex: 'branch',
    //   hideInSearch: true,
    // },
    {
      title: '状态',
      dataIndex: 'status',
      initialValue: history.location.query?.status,
      valueEnum: {
        0: '未开始',
        1: '进行中',
        2: '已结束',
        3: '已关闭',
      },
      render: (_, record) => {
        const mapColors = [
          { color: 'default', text: '未开始' },
          { color: 'processing', text: '进行中' },
          { color: 'success', text: '已结束' },
          { color: 'rgba(169,169,169,0.9)', text: '已关闭' },
        ];
        if (record.status !== undefined) {
          return (
            <Tag color={mapColors[record.status]?.color}>{mapColors[record.status]?.text}</Tag>
          );
        }
        return '-';
      },
    },

    {
      title: '主研发',
      dataIndex: 'owner',
      hideInSearch: true,
      width: 100,
      render: (owner: any) => {
        return owner?.name || '-';
      },
    },
    {
      title: '研发成员',
      dataIndex: 'members',
      hideInSearch: true,

      render: (members: any) => {
        if (Array.isArray(members)) {
          return (
            <div>
              {members
                ?.map((item: any) => {
                  return item.name;
                })
                .join(',')}
            </div>
          );
        }
        return '-';
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      width: 100,
      render: (_, record) => {
        return [
          <Button
            key="view"
            style={{ marginRight: 10 }}
            type="link"
            onClick={() => {
              setCurrSprintId(record.id);
              history.push(
                `/app-manage/sprint-manage/sprint-detial${location.search}&sprintId=${record.id}`,
              );
            }}
          >
            迭代详情
          </Button>,
          <Button
            key="delete"
            type="link"
            onClick={(e) => {
              Modal.confirm({
                content: '确认删除该迭代吗？',
                onOk: () => handleDeleteSprint(e, record.id),
              });
            }}
          >
            删除迭代
          </Button>,
        ];
      },
    },
  ];
  const url = useMemo(() => {
    return getSprintList(currAppId, { scope: Number(currentTag) });
  }, [currAppId, currentTag]);

  const handleCreateSprint = async (data: any) => {
    try {
      setLoading(true);
      const res = await createSprint(currAppId, data);
      if (res.success) {
        message.success('操作成功');
        await setCurrSprintId(res.data.id);
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

  useEffect(() => {
    actionRef.current?.reload();
  }, [currAppId]);

  useEffect(() => {
    const { tab } = history.location.query as any;
    if (tab) {
      setCurrentTag(history.location.query?.tab as string);
    }
  }, []);

  return (
    <Card>
      <Tabs
        activeKey={currentTag as any}
        onChange={(key) => {
          setCurrentTag(key as any);
          delUrlParamsWithoutFreshBrowser(['search', 'status']);
          setUrlWithoutFreshBrowser({ tab: key });
        }}
      >
        <Tabs.TabPane tab="我创建的" key={0}>
          {currentTag == '0' && (
            <ProTable<any, TableListPagination>
              request={url}
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
                    setCreateModalDis(true);
                  }}
                >
                  创建迭代
                </Button>,
              ]}
              columns={columns}
              search={{ defaultCollapsed: false }}
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
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="我负责的" key={1}>
          {currentTag == '1' && (
            <ProTable<any, TableListPagination>
              request={url}
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
                    setCreateModalDis(true);
                  }}
                >
                  创建迭代
                </Button>,
              ]}
              search={{ defaultCollapsed: false }}
              columns={columns}
              onSubmit={(params) => {
                delUrlParamsWithoutFreshBrowser(['search', 'status']);
                setUrlWithoutFreshBrowser(params);
              }}
              onReset={() => {
                delUrlParamsWithoutFreshBrowser(['search', 'status']);
                actionRef.current?.reloadAndRest();
              }}
            />
          )}
        </Tabs.TabPane>
      </Tabs>
      <CreateSprintModal
        modalVisible={createModalDis}
        onClose={() => {
          setCreateModalDis(false);
          setLoading(false);
        }}
        onOk={handleCreateSprint}
        loading={loading}
        currentUser={currentUser}
      />
    </Card>
  );
};

export default TableItem;
