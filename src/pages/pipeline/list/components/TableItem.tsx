import {
  addCollectPipeline,
  delCollectPipeline,
  deletePipelines,
  getConfigVar,
  getPipelineList,
  pipelinesGroup,
  runPipeline,
  copyPipeline,
  getDict,
  getCollectPipeline,
} from '@/services/pipeline/list';
import {
  EditOutlined,
  DeleteOutlined,
  DragOutlined,
  PlayCircleOutlined,
  CopyOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import type { IDict } from '@/services/pipeline/list';

import {
  Button,
  Card,
  Dropdown,
  Menu,
  message,
  Popover,
  Select,
  Steps,
  Rate,
  Tag,
  Tooltip,
  Typography,
  Modal,
} from 'antd';
import { useEffect, useState } from 'react';

import RunModal from './optionModal/runVarModal';
import PipelineModal from './optionModal/pipelineModal';

import ProTable from '@ant-design/pro-table';

import type { TableListPagination } from '@/datas/data';

import styles from './../index.module.less';
import { useHistory } from 'react-router';
import { PIPELINE_MODE } from '../../enum';

const { confirm } = Modal;

interface IProps {
  activeKey: string;
  selectedGroup: any;
  newActiveKey?: string;
  setLoading: (loading: boolean) => void;
  setselectedGroup: (group: any) => void;
  handleSelectChange: any;
  loading: boolean;
  actionRef: any;
  group: any;
  groupName: string;
}

const TableItem: React.FC<IProps> = ({
  activeKey,
  selectedGroup,
  newActiveKey,
  setLoading,
  setselectedGroup,
  loading,
  actionRef,
  group,
  handleSelectChange,
  groupName,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [varModalDis, setVarModalDis] = useState<boolean>(false);
  const [pipelineModalDis, setPipelineModalDis] = useState(false);
  const [currentId, setCurrentId] = useState<number[]>([]);

  const [pipelineVar, setPipelineVar] = useState<null | object>(null);
  const [runType, setRuntype] = useState<'one' | 'more'>('one');
  const key = newActiveKey === undefined ? activeKey : newActiveKey;
  const types = ['MY', 'COLLECT', 'GROUP'];
  const { Text } = Typography;
  const [dicts, setDicts] = useState<Partial<IDict>>({});
  const [collect, setCollect] = useState<any[]>([]);
  const history = useHistory();
  const params: any = {
    type: types[Number(key) < 0 ? (key === '-1' ? '1' : '0') : 2],
    ...(Number(activeKey) >= 0
      ? {
          groupId: group.filter((item: any) => {
            return item.dictName === groupName;
          })[0]?.id,
        }
      : {}),
  };

  if (newActiveKey !== undefined) {
    params.groupId = selectedGroup.key;
  }
  const handleGetDict = async () => {
    try {
      const res = await getDict();
      if (res.success) {
        setDicts(res.data);
      }
    } catch (error) {}
  };
  const handleGetCollect = async () => {
    try {
      const res = await getCollectPipeline();
      if (res.success) {
        setCollect(res.data.rows);
      }
    } catch (error) {}
  };

  const handleMoveGroup = async (record?: any) => {
    try {
      setLoading(true);
      const res = await pipelinesGroup({
        groupId: Number(selectedGroup.key),
        ids: record?.id ? [record.id] : selectedRowKeys,
      });
      if (res.success) {
        message.success('操作成功');
        actionRef.current?.reload();
        if (!record.id) {
          setselectedGroup(null);
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handlePlayCircle = async (id: number) => {
    try {
      setRuntype('one');
      setCurrentId([id]);
      const res = await getConfigVar({ id });
      if (res.success) {
        setPipelineVar(res.data);
        setVarModalDis(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMenuClick = async (item: any, record: any) => {
    try {
      let res: any;
      switch (item.key) {
        case 'edit':
          history.push('/pipeline/edit?mode=edit_pipeline&pipelineId=' + record.id);
          break;
        case 'copy':
          res = await copyPipeline({ id: record.id });
          break;
        case 'delete':
          confirm({
            title: '确认要删除吗',
            okText: '确认删除',
            cancelText: '取消',
            okButtonProps: { loading },
            onOk: async () => {
              try {
                setLoading(true);
                res = await deletePipelines([record.id]);
                setLoading(false);
                if (res.success) {
                  message.success('操作成功');
                  actionRef.current?.reload();
                }
              } catch (error) {
                setLoading(false);
              }
            },
          });
          break;
      }

      if (res.success) {
        message.success('操作成功');
        actionRef.current?.reload();
      }
    } catch (error) {}
  };
  const handleCollect = async (value: number, id: number) => {
    try {
      let res;
      if (value !== 0) {
        res = await addCollectPipeline([id]);
        if (res.success) {
          message.success('收藏成功');
          handleGetCollect();
          actionRef.current?.reload();
        }
      } else {
        res = await delCollectPipeline([id]);
        if (res.success) {
          message.success('取消收藏成功');
          handleGetCollect();
          actionRef.current?.reload();
        }
      }
    } catch (error) {}
  };

  const menuList = (record: any) => {
    const moveGroup = () => {
      return (
        <Card title="请选择目标组" style={{ backgroundColor: '#fff' }}>
          <div>分组名称</div>
          <Select
            value={selectedGroup}
            onChange={handleSelectChange}
            style={{ width: '180px' }}
            allowClear
          >
            {group.map((item: any) => {
              return (
                <Select.Option key={item.id} value={item.id}>
                  {item.dictName}
                </Select.Option>
              );
            })}
          </Select>
          <Menu>
            <Button
              type="primary"
              style={{ marginTop: 20, width: '100%' }}
              disabled={!selectedGroup?.key}
              loading={loading}
              onClick={() => handleMoveGroup(record)}
            >
              <Menu.Item
                style={{
                  backgroundColor: 'transparent',
                  padding: 0,
                  color: selectedGroup?.key ? '#fff' : '#000',
                }}
              >
                确定
              </Menu.Item>
            </Button>
          </Menu>
        </Card>
      );
    };
    return (
      <Menu onClick={(item: any) => handleMenuClick(item, record)}>
        <Menu.Item key="edit">
          <EditOutlined /> 编辑
        </Menu.Item>
        <Menu.Item key="move">
          <Dropdown
            onVisibleChange={() => {
              setselectedGroup(null);
              setLoading(false);
            }}
            overlay={() => moveGroup()}
            trigger={'click' as any}
          >
            <div>
              <DragOutlined /> 移动分组
            </div>
          </Dropdown>
        </Menu.Item>

        <Menu.Item key="copy">
          <CopyOutlined /> 复制流水线
        </Menu.Item>
        <Menu.Item key="delete">
          <DeleteOutlined /> 删除
        </Menu.Item>
      </Menu>
    );
  };

  const customDot: any = (dot: any, {}, runStatus: any) => {
    return <Popover content={<span>{runStatus}</span>}>{dot}</Popover>;
  };
  const columns: ProColumns<any>[] = [
    { title: 'id', dataIndex: 'id', width: 50, hideInSearch: true },
    {
      title: '名称',
      dataIndex: 'pipelineName',
      width: 150,
      render: (pipelineName, record) => {
        return (
          <Button
            style={{ paddingLeft: 0 }}
            type="link"
            href={`/pipeline/detail?pipelineId=${record.id}&lastRunLogId=${record.lastRunLogId}`}
          >
            <Text
              style={{ width: 150, textAlign: 'left', color: 'inherit' }}
              ellipsis={{ tooltip: pipelineName }}
            >
              {pipelineName}
            </Text>
          </Button>
        );
      },
    },
    {
      width: 150,
      title: '标签',
      dataIndex: 'pipelineTags',
      hideInSearch: true,
      render: (flowTags: any, record: any) => {
        if (record.pipelineTags.trim().length === 0) {
          return '-';
        }
        return flowTags.split(',').map((item: any) => {
          return (
            <Tag
              key={item}
              style={{ marginBottom: '5px', minWidth: 30, padding: '2px', textAlign: 'center' }}
            >
              {item}
            </Tag>
          );
        });
      },
    },
    {
      width: 120,
      title: '运行环境',
      dataIndex: 'pipelineEnv',
      hideInSearch: true,
      render: (flowEnv: any) => {
        const env = dicts.PIPELINE_RUN_ENV_DICT?.filter((item) => item.key === flowEnv)[0]?.name;
        return env;
      },
    },
    {
      width: 160,
      title: '最近运行状态',
      dataIndex: 'lastRunNum',
      hideInSearch: true,
      render: (lastRunNum: any, record: any) => {
        return (
          <>
            <Tooltip title={record?.lastRunResultRemark}>
              {lastRunNum +
                ' - ' +
                (dicts.RUN_STATUS_DICT?.filter((item) => {
                  return item.key === record.lastRunStatus;
                })[0]?.name || '')}
            </Tooltip>
          </>
        );
      },
    },
    {
      title: '最近运行阶段',
      width: 320,
      dataIndex: 'runResultTopo',
      hideInSearch: true,
      className: styles.stepContiner,
      render: (runResultTopo: any) => {
        if (JSON.parse(runResultTopo).length === 0) {
          return '-';
        }

        const renderStages = JSON.parse(runResultTopo)?.map((item: any, index: number) => {
          let status;
          switch (item.runStatus) {
            case 'INIT':
              status = 'wait';
              break;
            case 'SUCCESS':
              status = 'finish';
              break;
            case 'FAIL':
              status = 'error';
              break;
            case 'IN_PROGRESS':
              status = 'process';
              break;
            default:
              status = 'process';
              break;
          }

          return (
            <Steps.Step
              progressDot={(dot, param) =>
                customDot(
                  dot,
                  param,
                  dicts.RUN_STATUS_DICT?.filter((statusItem: any) => {
                    return statusItem.key === item.runStatus;
                  })[0]?.name || '',
                )
              }
              key={index}
              title={item.name}
              status={status as any}
            />
          );
        });
        return (
          <div style={{ width: 200 }} className={styles.steps}>
            <Steps progressDot size="small">
              {renderStages}
            </Steps>
          </div>
        );
      },
    },
    { width: 200, title: '触发信息', dataIndex: 'lastTriggerDesc', hideInSearch: true },
    {
      width: 150,
      title: '最近运行时间',
      dataIndex: 'lastRunTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 100,
      render: (_, record) => {
        return [
          <Rate
            key="collect"
            count={1}
            tooltips={[!collect.includes(record.id) ? '收藏' : '取消收藏']}
            value={collect.includes(record.id) ? 1 : 0}
            onChange={(value: number) => handleCollect(value, record.id)}
            style={{ marginTop: -10 }}
          />,
          <PlayCircleOutlined
            onClick={() => handlePlayCircle(record.id)}
            style={{ cursor: 'pointer' }}
            key="play"
          />,
          <Dropdown
            key="more"
            placement="top"
            overlay={() => {
              return menuList(record);
            }}
          >
            <EllipsisOutlined style={{ cursor: 'pointer' }} />
          </Dropdown>,
          ,
        ];
      },
    },
  ];

  const url = getPipelineList(params);

  const batchDelete = async () => {
    try {
      const res = await deletePipelines(selectedRowKeys);
      if (res?.success) {
        message.success('操作成功');
        setSelectedRowKeys([]);
        actionRef.current?.reload();
      }
    } catch (error) {}
  };

  const handleCancelRun = () => {
    setPipelineVar(null);
    setVarModalDis(false);
    setLoading(false);
  };
  const handleRun = async (param: any) => {
    try {
      setLoading(true);
      const res = await runPipeline(param);
      if (res.success) {
        message.success('运行成功');
        setVarModalDis(false);
        actionRef.current?.reload();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const moveGroup = (record?: any) => {
    return (
      <Card title="请选择目标组" style={{ backgroundColor: '#fff' }}>
        <div>分组名称</div>
        <Select
          value={selectedGroup}
          onChange={handleSelectChange}
          style={{ width: '180px' }}
          allowClear
        >
          {group.map((item: any) => {
            return (
              <Select.Option key={item.id} value={item.id}>
                {item.dictName}
              </Select.Option>
            );
          })}
        </Select>
        <Menu>
          <Button
            type="primary"
            style={{ marginTop: 20, width: '100%' }}
            disabled={!selectedGroup?.key}
            loading={loading}
            onClick={() => handleMoveGroup(record)}
          >
            <Menu.Item
              style={{
                backgroundColor: 'transparent',
                padding: 0,
                color: selectedGroup?.key ? '#fff' : '#000',
              }}
            >
              确定
            </Menu.Item>
          </Button>
        </Menu>
      </Card>
    );
  };
  const handleCancelPipeline = () => {
    setPipelineModalDis(false);
    setLoading(false);
  };
  const handleCreatePipline = async (id?: number) => {
    try {
      history.push(`/pipeline/edit?templateId=${id}&mode=${PIPELINE_MODE.CREATE_PIPELINE}`);
      setPipelineModalDis(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const handleGetTemplate = async () => {
    try {
      setPipelineModalDis(true);
    } catch (error) {}
  };
  useEffect(() => {
    handleGetDict();
    handleGetCollect();
  }, []);

  return (
    <>
      <ProTable<any, TableListPagination>
        headerTitle="查询表格"
        rowKey="id"
        className={styles.table}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={handleGetTemplate}>
            新建流水线
          </Button>,
        ]}
        actionRef={actionRef}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onSelect: (record, selected) => {
            let arr = [];
            if (selected) {
              arr = Array.from(new Set([...selectedRowKeys, record.id]));
            } else {
              // 如果未选中,删除这一项数据
              arr = selectedRowKeys.filter((item) => {
                return item !== record.id;
              });
            }

            setSelectedRowKeys(arr as any);
          },
          onSelectAll: (seleted, record) => {
            const idList = record
              .filter((item) => {
                return item;
              })
              .map((item) => item.id);
            if (seleted) {
              setSelectedRowKeys(Array.from(new Set([...selectedRowKeys, ...idList])) as any);
            } else {
              setSelectedRowKeys(
                selectedRowKeys.filter((id) => {
                  return idList.includes(id);
                }),
              );
            }
          },
        }}
        tableAlertOptionRender={() => {
          return [
            <Button
              type="link"
              key={'run'}
              onClick={() => {
                setRuntype('more');
                setVarModalDis(true);
              }}
            >
              <PlayCircleOutlined />
              运行
            </Button>,
            <Button
              type="link"
              key={'delete'}
              danger
              onClick={() => {
                confirm({
                  title: '确认要删除吗',
                  okText: '确认删除',
                  cancelText: '取消',
                  okButtonProps: { loading },
                  onOk: batchDelete,
                });
              }}
            >
              <DeleteOutlined />
              删除
            </Button>,
            <Dropdown
              key={'move'}
              onVisibleChange={() => {
                setselectedGroup(null);
                setLoading(false);
              }}
              overlay={moveGroup}
              trigger={'click' as any}
            >
              <Button type="link">
                <DragOutlined />
                移动分组
              </Button>
            </Dropdown>,
          ];
        }}
        request={url}
        pagination={{
          pageSize: 10,
        }}
        columns={columns}
      />
      <RunModal
        runType={runType}
        key="modal"
        ids={runType === 'one' ? currentId : selectedRowKeys}
        loading={loading}
        modalVisible={varModalDis}
        pipelineVar={pipelineVar}
        onClose={handleCancelRun}
        onOk={handleRun}
      />

      <PipelineModal
        modalVisible={pipelineModalDis}
        onClose={handleCancelPipeline}
        onOk={handleCreatePipline}
      />
    </>
  );
};

export default TableItem;
