import request from '@/utils/request';
const ApiPrefix = '/stats/';
const Api = {
  versionInfo: `${ApiPrefix}version-info`,
};
export const getVersionInfo = (reportTime?: string, game?: string) => request({
  url: Api.versionInfo,
  method: 'get',
  params: {
    reportTime,
    game,
  },
});
