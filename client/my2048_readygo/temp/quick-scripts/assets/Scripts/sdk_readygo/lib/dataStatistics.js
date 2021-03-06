(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/sdk_readygo/lib/dataStatistics.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6f9cba8rABMZK9/iVftCw/h', 'dataStatistics', __filename);
// Scripts/sdk_readygo/lib/dataStatistics.js

"use strict";
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}function _defineProperty(e, t, a) {
  return t in e ? Object.defineProperty(e, t, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = a, e;
}function _classCallCheck(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}function gameHttp(e, t, a) {
  try {
    return "GET" == a && (e = dataStatistics.stringify(e, t), t = ""), new Promise(function (n, o) {
      var c = wx.getStorageSync("sessionId") || "";wx.request({ url: e, data: t, method: a, header: { "content-type": "application/json", "session-id": c }, success: function success(e) {
          n(e.data);
        }, fail: function fail(e) {
          o(e);
        } });
    });
  } catch (e) {
    myLog(e);
  }
}function request(e) {
  if (myLog(e), isOpenUserLog) {
    var t = 0;!function a() {
      wx.request({ url: "https://h5game-log.kuaiyugo.com/dataAnalysis/saveUserBehaviorLogV2", data: e, method: "POST", header: { "content-type": "application/json" }, success: function success(e) {}, fail: function fail(n) {
          t < 2 && (t++, e.retryTimes = t, a());
        } });
    }();
  }
}function _getShareInfo(e) {
  var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
      a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "",
      n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "",
      o = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : "",
      c = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : "",
      i = "";try {
    i = wx.getStorageSync("uid");
  } catch (e) {}return new Promise(function (r, g) {
    wx.request({ url: _config2.default.api + "backendManager/getMaterialInfoByAppkey?channelPrefix=" + e + "&appKey=" + _config2.default.appKey + "&userId=" + i + "&materialSuffix=" + t + "&name=" + a + "&point=" + n + "&other=" + o + "&channelCode=" + c, method: "GET", header: { "content-type": "application/json" }, success: function success(t) {
        if (myLog({ name: "服务器返回分享信息", res: t }), t.data.data.channel_code) {
          var a = t.data.data.channel_code;if (e == _EChannelPrefix2.default.regular) try {
            wx.setStorageSync("passivechannelcode", a);
          } catch (e) {
            wx.setStorageSync("passivechannelcode", a);
          } else console.log("what the fuck?"), wx.setStorageSync("channelCode", a);
        }r(t);
      }, fail: function fail(e) {
        g(e);
      } });
  });
}function http(e, t, a) {
  try {
    return new Promise(function (n, o) {
      wx.request({ url: _config2.default.api + a, data: e, method: t, header: { "content-type": "application/json" }, success: function success(e) {
          0 == e.data.code ? n(e) : o(e);
        }, fail: function fail(e) {
          o(e);
        } });
    });
  } catch (e) {
    myLog(e);
  }
}function HandleGoto(e) {
  try {
    var t = "";if (e.query.goto ? t = e.query.goto : e.referrerInfo && e.referrerInfo.extraData && e.referrerInfo.extraData.goto && (t = e.referrerInfo.extraData.goto), "" == t || void 0 == t || null == t) return;http("", "GET", "game/getGotoConfig?id=" + t).then(function (e) {
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
            c = { appId: _config2.default.appId, code: o };if (1 == CheckParams(c)) http(c, "POST", "user/standAloneLogin").then(function (n) {
          if (console.log(n, "res"), myLog({ name: "登录信息", res: n }), 0 == n.data.code) {
            isDebug = n.data.debug;try {
              console.log(n.data.data);var o = n.data.data.openId;myLog("获取" + o), wx.setStorageSync("uid", o), wx.setStorageSync("sessionId", n.data.data.sessionId), onLoginInfo(e, t, a, n.data);
            } catch (n) {
              console.log(n), retryLogin(e, t, a, n, "str");
            }
          } else retryLogin(e, t, a, n, "obj");
        }).catch(function (n) {
          retryLogin(e, t, a, n, "obj");
        });else {
          var i = "前端检查参数不正确" + JSON.stringify(c),
              r = getErrParamsData(i);a(r);
        }
      }, fail: function fail(n) {
        myLog("微信Login失败"), retryLogin(e, t, a, n, "obj");
      } });
  } catch (e) {
    myLog(e), wx.hideLoading();
  }
}function retryLogin(e, t, a, n, o) {
  try {
    var c = "网络异常，是否重新登录";"str" == o ? c += " " + n : "obj" == o && (n.data ? c += " " + JSON.stringify(n.data.msg) : c += " " + JSON.stringify(n)), console.log(c), wx.hideLoading(), wx.showModal({ title: "提示", content: c, showCancel: !1, success: function success(n) {
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
}function onLoginInfo(e, t, a, n) {
  console.log(e);try {
    var o = getObject("login_in");wx.setStorageSync("lastlogintime", new Date().getTime()), e.scene && (o.ext.scene = e.scene), HandleGoto(e), e.query.channelCode ? o.ext.ccode = e.query.channelCode : e.referrerInfo && e.referrerInfo.extraData && e.referrerInfo.extraData.channelCode && (o.ext.ccode = e.referrerInfo.extraData.channelCode);try {
      wx.setStorageSync("channelCode", o.ext.ccode);
    } catch (e) {
      wx.setStorageSync("channelCode", o.ext.ccode);
    }e.query.sid && (o.ext.sid = e.query.sid);try {
      wx.setStorageSync("sid", o.ext.sid);
    } catch (e) {
      wx.setStorageSync("sid", o.ext.sid);
    }t(n), wx.hideLoading(), _filterObj(o.ext);request({ userLog: o });
  } catch (e) {
    wx.hideLoading(), myLog(e);
  }
}function dataRetry(e, t, a, n, o) {
  try {
    var c = "网络异常，请稍后重试";isDebug && (c += JSON.stringify(o)), wx.showModal({ title: "提示", content: c, showCancel: !1, success: function success(o) {
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
}function getObject(e) {
  try {
    var t = wx.getSystemInfoSync(),
        a = {};return a.v = sdkVersion, a.ext = { ak: _config2.default.appKey, ccode: wx.getStorageSync("channelCode") || "", sid: wx.getStorageSync("sid") || "", type: e, uid: wx.getStorageSync("uid"), scene: wx.getStorageSync("scene") || "" }, a.device = t, getUserLocation && (a.location = locationInfo), a;
  } catch (e) {
    myLog(e);
  }
}function _filterObj(e) {
  for (var t in e) {
    "" != e[t] && null != e[t] && void 0 != e[t] && "{}" != JSON.stringify(e[t]) || delete e[t];
  }return e;
}function handleLoading() {
  try {
    wx.getClipboardData({ success: function success(e) {
        var t = e.data;console.log(t), "" != t && null != t && void 0 != t || (t = "");var a = { appId: _config2.default.appId, content: t };gameHttp(_config2.default.api + "login/handleClipboardContent?appId=" + a.appId + "&content=" + a.content, "", "GET").then(function (e) {
          if (console.log(e), e.data.needToSet) {
            var t = e.data.content;wx.setClipboardData({ data: t, success: function success(e) {
                console.log(e, "剪切成功"), wx.showLoading({ title: "" }), setTimeout(function () {
                  wx.hideLoading();
                }, 100);
              }, fail: function fail(e) {
                console.log(e, "剪切失败");
              } });
          }
        }).catch(function (e) {
          console.log(e);
        });
      }, fail: function fail(e) {
        console.log(e);
      } });
  } catch (e) {
    console.log(e);
  }
}Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
  function e(e, t) {
    for (var a = 0; a < t.length; a++) {
      var n = t[a];n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
    }
  }return function (t, a, n) {
    return a && e(t.prototype, a), n && e(t, n), t;
  };
}(),
    _config = require("./config.js"),
    _config2 = _interopRequireDefault(_config),
    _EChannelPrefix = require("./EChannelPrefix"),
    _EChannelPrefix2 = _interopRequireDefault(_EChannelPrefix),
    sdkVersion = "1.1.0",
    logStatus = !0,
    isDebug = !1,
    isOpenUserLog = !0,
    getUserLocation = !1,
    locationInfo = {};getUserLocation && wx.getLocation({ success: function success(e) {
    locationInfo = e;
  } });var dataStatistics = function () {
  function e() {
    _classCallCheck(this, e);
  }return _createClass(e, null, [{ key: "saveLog", value: function value(e) {
      try {
        var t = wx.getStorageSync("channelCode") || "",
            a = wx.getStorageSync("scene") || "",
            n = wx.getStorageSync("sid") || "";e.query.channelCode ? t = e.query.channelCode : e.referrerInfo && e.referrerInfo.extraData && e.referrerInfo.extraData.channelCode && (t = e.referrerInfo.extraData.channelCode), e.query.sid && (n = e.query.sid), e.scene && (a = e.scene), wx.setStorageSync("channelCode", t), wx.setStorageSync("sid", n), wx.setStorageSync("scene", a);
      } catch (e) {
        console.log(e);
      }
    } }, { key: "shareAppMsg", value: function value(e) {
      try {
        var t = getObject("share");t.ext.sid = t.ext.uid, e.query && "" != e.query ? e.query += "&sid=" + t.ext.sid + "&channelCode=" + t.ext.ccode : e.query = "sid=" + t.ext.sid + "&channelCode=" + t.ext.ccode, myLog({ name: "options", options: e }), wx.shareAppMessage(e), t.ext = _filterObj(t.ext);request({ userLog: t });
      } catch (e) {
        myLog(e);
      }
    } }, { key: "onShareAppMsg", value: function value(e) {
      try {
        var t = getObject("share");t.ext.sid = t.ext.uid, t.ext.ccode = wx.getStorageSync("passivechannelcode"), e.query && "" != e.query ? e.query += "&sid=" + t.ext.sid + "&channelCode=" + t.ext.ccode : e.query = "sid=" + t.ext.sid + "&channelCode=" + t.ext.ccode, t.ext = _filterObj(t.ext);return request({ userLog: t }), myLog({ name: "options", options: e }), e;
      } catch (e) {
        myLog(e);
      }
    } }, { key: "shareSuccess", value: function value(e) {
      try {
        var t = getObject("sharesuccess");if ("initiative" == e) try {
          t.ext.ccode = wx.getStorageSync("channelCode");
        } catch (e) {
          t.ext.ccode = wx.getStorageSync("channelCode");
        } else try {
          t.ext.ccode = wx.getStorageSync("passivechannelcode");
        } catch (e) {
          t.ext.ccode = wx.getStorageSync("passivechannelcode");
        }t.ext.sid = t.ext.uid, t.ext = _filterObj(t.ext);request({ userLog: t });
      } catch (e) {
        myLog(e);
      }
    } }, { key: "onShowInfo", value: function value(e, t, a) {
      myLog("sdk_config.version" + sdkVersion), handleLoading();var n = t || function () {},
          o = a || function () {};try {
        if ("" == wx.getStorageSync("uid") || null == wx.getStorageSync("uid")) login(e, n, o);else {
          var c = { code: 0, data: { openId: wx.getStorageSync("uid") }, msg: "" };wx.getStorageSync("gameUserInfo") && (c.data.userInfo = JSON.parse(wx.getStorageSync("gameUserInfo"))), onLoginInfo(e, n, o, c);
        }
      } catch (e) {
        myLog(e);
      }
    } }, { key: "onHideInfo", value: function value() {
      try {
        var e = getObject("login_out");e.ext.preLogin = wx.getStorageSync("lastlogintime"), e.ext = _filterObj(e.ext);request({ userLog: e });
      } catch (e) {
        myLog(e);
      }
    } }, { key: "getShareInfo", value: function value(e, t, a) {
      var n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "",
          o = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : "",
          c = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : "",
          i = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : "",
          r = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : "";try {
        var g = t || function () {},
            s = a || function () {},
            f = { channelPrefix: e, appKey: _config2.default.appKey };if (1 == CheckParams(f)) _getShareInfo(e, n, o, c, i, r).then(function (e) {
          "function" == typeof g && g(e);
        }).catch(function (e) {
          var t = getErrData(e);"function" == typeof s && s(t);
        });else {
          var d = "前端检查参数不正确" + JSON.stringify(f),
              u = getErrParamsData(d);s(u);
        }
      } catch (e) {
        myLog(e);
      }
    } }, { key: "setKVUserData", value: function value(e, t, a) {
      try {
        var n = { appKey: _config2.default.appKey, user: wx.getStorageSync("uid"), value: e },
            o = t || function () {},
            c = a || function () {};if (1 == CheckParams(n)) http(n, "POST", "game/setKVUserData").then(function (e) {
          myLog(e), "function" == typeof o && o(e);
        }).catch(function (t) {
          myLog(t);var a = getErrData(t);"function" == typeof c && c(a), dataRetry("set", e, o, c, t);
        });else {
          var i = "前端检查参数不正确" + JSON.stringify(n),
              r = getErrParamsData(i);c(r);
        }
      } catch (e) {
        myLog(e);
      }
    } }, { key: "getKVUserData", value: function value(e, t) {
      try {
        var a = e || function () {},
            n = t || function () {},
            o = wx.getStorageSync("uid"),
            c = { appKey: _config2.default.appKey, user: o };if (1 == CheckParams(c)) http("", "GET", "game/getKVUserData?appKey=" + _config2.default.appKey + "&user=" + o).then(function (e) {
          myLog(e), "function" == typeof a && a(e);
        }).catch(function (e) {
          var t = getErrData(e);"function" == typeof n && n(t), dataRetry("get", "", a, n, e);
        });else {
          var i = "前端检查参数不正确" + JSON.stringify(c),
              r = getErrParamsData(i);n(r);
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
            n = t || function () {};if ("" == _config2.default.appKey || null == _config2.default.appKey) {
          var o = "前端检查参数不正确appkey=" + _config2.default.appKey,
              c = getErrParamsData(o);n(c);
        } else http("", "GET", "game/getGameConfigByAppkey?appKey=" + _config2.default.appKey).then(function (e) {
          myLog(e), "function" == typeof a && a(e);
        }).catch(function (e) {
          var t = getErrData(e);"function" == typeof n && n(t);
        });
      } catch (e) {
        myLog(e);
      }
    } }, { key: "withDraw", value: function value() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
          t = arguments[1],
          a = arguments[2];try {
        var n = { codeBody: JSON.stringify({ openid: wx.getStorageSync("uid"), appKey: _config2.default.appKey, appid: _config2.default.appId, param: e }), pageType: "red_packet" };gameHttp(_config2.default.api + "gamepay/createWXACode", n, "POST").then(function (e) {
          console.log(e);var n = e.data;wx.previewImage({ current: n, urls: [n], success: function success(e) {
              console.log(e), t({ code: 0, data: "", msg: "获取二维码成功" });
            }, fail: function fail(e) {
              a(e);
            } });
        }, function (e) {
          a(e);
        });
      } catch (e) {
        a(e);
      }
    } }, { key: "createPFCode", value: function value(e, t) {
      try {
        var a = _config2.default.appId + "-gametoplatform",
            n = wx.getSystemInfoSync(),
            o = n.SDKVersion,
            c = { codeBody: JSON.stringify({ openid: wx.getStorageSync("uid"), appKey: _config2.default.appKey, appid: _config2.default.appId, channelCode: a }), pageType: "more_games" };if (console.log(c, "二维码"), o < "2.2.0") gameHttp(_config2.default.api + "gamepay/createWXACode", c, "POST").then(function (a) {
          console.log(a);var n = a.data;wx.previewImage({ current: n, urls: [n], success: function success(t) {
              console.log(t), e({ code: 0, data: "", msg: "获取二维码成功" });
            }, fail: function fail(e) {
              t(e);
            } });
        }, function (e) {
          t(e);
        });else {
          var i = "appid=" + _config2.default.appId,
              r = "openid=" + wx.getStorageSync("uid"),
              g = { channelCode: a },
              s = JSON.stringify(g),
              f = "pages/index/index?" + i + "&" + r + "&extraParam=" + s;console.log(f), wx.navigateToMiniProgram({ appId: "wxce8556babd23a6b3", path: f, extraData: "", success: function success(e) {
              console.log(e, "成功回调");
            }, fail: function fail(e) {
              console.log(e, "失败回调");
            } });
        }
      } catch (e) {
        t(e);
      }
    } }, { key: "mysteryCode", value: function value(e, t, a) {
      try {
        var n = e;if (wx.getSystemInfoSync().SDKVersion < "2.2.0") {
          var o = { codeBody: JSON.stringify({ openid: wx.getStorageSync("uid"), appKey: _config2.default.appKey, appid: _config2.default.appId, gameName: e, channelCode: "coinpackage" }), pageType: "mystical_reward" };gameHttp(_config2.default.api + "gamepay/createWXACode", o, "POST").then(function (e) {
            console.log(e);var n = e.data;wx.previewImage({ current: n, urls: [n], success: function success(e) {
                console.log(e), t({ code: 0, data: "", msg: "获取二维码成功" });
              }, fail: function fail(e) {
                a(e);
              } });
          }, function (e) {
            a(e);
          });
        } else {
          var c = "openid=" + wx.getStorageSync("uid"),
              i = "appid=" + _config2.default.appId,
              r = { gameName: n, channelCode: "coinpackage", pageType: "mystical_reward" };r = JSON.stringify(r);var g = "pages/index/index?" + c + "&" + i + "&extraParam=" + r;console.log(g), wx.navigateToMiniProgram({ appId: "wxce8556babd23a6b3", path: g, extraData: "", success: function success(e) {
              console.log(e, "成功回调");
            }, fail: function fail(e) {
              console.log(e, "失败回调");
            } });
        }
      } catch (e) {
        a(e);
      }
    } }, { key: "taskGoldMap", value: function value(e, t, a, n) {
      try {
        var o = wx.getStorageSync("gameUserInfo"),
            c = {};if ("string" == typeof o && o.length > 5) {
          var i;o = JSON.parse(o);var r = o.nickName,
              g = o.avatarUrl;c.codeBody = JSON.stringify((i = { openid: wx.getStorageSync("uid"), appKey: _config2.default.appKey, appid: _config2.default.appId, channelCode: "coincheck", gold: t, gameName: e, gameCoin: t }, _defineProperty(i, "gameCoin", t), _defineProperty(i, "nickName", r), _defineProperty(i, "avatarUrl", g), i)), c.pageType = "receive_gift";
        } else {
          var s;c.codeBody = JSON.stringify((s = { openid: wx.getStorageSync("uid"), appKey: _config2.default.appKey, appid: _config2.default.appId, channelCode: "coincheck", gold: t, gameName: e, gameCoin: t }, _defineProperty(s, "gameCoin", t), _defineProperty(s, "nickName", ""), _defineProperty(s, "avatarUrl", ""), s)), c.pageType = "receive_gift";
        }gameHttp(_config2.default.api + "gamepay/createWXACode", c, "POST").then(function (e) {
          console.log(e);var t = e.data;wx.previewImage({ current: t, urls: [t], success: function success(e) {
              console.log(e), a({ code: 0, data: "", msg: "获取二维码成功" });
            }, fail: function fail(e) {
              n(e);
            } });
        }, function (e) {
          n(e);
        });
      } catch (e) {
        n(e);
      }
    } }, { key: "goldMap", value: function value(e, t, a, n) {
      try {
        var o = wx.getStorageSync("gameUserInfo"),
            c = {};if ("string" == typeof o && o.length > 5) {
          var i;o = JSON.parse(o);var r = o.nickName,
              g = o.avatarUrl;c.codeBody = JSON.stringify((i = { openid: wx.getStorageSync("uid"), appKey: _config2.default.appKey, appid: _config2.default.appId, channelCode: "morecoin", gold: t, gameName: e, gameCoin: t }, _defineProperty(i, "gameCoin", t), _defineProperty(i, "nickName", r), _defineProperty(i, "avatarUrl", g), i)), c.pageType = "gold_merge";
        } else {
          var s;c.codeBody = JSON.stringify((s = { openid: wx.getStorageSync("uid"), appKey: _config2.default.appKey, appid: _config2.default.appId, channelCode: "morecoin", gold: t, gameName: e, gameCoin: t }, _defineProperty(s, "gameCoin", t), _defineProperty(s, "nickName", ""), _defineProperty(s, "avatarUrl", ""), s)), c.pageType = "gold_merge";
        }gameHttp(_config2.default.api + "gamepay/createWXACode", c, "POST").then(function (e) {
          console.log(e);var t = e.data;wx.previewImage({ current: t, urls: [t], success: function success(e) {
              console.log(e), a({ code: 0, data: "", msg: "获取二维码成功" });
            }, fail: function fail(e) {
              n(e);
            } });
        }, function (e) {
          n(e);
        });
      } catch (e) {
        n(e);
      }
    } }, { key: "stringify", value: function value(e, t) {
      var a = 0;for (var n in t) {
        0 == a ? (e = e + "?" + n + "=" + t[n], a++) : e = e + "&" + n + "=" + t[n];
      }return e;
    } }, { key: "goldCount", value: function value(e, t) {
      var a = getObject("changeGold");a.ext.goldValue = e, a.ext.goldAccount = t, a.ext = _filterObj(a.ext), request(a);
    } }]), e;
}();exports.default = dataStatistics;

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
        //# sourceMappingURL=dataStatistics.js.map
        