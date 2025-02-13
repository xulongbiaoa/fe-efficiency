import { request } from '@/utils/request';
import type { ResponseResult } from '@/app.global';
import { tableResponseAdapter } from '@/utils/adapters';

// 获取制品

export function getProductList(appId: number) {
  return async (params: any) => {
    const r = await request<ResponseResult>(`/devops-artifact-manager/v1/app/artifact/list`, {
      method: 'GET',
      params: {
        appId: appId,
        ...params,
      },
    });
    return tableResponseAdapter<any[]>(r);
  };
}

// 制品下载

export async function productDownload(data: { artifactId: number }) {
  return await request<ResponseResult>(
    `/devops-artifact-manager/v1/app/artifact/${data.artifactId}/genDownloadUrl`,
    {
      method: 'POST',
    },
  );
}

// 制品删除

export async function deleteProduct(data: { artifactId: number }) {
  return await request<ResponseResult>(
    `/devops-artifact-manager/v1/app/artifact/${data.artifactId}/delete`,
    {
      method: 'POST',
    },
  );
}

// 获取制品标签

export async function getTagDict() {
  return await request<ResponseResult>(`/devops-artifact-manager/v1/dict/query`, {
    method: 'GET',
    params: {
      parentKeys: 'APP_ARTIFACT_DEFAULT_TAG',
    },
  });
}
// 获取动态标签

export async function getTagDictStatics() {
  return await request<ResponseResult>(
    `/devops-artifact-manager/v1/dict/APP_ARTIFACT_USER_TAG/list`,
    {
      method: 'GET',
    },
  );
}

// 修改制品标签

export async function updateProductTag(data: { artifactId: number; artifactTag: string }) {
  return await request<ResponseResult>(
    `/devops-artifact-manager/v1/app/artifact/${data.artifactId}/updateAppArtifactTag`,
    {
      method: 'POST',
      data: {
        artifactTag: data.artifactTag,
      },
    },
  );
}

// 新增制品标签

export async function addProductTag(data: { artifactTag: string }) {
  return await request<ResponseResult>(
    `/devops-artifact-manager/v1/dict/APP_ARTIFACT_USER_TAG/add`,
    {
      method: 'POST',
      data: {
        name: data.artifactTag,
      },
    },
  );
}
