"use strict";

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


var SampleDetail = function (_wepy$page) {
  _inherits(SampleDetail, _wepy$page);

  function SampleDetail() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, SampleDetail);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SampleDetail.__proto__ || Object.getPrototypeOf(SampleDetail)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarTitleText: "样品详情",
      navigationBarBackgroundColor: "#fff"
    }, _this.data = {
      //  name: 'myHtmlParserKiner',
      screenWidth: 0,
      imgwidth: 0,
      imgheight: 0,
      id: "",
      list: [],
      background: ["demo-text-1", "demo-text-2", "demo-text-3"],
      indicatorDots: true,
      vertical: false,
      autoplay: false,
      interval: 2000,
      duration: 500
    }, _this.methods = {
      toFrom: function toFrom() {
        wx.navigateTo({
          url: "/pages/form?id=" + this.id
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(SampleDetail, [{
    key: "onLoad",
    value: function onLoad(options) {
      this.id = options.id;
      var self = this;
      wx.getSystemInfo({
        success: function success(res) {
          console.log("res", res);
          var screenWidth = res.windowWidth;
          self.screenWidth = screenWidth;
          self.$apply();
        }
      });
    }
  }, {
    key: "whenAppReadyShow",
    value: function whenAppReadyShow() {
      var _this2 = this;

      this.fetchDataPromise("wx/specimen/querySpecimenApi.json", {
        id: this.id
      }).then(function (data) {
        console.log("11 ", data);
        _this2.list = data.list[0];
        console.log("this.list", _this2.list);
        _this2.$apply();
      }).catch(function (error) {});
    }
  }]);

  return SampleDetail;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(SampleDetail , 'pages/sampleDetail'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNhbXBsZURldGFpbC5qcyJdLCJuYW1lcyI6WyJTYW1wbGVEZXRhaWwiLCJtaXhpbnMiLCJQYWdlTWl4aW4iLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImRhdGEiLCJzY3JlZW5XaWR0aCIsImltZ3dpZHRoIiwiaW1naGVpZ2h0IiwiaWQiLCJsaXN0IiwiYmFja2dyb3VuZCIsImluZGljYXRvckRvdHMiLCJ2ZXJ0aWNhbCIsImF1dG9wbGF5IiwiaW50ZXJ2YWwiLCJkdXJhdGlvbiIsIm1ldGhvZHMiLCJ0b0Zyb20iLCJ3eCIsIm5hdmlnYXRlVG8iLCJ1cmwiLCJvcHRpb25zIiwic2VsZiIsImdldFN5c3RlbUluZm8iLCJzdWNjZXNzIiwicmVzIiwiY29uc29sZSIsImxvZyIsIndpbmRvd1dpZHRoIiwiJGFwcGx5IiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJjYXRjaCIsImVycm9yIiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7QUFGQTs7O0lBSXFCQSxZOzs7Ozs7Ozs7Ozs7OztrTUFDbkJDLE0sR0FBUyxDQUFDQyxjQUFELEMsUUFDVEMsTSxHQUFTO0FBQ1BDLDhCQUF3QixNQURqQjtBQUVQQyxvQ0FBOEI7QUFGdkIsSyxRQUtUQyxJLEdBQU87QUFDTDtBQUNBQyxtQkFBYSxDQUZSO0FBR0xDLGdCQUFVLENBSEw7QUFJTEMsaUJBQVcsQ0FKTjtBQUtMQyxVQUFJLEVBTEM7QUFNTEMsWUFBTSxFQU5EO0FBT0xDLGtCQUFZLENBQUMsYUFBRCxFQUFnQixhQUFoQixFQUErQixhQUEvQixDQVBQO0FBUUxDLHFCQUFlLElBUlY7QUFTTEMsZ0JBQVUsS0FUTDtBQVVMQyxnQkFBVSxLQVZMO0FBV0xDLGdCQUFVLElBWEw7QUFZTEMsZ0JBQVU7QUFaTCxLLFFBY1BDLE8sR0FBVTtBQUNSQyxZQURRLG9CQUNDO0FBQ1BDLFdBQUdDLFVBQUgsQ0FBYztBQUNaQyxlQUFLLG9CQUFvQixLQUFLWjtBQURsQixTQUFkO0FBR0Q7QUFMTyxLOzs7OzsyQkFRSGEsTyxFQUFTO0FBQ2QsV0FBS2IsRUFBTCxHQUFVYSxRQUFRYixFQUFsQjtBQUNBLFVBQUljLE9BQU8sSUFBWDtBQUNBSixTQUFHSyxhQUFILENBQWlCO0FBQ2ZDLGlCQUFTLGlCQUFTQyxHQUFULEVBQWM7QUFDckJDLGtCQUFRQyxHQUFSLENBQVksS0FBWixFQUFtQkYsR0FBbkI7QUFDQSxjQUFJcEIsY0FBY29CLElBQUlHLFdBQXRCO0FBQ0FOLGVBQUtqQixXQUFMLEdBQW1CQSxXQUFuQjtBQUNBaUIsZUFBS08sTUFBTDtBQUNEO0FBTmMsT0FBakI7QUFRRDs7O3VDQUVrQjtBQUFBOztBQUNqQixXQUFLQyxnQkFBTCxDQUFzQixtQ0FBdEIsRUFBMkQ7QUFDekR0QixZQUFJLEtBQUtBO0FBRGdELE9BQTNELEVBR0d1QixJQUhILENBR1EsZ0JBQVE7QUFDWkwsZ0JBQVFDLEdBQVIsQ0FBWSxLQUFaLEVBQW1CdkIsSUFBbkI7QUFDQSxlQUFLSyxJQUFMLEdBQVlMLEtBQUtLLElBQUwsQ0FBVSxDQUFWLENBQVo7QUFDQWlCLGdCQUFRQyxHQUFSLENBQVksV0FBWixFQUF5QixPQUFLbEIsSUFBOUI7QUFDQSxlQUFLb0IsTUFBTDtBQUNELE9BUkgsRUFTR0csS0FUSCxDQVNTLFVBQVNDLEtBQVQsRUFBZ0IsQ0FBRSxDQVQzQjtBQVVEOzs7O0VBckR1Q0MsZUFBS0MsSTs7a0JBQTFCckMsWSIsImZpbGUiOiJzYW1wbGVEZXRhaWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyogZ2xvYmFsIHd4ICovXHJcbmltcG9ydCB3ZXB5IGZyb20gXCJ3ZXB5XCI7XHJcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSBcIi4uL21peGlucy9wYWdlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTYW1wbGVEZXRhaWwgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gIGNvbmZpZyA9IHtcclxuICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6IFwi5qC35ZOB6K+m5oOFXCIsXHJcbiAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxyXG4gIH07XHJcblxyXG4gIGRhdGEgPSB7XHJcbiAgICAvLyAgbmFtZTogJ215SHRtbFBhcnNlcktpbmVyJyxcclxuICAgIHNjcmVlbldpZHRoOiAwLFxyXG4gICAgaW1nd2lkdGg6IDAsXHJcbiAgICBpbWdoZWlnaHQ6IDAsXHJcbiAgICBpZDogXCJcIixcclxuICAgIGxpc3Q6IFtdLFxyXG4gICAgYmFja2dyb3VuZDogW1wiZGVtby10ZXh0LTFcIiwgXCJkZW1vLXRleHQtMlwiLCBcImRlbW8tdGV4dC0zXCJdLFxyXG4gICAgaW5kaWNhdG9yRG90czogdHJ1ZSxcclxuICAgIHZlcnRpY2FsOiBmYWxzZSxcclxuICAgIGF1dG9wbGF5OiBmYWxzZSxcclxuICAgIGludGVydmFsOiAyMDAwLFxyXG4gICAgZHVyYXRpb246IDUwMFxyXG4gIH07XHJcbiAgbWV0aG9kcyA9IHtcclxuICAgIHRvRnJvbSgpIHtcclxuICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgdXJsOiBcIi9wYWdlcy9mb3JtP2lkPVwiICsgdGhpcy5pZFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBvbkxvYWQob3B0aW9ucykge1xyXG4gICAgdGhpcy5pZCA9IG9wdGlvbnMuaWQ7XHJcbiAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICB3eC5nZXRTeXN0ZW1JbmZvKHtcclxuICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJyZXNcIiwgcmVzKTtcclxuICAgICAgICBsZXQgc2NyZWVuV2lkdGggPSByZXMud2luZG93V2lkdGg7XHJcbiAgICAgICAgc2VsZi5zY3JlZW5XaWR0aCA9IHNjcmVlbldpZHRoO1xyXG4gICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcInd4L3NwZWNpbWVuL3F1ZXJ5U3BlY2ltZW5BcGkuanNvblwiLCB7XHJcbiAgICAgIGlkOiB0aGlzLmlkXHJcbiAgICB9KVxyXG4gICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIjExIFwiLCBkYXRhKTtcclxuICAgICAgICB0aGlzLmxpc3QgPSBkYXRhLmxpc3RbMF07XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ0aGlzLmxpc3RcIiwgdGhpcy5saXN0KTtcclxuICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHt9KTtcclxuICB9XHJcbn1cclxuIl19