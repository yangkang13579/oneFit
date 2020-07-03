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
/* global wx */


var MeMaple = function (_wepy$page) {
    _inherits(MeMaple, _wepy$page);

    function MeMaple() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, MeMaple);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MeMaple.__proto__ || Object.getPrototypeOf(MeMaple)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
            navigationBarTitleText: '我的样品申领',
            navigationBarBackgroundColor: '#fff'
        }, _this.components = {}, _this.data = {
            list: []
        }, _this.methods = {}, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(MeMaple, [{
        key: 'onLoad',
        value: function onLoad() {
            var that = this;
        }
    }, {
        key: 'timeFormat',
        value: function timeFormat(timeStr) {
            var dataOne = timeStr.split('T')[0];
            var dataTwo = timeStr.split('T')[1];
            var dataThree = dataTwo.split('+')[0];
            var newTimeStr = dataOne + ' ' + dataThree;
            return newTimeStr;
        }
        // 获取列表

    }, {
        key: 'getList',
        value: function getList() {
            var self = this;
            this.fetchDataPromise('wx/specimen/myApplySpecimenApi.json', {}, {}).then(function (data) {
                console.log('data', data);
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

    return MeMaple;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(MeMaple , 'pages/meMaple'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lTWFwbGUuanMiXSwibmFtZXMiOlsiTWVNYXBsZSIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImRhdGEiLCJsaXN0IiwibWV0aG9kcyIsInRoYXQiLCJ0aW1lU3RyIiwiZGF0YU9uZSIsInNwbGl0IiwiZGF0YVR3byIsImRhdGFUaHJlZSIsIm5ld1RpbWVTdHIiLCJzZWxmIiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJjb25zb2xlIiwibG9nIiwibWFwIiwib2JqIiwiaXRlbSIsImNyZWF0ZURhdGUiLCJ0aW1lRm9ybWF0IiwiJGFwcGx5IiwiZ2V0TGlzdCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBRkE7OztJQUdxQkEsTzs7Ozs7Ozs7Ozs7Ozs7NExBQ25CQyxNLEdBQVMsQ0FBQ0MsY0FBRCxDLFFBQ1RDLE0sR0FBUztBQUNMQyxvQ0FBd0IsUUFEbkI7QUFFTEMsMENBQThCO0FBRnpCLFMsUUFJVEMsVSxHQUFhLEUsUUFDYkMsSSxHQUFPO0FBQ0hDLGtCQUFNO0FBREgsUyxRQUlQQyxPLEdBQVUsRTs7Ozs7aUNBRUQ7QUFDTCxnQkFBSUMsT0FBTyxJQUFYO0FBQ0g7OzttQ0FDV0MsTyxFQUFTO0FBQ2pCLGdCQUFJQyxVQUFVRCxRQUFRRSxLQUFSLENBQWMsR0FBZCxFQUFtQixDQUFuQixDQUFkO0FBQ0EsZ0JBQUlDLFVBQVVILFFBQVFFLEtBQVIsQ0FBYyxHQUFkLEVBQW1CLENBQW5CLENBQWQ7QUFDQSxnQkFBSUUsWUFBWUQsUUFBUUQsS0FBUixDQUFjLEdBQWQsRUFBbUIsQ0FBbkIsQ0FBaEI7QUFDQSxnQkFBSUcsYUFBYUosVUFBVSxHQUFWLEdBQWdCRyxTQUFqQztBQUNBLG1CQUFPQyxVQUFQO0FBQ0g7QUFDRDs7OztrQ0FDVTtBQUNOLGdCQUFJQyxPQUFPLElBQVg7QUFDQSxpQkFBS0MsZ0JBQUwsQ0FBc0IscUNBQXRCLEVBQTZELEVBQTdELEVBQWlFLEVBQWpFLEVBQXFFQyxJQUFyRSxDQUNJLFVBQVNaLElBQVQsRUFBZTtBQUNYYSx3QkFBUUMsR0FBUixDQUFZLE1BQVosRUFBb0JkLElBQXBCO0FBQ0FVLHFCQUFLVCxJQUFMLEdBQVlELEtBQUtDLElBQUwsQ0FBVWMsR0FBVixDQUFjLGdCQUFRO0FBQzlCLHdCQUFJQyxNQUFNQyxJQUFWO0FBQ0FELHdCQUFJRSxVQUFKLEdBQWlCUixLQUFLUyxVQUFMLENBQWdCSCxJQUFJRSxVQUFwQixDQUFqQjtBQUNBLDJCQUFPRixHQUFQO0FBQ0gsaUJBSlcsQ0FBWjtBQUtBTixxQkFBS1UsTUFBTDtBQUNILGFBVEw7QUFXSDs7OzJDQUNrQjtBQUNmLGlCQUFLQyxPQUFMO0FBQ0g7Ozs7RUF4Q2tDQyxlQUFLQyxJOztrQkFBckI5QixPIiwiZmlsZSI6Im1lTWFwbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyogZ2xvYmFsIHd4ICovXHJcbmltcG9ydCB3ZXB5IGZyb20gJ3dlcHknO1xyXG5pbXBvcnQgUGFnZU1peGluIGZyb20gJy4uL21peGlucy9wYWdlJztcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVNYXBsZSBleHRlbmRzIHdlcHkucGFnZSB7XHJcbiAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgY29uZmlnID0ge1xyXG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5oiR55qE5qC35ZOB55Sz6aKGJyxcclxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNmZmYnXHJcbiAgfTtcclxuICBjb21wb25lbnRzID0ge307XHJcbiAgZGF0YSA9IHtcclxuICAgICAgbGlzdDogW10sXHJcbiAgfTtcclxuXHJcbiAgbWV0aG9kcyA9IHt9O1xyXG5cclxuICBvbkxvYWQoKSB7XHJcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICB9XHJcbiAgdGltZUZvcm1hdCAodGltZVN0cikge1xyXG4gICAgICB2YXIgZGF0YU9uZSA9IHRpbWVTdHIuc3BsaXQoJ1QnKVswXTtcclxuICAgICAgdmFyIGRhdGFUd28gPSB0aW1lU3RyLnNwbGl0KCdUJylbMV07XHJcbiAgICAgIHZhciBkYXRhVGhyZWUgPSBkYXRhVHdvLnNwbGl0KCcrJylbMF07XHJcbiAgICAgIHZhciBuZXdUaW1lU3RyID0gZGF0YU9uZSArICcgJyArIGRhdGFUaHJlZTtcclxuICAgICAgcmV0dXJuIG5ld1RpbWVTdHI7XHJcbiAgfVxyXG4gIC8vIOiOt+WPluWIl+ihqFxyXG4gIGdldExpc3QoKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCd3eC9zcGVjaW1lbi9teUFwcGx5U3BlY2ltZW5BcGkuanNvbicsIHt9LCB7fSkudGhlbihcclxuICAgICAgICAgIGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZGF0YScsIGRhdGEpO1xyXG4gICAgICAgICAgICAgIHNlbGYubGlzdCA9IGRhdGEubGlzdC5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGxldCBvYmogPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgICBvYmouY3JlYXRlRGF0ZSA9IHNlbGYudGltZUZvcm1hdChvYmouY3JlYXRlRGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgKTtcclxuICB9XHJcbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgICAgdGhpcy5nZXRMaXN0KCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==