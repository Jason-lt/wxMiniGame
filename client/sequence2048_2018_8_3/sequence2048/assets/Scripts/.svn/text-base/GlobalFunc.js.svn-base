
wxGame.GlobalFuncs = {};

//随机输出数组中的一项
wxGame.GlobalFuncs.randomForArray = function (arr) {
    if (!arr || arr.length == 0) {
        return 0;
    }
    return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * 检查城市名是否为北上广深
 * @param cityName 城市名
 * @returns {boolean}
 */
wxGame.GlobalFuncs.checkBSGS = function (cityName) {
    if (!cityName) {
        return true
    }
    var keyWord;
    for (var key in wxGame.Global.bsgsCitys){
        keyWord = wxGame.Global.bsgsCitys[key];
        if (cityName.indexOf(keyWord) > -1){
            return true;
        }
    }
    return false;
};

wxGame.GlobalFuncs.getOpenData = function (withOutMsg) {

    try {
        if (!wx.hasOwnProperty('getOpenDataContext')){
            if (!withOutMsg){
                // hall.MsgBoxManager.showToast({title:'您当前版本,不支持排行榜,请升级微信!'});
            }
            return null;
        }
        var openDataContext = wx.getOpenDataContext();
        if (openDataContext){
            return openDataContext
        }
    } catch (error) {

    }
    
    return null;
};

/**
 * 更新自己的排行榜数据
 * @param val
 */
wxGame.GlobalFuncs.upDateRankData = function (val) {
    if(!tywx.UserInfo.userId){
        return;
    }
    // shot.gameModel.saveHigherScore(shot.GameWorld.totalScore);
    var openDataContext = wxGame.GlobalFuncs.getOpenData(true);
    if(!openDataContext){
        return;
    }
    openDataContext.postMessage({
        method:'updateRank',
        sumScore: val,
        userId:tywx.UserInfo.userId
    })
};

/**
 * 更新自己的排行榜星期数据
 * @param val
 */
wxGame.GlobalFuncs.upDateRankDataWeek = function (val) {
    var openDataContext = wxGame.GlobalFuncs.getOpenData(true);
    if(!openDataContext){
        return;
    }
    openDataContext.postMessage({
        method:'updateRankWeek',
        week: val
    })
};

wxGame.GlobalFuncs.getCurWeek = function(){
    var _curTime = new Date().getTime()/1000;
    var week = parseInt((_curTime-1523203200)/(7*24*3600));
    wxGame.GlobalFuncs.upDateRankDataWeek(week+"");
    return week;
};


// 展示自己的好友排行榜数
wxGame.GlobalFuncs.getFriendRank =  function () {
    try {
        var openDataContext = wxGame.GlobalFuncs.getOpenData();
        if(!openDataContext){
            return;
        }
        var week = wxGame.GlobalFuncs.getCurWeek();
        openDataContext.postMessage({
            method:'showFriendRank',
            userId:tywx.UserInfo.userId,
            rankType : "sumScore",
            week : week
        });
    } catch (error) {

    }
};

//群排行
wxGame.GlobalFuncs.getGroupRank = function (val) {
    //分享给群
    try {
        var openDataContext = wxGame.GlobalFuncs.getOpenData();
        if(!openDataContext){
            return;
        }
        var week = wxGame.GlobalFuncs.getCurWeek();
        openDataContext.postMessage({
            method:'showGroupRank',
            shareTicket: val,
            userId:tywx.UserInfo.userId,
            rankType : "sumScore",
            week : week
        })
    } catch (error) {

    }
};

wxGame.GlobalFuncs.getThirdRankInfo = function(){
    try {
        var openDataContext = wxGame.GlobalFuncs.getOpenData(true);
        if(!openDataContext){
            return;
        }
        var week = wxGame.GlobalFuncs.getCurWeek();
        openDataContext.postMessage({
            method:'getResultRank',
            week : week,
            userId : tywx.UserInfo.userId,
            sumScore : wxGame.Global.gameInfo.score
        })
    } catch (error) {

    }

};

wxGame.GlobalFuncs.getFriendRankInfo = function(score_1,score_2,lastSCore,isNoUpdate){
    try {
        var openDataContext = wxGame.GlobalFuncs.getOpenData(true);
        if(!openDataContext){
            return;
        }
        var week = wxGame.GlobalFuncs.getCurWeek();
        openDataContext.postMessage({
            method:'getFriendGameRank',
            week : week,
            userId : tywx.UserInfo.userId,
            sumScore : wxGame.Global.gameInfo.score,
            lastSCore : lastSCore,
            beganScore : score_1,
            endScore : score_2,
            isNoUpdate : isNoUpdate
        })
    } catch (error) {

    }

};
/**
 * 初始化
 */
wxGame.GlobalFuncs.showOrigin = function () {
    var openDataContext = wxGame.GlobalFuncs.getOpenData();
    if(!openDataContext){
        return;
    }
    openDataContext.postMessage({
        method:'showOrigin'
    })
};

//振动
wxGame.GlobalFuncs.vibrateShort = function(){
    if (wxGame.Global.isVibrateShort) {
        try {
            wx.vibrateShort({
                success:function () {
                },
                fail : function () {
                },
                complete : function () {
                }
            });
        }catch (err){
            wxGame.LOGE("振动失效" + JSON.stringify(err));
        }
    }
};

wxGame.GlobalFuncs.getCurDay = function(){
    var _curTime = new Date().getTime()/1000;
    var date = new Date(_curTime * 1000);
    var fullYear = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var dataStr = fullYear + "-" + month + "-" + day;

    wxGame.LOGD("今天是:" + dataStr);
    return dataStr;
};

//存储本地数据
wxGame.GlobalFuncs.setInLocalStorage = function(key, value){
    try{
        cc.sys.localStorage.setItem(key, value+"");
    }catch(e){}
};

//读取本地数据
wxGame.GlobalFuncs.ReadStringFromLocalStorage = function(key, def_value) {
    if(!cc.sys.localStorage.getItem) {
        return def_value;
    }
    var tmp = cc.sys.localStorage.getItem(key);
    if (!tmp) {
        return def_value;
    }
    return String(tmp);
};

wxGame.GlobalFuncs.isEmptyObject = function (obj) {
    for (var name in obj) {
        return false;
    }
    return true;
};

//提示条
wxGame.GlobalFuncs.showToast = function(title){
    if (wxGame.msgBoxNode) {
        wxGame.msgBoxNode.closeAction();
        wxGame.msgBoxNode = null;
    }
    var preFabPath = "prefab/seq_toast_tips";
    cc.loader.loadRes(preFabPath, function (err, prefab) {
        var prefabNode = cc.instantiate(prefab);
        cc.director.getScene().addChild(prefabNode);
        wxGame.GlobalFuncs.setToCenter(prefabNode);
        wxGame.msgBoxNode = prefabNode.getComponent('seq_toast_tips');
        wxGame.msgBoxNode.setTitleWithString(title);
    });
};

//分数转换,1000 = 1k 10000 = 1m ;
wxGame.GlobalFuncs.formatGold = function(score){
    if (!score) {
        return 0;
    }
    if (score < 1000) {
        return score;
    }
    var formatScore = score;
    if (score >= 1000 && score < 1000000) {
        formatScore = (score/1000).toFixed(2) + "K";
    }else if (score >= 1000000){
        formatScore = (score/1000000).toFixed(2) + "M";
    }
    return formatScore;
};

//进入游戏
wxGame.GlobalFuncs.playGame = function(){
    var curScene = cc.director.getScene();
    var sceneName = "seq_game";
    if (curScene.name == sceneName){
        wxGame.NotificationCenter.trigger(wxGame.EventType.GAME_OVER_RESET);
        cc.director.getScene().runAction(cc.sequence(cc.delayTime(1.2),cc.callFunc(function(){
            wxGame.NotificationCenter.trigger(wxGame.EventType.BEGIN_GAME);
        })));
        return;
    }

    cc.director.loadScene(sceneName);
};

//进入首页
wxGame.GlobalFuncs.goToBeginScene = function(){
    var curScene = cc.director.getScene();
    var sceneName = "seq_begin";
    if (curScene.name == sceneName){
        return;
    }

    var onLaunched = function () {

    };

    cc.director.loadScene(sceneName,onLaunched);
};

//进度条动画
wxGame.GlobalFuncs.proGressAni = function(node,endPos,timer){
    node.stopAllActions();

    var processFunc = function(){
        var pos = node.getPosition();
        var inter = endPos - pos.x;
        if (inter > 0) {
            node.runAction(cc.sequence(cc.moveTo(timer,cc.p(endPos,pos.y)), cc.callFunc(function () {
                // processFunc();
            })));
        }else {
            node.setPosition(cc.p(endPos,pos.y));
        }
    };
    processFunc();
};

//按钮特效
// 按钮特效 scale 缩放大小
wxGame.GlobalFuncs.btnScaleEffect = function(node,scale,nScale){
    node.stopAllActions();
    var normalScale = 1;
    if (nScale){
        normalScale = nScale;
    }
    var scale_1 = cc.scaleTo(0.2, scale, scale);
    var scale_2 = cc.scaleTo(0.2, normalScale, normalScale);
    var delay = cc.delayTime(1.3);
    var seq1 = cc.sequence(scale_1, scale_2,scale_1, scale_2,delay);
    node.runAction(seq1.repeatForever());
},

wxGame.GlobalFuncs.setToCenter = function (node) {
    var winSize = cc.director.getWinSize();
    node.x = winSize.width/2;
    node.y = winSize.height/2;
};

//显示复活界面
wxGame.GlobalFuncs.showResurgenceUI = function(){
    cc.loader.loadRes('prefab/resurgenceUI', function (err, prefab) {
        var preFabNode = cc.instantiate(prefab);
        cc.director.getScene().addChild(preFabNode);
        wxGame.GlobalFuncs.setToCenter(preFabNode);
        var com = preFabNode.getComponent('resurgenceUI');

    });
};


//显示结算界面
wxGame.GlobalFuncs.showGameResultUI = function(){
    if (wxGame.gameResult) {
        wxGame.gameResult.onClose();
    }
    cc.loader.loadRes('prefab/gameResultUI', function (err, prefab) {
        var preFabNode = cc.instantiate(prefab);
        cc.director.getScene().addChild(preFabNode);
        wxGame.GlobalFuncs.setToCenter(preFabNode);
        wxGame.gameResult = preFabNode.getComponent('gameResultUI');
    });
};

//显示暂停界面
wxGame.GlobalFuncs.showPauseUI = function(){
    cc.loader.loadRes('prefab/pauseUI', function (err, prefab) {
        var preFabNode = cc.instantiate(prefab);
        cc.director.getScene().addChild(preFabNode);
        wxGame.GlobalFuncs.setToCenter(preFabNode);
        var com = preFabNode.getComponent('pauseUI');

    });
};

//展示排行榜界面
wxGame.GlobalFuncs.showRankUI = function(shareTicket){
    if(wxGame.rankUI){
        wxGame.rankUI.changeButtonToRank(shareTicket);
    }else {
        cc.loader.loadRes('prefab/rankUI', function (err, prefab) {
            var preFabNode = cc.instantiate(prefab);
            var curScene = cc.director.getScene();
            if(curScene){
                curScene.addChild(preFabNode);
                wxGame.GlobalFuncs.setToCenter(preFabNode);
                var com = preFabNode.getComponent('rankUI');
                wxGame.rankUI = com;
                com.changeButtonToRank(shareTicket);
            }
        }.bind(this));
    }
};

//弹出宝箱
wxGame.GlobalFuncs.popBoxUI = function(score){
    if (wxGame.boxUI) {
        return
    }
    cc.loader.loadRes('animation/baoxiang/seq_getBox', function (err, prefab) {
        var preFabNode = cc.instantiate(prefab);
        var curScene = cc.director.getScene();
        if(curScene){
            curScene.addChild(preFabNode);
            wxGame.GlobalFuncs.setToCenter(preFabNode);
            wxGame.boxUI = preFabNode.getComponent('seq_getBox');
            wxGame.boxUI.setBoxCardScore(score);
        }
    });
};

//获得卡牌道具
wxGame.GlobalFuncs.getCardProp = function(index){
    cc.loader.loadRes('animation/huode/seq_huode_card', function (err, prefab) {
        var preFabNode = cc.instantiate(prefab);
        var curScene = cc.director.getScene();
        if(curScene){
            curScene.addChild(preFabNode);
            wxGame.GlobalFuncs.setToCenter(preFabNode);
            var com = preFabNode.getComponent('seq_huode_card');
            com.setPropCard(index);
        }
    });
};

//获得道具
wxGame.GlobalFuncs.getPropWindow = function(index){
    cc.loader.loadRes('prefab/getPropNode', function (err, prefab) {
        var preFabNode = cc.instantiate(prefab);
        var curScene = cc.director.getScene();
        if(curScene){
            curScene.addChild(preFabNode);
            wxGame.GlobalFuncs.setToCenter(preFabNode);
            var com = preFabNode.getComponent('getPropNode');
            com.setPropData(index);
        }
    });
};

//读取记录
wxGame.GlobalFuncs.recordUI = function(){
    cc.loader.loadRes('prefab/recordUI', function (err, prefab) {
        var preFabNode = cc.instantiate(prefab);
        var curScene = cc.director.getScene();
        if(curScene){
            curScene.addChild(preFabNode);
            wxGame.GlobalFuncs.setToCenter(preFabNode);
        }
    });
};

//新手引导
wxGame.GlobalFuncs.greenHandUI = function(){
    cc.loader.loadRes('prefab/seq_guide', function (err, prefab) {
        var preFabNode = cc.instantiate(prefab);
        var curScene = cc.director.getScene();
        if(curScene){
            curScene.addChild(preFabNode);
            wxGame.GlobalFuncs.setToCenter(preFabNode);
        }
    });
};




































