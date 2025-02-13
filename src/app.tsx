import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { SentryUtils } from '@dw/sentry-utils';
import RightContent from '@/components/RightContent';
import type { RequestConfig } from 'umi';
import { requestInterceptor } from 'open-login-utils';
import gateway from '@/gateway.config';
import { getUserDetail } from '@/services/user';
import { message } from 'antd';
const { appCode, poolCode } = gateway;

const env = APP_ENV;
const DSN = 'https://c407a0f27b56400db2ba088cdffdf030@sentry.deepway.com/13';
SentryUtils.init({ dsn: DSN, env });
SentryUtils.captureError();

const requestInterceptorRes = requestInterceptor(appCode, poolCode);
export const request: RequestConfig = {
  requestInterceptors: [requestInterceptorRes],
};
/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};
message.config({
  maxCount: 1,
});

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  dicts?: any;
}> {
  console.log('%cui-version:' + GIT_VERSION, 'color:#126e82;font-size:25px');
  const getUserDetailFunc = async () => {
    try {
      const msg = await getUserDetail({ poolCode });
      return msg.data;
    } catch (error) {
      console.log('error:', error);
    }
  };

  const currentUser = await getUserDetailFunc();
  SentryUtils.setUser(currentUser);
  return {
    currentUser,
    settings: {},
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: ({ initialState }: { initialState: any }) => {
  waterMarkProps: { content: string | undefined };
  rightContentRender: () => any;
  disableContentMargin: boolean;
  // footerRender: () => any;
  onPageChange: () => void;
  links: any[];
  menuHeaderRender: undefined;
} = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    headerContentRender: () => <h3>DO平台</h3>,
    disableContentMargin: false,
    // waterMarkProps: {
    //   content: initialState?.currentUser?.name,
    // },
    // footerRender: () => <Footer />,
    onPageChange: () => {
      // const { location } = history;
      // 如果没有登录，重定向到 login
      // if (!initialState?.currentUser && location.pathname !== loginPath) {
      //   history.push(loginPath);
      // }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};
