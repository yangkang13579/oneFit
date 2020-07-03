'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _page = require('./../mixins/page.js');

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
            navigationBarTitleText: '个人中心',
            navigationBarBackgroundColor: '#65ABFF'
        }, _this.components = {
            // tabbar: Tabbar
        }, _this.data = {
            loadUser: true, // 需要登录信息
            userAvatar: 'https://www.jteam.cn/images/9321/0426/1898/8a75ea37e87804f8a6f57da0f3a6b0ed_2_80x80.jpg'
        }, _this.methods = {
            userNew: function userNew() {
                wx.navigateTo({
                    url: '/pages/user_scheme'
                });
            },
            call: function call() {
                wx.makePhoneCall({
                    phoneNumber: '4008210178' // 仅为示例，并非真实的电话号码
                });
            },
            toMyCommunity: function toMyCommunity() {
                wx.navigateTo({
                    url: '/pages/order'
                });
            },
            set: function set() {
                wx.navigateTo({
                    url: '/pages/addressBook'
                });
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(User, [{
        key: 'whenAppReadyShow',
        value: function whenAppReadyShow() {
            // 每次都刷新
        }
    }]);

    return User;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(User , 'pages/user'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVzZXIuanMiXSwibmFtZXMiOlsiVXNlciIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImRhdGEiLCJsb2FkVXNlciIsInVzZXJBdmF0YXIiLCJtZXRob2RzIiwidXNlck5ldyIsInd4IiwibmF2aWdhdGVUbyIsInVybCIsImNhbGwiLCJtYWtlUGhvbmVDYWxsIiwicGhvbmVOdW1iZXIiLCJ0b015Q29tbXVuaXR5Iiwic2V0Iiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0U7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBQ3FCQSxJOzs7Ozs7Ozs7Ozs7OztzTEFDbkJDLE0sR0FBUyxDQUFDQyxjQUFELEMsUUFDVEMsTSxHQUFTO0FBQ0xDLG9DQUF3QixNQURuQjtBQUVMQywwQ0FBOEI7QUFGekIsUyxRQUlUQyxVLEdBQWE7QUFDVDtBQURTLFMsUUFHYkMsSSxHQUFPO0FBQ0hDLHNCQUFVLElBRFAsRUFDYTtBQUNoQkMsd0JBQVk7QUFGVCxTLFFBSVBDLE8sR0FBVTtBQUNOQyxtQkFETSxxQkFDSTtBQUNOQyxtQkFBR0MsVUFBSCxDQUFjO0FBQ1ZDLHlCQUFLO0FBREssaUJBQWQ7QUFHSCxhQUxLO0FBTU5DLGdCQU5NLGtCQU1DO0FBQ0hILG1CQUFHSSxhQUFILENBQWlCO0FBQ2JDLGlDQUFhLFlBREEsQ0FDYTtBQURiLGlCQUFqQjtBQUdILGFBVks7QUFXTkMseUJBWE0sMkJBV1U7QUFDWk4sbUJBQUdDLFVBQUgsQ0FBYztBQUNWQyx5QkFBSztBQURLLGlCQUFkO0FBR0gsYUFmSztBQWdCTkssZUFoQk0saUJBZ0JBO0FBQ0ZQLG1CQUFHQyxVQUFILENBQWM7QUFDVkMseUJBQUs7QUFESyxpQkFBZDtBQUdIO0FBcEJLLFM7Ozs7OzJDQXNCUztBQUNmO0FBQ0g7Ozs7RUFyQytCTSxlQUFLQyxJOztrQkFBbEJyQixJIiwiZmlsZSI6InVzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuICBpbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuICBpbXBvcnQgUGFnZU1peGluIGZyb20gJy4uL21peGlucy9wYWdlJztcclxuICBleHBvcnQgZGVmYXVsdCBjbGFzcyBVc2VyIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAgIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gICAgY29uZmlnID0ge1xyXG4gICAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfkuKrkurrkuK3lv4MnLFxyXG4gICAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjNjVBQkZGJ1xyXG4gICAgfTtcclxuICAgIGNvbXBvbmVudHMgPSB7XHJcbiAgICAgICAgLy8gdGFiYmFyOiBUYWJiYXJcclxuICAgIH07XHJcbiAgICBkYXRhID0ge1xyXG4gICAgICAgIGxvYWRVc2VyOiB0cnVlLCAvLyDpnIDopoHnmbvlvZXkv6Hmga9cclxuICAgICAgICB1c2VyQXZhdGFyOiAnaHR0cHM6Ly93d3cuanRlYW0uY24vaW1hZ2VzLzkzMjEvMDQyNi8xODk4LzhhNzVlYTM3ZTg3ODA0ZjhhNmY1N2RhMGYzYTZiMGVkXzJfODB4ODAuanBnJ1xyXG4gICAgfTtcclxuICAgIG1ldGhvZHMgPSB7XHJcbiAgICAgICAgdXNlck5ldygpIHtcclxuICAgICAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvdXNlcl9zY2hlbWUnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2FsbCgpIHtcclxuICAgICAgICAgICAgd3gubWFrZVBob25lQ2FsbCh7XHJcbiAgICAgICAgICAgICAgICBwaG9uZU51bWJlcjogJzQwMDgyMTAxNzgnIC8vIOS7heS4uuekuuS+i++8jOW5tumdnuecn+WunueahOeUteivneWPt+eggVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRvTXlDb21tdW5pdHkoKSB7XHJcbiAgICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL29yZGVyJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldCgpIHtcclxuICAgICAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvYWRkcmVzc0Jvb2snXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB3aGVuQXBwUmVhZHlTaG93KCkge1xyXG4gICAgICAgIC8vIOavj+asoemDveWIt+aWsFxyXG4gICAgfVxyXG4gIH1cclxuIl19