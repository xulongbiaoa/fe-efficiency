/* eslint-disable @typescript-eslint/no-shadow */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import {
  Select,
  Input,
  Button,
  Modal,
  Form,
  Table,
  Space,
  Tree,
  message,
  Cascader,
  AutoComplete,
  Typography,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getAppList, createApp, deleteApp, codeLibrarySearch } from '@/services/app/app-manage';
import { searchGroupList, getDevLangType } from '@/services/app/group';
import { getParamsToJson, setUrlWithoutFreshBrowser } from '@/utils';
import { appScopes, appTypes, appLevels } from './const';
import columns from './app-manage/components/column';
import type { TAppData } from './app-manage/components/column';
import type { TQuery } from './const';
const { Text } = Typography;
import styles from './index.module.less';
import { useModel } from 'umi';

const { Option } = Select;
const { TextArea } = Input;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

const initCreateParams = {
  name: '',
  unitCode: undefined,
  devLang: undefined,
  type: 0,
  level: 101,
  devRepo: undefined,
  desc: '',
};

const AppManage: React.FC = () => {
  const [scope, setScope] = useState<number>(Number(getParamsToJson()?.scope) || 0);
  const {
    initialState: { currentUser },
  }: any = useModel('@@initialState');
  const [orgList, setOrgList] = useState<any[]>([]);
  const [unitCodes, setUnitCodes] = useState<string>(getParamsToJson()?.unitCodes || '');
  const [search, setSearch] = useState<string>(getParamsToJson()?.search || '');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [appData, setAppData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lang, setLang] = useState<{ key: string; name: string }[]>([]);
  const [codeLibrary, setCodeLibrary] = useState<{ name: string; url: string }[]>([]);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const [form] = Form.useForm();
  const history = useHistory();

  const reqGetAppList = ({
    scope,
    unitCodes,
    search,
    pageNo,
  }: {
    scope: number;
    unitCodes: string;
    search: string;
    pageNo: number;
  }) => {
    setLoading(true);
    return getAppList({ scope, unitCodes, search, pageNo })
      .then((res) => {
        if (res && res.success) {
          const { rows, totalPage } = res.data;
          setAppData(rows);
          setTotalPage(totalPage);
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const reqGetDevLangType = () => {
    return getDevLangType().then((res) => {
      if (res && res.success) {
        setLang(res.data.APP_DEV_LANG);
      }
    });
  };
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
  const getAllChildUnitCodes = (object: any, codes: any[]) => {
    if (!object) {
      return;
    }
    codes.push(object.unitCode);
    if (object?.children) {
      object.children.forEach((item: any) => {
        getAllChildUnitCodes(item, codes);
      });
    }
    return codes;
  };
  const reqSearchOrgList = () => {
    return searchGroupList().then((res) => {
      let code: any = [];
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
          formatList(item, []);
          code = code.concat(...(getAllChildUnitCodes(item, []) || []));
        });

        // const code = getAllChildUnitCodes(list[0], []);
        setUnitCodes(code as any);
        setUrlWithoutFreshBrowser({ unitCodes: code });

        setOrgList(list);
        reqGetAppList({ scope, unitCodes: code, search, pageNo });
      }
    });
  };

  const reqCodeLibrarySearch = (query: string = '') => {
    return codeLibrarySearch({
      search: query,
    }).then((res) => {
      if (res && res.success) {
        setCodeLibrary(res.data);
      }
    });
  };

  const handleChange = (type: string, payload: { data: any }) => {
    setPageNo(1);
    switch (type) {
      case 'scope':
        setScope(payload.data);
        setUrlWithoutFreshBrowser({ scope: payload.data });
        reqGetAppList({
          scope: payload.data,
          search,
          unitCodes,
          pageNo,
        });
        return;
      case 'search':
        setSearch(payload.data);
        setUrlWithoutFreshBrowser({ search: payload.data });
        reqGetAppList({
          scope,
          search: payload.data,
          unitCodes,
          pageNo,
        });
        return;
    }
  };

  const handleCreateApp = () => {
    return form.validateFields().then((params) => {
      params.unitCode = params.unitCode[params.unitCode.length - 1];
      setConfirmLoading(true);
      return createApp(params).then((res) => {
        if (res && res.success) {
          setIsModalOpen(false);
          reqGetAppList({ scope, unitCodes, search: '', pageNo: 1 });
          form.setFieldsValue(initCreateParams);
          message.success('应用创建成功');
        }
        setConfirmLoading(false);
      });
    });
  };

  const handleSearchCodeLibrary = (e: any) => {
    return reqCodeLibrarySearch(e);
  };

  const openModal = () => {
    setIsModalOpen(true);
    return;
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    form.setFieldsValue(initCreateParams);
    return;
  };

  const handleChangeCurrPage = (e: any) => {
    setPageNo(e);
    return reqGetAppList({ scope, unitCodes, search, pageNo: e });
  };

  const handleSelectBussiness = (selectedKeys: string[], clickInfo: any) => {
    const { node } = clickInfo;

    const code = !node.children
      ? [...selectedKeys].join(',')
      : (getAllChildUnitCodes(node, []) || []).join(',');
    setUnitCodes(code);
    setUrlWithoutFreshBrowser({ unitCodes: code });
    setPageNo(1);
    if (selectedKeys.length > 0) {
      formatList(orgList, [], node);
      form.setFieldValue('unitCode', node.codes || undefined);
    } else {
      form.setFieldValue('unitCode', undefined);
    }

    return reqGetAppList({ scope, unitCodes: code, search, pageNo: 1 });
  };

  const jumpToAppManage = (record: TAppData) => {
    history.push(
      `/app-manage/overview?appId=${record.id}&unitCode=${record.unitCode}&devMode=${record.devMode}`,
    );
  };

  const deleteAppAction = (record: TAppData) => {
    Modal.confirm({
      title: `确认删除 ${record.name} 吗？`,
      width: 450,
      content: <Text type="danger">删除do平台应用，会同步删除K8S pod，请谨慎操作 !</Text>,
      onOk: () => {
        return deleteApp(Number(record.id)).then((res) => {
          if (res && res.success) {
            message.success('应用已删除');
            reqGetAppList({ scope, unitCodes, search, pageNo });
          }
        });
      },
    });
  };

  const filter = (inputValue: string, path: any[]) =>
    path.some(
      (option) => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
    );
  useEffect(() => {
    reqSearchOrgList();

    reqGetDevLangType();
    reqCodeLibrarySearch();
  }, []);

  return (
    <>
      <section className={styles.appManageContainer}>
        <div className={styles.header}>
          <Select
            value={scope}
            onChange={(e) => handleChange('scope', { data: e })}
            style={{ width: 120 }}
          >
            {appScopes.map((item: TQuery) => (
              <Option value={item.value} key={item.value}>
                {item.name}
              </Option>
            ))}
          </Select>
          <Space>
            <Input
              value={search}
              onChange={(e) => handleChange('search', { data: e.target.value })}
              placeholder="请输入应用id或名称"
              allowClear
              style={{ width: 250, marginRight: 10 }}
            />
            <Button
              type="primary"
              onClick={openModal}
              icon={<PlusOutlined />}
              style={{ marginLeft: 'auto' }}
            >
              新建应用
            </Button>
          </Space>
        </div>
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.bussiness}>业务线</div>
            <div className={styles.tree}>
              {orgList.length > 0 && (
                <Tree
                  fieldNames={{ title: 'unitName', key: 'unitCode' }}
                  treeData={orgList}
                  onSelect={handleSelectBussiness as any}
                  defaultExpandAll={true}
                  // checkedKeys={[unitCodes]}
                  // checkable
                  selectable
                />
              )}
            </div>
          </div>
          <div className={styles.right}>
            <Table
              rowKey="id"
              size="small"
              scroll={{ y: 700 }}
              loading={loading}
              columns={columns({ jumpToAppManage, deleteAppAction })}
              dataSource={appData}
              pagination={{
                position: ['bottomCenter'],
                size: 'small',
                current: pageNo,
                pageSize: 15,
                total: totalPage * 15,
                showSizeChanger: false,
                onChange: handleChangeCurrPage,
              }}
            />
          </div>
        </div>
      </section>
      <Modal
        title="创建应用"
        width={800}
        visible={isModalOpen}
        onOk={handleCreateApp}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
      >
        <Form form={form} name="create-app" {...layout} initialValues={initCreateParams}>
          <Form.Item
            label="名称"
            name="name"
            key="name"
            rules={[{ required: true, message: '请输入应用名称' }]}
          >
            <Input placeholder="请输入应用名称" />
          </Form.Item>
          <Form.Item
            label="业务线"
            name="unitCode"
            key="unitCode"
            rules={[{ required: true, message: '请选择业务线' }]}
          >
            <Cascader options={orgList} showSearch={{ filter }} placeholder="请输入关键字" />
          </Form.Item>
          <Form.Item
            label="类型"
            name="type"
            key="type"
            rules={[{ required: true, message: '请选择应用类型' }]}
          >
            <Select placeholder="请选择业务线">
              {appTypes.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="开发语言"
            name="devLang"
            key="devLang"
            rules={[{ required: true, message: '请选择开发语言' }]}
          >
            <Select placeholder="请选择开发语言">
              {lang.map((item) => {
                return (
                  <Option key={item.key} value={item.key}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="代码仓库"
            name="devRepo"
            key="devRepo"
            rules={[{ required: true, message: '选择代码仓库' }]}
          >
            <AutoComplete
              showSearch
              dropdownStyle={{ minWidth: 400 }}
              placeholder="请编辑代码仓库"
              onSearch={handleSearchCodeLibrary}
              filterOption={(input, option) => {
                return (
                  (option?.children as any)?.props.children.indexOf(input.toLocaleLowerCase()) >= 0
                );
              }}
            >
              {codeLibrary.map((lib: { name: string; url: string }) => (
                <AutoComplete.Option key={lib.url} value={lib.url}>
                  <span style={{ color: '#333' }}>{lib.url?.slice(32)}</span>
                </AutoComplete.Option>
              ))}
            </AutoComplete>
          </Form.Item>
          <Form.Item
            label="等级"
            name="level"
            key="level"
            rules={[{ required: true, message: '请选择应用等级' }]}
          >
            <Select placeholder="请选择应用等级">
              {appLevels.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="描述" name="desc" key="desc" rules={[{ required: false }]}>
            <TextArea showCount maxLength={100} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AppManage;
