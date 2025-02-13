import { request } from '@/utils/request';
import type { ResponseResult, TableResponseResult } from '@/app.global';
import { tableRequestParamsAdapter, tableResponseAdapter } from '@/utils/adapters';

// 获取迭代信息（详情）

export interface ISprintDetial {
  id: number;
  name: string;
  branch: string;
  version: string;
  appId: string;
  appName: string;
  selectStageId: number;
  status: string;
  devMode: string | null;
  build: {
    buildId: number;
    versionBigNum: number;
    versionSmallNum: number;
    artifacts: { artifactId: number; artifactName: string }[];
  };
  roleMembers: {
    roleId: number;
    roleName: string;
    menbers: {
      id: number;
      name: string;
      userId: string;
    }[];
  };
  stages: { id: number; name: string; status: number; appStageId: number; ident: string }[];
  codeInfo: {
    branch: string;
    version: string;
    mrCount: number;
    repo: string;
  };
  envInfo: {
    branch: string;
    id: number;
    name: string;
    envIdent: string;
    version: string;
    versionTime: string;
    time: string;
    latest: boolean;
    ident: string;
  };
  features: {
    id: number;
    name: string;
    desc: string;
    branch: string;
    version: string;
    versionTime: string;
    mrCount: number;
  }[];
  optionOper: {
    name: string; //常量
    type: string; //常量
    meta: any; //
  }[];
}

export async function getSprintDetial({
  id,
  selectStageId,
  selectBranch,
  selectFeatureId,
}: {
  id: number;
  selectStageId?: number;
  selectBranch?: string;
  selectFeatureId?: number;
}) {
  return await request<ResponseResult>(`/devops-manager/v1/sprint/detail/${id}`, {
    method: 'GET',
    params: {
      selectStageId,
      selectBranch,
      selectFeatureId,
    },
  });
}

// 更新迭代信息

export const updateSprint = async (
  id: number,
  data: { name?: string; status?: number; version?: string },
) => {
  return await request<ResponseResult>(`/devops-manager/v1/sprint/update/${id}`, {
    method: 'POST',
    data,
  });
};

// 获取活动记录详情

export const getActivityDetial = async (activityLogId: number) => {
  return await request<ResponseResult>(`/devops-manager/v1/activity/detail`, {
    method: 'GET',
    params: {
      activityLogId,
    },
  });
};

// 获取活动记录列表

export const getActivityList =
  (sprintStageId: number, selectFeatureId: number, callback: (data: any[]) => void) =>
  async (params: any) => {
    params.sprintStageId = sprintStageId;
    params.featureId = selectFeatureId;
    const r = await request<TableResponseResult<any[]>>(`/devops-manager/v1/activity/list`, {
      method: 'GET',
      params: {
        ...tableRequestParamsAdapter(params),
      },
    });
    if (r.success) {
      callback?.(r.data.rows);
    }

    return tableResponseAdapter<any[]>(r);
  };

// 通过pipeline触发迭代活动
export async function devActivity(data: {
  id: number;
  sprintStageId: number;
  stagePipelineId: number;
  type?: number;
  pipelineId: number;
  targetBranch: string;
  sourceBranch: string;
  description: string;
  param: any;
}) {
  const type = data?.type as number;
  delete data?.type;
  let res;
  switch (type as number) {
    case 1:
      res = pepelineActivity(data);
      break;
    case 2:
      res = syncMainActivity(data);
      break;
    case 3:
      res = mrActivity(data);
      break;
    case 4:
      res = stagePush(data);
      break;
  }
  return res;
}

// 合入MR

export async function mrActivity(data: {
  sprintStageId: number;
  sourceBranch: string;
  targetBranch: string;
  description: string;
}) {
  return await request<ResponseResult>(`/devops-manager/v1/activity/mr`, {
    method: 'POST',
    data,
  });
}

// 同步主干

export async function syncMainActivity(data: {
  sprintStageId: number;
  sourceBranch: string;
  targetBranch: string;
}) {
  return await request<ResponseResult>(`/devops-manager/v1/activity/syncMain`, {
    method: 'POST',
    data,
  });
}

// 触发流水线

export async function pepelineActivity(data: {
  sprintStageId: number;
  stagePipelineId: number;
  param: any; //要动态替换的参数    后期再做
}) {
  return await request<ResponseResult>(`/devops-manager/v1/activity/pipeline`, {
    method: 'POST',
    data,
  });
}

// 推进阶段

export async function stagePush(data: { sprintStageId: number }) {
  return await request<ResponseResult>(`/devops-manager/v1/activity/stagePush`, {
    method: 'POST',
    data,
  });
}

// 新建Feature

export async function addFeature(data: {
  appSprintId: number;
  name: string;
  status: string;
  desc: string;
  op: number;
  branch: string;
}) {
  return await request<ResponseResult>(`/devops-manager/v1/sprint/feature/create`, {
    method: 'POST',
    data,
  });
}

// 删除Feature

export async function deleteFeature(id: number) {
  return await request<ResponseResult>(`/devops-manager/v1/sprint/feature/del/${id}`, {
    method: 'POST',
  });
}

// 添加角色成员

export async function addRoleMember(data: {
  entityType?: 'app' | 'sprint';
  entityId: number;
  roleId: number;
  members: string[];
}) {
  data.entityType = 'sprint';
  return await request<ResponseResult>(`/devops-manager/v1/roleMember/add`, {
    method: 'POST',
    data,
  });
}

// 删除角色成员

export async function deleteRoleMember(id: number) {
  return await request<ResponseResult>(`/devops-manager/v1/roleMember/del/${id}`, {
    method: 'POST',
  });
}

// 删除角色成员

export async function passOnRoleMember(id: number, data: { uuid: string; name: string }) {
  return await request<ResponseResult>(`/devops-manager/v1/roleMember/passOn/${id}`, {
    method: 'POST',
    data,
  });
}

export async function deployOperate(data: {
  sprintStageId: number;
  featureId?: number;
  operationType: 1 | 2 | 3;
}) {
  return await request<ResponseResult>(`/devops-manager/v1/activity/deploy`, {
    method: 'POST',
    data,
  });
}
