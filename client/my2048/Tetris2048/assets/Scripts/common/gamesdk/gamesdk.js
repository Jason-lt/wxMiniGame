import config from './gamesdk.config.js';
//logStatus为true打开log，false关闭log
var logStatus = true
// var logStatus = false

//定时器
var timer = null;
//订单
var orderCode = '';
//等待订单时间
var waitOrderTime = 1;

export default class gameSdk {
    //外部调用创建用户信息按钮
    static createUserInfoBtn(type, text, image, style, _success, _fail) {
        try {
            let self = this;
            let info = wx.getSystemInfoSync();
            if(info.SDKVersion < '2.0.6'){
                wx.getUserInfo({
                    success: function (res) {
                        let options = {
                            encryptedData: res.encryptedData,
                            iv: res.iv
                        };
                        self.authorize(options, _success, _fail);
                    },
                    fail: function (err) {
                        _fail(err);
                    }
                })
                return;
            }
            let btn = wx.createUserInfoButton({
                type: type,
                text: text,
                image: image,
                style: style
            });
            let obj = { code: 1, data: btn, msg: 'success' };
            _success(obj);
        }
        catch (e) {
            _fail(e);
        };
    }

    //判断支付使用方法(coin必须为整数)
    static pay(coin, gameCoin, gameCoinName, param, _success, _fail) {
        try {
            let platform = getPlatForm();
            let self = this;
            http('', 'GET', 'gamepay/getGamePayType?os=' + platform + '&appId=' + config.appId).then(res => {
                myLog(res);
                let data = res.data;
                if (data == 'wxpay') {
                    getCodeImg(coin, gameCoin, gameCoinName, param, _success, _fail);
                } else if (data == 'midas') {
                    myLog('midasPay');
                    let midasData = {
                        coin: coin,
                        gameCoinName: gameCoinName,
                        gameCoin: gameCoin,
                        param: param,
                        payType: 'midas',
                        purpose: 2,
                        appId: config.appId
                    };
                    midasPay(midasData, _success, _fail);
                } else if (data == 'none') {
                    myLog('pay none')
                } else {
                    _fail(res)
                }
            }, err => {
                _fail(err);
            })
        }
        catch (e) {
            _fail(e)
        }

    }

    //外部调用login
    static login(_success, _fail) {
        myLog({
            name: 'logName',
            time: '00:00'
        });
        gameLogin(_success, _fail);
    }

    //外部调用验证
    static authorize(options, _success, _fail) {
        try {
            let openId = wx.getStorageSync('sdkopenid');
            let setData = {
                encryptedData: options.encryptedData,
                iv: options.iv,
                openId: openId,
                appId: config.appId
            };
            let checkState = Checkparam(setData);
            if (checkState == 1) {
                http(setData, 'POST', 'user/update').then(res => {
                    gameLogin(_success, _fail);
                }, err => {
                    _fail(err);
                })
            } else {
                let errMsg = `前端检查参数不正确${JSON.stringify(setData)}`;
                let errData = getErrparamData(errMsg);
                _fail(errData);
            }
        }
        catch (e) {
            _fail(e);
        }

    }

}

function myLog(data) {
    if (!logStatus) {
        return
    }
    console.log(`${JSON.stringify(data)}`)
}


//封装new Promise请求
function http(_data, _methods, _url) {
    try {
        return new Promise((resolve, reject) => {
            let sessionId = wx.getStorageSync('sessionId') || '';
            console.log('http promise sessionID: ', sessionId);
            wx.request({
                url: config.api + _url,
                data: _data,
                method: _methods,
                header: {
                    'content-type': 'application/json',
                    'session-id': sessionId,
                },
                success: function (res) {
                    console.log('wx request success!', res);
                    resolve(res.data);
                },
                fail: function (res) {
                    console.log('wx request failed!', res);
                    reject(res);
                }
            })
        })
    } catch (e) {
        myLog(e);
    }
}

//检查参数
function Checkparam(param) {
    myLog(param);
    for (let i in param) {
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
    }
}

//游戏登录
function gameLogin(_success, _fail) {
    try {
        wx.login({
            success: res => {
                let code = res.code;
                let postData = {
                    code: code,
                    appId: config.appId
                };
                console.log('1--------------------gameLogin success!');
                let checkState = Checkparam(postData);//检测参数
                console.log('checkState', checkState, postData);
                if (checkState == 1) {
                    http(postData, 'POST', 'user/login').then(res => {
                        if (res.code == 0) {
                            wx.setStorageSync('sdkopenid', res.data.openId);
                            if (!res.data.isNeedUpdateUserInfo) {
                                myLog(`保存了sessionId${res.data.sessionId}`);
                                wx.setStorageSync('sessionId', res.data.sessionId);
                            }
                            console.log('2--------------------gameLogin success!');
                            _success(res);
                        } else {
                            console.log('1--------------------gameLogin failed!');
                            _fail(res);
                        }
                    }, err => {
                        console.log('2--------------------gameLogin failed!');
                        _fail(err);
                    })
                } else {
                    console.log('3--------------------gameLogin failed!');
                    let errMsg = `前端检查参数不正确${JSON.stringify(postData)}`;
                    let errData = getErrparamData(errMsg);
                    _fail(errData);
                }

            },
            fail: function (err) {
                console.log('4--------------------gameLogin failed!');
                _fail(err);
            }
        })
    } catch (e) {
        console.log('5--------------------gameLogin failed!');
        _fail(e);
    }
}

