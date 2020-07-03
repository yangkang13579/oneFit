'use strict';

/**
 *
 * htmlParser改造自: https://github.com/blowsie/Pure-JavaScript-HTML5-Parser
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
// Regular Expressions for parsing tags and attributes
var startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
    endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/,
    attr = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

// Empty Elements - HTML 5
var empty = makeMap('area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr');

// Block Elements - HTML 5
var block = makeMap('a,address,code,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video');

// Inline Elements - HTML 5
var inline = makeMap('abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var');

// Elements that you can, intentionally, leave open
// (and which close themselves)
var closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');

// Attributes that have their values filled in disabled="disabled"
var fillAttrs = makeMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected');

// Special Elements (can contain anything)
var special = makeMap('wxxxcode-style,script,style,view,scroll-view,block');

function HTMLParser(html, handler) {
    var index,
        chars,
        match,
        stack = [],
        last = html;
    stack.last = function () {
        return this[this.length - 1];
    };

    while (html) {
        chars = true;

        // Make sure we're not in a script or style element
        if (!stack.last() || !special[stack.last()]) {

            // Comment
            if (html.indexOf('<!--') == 0) {
                index = html.indexOf('-->');

                if (index >= 0) {
                    if (handler.comment) {
                        handler.comment(html.substring(4, index));
                    }
                    html = html.substring(index + 3);
                    chars = false;
                }

                // end tag
            } else if (html.indexOf('</') == 0) {
                match = html.match(endTag);

                if (match) {
                    html = html.substring(match[0].length);
                    match[0].replace(endTag, parseEndTag);
                    chars = false;
                }

                // start tag
            } else if (html.indexOf('<') == 0) {
                match = html.match(startTag);

                if (match) {
                    html = html.substring(match[0].length);
                    match[0].replace(startTag, parseStartTag);
                    chars = false;
                }
            }

            if (chars) {
                index = html.indexOf('<');
                var text = '';
                while (index === 0) {
                    text += '<';
                    html = html.substring(1);
                    index = html.indexOf('<');
                }
                text += index < 0 ? html : html.substring(0, index);
                html = index < 0 ? '' : html.substring(index);

                if (handler.chars) {
                    handler.chars(text);
                }
            }
        } else {

            html = html.replace(new RegExp('([\\s\\S]*?)<\/' + stack.last() + '[^>]*>'), function (all, text) {
                text = text.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g, '$1$2');
                if (handler.chars) {
                    handler.chars(text);
                }

                return '';
            });

            parseEndTag('', stack.last());
        }

        if (html == last) {
            throw 'Parse Error: ' + html;
        }
        last = html;
    }

    // Clean up any remaining tags
    parseEndTag();

    function parseStartTag(tag, tagName, rest, unary) {
        tagName = tagName.toLowerCase();

        if (block[tagName]) {
            while (stack.last() && inline[stack.last()]) {
                parseEndTag('', stack.last());
            }
        }

        if (closeSelf[tagName] && stack.last() == tagName) {
            parseEndTag('', tagName);
        }

        unary = empty[tagName] || !!unary;

        if (!unary) {
            stack.push(tagName);
        }

        if (handler.start) {
            var attrs = [];

            rest.replace(attr, function (match, name) {
                var value = arguments[2] ? arguments[2] : arguments[3] ? arguments[3] : arguments[4] ? arguments[4] : fillAttrs[name] ? name : '';

                attrs.push({
                    name: name,
                    value: value,
                    escaped: value.replace(/(^|[^\\])"/g, '$1\\\"') // "
                });
            });

            if (handler.start) {
                handler.start(tagName, attrs, unary);
            }
        }
    }

    function parseEndTag(tag, tagName) {
        // If no tag name is provided, clean shop
        if (!tagName) {
            var pos = 0;
        }

        // Find the closest opened tag of the same type
        else {
                tagName = tagName.toLowerCase();
                for (var pos = stack.length - 1; pos >= 0; pos--) {
                    if (stack[pos] == tagName) {
                        break;
                    }
                }
            }
        if (pos >= 0) {
            // Close all the open elements, up the stack
            for (var i = stack.length - 1; i >= pos; i--) {
                if (handler.end) {
                    handler.end(stack[i]);
                }
            }

            // Remove the open elements from the stack
            stack.length = pos;
        }
    }
};

function makeMap(str) {
    var obj = {},
        items = str.split(',');
    for (var i = 0; i < items.length; i++) {
        obj[items[i]] = true;
    }
    return obj;
}

module.exports = HTMLParser;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0bWxwYXJzZXIuanMiXSwibmFtZXMiOlsic3RhcnRUYWciLCJlbmRUYWciLCJhdHRyIiwiZW1wdHkiLCJtYWtlTWFwIiwiYmxvY2siLCJpbmxpbmUiLCJjbG9zZVNlbGYiLCJmaWxsQXR0cnMiLCJzcGVjaWFsIiwiSFRNTFBhcnNlciIsImh0bWwiLCJoYW5kbGVyIiwiaW5kZXgiLCJjaGFycyIsIm1hdGNoIiwic3RhY2siLCJsYXN0IiwibGVuZ3RoIiwiaW5kZXhPZiIsImNvbW1lbnQiLCJzdWJzdHJpbmciLCJyZXBsYWNlIiwicGFyc2VFbmRUYWciLCJwYXJzZVN0YXJ0VGFnIiwidGV4dCIsIlJlZ0V4cCIsImFsbCIsInRhZyIsInRhZ05hbWUiLCJyZXN0IiwidW5hcnkiLCJ0b0xvd2VyQ2FzZSIsInB1c2giLCJzdGFydCIsImF0dHJzIiwibmFtZSIsInZhbHVlIiwiYXJndW1lbnRzIiwiZXNjYXBlZCIsInBvcyIsImkiLCJlbmQiLCJzdHIiLCJvYmoiLCJpdGVtcyIsInNwbGl0IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7Ozs7OztBQWFBO0FBQ0EsSUFBSUEsV0FBVyxnSEFBZjtBQUFBLElBQ0lDLFNBQVMsNEJBRGI7QUFBQSxJQUVJQyxPQUFPLG9HQUZYOztBQUlBO0FBQ0EsSUFBSUMsUUFBUUMsUUFBUSxvR0FBUixDQUFaOztBQUVBO0FBQ0EsSUFBSUMsUUFBUUQsUUFBUSxvVEFBUixDQUFaOztBQUVBO0FBQ0EsSUFBSUUsU0FBU0YsUUFBUSw2TEFBUixDQUFiOztBQUVBO0FBQ0E7QUFDQSxJQUFJRyxZQUFZSCxRQUFRLGtEQUFSLENBQWhCOztBQUVBO0FBQ0EsSUFBSUksWUFBWUosUUFBUSx3R0FBUixDQUFoQjs7QUFFQTtBQUNBLElBQUlLLFVBQVVMLFFBQVEsb0RBQVIsQ0FBZDs7QUFFQSxTQUFTTSxVQUFULENBQW9CQyxJQUFwQixFQUEwQkMsT0FBMUIsRUFBbUM7QUFDL0IsUUFBSUMsS0FBSjtBQUFB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UUFBY0MsUUFBUUYsSUFBSUcsS0FBSixDQUFVLEdBQVYsQ0FBdEI7QUFDQSxTQUFLLElBQUlMLElBQUksQ0FBYixFQUFnQkEsSUFBSUksTUFBTTNCLE1BQTFCLEVBQWtDdUIsR0FBbEMsRUFBdUM7QUFBRUcsWUFBSUMsTUFBTUosQ0FBTixDQUFKLElBQWdCLElBQWhCO0FBQXVCO0FBQ2hFLFdBQU9HLEdBQVA7QUFDSDs7QUFFREcsT0FBT0MsT0FBUCxHQUFpQnRDLFVBQWpCIiwiZmlsZSI6Imh0bWxwYXJzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICpcclxuICogaHRtbFBhcnNlcuaUuemAoOiHqjogaHR0cHM6Ly9naXRodWIuY29tL2Jsb3dzaWUvUHVyZS1KYXZhU2NyaXB0LUhUTUw1LVBhcnNlclxyXG4gKlxyXG4gKiBhdXRob3I6IERpICjlvq7kv6HlsI/nqIvluo/lvIDlj5Hlt6XnqIvluIgpXHJcbiAqIG9yZ2FuaXphdGlvbjogV2VBcHBEZXYo5b6u5L+h5bCP56iL5bqP5byA5Y+R6K665Z2bKShodHRwOi8vd2VhcHBkZXYuY29tKVxyXG4gKiAgICAgICAgICAgICAgIOWeguebtOW+ruS/oeWwj+eoi+W6j+W8gOWPkeS6pOa1geekvuWMulxyXG4gKlxyXG4gKiBnaXRodWLlnLDlnYA6IGh0dHBzOi8vZ2l0aHViLmNvbS9pY2luZHkvd3hQYXJzZVxyXG4gKlxyXG4gKiBmb3I6IOW+ruS/oeWwj+eoi+W6j+WvjOaWh+acrOino+aekFxyXG4gKiBkZXRhaWwgOiBodHRwOi8vd2VhcHBkZXYuY29tL3Qvd3hwYXJzZS1hbHBoYTAtMS1odG1sLW1hcmtkb3duLzE4NFxyXG4gKi9cclxuLy8gUmVndWxhciBFeHByZXNzaW9ucyBmb3IgcGFyc2luZyB0YWdzIGFuZCBhdHRyaWJ1dGVzXHJcbnZhciBzdGFydFRhZyA9IC9ePChbLUEtWmEtejAtOV9dKykoKD86XFxzK1thLXpBLVpfOl1bLWEtekEtWjAtOV86Ll0qKD86XFxzKj1cXHMqKD86KD86XCJbXlwiXSpcIil8KD86J1teJ10qJyl8W14+XFxzXSspKT8pKilcXHMqKFxcLz8pPi8sXHJcbiAgICBlbmRUYWcgPSAvXjxcXC8oWy1BLVphLXowLTlfXSspW14+XSo+LyxcclxuICAgIGF0dHIgPSAvKFthLXpBLVpfOl1bLWEtekEtWjAtOV86Ll0qKSg/Olxccyo9XFxzKig/Oig/OlwiKCg/OlxcXFwufFteXCJdKSopXCIpfCg/OicoKD86XFxcXC58W14nXSkqKScpfChbXj5cXHNdKykpKT8vZztcclxuXHJcbi8vIEVtcHR5IEVsZW1lbnRzIC0gSFRNTCA1XHJcbnZhciBlbXB0eSA9IG1ha2VNYXAoJ2FyZWEsYmFzZSxiYXNlZm9udCxicixjb2wsZnJhbWUsaHIsaW1nLGlucHV0LGxpbmssbWV0YSxwYXJhbSxlbWJlZCxjb21tYW5kLGtleWdlbixzb3VyY2UsdHJhY2ssd2JyJyk7XHJcblxyXG4vLyBCbG9jayBFbGVtZW50cyAtIEhUTUwgNVxyXG52YXIgYmxvY2sgPSBtYWtlTWFwKCdhLGFkZHJlc3MsY29kZSxhcnRpY2xlLGFwcGxldCxhc2lkZSxhdWRpbyxibG9ja3F1b3RlLGJ1dHRvbixjYW52YXMsY2VudGVyLGRkLGRlbCxkaXIsZGl2LGRsLGR0LGZpZWxkc2V0LGZpZ2NhcHRpb24sZmlndXJlLGZvb3Rlcixmb3JtLGZyYW1lc2V0LGgxLGgyLGgzLGg0LGg1LGg2LGhlYWRlcixoZ3JvdXAsaHIsaWZyYW1lLGlucyxpc2luZGV4LGxpLG1hcCxtZW51LG5vZnJhbWVzLG5vc2NyaXB0LG9iamVjdCxvbCxvdXRwdXQscCxwcmUsc2VjdGlvbixzY3JpcHQsdGFibGUsdGJvZHksdGQsdGZvb3QsdGgsdGhlYWQsdHIsdWwsdmlkZW8nKTtcclxuXHJcbi8vIElubGluZSBFbGVtZW50cyAtIEhUTUwgNVxyXG52YXIgaW5saW5lID0gbWFrZU1hcCgnYWJicixhY3JvbnltLGFwcGxldCxiLGJhc2Vmb250LGJkbyxiaWcsYnIsYnV0dG9uLGNpdGUsZGVsLGRmbixlbSxmb250LGksaWZyYW1lLGltZyxpbnB1dCxpbnMsa2JkLGxhYmVsLG1hcCxvYmplY3QscSxzLHNhbXAsc2NyaXB0LHNlbGVjdCxzbWFsbCxzcGFuLHN0cmlrZSxzdHJvbmcsc3ViLHN1cCx0ZXh0YXJlYSx0dCx1LHZhcicpO1xyXG5cclxuLy8gRWxlbWVudHMgdGhhdCB5b3UgY2FuLCBpbnRlbnRpb25hbGx5LCBsZWF2ZSBvcGVuXHJcbi8vIChhbmQgd2hpY2ggY2xvc2UgdGhlbXNlbHZlcylcclxudmFyIGNsb3NlU2VsZiA9IG1ha2VNYXAoJ2NvbGdyb3VwLGRkLGR0LGxpLG9wdGlvbnMscCx0ZCx0Zm9vdCx0aCx0aGVhZCx0cicpO1xyXG5cclxuLy8gQXR0cmlidXRlcyB0aGF0IGhhdmUgdGhlaXIgdmFsdWVzIGZpbGxlZCBpbiBkaXNhYmxlZD1cImRpc2FibGVkXCJcclxudmFyIGZpbGxBdHRycyA9IG1ha2VNYXAoJ2NoZWNrZWQsY29tcGFjdCxkZWNsYXJlLGRlZmVyLGRpc2FibGVkLGlzbWFwLG11bHRpcGxlLG5vaHJlZixub3Jlc2l6ZSxub3NoYWRlLG5vd3JhcCxyZWFkb25seSxzZWxlY3RlZCcpO1xyXG5cclxuLy8gU3BlY2lhbCBFbGVtZW50cyAoY2FuIGNvbnRhaW4gYW55dGhpbmcpXHJcbnZhciBzcGVjaWFsID0gbWFrZU1hcCgnd3h4eGNvZGUtc3R5bGUsc2NyaXB0LHN0eWxlLHZpZXcsc2Nyb2xsLXZpZXcsYmxvY2snKTtcclxuXHJcbmZ1bmN0aW9uIEhUTUxQYXJzZXIoaHRtbCwgaGFuZGxlcikge1xyXG4gICAgdmFyIGluZGV4LCBjaGFycywgbWF0Y2gsIHN0YWNrID0gW10sIGxhc3QgPSBodG1sO1xyXG4gICAgc3RhY2subGFzdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpc1t0aGlzLmxlbmd0aCAtIDFdO1xyXG4gICAgfTtcclxuXHJcbiAgICB3aGlsZSAoaHRtbCkge1xyXG4gICAgICAgIGNoYXJzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgLy8gTWFrZSBzdXJlIHdlJ3JlIG5vdCBpbiBhIHNjcmlwdCBvciBzdHlsZSBlbGVtZW50XHJcbiAgICAgICAgaWYgKCFzdGFjay5sYXN0KCkgfHwgIXNwZWNpYWxbc3RhY2subGFzdCgpXSkge1xyXG5cclxuICAgICAgICAgICAgLy8gQ29tbWVudFxyXG4gICAgICAgICAgICBpZiAoaHRtbC5pbmRleE9mKCc8IS0tJykgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSBodG1sLmluZGV4T2YoJy0tPicpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhhbmRsZXIuY29tbWVudCkgeyBoYW5kbGVyLmNvbW1lbnQoaHRtbC5zdWJzdHJpbmcoNCwgaW5kZXgpKTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgPSBodG1sLnN1YnN0cmluZyhpbmRleCArIDMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYXJzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gZW5kIHRhZ1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGh0bWwuaW5kZXhPZignPC8nKSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBtYXRjaCA9IGh0bWwubWF0Y2goZW5kVGFnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcclxuICAgICAgICAgICAgICAgICAgICBodG1sID0gaHRtbC5zdWJzdHJpbmcobWF0Y2hbMF0ubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICBtYXRjaFswXS5yZXBsYWNlKGVuZFRhZywgcGFyc2VFbmRUYWcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYXJzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gc3RhcnQgdGFnXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaHRtbC5pbmRleE9mKCc8JykgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgbWF0Y2ggPSBodG1sLm1hdGNoKHN0YXJ0VGFnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcclxuICAgICAgICAgICAgICAgICAgICBodG1sID0gaHRtbC5zdWJzdHJpbmcobWF0Y2hbMF0ubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICBtYXRjaFswXS5yZXBsYWNlKHN0YXJ0VGFnLCBwYXJzZVN0YXJ0VGFnKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGFycyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY2hhcnMpIHtcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gaHRtbC5pbmRleE9mKCc8Jyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dCArPSAnPCc7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCA9IGh0bWwuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaHRtbC5pbmRleE9mKCc8Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0ZXh0ICs9IGluZGV4IDwgMCA/IGh0bWwgOiBodG1sLnN1YnN0cmluZygwLCBpbmRleCk7XHJcbiAgICAgICAgICAgICAgICBodG1sID0gaW5kZXggPCAwID8gJycgOiBodG1sLnN1YnN0cmluZyhpbmRleCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGhhbmRsZXIuY2hhcnMpIHsgaGFuZGxlci5jaGFycyh0ZXh0KTsgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBodG1sID0gaHRtbC5yZXBsYWNlKG5ldyBSZWdFeHAoJyhbXFxcXHNcXFxcU10qPyk8XFwvJyArIHN0YWNrLmxhc3QoKSArICdbXj5dKj4nKSwgZnVuY3Rpb24gKGFsbCwgdGV4dCkge1xyXG4gICAgICAgICAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSgvPCEtLShbXFxzXFxTXSo/KS0tPnw8IVxcW0NEQVRBXFxbKFtcXHNcXFNdKj8pXV0+L2csICckMSQyJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaGFuZGxlci5jaGFycykgeyBoYW5kbGVyLmNoYXJzKHRleHQpOyB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHBhcnNlRW5kVGFnKCcnLCBzdGFjay5sYXN0KCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGh0bWwgPT0gbGFzdCkgeyB0aHJvdyAnUGFyc2UgRXJyb3I6ICcgKyBodG1sOyB9XHJcbiAgICAgICAgbGFzdCA9IGh0bWw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2xlYW4gdXAgYW55IHJlbWFpbmluZyB0YWdzXHJcbiAgICBwYXJzZUVuZFRhZygpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHBhcnNlU3RhcnRUYWcodGFnLCB0YWdOYW1lLCByZXN0LCB1bmFyeSkge1xyXG4gICAgICAgIHRhZ05hbWUgPSB0YWdOYW1lLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgICAgIGlmIChibG9ja1t0YWdOYW1lXSkge1xyXG4gICAgICAgICAgICB3aGlsZSAoc3RhY2subGFzdCgpICYmIGlubGluZVtzdGFjay5sYXN0KCldKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJzZUVuZFRhZygnJywgc3RhY2subGFzdCgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNsb3NlU2VsZlt0YWdOYW1lXSAmJiBzdGFjay5sYXN0KCkgPT0gdGFnTmFtZSkge1xyXG4gICAgICAgICAgICBwYXJzZUVuZFRhZygnJywgdGFnTmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1bmFyeSA9IGVtcHR5W3RhZ05hbWVdIHx8ICEhdW5hcnk7XHJcblxyXG4gICAgICAgIGlmICghdW5hcnkpIHsgc3RhY2sucHVzaCh0YWdOYW1lKTsgfVxyXG5cclxuICAgICAgICBpZiAoaGFuZGxlci5zdGFydCkge1xyXG4gICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIHJlc3QucmVwbGFjZShhdHRyLCBmdW5jdGlvbiAobWF0Y2gsIG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGFyZ3VtZW50c1syXSA/IGFyZ3VtZW50c1syXVxyXG4gICAgICAgICAgICAgICAgICAgIDogYXJndW1lbnRzWzNdID8gYXJndW1lbnRzWzNdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogYXJndW1lbnRzWzRdID8gYXJndW1lbnRzWzRdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGZpbGxBdHRyc1tuYW1lXSA/IG5hbWUgOiAnJztcclxuXHJcbiAgICAgICAgICAgICAgICBhdHRycy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICBlc2NhcGVkOiB2YWx1ZS5yZXBsYWNlKC8oXnxbXlxcXFxdKVwiL2csICckMVxcXFxcXFwiJykgLy8gXCJcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChoYW5kbGVyLnN0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVyLnN0YXJ0KHRhZ05hbWUsIGF0dHJzLCB1bmFyeSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHBhcnNlRW5kVGFnKHRhZywgdGFnTmFtZSkge1xyXG4gICAgICAgIC8vIElmIG5vIHRhZyBuYW1lIGlzIHByb3ZpZGVkLCBjbGVhbiBzaG9wXHJcbiAgICAgICAgaWYgKCF0YWdOYW1lKSB7IHZhciBwb3MgPSAwOyB9XHJcblxyXG4gICAgICAgIC8vIEZpbmQgdGhlIGNsb3Nlc3Qgb3BlbmVkIHRhZyBvZiB0aGUgc2FtZSB0eXBlXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRhZ05hbWUgPSB0YWdOYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHBvcyA9IHN0YWNrLmxlbmd0aCAtIDE7IHBvcyA+PSAwOyBwb3MtLSkge1xuICAgICAgICAgICAgICAgIGlmIChzdGFja1twb3NdID09IHRhZ05hbWUpIHsgYnJlYWs7IH1cbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHBvcyA+PSAwKSB7XHJcbiAgICAgICAgICAgIC8vIENsb3NlIGFsbCB0aGUgb3BlbiBlbGVtZW50cywgdXAgdGhlIHN0YWNrXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBzdGFjay5sZW5ndGggLSAxOyBpID49IHBvczsgaS0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKGhhbmRsZXIuZW5kKSB7IGhhbmRsZXIuZW5kKHN0YWNrW2ldKTsgfVxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBvcGVuIGVsZW1lbnRzIGZyb20gdGhlIHN0YWNrXHJcbiAgICAgICAgICAgIHN0YWNrLmxlbmd0aCA9IHBvcztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBtYWtlTWFwKHN0cikge1xyXG4gICAgdmFyIG9iaiA9IHt9LCBpdGVtcyA9IHN0ci5zcGxpdCgnLCcpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykgeyBvYmpbaXRlbXNbaV1dID0gdHJ1ZTsgfVxyXG4gICAgcmV0dXJuIG9iajtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIVE1MUGFyc2VyO1xyXG4iXX0=