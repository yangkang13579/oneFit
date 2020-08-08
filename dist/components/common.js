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
    branch: []
  };
  this.watch = {};
  this.events = {
    "index-broadcast": function indexBroadcast() {
      _this2.branch = arguments.length <= 0 ? undefined : arguments[0];
    }
  };
};

exports.default = common;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi5qcyJdLCJuYW1lcyI6WyJjb21tb24iLCJ3ZXB5IiwiY29tcG9uZW50IiwicHJvcHMiLCJkYXRhIiwiYnJhbmNoIiwid2F0Y2giLCJldmVudHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUNxQkEsTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs2QkFNVixDQUFFOzs7O0VBTnVCQyxlQUFLQyxTOzs7OztPQUN2Q0MsSyxHQUFRLEU7T0FDUkMsSSxHQUFPO0FBQ0xDLFlBQVE7QUFESCxHO09BR1BDLEssR0FBUSxFO09BRVJDLE0sR0FBUztBQUNQLHVCQUFtQiwwQkFBYTtBQUM5QixhQUFLRixNQUFMO0FBQ0Q7QUFITSxHOzs7a0JBUFVMLE0iLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgd2VweSBmcm9tIFwid2VweVwiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgY29tbW9uIGV4dGVuZHMgd2VweS5jb21wb25lbnQge1xuICBwcm9wcyA9IHt9O1xuICBkYXRhID0ge1xuICAgIGJyYW5jaDogW11cbiAgfTtcbiAgd2F0Y2ggPSB7fTtcbiAgb25Mb2FkKCkge31cbiAgZXZlbnRzID0ge1xuICAgIFwiaW5kZXgtYnJvYWRjYXN0XCI6ICguLi5hcmdzKSA9PiB7XG4gICAgICB0aGlzLmJyYW5jaCA9IGFyZ3NbMF07XG4gICAgfVxuICB9O1xufVxuIl19