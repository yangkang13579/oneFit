'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _appsocket = require('./appsocket.js');

var _appsocket2 = _interopRequireDefault(_appsocket);

var _md = require('./../npm/md5/md5.js');

var _md2 = _interopRequireDefault(_md);

require('./../npm/wepy-async-function/index.js');

var _co = require('./../npm/co/index.js');

var _co2 = _interopRequireDefault(_co);

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* APP 启动流程，一个应用只有一个app实例，被每个页面调用 */
/** 管理所有的数据Cache  */
var App = {
  config: {
    versionInfo: {
      device: 'phone',
      platform: 'wx_xcx',
      version: '_VERSION_' // 版本号，version.js 会在编译之后替换
    }
  },
  launchOption: {}, // 启动时候的参数，对于分享
  passportData: null, // 用户信息
  geoData: null, // GEO信息
  appOptions: null,
  state: 'init',
  socket: null, // 连接的appsocket
  messageCallback: null, // 连接的消息回调
  init: function init(globalOptions, wxOptions) {
    if (this.state !== 'init') {
      throw new Error('app.init can be invoked only once');
    }
    this.launchOption = wxOptions;
    this.config = _extends({}, this.config, globalOptions);
    console.log('App Inited:', this.config, this.launchOption);
    this.state = 'inited';
  },
  preload: function preload(type, data) {
    try {
      if (type === 'url') {
        var url = data;
        wx.request({
          url: url,
          success: function success(res) {},
          fail: function fail(error) {
            console.log('preload failed:', url, error);
          }
        });
      } else if (type === 'cache') {
        var cacheKey = (0, _md2.default)(data.key);
        this.dataCache[cacheKey] = data.value;
      } else if (type === 'storage') {
        var _cacheKey = (0, _md2.default)(data.key);
        wx.setStorageSync('cache_' + _cacheKey, data.value);
      }
    } catch (e) {
      console.log('preload error:', type, data, e);
    }
  },

  // 统一的数据访问接口
  fetchData: function fetchData(url, params, callback) {
    var fetchOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    var defaultOptions = {
      showLoading: false,
      method: 'GET',
      showLoadingTitle: '正在加载数据...',
      useCache: false, // 使用开启缓存，如果是则会把数据缓存到storage
      expireTime: 60 // 默认缓存时间60秒，如果设置为0，立即失效
    };
    var options = _extends({}, defaultOptions, fetchOptions);
    var cacheKey = null;
    var cache = null;
    if (options.useCache) {
      cacheKey = options.cacheKey || (0, _md2.default)(this.config.versionInfo.version + '_' + url); // 跟一个版本号
      cache = wx.getStorageSync('cache_' + cacheKey);
      try {
        if (cache === '' || cache.length === 0) {
          cache = null;
        }
        if (cache != null) {
          cache = JSON.parse(cache);
          var now = new Date().getTime();
          if (isNaN(cache.expired) || now > cache.expired || options.expireTime === 0) {
            console.log('cache expired');
            wx.removeStorageSync(cacheKey);
            cache = null;
          } else {
            cache = cache.data;
          }
        }
      } catch (e) {
        console.log('invalid cache:' + cacheKey + ',' + e.message);
      }
      if (cache != null) {
        // 已经命中,无需显示进度
        options.showLoading = false;
      }
    }
    if (options.showLoading) {
      // wx.showLoading({
      //   title: options.showLoadingTitle
      // });
    }
    if (cache != null && options.useCache) {
      callback(cache);
      return;
    }
    wx.request({
      url: url,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: options.method,
      data: params,
      success: function success(res) {
        if (options.useCache && options.expireTime > 0) {
          var _now = new Date().getTime();
          var cacheString = JSON.stringify({
            expired: _now + options.expireTime * 1000,
            data: res.data
          });
          wx.setStorageSync('cache_' + cacheKey, cacheString);
        }
        callback(res.data);
        if (options.showLoading) {
          wx.hideLoading();
        }
      },
      fail: function fail(error) {
        console.log(111111111111);
        if (options.showLoading) {
          wx.hideLoading();
        }
        console.log('fetchData error:', error);
        if (cache !== null && cacheKey != null) {
          // 无须更新缓存
        } else {
          var errObj = {
            code: 500,
            messages: {
              error: {
                code: 'NETWORK_ERROR',
                message: error.message || error.errMsg
              }
            }
          };
          callback(errObj);
        }
      }
    });
  },
  fetchDataPromise: function fetchDataPromise(url, params, options) {
    // console.log("fectchData from " + url + ",params=", params);
    var self = this;
    return new Promise(function (resolve, reject) {
      self.fetchData(url, params, function (json) {
        if (json.code === 200) {
          resolve(json.messages.data);
        } else {
          var error = json.messages.error;
          reject(self.throwError(error));
        }
      }, options);
    });
  },

  // 检查是否准备，由页面自己调用
  checkReady: function checkReady(checkOption) {
    var options = _extends({
      user: false, // 检查用户，如果没有登录，触发异常
      userInfo: false, // 仅仅是加载用户，而不触发登录异常
      geo: false, // 获得GEO数据
      options: false, // 获得个性选项
      config: false, // 获得 全局配置
      refer: false // 获得分享信息
    }, checkOption);
    console.log('checkOptions:', options);
    return (0, _co2.default)(this._checkGenerator(options));
  },
  _checkGenerator: /*#__PURE__*/regeneratorRuntime.mark(function _checkGenerator(options) {
    var data, error;
    return regeneratorRuntime.wrap(function _checkGenerator$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = {};
            // 全局参数,只会初始化一次

            _context.next = 3;
            return this.initGlobalConfig();

          case 3:
            _context.next = 5;
            return this._getWxCode(true);

          case 5:
            if (!(this.passportData === null)) {
              _context.next = 9;
              break;
            }

            _context.next = 8;
            return this.initPassport();

          case 8:
            this.passportData = _context.sent;

          case 9:
            if (!options.user) {
              _context.next = 16;
              break;
            }

            error = {
              code: 'user_login',
              message: '需要登录'
            };

            if (!(this.passportData === null)) {
              _context.next = 13;
              break;
            }

            throw this.throwError(error);

          case 13:
            _context.next = 15;
            return this.initAppSocket(this.passportData);

          case 15:
            data.passportData = this.passportData;

          case 16:
            if (options.userInfo && this.passportData != null) {
              data.passportData = this.passportData;
            }
            if (options.options) {
              if (this.appOptions === null) {
                this.appOptions = this.initAppOptions();
              }
              data.appOptions = this.appOptions;
            }
            if (options.config) {
              data.config = this.config;
            }

            if (!(options.refer && this.launchOption != null)) {
              _context.next = 24;
              break;
            }

            _context.next = 22;
            return this._getRefererInfo(this.launchOption);

          case 22:
            data.refer = _context.sent;

            this.launchOption = null;

          case 24:
            return _context.abrupt('return', data);

          case 25:
          case 'end':
            return _context.stop();
        }
      }
    }, _checkGenerator, this);
  }),
  initGlobalConfig: function initGlobalConfig() {
    var _this = this;

    var configUrl = this.config.configUrl;

    var self = this;
    if (configUrl != null) {
      console.log('initGlobalConfig...');
      var timestamp = new Date().getTime();
      console.log('Read configuration from:' + configUrl);
      return this.fetchDataPromise(configUrl, {
        time: timestamp
      }).then(function (data) {
        if (data.global) {
          // 合并global
          self.config = _extends({}, self.config, data.global);
          console.log('update global:' + JSON.stringify(_this.global));
          // 避免多次初始化
          _this.config.configUrl = null;
        }
      }).catch(function (e) {
        throw e;
      });
    }
    return Promise.resolve();
  },
  initAppOptions: function initAppOptions() {
    try {
      var optionStr = wx.getStorageSync('settings_options');
      if (optionStr != null && optionStr.indexOf('{') === 0) {
        var options = JSON.parse(optionStr);
        console.log('Load AppOptions:', options);
        return options;
      }
    } catch (e) {
      console.log('loadOptions failed', e);
    }
    return {};
  },
  updateOption: function updateOption(key, value) {
    try {
      this.appOptions[key] = value;
      wx.setStorage({
        key: 'settings_options',
        data: JSON.stringify(this.appOptions)
      });
    } catch (e) {
      console.log('updateOptions failed', e);
    }
  },

  // 初始化用户系统
  initPassport: function initPassport() {
    var self = this;
    function checkSSOPromise(resolve, reject) {
      console.log('initPassport...');
      wx.checkSession({
        success: function success() {
          var passport = wx.getStorageSync('passport');
          if (passport) {
            var checkSSOUrl = self.config.passportUrl + 'checkSSO.do';
            var checkSSOParams = {
              passport: passport
            };
            self.fetchDataPromise(checkSSOUrl, checkSSOParams).then(function (data) {
              if (data.user) {
                if (data.user.id.indexOf('_') !== -1) {
                  data.user.id = data.user.id.split('_')[1];
                }
                resolve(data);
              } else {
                resolve(null);
              }
            });
          } else {
            resolve(null);
          }
        },
        fail: function fail(e) {
          console.log('checkSession:', e);
          resolve(null);
        }
      });
    }
    return new Promise(function (resolve, reject) {
      checkSSOPromise(resolve, reject);
    });
  },
  initAppSocket: function initAppSocket(passportData) {
    if (this.config.appSocketUrl && passportData != null) {
      var socketUrl = this.config.appSocketUrl;
      socketUrl += '?userId=' + passportData.session.id;
      console.log('init appsocket:', socketUrl);
      self.socket = new _appsocket2.default(socketUrl);
      self.socket.onMessage = function (data) {
        try {
          var json = JSON.parse(data);
          self.onMessage(json);
        } catch (e) {
          console.log('onMessage error', e);
        }
      };
      self.socket.connect();
    }
    return Promise.resolve();
  },
  throwError: function throwError(error) {
    _wepy2.default.showModal({
      title: '提示',
      content: error.message,
      showCancel: false,
      success: function success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
    var e = new Error(error.message);
    e.name = error.code;
    return e;
  },
  _wxLoginGenerator: /*#__PURE__*/regeneratorRuntime.mark(function _wxLoginGenerator(iv, encryptedData) {
    var code, passportData;
    return regeneratorRuntime.wrap(function _wxLoginGenerator$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return this._getWxCode(false);

          case 2:
            code = _context2.sent;
            _context2.next = 5;
            return this._loginPassport(code, encryptedData, iv);

          case 5:
            passportData = _context2.sent;

            // 写入到storage
            wx.setStorageSync('passport', passportData.session.id);
            this.passportData = passportData;
            return _context2.abrupt('return', passportData);

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, _wxLoginGenerator, this);
  }),
  loginWX: function loginWX(iv, encryptedData) {
    return (0, _co2.default)(this._wxLoginGenerator(iv, encryptedData));
  },

  // https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html#wxchecksessionobject
  //  每次都获得一个新的Code
  _getWxCode: function _getWxCode() {
    var useCache = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    var self = this;
    return new Promise(function (resolve, reject) {
      var code = wx.getStorageSync('wx_code');

      function wxCode() {
        wx.login({
          success: function success(res) {
            console.log("code", code);
            if (res.code) {
              code = res.code;
              var json = {};
              json.clientType = self.config.appType;
              json.clientId = self.config.appId;
              json.code = code;
              json.action = 'code4key';
              // 根据当前code生成一个sessionKey
              self.fetchDataPromise(self.config.passportUrl + 'loginXCX.do', json).then(function (data) {
                code = data.key;
                wx.setStorageSync('wx_code', code);
                resolve(code);
              }).catch(function (error) {
                reject(error);
              });
            } else {
              console.log(22222222222);
              var error = {
                code: 'wx_login_error',
                message: res.errMsg
              };
              reject(self.throwError(error));
            }
          }
        });
      }
      if (code && useCache) {
        wx.checkSession({
          success: function success() {
            resolve(code);
          },
          fail: function fail() {
            wxCode();
          }
        });
      } else {
        wxCode();
      }
    });
  },
  _getUserInfo: function _getUserInfo() {
    var self = this;
    return new Promise(function (resolve, reject) {
      function userInfo() {
        wx.getUserInfo({
          // withCredentials: true,
          lang: 'zh_CN',
          success: function success(res) {
            console.log('getUserInfo=', res);
            resolve(res);
          },
          fail: function fail(res) {
            var error = {
              code: 'userinfo_error',
              message: res.errMsg
            };
            reject(self.throwError(error));
          }
        });
      }
      // 检查用户设置
      wx.getSetting({
        success: function success(res) {
          if (!res.authSetting['scope.userInfo']) {
            wx.authorize({
              scope: 'scope.userInfo',
              success: function success() {
                userInfo();
              },
              fail: function fail() {
                var error = {
                  code: 'userinfo_reject',
                  message: '用户取消授权'
                };
                reject(self.throwError(error));
              }
            });
          } else {
            userInfo();
          }
        },
        fail: function fail() {
          var error = {
            code: 'userinfo_fail',
            message: '读取用户设置失败'
          };
          reject(self.throwError(error));
        }
      });
    });
  },
  _loginPassport: function _loginPassport(code, encryptedData, iv) {
    var json = {};
    json.clientType = this.config.appType;
    json.clientId = this.config.appId;
    json.key = code;
    json.action = 'loginData';
    json.encryptedData = encryptedData;
    json.encryptedIV = iv;
    json.remember = 365; // 365天
    console.log('encryptedData=' + encryptedData);
    console.log('encryptedIV=' + iv);
    console.log('code=' + code);
    return this.fetchDataPromise(this.config.passportUrl + 'loginXCX.do', json);
  },

  //  只有分享到群才有 shareTicket， 分享到个人是没有的
  _getRefererInfo: function _getRefererInfo(options) {
    console.log('_getRefererInfo:', options);
    var refererId = options.query.refererId;
    if (refererId) {
      return new Promise(function (resolve, reject) {
        wx.login({
          complete: function complete(res) {
            // console.log("wxLogin:", res);
            if (res.code) {
              resolve({
                refererId: refererId,
                refererCode: res.code,
                secene: options.scene,
                path: options.path
              });
            } else {
              resolve(null);
            }
          }
        });
      });
    }
    return Promise.resolve(null);
  },
  onMessage: function onMessage(data) {
    console.log('receive app message', data);
    if (this.messageCallback != null) {
      this.messageCallback(data);
    }
  },
  listenMessage: function listenMessage(callback) {
    this.messageCallback = callback;
  },
  bindMobilePromise: function bindMobilePromise(iv, encryptedData, passportSessionId) {
    // 手机绑定
    var self = this;
    var code = null;
    // 登录交换passportId
    function loginMobile(resolve, reject) {
      var json = {};
      json.clientType = self.config.appType;
      json.clientId = self.config.appId;
      json.key = code;
      json.encryptedData = encryptedData;
      json.encryptedIV = iv;
      json.loginType = 'mobile';
      json.link = true;
      json.linkForce = true;
      json.remember = 365;
      // 绑定到当前用户
      json.passport = passportSessionId;
      /**  */
      self.fetchData(self.config.passportUrl + 'loginMobile.do', json, function (json) {
        if (json.code === 200) {
          // console.log('loginPassport=' + JSON.stringify(json))
          // wx.setStorageSync("passport", json.messages.data.session.id);
          resolve(json.messages.data);
        } else {
          reject(json.messages.error);
        }
      });
    }
    return new Promise(function (resolve, reject) {
      new Promise(function (resolve, reject) {
        self._getWxCode(resolve, reject);
      }).then(function (data) {
        code = data;
        return new Promise(function (resolve, reject) {
          loginMobile(resolve, reject);
        });
      }).then(function (passportData) {
        resolve(passportData);
      }).catch(function (reason) {
        reject(reason);
      });
    });
  },
  uploadFile: function uploadFile(uploadItem, listener) {
    return (0, _co2.default)(this._wxUploadFile(uploadItem, listener));
  },

  // 上传图片
  _wxUploadFile: /*#__PURE__*/regeneratorRuntime.mark(function _wxUploadFile(uploadItem, listener) {
    var self, data, query, imageUrl;
    return regeneratorRuntime.wrap(function _wxUploadFile$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            self = this;

            console.log('startUpload:', uploadItem.index);
            _context3.next = 4;
            return self._newUpload();

          case 4:
            data = _context3.sent;

            uploadItem.uploadToken = data.token;
            uploadItem.uploadUrl = data.uploadUrl;
            _context3.next = 9;
            return self._uploadFile(uploadItem, listener);

          case 9:
            _context3.next = 11;
            return self._uploadQueryCheck(uploadItem, listener);

          case 11:
            _context3.next = 13;
            return self._uploadQueryResult(uploadItem);

          case 13:
            query = _context3.sent;

            if (query.files && query.files.length > 0) {
              imageUrl = query.files[0].images[0].url;

              console.log('上传结果:' + imageUrl);
              uploadItem.imageUrl = imageUrl;
            }
            return _context3.abrupt('return', uploadItem);

          case 16:
          case 'end':
            return _context3.stop();
        }
      }
    }, _wxUploadFile, this);
  }),
  _newUpload: function _newUpload() {
    // 获得一个上传地址
    var self = this;
    return new Promise(function (resolve, reject) {
      var uploadUrl = self.config.uploadUrl + 'upload.do';
      wx.request({
        url: uploadUrl,
        method: 'get',
        data: {
          action: 'upload',
          type: 'image',
          appId: self.config.uploadAppId
        },
        success: function success(res) {
          var json = res.data;
          if (json.code === 200) {
            resolve(json.messages.data);
          } else {
            var error = json.messages.error;
            var e = new Error(error.message);
            e.name = error.code;
            reject(e);
          }
        },
        fail: function fail(res) {
          var error = {
            code: 'upload_error',
            message: res.errMsg
          };
          var e = new Error(error.message);
          e.name = error.code;
          reject(e);
        }
      });
    });
  },

  // 上传文件的具体
  _uploadFile: function _uploadFile(uploadItem, listener) {
    return new Promise(function (resolve, reject) {
      var uploadTask = wx.uploadFile({
        url: uploadItem.uploadUrl,
        filePath: uploadItem.file,
        name: 'file',
        success: function success(res) {
          if (res.statusCode !== 200) {
            var error = {
              code: 'upload_error',
              message: 'HTTP错误:' + res.statusCode
            };
            var e = new Error(error.message);
            e.name = error.code;
            reject(e);
          } else {
            resolve(uploadItem);
          }
        },
        fail: function fail(res) {
          var error = {
            code: 'upload_error',
            message: res.errMsg
          };
          var e = new Error(error.message);
          e.name = error.code;
          reject(e);
        }
      });
      // 监控上传进度
      uploadTask.onProgressUpdate(function (res) {
        if (listener != null) {
          uploadItem.progress = res.progress;
          if (uploadItem.progress > 99) {
            uploadItem.progress = 99;
          }
          listener(uploadItem);
        }
        console.log('上传进度', res.progress);
        /*
        //console.log('已经上传的数据长度', res.totalBytesSent);
        console.log(
            '预期需要上传的数据总长度',
            res.totalBytesExpectedToSend
        );
        */
      });
    });
  },

  // 确认服务器已经收到所有数据
  _uploadQueryCheck: function _uploadQueryCheck(uploadItem, listener) {
    var uploadUrl = uploadItem.uploadUrl;
    function checkFinished(resolve, reject) {
      wx.request({
        url: uploadUrl,
        method: 'get',
        success: function success(res) {
          var data = res.data;
          console.log("check upload finished:", data);
          if (data.status === 'finish') {
            if (listener != null) {
              uploadItem.progress = 100;
              listener(uploadItem);
            }
            resolve(data);
          } else {
            setTimeout(function () {
              checkFinished(resolve, reject);
            }, 1000);
          }
        },
        fail: function fail(res) {
          var error = {
            code: 'upload_error',
            message: res.errMsg
          };
          console.log("query server error,will retry:", error);
          setTimeout(function () {
            checkFinished(resolve, reject);
          }, 1000);
        }
      });
    };
    return new Promise(function (resolve, reject) {
      checkFinished(resolve, reject);
    });
  },
  _uploadQueryResult: function _uploadQueryResult(uploadItem) {
    var self = this;
    return new Promise(function (resolve, reject) {
      var uploadUrl = self.config.uploadUrl + 'upload.do';
      wx.request({
        url: uploadUrl,
        method: 'get',
        data: {
          action: 'query',
          token: uploadItem.uploadToken
        },
        success: function success(res) {
          var json = res.data;
          if (json.code === 200) {
            resolve(json.messages.data);
          } else {
            var error = json.messages.error;
            var e = new Error(error.message);
            e.name = error.code;
            reject(e);
          }
        },
        fail: function fail(res) {
          var error = {
            code: 'upload_error',
            message: res.errMsg
          };
          var e = new Error(error.message);
          e.name = error.code;
          reject(e);
        }
      });
    });
  }
};

