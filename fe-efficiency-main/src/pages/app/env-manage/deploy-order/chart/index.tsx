import type react from 'react';
import { memo } from 'react';

import { Button, Tooltip, Typography } from 'antd';
import styles from './../index.module.less';

import { history } from 'umi';

interface IProcessChartProps {
  record: any;
  width?: number;
}
const { Text } = Typography;

const Item: any = ({ data }: any) => {
  return (
    <div className={styles['template-chart']}>
      {(data || []).map((item: any[]) => {
        return item.map(({ name, status, link }) => {
          const nodeColors = {
            0: styles.unStart,
            1: styles.progress,
            2: styles.compete,
            3: styles.error,
            4: styles.warning,
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
                  style={{ width: '120px', fontSize: 12 }}
                  shape="round"
                >
                  <Tooltip title={name}>
                    <Text
                      style={{ width: 50, textAlign: 'left', color: 'inherit' }}
                      ellipsis={{ tooltip: name }}
                    >
                      {name}
                    </Text>
                  </Tooltip>
                </Button>
              </div>
            </div>
          );
        });
      })}
    </div>
  );
};
const ProcessChart: react.FC<IProcessChartProps> = ({ record }) => {
  return (
    <div
      style={{
        paddingLeft: 10,
        borderRadius: 5,
      }}
    >
      <div
        style={{
          minHeight: 40,
          paddingLeft: 14,
        }}
      >
        {(record?.flowNodes).map((node: any) => {
          const names: any[] = [];

          let link: string = node.meta?.webUrl || '';
          if (node.meta?.instanceId && node?.meta.runLogId) {
            const { appId, unitCode } = history.location.query as any;
            link = `/pipeline/detail?pipelineId=${node.meta?.instanceId}&&targetRunLogId=${node?.meta.runLogId}&&appId=${appId}&&unitCode=${unitCode}`;
          }
          if (node.parallel) {
            names.push(
              node.parallel.map((item: any) => ({
                name: item.name,
                status: item.status,
                link,
              })),
            );
          } else {
            names.push([
              {
                name: node.name,
                status: node.status,
                link,
              },
            ]);
          }

          return <Item key={Math.random()} data={names} />;
        })}
      </div>
    </div>
  );
};

export default memo(ProcessChart);
