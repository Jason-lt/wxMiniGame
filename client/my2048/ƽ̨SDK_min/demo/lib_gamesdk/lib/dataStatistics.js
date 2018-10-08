"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _defineProperty(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function request(e){if(myLog(e),isOpenUserLog){var t=0;!function a(){wx.request({url:"https://h5game-log.kuaiyugo.com/dataAnalysis/saveUserBehaviorLogV2",data:e,method:"POST",header:{"content-type":"application/json"},success:function(e){},fail:function(n){t<2&&(t++,e.retryTimes=t,a())}})}()}}function _getShareInfo(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"",o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"",i=arguments.length>5&&void 0!==arguments[5]?arguments[5]:"",r="";try{r=wx.getStorageSync("uid")}catch(e){}return new Promise(function(c,g){wx.request({url:_config2.default.api+"backendManager/getMaterialInfoByAppkey?channelPrefix="+e+"&appKey="+_config2.default.appKey+"&userId="+r+"&materialSuffix="+t+"&name="+a+"&point="+n+"&other="+o+"&channelCode="+i,method:"GET",header:{"content-type":"application/json"},success:function(t){if(myLog({name:"服务器返回分享信息",res:t}),t.data.data.channel_code){var a=t.data.data.channel_code;if(e==_EChannelPrefix2.default.regular)try{wx.setStorageSync("passivechannelcode",a)}catch(e){wx.setStorageSync("passivechannelcode",a)}else wx.setStorageSync("channelCode",a)}c(t)},fail:function(e){g(e)}})})}function http(e,t,a){try{return new Promise(function(n,o){wx.request({url:_config2.default.api+a,data:e,method:t,header:{"content-type":"application/json"},success:function(e){0==e.data.code?n(e):o(e)},fail:function(e){o(e)}})})}catch(e){myLog(e)}}function HandleGoto(e){try{var t="";if(e.query.goto?t=e.query.goto:e.referrerInfo&&e.referrerInfo.extraData&&e.referrerInfo.extraData.goto&&(t=e.referrerInfo.extraData.goto),""==t||void 0==t||null==t)return;http("","GET","game/getGotoConfig?id="+t).then(function(e){myLog(e);var t=e.data.data,a=t.is_open;if(myLog(a),a){var n=t.appid,o=t.next_id;wx.navigateToMiniProgram({appId:n,envVersion:"release",extraData:{goto:o},success:function(e){myLog(e)}})}}).catch(function(e){myLog(e)})}catch(e){myLog(e)}}function getErrData(e){return myLog(e),{code:-10110,data:e,msg:"request fail"}}function getErrParamsData(e){return myLog(e),{code:-10111,data:"",msg:e}}function login(e,t,a){try{wx.showLoading({title:"登录中...",mask:!0,success:function(){wxLogin(e,t,a)},fail:function(){login(e,t,a)}})}catch(e){myLog(e)}}function wxLogin(e,t,a){try{wx.login({success:function(n){var o=n.code,i={appId:_config2.default.appId,code:o};if(1==CheckParams(i))http(i,"POST","user/standAloneLogin").then(function(n){if(console.log(n,"res"),myLog({name:"登录信息",res:n}),0==n.data.code){isDebug=n.data.debug;try{var o=n.data.data.openId;myLog("获取"+o),wx.setStorageSync("uid",o),wx.setStorageSync("sessionId",n.data.data.sessionId),onLoginInfo(e,t,a,n.data)}catch(n){console.log(n),retryLogin(e,t,a,n,"str")}}else retryLogin(e,t,a,n,"obj")}).catch(function(n){retryLogin(e,t,a,n,"obj")});else{var r="前端检查参数不正确"+JSON.stringify(i),c=getErrParamsData(r);a(c)}},fail:function(n){myLog("微信Login失败"),retryLogin(e,t,a,n,"obj")}})}catch(e){myLog(e),wx.hideLoading()}}function retryLogin(e,t,a,n,o){try{var i="网络异常，是否重新登录";"str"==o?i+=" "+n:"obj"==o&&(n.data?i+=" "+JSON.stringify(n.data.msg):i+=" "+JSON.stringify(n)),console.log(i),wx.hideLoading(),wx.showModal({title:"提示",content:i,showCancel:!1,success:function(n){if(n.confirm)try{wx.showLoading({title:"登录中...",mask:!1}),wxLogin(e,t,a)}catch(n){wx.showLoading({title:"登录中...",mask:!1}),wxLogin(e,t,a)}},fail:function(){wxLogin(e,t,a)}})}catch(e){myLog(e)}}function onLoginInfo(e,t,a,n){console.log(e);try{var o=getObject("login_in");wx.setStorageSync("lastlogintime",(new Date).getTime()),e.scene&&(o.ext.scene=e.scene),HandleGoto(e),e.query.channelCode?o.ext.ccode=e.query.channelCode:e.referrerInfo&&e.referrerInfo.extraData&&e.referrerInfo.extraData.channelCode&&(o.ext.ccode=e.referrerInfo.extraData.channelCode);try{wx.setStorageSync("channelCode",o.ext.ccode)}catch(e){wx.setStorageSync("channelCode",o.ext.ccode)}e.query.sid&&(o.ext.sid=e.query.sid);try{wx.setStorageSync("sid",o.ext.sid)}catch(e){wx.setStorageSync("sid",o.ext.sid)}t(n),wx.hideLoading(),_filterObj(o.ext);request({userLog:o})}catch(e){wx.hideLoading(),myLog(e)}}function dataRetry(e,t,a,n,o){try{var i="网络异常，请稍后重试";isDebug&&(i+=JSON.stringify(o)),wx.showModal({title:"提示",content:i,showCancel:!1,success:function(o){"get"==e?dataStatistics.getKVUserData(a,n):"set"==e&&dataStatistics.setKVUserData(t,a,n)},fail:function(o){dataRetry(e,t,a,n,o)}})}catch(e){myLog(e)}}function CheckParams(e){myLog(e);for(var t in e)if(null==e[t]||""==e[t]||"undefined"==e[t])return-1;return 1}function myLog(e){logStatus&&console.log(e)}function getObject(e){try{var t=wx.getSystemInfoSync(),a={};return a.v=sdkVersion,a.ext={ak:_config2.default.appKey,ccode:wx.getStorageSync("channelCode")||"",sid:wx.getStorageSync("sid")||"",type:e,uid:wx.getStorageSync("uid")},a.device=t,getUserLocation&&(a.location=locationInfo),a}catch(e){myLog(e)}}function _filterObj(e){for(var t in e)""!=e[t]&&null!=e[t]&&void 0!=e[t]&&"{}"!=JSON.stringify(e[t])||delete e[t];return e}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),_config=require("./config.js"),_config2=_interopRequireDefault(_config),_EChannelPrefix=require("./EChannelPrefix"),_EChannelPrefix2=_interopRequireDefault(_EChannelPrefix),sdkVersion="1.0.4",logStatus=!0,isDebug=!1,isOpenUserLog=!0,getUserLocation=!1,locationInfo={};getUserLocation&&wx.getLocation({success:function(e){locationInfo=e}});var dataStatistics=function(){function e(){_classCallCheck(this,e)}return _createClass(e,null,[{key:"shareAppMsg",value:function(e){try{var t=getObject("share");t.ext.sid=t.ext.uid,e.query&&""!=e.query?e.query+="&sid="+t.ext.sid+"&channelCode="+t.ext.ccode:e.query="sid="+t.ext.sid+"&channelCode="+t.ext.ccode,myLog({name:"options",options:e}),wx.shareAppMessage(e),t.ext=_filterObj(t.ext);request({userLog:t})}catch(e){myLog(e)}}},{key:"onShareAppMsg",value:function(e){try{var t=getObject("share");t.ext.sid=t.ext.uid,t.ext.ccode=wx.getStorageSync("passivechannelcode"),e.query&&""!=e.query?e.query+="&sid="+t.ext.sid+"&channelCode="+t.ext.ccode:e.query="sid="+t.ext.sid+"&channelCode="+t.ext.ccode,t.ext=_filterObj(t.ext);return request({userLog:t}),myLog({name:"options",options:e}),e}catch(e){myLog(e)}}},{key:"shareSuccess",value:function(e){try{var t=getObject("sharesuccess");if("initiative"==e)try{t.ext.ccode=wx.getStorageSync("channelCode")}catch(e){t.ext.ccode=wx.getStorageSync("channelCode")}else try{t.ext.ccode=wx.getStorageSync("passivechannelcode")}catch(e){t.ext.ccode=wx.getStorageSync("passivechannelcode")}t.ext.sid=t.ext.uid,t.ext=_filterObj(t.ext);request({userLog:t})}catch(e){myLog(e)}}},{key:"onShowInfo",value:function(e,t,a){myLog("sdk_config.version"+sdkVersion);var n=t||function(){},o=a||function(){};try{if(""==wx.getStorageSync("uid")||null==wx.getStorageSync("uid"))login(e,n,o);else{onLoginInfo(e,n,o,{code:0,data:{openId:wx.getStorageSync("uid")},msg:""})}}catch(e){myLog(e)}}},{key:"onHideInfo",value:function(){try{var e=getObject("login_out");e.ext.preLogin=wx.getStorageSync("lastlogintime"),e.ext=_filterObj(e.ext);request({userLog:e})}catch(e){myLog(e)}}},{key:"getShareInfo",value:function(e,t,a){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"",o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"",i=arguments.length>5&&void 0!==arguments[5]?arguments[5]:"",r=arguments.length>6&&void 0!==arguments[6]?arguments[6]:"",c=arguments.length>7&&void 0!==arguments[7]?arguments[7]:"";try{var g=t||function(){},f=a||function(){},s={channelPrefix:e,appKey:_config2.default.appKey};if(1==CheckParams(s))_getShareInfo(e,n,o,i,r,c).then(function(e){"function"==typeof g&&g(e)}).catch(function(e){var t=getErrData(e);"function"==typeof f&&f(t)});else{var u="前端检查参数不正确"+JSON.stringify(s),d=getErrParamsData(u);f(d)}}catch(e){myLog(e)}}},{key:"setKVUserData",value:function(e,t,a){try{var n={appKey:_config2.default.appKey,user:wx.getStorageSync("uid"),value:e},o=t||function(){},i=a||function(){};if(1==CheckParams(n))http(n,"POST","game/setKVUserData").then(function(e){myLog(e),"function"==typeof o&&o(e)}).catch(function(t){myLog(t);var a=getErrData(t);"function"==typeof i&&i(a),dataRetry("set",e,o,i,t)});else{var r="前端检查参数不正确"+JSON.stringify(n),c=getErrParamsData(r);i(c)}}catch(e){myLog(e)}}},{key:"getKVUserData",value:function(e,t){try{var a=e||function(){},n=t||function(){},o=wx.getStorageSync("uid"),i={appKey:_config2.default.appKey,user:o};if(1==CheckParams(i))http("","GET","game/getKVUserData?appKey="+_config2.default.appKey+"&user="+o).then(function(e){myLog(e),"function"==typeof a&&a(e)}).catch(function(e){var t=getErrData(e);"function"==typeof n&&n(t),dataRetry("get","",a,n,e)});else{var r="前端检查参数不正确"+JSON.stringify(i),c=getErrParamsData(r);n(c)}}catch(e){myLog(e)}}},{key:"getServerTime",value:function(e,t){try{http("","GET","user/getServerTime").then(function(t){e(t)}).catch(function(e){t(e)})}catch(e){myLog(e)}}},{key:"getGameConfigByAppkey",value:function(e,t){try{var a=e||function(){},n=t||function(){};if(""==_config2.default.appKey||null==_config2.default.appKey){var o="前端检查参数不正确appkey="+_config2.default.appKey,i=getErrParamsData(o);n(i)}else http("","GET","game/getGameConfigByAppkey?appKey="+_config2.default.appKey).then(function(e){myLog(e),"function"==typeof a&&a(e)}).catch(function(e){var t=getErrData(e);"function"==typeof n&&n(t)})}catch(e){myLog(e)}}},{key:"withDraw",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments[1],a=arguments[2];try{var n={codeBody:JSON.stringify({openid:wx.getStorageSync("uid"),appKey:_config2.default.appKey,appid:_config2.default.appId,param:e}),pageType:"red_packet"};this.gameHttp(_config2.default.api+"gamepay/createWXACode",n,"POST").then(function(e){console.log(e);var n=e.data;wx.previewImage({current:n,urls:[n],success:function(e){console.log(e),t({code:0,data:"",msg:"获取二维码成功"})},fail:function(e){a(e)}})},function(e){a(e)})}catch(e){a(e)}}},{key:"createPFCode",value:function(e,t){try{var a={codeBody:JSON.stringify({openid:wx.getStorageSync("uid"),appKey:_config2.default.appKey,appid:_config2.default.appId,channelCode:"moregame"}),pageType:"more_games"};this.gameHttp(_config2.default.api+"gamepay/createWXACode",a,"POST").then(function(a){console.log(a);var n=a.data;wx.previewImage({current:n,urls:[n],success:function(t){console.log(t),e({code:0,data:"",msg:"获取二维码成功"})},fail:function(e){t(e)}})},function(e){t(e)})}catch(e){t(e)}}},{key:"mysteryCode",value:function(e,t,a){try{var n={codeBody:JSON.stringify({openid:wx.getStorageSync("uid"),appKey:_config2.default.appKey,appid:_config2.default.appId,gameName:e,channelCode:"coinpackage"}),pageType:"mystical_reward"};this.gameHttp(_config2.default.api+"gamepay/createWXACode",n,"POST").then(function(e){console.log(e);var n=e.data;wx.previewImage({current:n,urls:[n],success:function(e){console.log(e),t({code:0,data:"",msg:"获取二维码成功"})},fail:function(e){a(e)}})},function(e){a(e)})}catch(e){a(e)}}},{key:"taskGoldMap",value:function(e,t,a,n){try{var o=wx.getStorageSync("gameUserInfo"),i={};if("string"==typeof o&&o.length>5){var r;o=JSON.parse(o);var c=o.nickName,g=o.avatarUrl;i.codeBody=JSON.stringify((r={openid:wx.getStorageSync("uid"),appKey:_config2.default.appKey,appid:_config2.default.appId,channelCode:"coincheck",gold:t,gameName:e,gameCoin:t},_defineProperty(r,"gameCoin",t),_defineProperty(r,"nickName",c),_defineProperty(r,"avatarUrl",g),r)),i.pageType="receive_gift"}else{var f;i.codeBody=JSON.stringify((f={openid:wx.getStorageSync("uid"),appKey:_config2.default.appKey,appid:_config2.default.appId,channelCode:"coincheck",gold:t,gameName:e,gameCoin:t},_defineProperty(f,"gameCoin",t),_defineProperty(f,"nickName",""),_defineProperty(f,"avatarUrl",""),f)),i.pageType="receive_gift"}this.gameHttp(_config2.default.api+"gamepay/createWXACode",i,"POST").then(function(e){console.log(e);var t=e.data;wx.previewImage({current:t,urls:[t],success:function(e){console.log(e),a({code:0,data:"",msg:"获取二维码成功"})},fail:function(e){n(e)}})},function(e){n(e)})}catch(e){n(e)}}},{key:"goldMap",value:function(e,t,a,n){try{var o=wx.getStorageSync("gameUserInfo"),i={};if("string"==typeof o&&o.length>5){var r;o=JSON.parse(o);var c=o.nickName,g=o.avatarUrl;i.codeBody=JSON.stringify((r={openid:wx.getStorageSync("uid"),appKey:_config2.default.appKey,appid:_config2.default.appId,channelCode:"morecoin",gold:t,gameName:e,gameCoin:t},_defineProperty(r,"gameCoin",t),_defineProperty(r,"nickName",c),_defineProperty(r,"avatarUrl",g),r)),i.pageType="gold_merge"}else{var f;i.codeBody=JSON.stringify((f={openid:wx.getStorageSync("uid"),appKey:_config2.default.appKey,appid:_config2.default.appId,channelCode:"morecoin",gold:t,gameName:e,gameCoin:t},_defineProperty(f,"gameCoin",t),_defineProperty(f,"nickName",""),_defineProperty(f,"avatarUrl",""),f)),i.pageType="gold_merge"}this.gameHttp(_config2.default.api+"gamepay/createWXACode",i,"POST").then(function(e){console.log(e);var t=e.data;wx.previewImage({current:t,urls:[t],success:function(e){console.log(e),a({code:0,data:"",msg:"获取二维码成功"})},fail:function(e){n(e)}})},function(e){n(e)})}catch(e){n(e)}}},{key:"gameHttp",value:function(e,t,a){try{return"GET"==a&&(e=this.stringify(e,t),t=""),new Promise(function(n,o){var i=wx.getStorageSync("sessionId")||"";wx.request({url:e,data:t,method:a,header:{"content-type":"application/json","session-id":i},success:function(e){n(e.data)},fail:function(e){o(e)}})})}catch(e){myLog(e)}}},{key:"stringify",value:function(e,t){var a=0;for(var n in t)0==a?(e=e+"?"+n+"="+t[n],a++):e=e+"&"+n+"="+t[n];return e}},{key:"goldCount",value:function(e,t){var a=getObject("changeGold");a.ext.goldValue=e,a.ext.goldAccount=t,a.ext=_filterObj(a.ext),request(a)}}]),e}();exports.default=dataStatistics;