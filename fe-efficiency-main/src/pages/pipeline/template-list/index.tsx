import { Card } from 'antd';

import styles from './index.module.less';

import React from 'react';
import TableItem from './components/TableItem';
const TableList: React.FC = () => {
  return (
    <div className={styles.container}>
      <Card title="">
        <TableItem />
      </Card>
    </div>
  );
};

export default TableList;
