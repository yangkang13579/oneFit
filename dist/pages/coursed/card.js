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


var Member = function (_wepy$page) {
    _inherits(Member, _wepy$page);

    function Member() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Member);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Member.__proto__ || Object.getPrototypeOf(Member)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
            navigationBarTitleText: '会员卡列表',
            navigationStyle: 'default',
            navigationBarBackgroundColor: '#e84644'
        }, _this.components = {}, _this.data = {}, _this.methods = {}, _temp), _possibleConstructorReturn(_this, _ret);
    }
    // mixins = [PageMixin];


    _createClass(Member, [{
        key: 'onReachBottom',
        value: function onReachBottom() {}
    }, {
        key: 'whenAppReadyShow',
        value: function whenAppReadyShow() {
            var _this2 = this;

            this.fetchDataPromise('user/userInfo.json', {}).then(function (data) {
                var userInfo = data;
                _this2.$apply();
                wx.setStorage({
                    key: 'userInfo',
                    data: JSON.stringify(userInfo)
                });
            }).catch(function (error) {});
        }
    }, {
        key: 'onShow',
        value: function onShow() {
            // wx.hideTabBar()
        }
    }, {
        key: 'onShareAppMessage',
        value: function onShareAppMessage(res) {}
    }, {
        key: 'regionchange',
        value: function regionchange(e) {
            console.log(e.type);
        }
    }, {
        key: 'markertap',
        value: function markertap(e) {
            console.log(e.markerId);
        }
    }, {
        key: 'controltap',
        value: function controltap(e) {
            console.log(e.controlId);
        }
    }]);

    return Member;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Member , 'pages/coursed/card'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcmQuanMiXSwibmFtZXMiOlsiTWVtYmVyIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25TdHlsZSIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJjb21wb25lbnRzIiwiZGF0YSIsIm1ldGhvZHMiLCJmZXRjaERhdGFQcm9taXNlIiwidGhlbiIsInVzZXJJbmZvIiwiJGFwcGx5Iiwid3giLCJzZXRTdG9yYWdlIiwia2V5IiwiSlNPTiIsInN0cmluZ2lmeSIsImNhdGNoIiwiZXJyb3IiLCJyZXMiLCJlIiwiY29uc29sZSIsImxvZyIsInR5cGUiLCJtYXJrZXJJZCIsImNvbnRyb2xJZCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBRkE7OztJQUdxQkEsTTs7Ozs7Ozs7Ozs7Ozs7MExBRW5CQyxNLEdBQVM7QUFDTEMsb0NBQXdCLE9BRG5CO0FBRUxDLDZCQUFpQixTQUZaO0FBR0xDLDBDQUE4QjtBQUh6QixTLFFBS1RDLFUsR0FBYSxFLFFBQ2JDLEksR0FBTyxFLFFBRVBDLE8sR0FBVSxFOztBQVRWOzs7Ozt3Q0FhZ0IsQ0FBRTs7OzJDQUVDO0FBQUE7O0FBQ2YsaUJBQUtDLGdCQUFMLENBQXNCLG9CQUF0QixFQUE0QyxFQUE1QyxFQUNLQyxJQURMLENBQ1UsZ0JBQVE7QUFDVixvQkFBTUMsV0FBV0osSUFBakI7QUFDQSx1QkFBS0ssTUFBTDtBQUNBQyxtQkFBR0MsVUFBSCxDQUFjO0FBQ1ZDLHlCQUFLLFVBREs7QUFFVlIsMEJBQU1TLEtBQUtDLFNBQUwsQ0FBZU4sUUFBZjtBQUZJLGlCQUFkO0FBSUgsYUFSTCxFQVNLTyxLQVRMLENBU1csVUFBU0MsS0FBVCxFQUFnQixDQUFFLENBVDdCO0FBVUg7OztpQ0FDUTtBQUNMO0FBQ0g7OzswQ0FDaUJDLEcsRUFBSyxDQUFFOzs7cUNBQ1pDLEMsRUFBRztBQUNaQyxvQkFBUUMsR0FBUixDQUFZRixFQUFFRyxJQUFkO0FBQ0g7OztrQ0FDU0gsQyxFQUFHO0FBQ1RDLG9CQUFRQyxHQUFSLENBQVlGLEVBQUVJLFFBQWQ7QUFDSDs7O21DQUNVSixDLEVBQUc7QUFDVkMsb0JBQVFDLEdBQVIsQ0FBWUYsRUFBRUssU0FBZDtBQUNIOzs7O0VBeENpQ0MsZUFBS0MsSTs7a0JBQXBCM0IsTSIsImZpbGUiOiJjYXJkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8qIGdsb2JhbCB3eCAqL1xyXG5pbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuaW1wb3J0IFBhZ2VNaXhpbiBmcm9tICcuLi8uLi9taXhpbnMvcGFnZSc7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lbWJlciBleHRlbmRzIHdlcHkucGFnZSB7XHJcbiAgLy8gbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgY29uZmlnID0ge1xyXG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5Lya5ZGY5Y2h5YiX6KGoJyxcclxuICAgICAgbmF2aWdhdGlvblN0eWxlOiAnZGVmYXVsdCcsXHJcbiAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjZTg0NjQ0J1xyXG4gIH07XHJcbiAgY29tcG9uZW50cyA9IHt9O1xyXG4gIGRhdGEgPSB7XHJcbiAgfTtcclxuICBtZXRob2RzID0ge1xyXG5cclxuICB9O1xyXG5cclxuICBvblJlYWNoQm90dG9tKCkge31cclxuXHJcbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCd1c2VyL3VzZXJJbmZvLmpzb24nLCB7fSlcclxuICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHVzZXJJbmZvID0gZGF0YTtcclxuICAgICAgICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICBrZXk6ICd1c2VySW5mbycsXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHVzZXJJbmZvKVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge30pO1xyXG4gIH1cclxuICBvblNob3coKSB7XHJcbiAgICAgIC8vIHd4LmhpZGVUYWJCYXIoKVxyXG4gIH1cclxuICBvblNoYXJlQXBwTWVzc2FnZShyZXMpIHt9XHJcbiAgcmVnaW9uY2hhbmdlKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZS50eXBlKTtcclxuICB9XHJcbiAgbWFya2VydGFwKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZS5tYXJrZXJJZCk7XHJcbiAgfVxyXG4gIGNvbnRyb2x0YXAoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlLmNvbnRyb2xJZCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==