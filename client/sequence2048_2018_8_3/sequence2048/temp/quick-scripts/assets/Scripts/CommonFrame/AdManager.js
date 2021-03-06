(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/CommonFrame/AdManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c24c1PuDPJI3abI5tSDMF3D', 'AdManager', __filename);
// Scripts/CommonFrame/AdManager.js

'use strict';

/**
 * Created by xiaochuntian on 2018/5/31.
 */

/**
 * 交叉导流相关系统接口, 调用导流接口使用showAd 接口， 刷新导流显示icon使用resetBtnIcon 接口
 */
tywx.AdManager = {
    adIconBtn: null, //向其他小游戏的导流入口

    adInfoList: [], //所有广告信息的列表
    currentAdInfo: null, //当前做展示的导流信息
    currentWebPage: null, //当前显示的最终导流游戏的信息
    retryTimes: 3, //网络请求失败重试次数

    /**
     * 请求交叉倒流的信息
     */
    requestADInfo: function requestADInfo() {

        if (!tywx.IsWechatPlatform()) {
            return;
        }
        this.retryTimes--;
        var reqObj = {};
        var timeStamp = new Date().getTime();
        reqObj.act = 'api.getCrossConfig';
        reqObj.time = timeStamp;
        reqObj.game_mark = tywx.SystemInfo.cloudId + "-" + tywx.SystemInfo.gameId;
        var signStr = this.getConfigSignStr(reqObj);
        var paramStrList = [];
        for (var key in reqObj) {
            paramStrList.push(key + '=' + reqObj[key]);
        }
        paramStrList.push('sign=' + signStr);
        var finalUrl = tywx.SystemInfo.shareManagerUrl + '?' + paramStrList.join('&');
        var that = this;

        wx.request({
            url: finalUrl,
            method: 'GET',
            success: function success(res) {
                if (res.statusCode == 200) {

                    var ret = res.data;
                    console.log('RET:' + JSON.stringify(ret));
                    that.adInfoList = [];
                    if (ret.retmsg) {
                        for (var index in ret.retmsg) {
                            that.adInfoList.push(ret.retmsg[index]);
                        }
                    }

                    that.retryTimes = 3;
                }
            },
            fail: function fail(res) {

                if (that.retryTimes > 0) {

                    that.requestADInfo();
                } else {
                    that.retryTimes = 0;
                }
            }
        });
    },

    /**
     * 对外接口，用于添加广告位
     * position {x, y}
     */
    showAd: function showAd(position) {

        this.genRandomFirstAdInfo();

        if (!this.currentAdInfo) {
            return;
        }

        if (this.adIconBtn) {
            this.adIconBtn.active = true;
        } else {
            var that = this;
            //动态加载资源必须放在resources目录下,导流入口强制命名为adNode,放在resources/prefabs下
            cc.loader.loadRes('prefabs/adNode', function (err, prefab) {
                var preFabNode = cc.instantiate(prefab);
                preFabNode.position = cc.p(position.x, position.y);
                that.adIconBtn = preFabNode;
                cc.game.addPersistRootNode(preFabNode);

                cc.loader.load({ url: that.currentAdInfo.icon_url }, function (err, texture) {
                    if (!err) {
                        var spriteIco = preFabNode.getChildByName('adIcon');
                        spriteIco.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                        var adButton = preFabNode.getChildByName('adButton');
                        adButton.on('click', function () {
                            tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeClickFirstAd, [that.currentAdInfo.icon_url, that.currentAdInfo.icon_name]);
                            that.onClickAdIconBtn();
                        });
                    } else {
                        //加载失败
                    }
                });
            });
        }
    },

    /**
     * 生成随机的一级导流信息
     */
    genRandomFirstAdInfo: function genRandomFirstAdInfo() {
        var _this = this;

        if (this.adInfoList.length == 0) {
            return;
        }

        var weight_list = [0];

        for (var i in this.adInfoList) {
            weight_list.push(parseInt(this.adInfoList[i].icon_weight));
        }

        weight_list.sort(function (a, b) {
            return a > b;
        });

        var total = 0;

        weight_list.forEach(function (element) {
            total += element;
        });

        var _randomIndex = parseInt(Math.random() * 10000) % (total + 1);

        var _tTotal = 0;

        var _selectIndex = 0;
        for (var i = 0; i < weight_list.length - 1; i++) {
            _tTotal += weight_list[i];
            if (_tTotal < _randomIndex && _tTotal + weight_list[i + 1] >= _randomIndex) {
                _selectIndex = i + 1;
                break;
            }
        }
        var _selectNum = weight_list[_selectIndex];

        this.adInfoList.forEach(function (element) {
            if (element.icon_weight == _selectNum.toString()) {
                _this.currentAdInfo = element;
            }
        });
    },

    /**
     * 生成随机的二级导流信息
     */
    genRandomSecondAdInfo: function genRandomSecondAdInfo() {
        var _this2 = this;

        var _webPages = this.currentAdInfo.webpages;

        if (_webPages.length == 0) {
            return;
        }

        var weight_list = [0];

        for (var i in _webPages) {
            weight_list.push(parseInt(_webPages[i].webpage_weight));
        }

        weight_list.sort(function (a, b) {
            return a > b;
        });

        var total = 0;

        weight_list.forEach(function (element) {
            total += element;
        });

        var _randomIndex = parseInt(Math.random() * 10000) % (total + 1);

        var _tTotal = 0;

        var _selectIndex = 0;
        for (var i = 0; i < weight_list.length - 1; i++) {
            _tTotal += weight_list[i];
            if (_tTotal < _randomIndex && _tTotal + weight_list[i + 1] >= _randomIndex) {
                _selectIndex = i + 1;
                break;
            }
        }
        var _selectNum = weight_list[_selectIndex];

        _webPages.forEach(function (element) {
            if (element.webpage_weight.toString() == _selectNum.toString()) {
                _this2.currentWebPage = element;
            }
        });

        console.log('this.currentWebPage' + JSON.stringify(this.currentWebPage));
    },

    hideAd: function hideAd() {
        if (this.adIconBtn) {
            this.adIconBtn.active = false;
        }
    },

    onClickAdIconBtn: function onClickAdIconBtn() {
        this.genRandomSecondAdInfo();

        if (!this.currentWebPage) {
            return;
        }

        var that = this;
        tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeClickFirstAd, [that.currentWebPage.webpage_url, that.currentAdInfo.config_id]);

        if (tywx.IsWechatPlatform()) {
            wx.previewImage({
                current: [that.currentWebPage.webpage_url],
                urls: [that.currentWebPage.webpage_url],
                success: function success(res) {
                    tywx.LOGD(null, "预览图片成功！");
                },
                fail: function fail(res) {
                    tywx.LOGD(null, "预览图片失败！");
                }
            });
        }

        this.resetBtnIcon();
    },

    /**
     * 刷新ad按钮的icon
     */
    resetBtnIcon: function resetBtnIcon() {

        var that = this;

        this.genRandomFirstAdInfo();
        if (!that.adIconBtn || !that.currentAdInfo.icon_url) {
            return;
        }

        cc.loader.load({ url: that.currentAdInfo.icon_url }, function (err, texture) {
            if (!err) {
                var spriteIco = that.adIconBtn.getChildByName('adIcon');
                spriteIco.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            }
        });
    },

    /**
     * 计算签名字符串
     * @param reqObj
     * @returns {string}
     */
    getConfigSignStr: function getConfigSignStr(reqObj) {
        var sortedKeys = Object.keys(reqObj).sort();
        var signStr = '';
        for (var i = 0; i < sortedKeys.length; i++) {
            var key = sortedKeys[i];
            if (key == 'act' || key == 'sign') {
                continue;
            } else {
                signStr += key + '=' + reqObj[key];
            }
        }
        var finalSign = tywx.hex_md5('market.tuyoo.com-api-' + signStr + '-market.tuyoo-api') || '';
        return finalSign;
    }
};

tywx.AdManager.requestADInfo();

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=AdManager.js.map
        