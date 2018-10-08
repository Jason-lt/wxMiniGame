var requestHttps = {
    /*
        requestConfigFile: function (callback) {
            //请求cdn数据
            let httpUtils = this.getComponent('httpUtils');
            let self = this;
            httpUtils.httpGets('https://sanxqn.nalrer.cn/tysanxiao/new2048/new2048configFile.json', function (data) {
                try {
                    if (data === -1) {
                        if (callback) {
                            callback();
                        }
                        //self.startLoadRes();
                        console.log('请检查网络！');
                    } else {
                        var jsonData = JSON.parse(data);
                        console.log("jsonData:", jsonData);
                        if (jsonData) {
                            //cdn开关配置
                            if (jsonData.cdnGameConfig) {
                                Global.cdnGameConfig = jsonData.cdnGameConfig;
                            } else {
                                console.log('读取cdn文件错误，取本地数据');
                            }
                            //banner广告配置
                            if (jsonData.bannerAdConfig) {
                                Global.bannerAdConfig = jsonData.bannerAdConfig;
                            }
                            //复活消除行数
                            if (jsonData.reviveConfig) {
                                if (jsonData.reviveConfig.clearVNum) {
                                    Global.clearVNum = jsonData.reviveConfig.clearVNum;
                                }
                            }
                        }
                        console.log('Global.cdnGameConfig.totalSwith:' + Global.cdnGameConfig.totalSwith, Global.bannerAdConfig.swith);
                        //self.startLoadRes();
                        if (callback) {
                            callback();
                        }
                    }
                } catch (error) {
                    if (callback) {
                        callback();
                    }
                    //self.startLoadRes();
                    console.log(error);
                }
            });
        },
    */


};
module.exports = requestHttps;