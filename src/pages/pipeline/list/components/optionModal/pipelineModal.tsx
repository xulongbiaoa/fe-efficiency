/* eslint-disable @typescript-eslint/no-shadow */
import { Col, Modal, Row, Menu, Spin } from 'antd';
import React, { useState, useMemo, useEffect } from 'react';
import styles from './../../index.module.less';

import ProcessChart from './../chart/processChart';
import { getTemplate, getCategoryList } from '@/services/pipeline/list';

interface IGroupModal {
  modalVisible: boolean;
  onClose: () => void;
  onOk: (selectedItem?: number) => any;
}

const PipelineModal: React.FC<IGroupModal> = ({ modalVisible, onClose, onOk }) => {
  const [selectedItem, setSelectItem] = useState<any>();
  const [activeMenu, setActiveMenu] = useState<any>();
  const [templates, setTemplate] = useState<any[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const chartData = useMemo(() => {
    return templates
      .sort((a: any, b: any) => {
        return a.id - b.id;
      })
      .map((item) => {
        const data: any = (item?.pipelineStruct && JSON.parse(item.pipelineStruct).stages) || [];

        return {
          title: item.category + '.' + item.name,
          id: item.id,
          data,
        };
      });
  }, [templates]);
  const handleGetContent = async (menu: string) => {
    try {
      setLoading(true);
      const res = await getTemplate({ category: menu });
      if (res.success) {
        setTemplate(res.data.rows);
      }
      setLoading(false);
    } catch (error) {}
  };

  const handleGetMenus = async () => {
    try {
      const res = await getCategoryList();
      if (res.success) {
        setMenus(res.data);

        if (res.data[0]) {
          setActiveMenu(res.data[0]);
          handleGetContent(res.data[0]);
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (modalVisible) {
      handleGetMenus();
    }
  }, [modalVisible]);

  useEffect(() => {
    if (activeMenu) {
      handleGetContent(activeMenu);
    }
  }, [activeMenu]);

  return modalVisible ? (
    <Modal
      visible={true}
      title={'请选择流水线模版'}
      okButtonProps={{ loading, disabled: !selectedItem }}
      className={styles.pipelineModal}
      onCancel={() => {
        onClose();
      }}
      onOk={() => {
        onOk(selectedItem);
      }}
    >
      <Row>
        <Col span={4} className={styles.pipelineSidebar}>
          <div>
            <Menu selectedKeys={[activeMenu]}>
              {menus.map((item) => {
                return (
                  <Menu.Item
                    key={item}
                    onClick={({ key }) => {
                      setActiveMenu(key);
                      setSelectItem(undefined);
                    }}
                  >
                    {item}
                  </Menu.Item>
                );
              })}
            </Menu>
          </div>
        </Col>
        <Col span={20} className={styles.pipelineContent}>
          <Spin spinning={loading}>
            {chartData.map((item: any) => {
              const style = {
                marginBottom: 20,
              };
              return (
                <div
                  className={`${styles.pipelineItem} ${
                    item.id === selectedItem && styles.selected
                  }`}
                  style={style}
                  key={item.id}
                  {...{ name: item.id }}
                  onClick={() => {
                    setSelectItem(item.id);
                  }}
                >
                  <ProcessChart width={600} id={item.id} data={item.data} title={`${item.title}`} />
                </div>
              );
            })}
          </Spin>
        </Col>
      </Row>
    </Modal>
  ) : null;
};
export default PipelineModal;
