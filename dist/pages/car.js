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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhci5qcyJdLCJuYW1lcyI6WyJDYXIiLCJtaXhpbnMiLCJQYWdlTWl4aW4iLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImNvbXBvbmVudHMiLCJkYXRhIiwibGlzdCIsIm1ldGhvZHMiLCJ0aW1lU3RyIiwiZGF0YU9uZSIsInNwbGl0IiwiZGF0YVR3byIsImRhdGFUaHJlZSIsIm5ld1RpbWVTdHIiLCJzZWxmIiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJtYXAiLCJvYmoiLCJpdGVtIiwiY3JlYXRlRGF0ZSIsInRpbWVGb3JtYXQiLCIkYXBwbHkiLCJnZXRMaXN0Iiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0U7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBQ3FCQSxHOzs7Ozs7Ozs7Ozs7OztnTEFDbkJDLE0sR0FBUyxDQUFDQyxjQUFELEMsUUFDVEMsTSxHQUFTO0FBQ1BDLDhCQUF3QixNQURqQjtBQUVQQyxvQ0FBOEI7QUFGdkIsSyxRQUlUQyxVLEdBQWEsRSxRQUViQyxJLEdBQU87QUFDTEMsWUFBTTtBQURELEssUUF1QlBDLE8sR0FBVSxFOzs7OzsrQkFwQkVDLE8sRUFBUztBQUNuQixVQUFJQyxVQUFVRCxRQUFRRSxLQUFSLENBQWMsR0FBZCxFQUFtQixDQUFuQixDQUFkO0FBQ0EsVUFBSUMsVUFBVUgsUUFBUUUsS0FBUixDQUFjLEdBQWQsRUFBbUIsQ0FBbkIsQ0FBZDtBQUNBLFVBQUlFLFlBQVlELFFBQVFELEtBQVIsQ0FBYyxHQUFkLEVBQW1CLENBQW5CLENBQWhCO0FBQ0EsVUFBSUcsYUFBYUosVUFBVSxHQUFWLEdBQWdCRyxTQUFqQztBQUNBLGFBQU9DLFVBQVA7QUFDRDs7OzhCQUVVO0FBQ1QsVUFBSUMsT0FBTyxJQUFYO0FBQ0EsV0FBS0MsZ0JBQUwsQ0FBc0Isd0NBQXRCLEVBQWdFLEVBQWhFLEVBQW9FLEVBQXBFLEVBQ0NDLElBREQsQ0FDTSxVQUFTWCxJQUFULEVBQWU7QUFDbkJTLGFBQUtSLElBQUwsR0FBWUQsS0FBS0MsSUFBTCxDQUFVVyxHQUFWLENBQWMsZ0JBQVE7QUFDaEMsY0FBSUMsTUFBTUMsSUFBVjtBQUNBRCxjQUFJRSxVQUFKLEdBQWlCTixLQUFLTyxVQUFMLENBQWdCSCxJQUFJRSxVQUFwQixDQUFqQjtBQUNBLGlCQUFPRixHQUFQO0FBQ0QsU0FKVyxDQUFaO0FBS0FKLGFBQUtRLE1BQUw7QUFDRCxPQVJEO0FBU0Q7Ozt1Q0FJa0I7QUFDakIsV0FBS0MsT0FBTDtBQUNEOzs7O0VBcEM4QkMsZUFBS0MsSTs7a0JBQWpCM0IsRyIsImZpbGUiOiJjYXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuICBpbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuICBpbXBvcnQgUGFnZU1peGluIGZyb20gJy4uL21peGlucy9wYWdlJztcclxuICBleHBvcnQgZGVmYXVsdCBjbGFzcyBDYXIgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gICAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgICBjb25maWcgPSB7XHJcbiAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfmiJHnmoTnrb7liLAnLFxyXG4gICAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiAnI2ZmZidcclxuICAgIH07XHJcbiAgICBjb21wb25lbnRzID0ge1xyXG4gICAgfTtcclxuICAgIGRhdGEgPSB7XHJcbiAgICAgIGxpc3Q6IFtdLFxyXG4gICAgfTtcclxuICAgIHRpbWVGb3JtYXQgKHRpbWVTdHIpIHtcclxuICAgICAgdmFyIGRhdGFPbmUgPSB0aW1lU3RyLnNwbGl0KCdUJylbMF07XHJcbiAgICAgIHZhciBkYXRhVHdvID0gdGltZVN0ci5zcGxpdCgnVCcpWzFdO1xyXG4gICAgICB2YXIgZGF0YVRocmVlID0gZGF0YVR3by5zcGxpdCgnKycpWzBdO1xyXG4gICAgICB2YXIgbmV3VGltZVN0ciA9IGRhdGFPbmUgKyAnICcgKyBkYXRhVGhyZWVcclxuICAgICAgcmV0dXJuIG5ld1RpbWVTdHI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TGlzdCAoKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpc1xyXG4gICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ21lZXRpbmcvd2VjaGF0L3F1ZXJ5U2lnblJlY29yZEFwaS5qc29uJywge30sIHt9KVxyXG4gICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgc2VsZi5saXN0ID0gZGF0YS5saXN0Lm1hcChpdGVtID0+IHtcclxuICAgICAgICAgIGxldCBvYmogPSBpdGVtXHJcbiAgICAgICAgICBvYmouY3JlYXRlRGF0ZSA9IHNlbGYudGltZUZvcm1hdChvYmouY3JlYXRlRGF0ZSlcclxuICAgICAgICAgIHJldHVybiBvYmpcclxuICAgICAgICB9KVxyXG4gICAgICAgIHNlbGYuJGFwcGx5KClcclxuICAgICAgfSlcclxuICAgIH1cclxuICAgIG1ldGhvZHMgPSB7XHJcbiAgICB9XHJcbiAgXHJcbiAgICB3aGVuQXBwUmVhZHlTaG93KCkge1xyXG4gICAgICB0aGlzLmdldExpc3QoKVxyXG4gICAgfVxyXG4gIH1cclxuIl19