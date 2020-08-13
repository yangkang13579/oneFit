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


var Upload = function (_wepy$page) {
  _inherits(Upload, _wepy$page);

  function Upload() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Upload);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Upload.__proto__ || Object.getPrototypeOf(Upload)).call.apply(_ref, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Upload, [{
    key: "startUpload",

    //启动上传，一个一个上传，
    value: function startUpload() {
      var self = this;
      if (self.uploading) {
        console.log("uploading...");
        return;
      }
      var uploadItem = null;
      for (var i = 0; i < self.uploadItems.length; i++) {
        var item = self.uploadItems[i];
        if (item.progress == 0) {
          uploadItem = item;
          break;
        }
      }
      if (uploadItem != null) {
        self.uploading = true;
        self.uploadFile(uploadItem, function (uploadItem) {
          self.$apply();
        }).then(function (data) {
          self.uploading = false;
          uploadItem.uploaded = true; //标记上传成功
          //uploadItem.imageUrl 就是上传后的值
          self.$apply();
          self.startUpload();
        }).catch(function (e) {
          uploadItem.uploadError = e.message;
          self.uploading = false;
          self.$apply();
          self.startUpload();
        });

        /** 新的 generator 写法
              this.app
                  .uploadFile(uploadItem, function(uploadItem) {
                      self.$apply();
                  })
                  .then(data => {
                      self.uploading = false;
                      uploadItem.uploaded = true; //标记上传成功
                      //uploadItem.imageUrl 就是上传后的值
                      self.$apply();
                     // self.startUpload();
                  })
                  .catch(e => {
                      uploadItem.uploadError = e.message;
                      self.uploading = false;
                      self.$apply();
                     // self.startUpload();
                  });
               */
      }
    }
    //-------------  与上传服务器进行交互 -----------
    /* 传统模式promise 写法 */

  }, {
    key: "uploadFile",
    value: function uploadFile(uploadItem, listener) {
      var self = this;

      console.log("startUpload:", uploadItem.index);
      return new Promise(function (resolve, reject) {
        self._newUpload().then(function (data) {
          console.log("newUpload:", data);
          uploadItem.uploadToken = data.token;
          uploadItem.uploadUrl = data.uploadUrl;
          return self._uploadFile(uploadItem, listener);
        }).then(function (data) {
          return self._uploadQueryCheck(uploadItem, listener);
        }).then(function (data) {
          return self._uploadQueryResult(uploadItem);
        }).then(function (data) {
          console.log("上传结束:", data);
          //上传结束
          if (data.files && data.files.length > 0) {
            var imageUrl = data.files[0].images[0].url;
            console.log("上传结果:" + imageUrl);
            uploadItem.imageUrl = imageUrl;
            resolve(uploadItem);
            console.log(self.uploadItems, "33");
            self.$emit("toParent1", self.uploadItems);
            wx.hideLoading();
          }
        }).catch(function (error) {
          console.log("上传失败:", error);
        });
        //
      });
    }
    //获得一个上传地址
    //https://staticservice.extremevalue.cn/upload.html?appId=qjd

  }, {
    key: "_newUpload",
    value: function _newUpload() {
      var self = this;
      return new Promise(function (resolve, reject) {
        var uploadUrl = wx.getStorageSync("uploadUrl") + "upload.do";
        wx.request({
          url: uploadUrl,
          method: "get",
          data: {
            action: "upload",
            type: "image",
            appId: wx.getStorageSync("uploadAppId")
          },
          success: function success(res) {
            var json = res.data;
            console.log("json11111", json);
            if (json.code == 200) {
              resolve(json.messages.data);
            } else {
              var error = json.messages.error;
              var e = new Error(error.message);
              e.name = error.code;
              reject(e);
            }
          },
          fail: function fail(res) {
            var error = {
              code: "upload_error",
              message: res.errMsg
            };
            var e = new Error(error.message);
            e.name = error.code;
            reject(e);
          }
        });
      });
    }
    //上传文件的具体

  }, {
    key: "_uploadFile",
    value: function _uploadFile(uploadItem, listener) {
      var self = this;
      return new Promise(function (resolve, reject) {
        var uploadTask = wx.uploadFile({
          url: uploadItem.uploadUrl,
          filePath: uploadItem.file,
          name: "file",
          success: function success(res) {
            if (res.statusCode != 200) {
              var error = {
                code: "upload_error",
                message: "HTTP错误:" + res.statusCode
              };
              var e = new Error(error.message);
              e.name = error.code;
              reject(e);
            } else {
              resolve(uploadItem);
            }
          },
          fail: function fail(res) {
            var error = {
              code: "upload_error",
              message: res.errMsg
            };
            var e = new Error(error.message);
            e.name = error.code;
            reject(e);
          }
        });
        //监控上传进度
        uploadTask.onProgressUpdate(function (res) {
          if (listener != null) {
            uploadItem.progress = res.progress;
            if (uploadItem.progress > 99) {
              uploadItem.progress = 99;
            }
            listener(self, uploadItem);
          }

          console.log("上传进度", res.progress);

          //console.log('已经上传的数据长度', res.totalBytesSent);
          console.log("预期需要上传的数据总长度", res.totalBytesExpectedToSend);
        });
      });
    }
    // 确认服务器已经收到所有数据

  }, {
    key: "_uploadQueryCheck",
    value: function _uploadQueryCheck(uploadItem, listener) {
      var uploadUrl = uploadItem.uploadUrl;
      function checkFinished(resolve, reject) {
        wx.request({
          url: uploadUrl,
          method: "get",
          success: function success(res) {
            var data = res.data;
            console.log("check upload finished:", data);
            if (data.status === "finish") {
              if (listener != null) {
                uploadItem.progress = 100;
                listener(uploadItem);
              }
              resolve(data);
            } else {
              setTimeout(function () {
                checkFinished(resolve, reject);
              }, 1000);
            }
          },
          fail: function fail(res) {
            var error = {
              code: "upload_error",
              message: res.errMsg
            };
            console.log("query server error,will retry:", error);
            setTimeout(function () {
              checkFinished(resolve, reject);
            }, 1000);
          }
        });
      }
      return new Promise(function (resolve, reject) {
        checkFinished(resolve, reject);
      });
    }
  }, {
    key: "_uploadQueryResult",
    value: function _uploadQueryResult(uploadItem) {
      var self = this;
      return new Promise(function (resolve, reject) {
        var uploadUrl = wx.getStorageSync("uploadUrl") + "upload.do";
        wx.request({
          url: uploadUrl,
          method: "get",
          data: {
            action: "query",
            token: uploadItem.uploadToken
          },
          success: function success(res) {
            var json = res.data;
            if (json.code === 200) {
              resolve(json.messages.data);
            } else {
              var error = json.messages.error;
              var e = new Error(error.message);
              e.name = error.code;
              reject(e);
            }
          },
          fail: function fail(res) {
            var error = {
              code: "upload_error",
              message: res.errMsg
            };
            var e = new Error(error.message);
            e.name = error.code;
            reject(e);
          }
        });
      });
    }
  }]);

  return Upload;
}(_wepy2.default.page);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.config = {
    navigationBarTitleText: "测试上传图片"
  };
  this.mixins = [_page2.default];
  this.data = {
    uploadIndex: 0, //上传的编号
    imgUpload: "../images/btn_add_img.png",
    uploadItems: [], //上传的图片数组
    isShow: false,
    imgList: [],
    uploading: false //是否正在上传
  };
  this.events = {
    "index-broadcast": function indexBroadcast() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      console.log(args[0], "args[0]");
      var item = args[0][0];
      _this2.isShow = args[0].isShow;
      console.log(_this2.isShow, "isShow");
      for (var i = 0; i < args[0].length; i++) {
        if (args[0][i].groupType === "PROCESS_GROUP") {
          _this2.uploadItems = args[0][i].imgList.map(function (itemA) {
            return {
              imageUrl: itemA,
              uploadUrl: itemA,
              file: itemA,
              uploaded: true,
              progress: 100
            };
          });
          return;
        }
      }
    }
  };
  this.methods = {
    delImg: function delImg(e) {
      this.uploadItems.splice(e.currentTarget.dataset.index, 1);
      this.$emit("toParent1", this.uploadItems);
    },
    preview: function preview(event) {
      var uploadItems = this.uploadItems.map(function (item) {
        return item.file;
      });
      var currentUrl = event.currentTarget.dataset.src;
      wx.previewImage({
        current: currentUrl, // 当前显示图片的http链接
        urls: uploadItems // 需要预览的图片http链接列表
      });
    },
    chooseImage: function chooseImage(e) {
      var self = this;
      wx.chooseImage({
        count: 5 - this.uploadItems.length,
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
    previewImage: function previewImage(e) {
      //
      //
    }
  };
};

exports.default = Upload;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVwbG9hZC5qcyJdLCJuYW1lcyI6WyJVcGxvYWQiLCJzZWxmIiwidXBsb2FkaW5nIiwiY29uc29sZSIsImxvZyIsInVwbG9hZEl0ZW0iLCJpIiwidXBsb2FkSXRlbXMiLCJsZW5ndGgiLCJpdGVtIiwicHJvZ3Jlc3MiLCJ1cGxvYWRGaWxlIiwiJGFwcGx5IiwidGhlbiIsInVwbG9hZGVkIiwic3RhcnRVcGxvYWQiLCJjYXRjaCIsInVwbG9hZEVycm9yIiwiZSIsIm1lc3NhZ2UiLCJsaXN0ZW5lciIsImluZGV4IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJfbmV3VXBsb2FkIiwiZGF0YSIsInVwbG9hZFRva2VuIiwidG9rZW4iLCJ1cGxvYWRVcmwiLCJfdXBsb2FkRmlsZSIsIl91cGxvYWRRdWVyeUNoZWNrIiwiX3VwbG9hZFF1ZXJ5UmVzdWx0IiwiZmlsZXMiLCJpbWFnZVVybCIsImltYWdlcyIsInVybCIsIiRlbWl0Iiwid3giLCJoaWRlTG9hZGluZyIsImVycm9yIiwiZ2V0U3RvcmFnZVN5bmMiLCJyZXF1ZXN0IiwibWV0aG9kIiwiYWN0aW9uIiwidHlwZSIsImFwcElkIiwic3VjY2VzcyIsInJlcyIsImpzb24iLCJjb2RlIiwibWVzc2FnZXMiLCJFcnJvciIsIm5hbWUiLCJmYWlsIiwiZXJyTXNnIiwidXBsb2FkVGFzayIsImZpbGVQYXRoIiwiZmlsZSIsInN0YXR1c0NvZGUiLCJvblByb2dyZXNzVXBkYXRlIiwidG90YWxCeXRlc0V4cGVjdGVkVG9TZW5kIiwiY2hlY2tGaW5pc2hlZCIsInN0YXR1cyIsInNldFRpbWVvdXQiLCJ3ZXB5IiwicGFnZSIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJtaXhpbnMiLCJQYWdlTWl4aW4iLCJ1cGxvYWRJbmRleCIsImltZ1VwbG9hZCIsImlzU2hvdyIsImltZ0xpc3QiLCJldmVudHMiLCJhcmdzIiwiZ3JvdXBUeXBlIiwibWFwIiwiaXRlbUEiLCJtZXRob2RzIiwiZGVsSW1nIiwic3BsaWNlIiwiY3VycmVudFRhcmdldCIsImRhdGFzZXQiLCJwcmV2aWV3IiwiZXZlbnQiLCJjdXJyZW50VXJsIiwic3JjIiwicHJldmlld0ltYWdlIiwiY3VycmVudCIsInVybHMiLCJjaG9vc2VJbWFnZSIsImNvdW50Iiwic2l6ZVR5cGUiLCJzb3VyY2VUeXBlIiwidGVtcEZpbGVQYXRocyIsInB1c2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7QUFGQTs7O0lBR3FCQSxNOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdGbkI7a0NBQ2M7QUFDWixVQUFJQyxPQUFPLElBQVg7QUFDQSxVQUFJQSxLQUFLQyxTQUFULEVBQW9CO0FBQ2xCQyxnQkFBUUMsR0FBUixDQUFZLGNBQVo7QUFDQTtBQUNEO0FBQ0QsVUFBSUMsYUFBYSxJQUFqQjtBQUNBLFdBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJTCxLQUFLTSxXQUFMLENBQWlCQyxNQUFyQyxFQUE2Q0YsR0FBN0MsRUFBa0Q7QUFDaEQsWUFBSUcsT0FBT1IsS0FBS00sV0FBTCxDQUFpQkQsQ0FBakIsQ0FBWDtBQUNBLFlBQUlHLEtBQUtDLFFBQUwsSUFBaUIsQ0FBckIsRUFBd0I7QUFDdEJMLHVCQUFhSSxJQUFiO0FBQ0E7QUFDRDtBQUNGO0FBQ0QsVUFBSUosY0FBYyxJQUFsQixFQUF3QjtBQUN0QkosYUFBS0MsU0FBTCxHQUFpQixJQUFqQjtBQUNBRCxhQUNHVSxVQURILENBQ2NOLFVBRGQsRUFDMEIsVUFBU0EsVUFBVCxFQUFxQjtBQUMzQ0osZUFBS1csTUFBTDtBQUNELFNBSEgsRUFJR0MsSUFKSCxDQUlRLGdCQUFRO0FBQ1paLGVBQUtDLFNBQUwsR0FBaUIsS0FBakI7QUFDQUcscUJBQVdTLFFBQVgsR0FBc0IsSUFBdEIsQ0FGWSxDQUVnQjtBQUM1QjtBQUNBYixlQUFLVyxNQUFMO0FBQ0FYLGVBQUtjLFdBQUw7QUFDRCxTQVZILEVBV0dDLEtBWEgsQ0FXUyxhQUFLO0FBQ1ZYLHFCQUFXWSxXQUFYLEdBQXlC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QWZKLEVBZU87QUFDYixVQUFJakIsT0FBTyxJQUFYO0FBQ0FxQyxTQUFHc0QsV0FBSCxDQUFlO0FBQ2JDLGVBQU8sSUFBSSxLQUFLdEYsV0FBTCxDQUFpQkMsTUFEZjtBQUVic0Ysa0JBQVUsQ0FBQyxVQUFELEVBQWEsWUFBYixDQUZHO0FBR2JDLG9CQUFZLENBQUMsT0FBRCxFQUFVLFFBQVYsQ0FIQztBQUliaEQsZUFKYSxtQkFJTEMsR0FKSyxFQUlBO0FBQ1g7QUFDQSxjQUFNZ0QsZ0JBQWdCaEQsSUFBSWdELGFBQTFCO0FBQ0EsZUFBSyxJQUFJMUYsSUFBSSxDQUFiLEVBQWdCQSxJQUFJMEYsY0FBY3hGLE1BQWxDLEVBQTBDRixHQUExQyxFQUErQztBQUM3Q0wsaUJBQUtNLFdBQUwsQ0FBaUIwRixJQUFqQixDQUFzQjtBQUNwQjVFLHFCQUFPcEIsS0FBS3NFLFdBQUwsRUFEYTtBQUVwQmIsb0JBQU1zQyxjQUFjMUYsQ0FBZCxDQUZjLEVBRUk7QUFDeEJJLHdCQUFVLENBSFU7QUFJcEJJLHdCQUFVLEtBSlUsRUFJSDtBQUNqQkcsMkJBQWEsS0FMTyxFQUtBO0FBQ3BCbUIsbUJBQUssRUFOZSxDQU1aO0FBTlksYUFBdEI7QUFRRDtBQUNEbkMsZUFBS2MsV0FBTDtBQUNBZCxlQUFLVyxNQUFMO0FBQ0QsU0FuQlk7QUFvQmIwQyxZQXBCYSxnQkFvQlJkLEtBcEJRLEVBb0JELENBQUU7QUFwQkQsT0FBZjtBQXNCRCxLQXZDTztBQXdDUmlELGdCQXhDUSx3QkF3Q0t2RSxDQXhDTCxFQXdDUTtBQUNkO0FBQ0E7QUFDRDtBQTNDTyxHOzs7a0JBbkNTbEIsTSIsImZpbGUiOiJ1cGxvYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qIGdsb2JhbCB3eCAqL1xuaW1wb3J0IHdlcHkgZnJvbSBcIndlcHlcIjtcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSBcIi4uL21peGlucy9wYWdlXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVcGxvYWQgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xuICBjb25maWcgPSB7XG4gICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogXCLmtYvor5XkuIrkvKDlm77niYdcIlxuICB9O1xuICBtaXhpbnMgPSBbUGFnZU1peGluXTtcbiAgZGF0YSA9IHtcbiAgICB1cGxvYWRJbmRleDogMCwgLy/kuIrkvKDnmoTnvJblj7dcbiAgICBpbWdVcGxvYWQ6IFwiLi4vaW1hZ2VzL2J0bl9hZGRfaW1nLnBuZ1wiLFxuICAgIHVwbG9hZEl0ZW1zOiBbXSwgLy/kuIrkvKDnmoTlm77niYfmlbDnu4RcbiAgICBpc1Nob3c6IGZhbHNlLFxuICAgIGltZ0xpc3Q6IFtdLFxuICAgIHVwbG9hZGluZzogZmFsc2UgLy/mmK/lkKbmraPlnKjkuIrkvKBcbiAgfTtcbiAgZXZlbnRzID0ge1xuICAgIFwiaW5kZXgtYnJvYWRjYXN0XCI6ICguLi5hcmdzKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhhcmdzWzBdLCBcImFyZ3NbMF1cIik7XG4gICAgICBjb25zdCBpdGVtID0gYXJnc1swXVswXTtcbiAgICAgIHRoaXMuaXNTaG93ID0gYXJnc1swXS5pc1Nob3c7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmlzU2hvdywgXCJpc1Nob3dcIik7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3NbMF0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGFyZ3NbMF1baV0uZ3JvdXBUeXBlID09PSBcIlBST0NFU1NfR1JPVVBcIikge1xuICAgICAgICAgIHRoaXMudXBsb2FkSXRlbXMgPSBhcmdzWzBdW2ldLmltZ0xpc3QubWFwKGl0ZW1BID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGltYWdlVXJsOiBpdGVtQSxcbiAgICAgICAgICAgICAgdXBsb2FkVXJsOiBpdGVtQSxcbiAgICAgICAgICAgICAgZmlsZTogaXRlbUEsXG4gICAgICAgICAgICAgIHVwbG9hZGVkOiB0cnVlLFxuICAgICAgICAgICAgICBwcm9ncmVzczogMTAwXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgbWV0aG9kcyA9IHtcbiAgICBkZWxJbWcoZSkge1xuICAgICAgdGhpcy51cGxvYWRJdGVtcy5zcGxpY2UoZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXgsIDEpO1xuICAgICAgdGhpcy4kZW1pdChcInRvUGFyZW50MVwiLCB0aGlzLnVwbG9hZEl0ZW1zKTtcbiAgICB9LFxuICAgIHByZXZpZXcoZXZlbnQpIHtcbiAgICAgIGNvbnN0IHVwbG9hZEl0ZW1zID0gdGhpcy51cGxvYWRJdGVtcy5tYXAoaXRlbSA9PiB7XG4gICAgICAgIHJldHVybiBpdGVtLmZpbGU7XG4gICAgICB9KTtcbiAgICAgIGxldCBjdXJyZW50VXJsID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LnNyYztcbiAgICAgIHd4LnByZXZpZXdJbWFnZSh7XG4gICAgICAgIGN1cnJlbnQ6IGN1cnJlbnRVcmwsIC8vIOW9k+WJjeaYvuekuuWbvueJh+eahGh0dHDpk77mjqVcbiAgICAgICAgdXJsczogdXBsb2FkSXRlbXMgLy8g6ZyA6KaB6aKE6KeI55qE5Zu+54mHaHR0cOmTvuaOpeWIl+ihqFxuICAgICAgfSk7XG4gICAgfSxcbiAgICBjaG9vc2VJbWFnZShlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB3eC5jaG9vc2VJbWFnZSh7XG4gICAgICAgIGNvdW50OiA1IC0gdGhpcy51cGxvYWRJdGVtcy5sZW5ndGgsXG4gICAgICAgIHNpemVUeXBlOiBbXCJvcmlnaW5hbFwiLCBcImNvbXByZXNzZWRcIl0sXG4gICAgICAgIHNvdXJjZVR5cGU6IFtcImFsYnVtXCIsIFwiY2FtZXJhXCJdLFxuICAgICAgICBzdWNjZXNzKHJlcykge1xuICAgICAgICAgIC8vIHRlbXBGaWxlUGF0aOWPr+S7peS9nOS4umltZ+agh+etvueahHNyY+WxnuaAp+aYvuekuuWbvueJh1xuICAgICAgICAgIGNvbnN0IHRlbXBGaWxlUGF0aHMgPSByZXMudGVtcEZpbGVQYXRocztcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRlbXBGaWxlUGF0aHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHNlbGYudXBsb2FkSXRlbXMucHVzaCh7XG4gICAgICAgICAgICAgIGluZGV4OiBzZWxmLnVwbG9hZEluZGV4KyssXG4gICAgICAgICAgICAgIGZpbGU6IHRlbXBGaWxlUGF0aHNbaV0sIC8v55So5LqO55u05o6l5pi+56S6XG4gICAgICAgICAgICAgIHByb2dyZXNzOiAwLFxuICAgICAgICAgICAgICB1cGxvYWRlZDogZmFsc2UsIC8v5piv5ZCm5LiK5Lyg5a6M5oiQXG4gICAgICAgICAgICAgIHVwbG9hZEVycm9yOiBmYWxzZSwgLy/kuIrkvKDlpLHotKVcbiAgICAgICAgICAgICAgdXJsOiBcIlwiIC8v5LiK5Lyg5ZCO55qEVVJMXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2VsZi5zdGFydFVwbG9hZCgpO1xuICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XG4gICAgICAgIH0sXG4gICAgICAgIGZhaWwoZXJyb3IpIHt9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHByZXZpZXdJbWFnZShlKSB7XG4gICAgICAvL1xuICAgICAgLy9cbiAgICB9XG4gIH07XG4gIC8v5ZCv5Yqo5LiK5Lyg77yM5LiA5Liq5LiA5Liq5LiK5Lyg77yMXG4gIHN0YXJ0VXBsb2FkKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi51cGxvYWRpbmcpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwidXBsb2FkaW5nLi4uXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdXBsb2FkSXRlbSA9IG51bGw7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxmLnVwbG9hZEl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaXRlbSA9IHNlbGYudXBsb2FkSXRlbXNbaV07XG4gICAgICBpZiAoaXRlbS5wcm9ncmVzcyA9PSAwKSB7XG4gICAgICAgIHVwbG9hZEl0ZW0gPSBpdGVtO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHVwbG9hZEl0ZW0gIT0gbnVsbCkge1xuICAgICAgc2VsZi51cGxvYWRpbmcgPSB0cnVlO1xuICAgICAgc2VsZlxuICAgICAgICAudXBsb2FkRmlsZSh1cGxvYWRJdGVtLCBmdW5jdGlvbih1cGxvYWRJdGVtKSB7XG4gICAgICAgICAgc2VsZi4kYXBwbHkoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgc2VsZi51cGxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB1cGxvYWRJdGVtLnVwbG9hZGVkID0gdHJ1ZTsgLy/moIforrDkuIrkvKDmiJDlip9cbiAgICAgICAgICAvL3VwbG9hZEl0ZW0uaW1hZ2VVcmwg5bCx5piv5LiK5Lyg5ZCO55qE5YC8XG4gICAgICAgICAgc2VsZi4kYXBwbHkoKTtcbiAgICAgICAgICBzZWxmLnN0YXJ0VXBsb2FkKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgICB1cGxvYWRJdGVtLnVwbG9hZEVycm9yID0gZS5tZXNzYWdlO1xuICAgICAgICAgIHNlbGYudXBsb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgc2VsZi4kYXBwbHkoKTtcbiAgICAgICAgICBzZWxmLnN0YXJ0VXBsb2FkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAvKiog5paw55qEIGdlbmVyYXRvciDlhpnms5VcbiAgICAgICAgICAgIHRoaXMuYXBwXG4gICAgICAgICAgICAgICAgLnVwbG9hZEZpbGUodXBsb2FkSXRlbSwgZnVuY3Rpb24odXBsb2FkSXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXBsb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0udXBsb2FkZWQgPSB0cnVlOyAvL+agh+iusOS4iuS8oOaIkOWKn1xuICAgICAgICAgICAgICAgICAgICAvL3VwbG9hZEl0ZW0uaW1hZ2VVcmwg5bCx5piv5LiK5Lyg5ZCO55qE5YC8XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgICAgLy8gc2VsZi5zdGFydFVwbG9hZCgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnVwbG9hZEVycm9yID0gZS5tZXNzYWdlO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnVwbG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgICAgIC8vIHNlbGYuc3RhcnRVcGxvYWQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAqL1xuICAgIH1cbiAgfVxuICAvLy0tLS0tLS0tLS0tLS0gIOS4juS4iuS8oOacjeWKoeWZqOi/m+ihjOS6pOS6kiAtLS0tLS0tLS0tLVxuICAvKiDkvKDnu5/mqKHlvI9wcm9taXNlIOWGmeazlSAqL1xuICB1cGxvYWRGaWxlKHVwbG9hZEl0ZW0sIGxpc3RlbmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgY29uc29sZS5sb2coXCJzdGFydFVwbG9hZDpcIiwgdXBsb2FkSXRlbS5pbmRleCk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHNlbGZcbiAgICAgICAgLl9uZXdVcGxvYWQoKVxuICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ld1VwbG9hZDpcIiwgZGF0YSk7XG4gICAgICAgICAgdXBsb2FkSXRlbS51cGxvYWRUb2tlbiA9IGRhdGEudG9rZW47XG4gICAgICAgICAgdXBsb2FkSXRlbS51cGxvYWRVcmwgPSBkYXRhLnVwbG9hZFVybDtcbiAgICAgICAgICByZXR1cm4gc2VsZi5fdXBsb2FkRmlsZSh1cGxvYWRJdGVtLCBsaXN0ZW5lcik7XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgIHJldHVybiBzZWxmLl91cGxvYWRRdWVyeUNoZWNrKHVwbG9hZEl0ZW0sIGxpc3RlbmVyKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHNlbGYuX3VwbG9hZFF1ZXJ5UmVzdWx0KHVwbG9hZEl0ZW0pO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIuS4iuS8oOe7k+adnzpcIiwgZGF0YSk7XG4gICAgICAgICAgLy/kuIrkvKDnu5PmnZ9cbiAgICAgICAgICBpZiAoZGF0YS5maWxlcyAmJiBkYXRhLmZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBpbWFnZVVybCA9IGRhdGEuZmlsZXNbMF0uaW1hZ2VzWzBdLnVybDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5LiK5Lyg57uT5p6cOlwiICsgaW1hZ2VVcmwpO1xuICAgICAgICAgICAgdXBsb2FkSXRlbS5pbWFnZVVybCA9IGltYWdlVXJsO1xuICAgICAgICAgICAgcmVzb2x2ZSh1cGxvYWRJdGVtKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYudXBsb2FkSXRlbXMsIFwiMzNcIik7XG4gICAgICAgICAgICBzZWxmLiRlbWl0KFwidG9QYXJlbnQxXCIsIHNlbGYudXBsb2FkSXRlbXMpO1xuICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCLkuIrkvKDlpLHotKU6XCIsIGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICAvL1xuICAgIH0pO1xuICB9XG4gIC8v6I635b6X5LiA5Liq5LiK5Lyg5Zyw5Z2AXG4gIC8vaHR0cHM6Ly9zdGF0aWNzZXJ2aWNlLmV4dHJlbWV2YWx1ZS5jbi91cGxvYWQuaHRtbD9hcHBJZD1xamRcbiAgX25ld1VwbG9hZCgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHZhciB1cGxvYWRVcmwgPSB3eC5nZXRTdG9yYWdlU3luYyhcInVwbG9hZFVybFwiKSArIFwidXBsb2FkLmRvXCI7XG4gICAgICB3eC5yZXF1ZXN0KHtcbiAgICAgICAgdXJsOiB1cGxvYWRVcmwsXG4gICAgICAgIG1ldGhvZDogXCJnZXRcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGFjdGlvbjogXCJ1cGxvYWRcIixcbiAgICAgICAgICB0eXBlOiBcImltYWdlXCIsXG4gICAgICAgICAgYXBwSWQ6IHd4LmdldFN0b3JhZ2VTeW5jKFwidXBsb2FkQXBwSWRcIilcbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgICB2YXIganNvbiA9IHJlcy5kYXRhO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwianNvbjExMTExXCIsIGpzb24pO1xuICAgICAgICAgIGlmIChqc29uLmNvZGUgPT0gMjAwKSB7XG4gICAgICAgICAgICByZXNvbHZlKGpzb24ubWVzc2FnZXMuZGF0YSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGVycm9yID0ganNvbi5tZXNzYWdlcy5lcnJvcjtcbiAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcbiAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGZhaWwocmVzKSB7XG4gICAgICAgICAgdmFyIGVycm9yID0ge1xuICAgICAgICAgICAgY29kZTogXCJ1cGxvYWRfZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IHJlcy5lcnJNc2dcbiAgICAgICAgICB9O1xuICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XG4gICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICAvL+S4iuS8oOaWh+S7tueahOWFt+S9k1xuICBfdXBsb2FkRmlsZSh1cGxvYWRJdGVtLCBsaXN0ZW5lcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdXBsb2FkVGFzayA9IHd4LnVwbG9hZEZpbGUoe1xuICAgICAgICB1cmw6IHVwbG9hZEl0ZW0udXBsb2FkVXJsLFxuICAgICAgICBmaWxlUGF0aDogdXBsb2FkSXRlbS5maWxlLFxuICAgICAgICBuYW1lOiBcImZpbGVcIixcbiAgICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgICBpZiAocmVzLnN0YXR1c0NvZGUgIT0gMjAwKSB7XG4gICAgICAgICAgICB2YXIgZXJyb3IgPSB7XG4gICAgICAgICAgICAgIGNvZGU6IFwidXBsb2FkX2Vycm9yXCIsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IFwiSFRUUOmUmeivrzpcIiArIHJlcy5zdGF0dXNDb2RlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICBlLm5hbWUgPSBlcnJvci5jb2RlO1xuICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNvbHZlKHVwbG9hZEl0ZW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZmFpbChyZXMpIHtcbiAgICAgICAgICB2YXIgZXJyb3IgPSB7XG4gICAgICAgICAgICBjb2RlOiBcInVwbG9hZF9lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogcmVzLmVyck1zZ1xuICAgICAgICAgIH07XG4gICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcbiAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgLy/nm5HmjqfkuIrkvKDov5vluqZcbiAgICAgIHVwbG9hZFRhc2sub25Qcm9ncmVzc1VwZGF0ZShyZXMgPT4ge1xuICAgICAgICBpZiAobGlzdGVuZXIgIT0gbnVsbCkge1xuICAgICAgICAgIHVwbG9hZEl0ZW0ucHJvZ3Jlc3MgPSByZXMucHJvZ3Jlc3M7XG4gICAgICAgICAgaWYgKHVwbG9hZEl0ZW0ucHJvZ3Jlc3MgPiA5OSkge1xuICAgICAgICAgICAgdXBsb2FkSXRlbS5wcm9ncmVzcyA9IDk5O1xuICAgICAgICAgIH1cbiAgICAgICAgICBsaXN0ZW5lcihzZWxmLCB1cGxvYWRJdGVtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKFwi5LiK5Lyg6L+b5bqmXCIsIHJlcy5wcm9ncmVzcyk7XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZygn5bey57uP5LiK5Lyg55qE5pWw5o2u6ZW/5bqmJywgcmVzLnRvdGFsQnl0ZXNTZW50KTtcbiAgICAgICAgY29uc29sZS5sb2coXCLpooTmnJ/pnIDopoHkuIrkvKDnmoTmlbDmja7mgLvplb/luqZcIiwgcmVzLnRvdGFsQnl0ZXNFeHBlY3RlZFRvU2VuZCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICAvLyDnoa7orqTmnI3liqHlmajlt7Lnu4/mlLbliLDmiYDmnInmlbDmja5cbiAgX3VwbG9hZFF1ZXJ5Q2hlY2sodXBsb2FkSXRlbSwgbGlzdGVuZXIpIHtcbiAgICB2YXIgdXBsb2FkVXJsID0gdXBsb2FkSXRlbS51cGxvYWRVcmw7XG4gICAgZnVuY3Rpb24gY2hlY2tGaW5pc2hlZChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHd4LnJlcXVlc3Qoe1xuICAgICAgICB1cmw6IHVwbG9hZFVybCxcbiAgICAgICAgbWV0aG9kOiBcImdldFwiLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICB2YXIgZGF0YSA9IHJlcy5kYXRhO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2hlY2sgdXBsb2FkIGZpbmlzaGVkOlwiLCBkYXRhKTtcbiAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09IFwiZmluaXNoXCIpIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHVwbG9hZEl0ZW0ucHJvZ3Jlc3MgPSAxMDA7XG4gICAgICAgICAgICAgIGxpc3RlbmVyKHVwbG9hZEl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgY2hlY2tGaW5pc2hlZChyZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmYWlsOiBmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICB2YXIgZXJyb3IgPSB7XG4gICAgICAgICAgICBjb2RlOiBcInVwbG9hZF9lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogcmVzLmVyck1zZ1xuICAgICAgICAgIH07XG4gICAgICAgICAgY29uc29sZS5sb2coXCJxdWVyeSBzZXJ2ZXIgZXJyb3Isd2lsbCByZXRyeTpcIiwgZXJyb3IpO1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjaGVja0ZpbmlzaGVkKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY2hlY2tGaW5pc2hlZChyZXNvbHZlLCByZWplY3QpO1xuICAgIH0pO1xuICB9XG4gIF91cGxvYWRRdWVyeVJlc3VsdCh1cGxvYWRJdGVtKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB2YXIgdXBsb2FkVXJsID0gd3guZ2V0U3RvcmFnZVN5bmMoXCJ1cGxvYWRVcmxcIikgKyBcInVwbG9hZC5kb1wiO1xuICAgICAgd3gucmVxdWVzdCh7XG4gICAgICAgIHVybDogdXBsb2FkVXJsLFxuICAgICAgICBtZXRob2Q6IFwiZ2V0XCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBhY3Rpb246IFwicXVlcnlcIixcbiAgICAgICAgICB0b2tlbjogdXBsb2FkSXRlbS51cGxvYWRUb2tlblxuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICB2YXIganNvbiA9IHJlcy5kYXRhO1xuICAgICAgICAgIGlmIChqc29uLmNvZGUgPT09IDIwMCkge1xuICAgICAgICAgICAgcmVzb2x2ZShqc29uLm1lc3NhZ2VzLmRhdGEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IGpzb24ubWVzc2FnZXMuZXJyb3I7XG4gICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XG4gICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmYWlsOiBmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICB2YXIgZXJyb3IgPSB7XG4gICAgICAgICAgICBjb2RlOiBcInVwbG9hZF9lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogcmVzLmVyck1zZ1xuICAgICAgICAgIH07XG4gICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcbiAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG4iXX0=