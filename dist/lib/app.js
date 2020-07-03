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
                        console.log('code', code);
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
                    console.log('check upload finished:', data);
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
                    console.log('query server error,will retry:', error);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJBcHAiLCJjb25maWciLCJ2ZXJzaW9uSW5mbyIsImRldmljZSIsInBsYXRmb3JtIiwidmVyc2lvbiIsImxhdW5jaE9wdGlvbiIsInBhc3Nwb3J0RGF0YSIsImdlb0RhdGEiLCJhcHBPcHRpb25zIiwic3RhdGUiLCJzb2NrZXQiLCJtZXNzYWdlQ2FsbGJhY2siLCJpbml0IiwiZ2xvYmFsT3B0aW9ucyIsInd4T3B0aW9ucyIsIkVycm9yIiwiY29uc29sZSIsImxvZyIsInByZWxvYWQiLCJ0eXBlIiwiZGF0YSIsInVybCIsInd4IiwicmVxdWVzdCIsInN1Y2Nlc3MiLCJyZXMiLCJmYWlsIiwiZXJyb3IiLCJjYWNoZUtleSIsImtleSIsImRhdGFDYWNoZSIsInZhbHVlIiwic2V0U3RvcmFnZVN5bmMiLCJlIiwiZmV0Y2hEYXRhIiwicGFyYW1zIiwiY2FsbGJhY2siLCJmZXRjaE9wdGlvbnMiLCJkZWZhdWx0T3B0aW9ucyIsInNob3dMb2FkaW5nIiwibWV0aG9kIiwic2hvd0xvYWRpbmdUaXRsZSIsInVzZUNhY2hlIiwiZXhwaXJlVGltZSIsIm9wdGlvbnMiLCJjYWNoZSIsImdldFN0b3JhZ2VTeW5jIiwibGVuZ3RoIiwiSlNPTiIsInBhcnNlIiwibm93IiwiRGF0ZSIsImdldFRpbWUiLCJpc05hTiIsImV4cGlyZWQiLCJyZW1vdmVTdG9yYWdlU3luYyIsIm1lc3NhZ2UiLCJoZWFkZXIiLCJjYWNoZVN0cmluZyIsInN0cmluZ2lmeSIsImhpZGVMb2FkaW5nIiwiZXJyT2JqIiwiY29kZSIsIm1lc3NhZ2VzIiwiZXJyTXNnIiwiZmV0Y2hEYXRhUHJvbWlzZSIsInNlbGYiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImpzb24iLCJ0aHJvd0Vycm9yIiwiY2hlY2tSZWFkeSIsImNoZWNrT3B0aW9uIiwidXNlciIsInVzZXJJbmZvIiwiZ2VvIiwicmVmZXIiLCJfY2hlY2tHZW5lcmF0b3IiLCJpbml0R2xvYmFsQ29uZmlnIiwiX2dldFd4Q29kZSIsImluaXRQYXNzcG9ydCIsImluaXRBcHBTb2NrZXQiLCJpbml0QXBwT3B0aW9ucyIsIl9nZXRSZWZlcmVySW5mbyIsImNvbmZpZ1VybCIsInRpbWVzdGFtcCIsInRpbWUiLCJ0aGVuIiwiZ2xvYmFsIiwiY2F0Y2giLCJvcHRpb25TdHIiLCJpbmRleE9mIiwidXBkYXRlT3B0aW9uIiwic2V0U3RvcmFnZSIsImNoZWNrU1NPUHJvbWlzZSIsImNoZWNrU2Vzc2lvbiIsInBhc3Nwb3J0IiwiY2hlY2tTU09VcmwiLCJwYXNzcG9ydFVybCIsImNoZWNrU1NPUGFyYW1zIiwiaWQiLCJzcGxpdCIsImFwcFNvY2tldFVybCIsInNvY2tldFVybCIsInNlc3Npb24iLCJBcHBTb2NrZXQiLCJvbk1lc3NhZ2UiLCJjb25uZWN0Iiwid2VweSIsInNob3dNb2RhbCIsInRpdGxlIiwiY29udGVudCIsInNob3dDYW5jZWwiLCJjb25maXJtIiwiY2FuY2VsIiwibmFtZSIsIl93eExvZ2luR2VuZXJhdG9yIiwiaXYiLCJlbmNyeXB0ZWREYXRhIiwiX2xvZ2luUGFzc3BvcnQiLCJsb2dpbldYIiwid3hDb2RlIiwibG9naW4iLCJjbGllbnRUeXBlIiwiYXBwVHlwZSIsImNsaWVudElkIiwiYXBwSWQiLCJhY3Rpb24iLCJfZ2V0VXNlckluZm8iLCJnZXRVc2VySW5mbyIsImxhbmciLCJnZXRTZXR0aW5nIiwiYXV0aFNldHRpbmciLCJhdXRob3JpemUiLCJzY29wZSIsImVuY3J5cHRlZElWIiwicmVtZW1iZXIiLCJyZWZlcmVySWQiLCJxdWVyeSIsImNvbXBsZXRlIiwicmVmZXJlckNvZGUiLCJzZWNlbmUiLCJzY2VuZSIsInBhdGgiLCJsaXN0ZW5NZXNzYWdlIiwiYmluZE1vYmlsZVByb21pc2UiLCJwYXNzcG9ydFNlc3Npb25JZCIsImxvZ2luTW9iaWxlIiwibG9naW5UeXBlIiwibGluayIsImxpbmtGb3JjZSIsInJlYXNvbiIsInVwbG9hZEZpbGUiLCJ1cGxvYWRJdGVtIiwibGlzdGVuZXIiLCJfd3hVcGxvYWRGaWxlIiwiaW5kZXgiLCJfbmV3VXBsb2FkIiwidXBsb2FkVG9rZW4iLCJ0b2tlbiIsInVwbG9hZFVybCIsIl91cGxvYWRGaWxlIiwiX3VwbG9hZFF1ZXJ5Q2hlY2siLCJfdXBsb2FkUXVlcnlSZXN1bHQiLCJmaWxlcyIsImltYWdlVXJsIiwiaW1hZ2VzIiwidXBsb2FkQXBwSWQiLCJ1cGxvYWRUYXNrIiwiZmlsZVBhdGgiLCJmaWxlIiwic3RhdHVzQ29kZSIsIm9uUHJvZ3Jlc3NVcGRhdGUiLCJwcm9ncmVzcyIsImNoZWNrRmluaXNoZWQiLCJzdGF0dXMiLCJzZXRUaW1lb3V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTtBQUNBO0FBQ0EsSUFBSUEsTUFBTTtBQUNOQyxZQUFRO0FBQ0pDLHFCQUFhO0FBQ1RDLG9CQUFRLE9BREM7QUFFVEMsc0JBQVUsUUFGRDtBQUdUQyxxQkFBUyxXQUhBLENBR1k7QUFIWjtBQURULEtBREY7QUFRTkMsa0JBQWMsRUFSUixFQVFZO0FBQ2xCQyxrQkFBYyxJQVRSLEVBU2M7QUFDcEJDLGFBQVMsSUFWSCxFQVVTO0FBQ2ZDLGdCQUFZLElBWE47QUFZTkMsV0FBTyxNQVpEO0FBYU5DLFlBQVEsSUFiRixFQWFRO0FBQ2RDLHFCQUFpQixJQWRYLEVBY2lCO0FBQ3ZCQyxRQWZNLGdCQWVEQyxhQWZDLEVBZWNDLFNBZmQsRUFleUI7QUFDM0IsWUFBSSxLQUFLTCxLQUFMLEtBQWUsTUFBbkIsRUFBMkI7QUFDdkIsa0JBQU0sSUFBSU0sS0FBSixDQUFVLG1DQUFWLENBQU47QUFDSDtBQUNELGFBQUtWLFlBQUwsR0FBb0JTLFNBQXBCO0FBQ0EsYUFBS2QsTUFBTCxnQkFBbUIsS0FBS0EsTUFBeEIsRUFDT2EsYUFEUDtBQUdBRyxnQkFBUUMsR0FBUixDQUFZLGFBQVosRUFBMkIsS0FBS2pCLE1BQWhDLEVBQXdDLEtBQUtLLFlBQTdDO0FBQ0EsYUFBS0ksS0FBTCxHQUFhLFFBQWI7QUFDSCxLQXpCSztB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MEJBQUVtRixJQUFGLEdBQVN6RixNQUFNbUMsSUFBZjtBQUNBTywrQkFBT3BDLENBQVA7QUFDSDtBQUNKLGlCQWpCTTtBQWtCUFAsc0JBQU0sY0FBVUQsR0FBVixFQUFlO0FBQ2pCLHdCQUFJRSxRQUFRO0FBQ1JtQyw4QkFBTSxjQURFO0FBRVJOLGlDQUFTL0IsSUFBSXVDO0FBRkwscUJBQVo7QUFJQSx3QkFBSS9CLElBQUksSUFBSWxCLEtBQUosQ0FBVVksTUFBTTZCLE9BQWhCLENBQVI7QUFDQXZCLHNCQUFFbUYsSUFBRixHQUFTekYsTUFBTW1DLElBQWY7QUFDQU8sMkJBQU9wQyxDQUFQO0FBQ0g7QUExQk0sYUFBWDtBQTRCSCxTQTlCTSxDQUFQO0FBK0JIO0FBN3VCSyxDQUFWOztrQkFndkJlbEMsRyIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXBwU29ja2V0IGZyb20gJy4vYXBwc29ja2V0JztcclxuaW1wb3J0IG1kNSBmcm9tICdtZDUnO1xyXG5pbXBvcnQgJ3dlcHktYXN5bmMtZnVuY3Rpb24nO1xyXG5pbXBvcnQgY28gZnJvbSAnY28nO1xyXG5pbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuXHJcbi8qIEFQUCDlkK/liqjmtYHnqIvvvIzkuIDkuKrlupTnlKjlj6rmnInkuIDkuKphcHDlrp7kvovvvIzooqvmr4/kuKrpobXpnaLosIPnlKggKi9cclxuLyoqIOeuoeeQhuaJgOacieeahOaVsOaNrkNhY2hlICAqL1xyXG52YXIgQXBwID0ge1xyXG4gICAgY29uZmlnOiB7XHJcbiAgICAgICAgdmVyc2lvbkluZm86IHtcclxuICAgICAgICAgICAgZGV2aWNlOiAncGhvbmUnLFxyXG4gICAgICAgICAgICBwbGF0Zm9ybTogJ3d4X3hjeCcsXHJcbiAgICAgICAgICAgIHZlcnNpb246ICdfVkVSU0lPTl8nIC8vIOeJiOacrOWPt++8jHZlcnNpb24uanMg5Lya5Zyo57yW6K+R5LmL5ZCO5pu/5o2iXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGxhdW5jaE9wdGlvbjoge30sIC8vIOWQr+WKqOaXtuWAmeeahOWPguaVsO+8jOWvueS6juWIhuS6q1xyXG4gICAgcGFzc3BvcnREYXRhOiBudWxsLCAvLyDnlKjmiLfkv6Hmga9cclxuICAgIGdlb0RhdGE6IG51bGwsIC8vIEdFT+S/oeaBr1xyXG4gICAgYXBwT3B0aW9uczogbnVsbCxcclxuICAgIHN0YXRlOiAnaW5pdCcsXHJcbiAgICBzb2NrZXQ6IG51bGwsIC8vIOi/nuaOpeeahGFwcHNvY2tldFxyXG4gICAgbWVzc2FnZUNhbGxiYWNrOiBudWxsLCAvLyDov57mjqXnmoTmtojmga/lm57osINcclxuICAgIGluaXQoZ2xvYmFsT3B0aW9ucywgd3hPcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09ICdpbml0Jykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FwcC5pbml0IGNhbiBiZSBpbnZva2VkIG9ubHkgb25jZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxhdW5jaE9wdGlvbiA9IHd4T3B0aW9ucztcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IHsgLi4udGhpcy5jb25maWcsXHJcbiAgICAgICAgICAgIC4uLmdsb2JhbE9wdGlvbnNcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdBcHAgSW5pdGVkOicsIHRoaXMuY29uZmlnLCB0aGlzLmxhdW5jaE9wdGlvbik7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdpbml0ZWQnO1xyXG4gICAgfSxcclxuICAgIHByZWxvYWQodHlwZSwgZGF0YSkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlID09PSAndXJsJykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHVybCA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7fSxcclxuICAgICAgICAgICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3ByZWxvYWQgZmFpbGVkOicsIHVybCwgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdjYWNoZScpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjYWNoZUtleSA9IG1kNShkYXRhLmtleSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFDYWNoZVtjYWNoZUtleV0gPSBkYXRhLnZhbHVlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdG9yYWdlJykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhY2hlS2V5ID0gbWQ1KGRhdGEua2V5KTtcclxuICAgICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2VTeW5jKCdjYWNoZV8nICsgY2FjaGVLZXksIGRhdGEudmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygncHJlbG9hZCBlcnJvcjonLCB0eXBlLCBkYXRhLCBlKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8g57uf5LiA55qE5pWw5o2u6K6/6Zeu5o6l5Y+jXHJcbiAgICBmZXRjaERhdGEodXJsLCBwYXJhbXMsIGNhbGxiYWNrLCBmZXRjaE9wdGlvbnMgPSB7fSkge1xyXG4gICAgICAgIHZhciBkZWZhdWx0T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgc2hvd0xvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICBzaG93TG9hZGluZ1RpdGxlOiAn5q2j5Zyo5Yqg6L295pWw5o2uLi4uJyxcclxuICAgICAgICAgICAgdXNlQ2FjaGU6IGZhbHNlLCAvLyDkvb/nlKjlvIDlkK/nvJPlrZjvvIzlpoLmnpzmmK/liJnkvJrmiormlbDmja7nvJPlrZjliLBzdG9yYWdlXHJcbiAgICAgICAgICAgIGV4cGlyZVRpbWU6IDYwIC8vIOm7mOiupOe8k+WtmOaXtumXtDYw56eS77yM5aaC5p6c6K6+572u5Li6MO+8jOeri+WNs+WkseaViFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHsgLi4uZGVmYXVsdE9wdGlvbnMsXHJcbiAgICAgICAgICAgIC4uLmZldGNoT3B0aW9uc1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIGNhY2hlS2V5ID0gbnVsbDtcclxuICAgICAgICB2YXIgY2FjaGUgPSBudWxsO1xyXG4gICAgICAgIGlmIChvcHRpb25zLnVzZUNhY2hlKSB7XHJcbiAgICAgICAgICAgIGNhY2hlS2V5ID1cclxuICAgICAgICBvcHRpb25zLmNhY2hlS2V5IHx8XHJcbiAgICAgICAgbWQ1KHRoaXMuY29uZmlnLnZlcnNpb25JbmZvLnZlcnNpb24gKyAnXycgKyB1cmwpOyAvLyDot5/kuIDkuKrniYjmnKzlj7dcclxuICAgICAgICAgICAgY2FjaGUgPSB3eC5nZXRTdG9yYWdlU3luYygnY2FjaGVfJyArIGNhY2hlS2V5KTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGlmIChjYWNoZSA9PT0gJycgfHwgY2FjaGUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FjaGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGNhY2hlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWNoZSA9IEpTT04ucGFyc2UoY2FjaGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzTmFOKGNhY2hlLmV4cGlyZWQpIHx8XHJcbiAgICAgICAgICAgIG5vdyA+IGNhY2hlLmV4cGlyZWQgfHxcclxuICAgICAgICAgICAgb3B0aW9ucy5leHBpcmVUaW1lID09PSAwXHJcbiAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjYWNoZSBleHBpcmVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHd4LnJlbW92ZVN0b3JhZ2VTeW5jKGNhY2hlS2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlID0gY2FjaGUuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnZhbGlkIGNhY2hlOicgKyBjYWNoZUtleSArICcsJyArIGUubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNhY2hlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIC8vIOW3sue7j+WRveS4rSzml6DpnIDmmL7npLrov5vluqZcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMuc2hvd0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3B0aW9ucy5zaG93TG9hZGluZykge1xyXG4gICAgICAgICAgICAvLyB3eC5zaG93TG9hZGluZyh7XHJcbiAgICAgICAgICAgIC8vICAgdGl0bGU6IG9wdGlvbnMuc2hvd0xvYWRpbmdUaXRsZVxyXG4gICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNhY2hlICE9IG51bGwgJiYgb3B0aW9ucy51c2VDYWNoZSkge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhjYWNoZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyAvLyDpu5jorqTlgLxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbWV0aG9kOiBvcHRpb25zLm1ldGhvZCxcclxuICAgICAgICAgICAgZGF0YTogcGFyYW1zLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy51c2VDYWNoZSAmJiBvcHRpb25zLmV4cGlyZVRpbWUgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhY2hlU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBleHBpcmVkOiBub3cgKyBvcHRpb25zLmV4cGlyZVRpbWUgKiAxMDAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiByZXMuZGF0YVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2VTeW5jKCdjYWNoZV8nICsgY2FjaGVLZXksIGNhY2hlU3RyaW5nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHJlcy5kYXRhKTtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnNob3dMb2FkaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygxMTExMTExMTExMTEpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2hvd0xvYWRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICB3eC5oaWRlTG9hZGluZygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZldGNoRGF0YSBlcnJvcjonLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FjaGUgIT09IG51bGwgJiYgY2FjaGVLZXkgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOaXoOmhu+abtOaWsOe8k+WtmFxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJPYmogPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IDUwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogJ05FVFdPUktfRVJST1InLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgZXJyb3IuZXJyTXNnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyck9iaik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBmZXRjaERhdGFQcm9taXNlKHVybCwgcGFyYW1zLCBvcHRpb25zKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhcImZlY3RjaERhdGEgZnJvbSBcIiArIHVybCArIFwiLHBhcmFtcz1cIiwgcGFyYW1zKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgc2VsZi5mZXRjaERhdGEoXHJcbiAgICAgICAgICAgICAgICB1cmwsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXMsXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoanNvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChqc29uLmNvZGUgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGpzb24ubWVzc2FnZXMuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0ganNvbi5tZXNzYWdlcy5lcnJvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHNlbGYudGhyb3dFcnJvcihlcnJvcikpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgLy8g5qOA5p+l5piv5ZCm5YeG5aSH77yM55Sx6aG16Z2i6Ieq5bex6LCD55SoXHJcbiAgICBjaGVja1JlYWR5KGNoZWNrT3B0aW9uKSB7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgLi4ue1xyXG4gICAgICAgICAgICAgICAgdXNlcjogZmFsc2UsIC8vIOajgOafpeeUqOaIt++8jOWmguaenOayoeacieeZu+W9le+8jOinpuWPkeW8guW4uFxyXG4gICAgICAgICAgICAgICAgdXNlckluZm86IGZhbHNlLCAvLyDku4Xku4XmmK/liqDovb3nlKjmiLfvvIzogIzkuI3op6blj5HnmbvlvZXlvILluLhcclxuICAgICAgICAgICAgICAgIGdlbzogZmFsc2UsIC8vIOiOt+W+l0dFT+aVsOaNrlxyXG4gICAgICAgICAgICAgICAgb3B0aW9uczogZmFsc2UsIC8vIOiOt+W+l+S4quaAp+mAiemhuVxyXG4gICAgICAgICAgICAgICAgY29uZmlnOiBmYWxzZSwgLy8g6I635b6XIOWFqOWxgOmFjee9rlxyXG4gICAgICAgICAgICAgICAgcmVmZXI6IGZhbHNlIC8vIOiOt+W+l+WIhuS6q+S/oeaBr1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAuLi5jaGVja09wdGlvblxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NoZWNrT3B0aW9uczonLCBvcHRpb25zKTtcclxuICAgICAgICByZXR1cm4gY28odGhpcy5fY2hlY2tHZW5lcmF0b3Iob3B0aW9ucykpO1xyXG4gICAgfSxcclxuICAgICogX2NoZWNrR2VuZXJhdG9yKG9wdGlvbnMpIHtcclxuICAgICAgICBsZXQgZGF0YSA9IHt9O1xyXG4gICAgICAgIC8vIOWFqOWxgOWPguaVsCzlj6rkvJrliJ3lp4vljJbkuIDmrKFcclxuICAgICAgICB5aWVsZCB0aGlzLmluaXRHbG9iYWxDb25maWcoKTtcclxuICAgICAgICAvLyDliJ3lp4vljJYg55So5oi3XHJcbiAgICAgICAgLy8g5Yi35LiA5LiLd3hDb2RlXHJcbiAgICAgICAgeWllbGQgdGhpcy5fZ2V0V3hDb2RlKHRydWUpO1xyXG4gICAgICAgIGlmICh0aGlzLnBhc3Nwb3J0RGF0YSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhc3Nwb3J0RGF0YSA9IHlpZWxkIHRoaXMuaW5pdFBhc3Nwb3J0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRpb25zLnVzZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgZXJyb3IgPSB7XHJcbiAgICAgICAgICAgICAgICBjb2RlOiAndXNlcl9sb2dpbicsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAn6ZyA6KaB55m75b2VJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wYXNzcG9ydERhdGEgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IHRoaXMudGhyb3dFcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8g5aaC5p6c55m75b2V5oiQ5Yqf77yM5Yid5aeL5YyWQXBwU29ja2V0XHJcbiAgICAgICAgICAgIHlpZWxkIHRoaXMuaW5pdEFwcFNvY2tldCh0aGlzLnBhc3Nwb3J0RGF0YSk7XHJcbiAgICAgICAgICAgIGRhdGEucGFzc3BvcnREYXRhID0gdGhpcy5wYXNzcG9ydERhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRpb25zLnVzZXJJbmZvICYmIHRoaXMucGFzc3BvcnREYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgZGF0YS5wYXNzcG9ydERhdGEgPSB0aGlzLnBhc3Nwb3J0RGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnMub3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hcHBPcHRpb25zID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwcE9wdGlvbnMgPSB0aGlzLmluaXRBcHBPcHRpb25zKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGF0YS5hcHBPcHRpb25zID0gdGhpcy5hcHBPcHRpb25zO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3B0aW9ucy5jb25maWcpIHtcclxuICAgICAgICAgICAgZGF0YS5jb25maWcgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnMucmVmZXIgJiYgdGhpcy5sYXVuY2hPcHRpb24gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBkYXRhLnJlZmVyID0geWllbGQgdGhpcy5fZ2V0UmVmZXJlckluZm8odGhpcy5sYXVuY2hPcHRpb24pO1xyXG4gICAgICAgICAgICB0aGlzLmxhdW5jaE9wdGlvbiA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfSxcclxuICAgIGluaXRHbG9iYWxDb25maWcoKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBjb25maWdVcmxcclxuICAgICAgICB9ID0gdGhpcy5jb25maWc7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGlmIChjb25maWdVcmwgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaW5pdEdsb2JhbENvbmZpZy4uLicpO1xyXG4gICAgICAgICAgICB2YXIgdGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZWFkIGNvbmZpZ3VyYXRpb24gZnJvbTonICsgY29uZmlnVXJsKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShjb25maWdVcmwsIHtcclxuICAgICAgICAgICAgICAgIHRpbWU6IHRpbWVzdGFtcFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZ2xvYmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWQiOW5tmdsb2JhbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbmZpZyA9IHsgLi4uc2VsZi5jb25maWcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5kYXRhLmdsb2JhbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd1cGRhdGUgZ2xvYmFsOicgKyBKU09OLnN0cmluZ2lmeSh0aGlzLmdsb2JhbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g6YG/5YWN5aSa5qyh5Yid5aeL5YyWXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLmNvbmZpZ1VybCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH0sXHJcbiAgICBpbml0QXBwT3B0aW9ucygpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9uU3RyID0gd3guZ2V0U3RvcmFnZVN5bmMoJ3NldHRpbmdzX29wdGlvbnMnKTtcclxuICAgICAgICAgICAgaWYgKG9wdGlvblN0ciAhPSBudWxsICYmIG9wdGlvblN0ci5pbmRleE9mKCd7JykgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gSlNPTi5wYXJzZShvcHRpb25TdHIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0xvYWQgQXBwT3B0aW9uczonLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvcHRpb25zO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbG9hZE9wdGlvbnMgZmFpbGVkJywgZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7fTtcclxuICAgIH0sXHJcbiAgICB1cGRhdGVPcHRpb24oa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwT3B0aW9uc1trZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHd4LnNldFN0b3JhZ2Uoe1xyXG4gICAgICAgICAgICAgICAga2V5OiAnc2V0dGluZ3Nfb3B0aW9ucycsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh0aGlzLmFwcE9wdGlvbnMpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3VwZGF0ZU9wdGlvbnMgZmFpbGVkJywgZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIOWIneWni+WMlueUqOaIt+ezu+e7n1xyXG4gICAgaW5pdFBhc3Nwb3J0KCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBmdW5jdGlvbiBjaGVja1NTT1Byb21pc2UocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbml0UGFzc3BvcnQuLi4nKTtcclxuICAgICAgICAgICAgd3guY2hlY2tTZXNzaW9uKHtcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGFzc3BvcnQgPSB3eC5nZXRTdG9yYWdlU3luYygncGFzc3BvcnQnKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFzc3BvcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoZWNrU1NPVXJsID1cclxuICAgICAgICAgICAgICBzZWxmLmNvbmZpZy5wYXNzcG9ydFVybCArICdjaGVja1NTTy5kbyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaGVja1NTT1BhcmFtcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3Nwb3J0OiBwYXNzcG9ydFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmZldGNoRGF0YVByb21pc2UoY2hlY2tTU09VcmwsIGNoZWNrU1NPUGFyYW1zKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEudXNlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS51c2VyLmlkLmluZGV4T2YoJ18nKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEudXNlci5pZCA9IGRhdGEudXNlci5pZC5zcGxpdCgnXycpWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2hlY2tTZXNzaW9uOicsIGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjaGVja1NTT1Byb21pc2UocmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBpbml0QXBwU29ja2V0KHBhc3Nwb3J0RGF0YSkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5hcHBTb2NrZXRVcmwgJiYgcGFzc3BvcnREYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIHNvY2tldFVybCA9IHRoaXMuY29uZmlnLmFwcFNvY2tldFVybDtcclxuICAgICAgICAgICAgc29ja2V0VXJsICs9ICc/dXNlcklkPScgKyBwYXNzcG9ydERhdGEuc2Vzc2lvbi5pZDtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2luaXQgYXBwc29ja2V0OicsIHNvY2tldFVybCk7XHJcbiAgICAgICAgICAgIHNlbGYuc29ja2V0ID0gbmV3IEFwcFNvY2tldChzb2NrZXRVcmwpO1xyXG4gICAgICAgICAgICBzZWxmLnNvY2tldC5vbk1lc3NhZ2UgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIganNvbiA9IEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5vbk1lc3NhZ2UoanNvbik7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ29uTWVzc2FnZSBlcnJvcicsIGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBzZWxmLnNvY2tldC5jb25uZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH0sXHJcbiAgICB0aHJvd0Vycm9yKGVycm9yKSB7XHJcbiAgICAgICAgd2VweS5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IGVycm9yLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlLFxyXG4gICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcy5jb25maXJtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+eUqOaIt+eCueWHu+ehruWumicpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXMuY2FuY2VsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+eUqOaIt+eCueWHu+WPlua2iCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcclxuICAgICAgICByZXR1cm4gZTtcclxuICAgIH0sXHJcbiAgICAqIF93eExvZ2luR2VuZXJhdG9yKGl2LCBlbmNyeXB0ZWREYXRhKSB7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IHlpZWxkIHRoaXMuX2dldFd4Q29kZShmYWxzZSk7IC8vIOS4jeiDveeUqOe8k+WtmO+8jOS8muWvvOiHtOWHuumUme+8jOS4jeefpemBk+S4uuS7gOS5iO+8n1xyXG4gICAgICAgIGNvbnN0IHBhc3Nwb3J0RGF0YSA9IHlpZWxkIHRoaXMuX2xvZ2luUGFzc3BvcnQoY29kZSwgZW5jcnlwdGVkRGF0YSwgaXYpO1xyXG4gICAgICAgIC8vIOWGmeWFpeWIsHN0b3JhZ2VcclxuICAgICAgICB3eC5zZXRTdG9yYWdlU3luYygncGFzc3BvcnQnLCBwYXNzcG9ydERhdGEuc2Vzc2lvbi5pZCk7XHJcbiAgICAgICAgdGhpcy5wYXNzcG9ydERhdGEgPSBwYXNzcG9ydERhdGE7XHJcbiAgICAgICAgcmV0dXJuIHBhc3Nwb3J0RGF0YTtcclxuICAgIH0sXHJcbiAgICBsb2dpbldYKGl2LCBlbmNyeXB0ZWREYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIGNvKHRoaXMuX3d4TG9naW5HZW5lcmF0b3IoaXYsIGVuY3J5cHRlZERhdGEpKTtcclxuICAgIH0sXHJcbiAgICAvLyBodHRwczovL21wLndlaXhpbi5xcS5jb20vZGVidWcvd3hhZG9jL2Rldi9hcGkvYXBpLWxvZ2luLmh0bWwjd3hjaGVja3Nlc3Npb25vYmplY3RcclxuICAgIC8vICDmr4/mrKHpg73ojrflvpfkuIDkuKrmlrDnmoRDb2RlXHJcbiAgICBfZ2V0V3hDb2RlKHVzZUNhY2hlID0gZmFsc2UpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdmFyIGNvZGUgPSB3eC5nZXRTdG9yYWdlU3luYygnd3hfY29kZScpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gd3hDb2RlKCkge1xyXG4gICAgICAgICAgICAgICAgd3gubG9naW4oe1xyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NvZGUnLCBjb2RlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlID0gcmVzLmNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIganNvbiA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbi5jbGllbnRUeXBlID0gc2VsZi5jb25maWcuYXBwVHlwZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24uY2xpZW50SWQgPSBzZWxmLmNvbmZpZy5hcHBJZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24uY29kZSA9IGNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uLmFjdGlvbiA9ICdjb2RlNGtleSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmoLnmja7lvZPliY1jb2Rl55Sf5oiQ5LiA5Liqc2Vzc2lvbktleVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5mZXRjaERhdGFQcm9taXNlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29uZmlnLnBhc3Nwb3J0VXJsICsgJ2xvZ2luWENYLmRvJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUgPSBkYXRhLmtleTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoJ3d4X2NvZGUnLCBjb2RlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjb2RlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygyMjIyMjIyMjIyMik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAnd3hfbG9naW5fZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHJlcy5lcnJNc2dcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3Qoc2VsZi50aHJvd0Vycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY29kZSAmJiB1c2VDYWNoZSkge1xyXG4gICAgICAgICAgICAgICAgd3guY2hlY2tTZXNzaW9uKHtcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY29kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHd4Q29kZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd3hDb2RlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBfZ2V0VXNlckluZm8oKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHVzZXJJbmZvKCkge1xyXG4gICAgICAgICAgICAgICAgd3guZ2V0VXNlckluZm8oe1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBsYW5nOiAnemhfQ04nLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2dldFVzZXJJbmZvPScsIHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogJ3VzZXJpbmZvX2Vycm9yJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHJlcy5lcnJNc2dcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHNlbGYudGhyb3dFcnJvcihlcnJvcikpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIOajgOafpeeUqOaIt+iuvue9rlxyXG4gICAgICAgICAgICB3eC5nZXRTZXR0aW5nKHtcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXMuYXV0aFNldHRpbmdbJ3Njb3BlLnVzZXJJbmZvJ10pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3guYXV0aG9yaXplKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlOiAnc2NvcGUudXNlckluZm8nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzcygpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VySW5mbygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhaWwoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAndXNlcmluZm9fcmVqZWN0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ+eUqOaIt+WPlua2iOaOiOadgydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChzZWxmLnRocm93RXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlckluZm8oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbCgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6ICd1c2VyaW5mb19mYWlsJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ+ivu+WPlueUqOaIt+iuvue9ruWksei0pSdcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChzZWxmLnRocm93RXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgX2xvZ2luUGFzc3BvcnQoY29kZSwgZW5jcnlwdGVkRGF0YSwgaXYpIHtcclxuICAgICAgICB2YXIganNvbiA9IHt9O1xyXG4gICAgICAgIGpzb24uY2xpZW50VHlwZSA9IHRoaXMuY29uZmlnLmFwcFR5cGU7XHJcbiAgICAgICAganNvbi5jbGllbnRJZCA9IHRoaXMuY29uZmlnLmFwcElkO1xyXG4gICAgICAgIGpzb24ua2V5ID0gY29kZTtcclxuICAgICAgICBqc29uLmFjdGlvbiA9ICdsb2dpbkRhdGEnO1xyXG4gICAgICAgIGpzb24uZW5jcnlwdGVkRGF0YSA9IGVuY3J5cHRlZERhdGE7XHJcbiAgICAgICAganNvbi5lbmNyeXB0ZWRJViA9IGl2O1xyXG4gICAgICAgIGpzb24ucmVtZW1iZXIgPSAzNjU7IC8vIDM2NeWkqVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdlbmNyeXB0ZWREYXRhPScgKyBlbmNyeXB0ZWREYXRhKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnZW5jcnlwdGVkSVY9JyArIGl2KTtcclxuICAgICAgICBjb25zb2xlLmxvZygnY29kZT0nICsgY29kZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcclxuICAgICAgICAgICAgdGhpcy5jb25maWcucGFzc3BvcnRVcmwgKyAnbG9naW5YQ1guZG8nLFxyXG4gICAgICAgICAgICBqc29uXHJcbiAgICAgICAgKTtcclxuICAgIH0sXHJcbiAgICAvLyAg5Y+q5pyJ5YiG5Lqr5Yiw576k5omN5pyJIHNoYXJlVGlja2V077yMIOWIhuS6q+WIsOS4quS6uuaYr+ayoeacieeahFxyXG4gICAgX2dldFJlZmVyZXJJbmZvKG9wdGlvbnMpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnX2dldFJlZmVyZXJJbmZvOicsIG9wdGlvbnMpO1xyXG4gICAgICAgIHZhciByZWZlcmVySWQgPSBvcHRpb25zLnF1ZXJ5LnJlZmVyZXJJZDtcclxuICAgICAgICBpZiAocmVmZXJlcklkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB3eC5sb2dpbih7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ3eExvZ2luOlwiLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZmVyZXJJZDogcmVmZXJlcklkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZmVyZXJDb2RlOiByZXMuY29kZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWNlbmU6IG9wdGlvbnMuc2NlbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogb3B0aW9ucy5wYXRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XHJcbiAgICB9LFxyXG4gICAgb25NZXNzYWdlKGRhdGEpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygncmVjZWl2ZSBhcHAgbWVzc2FnZScsIGRhdGEpO1xyXG4gICAgICAgIGlmICh0aGlzLm1lc3NhZ2VDYWxsYmFjayAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZUNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBsaXN0ZW5NZXNzYWdlKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5tZXNzYWdlQ2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgIH0sXHJcbiAgICBiaW5kTW9iaWxlUHJvbWlzZShpdiwgZW5jcnlwdGVkRGF0YSwgcGFzc3BvcnRTZXNzaW9uSWQpIHtcclxuICAgIC8vIOaJi+acuue7keWumlxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY29kZSA9IG51bGw7XHJcbiAgICAgICAgLy8g55m75b2V5Lqk5o2icGFzc3BvcnRJZFxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2luTW9iaWxlKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICB2YXIganNvbiA9IHt9O1xyXG4gICAgICAgICAgICBqc29uLmNsaWVudFR5cGUgPSBzZWxmLmNvbmZpZy5hcHBUeXBlO1xyXG4gICAgICAgICAgICBqc29uLmNsaWVudElkID0gc2VsZi5jb25maWcuYXBwSWQ7XHJcbiAgICAgICAgICAgIGpzb24ua2V5ID0gY29kZTtcclxuICAgICAgICAgICAganNvbi5lbmNyeXB0ZWREYXRhID0gZW5jcnlwdGVkRGF0YTtcclxuICAgICAgICAgICAganNvbi5lbmNyeXB0ZWRJViA9IGl2O1xyXG4gICAgICAgICAgICBqc29uLmxvZ2luVHlwZSA9ICdtb2JpbGUnO1xyXG4gICAgICAgICAgICBqc29uLmxpbmsgPSB0cnVlO1xyXG4gICAgICAgICAgICBqc29uLmxpbmtGb3JjZSA9IHRydWU7XHJcbiAgICAgICAgICAgIGpzb24ucmVtZW1iZXIgPSAzNjU7XHJcbiAgICAgICAgICAgIC8vIOe7keWumuWIsOW9k+WJjeeUqOaIt1xyXG4gICAgICAgICAgICBqc29uLnBhc3Nwb3J0ID0gcGFzc3BvcnRTZXNzaW9uSWQ7XHJcbiAgICAgICAgICAgIC8qKiAgKi9cclxuICAgICAgICAgICAgc2VsZi5mZXRjaERhdGEoXHJcbiAgICAgICAgICAgICAgICBzZWxmLmNvbmZpZy5wYXNzcG9ydFVybCArICdsb2dpbk1vYmlsZS5kbycsXHJcbiAgICAgICAgICAgICAgICBqc29uLFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGpzb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoanNvbi5jb2RlID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2xvZ2luUGFzc3BvcnQ9JyArIEpTT04uc3RyaW5naWZ5KGpzb24pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3eC5zZXRTdG9yYWdlU3luYyhcInBhc3Nwb3J0XCIsIGpzb24ubWVzc2FnZXMuZGF0YS5zZXNzaW9uLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShqc29uLm1lc3NhZ2VzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChqc29uLm1lc3NhZ2VzLmVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHNlbGYuX2dldFd4Q29kZShyZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2RlID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dpbk1vYmlsZShyZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChwYXNzcG9ydERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHBhc3Nwb3J0RGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChyZWFzb24pIHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVhc29uKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHVwbG9hZEZpbGUodXBsb2FkSXRlbSwgbGlzdGVuZXIpIHtcclxuICAgICAgICByZXR1cm4gY28odGhpcy5fd3hVcGxvYWRGaWxlKHVwbG9hZEl0ZW0sIGxpc3RlbmVyKSk7XHJcbiAgICB9LFxyXG4gICAgLy8g5LiK5Lyg5Zu+54mHXHJcbiAgICAqIF93eFVwbG9hZEZpbGUodXBsb2FkSXRlbSwgbGlzdGVuZXIpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3N0YXJ0VXBsb2FkOicsIHVwbG9hZEl0ZW0uaW5kZXgpO1xyXG4gICAgICAgIHZhciBkYXRhID0geWllbGQgc2VsZi5fbmV3VXBsb2FkKCk7XHJcbiAgICAgICAgdXBsb2FkSXRlbS51cGxvYWRUb2tlbiA9IGRhdGEudG9rZW47XHJcbiAgICAgICAgdXBsb2FkSXRlbS51cGxvYWRVcmwgPSBkYXRhLnVwbG9hZFVybDtcclxuICAgICAgICB5aWVsZCBzZWxmLl91cGxvYWRGaWxlKHVwbG9hZEl0ZW0sIGxpc3RlbmVyKTtcclxuICAgICAgICB5aWVsZCBzZWxmLl91cGxvYWRRdWVyeUNoZWNrKHVwbG9hZEl0ZW0sIGxpc3RlbmVyKTtcclxuICAgICAgICB2YXIgcXVlcnkgPSB5aWVsZCBzZWxmLl91cGxvYWRRdWVyeVJlc3VsdCh1cGxvYWRJdGVtKTtcclxuICAgICAgICBpZiAocXVlcnkuZmlsZXMgJiYgcXVlcnkuZmlsZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgaW1hZ2VVcmwgPSBxdWVyeS5maWxlc1swXS5pbWFnZXNbMF0udXJsO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygn5LiK5Lyg57uT5p6cOicgKyBpbWFnZVVybCk7XHJcbiAgICAgICAgICAgIHVwbG9hZEl0ZW0uaW1hZ2VVcmwgPSBpbWFnZVVybDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVwbG9hZEl0ZW07XHJcbiAgICB9LFxyXG4gICAgX25ld1VwbG9hZCgpIHtcclxuICAgIC8vIOiOt+W+l+S4gOS4quS4iuS8oOWcsOWdgFxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgdXBsb2FkVXJsID0gc2VsZi5jb25maWcudXBsb2FkVXJsICsgJ3VwbG9hZC5kbyc7XHJcbiAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiB1cGxvYWRVcmwsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ3VwbG9hZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ltYWdlJyxcclxuICAgICAgICAgICAgICAgICAgICBhcHBJZDogc2VsZi5jb25maWcudXBsb2FkQXBwSWRcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBqc29uID0gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGpzb24uY29kZSA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoanNvbi5tZXNzYWdlcy5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IGpzb24ubWVzc2FnZXMuZXJyb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLm5hbWUgPSBlcnJvci5jb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZhaWwocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAndXBsb2FkX2Vycm9yJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogcmVzLmVyck1zZ1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIC8vIOS4iuS8oOaWh+S7tueahOWFt+S9k1xyXG4gICAgX3VwbG9hZEZpbGUodXBsb2FkSXRlbSwgbGlzdGVuZXIpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cGxvYWRUYXNrID0gd3gudXBsb2FkRmlsZSh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHVwbG9hZEl0ZW0udXBsb2FkVXJsLFxyXG4gICAgICAgICAgICAgICAgZmlsZVBhdGg6IHVwbG9hZEl0ZW0uZmlsZSxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdmaWxlJyxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXNDb2RlICE9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogJ3VwbG9hZF9lcnJvcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSFRUUOmUmeivrzonICsgcmVzLnN0YXR1c0NvZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHVwbG9hZEl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmYWlsKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogJ3VwbG9hZF9lcnJvcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHJlcy5lcnJNc2dcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8g55uR5o6n5LiK5Lyg6L+b5bqmXHJcbiAgICAgICAgICAgIHVwbG9hZFRhc2sub25Qcm9ncmVzc1VwZGF0ZShyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnByb2dyZXNzID0gcmVzLnByb2dyZXNzO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh1cGxvYWRJdGVtLnByb2dyZXNzID4gOTkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkSXRlbS5wcm9ncmVzcyA9IDk5O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcih1cGxvYWRJdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfkuIrkvKDov5vluqYnLCByZXMucHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCflt7Lnu4/kuIrkvKDnmoTmlbDmja7plb/luqYnLCByZXMudG90YWxCeXRlc1NlbnQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgICAn6aKE5pyf6ZyA6KaB5LiK5Lyg55qE5pWw5o2u5oC76ZW/5bqmJyxcclxuICAgICAgICAgICAgcmVzLnRvdGFsQnl0ZXNFeHBlY3RlZFRvU2VuZFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgKi9cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgLy8g56Gu6K6k5pyN5Yqh5Zmo5bey57uP5pS25Yiw5omA5pyJ5pWw5o2uXHJcbiAgICBfdXBsb2FkUXVlcnlDaGVjayh1cGxvYWRJdGVtLCBsaXN0ZW5lcikge1xyXG4gICAgICAgIHZhciB1cGxvYWRVcmwgPSB1cGxvYWRJdGVtLnVwbG9hZFVybDtcclxuICAgICAgICBmdW5jdGlvbiBjaGVja0ZpbmlzaGVkKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgIHVybDogdXBsb2FkVXJsLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZ2V0JyxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHJlcy5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjaGVjayB1cGxvYWQgZmluaXNoZWQ6JywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSAnZmluaXNoJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkSXRlbS5wcm9ncmVzcyA9IDEwMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyKHVwbG9hZEl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja0ZpbmlzaGVkKHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAndXBsb2FkX2Vycm9yJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogcmVzLmVyck1zZ1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3F1ZXJ5IHNlcnZlciBlcnJvcix3aWxsIHJldHJ5OicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tGaW5pc2hlZChyZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNoZWNrRmluaXNoZWQocmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBfdXBsb2FkUXVlcnlSZXN1bHQodXBsb2FkSXRlbSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgdXBsb2FkVXJsID0gc2VsZi5jb25maWcudXBsb2FkVXJsICsgJ3VwbG9hZC5kbyc7XHJcbiAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiB1cGxvYWRVcmwsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ3F1ZXJ5JyxcclxuICAgICAgICAgICAgICAgICAgICB0b2tlbjogdXBsb2FkSXRlbS51cGxvYWRUb2tlblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIganNvbiA9IHJlcy5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChqc29uLmNvZGUgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGpzb24ubWVzc2FnZXMuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBqc29uLm1lc3NhZ2VzLmVycm9yO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAndXBsb2FkX2Vycm9yJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogcmVzLmVyck1zZ1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQXBwO1xyXG4iXX0=