//获取平台系统
function getPlatForm() {
    try {
        let info = wx.getSystemInfoSync();
        myLog({
            name: '当前设备',
            info: info,
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
    }
    catch (e) {
        myLog(e);
        return "error";
    }
}
//获取二维码
function getCodeImg(coin, gameCoin, gameCoinName, param, _success, _fail) {
    try {
        let postData = {
            openId: wx.getStorageSync('sdkopenid'),
            appId: config.appId,
            coin: coin,
            gameCoin: gameCoin,
            gameCoinName: gameCoinName,
            param: param
        };
        let checkState = Checkparam(postData);
        if (checkState == 1) {
            let myData = { codeBody: JSON.stringify(postData) }
            http(myData, 'POST', 'gamepay/createWXACode').then(res => {
                let codeUrl = res.data;
                wx.previewImage({
                    current: codeUrl,
                    urls: [codeUrl],
                    success: function (res) {
                        myLog(res);
                        _success(res);
                    },
                    fail: function (err) {
                        _fail(err);
                    }
                })
            }, err => {
                _fail(err)
            })
        } else {
            let errMsg = `前端检查参数不正确${JSON.stringify(postData)}`;
            let errData = getErrparamData(errMsg);
            _fail(errData);
        }
    }
    catch (e) {
        myLog(e);
    }
}

//米大师支付
function midasPay(data, _success, _fail) {
    try {
        let checkState = Checkparam(data);
        if (checkState == 1) {
            http(data, 'POST', 'gamepay/addCoinOrder').then(res => {
                myLog({
                    name: 'midasPay',
                    res: res
                });
                console.log(res)
                let payObj = res.data;
                orderCode = res.data.orderCode; //订单号
                let buyQuantity = res.data.buyQuantity; //购买数量
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
                        success: function (res) {
                            myLog({
                                name: '成功回调',
                                res: res
                            });
                            checkOrder(_success, _fail);
                        },
                        fail: function (err) {
                            myLog({
                                err: err,
                                name: '用户取消支付'
                            });
                            console.log(err,'用户取消')
                            cancelPay(_success, _fail);
                        }
                    });
                }

            }).catch(err => {
                myLog(err);
            })
        }
        else {
            let errMsg = `前端检查参数不正确${JSON.stringify(data)}`;
            let errData = getErrparamData(errMsg);
            _fail(errData);
        }

    } catch (e) {
        _fail(e);
    }
}


//查看订单状态
function checkOrder(_success, _fail) {
    try {
        timer = setInterval(() => {
            let sessionId = wx.getStorageSync('sessionId')
            myLog(`订单号:${orderCode}--appId:${config.appId}--sessionId:${sessionId}`);
            if (waitOrderTime > 120) {
                myLog('state=5');
                clearInterval(timer);
                let obj = getOrderStatus(10400);
                _success(obj);
            }
            http('', 'GET', 'gamepay/getCoinOrderStatus?orderCode='
                + orderCode + '&appId=' + config.appId).then(res => {
                    myLog({ name: '成功回调', '回调参数': res });
                    let data = res.data;
                    if (res.code == 0) {
                        if (data.pay_status == 1) {
                            myLog('state=1')
                            clearInterval(timer);
                            let obj = getOrderStatus(10401);
                            _success(obj);

                        } else if (data.pay_status == 0) {
                            myLog('state=0');
                            waitOrderTime += 1;
                        }
                        if (data.order_status == 2) {
                            myLog('state=2');
                            clearInterval(timer);
                            let obj = getOrderStatus(10402);
                            _fail(obj);
                        }
                    } else {
                        myLog('state=3');
                        clearInterval(timer);
                        _fail(res);
                    }

                }).catch(err => {
                    myLog({ name: '错误回调', '回调参数': err });
                    myLog('state=4');
                    clearInterval(timer);
                    _fail(errObj);
                })
        }, 1000)
    }
    catch (e) {
        _fail(e);
    }
}

//获取订单码
function getOrderStatus(code) {
    try {
        let obj = { code: '', data: '', msg: '' };
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
    }
    catch (e) {
        let obj = { code: '', data: '', msg: '' };
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
    }

}

/* 函数:取消充值 */
function cancelPay(_success, _fail) {
    let data = {
        orderCode: orderCode
    };
    let obj = {
        data: '',
        code: 10405,
        msg: '用户点击了取消'
    };
    http(data, 'POST', 'gamepay/cancelCoinOrder').then(res => {
        _fail(obj);
    }, err => {
        _fail(obj);
    })
}

