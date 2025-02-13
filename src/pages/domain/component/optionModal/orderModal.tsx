import { Modal, Steps, Button, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { domainOrderList, cancelDomain, approvalDomain, retryDomain } from '@/services/domain';
// import { useModel } from 'umi';

interface IGroupModal {
  modalVisible: boolean;
  loading?: boolean;
  approvalUid?: string;
  onClose: () => void;
  zoneId: any;
  orderId: any;
}

const Approval: React.FC<IGroupModal> = ({
  modalVisible = true,
  onClose,
  zoneId,
  orderId,
  // approvalUid,
}) => {
  const [orderInfo, setOrderInfo] = useState<any>({});
  const [loading, setloading] = useState(false);
  const [decribe, setDecribe] = useState<any>('');
  // const { initialState } = useModel('@@initialState');
  // const { currentUser } = initialState || {};
  const statusMap = {
    0: 'wait',
    1: 'finish',
    2: 'error',
    3: 'error',
  };
  const handleGetOrderInfo = async () => {
    try {
      const res = await domainOrderList({ zoneId: zoneId });
      if (res.success) {
        setOrderInfo(res?.data || {});
      }
    } catch (error) {}
  };

  const handleRetryDomain = async (id: any) => {
    try {
      setloading(true);
      const res = await retryDomain(id);
      if (res.success) {
        message.success('操作成功');
        handleGetOrderInfo();
      }
      setloading(false);
    } catch (error) {
      setloading(false);
    }
  };

  const handleCancelDomain = async () => {
    try {
      setloading(true);
      const res = await cancelDomain(orderId);
      if (res.success) {
        message.success('操作成功');
        setOrderInfo(res?.data || {});
        handleGetOrderInfo();
      }
      setloading(false);
    } catch (error) {
      setloading(false);
    }
  };
  const handleApprovalDomain = async (status: number) => {
    try {
      const res = await approvalDomain(orderId, { status, describe: decribe });
      if (res.success) {
        message.success('操作成功');
        setOrderInfo(res?.data || {});
        handleGetOrderInfo();
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (modalVisible && zoneId) {
      handleGetOrderInfo();
    } else {
      setDecribe('');
    }
  }, [modalVisible]);

  return modalVisible ? (
    <Modal
      visible={true}
      title={
        orderInfo?.name?.includes('删除')
          ? orderInfo?.name + '(审核成功后，域名将保留两天后删除)'
          : orderInfo?.name
      }
      footer={
        <div>
          <Button
            type="primary"
            onClick={handleCancelDomain}
            loading={loading}
            disabled={
              (orderInfo?.nodes && orderInfo?.nodes[0]?.status != 0) || orderInfo?.type == 5
            }
          >
            工单取消
          </Button>
          <Button onClick={onClose} type="primary">
            关闭
          </Button>
        </div>
      }
      onCancel={onClose}
    >
      {/* <Card title="变动信息">
        <ProTable
          request={url}
          showHeader={false}
          toolBarRender={false}
          search={false}
          columns={columns}
          pagination={false}
        />
      </Card> */}
      {/* "status": 0, //工单状态：0：初始化，1：成功，2：失败，3：取消 */}
      <Steps style={{ marginTop: 20, height: 300 }} size={'small'} direction="vertical">
        {orderInfo?.nodes?.map((item: any) => {
          if (item?.id === 1) {
            const ele =
              item.status == 0 ? (
                <div style={{ marginBottom: 10 }}>
                  <Input
                    allowClear
                    onChange={(e: any) => {
                      setDecribe(e.target.value);
                    }}
                    style={{ marginLeft: 0, marginTop: 20 }}
                    placeholder="请输入审批描述"
                  />
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      type="link"
                      onClick={() => {
                        handleApprovalDomain(1);
                      }}
                    >
                      审批通过
                    </Button>
                    <Button
                      type="link"
                      onClick={() => {
                        handleApprovalDomain(2);
                      }}
                    >
                      审批拒绝
                    </Button>
                  </div>
                </div>
              ) : (
                ''
              );
            return (
              <Steps.Step
                key={item.id}
                title={
                  <div>
                    {item?.name}
                    {item.status === 1 && '（审批成功）'}
                    {item.status === 2 && '（审批失败）'}
                    <span style={{ marginLeft: 20 }}>{ele}</span>
                  </div>
                }
                status={statusMap[item.status]}
              />
            );
          }
          const retryEle = item.status == 2 && (
            <Button
              onClick={() => {
                handleRetryDomain(item.orderNodeId);
              }}
              loading={loading}
              type="link"
            >
              重试
            </Button>
          );

          return (
            <Steps.Step
              key={item.id}
              title={
                <>
                  {' '}
                  {item?.name} {retryEle}
                </>
              }
              status={statusMap[item.status]}
            />
          );
        })}
      </Steps>
    </Modal>
  ) : null;
};
export default Approval;
