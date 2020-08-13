"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

  return common;
}(_wepy2.default.component);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.props = {};
  this.data = {
    height: "",
    text: "",
    list: [],
    current: null,
    userInfo: {},
    isCoach: null
  };
  this.watch = {};
  this.events = {
    tab: function tab() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      _this2.current = +args[0].current;
      _this2.isCoach = args[0].userInfo.isCoach;
      if (args[0].userInfo.isCoach) {
        _this2.list = ["门店", "我的"];
      } else {
        _this2.list = ["私教", "门店", "我的"];
      }
    }
  };
  this.methods = {
    tabFun: function tabFun(e) {
      var index = e.currentTarget.dataset.index;
      if (this.isCoach) {
        wx.switchTab({
          url: index === 0 ? "/pages/doors/doors" : "/pages/user/user"
        });
      } else {
        wx.switchTab({
          url: index === 0 ? "/pages/home/home1" : index === 1 ? "/pages/doors/doors" : "/pages/user/user"
        });
      }
    }
  };
};

exports.default = common;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRhYkJhci5qcyJdLCJuYW1lcyI6WyJjb21tb24iLCJ3ZXB5IiwiY29tcG9uZW50IiwicHJvcHMiLCJkYXRhIiwiaGVpZ2h0IiwidGV4dCIsImxpc3QiLCJjdXJyZW50IiwidXNlckluZm8iLCJpc0NvYWNoIiwid2F0Y2giLCJldmVudHMiLCJ0YWIiLCJhcmdzIiwibWV0aG9kcyIsInRhYkZ1biIsImUiLCJpbmRleCIsImN1cnJlbnRUYXJnZXQiLCJkYXRhc2V0Iiwid3giLCJzd2l0Y2hUYWIiLCJ1cmwiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFDcUJBLE07Ozs7Ozs7Ozs7Ozs7Ozs7OztFQUFlQyxlQUFLQyxTOzs7OztPQUN2Q0MsSyxHQUFRLEU7T0FDUkMsSSxHQUFPO0FBQ0xDLFlBQVEsRUFESDtBQUVMQyxVQUFNLEVBRkQ7QUFHTEMsVUFBTSxFQUhEO0FBSUxDLGFBQVMsSUFKSjtBQUtMQyxjQUFVLEVBTEw7QUFNTEMsYUFBUztBQU5KLEc7T0FRUEMsSyxHQUFRLEU7T0FDUkMsTSxHQUFTO0FBQ1BDLFNBQUssZUFBYTtBQUFBLHlDQUFUQyxJQUFTO0FBQVRBLFlBQVM7QUFBQTs7QUFDaEIsYUFBS04sT0FBTCxHQUFlLENBQUNNLEtBQUssQ0FBTCxFQUFRTixPQUF4QjtBQUNBLGFBQUtFLE9BQUwsR0FBZUksS0FBSyxDQUFMLEVBQVFMLFFBQVIsQ0FBaUJDLE9BQWhDO0FBQ0EsVUFBSUksS0FBSyxDQUFMLEVBQVFMLFFBQVIsQ0FBaUJDLE9BQXJCLEVBQThCO0FBQzVCLGVBQUtILElBQUwsR0FBWSxDQUFDLElBQUQsRUFBTyxJQUFQLENBQVo7QUFDRCxPQUZELE1BRU87QUFDTCxlQUFLQSxJQUFMLEdBQVksQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsQ0FBWjtBQUNEO0FBQ0Y7QUFUTSxHO09BV1RRLE8sR0FBVTtBQUNSQyxVQURRLGtCQUNEQyxDQURDLEVBQ0U7QUFDUixVQUFNQyxRQUFRRCxFQUFFRSxhQUFGLENBQWdCQyxPQUFoQixDQUF3QkYsS0FBdEM7QUFDQSxVQUFJLEtBQUtSLE9BQVQsRUFBa0I7QUFDaEJXLFdBQUdDLFNBQUgsQ0FBYTtBQUNYQyxlQUFLTCxVQUFVLENBQVYsR0FBYyxvQkFBZCxHQUFxQztBQUQvQixTQUFiO0FBR0QsT0FKRCxNQUlPO0FBQ0xHLFdBQUdDLFNBQUgsQ0FBYTtBQUNYQyxlQUNFTCxVQUFVLENBQVYsR0FDSSxtQkFESixHQUVJQSxVQUFVLENBQVYsR0FBYyxvQkFBZCxHQUFxQztBQUpoQyxTQUFiO0FBTUQ7QUFDRjtBQWZPLEc7OztrQkF0QlNsQixNIiwiZmlsZSI6InRhYkJhci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHdlcHkgZnJvbSBcIndlcHlcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGNvbW1vbiBleHRlbmRzIHdlcHkuY29tcG9uZW50IHtcbiAgcHJvcHMgPSB7fTtcbiAgZGF0YSA9IHtcbiAgICBoZWlnaHQ6IFwiXCIsXG4gICAgdGV4dDogXCJcIixcbiAgICBsaXN0OiBbXSxcbiAgICBjdXJyZW50OiBudWxsLFxuICAgIHVzZXJJbmZvOiB7fSxcbiAgICBpc0NvYWNoOiBudWxsXG4gIH07XG4gIHdhdGNoID0ge307XG4gIGV2ZW50cyA9IHtcbiAgICB0YWI6ICguLi5hcmdzKSA9PiB7XG4gICAgICB0aGlzLmN1cnJlbnQgPSArYXJnc1swXS5jdXJyZW50O1xuICAgICAgdGhpcy5pc0NvYWNoID0gYXJnc1swXS51c2VySW5mby5pc0NvYWNoO1xuICAgICAgaWYgKGFyZ3NbMF0udXNlckluZm8uaXNDb2FjaCkge1xuICAgICAgICB0aGlzLmxpc3QgPSBbXCLpl6jlupdcIiwgXCLmiJHnmoRcIl07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxpc3QgPSBbXCLnp4HmlZlcIiwgXCLpl6jlupdcIiwgXCLmiJHnmoRcIl07XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBtZXRob2RzID0ge1xuICAgIHRhYkZ1bihlKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4O1xuICAgICAgaWYgKHRoaXMuaXNDb2FjaCkge1xuICAgICAgICB3eC5zd2l0Y2hUYWIoe1xuICAgICAgICAgIHVybDogaW5kZXggPT09IDAgPyBcIi9wYWdlcy9kb29ycy9kb29yc1wiIDogXCIvcGFnZXMvdXNlci91c2VyXCJcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3eC5zd2l0Y2hUYWIoe1xuICAgICAgICAgIHVybDpcbiAgICAgICAgICAgIGluZGV4ID09PSAwXG4gICAgICAgICAgICAgID8gXCIvcGFnZXMvaG9tZS9ob21lMVwiXG4gICAgICAgICAgICAgIDogaW5kZXggPT09IDEgPyBcIi9wYWdlcy9kb29ycy9kb29yc1wiIDogXCIvcGFnZXMvdXNlci91c2VyXCJcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuIl19