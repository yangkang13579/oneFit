"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _page = require('./../mixins/page.js');

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Form = function (_wepy$page) {
  _inherits(Form, _wepy$page);

  function Form() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Form);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Form.__proto__ || Object.getPrototypeOf(Form)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarTitleText: "",
      navigationBarBackgroundColor: "#fff"
    }, _this.data = {}, _temp), _possibleConstructorReturn(_this, _ret);
  }

  return Form;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(Form , 'pages/webview1'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnZpZXcxLmpzIl0sIm5hbWVzIjpbIkZvcm0iLCJtaXhpbnMiLCJQYWdlTWl4aW4iLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImRhdGEiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBQ3FCQSxJOzs7Ozs7Ozs7Ozs7OztrTEFDbkJDLE0sR0FBUyxDQUFDQyxjQUFELEMsUUFDVEMsTSxHQUFTO0FBQ1BDLDhCQUF3QixFQURqQjtBQUVQQyxvQ0FBOEI7QUFGdkIsSyxRQUlUQyxJLEdBQU8sRTs7OztFQU55QkMsZUFBS0MsSTs7a0JBQWxCUixJIiwiZmlsZSI6IndlYnZpZXcxLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCB3ZXB5IGZyb20gXCJ3ZXB5XCI7XHJcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSBcIi4uL21peGlucy9wYWdlXCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZvcm0gZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gIGNvbmZpZyA9IHtcclxuICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6IFwiXCIsXHJcbiAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxyXG4gIH07XHJcbiAgZGF0YSA9IHt9XHJcbn1cclxuIl19