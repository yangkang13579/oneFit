'use strict';

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

// import abc from 'abc'

var Tabbar = function (_wepy$component) {
    _inherits(Tabbar, _wepy$component);

    function Tabbar() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Tabbar);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Tabbar.__proto__ || Object.getPrototypeOf(Tabbar)).call.apply(_ref, [this].concat(args))), _this), _this.props = {
            active: String
        }, _this.data = {
            items: [{
                icon: '../images/nav-icon-1.png',
                iconActive: '../images/nav-icon-1-1.png',
                name: '主页',
                active: false,
                url: 'index'
            }, {
                icon: '../images/nav-icon-2.png',
                iconActive: '../images/nav-icon-2-1.png',
                name: '我的',
                active: false,
                url: 'user'
            }]
        }, _this.watch = {
            activeIndex: function activeIndex(curVal, oldVal) {
                console.log('\u65E7\u503C\uFF1A' + oldVal + '\uFF0C\u65B0\u503C\uFF1A' + curVal);
                this.items[curVal].active = true;
                this.items[oldVal].active = true;
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Tabbar, [{
        key: 'onLoad',
        value: function onLoad() {
            this.items[this.active / 1].active = true;
        }
    }]);

    return Tabbar;
}(_wepy2.default.component);

exports.default = Tabbar;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRhYmJhci5qcyJdLCJuYW1lcyI6WyJUYWJiYXIiLCJwcm9wcyIsImFjdGl2ZSIsIlN0cmluZyIsImRhdGEiLCJpdGVtcyIsImljb24iLCJpY29uQWN0aXZlIiwibmFtZSIsInVybCIsIndhdGNoIiwiYWN0aXZlSW5kZXgiLCJjdXJWYWwiLCJvbGRWYWwiLCJjb25zb2xlIiwibG9nIiwid2VweSIsImNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBQ0E7O0lBRXFCQSxNOzs7Ozs7Ozs7Ozs7OzswTEFDbkJDLEssR0FBUTtBQUNKQyxvQkFBUUM7QUFESixTLFFBSVJDLEksR0FBTztBQUNIQyxtQkFBTyxDQUNIO0FBQ0lDLHNCQUFNLDBCQURWO0FBRUlDLDRCQUFZLDRCQUZoQjtBQUdJQyxzQkFBTSxJQUhWO0FBSUlOLHdCQUFRLEtBSlo7QUFLSU8scUJBQUs7QUFMVCxhQURHLEVBUUg7QUFDSUgsc0JBQU0sMEJBRFY7QUFFSUMsNEJBQVksNEJBRmhCO0FBR0lDLHNCQUFNLElBSFY7QUFJSU4sd0JBQVEsS0FKWjtBQUtJTyxxQkFBSztBQUxULGFBUkc7QUFESixTLFFBa0JOQyxLLEdBQVE7QUFDSkMsdUJBREksdUJBQ1FDLE1BRFIsRUFDZ0JDLE1BRGhCLEVBQ3dCO0FBQ3hCQyx3QkFBUUMsR0FBUix3QkFBa0JGLE1BQWxCLGdDQUErQkQsTUFBL0I7QUFDQSxxQkFBS1AsS0FBTCxDQUFXTyxNQUFYLEVBQW1CVixNQUFuQixHQUE0QixJQUE1QjtBQUNBLHFCQUFLRyxLQUFMLENBQVdRLE1BQVgsRUFBbUJYLE1BQW5CLEdBQTRCLElBQTVCO0FBQ0g7QUFMRyxTOzs7OztpQ0FPQztBQUNMLGlCQUFLRyxLQUFMLENBQVcsS0FBS0gsTUFBTCxHQUFjLENBQXpCLEVBQTRCQSxNQUE1QixHQUFxQyxJQUFyQztBQUNIOzs7O0VBaENnQ2MsZUFBS0MsUzs7a0JBQXBCakIsTSIsImZpbGUiOiJ0YWJiYXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbi8vIGltcG9ydCBhYmMgZnJvbSAnYWJjJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGFiYmFyIGV4dGVuZHMgd2VweS5jb21wb25lbnQge1xyXG4gIHByb3BzID0ge1xyXG4gICAgICBhY3RpdmU6IFN0cmluZ1xyXG4gIH07XHJcblxyXG4gIGRhdGEgPSB7XHJcbiAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgaWNvbjogJy4uL2ltYWdlcy9uYXYtaWNvbi0xLnBuZycsXHJcbiAgICAgICAgICAgICAgaWNvbkFjdGl2ZTogJy4uL2ltYWdlcy9uYXYtaWNvbi0xLTEucG5nJyxcclxuICAgICAgICAgICAgICBuYW1lOiAn5Li76aG1JyxcclxuICAgICAgICAgICAgICBhY3RpdmU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIHVybDogJ2luZGV4J1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBpY29uOiAnLi4vaW1hZ2VzL25hdi1pY29uLTIucG5nJyxcclxuICAgICAgICAgICAgICBpY29uQWN0aXZlOiAnLi4vaW1hZ2VzL25hdi1pY29uLTItMS5wbmcnLFxyXG4gICAgICAgICAgICAgIG5hbWU6ICfmiJHnmoQnLFxyXG4gICAgICAgICAgICAgIGFjdGl2ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdXJsOiAndXNlcidcclxuICAgICAgICAgIH0sXHJcbiAgICAgIF1cclxuICB9O1xyXG4gICB3YXRjaCA9IHtcclxuICAgICAgIGFjdGl2ZUluZGV4KGN1clZhbCwgb2xkVmFsKSB7XHJcbiAgICAgICAgICAgY29uc29sZS5sb2coYOaXp+WAvO+8miR7b2xkVmFsfe+8jOaWsOWAvO+8miR7Y3VyVmFsfWApO1xyXG4gICAgICAgICAgIHRoaXMuaXRlbXNbY3VyVmFsXS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgIHRoaXMuaXRlbXNbb2xkVmFsXS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICB9XHJcbiAgIG9uTG9hZCgpIHtcclxuICAgICAgIHRoaXMuaXRlbXNbdGhpcy5hY3RpdmUgLyAxXS5hY3RpdmUgPSB0cnVlO1xyXG4gICB9XHJcbn1cclxuIl19