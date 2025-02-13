import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/ext-language_tools';

interface IClusterModal {
  visible: boolean;
  type: string;
  config: {
    id?: number;
    name: string;
    kubeConfig: string;
  };
  onCancel: () => void;
  onSubmit: (config: { type: string; id?: number; name: string; kubeConfig: string }) => void;
}

const titleMap = {
  add: '导入集群',
  edit: '配置集群',
};

const initConfig = {
  name: '',
  kubeConfig: '',
};

const ClusterModal: React.FC<IClusterModal> = (props: IClusterModal) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    props.onCancel();
  };

  useEffect(() => {
    form.setFieldsValue(Object.assign(initConfig, props.config));
  }, [props.config]);

  const handleSubmit = () => {
    return form.validateFields().then((res) => {
      if (props.type === 'add') {
        props.onSubmit({ type: 'add', ...res });
      }
      if (props.type === 'edit') {
        props.onSubmit({ type: 'edit', id: props.config?.id, ...res });
      }
    });
  };

  return (
    <>
      {props.visible ? (
        <Modal
          visible={true}
          width="50%"
          title={titleMap[props.type]}
          onCancel={handleCancel}
          onOk={handleSubmit}
          destroyOnClose
        >
          <Form form={form} layout="vertical" name="cluster-config">
            <Form.Item
              label="集群名称"
              name="name"
              key="name"
              rules={[
                {
                  required: true,
                  message: '集群名称为空或不符合规则',
                  pattern: new RegExp(/^(?!-)(?!.*?-$)[a-z0-9-]{1,63}$/),
                },
              ]}
            >
              <Input placeholder="1~63个小写英文字母、数字或'-', 不能以'-'开头或结尾" />
            </Form.Item>
            <Form.Item
              label="kubeConfig"
              name="kubeConfig"
              validateTrigger={['onChange', 'onBlur']}
              valuePropName="value"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: '请输入执行脚本',
                },
              ]}
            >
              <AceEditor
                mode="sh"
                theme="twilight"
                width="100%"
                height="50vh"
                name="UNIQUE_ID_OF_DIV"
                editorProps={{ $blockScrolling: true }}
              />
            </Form.Item>
          </Form>
        </Modal>
      ) : null}
    </>
  );
};

export default ClusterModal;
