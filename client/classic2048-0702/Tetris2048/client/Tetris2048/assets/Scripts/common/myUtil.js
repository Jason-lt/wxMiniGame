let ThirdAPI = require('../common/ThirdAPI');
var myUtil = {
    //随机输出数组中的一项
    randomForArray: function (arr) {
        if (!arr || arr.length == 0) {
            return 0;
        }

        return arr[Math.floor(Math.random() * arr.length)];
    },

    //在某一范围内随机
    randomForMinAndMax: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    //限制value值的大小
    clampValue: function (value, min, max) {
        if (value < min) {
            return min;
        } else if (value > max) {
            return max;
        } else {
            return value;
        }
    },

    //根据权重随机
    randomForWeight: function (weights, totalWeight) {
        Global.gridRandomScores = [];
        for (var i in weights) {
            var weight = parseInt((weights[i].weight / totalWeight) * 10000 / 100);
            for (var j = 0; j < weight; j++) {
                Global.gridRandomScores.push(weights[i].id);
            }
        }
    },

    //根据时间获取一年中的第几天
    getDayForYear(unixTime) {
        if (unixTime == 0) {
            return 0;
        }
        var currTime = new Date(unixTime);
        var day = currTime.getDate();
        var month = currTime.getMonth() + 1;
        var year = currTime.getFullYear();
        var sum = 0;
        var leap = 0;
        switch (month) {　 /*先计算某月以前月份的总天数*/
            case 1:
                sum = 0;
                break;　
            case 2:
                sum = 31;
                break;　
            case 3:
                sum = 59;
                break;　
            case 4:
                sum = 90;
                break;　
            case 5:
                sum = 120;
                break;　
            case 6:
                sum = 151;
                break;　
            case 7:
                sum = 181;
                break;　
            case 8:
                sum = 212;
                break;　
            case 9:
                sum = 243;
                break;　
            case 10:
                sum = 273;
                break;　
            case 11:
                sum = 304;
                break;　
            case 12:
                sum = 334;
                break;　
            default:
                sum = 0;
                break;
        }
        sum += day;
        if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) { /*判断是不是闰年*/
            leap = 1;　
        } else　 {
            leap = 0;
        }　
        if (leap == 1 && month > 2) /*如果是闰年且月份大于2,总天数应该加一天*/ {
            sum++;
        }
        return sum;
    },
    //倒计时限时
    getShortTimeString: function (second) {
        var h = Math.floor(second / 3600);
        var s = second % 60;
        var min = Math.floor(second / 60) % 60;
        var secondBody;
        var minuteBody;
        //秒
        if (h == 0 && min == 0 && s == 0) {
            secondBody = "00";
        } else if (s < 10) {
            secondBody = "0" + s;
        } else {
            secondBody = s;
        }

        //分
        if (h == 0 && min == 0) {
            minuteBody = "00:";
        } else if (min < 10) {
            minuteBody = "0" + min + ":";
        } else {
            minuteBody = min + ":";
        }
        return minuteBody + "" + secondBody;
    },

    getSecondString: function (num) {
        var per = 60;

        if (Math.floor(num / 3600) <= 0)
            return Math.floor((num % 3600) / 60) + ":" + (num % 3600) % 60;

        return Math.floor(num / 3600) + ":" + Math.floor((num % 3600) / 60) + ":" + (num % 3600) % 60;
    },

    //格式化秒数：10:00
    getFormatTime: function (second) {
        var h = Math.floor(second / 3600);
        var s = second % 60;
        var min = Math.floor(second / 60) % 60;
        var hourBody;
        var minuteBody;
        //秒
        if (h == 0) {
            hourBody = "00";
        } else if (h < 10) {
            hourBody = "0" + h + ":";
        } else {
            hourBody = h + ":";
        }

        //分
        if (h == 0 && min == 0) {
            minuteBody = "00";
        } else if (min < 10) {
            minuteBody = "0" + min;
        } else {
            minuteBody = min;
        }
        return hourBody + "" + minuteBody;
    },

    getPercentString: function (socre) {
        var perStr = 0;
        if (socre < 1) {
            perStr = '0%';
        } else if (1 >= socre && socre < 500) {
            perStr = '1%';
        } else if (501 >= socre && socre < 1000) {
            perStr = '3%';
        } else if (1001 >= socre && socre < 10000) {
            perStr = '8%';
        } else if (10001 >= socre && socre < 20000) {
            perStr = '15%';
        } else if (20001 >= socre && socre < 30000) {
            perStr = '30%';
        } else if (30001 >= socre && socre < 40000) {
            perStr = '55%';
        } else if (40001 >= socre && socre < 50000) {
            perStr = '65%';
        } else if (50001 >= socre && socre < 60000) {
            perStr = '75%';
        } else if (60001 >= socre && socre < 70000) {
            perStr = '85%';
        } else if (70001 >= socre && socre < 80000) {
            perStr = '88%';
        } else if (80001 >= socre && socre < 90000) {
            perStr = '90%';
        } else if (90001 >= socre && socre < 100000) {
            perStr = '95%';
        } else {
            perStr = '99%';
        }
        return perStr;
    },

    // 截屏返回 iamge base6，用于 Share
    getImgBase64: function () {
        let target = cc.find('Canvas');
        let width = parseInt(target.width),
            height = parseInt(target.height);
        let renderTexture = new cc.RenderTexture(width, height);
        renderTexture.begin();
        target._sgNode.visit();
        renderTexture.end();
        //
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            let texture = renderTexture.getSprite().getTexture();
            let image = texture.getHtmlElementObj();
            ctx.drawImage(image, 0, 0);
        } else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
            let buffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
            let texture = renderTexture.getSprite().getTexture()._glID;
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            let data = new Uint8Array(width * height * 4);
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            let rowBytes = width * 4;
            for (let row = 0; row < height; row++) {
                let srow = height - 1 - row;
                let data2 = new Uint8ClampedArray(data.buffer, srow * width * 4, rowBytes);
                let imageData = new ImageData(data2, width, 1);
                ctx.putImageData(imageData, 0, row);
            }
        }
        cc.log('to share');
        return canvas.toDataURL('image/png');
    },

    //iphoneX判断
    isIphoneX: function () {
        if (typeof wx !== 'undefined') {
            try {
                var sysInfo = wx.getSystemInfoSync();
                if (sysInfo && sysInfo.model) {
                    // 适配iphoneX
                    var isFitIphoneX = (sysInfo.model.toLowerCase().replace(/\s+/g, "").indexOf("iphonex", 0) != -1);
                    return isFitIphoneX;
                }
            } catch (error) {
                return cc.winSize.width / cc.winSize.height < 0.50;
            }
        }
        return cc.winSize.width / cc.winSize.height < 0.50;
    },

    //存档数据（保存游戏进度和分数到本地）
    saveData: function () {
        if (Global.isDailyLimit) return;
        console.log('开始存档');

        var gridControllerScript = Global.gridController.getComponent("gridController");
        var allGrids = gridControllerScript.allGrids;

        var hasGridNum = 0;
        var list = [];
        for (let vIndex = 0; vIndex < Global.vNum; vIndex++) {
            for (let hIndex = 0; hIndex < Global.hNum; hIndex++) {
                var grid = allGrids[hIndex][vIndex];
                var gridView = grid.getComponent("gridView");

                if (gridView && gridView.item != null) {
                    list.push(gridView.gridNum);
                    hasGridNum++;
                } else {
                    list.push(-1);
                }
            }
        }
        if (hasGridNum <= 0) {
            list = [];
        }
        let ThirdAPI = require('../common/ThirdAPI');
        ThirdAPI.saveGamePropgress({
            'list': list,
            'score': gridControllerScript.scoreScript.scoreNum
        });

        console.log('save data list:', list, gridControllerScript.scoreScript.scoreNum);
    },


    //重置初始化数据
    resetInitData: function () {
        var d = new Date(Date.now());
        // 加载游戏缓存数据
        let ThirdAPI = require('../common/ThirdAPI');
        Global.gameinfo = ThirdAPI.loadFriendGenStoneInfo();

        //默认初始化数据
        var initData = {
            shareTimes: 0,
            shareTotalTimes: 0,
            shareDate: d.toDateString(),
            shareTime: 0,
            shareTimesAndRewardVideoAd: 0,

            dailyTime: 0, //每日时间
            dailyScore: 0, //每日分数
            battleTimes: Global.dailyBattleTimes, //每日挑战次数

            showRewardVideoAdTimes: 0, //看广告的次数
            showRewardVideoAdDate: d.toDateString(),
        };

        // 没有数据初始化
        if (!Global.gameinfo || Global.gameinfo == undefined) {
            Global.gameinfo = initData;
        }

        //兼容dailyScore
        if (Global.gameinfo || (Global.gameinfo && parseInt(Global.gameinfo.dailyTime) == 0)) {
            if (!Global.gameinfo.dailyScore || Global.gameinfo.dailyScore == undefined) {
                Global.gameinfo.dailyScore = 0;
            }
        }

        //判断看广告是否在当天
        if (Global.gameinfo.showRewardVideoAdDate != d.toDateString()) {
            Global.gameinfo.showRewardVideoAdTimes = 0;
            Global.gameinfo.showRewardVideoAdDate = d.toDateString();
        }

        //判断是否初始化道具数量
        if (!Global.gameinfo.hasInit) {
            Global.gameinfo.hasInit = true;
            Global.gameinfo.clearPropNum = 1;
            Global.gameinfo.superPropNum = 1;
            Global.gameinfo.doublePropNum = 0;
            console.log('not hasInit ', Global.gameinfo);
        }

        //判断时间是否是当天
        if (new Date(Global.gameinfo.dailyTime).getDate() !== (new Date().getDate())) {
            console.log('时间不是当日日期，每日分数重置为0');
            Global.gameinfo.dailyTime = (new Date()).getTime();
            Global.gameinfo.dailyScore = 0;
            Global.gameinfo.battleTimes = Global.dailyBattleTimes;
            console.log('每日挑战的次数信息：', Global.gameinfo, Global.gameinfo.dailyTime);
        }

        //判断是否是当日(向朋友索取)
        if (Global.gameinfo.shareDate != d.toDateString()) {
            Global.gameinfo.shareTimesAndRewardVideoAd = 0;
            Global.gameinfo.shareTimes = 0;
            Global.gameinfo.shareTotalTimes = 0;
            Global.gameinfo.shareTime = 0;
            Global.gameinfo.shareDate = d.toDateString();
        }

        if (!Global.gameinfo.shareData1 || Global.gameinfo.shareData1.shareDate != d.toDateString()) {
            Global.gameinfo.shareData1 = {
                shareDate: d.toDateString(),
                arrOpenGId: [],
            };
        }
        //复活界面的分享成功 记录群ID
        if (!Global.gameinfo.shareData2 || Global.gameinfo.shareData2.shareDate != d.toDateString()) {
            Global.gameinfo.shareData2 = {
                shareDate: d.toDateString(),
                arrOpenGId: [],
            };
        }

        //开始界面的加号分享得钻石和每日挑战没有次数分享 成功记录群ID
        if (!Global.gameinfo.shareData3 || Global.gameinfo.shareData3.shareDate != d.toDateString()) {
            Global.gameinfo.shareData3 = {
                shareDate: d.toDateString(),
                arrOpenGId: [],
            };
        }
        //群里小卡片的邀请用户信息
        if (!Global.gameinfo.inviteUserList || Global.gameinfo.inviteUserList.inviteDate != d.toDateString()) {
            Global.gameinfo.inviteUserList = {
                inviteDate: d.toDateString(),
                userList: [],
            };
        }
        ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
    },

};
module.exports = myUtil;