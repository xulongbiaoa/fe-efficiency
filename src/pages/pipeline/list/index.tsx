import { Button, Card, Dropdown, Menu, message, Select, Tabs } from 'antd';

import {
  addCollectGroup,
  delCollectGroup,
  getGroup,
  collectGroup,
  getCollectGroup,
} from '@/services/pipeline/list';

import GroupModal from './components/optionModal/groupModal';
import { setUrlWithoutFreshBrowser } from '@/utils/index';
import styles from './index.module.less';

import { PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import TableItem from './components/TableItem';
import { history } from 'umi';
const TableList: React.FC = () => {
  const { TabPane } = Tabs;
  const actionRef = useRef<any>();
  const [selectedGroup, setselectedGroup] = useState<any>(null);
  const { groupId } = history.location.query as any;
  const [activeKey, setActiveKey] = useState<string>(groupId || '-2');
  const [loading, setLoading] = useState(false);

  const deaultPanes = [
    { key: '-2', dictName: '我的', title: '我的', id: '-2', closable: false },
    { key: '-1', dictName: '我的收藏', title: '我的收藏', id: '-1', closable: false },
  ];

  const [panes, setPanes] = useState<any>(deaultPanes);

  const [group, setGroup] = useState<object[]>([]);
  const [modalDis, setModaldis] = useState<boolean>(false);

  const groupName = useMemo(() => {
    return panes.filter((item: any) => {
      return Number(item.key) === Number(activeKey);
    })[0]?.dictName;
  }, [activeKey, panes]);

  const onChange = (key: string) => {
    setActiveKey(key);
  };
  const handleSelectChange = (value: string, record: any) => {
    if (value === 'group') {
      setModaldis(true);
      return;
    }

    setselectedGroup(record);
  };
  const handleGetGroup = async () => {
    try {
      const res = await getGroup();

      if (res.success) {
        setGroup(res.data.rows);
      }
    } catch {}
  };
  const handleGetTag = async () => {
    try {
      const res = await getGroup();
      const groupInfo = await getCollectGroup();

      if (res.success) {
        setPanes(
          deaultPanes.concat(
            res.data.rows
              .filter((item: any) => {
                return groupInfo.data?.rows.includes(item.id);
              })
              .map((item: any) => {
                item.key = item.id;
                item.title = item.dictName;
                return item;
              }),
          ),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const add = async (params: any) => {
    try {
      setLoading(true);
      const addRes = await collectGroup([params.value]);
      if (addRes.success) {
        message.success('添加收藏成功');
        handleGetTag();
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const remove = async (targetKey: any) => {
    try {
      const res = await delCollectGroup([targetKey]);
      if (res.success) {
        handleGetTag();
        message.success('收藏分组移除成功');
        if (activeKey === targetKey) {
          setActiveKey('-2');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onEdit = (targetKey: string, action: 'add' | 'remove') => {
    if (action !== 'add') {
      remove(targetKey);
    }
  };

  const handleCancel = () => {
    setLoading(false);
    setModaldis(false);
  };
  const handleOk = async (name: string) => {
    try {
      if (!name) {
        message.error('分组名不能为空');
        return;
      }
      setLoading(true);
      const res = await addCollectGroup({ name });
      if (res.success) {
        await handleGetGroup();
        message.success('操作成功');
        actionRef.current?.reload();
      }
      setLoading(false);
      setModaldis(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const selectGroup = () => {
    return (
      <Card title="添加收藏分组" style={{ backgroundColor: '#fff' }}>
        <div>分组管理</div>
        <Select
          value={selectedGroup}
          style={{ width: '180px' }}
          onChange={handleSelectChange}
          allowClear
        >
          <Select.Option value={'group'}>
            <a>
              <PlusCircleOutlined /> 创建分组
            </a>
          </Select.Option>
          {group
            .filter((groupItem: any) => {
              return !panes.some((pane: any) => {
                return pane.dictName === groupItem.dictName;
              });
            })
            .map((item: any) => {
              return (
                <Select.Option key={item.id} value={item.id}>
                  {item.dictName}
                </Select.Option>
              );
            })}
        </Select>
        <Menu>
          <Menu.Item
            style={{
              backgroundColor: 'transparent',
              padding: 0,
              width: '100%',
            }}
          >
            <Button
              type="primary"
              style={{ width: '100%' }}
              onClick={() => add(selectedGroup)}
              disabled={!selectedGroup?.key}
              loading={loading}
            >
              确定
            </Button>
          </Menu.Item>
        </Menu>
        <GroupModal
          modalVisible={modalDis}
          loading={loading}
          onClose={handleCancel}
          onOk={handleOk}
        />
      </Card>
    );
  };

  useEffect(() => {
    handleGetGroup();
    handleGetTag();
  }, []);
  useEffect(() => {
    setUrlWithoutFreshBrowser({ groupId: activeKey });
  }, [activeKey]);

  return (
    <div className={styles.container}>
      <Card title="">
        <Tabs
          addIcon={
            <Dropdown
              onVisibleChange={() => {
                setselectedGroup(null);
                setLoading(false);
              }}
              overlayClassName={styles.zIndex}
              overlay={selectGroup}
              trigger={'click' as any}
            >
              <div>
                <PlusOutlined /> 添加收藏分组
              </div>
            </Dropdown>
          }
          onChange={onChange}
          activeKey={activeKey}
          type="editable-card"
          onEdit={onEdit as any}
        >
          {panes
            .sort((a: any, b: any) => a.id - b.id)
            .map((item: any) => {
              return (
                <TabPane key={item.key} tab={item.title} closable={item.closable}>
                  {activeKey == item.key && (
                    <TableItem
                      group={group}
                      actionRef={actionRef}
                      newActiveKey={item.newActiveKey}
                      activeKey={activeKey}
                      selectedGroup={selectedGroup}
                      setLoading={setLoading}
                      setselectedGroup={setselectedGroup}
                      handleSelectChange={handleSelectChange}
                      loading={loading}
                      groupName={groupName}
                    />
                  )}
                </TabPane>
              );
            })}
        </Tabs>
      </Card>
    </div>
  );
};

export default TableList;
