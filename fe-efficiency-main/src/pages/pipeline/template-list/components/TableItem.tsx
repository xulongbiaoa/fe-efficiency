import type { ProColumns } from '@ant-design/pro-table';

import { Button, message, Modal, Space } from 'antd';

import ProTable from '@ant-design/pro-table';

import type { TableListPagination } from '@/datas/data';

import styles from './../index.module.less';
import { getTemplate, delTemplate } from '@/services/pipeline/tempalte-list';
import { history } from 'umi';
import { useRef } from 'react';
import { PIPELINE_MODE } from '../../enum';

const PieplineStruct = (props: { str: string }) => {
  const pipelineObj = JSON.parse(props.str);
  const stages = pipelineObj?.stages || [];
  if (stages.length === 0) return <div>暂无信息</div>;
  const nodes: string[] = [];
  stages.forEach((stage: any) => nodes.push(stage.name));
  return (
    <div style={{ position: 'relative', display: 'flex', width: 'fit-content' }}>
      <Space style={{ zIndex: 1 }}>
        {nodes.map((node) => {
          return (
            <div
              key={node}
              style={{
                padding: '2px 8px',
                border: '1px solid #0984f9',
                background: '#fff',
                borderRadius: 15,
                fontSize: 12,
              }}
            >
              {node}
            </div>
          );
        })}
      </Space>
      <div
        style={{
          position: 'absolute',
          top: 12,
          zIndex: 0,
          width: '100%',
          height: 1,
          background: '#0984f9',
        }}
      />
    </div>
  );
};

const TableItem: React.FC = ({}) => {
  const tableRef: any = useRef();
  const handleDelTempalte = async (ids: number[]) => {
    try {
      const res = await delTemplate(ids);
      if (res.success) {
        message.success('操作成功');
        tableRef.current?.reload();
      }
    } catch (error) {}
  };
  const columns: ProColumns<any>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      width: 60,
      hideInSearch: true,
      render: (id: any) => {
        return <div>{id}</div>;
      },
    },
    {
      title: '搜索',
      dataIndex: 'search',
      width: 100,
      hideInTable: true,
      fieldProps: {
        placeholder: '请输入分类名或者模版名搜索',
      },
    },
    {
      title: '模版名',
      dataIndex: 'name',
      width: 200,
      hideInSearch: true,
      render: (pipelineName, record) => {
        return (
          <Button
            style={{ paddingLeft: 0 }}
            type="link"
            href={`/pipeline/edit?templateId=${record.id}&mode=${PIPELINE_MODE.EDIT_TEMPLATE}`}
            className={styles['column-name']}
          >
            {pipelineName}
          </Button>
        );
      },
    },
    {
      title: '分类名',
      width: 100,

      dataIndex: 'category',
      hideInSearch: true,
    },
    {
      title: '阶段信息',
      dataIndex: 'pipelineStruct',
      hideInSearch: true,
      render: (runResultTopo: any) => {
        if (!runResultTopo) {
          return '-';
        }

        return <PieplineStruct str={runResultTopo} />;
      },
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 150,
      align: 'center',
      render: (_, record) => {
        return [
          <Button
            key="edit"
            type="link"
            href={`/pipeline/edit?templateId=${record.id}&mode=${PIPELINE_MODE.EDIT_TEMPLATE}`}
          >
            编辑
          </Button>,
          <Button
            key="delete"
            type="link"
            onClick={() => {
              Modal.confirm({
                title: '是否确认删除该模版',
                onOk: () => {
                  handleDelTempalte([record.id]);
                },
              });
            }}
          >
            删除
          </Button>,
        ];
      },
    },
  ];

  return (
    <>
      <ProTable<any, TableListPagination>
        headerTitle="查询表格"
        rowKey="id"
        className={styles.table}
        actionRef={(ref: any) => {
          tableRef.current = ref;
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              history.push(`/pipeline/edit?mode=${PIPELINE_MODE.CREATE_TEMPLATE}`);
            }}
          >
            新建模板
          </Button>,
        ]}
        request={getTemplate}
        pagination={{
          pageSize: 10,
        }}
        columns={columns}
      />
    </>
  );
};

export default TableItem;
