/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, Form, Select, message, Spin } from 'antd';
import AceEditor, { diff as DiffEditor } from 'react-ace';
import { EditOutlined, SyncOutlined, SaveOutlined, SwapLeftOutlined, LockOutlined,  UnlockOutlined,UndoOutlined} from '@ant-design/icons';
import { setFileChange, getContentByFiletype,resetFile } from '@/services/app/env-config';
import { getEnvList } from '@/services/app/env-manage';
import { getParamsToJson } from '@/utils';
import BaseCard from '../baseCard';
import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/ext-language_tools';
import './index.less';

interface IDockerFile {
  id: number;
  type: string;
  subType: string;
  fileName: string;
  currEnvId: number;
  updateRef: any;
}

const { Option } = Select;

const DockerFile: React.FC<IDockerFile> = (props: IDockerFile) => {
  const [content, setContent] = useState('');
  const [modalContent, setModalContent] = useState<string>('');
  const [syncContent, setSyncContent] = useState<string>('');
  const [fileId, setFileId] = useState(-1);
  const [readOnly, setReadOnly] = useState(true);
  const [visible, setVisible] = useState(false);
  const [env, setEnv] = useState(props.currEnvId);
  const [envList, setEnvList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [locked, setLocked] = useState(true);
  const [currEnvName, setCurrEnvName] = useState('')
 
  const reqGetContentByFiletype = (envId: number) => {
    return getContentByFiletype({
      envId,
      fileName: props.fileName,
      type: props.type,
    })
  };

  const reqSetFileChange = () => {
    setLoading(true)
    return setFileChange(fileId, {
      fileName: props.fileName,
      fileValue: content,
    }).then((res) => {
      if (res && res.success) {
        message.success('修改成功');
        props.updateRef((update:number)=>{
          return update+1
        })
        setReadOnly(true);
        setLoading(false)
      }
      setReadOnly(true);
      setLoading(false)
    }).catch(() => {
      setLoading(false);
    });
  };


  const reqGetEnvList = (appId: number) => {
    return getEnvList(appId).then((res) => {
      if (res && res.success) {
        const tmpEnvList = [...res.data];
        setEnvList(tmpEnvList);
        const currEnvOption = tmpEnvList.filter((item: any) => item.id === props.currEnvId);
        if(currEnvOption.length > 0) {
          setCurrEnvName(currEnvOption[0]?.name || '')
        }
      }
    });
  };

  const handleReset = async () => {
    try {
      setResetLoading(true)
      const res=await resetFile(fileId)
      if(res && res.success) {
        message.success('重置成功')
        props.updateRef((update:number)=>{
          return update+1
        })
        reqGetContentByFiletype(props.currEnvId).then((res:any) => {
          if (res && res.success && res.data) {
            const { fileValue, id } = res.data;
            setContent(fileValue);
            setModalContent(fileValue);
            setSyncContent(fileValue);
            setFileId(id);
          }
        });
        setReadOnly(true);
      }
      setResetLoading(false)
    } catch (error) {
      setResetLoading(false)
      
    }
  }


  useEffect(() => {
      reqGetContentByFiletype(props.currEnvId).then((res) => {
        if (res && res.success && res.data) {
          const { fileValue, id } = res.data;
          setContent(fileValue);
          setModalContent(fileValue);
          setSyncContent(fileValue);
          setFileId(id);
        }
      });
  }, [props.currEnvId, visible]);

  useEffect(() => {
    if(visible) {
      const { appId } = getParamsToJson()
      reqGetEnvList(Number(appId))
    }
  }, [visible])

  const handleClick = () => {
    if (readOnly) {
      setReadOnly(false);
      setLocked(false)
      message.info("编辑器打开");
    } else {
  
      reqSetFileChange();
      setLocked(true);
      message.info("编辑器关闭")
    }
  };

  const handleChange = (e: any) => {
    setContent(e);
  };

  const handleSync = () => {
    setVisible(true);
  }

  const handleCancel = () => {
    setVisible(false);
    setContent(content);
    setModalContent(content)
    setEnv(props.currEnvId);
  }

  const handleSubmit = () => {
    return setFileChange(fileId, {
      fileName: props.fileName,
      fileValue: modalContent,
    }).then((res) => {
      if (res && res.success) {
        message.success('修改成功');
        setVisible(false);
        setContent(modalContent);
        setEnv(props.currEnvId);
      }
    });
  }

  const handleDiffChange = (e: any[]) => {
    const [target] = e;
    setModalContent(target);
  }

  const handleEnvChange = (e: any) => {
    setEnv(e);
    setLoading2(true)
    return reqGetContentByFiletype(e).then((res) => {
      if (res && res.success) {
        if(res.data) {
          const { fileValue } = res.data;
          setSyncContent(fileValue);
        }else{
          setSyncContent('暂无文件信息');
        }
        setLoading2(false)
      }
    }).catch(() => {
      setLoading2(false)
    });
  }

  const renderButton = () => {
    return (
      <Space>
        <Button type="ghost" loading={resetLoading} onClick={handleReset} icon={<UndoOutlined />} >重置</Button>
        <Button type="ghost" onClick={handleSync} icon={<SyncOutlined/>} >同步</Button>
        <Button 
          type="primary"
          onClick={handleClick}  
          icon={readOnly ? <EditOutlined /> : <SaveOutlined />}
          loading={loading}
        >{readOnly ? '编辑' : '保存'}</Button>
      </Space>
    );
  };

  const renderEditor = () => {
    return (
        <AceEditor
          value={content}
          readOnly={readOnly}
          onChange={handleChange}
          mode="sh"
          theme="twilight"
          width="100%"
          height="100%"
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
        />
    );
  };

  return (
    <>
      <BaseCard title={(props.fileName || props.subType || props.type)} renderAction={() => renderButton()}>
        {renderEditor()}
        <div style={{
          width: 50,
          height: 50,
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: "center",
          fontSize: 50,
          color: "#fff",
          opacity: `${locked ? 1: 0}`,
          transition: "opacity 0.6s"
        }}>
          {!locked ? <UnlockOutlined/> : <LockOutlined/>}
        </div>
      </BaseCard>
      <Modal
          visible={visible}
          width="85%"
          style={{top: 50}}
          title="同步配置"
          onCancel={handleCancel}
          onOk={handleSubmit}
      >
        <Spin spinning={loading2}>
          <Form name="dockerfile">
            <Form.Item label="同步源">
              <Select 
                value={env}
                style={{width: 200}} 
                onChange={handleEnvChange}
              >
              {envList.map((item: any) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
              </Select>
            </Form.Item>
            <Form.Item label="变更">
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <div style={{textAlign:"center",width: "50%"}}>当前环境<span style={{color: "#999"}}>（{currEnvName}）</span></div> 
                <SwapLeftOutlined style={{fontSize: 30, color: "#0984f9"}}/>
                <div style={{textAlign:"center",width: "50%", pointerEvents: "none"}}>
                <Select 
                  value={env}
                  style={{width: 200}} 
                  bordered={false}
                  showArrow={false}
                >
                  {envList.map((item: any) => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
                </div> 
              </div>
              {
                visible && <DiffEditor
                  mode="sh"
                  onChange={handleDiffChange}
                  value={[modalContent, syncContent]}
                  theme="twilight"
                  width="100%"
                  height="60vh" 
                  name="UNIQUE_ID_OF_DIFFEDITOR"
                  editorProps={{ $blockScrolling: true }} 
                />
              }
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default DockerFile;
