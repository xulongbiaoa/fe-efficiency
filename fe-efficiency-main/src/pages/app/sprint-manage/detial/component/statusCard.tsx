import { useState } from 'react';
import { Card, Descriptions, Button, Modal, Tabs } from 'antd';
import { InfoCircleTwoTone, PlusOutlined } from '@ant-design/icons';
import styles from './../index.module.less';
import Tooltip from 'antd/es/tooltip';
import type { ISprintDetial } from '@/services/app/sprint-detial';
import MRListModal from './modals/optionModal/MRList';
import AddFeature from './modals/optionModal/addFeature';
import moment from 'moment';
import { history } from 'umi';

interface IDetial {
  loading: boolean;
  codeInfo: ISprintDetial['codeInfo'];
  envInfo: ISprintDetial['envInfo'];
  features: ISprintDetial['features'];
  currAppId: number;
  version: string;
  repo: string;
  branch: string;
  isLast: boolean;
  status: number | undefined;
  selectFeatureId: number | undefined;
  selectStageIdent: string | undefined;
  selectStage: number;
  stages: any[];
  build: ISprintDetial['build'];
  handleAddFeature: (params: any) => void;
  handleDelFeature: (params: any) => void;
  handleChangeFeature: (params: any) => void;
  handleStartActivity: (params: any) => void;
}
const SprintDetial: React.FC<IDetial> = ({
  loading,
  codeInfo,
  envInfo,
  isLast,
  features = [],
  selectFeatureId,
  selectStageIdent,
  currAppId,
  status,
  selectStage,
  stages = [],
  repo,
  build,
  handleAddFeature,
  handleDelFeature,
  handleChangeFeature,
  handleStartActivity,
}) => {
  const [modalVis, setModalVis] = useState<'none' | 'addFeature' | 'MRList'>('none');
  let currentIndex = 0;
  const { devMode, appId, unitCode } = history.location.query as any;
  stages?.forEach((item, index) => {
    if (item.id === selectStage) {
      currentIndex = index;
    }
  });
  const renderDeceription = () => {
    if (devMode === '20') {
      return (
        <div className={styles.description}>
          <Descriptions>
            <Descriptions.Item style={{ width: 200 }}>
              版本 :&nbsp;
              {build?.versionBigNum ? (
                <a
                  href={`/app-manage/product-manage/?appId=${appId}&unitCode=${unitCode}&devMode=${devMode}&version=${
                    build?.versionBigNum + '.' + (build?.versionSmallNum || 0)
                  }`}
                >
                  {build?.versionBigNum + '.' + (build?.versionSmallNum || 0)}
                </a>
              ) : (
                '-'
              )}
              {envInfo?.latest === true && (
                <Tooltip title={'当前代码版本不是最新'} className={styles.infoIcon}>
                  <InfoCircleTwoTone />
                </Tooltip>
              )}
            </Descriptions.Item>
            <Descriptions.Item style={{ width: 300 }}>
              制品 :&nbsp;
              <a
                href={`/app-manage/product-manage/?appId=${appId}&unitCode=${unitCode}&devMode=${devMode}&artifactName=${
                  build?.artifacts?.map((item: any) => {
                    return item?.artifactName;
                  })?.[0]
                }`}
                rel="noreferrer"
              >
                {build?.artifacts
                  ? build?.artifacts?.map((item: any) => {
                      return item?.artifactName;
                    })?.[0]
                  : '-'}
              </a>
            </Descriptions.Item>
            <Descriptions.Item>
              <div style={{ width: 40 }}>代码 :</div>
              {codeInfo?.branch ? (
                <a
                  target={'_blank'}
                  href={`${repo.replace('.git', '')}/-/tree/${codeInfo?.branch}`}
                  rel="noreferrer"
                >
                  {codeInfo?.branch}
                </a>
              ) : (
                '-'
              )}
              &nbsp;
              {codeInfo?.version ? (
                <a
                  target="_blank"
                  href={`${repo.replace('.git', '')}/-/commit/${codeInfo?.version}`}
                  rel="noreferrer"
                >
                  {codeInfo?.version.slice(0, 7)}
                </a>
              ) : (
                '-'
              )}
              {envInfo?.latest === true && (
                <Tooltip title={'当前代码版本不是最新'} className={styles.infoIcon}>
                  <InfoCircleTwoTone />
                </Tooltip>
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>
      );
    }
    return (
      <div className={styles.description}>
        <Descriptions style={{ width: 800 }}>
          <Descriptions.Item>
            分支 :&nbsp;
            {codeInfo?.branch ? (
              <a
                target={'_blank'}
                href={`${repo.replace('.git', '')}/-/tree/${codeInfo?.branch}`}
                rel="noreferrer"
              >
                {codeInfo?.branch}
              </a>
            ) : (
              '-'
            )}{' '}
          </Descriptions.Item>
          <Descriptions.Item style={{ width: 200 }}>
            版本 :&nbsp;
            {codeInfo?.version ? (
              <a
                target="_blank"
                href={`${repo.replace('.git', '')}/-/commit/${codeInfo?.version}`}
                rel="noreferrer"
              >
                {codeInfo?.version.slice(0, 7)}
              </a>
            ) : (
              '-'
            )}
            {envInfo?.latest === true && (
              <Tooltip title={'当前代码版本不是最新'} className={styles.infoIcon}>
                <InfoCircleTwoTone />
              </Tooltip>
            )}
          </Descriptions.Item>
          <Descriptions.Item style={{ width: 250 }}>
            {/* MR :&nbsp;
        {codeInfo?.mrCount != undefined ? (
          <a
          // onClick={() => {
          //   setModalVis('MRList');
          // }}
          >
            {codeInfo?.mrCount}
          </a>
        ) : (
          '-'
        )} */}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions style={{ width: 800 }}>
          <Descriptions.Item>
            环境 :&nbsp;
            {envInfo?.name ? (
              <a
                href={`/app-manage/env-manage/view?appId=${appId}&unitCode=${unitCode}&envId=${envInfo?.id}`}
              >
                {envInfo?.name}
              </a>
            ) : (
              '-'
            )}{' '}
          </Descriptions.Item>
          <Descriptions.Item style={{ width: 200 }}>
            部署 :&nbsp;
            {envInfo?.version ? (
              <a
                target="_blank"
                href={`${repo.replace('.git', '')}/-/commit/${envInfo?.version}`}
                rel="noreferrer"
              >
                {envInfo?.version.slice(0, 7)}
              </a>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item style={{ width: 250 }}>
            时间 :&nbsp;
            {envInfo?.versionTime
              ? moment(envInfo?.versionTime).format('yyyy-MM-DD HH:mm:ss')
              : '-'}
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  };
  const nextStage: any = stages[currentIndex + 1];

  if (!selectStageIdent?.includes('dev') || devMode === '20') {
    return (
      <div style={{ marginTop: '30px' }} className={styles.feature}>
        <Card style={{ marginBottom: '30px', marginTop: -1 }}>
          <div className={styles.statusCard}>
            {renderDeceription()}
            {!isLast && (
              <Button
                onClick={() => {
                  Modal.confirm({
                    icon: false,
                    className: styles.push,
                    width: 500,
                    content: (
                      <Card title={'推进阶段'} bordered={false}>
                        <Descriptions title={<div style={{ fontWeight: 400 }}>代码信息</div>}>
                          <Descriptions.Item span={2} label="分支">
                            {codeInfo?.branch ? (
                              <a
                                target={'_blank'}
                                href={`${repo.replace('.git', '')}/-/tree/${codeInfo?.branch}`}
                                rel="noreferrer"
                              >
                                {codeInfo?.branch}
                              </a>
                            ) : (
                              '-'
                            )}
                          </Descriptions.Item>
                          <Descriptions.Item span={1} label="版本">
                            {codeInfo?.version ? (
                              <a
                                target="_blank"
                                href={`${repo.replace('.git', '')}/-/commit/${codeInfo?.version}`}
                                rel="noreferrer"
                              >
                                {codeInfo?.version.slice(0, 7)}
                              </a>
                            ) : (
                              '-'
                            )}
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                    ),
                    onOk: () => {
                      handleStartActivity({
                        type: 4,
                      });
                    },
                  });
                }}
                type="primary"
                className={styles.edit}
                disabled={status == 0 || status === 2 || status === 3}
              >
                {nextStage?.status >= 1 ? (
                  '提交到下阶段'
                ) : (
                  <>
                    推进
                    <br />
                    阶段
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '30px' }} className={styles.feature}>
      <Tabs
        style={{ minHeight: 100 }}
        type="editable-card"
        onChange={(key) => {
          handleChangeFeature(key);
        }}
        activeKey={String(selectFeatureId)}
        hideAdd={[2, 3].includes(status as number) || devMode == '20'}
        addIcon={
          devMode !== '20' ? (
            <div>
              <PlusOutlined /> 添加feature
            </div>
          ) : null
        }
        onEdit={(e: any, action) => {
          if (action === 'add') {
            setModalVis('addFeature');
          } else {
            Modal.confirm({
              title: '是否确认删除迭代feature？',
              onOk: () => {
                handleDelFeature(e);
              },
            });
          }
        }}
      >
        {features?.map((item) => {
          return (
            <Tabs.TabPane
              closable={[2, 3].includes(status as number) ? false : true}
              key={item.id}
              style={{ borderRadius: '8px', marginRight: '20px', position: 'relative' }}
              className={styles.delContainer}
              tab={item.name}
            >
              <Card style={{ marginBottom: '30px', marginTop: -1 }}>
                <div className={styles.statusCard}>
                  {renderDeceription()}
                  {!isLast && (
                    <Button
                      onClick={() => {
                        Modal.confirm({
                          icon: false,
                          className: styles.push,
                          width: 500,
                          content: (
                            <Card title={'推进阶段'} bordered={false}>
                              <Descriptions title={<div style={{ fontWeight: 400 }}>代码信息</div>}>
                                <Descriptions.Item span={2} label="分支">
                                  {codeInfo?.branch ? (
                                    <a
                                      target={'_blank'}
                                      href={`${repo.replace('.git', '')}/-/tree/${
                                        codeInfo?.branch
                                      }`}
                                      rel="noreferrer"
                                    >
                                      {codeInfo?.branch}
                                    </a>
                                  ) : (
                                    '-'
                                  )}
                                </Descriptions.Item>
                                <Descriptions.Item span={1} label="版本">
                                  {codeInfo?.version ? (
                                    <a
                                      target="_blank"
                                      href={`${repo.replace('.git', '')}/-/commit/${
                                        codeInfo?.version
                                      }`}
                                      rel="noreferrer"
                                    >
                                      {codeInfo?.version.slice(0, 7)}
                                    </a>
                                  ) : (
                                    '-'
                                  )}
                                </Descriptions.Item>
                              </Descriptions>
                            </Card>
                          ),
                          onOk: () => {
                            handleStartActivity({
                              type: 4,
                            });
                          },
                        });
                      }}
                      type="primary"
                      className={styles.edit}
                      disabled={status == 0 || status === 2 || status === 3}
                    >
                      {nextStage?.status >= 1 ? (
                        '提交到下阶段'
                      ) : (
                        <>
                          推进
                          <br />
                          阶段
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            </Tabs.TabPane>
          );
        })}
      </Tabs>

      <AddFeature
        onOk={handleAddFeature}
        currAppId={currAppId}
        loading={loading}
        modalVisible={modalVis === 'addFeature'}
        onClose={() => {
          setModalVis('none');
        }}
      />
      <MRListModal
        modalVisible={modalVis === 'MRList'}
        onClose={() => {
          setModalVis('none');
        }}
      />
    </div>
  );
};
export default SprintDetial;
