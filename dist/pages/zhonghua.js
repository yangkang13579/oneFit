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


var Zhonghua = function (_wepy$page) {
  _inherits(Zhonghua, _wepy$page);

  function Zhonghua() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Zhonghua);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Zhonghua.__proto__ || Object.getPrototypeOf(Zhonghua)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarTitleText: '中化作物',
      navigationBarBackgroundColor: '#fff'
    }, _this.components = {}, _this.data = {}, _this.methods = {}, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Zhonghua, [{
    key: 'initData',
    value: function initData() {// 初始化数据
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

  return Zhonghua;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(Zhonghua , 'pages/zhonghua'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInpob25naHVhLmpzIl0sIm5hbWVzIjpbIlpob25naHVhIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJjb21wb25lbnRzIiwiZGF0YSIsIm1ldGhvZHMiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFRTs7OztBQUNBOzs7Ozs7Ozs7OztBQUZBOzs7SUFHcUJBLFE7Ozs7Ozs7Ozs7Ozs7OzBMQUNuQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDTEMsOEJBQXdCLE1BRG5CO0FBRUxDLG9DQUE4QjtBQUZ6QixLLFFBSVRDLFUsR0FBYSxFLFFBQ2JDLEksR0FBTyxFLFFBR1BDLE8sR0FBVSxFOzs7OzsrQkFFQyxDQUFFO0FBQ1o7OzsyQkFDTSxDQUVOOzs7NkJBQ1MsQ0FFVDs7O3VDQUNnQixDQUNsQjs7OztFQXJCcUNDLGVBQUtDLEk7O2tCQUF0QlYsUSIsImZpbGUiOiJ6aG9uZ2h1YS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4gIC8qIGdsb2JhbCB3eCAqL1xyXG4gIGltcG9ydCB3ZXB5IGZyb20gJ3dlcHknO1xyXG4gIGltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vbWl4aW5zL3BhZ2UnO1xyXG4gIGV4cG9ydCBkZWZhdWx0IGNsYXNzIFpob25naHVhIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAgIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gICAgY29uZmlnID0ge1xyXG4gICAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfkuK3ljJbkvZzniaknLFxyXG4gICAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJ1xyXG4gICAgfTtcclxuICAgIGNvbXBvbmVudHMgPSB7fTtcclxuICAgIGRhdGEgPSB7XHJcbiAgXHJcbiAgICB9O1xyXG4gICAgbWV0aG9kcyA9IHtcclxuICAgIH07XHJcbiAgICBpbml0RGF0YSgpIHsgLy8g5Yid5aeL5YyW5pWw5o2uXHJcbiAgICB9XHJcbiAgICBpbml0KCkge1xyXG4gIFxyXG4gICAgfVxyXG4gICAgb25Mb2FkICgpIHtcclxuICBcclxuICAgIH1cclxuICB3aGVuQXBwUmVhZHlTaG93KCkge1xyXG4gIH1cclxuICBcclxufVxyXG4iXX0=