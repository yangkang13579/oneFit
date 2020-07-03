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


var Contact = function (_wepy$page) {
  _inherits(Contact, _wepy$page);

  function Contact() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Contact);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Contact.__proto__ || Object.getPrototypeOf(Contact)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarTitleText: '联系我们',
      navigationBarBackgroundColor: '#fff'
    }, _this.components = {}, _this.data = {}, _this.methods = {}, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Contact, [{
    key: 'initData',
    value: function initData() {//初始化数据
    }
  }, {
    key: 'init',
    value: function init() {}
  }, {
    key: 'onLoad',
    value: function onLoad() {}
  }, {
    key: 'whenAppReadyShow',
    value: function whenAppReadyShow() {}
  }]);

  return Contact;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(Contact , 'pages/contact'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRhY3QuanMiXSwibmFtZXMiOlsiQ29udGFjdCIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImRhdGEiLCJtZXRob2RzIiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUU7Ozs7QUFDQTs7Ozs7Ozs7Ozs7QUFGQTs7O0lBR3FCQSxPOzs7Ozs7Ozs7Ozs7Ozt3TEFDbkJDLE0sR0FBUyxDQUFDQyxjQUFELEMsUUFDVEMsTSxHQUFTO0FBQ1BDLDhCQUF3QixNQURqQjtBQUVQQyxvQ0FBOEI7QUFGdkIsSyxRQUlUQyxVLEdBQWEsRSxRQUNiQyxJLEdBQU8sRSxRQUdQQyxPLEdBQVUsRTs7Ozs7K0JBRUEsQ0FBRTtBQUNaOzs7MkJBQ00sQ0FFTjs7OzZCQUNTLENBRVQ7Ozt1Q0FDaUIsQ0FDbEI7Ozs7RUFyQm9DQyxlQUFLQyxJOztrQkFBckJWLE8iLCJmaWxlIjoiY29udGFjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuICAvKiBnbG9iYWwgd3ggKi9cbiAgaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XG4gIGltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vbWl4aW5zL3BhZ2UnO1xuICBleHBvcnQgZGVmYXVsdCBjbGFzcyBDb250YWN0IGV4dGVuZHMgd2VweS5wYWdlIHtcbiAgICBtaXhpbnMgPSBbUGFnZU1peGluXTtcbiAgICBjb25maWcgPSB7XG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn6IGU57O75oiR5LusJyxcbiAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJ1xuICAgIH07XG4gICAgY29tcG9uZW50cyA9IHt9O1xuICAgIGRhdGEgPSB7XG4gICAgIFxuICAgIH07XG4gICAgbWV0aG9kcyA9IHtcbiAgICB9O1xuICAgaW5pdERhdGEoKSB7IC8v5Yid5aeL5YyW5pWw5o2uXG4gICB9XG4gICBpbml0KCkge1xuICAgICBcbiAgIH1cbiAgIG9uTG9hZCAoKSB7XG4gICBcbiAgIH1cbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcbiAgfVxuICAgXG4gfVxuIl19