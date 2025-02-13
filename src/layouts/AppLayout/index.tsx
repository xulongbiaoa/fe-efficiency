import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router';
import debounce from 'lodash/debounce';
import { getAppList } from '@/services/app/app-manage';
import { getSprintListNew } from '@/services/app/sprint-manage';
import { getEnvList } from '@/services/app/env-manage';
import { Select, Space, Divider, Input, Modal } from 'antd';
import { CaretRightOutlined, SearchOutlined } from '@ant-design/icons';
import {
  getParamsToJson,
  setUrlWithoutFreshBrowser,
  delUrlParamsWithoutFreshBrowser,
} from '@/utils';
import { SessionInstance } from '@/utils/storage';
import AppLayoutMenu, { getMenuLabel, getSubMenuKey } from './menu';
import logoLight from '../../images/logo_light.png';
import styles from './index.module.less';

const { Option } = Select;

type TApp = {
  id?: number;
  name?: string;
  businessId?: number;
  businessName?: string;
  type?: number;
  level?: number;
  createdAt?: string;
  status?: number;
  owner?: {
    workNo: string;
    name: string;
  };
};

type TSprint = {
  id: number;
  name: string;
  branch: string;
  status: number;
  owner?: { workNo: string; name: string };
};

const setAppInfo = (key: string, value: any): void => {
  const appInfo = SessionInstance?.get('appInfo');
  appInfo[key] = value;
  SessionInstance?.set('appInfo', appInfo);
};

const getAppInfo = () => {
  const { appId, unitCode, sprintId, envId, devMode } = getParamsToJson();
  if (appId || unitCode) {
    SessionInstance?.set('appInfo', {
      appId,
      sprintId,
      unitCode,
      envId,
      devMode,
    });
  }
  const appInfo = SessionInstance?.get('appInfo');
  if (!appInfo) {
    Modal.confirm({
      title: '请先选择应用',
      onOk: () => {
        location.href = `${location.origin}/app`;
      },
    });
    return null;
  }
  return {
    appId: appInfo.appId || '',
    sprintId: appInfo.sprintId || '',
    unitCode: appInfo.unitCode || '',
    envId: appInfo.envId || '',
    devMode: appInfo.devMode || '',
  };
};

