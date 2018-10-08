/**
 * Created by xiaochuntian on 2018/5/25.
 * 营销传播智能管理系统对应数据获取接口
 */


tywx.PropagateInterface = {
    ShareConfig: {},
    /**
     * 通过http获取分享相关信息
     * http://market.touch4.me/?act=api.getShareConfig&time=1421755384&game_mark=richddz&sign=a30ab1292aa5929e7f913ceed795f78c
     test demo
     var param = {
                 share_type:"hyyq2",      //获取分享点相关参数,可不传,传则代表获取单个分享点,不传表示获取all
                 config_id:"002003003"    //获取方案对应数据,不论该方案是否已发布,内部测试接口参数,代码发布上线时请删除
             };
     tywx.PropagateInterface.getShareConfigInfo(param);
     */
    getShareConfigInfo: function(reqObj) {
        if(typeof(reqObj) != 'object') {
            reqObj = {};
        }

        var timeStamp = new Date().getTime();
        reqObj.act = 'api.getShareConfig';
        reqObj.time = timeStamp;
        reqObj.game_mark = tywx.SystemInfo.cloudId + "-" + tywx.SystemInfo.gameId;

        var signStr = this.getConfigSignStr(reqObj);
        var paramStrList = [];
        for(var key in reqObj) {
            paramStrList.push(key + '=' + reqObj[key]);
        }
        paramStrList.push('sign=' + signStr);
        var finalUrl = tywx.SystemInfo.shareManagerUrl + '?' + paramStrList.join('&');
        var successcb = function(ret) {
            for(var key in ret.retmsg) {
                tywx.PropagateInterface.ShareConfig[key] = ret.retmsg[key];
            }
            tywx.NotificationCenter.trigger(tywx.EventType.GET_SHARE_CONFIG_SUCCESS, ret);
        };

        var failcb = function(ret) {
            tywx.NotificationCenter.trigger(tywx.EventType.GET_SHARE_CONFIG_FAIL, ret);
        };
        tywx.HttpUtil.httpGet({'url':finalUrl}, successcb, failcb);
    },


    /**
     * 获取用户特征值接口
     * http://market.touch4.me/?act=api.getUserFeature&cloud_id=24&game_id=6&time=1527235026&user_id=1404248&sign=a2b6938904ac3759fe6404ea8ed49267
     * @param reqObj
     */
    getUserFeatureInfo: function() {
        var reqObj = {};
        var timeStamp = new Date().getTime();
        reqObj.act = 'api.getUserFeature';
        reqObj.cloud_id = tywx.SystemInfo.cloudId;
        reqObj.game_id = tywx.SystemInfo.gameId;
        reqObj.user_id = tywx.UserInfo.userId;
        reqObj.time = timeStamp;

        var signStr = this.getConfigSignStr(reqObj);
        var paramStrList = [];
        for(var key in reqObj) {
            paramStrList.push(key + '=' + reqObj[key]);
        }
        paramStrList.push('sign=' + signStr);
        // var finalUrl = tywx.SystemInfo.shareManagerUrl + '?' + paramStrList.join('&');
        var finalUrl = 'https://analy.ywdier.com/' + '?' + paramStrList.join('&');
        var successcb = function(ret) {
            tywx.NotificationCenter.trigger(tywx.EventType.GET_USER_FEATURE_SUCCESS, ret);
        };

        var failcb = function(ret) {
            tywx.NotificationCenter.trigger(tywx.EventType.GET_USER_FEATURE_FAIL, ret);
        };
        tywx.HttpUtil.httpGet({'url':finalUrl}, successcb, failcb);
    },

    /**
     * 计算签名字符串
     * @param reqObj
     * @returns {string}
     */
    getConfigSignStr: function(reqObj) {
        var sortedKeys = Object.keys(reqObj).sort();
        var signStr = '';
        for(var i=0;i<sortedKeys.length;i++){
            var key = sortedKeys[i];
            if(key == 'act' || key == 'sign') {
                continue;
            } else {
                signStr += key + '=' + reqObj[key];
            }
        }
        var finalSign = tywx.hex_md5('market.tuyoo.com-api-' + signStr + '-market.tuyoo-api') || '';
        return finalSign;
    },
};