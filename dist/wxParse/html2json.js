'use strict';

/**
 * html2Json 改造来自: https://github.com/Jxck/html2json
 *
 *
 * author: Di (微信小程序开发工程师)
 * organization: WeAppDev(微信小程序开发论坛)(http://weappdev.com)
 *               垂直微信小程序开发交流社区
 *
 * github地址: https://github.com/icindy/wxParse
 *
 * for: 微信小程序富文本解析
 * detail : http://weappdev.com/t/wxparse-alpha0-1-html-markdown/184
 */

var __placeImgeUrlHttps = 'https';
var __emojisReg = '';
var __emojisBaseSrc = '';
var __emojis = {};
var wxDiscode = require('./wxDiscode.js');
var HTMLParser = require('./htmlparser.js');
// Empty Elements - HTML 5
var empty = makeMap('area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr');
// Block Elements - HTML 5
var block = makeMap('br,a,code,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video');

// Inline Elements - HTML 5
var inline = makeMap('abbr,acronym,applet,b,basefont,bdo,big,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var');

// Elements that you can, intentionally, leave open
// (and which close themselves)
var closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');

// Attributes that have their values filled in disabled="disabled"
var fillAttrs = makeMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected');

// Special Elements (can contain anything)
var special = makeMap('wxxxcode-style,script,style,view,scroll-view,block');
function makeMap(str) {
    var obj = {},
        items = str.split(',');
    for (var i = 0; i < items.length; i++) {
        obj[items[i]] = true;
    }
    return obj;
}

function q(v) {
    return '"' + v + '"';
}

function removeDOCTYPE(html) {
    return html.replace(/<\?xml.*\?>\n/, '').replace(/<.*!doctype.*\>\n/, '').replace(/<.*!DOCTYPE.*\>\n/, '');
}

