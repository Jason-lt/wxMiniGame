console.log("TuyooSDK loaded"),tywx.TuyooSDK={SESSION_KEY:"TU_SESSION_STORAGE",login:function(){tywx.IsWechatPlatform()&&(tywx.TuyooSDK.getSystemInfo(),tywx.TuyooSDK.wechatLogin())},wechatLogin:function(){tywx.IsWechatPlatform()&&(tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeWxLoginStart,[]),wx.login({success:function(t){if(tywx.LOGD(null,"wx login success, params:"+JSON.stringify(t)),tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeWxLoginSuccess,[t.code]),t.code){var e=t.code;tywx.TuyooSDK.loginTuyooWithCode(e,{}),tywx.NotificationCenter.trigger(tywx.EventType.WEIXIN_LOGIN_SUCCESS)}},fail:function(t){tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeWxLoginFailed,[]),tywx.LOGD(null,"wx login fail, params:"+JSON.stringify(t)),tywx.NotificationCenter.trigger(tywx.EventType.WEIXIN_LOGIN_FAIL)},complete:function(t){}}))},loginTuyooWith3rdSession:function(){tywx.IsWechatPlatform()&&wx.getStorage({key:tywx.TuyooSDK.SESSION_KEY,success:function(t){t.data?wx.request({url:tywx.SystemInfo.loginUrl+"open/v3/user/processSnsIdNew",data:{snsId:t.data,deviceName:"wechatGame",clientId:tywx.SystemInfo.clientId,appId:tywx.SystemInfo.appId},success:function(t){tywx.LOGD(null,"tuyoo login success, params:"+JSON.stringify(t))},fail:function(t){tywx.LOGD(null,"tuyoo login fail, params:"+JSON.stringify(t))},complete:function(t){}}):tywx.TuyooSDK.wechatLogin()},fail:function(t){tywx.TuyooSDK.wechatLogin()},complete:function(t){}})},loginTuyooWithCode:function(i,r){if(tywx.IsWechatPlatform()){wx.showShareMenu({withShareTicket:!0});var t=r.gender||0,c=tywx.Util.getLocalUUID();tywx.LOGD("local_uuid:",c);var e=tywx.SystemInfo.loginUrl,o={appId:tywx.SystemInfo.appId,wxAppId:tywx.SystemInfo.wxAppId,clientId:tywx.SystemInfo.clientId,snsId:"wxapp:"+i,uuid:c,gender:t,scene_id:tywx.UserInfo.scene_id||"",scene_param:tywx.UserInfo.scene_param||"",invite_id:tywx.UserInfo.invite_id||0};r&&r.nickName&&(o.nikeName=r.nickName),r&&r.avatarUrl&&(o.avatarUrl=r.avatarUrl),tywx.LOGD(null,"file = [TuyooSDK] fun = [loginTuyooWithCode] dataObj = "+JSON.stringify(o)),tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeLoginSDKStart,[i,c,r.nickName]),wx.request({url:e+"open/v6/user/LoginBySnsIdNoVerify",header:{"content-type":"application/x-www-form-urlencoded"},data:o,method:"POST",success:function(t){tywx.LOGD(null,"file = [TuyooSDK] fun = [loginTuyooWithCode] success params = "+JSON.stringify(t));var e=t.data;if(e.error&&1==e.error.code)console.log("tuyoo login fail...");else if(e.result){var o=e.result;tywx.UserInfo.userId=o.userId,tywx.UserInfo.userName=o.userName,tywx.UserInfo.userPic=o.purl,tywx.UserInfo.authorCode=o.authorCode,tywx.UserInfo.wxgame_session_key=o.wxgame_session_key,tywx.LOGD(null,"userId:"+tywx.UserInfo.userId+" userName:"+tywx.UserInfo.userName+" userPic:"+tywx.UserInfo.userPic),tywx.PropagateInterface.getUserFeatureInfo();var n=o.token;tywx.LOGD(null,"token:"+n),wx.setStorage({key:tywx.TuyooSDK.SESSION_KEY,data:n}),tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeLoginSDKSuccess,[i,c,r.nickName,o.userId]),tywx.showScene&&tywx.showQuery&&tywx.showQuery.sourceCode&&tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserFrom,[tywx.showScene,tywx.showQuery.inviteCode,tywx.showQuery.sourceCode,tywx.showQuery.imageType,"GameStart"]),tywx.TuyooSDK.initWebSocketUrl(o),tywx.NotificationCenter.trigger(tywx.EventType.SDK_LOGIN_SUCCESS)}},fail:function(t){tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeLoginSDKFailed,[i,c,r.nickName]),tywx.LOGD(null,"file = [TuyooSDK] fun = [loginTuyooWithCode] fail params = "+JSON.stringify(t)),tywx.NotificationCenter.trigger(tywx.EventType.SDK_LOGIN_FAIL)},complete:function(t){}})}else tywx.LOGD(null,"file = [TuyooSDK] fun = [loginTuyooWithCode] return")},initWebSocketUrl:function(t){if(t&&t.tcpsrv){var e,o=t.tcpsrv.ip,n=t.tcpsrv.wsport||t.tcpsrv.port;e=-1<tywx.SystemInfo.loginUrl.indexOf("https://")?"wss://"+o+"/":"ws://"+o+":"+n.toString()+"/",tywx.LOGD(null,"webSocketUrl:"+e),tywx.SystemInfo.webSocketUrl=e}},getSystemInfo:function(){tywx.IsWechatPlatform()&&wx.getSystemInfo({success:function(t){var e=0<=t.model.indexOf("iPhone"),o=t.windowHeight,n=0;n=e?812==o?2:736==o?4:1:3,tywx.UserInfo.systemType=n,tywx.UserInfo.wechatType=t.version,tywx.UserInfo.model=t.model,tywx.UserInfo.system=t.system},fail:function(){},complete:function(){}})},wechatAuthorize:function(){tywx.IsWechatPlatform()&&wx.getSetting({success:function(t){t.authSetting["scope.userInfo"]?tywx.NotificationCenter.trigger(tywx.EventType.START_AUTHORIZATION_SUCCESS):(tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeAuthorizationStart,[]),wx.authorize({scope:"scope.userInfo",success:function(){tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeAuthorizationSuccess,[]),tywx.NotificationCenter.trigger(tywx.EventType.START_AUTHORIZATION_SUCCESS)},fail:function(){tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeAuthorizationFailed,[]),tywx.NotificationCenter.trigger(tywx.EventType.START_AUTHORIZATION_FAILED)},complete:function(){}}))}})},createOrder:function(t,e,o,n){var i={};i.prodId=t,i.prodPrice=e,i.chargeType="wxapp.iap",i.gameId=tywx.SystemInfo.gameId,i.prodName=o,i.prodCount=n,i.appInfo={},tywx.TuyooSDK.rechargeOrder(i)},orderCallFunc:function(t,e,o){if(tywx.IsWechatPlatform()){var n=tywx.Util.getLocalUUID();wx.request({url:t,header:{"content-type":"application/x-www-form-urlencoded"},data:{userId:tywx.UserInfo.userId,appId:tywx.SystemInfo.appId,wxAppId:tywx.SystemInfo.wxAppId,clientId:tywx.SystemInfo.clientId,imei:"null",uuid:n,platformOrderId:e},method:"POST",success:function(t){},fail:function(t){tywx.LOGE(null,"file = [Recharge] fun = [OrderCallFun] 充值失败 params = "+JSON.stringify(t))},complete:function(t){}})}},rechargeOrder:function(t){if(tywx.IsWechatPlatform()){var e=tywx.Util.getLocalUUID(),o=tywx.SystemInfo.loginUrl,n="hall37"==tywx.SystemInfo.hall_version?o+"open/v4/pay/order":o+"open/v5/pay/order";wx.request({url:n,header:{"content-type":"application/x-www-form-urlencoded"},data:{userId:tywx.UserInfo.userId,appId:tywx.SystemInfo.appId,wxAppId:tywx.SystemInfo.wxAppId,clientId:tywx.SystemInfo.clientId,imei:"null",uuid:e,prodId:t.prodId,prodName:t.prodName,prodCount:t.prodCount||1,prodPrice:t.prodPrice,chargeType:t.chargeType,gameId:t.gameId,appInfo:t.appInfo,mustcharge:t.mustcharge||1},method:"POST",success:function(t){tywx.LOGE(null,"tuyoo rechargeOrder success, params:"+JSON.stringify(t));var e=t.data.result;if(0==e.code){var o=e.chargeInfo,n=o.chargeData,i=n.notifyUrl,r=n.platformOrderId;tywx.LOGE(null,"tuyoo rechargeOrder success 创建订单成功, chargeData.mustcharge ="+n.mustcharge),n&&1==n.mustcharge?wx.requestMidasPayment({mode:n.mode,env:n.env,offerId:n.offerId,buyQuantity:10*o.chargeTotal,platform:n.platform,currencyType:"CNY",zoneId:n.zoneId,success:function(t){tywx.TuyooSDK.orderCallFunc(i,r,o.chargeCoin)},fail:function(t){tywx.LOGE(null,"米大师支付 fail params = "+JSON.stringify(t))}}):n&&0==n.mustcharge&&tywx.TuyooSDK.orderCallFunc(i,r,o.chargeCoin)}else 1==e.code||e.code},fail:function(t){},complete:function(t){}})}}},tywx.WechatInterfaceInit=function(){if(tywx.IsWechatPlatform()){wx.onShow(function(t){tywx.LOGE("","+++++++++++++++++onShow+++++++++++++++++"+JSON.stringify(t));var e=t.scene,o=t.query,n="";if(tywx.showScene=e,tywx.showQuery=o,tywx.UserInfo.scene_id=e,tywx.UserInfo.scene_param=o.from||"",tywx.UserInfo.invite_id=o.inviteCode||0,tywx.StateInfo.isOnForeground=!0,tywx.NotificationCenter.trigger(tywx.EventType.GAME_SHOW,t),o&&o.gdt_vid&&o.weixinadinfo){var i="gdt."+o.weixinadinfo;tywx.UserInfo.scene_param=i,tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserFrom,[e,i])}else o&&o.sourceCode?tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserFrom,[e,o.inviteCode,o.sourceCode,o.imageType,"CardActive"]):tywx.Util.isSceneQrCode(e)?(o.hasOwnProperty("scene")?n=o.scene:t.hasOwnProperty("path")&&(n=t.path),n.replace(".html",""),n=decodeURIComponent(n),tywx.UserInfo.scene_param=n,tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserFrom,[e,n])):tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserFrom,[e,o.from]);tywx.TuyooSDK.login()}),wx.onHide(function(){tywx.LOGE("","+++++++++++++++++onHide+++++++++++++++++"),tywx.UserInfo.scene_id=0,tywx.StateInfo.isOnForeground=!1,tywx.NotificationCenter.trigger(tywx.EventType.GAME_HIDE),tywx.TCPClient.close()});var t=function(t){t.hasOwnProperty("isConnected")?tywx.StateInfo.networkConnected=t.isConnected:t.hasOwnProperty("errMsg")?tywx.StateInfo.networkConnected="getNetworkType:ok"==t.errMsg:tywx.StateInfo.networkConnected="none"!=t.networkType,tywx.StateInfo.networkType=t.networkType};wx.getNetworkType({success:t}),wx.onNetworkStatusChange(t),wx.onError(function(t){var e=new Date,o="userId:"+tywx.UserInfo.userId+"time:"+e.toDateString()+" "+e.toTimeString()+";"+t.message;tywx.BiLog.uploadLogTimely(o)})}},tywx.WechatInterfaceInit();