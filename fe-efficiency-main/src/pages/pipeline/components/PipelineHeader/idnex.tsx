import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { LeftOutlined, EditOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Button, Space, Divider } from 'antd';
import { getParamsToJson } from '@/utils';
import { getConfigVar } from '@/services/pipeline/list';
import RunModal from '../../list/components/optionModal/runVarModal';
import './index.less';

interface IPipelineHeader {
  onEditCallback: () => void;
  onRunCallback: (params: {
    ids: number[];
    remark: string;
    [key: string]: string | number[];
  }) => Promise<void>;
}

const PipelineHeader: React.FC<IPipelineHeader> = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pipelineVar, setPipelineVar] = useState<null | object>(null);
  const [pipelineName, setPipelineName] = useState<string>();
  const { pipelineId } = getParamsToJson();
  const history = useHistory();

  // 获取流水线详情
  const reqGetConfigVar = async () => {
    try {
      const res = await getConfigVar({ id: Number(pipelineId) });
      if (res.success) {
        setPipelineName(res.data.baseInfo.pipelineName);
        setPipelineVar(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 回到首页
  const goBackToHome = () => {
    if (history.length > 1) {
      history.goBack();
    } else {
      history.push('/');
    }

    // history.push("/pipeline/list")
  };

  // 编辑
  const handleEdit = () => {
    props?.onEditCallback();
  };

  // 运行按钮点击
  const handleRunBtnClick = () => {
    setIsModalVisible(true);
  };

  // 运行
  const handleRun = (param: any) => {
    const { onRunCallback } = props;
    console.log(111, param);
    return onRunCallback(param)
      .then(() => {
        setIsModalVisible(false);
      })
      .catch(() => {
        setIsModalVisible(false);
      });
  };
  useEffect(() => {
    reqGetConfigVar();
  }, []);
  return (
    <div className="pipleline-detail-header_container">
      <div className="left">
        <Space split={<Divider type="vertical" />}>
          <div className="back" onClick={goBackToHome}>
            <LeftOutlined /> 返回
          </div>
          <div>{pipelineName}</div>
          {/* <Select defaultValue="lucy" style={{ width: 200 }} onChange={handleChange}>
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="Yiminghe">yiminghe</Option>
                </Select> */}
        </Space>
      </div>
      <div className="right">
        <Space>
          <Button type="default" icon={<EditOutlined />} onClick={handleEdit}>
            编辑
          </Button>
          <Button type="primary" icon={<PlayCircleOutlined />} onClick={handleRunBtnClick}>
            运行
          </Button>
        </Space>
      </div>
      <RunModal
        runType="one"
        key="modal"
        ids={[Number(pipelineId)]}
        modalVisible={isModalVisible}
        pipelineVar={pipelineVar}
        onClose={() => setIsModalVisible(false)}
        onOk={handleRun}
      />
    </div>
  );
};

export default PipelineHeader;
