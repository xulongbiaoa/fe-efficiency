import { Col, Modal, Row, Menu, Spin } from 'antd';

import React, { useRef, useState, useEffect } from 'react';
import styles from './index.module.less';

interface ILogMenu {
  id: number;
  runLogId: number;
  stageId: string;
  stageName: string;
  stepId: string;
  stepName: string;
  stepStatus: string;
  durationMillis: number;
  startTimeMillis: number;
}

interface ILogViewModal {
  modalVisible: boolean;
  title: string;
  getLogMenu: () => { data: ILogMenu[]; success: boolean };
  onClose: () => void;
  getLogItem: (id: number) => { data: string; success: boolean };
}

const PipelineModal: React.FC<ILogViewModal> = ({
  modalVisible,
  title,
  getLogMenu,
  onClose,
  getLogItem,
}) => {
  const containerRef = useRef<any>(null);
  const [logMenuloading, setLogMenuloading] = useState(false);
  const [logItemLoading, setLogItemLoading] = useState(false);
  const [logMenu, setLogMenu] = useState<ILogMenu[]>([]);
  const [selectedItem, setSelectItem] = useState<any>({});

  const [code, setCode] = useState<any>([]);

  const handleGetItem = async () => {
    try {
      setLogItemLoading(true);
      const res: any = await getLogItem(selectedItem.id);
      if (res.success) {
        if (res.data.logTxt !== null) {
          setCode(
            res.data.logTxt.split('\n').map((item: any) => {
              return item.trim();
            }),
          );
        } else {
          setCode([]);
        }
      }
      setLogItemLoading(false);
    } catch (error) {
      setLogItemLoading(false);
    }
  };
  const handleGetMenu = async () => {
    try {
      setLogMenuloading(true);
      const res: any = await getLogMenu();
      if (res.success) {
        setLogMenu(res.data.rows);
        setSelectItem(res.data.rows[0]);
      }
      setLogMenuloading(false);
    } catch (error) {
      console.log(error);
      setLogMenuloading(false);
    }
  };

  useEffect(() => {
    if (modalVisible) {
      handleGetMenu();
    }
  }, [modalVisible]);
  useEffect(() => {
    return () => setSelectItem({});
  }, []);
  useEffect(() => {
    containerRef.current?.scrollTo(0, 0);
    if (modalVisible && selectedItem?.id) {
      handleGetItem();
    }
  }, [selectedItem, modalVisible]);

  return modalVisible ? (
    <Modal
      visible={true}
      title={title}
      footer={() => {}}
      className={styles.logsModal}
      onCancel={() => {
        onClose();
      }}
    >
      <Row style={{ height: '100%', position: 'relative' }}>
        <Col span={4} className={styles.logSidebar}>
          <div>
            <Spin spinning={logMenuloading}>
              <Menu selectedKeys={[String(selectedItem?.id)]}>
                {logMenu.map((item: any) => {
                  return (
                    <Menu.Item
                      onClick={() => {
                        setSelectItem(item);
                      }}
                      key={item.id}
                      className={styles.menuItem}
                    >
                      {item?.stepName}
                      {item?.durationMillis !== undefined && '( ' + item.durationMillis + 's )'}
                    </Menu.Item>
                  );
                })}
              </Menu>
            </Spin>
          </div>
        </Col>
        <Col span={20} className={styles.logContent}>
          <div className={styles['logContent-title']}>
            {selectedItem?.stepName}
            {selectedItem?.durationMillis !== undefined &&
              '( ' + selectedItem.durationMillis + 's )'}
          </div>
          <Spin spinning={logItemLoading}>
            <div
              ref={(ref) => {
                if (ref) {
                  containerRef.current = ref as HTMLElement;
                }
              }}
              className={styles['logContent-code']}
            >
              {code.map((item: string) => {
                const str = '\n' + item.trim() + '\n';
                return (
                  <div key={Math.random()}>
                    <code style={{ color: '#fff' }}>{str}</code>
                  </div>
                );
              })}
            </div>
          </Spin>
        </Col>
      </Row>
    </Modal>
  ) : null;
};
export default PipelineModal;
