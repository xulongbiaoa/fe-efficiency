import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import AceEditor from 'react-ace';
import { setFileChange, getContentByFiletype } from '@/services/app/env-config';
import BaseCard from '../baseCard';
import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/ext-language_tools';

interface IContentEditor {
  id: number;
  type: string;
  subType: string;
  fileName: string;
  currEnvId: number;
}

const ContentEditor: React.FC<IContentEditor> = (props: IContentEditor) => {
  const [content, setContent] = useState('');
  const [fileId, setFileId] = useState(-1);
  const [readOnly, setReadOnly] = useState(true);
  const [loading, setLoading] = useState(false);

  const reqGetContentByFiletype = () => {
    return getContentByFiletype({
      envId: props.currEnvId,
      fileName: props.fileName,
      type: props.type || props.subType,
    }).then((res) => {
      if (res && res.success && res.data) {
        const { fileValue, id } = res.data;
        setContent(fileValue);
        setFileId(id);
      }
    });
  };

  const reqSetFileChange = () => {
    setLoading(true);
    return setFileChange(fileId, {
      fileName: props.fileName,
      fileValue: content,
    })
      .then((res) => {
        if (res && res.success) {
          message.success('修改成功');
          setReadOnly(true);
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleChange = (e: any) => {
    setContent(e);
  };

  const handleClick = () => {
    if (readOnly) {
      setReadOnly(false);
      message.info('编辑器已打开');
    } else {
      reqSetFileChange();
    }
  };

  useEffect(() => {
    reqGetContentByFiletype();
  }, [props.currEnvId, props.fileName, props.type]);

  const renderButton = () => {
    return (
      <Button
        type="primary"
        onClick={handleClick}
        loading={loading}
        icon={readOnly ? <EditOutlined /> : <SaveOutlined />}
      >
        {readOnly ? '编辑' : '保存'}
      </Button>
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
    <BaseCard title={props.subType || props.type} renderAction={() => renderButton()}>
      {renderEditor()}
    </BaseCard>
  );
};

export default ContentEditor;
