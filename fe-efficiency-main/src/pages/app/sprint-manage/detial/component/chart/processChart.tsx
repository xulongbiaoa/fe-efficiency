import { memo, useEffect } from 'react';
import type react from 'react';
import { usePrevious } from '@ant-design/pro-utils';

import { Button, Tooltip, Typography, Tag, Card } from 'antd';
import styles from './../../index.module.less';
import { SyncOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

import moment from 'moment';
import { history } from 'umi';
interface IProcessChartProps {
  record: any;
  envId: number;
  width: number;
  repo: string;
  nextStageId: number | undefined;
  handleGetSprintDetial: (id: any) => void;
  setEnvId: (id: any) => void;
  setIsStagePush: (isStagePush: boolean) => void;
  latestStatePush: any;
  isStagePush: boolean;
}
const { Text, Paragraph } = Typography;

const Item: any = ({ data }: any) => {
  return (
    <div className={styles['template-chart']}>
      {(data || []).map((item: any[]) => {
        return item.map(({ name, status, link }) => {
          const nodeColors = {
            [-1]: styles.error,
            3: styles.error,
            9: styles.error,

            0: styles.unStart,
            5: styles.unStart,

            1: styles.progress,
            6: styles.progress,
            10: styles.progress,
            7: styles.progress,
            8: styles.progress,

            4: styles.warning,

            2: styles.compete,
          };
          return (
            <div className={styles.node} key={Math.random()}>
              <div className={styles['task-container']}>
                <Button
                  onClick={() => {
                    if (link) {
                      if (link.includes('http')) {
                        window.open(link);
                        return;
                      }
                      history.push(link);
                    }
                  }}
                  className={nodeColors[status]}
                  style={{
                    width: '120px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 12,
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}
                  shape="round"
                >
                  <Tooltip title={name}>
                    <Text
                      style={{
                        display: 'block',
                        height: 12,
                        lineHeight: '1em',
                        verticalAlign: 'middle',
                        textAlign: 'left',
                        color: 'inherit',
                        overflow: 'hidden',
                      }}
                      ellipsis={{ tooltip: name }}
                    >
                      {name}
                    </Text>
                  </Tooltip>
                  <span style={{ transform: 'translateY(2px)' }}>
                    {[-1, 3, 9].includes(status) && (
                      <svg
                        width="16.000000"
                        height="16.000000"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g>
                          <path
                            d="M8.01088 1.17883C4.14308 1.17883 1.00763 4.31429 1.00763 8.18208C1.00763 12.0499 4.14308 15.1853 8.01088 15.1853C11.8787 15.1853 15.0141 12.0499 15.0141 8.18208C15.0141 4.31429 11.8787 1.17883 8.01088 1.17883ZM10.792 10.2689C10.9836 10.4607 10.9836 10.7716 10.792 10.9631C10.6 11.1548 10.2893 11.1548 10.0974 10.9631L8.01432 8.87999L5.93108 10.9631C5.7393 11.1548 5.42857 11.1548 5.23663 10.9631C5.04499 10.7716 5.04499 10.4607 5.23663 10.2689L7.31999 8.18524L5.23663 6.10216C5.04499 5.91066 5.04499 5.59949 5.23663 5.40772C5.42855 5.21622 5.7393 5.21622 5.93108 5.40772L8.01432 7.49108L10.0974 5.40772C10.2893 5.21622 10.6001 5.21622 10.792 5.40772C10.9836 5.5995 10.9836 5.91068 10.792 6.10216L8.7086 8.18524L10.792 10.2689Z"
                            fill="#FD7B7C"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip963_387">
                            <rect width="16.000000" height="16.000000" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    )}
                    {[2].includes(status) && (
                      <svg
                        width="14.000000"
                        height="14.000000"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g>
                          <path
                            d="M0 7C0 7.92826 0.177612 8.82119 0.532837 9.67878C0.888062 10.5364 1.39386 11.2934 2.05026 11.9497C2.70663 12.6061 3.46362 13.1119 4.32123 13.4672C5.1788 13.8224 6.07175 14 7 14C7.92825 14 8.8212 13.8224 9.67877 13.4672C10.5364 13.1119 11.2934 12.6061 11.9497 11.9497C12.6061 11.2934 13.1119 10.5364 13.4672 9.67878C13.8224 8.82119 14 7.92826 14 7C14 6.07174 13.8224 5.17881 13.4672 4.32122C13.1119 3.46362 12.6061 2.70663 11.9497 2.05025C11.2934 1.39388 10.5364 0.888073 9.67877 0.532845C8.8212 0.177616 7.92825 0 7 0C6.07175 0 5.1788 0.177616 4.32123 0.532845C3.46362 0.888073 2.70663 1.39388 2.05026 2.05025C1.39386 2.70663 0.888062 3.46362 0.532837 4.32122C0.177612 5.17881 0 6.07174 0 7Z"
                            fillRule="evenodd"
                            fill="#6BD424"
                          />
                          <path
                            d="M2.44202 7.62698C2.17892 7.35304 2.18176 7.08187 2.45047 6.81346C2.71921 6.54506 2.99039 6.54256 3.26401 6.80598L4.43903 8.00398C4.70242 8.2776 4.69992 8.54878 4.43152 8.81751C4.16312 9.08624 3.89197 9.08907 3.61801 8.82598L2.44202 7.62698ZM10.112 4.20698C10.3605 3.90485 10.6346 3.87953 10.9342 4.13103C11.2339 4.38253 11.2565 4.65685 11.002 4.95398L5.39301 9.91998C5.14355 10.2112 4.87195 10.2336 4.57825 9.98705C4.28452 9.74052 4.25943 9.46916 4.50302 9.17298L10.112 4.20698Z"
                            fillRule="evenodd"
                            fill="#FFFFFF"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip963_360">
                            <rect width="14.000000" height="14.000000" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    )}
                    {[1, 6, 7, 8, 10].includes(status) && (
                      <span className={styles.svgWrapper}>
                        <SyncOutlined spin={true} />
                      </span>
                    )}
                    {[0, 5].includes(status) && (
                      <svg
                        width="16.000000"
                        height="16.000000"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g>
                          <path
                            d="M7.99998 14.6667C4.31815 14.6667 1.33331 11.6819 1.33331 8.00004C1.33331 4.31821 4.31815 1.33337 7.99998 1.33337C11.6818 1.33337 14.6666 4.31821 14.6666 8.00004C14.6666 11.6819 11.6818 14.6667 7.99998 14.6667ZM7.99998 13.6667C11.1296 13.6667 13.6666 11.1297 13.6666 8.00004C13.6666 4.87038 11.1296 2.33337 7.99998 2.33337C4.87032 2.33337 2.33331 4.87038 2.33331 8.00004C2.33331 11.1297 4.87032 13.6667 7.99998 13.6667ZM5.49998 7.50004L10.5 7.50004C10.8333 7.50004 11 7.66671 11 8.00004C11 8.33337 10.8333 8.50004 10.5 8.50004L5.49998 8.50004C5.16664 8.50004 4.99998 8.33337 4.99998 8.00004C4.99998 7.66671 5.16664 7.50004 5.49998 7.50004Z"
                            fillRule="evenodd"
                            fill="#A9A9A9"
                          />
                        </g>
                        <defs>
                          <rect width="16.000000" height="16.000000" fill="white" />
                        </defs>
                      </svg>
                    )}
                  </span>
                </Button>
              </div>
            </div>
          );
        });
      })}
    </div>
  );
};
const ProcessChart: react.FC<IProcessChartProps> = ({
  record,
  repo,
  handleGetSprintDetial,
  setIsStagePush,
  isStagePush,
  nextStageId,
  envId,
  setEnvId,
  latestStatePush,
  // loopId,
  // handleGetActivityDetial,
}) => {
  const { devMode, appId, unitCode } = history.location.query as any;
  const statusMap = {
    [-1]: { text: '异常状态', color: 'error' },
    0: { text: '未执行', color: 'default' },
    1: { text: '处理中', color: 'processing' },
    2: { text: '完成', color: 'success' },
    3: { text: '失败', color: 'error' },
    4: { text: '待处理', color: 'warning' },
    5: { text: '待审批', color: 'default' },
    6: { text: '审批中', color: 'processing' },
    7: { text: '审批通过待部署', color: 'processing' },
    8: { text: '系统自动通过待部署', color: 'processing' },
    9: { text: '审批拒绝', color: 'error' },
    10: { text: '部署中', color: 'processing' },
  };

  const preStatus = usePrevious(record.activityStatus);
  // const [data, setData] = useState(record);
  // const timer = useRef<any>();
  const handleResult = (item: any) => {
    let result: any;

    switch (item.activityType) {
      case 'PIPELINE':
        if (devMode === '20') {
          result = (
            <div>
              <a> {item?.createUname}&nbsp;</a>
              <Tooltip title={moment(item.createTime).format('yyyy-MM-DD HH:mm:ss') + ' '}>
                {moment(item.createTime).fromNow() + ' '}
              </Tooltip>
              &nbsp;
              {item?.activityInfo?.pipelineName && `主动触发流水线`}&nbsp;
              <a
                href={`/pipeline/detail?pipelineId=${item?.activityInfo?.pipelineId}&&targetRunLogId=${item?.activityInfo?.pipeRunLogId}`}
              >
                {item?.activityInfo?.pipelineName}
              </a>
              &nbsp;{item?.activityInfo?.pipelineName && '执行'}
              {item?.activityInfo?.targetBranch && (
                <>
                  ，代码分支&nbsp;
                  <a
                    target={'_blank'}
                    href={`${repo.replace('.git', '')}/-/tree/${item?.activityInfo?.targetBranch}`}
                    rel="noreferrer"
                  >
                    {item?.activityInfo?.targetBranch}
                  </a>
                </>
              )}
              {item?.activityInfo?.targetVersion && (
                <>
                  ，版本&nbsp;
                  <a
                    target={'_blank'}
                    href={`${repo.replace('.git', '')}/-/commit/${
                      item?.activityInfo?.targetVersion
                    }`}
                    rel="noreferrer"
                  >
                    {item?.activityInfo?.targetVersion || ''}
                  </a>
                </>
              )}
              {JSON.parse(item?.activityInfo?.artifacts)?.artifacts[0]?.artifactName && (
                <>
                  ，生成制品&nbsp;
                  <a
                    href={`/app-manage/product-manage/?appId=${appId}&unitCode=${unitCode}&devMode=${devMode}&artifactName=${
                      JSON.parse(item?.activityInfo?.artifacts)?.artifacts[0]?.artifactName
                    }`}
                    rel="noreferrer"
                  >
                    {JSON.parse(item?.activityInfo?.artifacts)?.artifacts[0]?.artifactName}
                  </a>
                </>
              )}
              &nbsp; &nbsp;
            </div>
          );
        } else {
          result = (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <a> {item?.createUname}&nbsp;</a>
              <Tooltip title={moment(item.createTime).format('yyyy-MM-DD HH:mm:ss') + ' '}>
                {moment(item.createTime).fromNow() + ' '}
              </Tooltip>
              &nbsp;
              {item?.activityInfo?.pipelineName && `主动触发流水线`}&nbsp;
              <a
                href={`/pipeline/detail?pipelineId=${item?.activityInfo?.pipelineId}&&targetRunLogId=${item?.activityInfo?.pipeRunLogId}`}
              >
                {item?.activityInfo?.pipelineName}
              </a>
              &nbsp;{item?.activityInfo?.pipelineName && '执行'} ，
              {item?.activityExt2 && `代码版本`}
              &nbsp;
              {item?.activityExt2 && (
                <a
                  target={'_blank'}
                  href={`${repo.replace('.git', '')}/-/commit/${item?.activityExt2}`}
                  rel="noreferrer"
                >
                  {item?.activityExt2?.slice(0, 7)}
                </a>
              )}
              &nbsp;
            </div>
          );
        }

        break;
      case 'COMMIT':
        result = (
          <div>
            <a> {item?.createUname}&nbsp;</a>
            <Tooltip title={moment(item.createTime).format('yyyy-MM-DD HH:mm:ss') + ' '}>
              {moment(item.createTime).fromNow() + ' '}
            </Tooltip>
            {`提交代码 `}
            {
              <a
                target={'_blank'}
                href={`${repo.replace('.git', '')}/-/commit/${item?.activityInfo?.targetVersion}`}
                rel="noreferrer"
              >
                {item.activityInfo?.targetVersion?.slice(0, 7)}
              </a>
            }
            &nbsp;
            {item?.activityInfo?.pipelineName && `自动触发流水线`}&nbsp;
            <a
              href={`/pipeline/detail?pipelineId=${item?.activityInfo?.pipelineId}&&targetRunLogId=${item?.activityInfo?.pipeRunLogId}`}
            >
              {item?.activityInfo?.pipelineName}
            </a>
            &nbsp;{item?.activityInfo?.pipelineName && '执行'}
          </div>
        );

        break;
      case 'STAGE_PUSH':
        result = (
          <div>
            <a> {item?.createUname}&nbsp;</a>
            <Tooltip title={moment(item.createTime).format('yyyy-MM-DD HH:mm:ss') + ' '}>
              {moment(item.createTime).fromNow() + ' '}
            </Tooltip>
            从&nbsp;
            <a
              target={'_blank'}
              href={`${repo.replace('.git', '')}/-/commit/${item?.activityInfo?.sourceVersion}`}
              rel="noreferrer"
            >
              {item?.activityInfo?.sourceBranch}&nbsp;
              {item?.activityInfo?.sourceVersion?.slice(0, 7)}&nbsp;
            </a>
            &nbsp;发起{item?.activityInfo?.yesOnlyPushCode ? '合入下一阶段' : '推进阶段'}
          </div>
        );
        break;
      case 'STAGE_PUSH_IN':
        const afterStr =
          item?.activityInfo.mrType !== 'MR_MAIN' ? (
            <>
              {item?.activityExt2 && `，生成版本`}&nbsp;
              {item?.activityExt2 && (
                <a
                  target={'_blank'}
                  href={`${repo.replace('.git', '')}/-/commit/${item?.activityExt2}`}
                  rel="noreferrer"
                >
                  {item?.activityExt2?.slice(0, 7)}
                </a>
              )}
              &nbsp;
              {item?.activityInfo?.pipelineName && `触发流水线`}&nbsp;
              <a
                href={`/pipeline/detail?pipelineId=${item?.activityInfo?.pipelineId}&&targetRunLogId=${item?.activityInfo?.pipeRunLogId}`}
              >
                {item?.activityInfo?.pipelineName}
              </a>
              &nbsp;{item?.activityInfo?.pipelineName && '执行'}
              &nbsp;
              {item?.activityInfo.mrType === 'MR_MAIN' && '并自动合入主干main'}
            </>
          ) : (
            <>
              {item?.activityInfo?.pipelineName && `触发流水线`}&nbsp;
              <a
                href={`/pipeline/detail?pipelineId=${item?.activityInfo?.pipelineId}&&targetRunLogId=${item?.activityInfo?.pipeRunLogId}`}
              >
                {item?.activityInfo?.pipelineName}
              </a>
              &nbsp;{item?.activityInfo?.pipelineName && '执行'}&nbsp;, &nbsp;
              {item?.activityInfo.mrType === 'MR_MAIN' && '并自动合入主干main'}
              &nbsp;
              {item?.activityExt2 && `，生成版本`}&nbsp;
              {item?.activityExt2 && (
                <a
                  target={'_blank'}
                  href={`${repo.replace('.git', '')}/-/commit/${item?.activityExt2}`}
                  rel="noreferrer"
                >
                  {item?.activityExt2?.slice(0, 7)}
                </a>
              )}
              &nbsp;
            </>
          );
        result = (
          <div>
            <a> {item?.createUname}&nbsp;</a>
            <Tooltip title={moment(item.createTime).format('yyyy-MM-DD HH:mm:ss') + ' '}>
              {moment(item.createTime).fromNow() + ' '}
            </Tooltip>
            &nbsp;
            {`提交${item?.activityInfo.mrType === 'MR_MAIN' ? '测试' : '开发'}阶段代码 `}
            &nbsp;
            {
              <a
                target={'_blank'}
                href={`${repo.replace('.git', '')}/-/commit/${item?.activityInfo?.sourceVersion}`}
                rel="noreferrer"
              >
                {item.activityInfo?.sourceVersion?.slice(0, 7)}
              </a>
            }
            &nbsp;
            {`至${item?.activityInfo.mrType === 'MR_MAIN' ? '正式' : '测试'}阶段`}
            &nbsp;
            {afterStr}
          </div>
        );
        break;
      case 'SYNC_MAIN':
        result = (
          <div>
            <a> {item?.createUname}&nbsp;</a>
            <Tooltip title={moment(item.createTime).format('yyyy-MM-DD HH:mm:ss') + ' '}>
              {moment(item.createTime).fromNow() + ' '}
            </Tooltip>
            &nbsp;从 <a>{item?.activityInfo?.sourceBranch}</a>&nbsp;同步主干
            <a>{item?.activityInfo?.targetBranch}</a>
            {item?.activityInfo?.yesPipeReactive &&
              `${item?.activityInfo?.yesFromGit ? '自动' : ''} ${
                item?.activityInfo?.yesFromGit === false ? '手动' : ''
              } `}
            {item?.activityInfo?.pipelineName && `触发流水线`}&nbsp; &nbsp;
            <a
              href={`/pipeline/detail?pipelineId=${item?.activityInfo?.pipelineId}&&targetRunLogId=${item?.activityInfo?.pipeRunLogId}`}
            >
              {item?.activityInfo?.pipelineName}
            </a>
            {item?.activityInfo?.pipelineName && '执行'}
          </div>
        );
        break;
      case 'MR':
        result = (
          <div>
            <a> {item?.createUname}&nbsp;</a>
            <Tooltip title={moment(item.createTime).format('yyyy-MM-DD HH:mm:ss') + ' '}>
              {moment(item.createTime).fromNow() + ' '}
            </Tooltip>
            &nbsp;从&nbsp;
            <a
              target={'_blank'}
              href={`${repo.replace(
                '.git',
                '',
              )}/-/commit/${item?.activityInfo?.sourceVersion?.slice(0, 7)}`}
              rel="noreferrer"
            >
              {item?.activityInfo?.sourceBranch}&nbsp;
              {item?.activityInfo?.sourceVersion?.slice(0, 7)}&nbsp;
            </a>
            {item?.activityInfo.mrType === 'SYNC_MAIN' ? '同步主干至' : '合入MR至'}&nbsp;
            <a
              target={'_blank'}
              href={`${repo.replace('.git', '')}/-/tree/${item?.activityInfo?.targetBranch}`}
              rel="noreferrer"
            >
              {item?.activityInfo?.targetBranch}
            </a>
            {item?.activityExt2 && ` 生成版本 `}
            {item?.activityExt2 && (
              <a
                target={'_blank'}
                href={`${repo.replace('.git', '')}/-/commit/${item?.activityExt2}`}
                rel="noreferrer"
              >
                {item?.activityExt2?.slice(0, 7)}
              </a>
            )}
            {item?.activityInfo?.yesPipeReactive &&
              `${item?.activityInfo?.yesFromGit ? '自动' : ''} ${
                item?.activityInfo?.yesFromGit === false ? '手动' : ''
              } `}
            {item?.activityInfo?.pipelineName && `触发流水线`}&nbsp;
            <a
              href={`/pipeline/detail?pipelineId=${item?.activityInfo?.pipelineId}&&targetRunLogId=${item?.activityInfo?.pipeRunLogId}`}
            >
              {item?.activityInfo?.pipelineName}
            </a>
            {item?.activityInfo?.pipelineName && ' 执行'}
          </div>
        );
        break;
      case 'RESTART':
        result = (
          <div>
            <a> {item?.createUname}&nbsp;</a>
            <Tooltip title={moment(item.createTime).format('yyyy-MM-DD HH:mm:ss') + ' '}>
              {moment(item.createTime).fromNow() + ' '}
            </Tooltip>
            &nbsp;发起环境重启操作
          </div>
        );
        break;
      case 'DEPLOY':
        result = (
          <div>
            <a> {item?.createUname}&nbsp;</a>
            <Tooltip title={moment(item.createTime).format('yyyy-MM-DD HH:mm:ss') + ' '}>
              {moment(item.createTime).fromNow() + ' '}
            </Tooltip>
            &nbsp;发起环境部署操作
          </div>
        );
        break;
      case 'ROLLBACK':
        result = (
          <div>
            <a> {item?.createUname}&nbsp;</a>
            <Tooltip title={moment(item.createTime).format('yyyy-MM-DD HH:mm:ss') + ' '}>
              {moment(item.createTime).fromNow() + ' '}
            </Tooltip>
            &nbsp;发起部署回滚操作
          </div>
        );
        break;
      default:
        result = <div />;
    }
    return result;
  };

  // const handleGetDetial = () => {
  //   timer.current = setTimeout(async () => {
  //     const res = await handleGetActivityDetial(loopId as number);
  //     if (res.success) {
  //       console.log(res.data);
  //       setData(res.data);
  //       if (res.data.status <= 1) {
  //         handleGetDetial();
  //       }
  //     } else {
  //       handleGetDetial();
  //     }
  //   }, 1000);
  // };
  // useEffect(() => {
  //   if (loopId !== undefined && record.id === loopId) {
  //     handleGetDetial();
  //   }
  //   return () => {
  //     clearTimeout(timer.current);
  //   };
  // }, [loopId]);
  const renderQualityStatus = (quality: any) => {
    return (
      <Paragraph style={{ transform: 'translateX(-10px)' }}>
        <ul>
          <li>
            {quality.name}：
            {quality.status === 1 ? (
              <CheckOutlined style={{ color: '#6bd424', fontSize: '18px' }} />
            ) : (
              <CloseOutlined style={{ color: 'red', fontSize: '18px' }} />
            )}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{quality.statusInfo}
          </li>
        </ul>
      </Paragraph>
    );
  };

  useEffect(() => {
    if (
      record.activityStatus === 2 &&
      preStatus !== record.activityStatus &&
      preStatus !== undefined
    ) {
      if (record.activityType === 'STAGE_PUSH') {
        handleGetSprintDetial(nextStageId);
        latestStatePush.current = 0;
        setIsStagePush(false);
      }
    } else if (
      record.activityStatus === 2 &&
      isStagePush &&
      record.id === latestStatePush.current
    ) {
      if (record.activityType === 'STAGE_PUSH' && record.qualityStatus[0]?.status === 1) {
        handleGetSprintDetial(nextStageId);
      }
      latestStatePush.current = 0;
      setIsStagePush(false);
    }
  }, [record.activityStatus, latestStatePush.current, isStagePush]);
  return (
    <Card style={{ marginBottom: 10 }}>
      <div className={styles['activity-des']}>
        <div
          className={styles.text}
          style={{ verticalAlign: 'middle', transform: 'translateX(-10px)' }}
        >
          {handleResult(record)}
          <div style={{ marginLeft: 24, marginTop: -2 }}>
            <Tag color={statusMap[record?.activityStatus]?.color}>
              {record?.activityStatus !== undefined && statusMap[record?.activityStatus]?.text}
            </Tag>
          </div>
        </div>
        {/* <div className={styles.button}>
                <Button type="link">
                  <SyncOutlined />
                  重新执行
                </Button>
              </div> */}
      </div>

      <div
        style={{
          minHeight: 40,
          paddingTop: 20,
          paddingLeft: 14,
        }}
      >
        {record?.qualityStatus &&
          record?.qualityStatus.map((quality: any) => {
            return renderQualityStatus(quality);
          })}

        {(record?.activityResultFlow.flowNodes || record?.activityResultFlow).map((node: any) => {
          const names: any[] = [];
          let link: string = node.meta?.webUrl || '';

          if (record?.activityInfo?.pipelineId && record?.activityInfo?.pipeRunLogId) {
            link = `/pipeline/detail?pipelineId=${record?.activityInfo?.pipelineId}&&targetRunLogId=${record?.activityInfo?.pipeRunLogId}`;
          }
          if (node.meta?.deployOrderID) {
            setEnvId(envId);
            link = `/app-manage/env-manage/deploy-order?appId=${appId}&unitCode=${unitCode}&envId=${envId}&deployId=${node.meta?.deployOrderID}`;
          }
          if (node.parallel) {
            names.push(
              node.parallel.map((item: any) => ({
                name: (
                  <>
                    {item.name} +{' '}
                    {node.meta?.unFinishDeployOrderIDs
                      ? '存在未完成的部署单' + node.meta?.unFinishDeployOrderIDs
                      : ''}
                  </>
                ),
                status: item.status,
                link,
              })),
            );
          } else {
            names.push([
              {
                name: (
                  <>
                    {node.name}
                    {node.meta?.unFinishDeployOrderIDs && '存在未完成的部署单: '}
                    {node.meta?.unFinishDeployOrderIDs?.map((item: any) => {
                      return (
                        <a
                          style={{ marginRight: 10 }}
                          key={item}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setEnvId(envId);
                            link = `/app-manage/env-manage/deploy-order?appId=${appId}&unitCode=${unitCode}&envId=${envId}&deployId=${item}`;
                            history.push(link);
                          }}
                        >
                          {item}
                        </a>
                      );
                    })}
                  </>
                ),
                status: node.status,
                link,
              },
            ]);
          }

          return <Item key={Math.random()} data={names} />;
        })}
      </div>
      {record?.remarks && record.activityStatus !== 2 && (
        <div style={{ marginTop: 10, color: 'red' }}>{record?.remarks}</div>
      )}
    </Card>
  );
};

export default memo(ProcessChart, (pre) => {
  if (pre.record.activityStatus === 1) {
    return false;
  }
  return true;
});
