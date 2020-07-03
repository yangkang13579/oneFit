"use strict";

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
      navigationBarTitleText: "我的样品申领",
      navigationBarBackgroundColor: "#fff"
    }, _this.components = {}, _this.data = {
      list: []
    }, _this.methods = {}, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(MeMaple, [{
    key: "onLoad",
    value: function onLoad() {
      var that = this;
    }
  }, {
    key: "timeFormat",
    value: function timeFormat(timeStr) {
      var dataOne = timeStr.split('T')[0];
      var dataTwo = timeStr.split('T')[1];
      var dataThree = dataTwo.split('+')[0];
      var newTimeStr = dataOne + ' ' + dataThree;
      return newTimeStr;
    }
    // 获取列表

  }, {
    key: "getList",
    value: function getList() {
      var self = this;
      this.fetchDataPromise("wx/specimen/myApplySpecimenApi.json", {}, {}).then(function (data) {
        console.log("data", data);
        self.list = data.list.map(function (item) {
          var obj = item;
          obj.createDate = self.timeFormat(obj.createDate);
          return obj;
        });
        self.$apply();
      });
    }
  }, {
    key: "whenAppReadyShow",
    value: function whenAppReadyShow() {
      this.getList();
    }
  }]);

  return MeMaple;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(MeMaple , 'pages/meMaple'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lTWFwbGUuanMiXSwibmFtZXMiOlsiTWVNYXBsZSIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImRhdGEiLCJsaXN0IiwibWV0aG9kcyIsInRoYXQiLCJ0aW1lU3RyIiwiZGF0YU9uZSIsInNwbGl0IiwiZGF0YVR3byIsImRhdGFUaHJlZSIsIm5ld1RpbWVTdHIiLCJzZWxmIiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJjb25zb2xlIiwibG9nIiwibWFwIiwib2JqIiwiaXRlbSIsImNyZWF0ZURhdGUiLCJ0aW1lRm9ybWF0IiwiJGFwcGx5IiwiZ2V0TGlzdCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBRkE7OztJQUdxQkEsTzs7Ozs7Ozs7Ozs7Ozs7d0xBQ25CQyxNLEdBQVMsQ0FBQ0MsY0FBRCxDLFFBQ1RDLE0sR0FBUztBQUNQQyw4QkFBd0IsUUFEakI7QUFFUEMsb0NBQThCO0FBRnZCLEssUUFJVEMsVSxHQUFhLEUsUUFDYkMsSSxHQUFPO0FBQ0xDLFlBQU07QUFERCxLLFFBSVBDLE8sR0FBVSxFOzs7Ozs2QkFFRDtBQUNQLFVBQUlDLE9BQU8sSUFBWDtBQUNEOzs7K0JBQ1lDLE8sRUFBUztBQUNsQixVQUFJQyxVQUFVRCxRQUFRRSxLQUFSLENBQWMsR0FBZCxFQUFtQixDQUFuQixDQUFkO0FBQ0EsVUFBSUMsVUFBVUgsUUFBUUUsS0FBUixDQUFjLEdBQWQsRUFBbUIsQ0FBbkIsQ0FBZDtBQUNBLFVBQUlFLFlBQVlELFFBQVFELEtBQVIsQ0FBYyxHQUFkLEVBQW1CLENBQW5CLENBQWhCO0FBQ0EsVUFBSUcsYUFBYUosVUFBVSxHQUFWLEdBQWdCRyxTQUFqQztBQUNBLGFBQU9DLFVBQVA7QUFDRDtBQUNIOzs7OzhCQUNVO0FBQ1IsVUFBSUMsT0FBTyxJQUFYO0FBQ0EsV0FBS0MsZ0JBQUwsQ0FBc0IscUNBQXRCLEVBQTZELEVBQTdELEVBQWlFLEVBQWpFLEVBQXFFQyxJQUFyRSxDQUNFLFVBQVNaLElBQVQsRUFBZTtBQUNiYSxnQkFBUUMsR0FBUixDQUFZLE1BQVosRUFBb0JkLElBQXBCO0FBQ0FVLGFBQUtULElBQUwsR0FBWUQsS0FBS0MsSUFBTCxDQUFVYyxHQUFWLENBQWMsZ0JBQVE7QUFDaEMsY0FBSUMsTUFBTUMsSUFBVjtBQUNBRCxjQUFJRSxVQUFKLEdBQWlCUixLQUFLUyxVQUFMLENBQWdCSCxJQUFJRSxVQUFwQixDQUFqQjtBQUNBLGlCQUFPRixHQUFQO0FBQ0QsU0FKVyxDQUFaO0FBS0FOLGFBQUtVLE1BQUw7QUFDRCxPQVRIO0FBV0Q7Ozt1Q0FDa0I7QUFDakIsV0FBS0MsT0FBTDtBQUNEOzs7O0VBeENrQ0MsZUFBS0MsSTs7a0JBQXJCOUIsTyIsImZpbGUiOiJtZU1hcGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8qIGdsb2JhbCB3eCAqL1xyXG5pbXBvcnQgd2VweSBmcm9tIFwid2VweVwiO1xyXG5pbXBvcnQgUGFnZU1peGluIGZyb20gXCIuLi9taXhpbnMvcGFnZVwiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZU1hcGxlIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICBtaXhpbnMgPSBbUGFnZU1peGluXTtcclxuICBjb25maWcgPSB7XHJcbiAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiBcIuaIkeeahOagt+WTgeeUs+mihlwiLFxyXG4gICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcclxuICB9O1xyXG4gIGNvbXBvbmVudHMgPSB7fTtcclxuICBkYXRhID0ge1xyXG4gICAgbGlzdDogW10sXHJcbiAgfTtcclxuXHJcbiAgbWV0aG9kcyA9IHt9O1xyXG5cclxuICBvbkxvYWQoKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgfVxyXG4gICB0aW1lRm9ybWF0ICh0aW1lU3RyKSB7XHJcbiAgICAgIHZhciBkYXRhT25lID0gdGltZVN0ci5zcGxpdCgnVCcpWzBdO1xyXG4gICAgICB2YXIgZGF0YVR3byA9IHRpbWVTdHIuc3BsaXQoJ1QnKVsxXTtcclxuICAgICAgdmFyIGRhdGFUaHJlZSA9IGRhdGFUd28uc3BsaXQoJysnKVswXTtcclxuICAgICAgdmFyIG5ld1RpbWVTdHIgPSBkYXRhT25lICsgJyAnICsgZGF0YVRocmVlXHJcbiAgICAgIHJldHVybiBuZXdUaW1lU3RyO1xyXG4gICAgfVxyXG4gIC8vIOiOt+WPluWIl+ihqFxyXG4gIGdldExpc3QoKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoXCJ3eC9zcGVjaW1lbi9teUFwcGx5U3BlY2ltZW5BcGkuanNvblwiLCB7fSwge30pLnRoZW4oXHJcbiAgICAgIGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImRhdGFcIiwgZGF0YSk7XHJcbiAgICAgICAgc2VsZi5saXN0ID0gZGF0YS5saXN0Lm1hcChpdGVtID0+IHtcclxuICAgICAgICAgIGxldCBvYmogPSBpdGVtO1xyXG4gICAgICAgICAgb2JqLmNyZWF0ZURhdGUgPSBzZWxmLnRpbWVGb3JtYXQob2JqLmNyZWF0ZURhdGUpO1xyXG4gICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgICB9KTtcclxuICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gIH1cclxuICB3aGVuQXBwUmVhZHlTaG93KCkge1xyXG4gICAgdGhpcy5nZXRMaXN0KCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==