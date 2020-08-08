"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var common = function (_wepy$component) {
  _inherits(common, _wepy$component);

  function common() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, common);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = common.__proto__ || Object.getPrototypeOf(common)).call.apply(_ref, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(common, [{
    key: "onLoad",
    value: function onLoad() {}
  }]);

  return common;
}(_wepy2.default.component);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.props = {};
  this.data = {
    height: "",
    text: ""
  };
  this.watch = {};
  this.events = {
    "index-broadcast": function indexBroadcast() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      _this2.height = args[0].height;
      _this2.text = args[0].text;
    }
  };
  this.methods = {
    goBack: function goBack() {
      wx.navigateBack();
    }
  };
};

exports.default = common;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlYWRlcnMuanMiXSwibmFtZXMiOlsiY29tbW9uIiwid2VweSIsImNvbXBvbmVudCIsInByb3BzIiwiZGF0YSIsImhlaWdodCIsInRleHQiLCJ3YXRjaCIsImV2ZW50cyIsImFyZ3MiLCJtZXRob2RzIiwiZ29CYWNrIiwid3giLCJuYXZpZ2F0ZUJhY2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUNxQkEsTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs2QkFhVixDQUFFOzs7O0VBYnVCQyxlQUFLQyxTOzs7OztPQUN2Q0MsSyxHQUFRLEU7T0FDUkMsSSxHQUFPO0FBQ0xDLFlBQVEsRUFESDtBQUVMQyxVQUFNO0FBRkQsRztPQUlQQyxLLEdBQVEsRTtPQUNSQyxNLEdBQVM7QUFDUCx1QkFBbUIsMEJBQWE7QUFBQSx5Q0FBVEMsSUFBUztBQUFUQSxZQUFTO0FBQUE7O0FBQzlCLGFBQUtKLE1BQUwsR0FBY0ksS0FBSyxDQUFMLEVBQVFKLE1BQXRCO0FBQ0EsYUFBS0MsSUFBTCxHQUFZRyxLQUFLLENBQUwsRUFBUUgsSUFBcEI7QUFDRDtBQUpNLEc7T0FPVEksTyxHQUFVO0FBQ1JDLFVBRFEsb0JBQ0M7QUFDUEMsU0FBR0MsWUFBSDtBQUNEO0FBSE8sRzs7O2tCQWRTYixNIiwiZmlsZSI6ImhlYWRlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB3ZXB5IGZyb20gXCJ3ZXB5XCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBjb21tb24gZXh0ZW5kcyB3ZXB5LmNvbXBvbmVudCB7XG4gIHByb3BzID0ge307XG4gIGRhdGEgPSB7XG4gICAgaGVpZ2h0OiBcIlwiLFxuICAgIHRleHQ6IFwiXCJcbiAgfTtcbiAgd2F0Y2ggPSB7fTtcbiAgZXZlbnRzID0ge1xuICAgIFwiaW5kZXgtYnJvYWRjYXN0XCI6ICguLi5hcmdzKSA9PiB7XG4gICAgICB0aGlzLmhlaWdodCA9IGFyZ3NbMF0uaGVpZ2h0O1xuICAgICAgdGhpcy50ZXh0ID0gYXJnc1swXS50ZXh0O1xuICAgIH1cbiAgfTtcbiAgb25Mb2FkKCkge31cbiAgbWV0aG9kcyA9IHtcbiAgICBnb0JhY2soKSB7XG4gICAgICB3eC5uYXZpZ2F0ZUJhY2soKTtcbiAgICB9XG4gIH07XG59XG4iXX0=