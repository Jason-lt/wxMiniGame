"use strict";
cc._RF.push(module, '2c890KoRb5IlYFN30NRuYWl', 'dataStatistics');
// Scripts/lib_dataStatistics/dataStatistics.js

"use strict";
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}function _classCallCheck(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}function request(e) {
  if (myLog(e), isOpenUserLog) {
    var t = 0;!function a() {
      wx.request({ url: "https://h5game-log.kuaiyugo.com/dataAnalysis/saveUserBehaviorLog", data: e, method: "POST", header: { "content-type": "application/json" }, success: function success(e) {}, fail: function fail(n) {
          t < 2 && (t++, e.retryTimes = t, a());
        } });
    }();
  }
}function getUserSaveDay(e) {
  try {
    if ("sign_in" == e) return wx.setStorageSync("regtime", new Date().getTime()), 0;var t = wx.getStorageSync("regtime");return ((new Date().getTime() - t) / 1e3 / 60 / 60 / 24).toFixed(0);
  } catch (e) {
    myLog(e);
  }
}function makeuid() {
  try {
    return "" + Date.now() + Math.floor(1e7 * Math.random());
  } catch (e) {
    myLog(e);
  }
}function getObject(e) {
  try {
    var t = getUserSaveDay(e);return { appKey: _dataStatisticsConfig2.default.appKey, channelCode: wx.getStorageSync("channelCode") || "", channelId: wx.getStorageSync("channelId") || "", createDateTime: new Date().getTime(), path: "", query: {}, retain: t, shareId: wx.getStorageSync("shareId") || "", scene: "", type: e, userId: wx.getStorageSync("userId") };
  } catch (e) {
    myLog(e);
  }
}function _getShareInfo(e) {
  var t = "";try {
    t = wx.getStorageSync("userId");
  } catch (e) {}return new Promise(function (a, n) {
    wx.request({ url: _dataStatisticsConfig2.default.api + "backendManager/getMaterialInfoByAppkey?channelPrefix=" + e + "&appKey=" + _dataStatisticsConfig2.default.appKey + "&userId=" + t, method: "GET", header: { "content-type": "application/json" }, success: function success(t) {
        myLog({ name: "服务器返回分享信息", res: t });var n = "";try {
          n = wx.getStorageSync("channelId");
        } catch (e) {
          n = wx.getStorageSync("channelId");
        }if (t.data.data.channel_code) {
          var o = t.data.data.channel_code + "-" + n;if (e == _EChannelPrefix2.default.regular) try {
            wx.setStorageSync("passivechannelcode", o);
          } catch (e) {
            wx.setStorageSync("passivechannelcode", o);
          } else wx.setStorageSync("channelCode", o);
        }a(t);
      }, fail: function fail(e) {
        n(e);
      } });
  });
}function http(e, t, a) {
  try {
    return new Promise(function (n, o) {
      wx.request({ url: _dataStatisticsConfig2.default.api + a, data: e, method: t, header: { "content-type": "application/json" }, success: function success(e) {
          n(e);
        }, fail: function fail(e) {
          o(e);
        } });
    });
  } catch (e) {
    myLog(e);
  }
}function HandleGoto(e) {
  try {
    if (!wx.navigateToMiniProgram) return;if (e.query.goto || e.referrerInfo) {
      http("", "GET", "game/getGotoConfig?id=" + (e.query.goto || e.referrerInfo.extraData.goto)).then(function (e) {
        myLog(e);var t = e.data.data,
            a = t.is_open;if (myLog(a), a) {
          var n = t.appid,
              o = t.next_id;wx.navigateToMiniProgram({ appId: n, envVersion: "release", extraData: { goto: o }, success: function success(e) {
              myLog(e);
            } });
        }
      }).catch(function (e) {
        myLog(e);
      });
    }
  } catch (e) {
    myLog(e);
  }
}function getErrData(e) {
  return myLog(e), { code: -10110, data: e, msg: "request fail" };
}function getErrParamsData(e) {
  return myLog(e), { code: -10111, data: "", msg: e };
}function login(e, t, a) {
  try {
    wx.showLoading({ title: "登录中...", mask: !0, success: function success() {
        wxLogin(e, t, a);
      }, fail: function fail() {
        login(e, t, a);
      } });
  } catch (e) {
    myLog(e);
  }
}function wxLogin(e, t, a) {
  try {
    wx.login({ success: function success(n) {
        var o = n.code,
            r = { appId: _dataStatisticsConfig2.default.appId, code: o };if (1 == CheckParams(r)) http(r, "POST", "user/standAloneLogin").then(function (n) {
          if (console.log(n, "res"), myLog({ name: "登录信息", res: n }), 0 == n.data.code) {
            isDebug = n.data.debug;try {
              var o = n.data.data.openId;myLog("获取" + o), wx.setStorageSync("userId", o), onLoginInfo(e, t, a);
            } catch (n) {
              console.log(n), retryLogin(e, t, a, n, "str");
            }
          } else retryLogin(e, t, a, n, "obj");
        }).catch(function (n) {
          retryLogin(e, t, a, n, "obj");
        });else {
          var c = "前端检查参数不正确" + JSON.stringify(r),
              i = getErrParamsData(c);a(i);
        }
      }, fail: function fail(n) {
        myLog("微信Login失败"), retryLogin(e, t, a, n, "obj");
      } });
  } catch (e) {
    myLog(e), wx.hideLoading();
  }
}function retryLogin(e, t, a, n, o) {
  try {
    var r = "网络异常，是否重新登录";"str" == o ? r += " " + n : "obj" == o && (n.data ? r += " " + JSON.stringify(n.data.msg) : r += " " + JSON.stringify(n)), console.log(r), wx.hideLoading(), wx.showModal({ title: "提示", content: r, showCancel: !1, success: function success(n) {
        if (n.confirm) try {
          wx.showLoading({ title: "登录中...", mask: !1 }), wxLogin(e, t, a);
        } catch (n) {
          wx.showLoading({ title: "登录中...", mask: !1 }), wxLogin(e, t, a);
        }
      }, fail: function fail() {
        wxLogin(e, t, a);
      } });
  } catch (e) {
    myLog(e);
  }
}function onLoginInfo(e, t, a) {
  try {
    var n = getObject("login_in");wx.setStorageSync("lastlogintime", new Date().getTime()), n.query = e.query, HandleGoto(e), e.query.channelId && (n.channelId = e.query.channelId);try {
      wx.setStorageSync("channelId", n.channelId);
    } catch (e) {
      wx.setStorageSync("channelId", n.channelId);
    }e.query.channelCode ? n.channelCode = e.query.channelCode : e.referrerInfo && e.referrerInfo.extraData && e.referrerInfo.extraData.channelCode && (n.channelCode = e.referrerInfo.extraData.channelCode);try {
      wx.setStorageSync("channelCode", n.channelCode);
    } catch (e) {
      wx.setStorageSync("channelCode", n.channelCode);
    }e.query.shareId && (n.shareId = e.query.shareId);try {
      wx.setStorageSync("shareId", n.shareId);
    } catch (e) {
      wx.setStorageSync("shareId", n.shareId);
    }e.scene && (n.scene = e.scene);t({ data: "success" }), wx.hideLoading();request({ userLog: JSON.stringify(n) });
  } catch (e) {
    wx.hideLoading(), myLog(e);
  }
}function dataRetry(e, t, a, n, o) {
  try {
    var r = "网络异常，请稍后重试";isDebug && (r += JSON.stringify(o)), wx.showModal({ title: "提示", content: r, showCancel: !1, success: function success(o) {
        "get" == e ? dataStatistics.getKVUserData(a, n) : "set" == e && dataStatistics.setKVUserData(t, a, n);
      }, fail: function fail(o) {
        dataRetry(e, t, a, n, o);
      } });
  } catch (e) {
    myLog(e);
  }
}function CheckParams(e) {
  myLog(e);for (var t in e) {
    if (null == e[t] || "" == e[t] || "undefined" == e[t]) return -1;
  }return 1;
}function myLog(e) {
  logStatus && console.log(e);
}Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
  function e(e, t) {
    for (var a = 0; a < t.length; a++) {
      var n = t[a];n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
    }
  }return function (t, a, n) {
    return a && e(t.prototype, a), n && e(t, n), t;
  };
}(),
    _dataStatisticsConfig = require("./dataStatistics.config.js"),
    _dataStatisticsConfig2 = _interopRequireDefault(_dataStatisticsConfig),
    _EChannelPrefix = require("./EChannelPrefix"),
    _EChannelPrefix2 = _interopRequireDefault(_EChannelPrefix),
    logStatus = !0,
    isDebug = !1,
    isOpenUserLog = !0,
    dataStatistics = function () {
  function e() {
    _classCallCheck(this, e);
  }return _createClass(e, null, [{ key: "shareAppMsg", value: function value(e) {
      try {
        var t = getObject("share");t.shareId = t.userId, e.query && "" != e.query ? e.query += "&shareId=" + t.shareId + "&channelCode=" + t.channelCode : e.query = "shareId=" + t.shareId + "&channelCode=" + t.channelCode, myLog({ name: "options", options: e }), wx.shareAppMessage(e);request({ userLog: JSON.stringify(t) });
      } catch (e) {
        myLog(e);
      }
    } }, { key: "onShareAppMsg", value: function value(e) {
      try {
        var t = getObject("share");t.query = e.query, t.shareId = t.userId, t.channelCode = wx.getStorageSync("passivechannelcode"), e.query && "" != e.query ? e.query += "&shareId=" + t.shareId + "&channelCode=" + t.channelCode : e.query = "shareId=" + t.shareId + "&channelCode=" + t.channelCode;return request({ userLog: JSON.stringify(t) }), myLog({ name: "options", options: e }), e;
      } catch (e) {
        myLog(e);
      }
    } }, { key: "shareSuccess", value: function value(e) {
      try {
        var t = getObject("sharesuccess");if ("initiative" == e) try {
          t.channelCode = wx.getStorageSync("channelCode");
        } catch (e) {
          t.channelCode = wx.getStorageSync("channelCode");
        } else try {
          t.channelCode = wx.getStorageSync("passivechannelcode");
        } catch (e) {
          t.channelCode = wx.getStorageSync("passivechannelcode");
        }t.shareId = t.userId;request({ userLog: JSON.stringify(t) });
      } catch (e) {
        myLog(e);
      }
    } }, { key: "onShowInfo", value: function value(e, t, a) {
      myLog("sdk_config.version" + _dataStatisticsConfig2.default.version);var n = t || function () {},
          o = a || function () {};try {
        if (wx.navigateToMiniProgram) {
          onLoginInfo(e, n, o);var r = makeuid();wx.setStorageSync("userId", r);
        } else "" == wx.getStorageSync("userId") || null == wx.getStorageSync("userId") ? login(e, n, o) : onLoginInfo(e, n, o);
      } catch (e) {
        myLog(e);
      }
    } }, { key: "onHideInfo", value: function value() {
      try {
        var e = getObject("login_out");e.lastLoginIn = wx.getStorageSync("lastlogintime");request({ userLog: JSON.stringify(e) });
      } catch (e) {
        myLog(e);
      }
    } }, { key: "getShareInfo", value: function value(e, t, a) {
      console.log("in");try {
        var n = t || function () {},
            o = a || function () {},
            r = { channelPrefix: e, appKey: _dataStatisticsConfig2.default.appKey };if (1 == CheckParams(r)) _getShareInfo(e).then(function (e) {
          "function" == typeof n && n(e);
        }).catch(function (e) {
          var t = getErrData(e);"function" == typeof o && o(t);
        });else {
          var c = "前端检查参数不正确" + JSON.stringify(r),
              i = getErrParamsData(c);o(i);
        }
      } catch (e) {
        myLog(e);
      }
    } }, { key: "setKVUserData", value: function value(e, t, a) {
      try {
        var n = { appKey: _dataStatisticsConfig2.default.appKey, user: wx.getStorageSync("userId"), value: e },
            o = t || function () {},
            r = a || function () {};if (1 == CheckParams(n)) http(n, "POST", "game/setKVUserData").then(function (e) {
          myLog(e), "function" == typeof o && o(e);
        }).catch(function (t) {
          myLog(t);var a = getErrData(t);"function" == typeof r && r(a), dataRetry("set", e, o, r, t);
        });else {
          var c = "前端检查参数不正确" + JSON.stringify(n),
              i = getErrParamsData(c);r(i);
        }
      } catch (e) {
        myLog(e);
      }
    } }, { key: "getKVUserData", value: function value(e, t) {
      try {
        var a = e || function () {},
            n = t || function () {},
            o = wx.getStorageSync("userId"),
            r = { appKey: _dataStatisticsConfig2.default.appKey, user: o };if (1 == CheckParams(r)) http("", "GET", "game/getKVUserData?appKey=" + _dataStatisticsConfig2.default.appKey + "&user=" + o).then(function (e) {
          myLog(e), "function" == typeof a && a(e);
        }).catch(function (e) {
          var t = getErrData(e);"function" == typeof n && n(t), dataRetry("get", "", a, n, e);
        });else {
          var c = "前端检查参数不正确" + JSON.stringify(r),
              i = getErrParamsData(c);n(i);
        }
      } catch (e) {
        myLog(e);
      }
    } }, { key: "getServerTime", value: function value(e, t) {
      try {
        http("", "GET", "user/getServerTime").then(function (t) {
          e(t);
        }).catch(function (e) {
          t(e);
        });
      } catch (e) {
        myLog(e);
      }
    } }, { key: "getGameConfigByAppkey", value: function value(e, t) {
      try {
        var a = e || function () {},
            n = t || function () {};if ("" == _dataStatisticsConfig2.default.appKey || null == _dataStatisticsConfig2.default.appKey) {
          var o = "前端检查参数不正确appkey=" + _dataStatisticsConfig2.default.appKey,
              r = getErrParamsData(o);n(r);
        } else http("", "GET", "game/getGameConfigByAppkey?appKey=" + _dataStatisticsConfig2.default.appKey).then(function (e) {
          myLog(e), "function" == typeof a && a(e);
        }).catch(function (e) {
          var t = getErrData(e);"function" == typeof n && n(t);
        });
      } catch (e) {
        myLog(e);
      }
    } }, { key: "createUserInfoBtn", value: function value(e, t, a, n, o, r) {
      try {
        var c = this;if (wx.getSystemInfoSync().SDKVersion < "2.0.6") return void wx.getUserInfo({ success: function success(e) {
            var t = { encryptedData: e.encryptedData, iv: e.iv };c.authorize(t, o, r);
          }, fail: function fail(e) {
            r(e);
          } });var i = wx.createUserInfoButton({ type: e, text: t, image: a, style: n });o({ code: 1, data: i, msg: "success" });
      } catch (e) {
        r(e);
      }
    } }]), e;
}();exports.default = dataStatistics;

cc._RF.pop();