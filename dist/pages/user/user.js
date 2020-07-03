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

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = User.__proto__ || Object.getPrototypeOf(User)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
            navigationBarTitleText: '我的',
            navigationBarBackgroundColor: '#fff'
        }, _this.components = {}, _this.data = {
            userInfo: null
        }, _this.methods = {
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
    // mixins = [PageMixin];


    _createClass(User, [{
        key: 'onLoad',
        value: function onLoad() {}
    }, {
        key: 'whenAppReadyShow',
        value: function whenAppReadyShow() {
            var _this2 = this;

            this.fetchDataPromise('user/userInfo.json', {}).then(function (data) {
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVzZXIuanMiXSwibmFtZXMiOlsiVXNlciIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImRhdGEiLCJ1c2VySW5mbyIsIm1ldGhvZHMiLCJzaGFuZ2NodWFuIiwid3giLCJuYXZpZ2F0ZVRvIiwidXJsIiwiemhvbmdodWEiLCJuYXZGdW4iLCJzd2l0Y2hUYWIiLCJiaW5kUGlja2VyQ2hhbmdlIiwiZSIsInJvbGUiLCJkZXRhaWwiLCJ2YWx1ZSIsImNvbnNvbGUiLCJsb2ciLCJhbGVydCIsIndlcHkiLCJzaG93TW9kYWwiLCJ0aXRsZSIsImNvbnRlbnQiLCJzaG93Q2FuY2VsIiwic3VjY2VzcyIsInJlcyIsImNvbmZpcm0iLCJjYW5jZWwiLCJsaWFueGkiLCJtZXR0aW5nTWFuYWdlIiwibXlTaWduIiwibXlTYW1wbGUiLCJhZGRNZWV0aW5nIiwibmF2VG8iLCJmZXRjaERhdGFQcm9taXNlIiwidGhlbiIsImlzVXNlciIsInVzZXJUeXBlIiwiJGFwcGx5Iiwic2V0U3RvcmFnZSIsImtleSIsIkpTT04iLCJzdHJpbmdpZnkiLCJjYXRjaCIsImVycm9yIiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7OztBQUZBOzs7SUFHcUJBLEk7Ozs7Ozs7Ozs7Ozs7O3NMQUVuQkMsTSxHQUFTO0FBQ0xDLG9DQUF3QixJQURuQjtBQUVMQywwQ0FBOEI7QUFGekIsUyxRQUlUQyxVLEdBQWEsRSxRQUNiQyxJLEdBQU87QUFDSEMsc0JBQVU7QUFEUCxTLFFBR1BDLE8sR0FBVTtBQUNOQyxzQkFETSx3QkFDTztBQUNUQyxtQkFBR0MsVUFBSCxDQUFjO0FBQ1ZDLHlCQUFLO0FBREssaUJBQWQ7QUFHSCxhQUxLO0FBTU5DLG9CQU5NLHNCQU1LO0FBQ1BILG1CQUFHQyxVQUFILENBQWM7QUFDVkMseUJBQUs7QUFESyxpQkFBZDtBQUdILGFBVks7QUFXTkUsa0JBWE0sb0JBV0c7QUFDTEosbUJBQUdLLFNBQUgsQ0FBYTtBQUNUSCx5QkFBSztBQURJLGlCQUFiO0FBR0gsYUFmSztBQWdCTkksNEJBaEJNLDRCQWdCV0MsQ0FoQlgsRUFnQmM7QUFDaEIsb0JBQUlDLE9BQU9ELEVBQUVFLE1BQUYsQ0FBU0MsS0FBVCxLQUFtQixHQUFuQixHQUF5QixDQUF6QixHQUE2QkgsRUFBRUUsTUFBRixDQUFTQyxLQUFULEtBQW1CLEdBQW5CLEdBQXlCLENBQXpCLEdBQTZCLENBQXJFO0FBQ0FDLHdCQUFRQyxHQUFSLENBQVlKLElBQVo7QUFDQVIsbUJBQUdDLFVBQUgsQ0FBYztBQUNWQyx5QkFBSyx1QkFBdUJNO0FBRGxCLGlCQUFkO0FBR0gsYUF0Qks7O0FBdUJOO0FBQ0FLLGlCQXhCTSxtQkF3QkU7QUFDSkMsK0JBQUtDLFNBQUwsQ0FBZTtBQUNYQywyQkFBTyxJQURJO0FBRVhDLDZCQUFTLE1BRkU7QUFHWEMsZ0NBQVksS0FIRDtBQUlYQywyQkFKVyxtQkFJSEMsR0FKRyxFQUlFO0FBQ1QsNEJBQUlBLElBQUlDLE9BQVIsRUFBaUI7QUFDYlYsb0NBQVFDLEdBQVIsQ0FBWSxRQUFaO0FBQ0gseUJBRkQsTUFFTyxJQUFJUSxJQUFJRSxNQUFSLEVBQWdCO0FBQ25CWCxvQ0FBUUMsR0FBUixDQUFZLFFBQVo7QUFDSDtBQUNKO0FBVlUsaUJBQWY7QUFZSCxhQXJDSztBQXNDTlcsa0JBdENNLG9CQXNDRztBQUNMdkIsbUJBQUdDLFVBQUgsQ0FBYztBQUNWQyx5QkFBSztBQURLLGlCQUFkO0FBR0gsYUExQ0s7O0FBMkNOO0FBQ0FzQix5QkE1Q00sMkJBNENVO0FBQ1p4QixtQkFBR0MsVUFBSCxDQUFjO0FBQ1ZDLHlCQUFLO0FBREssaUJBQWQ7QUFHSCxhQWhESzs7QUFpRE47QUFDQXVCLGtCQWxETSxvQkFrREc7QUFDTHpCLG1CQUFHQyxVQUFILENBQWM7QUFDVkMseUJBQUs7QUFESyxpQkFBZDtBQUdILGFBdERLOztBQXVETjtBQUNBd0Isb0JBeERNLHNCQXdESztBQUNQMUIsbUJBQUdDLFVBQUgsQ0FBYztBQUNWQyx5QkFBSztBQURLLGlCQUFkO0FBR0gsYUE1REs7OztBQThETjtBQUNBeUIsc0JBL0RNLHdCQStETztBQUNUM0IsbUJBQUdDLFVBQUgsQ0FBYztBQUNWQyx5QkFBSztBQURLLGlCQUFkO0FBR0gsYUFuRUs7QUFvRU4wQixpQkFwRU0sbUJBb0VFO0FBQ0o1QixtQkFBR0MsVUFBSCxDQUFjO0FBQ1ZDLHlCQUFLLHVCQUF1QixLQUFLTCxRQUFMLENBQWNXO0FBRGhDLGlCQUFkO0FBR0g7QUF4RUssUzs7QUFUVjs7Ozs7aUNBbUZTLENBQUU7OzsyQ0FDUTtBQUFBOztBQUNmLGlCQUFLcUIsZ0JBQUwsQ0FBc0Isb0JBQXRCLEVBQTRDLEVBQTVDLEVBQ0tDLElBREwsQ0FDVSxnQkFBUTtBQUNWLHVCQUFLQyxNQUFMLEdBQWNuQyxLQUFLb0MsUUFBbkI7QUFDQSx1QkFBS25DLFFBQUwsR0FBZ0JELElBQWhCO0FBQ0EsdUJBQUtxQyxNQUFMO0FBQ0FqQyxtQkFBR2tDLFVBQUgsQ0FBYztBQUNWQyx5QkFBSyxVQURLO0FBRVZ2QywwQkFBTXdDLEtBQUtDLFNBQUwsQ0FBZSxPQUFLeEMsUUFBcEI7QUFGSSxpQkFBZDtBQUlILGFBVEwsRUFVS3lDLEtBVkwsQ0FVVyxVQUFTQyxLQUFULEVBQWdCLENBQUUsQ0FWN0I7QUFXSDs7OzBDQUNpQm5CLEcsRUFBSyxDQUFFOzs7cUNBQ1piLEMsRUFBRztBQUNaO0FBQ0g7OztrQ0FDU0EsQyxFQUFHO0FBQ1Q7QUFDSDs7O21DQUNVQSxDLEVBQUc7QUFDVjtBQUNIOzs7O0VBM0crQk8sZUFBSzBCLEk7O2tCQUFsQmpELEkiLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKiBnbG9iYWwgd3ggKi9cclxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vLi4vbWl4aW5zL3BhZ2UnO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVc2VyIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAvLyBtaXhpbnMgPSBbUGFnZU1peGluXTtcclxuICBjb25maWcgPSB7XHJcbiAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfmiJHnmoQnLFxyXG4gICAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiAnI2ZmZidcclxuICB9O1xyXG4gIGNvbXBvbmVudHMgPSB7fTtcclxuICBkYXRhID0ge1xyXG4gICAgICB1c2VySW5mbzogbnVsbFxyXG4gIH07XHJcbiAgbWV0aG9kcyA9IHtcclxuICAgICAgc2hhbmdjaHVhbigpIHtcclxuICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgICAgIHVybDogJy9wYWdlcy91cGxvYWQnXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgemhvbmdodWEoKSB7XHJcbiAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvemhvbmdodWEnXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgbmF2RnVuKCkge1xyXG4gICAgICAgICAgd3guc3dpdGNoVGFiKHtcclxuICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvaG9tZSdcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICBiaW5kUGlja2VyQ2hhbmdlKGUpIHtcclxuICAgICAgICAgIHZhciByb2xlID0gZS5kZXRhaWwudmFsdWUgPT09ICcwJyA/IDEgOiBlLmRldGFpbC52YWx1ZSA9PT0gJzEnID8gMyA6IDQ7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhyb2xlKTtcclxuICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgICAgIHVybDogJy9wYWdlcy9vcmRlcj9yb2xlPScgKyByb2xlXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgLy8g5pWs6K+35pyf5b6FXHJcbiAgICAgIGFsZXJ0KCkge1xyXG4gICAgICAgICAgd2VweS5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgICBjb250ZW50OiAn5pWs6K+35pyf5b6FJyxcclxuICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZSxcclxuICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfnlKjmiLfngrnlh7vnoa7lrponKTtcclxuICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXMuY2FuY2VsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn55So5oi354K55Ye75Y+W5raIJyk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgbGlhbnhpKCkge1xyXG4gICAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL3dlYnZpZXcxJ1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIOS8muiurueuoeeQhlxyXG4gICAgICBtZXR0aW5nTWFuYWdlKCkge1xyXG4gICAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL2FkZHJlc3NCb29rJ1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIOaIkeeahOS8muiurlxyXG4gICAgICBteVNpZ24oKSB7XHJcbiAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvY2FyJ1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIOaIkeeahOagt+WTgeeUs+mihlxyXG4gICAgICBteVNhbXBsZSgpIHtcclxuICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgICAgIHVybDogJy9wYWdlcy9tZU1hcGxlJ1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICAvLyDliJvlu7rkvJrorq5cclxuICAgICAgYWRkTWVldGluZygpIHtcclxuICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgICAgIHVybDogJy9wYWdlcy9lZGl0QWRkcmVzcydcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICBuYXZUbygpIHtcclxuICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgICAgIHVybDogJy9wYWdlcy9vcmRlcj9yb2xlPScgKyB0aGlzLnVzZXJJbmZvLnJvbGVcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgfTtcclxuICBvbkxvYWQoKSB7fVxyXG4gIHdoZW5BcHBSZWFkeVNob3coKSB7XHJcbiAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgndXNlci91c2VySW5mby5qc29uJywge30pXHJcbiAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLmlzVXNlciA9IGRhdGEudXNlclR5cGU7XHJcbiAgICAgICAgICAgICAgdGhpcy51c2VySW5mbyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlKHtcclxuICAgICAgICAgICAgICAgICAga2V5OiAndXNlckluZm8nLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh0aGlzLnVzZXJJbmZvKVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge30pO1xyXG4gIH1cclxuICBvblNoYXJlQXBwTWVzc2FnZShyZXMpIHt9XHJcbiAgcmVnaW9uY2hhbmdlKGUpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coZS50eXBlKTtcclxuICB9XHJcbiAgbWFya2VydGFwKGUpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coZS5tYXJrZXJJZCk7XHJcbiAgfVxyXG4gIGNvbnRyb2x0YXAoZSkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhlLmNvbnRyb2xJZCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==