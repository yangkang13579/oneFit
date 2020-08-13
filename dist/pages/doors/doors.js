"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _page = require('./../../mixins/page.js');

var _page2 = _interopRequireDefault(_page);

var _tabBar = require('./../../components/tabBar.js');

var _tabBar2 = _interopRequireDefault(_tabBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* global wx */


var User = function (_wepy$page) {
  _inherits(User, _wepy$page);

  function User() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, User);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = User.__proto__ || Object.getPrototypeOf(User)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarTitleText: "OneFit健身"
    }, _this.components = {
      tabBar: _tabBar2.default
    }, _this.data = {
      height: "",
      list: []
    }, _this.methods = {
      goDoor: function goDoor(e) {
        wx.navigateTo({
          url: "/pages/doors/doorsDetails?id=" + e.currentTarget.dataset.item.id
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(User, [{
    key: "onShow",
    value: function onShow() {
      wx.hideTabBar();
      var that = this;
      wx.getStorage({
        key: "userInfo",
        success: function success(res) {
          that.userInfo = JSON.parse(res.data);
          that.$broadcast("tab", {
            current: 1,
            userInfo: that.userInfo
          });
        }
      });
    }
  }, {
    key: "onLoad",
    value: function onLoad() {
      var _this2 = this;

      wx.getSystemInfo({
        success: function success(res) {
          _this2.height = res.statusBarHeight;
        }
      });
    }
  }, {
    key: "whenAppReadyShow",
    value: function whenAppReadyShow() {
      var _this3 = this;

      var that = this;
      this.fetchDataPromise("page/branch.json", {}).then(function (data) {
        _this3.list = data.branchs;
        _this3.$apply();
      });
    }
  }, {
    key: "onShareAppMessage",
    value: function onShareAppMessage(res) {}
  }, {
    key: "regionchange",
    value: function regionchange(e) {}
  }, {
    key: "markertap",
    value: function markertap(e) {}
  }, {
    key: "controltap",
    value: function controltap(e) {}
  }]);

  return User;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(User , 'pages/doors/doors'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvb3JzLmpzIl0sIm5hbWVzIjpbIlVzZXIiLCJtaXhpbnMiLCJQYWdlTWl4aW4iLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwiY29tcG9uZW50cyIsInRhYkJhciIsImRhdGEiLCJoZWlnaHQiLCJsaXN0IiwibWV0aG9kcyIsImdvRG9vciIsImUiLCJ3eCIsIm5hdmlnYXRlVG8iLCJ1cmwiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsIml0ZW0iLCJpZCIsImhpZGVUYWJCYXIiLCJ0aGF0IiwiZ2V0U3RvcmFnZSIsImtleSIsInN1Y2Nlc3MiLCJyZXMiLCJ1c2VySW5mbyIsIkpTT04iLCJwYXJzZSIsIiRicm9hZGNhc3QiLCJjdXJyZW50IiwiZ2V0U3lzdGVtSW5mbyIsInN0YXR1c0JhckhlaWdodCIsImZldGNoRGF0YVByb21pc2UiLCJ0aGVuIiwiYnJhbmNocyIsIiRhcHBseSIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7QUFIQTs7O0lBSXFCQSxJOzs7Ozs7Ozs7Ozs7OztrTEFDbkJDLE0sR0FBUyxDQUFDQyxjQUFELEMsUUFDVEMsTSxHQUFTO0FBQ1BDLDhCQUF3QjtBQURqQixLLFFBR1RDLFUsR0FBYTtBQUNYQztBQURXLEssUUFHYkMsSSxHQUFPO0FBQ0xDLGNBQVEsRUFESDtBQUVMQyxZQUFNO0FBRkQsSyxRQUlQQyxPLEdBQVU7QUFDUkMsWUFEUSxrQkFDREMsQ0FEQyxFQUNFO0FBQ1JDLFdBQUdDLFVBQUgsQ0FBYztBQUNaQyxlQUFLLGtDQUFrQ0gsRUFBRUksYUFBRixDQUFnQkMsT0FBaEIsQ0FBd0JDLElBQXhCLENBQTZCQztBQUR4RCxTQUFkO0FBR0Q7QUFMTyxLOzs7Ozs2QkFPRDtBQUNQTixTQUFHTyxVQUFIO0FBQ0EsVUFBSUMsT0FBTyxJQUFYO0FBQ0FSLFNBQUdTLFVBQUgsQ0FBYztBQUNaQyxhQUFLLFVBRE87QUFFWkMsZUFGWSxtQkFFSkMsR0FGSSxFQUVDO0FBQ1hKLGVBQUtLLFFBQUwsR0FBZ0JDLEtBQUtDLEtBQUwsQ0FBV0gsSUFBSWxCLElBQWYsQ0FBaEI7QUFDQWMsZUFBS1EsVUFBTCxDQUFnQixLQUFoQixFQUF1QjtBQUNyQkMscUJBQVMsQ0FEWTtBQUVyQkosc0JBQVVMLEtBQUtLO0FBRk0sV0FBdkI7QUFJRDtBQVJXLE9BQWQ7QUFVRDs7OzZCQUNRO0FBQUE7O0FBQ1BiLFNBQUdrQixhQUFILENBQWlCO0FBQ2ZQLGlCQUFTLHNCQUFPO0FBQ2QsaUJBQUtoQixNQUFMLEdBQWNpQixJQUFJTyxlQUFsQjtBQUNEO0FBSGMsT0FBakI7QUFLRDs7O3VDQUNrQjtBQUFBOztBQUNqQixVQUFJWCxPQUFPLElBQVg7QUFDQSxXQUFLWSxnQkFBTCxDQUFzQixrQkFBdEIsRUFBMEMsRUFBMUMsRUFBOENDLElBQTlDLENBQW1ELGdCQUFRO0FBQ3pELGVBQUt6QixJQUFMLEdBQVlGLEtBQUs0QixPQUFqQjtBQUNBLGVBQUtDLE1BQUw7QUFDRCxPQUhEO0FBSUQ7OztzQ0FDaUJYLEcsRUFBSyxDQUFFOzs7aUNBQ1piLEMsRUFBRyxDQUFFOzs7OEJBQ1JBLEMsRUFBRyxDQUFFOzs7K0JBQ0pBLEMsRUFBRyxDQUFFOzs7O0VBbERnQnlCLGVBQUtDLEk7O2tCQUFsQnRDLEkiLCJmaWxlIjoiZG9vcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qIGdsb2JhbCB3eCAqL1xuaW1wb3J0IHdlcHkgZnJvbSBcIndlcHlcIjtcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSBcIi4uLy4uL21peGlucy9wYWdlXCI7XG5pbXBvcnQgdGFiQmFyIGZyb20gXCIuLi8uLi9jb21wb25lbnRzL3RhYkJhclwiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXNlciBleHRlbmRzIHdlcHkucGFnZSB7XG4gIG1peGlucyA9IFtQYWdlTWl4aW5dO1xuICBjb25maWcgPSB7XG4gICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogXCJPbmVGaXTlgaXouqtcIlxuICB9O1xuICBjb21wb25lbnRzID0ge1xuICAgIHRhYkJhclxuICB9O1xuICBkYXRhID0ge1xuICAgIGhlaWdodDogXCJcIixcbiAgICBsaXN0OiBbXVxuICB9O1xuICBtZXRob2RzID0ge1xuICAgIGdvRG9vcihlKSB7XG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgdXJsOiBcIi9wYWdlcy9kb29ycy9kb29yc0RldGFpbHM/aWQ9XCIgKyBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pdGVtLmlkXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIG9uU2hvdygpIHtcbiAgICB3eC5oaWRlVGFiQmFyKCk7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHd4LmdldFN0b3JhZ2Uoe1xuICAgICAga2V5OiBcInVzZXJJbmZvXCIsXG4gICAgICBzdWNjZXNzKHJlcykge1xuICAgICAgICB0aGF0LnVzZXJJbmZvID0gSlNPTi5wYXJzZShyZXMuZGF0YSk7XG4gICAgICAgIHRoYXQuJGJyb2FkY2FzdChcInRhYlwiLCB7XG4gICAgICAgICAgY3VycmVudDogMSxcbiAgICAgICAgICB1c2VySW5mbzogdGhhdC51c2VySW5mb1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBvbkxvYWQoKSB7XG4gICAgd3guZ2V0U3lzdGVtSW5mbyh7XG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICB0aGlzLmhlaWdodCA9IHJlcy5zdGF0dXNCYXJIZWlnaHQ7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKFwicGFnZS9icmFuY2guanNvblwiLCB7fSkudGhlbihkYXRhID0+IHtcbiAgICAgIHRoaXMubGlzdCA9IGRhdGEuYnJhbmNocztcbiAgICAgIHRoaXMuJGFwcGx5KCk7XG4gICAgfSk7XG4gIH1cbiAgb25TaGFyZUFwcE1lc3NhZ2UocmVzKSB7fVxuICByZWdpb25jaGFuZ2UoZSkge31cbiAgbWFya2VydGFwKGUpIHt9XG4gIGNvbnRyb2x0YXAoZSkge31cbn1cbiJdfQ==