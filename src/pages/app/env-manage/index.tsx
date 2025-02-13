import { Card, message } from 'antd';
import styles from './index.module.less';

import { PlusOutlined } from '@ant-design/icons';

import EnvCard from './component';
import { useEffect, useState } from 'react';
import EnvModal from './component/envManage';
import { getEnvList, createEnv, updateEnv, deleteEnv } from '@/services/app/env-manage';

const EnvManage: React.FC<{ currAppId: number; setEnvId: () => void }> = ({
  currAppId,
  setEnvId,
}) => {
  const [envList, setEnvList] = useState<any[]>([]);
  const [envModalDis, setEnvModalDis] = useState(false);
  const [currentEnv, setCurrentEnv] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const handleGetEnvList = async () => {
    try {
      const res = await getEnvList(currAppId);
      if (res.success) {
        setEnvList(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteEnv({ id });
      if (res.success) {
        message.success('操作成功');
        handleGetEnvList();
      }
    } catch (error) {}
  };
  const handleSavaOrUpdate = async (data: any) => {
    try {
      let res;
      data.appId = currAppId;
      setLoading(true);
      if (!currentEnv?.id) {
        res = await createEnv(data);
      } else {
        data.id = currentEnv.id;
        res = await updateEnv(data);
      }
      if (res.success) {
        message.success('操作成功');
        setEnvModalDis(false);
        handleGetEnvList();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetEnvList();
  }, [currAppId]);

  return (
    <>
      <Card
        title={
          <div>
            线下环境
            <a
              style={{ marginLeft: 10 }}
              onClick={() => {
                setCurrentEnv({ status: 0 });
                setEnvModalDis(true);
              }}
            >
              <PlusOutlined />
            </a>
          </div>
        }
        className={styles.noBorder}
      >
        <EnvCard
          handleDelete={handleDelete}
          ident={null}
          list={envList.reverse()}
          setCurrentEnv={setEnvId}
          setEnvModalDis={setEnvModalDis}
        />
      </Card>
      <Card
        title={
          <div>
            线上环境
            <a
              style={{ marginLeft: 10 }}
              onClick={() => {
                setEnvModalDis(true);
              }}
            >
              <PlusOutlined />
            </a>
          </div>
        }
        className={styles.noBorder}
        style={{ minHeight: 300 }}
      >
        <EnvCard
          handleDelete={handleDelete}
          ident={['online']}
          list={envList.reverse()}
          setCurrentEnv={setEnvId}
          setEnvModalDis={setEnvModalDis}
        />
      </Card>

      <EnvModal
        modalVisible={envModalDis}
        currentEnv={currentEnv as any}
        currAppId={currAppId}
        loading={loading}
        onClose={() => {
          setEnvModalDis(false);
          setCurrentEnv({});
        }}
        onOk={handleSavaOrUpdate}
      />
    </>
  );
};

export default EnvManage;
