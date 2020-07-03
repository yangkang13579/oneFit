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

var Car = function (_wepy$page) {
    _inherits(Car, _wepy$page);

    function Car() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Car);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Car.__proto__ || Object.getPrototypeOf(Car)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
            navigationBarTitleText: '我的签到',
            navigationBarBackgroundColor: '#fff'
        }, _this.components = {}, _this.data = {
            list: []
        }, _this.methods = {}, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Car, [{
        key: 'timeFormat',
        value: function timeFormat(timeStr) {
            var dataOne = timeStr.split('T')[0];
            var dataTwo = timeStr.split('T')[1];
            var dataThree = dataTwo.split('+')[0];
            var newTimeStr = dataOne + ' ' + dataThree;
            return newTimeStr;
        }
    }, {
        key: 'getList',
        value: function getList() {
            var self = this;
            this.fetchDataPromise('meeting/wechat/querySignRecordApi.json', {}, {}).then(function (data) {
                self.list = data.list.map(function (item) {
                    var obj = item;
                    obj.createDate = self.timeFormat(obj.createDate);
                    return obj;
                });
                self.$apply();
            });
        }
    }, {
        key: 'whenAppReadyShow',
        value: function whenAppReadyShow() {
            this.getList();
        }
    }]);

    return Car;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(Car , 'pages/car'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhci5qcyJdLCJuYW1lcyI6WyJDYXIiLCJtaXhpbnMiLCJQYWdlTWl4aW4iLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImNvbXBvbmVudHMiLCJkYXRhIiwibGlzdCIsIm1ldGhvZHMiLCJ0aW1lU3RyIiwiZGF0YU9uZSIsInNwbGl0IiwiZGF0YVR3byIsImRhdGFUaHJlZSIsIm5ld1RpbWVTdHIiLCJzZWxmIiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJtYXAiLCJvYmoiLCJpdGVtIiwiY3JlYXRlRGF0ZSIsInRpbWVGb3JtYXQiLCIkYXBwbHkiLCJnZXRMaXN0Iiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0U7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBQ3FCQSxHOzs7Ozs7Ozs7Ozs7OztvTEFDbkJDLE0sR0FBUyxDQUFDQyxjQUFELEMsUUFDVEMsTSxHQUFTO0FBQ0xDLG9DQUF3QixNQURuQjtBQUVMQywwQ0FBOEI7QUFGekIsUyxRQUlUQyxVLEdBQWEsRSxRQUViQyxJLEdBQU87QUFDSEMsa0JBQU07QUFESCxTLFFBdUJQQyxPLEdBQVUsRTs7Ozs7bUNBcEJFQyxPLEVBQVM7QUFDakIsZ0JBQUlDLFVBQVVELFFBQVFFLEtBQVIsQ0FBYyxHQUFkLEVBQW1CLENBQW5CLENBQWQ7QUFDQSxnQkFBSUMsVUFBVUgsUUFBUUUsS0FBUixDQUFjLEdBQWQsRUFBbUIsQ0FBbkIsQ0FBZDtBQUNBLGdCQUFJRSxZQUFZRCxRQUFRRCxLQUFSLENBQWMsR0FBZCxFQUFtQixDQUFuQixDQUFoQjtBQUNBLGdCQUFJRyxhQUFhSixVQUFVLEdBQVYsR0FBZ0JHLFNBQWpDO0FBQ0EsbUJBQU9DLFVBQVA7QUFDSDs7O2tDQUVVO0FBQ1AsZ0JBQUlDLE9BQU8sSUFBWDtBQUNBLGlCQUFLQyxnQkFBTCxDQUFzQix3Q0FBdEIsRUFBZ0UsRUFBaEUsRUFBb0UsRUFBcEUsRUFDS0MsSUFETCxDQUNVLFVBQVNYLElBQVQsRUFBZTtBQUNqQlMscUJBQUtSLElBQUwsR0FBWUQsS0FBS0MsSUFBTCxDQUFVVyxHQUFWLENBQWMsZ0JBQVE7QUFDOUIsd0JBQUlDLE1BQU1DLElBQVY7QUFDQUQsd0JBQUlFLFVBQUosR0FBaUJOLEtBQUtPLFVBQUwsQ0FBZ0JILElBQUlFLFVBQXBCLENBQWpCO0FBQ0EsMkJBQU9GLEdBQVA7QUFDSCxpQkFKVyxDQUFaO0FBS0FKLHFCQUFLUSxNQUFMO0FBQ0gsYUFSTDtBQVNIOzs7MkNBSWtCO0FBQ2YsaUJBQUtDLE9BQUw7QUFDSDs7OztFQXBDOEJDLGVBQUtDLEk7O2tCQUFqQjNCLEciLCJmaWxlIjoiY2FyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbiAgaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbiAgaW1wb3J0IFBhZ2VNaXhpbiBmcm9tICcuLi9taXhpbnMvcGFnZSc7XHJcbiAgZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FyIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAgIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gICAgY29uZmlnID0ge1xyXG4gICAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfmiJHnmoTnrb7liLAnLFxyXG4gICAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJ1xyXG4gICAgfTtcclxuICAgIGNvbXBvbmVudHMgPSB7XHJcbiAgICB9O1xyXG4gICAgZGF0YSA9IHtcclxuICAgICAgICBsaXN0OiBbXSxcclxuICAgIH07XHJcbiAgICB0aW1lRm9ybWF0ICh0aW1lU3RyKSB7XHJcbiAgICAgICAgdmFyIGRhdGFPbmUgPSB0aW1lU3RyLnNwbGl0KCdUJylbMF07XHJcbiAgICAgICAgdmFyIGRhdGFUd28gPSB0aW1lU3RyLnNwbGl0KCdUJylbMV07XHJcbiAgICAgICAgdmFyIGRhdGFUaHJlZSA9IGRhdGFUd28uc3BsaXQoJysnKVswXTtcclxuICAgICAgICB2YXIgbmV3VGltZVN0ciA9IGRhdGFPbmUgKyAnICcgKyBkYXRhVGhyZWU7XHJcbiAgICAgICAgcmV0dXJuIG5ld1RpbWVTdHI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TGlzdCAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgnbWVldGluZy93ZWNoYXQvcXVlcnlTaWduUmVjb3JkQXBpLmpzb24nLCB7fSwge30pXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYubGlzdCA9IGRhdGEubGlzdC5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9iaiA9IGl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLmNyZWF0ZURhdGUgPSBzZWxmLnRpbWVGb3JtYXQob2JqLmNyZWF0ZURhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgbWV0aG9kcyA9IHtcclxuICAgIH1cclxuICBcclxuICAgIHdoZW5BcHBSZWFkeVNob3coKSB7XHJcbiAgICAgICAgdGhpcy5nZXRMaXN0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG4iXX0=