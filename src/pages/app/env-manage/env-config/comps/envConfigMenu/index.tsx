import React, { useState, useEffect } from 'react';
import { Menu, Modal, Input, Form, message, Tooltip } from 'antd';
import {
  PlusOutlined,
  CloseOutlined,
  InfoCircleTwoTone,
  PlusCircleTwoTone,
} from '@ant-design/icons';
import { getFileList, addFile, delFile } from '@/services/app/env-config';
import { menuItems, dynamicSetMenuItems, transforMenuItems } from './const';
import type { menuItemsType } from './const';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/ext-language_tools';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
const plusItemStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px 0',
  borderBottom: '1px solid #f0f0f0',
  borderTop: '1px solid #f0f0f0',
  color: '#0984f9',
  cursor: 'pointer',
};

interface IEnvConfigMenu {
  envId: number;
  defaultSelect: string;
  onClick: (params: any) => void;
  addAfterCallback: (addFile: string) => void;
  delAfterCallback: () => void;
  update: any;
}

const EnvConfigMenu: React.FC<IEnvConfigMenu> = (props: IEnvConfigMenu) => {
  const [envConfigMenuitems, setEnvConfigMenuitems] = useState(menuItems);
  const [visible, setVisible] = useState(false);
  const [diffVisible, setDiffVisible] = useState(false);
  const [diffContent, setDiffContent] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const reqGetFileList = () => {
    const { envId } = props;
    return getFileList({ envId }).then((res) => {
      if (res && res.success) {
        const fileList = transforMenuItems(res.data);
        const newMenuItem = dynamicSetMenuItems(fileList, 'envChoreography');
        setEnvConfigMenuitems(newMenuItem);
      }
    });
  };

  const handleClick = (e: any) => {
    return props.onClick && props.onClick({ key: e.key });
  };

  const handleDelMenuItem = (item: menuItemsType) => {
    Modal.confirm({
      title: `确定删除该文件吗？`,
      onOk: () => {
        return delFile(item.id).then(() => {
          message.success('删除成功');
          reqGetFileList().then(() => {
            props.delAfterCallback();
          });
        });
      },
    });
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleAdd = () => {
    form.validateFields().then((values) => {
      const { subType, fileName, fileValue } = values;
      setLoading(true);
      return addFile({
        envId: props.envId,
        type: 'Kubernetes',
        subType: fileName,
        fileName: `${fileName}.${subType}`,
        fileValue,
      }).then(() => {
        setVisible(false);
        setLoading(false);
        reqGetFileList();
        props.addAfterCallback(`${fileName}`);
        form.resetFields();
      });
    });
  };
  const handleViewDiff = (item: any) => {
    setDiffContent(item);
    setDiffVisible(true);
  };
  const handleCloseDiff = () => {
    setDiffVisible(false);
    setDiffContent({});
  };

  const formatName = (name: string) => {
    if (name.length > 15) {
      return name?.slice(0, 10) + '...' + name?.slice(-3);
    }
    return name;
  };
  useEffect(() => {
    reqGetFileList();
  }, [props.envId, props.update]);

  const renderMenu = (items: menuItemsType[]) => {
    return (
      <>
        {items.map((item: menuItemsType) => {
          if (!item.children) {
            return (
              <Menu.Item key={item.key}>
                <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Tooltip style={{ flex: 1 }} title={item.fileName || item.label}>
                    {formatName(item.fileName || item.label)}
                  </Tooltip>
                  <div>
                    {item?.diffFlag &&
                      item?.sourceFileValue !== item?.fileValue &&
                      item.sourceFileValue !== null && (
                        <span onClick={() => handleViewDiff(item)} style={{ marginRight: 10 }}>
                          <Tooltip title="文件修改，点击查看">
                            <InfoCircleTwoTone />
                          </Tooltip>
                        </span>
                      )}
                    {item?.diffFlag && item.sourceFileValue === null && (
                      <span onClick={() => handleViewDiff(item)} style={{ marginRight: 10 }}>
                        <Tooltip title="文件新增，点击查看">
                          <PlusCircleTwoTone />
                        </Tooltip>
                      </span>
                    )}

                    {item.allowDel ? (
                      <span
                        style={{ color: '#aaa' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelMenuItem(item);
                        }}
                      >
                        <CloseOutlined />
                      </span>
                    ) : null}
                  </div>
                </span>
              </Menu.Item>
            );
          } else {
            return (
              <Menu.SubMenu key={item.key} title={item.label}>
                {renderMenu(item.children)}
                {item.key === 'Kubernetes' && (
                  <div style={plusItemStyle} onClick={() => setVisible(true)}>
                    <PlusOutlined />
                    <span style={{ padding: '0 5px' }}>添加</span>
                  </div>
                )}
              </Menu.SubMenu>
            );
          }
        })}
      </>
    );
  };

  return (
    <div>
      <Menu
        mode="inline"
        onClick={handleClick}
        selectedKeys={[props.defaultSelect]}
        defaultOpenKeys={['envChoreography', 'Kubernetes']}
      >
        {renderMenu(envConfigMenuitems)}
      </Menu>
      <Modal
        visible={visible}
        width="80%"
        title="新增文件"
        onCancel={handleCancel}
        onOk={handleAdd}
        confirmLoading={loading}
      >
        <Form name="createFile" form={form}>
          <Form.Item label="文件类型" name="subType" key="subType" rules={[{ required: true }]}>
            <Input placeholder="请输入文件类型" style={{ width: 300 }} />
          </Form.Item>
          <Form.Item label="文件名称" name="fileName" key="fileName" rules={[{ required: true }]}>
            <Input placeholder="请输入文件名" style={{ width: 300 }} />
          </Form.Item>
          <Form.Item
            label="文件内容"
            name="fileValue"
            key="fileValue"
            valuePropName="value"
            rules={[{ required: true }]}
          >
            <AceEditor
              mode="sh"
              theme="twilight"
              height="50vh"
              width="100%"
              name="UNIQUE_ID_OF_DIV"
              editorProps={{ $blockScrolling: true }}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={diffVisible}
        width="80%"
        title="查看文件变更"
        onCancel={handleCloseDiff}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        bodyStyle={{ height: '60vh', overflow: 'scroll' }}
        destroyOnClose
      >
        <ReactDiffViewer
          leftTitle={(diffContent?.fileName || '') + '(变更前)'}
          rightTitle={(diffContent?.fileName || '') + '(变更后)'}
          oldValue={diffContent?.sourceFileValue || ''}
          newValue={diffContent?.fileValue || ''}
          compareMethod={DiffMethod.LINES}
          codeFoldMessageRenderer={() => {
            return <div>展开</div>;
          }}
        />
      </Modal>
    </div>
  );
};

export default EnvConfigMenu;
