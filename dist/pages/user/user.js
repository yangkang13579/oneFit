'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _page = require('./../../mixins/page.js');

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* global wx */


var User = function (_wepy$page) {
    _inherits(User, _wepy$page);

    function User() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, User);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = User.__proto__ || Object.getPrototypeOf(User)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
            navigationBarTitleText: '我的',
            navigationBarBackgroundColor: '#fff'
        }, _this.components = {}, _this.data = {
            userInfo: null,
            passportSessionId: null
        }, _this.methods = {
            getPhoneNumber: function getPhoneNumber(e) {
                console.log(e);
                if (e.detail.iv && e.detail.encryptedData) {
                    var self = this;
                    console.log('self.passport', self.passport);
                    self.app.bindMobilePromise(e.detail.iv, e.detail.encryptedData, self.passport).then(function (data) {
                        console.log("data2", data);
                        wx.showToast({
                            title: '绑定成功',
                            icon: 'success',
                            duration: 2000
                        });
                        setTimeout(function () {
                            wx.navigateBack();
                        }, 500);
                    }).catch(function (reason) {
                        console.log('绑定失败:', reason);
                        wx.showToast({
                            title: '绑定失败,请重试！',
                            icon: 'success',
                            duration: 2000
                        });
                    });
                }
            },
            cancel: function cancel() {
                wx.navigateBack();
            },
            shangchuan: function shangchuan() {
                wx.navigateTo({
                    url: '/pages/upload'
                });
            },
            zhonghua: function zhonghua() {
                wx.navigateTo({
                    url: '/pages/zhonghua'
                });
            },
            navFun: function navFun() {
                wx.switchTab({
                    url: '/pages/home'
                });
            },
            bindPickerChange: function bindPickerChange(e) {
                var role = e.detail.value === '0' ? 1 : e.detail.value === '1' ? 3 : 4;
                console.log(role);
                wx.navigateTo({
                    url: '/pages/order?role=' + role
                });
            },

            // 敬请期待
            alert: function alert() {
                _wepy2.default.showModal({
                    title: '提示',
                    content: '敬请期待',
                    showCancel: false,
                    success: function success(res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                        } else if (res.cancel) {
                            console.log('用户点击取消');
                        }
                    }
                });
            },
            lianxi: function lianxi() {
                wx.navigateTo({
                    url: '/pages/webview1'
                });
            },

            // 会议管理
            mettingManage: function mettingManage() {
                wx.navigateTo({
                    url: '/pages/addressBook'
                });
            },

            // 我的会议
            mySign: function mySign() {
                wx.navigateTo({
                    url: '/pages/car'
                });
            },

            // 我的样品申领
            mySample: function mySample() {
                wx.navigateTo({
                    url: '/pages/meMaple'
                });
            },


            // 创建会议
            addMeeting: function addMeeting() {
                wx.navigateTo({
                    url: '/pages/editAddress'
                });
            },
            navTo: function navTo() {
                wx.navigateTo({
                    url: '/pages/order?role=' + this.userInfo.role
                });
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(User, [{
        key: 'onLoad',
        value: function onLoad() {}
    }, {
        key: 'whenAppReadyShow',
        value: function whenAppReadyShow() {
            var _this2 = this;

            console.log('this.passport', this.passport);
            this.fetchDataPromise('user/userInfo.json', {}).then(function (data) {
                console.log("data", data);
                _this2.isUser = data.userType;
                _this2.userInfo = data;

                _this2.$apply();
                wx.setStorage({
                    key: 'userInfo',
                    data: JSON.stringify(_this2.userInfo)
                });
            }).catch(function (error) {});
        }
    }, {
        key: 'onShareAppMessage',
        value: function onShareAppMessage(res) {}
    }, {
        key: 'regionchange',
        value: function regionchange(e) {
            // console.log(e.type);
        }
    }, {
        key: 'markertap',
        value: function markertap(e) {
            // console.log(e.markerId);
        }
    }, {
        key: 'controltap',
        value: function controltap(e) {
            // console.log(e.controlId);
        }
    }]);

    return User;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(User , 'pages/user/user'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVzZXIuanMiXSwibmFtZXMiOlsiVXNlciIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImRhdGEiLCJ1c2VySW5mbyIsInBhc3Nwb3J0U2Vzc2lvbklkIiwibWV0aG9kcyIsImdldFBob25lTnVtYmVyIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJkZXRhaWwiLCJpdiIsImVuY3J5cHRlZERhdGEiLCJzZWxmIiwicGFzc3BvcnQiLCJhcHAiLCJiaW5kTW9iaWxlUHJvbWlzZSIsInRoZW4iLCJ3eCIsInNob3dUb2FzdCIsInRpdGxlIiwiaWNvbiIsImR1cmF0aW9uIiwic2V0VGltZW91dCIsIm5hdmlnYXRlQmFjayIsImNhdGNoIiwicmVhc29uIiwiY2FuY2VsIiwic2hhbmdjaHVhbiIsIm5hdmlnYXRlVG8iLCJ1cmwiLCJ6aG9uZ2h1YSIsIm5hdkZ1biIsInN3aXRjaFRhYiIsImJpbmRQaWNrZXJDaGFuZ2UiLCJyb2xlIiwidmFsdWUiLCJhbGVydCIsIndlcHkiLCJzaG93TW9kYWwiLCJjb250ZW50Iiwic2hvd0NhbmNlbCIsInN1Y2Nlc3MiLCJyZXMiLCJjb25maXJtIiwibGlhbnhpIiwibWV0dGluZ01hbmFnZSIsIm15U2lnbiIsIm15U2FtcGxlIiwiYWRkTWVldGluZyIsIm5hdlRvIiwiZmV0Y2hEYXRhUHJvbWlzZSIsImlzVXNlciIsInVzZXJUeXBlIiwiJGFwcGx5Iiwic2V0U3RvcmFnZSIsImtleSIsIkpTT04iLCJzdHJpbmdpZnkiLCJlcnJvciIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7QUFGQTs7O0lBR3FCQSxJOzs7Ozs7Ozs7Ozs7OztzTEFDbkJDLE0sR0FBUyxDQUFDQyxjQUFELEMsUUFDVEMsTSxHQUFTO0FBQ0xDLG9DQUF3QixJQURuQjtBQUVMQywwQ0FBOEI7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LEVBQUc7QUFDVjtBQUNIOzs7O0VBaEorQitCLGVBQUtzQixJOztrQkFBbEJqRSxJIiwiZmlsZSI6InVzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyogZ2xvYmFsIHd4ICovXHJcbmltcG9ydCB3ZXB5IGZyb20gJ3dlcHknO1xyXG5pbXBvcnQgUGFnZU1peGluIGZyb20gJy4uLy4uL21peGlucy9wYWdlJztcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXNlciBleHRlbmRzIHdlcHkucGFnZSB7XHJcbiAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgY29uZmlnID0ge1xyXG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5oiR55qEJyxcclxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNmZmYnXHJcbiAgfTtcclxuICBjb21wb25lbnRzID0ge307XHJcbiAgZGF0YSA9IHtcclxuICAgICAgdXNlckluZm86IG51bGwsXHJcbiAgICAgIHBhc3Nwb3J0U2Vzc2lvbklkOm51bGxcclxuICB9O1xyXG4gIG1ldGhvZHMgPSB7XHJcbiAgICAgZ2V0UGhvbmVOdW1iZXIoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgIGlmIChlLmRldGFpbC5pdiAmJiBlLmRldGFpbC5lbmNyeXB0ZWREYXRhKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWxmLnBhc3Nwb3J0JyxzZWxmLnBhc3Nwb3J0KVxyXG4gICAgICAgICAgICAgIHNlbGYuYXBwXHJcbiAgICAgICAgICAgICAgICAgIC5iaW5kTW9iaWxlUHJvbWlzZShlLmRldGFpbC5pdiwgZS5kZXRhaWwuZW5jcnlwdGVkRGF0YSxzZWxmLnBhc3Nwb3J0KVxyXG4gICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkYXRhMlwiLGRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn57uR5a6a5oiQ5YqfJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDIwMDBcclxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5uYXZpZ2F0ZUJhY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgIH0sIDUwMCk7XHJcbiAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihyZWFzb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfnu5HlrprlpLHotKU6JywgcmVhc29uKTtcclxuICAgICAgICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfnu5HlrprlpLHotKUs6K+36YeN6K+V77yBJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDIwMDBcclxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgY2FuY2VsKCkge1xyXG4gICAgICAgICAgd3gubmF2aWdhdGVCYWNrKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHNoYW5nY2h1YW4oKSB7XHJcbiAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvdXBsb2FkJ1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHpob25naHVhKCkge1xyXG4gICAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL3pob25naHVhJ1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIG5hdkZ1bigpIHtcclxuICAgICAgICAgIHd4LnN3aXRjaFRhYih7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL2hvbWUnXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgYmluZFBpY2tlckNoYW5nZShlKSB7XHJcbiAgICAgICAgICB2YXIgcm9sZSA9IGUuZGV0YWlsLnZhbHVlID09PSAnMCcgPyAxIDogZS5kZXRhaWwudmFsdWUgPT09ICcxJyA/IDMgOiA0O1xyXG4gICAgICAgICAgY29uc29sZS5sb2cocm9sZSk7XHJcbiAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvb3JkZXI/cm9sZT0nICsgcm9sZVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIOaVrOivt+acn+W+hVxyXG4gICAgICBhbGVydCgpIHtcclxuICAgICAgICAgIHdlcHkuc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgICAgY29udGVudDogJ+aVrOivt+acn+W+hScsXHJcbiAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKHJlcy5jb25maXJtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn55So5oi354K55Ye756Gu5a6aJyk7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzLmNhbmNlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+eUqOaIt+eCueWHu+WPlua2iCcpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGxpYW54aSgpIHtcclxuICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgICAgIHVybDogJy9wYWdlcy93ZWJ2aWV3MSdcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICAvLyDkvJrorq7nrqHnkIZcclxuICAgICAgbWV0dGluZ01hbmFnZSgpIHtcclxuICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgICAgIHVybDogJy9wYWdlcy9hZGRyZXNzQm9vaydcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICAvLyDmiJHnmoTkvJrorq5cclxuICAgICAgbXlTaWduKCkge1xyXG4gICAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL2NhcidcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICAvLyDmiJHnmoTmoLflk4HnlLPpooZcclxuICAgICAgbXlTYW1wbGUoKSB7XHJcbiAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvbWVNYXBsZSdcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgLy8g5Yib5bu65Lya6K6uXHJcbiAgICAgIGFkZE1lZXRpbmcoKSB7XHJcbiAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvZWRpdEFkZHJlc3MnXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgbmF2VG8oKSB7XHJcbiAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvb3JkZXI/cm9sZT0nICsgdGhpcy51c2VySW5mby5yb2xlXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gIH07XHJcbiAgb25Mb2FkKCkge1xyXG5cclxuICB9XHJcbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgIGNvbnNvbGUubG9nKCd0aGlzLnBhc3Nwb3J0Jyx0aGlzLnBhc3Nwb3J0KVxyXG4gICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3VzZXIvdXNlckluZm8uanNvbicsIHt9KVxyXG4gICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGF0YVwiLGRhdGEpXHJcbiAgICAgICAgICAgICAgdGhpcy5pc1VzZXIgPSBkYXRhLnVzZXJUeXBlO1xyXG4gICAgICAgICAgICAgIHRoaXMudXNlckluZm8gPSBkYXRhO1xyXG4gICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlKHtcclxuICAgICAgICAgICAgICAgICAga2V5OiAndXNlckluZm8nLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh0aGlzLnVzZXJJbmZvKVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge30pO1xyXG4gIH1cclxuICBvblNoYXJlQXBwTWVzc2FnZShyZXMpIHt9XHJcbiAgcmVnaW9uY2hhbmdlKGUpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coZS50eXBlKTtcclxuICB9XHJcbiAgbWFya2VydGFwKGUpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coZS5tYXJrZXJJZCk7XHJcbiAgfVxyXG4gIGNvbnRyb2x0YXAoZSkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhlLmNvbnRyb2xJZCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==