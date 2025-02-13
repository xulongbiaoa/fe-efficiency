import { message } from 'antd';
import Cookies from 'js-cookie';
import gateway from '@/gateway.config';

const downloadFile = (BASEURL: string, fileName?: string) => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', gateway.vehicleServer + BASEURL, true); // get、post都可
  xhr.responseType = 'blob'; // 转换流
  xhr.setRequestHeader('authorization', Cookies.get('dw-open-token') as string);
  xhr.setRequestHeader('appCode', gateway.appCode);
  xhr.onload = function () {
    if (this.status == 200) {
      const content_type = this.getResponseHeader('content-type');
      if (content_type?.includes('application/json')) {
        //表明返回的是json串，代表返回有问题
        new Blob([this.response]).text().then((value) => {
          const result = JSON.parse(value);
          if (result.code !== '00000') {
            message.error(result.message);
          }
        });
      } else {
        const blob = new Blob([this.response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
        });
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        if (fileName) {
          a.download = fileName;
        } else {
          const contentDisposition = this.getResponseHeader('content-disposition') || '';
          const start = contentDisposition.indexOf('%');
          const end = contentDisposition.indexOf('.xlsx');
          a.download = decodeURIComponent(contentDisposition.slice(start, end));
        }
        a.click();
        window.URL.revokeObjectURL(url);
      }
    }
  };
  xhr.send();
};
export { downloadFile };
