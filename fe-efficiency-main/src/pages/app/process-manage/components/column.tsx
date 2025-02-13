import { useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Space, Switch, Input, Button, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

export type ColumnDataType = {
  id: number;
  stageId: number; // 阶段ID
  name: string; // 关联命名
  pipelineTplId: number; // 流水线模板ID
  pipelineInstId: number; // 流水线实例ID
  pipelineStruct: any; // 流水线 结构
  defMark: number; //默认流水线
};

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

type CloumnsPropsType = {
  handleChangeName: (name: string, record: ColumnDataType) => void;
  hanleSwitchChange: (e: any, record: ColumnDataType) => void;
  handleDeletePipeline: (record: ColumnDataType) => void;
  handleCheckDetail: (record: ColumnDataType) => void;
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
        <div>{name}</div>
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

const cloumns = (props: CloumnsPropsType): ColumnsType<ColumnDataType> => [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 50,
    render: (text) => <div className="column-name">{text}</div>,
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <div className="column-name">
        <RenderText
          text={text}
          onChange={(newText) => {
            props.handleChangeName(newText, record);
          }}
        />
      </div>
    ),
  },
  {
    title: '概览',
    dataIndex: 'pipelineStruct',
    key: 'pipelineStruct',
    render: (text) => (
      <div className="column-name">
        <PieplineStruct str={text} />
      </div>
    ),
  },
  {
    title: '是否默认',
    key: 'defMark',
    dataIndex: 'defMark',
    render: (text, record) => (
      <div className="column-name">
        <Switch checked={Boolean(text)} onChange={(e) => props.hanleSwitchChange(e, record)} />
      </div>
    ),
  },
  {
    title: '操作',
    dataIndex: 'Action',
    key: 'action',
    fixed: 'right',
    width: 100,
    render: (text, record) => {
      return (
        <Space>
          <a onClick={() => props.handleCheckDetail(record)}>详情</a>
          <a onClick={() => props.handleDeletePipeline(record)}>删除</a>
        </Space>
      );
    },
  },
];

export default cloumns;