function trimHtml(html) {
    return html.replace(/\r?\n+/g, '').replace(/<!--.*?-->/ig, '').replace(/\/\*.*?\*\//ig, '').replace(/[ ]+</ig, '<');
}

function html2json(html, bindName) {
    // 处理字符串
    html = removeDOCTYPE(html);
    html = trimHtml(html);
    html = wxDiscode.strDiscode(html);
    // 生成node节点
    var bufArray = [];
    var results = {
        node: bindName,
        nodes: [],
        images: [],
        imageUrls: []
    };
    var index = 0;
    HTMLParser(html, {
        start: function start(tag, attrs, unary) {
            // debug(tag, attrs, unary);
            // node for this element
            var node = {
                node: 'element',
                tag: tag
            };

            if (bufArray.length === 0) {
                node.index = index.toString();
                index += 1;
            } else {
                var parent = bufArray[0];
                if (parent.nodes === undefined) {
                    parent.nodes = [];
                }
                node.index = parent.index + '.' + parent.nodes.length;
            }

            if (block[tag]) {
                node.tagType = 'block';
            } else if (inline[tag]) {
                node.tagType = 'inline';
            } else if (closeSelf[tag]) {
                node.tagType = 'closeSelf';
            }

            if (attrs.length !== 0) {
                node.attr = attrs.reduce(function (pre, attr) {
                    var name = attr.name;
                    var value = attr.value;
                    if (name == 'class') {
                        console.dir(value);
                        //  value = value.join("")
                        node.classStr = value;
                    }
                    // has multi attibutes
                    // make it array of attribute
                    if (name == 'style') {
                        console.dir(value);
                        //  value = value.join("")
                        node.styleStr = value;
                    }
                    if (value.match(/ /)) {
                        value = value.split(' ');
                    }

                    // if attr already exists
                    // merge it
                    if (pre[name]) {
                        if (Array.isArray(pre[name])) {
                            // already array, push to last
                            pre[name].push(value);
                        } else {
                            // single value, make it array
                            pre[name] = [pre[name], value];
                        }
                    } else {
                        // not exist, put it
                        pre[name] = value;
                    }

                    return pre;
                }, {});
            }

            // 对img添加额外数据
            if (node.tag === 'img') {
                node.imgIndex = results.images.length;
                var imgUrl = node.attr.src;
                if (imgUrl[0] == '') {
                    imgUrl.splice(0, 1);
                }
                imgUrl = wxDiscode.urlToHttpUrl(imgUrl, __placeImgeUrlHttps);
                node.attr.src = imgUrl;
                node.from = bindName;
                results.images.push(node);
                results.imageUrls.push(imgUrl);
            }

            // 处理font标签样式属性
            if (node.tag === 'font') {
                var fontSize = ['x-small', 'small', 'medium', 'large', 'x-large', 'xx-large', '-webkit-xxx-large'];
                var styleAttrs = {
                    'color': 'color',
                    'face': 'font-family',
                    'size': 'font-size'
                };
                if (!node.attr.style) node.attr.style = [];
                if (!node.styleStr) node.styleStr = '';
                for (var key in styleAttrs) {
                    if (node.attr[key]) {
                        var value = key === 'size' ? fontSize[node.attr[key] - 1] : node.attr[key];
                        node.attr.style.push(styleAttrs[key]);
                        node.attr.style.push(value);
                        node.styleStr += styleAttrs[key] + ': ' + value + ';';
                    }
                }
            }

            // 临时记录source资源
            if (node.tag === 'source') {
                results.source = node.attr.src;
            }

            if (unary) {
                // if this tag doesn't have end tag
                // like <img src="hoge.png"/>
                // add to parents
                var parent = bufArray[0] || results;
                if (parent.nodes === undefined) {
                    parent.nodes = [];
                }
                parent.nodes.push(node);
            } else {
                bufArray.unshift(node);
            }
        },
        end: function end(tag) {
            // debug(tag);
            // merge into parent tag
            var node = bufArray.shift();
            if (node.tag !== tag) console.error('invalid state: mismatch end tag');

            // 当有缓存source资源时于于video补上src资源
            if (node.tag === 'video' && results.source) {
                node.attr.src = results.source;
                delete results.source;
            }

            if (bufArray.length === 0) {
                results.nodes.push(node);
            } else {
                var parent = bufArray[0];
                if (parent.nodes === undefined) {
                    parent.nodes = [];
                }
                parent.nodes.push(node);
            }
        },
        chars: function chars(text) {
            // debug(text);
            var node = {
                node: 'text',
                text: text,
                textArray: transEmojiStr(text)
            };

            if (bufArray.length === 0) {
                node.index = index.toString();
                index += 1;
                results.nodes.push(node);
            } else {
                var parent = bufArray[0];
                if (parent.nodes === undefined) {
                    parent.nodes = [];
                }
                node.index = parent.index + '.' + parent.nodes.length;
                parent.nodes.push(node);
            }
        },
        comment: function comment(text) {
            // debug(text);
            // var node = {
            //     node: 'comment',
            //     text: text,
            // };
            // var parent = bufArray[0];
            // if (parent.nodes === undefined) {
            //     parent.nodes = [];
            // }
            // parent.nodes.push(node);
        }
    });
    return results;
};

function transEmojiStr(str) {
    // var eReg = new RegExp("["+__reg+' '+"]");
    //   str = str.replace(/\[([^\[\]]+)\]/g,':$1:')

    var emojiObjs = [];
    // 如果正则表达式为空
    if (__emojisReg.length == 0 || !__emojis) {
        var emojiObj = {};
        emojiObj.node = 'text';
        emojiObj.text = str;
        array = [emojiObj];
        return array;
    }
    // 这个地方需要调整
    str = str.replace(/\[([^\[\]]+)\]/g, ':$1:');
    var eReg = new RegExp('[:]');
    var array = str.split(eReg);
    for (var i = 0; i < array.length; i++) {
        var ele = array[i];
        var emojiObj = {};
        if (__emojis[ele]) {
            emojiObj.node = 'element';
            emojiObj.tag = 'emoji';
            emojiObj.text = __emojis[ele];
            emojiObj.baseSrc = __emojisBaseSrc;
        } else {
            emojiObj.node = 'text';
            emojiObj.text = ele;
        }
        emojiObjs.push(emojiObj);
    }

    return emojiObjs;
}

function emojisInit() {
    var reg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var baseSrc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/wxParse/emojis/';
    var emojis = arguments[2];

    __emojisReg = reg;
    __emojisBaseSrc = baseSrc;
    __emojis = emojis;
}

module.exports = {
    html2json: html2json,
    emojisInit: emojisInit
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0bWwyanNvbi5qcyJdLCJuYW1lcyI6WyJfX3BsYWNlSW1nZVVybEh0dHBzIiwiX19lbW9qaXNSZWciLCJfX2Vtb2ppc0Jhc2VTcmMiLCJfX2Vtb2ppcyIsInd4RGlzY29kZSIsInJlcXVpcmUiLCJIVE1MUGFyc2VyIiwiZW1wdHkiLCJtYWtlTWFwIiwiYmxvY2siLCJpbmxpbmUiLCJjbG9zZVNlbGYiLCJmaWxsQXR0cnMiLCJzcGVjaWFsIiwic3RyIiwib2JqIiwiaXRlbXMiLCJzcGxpdCIsImkiLCJsZW5ndGgiLCJxIiwidiIsInJlbW92ZURPQ1RZUEUiLCJodG1sIiwicmVwbGFjZSIsInRyaW1IdG1sIiwiaHRtbDJqc29uIiwiYmluZE5hbWUiLCJzdHJEaXNjb2RlIiwiYnVmQXJyYXkiLCJyZXN1bHRzIiwibm9kZSIsIm5vZGVzIiwiaW1hZ2VzIiwiaW1hZ2VVcmxzIiwiaW5kZXgiLCJzdGFydCIsInRhZyIsImF0dHJzIiwidW5hcnkiLCJ0b1N0cmluZyIsInBhcmVudCIsInVuZGVmaW5lZCIsInRhZ1R5cGUiLCJhdHRyIiwicmVkdWNlIiwicHJlIiwibmFtZSIsInZhbHVlIiwiY29uc29sZSIsImRpciIsImNsYXNzU3RyIiwic3R5bGVTdHIiLCJtYXRjaCIsIkFycmF5IiwiaXNBcnJheSIsInB1c2giLCJpbWdJbmRleCIsImltZ1VybCIsInNyYyIsInNwbGljZSIsInVybFRvSHR0cFVybCIsImZyb20iLCJmb250U2l6ZSIsInN0eWxlQXR0cnMiLCJzdHlsZSIsImtleSIsInNvdXJjZSIsInVuc2hpZnQiLCJlbmQiLCJzaGlmdCIsImVycm9yIiwiY2hhcnMiLCJ0ZXh0IiwidGV4dEFycmF5IiwidHJhbnNFbW9qaVN0ciIsImNvbW1lbnQiLCJlbW9qaU9ianMiLCJlbW9qaU9iaiIsImFycmF5IiwiZVJlZyIsIlJlZ0V4cCIsImVsZSIsImJhc2VTcmMiLCJlbW9qaXNJbml0IiwicmVnIiwiZW1vamlzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5n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QUFoQjtBQUNBK0MscUJBQVN6QyxHQUFULEdBQWUsT0FBZjtBQUNBeUMscUJBQVNMLElBQVQsR0FBZ0J0RSxTQUFTK0UsR0FBVCxDQUFoQjtBQUNBSixxQkFBU0ssT0FBVCxHQUFtQmpGLGVBQW5CO0FBQ0gsU0FMRCxNQUtPO0FBQ0g0RSxxQkFBUy9DLElBQVQsR0FBZ0IsTUFBaEI7QUFDQStDLHFCQUFTTCxJQUFULEdBQWdCUyxHQUFoQjtBQUNIO0FBQ0RMLGtCQUFVckIsSUFBVixDQUFlc0IsUUFBZjtBQUNIOztBQUVELFdBQU9ELFNBQVA7QUFDSDs7QUFFRCxTQUFTTyxVQUFULEdBQW9FO0FBQUEsUUFBaERDLEdBQWdELHVFQUExQyxFQUEwQztBQUFBLFFBQXRDRixPQUFzQyx1RUFBNUIsa0JBQTRCO0FBQUEsUUFBUkcsTUFBUTs7QUFDaEVyRixrQkFBY29GLEdBQWQ7QUFDQW5GLHNCQUFrQmlGLE9BQWxCO0FBQ0FoRixlQUFXbUYsTUFBWDtBQUNIOztBQUVEQyxPQUFPQyxPQUFQLEdBQWlCO0FBQ2I5RCxlQUFXQSxTQURFO0FBRWIwRCxnQkFBWUE7QUFGQyxDQUFqQiIsImZpbGUiOiJodG1sMmpzb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogaHRtbDJKc29uIOaUuemAoOadpeiHqjogaHR0cHM6Ly9naXRodWIuY29tL0p4Y2svaHRtbDJqc29uXHJcbiAqXHJcbiAqXHJcbiAqIGF1dGhvcjogRGkgKOW+ruS/oeWwj+eoi+W6j+W8gOWPkeW3peeoi+W4iClcclxuICogb3JnYW5pemF0aW9uOiBXZUFwcERldijlvq7kv6HlsI/nqIvluo/lvIDlj5HorrrlnZspKGh0dHA6Ly93ZWFwcGRldi5jb20pXHJcbiAqICAgICAgICAgICAgICAg5Z6C55u05b6u5L+h5bCP56iL5bqP5byA5Y+R5Lqk5rWB56S+5Yy6XHJcbiAqXHJcbiAqIGdpdGh1YuWcsOWdgDogaHR0cHM6Ly9naXRodWIuY29tL2ljaW5keS93eFBhcnNlXHJcbiAqXHJcbiAqIGZvcjog5b6u5L+h5bCP56iL5bqP5a+M5paH5pys6Kej5p6QXHJcbiAqIGRldGFpbCA6IGh0dHA6Ly93ZWFwcGRldi5jb20vdC93eHBhcnNlLWFscGhhMC0xLWh0bWwtbWFya2Rvd24vMTg0XHJcbiAqL1xyXG5cclxudmFyIF9fcGxhY2VJbWdlVXJsSHR0cHMgPSAnaHR0cHMnO1xyXG52YXIgX19lbW9qaXNSZWcgPSAnJztcclxudmFyIF9fZW1vamlzQmFzZVNyYyA9ICcnO1xyXG52YXIgX19lbW9qaXMgPSB7fTtcclxudmFyIHd4RGlzY29kZSA9IHJlcXVpcmUoJy4vd3hEaXNjb2RlLmpzJyk7XHJcbnZhciBIVE1MUGFyc2VyID0gcmVxdWlyZSgnLi9odG1scGFyc2VyLmpzJyk7XHJcbi8vIEVtcHR5IEVsZW1lbnRzIC0gSFRNTCA1XHJcbnZhciBlbXB0eSA9IG1ha2VNYXAoJ2FyZWEsYmFzZSxiYXNlZm9udCxicixjb2wsZnJhbWUsaHIsaW1nLGlucHV0LGxpbmssbWV0YSxwYXJhbSxlbWJlZCxjb21tYW5kLGtleWdlbixzb3VyY2UsdHJhY2ssd2JyJyk7XHJcbi8vIEJsb2NrIEVsZW1lbnRzIC0gSFRNTCA1XHJcbnZhciBibG9jayA9IG1ha2VNYXAoJ2JyLGEsY29kZSxhZGRyZXNzLGFydGljbGUsYXBwbGV0LGFzaWRlLGF1ZGlvLGJsb2NrcXVvdGUsYnV0dG9uLGNhbnZhcyxjZW50ZXIsZGQsZGVsLGRpcixkaXYsZGwsZHQsZmllbGRzZXQsZmlnY2FwdGlvbixmaWd1cmUsZm9vdGVyLGZvcm0sZnJhbWVzZXQsaDEsaDIsaDMsaDQsaDUsaDYsaGVhZGVyLGhncm91cCxocixpZnJhbWUsaW5zLGlzaW5kZXgsbGksbWFwLG1lbnUsbm9mcmFtZXMsbm9zY3JpcHQsb2JqZWN0LG9sLG91dHB1dCxwLHByZSxzZWN0aW9uLHNjcmlwdCx0YWJsZSx0Ym9keSx0ZCx0Zm9vdCx0aCx0aGVhZCx0cix1bCx2aWRlbycpO1xyXG5cclxuLy8gSW5saW5lIEVsZW1lbnRzIC0gSFRNTCA1XHJcbnZhciBpbmxpbmUgPSBtYWtlTWFwKCdhYmJyLGFjcm9ueW0sYXBwbGV0LGIsYmFzZWZvbnQsYmRvLGJpZyxidXR0b24sY2l0ZSxkZWwsZGZuLGVtLGZvbnQsaSxpZnJhbWUsaW1nLGlucHV0LGlucyxrYmQsbGFiZWwsbWFwLG9iamVjdCxxLHMsc2FtcCxzY3JpcHQsc2VsZWN0LHNtYWxsLHNwYW4sc3RyaWtlLHN0cm9uZyxzdWIsc3VwLHRleHRhcmVhLHR0LHUsdmFyJyk7XHJcblxyXG4vLyBFbGVtZW50cyB0aGF0IHlvdSBjYW4sIGludGVudGlvbmFsbHksIGxlYXZlIG9wZW5cclxuLy8gKGFuZCB3aGljaCBjbG9zZSB0aGVtc2VsdmVzKVxyXG52YXIgY2xvc2VTZWxmID0gbWFrZU1hcCgnY29sZ3JvdXAsZGQsZHQsbGksb3B0aW9ucyxwLHRkLHRmb290LHRoLHRoZWFkLHRyJyk7XHJcblxyXG4vLyBBdHRyaWJ1dGVzIHRoYXQgaGF2ZSB0aGVpciB2YWx1ZXMgZmlsbGVkIGluIGRpc2FibGVkPVwiZGlzYWJsZWRcIlxyXG52YXIgZmlsbEF0dHJzID0gbWFrZU1hcCgnY2hlY2tlZCxjb21wYWN0LGRlY2xhcmUsZGVmZXIsZGlzYWJsZWQsaXNtYXAsbXVsdGlwbGUsbm9ocmVmLG5vcmVzaXplLG5vc2hhZGUsbm93cmFwLHJlYWRvbmx5LHNlbGVjdGVkJyk7XHJcblxyXG4vLyBTcGVjaWFsIEVsZW1lbnRzIChjYW4gY29udGFpbiBhbnl0aGluZylcclxudmFyIHNwZWNpYWwgPSBtYWtlTWFwKCd3eHh4Y29kZS1zdHlsZSxzY3JpcHQsc3R5bGUsdmlldyxzY3JvbGwtdmlldyxibG9jaycpO1xyXG5mdW5jdGlvbiBtYWtlTWFwKHN0cikge1xyXG4gICAgdmFyIG9iaiA9IHt9LCBpdGVtcyA9IHN0ci5zcGxpdCgnLCcpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykgeyBvYmpbaXRlbXNbaV1dID0gdHJ1ZTsgfVxyXG4gICAgcmV0dXJuIG9iajtcclxufVxyXG5cclxuZnVuY3Rpb24gcSh2KSB7XHJcbiAgICByZXR1cm4gJ1wiJyArIHYgKyAnXCInO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVET0NUWVBFKGh0bWwpIHtcclxuICAgIHJldHVybiBodG1sXHJcbiAgICAgICAgLnJlcGxhY2UoLzxcXD94bWwuKlxcPz5cXG4vLCAnJylcclxuICAgICAgICAucmVwbGFjZSgvPC4qIWRvY3R5cGUuKlxcPlxcbi8sICcnKVxyXG4gICAgICAgIC5yZXBsYWNlKC88LiohRE9DVFlQRS4qXFw+XFxuLywgJycpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0cmltSHRtbChodG1sKSB7XHJcbiAgICByZXR1cm4gaHRtbFxyXG4gICAgICAgIC5yZXBsYWNlKC9cXHI/XFxuKy9nLCAnJylcclxuICAgICAgICAucmVwbGFjZSgvPCEtLS4qPy0tPi9pZywgJycpXHJcbiAgICAgICAgLnJlcGxhY2UoL1xcL1xcKi4qP1xcKlxcLy9pZywgJycpXHJcbiAgICAgICAgLnJlcGxhY2UoL1sgXSs8L2lnLCAnPCcpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBodG1sMmpzb24oaHRtbCwgYmluZE5hbWUpIHtcclxuICAgIC8vIOWkhOeQhuWtl+espuS4slxyXG4gICAgaHRtbCA9IHJlbW92ZURPQ1RZUEUoaHRtbCk7XHJcbiAgICBodG1sID0gdHJpbUh0bWwoaHRtbCk7XHJcbiAgICBodG1sID0gd3hEaXNjb2RlLnN0ckRpc2NvZGUoaHRtbCk7XHJcbiAgICAvLyDnlJ/miJBub2Rl6IqC54K5XHJcbiAgICB2YXIgYnVmQXJyYXkgPSBbXTtcclxuICAgIHZhciByZXN1bHRzID0ge1xyXG4gICAgICAgIG5vZGU6IGJpbmROYW1lLFxyXG4gICAgICAgIG5vZGVzOiBbXSxcclxuICAgICAgICBpbWFnZXM6IFtdLFxyXG4gICAgICAgIGltYWdlVXJsczogW11cclxuICAgIH07XHJcbiAgICB2YXIgaW5kZXggPSAwO1xyXG4gICAgSFRNTFBhcnNlcihodG1sLCB7XHJcbiAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uICh0YWcsIGF0dHJzLCB1bmFyeSkge1xyXG4gICAgICAgICAgICAvLyBkZWJ1Zyh0YWcsIGF0dHJzLCB1bmFyeSk7XHJcbiAgICAgICAgICAgIC8vIG5vZGUgZm9yIHRoaXMgZWxlbWVudFxyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IHtcclxuICAgICAgICAgICAgICAgIG5vZGU6ICdlbGVtZW50JyxcclxuICAgICAgICAgICAgICAgIHRhZzogdGFnLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKGJ1ZkFycmF5Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgbm9kZS5pbmRleCA9IGluZGV4LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICBpbmRleCArPSAxO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IGJ1ZkFycmF5WzBdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcmVudC5ub2RlcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Lm5vZGVzID0gW107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBub2RlLmluZGV4ID0gcGFyZW50LmluZGV4ICsgJy4nICsgcGFyZW50Lm5vZGVzLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGJsb2NrW3RhZ10pIHtcclxuICAgICAgICAgICAgICAgIG5vZGUudGFnVHlwZSA9ICdibG9jayc7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5saW5lW3RhZ10pIHtcclxuICAgICAgICAgICAgICAgIG5vZGUudGFnVHlwZSA9ICdpbmxpbmUnO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNsb3NlU2VsZlt0YWddKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlLnRhZ1R5cGUgPSAnY2xvc2VTZWxmJztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGF0dHJzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgbm9kZS5hdHRyID0gYXR0cnMucmVkdWNlKGZ1bmN0aW9uIChwcmUsIGF0dHIpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IGF0dHIubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBhdHRyLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuYW1lID09ICdjbGFzcycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgdmFsdWUgPSB2YWx1ZS5qb2luKFwiXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NTdHIgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaGFzIG11bHRpIGF0dGlidXRlc1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1ha2UgaXQgYXJyYXkgb2YgYXR0cmlidXRlXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWUgPT0gJ3N0eWxlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcih2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICB2YWx1ZSA9IHZhbHVlLmpvaW4oXCJcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5zdHlsZVN0ciA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUubWF0Y2goLyAvKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnNwbGl0KCcgJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiBhdHRyIGFscmVhZHkgZXhpc3RzXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbWVyZ2UgaXRcclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJlW25hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHByZVtuYW1lXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFscmVhZHkgYXJyYXksIHB1c2ggdG8gbGFzdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlW25hbWVdLnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2luZ2xlIHZhbHVlLCBtYWtlIGl0IGFycmF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVbbmFtZV0gPSBbcHJlW25hbWVdLCB2YWx1ZV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBub3QgZXhpc3QsIHB1dCBpdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVbbmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmU7XHJcbiAgICAgICAgICAgICAgICB9LCB7fSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIOWvuWltZ+a3u+WKoOmineWkluaVsOaNrlxyXG4gICAgICAgICAgICBpZiAobm9kZS50YWcgPT09ICdpbWcnKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlLmltZ0luZGV4ID0gcmVzdWx0cy5pbWFnZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgdmFyIGltZ1VybCA9IG5vZGUuYXR0ci5zcmM7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW1nVXJsWzBdID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW1nVXJsLnNwbGljZSgwLCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGltZ1VybCA9IHd4RGlzY29kZS51cmxUb0h0dHBVcmwoaW1nVXJsLCBfX3BsYWNlSW1nZVVybEh0dHBzKTtcclxuICAgICAgICAgICAgICAgIG5vZGUuYXR0ci5zcmMgPSBpbWdVcmw7XHJcbiAgICAgICAgICAgICAgICBub2RlLmZyb20gPSBiaW5kTmFtZTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdHMuaW1hZ2VzLnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRzLmltYWdlVXJscy5wdXNoKGltZ1VybCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIOWkhOeQhmZvbnTmoIfnrb7moLflvI/lsZ7mgKdcclxuICAgICAgICAgICAgaWYgKG5vZGUudGFnID09PSAnZm9udCcpIHtcclxuICAgICAgICAgICAgICAgIHZhciBmb250U2l6ZSA9IFsneC1zbWFsbCcsICdzbWFsbCcsICdtZWRpdW0nLCAnbGFyZ2UnLCAneC1sYXJnZScsICd4eC1sYXJnZScsICctd2Via2l0LXh4eC1sYXJnZSddO1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0eWxlQXR0cnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbG9yJzogJ2NvbG9yJyxcclxuICAgICAgICAgICAgICAgICAgICAnZmFjZSc6ICdmb250LWZhbWlseScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3NpemUnOiAnZm9udC1zaXplJ1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGlmICghbm9kZS5hdHRyLnN0eWxlKSBub2RlLmF0dHIuc3R5bGUgPSBbXTtcclxuICAgICAgICAgICAgICAgIGlmICghbm9kZS5zdHlsZVN0cikgbm9kZS5zdHlsZVN0ciA9ICcnO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHN0eWxlQXR0cnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5hdHRyW2tleV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0ga2V5ID09PSAnc2l6ZScgPyBmb250U2l6ZVtub2RlLmF0dHJba2V5XSAtIDFdIDogbm9kZS5hdHRyW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuYXR0ci5zdHlsZS5wdXNoKHN0eWxlQXR0cnNba2V5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuYXR0ci5zdHlsZS5wdXNoKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5zdHlsZVN0ciArPSBzdHlsZUF0dHJzW2tleV0gKyAnOiAnICsgdmFsdWUgKyAnOyc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDkuLTml7borrDlvZVzb3VyY2XotYTmupBcclxuICAgICAgICAgICAgaWYgKG5vZGUudGFnID09PSAnc291cmNlJykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0cy5zb3VyY2UgPSBub2RlLmF0dHIuc3JjO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodW5hcnkpIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIHRoaXMgdGFnIGRvZXNuJ3QgaGF2ZSBlbmQgdGFnXHJcbiAgICAgICAgICAgICAgICAvLyBsaWtlIDxpbWcgc3JjPVwiaG9nZS5wbmdcIi8+XHJcbiAgICAgICAgICAgICAgICAvLyBhZGQgdG8gcGFyZW50c1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IGJ1ZkFycmF5WzBdIHx8IHJlc3VsdHM7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFyZW50Lm5vZGVzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQubm9kZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHBhcmVudC5ub2Rlcy5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYnVmQXJyYXkudW5zaGlmdChub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW5kOiBmdW5jdGlvbiAodGFnKSB7XHJcbiAgICAgICAgICAgIC8vIGRlYnVnKHRhZyk7XHJcbiAgICAgICAgICAgIC8vIG1lcmdlIGludG8gcGFyZW50IHRhZ1xyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IGJ1ZkFycmF5LnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIGlmIChub2RlLnRhZyAhPT0gdGFnKSBjb25zb2xlLmVycm9yKCdpbnZhbGlkIHN0YXRlOiBtaXNtYXRjaCBlbmQgdGFnJyk7XHJcblxyXG4gICAgICAgICAgICAvLyDlvZPmnInnvJPlrZhzb3VyY2XotYTmupDml7bkuo7kuo52aWRlb+ihpeS4inNyY+i1hOa6kFxyXG4gICAgICAgICAgICBpZiAobm9kZS50YWcgPT09ICd2aWRlbycgJiYgcmVzdWx0cy5zb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgIG5vZGUuYXR0ci5zcmMgPSByZXN1bHRzLnNvdXJjZTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSByZXN1bHRzLnNvdXJjZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGJ1ZkFycmF5Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0cy5ub2Rlcy5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IGJ1ZkFycmF5WzBdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcmVudC5ub2RlcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Lm5vZGVzID0gW107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQubm9kZXMucHVzaChub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2hhcnM6IGZ1bmN0aW9uICh0ZXh0KSB7XHJcbiAgICAgICAgICAgIC8vIGRlYnVnKHRleHQpO1xyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IHtcclxuICAgICAgICAgICAgICAgIG5vZGU6ICd0ZXh0JyxcclxuICAgICAgICAgICAgICAgIHRleHQ6IHRleHQsXHJcbiAgICAgICAgICAgICAgICB0ZXh0QXJyYXk6IHRyYW5zRW1vamlTdHIodGV4dClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmIChidWZBcnJheS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIG5vZGUuaW5kZXggPSBpbmRleC50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgaW5kZXggKz0gMTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdHMubm9kZXMucHVzaChub2RlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSBidWZBcnJheVswXTtcclxuICAgICAgICAgICAgICAgIGlmIChwYXJlbnQubm9kZXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5ub2RlcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbm9kZS5pbmRleCA9IHBhcmVudC5pbmRleCArICcuJyArIHBhcmVudC5ub2Rlcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQubm9kZXMucHVzaChub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29tbWVudDogZnVuY3Rpb24gKHRleHQpIHtcclxuICAgICAgICAgICAgLy8gZGVidWcodGV4dCk7XHJcbiAgICAgICAgICAgIC8vIHZhciBub2RlID0ge1xyXG4gICAgICAgICAgICAvLyAgICAgbm9kZTogJ2NvbW1lbnQnLFxyXG4gICAgICAgICAgICAvLyAgICAgdGV4dDogdGV4dCxcclxuICAgICAgICAgICAgLy8gfTtcclxuICAgICAgICAgICAgLy8gdmFyIHBhcmVudCA9IGJ1ZkFycmF5WzBdO1xyXG4gICAgICAgICAgICAvLyBpZiAocGFyZW50Lm5vZGVzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy8gICAgIHBhcmVudC5ub2RlcyA9IFtdO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vIHBhcmVudC5ub2Rlcy5wdXNoKG5vZGUpO1xyXG4gICAgICAgIH0sXHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXN1bHRzO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gdHJhbnNFbW9qaVN0cihzdHIpIHtcclxuICAgIC8vIHZhciBlUmVnID0gbmV3IFJlZ0V4cChcIltcIitfX3JlZysnICcrXCJdXCIpO1xyXG4vLyAgIHN0ciA9IHN0ci5yZXBsYWNlKC9cXFsoW15cXFtcXF1dKylcXF0vZywnOiQxOicpXHJcblxyXG4gICAgdmFyIGVtb2ppT2JqcyA9IFtdO1xyXG4gICAgLy8g5aaC5p6c5q2j5YiZ6KGo6L6+5byP5Li656m6XHJcbiAgICBpZiAoX19lbW9qaXNSZWcubGVuZ3RoID09IDAgfHwgIV9fZW1vamlzKSB7XHJcbiAgICAgICAgdmFyIGVtb2ppT2JqID0ge307XHJcbiAgICAgICAgZW1vamlPYmoubm9kZSA9ICd0ZXh0JztcclxuICAgICAgICBlbW9qaU9iai50ZXh0ID0gc3RyO1xyXG4gICAgICAgIGFycmF5ID0gW2Vtb2ppT2JqXTtcclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9XHJcbiAgICAvLyDov5nkuKrlnLDmlrnpnIDopoHosIPmlbRcclxuICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9cXFsoW15cXFtcXF1dKylcXF0vZywgJzokMTonKTtcclxuICAgIHZhciBlUmVnID0gbmV3IFJlZ0V4cCgnWzpdJyk7XHJcbiAgICB2YXIgYXJyYXkgPSBzdHIuc3BsaXQoZVJlZyk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGVsZSA9IGFycmF5W2ldO1xyXG4gICAgICAgIHZhciBlbW9qaU9iaiA9IHt9O1xyXG4gICAgICAgIGlmIChfX2Vtb2ppc1tlbGVdKSB7XHJcbiAgICAgICAgICAgIGVtb2ppT2JqLm5vZGUgPSAnZWxlbWVudCc7XHJcbiAgICAgICAgICAgIGVtb2ppT2JqLnRhZyA9ICdlbW9qaSc7XHJcbiAgICAgICAgICAgIGVtb2ppT2JqLnRleHQgPSBfX2Vtb2ppc1tlbGVdO1xyXG4gICAgICAgICAgICBlbW9qaU9iai5iYXNlU3JjID0gX19lbW9qaXNCYXNlU3JjO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGVtb2ppT2JqLm5vZGUgPSAndGV4dCc7XHJcbiAgICAgICAgICAgIGVtb2ppT2JqLnRleHQgPSBlbGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVtb2ppT2Jqcy5wdXNoKGVtb2ppT2JqKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZW1vamlPYmpzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBlbW9qaXNJbml0KHJlZyA9ICcnLCBiYXNlU3JjID0gJy93eFBhcnNlL2Vtb2ppcy8nLCBlbW9qaXMpIHtcclxuICAgIF9fZW1vamlzUmVnID0gcmVnO1xyXG4gICAgX19lbW9qaXNCYXNlU3JjID0gYmFzZVNyYztcclxuICAgIF9fZW1vamlzID0gZW1vamlzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGh0bWwyanNvbjogaHRtbDJqc29uLFxyXG4gICAgZW1vamlzSW5pdDogZW1vamlzSW5pdFxyXG59O1xyXG4iXX0=