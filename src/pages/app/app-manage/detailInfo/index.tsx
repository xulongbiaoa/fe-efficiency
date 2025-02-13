/* eslint-disable @typescript-eslint/no-shadow */
import debounce from 'lodash/debounce';
import moment from 'moment';
import { useHistory } from 'react-router';
import { CloseOutlined } from '@ant-design/icons';
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
  useCallback,
} from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Row,
  Col,
  Space,
  Avatar,
  Tooltip,
  Modal,
  message,
  Cascader,
  AutoComplete,
} from 'antd';
import { searchGroupList, getDevLangType, getDevMode, getBuildType } from '@/services/app/group';
import {
  getAppDetail,
  offlineApp,
  updateApp,
  checkBranchRef,
  createBranch,
  codeLibrarySearch,
} from '@/services/app/app-manage';
import {
  checkMembers,
  addMember,
  deleteMembers,
  transferMembers,
  checkRoleList,
  searchUserByNickName,
} from '@/services/app/members';
import { appTypes, appLevels, appStatus } from '../../const';
import styles from './index.module.less';
import { useModel } from 'umi';

const { Option } = Select;

const layout = {
  // labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

const colLayout = {
  xs: 24,
  sm: 24,
  md: 20,
  lg: 18,
  xl: 12,
  xxl: 10,
};

type TBaseInfo = {
  name: string;
  unitCode: string;
  description: string;
  createTime: string;
  type: number;
  level: number;
  status: number;
};

interface IBaseInfo {
  baseInfo: TBaseInfo;
  appId: number;
  onSave: () => Promise<any>;
  orgList: any[];
}

const BaseInfo = forwardRef((props: IBaseInfo, ref: any) => {
  const [editState, setEditState] = useState(false);
  const [form] = Form.useForm();
  const history = useHistory();

  form.setFieldsValue(props.baseInfo);

  const validateFieldsData = () => {
    return new Promise((resolve, reject) => {
      form
        .validateFields()
        .then((values) => {
          resolve(values);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  useImperativeHandle(ref, () => {
    return {
      getFieldsData: () => {
        return validateFieldsData();
      },
    };
  });

  const handleCancel = () => {
    form.resetFields();
    setEditState(false);
  };

  const handleOK = () => {
    props.onSave().then(() => {
      setEditState(false);
    });
  };

  const handleAppOffline = () => {
    return Modal.confirm({
      title: '确认下线应用？',
      onOk: () => {
        return offlineApp(props.appId).then((res) => {
          if (res && res.success) {
            message.success('应用已成功下线');
            history.push('/app');
          }
        });
      },
    });
  };

  const renderControls = (): React.ReactElement => {
    if (editState) {
      return (
        <Space>
          <a onClick={handleCancel}>取消</a>
          <a onClick={handleOK}>保存</a>
        </Space>
      );
    } else {
      return (
        <Space>
          {Number(props.baseInfo.status) === 4 ? (
            <span style={{ color: '#999' }}>已下线</span>
          ) : (
            <a onClick={handleAppOffline}>应用下线</a>
          )}
          <a onClick={() => setEditState(true)}>编辑</a>
        </Space>
      );
    }
  };
  const filter = (inputValue: string, path: any[]) =>
    path.some(
      (option) => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
    );

  return (
    <Card title="基础信息" extra={renderControls()}>
      <Form form={form} name="baseInfo" requiredMark={false} {...layout}>
        <Row>
          <Col {...colLayout} span={20}>
            <Form.Item label="名称" name="name" key="name" rules={[{ required: false }]}>
              <Input placeholder="--" bordered={false} readOnly={true} />
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item
              label="业务线"
              name="unitCode"
              key="unitCode"
              rules={[{ required: true, message: '请输入业务线名称' }]}
            >
              <Cascader
                showSearch={{ filter }}
                bordered={editState}
                showArrow={editState}
                style={{ pointerEvents: `${editState ? 'auto' : 'none'}`, width: '100%' }}
                options={props.orgList}
                placeholder="请输入关键字"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...colLayout}>
            <Form.Item
              label="描述"
              name="description"
              key="description"
              rules={[{ required: false }]}
            >
              <Input placeholder="--" bordered={editState} readOnly={!editState} />
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item
              label="注册时间"
              name="createTime"
              key="createTime"
              rules={[{ required: false }]}
            >
              <Input placeholder="--" bordered={false} readOnly={true} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...colLayout}>
            <Form.Item
              label="类型"
              name="type"
              key="type"
              tooltip="空"
              rules={[{ required: false }]}
            >
              <Select
                bordered={editState}
                disabled={!editState}
                showArrow={editState}
                style={{ width: 120 }}
              >
                {appTypes.map((item) => {
                  return (
                    <Option key={item.value} value={item.value}>
                      <span style={{ color: '#333' }}>{item.name}</span>
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item
              label="等级"
              name="level"
              key="level"
              tooltip="空"
              rules={[{ required: false }]}
            >
              <Select
                bordered={editState}
                disabled={!editState}
                showArrow={editState}
                style={{ width: 120 }}
              >
                {appLevels.map((item) => {
                  return (
                    <Option key={item.value} value={item.value}>
                      <span style={{ color: '#333' }}>{item.name}</span>
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...colLayout}>
            <Form.Item
              label="状态"
              name="status"
              key="status"
              tooltip="空"
              rules={[{ required: false }]}
            >
              <Select
                bordered={editState}
                disabled={!editState}
                showArrow={editState}
                style={{ width: 120 }}
              >
                {appStatus.map((item) => {
                  return (
                    <Option key={item.value} value={item.value}>
                      <span style={{ color: '#333' }}>{item.name}</span>
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
});

type TDevInfo = {
  devLang: string;
  devMode: number;
  devRepo: string;
  trunk: string;
};

interface IDevInfo {
  devInfo: TDevInfo;
  appId: number;
  onSave: () => Promise<any>;
}

const DevInfo = forwardRef((props: IDevInfo, ref: any) => {
  const [editState, setEditState] = useState(false);
  const [isCreateBranchOpen, setIsCreateBranchOpen] = useState(false);
  const [refList, setRefList] = useState<{ name: string; url: string }[]>([]);
  const [lang, setLang] = useState<{ key: string; name: string }[]>([]);
  const [buildTypes, setBuildTypes] = useState<{ key: string; name: string }[]>([]);
  const [devMode, setDevMode] = useState<{ key: string; name: string }[]>([]);
  const [codeLibrary, setCodeLibrary] = useState<{ name: string; url: string }[]>([]);
  const [devForm] = Form.useForm();
  const [branchForm] = Form.useForm();

  useEffect(() => {
    devForm.setFieldsValue(props.devInfo);
  }, [props.devInfo, editState]);

  const handleCancel = () => {
    devForm.resetFields();
    setEditState(false);
    return;
  };

  const handleOK = () => {
    props.onSave().then(() => {
      setEditState(false);
    });
    return;
  };

  const reqGetDevLangType = () => {
    return getDevLangType().then((res) => {
      if (res && res.success) {
        setLang(res.data.APP_DEV_LANG);
      }
    });
  };
  const reqGetDevBuildType = () => {
    return getBuildType().then((res) => {
      if (res && res.success) {
        setBuildTypes(res.data.APP_BUILD_TYPE || []);
      }
    });
  };

  const reqGetDevMode = () => {
    return getDevMode().then((res) => {
      if (res && res.success) {
        setDevMode(res.data.APP_DEV_MODE);
      }
    });
  };

  const reqCheckBranchRefList = (query: string = '') => {
    return checkBranchRef({ appId: props.appId, search: query }).then((res) => {
      if (res && res.success) {
        setRefList([...res.data]);
      }
    });
  };
  const delayQueryRefList = useCallback(
    debounce((query: string) => {
      reqCheckBranchRefList(query);
    }, 1000),
    [],
  );

  const reqCodeLibrarySearch = (query: string = '') => {
    return codeLibrarySearch({
      search: query,
    }).then((res) => {
      if (res && res.success) {
        setCodeLibrary(res.data);
      }
    });
  };

  const handleSearchRefList = (e: any) => {
    return delayQueryRefList(e);
  };

  const handleCreateBranch = () => {
    return branchForm.validateFields().then((res) => {
      const { branch, ref } = res;
      return createBranch({
        appId: props.appId,
        branch,
        ref,
      }).then((res) => {
        if (res && res.success) {
          message.success('分支创建成功');
          setIsCreateBranchOpen(false);
          devForm.setFieldValue('branch', branch);
        }
      });
    });
  };

  const handleSearchCodeLibrary = (e: any) => {
    return reqCodeLibrarySearch(e);
  };

  const validateFieldsData = () => {
    return new Promise((resolve, reject) => {
      devForm
        .validateFields()
        .then((values) => {
          resolve(values);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  useImperativeHandle(ref, () => {
    return {
      getFieldsData: () => {
        return validateFieldsData();
      },
    };
  });

  const renderControls = (): React.ReactElement => {
    if (editState) {
      return (
        <Space>
          <a onClick={handleCancel}>取消</a>
          <a onClick={handleOK}>保存</a>
        </Space>
      );
    }
    return <a onClick={() => setEditState(true)}>编辑</a>;
  };
  useEffect(() => {
    reqCheckBranchRefList();
    reqGetDevLangType();
    reqGetDevMode();
    reqGetDevBuildType();
    reqCodeLibrarySearch();
  }, []);

  return (
    <>
      <Card title="研发配置" extra={renderControls()}>
        <Form form={devForm} name="devInfo" requiredMark={false} {...layout}>
          <Row>
            <Col {...colLayout} span={20}>
              <Form.Item
                label="开发语言"
                name="devLang"
                key="devLang"
                rules={[{ required: false }]}
              >
                <Select bordered={editState} disabled={!editState} showArrow={editState}>
                  {lang.map((item) => {
                    return (
                      <Option key={item.key} value={item.key}>
                        <span style={{ color: '#333' }}>{item.name}</span>
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col {...colLayout} style={{ position: 'relative' }} span={20}>
              <Form.Item
                label="代码仓库"
                name="devRepo"
                key="devRepo"
                rules={[{ required: true, message: '选择代码仓库' }]}
              >
                <AutoComplete
                  style={{ pointerEvents: `${editState ? 'auto' : 'none'}` }}
                  showSearch
                  dropdownStyle={{ minWidth: 400 }}
                  bordered={editState}
                  showArrow={editState}
                  placeholder="请编辑代码仓库"
                  onSearch={handleSearchCodeLibrary}
                  filterOption={(input, option) => {
                    return (
                      (option?.children as any)?.props.children.indexOf(
                        input.toLocaleLowerCase(),
                      ) >= 0
                    );
                  }}
                >
                  {codeLibrary.map((lib: { name: string; url: string }) => (
                    <AutoComplete.Option key={lib.url} value={lib.url}>
                      <span style={{ color: '#333' }}>{lib.url}</span>
                    </AutoComplete.Option>
                  ))}
                </AutoComplete>
              </Form.Item>
              {editState && (
                <a
                  style={{ position: 'absolute', right: '10px', top: '5px' }}
                  onClick={() => window.open('https://gitcode.deepway-inc.com/projects/new')}
                >
                  新建
                </a>
              )}
            </Col>
          </Row>
          <Row>
            <Col {...colLayout} span={20}>
              <Form.Item
                label="构建类型"
                name="buildType"
                key="buildType"
                rules={[{ required: true }]}
              >
                <Select bordered={editState} disabled={!editState} showArrow={editState}>
                  {buildTypes.map((item) => {
                    return (
                      <Option key={item.key} value={item.key.toString()}>
                        <span style={{ color: '#333' }}>{item.name}</span>
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col {...colLayout} style={{ position: 'relative' }} span={20}>
              <Form.Item label="默认主干" name="trunk" key="trunk" rules={[{ required: false }]}>
                <Select
                  style={{ pointerEvents: `${editState ? 'auto' : 'none'}` }}
                  showSearch
                  bordered={editState}
                  showArrow={editState}
                  placeholder="请输入代码主干"
                  onSearch={handleSearchRefList}
                  filterOption={(input, option) => {
                    return (
                      (option?.children as any)?.props.children.indexOf(
                        input.toLocaleLowerCase(),
                      ) >= 0
                    );
                  }}
                >
                  {refList.map((ref: { name: string; url: string }) => (
                    <Option key={ref.url} value={ref.name}>
                      <span style={{ color: '#333' }}>{ref.name}</span>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {editState && (
                <a
                  style={{ position: 'absolute', right: '10px', top: '5px' }}
                  onClick={() => setIsCreateBranchOpen(true)}
                >
                  新建
                </a>
              )}
            </Col>
          </Row>
          <Row>
            <Col {...colLayout} span={20}>
              <Form.Item label="研发模式" name="devMode" key="devMode" rules={[{ required: true }]}>
                <Select bordered={editState} disabled={!editState} showArrow={editState}>
                  {devMode.map((item) => {
                    return (
                      <Option key={item.key} value={Number(item.key)}>
                        <span style={{ color: '#333' }}>{item.name}</span>
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <Modal
        title="创建分支"
        visible={isCreateBranchOpen}
        onOk={handleCreateBranch}
        onCancel={() => setIsCreateBranchOpen(false)}
        destroyOnClose={true}
      >
        <Form form={branchForm} name="createBranch">
          <Form.Item label="名称" name="branch" key="branch" rules={[{ required: true }]}>
            <Input placeholder="请输入分支名称" allowClear />
          </Form.Item>
          <Form.Item label="基线" name="ref" key="ref" rules={[{ required: true }]}>
            <Select
              showSearch
              placeholder="输入基线分支提交"
              onSearch={handleSearchRefList}
              filterOption={(input, option) => {
                return option?.props.children.indexOf(input.toLocaleLowerCase()) >= 0;
              }}
            >
              {refList.map((ref: { name: string; url: string }) => (
                <Option key={ref.url} value={ref.url}>
                  {ref.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

type TMemInfo = {
  roleId: number;
  roleName: string;
  members: {
    id: number;
    uid: string;
    name: string;
  }[];
};

interface IMemInfo {
  appId: number;
}

const MemInfo = forwardRef((props: IMemInfo) => {
  const [memInfo, setMemInfo] = useState<TMemInfo[]>([]);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [roleList, setRoleList] = useState<{ id: number; name: string }[]>([]);
  const [userlist, setUserList] = useState<{ name: string; userId: string }[]>([]);
  const [form] = Form.useForm();
  const [transForm] = Form.useForm();

  const reqUserList = (nickName: string) => {
    return searchUserByNickName({ nickName }).then((res) => {
      if (res && res.success) {
        setUserList([...res.data]);
      }
    });
  };
  const delayQuery = useCallback(
    debounce((query: string) => {
      reqUserList(query);
    }, 500),
    [],
  );

  const reqCheckMembers = () => {
    return checkMembers({ entityType: 'app', entityId: props.appId }).then((res) => {
      if (res && res.success) {
        setMemInfo([...res.data]);
      }
    });
  };

  const reqCheckRoleList = () => {
    return checkRoleList({ entityType: 'app' }).then((res) => {
      if (res && res.success) {
        setRoleList([...res.data]);
      }
    });
  };

  const handleAddMember = () => {
    form.validateFields().then((res) => {
      if (res.members) {
        res.members = res.members.map((item: { key: string; value: string; label: string }) => ({
          name: item.label,
          uuid: item.value,
        }));
      }
      const params = {
        entityType: 'app',
        entityId: props.appId,
        roleId: res.roleId,
        members: [...res.members],
      };
      return addMember(params).then((res) => {
        if (res && res.success) {
          message.success('添加成功');
          setIsAddMemberModalOpen(false);
          reqCheckMembers();
          form.resetFields();
        }
      });
    });
  };

  const handleCancel = () => {
    form.resetFields();
    return setIsAddMemberModalOpen(false);
  };

  const showAddMemberModal = () => {
    return setIsAddMemberModalOpen(true);
  };

  const showTranferModal = () => {
    setIsTransferModalOpen(true);
  };

  const handleTransferMember = () => {
    const { id } = memInfo.filter((mem) => Number(mem.roleId) === 1)[0]?.members[0];
    transForm.validateFields().then((res) => {
      const data = {
        uuid: res.user.value,
        name: res.user.label,
      };
      return transferMembers(id, data).then((res) => {
        if (res && res.success) {
          message.success('转交成功');
          transForm.resetFields();
          setIsTransferModalOpen(false);
          reqCheckMembers();
        }
      });
    });
  };

  const handleUserSearch = (e: any) => {
    return delayQuery(e);
  };

  const handleDeleteUser = (mem: { id: number; uid: string; name: string }) => {
    const { id, name } = mem;
    return deleteMembers(id).then((res) => {
      if (res && res.success) {
        message.success(`已删除${name}`);
        reqCheckMembers();
      }
    });
  };

  const renderExtra = () => {
    return (
      <Space>
        <a onClick={showAddMemberModal}>添加成员</a>
      </Space>
    );
  };
  useEffect(() => {
    reqCheckRoleList();
    reqCheckMembers();
  }, [props.appId]);

  return (
    <>
      <Card title="应用成员" extra={renderExtra()}>
        {memInfo.map((item: TMemInfo) => {
          return (
            <Space key={item.roleId} style={{ width: '50%', marginBottom: 12 }}>
              <span>{item.roleName}:</span>
              <Space>
                {item.members &&
                  [...item.members].map((mem) => {
                    return (
                      <Tooltip
                        key={mem.id}
                        title={
                          <>
                            <span>{mem.name}</span>&nbsp;&nbsp;&nbsp;
                            <a style={{ color: '#f86565' }} onClick={() => handleDeleteUser(mem)}>
                              <CloseOutlined />
                            </a>
                          </>
                        }
                      >
                        <Avatar key={mem.id} style={{ backgroundColor: '#0984f9' }}>
                          {String(mem.name).substring(-1) || '空'}
                        </Avatar>
                      </Tooltip>
                    );
                  })}
              </Space>
              {Number(item.roleId) === 1 && <a onClick={() => showTranferModal()}>转交</a>}
            </Space>
          );
        })}
      </Card>
      <Modal
        title="添加成员"
        visible={isAddMemberModalOpen}
        onOk={handleAddMember}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Form
          form={form}
          name="addMember"
          initialValues={{
            roleId: 1,
            members: [],
          }}
        >
          <Form.Item label="角色" name="roleId" key="roleId" rules={[{ required: true }]}>
            <Select>
              {roleList.map((role) => (
                <Option key={role.id} value={role.id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="成员" name="members" key="members" rules={[{ required: true }]}>
            <Select
              showSearch
              mode="multiple"
              placeholder="输入名字或工号搜索"
              onSearch={handleUserSearch}
              labelInValue={true}
              filterOption={(input, option) => {
                return option?.props.children.indexOf(input.toLocaleLowerCase()) >= 0;
              }}
            >
              {userlist.map((user) => (
                <Option key={user.userId} value={user.userId}>
                  {user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="转交"
        visible={isTransferModalOpen}
        onOk={handleTransferMember}
        onCancel={() => {
          transForm.resetFields();
          setIsTransferModalOpen(false);
        }}
        destroyOnClose={true}
      >
        <Form
          form={transForm}
          name="transferMember"
          initialValues={{
            members: [],
          }}
        >
          <Form.Item label="转交人员" name="user" key="user" rules={[{ required: true }]}>
            <Select
              showSearch
              placeholder="输入名字或工号搜索"
              onSearch={handleUserSearch}
              labelInValue={true}
              filterOption={(input, option) => {
                return option?.props.children.indexOf(input.toLocaleLowerCase()) >= 0;
              }}
            >
              {userlist.map((user) => (
                <Option key={user.userId} value={user.userId}>
                  {user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

interface IAppDetailInfo {
  currAppId: number;
  setCurrAppId: (appId: number) => void;
}

const AppDetailInfo: React.FC<IAppDetailInfo> = (props: IAppDetailInfo) => {
  const [baseInfo, setBaseInfo] = useState<any>(null);
  const [devInfo, setDevInfo] = useState<any>(null);
  const [orgList, setOrgList] = useState<any[]>([]);
  const baseRef: any = useRef(null);
  const devRef: any = useRef(null);
  const {
    initialState: { currentUser },
  }: any = useModel('@@initialState');

  const formatList = (object: any, codes: any[], baseInfo?: any) => {
    if (!object) {
      return;
    }
    object.label = object.unitName;
    object.value = object.unitCode;
    object.codes = codes.concat(object?.unitCode);
    if (object?.unitCode === baseInfo?.unitCode) {
      baseInfo.unitCode = object.codes;
    }
    if (object?.children) {
      object.children.forEach((item: any) => {
        formatList(item, object.codes, baseInfo);
      });
    }
  };

  const reqSearchOrgList = (baseInfo: any) => {
    return searchGroupList().then((res) => {
      if (res && res.success) {
        const { data } = res;

        const list = data?.children
          ? data?.children?.filter((item: any) => {
              const codePaths =
                currentUser?.stayInUnits?.map((item: any) => {
                  return item?.codePath;
                }) || [];

              // return (currentUser?.stayInUnits[0]?.codePath || '').includes(item.unitCode);
              return codePaths.some((item1: string) => {
                return item1?.includes(item.unitCode);
              });
            })
          : [];
        list.forEach((item: any) => {
          formatList(item, [], baseInfo);
        });
        setOrgList(list);
      }
    });
  };

  const reqGetAppDetail = () => {
    return getAppDetail(props.currAppId).then(async (res) => {
      if (res && res.success) {
        const {
          name,
          unitCode,
          description,
          createTime,
          buildType,
          type,
          level,
          status,
          devLang,
          devMode,
          devRepo,
          trunk,
        } = res.data;
        const _baseInfo = {
          name,
          unitCode,
          description,
          createTime: moment(createTime).format('YYYY-MM-DD HH:mm:ss'),
          type,
          level: Number(level),
          status,
        };
        const _devInfo = {
          devLang,
          devMode,
          devRepo,
          trunk,
          buildType,
        };
        await reqSearchOrgList(_baseInfo);
        setBaseInfo({ ..._baseInfo });
        setDevInfo({ ..._devInfo });
      }
    });
  };

  const saveAppInfo = () => {
    return Promise.all([baseRef.current.getFieldsData(), devRef.current.getFieldsData()])
      .then(([baseInfo, devInfo]) => {
        baseInfo.desc = baseInfo.description;
        if (Array.isArray(baseInfo.unitCode)) {
          baseInfo.unitCode = baseInfo.unitCode[baseInfo.unitCode.length - 1];
        }
        const data = { ...baseInfo, ...devInfo };
        return updateApp(props.currAppId, data);
      })
      .then((res) => {
        if (res && res.success) {
          message.success('信息保存成功');
          reqGetAppDetail();
        }
      });
  };
  useEffect(() => {
    reqGetAppDetail();
  }, [props.currAppId]);
  return (
    <div className={styles.detailInfoContainer}>
      {baseInfo && (
        <BaseInfo
          orgList={orgList}
          baseInfo={baseInfo}
          appId={props.currAppId}
          ref={baseRef}
          onSave={saveAppInfo}
        />
      )}
      <div className={styles.gap} />
      {devInfo && (
        <DevInfo devInfo={devInfo} appId={props.currAppId} ref={devRef} onSave={saveAppInfo} />
      )}
      <div className={styles.gap} />
      <MemInfo appId={props.currAppId} />
    </div>
  );
};

export default AppDetailInfo;
