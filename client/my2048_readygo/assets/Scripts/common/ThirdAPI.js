var FBGlobal = require('./fbAPI')
var WXGlobal = require('./wxAPI')
var Platform = (typeof wx !== 'undefined') ? 1 : ((typeof FBInstant !== 'undefined') ? 2 : 0)

if (Platform === 1) {

    WXGlobal.initOnEnter();

} else {

}


var ThirdAPI = {

    getRank: function (params, type) {
        console.log('ThirdAPI getRank', params, type);

        if (Platform === 1) {
            if (type === 'Friend') {
                return WXGlobal.getFriendRank(params);
            } else if (type === 'Group') {
                /* var shareManager = require('shareManager');
                 var extraParam = {
                     sendTime: (new Date()).getTime()
                 };
                 shareManager.sharePoint("229", null, null, extraParam);*/

                return WXGlobal.getGroupRank(params);
            } else if (type === 'Daily') {
                return WXGlobal.getDailyRank(params);
            } else if (type === "MyInfo") {
                return WXGlobal.getMyInfo(params);
            }

        } else if (Platform === 2) {
            return FBGlobal.getRank(params);
        }
    },

    shakeShort: function (params) {
        if (Platform === 1) {
            WXGlobal.shakeShort(params);
        } else if (Platform === 2) {
            console.log('FB 平台未实现震动');
        }
    },

    shakeLong: function (params) {
        if (Platform === 1) {
            WXGlobal.shakeLong(params);
        } else if (Platform === 2) {
            console.log('FB 平台未实现震动');
        }
    },

    showGameClub: function (value) {
        if (Platform === 1) {
            WXGlobal.showGameClub(value);
        } else if (Platform === 2) {

        }
    },

    initFriendRank: function () {
        console.log('ThirdAPI initFriendRank');

        if (Platform === 1) {
            return WXGlobal.initFriendRank();
        } else if (Platform === 2) {}
    },

    getNextFriend: function (params) {
        //console.log('ThirdAPI getNextFriend', params);

        if (Platform === 1) {
            return WXGlobal.getNextFriendRank(params);
        } else if (Platform === 2) {
            return FBGlobal.getRank(params);
        }
    },

    //保存游戏进度
    saveGamePropgress: function (parma) {
        try {
            var data = {
                'list': parma.list,
                'score': parma.score
            };
            cc.sys.localStorage.setItem("new2048-keep-data", JSON.stringify(data));
        } catch (error) {
            console.error(error);
        }
    },

    //加载存档数据
    loadGameProgress: function () {
        var result = {
            'list': [],
            'score': 0
        };
        try {
            var storage = cc.sys.localStorage.getItem('new2048-keep-data');
            console.log('keep storage data : ' + storage);
            if (!storage) {
                return result;
            }
            var data = JSON.parse(storage);
            if (data) {
                return data;
            }
            return result;
        } catch (error) {
            console.error(error);
        }
        return result;
    },

    clearGameProgressInfo: function () {
        try {
            cc.sys.localStorage.removeItem('new2048-keep-data');
        } catch (error) {
            console.error(error);
        }
    },

    //保存分数
    saveScore: function (maxscore, gold) {
        console.log('ThirdAPI saveScore', maxscore, gold);

        if (Platform === 1) {
            WXGlobal.saveScore(maxscore, gold);
        } else if (Platform === 2) {
            FBGlobal.saveFBScore(maxscore, gold);
        }
        // 本地通过cocos再存储一份
        try {
            var data = "{ \"maxscore\": " + maxscore + ",\n \"gold\": " + gold + "" + " }"
            console.log('try save local score', data);
            cc.sys.localStorage.setItem("triline-data", data);
        } catch (error) {
            console.error(error);
        }
    },

    //获取本地分数
    loadScore: function (callback) {
        if (Platform === 1) {
            // return WXGlobal.loadScore(callback);
            // 微信无法在主域获取用户托管数据,所以取通过cocos存储的本地数据
            var result = this.loadLocalScore();
            if (callback) {
                callback(result.maxscore, result.gold);
            }
        } else if (Platform === 2) {
            return FBGlobal.getFBScore(callback);
        }
    },

    loadLocalScore: function () {
        var result = {
            maxscore: 0,
            gold: 0
        }
        try {
            var storage = cc.sys.localStorage.getItem('triline-data');
            console.log('storage data : ' + storage);
            if(storage != "") {
                var data = JSON.parse(storage);
                if (data) {
                    result.maxscore = parseInt(data.maxscore);
                    if (data.gold) {
                        result.gold = parseInt(data.gold);
                    }
                }
            }

        } catch (error) {
            console.error(error);
        }
        return result;
    },

    //存储复活次数
    saveReviveData: function (shareTimes) {
        try {
            var storage = cc.sys.localStorage.getItem('2048-revive-data');
            var data = JSON.parse(storage);
            //如果本地数据
            if (!data) {
                data = {
                    date: (new Date()).toDateString(),
                    shareTimes: Global.reviveTodayTimes
                };
            } else {
                if (data.date && data.date != (new Date()).toDateString()) {
                    //删除无效数据
                    console.log('重新保存数据：' + (new Date()).toDateString(), Global.reviveTodayTimes);
                    this.clearReviveData();
                    data = {
                        date: (new Date()).toDateString(),
                        shareTimes: Global.reviveTodayTimes
                    };
                } else {
                    console.log('更新保存数据' + shareTimes);
                    data = {
                        date: (new Date()).toDateString(),
                        shareTimes: shareTimes
                    };
                }
            }
            var data2 = JSON.stringify(data);
            console.log('try save local revive', data2);
            cc.sys.localStorage.setItem("2048-revive-data", data2);
        } catch (error) {
            console.error(error);
        }
    },

    loadReviveData: function () {
        try {
            var storage = cc.sys.localStorage.getItem('2048-revive-data');
            console.log('revive storage data : ' + storage);
            if (storage != "") {
                var data = JSON.parse(storage);
                if (data) {
                    //判断是否是当天
                    if (data.date && data.date == (new Date()).toDateString()) {
                        return parseInt(data.shareTimes);
                    } else {
                        return Global.reviveTodayTimes;
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
        return Global.reviveTodayTimes;
    },

    //清除复活次数
    clearReviveData: function () {
        try {
            cc.sys.localStorage.removeItem('2048-revive-data');
        } catch (error) {
            console.error(error);
        }
    },

    //复活次数存储
    saveShareData: function (shareTimes, shareDate) {
        try {
            var data = {
                shareDate: shareDate,
                shareTimes: shareTimes
            };
            var data2 = JSON.stringify(data);
            cc.sys.localStorage.setItem("2048-share-data", data2);
        } catch (error) {
            console.error(error);
        }
    },

    loadShareData: function () {
        var result = {
            shareTimes: 0,
            shareDate: ''
        }
        try {
            var storage = cc.sys.localStorage.getItem('2048-share-data');
            if (storage) {
                var data = JSON.parse(storage);
                if (data) {
                    if (data.shareDate) {
                        result.shareDate = data.shareDate;
                    }
                    if (data.shareTimes) {
                        result.shareTimes = data.shareTimes;
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
        return result;
    },

    //清除分享次数
    clearShareData: function () {
        try {
            cc.sys.localStorage.removeItem('2048-share-data');
        } catch (error) {
            console.error(error);
        }
    },

    //清除排行榜数据
    clearRankData: function () {
        console.log('ThirdAPI ready clearRankData');
        if (Platform === 1) {
            var data = ThirdAPI.loadLocalScore();
            var score = parseInt(data.maxscore);
            var gold = parseInt(data.gold);
            ThirdAPI.loadScore((maxscore, gold) => {
                score = parseInt(maxscore);
                gold = parseInt(gold);
                console.log('clearRankData on ThirdAPI loadScore', score + " :: " + gold);
            });

            //先判断这一周是否有被清空过排行榜数据，没有数据则自动清空
            try {
                var unixTime = (new Date()).getTime();
                var storage = cc.sys.localStorage.getItem('2048-rank-data');
                if (storage) {
                    // 有数据则判断这周是否清零过
                    var data2 = JSON.parse(storage);
                    var beforeClearTime = parseInt(data2.clearTime);
                    if (beforeClearTime == 0) {
                        console.log('清除排行的时间为0');
                        //没有排行本地数据则分数清零
                        cc.sys.localStorage.setItem("2048-rank-data", JSON.stringify({
                            clearTime: parseInt(unixTime)
                        }));
                        ThirdAPI.saveScore(0, gold);
                    } else {
                        var oldTime = new Date(beforeClearTime);
                        var oldDay = (oldTime.getDay() == 0) ? 7 : oldTime.getDay();

                        //计算当天从零点开始的秒数(小时、分钟、秒)
                        var todaySeconds = oldTime.getHours() * 3600 + oldTime.getMinutes() * 60 + oldTime.getSeconds();

                        var weekdayUnixTime = (beforeClearTime / 1000) - parseInt(oldDay - 1) * 86400 - todaySeconds;
                        var sundayUnixTime = (beforeClearTime / 1000) + (7 - oldDay) * 86400 + (86400 - todaySeconds - 1);

                        //如果这周没有清零则清一遍
                        var currUnixTime = (new Date()).getTime();
                        var canClear = ((parseInt(weekdayUnixTime * 1000) <= currUnixTime) && (currUnixTime <= parseInt(sundayUnixTime * 1000))) ? false : true;
                        if (canClear) {
                            //这一周排行榜数据没有清零
                            console.log('新的一周可以清空排行榜数据');
                            cc.sys.localStorage.setItem("2048-rank-data", JSON.stringify({
                                clearTime: parseInt(unixTime)
                            }));
                            ThirdAPI.saveScore(0, gold);
                        }
                    }
                } else {
                    //没有排行本地数据则分数清零
                    cc.sys.localStorage.setItem("2048-rank-data", JSON.stringify({
                        clearTime: parseInt(unixTime)
                    }));
                    ThirdAPI.saveScore(0, gold);
                }
            } catch (error) {
                console.error(error);
            }
        } else if (Platform === 2) {
            //FB暂未清除排行榜
        }
    },

    clearInfo: function (key) {
        //console.log('ThirdAPI clearStoreInfo');
        var list = []
        try {
            cc.sys.localStorage.removeItem('triline-data' + key);
        } catch (error) {
            //console.error(error);
        }
        return list;
    },

    saveInfo: function (key, list) {
        //console.log('ThirdAPI saveStoreInfo');

        // 本地通过cocos再存储一份
        try {

            var data = "[";
            for (var i = 0; i < list.length; i++) {
                if (i > 0) {
                    data += ",";
                }
                data += "{\"index\":\"" + list[i] + "\"}";
            }
            data += "]";
            //var data = "{ \"name\" : \"bob\", \"id\":\"10\"}";
            //console.log('try save local score',data);
            cc.sys.localStorage.setItem('triline-data' + key, data);
        } catch (error) {
            //console.error(error);
        }
    },

    loadInfo: function (key) {
        //console.log('ThirdAPI loadStoreInfo');
        var list = []
        try {
            var storage = cc.sys.localStorage.getItem('triline-data' + key);
            //console.log('storage data : ' + storage);
            var data = JSON.parse(storage);
            //console.log('data : ', data);
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    list.push(data[i].index);
                }
                //console.log("the list of store data is :", list);
            }
        } catch (error) {
            //console.error(error);
        }
        return list;
    },

    clearCurrentSkin: function () {
        //console.log('ThirdAPI clearStoreInfo');
        var list = []
        try {
            cc.sys.localStorage.removeItem('triline-currentskin-data');
        } catch (error) {
            //console.error(error);
        }
        return list;
    },

    saveCurrentSkin: function (current) {
        //console.log('ThirdAPI saveStoreInfo');

        // 本地通过cocos再存储一份
        try {
            var data = "{ \"currentSkin\": " + current + " }"
            //console.log('try save local score',data);
            cc.sys.localStorage.setItem("triline-currentskin-data", data);
        } catch (error) {
            //console.error(error);
        }
    },

    loadCurrentSkin: function () {
        //console.log('ThirdAPI loadStoreInfo');
        var ret = 0;
        try {
            var storage = cc.sys.localStorage.getItem('triline-currentskin-data');
            var data = JSON.parse(storage);
            if (data) {
                ret = parseInt(data.currentSkin);
            }
        } catch (error) {
            //console.error(error);
        }
        return ret;
    },

    isFromGroup: function () {
        console.log('ThirdAPI isFromGroup');

        if (Platform === 1) {
            return WXGlobal.isFromGroup();
        } else if (Platform === 2) {}
    },

    getHelpInfo: function () {
        if (Platform === 1) {
            return WXGlobal.getHelpInfo();
        } else if (Platform === 2) {}
    },

    shareGame: function (imageurl, callback, failcallback, sourcecode,channelPrefix) {
        if (Platform === 1) {
            if (callback) {
                console.log('wx has callback');

            } else {
                console.log('wx has no callback');
            }
            
            WXGlobal.shareGame(imageurl, callback, failcallback, sourcecode,channelPrefix);

            /*
            var shareManager = require('shareManager');
            var extraParam = {
                sendTime: (new Date()).getTime()
            };
            shareManager.sharePoint(sourcecode, callback, failcallback, extraParam);*/
        } else if (Platform === 2) {
            FBGlobal.onShareGame(imageurl, callback);
        }
    },

    //存储清除道具
    saveClearPropNum:function(storage){
        console.log('ThirdAPI saveClearPropNum');
        try {
            var data = JSON.stringify(storage);
            console.log('try save local data', data);
            cc.sys.localStorage.setItem('my2048-clearPropNum', data);
        } catch (error) {
            console.error(error);
        }
    },

    getClearPropNum:function(){
        try {
            var storage = cc.sys.localStorage.getItem('my2048-clearPropNum');
            console.log('getClearPropNum storage data : ' + storage);
            var data = JSON.parse(storage);
            if (data) {
                return data;
            }
            return 1;
        } catch (error) {
            return 1;
        }
        return 1;
    },

    //存储万能道具
    saveSuperPropNum:function(storage){
        console.log('ThirdAPI saveSuperPropNum');
        try {
            var data = JSON.stringify(storage);
            console.log('try save local data', data);
            cc.sys.localStorage.setItem('my2048-superPropNum', data);
        } catch (error) {
            console.error(error);
        }
    },

    getSuperPropNum:function(){
        try {
            var storage = cc.sys.localStorage.getItem('my2048-superPropNum');
            console.log('getSuperPropNum storage data : ' + storage);
            var data = JSON.parse(storage);
            if (data) {
                return data;
            }
            return 1;
        } catch (error) {
            return 1;
        }
        return 1;
    },

    //加载好友索取钻石的信息
    saveFriendGenStoneInfo: function (storage) {
        console.log('ThirdAPI saveInfo');
        try {
            var data = JSON.stringify(storage);
            console.log('try save local data', data);
            cc.sys.localStorage.setItem('new2048-claimData', data);
        } catch (error) {
            console.error(error);
        }
    },

    loadFriendGenStoneInfo: function () {
        console.log('ThirdAPI loadInfo');
        try {
            var storage = cc.sys.localStorage.getItem('new2048-claimData');
            console.log('storage data : ' + storage);
            var data = JSON.parse(storage);
            if (data) {
                return data;
            }
            return null;
        } catch (error) {
            return null;
        }
        return null;
    },



    clearFriendGenStoneInfo: function () {
        try {
            cc.sys.localStorage.removeItem('new2048-claimData');
        } catch (error) {
            console.error(error);
        }
    },

    //存储登录奖励领取状态
    saveGetRewardList: function (getRewardList) {
        try {
            var data2 = JSON.stringify(getRewardList);
            console.log('try save local getRewardList', data2);
            var keyV = "{ \"data2\": " + data2 + "}"
            cc.sys.localStorage.setItem("2048-getRewardList-data", keyV);
        } catch (error) {
            console.error(error);
        }
    },
    loadGetRewardList: function () {
        try {
            let storage = cc.sys.localStorage.getItem('2048-getRewardList-data');
            console.log('revive getRewardList data : ' + storage);

            if (storage != "") {
                let data = JSON.parse(storage);
                if (data.data2){
                    console.log('revive getRewardList data.data2 : ' + data.data2);
                    return data.data2;
                }else {
                    return [];
                }

            }else {
                return [];
            }
        } catch (error) {
            console.error(error);
        }
        return [];
    },

    //存储当天是否打开累积登录
    saveOpenTurnTable: function () {
        try {
            let storage = cc.sys.localStorage.getItem('2048-openTurnTable-data');
            let data;
            if (storage != "") {
                data = JSON.parse(storage);
            }
            // let data = JSON.parse(storage);
            //如果本地数据
            if (!data || data) {
                data = {
                    date: (new Date()).toDateString()
                };
            } else {
                if (data.date && data.date != (new Date()).toDateString()) {
                    //删除无效数据
                    this.clearTurnTableData();
                    data = {
                        date: (new Date()).toDateString()
                    };
                } else {
                    data = {
                        date: (new Date()).toDateString()
                    };
                }
            }
            let data2 = JSON.stringify(data);
            console.log('try save local revive', data2);
            cc.sys.localStorage.setItem("2048-openTurnTable-data", data2);
        } catch (error) {
            console.error(error);
        }
    },
    loadTurnTableData: function () {
        try {
            let storage = cc.sys.localStorage.getItem('2048-openTurnTable-data');
            console.log('revive storage data : ' + storage);
            if (storage != "") {
                let data = JSON.parse(storage);
                if (data) {
                    //判断是否是当天
                    if (data.date && data.date == (new Date()).toDateString()) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
        return false;
    },

    //清除复活次数
    clearTurnTableData: function () {
        try {
            cc.sys.localStorage.removeItem('2048-openTurnTable-data');
        } catch (error) {
            console.error(error);
        }
    },

    //存储累积登录天数
    saveLoginDay: function (day) {
        try {
            let storage = cc.sys.localStorage.getItem('2048-loginday-data');
            let data;
            if (storage != "") {
                data = JSON.parse(storage);
            }
            // let data = JSON.parse(storage);
            //如果本地数据
            if (!data || data) {
                data = {
                    date: (new Date()).toDateString(),
                    accumulateDay:day,
                };
            } else {
                if (data.date && data.date != (new Date()).toDateString()) {
                    //删除无效数据
                    this.clearLoginDay();
                    data = {
                        date: (new Date()).toDateString(),
                        accumulateDay:day,
                    };
                } else {
                    data = {
                        date: (new Date()).toDateString(),
                        accumulateDay:day,
                    };
                }
            }
            let data2 = JSON.stringify(data);
            console.log('try save local revive', data2);
            cc.sys.localStorage.setItem("2048-loginday-data", data2);
        } catch (error) {
            console.error(error);
        }
    },
    loadLoginDay: function () {
        try {
            let storage = cc.sys.localStorage.getItem('2048-loginday-data');
            console.log('revive storage data : ' + storage);
            if (storage != "") {
                let data = JSON.parse(storage);
                if (data) {
                    return data;
                    // //判断是否是当天
                    // if (data.date && data.date == (new Date()).toDateString()) {
                    //     return data;
                    // } else {
                    //     return {};
                    // }
                }
            }
        } catch (error) {
            console.error(error);
        }
        return null;
    },

    //清除复活次数
    clearLoginDay: function () {
        try {
            cc.sys.localStorage.removeItem('2048-loginday-data');
        } catch (error) {
            console.error(error);
        }
    },


    getShareUserInfo: function () {
        if (Platform === 1) {
            return WXGlobal.getShareUserInfo()
        } else if (Platform === 2) {

        }
    },

    exitGame: function () {
        if (Platform === 1) {
            return WXGlobal.exit()
        } else if (Platform === 2) {

        }
    },

    getSystemInfo: function () {
        if (Platform === 1) {
            return WXGlobal.getSystemInfo()
        } else if (Platform === 2) {

        }
    }
}

module.exports = ThirdAPI;