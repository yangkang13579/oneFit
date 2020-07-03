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

  return Zhonghua;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(Zhonghua , 'pages/zhonghua'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInpob25naHVhLmpzIl0sIm5hbWVzIjpbIlpob25naHVhIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJjb21wb25lbnRzIiwiZGF0YSIsIm1ldGhvZHMiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFRTs7OztBQUNBOzs7Ozs7Ozs7OztBQUZBOzs7SUFHcUJBLFE7Ozs7Ozs7Ozs7Ozs7OzBMQUNuQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDUEMsOEJBQXdCLE1BRGpCO0FBRVBDLG9DQUE4QjtBQUZ2QixLLFFBSVRDLFUsR0FBYSxFLFFBQ2JDLEksR0FBTyxFLFFBR1BDLE8sR0FBVSxFOzs7OzsrQkFFQSxDQUFFO0FBQ1o7OzsyQkFDTSxDQUVOOzs7NkJBQ1MsQ0FFVDs7O3VDQUNpQixDQUNsQjs7OztFQXJCcUNDLGVBQUtDLEk7O2tCQUF0QlYsUSIsImZpbGUiOiJ6aG9uZ2h1YS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuICAvKiBnbG9iYWwgd3ggKi9cbiAgaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XG4gIGltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vbWl4aW5zL3BhZ2UnO1xuICBleHBvcnQgZGVmYXVsdCBjbGFzcyBaaG9uZ2h1YSBleHRlbmRzIHdlcHkucGFnZSB7XG4gICAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XG4gICAgY29uZmlnID0ge1xuICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+S4reWMluS9nOeJqScsXG4gICAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiAnI2ZmZidcbiAgICB9O1xuICAgIGNvbXBvbmVudHMgPSB7fTtcbiAgICBkYXRhID0ge1xuICAgICBcbiAgICB9O1xuICAgIG1ldGhvZHMgPSB7XG4gICAgfTtcbiAgIGluaXREYXRhKCkgeyAvL+WIneWni+WMluaVsOaNrlxuICAgfVxuICAgaW5pdCgpIHtcbiAgICAgXG4gICB9XG4gICBvbkxvYWQgKCkge1xuICAgXG4gICB9XG4gIHdoZW5BcHBSZWFkeVNob3coKSB7XG4gIH1cbiAgIFxuIH1cbiJdfQ==