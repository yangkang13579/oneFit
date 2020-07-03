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


var Mysample = function (_wepy$page) {
  _inherits(Mysample, _wepy$page);

  function Mysample() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Mysample);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Mysample.__proto__ || Object.getPrototypeOf(Mysample)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarTitleText: '会议签到22222',
      navigationBarBackgroundColor: '#fff'
    }, _this.components = {}, _this.data = {}, _this.methods = {}, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Mysample, [{
    key: 'onLoad',
    value: function onLoad() {
      var that = this;
    }
  }, {
    key: 'getList',

    // 获取列表
    value: function getList() {
      var self = this;
      this.fetchDataPromise('meeting/wechat/querySignRecordApi.json', {}, {}).then(function (data) {
        self.list = data.detail.map(function (item) {
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

  return Mysample;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(Mysample , 'pages/mysample'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm15c2FtcGxlLmpzIl0sIm5hbWVzIjpbIk15c2FtcGxlIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJjb21wb25lbnRzIiwiZGF0YSIsIm1ldGhvZHMiLCJ0aGF0Iiwic2VsZiIsImZldGNoRGF0YVByb21pc2UiLCJ0aGVuIiwibGlzdCIsImRldGFpbCIsIm1hcCIsIm9iaiIsIml0ZW0iLCJjcmVhdGVEYXRlIiwidGltZUZvcm1hdCIsIiRhcHBseSIsImdldExpc3QiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFRTs7OztBQUNBOzs7Ozs7Ozs7OztBQUZBOzs7SUFHcUJBLFE7Ozs7Ozs7Ozs7Ozs7OzBMQUNuQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDUEMsOEJBQXdCLFdBRGpCO0FBRVBDLG9DQUE4QjtBQUZ2QixLLFFBSVRDLFUsR0FBYSxFLFFBQ2JDLEksR0FBTyxFLFFBSVBDLE8sR0FBVSxFOzs7Ozs2QkFJRDtBQUNSLFVBQUlDLE9BQU8sSUFBWDtBQUVEOzs7O0FBQ0E7OEJBQ1c7QUFDVCxVQUFJQyxPQUFPLElBQVg7QUFDQSxXQUFLQyxnQkFBTCxDQUFzQix3Q0FBdEIsRUFBZ0UsRUFBaEUsRUFBb0UsRUFBcEUsRUFDQ0MsSUFERCxDQUNNLFVBQVNMLElBQVQsRUFBZTtBQUNuQkcsYUFBS0csSUFBTCxHQUFZTixLQUFLTyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsZ0JBQVE7QUFDbEMsY0FBSUMsTUFBTUMsSUFBVjtBQUNBRCxjQUFJRSxVQUFKLEdBQWlCUixLQUFLUyxVQUFMLENBQWdCSCxJQUFJRSxVQUFwQixDQUFqQjtBQUNBLGlCQUFPRixHQUFQO0FBQ0QsU0FKVyxDQUFaO0FBS0FOLGFBQUtVLE1BQUw7QUFDRCxPQVJEO0FBU0Q7Ozt1Q0FDa0I7QUFDakIsV0FBS0MsT0FBTDtBQUNEOzs7O0VBbENtQ0MsZUFBS0MsSTs7a0JBQXRCdkIsUSIsImZpbGUiOiJteXNhbXBsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuICAvKiBnbG9iYWwgd3ggKi9cbiAgaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XG4gIGltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vbWl4aW5zL3BhZ2UnO1xuICBleHBvcnQgZGVmYXVsdCBjbGFzcyBNeXNhbXBsZSBleHRlbmRzIHdlcHkucGFnZSB7XG4gICAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XG4gICAgY29uZmlnID0ge1xuICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+S8muiuruetvuWIsDIyMjIyJyxcbiAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJ1xuICAgIH07XG4gICAgY29tcG9uZW50cyA9IHt9O1xuICAgIGRhdGEgPSB7XG4gICAgXG4gICAgfTtcbiAgXG4gICAgbWV0aG9kcyA9IHtcbiAgICAgXG4gICAgfTtcblxuICAgb25Mb2FkICgpIHtcbiAgICAgdmFyIHRoYXQgPSB0aGlzXG4gIFxuICAgfTtcbiAgICAvLyDojrflj5bliJfooahcbiAgICBnZXRMaXN0ICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCdtZWV0aW5nL3dlY2hhdC9xdWVyeVNpZ25SZWNvcmRBcGkuanNvbicsIHt9LCB7fSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgc2VsZi5saXN0ID0gZGF0YS5kZXRhaWwubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgIGxldCBvYmogPSBpdGVtXG4gICAgICAgICAgb2JqLmNyZWF0ZURhdGUgPSBzZWxmLnRpbWVGb3JtYXQob2JqLmNyZWF0ZURhdGUpXG4gICAgICAgICAgcmV0dXJuIG9ialxuICAgICAgICB9KVxuICAgICAgICBzZWxmLiRhcHBseSgpXG4gICAgICB9KVxuICAgIH07XG4gICAgd2hlbkFwcFJlYWR5U2hvdygpIHtcbiAgICAgIHRoaXMuZ2V0TGlzdCgpXG4gICAgfVxuXG4gfVxuIl19