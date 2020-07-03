'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import abc from 'abc'

var Demo = function (_wepy$component) {
    _inherits(Demo, _wepy$component);

    function Demo() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Demo);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Demo.__proto__ || Object.getPrototypeOf(Demo)).call.apply(_ref, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
    }

    return Demo;
}(_wepy2.default.component);

var _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.props = {
        num: {
            type: [Number, String],
            coerce: function coerce(v) {
                return +v;
            },
            default: 50
        }
    };
    this.data = {};
    this.events = {
        'index-broadcast': function indexBroadcast() {
            var _ref2;

            var $event = (_ref2 = arguments.length - 1, arguments.length <= _ref2 ? undefined : arguments[_ref2]);
            console.log(_this2.$name + ' receive ' + $event.name + ' from ' + $event.source.$name);
        }
    };
    this.watch = {
        num: function num(curVal, oldVal) {
            console.log('\u65E7\u503C\uFF1A' + oldVal + '\uFF0C\u65B0\u503C\uFF1A' + curVal);
        }
    };
    this.methods = {
        plus: function plus() {
            this.num = this.num + 1;
            console.log(this.$name + ' plus tap');

            this.$emit('index-emit', 1, 2, 3);
        },
        minus: function minus() {
            this.num = this.num - 1;
            console.log(this.$name + ' minus tap');
        }
    };
};

exports.default = Demo;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlbW8uanMiXSwibmFtZXMiOlsiRGVtbyIsIndlcHkiLCJjb21wb25lbnQiLCJwcm9wcyIsIm51bSIsInR5cGUiLCJOdW1iZXIiLCJTdHJpbmciLCJjb2VyY2UiLCJ2IiwiZGVmYXVsdCIsImRhdGEiLCJldmVudHMiLCIkZXZlbnQiLCJsZW5ndGgiLCJjb25zb2xlIiwibG9nIiwiJG5hbWUiLCJuYW1lIiwic291cmNlIiwid2F0Y2giLCJjdXJWYWwiLCJvbGRWYWwiLCJtZXRob2RzIiwicGx1cyIsIiRlbWl0IiwibWludXMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFDQTs7SUFFcUJBLEk7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQUFhQyxlQUFLQyxTOzs7OztTQUNyQ0MsSyxHQUFRO0FBQ0pDLGFBQUs7QUFDREMsa0JBQU0sQ0FBQ0MsTUFBRCxFQUFTQyxNQUFULENBREw7QUFFREMsb0JBQVEsZ0JBQVNDLENBQVQsRUFBWTtBQUNoQix1QkFBTyxDQUFDQSxDQUFSO0FBQ0gsYUFKQTtBQUtEQyxxQkFBUztBQUxSO0FBREQsSztTQVVSQyxJLEdBQU8sRTtTQUNQQyxNLEdBQVM7QUFDTCwyQkFBbUIsMEJBQWE7QUFBQTs7QUFDNUIsZ0JBQUlDLGtCQUFjLFVBQUtDLE1BQUwsR0FBYyxDQUE1QiwyREFBSjtBQUNBQyxvQkFBUUMsR0FBUixDQUNPLE9BQUtDLEtBRFosaUJBQzZCSixPQUFPSyxJQURwQyxjQUNpREwsT0FBT00sTUFBUCxDQUFjRixLQUQvRDtBQUdIO0FBTkksSztTQVNURyxLLEdBQVE7QUFDSmhCLFdBREksZUFDQWlCLE1BREEsRUFDUUMsTUFEUixFQUNnQjtBQUNoQlAsb0JBQVFDLEdBQVIsd0JBQWtCTSxNQUFsQixnQ0FBK0JELE1BQS9CO0FBQ0g7QUFIRyxLO1NBTVJFLE8sR0FBVTtBQUNOQyxZQURNLGtCQUNDO0FBQ0gsaUJBQUtwQixHQUFMLEdBQVcsS0FBS0EsR0FBTCxHQUFXLENBQXRCO0FBQ0FXLG9CQUFRQyxHQUFSLENBQVksS0FBS0MsS0FBTCxHQUFhLFdBQXpCOztBQUVBLGlCQUFLUSxLQUFMLENBQVcsWUFBWCxFQUF5QixDQUF6QixFQUE0QixDQUE1QixFQUErQixDQUEvQjtBQUNILFNBTks7QUFPTkMsYUFQTSxtQkFPRTtBQUNKLGlCQUFLdEIsR0FBTCxHQUFXLEtBQUtBLEdBQUwsR0FBVyxDQUF0QjtBQUNBVyxvQkFBUUMsR0FBUixDQUFZLEtBQUtDLEtBQUwsR0FBYSxZQUF6QjtBQUNIO0FBVkssSzs7O2tCQTNCU2pCLEkiLCJmaWxlIjoiZGVtby5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuLy8gaW1wb3J0IGFiYyBmcm9tICdhYmMnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZW1vIGV4dGVuZHMgd2VweS5jb21wb25lbnQge1xyXG4gIHByb3BzID0ge1xyXG4gICAgICBudW06IHtcclxuICAgICAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICAgICAgICBjb2VyY2U6IGZ1bmN0aW9uKHYpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gK3Y7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZGVmYXVsdDogNTBcclxuICAgICAgfVxyXG4gIH07XHJcblxyXG4gIGRhdGEgPSB7fTtcclxuICBldmVudHMgPSB7XHJcbiAgICAgICdpbmRleC1icm9hZGNhc3QnOiAoLi4uYXJncykgPT4ge1xyXG4gICAgICAgICAgbGV0ICRldmVudCA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgICAgIGAke3RoaXMuJG5hbWV9IHJlY2VpdmUgJHskZXZlbnQubmFtZX0gZnJvbSAkeyRldmVudC5zb3VyY2UuJG5hbWV9YFxyXG4gICAgICAgICAgKTtcclxuICAgICAgfVxyXG4gIH07XHJcblxyXG4gIHdhdGNoID0ge1xyXG4gICAgICBudW0oY3VyVmFsLCBvbGRWYWwpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGDml6flgLzvvJoke29sZFZhbH3vvIzmlrDlgLzvvJoke2N1clZhbH1gKTtcclxuICAgICAgfVxyXG4gIH07XHJcblxyXG4gIG1ldGhvZHMgPSB7XHJcbiAgICAgIHBsdXMoKSB7XHJcbiAgICAgICAgICB0aGlzLm51bSA9IHRoaXMubnVtICsgMTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuJG5hbWUgKyAnIHBsdXMgdGFwJyk7XHJcblxyXG4gICAgICAgICAgdGhpcy4kZW1pdCgnaW5kZXgtZW1pdCcsIDEsIDIsIDMpO1xyXG4gICAgICB9LFxyXG4gICAgICBtaW51cygpIHtcclxuICAgICAgICAgIHRoaXMubnVtID0gdGhpcy5udW0gLSAxO1xyXG4gICAgICAgICAgY29uc29sZS5sb2codGhpcy4kbmFtZSArICcgbWludXMgdGFwJyk7XHJcbiAgICAgIH1cclxuICB9O1xyXG59XHJcbiJdfQ==