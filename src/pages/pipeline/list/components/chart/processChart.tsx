import type react from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { PIPELINE_MODE } from '../../../enum';
import styles from './../../index.module.less';
interface IprocessChartProps {
  data: any[];
  id?: number;
  title: string;
  width: number;
}

const changeByte = (str: string) => {
  let count = 0;
  if (str) {
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 255) {
        count += 2;
      } else {
        count++;
      }
    }
  }
  return count;
};

const Item: any = ({ data }: any) => {
  return (
    <div className={styles['template-chart']}>
      {data.map((item: any[]) => {
        return item.map((name) => {
          return (
            <div className={styles.node} key={'item'}>
              <div className={styles['task-container']}>
                <Button style={{ width: '100px', fontSize: 12 }} shape="round">
                  <Tooltip title={name}>
                    {changeByte(name) > 13 ? name.slice(0, 7) + '...' : name}
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
const ProcessChart: react.FC<IprocessChartProps> = ({ data, title, id }) => {
  return (
    <>
      <div
        id={'container' + title}
        style={{
          backgroundColor: '#eaf9ff',
          minHeight: 100,
          paddingBottom: 20,
        }}
      >
        <div
          style={{
            marginLeft: 20,
            paddingTop: 10,
            paddingBottom: 10,
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
            paddingRight: 20,
          }}
        >
          {title}
          <a
            href={`/pipeline/edit?templateId=${id}&mode=${PIPELINE_MODE.EDIT_TEMPLATE}`}
            className={styles['edit-able']}
          >
            <EditOutlined />
          </a>
        </div>
        <div>
          {data.map((node) => {
            const names: any[] = [];
            if (node.parallel) {
              names.push(node.parallel.map((item: any) => item.name));
            } else {
              names.push([node.name]);
            }
            return <Item key={node.id} data={names} />;
          })}
        </div>
      </div>
    </>
  );
};

export default ProcessChart;