exports.default = App;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJBcHAiLCJjb25maWciLCJ2ZXJzaW9uSW5mbyIsImRldmljZSIsInBsYXRmb3JtIiwidmVyc2lvbiIsImxhdW5jaE9wdGlvbiIsInBhc3Nwb3J0RGF0YSIsImdlb0RhdGEiLCJhcHBPcHRpb25zIiwic3RhdGUiLCJzb2NrZXQiLCJtZXNzYWdlQ2FsbGJhY2siLCJpbml0IiwiZ2xvYmFsT3B0aW9ucyIsInd4T3B0aW9ucyIsIkVycm9yIiwiY29uc29sZSIsImxvZyIsInByZWxvYWQiLCJ0eXBlIiwiZGF0YSIsInVybCIsInd4IiwicmVxdWVzdCIsInN1Y2Nlc3MiLCJyZXMiLCJmYWlsIiwiZXJyb3IiLCJjYWNoZUtleSIsImtleSIsImRhdGFDYWNoZSIsInZhbHVlIiwic2V0U3RvcmFnZVN5bmMiLCJlIiwiZmV0Y2hEYXRhIiwicGFyYW1zIiwiY2FsbGJhY2siLCJmZXRjaE9wdGlvbnMiLCJkZWZhdWx0T3B0aW9ucyIsInNob3dMb2FkaW5nIiwibWV0aG9kIiwic2hvd0xvYWRpbmdUaXRsZSIsInVzZUNhY2hlIiwiZXhwaXJlVGltZSIsIm9wdGlvbnMiLCJjYWNoZSIsImdldFN0b3JhZ2VTeW5jIiwibGVuZ3RoIiwiSlNPTiIsInBhcnNlIiwibm93IiwiRGF0ZSIsImdldFRpbWUiLCJpc05hTiIsImV4cGlyZWQiLCJyZW1vdmVTdG9yYWdlU3luYyIsIm1lc3NhZ2UiLCJoZWFkZXIiLCJjYWNoZVN0cmluZyIsInN0cmluZ2lmeSIsImhpZGVMb2FkaW5nIiwiZXJyT2JqIiwiY29kZSIsIm1lc3NhZ2VzIiwiZXJyTXNnIiwiZmV0Y2hEYXRhUHJvbWlzZSIsInNlbGYiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImpzb24iLCJ0aHJvd0Vycm9yIiwiY2hlY2tSZWFkeSIsImNoZWNrT3B0aW9uIiwidXNlciIsInVzZXJJbmZvIiwiZ2VvIiwicmVmZXIiLCJfY2hlY2tHZW5lcmF0b3IiLCJpbml0R2xvYmFsQ29uZmlnIiwiX2dldFd4Q29kZSIsImluaXRQYXNzcG9ydCIsImluaXRBcHBTb2NrZXQiLCJpbml0QXBwT3B0aW9ucyIsIl9nZXRSZWZlcmVySW5mbyIsImNvbmZpZ1VybCIsInRpbWVzdGFtcCIsInRpbWUiLCJ0aGVuIiwiZ2xvYmFsIiwiY2F0Y2giLCJvcHRpb25TdHIiLCJpbmRleE9mIiwidXBkYXRlT3B0aW9uIiwic2V0U3RvcmFnZSIsImNoZWNrU1NPUHJvbWlzZSIsImNoZWNrU2Vzc2lvbiIsInBhc3Nwb3J0IiwiY2hlY2tTU09VcmwiLCJwYXNzcG9ydFVybCIsImNoZWNrU1NPUGFyYW1zIiwiaWQiLCJzcGxpdCIsImFwcFNvY2tldFVybCIsInNvY2tldFVybCIsInNlc3Npb24iLCJBcHBTb2NrZXQiLCJvbk1lc3NhZ2UiLCJjb25uZWN0Iiwid2VweSIsInNob3dNb2RhbCIsInRpdGxlIiwiY29udGVudCIsInNob3dDYW5jZWwiLCJjb25maXJtIiwiY2FuY2VsIiwibmFtZSIsIl93eExvZ2luR2VuZXJhdG9yIiwiaXYiLCJlbmNyeXB0ZWREYXRhIiwiX2xvZ2luUGFzc3BvcnQiLCJsb2dpbldYIiwid3hDb2RlIiwibG9naW4iLCJjbGllbnRUeXBlIiwiYXBwVHlwZSIsImNsaWVudElkIiwiYXBwSWQiLCJhY3Rpb24iLCJfZ2V0VXNlckluZm8iLCJnZXRVc2VySW5mbyIsImxhbmciLCJnZXRTZXR0aW5nIiwiYXV0aFNldHRpbmciLCJhdXRob3JpemUiLCJzY29wZSIsImVuY3J5cHRlZElWIiwicmVtZW1iZXIiLCJyZWZlcmVySWQiLCJxdWVyeSIsImNvbXBsZXRlIiwicmVmZXJlckNvZGUiLCJzZWNlbmUiLCJzY2VuZSIsInBhdGgiLCJsaXN0ZW5NZXNzYWdlIiwiYmluZE1vYmlsZVByb21pc2UiLCJwYXNzcG9ydFNlc3Npb25JZCIsImxvZ2luTW9iaWxlIiwibG9naW5UeXBlIiwibGluayIsImxpbmtGb3JjZSIsInJlYXNvbiIsInVwbG9hZEZpbGUiLCJ1cGxvYWRJdGVtIiwibGlzdGVuZXIiLCJfd3hVcGxvYWRGaWxlIiwiaW5kZXgiLCJfbmV3VXBsb2FkIiwidXBsb2FkVG9rZW4iLCJ0b2tlbiIsInVwbG9hZFVybCIsIl91cGxvYWRGaWxlIiwiX3VwbG9hZFF1ZXJ5Q2hlY2siLCJfdXBsb2FkUXVlcnlSZXN1bHQiLCJmaWxlcyIsImltYWdlVXJsIiwiaW1hZ2VzIiwidXBsb2FkQXBwSWQiLCJ1cGxvYWRUYXNrIiwiZmlsZVBhdGgiLCJmaWxlIiwic3RhdHVzQ29kZSIsIm9uUHJvZ3Jlc3NVcGRhdGUiLCJwcm9ncmVzcyIsImNoZWNrRmluaXNoZWQiLCJzdGF0dXMiLCJzZXRUaW1lb3V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTtBQUNBO0FBQ0EsSUFBSUEsTUFBTTtBQUNSQyxVQUFRO0FBQ05DLGlCQUFhO0FBQ1hDLGNBQVEsT0FERztBQUVYQyxnQkFBVSxRQUZDO0FBR1hDLGVBQVMsV0FIRSxDQUdVO0FBSFY7QUFEUCxHQURBO0FBUVJDLGdCQUFjLEVBUk4sRUFRVTtBQUNsQkMsZ0JBQWMsSUFUTixFQVNZO0FBQ3BCQyxXQUFTLElBVkQsRUFVTztBQUNmQyxjQUFZLElBWEo7QUFZUkMsU0FBTyxNQVpDO0FBYVJDLFVBQVEsSUFiQSxFQWFNO0FBQ2RDLG1CQUFpQixJQWRULEVBY2U7QUFDdkJDLE1BZlEsZ0JBZUhDLGFBZkcsRUFlWUMsU0FmWixFQWV1QjtBQUM3QixRQUFJLEtBQUtMLEtBQUwsS0FBZSxNQUFuQixFQUEyQjtBQUN6QixZQUFNLElBQUlNLEtBQUosQ0FBVSxtQ0FBVixDQUFOO0FBQ0Q7QUFDRCxTQUFLVixZQUFMLEdBQW9CUyxTQUFwQjtBQUNBLFNBQUtkLE1BQUwsZ0JBQW1CLEtBQUtBLE1BQXhCLEVBQ0thLGFBREw7QUFHQUcsWUFBUUMsR0FBUixDQUFZLGFBQVosRUFBMkIsS0FBS2pCLE1BQWhDLEVBQXdDLEtBQUtLLFlBQTdDO0FBQ0EsU0FBS0ksS0FBTCxHQUFhLFFBQWI7QUFDRCxHQXpCTztBQTBCUlMs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RixJQUFGLEdBQVN6RixNQUFNbUMsSUFBZjtBQUNBTyxpQkFBT3BDLENBQVA7QUFDRDtBQTFCUSxPQUFYO0FBNEJELEtBOUJNLENBQVA7QUErQkQ7QUE3dUJPLENBQVY7O2tCQWd2QmVsQyxHIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBcHBTb2NrZXQgZnJvbSAnLi9hcHBzb2NrZXQnO1xyXG5pbXBvcnQgbWQ1IGZyb20gJ21kNSc7XHJcbmltcG9ydCAnd2VweS1hc3luYy1mdW5jdGlvbic7XHJcbmltcG9ydCBjbyBmcm9tICdjbyc7XHJcbmltcG9ydCB3ZXB5IGZyb20gJ3dlcHknO1xyXG5cclxuLyogQVBQIOWQr+WKqOa1geeoi++8jOS4gOS4quW6lOeUqOWPquacieS4gOS4qmFwcOWunuS+i++8jOiiq+avj+S4qumhtemdouiwg+eUqCAqL1xyXG4vKiog566h55CG5omA5pyJ55qE5pWw5o2uQ2FjaGUgICovXHJcbnZhciBBcHAgPSB7XHJcbiAgY29uZmlnOiB7XHJcbiAgICB2ZXJzaW9uSW5mbzoge1xyXG4gICAgICBkZXZpY2U6ICdwaG9uZScsXHJcbiAgICAgIHBsYXRmb3JtOiAnd3hfeGN4JyxcclxuICAgICAgdmVyc2lvbjogJ19WRVJTSU9OXycgLy8g54mI5pys5Y+377yMdmVyc2lvbi5qcyDkvJrlnKjnvJbor5HkuYvlkI7mm7/mjaJcclxuICAgIH1cclxuICB9LFxyXG4gIGxhdW5jaE9wdGlvbjoge30sIC8vIOWQr+WKqOaXtuWAmeeahOWPguaVsO+8jOWvueS6juWIhuS6q1xyXG4gIHBhc3Nwb3J0RGF0YTogbnVsbCwgLy8g55So5oi35L+h5oGvXHJcbiAgZ2VvRGF0YTogbnVsbCwgLy8gR0VP5L+h5oGvXHJcbiAgYXBwT3B0aW9uczogbnVsbCxcclxuICBzdGF0ZTogJ2luaXQnLFxyXG4gIHNvY2tldDogbnVsbCwgLy8g6L+e5o6l55qEYXBwc29ja2V0XHJcbiAgbWVzc2FnZUNhbGxiYWNrOiBudWxsLCAvLyDov57mjqXnmoTmtojmga/lm57osINcclxuICBpbml0KGdsb2JhbE9wdGlvbnMsIHd4T3B0aW9ucykge1xyXG4gICAgaWYgKHRoaXMuc3RhdGUgIT09ICdpbml0Jykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FwcC5pbml0IGNhbiBiZSBpbnZva2VkIG9ubHkgb25jZScpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5sYXVuY2hPcHRpb24gPSB3eE9wdGlvbnM7XHJcbiAgICB0aGlzLmNvbmZpZyA9IHsgLi4udGhpcy5jb25maWcsXHJcbiAgICAgIC4uLmdsb2JhbE9wdGlvbnNcclxuICAgIH07XHJcbiAgICBjb25zb2xlLmxvZygnQXBwIEluaXRlZDonLCB0aGlzLmNvbmZpZywgdGhpcy5sYXVuY2hPcHRpb24pO1xyXG4gICAgdGhpcy5zdGF0ZSA9ICdpbml0ZWQnO1xyXG4gIH0sXHJcbiAgcHJlbG9hZCh0eXBlLCBkYXRhKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAodHlwZSA9PT0gJ3VybCcpIHtcclxuICAgICAgICB2YXIgdXJsID0gZGF0YTtcclxuICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge30sXHJcbiAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3ByZWxvYWQgZmFpbGVkOicsIHVybCwgZXJyb3IpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdjYWNoZScpIHtcclxuICAgICAgICBsZXQgY2FjaGVLZXkgPSBtZDUoZGF0YS5rZXkpO1xyXG4gICAgICAgIHRoaXMuZGF0YUNhY2hlW2NhY2hlS2V5XSA9IGRhdGEudmFsdWU7XHJcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0b3JhZ2UnKSB7XHJcbiAgICAgICAgbGV0IGNhY2hlS2V5ID0gbWQ1KGRhdGEua2V5KTtcclxuICAgICAgICB3eC5zZXRTdG9yYWdlU3luYygnY2FjaGVfJyArIGNhY2hlS2V5LCBkYXRhLnZhbHVlKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZygncHJlbG9hZCBlcnJvcjonLCB0eXBlLCBkYXRhLCBlKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8vIOe7n+S4gOeahOaVsOaNruiuv+mXruaOpeWPo1xyXG4gIGZldGNoRGF0YSh1cmwsIHBhcmFtcywgY2FsbGJhY2ssIGZldGNoT3B0aW9ucyA9IHt9KSB7XHJcbiAgICB2YXIgZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgICAgIHNob3dMb2FkaW5nOiBmYWxzZSxcclxuICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgc2hvd0xvYWRpbmdUaXRsZTogJ+ato+WcqOWKoOi9veaVsOaNri4uLicsXHJcbiAgICAgIHVzZUNhY2hlOiBmYWxzZSwgLy8g5L2/55So5byA5ZCv57yT5a2Y77yM5aaC5p6c5piv5YiZ5Lya5oqK5pWw5o2u57yT5a2Y5Yiwc3RvcmFnZVxyXG4gICAgICBleHBpcmVUaW1lOiA2MCAvLyDpu5jorqTnvJPlrZjml7bpl7Q2MOenku+8jOWmguaenOiuvue9ruS4ujDvvIznq4vljbPlpLHmlYhcclxuICAgIH07XHJcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0T3B0aW9ucyxcclxuICAgICAgLi4uZmV0Y2hPcHRpb25zXHJcbiAgICB9O1xyXG4gICAgdmFyIGNhY2hlS2V5ID0gbnVsbDtcclxuICAgIHZhciBjYWNoZSA9IG51bGw7XHJcbiAgICBpZiAob3B0aW9ucy51c2VDYWNoZSkge1xyXG4gICAgICBjYWNoZUtleSA9XHJcbiAgICAgICAgb3B0aW9ucy5jYWNoZUtleSB8fFxyXG4gICAgICAgIG1kNSh0aGlzLmNvbmZpZy52ZXJzaW9uSW5mby52ZXJzaW9uICsgJ18nICsgdXJsKTsgLy8g6Lef5LiA5Liq54mI5pys5Y+3XHJcbiAgICAgIGNhY2hlID0gd3guZ2V0U3RvcmFnZVN5bmMoJ2NhY2hlXycgKyBjYWNoZUtleSk7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgaWYgKGNhY2hlID09PSAnJyB8fCBjYWNoZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgIGNhY2hlID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNhY2hlICE9IG51bGwpIHtcclxuICAgICAgICAgIGNhY2hlID0gSlNPTi5wYXJzZShjYWNoZSk7XHJcbiAgICAgICAgICBsZXQgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIGlzTmFOKGNhY2hlLmV4cGlyZWQpIHx8XHJcbiAgICAgICAgICAgIG5vdyA+IGNhY2hlLmV4cGlyZWQgfHxcclxuICAgICAgICAgICAgb3B0aW9ucy5leHBpcmVUaW1lID09PSAwXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2NhY2hlIGV4cGlyZWQnKTtcclxuICAgICAgICAgICAgd3gucmVtb3ZlU3RvcmFnZVN5bmMoY2FjaGVLZXkpO1xyXG4gICAgICAgICAgICBjYWNoZSA9IG51bGw7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYWNoZSA9IGNhY2hlLmRhdGE7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2ludmFsaWQgY2FjaGU6JyArIGNhY2hlS2V5ICsgJywnICsgZS5tZXNzYWdlKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoY2FjaGUgIT0gbnVsbCkge1xyXG4gICAgICAgIC8vIOW3sue7j+WRveS4rSzml6DpnIDmmL7npLrov5vluqZcclxuICAgICAgICBvcHRpb25zLnNob3dMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChvcHRpb25zLnNob3dMb2FkaW5nKSB7XHJcbiAgICAgIC8vIHd4LnNob3dMb2FkaW5nKHtcclxuICAgICAgLy8gICB0aXRsZTogb3B0aW9ucy5zaG93TG9hZGluZ1RpdGxlXHJcbiAgICAgIC8vIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKGNhY2hlICE9IG51bGwgJiYgb3B0aW9ucy51c2VDYWNoZSkge1xyXG4gICAgICBjYWxsYmFjayhjYWNoZSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICB1cmw6IHVybCxcclxuICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIC8vIOm7mOiupOWAvFxyXG4gICAgICB9LFxyXG4gICAgICBtZXRob2Q6IG9wdGlvbnMubWV0aG9kLFxyXG4gICAgICBkYXRhOiBwYXJhbXMsXHJcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICBpZiAob3B0aW9ucy51c2VDYWNoZSAmJiBvcHRpb25zLmV4cGlyZVRpbWUgPiAwKSB7XHJcbiAgICAgICAgICBsZXQgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICBjb25zdCBjYWNoZVN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgZXhwaXJlZDogbm93ICsgb3B0aW9ucy5leHBpcmVUaW1lICogMTAwMCxcclxuICAgICAgICAgICAgZGF0YTogcmVzLmRhdGFcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoJ2NhY2hlXycgKyBjYWNoZUtleSwgY2FjaGVTdHJpbmcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYWxsYmFjayhyZXMuZGF0YSk7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuc2hvd0xvYWRpbmcpIHtcclxuICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBmYWlsOiBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygxMTExMTExMTExMTEpXHJcbiAgICAgICAgaWYgKG9wdGlvbnMuc2hvd0xvYWRpbmcpIHtcclxuICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdmZXRjaERhdGEgZXJyb3I6JywgZXJyb3IpO1xyXG4gICAgICAgIGlmIChjYWNoZSAhPT0gbnVsbCAmJiBjYWNoZUtleSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAvLyDml6Dpobvmm7TmlrDnvJPlrZhcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgZXJyT2JqID0ge1xyXG4gICAgICAgICAgICBjb2RlOiA1MDAsXHJcbiAgICAgICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgICAgZXJyb3I6IHtcclxuICAgICAgICAgICAgICAgIGNvZGU6ICdORVRXT1JLX0VSUk9SJyxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgZXJyb3IuZXJyTXNnXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyT2JqKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgZmV0Y2hEYXRhUHJvbWlzZSh1cmwsIHBhcmFtcywgb3B0aW9ucykge1xyXG4gICAgLy8gY29uc29sZS5sb2coXCJmZWN0Y2hEYXRhIGZyb20gXCIgKyB1cmwgKyBcIixwYXJhbXM9XCIsIHBhcmFtcyk7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBzZWxmLmZldGNoRGF0YShcclxuICAgICAgICB1cmwsXHJcbiAgICAgICAgcGFyYW1zLFxyXG4gICAgICAgIGZ1bmN0aW9uIChqc29uKSB7XHJcbiAgICAgICAgICBpZiAoanNvbi5jb2RlID09PSAyMDApIHtcclxuICAgICAgICAgICAgcmVzb2x2ZShqc29uLm1lc3NhZ2VzLmRhdGEpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGVycm9yID0ganNvbi5tZXNzYWdlcy5lcnJvcjtcclxuICAgICAgICAgICAgcmVqZWN0KHNlbGYudGhyb3dFcnJvcihlcnJvcikpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb3B0aW9uc1xyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuICAvLyDmo4Dmn6XmmK/lkKblh4blpIfvvIznlLHpobXpnaLoh6rlt7HosIPnlKhcclxuICBjaGVja1JlYWR5KGNoZWNrT3B0aW9uKSB7XHJcbiAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAuLi57XHJcbiAgICAgICAgdXNlcjogZmFsc2UsIC8vIOajgOafpeeUqOaIt++8jOWmguaenOayoeacieeZu+W9le+8jOinpuWPkeW8guW4uFxyXG4gICAgICAgIHVzZXJJbmZvOiBmYWxzZSwgLy8g5LuF5LuF5piv5Yqg6L2955So5oi377yM6ICM5LiN6Kem5Y+R55m75b2V5byC5bi4XHJcbiAgICAgICAgZ2VvOiBmYWxzZSwgLy8g6I635b6XR0VP5pWw5o2uXHJcbiAgICAgICAgb3B0aW9uczogZmFsc2UsIC8vIOiOt+W+l+S4quaAp+mAiemhuVxyXG4gICAgICAgIGNvbmZpZzogZmFsc2UsIC8vIOiOt+W+lyDlhajlsYDphY3nva5cclxuICAgICAgICByZWZlcjogZmFsc2UgLy8g6I635b6X5YiG5Lqr5L+h5oGvXHJcbiAgICAgIH0sXHJcbiAgICAgIC4uLmNoZWNrT3B0aW9uXHJcbiAgICB9O1xyXG4gICAgY29uc29sZS5sb2coJ2NoZWNrT3B0aW9uczonLCBvcHRpb25zKTtcclxuICAgIHJldHVybiBjbyh0aGlzLl9jaGVja0dlbmVyYXRvcihvcHRpb25zKSk7XHJcbiAgfSxcclxuICAqIF9jaGVja0dlbmVyYXRvcihvcHRpb25zKSB7XHJcbiAgICBsZXQgZGF0YSA9IHt9O1xyXG4gICAgLy8g5YWo5bGA5Y+C5pWwLOWPquS8muWIneWni+WMluS4gOasoVxyXG4gICAgeWllbGQgdGhpcy5pbml0R2xvYmFsQ29uZmlnKCk7XHJcbiAgICAvLyDliJ3lp4vljJYg55So5oi3XHJcbiAgICAvLyDliLfkuIDkuIt3eENvZGVcclxuICAgIHlpZWxkIHRoaXMuX2dldFd4Q29kZSh0cnVlKTtcclxuICAgIGlmICh0aGlzLnBhc3Nwb3J0RGF0YSA9PT0gbnVsbCkge1xyXG4gICAgICB0aGlzLnBhc3Nwb3J0RGF0YSA9IHlpZWxkIHRoaXMuaW5pdFBhc3Nwb3J0KCk7XHJcbiAgICB9XHJcbiAgICBpZiAob3B0aW9ucy51c2VyKSB7XHJcbiAgICAgIGNvbnN0IGVycm9yID0ge1xyXG4gICAgICAgIGNvZGU6ICd1c2VyX2xvZ2luJyxcclxuICAgICAgICBtZXNzYWdlOiAn6ZyA6KaB55m75b2VJ1xyXG4gICAgICB9O1xyXG4gICAgICBpZiAodGhpcy5wYXNzcG9ydERhdGEgPT09IG51bGwpIHtcclxuICAgICAgICB0aHJvdyB0aGlzLnRocm93RXJyb3IoZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIOWmguaenOeZu+W9leaIkOWKn++8jOWIneWni+WMlkFwcFNvY2tldFxyXG4gICAgICB5aWVsZCB0aGlzLmluaXRBcHBTb2NrZXQodGhpcy5wYXNzcG9ydERhdGEpO1xyXG4gICAgICBkYXRhLnBhc3Nwb3J0RGF0YSA9IHRoaXMucGFzc3BvcnREYXRhO1xyXG4gICAgfVxyXG4gICAgaWYgKG9wdGlvbnMudXNlckluZm8gJiYgdGhpcy5wYXNzcG9ydERhdGEgIT0gbnVsbCkge1xyXG4gICAgICBkYXRhLnBhc3Nwb3J0RGF0YSA9IHRoaXMucGFzc3BvcnREYXRhO1xyXG4gICAgfVxyXG4gICAgaWYgKG9wdGlvbnMub3B0aW9ucykge1xyXG4gICAgICBpZiAodGhpcy5hcHBPcHRpb25zID09PSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5hcHBPcHRpb25zID0gdGhpcy5pbml0QXBwT3B0aW9ucygpO1xyXG4gICAgICB9XHJcbiAgICAgIGRhdGEuYXBwT3B0aW9ucyA9IHRoaXMuYXBwT3B0aW9ucztcclxuICAgIH1cclxuICAgIGlmIChvcHRpb25zLmNvbmZpZykge1xyXG4gICAgICBkYXRhLmNvbmZpZyA9IHRoaXMuY29uZmlnO1xyXG4gICAgfVxyXG4gICAgaWYgKG9wdGlvbnMucmVmZXIgJiYgdGhpcy5sYXVuY2hPcHRpb24gIT0gbnVsbCkge1xyXG4gICAgICBkYXRhLnJlZmVyID0geWllbGQgdGhpcy5fZ2V0UmVmZXJlckluZm8odGhpcy5sYXVuY2hPcHRpb24pO1xyXG4gICAgICB0aGlzLmxhdW5jaE9wdGlvbiA9IG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9LFxyXG4gIGluaXRHbG9iYWxDb25maWcoKSB7XHJcbiAgICBjb25zdCB7XHJcbiAgICAgIGNvbmZpZ1VybFxyXG4gICAgfSA9IHRoaXMuY29uZmlnO1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgaWYgKGNvbmZpZ1VybCAhPSBudWxsKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdpbml0R2xvYmFsQ29uZmlnLi4uJyk7XHJcbiAgICAgIHZhciB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgY29uc29sZS5sb2coJ1JlYWQgY29uZmlndXJhdGlvbiBmcm9tOicgKyBjb25maWdVcmwpO1xyXG4gICAgICByZXR1cm4gdGhpcy5mZXRjaERhdGFQcm9taXNlKGNvbmZpZ1VybCwge1xyXG4gICAgICAgICAgdGltZTogdGltZXN0YW1wXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgIGlmIChkYXRhLmdsb2JhbCkge1xyXG4gICAgICAgICAgICAvLyDlkIjlubZnbG9iYWxcclxuICAgICAgICAgICAgc2VsZi5jb25maWcgPSB7IC4uLnNlbGYuY29uZmlnLFxyXG4gICAgICAgICAgICAgIC4uLmRhdGEuZ2xvYmFsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgICAgICd1cGRhdGUgZ2xvYmFsOicgKyBKU09OLnN0cmluZ2lmeSh0aGlzLmdsb2JhbClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgLy8g6YG/5YWN5aSa5qyh5Yid5aeL5YyWXHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLmNvbmZpZ1VybCA9IG51bGw7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goZSA9PiB7XHJcbiAgICAgICAgICB0aHJvdyBlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH0sXHJcbiAgaW5pdEFwcE9wdGlvbnMoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICB2YXIgb3B0aW9uU3RyID0gd3guZ2V0U3RvcmFnZVN5bmMoJ3NldHRpbmdzX29wdGlvbnMnKTtcclxuICAgICAgaWYgKG9wdGlvblN0ciAhPSBudWxsICYmIG9wdGlvblN0ci5pbmRleE9mKCd7JykgPT09IDApIHtcclxuICAgICAgICB2YXIgb3B0aW9ucyA9IEpTT04ucGFyc2Uob3B0aW9uU3RyKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnTG9hZCBBcHBPcHRpb25zOicsIG9wdGlvbnMpO1xyXG4gICAgICAgIHJldHVybiBvcHRpb25zO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdsb2FkT3B0aW9ucyBmYWlsZWQnLCBlKTtcclxuICAgIH1cclxuICAgIHJldHVybiB7fTtcclxuICB9LFxyXG4gIHVwZGF0ZU9wdGlvbihrZXksIHZhbHVlKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLmFwcE9wdGlvbnNba2V5XSA9IHZhbHVlO1xyXG4gICAgICB3eC5zZXRTdG9yYWdlKHtcclxuICAgICAgICBrZXk6ICdzZXR0aW5nc19vcHRpb25zJyxcclxuICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh0aGlzLmFwcE9wdGlvbnMpXHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZygndXBkYXRlT3B0aW9ucyBmYWlsZWQnLCBlKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8vIOWIneWni+WMlueUqOaIt+ezu+e7n1xyXG4gIGluaXRQYXNzcG9ydCgpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIGZ1bmN0aW9uIGNoZWNrU1NPUHJvbWlzZShyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgY29uc29sZS5sb2coJ2luaXRQYXNzcG9ydC4uLicpO1xyXG4gICAgICB3eC5jaGVja1Nlc3Npb24oe1xyXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBwYXNzcG9ydCA9IHd4LmdldFN0b3JhZ2VTeW5jKCdwYXNzcG9ydCcpO1xyXG4gICAgICAgICAgaWYgKHBhc3Nwb3J0KSB7XHJcbiAgICAgICAgICAgIHZhciBjaGVja1NTT1VybCA9XHJcbiAgICAgICAgICAgICAgc2VsZi5jb25maWcucGFzc3BvcnRVcmwgKyAnY2hlY2tTU08uZG8nO1xyXG4gICAgICAgICAgICB2YXIgY2hlY2tTU09QYXJhbXMgPSB7XHJcbiAgICAgICAgICAgICAgcGFzc3BvcnQ6IHBhc3Nwb3J0XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHNlbGYuZmV0Y2hEYXRhUHJvbWlzZShjaGVja1NTT1VybCwgY2hlY2tTU09QYXJhbXMpLnRoZW4oXHJcbiAgICAgICAgICAgICAgZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS51c2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnVzZXIuaWQuaW5kZXhPZignXycpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEudXNlci5pZCA9IGRhdGEudXNlci5pZC5zcGxpdCgnXycpWzFdXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnY2hlY2tTZXNzaW9uOicsIGUpO1xyXG4gICAgICAgICAgcmVzb2x2ZShudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY2hlY2tTU09Qcm9taXNlKHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICB9KTtcclxuICB9LFxyXG4gIGluaXRBcHBTb2NrZXQocGFzc3BvcnREYXRhKSB7XHJcbiAgICBpZiAodGhpcy5jb25maWcuYXBwU29ja2V0VXJsICYmIHBhc3Nwb3J0RGF0YSAhPSBudWxsKSB7XHJcbiAgICAgIHZhciBzb2NrZXRVcmwgPSB0aGlzLmNvbmZpZy5hcHBTb2NrZXRVcmw7XHJcbiAgICAgIHNvY2tldFVybCArPSAnP3VzZXJJZD0nICsgcGFzc3BvcnREYXRhLnNlc3Npb24uaWQ7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdpbml0IGFwcHNvY2tldDonLCBzb2NrZXRVcmwpO1xyXG4gICAgICBzZWxmLnNvY2tldCA9IG5ldyBBcHBTb2NrZXQoc29ja2V0VXJsKTtcclxuICAgICAgc2VsZi5zb2NrZXQub25NZXNzYWdlID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgdmFyIGpzb24gPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgICAgc2VsZi5vbk1lc3NhZ2UoanNvbik7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ29uTWVzc2FnZSBlcnJvcicsIGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgICAgc2VsZi5zb2NrZXQuY29ubmVjdCgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH0sXHJcbiAgdGhyb3dFcnJvcihlcnJvcikge1xyXG4gICAgd2VweS5zaG93TW9kYWwoe1xyXG4gICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgIGNvbnRlbnQ6IGVycm9yLm1lc3NhZ2UsXHJcbiAgICAgIHNob3dDYW5jZWw6IGZhbHNlLFxyXG4gICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgIGlmIChyZXMuY29uZmlybSkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ+eUqOaIt+eCueWHu+ehruWumicpXHJcbiAgICAgICAgfSBlbHNlIGlmIChyZXMuY2FuY2VsKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygn55So5oi354K55Ye75Y+W5raIJylcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcclxuICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XHJcbiAgICByZXR1cm4gZTtcclxuICB9LFxyXG4gICogX3d4TG9naW5HZW5lcmF0b3IoaXYsIGVuY3J5cHRlZERhdGEpIHtcclxuICAgIGNvbnN0IGNvZGUgPSB5aWVsZCB0aGlzLl9nZXRXeENvZGUoZmFsc2UpOyAvLyDkuI3og73nlKjnvJPlrZjvvIzkvJrlr7zoh7Tlh7rplJnvvIzkuI3nn6XpgZPkuLrku4DkuYjvvJ9cclxuICAgIGNvbnN0IHBhc3Nwb3J0RGF0YSA9IHlpZWxkIHRoaXMuX2xvZ2luUGFzc3BvcnQoY29kZSwgZW5jcnlwdGVkRGF0YSwgaXYpO1xyXG4gICAgLy8g5YaZ5YWl5Yiwc3RvcmFnZVxyXG4gICAgd3guc2V0U3RvcmFnZVN5bmMoJ3Bhc3Nwb3J0JywgcGFzc3BvcnREYXRhLnNlc3Npb24uaWQpO1xyXG4gICAgdGhpcy5wYXNzcG9ydERhdGEgPSBwYXNzcG9ydERhdGE7XHJcbiAgICByZXR1cm4gcGFzc3BvcnREYXRhO1xyXG4gIH0sXHJcbiAgbG9naW5XWChpdiwgZW5jcnlwdGVkRGF0YSkge1xyXG4gICAgcmV0dXJuIGNvKHRoaXMuX3d4TG9naW5HZW5lcmF0b3IoaXYsIGVuY3J5cHRlZERhdGEpKTtcclxuICB9LFxyXG4gIC8vIGh0dHBzOi8vbXAud2VpeGluLnFxLmNvbS9kZWJ1Zy93eGFkb2MvZGV2L2FwaS9hcGktbG9naW4uaHRtbCN3eGNoZWNrc2Vzc2lvbm9iamVjdFxyXG4gIC8vICDmr4/mrKHpg73ojrflvpfkuIDkuKrmlrDnmoRDb2RlXHJcbiAgX2dldFd4Q29kZSh1c2VDYWNoZSA9IGZhbHNlKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB2YXIgY29kZSA9IHd4LmdldFN0b3JhZ2VTeW5jKCd3eF9jb2RlJyk7XHJcblxyXG4gICAgICBmdW5jdGlvbiB3eENvZGUoKSB7XHJcbiAgICAgICAgd3gubG9naW4oe1xyXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNvZGVcIixjb2RlKVxyXG4gICAgICAgICAgICBpZiAocmVzLmNvZGUpIHtcclxuICAgICAgICAgICAgICBjb2RlID0gcmVzLmNvZGU7XHJcbiAgICAgICAgICAgICAgdmFyIGpzb24gPSB7fTtcclxuICAgICAgICAgICAgICBqc29uLmNsaWVudFR5cGUgPSBzZWxmLmNvbmZpZy5hcHBUeXBlO1xyXG4gICAgICAgICAgICAgIGpzb24uY2xpZW50SWQgPSBzZWxmLmNvbmZpZy5hcHBJZDtcclxuICAgICAgICAgICAgICBqc29uLmNvZGUgPSBjb2RlO1xyXG4gICAgICAgICAgICAgIGpzb24uYWN0aW9uID0gJ2NvZGU0a2V5JztcclxuICAgICAgICAgICAgICAvLyDmoLnmja7lvZPliY1jb2Rl55Sf5oiQ5LiA5Liqc2Vzc2lvbktleVxyXG4gICAgICAgICAgICAgIHNlbGYuZmV0Y2hEYXRhUHJvbWlzZShcclxuICAgICAgICAgICAgICAgICAgc2VsZi5jb25maWcucGFzc3BvcnRVcmwgKyAnbG9naW5YQ1guZG8nLFxyXG4gICAgICAgICAgICAgICAgICBqc29uXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgICAgY29kZSA9IGRhdGEua2V5O1xyXG4gICAgICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlU3luYygnd3hfY29kZScsIGNvZGUpO1xyXG4gICAgICAgICAgICAgICAgICByZXNvbHZlKGNvZGUpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygyMjIyMjIyMjIyMilcclxuICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IHtcclxuICAgICAgICAgICAgICAgIGNvZGU6ICd3eF9sb2dpbl9lcnJvcicsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiByZXMuZXJyTXNnXHJcbiAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICByZWplY3Qoc2VsZi50aHJvd0Vycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoY29kZSAmJiB1c2VDYWNoZSkge1xyXG4gICAgICAgIHd4LmNoZWNrU2Vzc2lvbih7XHJcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoY29kZSk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZmFpbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3eENvZGUoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB3eENvZGUoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSxcclxuICBfZ2V0VXNlckluZm8oKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBmdW5jdGlvbiB1c2VySW5mbygpIHtcclxuICAgICAgICB3eC5nZXRVc2VySW5mbyh7XHJcbiAgICAgICAgICAvLyB3aXRoQ3JlZGVudGlhbHM6IHRydWUsXHJcbiAgICAgICAgICBsYW5nOiAnemhfQ04nLFxyXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZ2V0VXNlckluZm89JywgcmVzKTtcclxuICAgICAgICAgICAgcmVzb2x2ZShyZXMpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgdmFyIGVycm9yID0ge1xyXG4gICAgICAgICAgICAgIGNvZGU6ICd1c2VyaW5mb19lcnJvcicsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogcmVzLmVyck1zZ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZWplY3Qoc2VsZi50aHJvd0Vycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgLy8g5qOA5p+l55So5oi36K6+572uXHJcbiAgICAgIHd4LmdldFNldHRpbmcoe1xyXG4gICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICBpZiAoIXJlcy5hdXRoU2V0dGluZ1snc2NvcGUudXNlckluZm8nXSkge1xyXG4gICAgICAgICAgICB3eC5hdXRob3JpemUoe1xyXG4gICAgICAgICAgICAgIHNjb3BlOiAnc2NvcGUudXNlckluZm8nLFxyXG4gICAgICAgICAgICAgIHN1Y2Nlc3MoKSB7XHJcbiAgICAgICAgICAgICAgICB1c2VySW5mbygpO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZmFpbCgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHtcclxuICAgICAgICAgICAgICAgICAgY29kZTogJ3VzZXJpbmZvX3JlamVjdCcsXHJcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfnlKjmiLflj5bmtojmjojmnYMnXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KHNlbGYudGhyb3dFcnJvcihlcnJvcikpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB1c2VySW5mbygpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmFpbCgpIHtcclxuICAgICAgICAgIHZhciBlcnJvciA9IHtcclxuICAgICAgICAgICAgY29kZTogJ3VzZXJpbmZvX2ZhaWwnLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiAn6K+75Y+W55So5oi36K6+572u5aSx6LSlJ1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIHJlamVjdChzZWxmLnRocm93RXJyb3IoZXJyb3IpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuICBfbG9naW5QYXNzcG9ydChjb2RlLCBlbmNyeXB0ZWREYXRhLCBpdikge1xyXG4gICAgdmFyIGpzb24gPSB7fTtcclxuICAgIGpzb24uY2xpZW50VHlwZSA9IHRoaXMuY29uZmlnLmFwcFR5cGU7XHJcbiAgICBqc29uLmNsaWVudElkID0gdGhpcy5jb25maWcuYXBwSWQ7XHJcbiAgICBqc29uLmtleSA9IGNvZGU7XHJcbiAgICBqc29uLmFjdGlvbiA9ICdsb2dpbkRhdGEnO1xyXG4gICAganNvbi5lbmNyeXB0ZWREYXRhID0gZW5jcnlwdGVkRGF0YTtcclxuICAgIGpzb24uZW5jcnlwdGVkSVYgPSBpdjtcclxuICAgIGpzb24ucmVtZW1iZXIgPSAzNjU7IC8vIDM2NeWkqVxyXG4gICAgY29uc29sZS5sb2coJ2VuY3J5cHRlZERhdGE9JyArIGVuY3J5cHRlZERhdGEpO1xyXG4gICAgY29uc29sZS5sb2coJ2VuY3J5cHRlZElWPScgKyBpdik7XHJcbiAgICBjb25zb2xlLmxvZygnY29kZT0nICsgY29kZSk7XHJcbiAgICByZXR1cm4gdGhpcy5mZXRjaERhdGFQcm9taXNlKFxyXG4gICAgICB0aGlzLmNvbmZpZy5wYXNzcG9ydFVybCArICdsb2dpblhDWC5kbycsXHJcbiAgICAgIGpzb25cclxuICAgICk7XHJcbiAgfSxcclxuICAvLyAg5Y+q5pyJ5YiG5Lqr5Yiw576k5omN5pyJIHNoYXJlVGlja2V077yMIOWIhuS6q+WIsOS4quS6uuaYr+ayoeacieeahFxyXG4gIF9nZXRSZWZlcmVySW5mbyhvcHRpb25zKSB7XHJcbiAgICBjb25zb2xlLmxvZygnX2dldFJlZmVyZXJJbmZvOicsIG9wdGlvbnMpO1xyXG4gICAgdmFyIHJlZmVyZXJJZCA9IG9wdGlvbnMucXVlcnkucmVmZXJlcklkO1xyXG4gICAgaWYgKHJlZmVyZXJJZCkge1xyXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIHd4LmxvZ2luKHtcclxuICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwid3hMb2dpbjpcIiwgcmVzKTtcclxuICAgICAgICAgICAgaWYgKHJlcy5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgcmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgICByZWZlcmVySWQ6IHJlZmVyZXJJZCxcclxuICAgICAgICAgICAgICAgIHJlZmVyZXJDb2RlOiByZXMuY29kZSxcclxuICAgICAgICAgICAgICAgIHNlY2VuZTogb3B0aW9ucy5zY2VuZSxcclxuICAgICAgICAgICAgICAgIHBhdGg6IG9wdGlvbnMucGF0aFxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xyXG4gIH0sXHJcbiAgb25NZXNzYWdlKGRhdGEpIHtcclxuICAgIGNvbnNvbGUubG9nKCdyZWNlaXZlIGFwcCBtZXNzYWdlJywgZGF0YSk7XHJcbiAgICBpZiAodGhpcy5tZXNzYWdlQ2FsbGJhY2sgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLm1lc3NhZ2VDYWxsYmFjayhkYXRhKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGxpc3Rlbk1lc3NhZ2UoY2FsbGJhY2spIHtcclxuICAgIHRoaXMubWVzc2FnZUNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgfSxcclxuICBiaW5kTW9iaWxlUHJvbWlzZShpdiwgZW5jcnlwdGVkRGF0YSwgcGFzc3BvcnRTZXNzaW9uSWQpIHtcclxuICAgIC8vIOaJi+acuue7keWumlxyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdmFyIGNvZGUgPSBudWxsO1xyXG4gICAgLy8g55m75b2V5Lqk5o2icGFzc3BvcnRJZFxyXG4gICAgZnVuY3Rpb24gbG9naW5Nb2JpbGUocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgIHZhciBqc29uID0ge307XHJcbiAgICAgIGpzb24uY2xpZW50VHlwZSA9IHNlbGYuY29uZmlnLmFwcFR5cGU7XHJcbiAgICAgIGpzb24uY2xpZW50SWQgPSBzZWxmLmNvbmZpZy5hcHBJZDtcclxuICAgICAganNvbi5rZXkgPSBjb2RlO1xyXG4gICAgICBqc29uLmVuY3J5cHRlZERhdGEgPSBlbmNyeXB0ZWREYXRhO1xyXG4gICAgICBqc29uLmVuY3J5cHRlZElWID0gaXY7XHJcbiAgICAgIGpzb24ubG9naW5UeXBlID0gJ21vYmlsZSc7XHJcbiAgICAgIGpzb24ubGluayA9IHRydWU7XHJcbiAgICAgIGpzb24ubGlua0ZvcmNlID0gdHJ1ZTtcclxuICAgICAganNvbi5yZW1lbWJlciA9IDM2NTtcclxuICAgICAgLy8g57uR5a6a5Yiw5b2T5YmN55So5oi3XHJcbiAgICAgIGpzb24ucGFzc3BvcnQgPSBwYXNzcG9ydFNlc3Npb25JZDtcclxuICAgICAgLyoqICAqL1xyXG4gICAgICBzZWxmLmZldGNoRGF0YShcclxuICAgICAgICBzZWxmLmNvbmZpZy5wYXNzcG9ydFVybCArICdsb2dpbk1vYmlsZS5kbycsXHJcbiAgICAgICAganNvbixcclxuICAgICAgICBmdW5jdGlvbiAoanNvbikge1xyXG4gICAgICAgICAgaWYgKGpzb24uY29kZSA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdsb2dpblBhc3Nwb3J0PScgKyBKU09OLnN0cmluZ2lmeShqc29uKSlcclxuICAgICAgICAgICAgLy8gd3guc2V0U3RvcmFnZVN5bmMoXCJwYXNzcG9ydFwiLCBqc29uLm1lc3NhZ2VzLmRhdGEuc2Vzc2lvbi5pZCk7XHJcbiAgICAgICAgICAgIHJlc29sdmUoanNvbi5tZXNzYWdlcy5kYXRhKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlamVjdChqc29uLm1lc3NhZ2VzLmVycm9yKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICBzZWxmLl9nZXRXeENvZGUocmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICBjb2RlID0gZGF0YTtcclxuICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxvZ2luTW9iaWxlKHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChwYXNzcG9ydERhdGEpIHtcclxuICAgICAgICAgIHJlc29sdmUocGFzc3BvcnREYXRhKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbiAocmVhc29uKSB7XHJcbiAgICAgICAgICByZWplY3QocmVhc29uKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgdXBsb2FkRmlsZSh1cGxvYWRJdGVtLCBsaXN0ZW5lcikge1xyXG4gICAgcmV0dXJuIGNvKHRoaXMuX3d4VXBsb2FkRmlsZSh1cGxvYWRJdGVtLCBsaXN0ZW5lcikpO1xyXG4gIH0sXHJcbiAgLy8g5LiK5Lyg5Zu+54mHXHJcbiAgKiBfd3hVcGxvYWRGaWxlKHVwbG9hZEl0ZW0sIGxpc3RlbmVyKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBjb25zb2xlLmxvZygnc3RhcnRVcGxvYWQ6JywgdXBsb2FkSXRlbS5pbmRleCk7XHJcbiAgICB2YXIgZGF0YSA9IHlpZWxkIHNlbGYuX25ld1VwbG9hZCgpO1xyXG4gICAgdXBsb2FkSXRlbS51cGxvYWRUb2tlbiA9IGRhdGEudG9rZW47XHJcbiAgICB1cGxvYWRJdGVtLnVwbG9hZFVybCA9IGRhdGEudXBsb2FkVXJsO1xyXG4gICAgeWllbGQgc2VsZi5fdXBsb2FkRmlsZSh1cGxvYWRJdGVtLCBsaXN0ZW5lcik7XHJcbiAgICB5aWVsZCBzZWxmLl91cGxvYWRRdWVyeUNoZWNrKHVwbG9hZEl0ZW0sbGlzdGVuZXIpO1xyXG4gICAgdmFyIHF1ZXJ5ID0geWllbGQgc2VsZi5fdXBsb2FkUXVlcnlSZXN1bHQodXBsb2FkSXRlbSk7XHJcbiAgICBpZiAocXVlcnkuZmlsZXMgJiYgcXVlcnkuZmlsZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICB2YXIgaW1hZ2VVcmwgPSBxdWVyeS5maWxlc1swXS5pbWFnZXNbMF0udXJsO1xyXG4gICAgICBjb25zb2xlLmxvZygn5LiK5Lyg57uT5p6cOicgKyBpbWFnZVVybCk7XHJcbiAgICAgIHVwbG9hZEl0ZW0uaW1hZ2VVcmwgPSBpbWFnZVVybDtcclxuICAgIH1cclxuICAgIHJldHVybiB1cGxvYWRJdGVtO1xyXG4gIH0sXHJcbiAgX25ld1VwbG9hZCgpIHtcclxuICAgIC8vIOiOt+W+l+S4gOS4quS4iuS8oOWcsOWdgFxyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdmFyIHVwbG9hZFVybCA9IHNlbGYuY29uZmlnLnVwbG9hZFVybCArICd1cGxvYWQuZG8nO1xyXG4gICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICB1cmw6IHVwbG9hZFVybCxcclxuICAgICAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIGFjdGlvbjogJ3VwbG9hZCcsXHJcbiAgICAgICAgICB0eXBlOiAnaW1hZ2UnLFxyXG4gICAgICAgICAgYXBwSWQ6IHNlbGYuY29uZmlnLnVwbG9hZEFwcElkXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgdmFyIGpzb24gPSByZXMuZGF0YTtcclxuICAgICAgICAgIGlmIChqc29uLmNvZGUgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXNvbHZlKGpzb24ubWVzc2FnZXMuZGF0YSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IGpzb24ubWVzc2FnZXMuZXJyb3I7XHJcbiAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICBlLm5hbWUgPSBlcnJvci5jb2RlO1xyXG4gICAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmYWlsKHJlcykge1xyXG4gICAgICAgICAgdmFyIGVycm9yID0ge1xyXG4gICAgICAgICAgICBjb2RlOiAndXBsb2FkX2Vycm9yJyxcclxuICAgICAgICAgICAgbWVzc2FnZTogcmVzLmVyck1zZ1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcclxuICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuICAvLyDkuIrkvKDmlofku7bnmoTlhbfkvZNcclxuICBfdXBsb2FkRmlsZSh1cGxvYWRJdGVtLCBsaXN0ZW5lcikge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgdXBsb2FkVGFzayA9IHd4LnVwbG9hZEZpbGUoe1xyXG4gICAgICAgIHVybDogdXBsb2FkSXRlbS51cGxvYWRVcmwsXHJcbiAgICAgICAgZmlsZVBhdGg6IHVwbG9hZEl0ZW0uZmlsZSxcclxuICAgICAgICBuYW1lOiAnZmlsZScsXHJcbiAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgIGlmIChyZXMuc3RhdHVzQ29kZSAhPT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHZhciBlcnJvciA9IHtcclxuICAgICAgICAgICAgICBjb2RlOiAndXBsb2FkX2Vycm9yJyxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiAnSFRUUOmUmeivrzonICsgcmVzLnN0YXR1c0NvZGVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XHJcbiAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUodXBsb2FkSXRlbSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmYWlsKHJlcykge1xyXG4gICAgICAgICAgdmFyIGVycm9yID0ge1xyXG4gICAgICAgICAgICBjb2RlOiAndXBsb2FkX2Vycm9yJyxcclxuICAgICAgICAgICAgbWVzc2FnZTogcmVzLmVyck1zZ1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcclxuICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyDnm5HmjqfkuIrkvKDov5vluqZcclxuICAgICAgdXBsb2FkVGFzay5vblByb2dyZXNzVXBkYXRlKHJlcyA9PiB7XHJcbiAgICAgICAgaWYgKGxpc3RlbmVyICE9IG51bGwpIHtcclxuICAgICAgICAgIHVwbG9hZEl0ZW0ucHJvZ3Jlc3MgPSByZXMucHJvZ3Jlc3M7XHJcbiAgICAgICAgICBpZiAodXBsb2FkSXRlbS5wcm9ncmVzcyA+IDk5KSB7XHJcbiAgICAgICAgICAgIHVwbG9hZEl0ZW0ucHJvZ3Jlc3MgPSA5OTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGxpc3RlbmVyKHVwbG9hZEl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZygn5LiK5Lyg6L+b5bqmJywgcmVzLnByb2dyZXNzKTtcclxuICAgICAgICAvKlxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ+W3sue7j+S4iuS8oOeahOaVsOaNrumVv+W6picsIHJlcy50b3RhbEJ5dGVzU2VudCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXHJcbiAgICAgICAgICAgICfpooTmnJ/pnIDopoHkuIrkvKDnmoTmlbDmja7mgLvplb/luqYnLFxyXG4gICAgICAgICAgICByZXMudG90YWxCeXRlc0V4cGVjdGVkVG9TZW5kXHJcbiAgICAgICAgKTtcclxuICAgICAgICAqL1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgLy8g56Gu6K6k5pyN5Yqh5Zmo5bey57uP5pS25Yiw5omA5pyJ5pWw5o2uXHJcbiAgX3VwbG9hZFF1ZXJ5Q2hlY2sodXBsb2FkSXRlbSxsaXN0ZW5lcikge1xyXG4gICAgdmFyIHVwbG9hZFVybCA9IHVwbG9hZEl0ZW0udXBsb2FkVXJsO1xyXG4gICAgZnVuY3Rpb24gY2hlY2tGaW5pc2hlZChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgdXJsOiB1cGxvYWRVcmwsXHJcbiAgICAgICAgbWV0aG9kOiAnZ2V0JyxcclxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICB2YXIgZGF0YSA9IHJlcy5kYXRhO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJjaGVjayB1cGxvYWQgZmluaXNoZWQ6XCIsIGRhdGEpO1xyXG4gICAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSAnZmluaXNoJykge1xyXG4gICAgICAgICAgICBpZiAobGlzdGVuZXIgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgIHVwbG9hZEl0ZW0ucHJvZ3Jlc3MgPSAxMDA7XHJcbiAgICAgICAgICAgICAgbGlzdGVuZXIodXBsb2FkSXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgIGNoZWNrRmluaXNoZWQocmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICB2YXIgZXJyb3IgPSB7XHJcbiAgICAgICAgICAgIGNvZGU6ICd1cGxvYWRfZXJyb3InLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiByZXMuZXJyTXNnXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJxdWVyeSBzZXJ2ZXIgZXJyb3Isd2lsbCByZXRyeTpcIiwgZXJyb3IpO1xyXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNoZWNrRmluaXNoZWQocmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY2hlY2tGaW5pc2hlZChyZXNvbHZlLCByZWplY3QpO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuICBfdXBsb2FkUXVlcnlSZXN1bHQodXBsb2FkSXRlbSkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdmFyIHVwbG9hZFVybCA9IHNlbGYuY29uZmlnLnVwbG9hZFVybCArICd1cGxvYWQuZG8nO1xyXG4gICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICB1cmw6IHVwbG9hZFVybCxcclxuICAgICAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIGFjdGlvbjogJ3F1ZXJ5JyxcclxuICAgICAgICAgIHRva2VuOiB1cGxvYWRJdGVtLnVwbG9hZFRva2VuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICB2YXIganNvbiA9IHJlcy5kYXRhO1xyXG4gICAgICAgICAgaWYgKGpzb24uY29kZSA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoanNvbi5tZXNzYWdlcy5kYXRhKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVycm9yID0ganNvbi5tZXNzYWdlcy5lcnJvcjtcclxuICAgICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XHJcbiAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgIHZhciBlcnJvciA9IHtcclxuICAgICAgICAgICAgY29kZTogJ3VwbG9hZF9lcnJvcicsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IHJlcy5lcnJNc2dcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XHJcbiAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEFwcDtcclxuIl19