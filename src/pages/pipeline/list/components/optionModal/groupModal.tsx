import { Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';

interface IGroupModal {
  modalVisible: boolean;
  loading?: boolean;
  onClose: () => void;
  onOk: (groupName: string) => any;
}
const GroupModal: React.FC<IGroupModal> = ({ modalVisible = true, loading, onClose, onOk }) => {
  const [groupName, setGroupName] = useState('');
  useEffect(() => {
    setGroupName('');
  }, [modalVisible]);

  return modalVisible ? (
    <Modal
      visible={true}
      title={'新建分组'}
      okButtonProps={{ loading }}
      onCancel={onClose}
      onOk={() => {
        onOk(groupName);
      }}
    >
      分组名称
      <Input
        maxLength={40}
        showCount
        value={groupName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setGroupName(e.target.value);
        }}
        style={{ marginTop: 20 }}
        type="text"
        placeholder="请输入创建分组名"
      />
    </Modal>
  ) : null;
};
export default GroupModal;
