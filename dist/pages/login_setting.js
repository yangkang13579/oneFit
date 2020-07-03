'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* global wx */


var LoginSetting = function (_wepy$page) {
    _inherits(LoginSetting, _wepy$page);

    function LoginSetting() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, LoginSetting);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = LoginSetting.__proto__ || Object.getPrototypeOf(LoginSetting)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
            navigationBarTitleText: '授权用户信息'
        }, _this.data = {
            code: 'unknown',
            message: 'unknown'
        }, _this.methods = {
            openSetting: function openSetting() {
                var self = this;
                wx.openSetting({
                    success: function success(res) {
                        console.log(res);
                        if (res.authSetting['scope.userInfo']) {
                            console.log('授权成功!');
                            self.restart();
                        }
                    }
                });
            },
            cancel: function cancel() {
                wx.reLaunch({ url: '/pages/index' });
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(LoginSetting, [{
        key: 'restart',
        value: function restart() {
            console.log('restart');
            var app = this.$parent;
            app.relogin();
            wx.reLaunch({ url: '/pages/index' });
        }
    }, {
        key: 'onLoad',
        value: function onLoad() {}
    }]);

    return LoginSetting;
}(_wepy2.default.page);

exports.default = LoginSetting;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2luX3NldHRpbmcuanMiXSwibmFtZXMiOlsiTG9naW5TZXR0aW5nIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsImRhdGEiLCJjb2RlIiwibWVzc2FnZSIsIm1ldGhvZHMiLCJvcGVuU2V0dGluZyIsInNlbGYiLCJ3eCIsInN1Y2Nlc3MiLCJjb25zb2xlIiwibG9nIiwicmVzIiwiYXV0aFNldHRpbmciLCJyZXN0YXJ0IiwiY2FuY2VsIiwicmVMYXVuY2giLCJ1cmwiLCJhcHAiLCIkcGFyZW50IiwicmVsb2dpbiIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7Ozs7Ozs7OztBQURBOzs7SUFFcUJBLFk7Ozs7Ozs7Ozs7Ozs7O3NNQUNuQkMsTSxHQUFTO0FBQ0xDLG9DQUF3QjtBQURuQixTLFFBR1RDLEksR0FBTztBQUNIQyxrQkFBTSxTQURIO0FBRUhDLHFCQUFTO0FBRk4sUyxRQUlQQyxPLEdBQVU7QUFDTkMsdUJBRE0seUJBQ1E7QUFDVixvQkFBSUMsT0FBTyxJQUFYO0FBQ0FDLG1CQUFHRixXQUFILENBQWU7QUFDWEcsNkJBQVMsc0JBQU87QUFDWkMsZ0NBQVFDLEdBQVIsQ0FBWUMsR0FBWjtBQUNBLDRCQUFJQSxJQUFJQyxXQUFKLENBQWdCLGdCQUFoQixDQUFKLEVBQXVDO0FBQ25DSCxvQ0FBUUMsR0FBUixDQUFZLE9BQVo7QUFDQUosaUNBQUtPLE9BQUw7QUFDSDtBQUNKO0FBUFUsaUJBQWY7QUFTSCxhQVpLO0FBYU5DLGtCQWJNLG9CQWFHO0FBQ0xQLG1CQUFHUSxRQUFILENBQVksRUFBRUMsS0FBSyxjQUFQLEVBQVo7QUFDSDtBQWZLLFM7Ozs7O2tDQWlCQTtBQUNOUCxvQkFBUUMsR0FBUixDQUFZLFNBQVo7QUFDQSxnQkFBSU8sTUFBTSxLQUFLQyxPQUFmO0FBQ0FELGdCQUFJRSxPQUFKO0FBQ0FaLGVBQUdRLFFBQUgsQ0FBWSxFQUFFQyxLQUFLLGNBQVAsRUFBWjtBQUNIOzs7aUNBQ1EsQ0FBRTs7OztFQS9CNkJJLGVBQUtDLEk7O2tCQUExQnZCLFkiLCJmaWxlIjoibG9naW5fc2V0dGluZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKiBnbG9iYWwgd3ggKi9cclxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ2luU2V0dGluZyBleHRlbmRzIHdlcHkucGFnZSB7XHJcbiAgY29uZmlnID0ge1xyXG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5o6I5p2D55So5oi35L+h5oGvJ1xyXG4gIH07XHJcbiAgZGF0YSA9IHtcclxuICAgICAgY29kZTogJ3Vua25vd24nLFxyXG4gICAgICBtZXNzYWdlOiAndW5rbm93bidcclxuICB9O1xyXG4gIG1ldGhvZHMgPSB7XHJcbiAgICAgIG9wZW5TZXR0aW5nKCkge1xyXG4gICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgd3gub3BlblNldHRpbmcoe1xyXG4gICAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChyZXMuYXV0aFNldHRpbmdbJ3Njb3BlLnVzZXJJbmZvJ10pIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfmjojmnYPmiJDlip8hJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzZWxmLnJlc3RhcnQoKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICBjYW5jZWwoKSB7XHJcbiAgICAgICAgICB3eC5yZUxhdW5jaCh7IHVybDogJy9wYWdlcy9pbmRleCcgfSk7XHJcbiAgICAgIH1cclxuICB9O1xyXG4gIHJlc3RhcnQoKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdyZXN0YXJ0Jyk7XHJcbiAgICAgIGxldCBhcHAgPSB0aGlzLiRwYXJlbnQ7XHJcbiAgICAgIGFwcC5yZWxvZ2luKCk7XHJcbiAgICAgIHd4LnJlTGF1bmNoKHsgdXJsOiAnL3BhZ2VzL2luZGV4JyB9KTtcclxuICB9XHJcbiAgb25Mb2FkKCkge31cclxufVxyXG4iXX0=