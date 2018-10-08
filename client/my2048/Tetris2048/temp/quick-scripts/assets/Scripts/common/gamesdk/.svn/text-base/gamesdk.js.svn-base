(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/common/gamesdk/gamesdk.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c4556VoVklFLp+MISADpRAH', 'gamesdk', __filename);
// Scripts/common/gamesdk/gamesdk.js

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gamesdkConfig = require('./gamesdk.config.js');

var _gamesdkConfig2 = _interopRequireDefault(_gamesdkConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//logStatus为true打开log，false关闭log
var logStatus = true;
// var logStatus = false

//定时器
var timer = null;
//订单
var orderCode = '';
//等待订单时间
var waitOrderTime = 1;

var gameSdk = function () {
    function gameSdk() {
        _classCallCheck(this, gameSdk);
    }

    _createClass(gameSdk, null, [{
        key: 'createUserInfoBtn',

        //外部调用创建用户信息按钮
        value: function createUserInfoBtn(type, text, image, style, _success, _fail) {
            try {
                var self = this;
                var info = wx.getSystemInfoSync();
                if (info.SDKVersion < '2.0.6') {
                    wx.getUserInfo({
                        success: function success(res) {
                            var options = {
                                encryptedData: res.encryptedData,
                                iv: res.iv
                            };
                            self.authorize(options, _success, _fail);
                        },
                        fail: function fail(err) {
                            _fail(err);
                        }
                    });
                    return;
                }
                var btn = wx.createUserInfoButton({
                    type: type,
                    text: text,
                    image: image,
                    style: style
                });
                var obj = { code: 1, data: btn, msg: 'success' };
                _success(obj);
            } catch (e) {
                _fail(e);
            };
        }

        //判断支付使用方法(coin必须为整数)

    }, {
        key: 'pay',
        value: function pay(coin, gameCoin, gameCoinName, param, _success, _fail) {
            try {
                var platform = getPlatForm();
                var self = this;
                http('', 'GET', 'gamepay/getGamePayType?os=' + platform + '&appId=' + _gamesdkConfig2.default.appId).then(function (res) {
                    myLog(res);
                    var data = res.data;
                    if (data == 'wxpay') {
                        getCodeImg(coin, gameCoin, gameCoinName, param, _success, _fail);
                    } else if (data == 'midas') {
                        myLog('midasPay');
                        var midasData = {
                            coin: coin,
                            gameCoinName: gameCoinName,
                            gameCoin: gameCoin,
                            param: param,
                            payType: 'midas',
                            purpose: 2,
                            appId: _gamesdkConfig2.default.appId
                        };
                        midasPay(midasData, _success, _fail);
                    } else if (data == 'none') {
                        myLog('pay none');
                    } else {
                        _fail(res);
                    }
                }, function (err) {
                    _fail(err);
                });
            } catch (e) {
                _fail(e);
            }
        }

        //外部调用login

    }, {
        key: 'login',
        value: function login(_success, _fail) {
            myLog({
                name: 'logName',
                time: '00:00'
            });
            gameLogin(_success, _fail);
        }

        //外部调用验证

    }, {
        key: 'authorize',
        value: function authorize(options, _success, _fail) {
            try {
                var openId = wx.getStorageSync('sdkopenid');
                var setData = {
                    encryptedData: options.encryptedData,
                    iv: options.iv,
                    openId: openId,
                    appId: _gamesdkConfig2.default.appId
                };
                var checkState = Checkparam(setData);
                if (checkState == 1) {
                    http(setData, 'POST', 'user/update').then(function (res) {
                        gameLogin(_success, _fail);
                    }, function (err) {
                        _fail(err);
                    });
                } else {
                    var errMsg = '\u524D\u7AEF\u68C0\u67E5\u53C2\u6570\u4E0D\u6B63\u786E' + JSON.stringify(setData);
                    var errData = getErrparamData(errMsg);
                    _fail(errData);
                }
            } catch (e) {
                _fail(e);
            }
        }
    }]);

    return gameSdk;
}();

exports.default = gameSdk;


function myLog(data) {
    if (!logStatus) {
        return;
    }
    console.log('' + JSON.stringify(data));
}

//封装new Promise请求
function http(_data, _methods, _url) {
    try {
        return new Promise(function (resolve, reject) {
            var sessionId = wx.getStorageSync('sessionId') || '';
            console.log('http promise sessionID: ', sessionId);
            wx.request({
                url: _gamesdkConfig2.default.api + _url,
                data: _data,
                method: _methods,
                header: {
                    'content-type': 'application/json',
                    'session-id': sessionId
                },
                success: function success(res) {
                    console.log('wx request success!', res);
                    resolve(res.data);
                },
                fail: function fail(res) {
                    console.log('wx request failed!', res);
                    reject(res);
                }
            });
        });
    } catch (e) {
        myLog(e);
    }
}

//检查参数
function Checkparam(param) {
    myLog(param);
    for (var i in param) {
        if (param[i] == null || param[i] == '' || param[i] == 'undefined') {
            return -1;
        }
    };
    return 1;
}

//参数不正确
function getErrparamData(res) {
    myLog(res);
    return {
        code: -10111,
        data: '',
        msg: res
    };
}

//游戏登录
function gameLogin(_success, _fail) {
    try {
        wx.login({
            success: function success(res) {
                var code = res.code;
                var postData = {
                    code: code,
                    appId: _gamesdkConfig2.default.appId
                };
                console.log('1--------------------gameLogin success!');
                var checkState = Checkparam(postData); //检测参数
                console.log('checkState', checkState, postData);
                if (checkState == 1) {
                    http(postData, 'POST', 'user/login').then(function (res) {
                        if (res.code == 0) {
                            wx.setStorageSync('sdkopenid', res.data.openId);
                            if (!res.data.isNeedUpdateUserInfo) {
                                myLog('\u4FDD\u5B58\u4E86sessionId' + res.data.sessionId);
                                wx.setStorageSync('sessionId', res.data.sessionId);
                            }
                            console.log('2--------------------gameLogin success!');
                            _success(res);
                        } else {
                            console.log('1--------------------gameLogin failed!');
                            _fail(res);
                        }
                    }, function (err) {
                        console.log('2--------------------gameLogin failed!');
                        _fail(err);
                    });
                } else {
                    console.log('3--------------------gameLogin failed!');
                    var errMsg = '\u524D\u7AEF\u68C0\u67E5\u53C2\u6570\u4E0D\u6B63\u786E' + JSON.stringify(postData);
                    var errData = getErrparamData(errMsg);
                    _fail(errData);
                }
            },
            fail: function fail(err) {
                console.log('4--------------------gameLogin failed!');
                _fail(err);
            }
        });
    } catch (e) {
        console.log('5--------------------gameLogin failed!');
        _fail(e);
    }
}

//获取平台系统
function getPlatForm() {
    try {
        var info = wx.getSystemInfoSync();
        myLog({
            name: '当前设备',
            info: info
        });
        if (info.system.indexOf('iOS') == 0) {
            return 'ios';
        } else if (info.system.indexOf('Android') == 0) {
            return 'android';
        } else {
            if (info.system.length > 10) {
                return info.system.substring(0, 10);
            } else {
                return info.system;
            }
        }
    } catch (e) {
        myLog(e);
        return "error";
    }
}
//获取二维码
function getCodeImg(coin, gameCoin, gameCoinName, param, _success, _fail) {
    try {
        var postData = {
            openId: wx.getStorageSync('sdkopenid'),
            appId: _gamesdkConfig2.default.appId,
            coin: coin,
            gameCoin: gameCoin,
            gameCoinName: gameCoinName,
            param: param
        };
        var checkState = Checkparam(postData);
        if (checkState == 1) {
            var myData = { codeBody: JSON.stringify(postData) };
            http(myData, 'POST', 'gamepay/createWXACode').then(function (res) {
                var codeUrl = res.data;
                wx.previewImage({
                    current: codeUrl,
                    urls: [codeUrl],
                    success: function success(res) {
                        myLog(res);
                        _success(res);
                    },
                    fail: function fail(err) {
                        _fail(err);
                    }
                });
            }, function (err) {
                _fail(err);
            });
        } else {
            var errMsg = '\u524D\u7AEF\u68C0\u67E5\u53C2\u6570\u4E0D\u6B63\u786E' + JSON.stringify(postData);
            var errData = getErrparamData(errMsg);
            _fail(errData);
        }
    } catch (e) {
        myLog(e);
    }
}

//米大师支付
function midasPay(data, _success, _fail) {
    try {
        var checkState = Checkparam(data);
        if (checkState == 1) {
            http(data, 'POST', 'gamepay/addCoinOrder').then(function (res) {
                myLog({
                    name: 'midasPay',
                    res: res
                });
                console.log(res);
                var payObj = res.data;
                orderCode = res.data.orderCode; //订单号
                var buyQuantity = res.data.buyQuantity; //购买数量
                if (buyQuantity == 0) {
                    checkOrder(_success, _fail);
                } else {
                    wx.requestMidasPayment({
                        mode: payObj.mode, //模式小游戏选择game
                        env: payObj.env, //环境配置
                        offerId: payObj.offerId, //米大师侧申请的应用id
                        currencyType: payObj.currencyType,
                        platform: payObj.platform, //平台
                        buyQuantity: buyQuantity, //购买数量   
                        zoneId: payObj.zoneId, //分区id
                        success: function success(res) {
                            myLog({
                                name: '成功回调',
                                res: res
                            });
                            checkOrder(_success, _fail);
                        },
                        fail: function fail(err) {
                            myLog({
                                err: err,
                                name: '用户取消支付'
                            });
                            console.log(err, '用户取消');
                            cancelPay(_success, _fail);
                        }
                    });
                }
            }).catch(function (err) {
                myLog(err);
            });
        } else {
            var errMsg = '\u524D\u7AEF\u68C0\u67E5\u53C2\u6570\u4E0D\u6B63\u786E' + JSON.stringify(data);
            var errData = getErrparamData(errMsg);
            _fail(errData);
        }
    } catch (e) {
        _fail(e);
    }
}

//查看订单状态
function checkOrder(_success, _fail) {
    try {
        timer = setInterval(function () {
            var sessionId = wx.getStorageSync('sessionId');
            myLog('\u8BA2\u5355\u53F7:' + orderCode + '--appId:' + _gamesdkConfig2.default.appId + '--sessionId:' + sessionId);
            if (waitOrderTime > 120) {
                myLog('state=5');
                clearInterval(timer);
                var obj = getOrderStatus(10400);
                _success(obj);
            }
            http('', 'GET', 'gamepay/getCoinOrderStatus?orderCode=' + orderCode + '&appId=' + _gamesdkConfig2.default.appId).then(function (res) {
                myLog({ name: '成功回调', '回调参数': res });
                var data = res.data;
                if (res.code == 0) {
                    if (data.pay_status == 1) {
                        myLog('state=1');
                        clearInterval(timer);
                        var _obj = getOrderStatus(10401);
                        _success(_obj);
                    } else if (data.pay_status == 0) {
                        myLog('state=0');
                        waitOrderTime += 1;
                    }
                    if (data.order_status == 2) {
                        myLog('state=2');
                        clearInterval(timer);
                        var _obj2 = getOrderStatus(10402);
                        _fail(_obj2);
                    }
                } else {
                    myLog('state=3');
                    clearInterval(timer);
                    _fail(res);
                }
            }).catch(function (err) {
                myLog({ name: '错误回调', '回调参数': err });
                myLog('state=4');
                clearInterval(timer);
                _fail(errObj);
            });
        }, 1000);
    } catch (e) {
        _fail(e);
    }
}

//获取订单码
function getOrderStatus(code) {
    try {
        var obj = { code: '', data: '', msg: '' };
        if (code == 10400) {
            obj.code = code;
            obj.msg = '支付成功，到账可能延迟';
        } else if (code == 10401) {
            obj.code = code;
            obj.msg = '支付成功';
        } else if (code == 10402) {
            obj.code = code;
            obj.msg = '订单被取消';
        }
        myLog({ name: '订单状态', obj: obj });
        return obj;
    } catch (e) {
        var _obj3 = { code: '', data: '', msg: '' };
        if (code == 10400) {
            _obj3.code = code;
            _obj3.msg = '支付成功，到账可能延迟';
        } else if (code == 10401) {
            _obj3.code = code;
            _obj3.msg = '支付成功';
        } else if (code == 10402) {
            _obj3.code = code;
            _obj3.msg = '订单被取消';
        }
        myLog({ name: '订单状态', obj: _obj3 });
        return _obj3;
    }
}

/* 函数:取消充值 */
function cancelPay(_success, _fail) {
    var data = {
        orderCode: orderCode
    };
    var obj = {
        data: '',
        code: 10405,
        msg: '用户点击了取消'
    };
    http(data, 'POST', 'gamepay/cancelCoinOrder').then(function (res) {
        _fail(obj);
    }, function (err) {
        _fail(obj);
    });
}
module.exports = exports['default'];

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
        //# sourceMappingURL=gamesdk.js.map
        