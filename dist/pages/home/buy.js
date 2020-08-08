"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _headers = require('./../../components/headers.js');

var _headers2 = _interopRequireDefault(_headers);

var _page = require('./../../mixins/page.js');

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* global wx */


var Course = function (_wepy$page) {
  _inherits(Course, _wepy$page);

  function Course() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Course);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Course.__proto__ || Object.getPrototypeOf(Course)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarBackgroundColor: "#fff"
    }, _this.components = {
      header: _headers2.default
    }, _this.data = {
      hoverIndex: 0,
      height: "",
      userInfo: {},
      branchId: null,
      list: []
    }, _this.methods = {
      currentFun: function currentFun(e) {
        this.hoverIndex = e.currentTarget.dataset.index;
      },
      buyText: function buyText() {
        wx.navigateTo({
          url: "/pages/home/buyNext?branchId=" + this.branchId + "&carId=" + this.list[this.hoverIndex].id
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Course, [{
    key: "whenAppReadyShow",
    value: function whenAppReadyShow(options) {
      var _this2 = this;

      var that = this;
      this.fetchDataPromise("user/userFit.json", {
        action: "buy",
        branchId: this.branchId
      }).then(function (data) {
        _this2.list = data.items;
        _this2.carId = _this2.list[0].id;
        _this2.$apply();
      });
    }
  }, {
    key: "onLoad",
    value: function onLoad(options) {
      var that = this;
      this.branchId = options.branchId;
      wx.getStorage({
        key: "userInfo",
        success: function success(res) {
          that.userInfo = JSON.parse(res.data);
        }
      });
    }
  }, {
    key: "onShow",
    value: function onShow() {
      var _this3 = this;

      wx.getSystemInfo({
        success: function success(res) {
          _this3.height = res.statusBarHeight;
          _this3.$broadcast("index-broadcast", {
            height: _this3.height,
            text: "OneFit健身"
          });
        }
      });
    }
  }]);

  return Course;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Course , 'pages/home/buy'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1eS5qcyJdLCJuYW1lcyI6WyJDb3Vyc2UiLCJtaXhpbnMiLCJQYWdlTWl4aW4iLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImhlYWRlciIsImRhdGEiLCJob3ZlckluZGV4IiwiaGVpZ2h0IiwidXNlckluZm8iLCJicmFuY2hJZCIsImxpc3QiLCJtZXRob2RzIiwiY3VycmVudEZ1biIsImUiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsImluZGV4IiwiYnV5VGV4dCIsInd4IiwibmF2aWdhdGVUbyIsInVybCIsImlkIiwib3B0aW9ucyIsInRoYXQiLCJmZXRjaERhdGFQcm9taXNlIiwiYWN0aW9uIiwidGhlbiIsIml0ZW1zIiwiY2FySWQiLCIkYXBwbHkiLCJnZXRTdG9yYWdlIiwia2V5Iiwic3VjY2VzcyIsInJlcyIsIkpTT04iLCJwYXJzZSIsImdldFN5c3RlbUluZm8iLCJzdGF0dXNCYXJIZWlnaHQiLCIkYnJvYWRjYXN0IiwidGV4dCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7QUFIQTs7O0lBSXFCQSxNOzs7Ozs7Ozs7Ozs7OztzTEFDbkJDLE0sR0FBUyxDQUFDQyxjQUFELEMsUUFDVEMsTSxHQUFTO0FBQ1BDLG9DQUE4QjtBQUR2QixLLFFBR1RDLFUsR0FBYTtBQUNYQztBQURXLEssUUFHYkMsSSxHQUFPO0FBQ0xDLGtCQUFZLENBRFA7QUFFTEMsY0FBUSxFQUZIO0FBR0xDLGdCQUFVLEVBSEw7QUFJTEMsZ0JBQVUsSUFKTDtBQUtMQyxZQUFNO0FBTEQsSyxRQWtCUEMsTyxHQUFVO0FBQ1JDLGdCQURRLHNCQUNHQyxDQURILEVBQ007QUFDWixhQUFLUCxVQUFMLEdBQWtCTyxFQUFFQyxhQUFGLENBQWdCQyxPQUFoQixDQUF3QkMsS0FBMUM7QUFDRCxPQUhPO0FBSVJDLGFBSlEscUJBSUU7QUFDUkMsV0FBR0MsVUFBSCxDQUFjO0FBQ1pDLGVBQ0Usa0NBQ0EsS0FBS1gsUUFETCxHQUVBLFNBRkEsR0FHQSxLQUFLQyxJQUFMLENBQVUsS0FBS0osVUFBZixFQUEyQmU7QUFMakIsU0FBZDtBQU9EO0FBWk8sSzs7Ozs7cUNBWE9DLE8sRUFBUztBQUFBOztBQUN4QixVQUFJQyxPQUFPLElBQVg7QUFDQSxXQUFLQyxnQkFBTCxDQUFzQixtQkFBdEIsRUFBMkM7QUFDekNDLGdCQUFRLEtBRGlDO0FBRXpDaEIsa0JBQVUsS0FBS0E7QUFGMEIsT0FBM0MsRUFHR2lCLElBSEgsQ0FHUSxnQkFBUTtBQUNkLGVBQUtoQixJQUFMLEdBQVlMLEtBQUtzQixLQUFqQjtBQUNBLGVBQUtDLEtBQUwsR0FBYSxPQUFLbEIsSUFBTCxDQUFVLENBQVYsRUFBYVcsRUFBMUI7QUFDQSxlQUFLUSxNQUFMO0FBQ0QsT0FQRDtBQVFEOzs7MkJBZU1QLE8sRUFBUztBQUNkLFVBQUlDLE9BQU8sSUFBWDtBQUNBLFdBQUtkLFFBQUwsR0FBZ0JhLFFBQVFiLFFBQXhCO0FBQ0FTLFNBQUdZLFVBQUgsQ0FBYztBQUNaQyxhQUFLLFVBRE87QUFFWkMsZUFGWSxtQkFFSkMsR0FGSSxFQUVDO0FBQ1hWLGVBQUtmLFFBQUwsR0FBZ0IwQixLQUFLQyxLQUFMLENBQVdGLElBQUk1QixJQUFmLENBQWhCO0FBQ0Q7QUFKVyxPQUFkO0FBTUQ7Ozs2QkFDUTtBQUFBOztBQUNQYSxTQUFHa0IsYUFBSCxDQUFpQjtBQUNmSixpQkFBUyxzQkFBTztBQUNkLGlCQUFLekIsTUFBTCxHQUFjMEIsSUFBSUksZUFBbEI7QUFDQSxpQkFBS0MsVUFBTCxDQUFnQixpQkFBaEIsRUFBbUM7QUFDakMvQixvQkFBUSxPQUFLQSxNQURvQjtBQUVqQ2dDLGtCQUFNO0FBRjJCLFdBQW5DO0FBSUQ7QUFQYyxPQUFqQjtBQVNEOzs7O0VBNURpQ0MsZUFBS0MsSTs7a0JBQXBCM0MsTSIsImZpbGUiOiJidXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qIGdsb2JhbCB3eCAqL1xuaW1wb3J0IHdlcHkgZnJvbSBcIndlcHlcIjtcbmltcG9ydCBoZWFkZXIgZnJvbSBcIi4uLy4uL2NvbXBvbmVudHMvaGVhZGVyc1wiO1xuaW1wb3J0IFBhZ2VNaXhpbiBmcm9tIFwiLi4vLi4vbWl4aW5zL3BhZ2VcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvdXJzZSBleHRlbmRzIHdlcHkucGFnZSB7XG4gIG1peGlucyA9IFtQYWdlTWl4aW5dO1xuICBjb25maWcgPSB7XG4gICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcbiAgfTtcbiAgY29tcG9uZW50cyA9IHtcbiAgICBoZWFkZXJcbiAgfTtcbiAgZGF0YSA9IHtcbiAgICBob3ZlckluZGV4OiAwLFxuICAgIGhlaWdodDogXCJcIixcbiAgICB1c2VySW5mbzoge30sXG4gICAgYnJhbmNoSWQ6IG51bGwsXG4gICAgbGlzdDogW11cbiAgfTtcbiAgd2hlbkFwcFJlYWR5U2hvdyhvcHRpb25zKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcInVzZXIvdXNlckZpdC5qc29uXCIsIHtcbiAgICAgIGFjdGlvbjogXCJidXlcIixcbiAgICAgIGJyYW5jaElkOiB0aGlzLmJyYW5jaElkXG4gICAgfSkudGhlbihkYXRhID0+IHtcbiAgICAgIHRoaXMubGlzdCA9IGRhdGEuaXRlbXM7XG4gICAgICB0aGlzLmNhcklkID0gdGhpcy5saXN0WzBdLmlkO1xuICAgICAgdGhpcy4kYXBwbHkoKTtcbiAgICB9KTtcbiAgfVxuICBtZXRob2RzID0ge1xuICAgIGN1cnJlbnRGdW4oZSkge1xuICAgICAgdGhpcy5ob3ZlckluZGV4ID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXg7XG4gICAgfSxcbiAgICBidXlUZXh0KCkge1xuICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgIHVybDpcbiAgICAgICAgICBcIi9wYWdlcy9ob21lL2J1eU5leHQ/YnJhbmNoSWQ9XCIgK1xuICAgICAgICAgIHRoaXMuYnJhbmNoSWQgK1xuICAgICAgICAgIFwiJmNhcklkPVwiICtcbiAgICAgICAgICB0aGlzLmxpc3RbdGhpcy5ob3ZlckluZGV4XS5pZFxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBvbkxvYWQob3B0aW9ucykge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB0aGlzLmJyYW5jaElkID0gb3B0aW9ucy5icmFuY2hJZDtcbiAgICB3eC5nZXRTdG9yYWdlKHtcbiAgICAgIGtleTogXCJ1c2VySW5mb1wiLFxuICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgdGhhdC51c2VySW5mbyA9IEpTT04ucGFyc2UocmVzLmRhdGEpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIG9uU2hvdygpIHtcbiAgICB3eC5nZXRTeXN0ZW1JbmZvKHtcbiAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gcmVzLnN0YXR1c0JhckhlaWdodDtcbiAgICAgICAgdGhpcy4kYnJvYWRjYXN0KFwiaW5kZXgtYnJvYWRjYXN0XCIsIHtcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxuICAgICAgICAgIHRleHQ6IFwiT25lRml05YGl6LqrXCJcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==