import React, { useRef, useContext } from 'react';
import { message } from 'antd';
import VarForm from './VarForm';
import type { DataType } from './VarForm';
import { useEventBus } from '@/hooks/useEventBus';
import { EditContext } from '../../edit/editContext';

const Variables: React.FC<{ varInfo: DataType[] }> = (props: { varInfo: DataType[] }) => {
  const varFormRef: any = useRef();
  const { submitData, setSubmitData } = useContext(EditContext) as any;

  const handleSaveData = () => {
    return varFormRef.current
      ?.getVariableData()
      .then((data: DataType) => {
        submitData.defParam = data;
        setSubmitData({ ...submitData });
      })
      .catch(() => {
        message.error('流水线信息存在未填写项');
        submitData.defParam = 'error';
        setSubmitData({ ...submitData });
      });
  };

  useEventBus('collect:data', () => {
    handleSaveData();
  });

  return (
    <>
      <h4>变量</h4>
      <p style={{ color: '#999' }}>
        通过定义环境变量实现流水线过程定制化，可以在执行过程的任何阶段使用这些变量
      </p>
      <VarForm title="字符变量" ref={varFormRef} data={props.varInfo} />
    </>
  );
};

export default Variables;
