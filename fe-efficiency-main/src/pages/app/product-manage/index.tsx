import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Space, Tag, Modal } from 'antd';
import Table from '@ant-design/pro-table';
import { delUrlParamsWithoutFreshBrowser } from '@/utils';
import {
  getProductList,
  updateProductTag,
  addProductTag,
  productDownload,
  getTagDict,
  getTagDictStatics,
  deleteProduct,
} from '@/services/app/product-manage';
import { EditOutlined } from '@ant-design/icons';
import AddTagModal from './modal/addTag';
import { history } from 'umi';
interface Product {
  id: number;
  name: string;
  version: string;
  productType: string;
  packageType: string;
  buildTime: string;
  tags: string[];
}

const ProductTable: React.FC<{ currAppId: number; setCurrAppId: (appId: number) => void }> = ({
  currAppId,
}) => {
  const [loading, setLoading] = useState(false);
  const [addModalDis, setAddModalDis] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [defaultTags, setDefaultTags] = useState<any>([]);
  const actionRef: any = useRef();
  const formRef: any = useRef();
  const { artifactName, version } = history?.location.query as any;
  // 处理下载操作
  const handleDownload = async (record: Product) => {
    try {
      const res = await productDownload({ artifactId: record.id });
      if (res.success) {
        window.open(res.data);
      }
    } catch (error) {}
  };
  const handleGetDefaultDict = async () => {
    try {
      const [arrD, arrS]: any = await Promise.all([getTagDict(), getTagDictStatics()]);

      const tags = [
        ...arrD?.data?.APP_ARTIFACT_DEFAULT_TAG,
        ...arrS?.data?.rows.map((item: any) => {
          return { key: item.dictKey, name: item.dictName };
        }),
      ];

      setDefaultTags(tags);
    } catch (error) {}
  };
  // 新增标签
  const addItem = async (value: string) => {
    try {
      const res = await addProductTag({ artifactTag: value });
      await handleGetDefaultDict();
      if (res.success) {
        message.success('操作成功');
      }
    } catch (error) {}
  };

  // 处理删除操作
  const handleDelete = async (artifactId: number) => {
    try {
      Modal.confirm({
        title: '是否确认要删除该镜像',
        onOk: async () => {
          const res = await deleteProduct({ artifactId });
          if (res.success) {
            message.success('操作成功');
            actionRef.current?.reload();
          }
        },
      });
    } catch (error) {}
  };
  // 设置表格数据

  const onOk = async (tagData: any) => {
    try {
      tagData.artifactId = tagData.artifactId || currentProduct?.id;
      tagData.artifactTag = tagData.artifactTag !== undefined ? tagData.artifactTag : '';
      setLoading(true);
      const res = await updateProductTag(tagData);
      if (res.success) {
        message.success('操作成功');
        actionRef?.current?.reload();
        setAddModalDis(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const onCancel = () => {
    setAddModalDis(false);
  };

  const preventDefault = (e: React.MouseEvent<HTMLElement>, record: any) => {
    setCurrentProduct(record);
    Modal.confirm({
      title: '是否确认要删除该标签',
      onOk: () => {
        onOk({ artifactId: record?.id });
      },
    });
    e.preventDefault();
  };
  // 设置表格列的定义
  const columns: any = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      hideInSearch: true,
    },
    {
      title: '名称',
      dataIndex: 'artifactName',
      key: 'artifactName',
      initialValue: artifactName,
    },
    {
      title: '版本',
      dataIndex: 'artifactVersion',
      key: 'artifactVersion',
      initialValue: version,
    },
    {
      title: '制品类型',
      dataIndex: 'artifactType',
      key: 'artifactType',
      hideInSearch: true,
    },
    // {
    //   title: '包类型',
    //   dataIndex: 'artifactType',
    //   key: 'artifactType',
    //   hideInSearch: true,
    // },
    {
      title: '构建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      key: 'createTime',
      hideInSearch: true,
    },
    {
      title: '构建时间',
      hideInTable: true,
      dataIndex: 'buildTime',
      valueType: 'dateTimeRange',
      search: {
        transform: (value: any) => ({ buildTimeFrom: value[0], buildTimeTo: value[1] }),
      },
    },
    {
      title: '标签',
      dataIndex: 'artifactTag',
      key: 'artifactTag',
      render: (tag: string, record: any) => {
        return (
          <>
            {tag === '-' ? (
              <span style={{ marginRight: 5 }}>{tag}</span>
            ) : (
              <Tag color="blue" key={tag} closable onClose={(e) => preventDefault(e, record)}>
                {defaultTags.filter((item: any) => item.key === Number(tag))[0]?.name || tag}
              </Tag>
            )}

            <span
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setCurrentProduct(record);
                setAddModalDis(true);
              }}
            >
              <EditOutlined style={{ marginLeft: 5, transform: 'translateY(2px)' }} />
            </span>
          </>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      hideInSearch: true,
      render: (text: string, record: Product) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleDownload(record)}>
            下载
          </Button>
          <Button type="link" onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    handleGetDefaultDict();
  }, []);

  useEffect(() => {
    actionRef.current?.reload();
  }, [currAppId]);

  return (
    <>
      <Table
        request={getProductList(currAppId)}
        rowKey={'id'}
        search={{ defaultCollapsed: false, span: 12 }}
        columns={columns}
        actionRef={actionRef}
        formRef={formRef}
        onReset={() => {
          delUrlParamsWithoutFreshBrowser(['artifactName', 'version']);
          actionRef.current?.reset();
          formRef.current.setFieldsValue({ artifactName: '', artifactVersion: '' });
        }}
      />
      <AddTagModal
        defaultTags={defaultTags}
        loading={loading}
        modalVisible={addModalDis}
        onClose={onCancel}
        onOk={onOk}
        addItem={addItem}
      />
    </>
  );
};

export default ProductTable;
