import React, { useState, useEffect } from 'react';
import { getParamsToJson } from '@/utils';
import { getFileList } from '@/services/app/env-config';
import EnvConfigMenu from './comps/envConfigMenu';
import EnvBaseInfo from './comps/envBaseInfo';
import EnvSourceConfig from './comps/envSourceConfig';
import DockerFile from './comps/dockerFile';
import ParamsInfo from './comps/paramsInfo';
import DeployStrategy from './comps/deployStrategy';
import DomainManage from './comps/domainManage';
import styles from './index.module.less';

interface IEnvConfig {
  currEnvId: number;
}

type fileType = {
  id: number;
  type: string;
  subType: string;
  fileName: string;
  fileValue: string;
  allowDel: number;
};

let dynicFileContent: fileType[] = [];
const defaultActiveMenu = getParamsToJson()?.activeMenu || 'envBaseInfo';

const getFileInfo = (key: string) => {
  let info: {
    id: number;
    type: string;
    subType: string;
    fileName: string;
  } = {
    id: 0,
    type: '',
    subType: '',
    fileName: '',
  };

  const filterFile = dynicFileContent.filter(
    (file: fileType) => key === file.type || key === file.subType,
  );

  if (filterFile.length > 0) {
    const { id, type, subType, fileName } = filterFile[0];
    info = {
      id,
      type,
      subType,
      fileName,
    };
  }
  return info;
};

const existInFile = (type: string): boolean => {
  const filterFile = dynicFileContent.filter(
    (file: fileType) => type === file.type || type === file.subType,
  );
  if (filterFile.length > 0) {
    return true;
  }
  return false;
};

const EnvConfig: React.FC<IEnvConfig> = (props: IEnvConfig) => {
  const [activeMenu, setActiveMenu] = useState<string>(defaultActiveMenu);
  const [fileInfo, setFileInfo] = useState(getFileInfo(defaultActiveMenu));
  const [update, setUpdate] = useState(0);
  const handleClick = (e: any) => {
    if (activeMenu === e.key) return;
    setActiveMenu(e.key);
    setFileInfo(getFileInfo(e.key));
  };

  const reqGetFileList = () => {
    return getFileList({ envId: props.currEnvId }).then((res: any) => {
      if (res && res.success) {
        dynicFileContent = [...res.data];
      }
    });
  };

  const handleAddAfterCallback = (addFileType: string) => {
    return reqGetFileList().then(() => {
      setActiveMenu(addFileType);
      setFileInfo(getFileInfo(addFileType));
    });
  };

  const handleDelAfterCallback = () => {
    return reqGetFileList().then(() => {
      setActiveMenu('envBaseInfo');
      setFileInfo(getFileInfo('envBaseInfo'));
    });
  };

  useEffect(() => {
    reqGetFileList().then(() => {
      if (!existInFile(activeMenu)) {
        setActiveMenu('envBaseInfo');
        setFileInfo(getFileInfo('envBaseInfo'));
      }
    });
  }, [props.currEnvId]);

  const renderContent = () => {
    switch (activeMenu) {
      case 'envBaseInfo':
        return <EnvBaseInfo currEnvId={props.currEnvId} type="envBaseInfo" title="基础信息" />;
      case 'envSourceConfig':
        return (
          <EnvSourceConfig currEnvId={props.currEnvId} type="envSourceConfig" title="资源配置" />
        );
      case 'paramsInfo':
        return <ParamsInfo currEnvId={props.currEnvId} type="paramsInfo" title="环境变量" />;
      case 'deloyStrategy':
        return <DeployStrategy currEnvId={props.currEnvId} type="paramsInfo" title="部署策略" />;
      case 'domainManage':
        return <DomainManage currEnvId={props.currEnvId} type="paramsInfo" title="域名管理" />;
      case 'Dockerfile':
        return (
          <DockerFile
            type="Dockerfile"
            id={fileInfo.id}
            subType={fileInfo.subType}
            fileName={fileInfo.fileName}
            currEnvId={props.currEnvId}
            updateRef={setUpdate}
          />
        );
      default:
        return (
          <DockerFile
            key={fileInfo.id}
            id={fileInfo.id}
            type={fileInfo.type}
            subType={fileInfo.subType}
            fileName={fileInfo.fileName}
            currEnvId={props.currEnvId}
            updateRef={setUpdate}
          />
          // <ContentEditor
          //   id={fileInfo.id}
          //   type={fileInfo.type}
          //   subType={fileInfo.subType}
          //   fileName={fileInfo.fileName}
          //   currEnvId={props.currEnvId}
          // />
        );
    }
  };

  return (
    <div className={styles['env-config-wrap']}>
      <div className={styles.left}>
        <EnvConfigMenu
          defaultSelect={activeMenu}
          onClick={handleClick}
          envId={props.currEnvId}
          addAfterCallback={handleAddAfterCallback}
          delAfterCallback={handleDelAfterCallback}
          update={update}
        />
      </div>
      <div className={styles.right}>{renderContent()}</div>
    </div>
  );
};

export default EnvConfig;
