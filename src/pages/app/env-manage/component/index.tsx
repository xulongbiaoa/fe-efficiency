import { Row, Col, Card, Tooltip, Modal } from 'antd';
import styles from './../index.module.less';
import { Descriptions, Divider } from 'antd';
import moment from 'moment';
import { history } from 'umi';
import { DeleteOutlined } from '@ant-design/icons';

interface IEnvProps {
  ident: null | string[];
  setCurrentEnv: (env: any) => void;
  setEnvModalDis: (dis: boolean) => void;
  handleDelete: (env: any) => void;
  list: {
    id: number;
    ident: string;
    status: number;
    name: string;
    indent: string;
    deployType: string;
    deployName: string;
    cpu: string;
    cpuUnit: string;
    memoryUnit: string;
    memory: string;
    inst: string;
    ipList: string[];
    deployInfo: {
      branch: string;
      version: string;
      versionTime: string;
      repo: string;
    };
  }[];
}

const EnvCard: React.FC<IEnvProps> = ({ ident, list, setCurrentEnv, handleDelete }) => {
  return (
    <Row gutter={[10, 10]}>
      {list
        .filter((item) => {
          if (ident) {
            return ident.some((data) => item.ident.includes(data));
          } else {
            return !item.ident.includes('online');
          }
        })
        .map((item) => {
          if (Number(item.status) === 9) {
            return null;
          }
          return (
            <Col key={item.id} span={8} className={styles.envItem}>
              <Card
                title={item.name}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setCurrentEnv(item.id);
                  history.push(
                    '/app-manage/env-manage/view?envId=' + item.id + '&' + location.search.slice(1),
                  );
                }}
                extra={
                  <>
                    <span
                      className={styles['icon-delete']}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        Modal.confirm({
                          content: '确认删除该环境吗？',
                          onOk: () => handleDelete(item.id),
                        });
                      }}
                    >
                      <DeleteOutlined />
                    </span>

                    <span
                      className={styles.setting}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setCurrentEnv(item.id);
                        history.push(
                          '/app-manage/env-manage/env-config?envId=' +
                            item.id +
                            '&' +
                            location.search.slice(1),
                        );
                      }}
                    >
                      <Tooltip title="环境设置">
                        <svg
                          width="14.081177"
                          height="13.535583"
                          viewBox="0 0 14.0812 13.5356"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.8954 8.48676L12.808 7.6405C12.8594 7.35339 12.886 7.06024 12.886 6.76709C12.886 6.47388 12.8594 6.18073 12.808 5.89362L13.8954 5.04736C14.063 4.91742 14.1245 4.70581 14.0498 4.51544C13.7493 3.75226 13.2894 3.01184 12.7117 2.39221C12.5688 2.23962 12.3082 2.15045 12.0991 2.21692L10.7494 2.65369C10.2513 2.28192 9.69519 1.98877 9.09424 1.7832L8.8335 0.498718C8.7937 0.300781 8.62268 0.146667 8.40527 0.110352C7.54028 -0.0316772 6.58569 -0.0392456 5.7207 0.102844C5.5033 0.139099 5.28748 0.300781 5.24756 0.498718L4.98535 1.78931C4.38928 1.99481 3.83643 2.28644 3.3418 2.65668L1.98206 2.21692C1.77454 2.15045 1.54211 2.20636 1.39941 2.36047C0.821655 2.98157 0.346802 3.71448 0.0463867 4.47614C-0.0283203 4.66504 0.0180664 4.91589 0.185791 5.04736L1.2865 5.90265C1.23499 6.18677 1.21008 6.47693 1.21008 6.76556C1.21008 7.05573 1.23499 7.34583 1.2865 7.62842L0.185791 8.48376C0.0180664 8.61371 -0.043335 8.82526 0.0313721 9.01569C0.331909 9.77728 0.791748 10.5193 1.36951 11.1389C1.51221 11.2915 1.77295 11.3807 1.98206 11.3141L3.3418 10.8744C3.83643 11.2446 4.38928 11.5378 4.98535 11.7418L5.24756 13.0323C5.28748 13.2303 5.4585 13.3845 5.6759 13.4207C6.10925 13.4918 6.59729 13.5356 7.04053 13.5356C7.48389 13.5356 7.92871 13.4993 8.36035 13.4283C8.57788 13.392 8.7937 13.2303 8.8335 13.0323L9.09424 11.7479C9.69519 11.5424 10.2513 11.2507 10.7494 10.8774L12.0991 11.3141C12.3066 11.3807 12.5391 11.3248 12.6818 11.1706C13.2595 10.5495 13.7344 9.81659 14.0348 9.05499C14.1095 8.86908 14.063 8.61823 13.8954 8.48676ZM11.6293 6.0719C11.6708 6.30011 11.6924 6.53436 11.6924 6.76855C11.6924 7.00281 11.6708 7.23706 11.6293 7.46521L11.5197 8.07123L12.7598 9.03687C12.5723 9.43127 12.3348 9.80298 12.0526 10.149L10.512 9.65186L9.99072 10.0417C9.59387 10.338 9.15234 10.5707 8.67419 10.7339L8.04163 10.95L7.74451 12.4158C7.27795 12.4642 6.80151 12.4642 6.33337 12.4158L6.03613 10.947L5.40869 10.7278C4.93555 10.5646 4.49561 10.3319 4.10205 10.0372L3.58081 9.64581L2.03027 10.1475C1.74805 9.80151 1.51221 9.42822 1.323 9.03534L2.57642 8.06061L2.46851 7.45618C2.42871 7.23102 2.4071 6.99829 2.4071 6.76855C2.4071 6.53735 2.427 6.30615 2.46851 6.08099L2.57642 5.4765L1.323 4.50183C1.51062 4.10742 1.74805 3.73566 2.03027 3.38959L3.58081 3.8913L4.10205 3.49994C4.49561 3.20526 4.93555 2.97253 5.40869 2.80933L6.03784 2.5932L6.33496 1.12439C6.80151 1.07599 7.27795 1.07599 7.74609 1.12439L8.04333 2.59021L8.67578 2.80627C9.15234 2.96948 9.59558 3.20221 9.99231 3.49841L10.5137 3.88831L12.0542 3.39111C12.3364 3.73718 12.5723 4.11041 12.7615 4.50336L11.5214 5.46899L11.6293 6.0719ZM7.04224 3.95782C5.42859 3.95782 4.12036 5.14862 4.12036 6.61743C4.12036 8.0863 5.42859 9.2771 7.04224 9.2771C8.65588 9.2771 9.96411 8.0863 9.96411 6.61743C9.96411 5.14862 8.65588 3.95782 7.04224 3.95782ZM8.35706 7.81433C8.00513 8.13318 7.53857 8.31 7.04224 8.31C6.5459 8.31 6.07935 8.13318 5.72742 7.81433C5.37708 7.49396 5.18286 7.06927 5.18286 6.61743C5.18286 6.16565 5.37708 5.74097 5.72742 5.42059C6.07935 5.10022 6.5459 4.92493 7.04224 4.92493C7.53857 4.92493 8.00513 5.10022 8.35706 5.42059C8.7074 5.74097 8.90161 6.16565 8.90161 6.61743C8.90161 7.06927 8.7074 7.49396 8.35706 7.81433Z"
                            fillRule="evenodd"
                            fill="currentColor"
                          />
                        </svg>
                      </Tooltip>
                    </span>
                  </>
                }
              >
                <Descriptions>
                  <Descriptions.Item>
                    <div className={styles.machine}>环境级别 : {item?.ident || '-'}</div>
                  </Descriptions.Item>
                </Descriptions>
                <Descriptions>
                  <Descriptions.Item>
                    <div className={styles.machine}>部署类型 : {item?.deployName || '-'}</div>
                  </Descriptions.Item>
                </Descriptions>
                <Descriptions>
                  <Descriptions.Item>
                    <div
                      style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
                    >
                      <div className={styles.machine}>
                        资源配额 :{' '}
                        {item?.cpu +
                          item?.cpuUnit +
                          '/' +
                          item?.memory +
                          item?.memoryUnit +
                          '/*' +
                          item?.inst}
                      </div>
                      <Tooltip title={item?.ipList?.join(',')}>
                        <a style={{ fontSize: 12, float: 'right' }}>
                          {item?.ipList ? item?.ipList[0] + '等' : ''}
                        </a>
                      </Tooltip>
                    </div>
                  </Descriptions.Item>
                </Descriptions>

                <Divider style={{ margin: '0 0 12px 0' }} />
                <Descriptions>
                  <Descriptions.Item span={1}>
                    <div className={styles.envStatus}>环境状态</div>
                  </Descriptions.Item>
                  <Descriptions.Item span={1}>
                    <div style={{ fontSize: 12, width: '100%', textAlign: 'right' }}>
                      {Number(item.status) === 0 && 'idle 未部署'}
                      {Number(item.status) === 1 && 'deploying 部署中'}
                      {Number(item.status) === 2 && 'success 部署成功'}
                      {Number(item.status) === 3 && 'error 部署异常'}
                      {Number(item.status) === 9 && 'destroyed 已销毁'}
                    </div>
                  </Descriptions.Item>
                </Descriptions>

                <Descriptions>
                  <Descriptions.Item span={1}>
                    <div className={styles.envStatus}>当前版本</div>
                  </Descriptions.Item>
                  <Descriptions.Item span={1}>
                    <div style={{ fontSize: 12, width: '100%', textAlign: 'right' }}>
                      <a
                        target="_blank"
                        href={`${item?.deployInfo?.repo?.replace('.git', '')}/-/commit/${
                          item?.deployInfo.version
                        }`}
                        rel="noreferrer"
                      >
                        {(item?.deployInfo.version?.slice(0, 7) || '') + ' '}
                      </a>
                      <a
                        target="_blank"
                        href={`${item?.deployInfo?.repo?.replace('.git', '')}/-/tree/${
                          item?.deployInfo.branch
                        }`}
                        rel="noreferrer"
                      >
                        {item?.deployInfo.branch || '-'}{' '}
                      </a>
                    </div>
                  </Descriptions.Item>
                </Descriptions>

                <Descriptions>
                  <Descriptions.Item span={1}>
                    <div className={styles.envStatus}>更新时间</div>
                  </Descriptions.Item>
                  <Descriptions.Item span={1}>
                    <div
                      style={{
                        fontSize: 12,
                        width: '100%',
                        textAlign: 'right',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item?.deployInfo.versionTime
                        ? moment(item?.deployInfo.versionTime).format('YYYY-MM-DD HH:mm:ss')
                        : '-'}
                    </div>
                  </Descriptions.Item>
                </Descriptions>

                {/* <Descriptions className={styles.operation}>
                  <Descriptions.Item span={1}>
                    <Button className={styles['operation-button']} type="primary">
                      部署
                    </Button>
                    <Button className={styles['operation-button']} type="primary">
                      回滚
                    </Button>
                  </Descriptions.Item>
                </Descriptions> */}
              </Card>
            </Col>
          );
        })}
    </Row>
  );
};

export default EnvCard;
