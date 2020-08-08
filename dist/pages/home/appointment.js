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
      sex: ["男", "女"],
      xuqiuArray: ["是", "否"],
      isHeight: false,
      isWeight: false,
      xuqiu: false,
      height: "",
      formData: {
        gender: null,
        fitBase: null,
        height: null
      }
    }, _this.methods = {
      getHeight: function getHeight(e) {
        this.formData.height = e.detail.value;
      },
      getWeight: function getWeight(e) {
        this.formData.weight = e.detail.value;
      },
      getRequirement: function getRequirement(e) {
        this.formData.requirement = e.detail.value;
      },
      xuqiuTrue: function xuqiuTrue() {
        this.xuqiu = true;
      },
      heightTrue: function heightTrue() {
        this.isHeight = true;
      },
      weightTrue: function weightTrue() {
        this.isWeight = true;
      },
      sexFun: function sexFun(e) {
        this.formData.gender = e.detail.value === "0" ? "男" : "女";
      },
      xuqiuFun: function xuqiuFun(e) {
        this.formData.fitBase = e.detail.value === "0" ? "是" : "否";
      },
      submit: function submit() {
        if (!this.formData.height) {
          wx.showModal({
            title: "提示",
            content: "请输入身高",
            showCancel: false
          });
        } else if (!this.formData.weight) {
          wx.showModal({
            title: "提示",
            content: "请输入身高",
            showCancel: false
          });
        }
        var that = this;
        that.formData.action = "update";
        that.fetchDataPromise("page/first.json", that.formData).then(function (data) {
          wx.showToast({
            title: "提交成功",
            icon: "success",
            duration: 2000
          });
          setTimeout(function () {
            wx.switchTab({
              url: "/pages/home/home1"
            });
          }, 2000);
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Course, [{
    key: "onShow",
    value: function onShow() {
      var _this2 = this;

      wx.getSystemInfo({
        success: function success(res) {
          _this2.height = res.statusBarHeight;
          _this2.$broadcast("index-broadcast", {
            height: _this2.height,
            text: "OneFit健身"
          });
        }
      });
    }
  }]);

  return Course;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Course , 'pages/home/appointment'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcG9pbnRtZW50LmpzIl0sIm5hbWVzIjpbIkNvdXJzZSIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJjb21wb25lbnRzIiwiaGVhZGVyIiwiZGF0YSIsInNleCIsInh1cWl1QXJyYXkiLCJpc0hlaWdodCIsImlzV2VpZ2h0IiwieHVxaXUiLCJoZWlnaHQiLCJmb3JtRGF0YSIsImdlbmRlciIsImZpdEJhc2UiLCJtZXRob2RzIiwiZ2V0SGVpZ2h0IiwiZSIsImRldGFpbCIsInZhbHVlIiwiZ2V0V2VpZ2h0Iiwid2VpZ2h0IiwiZ2V0UmVxdWlyZW1lbnQiLCJyZXF1aXJlbWVudCIsInh1cWl1VHJ1ZSIsImhlaWdodFRydWUiLCJ3ZWlnaHRUcnVlIiwic2V4RnVuIiwieHVxaXVGdW4iLCJzdWJtaXQiLCJ3eCIsInNob3dNb2RhbCIsInRpdGxlIiwiY29udGVudCIsInNob3dDYW5jZWwiLCJ0aGF0IiwiYWN0aW9uIiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJzaG93VG9hc3QiLCJpY29uIiwiZHVyYXRpb24iLCJzZXRUaW1lb3V0Iiwic3dpdGNoVGFiIiwidXJsIiwiZ2V0U3lzdGVtSW5mbyIsInN1Y2Nlc3MiLCJyZXMiLCJzdGF0dXNCYXJIZWlnaHQiLCIkYnJvYWRjYXN0IiwidGV4dCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7QUFIQTs7O0lBSXFCQSxNOzs7Ozs7Ozs7Ozs7OztzTEFDbkJDLE0sR0FBUyxDQUFDQyxjQUFELEMsUUFDVEMsTSxHQUFTO0FBQ1BDLG9DQUE4QjtBQUR2QixLLFFBR1RDLFUsR0FBYTtBQUNYQztBQURXLEssUUFHYkMsSSxHQUFPO0FBQ0xDLFdBQUssQ0FBQyxHQUFELEVBQU0sR0FBTixDQURBO0FBRUxDLGtCQUFZLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FGUDtBQUdMQyxnQkFBVSxLQUhMO0FBSUxDLGdCQUFVLEtBSkw7QUFLTEMsYUFBTyxLQUxGO0FBTUxDLGNBQVEsRUFOSDtBQU9MQyxnQkFBVTtBQUNSQyxnQkFBUSxJQURBO0FBRVJDLGlCQUFTLElBRkQ7QUFHUkgsZ0JBQVE7QUFIQTtBQVBMLEssUUFhUEksTyxHQUFVO0FBQ1JDLGVBRFEscUJBQ0VDLENBREYsRUFDSztBQUNYLGFBQUtMLFFBQUwsQ0FBY0QsTUFBZCxHQUF1Qk0sRUFBRUMsTUFBRixDQUFTQyxLQUFoQztBQUNELE9BSE87QUFJUkMsZUFKUSxxQkFJRUgsQ0FKRixFQUlLO0FBQ1gsYUFBS0wsUUFBTCxDQUFjUyxNQUFkLEdBQXVCSixFQUFFQyxNQUFGLENBQVNDLEtBQWhDO0FBQ0QsT0FOTztBQU9SRyxvQkFQUSwwQkFPT0wsQ0FQUCxFQU9VO0FBQ2hCLGFBQUtMLFFBQUwsQ0FBY1csV0FBZCxHQUE0Qk4sRUFBRUMsTUFBRixDQUFTQyxLQUFyQztBQUNELE9BVE87QUFVUkssZUFWUSx1QkFVSTtBQUNWLGFBQUtkLEtBQUwsR0FBYSxJQUFiO0FBQ0QsT0FaTztBQWFSZSxnQkFiUSx3QkFhSztBQUNYLGFBQUtqQixRQUFMLEdBQWdCLElBQWhCO0FBQ0QsT0FmTztBQWdCUmtCLGdCQWhCUSx3QkFnQks7QUFDWCxhQUFLakIsUUFBTCxHQUFnQixJQUFoQjtBQUNELE9BbEJPO0FBbUJSa0IsWUFuQlEsa0JBbUJEVixDQW5CQyxFQW1CRTtBQUNSLGFBQUtMLFFBQUwsQ0FBY0MsTUFBZCxHQUF1QkksRUFBRUMsTUFBRixDQUFTQyxLQUFULEtBQW1CLEdBQW5CLEdBQXlCLEdBQXpCLEdBQStCLEdBQXREO0FBQ0QsT0FyQk87QUFzQlJTLGNBdEJRLG9CQXNCQ1gsQ0F0QkQsRUFzQkk7QUFDVixhQUFLTCxRQUFMLENBQWNFLE9BQWQsR0FBd0JHLEVBQUVDLE1BQUYsQ0FBU0MsS0FBVCxLQUFtQixHQUFuQixHQUF5QixHQUF6QixHQUErQixHQUF2RDtBQUNELE9BeEJPO0FBeUJSVSxZQXpCUSxvQkF5QkM7QUFDUCxZQUFJLENBQUMsS0FBS2pCLFFBQUwsQ0FBY0QsTUFBbkIsRUFBMkI7QUFDekJtQixhQUFHQyxTQUFILENBQWE7QUFDWEMsbUJBQU8sSUFESTtBQUVYQyxxQkFBUyxPQUZFO0FBR1hDLHdCQUFZO0FBSEQsV0FBYjtBQUtELFNBTkQsTUFNTyxJQUFJLENBQUMsS0FBS3RCLFFBQUwsQ0FBY1MsTUFBbkIsRUFBMkI7QUFDaENTLGFBQUdDLFNBQUgsQ0FBYTtBQUNYQyxtQkFBTyxJQURJO0FBRVhDLHFCQUFTLE9BRkU7QUFHWEMsd0JBQVk7QUFIRCxXQUFiO0FBS0Q7QUFDRCxZQUFJQyxPQUFPLElBQVg7QUFDQUEsYUFBS3ZCLFFBQUwsQ0FBY3dCLE1BQWQsR0FBdUIsUUFBdkI7QUFDQUQsYUFDR0UsZ0JBREgsQ0FDb0IsaUJBRHBCLEVBQ3VDRixLQUFLdkIsUUFENUMsRUFFRzBCLElBRkgsQ0FFUSxVQUFTakMsSUFBVCxFQUFlO0FBQ25CeUIsYUFBR1MsU0FBSCxDQUFhO0FBQ1hQLG1CQUFPLE1BREk7QUFFWFEsa0JBQU0sU0FGSztBQUdYQyxzQkFBVTtBQUhDLFdBQWI7QUFLQUMscUJBQVcsWUFBTTtBQUNmWixlQUFHYSxTQUFILENBQWE7QUFDWEMsbUJBQUs7QUFETSxhQUFiO0FBR0QsV0FKRCxFQUlHLElBSkg7QUFLRCxTQWJIO0FBY0Q7QUF2RE8sSzs7Ozs7NkJBeUREO0FBQUE7O0FBQ1BkLFNBQUdlLGFBQUgsQ0FBaUI7QUFDZkMsaUJBQVMsc0JBQU87QUFDZCxpQkFBS25DLE1BQUwsR0FBY29DLElBQUlDLGVBQWxCO0FBQ0EsaUJBQUtDLFVBQUwsQ0FBZ0IsaUJBQWhCLEVBQW1DO0FBQ2pDdEMsb0JBQVEsT0FBS0EsTUFEb0I7QUFFakN1QyxrQkFBTTtBQUYyQixXQUFuQztBQUlEO0FBUGMsT0FBakI7QUFTRDs7OztFQXhGaUNDLGVBQUtDLEk7O2tCQUFwQnRELE0iLCJmaWxlIjoiYXBwb2ludG1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qIGdsb2JhbCB3eCAqL1xuaW1wb3J0IHdlcHkgZnJvbSBcIndlcHlcIjtcbmltcG9ydCBoZWFkZXIgZnJvbSBcIi4uLy4uL2NvbXBvbmVudHMvaGVhZGVyc1wiO1xuaW1wb3J0IFBhZ2VNaXhpbiBmcm9tIFwiLi4vLi4vbWl4aW5zL3BhZ2VcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvdXJzZSBleHRlbmRzIHdlcHkucGFnZSB7XG4gIG1peGlucyA9IFtQYWdlTWl4aW5dO1xuICBjb25maWcgPSB7XG4gICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcbiAgfTtcbiAgY29tcG9uZW50cyA9IHtcbiAgICBoZWFkZXJcbiAgfTtcbiAgZGF0YSA9IHtcbiAgICBzZXg6IFtcIueUt1wiLCBcIuWls1wiXSxcbiAgICB4dXFpdUFycmF5OiBbXCLmmK9cIiwgXCLlkKZcIl0sXG4gICAgaXNIZWlnaHQ6IGZhbHNlLFxuICAgIGlzV2VpZ2h0OiBmYWxzZSxcbiAgICB4dXFpdTogZmFsc2UsXG4gICAgaGVpZ2h0OiBcIlwiLFxuICAgIGZvcm1EYXRhOiB7XG4gICAgICBnZW5kZXI6IG51bGwsXG4gICAgICBmaXRCYXNlOiBudWxsLFxuICAgICAgaGVpZ2h0OiBudWxsXG4gICAgfVxuICB9O1xuICBtZXRob2RzID0ge1xuICAgIGdldEhlaWdodChlKSB7XG4gICAgICB0aGlzLmZvcm1EYXRhLmhlaWdodCA9IGUuZGV0YWlsLnZhbHVlO1xuICAgIH0sXG4gICAgZ2V0V2VpZ2h0KGUpIHtcbiAgICAgIHRoaXMuZm9ybURhdGEud2VpZ2h0ID0gZS5kZXRhaWwudmFsdWU7XG4gICAgfSxcbiAgICBnZXRSZXF1aXJlbWVudChlKSB7XG4gICAgICB0aGlzLmZvcm1EYXRhLnJlcXVpcmVtZW50ID0gZS5kZXRhaWwudmFsdWU7XG4gICAgfSxcbiAgICB4dXFpdVRydWUoKSB7XG4gICAgICB0aGlzLnh1cWl1ID0gdHJ1ZTtcbiAgICB9LFxuICAgIGhlaWdodFRydWUoKSB7XG4gICAgICB0aGlzLmlzSGVpZ2h0ID0gdHJ1ZTtcbiAgICB9LFxuICAgIHdlaWdodFRydWUoKSB7XG4gICAgICB0aGlzLmlzV2VpZ2h0ID0gdHJ1ZTtcbiAgICB9LFxuICAgIHNleEZ1bihlKSB7XG4gICAgICB0aGlzLmZvcm1EYXRhLmdlbmRlciA9IGUuZGV0YWlsLnZhbHVlID09PSBcIjBcIiA/IFwi55S3XCIgOiBcIuWls1wiO1xuICAgIH0sXG4gICAgeHVxaXVGdW4oZSkge1xuICAgICAgdGhpcy5mb3JtRGF0YS5maXRCYXNlID0gZS5kZXRhaWwudmFsdWUgPT09IFwiMFwiID8gXCLmmK9cIiA6IFwi5ZCmXCI7XG4gICAgfSxcbiAgICBzdWJtaXQoKSB7XG4gICAgICBpZiAoIXRoaXMuZm9ybURhdGEuaGVpZ2h0KSB7XG4gICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgdGl0bGU6IFwi5o+Q56S6XCIsXG4gICAgICAgICAgY29udGVudDogXCLor7fovpPlhaXouqvpq5hcIixcbiAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMuZm9ybURhdGEud2VpZ2h0KSB7XG4gICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgdGl0bGU6IFwi5o+Q56S6XCIsXG4gICAgICAgICAgY29udGVudDogXCLor7fovpPlhaXouqvpq5hcIixcbiAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgIHRoYXQuZm9ybURhdGEuYWN0aW9uID0gXCJ1cGRhdGVcIjtcbiAgICAgIHRoYXRcbiAgICAgICAgLmZldGNoRGF0YVByb21pc2UoXCJwYWdlL2ZpcnN0Lmpzb25cIiwgdGhhdC5mb3JtRGF0YSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICB0aXRsZTogXCLmj5DkuqTmiJDlip9cIixcbiAgICAgICAgICAgIGljb246IFwic3VjY2Vzc1wiLFxuICAgICAgICAgICAgZHVyYXRpb246IDIwMDBcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHd4LnN3aXRjaFRhYih7XG4gICAgICAgICAgICAgIHVybDogXCIvcGFnZXMvaG9tZS9ob21lMVwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LCAyMDAwKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBvblNob3coKSB7XG4gICAgd3guZ2V0U3lzdGVtSW5mbyh7XG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICB0aGlzLmhlaWdodCA9IHJlcy5zdGF0dXNCYXJIZWlnaHQ7XG4gICAgICAgIHRoaXMuJGJyb2FkY2FzdChcImluZGV4LWJyb2FkY2FzdFwiLCB7XG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgICAgICB0ZXh0OiBcIk9uZUZpdOWBpei6q1wiXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=