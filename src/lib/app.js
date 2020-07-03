import AppSocket from './appsocket';
import md5 from 'md5';
import 'wepy-async-function';
import co from 'co';
import wepy from 'wepy';

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
  init(globalOptions, wxOptions) {
    if (this.state !== 'init') {
      throw new Error('app.init can be invoked only once');
    }
    this.launchOption = wxOptions;
    this.config = { ...this.config,
      ...globalOptions
    };
    console.log('App Inited:', this.config, this.launchOption);
    this.state = 'inited';
  },
  preload(type, data) {
    try {
      if (type === 'url') {
        var url = data;
        wx.request({
          url: url,
          success: function (res) {},
          fail: function (error) {
            console.log('preload failed:', url, error);
          }
        });
      } else if (type === 'cache') {
        let cacheKey = md5(data.key);
        this.dataCache[cacheKey] = data.value;
      } else if (type === 'storage') {
        let cacheKey = md5(data.key);
        wx.setStorageSync('cache_' + cacheKey, data.value);
      }
    } catch (e) {
      console.log('preload error:', type, data, e);
    }
  },
  // 统一的数据访问接口
  fetchData(url, params, callback, fetchOptions = {}) {
    var defaultOptions = {
      showLoading: false,
      method: 'GET',
      showLoadingTitle: '正在加载数据...',
      useCache: false, // 使用开启缓存，如果是则会把数据缓存到storage
      expireTime: 60 // 默认缓存时间60秒，如果设置为0，立即失效
    };
    const options = { ...defaultOptions,
      ...fetchOptions
    };
    var cacheKey = null;
    var cache = null;
    if (options.useCache) {
      cacheKey =
        options.cacheKey ||
        md5(this.config.versionInfo.version + '_' + url); // 跟一个版本号
      cache = wx.getStorageSync('cache_' + cacheKey);
      try {
        if (cache === '' || cache.length === 0) {
          cache = null;
        }
        if (cache != null) {
          cache = JSON.parse(cache);
          let now = new Date().getTime();
          if (
            isNaN(cache.expired) ||
            now > cache.expired ||
            options.expireTime === 0
          ) {
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
      success: function (res) {
        if (options.useCache && options.expireTime > 0) {
          let now = new Date().getTime();
          const cacheString = JSON.stringify({
            expired: now + options.expireTime * 1000,
            data: res.data
          });
          wx.setStorageSync('cache_' + cacheKey, cacheString);
        }
        callback(res.data);
        if (options.showLoading) {
          wx.hideLoading();
        }
      },
      fail: function (error) {
        console.log(111111111111)
        if (options.showLoading) {
          wx.hideLoading();
        }
        console.log('fetchData error:', error);
        if (cache !== null && cacheKey != null) {
          // 无须更新缓存
        } else {
          const errObj = {
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
  fetchDataPromise(url, params, options) {
    // console.log("fectchData from " + url + ",params=", params);
    var self = this;
    return new Promise((resolve, reject) => {
      self.fetchData(
        url,
        params,
        function (json) {
          if (json.code === 200) {
            resolve(json.messages.data);
          } else {
            var error = json.messages.error;
            reject(self.throwError(error));
          }
        },
        options
      );
    });
  },
  // 检查是否准备，由页面自己调用
  checkReady(checkOption) {
    const options = {
      ...{
        user: false, // 检查用户，如果没有登录，触发异常
        userInfo: false, // 仅仅是加载用户，而不触发登录异常
        geo: false, // 获得GEO数据
        options: false, // 获得个性选项
        config: false, // 获得 全局配置
        refer: false // 获得分享信息
      },
      ...checkOption
    };
    console.log('checkOptions:', options);
    return co(this._checkGenerator(options));
  },
  * _checkGenerator(options) {
    let data = {};
    // 全局参数,只会初始化一次
    yield this.initGlobalConfig();
    // 初始化 用户
    // 刷一下wxCode
    yield this._getWxCode(true);
    if (this.passportData === null) {
      this.passportData = yield this.initPassport();
    }
    if (options.user) {
      const error = {
        code: 'user_login',
        message: '需要登录'
      };
      if (this.passportData === null) {
        throw this.throwError(error);
      }
      // 如果登录成功，初始化AppSocket
      yield this.initAppSocket(this.passportData);
      data.passportData = this.passportData;
    }
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
    if (options.refer && this.launchOption != null) {
      data.refer = yield this._getRefererInfo(this.launchOption);
      this.launchOption = null;
    }
    return data;
  },
  initGlobalConfig() {
    const {
      configUrl
    } = this.config;
    var self = this;
    if (configUrl != null) {
      console.log('initGlobalConfig...');
      var timestamp = new Date().getTime();
      console.log('Read configuration from:' + configUrl);
      return this.fetchDataPromise(configUrl, {
          time: timestamp
        })
        .then(data => {
          if (data.global) {
            // 合并global
            self.config = { ...self.config,
              ...data.global
            };
            console.log(
              'update global:' + JSON.stringify(this.global)
            );
            // 避免多次初始化
            this.config.configUrl = null;
          }
        })
        .catch(e => {
          throw e;
        });
    }
    return Promise.resolve();
  },
  initAppOptions() {
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
  updateOption(key, value) {
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
  initPassport() {
    var self = this;
    function checkSSOPromise(resolve, reject) {
      console.log('initPassport...');
      wx.checkSession({
        success: function () {
          var passport = wx.getStorageSync('passport');
          if (passport) {
            var checkSSOUrl =
              self.config.passportUrl + 'checkSSO.do';
            var checkSSOParams = {
              passport: passport
            };
            self.fetchDataPromise(checkSSOUrl, checkSSOParams).then(
              data => {
                if (data.user) {
                  if (data.user.id.indexOf('_') !== -1) {
                    data.user.id = data.user.id.split('_')[1]
                  }
                  resolve(data);
                } else {
                  resolve(null);
                }
              }
            );
          } else {
            resolve(null);
          }
        },
        fail: function (e) {
          console.log('checkSession:', e);
          resolve(null);
        }
      });
    }
    return new Promise((resolve, reject) => {
      checkSSOPromise(resolve, reject);
    });
  },
  initAppSocket(passportData) {
    if (this.config.appSocketUrl && passportData != null) {
      var socketUrl = this.config.appSocketUrl;
      socketUrl += '?userId=' + passportData.session.id;
      console.log('init appsocket:', socketUrl);
      self.socket = new AppSocket(socketUrl);
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
  throwError(error) {
    wepy.showModal({
      title: '提示',
      content: error.message,
      showCancel: false,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    var e = new Error(error.message);
    e.name = error.code;
    return e;
  },
  * _wxLoginGenerator(iv, encryptedData) {
    const code = yield this._getWxCode(false); // 不能用缓存，会导致出错，不知道为什么？
    const passportData = yield this._loginPassport(code, encryptedData, iv);
    // 写入到storage
    wx.setStorageSync('passport', passportData.session.id);
    this.passportData = passportData;
    return passportData;
  },
  loginWX(iv, encryptedData) {
    return co(this._wxLoginGenerator(iv, encryptedData));
  },
  // https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html#wxchecksessionobject
  //  每次都获得一个新的Code
  _getWxCode(useCache = false) {
    var self = this;
    return new Promise((resolve, reject) => {
      var code = wx.getStorageSync('wx_code');

      function wxCode() {
        wx.login({
          success: function (res) {
            console.log("code",code)
            if (res.code) {
              code = res.code;
              var json = {};
              json.clientType = self.config.appType;
              json.clientId = self.config.appId;
              json.code = code;
              json.action = 'code4key';
              // 根据当前code生成一个sessionKey
              self.fetchDataPromise(
                  self.config.passportUrl + 'loginXCX.do',
                  json
                )
                .then(data => {
                  code = data.key;
                  wx.setStorageSync('wx_code', code);
                  resolve(code);
                })
                .catch(error => {
                  reject(error);
                });
            } else {
              console.log(22222222222)
              const error = {
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
          success: function () {
            resolve(code);
          },
          fail: function () {
            wxCode();
          }
        });
      } else {
        wxCode();
      }
    });
  },
  _getUserInfo() {
    var self = this;
    return new Promise((resolve, reject) => {
      function userInfo() {
        wx.getUserInfo({
          // withCredentials: true,
          lang: 'zh_CN',
          success: function (res) {
            console.log('getUserInfo=', res);
            resolve(res);
          },
          fail: function (res) {
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
        success(res) {
          if (!res.authSetting['scope.userInfo']) {
            wx.authorize({
              scope: 'scope.userInfo',
              success() {
                userInfo();
              },
              fail() {
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
        fail() {
          var error = {
            code: 'userinfo_fail',
            message: '读取用户设置失败'
          };
          reject(self.throwError(error));
        }
      });
    });
  },
  _loginPassport(code, encryptedData, iv) {
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
    return this.fetchDataPromise(
      this.config.passportUrl + 'loginXCX.do',
      json
    );
  },
  //  只有分享到群才有 shareTicket， 分享到个人是没有的
  _getRefererInfo(options) {
    console.log('_getRefererInfo:', options);
    var refererId = options.query.refererId;
    if (refererId) {
      return new Promise((resolve, reject) => {
        wx.login({
          complete: function (res) {
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
  onMessage(data) {
    console.log('receive app message', data);
    if (this.messageCallback != null) {
      this.messageCallback(data);
    }
  },
  listenMessage(callback) {
    this.messageCallback = callback;
  },
  bindMobilePromise(iv, encryptedData, passportSessionId) {
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
      self.fetchData(
        self.config.passportUrl + 'loginMobile.do',
        json,
        function (json) {
          if (json.code === 200) {
            // console.log('loginPassport=' + JSON.stringify(json))
            // wx.setStorageSync("passport", json.messages.data.session.id);
            resolve(json.messages.data);
          } else {
            reject(json.messages.error);
          }
        }
      );
    }
    return new Promise((resolve, reject) => {
      new Promise((resolve, reject) => {
          self._getWxCode(resolve, reject);
        })
        .then(function (data) {
          code = data;
          return new Promise((resolve, reject) => {
            loginMobile(resolve, reject);
          });
        })
        .then(function (passportData) {
          resolve(passportData);
        })
        .catch(function (reason) {
          reject(reason);
        });
    });
  },
  uploadFile(uploadItem, listener) {
    return co(this._wxUploadFile(uploadItem, listener));
  },
  // 上传图片
  * _wxUploadFile(uploadItem, listener) {
    var self = this;
    console.log('startUpload:', uploadItem.index);
    var data = yield self._newUpload();
    uploadItem.uploadToken = data.token;
    uploadItem.uploadUrl = data.uploadUrl;
    yield self._uploadFile(uploadItem, listener);
    yield self._uploadQueryCheck(uploadItem,listener);
    var query = yield self._uploadQueryResult(uploadItem);
    if (query.files && query.files.length > 0) {
      var imageUrl = query.files[0].images[0].url;
      console.log('上传结果:' + imageUrl);
      uploadItem.imageUrl = imageUrl;
    }
    return uploadItem;
  },
  _newUpload() {
    // 获得一个上传地址
    var self = this;
    return new Promise((resolve, reject) => {
      var uploadUrl = self.config.uploadUrl + 'upload.do';
      wx.request({
        url: uploadUrl,
        method: 'get',
        data: {
          action: 'upload',
          type: 'image',
          appId: self.config.uploadAppId
        },
        success(res) {
          var json = res.data;
          if (json.code === 200) {
            resolve(json.messages.data);
          } else {
            const error = json.messages.error;
            var e = new Error(error.message);
            e.name = error.code;
            reject(e);
          }
        },
        fail(res) {
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
  _uploadFile(uploadItem, listener) {
    return new Promise((resolve, reject) => {
      const uploadTask = wx.uploadFile({
        url: uploadItem.uploadUrl,
        filePath: uploadItem.file,
        name: 'file',
        success(res) {
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
        fail(res) {
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
      uploadTask.onProgressUpdate(res => {
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
  _uploadQueryCheck(uploadItem,listener) {
    var uploadUrl = uploadItem.uploadUrl;
    function checkFinished(resolve, reject) {
      wx.request({
        url: uploadUrl,
        method: 'get',
        success: function (res) {
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
        fail: function (res) {
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
    return new Promise((resolve, reject) => {
      checkFinished(resolve, reject);
    });
  },
  _uploadQueryResult(uploadItem) {
    var self = this;
    return new Promise((resolve, reject) => {
      var uploadUrl = self.config.uploadUrl + 'upload.do';
      wx.request({
        url: uploadUrl,
        method: 'get',
        data: {
          action: 'query',
          token: uploadItem.uploadToken
        },
        success: function (res) {
          var json = res.data;
          if (json.code === 200) {
            resolve(json.messages.data);
          } else {
            const error = json.messages.error;
            var e = new Error(error.message);
            e.name = error.code;
            reject(e);
          }
        },
        fail: function (res) {
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

export default App;
