"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _page = require('./../../mixins/page.js');

var _page2 = _interopRequireDefault(_page);

var _headers = require('./../../components/headers.js');

var _headers2 = _interopRequireDefault(_headers);

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
      height: "",
      details: {},
      id: null,
      calendarId: null,
      index: null,
      array: [],
      formData: {},
      nickName: null,
      avatar: null
    }, _this.methods = {
      gettiz: function gettiz(e) {
        this.formData.tiz = e.detail.value;
      },
      gettz: function gettz(e) {
        this.formData.tz = e.detail.value;
      },
      getsg: function getsg(e) {
        this.formData.sg = e.detail.value;
      },
      gettw: function gettw(e) {
        this.formData.tw = e.detail.value;
      },
      getxw: function getxw(e) {
        this.formData.xw = e.detail.value;
      },
      getyw: function getyw(e) {
        this.formData.yw = e.detail.value;
      },
      getdx: function getdx(e) {
        this.formData.dx = e.detail.value;
      },
      getzf: function getzf(e) {
        this.formData.zf = e.detail.value;
      },
      bindPickerChange: function bindPickerChange(e) {
        this.index = e.detail.value;
        this.getVal();
      },

      // 上传
      upload: function upload() {
        var data = {};
        for (var key in this.formData) {
          if (key === "tiz") {
            data["体脂率"] = this.formData[key];
          } else if (key === "tz") {
            data["体重"] = this.formData[key];
          } else if (key === "jr") {
            data["肌肉"] = this.formData[key];
          } else if (key === "xw") {
            data["胸围"] = this.formData[key];
          } else if (key === "tw") {
            data["臀围"] = this.formData[key];
          } else if (key === "sg") {
            data["身高"] = this.formData[key];
          } else if (key === "zf") {
            data["脂肪"] = this.formData[key];
          } else if (key === "yw") {
            data["腰围"] = this.formData[key];
          }
        }
        var that = this;
        this.fetchDataPromise("page/coach.json", {
          action: "userTraning",
          userId: this.id,
          calendarId: this.details.items[this.index].id,
          data: JSON.stringify(data)
        }).then(function (data) {
          that.details = data;
          wx.showToast({
            title: "上传成功"
          });
          that.$apply();
          that.getFormData();
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Course, [{
    key: "onLoad",
    value: function onLoad(options) {
      this.id = options.id;
      this.nickName = options.nickName;
      this.avatar = options.avatar;
    }
  }, {
    key: "getVal",
    value: function getVal() {
      this.fetchDataPromise("page/coach.json", {
        action: "userTraning",
        userId: this.id,
        calendarId: this.details.items[this.index].id
      }).then(function (data) {
        that.details = data;
        that.$apply();
        that.getFormData();
      });
    }
  }, {
    key: "getFormData",
    value: function getFormData() {
      for (var key in this.details.value) {
        if (key === "体脂率") {
          this.formData.tiz = this.details.value[key];
        } else if (key === "体重") {
          this.formData.tz = this.details.value[key];
        } else if (key === "肌肉") {
          this.formData.jr = this.details.value[key];
        } else if (key === "胸围") {
          this.formData.xw = this.details.value[key];
        } else if (key === "臀围") {
          this.formData.tw = this.details.value[key];
        } else if (key === "身高") {
          this.formData.sg = this.details.value[key];
        } else if (key === "脂肪") {
          this.formData.zf = this.details.value[key];
        } else if (key === "腰围") {
          this.formData.yw = this.details.value[key];
        }
      }
      this.$apply();
    }
  }, {
    key: "whenAppReadyShow",
    value: function whenAppReadyShow() {
      var that = this;
      this.fetchDataPromise("page/coach.json", {
        action: "userTraning",
        userId: this.id
      }).then(function (data) {
        that.details = data;
        that.array = that.details.items.map(function (item, index) {
          if (that.details.calendarId === item.id) {
            that.index = index;
          }
          return item.day;
        });
        that.getFormData();
        console.log(that.index);
        that.$apply();
      });
    }
  }, {
    key: "onShow",
    value: function onShow() {
      var _this2 = this;

      wx.getSystemInfo({
        success: function success(res) {
          _this2.height = res.statusBarHeight;
          _this2.$broadcast("index-broadcast", {
            height: _this2.height,
            text: "体测数据"
          });
        }
      });
    }
  }]);

  return Course;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Course , 'pages/user/membersNext1'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lbWJlcnNOZXh0MS5qcyJdLCJuYW1lcyI6WyJDb3Vyc2UiLCJtaXhpbnMiLCJQYWdlTWl4aW4iLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImhlYWRlciIsImRhdGEiLCJoZWlnaHQiLCJkZXRhaWxzIiwiaWQiLCJjYWxlbmRhcklkIiwiaW5kZXgiLCJhcnJheSIsImZvcm1EYXRhIiwibmlja05hbWUiLCJhdmF0YXIiLCJtZXRob2RzIiwiZ2V0dGl6IiwiZSIsInRpeiIsImRldGFpbCIsInZhbHVlIiwiZ2V0dHoiLCJ0eiIsImdldHNnIiwic2ciLCJnZXR0dyIsInR3IiwiZ2V0eHciLCJ4dyIsImdldHl3IiwieXciLCJnZXRkeCIsImR4IiwiZ2V0emYiLCJ6ZiIsImJpbmRQaWNrZXJDaGFuZ2UiLCJnZXRWYWwiLCJ1cGxvYWQiLCJrZXkiLCJ0aGF0IiwiZmV0Y2hEYXRhUHJvbWlzZSIsImFjdGlvbiIsInVzZXJJZCIsIml0ZW1zIiwiSlNPTiIsInN0cmluZ2lmeSIsInRoZW4iLCJ3eCIsInNob3dUb2FzdCIsInRpdGxlIiwiJGFwcGx5IiwiZ2V0Rm9ybURhdGEiLCJvcHRpb25zIiwianIiLCJtYXAiLCJpdGVtIiwiZGF5IiwiY29uc29sZSIsImxvZyIsImdldFN5c3RlbUluZm8iLCJzdWNjZXNzIiwicmVzIiwic3RhdHVzQmFySGVpZ2h0IiwiJGJyb2FkY2FzdCIsInRleHQiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBSEE7OztJQUlxQkEsTTs7Ozs7Ozs7Ozs7Ozs7c0xBQ25CQyxNLEdBQVMsQ0FBQ0MsY0FBRCxDLFFBQ1RDLE0sR0FBUztBQUNQQyxvQ0FBOEI7QUFEdkIsSyxRQUdUQyxVLEdBQWE7QUFDWEM7QUFEVyxLLFFBR2JDLEksR0FBTztBQUNMQyxjQUFRLEVBREg7QUFFTEMsZUFBUyxFQUZKO0FBR0xDLFVBQUks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QUNEO0FBQ0Y7QUFDRCxXQUFLWSxNQUFMO0FBQ0Q7Ozt1Q0FDa0I7QUFDakIsVUFBSVgsT0FBTyxJQUFYO0FBQ0EsV0FBS0MsZ0JBQUwsQ0FBc0IsaUJBQXRCLEVBQXlDO0FBQ3ZDQyxnQkFBUSxhQUQrQjtBQUV2Q0MsZ0JBQVEsS0FBS2xDO0FBRjBCLE9BQXpDLEVBR0dzQyxJQUhILENBR1EsVUFBU3pDLElBQVQsRUFBZTtBQUNyQmtDLGFBQUtoQyxPQUFMLEdBQWVGLElBQWY7QUFDQWtDLGFBQUs1QixLQUFMLEdBQWE0QixLQUFLaEMsT0FBTCxDQUFhb0MsS0FBYixDQUFtQlcsR0FBbkIsQ0FBdUIsVUFBQ0MsSUFBRCxFQUFPN0MsS0FBUCxFQUFpQjtBQUNuRCxjQUFJNkIsS0FBS2hDLE9BQUwsQ0FBYUUsVUFBYixLQUE0QjhDLEtBQUsvQyxFQUFyQyxFQUF5QztBQUN2QytCLGlCQUFLN0IsS0FBTCxHQUFhQSxLQUFiO0FBQ0Q7QUFDRCxpQkFBTzZDLEtBQUtDLEdBQVo7QUFDRCxTQUxZLENBQWI7QUFNQWpCLGFBQUtZLFdBQUw7QUFDQU0sZ0JBQVFDLEdBQVIsQ0FBWW5CLEtBQUs3QixLQUFqQjtBQUNBNkIsYUFBS1csTUFBTDtBQUNELE9BZEQ7QUFlRDs7OzZCQUNRO0FBQUE7O0FBQ1BILFNBQUdZLGFBQUgsQ0FBaUI7QUFDZkMsaUJBQVMsc0JBQU87QUFDZCxpQkFBS3RELE1BQUwsR0FBY3VELElBQUlDLGVBQWxCO0FBQ0EsaUJBQUtDLFVBQUwsQ0FBZ0IsaUJBQWhCLEVBQW1DO0FBQ2pDekQsb0JBQVEsT0FBS0EsTUFEb0I7QUFFakMwRCxrQkFBTTtBQUYyQixXQUFuQztBQUlEO0FBUGMsT0FBakI7QUFTRDs7OztFQXhKaUNDLGVBQUtDLEk7O2tCQUFwQnBFLE0iLCJmaWxlIjoibWVtYmVyc05leHQxLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKiBnbG9iYWwgd3ggKi9cbmltcG9ydCB3ZXB5IGZyb20gXCJ3ZXB5XCI7XG5pbXBvcnQgUGFnZU1peGluIGZyb20gXCIuLi8uLi9taXhpbnMvcGFnZVwiO1xuaW1wb3J0IGhlYWRlciBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9oZWFkZXJzXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3Vyc2UgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xuICBtaXhpbnMgPSBbUGFnZU1peGluXTtcbiAgY29uZmlnID0ge1xuICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZlwiXG4gIH07XG4gIGNvbXBvbmVudHMgPSB7XG4gICAgaGVhZGVyXG4gIH07XG4gIGRhdGEgPSB7XG4gICAgaGVpZ2h0OiBcIlwiLFxuICAgIGRldGFpbHM6IHt9LFxuICAgIGlkOiBudWxsLFxuICAgIGNhbGVuZGFySWQ6IG51bGwsXG4gICAgaW5kZXg6IG51bGwsXG4gICAgYXJyYXk6IFtdLFxuICAgIGZvcm1EYXRhOiB7fSxcbiAgICBuaWNrTmFtZTogbnVsbCxcbiAgICBhdmF0YXI6IG51bGxcbiAgfTtcbiAgb25Mb2FkKG9wdGlvbnMpIHtcbiAgICB0aGlzLmlkID0gb3B0aW9ucy5pZDtcbiAgICB0aGlzLm5pY2tOYW1lID0gb3B0aW9ucy5uaWNrTmFtZTtcbiAgICB0aGlzLmF2YXRhciA9IG9wdGlvbnMuYXZhdGFyO1xuICB9XG4gIG1ldGhvZHMgPSB7XG4gICAgZ2V0dGl6KGUpIHtcbiAgICAgIHRoaXMuZm9ybURhdGEudGl6ID0gZS5kZXRhaWwudmFsdWU7XG4gICAgfSxcbiAgICBnZXR0eihlKSB7XG4gICAgICB0aGlzLmZvcm1EYXRhLnR6ID0gZS5kZXRhaWwudmFsdWU7XG4gICAgfSxcbiAgICBnZXRzZyhlKSB7XG4gICAgICB0aGlzLmZvcm1EYXRhLnNnID0gZS5kZXRhaWwudmFsdWU7XG4gICAgfSxcbiAgICBnZXR0dyhlKSB7XG4gICAgICB0aGlzLmZvcm1EYXRhLnR3ID0gZS5kZXRhaWwudmFsdWU7XG4gICAgfSxcbiAgICBnZXR4dyhlKSB7XG4gICAgICB0aGlzLmZvcm1EYXRhLnh3ID0gZS5kZXRhaWwudmFsdWU7XG4gICAgfSxcbiAgICBnZXR5dyhlKSB7XG4gICAgICB0aGlzLmZvcm1EYXRhLnl3ID0gZS5kZXRhaWwudmFsdWU7XG4gICAgfSxcbiAgICBnZXRkeChlKSB7XG4gICAgICB0aGlzLmZvcm1EYXRhLmR4ID0gZS5kZXRhaWwudmFsdWU7XG4gICAgfSxcbiAgICBnZXR6ZihlKSB7XG4gICAgICB0aGlzLmZvcm1EYXRhLnpmID0gZS5kZXRhaWwudmFsdWU7XG4gICAgfSxcbiAgICBiaW5kUGlja2VyQ2hhbmdlKGUpIHtcbiAgICAgIHRoaXMuaW5kZXggPSBlLmRldGFpbC52YWx1ZTtcbiAgICAgIHRoaXMuZ2V0VmFsKCk7XG4gICAgfSxcbiAgICAvLyDkuIrkvKBcbiAgICB1cGxvYWQoKSB7XG4gICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLmZvcm1EYXRhKSB7XG4gICAgICAgIGlmIChrZXkgPT09IFwidGl6XCIpIHtcbiAgICAgICAgICBkYXRhW1wi5L2T6ISC546HXCJdID0gdGhpcy5mb3JtRGF0YVtrZXldO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJ0elwiKSB7XG4gICAgICAgICAgZGF0YVtcIuS9k+mHjVwiXSA9IHRoaXMuZm9ybURhdGFba2V5XTtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwianJcIikge1xuICAgICAgICAgIGRhdGFbXCLogozogolcIl0gPSB0aGlzLmZvcm1EYXRhW2tleV07XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcInh3XCIpIHtcbiAgICAgICAgICBkYXRhW1wi6IO45Zu0XCJdID0gdGhpcy5mb3JtRGF0YVtrZXldO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJ0d1wiKSB7XG4gICAgICAgICAgZGF0YVtcIuiHgOWbtFwiXSA9IHRoaXMuZm9ybURhdGFba2V5XTtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwic2dcIikge1xuICAgICAgICAgIGRhdGFbXCLouqvpq5hcIl0gPSB0aGlzLmZvcm1EYXRhW2tleV07XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcInpmXCIpIHtcbiAgICAgICAgICBkYXRhW1wi6ISC6IKqXCJdID0gdGhpcy5mb3JtRGF0YVtrZXldO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJ5d1wiKSB7XG4gICAgICAgICAgZGF0YVtcIuiFsOWbtFwiXSA9IHRoaXMuZm9ybURhdGFba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKFwicGFnZS9jb2FjaC5qc29uXCIsIHtcbiAgICAgICAgYWN0aW9uOiBcInVzZXJUcmFuaW5nXCIsXG4gICAgICAgIHVzZXJJZDogdGhpcy5pZCxcbiAgICAgICAgY2FsZW5kYXJJZDogdGhpcy5kZXRhaWxzLml0ZW1zW3RoaXMuaW5kZXhdLmlkLFxuICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKVxuICAgICAgfSkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHRoYXQuZGV0YWlscyA9IGRhdGE7XG4gICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgdGl0bGU6IFwi5LiK5Lyg5oiQ5YqfXCJcbiAgICAgICAgfSk7XG4gICAgICAgIHRoYXQuJGFwcGx5KCk7XG4gICAgICAgIHRoYXQuZ2V0Rm9ybURhdGEoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgZ2V0VmFsKCkge1xuICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcInBhZ2UvY29hY2guanNvblwiLCB7XG4gICAgICBhY3Rpb246IFwidXNlclRyYW5pbmdcIixcbiAgICAgIHVzZXJJZDogdGhpcy5pZCxcbiAgICAgIGNhbGVuZGFySWQ6IHRoaXMuZGV0YWlscy5pdGVtc1t0aGlzLmluZGV4XS5pZFxuICAgIH0pLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdGhhdC5kZXRhaWxzID0gZGF0YTtcbiAgICAgIHRoYXQuJGFwcGx5KCk7XG4gICAgICB0aGF0LmdldEZvcm1EYXRhKCk7XG4gICAgfSk7XG4gIH1cbiAgZ2V0Rm9ybURhdGEoKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5kZXRhaWxzLnZhbHVlKSB7XG4gICAgICBpZiAoa2V5ID09PSBcIuS9k+iEgueOh1wiKSB7XG4gICAgICAgIHRoaXMuZm9ybURhdGEudGl6ID0gdGhpcy5kZXRhaWxzLnZhbHVlW2tleV07XG4gICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCLkvZPph41cIikge1xuICAgICAgICB0aGlzLmZvcm1EYXRhLnR6ID0gdGhpcy5kZXRhaWxzLnZhbHVlW2tleV07XG4gICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCLogozogolcIikge1xuICAgICAgICB0aGlzLmZvcm1EYXRhLmpyID0gdGhpcy5kZXRhaWxzLnZhbHVlW2tleV07XG4gICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCLog7jlm7RcIikge1xuICAgICAgICB0aGlzLmZvcm1EYXRhLnh3ID0gdGhpcy5kZXRhaWxzLnZhbHVlW2tleV07XG4gICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCLoh4Dlm7RcIikge1xuICAgICAgICB0aGlzLmZvcm1EYXRhLnR3ID0gdGhpcy5kZXRhaWxzLnZhbHVlW2tleV07XG4gICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCLouqvpq5hcIikge1xuICAgICAgICB0aGlzLmZvcm1EYXRhLnNnID0gdGhpcy5kZXRhaWxzLnZhbHVlW2tleV07XG4gICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCLohILogqpcIikge1xuICAgICAgICB0aGlzLmZvcm1EYXRhLnpmID0gdGhpcy5kZXRhaWxzLnZhbHVlW2tleV07XG4gICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCLohbDlm7RcIikge1xuICAgICAgICB0aGlzLmZvcm1EYXRhLnl3ID0gdGhpcy5kZXRhaWxzLnZhbHVlW2tleV07XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuJGFwcGx5KCk7XG4gIH1cbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKFwicGFnZS9jb2FjaC5qc29uXCIsIHtcbiAgICAgIGFjdGlvbjogXCJ1c2VyVHJhbmluZ1wiLFxuICAgICAgdXNlcklkOiB0aGlzLmlkXG4gICAgfSkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICB0aGF0LmRldGFpbHMgPSBkYXRhO1xuICAgICAgdGhhdC5hcnJheSA9IHRoYXQuZGV0YWlscy5pdGVtcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgIGlmICh0aGF0LmRldGFpbHMuY2FsZW5kYXJJZCA9PT0gaXRlbS5pZCkge1xuICAgICAgICAgIHRoYXQuaW5kZXggPSBpbmRleDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlbS5kYXk7XG4gICAgICB9KTtcbiAgICAgIHRoYXQuZ2V0Rm9ybURhdGEoKTtcbiAgICAgIGNvbnNvbGUubG9nKHRoYXQuaW5kZXgpO1xuICAgICAgdGhhdC4kYXBwbHkoKTtcbiAgICB9KTtcbiAgfVxuICBvblNob3coKSB7XG4gICAgd3guZ2V0U3lzdGVtSW5mbyh7XG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICB0aGlzLmhlaWdodCA9IHJlcy5zdGF0dXNCYXJIZWlnaHQ7XG4gICAgICAgIHRoaXMuJGJyb2FkY2FzdChcImluZGV4LWJyb2FkY2FzdFwiLCB7XG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgICAgICB0ZXh0OiBcIuS9k+a1i+aVsOaNrlwiXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=