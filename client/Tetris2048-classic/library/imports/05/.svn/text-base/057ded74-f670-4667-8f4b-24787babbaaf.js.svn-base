"use strict";
cc._RF.push(module, '057de109nBGZ49LJHh7q7qv', 'Bilog');
// Scripts/CommonFrame/Bilog.js

'use strict';

/**
 * Created by xiaochuntian on 2018/5/2.
 */

tywx.clickStatEventType = {
    /**
     * tywx.SystemInfo.errorLogServer = "https://clienterr.touch4.me/api/bilog5/clientlog"
     * tywx.SystemInfo.biLogServer = "https://cbi.touch4.me/api/bilog5/text"
     * 使用方法:
     * 将bilog.js加入工程后,在需要打点的地方调用tywx.BiLog.clickStat(事件id,[参数列表]);
     * 重要说明,必须看
     * 以下事件是富豪斗地主设计的打点事件及其对应的编码,各项目组需要根据自己的需求进行设计
     */
    clickStatEventTypeUserFrom: 99990001, //用户来源

    clickStatEventTypeWxLoginStart: 67890005, //微信登录开始
    clickStatEventTypeWxLoginSuccess: 67890006, //微信登录成功
    clickStatEventTypeWxLoginFailed: 678900007, //微信登录失败

    clickStatEventTypeAuthorizationStart: 67890008, //授权开始
    clickStatEventTypeAuthorizationSuccess: 67890009, //授权成功
    clickStatEventTypeAuthorizationFailed: 67890010, //授权失败

    clickStatEventTypeLoginSDKStart: 67890011, //登录SDK开始
    clickStatEventTypeLoginSDKSuccess: 67890012, //登录SDK成功
    clickStatEventTypeLoginSDKFailed: 67890013, //登录SDK时失败

    clickStatEventTypeTCP_Start: 67890014, //TCP连接开始
    clickStatEventTypeTCP_Success: 67890015, //TCP连接成功
    clickStatEventTypeTCP_Failed: 67890016 //TCP连接失败

};

tywx.BiLog = {

    /**
     * 上传实时log,富豪斗地主用此接口上传错误情况下的日志
     * @param logtxt:log内容
     */
    uploadLogTimely: function uploadLogTimely(logtxt) {
        if (!tywx.StateInfo.networkConnected) {
            tywx.LOGD('tywx.BiLog', 'net error!');
            return;
        }
        if (logtxt) {
            var header = ['Content-Type:text/plain'];
            var configObj = {
                'url': tywx.SystemInfo.errorLogServer + '?cloudname=' + tywx.SystemInfo.cloudId + '.' + tywx.SystemInfo.intClientId,
                'header': header,
                'postData': logtxt,
                'callback': null
            };
            tywx.HttpUtil.httpPost(configObj, 'POST');
        }
    },

    getSystemInfo: function getSystemInfo() {
        this.cloud_id = tywx.SystemInfo.cloudId; //独立服务id
        this.rec_type = '1'; //日志类型
        this.rec_id = '0'; //日志记录id
        this.receive_time = '0'; // 日志接收时间  输出日志时统一填0，BI服务会在接收时添加
        this.user_id = tywx.UserInfo.userId || '0'; //用户id
        this.game_id = tywx.SystemInfo.gameId; //游戏id
        this.client_id = tywx.SystemInfo.clientId;
        this.device_id = tywx.Util.getLocalUUID(); //device id
        this.ip_addr = '#IP'; // ip地址	占位--服务器处理
        this.nettype = "0"; //网络状况
        this.phone_maker = "0"; //手机制造商
        this.phone_model = tywx.UserInfo.model; //手机型号
        this.phone_carrier = "0"; //手机运营商
        this.reserved = '0';
    },
    /*BI组打点
     参数1是事件id，参数2是[],内含扩展参数
     60001事件id
     在查询工具，cloud id+game id+事件id即可找到,GDSS有前端日志查询工具
     ty.BiLog.clickStat(ddz.StatEventInfo.DdzButtonClickInPlugin,
     [ddz.PluginHall.Model.statInfoType[scope.index],ddz.GameId]);
      // ty.BiLog.clickStat(hall5.BILogEvents.BILOG_EVENT_PLUGIN_UPDATE_SUCCESS,[hall5.BilogStatEvent.Plugin_Update_Success,gameid]);
     */
    uploadClickStatLogTimely: function uploadClickStatLogTimely(logtxt) {
        var callbackObj = this;
        if (logtxt != undefined && logtxt != '') {
            var header = ['Content-Type:text/plain'];
            var configObj = {
                'url': tywx.SystemInfo.biLogServer,
                'headers': header,
                'postData': logtxt,
                'obj': callbackObj,
                'tag': null,
                'callback': null
            };
        }
        tywx.HttpUtil.httpPost(configObj, 'POST');
    },

    /**
     * 打点接口
     * @param eventId      打点事件
     * @param ParamsList   额外参数,最多10位,参见bi组文档说明
     */
    clickStat: function clickStat(eventId, paramsList) {
        if (tywx.StateInfo.debugMode) {
            return;
        }
        // tywx.LOGE("","============clickStat===================="+eventId+"===="+ParamsList[0]);
        paramsList = paramsList || [];
        var dyeparams = [];
        if (paramsList.length < 10) {
            for (var i = 0; i < 9; i++) {
                if (i < paramsList.length) {
                    dyeparams.push(paramsList[i]);
                } else {
                    dyeparams.push(0);
                }
            }
        } else {
            dyeparams = paramsList;
        }
        console.log('clickStat: function (eventId, paramsList');
        tywx.LOGD('BI打点', "eventid= " + eventId + " 描述 = " + JSON.stringify(dyeparams));
        var bilog = this.assemblelog(eventId, dyeparams);
        this.uploadClickStatLogTimely(bilog + '\n');
    },

    assemblelog: function assemblelog(eventid, paramsarr) {
        //获得1970到现在的秒数
        var time = new Date().getTime();
        //隔一分钟取网络状况
        if (time - this._timetag > 60000) {
            this._timetag = time;
            this.nettype = 0;
        }
        var paramstr = paramsarr.join('\t');

        this.getSystemInfo();
        var logStr = this.cloud_id + '\t' + this.rec_type + '\t' + time + '\t' + this.rec_id + '\t' + this.receive_time + '\t' + eventid + '\t' + this.user_id + '\t' + this.game_id + '\t' + this.client_id + '\t' + this.device_id + '\t' + this.ip_addr + '\t' + this.nettype + '\t' + this.phone_maker + '\t' + this.phone_model + '\t' + this.phone_carrier + '\t' + paramstr + '\t' + this.reserved;

        var str = this.trimTab0(logStr);
        return str;
    },

    trimTab0: function trimTab0(str) {
        if (str == null || str == undefined) return '';
        var txt = str.replace(/(\t0)*$/, '');
        return txt;
    }
};

cc._RF.pop();