const AppLayout: React.FC = (props) => {
  const [currApp, setCurrApp] = useState<number>(Number(getAppInfo()?.appId));
  const [currSprint, setCurrSprint] = useState<number>(Number(getAppInfo()?.sprintId));
  const [apps, setApps] = useState<TApp[]>([]);
  const [sprints, setSprints] = useState<TSprint[]>([]);
  const [currEnv, setCurrEnv] = useState(Number(getAppInfo()?.envId));
  const [envList, setEnvList] = useState<any[]>([]);

  const history = useHistory();

  // 获取应用列表
  const reqGetAppList = ({ search }: { search: string }) => {
    return getAppList({
      scope: 0,
      unitCodes: String(getAppInfo()?.unitCode) || '',
      search,
      pageNo: 1,
      pageSize: 100,
    }).then((res) => {
      if (res && res.success) {
        const { rows } = res.data;
        setApps([...rows]);
      }
    });
  };
  // 获取迭代列表
  const reqGetSprintListNew = (appId: number, search: string = '') => {
    return getSprintListNew({ appId, search, pageSize: 100 }).then((res) => {
      if (res && res.success) {
        setSprints([...res.data.rows]);
      }
    });
  };
  const reqGetEnvList = (appId: number) => {
    return getEnvList(appId).then((res) => {
      if (res && res.success) {
        setEnvList(res.data);
      }
    });
  };
  // app搜索
  const delayAppQuery = useCallback(
    debounce((query: string) => {
      reqGetAppList({ search: query });
    }, 500),
    [],
  );

  const delaySprintQuery = useCallback(
    debounce((query: string) => {
      reqGetSprintListNew(currApp, query);
    }, 500),
    [],
  );

  useEffect(() => {
    reqGetAppList({ search: '' });
    if (currApp) {
      reqGetSprintListNew(currApp);
      reqGetEnvList(currApp);
    }
  }, []);

  useEffect(() => {
    console.log('路由改变');
    const { envId } = getParamsToJson();
    if (envId) {
      setCurrEnv(Number(envId));
    }
  }, [location.pathname]);

  // 设置当前应用ID
  const setCurrAppId = (appId: number) => {
    setCurrApp(appId);
  };

  // 设置当前迭代ID
  const setCurrSprintId = async (sprintId: number, name?: string) => {
    if (!sprints.map((item) => item.id).includes(sprintId) && currApp !== undefined) {
      await reqGetSprintListNew(currApp);
    }
    if (name) {
      const originName = sprints.filter((item) => item.id === sprintId)[0]?.name;
      if (originName !== name) {
        await reqGetSprintListNew(currApp);
      }
    }
    setCurrSprint(Number(sprintId) as any);
  };

  const setEnvId = (envId: number) => {
    setCurrEnv(Number(envId));
  };

  const handleSelectChange = (id: any, record: any) => {
    if (history.location.pathname.startsWith('/app-manage/sprint-manage')) {
      history.push(
        `/app-manage/sprint-manage?unitCode=${(history.location as any).query?.unitCode}`,
      );
    }

    if (history.location.pathname.startsWith('/app-manage/env-manage')) {
      history.push(`/app-manage/env-manage?unitCode=${(history.location as any).query?.unitCode}`);
    }

    setCurrApp(id);
    setAppInfo('appId', id);
    setAppInfo('devMode', record.devMode);
    reqGetSprintListNew(id);
    reqGetEnvList(Number(id));
    setUrlWithoutFreshBrowser({ appId: id, devMode: record.devMode });
    delUrlParamsWithoutFreshBrowser(['activeNodeId']);
  };

  const handleSelectSprintChange = (e: any) => {
    setAppInfo('sprintId', e);
    setCurrSprint(e);
    setUrlWithoutFreshBrowser({ sprintId: e });
  };

  const handleSelectEnv = (e: any) => {
    setAppInfo('envId', e);
    setCurrEnv(Number(e));
    setUrlWithoutFreshBrowser({ envId: e });
  };

  const handleSearchApp = (e: any) => {
    delayAppQuery(e.target.value);
  };

  const handleSearchSprint = (e: any) => {
    delaySprintQuery(e.target.value);
  };

  const goBack = () => {
    history.push('/app');
  };

  if (!getAppInfo()) {
    return null;
  }

  const randerBreadcrumb = () => {
    // 应用选择
    const renderAppManage = () => {
      return (
        <>
          <div onClick={goBack}>应用</div>
          <div>
            <CaretRightOutlined />
            <Select
              placeholder="请选择应用"
              value={currApp}
              bordered={false}
              onChange={handleSelectChange}
              dropdownStyle={{ minWidth: 300 }}
              dropdownRender={(list) => (
                <div>
                  <div style={{ padding: '4px' }}>
                    <Input
                      placeholder="请输入应用名称或ID"
                      suffix={<SearchOutlined />}
                      onChange={handleSearchApp}
                      allowClear
                    />
                  </div>
                  <Divider style={{ margin: '4px 0' }} />
                  {list}
                </div>
              )}
            >
              {apps.map((app: any) => {
                return (
                  <Option devMode={app.devMode} key={app.id} value={app.id}>
                    {app.name}
                  </Option>
                );
              })}
            </Select>
          </div>
        </>
      );
    };

    // 菜单名称
    const renderMenuName = () => {
      return (
        <>
          <CaretRightOutlined />
          <div
            onClick={() => {
              if (location.pathname.includes('env-manage')) {
                history.push('/app-manage/env-manage' + history.location.search);
              } else if (location.pathname.includes('sprint-manage')) {
                history.push('/app-manage/sprint-manage' + history.location.search);
              } else {
                history.push(location.pathname + history.location.search);
              }
            }}
          >
            {getMenuLabel(location.pathname)}
          </div>
        </>
      );
    };

    // 迭代子路由选项
    const renderSprintItem = () => {
      return (
        <>
          <CaretRightOutlined />
          <div>
            <Select
              placeholder="选择迭代"
              value={currSprint}
              dropdownStyle={{ minWidth: 300 }}
              bordered={false}
              onChange={handleSelectSprintChange}
              dropdownRender={(list) => (
                <div>
                  <div style={{ padding: '4px' }}>
                    <Input
                      placeholder="请输入迭代名称或ID"
                      suffix={<SearchOutlined />}
                      onChange={handleSearchSprint}
                      allowClear
                    />
                  </div>
                  <Divider style={{ margin: '4px 0' }} />
                  {list}
                </div>
              )}
            >
              {sprints.map((sprint) => {
                return (
                  <Option key={sprint.id} value={sprint.id}>
                    {sprint.name}
                  </Option>
                );
              })}
            </Select>
          </div>
        </>
      );
    };

    const renderEnvMangeItem = () => {
      return (
        <>
          <CaretRightOutlined />
          <Select
            placeholder="选择环境"
            value={currEnv}
            dropdownStyle={{ minWidth: 100 }}
            bordered={false}
            onChange={handleSelectEnv}
          >
            {envList.map((env: any) => {
              return (
                <Option key={env.id} value={env.id}>
                  {env.name}
                </Option>
              );
            })}
          </Select>
        </>
      );
    };

    return (
      <Space size="small">
        {renderAppManage()}
        {renderMenuName()}
        {['sprint-detial'].includes(getSubMenuKey(location.pathname)) && renderSprintItem()}
        {['view', 'deploy-order', 'env-config'].includes(getSubMenuKey(location.pathname)) &&
          renderEnvMangeItem()}
      </Space>
    );
  };

  return (
    <div className={styles.appLayout}>
      <section className={styles.menu}>
        <div className={styles.logo} onClick={goBack}>
          <img src={logoLight} />
        </div>
        <div className={styles.links}>
          <AppLayoutMenu />
        </div>
      </section>
      <section className={styles.content}>
        <div className={styles.chooseAppContainer}>{randerBreadcrumb()}</div>
        <div className={styles.childrenWrap}>
          {React.Children.map(props.children as any, (child: React.ReactElement) =>
            React.cloneElement(child, {
              currAppId: currApp,
              currSprintId: currSprint,
              currEnvId: currEnv,
              setCurrAppId,
              setCurrSprintId,
              setEnvId,
            }),
          )}
        </div>
      </section>
    </div>
  );
};

export default AppLayout;
