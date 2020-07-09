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
        }, _this.components = {}, _this.data = {}, _this.methods = {
            goDetail: function goDetail() {
                wx.navigateTo({
                    url: 'card'
                });
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
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

exports.default = Member;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lbWJlci4xLmpzIl0sIm5hbWVzIjpbIk1lbWJlciIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uU3R5bGUiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImRhdGEiLCJtZXRob2RzIiwiZ29EZXRhaWwiLCJ3eCIsIm5hdmlnYXRlVG8iLCJ1cmwiLCJmZXRjaERhdGFQcm9taXNlIiwidGhlbiIsInVzZXJJbmZvIiwiJGFwcGx5Iiwic2V0U3RvcmFnZSIsImtleSIsIkpTT04iLCJzdHJpbmdpZnkiLCJjYXRjaCIsImVycm9yIiwicmVzIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJ0eXBlIiwibWFya2VySWQiLCJjb250cm9sSWQiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7OztBQUZBOzs7SUFHcUJBLE07Ozs7Ozs7Ozs7Ozs7OzBMQUVuQkMsTSxHQUFTO0FBQ0xDLG9DQUF3QixPQURuQjtBQUVMQyw2QkFBaUIsU0FGWjtBQUdMQywwQ0FBOEI7QUFIekIsUyxRQUtUQyxVLEdBQWEsRSxRQUNiQyxJLEdBQU8sRSxRQUVQQyxPLEdBQVU7QUFDTkMsb0JBRE0sc0JBQ0s7QUFDUEMsbUJBQUdDLFVBQUgsQ0FBYztBQUNWQyx5QkFBSztBQURLLGlCQUFkO0FBR0g7QUFMSyxTOztBQVRWOzs7Ozt3Q0FpQmdCLENBQUU7OzsyQ0FFQztBQUFBOztBQUNmLGlCQUFLQyxnQkFBTCxDQUFzQixvQkFBdEIsRUFBNEMsRUFBNUMsRUFDS0MsSUFETCxDQUNVLGdCQUFRO0FBQ1Ysb0JBQU1DLFdBQVdSLElBQWpCO0FBQ0EsdUJBQUtTLE1BQUw7QUFDQU4sbUJBQUdPLFVBQUgsQ0FBYztBQUNWQyx5QkFBSyxVQURLO0FBRVZYLDBCQUFNWSxLQUFLQyxTQUFMLENBQWVMLFFBQWY7QUFGSSxpQkFBZDtBQUlILGFBUkwsRUFTS00sS0FUTCxDQVNXLFVBQVNDLEtBQVQsRUFBZ0IsQ0FBRSxDQVQ3QjtBQVVIOzs7aUNBQ1E7QUFDTDtBQUNIOzs7MENBQ2lCQyxHLEVBQUssQ0FBRTs7O3FDQUNaQyxDLEVBQUc7QUFDWkMsb0JBQVFDLEdBQVIsQ0FBWUYsRUFBRUcsSUFBZDtBQUNIOzs7a0NBQ1NILEMsRUFBRztBQUNUQyxvQkFBUUMsR0FBUixDQUFZRixFQUFFSSxRQUFkO0FBQ0g7OzttQ0FDVUosQyxFQUFHO0FBQ1ZDLG9CQUFRQyxHQUFSLENBQVlGLEVBQUVLLFNBQWQ7QUFDSDs7OztFQTVDaUNDLGVBQUtDLEk7O2tCQUFwQjlCLE0iLCJmaWxlIjoibWVtYmVyLjEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyogZ2xvYmFsIHd4ICovXHJcbmltcG9ydCB3ZXB5IGZyb20gJ3dlcHknO1xyXG5pbXBvcnQgUGFnZU1peGluIGZyb20gJy4uLy4uL21peGlucy9wYWdlJztcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVtYmVyIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAvLyBtaXhpbnMgPSBbUGFnZU1peGluXTtcclxuICBjb25maWcgPSB7XHJcbiAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfkvJrlkZjljaHliJfooagnLFxyXG4gICAgICBuYXZpZ2F0aW9uU3R5bGU6ICdkZWZhdWx0JyxcclxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNlODQ2NDQnXHJcbiAgfTtcclxuICBjb21wb25lbnRzID0ge307XHJcbiAgZGF0YSA9IHtcclxuICB9O1xyXG4gIG1ldGhvZHMgPSB7XHJcbiAgICAgIGdvRGV0YWlsKCkge1xyXG4gICAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICAgICAgdXJsOiAnY2FyZCdcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgfTtcclxuXHJcbiAgb25SZWFjaEJvdHRvbSgpIHt9XHJcblxyXG4gIHdoZW5BcHBSZWFkeVNob3coKSB7XHJcbiAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgndXNlci91c2VySW5mby5qc29uJywge30pXHJcbiAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCB1c2VySW5mbyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlKHtcclxuICAgICAgICAgICAgICAgICAga2V5OiAndXNlckluZm8nLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh1c2VySW5mbylcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHt9KTtcclxuICB9XHJcbiAgb25TaG93KCkge1xyXG4gICAgICAvLyB3eC5oaWRlVGFiQmFyKClcclxuICB9XHJcbiAgb25TaGFyZUFwcE1lc3NhZ2UocmVzKSB7fVxyXG4gIHJlZ2lvbmNoYW5nZShlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUudHlwZSk7XHJcbiAgfVxyXG4gIG1hcmtlcnRhcChlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUubWFya2VySWQpO1xyXG4gIH1cclxuICBjb250cm9sdGFwKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZS5jb250cm9sSWQpO1xyXG4gIH1cclxufVxyXG4iXX0=