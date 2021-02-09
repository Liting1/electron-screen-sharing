const { app, session } = require('electron');
const path = require('path');
class Plugin {
  installPlugin () {
    this.vueDevtools();
  }

  // vue 开发插件
  vueDevtools () {
    session.defaultSession.loadExtension(path.join(app.getAppPath(), __dirname, './nhdogjmejiglipccpnnnanhbledajbpd')).then(res => {
      console.log(`${res.name} 安装成功`);
    }).catch(err => {
      console.log(err);
    });
  }
}
module.exports =  new Plugin();
