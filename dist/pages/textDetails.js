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

var TextDetails = function (_wepy$page) {
  _inherits(TextDetails, _wepy$page);

  function TextDetails() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TextDetails);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TextDetails.__proto__ || Object.getPrototypeOf(TextDetails)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarTitleText: "田间实验",
      navigationBarBackgroundColor: "#fff"
    }, _this.data = {
      uploadIndex: 0, //上传的编号
      uploadItems: [], //上传的图片数组
      uploading: false, //是否正在上传
      list: [{}, {}],
      delItem: null,
      showToast: false,
      error: "",
      user: _this.user,
      id: null,
      isOpen: false,
      details: {}
    }, _this.methods = {
      preview: function preview(event) {
        var currentUrl = event.currentTarget.dataset.src;
        wx.previewImage({
          current: currentUrl, // 当前显示图片的http链接
          urls: [currentUrl] // 需要预览的图片http链接列表
        });
      },
      editRecord: function editRecord(e) {
        wx.navigateTo({
          url: '/pages/addRecord?id=' + this.id + '&record=' + JSON.stringify(e.currentTarget.dataset.id)
        });
      },

      // 打开增加实验
      open: function open() {
        wx.navigateTo({
          url: '/pages/addRecord?id=' + this.id
        });
      },
      getUser: function getUser(e) {
        this.formData.recordUser = e.detail.value;
        this.$apply();
      },

      // 编辑实验信息
      editFun: function editFun() {
        wx.navigateTo({
          url: '/pages/createTest?item=' + JSON.stringify(this.details)
        });
      },
      chooseImage: function chooseImage(e) {
        var self = this;
        wx.chooseImage({
          count: 2,
          sizeType: ["original", "compressed"],
          sourceType: ["album", "camera"],
          success: function success(res) {
            // tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFilePaths;
            for (var i = 0; i < tempFilePaths.length; i++) {
              self.uploadItems.push({
                index: self.uploadIndex++,
                file: tempFilePaths[i], //用于直接显示
                progress: 0,
                uploaded: false, //是否上传完成
                uploadError: false, //上传失败
                url: "" //上传后的URL
              });
            }
            self.startUpload();
            self.$apply();
          },
          fail: function fail(error) {}
        });
      },

      // 删除
      delFun: function delFun(e) {
        var self = this;
        wx.showModal({
          title: "提示",
          content: "是否确认删除当前实验数据?",
          cancelText: "取消",
          confirmText: "确认",
          success: function success(res) {
            if (res.confirm) {
              self.fetchDataPromise('wx/experiment/deleteExperimentRecordApi.json', { id: e.target.dataset.id }).then(function (data) {
                self.formData = {};
                //返回上上一页
                wx.showToast({
                  title: '删除成功'
                });
                self.getDeails(self.id);
              });
            }
          },
          fail: function fail(err) {}
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TextDetails, [{
    key: "getDeails",

    // 获取实验详情
    value: function getDeails(id) {
      var that = this;
      this.fetchDataPromise('wx/experiment/queryExperimentRecordApi.json', { experimentId: id }, {}).then(function (data) {
        that.details = data.list[0];
        that.$apply();
      });
    }
  }, {
    key: "toast",
    value: function toast(error) {
      this.showToast = true;
      this.error = error;
      var that = this;
      setTimeout(function () {
        that.showToast = false;
      }, 2000);
    }
  }, {
    key: "onLoad",
    value: function onLoad(options) {
      this.id = options.id;
    }
  }, {
    key: "whenAppReadyShow",
    value: function whenAppReadyShow() {
      // this.getList()
      this.getDeails(this.id);

      // 每次都刷新
    }
  }]);

  return TextDetails;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(TextDetails , 'pages/textDetails'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRleHREZXRhaWxzLmpzIl0sIm5hbWVzIjpbIlRleHREZXRhaWxzIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJkYXRhIiwidXBsb2FkSW5kZXgiLCJ1cGxvYWRJdGVtcyIsInVwbG9hZGluZyIsImxpc3QiLCJkZWxJdGVtIiwic2hvd1RvYXN0IiwiZXJyb3IiLCJ1c2VyIiwiaWQiLCJpc09wZW4iLCJkZXRhaWxzIiwibWV0aG9kcyIsInByZXZpZXciLCJldmVudCIsImN1cnJlbnRVcmwiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsInNyYyIsInd4IiwicHJldmlld0ltYWdlIiwiY3VycmVudCIsInVybHMiLCJlZGl0UmVjb3JkIiwiZSIsIm5hdmlnYXRlVG8iLCJ1cmwiLCJKU09OIiwic3RyaW5naWZ5Iiwib3BlbiIsImdldFVzZXIiLCJmb3JtRGF0YSIsInJlY29yZFVzZXIiLCJkZXRhaWwiLCJ2YWx1ZSIsIiRhcHBseSIsImVkaXRGdW4iLCJjaG9vc2VJbWFnZSIsInNlbGYiLCJjb3VudCIsInNpemVUeXBlIiwic291cmNlVHlwZSIsInN1Y2Nlc3MiLCJyZXMiLCJ0ZW1wRmlsZVBhdGhzIiwiaSIsImxlbmd0aCIsInB1c2giLCJpbmRleCIsImZpbGUiLCJwcm9ncmVzcyIsInVwbG9hZGVkIiwidXBsb2FkRXJyb3IiLCJzdGFydFVwbG9hZCIsImZhaWwiLCJkZWxGdW4iLCJzaG93TW9kYWwiLCJ0aXRsZSIsImNvbnRlbnQiLCJjYW5jZWxUZXh0IiwiY29uZmlybVRleHQiLCJjb25maXJtIiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRhcmdldCIsInRoZW4iLCJnZXREZWFpbHMiLCJlcnIiLCJ0aGF0IiwiZXhwZXJpbWVudElkIiwic2V0VGltZW91dCIsIm9wdGlvbnMiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDQTs7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N0QsRUFBbEI7QUFDRDs7O3VDQUNrQjtBQUNqQjtBQUNBLFdBQUt3RCxTQUFMLENBQWUsS0FBS3hELEVBQXBCOztBQUVBO0FBQ0Q7Ozs7RUE1SHNDOEQsZUFBS0MsSTs7a0JBQXpCOUUsVyIsImZpbGUiOiJ0ZXh0RGV0YWlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHdlcHkgZnJvbSBcIndlcHlcIjtcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSBcIi4uL21peGlucy9wYWdlXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXh0RGV0YWlscyBleHRlbmRzIHdlcHkucGFnZSB7XG4gIG1peGlucyA9IFtQYWdlTWl4aW5dO1xuICBjb25maWcgPSB7XG4gICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogXCLnlLDpl7Tlrp7pqoxcIixcbiAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxuICB9O1xuICBkYXRhID0ge1xuICAgIHVwbG9hZEluZGV4OiAwLCAvL+S4iuS8oOeahOe8luWPt1xuICAgIHVwbG9hZEl0ZW1zOiBbXSwgLy/kuIrkvKDnmoTlm77niYfmlbDnu4RcbiAgICB1cGxvYWRpbmc6IGZhbHNlLCAvL+aYr+WQpuato+WcqOS4iuS8oFxuICAgIGxpc3Q6IFt7fSwge31dLFxuICAgIGRlbEl0ZW06IG51bGwsXG4gICAgc2hvd1RvYXN0OiBmYWxzZSxcbiAgICBlcnJvcjogXCJcIixcbiAgICB1c2VyOiB0aGlzLnVzZXIsXG4gICAgaWQ6IG51bGwsXG4gICAgaXNPcGVuOiBmYWxzZSxcbiAgICBkZXRhaWxzOiB7fVxuICB9O1xuICAvLyDojrflj5blrp7pqozor6bmg4VcbiAgZ2V0RGVhaWxzKGlkKSB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXNcbiAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3d4L2V4cGVyaW1lbnQvcXVlcnlFeHBlcmltZW50UmVjb3JkQXBpLmpzb24nLCB7ZXhwZXJpbWVudElkOiBpZH0sIHt9KVxuICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHRoYXQuZGV0YWlscyA9IGRhdGEubGlzdFswXVxuICAgICAgdGhhdC4kYXBwbHkoKTtcbiAgICB9KVxuICB9XG4gIHRvYXN0KGVycm9yKSB7XG4gICAgdGhpcy5zaG93VG9hc3QgPSB0cnVlO1xuICAgIHRoaXMuZXJyb3IgPSBlcnJvcjtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGF0LnNob3dUb2FzdCA9IGZhbHNlO1xuICAgIH0sIDIwMDApO1xuICB9XG4gIG1ldGhvZHMgPSB7XG4gICAgcHJldmlldyhldmVudCkge1xuICAgICAgbGV0IGN1cnJlbnRVcmwgPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuc3JjXG4gICAgICB3eC5wcmV2aWV3SW1hZ2Uoe1xuICAgICAgICBjdXJyZW50OiBjdXJyZW50VXJsLCAvLyDlvZPliY3mmL7npLrlm77niYfnmoRodHRw6ZO+5o6lXG4gICAgICAgIHVybHM6IFtjdXJyZW50VXJsXSAvLyDpnIDopoHpooTop4jnmoTlm77niYdodHRw6ZO+5o6l5YiX6KGoXG4gICAgICB9KVxuICAgIH0sXG4gICAgZWRpdFJlY29yZChlKSB7XG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgdXJsOiAnL3BhZ2VzL2FkZFJlY29yZD9pZD0nICsgdGhpcy5pZCArICcmcmVjb3JkPScgKyBKU09OLnN0cmluZ2lmeShlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pZClcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgLy8g5omT5byA5aKe5Yqg5a6e6aqMXG4gICAgb3BlbigpIHtcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICB1cmw6ICcvcGFnZXMvYWRkUmVjb3JkP2lkPScgKyB0aGlzLmlkXG4gICAgICB9KTtcbiAgICB9LFxuICAgIGdldFVzZXIoZSkge1xuICAgICAgdGhpcy5mb3JtRGF0YS5yZWNvcmRVc2VyID0gZS5kZXRhaWwudmFsdWU7XG4gICAgICB0aGlzLiRhcHBseSgpXG4gICAgfSxcbiAgICAvLyDnvJbovpHlrp7pqozkv6Hmga9cbiAgICBlZGl0RnVuKCkge1xuICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgIHVybDogJy9wYWdlcy9jcmVhdGVUZXN0P2l0ZW09JyArIEpTT04uc3RyaW5naWZ5KHRoaXMuZGV0YWlscylcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgY2hvb3NlSW1hZ2UoZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgd3guY2hvb3NlSW1hZ2Uoe1xuICAgICAgICBjb3VudDogMixcbiAgICAgICAgc2l6ZVR5cGU6IFtcIm9yaWdpbmFsXCIsIFwiY29tcHJlc3NlZFwiXSxcbiAgICAgICAgc291cmNlVHlwZTogW1wiYWxidW1cIiwgXCJjYW1lcmFcIl0sXG4gICAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgICAgICAgLy8gdGVtcEZpbGVQYXRo5Y+v5Lul5L2c5Li6aW1n5qCH562+55qEc3Jj5bGe5oCn5pi+56S65Zu+54mHXG4gICAgICAgICAgY29uc3QgdGVtcEZpbGVQYXRocyA9IHJlcy50ZW1wRmlsZVBhdGhzO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGVtcEZpbGVQYXRocy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc2VsZi51cGxvYWRJdGVtcy5wdXNoKHtcbiAgICAgICAgICAgICAgaW5kZXg6IHNlbGYudXBsb2FkSW5kZXgrKyxcbiAgICAgICAgICAgICAgZmlsZTogdGVtcEZpbGVQYXRoc1tpXSwgLy/nlKjkuo7nm7TmjqXmmL7npLpcbiAgICAgICAgICAgICAgcHJvZ3Jlc3M6IDAsXG4gICAgICAgICAgICAgIHVwbG9hZGVkOiBmYWxzZSwgLy/mmK/lkKbkuIrkvKDlrozmiJBcbiAgICAgICAgICAgICAgdXBsb2FkRXJyb3I6IGZhbHNlLCAvL+S4iuS8oOWksei0pVxuICAgICAgICAgICAgICB1cmw6IFwiXCIgLy/kuIrkvKDlkI7nmoRVUkxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxmLnN0YXJ0VXBsb2FkKCk7XG4gICAgICAgICAgc2VsZi4kYXBwbHkoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZmFpbChlcnJvcikge1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIC8vIOWIoOmZpFxuICAgIGRlbEZ1bihlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICB0aXRsZTogXCLmj5DnpLpcIixcbiAgICAgICAgY29udGVudDogXCLmmK/lkKbnoa7orqTliKDpmaTlvZPliY3lrp7pqozmlbDmja4/XCIsXG4gICAgICAgIGNhbmNlbFRleHQ6IFwi5Y+W5raIXCIsXG4gICAgICAgIGNvbmZpcm1UZXh0OiBcIuehruiupFwiLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcbiAgICAgICAgICAgIHNlbGYuZmV0Y2hEYXRhUHJvbWlzZSgnd3gvZXhwZXJpbWVudC9kZWxldGVFeHBlcmltZW50UmVjb3JkQXBpLmpzb24nLCB7aWQ6IGUudGFyZ2V0LmRhdGFzZXQuaWR9KVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLmZvcm1EYXRhID0ge31cbiAgICAgICAgICAgICAgLy/ov5Tlm57kuIrkuIrkuIDpobVcbiAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+WIoOmZpOaIkOWKnydcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHNlbGYuZ2V0RGVhaWxzKHNlbGYuaWQpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZmFpbDogZnVuY3Rpb24oZXJyKSB7fVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBvbkxvYWQob3B0aW9ucykge1xuICAgIHRoaXMuaWQgPSBvcHRpb25zLmlkXG4gIH1cbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcbiAgICAvLyB0aGlzLmdldExpc3QoKVxuICAgIHRoaXMuZ2V0RGVhaWxzKHRoaXMuaWQpXG4gICAgXG4gICAgLy8g5q+P5qyh6YO95Yi35pawXG4gIH1cbn1cbiJdfQ==