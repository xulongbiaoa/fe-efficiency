export const CARD_STATE_MAP = {
  QUEUING: {
    text: '队列中',
    className: 'queuing',
  },
  INIT: {
    text: '等待中',
    className: 'wait',
  },
  DEPLOY_INIT: {
    text: '待审批',
    className: 'wait',
  },
  IN_PROGRESS: {
    text: '运行中',
    className: 'progress',
  },
  TASK_TIMEOUT: {
    text: '运行超时',
    className: 'fail',
  },

  SUCCESS: {
    text: '运行成功',
    className: 'success',
  },
  FAIL: {
    text: '运行失败',
    className: 'fail',
  },
  ABORTED: {
    text: '运行取消',
    className: 'aborted',
  },
  UNKNOWN: {
    text: '未知',
    className: 'unkonw',
  },

  ABNORMAL: {
    text: '异常状态',
    className: 'fail',
  },
  PROCESSING: {
    text: '运行中',
    className: 'progress',
  },
  AUTO_PASS: {
    text: '系统自动通过待部署',
    className: 'progress',
  },
  REJECT: {
    text: '审批拒绝',
    className: 'fail',
  },
  DEPLOY_SUCCESS: {
    text: '部署成功',
    className: 'success',
  },
  DEPLOY_FAIL: {
    text: '部署失败',
    className: 'fail',
  },
};
