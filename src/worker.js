const workercode = setInterval(async () => {
  try {
    async function getHtml() {
      const html = await fetch('/404').then((res) => res.text()); //读取index html
      return html;
    }

    function parserScript(html) {
      const reg = new RegExp(/<meta name="version" content="(.+?)"/gi); //script正则
      return reg.exec(html); //匹配script标签
    }
    const html = await getHtml();
    const latestVersion = parserScript(html)?.[1];
    const currentVersion = localStorage.getItem('version'); // 获取当前版本号
    if (latestVersion !== currentVersion && latestVersion) {
      // 版本号已更新，向主线程发送消息
      postMessage('version_updated');
    }
  } catch (error) {
    console.log(error);
  }
}, 300000); // 每隔 30 秒检查一次版本号
// 把脚本代码转为string
let code = workercode.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

const blob = new Blob([code], { type: 'application/javascript' });
const worker_script = URL.createObjectURL(blob);
export default worker_script;
