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


var Reserve = function (_wepy$page) {
    _inherits(Reserve, _wepy$page);

    function Reserve() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Reserve);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Reserve.__proto__ || Object.getPrototypeOf(Reserve)).call.apply(_ref, [this].concat(args))), _this), _this.config = {}, _this.components = {}, _this.data = {}, _this.methods = {
            back: function back() {
                wx.navigateBack({
                    delta: 1
                });
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }
    // mixins = [PageMixin];


    _createClass(Reserve, [{
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

    return Reserve;
}(_wepy2.default.page);

exports.default = Reserve;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc2VydmUuMS5qcyJdLCJuYW1lcyI6WyJSZXNlcnZlIiwiY29uZmlnIiwiY29tcG9uZW50cyIsImRhdGEiLCJtZXRob2RzIiwiYmFjayIsInd4IiwibmF2aWdhdGVCYWNrIiwiZGVsdGEiLCJmZXRjaERhdGFQcm9taXNlIiwidGhlbiIsInVzZXJJbmZvIiwiJGFwcGx5Iiwic2V0U3RvcmFnZSIsImtleSIsIkpTT04iLCJzdHJpbmdpZnkiLCJjYXRjaCIsImVycm9yIiwicmVzIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJ0eXBlIiwibWFya2VySWQiLCJjb250cm9sSWQiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7OztBQUZBOzs7SUFHcUJBLE87Ozs7Ozs7Ozs7Ozs7OzRMQUVuQkMsTSxHQUFTLEUsUUFHVEMsVSxHQUFhLEUsUUFDYkMsSSxHQUFPLEUsUUFFUEMsTyxHQUFVO0FBQ1JDLGdCQURRLGtCQUNGO0FBQ0pDLG1CQUFHQyxZQUFILENBQWdCO0FBQ2RDLDJCQUFPO0FBRE8saUJBQWhCO0FBR0Q7QUFMTyxTOztBQVBWOzs7Ozt3Q0FlZ0IsQ0FBRTs7OzJDQUVDO0FBQUE7O0FBQ2YsaUJBQUtDLGdCQUFMLENBQXNCLG9CQUF0QixFQUE0QyxFQUE1QyxFQUNLQyxJQURMLENBQ1UsZ0JBQVE7QUFDVixvQkFBTUMsV0FBV1IsSUFBakI7QUFDQSx1QkFBS1MsTUFBTDtBQUNBTixtQkFBR08sVUFBSCxDQUFjO0FBQ1ZDLHlCQUFLLFVBREs7QUFFVlgsMEJBQU1ZLEtBQUtDLFNBQUwsQ0FBZUwsUUFBZjtBQUZJLGlCQUFkO0FBSUgsYUFSTCxFQVNLTSxLQVRMLENBU1csVUFBU0MsS0FBVCxFQUFnQixDQUFFLENBVDdCO0FBVUg7OztpQ0FDUTtBQUNMO0FBQ0g7OzswQ0FDaUJDLEcsRUFBSyxDQUFFOzs7cUNBQ1pDLEMsRUFBRztBQUNaQyxvQkFBUUMsR0FBUixDQUFZRixFQUFFRyxJQUFkO0FBQ0g7OztrQ0FDU0gsQyxFQUFHO0FBQ1RDLG9CQUFRQyxHQUFSLENBQVlGLEVBQUVJLFFBQWQ7QUFDSDs7O21DQUNVSixDLEVBQUc7QUFDVkMsb0JBQVFDLEdBQVIsQ0FBWUYsRUFBRUssU0FBZDtBQUNIOzs7O0VBMUNrQ0MsZUFBS0MsSTs7a0JBQXJCM0IsTyIsImZpbGUiOiJyZXNlcnZlLjEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyogZ2xvYmFsIHd4ICovXHJcbmltcG9ydCB3ZXB5IGZyb20gJ3dlcHknO1xyXG5pbXBvcnQgUGFnZU1peGluIGZyb20gJy4uLy4uL21peGlucy9wYWdlJztcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVzZXJ2ZSBleHRlbmRzIHdlcHkucGFnZSB7XHJcbiAgLy8gbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgY29uZmlnID0ge1xyXG4gIFxyXG4gIH07XHJcbiAgY29tcG9uZW50cyA9IHt9O1xyXG4gIGRhdGEgPSB7XHJcbiAgfTtcclxuICBtZXRob2RzID0ge1xyXG4gICAgYmFjaygpe1xyXG4gICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xyXG4gICAgICAgIGRlbHRhOiAxXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgb25SZWFjaEJvdHRvbSgpIHt9XHJcblxyXG4gIHdoZW5BcHBSZWFkeVNob3coKSB7XHJcbiAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgndXNlci91c2VySW5mby5qc29uJywge30pXHJcbiAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCB1c2VySW5mbyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlKHtcclxuICAgICAgICAgICAgICAgICAga2V5OiAndXNlckluZm8nLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh1c2VySW5mbylcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHt9KTtcclxuICB9XHJcbiAgb25TaG93KCkge1xyXG4gICAgICAvLyB3eC5oaWRlVGFiQmFyKClcclxuICB9XHJcbiAgb25TaGFyZUFwcE1lc3NhZ2UocmVzKSB7fVxyXG4gIHJlZ2lvbmNoYW5nZShlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUudHlwZSk7XHJcbiAgfVxyXG4gIG1hcmtlcnRhcChlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUubWFya2VySWQpO1xyXG4gIH1cclxuICBjb250cm9sdGFwKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZS5jb250cm9sSWQpO1xyXG4gIH1cclxufVxyXG4iXX0=