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

exports.default = Member;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcmQuMS5qcyJdLCJuYW1lcyI6WyJNZW1iZXIiLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwibmF2aWdhdGlvblN0eWxlIiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImNvbXBvbmVudHMiLCJkYXRhIiwibWV0aG9kcyIsImZldGNoRGF0YVByb21pc2UiLCJ0aGVuIiwidXNlckluZm8iLCIkYXBwbHkiLCJ3eCIsInNldFN0b3JhZ2UiLCJrZXkiLCJKU09OIiwic3RyaW5naWZ5IiwiY2F0Y2giLCJlcnJvciIsInJlcyIsImUiLCJjb25zb2xlIiwibG9nIiwidHlwZSIsIm1hcmtlcklkIiwiY29udHJvbElkIiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7QUFGQTs7O0lBR3FCQSxNOzs7Ozs7Ozs7Ozs7OzswTEFFbkJDLE0sR0FBUztBQUNMQyxvQ0FBd0IsT0FEbkI7QUFFTEMsNkJBQWlCLFNBRlo7QUFHTEMsMENBQThCO0FBSHpCLFMsUUFLVEMsVSxHQUFhLEUsUUFDYkMsSSxHQUFPLEUsUUFFUEMsTyxHQUFVLEU7O0FBVFY7Ozs7O3dDQWFnQixDQUFFOzs7MkNBRUM7QUFBQTs7QUFDZixpQkFBS0MsZ0JBQUwsQ0FBc0Isb0JBQXRCLEVBQTRDLEVBQTVDLEVBQ0tDLElBREwsQ0FDVSxnQkFBUTtBQUNWLG9CQUFNQyxXQUFXSixJQUFqQjtBQUNBLHVCQUFLSyxNQUFMO0FBQ0FDLG1CQUFHQyxVQUFILENBQWM7QUFDVkMseUJBQUssVUFESztBQUVWUiwwQkFBTVMsS0FBS0MsU0FBTCxDQUFlTixRQUFmO0FBRkksaUJBQWQ7QUFJSCxhQVJMLEVBU0tPLEtBVEwsQ0FTVyxVQUFTQyxLQUFULEVBQWdCLENBQUUsQ0FUN0I7QUFVSDs7O2lDQUNRO0FBQ0w7QUFDSDs7OzBDQUNpQkMsRyxFQUFLLENBQUU7OztxQ0FDWkMsQyxFQUFHO0FBQ1pDLG9CQUFRQyxHQUFSLENBQVlGLEVBQUVHLElBQWQ7QUFDSDs7O2tDQUNTSCxDLEVBQUc7QUFDVEMsb0JBQVFDLEdBQVIsQ0FBWUYsRUFBRUksUUFBZDtBQUNIOzs7bUNBQ1VKLEMsRUFBRztBQUNWQyxvQkFBUUMsR0FBUixDQUFZRixFQUFFSyxTQUFkO0FBQ0g7Ozs7RUF4Q2lDQyxlQUFLQyxJOztrQkFBcEIzQixNIiwiZmlsZSI6ImNhcmQuMS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKiBnbG9iYWwgd3ggKi9cclxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vLi4vbWl4aW5zL3BhZ2UnO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZW1iZXIgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gIC8vIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gIGNvbmZpZyA9IHtcclxuICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+S8muWRmOWNoeWIl+ihqCcsXHJcbiAgICAgIG5hdmlnYXRpb25TdHlsZTogJ2RlZmF1bHQnLFxyXG4gICAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiAnI2U4NDY0NCdcclxuICB9O1xyXG4gIGNvbXBvbmVudHMgPSB7fTtcclxuICBkYXRhID0ge1xyXG4gIH07XHJcbiAgbWV0aG9kcyA9IHtcclxuXHJcbiAgfTtcclxuXHJcbiAgb25SZWFjaEJvdHRvbSgpIHt9XHJcblxyXG4gIHdoZW5BcHBSZWFkeVNob3coKSB7XHJcbiAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgndXNlci91c2VySW5mby5qc29uJywge30pXHJcbiAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCB1c2VySW5mbyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlKHtcclxuICAgICAgICAgICAgICAgICAga2V5OiAndXNlckluZm8nLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh1c2VySW5mbylcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHt9KTtcclxuICB9XHJcbiAgb25TaG93KCkge1xyXG4gICAgICAvLyB3eC5oaWRlVGFiQmFyKClcclxuICB9XHJcbiAgb25TaGFyZUFwcE1lc3NhZ2UocmVzKSB7fVxyXG4gIHJlZ2lvbmNoYW5nZShlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUudHlwZSk7XHJcbiAgfVxyXG4gIG1hcmtlcnRhcChlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUubWFya2VySWQpO1xyXG4gIH1cclxuICBjb250cm9sdGFwKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZS5jb250cm9sSWQpO1xyXG4gIH1cclxufVxyXG4iXX0=