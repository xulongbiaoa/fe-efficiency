import React, { ReactNode } from 'react';
import styles from './index.module.less';

interface IBaseCard {
  title: string;
  children?: ReactNode;
  renderAction?: () => any;
}

const BaseCard: React.FC<IBaseCard> = (props: IBaseCard) => {
  return (
    <div className={styles['content-editor']}>
      <div className={styles['head']}>
        <div className={styles['title']}>{props.title}</div>
        <div className={styles['buttons']}>{props.renderAction && props.renderAction()}</div>
      </div>
      <div className={styles['body']}>{props.children}</div>
    </div>
  );
};

export default BaseCard;
