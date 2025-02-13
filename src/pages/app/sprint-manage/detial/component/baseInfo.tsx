import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { Descriptions } from 'antd';
import { Form, message, Select, Input, Tooltip, Avatar, Typography } from 'antd';
import styles from './../index.module.less';
import { debounce } from 'lodash';
import { getMember } from '@/services/app/sprint-manage';

import {
  PlusCircleOutlined,
  EditOutlined,
  CheckCircleTwoTone,
  CloseOutlined,
  CloseCircleFilled,
} from '@ant-design/icons';
import {
  addRoleMember,
  deleteRoleMember,
  passOnRoleMember,
  updateSprint,
} from '@/services/app/sprint-detial';
import type { FormInstance } from 'antd/es/form/Form';
import { history } from 'umi';

interface IInfo {
  name: string;
  owner: any[];
  status: number;
  version: string;
  currSprintId: number;
  setCurrSprintId: (id: number, name?: string) => void;
  handleGetSprintDetial: () => void;
}
const { Text } = Typography;
const Iname = ({ item, showTooltip, handleDelete }: any) => {
  return showTooltip ? (
    <Tooltip
      title={
        <>
          <span>{item.name}</span>&nbsp;&nbsp;&nbsp;
          <a style={{ color: '#f86565' }} onClick={() => handleDelete?.(item.id)}>
            <CloseOutlined />
          </a>
        </>
      }
    >
      <Avatar style={{ backgroundColor: '#0984f9', marginLeft: 10 }}>
        {String(item.name).substring(-1) || '空'}
      </Avatar>
    </Tooltip>
  ) : (
    <Avatar style={{ backgroundColor: '#0984f9', marginLeft: 10 }}>
      {String(item.name).substring(-1) || '空'}
    </Avatar>
  );
};
const DisMember: React.FC<{
  names: any[] | undefined;
  showTooltip: boolean;
  handleDelete: any;
}> = ({ names, showTooltip, handleDelete }) => {
  const groups = [];
  const { devMode } = history.location.query as any;
  let count = 5;
  const [disAll, setDisAll] = useState(false);
  if (!names) {
    return null;
  }
  if (devMode == '20') {
    count = 4;
  }
  const collapseLength = Math.ceil((names.length || 0) / count);
  for (let i = 0; i < collapseLength; i++) {
    groups.push([...names.slice(i * count, i * count + count)]);
  }

  return (
    <div>
      {groups?.map((item: any, index: number) => {
        if (!disAll && index !== 0) {
          return null;
        }
        return (
          <div key={index} style={{ marginTop: index !== 0 ? '10px' : '0px' }}>
            {item.map((record: any) => {
              return (
                <Iname
                  item={record}
                  key={record.id}
                  showTooltip={showTooltip}
                  handleDelete={handleDelete}
                />
              );
            })}
            {index === 0 && collapseLength > 1 && (
              <span
                onClick={() => {
                  setDisAll((preDisAll) => {
                    return !preDisAll;
                  });
                }}
              >
                <Avatar style={{ backgroundColor: '#0984f9', marginLeft: 10, cursor: 'pointer' }}>
                  {disAll ? 'x' : `+${names.length - count}`}
                </Avatar>
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
const EditItem: React.FC<{
  name: string;
  label: string;
  status: number;
  staticsOptions?: boolean;
  value: string | undefined;
  type: 'input' | 'select';
  mode?: 'multiple';
  members?: any[];
  options?: any[];
  Icon: any;
  customValue?: React.ReactNode;
  showTooltip?: boolean;
  form: FormInstance;
  width?: number;
  handleChange: (params: any) => void;
  handleDelete?: (params: any, setLoading?: () => void) => void;
  setValue?: (value: string) => void;
}> = ({
  showTooltip = false,
  value,
  type,
  name,
  label,
  members,
  mode,
  form,
  Icon,
  width,
  status,
  options,
  customValue,
  staticsOptions,
  handleChange,
  handleDelete,
  setValue,
}) => {
  const [edit, setEdit] = useState(false);

  const wordEllis = (str: string) => {
    if (!str) {
      return '';
    }
    if (type === 'select') {
      return <Iname item={{ name: str }} showTooltip={showTooltip} handleDelete={handleDelete} />;
    }
    return (
      <Text
        style={{ width, paddingLeft: 10, textAlign: 'left', color: 'inherit' }}
        ellipsis={{ tooltip: str }}
      >
        {str}
      </Text>
    );
  };

  if (!edit) {
    return (
      <div className={mode !== 'multiple' ? styles['form-dis'] : styles['form-dis-member']}>
        {label} : {customValue ? customValue : wordEllis(value as any)}
        <DisMember names={members} showTooltip={showTooltip} handleDelete={handleDelete} />
        <span
          className={styles['edit-icon']}
          onClick={() => {
            setEdit(true);
            form.resetFields();
          }}
        >
          {![2, 3].includes(status) && name !== 'status' && <Icon />}
          {status !== 2 && name === 'status' && <Icon />}
        </span>
      </div>
    );
  }
  if (type === 'input') {
    return (
      <>
        <Form.Item name={name} style={{ marginBottom: 0 }} initialValue={value} label={label}>
          <Input style={{ width }} />
        </Form.Item>
        <span
          className={styles['close-icon']}
          onClick={() => {
            setEdit(false);
            form.resetFields();
          }}
        >
          <CloseCircleFilled twoToneColor={'#fff'} />
        </span>
        <span className={styles['close-icon']} onClick={() => handleChange(name)}>
          <CheckCircleTwoTone twoToneColor={'#52c41a'} />
        </span>
      </>
    );
  }

  return (
    <>
      <Form.Item label={label} name={name} initialValue={value} style={{ marginBottom: 0 }}>
        <Select
          style={{ width }}
          {...Object.assign({}, mode ? { mode } : {})}
          showSearch={staticsOptions ? false : true}
          labelInValue
          onSearch={(e) => {
            setValue?.(e);
          }}
        >
          {(options as []).map((item: any) => {
            if (staticsOptions) {
              return (
                <Select.Option key={item.value} value={item.value} disabled={item.disabled}>
                  {item.label}
                </Select.Option>
              );
            }
            return (
              <Select.Option key={item.userId} value={item.name}>
                {item.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <span
        className={styles['close-icon']}
        onClick={() => {
          setEdit(false);
        }}
      >
        <CloseCircleFilled twoToneColor={'#fff'} />
      </span>
      <span className={styles['close-icon']} onClick={() => handleChange(name)}>
        <CheckCircleTwoTone twoToneColor={'#52c41a'} />
      </span>
    </>
  );
};
const SprintDetial: React.FC<IInfo> = ({
  owner = [],
  name,
  version,
  status,
  currSprintId,
  handleGetSprintDetial,
  setCurrSprintId,
}) => {
  const [value, setValue] = useState<string>('');
  const [options, setOptions] = useState<any[]>([]);
  const { devMode } = history.location.query as any;
  const isUnmounted = useRef(false);
  const statusMap = useMemo(() => {
    const optionsArrayMap = {
      0: [1, 3],
      1: [2, 3],
      2: [],
      3: [1],
    };

    return status !== undefined
      ? [
          { label: '未开始', value: 0 },
          { label: '进行中', value: 1 },
          { label: '已结束', value: 2 },
          { label: '已关闭', value: 3 },
        ].map((item: any, index) => {
          if (!optionsArrayMap[status].includes(index)) {
            item.disabled = true;
          }
          return item;
        })
      : [];
  }, [status]);
  const bgMap = {
    0: styles.ready,
    1: styles.progress,
    2: styles.compete,
    3: styles.ready,
  };
  const [form] = Form.useForm();
  const onChange = useCallback(
    debounce(async (val: string) => {
      try {
        if (isUnmounted.current) {
          return;
        }
        if (!val) {
          setOptions([]);
          return;
        }
        const res = await getMember({ nickName: val });
        if (res.success) {
          if (res.data) {
            setOptions(res.data);
          }
        }
      } catch (error) {}
    }, 500),

    [],
  );

  useEffect(() => {
    return () => {
      isUnmounted.current = true;
    };
  }, []);
  useEffect(() => {
    onChange(value);
  }, [value]);

  const handleChange = async (itemName: string) => {
    const record = form.getFieldsValue();
    try {
      let res: any;
      if (record[itemName] == undefined) {
        message.error('参数不能为空');
        return;
      }

      switch (itemName) {
        case 'roleName':
          if (typeof record.roleName != 'string') {
            res = await passOnRoleMember(
              owner.filter((item) => {
                return item.roleName === '主研发';
              })[0]?.members[0]?.id,
              {
                uuid: record?.roleName.key,
                name: record?.roleName.value,
              },
            );
          } else {
            message.error('主研发: ' + record.roleName + ' 已设置请勿重复设置');
          }
          break;
        case 'name':
          if (record?.name) {
            res = await updateSprint(currSprintId, { name: record?.name });
            await setCurrSprintId(currSprintId, record?.name);
          } else {
            message.error('迭代名不能为空');
          }
          break;
        case 'version':
          if (record?.version) {
            res = await updateSprint(currSprintId, { version: record?.version });
            await setCurrSprintId(currSprintId, record?.version);
          } else {
            message.error('版本不能为空');
          }
          break;
        case 'status':
          if (record?.status === status) {
            message.error('状态未更改,请重新选择');
            return;
          }
          res = await updateSprint(currSprintId, { status: record?.status.value });

          break;
        case 'members':
          res = await addRoleMember({
            entityType: 'sprint',
            entityId: currSprintId,
            roleId: 8,
            members: record.members.map((item: any) => {
              return { uuid: item.key, name: item.value };
            }),
          });
          break;
      }
      if (res?.success) {
        message.success('操作成功');

        handleGetSprintDetial();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id: any, setLoading?: (status: boolean) => void) => {
    try {
      setLoading?.(true);
      const res = await deleteRoleMember(id);
      if (res.success) {
        handleGetSprintDetial();
        message.success('操作成功');
      }
      setLoading?.(false);
    } catch (error) {
      setLoading?.(false);
    }
  };

  return (
    <div className={styles.baseInfo}>
      <Form form={form}>
        <Descriptions className={styles.description} column={5}>
          <Descriptions.Item style={{ width: 220 }}>
            <EditItem
              status={status}
              handleChange={handleChange}
              label="名称"
              name="name"
              width={100}
              value={name}
              form={form}
              type="input"
              Icon={EditOutlined}
            />
          </Descriptions.Item>
          {devMode === '20' && (
            <Descriptions.Item style={{ width: 190 }}>
              <EditItem
                width={70}
                status={status}
                handleChange={handleChange}
                label="版本"
                name="version"
                value={version}
                form={form}
                type="input"
                Icon={EditOutlined}
              />
            </Descriptions.Item>
          )}

          <Descriptions.Item style={{ width: 195 }}>
            <EditItem
              status={status}
              handleChange={handleChange}
              label="状态"
              name="status"
              form={form}
              value={status as any}
              type="select"
              staticsOptions={true}
              customValue={
                <div style={{ marginLeft: 10 }} className={bgMap[status]}>
                  {statusMap[status]?.label}
                </div>
              }
              options={statusMap}
              Icon={EditOutlined}
            />
          </Descriptions.Item>

          <Descriptions.Item style={{ width: 190 }}>
            <EditItem
              status={status}
              handleChange={handleChange}
              handleDelete={handleDelete}
              setValue={setValue}
              form={form}
              label="主研发"
              name="roleName"
              value={
                owner.filter((item) => {
                  return item.roleId === 7;
                })[0]?.members[0]?.name
              }
              type="select"
              options={options}
              Icon={EditOutlined}
            />
          </Descriptions.Item>
          <Descriptions.Item style={{ paddingRight: 10 }}>
            <EditItem
              status={status}
              handleChange={handleChange}
              handleDelete={handleDelete}
              setValue={setValue}
              form={form}
              width={200}
              label="迭代成员"
              name="members"
              showTooltip
              value={undefined}
              type="select"
              mode="multiple"
              options={options}
              members={owner?.filter((item: any) => item.roleId === 8)[0]?.members}
              Icon={PlusCircleOutlined}
            />
          </Descriptions.Item>
        </Descriptions>
      </Form>
    </div>
  );
};
export default SprintDetial;
