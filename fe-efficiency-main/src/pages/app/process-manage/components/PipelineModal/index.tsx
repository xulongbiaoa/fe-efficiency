/* eslint-disable @typescript-eslint/no-shadow */
import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Select, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import { getTemplate, getPipelineInsList } from '@/services/pipeline/list';
import ProcessChart from './processChart';
import styles from './index.module.less';

const { Option } = Select;

interface IGroupModal {
  modalVisible: boolean;
  template: any[];
  onClose: () => void;
  onOk: (action: string, processName: string, selectedItem?: number) => void;
  loading?: boolean;
}

const formatData = (template: any[], isTemplate?: boolean) => {
  return template
    .sort((a: any, b: any) => {
      return a.id - b.id;
    })
    .map((item) => {
      const data: any = (item?.pipelineStruct && JSON.parse(item.pipelineStruct).stages) || [];
      return {
        title: isTemplate
          ? '#' + item.instId + ' ' + item?.instName
          : item.category + '.' + item.name,
        id: item.id,
        instId: item.instId || null,
        data,
      };
    });
};

const actions: { label: string; value: string }[] = [
  { label: '新建流水线', value: 'create' },
  { label: '关联流水线', value: 'relevancy' },
  { label: '复制流水线', value: 'copy' },
];

const PipelineModal: React.FC<IGroupModal> = ({
  modalVisible,
  loading,
  onOk,
  onClose,
}: IGroupModal) => {
  const [action, setAction] = useState('create');
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [createTemplates, setCreateTemplates] = useState<any[]>([]);
  const [createInstances, setCreateInstances] = useState<any[]>([]);
  const [processName, setProcessName] = useState<string>('');
  const [inputError, setInputError] = useState<undefined | string>(undefined);

  const reqGetTemplate = (query?: string) => {
    if (action === 'create') {
      getTemplate({ search: query || '' }).then((res) => {
        if (res && res.success) {
          if (res.data.rows) {
            setCreateTemplates([...res.data.rows]);
          }
        }
      });
    } else {
      getPipelineInsList({ search: query || '' }).then((res) => {
        if (res && res.success) {
          if (res.data.rows) {
            setCreateInstances([...res.data.rows]);
          }
        }
      });
    }
  };
  const delayQuery = useCallback(
    debounce((query: string) => {
      reqGetTemplate(query);
    }, 200),
    [action],
  );

  const handleSubmit = () => {
    if (!processName) {
      setInputError('error');
      return;
    }
    setInputError('');
    return onOk(action, processName, selectedItem);
  };

  const handleCancel = () => {
    setSelectedItem({});
    setProcessName('');
    setInputError(undefined);
    onClose();
  };

  const handleChangeAction = (e: any) => {
    setAction(e);
  };

  const handleSearch = (e: any) => {
    delayQuery(e.target.value);
  };

  const handleProcessName = (e: any) => {
    setProcessName(e.target.value);
    setInputError(e.target.value ? '' : 'error');
  };

  const renderTemplates = () => {
    if (createTemplates.length === 0) {
      return (
        <div className={styles.empty}>
          <SearchOutlined /> 暂无数据
        </div>
      );
    }

    return (
      <div className={`${styles.pipelineContent}`}>
        {formatData(createTemplates).map((item) => {
          return (
            <div
              className={`${styles.pipelineItem} ${item.id === selectedItem.id && styles.selected}`}
              onClick={() => {
                setSelectedItem(item);
              }}
              key={item.id}
            >
              <ProcessChart width={600} data={item.data} title={`${item.title}`} />
            </div>
          );
        })}
      </div>
    );
  };

  const renderInstances = () => {
    if (createInstances.length === 0) {
      return (
        <div className={styles.empty}>
          <SearchOutlined /> 暂无数据
        </div>
      );
    }
    return (
      <div className={`${styles.pipelineContent}`}>
        {formatData(createInstances, true).map((item) => {
          return (
            <div
              className={`${styles.pipelineItem} ${item.id === selectedItem.id && styles.selected}`}
              onClick={() => {
                setSelectedItem(item);
              }}
              key={item.id}
            >
              <ProcessChart width={600} data={item.data} title={`${item.title}`} />
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    reqGetTemplate();
  }, [action]);

  return modalVisible ? (
    <Modal
      visible={true}
      title="新建流程"
      okButtonProps={{ loading, disabled: !selectedItem?.id }}
      className={styles.pipelineModal}
      onCancel={handleCancel}
      onOk={handleSubmit}
    >
      <div className={styles.controlContainer}>
        <div>
          <Select
            value={action}
            style={{ width: 120, marginRight: 10 }}
            onChange={handleChangeAction}
          >
            {actions.map((action) => {
              return (
                <Option key={action.value} value={action.value}>
                  {action.label}
                </Option>
              );
            })}
          </Select>
          <Input
            style={{ width: 200 }}
            placeholder="请输入流程名称"
            onChange={handleProcessName}
            value={processName}
            status={inputError as any}
            allowClear
          />
        </div>
        <div>
          <Input
            style={{ width: 250 }}
            placeholder="请输入流水线名称搜索"
            onChange={handleSearch}
            suffix={<SearchOutlined />}
            allowClear
          />
        </div>
      </div>
      <div className={styles.templates}>
        {action === 'create' ? renderTemplates() : renderInstances()}
      </div>
    </Modal>
  ) : null;
};
export default PipelineModal;
