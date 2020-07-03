'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 *
 * showdown: https://github.com/showdownjs/showdown
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

function getDefaultOpts(simple) {
    'use strict';

    var defaultOptions = {
        omitExtraWLInCodeBlocks: {
            defaultValue: false,
            describe: 'Omit the default extra whiteline added to code blocks',
            type: 'boolean'
        },
        noHeaderId: {
            defaultValue: false,
            describe: 'Turn on/off generated header id',
            type: 'boolean'
        },
        prefixHeaderId: {
            defaultValue: false,
            describe: 'Specify a prefix to generated header ids',
            type: 'string'
        },
        headerLevelStart: {
            defaultValue: false,
            describe: 'The header blocks level start',
            type: 'integer'
        },
        parseImgDimensions: {
            defaultValue: false,
            describe: 'Turn on/off image dimension parsing',
            type: 'boolean'
        },
        simplifiedAutoLink: {
            defaultValue: false,
            describe: 'Turn on/off GFM autolink style',
            type: 'boolean'
        },
        literalMidWordUnderscores: {
            defaultValue: false,
            describe: 'Parse midword underscores as literal underscores',
            type: 'boolean'
        },
        strikethrough: {
            defaultValue: false,
            describe: 'Turn on/off strikethrough support',
            type: 'boolean'
        },
        tables: {
            defaultValue: false,
            describe: 'Turn on/off tables support',
            type: 'boolean'
        },
        tablesHeaderId: {
            defaultValue: false,
            describe: 'Add an id to table headers',
            type: 'boolean'
        },
        ghCodeBlocks: {
            defaultValue: true,
            describe: 'Turn on/off GFM fenced code blocks support',
            type: 'boolean'
        },
        tasklists: {
            defaultValue: false,
            describe: 'Turn on/off GFM tasklist support',
            type: 'boolean'
        },
        smoothLivePreview: {
            defaultValue: false,
            describe: 'Prevents weird effects in live previews due to incomplete input',
            type: 'boolean'
        },
        smartIndentationFix: {
            defaultValue: false,
            description: 'Tries to smartly fix identation in es6 strings',
            type: 'boolean'
        }
    };
    if (simple === false) {
        return JSON.parse(JSON.stringify(defaultOptions));
    }
    var ret = {};
    for (var opt in defaultOptions) {
        if (defaultOptions.hasOwnProperty(opt)) {
            ret[opt] = defaultOptions[opt].defaultValue;
        }
    }
    return ret;
}

/**
 * Created by Tivie on 06-01-2015.
 */

// Private properties
var showdown = {},
    parsers = {},
    extensions = {},
    globalOptions = getDefaultOpts(true),
    flavor = {
    github: {
        omitExtraWLInCodeBlocks: true,
        prefixHeaderId: 'user-content-',
        simplifiedAutoLink: true,
        literalMidWordUnderscores: true,
        strikethrough: true,
        tables: true,
        tablesHeaderId: true,
        ghCodeBlocks: true,
        tasklists: true
    },
    vanilla: getDefaultOpts(true)
};

/**
 * helper namespace
 * @type {{}}
 */
showdown.helper = {};

/**
 * TODO LEGACY SUPPORT CODE
 * @type {{}}
 */
showdown.extensions = {};

/**
 * Set a global option
 * @static
 * @param {string} key
 * @param {*} value
 * @returns {showdown}
 */
showdown.setOption = function (key, value) {
    'use strict';

    globalOptions[key] = value;
    return this;
};

/**
 * Get a global option
 * @static
 * @param {string} key
 * @returns {*}
 */
showdown.getOption = function (key) {
    'use strict';

    return globalOptions[key];
};

/**
 * Get the global options
 * @static
 * @returns {{}}
 */
showdown.getOptions = function () {
    'use strict';

    return globalOptions;
};

/**
 * Reset global options to the default values
 * @static
 */
showdown.resetOptions = function () {
    'use strict';

    globalOptions = getDefaultOpts(true);
};

/**
 * Set the flavor showdown should use as default
 * @param {string} name
 */
showdown.setFlavor = function (name) {
    'use strict';

    if (flavor.hasOwnProperty(name)) {
        var preset = flavor[name];
        for (var option in preset) {
            if (preset.hasOwnProperty(option)) {
                globalOptions[option] = preset[option];
            }
        }
    }
};

/**
 * Get the default options
 * @static
 * @param {boolean} [simple=true]
 * @returns {{}}
 */
showdown.getDefaultOptions = function (simple) {
    'use strict';

    return getDefaultOpts(simple);
};

/**
 * Get or set a subParser
 *
 * subParser(name)       - Get a registered subParser
 * subParser(name, func) - Register a subParser
 * @static
 * @param {string} name
 * @param {function} [func]
 * @returns {*}
 */
showdown.subParser = function (name, func) {
    'use strict';

    if (showdown.helper.isString(name)) {
        if (typeof func !== 'undefined') {
            parsers[name] = func;
        } else {
            if (parsers.hasOwnProperty(name)) {
                return parsers[name];
            } else {
                throw Error('SubParser named ' + name + ' not registered!');
            }
        }
    }
};

/**
 * Gets or registers an extension
 * @static
 * @param {string} name
 * @param {object|function=} ext
 * @returns {*}
 */
showdown.extension = function (name, ext) {
    'use strict';

    if (!showdown.helper.isString(name)) {
        throw Error('Extension \'name\' must be a string');
    }

    name = showdown.helper.stdExtName(name);

    // Getter
    if (showdown.helper.isUndefined(ext)) {
        if (!extensions.hasOwnProperty(name)) {
            throw Error('Extension named ' + name + ' is not registered!');
        }
        return extensions[name];

        // Setter
    } else {
        // Expand extension if it's wrapped in a function
        if (typeof ext === 'function') {
            ext = ext();
        }

        // Ensure extension is an array
        if (!showdown.helper.isArray(ext)) {
            ext = [ext];
        }

        var validExtension = validate(ext, name);

        if (validExtension.valid) {
            extensions[name] = ext;
        } else {
            throw Error(validExtension.error);
        }
    }
};

/**
 * Gets all extensions registered
 * @returns {{}}
 */
showdown.getAllExtensions = function () {
    'use strict';

    return extensions;
};

/**
 * Remove an extension
 * @param {string} name
 */
showdown.removeExtension = function (name) {
    'use strict';

    delete extensions[name];
};

/**
 * Removes all extensions
 */
showdown.resetExtensions = function () {
    'use strict';

    extensions = {};
};

/**
 * Validate extension
 * @param {array} extension
 * @param {string} name
 * @returns {{valid: boolean, error: string}}
 */
function validate(extension, name) {
    'use strict';

    var errMsg = name ? 'Error in ' + name + ' extension->' : 'Error in unnamed extension',
        ret = {
        valid: true,
        error: ''
    };

    if (!showdown.helper.isArray(extension)) {
        extension = [extension];
    }

    for (var i = 0; i < extension.length; ++i) {
        var baseMsg = errMsg + ' sub-extension ' + i + ': ',
            ext = extension[i];
        if ((typeof ext === 'undefined' ? 'undefined' : _typeof(ext)) !== 'object') {
            ret.valid = false;
            ret.error = baseMsg + 'must be an object, but ' + (typeof ext === 'undefined' ? 'undefined' : _typeof(ext)) + ' given';
            return ret;
        }

        if (!showdown.helper.isString(ext.type)) {
            ret.valid = false;
            ret.error = baseMsg + 'property "type" must be a string, but ' + _typeof(ext.type) + ' given';
            return ret;
        }

        var type = ext.type = ext.type.toLowerCase();

        // normalize extension type
        if (type === 'language') {
            type = ext.type = 'lang';
        }

        if (type === 'html') {
            type = ext.type = 'output';
        }

        if (type !== 'lang' && type !== 'output' && type !== 'listener') {
            ret.valid = false;
            ret.error = baseMsg + 'type ' + type + ' is not recognized. Valid values: "lang/language", "output/html" or "listener"';
            return ret;
        }

        if (type === 'listener') {
            if (showdown.helper.isUndefined(ext.listeners)) {
                ret.valid = false;
                ret.error = baseMsg + '. Extensions of type "listener" must have a property called "listeners"';
                return ret;
            }
        } else {
            if (showdown.helper.isUndefined(ext.filter) && showdown.helper.isUndefined(ext.regex)) {
                ret.valid = false;
                ret.error = baseMsg + type + ' extensions must define either a "regex" property or a "filter" method';
                return ret;
            }
        }

        if (ext.listeners) {
            if (_typeof(ext.listeners) !== 'object') {
                ret.valid = false;
                ret.error = baseMsg + '"listeners" property must be an object but ' + _typeof(ext.listeners) + ' given';
                return ret;
            }
            for (var ln in ext.listeners) {
                if (ext.listeners.hasOwnProperty(ln)) {
                    if (typeof ext.listeners[ln] !== 'function') {
                        ret.valid = false;
                        ret.error = baseMsg + '"listeners" property must be an hash of [event name]: [callback]. listeners.' + ln + ' must be a function but ' + _typeof(ext.listeners[ln]) + ' given';
                        return ret;
                    }
                }
            }
        }

        if (ext.filter) {
            if (typeof ext.filter !== 'function') {
                ret.valid = false;
                ret.error = baseMsg + '"filter" must be a function, but ' + _typeof(ext.filter) + ' given';
                return ret;
            }
        } else if (ext.regex) {
            if (showdown.helper.isString(ext.regex)) {
                ext.regex = new RegExp(ext.regex, 'g');
            }
            if (!(ext.regex instanceof RegExp)) {
                ret.valid = false;
                ret.error = baseMsg + '"regex" property must either be a string or a RegExp object, but ' + _typeof(ext.regex) + ' given';
                return ret;
            }
            if (showdown.helper.isUndefined(ext.replace)) {
                ret.valid = false;
                ret.error = baseMsg + '"regex" extensions must implement a replace string or function';
                return ret;
            }
        }
    }
    return ret;
}

/**
 * Validate extension
 * @param {object} ext
 * @returns {boolean}
 */
showdown.validateExtension = function (ext) {
    'use strict';

    var validateExtension = validate(ext, null);
    if (!validateExtension.valid) {
        console.warn(validateExtension.error);
        return false;
    }
    return true;
};

/**
 * showdownjs helper functions
 */

if (!showdown.hasOwnProperty('helper')) {
    showdown.helper = {};
}

/**
 * Check if var is string
 * @static
 * @param {string} a
 * @returns {boolean}
 */
showdown.helper.isString = function isString(a) {
    'use strict';

    return typeof a === 'string' || a instanceof String;
};

/**
 * Check if var is a function
 * @static
 * @param {string} a
 * @returns {boolean}
 */
showdown.helper.isFunction = function isFunction(a) {
    'use strict';

    var getType = {};
    return a && getType.toString.call(a) === '[object Function]';
};

/**
 * ForEach helper function
 * @static
 * @param {*} obj
 * @param {function} callback
 */
showdown.helper.forEach = function forEach(obj, callback) {
    'use strict';

    if (typeof obj.forEach === 'function') {
        obj.forEach(callback);
    } else {
        for (var i = 0; i < obj.length; i++) {
            callback(obj[i], i, obj);
        }
    }
};

/**
 * isArray helper function
 * @static
 * @param {*} a
 * @returns {boolean}
 */
showdown.helper.isArray = function isArray(a) {
    'use strict';

    return a.constructor === Array;
};

/**
 * Check if value is undefined
 * @static
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 */
showdown.helper.isUndefined = function isUndefined(value) {
    'use strict';

    return typeof value === 'undefined';
};

/**
 * Standardidize extension name
 * @static
 * @param {string} s extension name
 * @returns {string}
 */
showdown.helper.stdExtName = function (s) {
    'use strict';

    return s.replace(/[_-]||\s/g, '').toLowerCase();
};

function escapeCharactersCallback(wholeMatch, m1) {
    'use strict';

    var charCodeToEscape = m1.charCodeAt(0);
    return '~E' + charCodeToEscape + 'E';
}

/**
 * Callback used to escape characters when passing through String.replace
 * @static
 * @param {string} wholeMatch
 * @param {string} m1
 * @returns {string}
 */
showdown.helper.escapeCharactersCallback = escapeCharactersCallback;

/**
 * Escape characters in a string
 * @static
 * @param {string} text
 * @param {string} charsToEscape
 * @param {boolean} afterBackslash
 * @returns {XML|string|void|*}
 */
showdown.helper.escapeCharacters = function escapeCharacters(text, charsToEscape, afterBackslash) {
    'use strict';
    // First we have to escape the escape characters so that
    // we can build a character class out of them

    var regexString = '([' + charsToEscape.replace(/([\[\]\\])/g, '\\$1') + '])';

    if (afterBackslash) {
        regexString = '\\\\' + regexString;
    }

    var regex = new RegExp(regexString, 'g');
    text = text.replace(regex, escapeCharactersCallback);

    return text;
};

var rgxFindMatchPos = function rgxFindMatchPos(str, left, right, flags) {
    'use strict';

    var f = flags || '',
        g = f.indexOf('g') > -1,
        x = new RegExp(left + '|' + right, 'g' + f.replace(/g/g, '')),
        l = new RegExp(left, f.replace(/g/g, '')),
        pos = [],
        t,
        s,
        m,
        start,
        end;

    do {
        t = 0;
        while (m = x.exec(str)) {
            if (l.test(m[0])) {
                if (!t++) {
                    s = x.lastIndex;
                    start = s - m[0].length;
                }
            } else if (t) {
                if (! --t) {
                    end = m.index + m[0].length;
                    var obj = {
                        left: { start: start, end: s },
                        match: { start: s, end: m.index },
                        right: { start: m.index, end: end },
                        wholeMatch: { start: start, end: end }
                    };
                    pos.push(obj);
                    if (!g) {
                        return pos;
                    }
                }
            }
        }
    } while (t && (x.lastIndex = s));

    return pos;
};

/**
 * matchRecursiveRegExp
 *
 * (c) 2007 Steven Levithan <stevenlevithan.com>
 * MIT License
 *
 * Accepts a string to search, a left and right format delimiter
 * as regex patterns, and optional regex flags. Returns an array
 * of matches, allowing nested instances of left/right delimiters.
 * Use the "g" flag to return all matches, otherwise only the
 * first is returned. Be careful to ensure that the left and
 * right format delimiters produce mutually exclusive matches.
 * Backreferences are not supported within the right delimiter
 * due to how it is internally combined with the left delimiter.
 * When matching strings whose format delimiters are unbalanced
 * to the left or right, the output is intentionally as a
 * conventional regex library with recursion support would
 * produce, e.g. "<<x>" and "<x>>" both produce ["x"] when using
 * "<" and ">" as the delimiters (both strings contain a single,
 * balanced instance of "<x>").
 *
 * examples:
 * matchRecursiveRegExp("test", "\\(", "\\)")
 * returns: []
 * matchRecursiveRegExp("<t<<e>><s>>t<>", "<", ">", "g")
 * returns: ["t<<e>><s>", ""]
 * matchRecursiveRegExp("<div id=\"x\">test</div>", "<div\\b[^>]*>", "</div>", "gi")
 * returns: ["test"]
 */
showdown.helper.matchRecursiveRegExp = function (str, left, right, flags) {
    'use strict';

    var matchPos = rgxFindMatchPos(str, left, right, flags),
        results = [];

    for (var i = 0; i < matchPos.length; ++i) {
        results.push([str.slice(matchPos[i].wholeMatch.start, matchPos[i].wholeMatch.end), str.slice(matchPos[i].match.start, matchPos[i].match.end), str.slice(matchPos[i].left.start, matchPos[i].left.end), str.slice(matchPos[i].right.start, matchPos[i].right.end)]);
    }
    return results;
};

/**
 *
 * @param {string} str
 * @param {string|function} replacement
 * @param {string} left
 * @param {string} right
 * @param {string} flags
 * @returns {string}
 */
showdown.helper.replaceRecursiveRegExp = function (str, replacement, left, right, flags) {
    'use strict';

    if (!showdown.helper.isFunction(replacement)) {
        var repStr = replacement;
        replacement = function replacement() {
            return repStr;
        };
    }

    var matchPos = rgxFindMatchPos(str, left, right, flags),
        finalStr = str,
        lng = matchPos.length;

    if (lng > 0) {
        var bits = [];
        if (matchPos[0].wholeMatch.start !== 0) {
            bits.push(str.slice(0, matchPos[0].wholeMatch.start));
        }
        for (var i = 0; i < lng; ++i) {
            bits.push(replacement(str.slice(matchPos[i].wholeMatch.start, matchPos[i].wholeMatch.end), str.slice(matchPos[i].match.start, matchPos[i].match.end), str.slice(matchPos[i].left.start, matchPos[i].left.end), str.slice(matchPos[i].right.start, matchPos[i].right.end)));
            if (i < lng - 1) {
                bits.push(str.slice(matchPos[i].wholeMatch.end, matchPos[i + 1].wholeMatch.start));
            }
        }
        if (matchPos[lng - 1].wholeMatch.end < str.length) {
            bits.push(str.slice(matchPos[lng - 1].wholeMatch.end));
        }
        finalStr = bits.join('');
    }
    return finalStr;
};

/**
 * POLYFILLS
 */
if (showdown.helper.isUndefined(console)) {
    console = {
        warn: function warn(msg) {
            'use strict';

            alert(msg);
        },
        log: function log(msg) {
            'use strict';

            alert(msg);
        },
        error: function error(msg) {
            'use strict';

            throw msg;
        }
    };
}

/**
 * Created by Estevao on 31-05-2015.
 */

/**
 * Showdown Converter class
 * @class
 * @param {object} [converterOptions]
 * @returns {Converter}
 */
showdown.Converter = function (converterOptions) {
    'use strict';

    var
    /**
    * Options used by this converter
    * @private
    * @type {{}}
    */
    options = {},


    /**
    * Language extensions used by this converter
    * @private
    * @type {Array}
    */
    langExtensions = [],


    /**
    * Output modifiers extensions used by this converter
    * @private
    * @type {Array}
    */
    outputModifiers = [],


    /**
    * Event listeners
    * @private
    * @type {{}}
    */
    listeners = {};

    _constructor();

    /**
    * Converter constructor
    * @private
    */
    function _constructor() {
        converterOptions = converterOptions || {};

        for (var gOpt in globalOptions) {
            if (globalOptions.hasOwnProperty(gOpt)) {
                options[gOpt] = globalOptions[gOpt];
            }
        }

        // Merge options
        if ((typeof converterOptions === 'undefined' ? 'undefined' : _typeof(converterOptions)) === 'object') {
            for (var opt in converterOptions) {
                if (converterOptions.hasOwnProperty(opt)) {
                    options[opt] = converterOptions[opt];
                }
            }
        } else {
            throw Error('Converter expects the passed parameter to be an object, but ' + (typeof converterOptions === 'undefined' ? 'undefined' : _typeof(converterOptions)) + ' was passed instead.');
        }

        if (options.extensions) {
            showdown.helper.forEach(options.extensions, _parseExtension);
        }
    }

    /**
    * Parse extension
    * @param {*} ext
    * @param {string} [name='']
    * @private
    */
    function _parseExtension(ext, name) {

        name = name || null;
        // If it's a string, the extension was previously loaded
        if (showdown.helper.isString(ext)) {
            ext = showdown.helper.stdExtName(ext);
            name = ext;

            // LEGACY_SUPPORT CODE
            if (showdown.extensions[ext]) {
                console.warn('DEPRECATION WARNING: ' + ext + ' is an old extension that uses a deprecated loading method.' + 'Please inform the developer that the extension should be updated!');
                legacyExtensionLoading(showdown.extensions[ext], ext);
                return;
                // END LEGACY SUPPORT CODE
            } else if (!showdown.helper.isUndefined(extensions[ext])) {
                ext = extensions[ext];
            } else {
                throw Error('Extension "' + ext + '" could not be loaded. It was either not found or is not a valid extension.');
            }
        }

        if (typeof ext === 'function') {
            ext = ext();
        }

        if (!showdown.helper.isArray(ext)) {
            ext = [ext];
        }

        var validExt = validate(ext, name);
        if (!validExt.valid) {
            throw Error(validExt.error);
        }

        for (var i = 0; i < ext.length; ++i) {
            switch (ext[i].type) {

                case 'lang':
                    langExtensions.push(ext[i]);
                    break;

                case 'output':
                    outputModifiers.push(ext[i]);
                    break;
            }
            if (ext[i].hasOwnProperty(listeners)) {
                for (var ln in ext[i].listeners) {
                    if (ext[i].listeners.hasOwnProperty(ln)) {
                        listen(ln, ext[i].listeners[ln]);
                    }
                }
            }
        }
    }

    /**
    * LEGACY_SUPPORT
    * @param {*} ext
    * @param {string} name
    */
    function legacyExtensionLoading(ext, name) {
        if (typeof ext === 'function') {
            ext = ext(new showdown.Converter());
        }
        if (!showdown.helper.isArray(ext)) {
            ext = [ext];
        }
        var valid = validate(ext, name);

        if (!valid.valid) {
            throw Error(valid.error);
        }

        for (var i = 0; i < ext.length; ++i) {
            switch (ext[i].type) {
                case 'lang':
                    langExtensions.push(ext[i]);
                    break;
                case 'output':
                    outputModifiers.push(ext[i]);
                    break;
                default:
                    // should never reach here
                    throw Error('Extension loader error: Type unrecognized!!!');
            }
        }
    }

    /**
    * Listen to an event
    * @param {string} name
    * @param {function} callback
    */
    function listen(name, callback) {
        if (!showdown.helper.isString(name)) {
            throw Error('Invalid argument in converter.listen() method: name must be a string, but ' + (typeof name === 'undefined' ? 'undefined' : _typeof(name)) + ' given');
        }

        if (typeof callback !== 'function') {
            throw Error('Invalid argument in converter.listen() method: callback must be a function, but ' + (typeof callback === 'undefined' ? 'undefined' : _typeof(callback)) + ' given');
        }

        if (!listeners.hasOwnProperty(name)) {
            listeners[name] = [];
        }
        listeners[name].push(callback);
    }

    function rTrimInputText(text) {
        var rsp = text.match(/^\s*/)[0].length,
            rgx = new RegExp('^\\s{0,' + rsp + '}', 'gm');
        return text.replace(rgx, '');
    }

    /**
    * Dispatch an event
    * @private
    * @param {string} evtName Event name
    * @param {string} text Text
    * @param {{}} options Converter Options
    * @param {{}} globals
    * @returns {string}
    */
    this._dispatch = function dispatch(evtName, text, options, globals) {
        if (listeners.hasOwnProperty(evtName)) {
            for (var ei = 0; ei < listeners[evtName].length; ++ei) {
                var nText = listeners[evtName][ei](evtName, text, this, options, globals);
                if (nText && typeof nText !== 'undefined') {
                    text = nText;
                }
            }
        }
        return text;
    };

    /**
    * Listen to an event
    * @param {string} name
    * @param {function} callback
    * @returns {showdown.Converter}
    */
    this.listen = function (name, callback) {
        listen(name, callback);
        return this;
    };

    /**
    * Converts a markdown string into HTML
    * @param {string} text
    * @returns {*}
    */
    this.makeHtml = function (text) {
        // check if text is not falsy
        if (!text) {
            return text;
        }

        var globals = {
            gHtmlBlocks: [],
            gHtmlMdBlocks: [],
            gHtmlSpans: [],
            gUrls: {},
            gTitles: {},
            gDimensions: {},
            gListLevel: 0,
            hashLinkCounts: {},
            langExtensions: langExtensions,
            outputModifiers: outputModifiers,
            converter: this,
            ghCodeBlocks: []
        };

        // attacklab: Replace ~ with ~T
        // This lets us use tilde as an escape char to avoid md5 hashes
        // The choice of character is arbitrary; anything that isn't
        // magic in Markdown will work.
        text = text.replace(/~/g, '~T');

        // attacklab: Replace $ with ~D
        // RegExp interprets $ as a special character
        // when it's in a replacement string
        text = text.replace(/\$/g, '~D');

        // Standardize line endings
        text = text.replace(/\r\n/g, '\n'); // DOS to Unix
        text = text.replace(/\r/g, '\n'); // Mac to Unix

        if (options.smartIndentationFix) {
            text = rTrimInputText(text);
        }

        // Make sure text begins and ends with a couple of newlines:
        // text = '\n\n' + text + '\n\n';
        text = text;
        // detab
        text = showdown.subParser('detab')(text, options, globals);

        // stripBlankLines
        text = showdown.subParser('stripBlankLines')(text, options, globals);

        // run languageExtensions
        showdown.helper.forEach(langExtensions, function (ext) {
            text = showdown.subParser('runExtension')(ext, text, options, globals);
        });

        // run the sub parsers
        text = showdown.subParser('hashPreCodeTags')(text, options, globals);
        text = showdown.subParser('githubCodeBlocks')(text, options, globals);
        text = showdown.subParser('hashHTMLBlocks')(text, options, globals);
        text = showdown.subParser('hashHTMLSpans')(text, options, globals);
        text = showdown.subParser('stripLinkDefinitions')(text, options, globals);
        text = showdown.subParser('blockGamut')(text, options, globals);
        text = showdown.subParser('unhashHTMLSpans')(text, options, globals);
        text = showdown.subParser('unescapeSpecialChars')(text, options, globals);

        // attacklab: Restore dollar signs
        text = text.replace(/~D/g, '$$');

        // attacklab: Restore tildes
        text = text.replace(/~T/g, '~');

        // Run output modifiers
        showdown.helper.forEach(outputModifiers, function (ext) {
            text = showdown.subParser('runExtension')(ext, text, options, globals);
        });
        return text;
    };

    /**
    * Set an option of this Converter instance
    * @param {string} key
    * @param {*} value
    */
    this.setOption = function (key, value) {
        options[key] = value;
    };

    /**
    * Get the option of this Converter instance
    * @param {string} key
    * @returns {*}
    */
    this.getOption = function (key) {
        return options[key];
    };

    /**
    * Get the options of this Converter instance
    * @returns {{}}
    */
    this.getOptions = function () {
        return options;
    };

    /**
    * Add extension to THIS converter
    * @param {{}} extension
    * @param {string} [name=null]
    */
    this.addExtension = function (extension, name) {
        name = name || null;
        _parseExtension(extension, name);
    };

    /**
    * Use a global registered extension with THIS converter
    * @param {string} extensionName Name of the previously registered extension
    */
    this.useExtension = function (extensionName) {
        _parseExtension(extensionName);
    };

    /**
    * Set the flavor THIS converter should use
    * @param {string} name
    */
    this.setFlavor = function (name) {
        if (flavor.hasOwnProperty(name)) {
            var preset = flavor[name];
            for (var option in preset) {
                if (preset.hasOwnProperty(option)) {
                    options[option] = preset[option];
                }
            }
        }
    };

    /**
    * Remove an extension from THIS converter.
    * Note: This is a costly operation. It's better to initialize a new converter
    * and specify the extensions you wish to use
    * @param {Array} extension
    */
    this.removeExtension = function (extension) {
        if (!showdown.helper.isArray(extension)) {
            extension = [extension];
        }
        for (var a = 0; a < extension.length; ++a) {
            var ext = extension[a];
            for (var i = 0; i < langExtensions.length; ++i) {
                if (langExtensions[i] === ext) {
                    langExtensions[i].splice(i, 1);
                }
            }
            for (var ii = 0; ii < outputModifiers.length; ++i) {
                if (outputModifiers[ii] === ext) {
                    outputModifiers[ii].splice(i, 1);
                }
            }
        }
    };

    /**
    * Get all extension of THIS converter
    * @returns {{language: Array, output: Array}}
    */
    this.getAllExtensions = function () {
        return {
            language: langExtensions,
            output: outputModifiers
        };
    };
};

/**
 * Turn Markdown link shortcuts into XHTML <a> tags.
 */
showdown.subParser('anchors', function (text, options, globals) {
    'use strict';

    text = globals.converter._dispatch('anchors.before', text, options, globals);

    var writeAnchorTag = function writeAnchorTag(wholeMatch, m1, m2, m3, m4, m5, m6, m7) {
        if (showdown.helper.isUndefined(m7)) {
            m7 = '';
        }
        wholeMatch = m1;
        var linkText = m2,
            linkId = m3.toLowerCase(),
            url = m4,
            title = m7;

        if (!url) {
            if (!linkId) {
                // lower-case and turn embedded newlines into spaces
                linkId = linkText.toLowerCase().replace(/ ?\n/g, ' ');
            }
            url = '#' + linkId;

            if (!showdown.helper.isUndefined(globals.gUrls[linkId])) {
                url = globals.gUrls[linkId];
                if (!showdown.helper.isUndefined(globals.gTitles[linkId])) {
                    title = globals.gTitles[linkId];
                }
            } else {
                if (wholeMatch.search(/\(\s*\)$/m) > -1) {
                    // Special case for explicit empty url
                    url = '';
                } else {
                    return wholeMatch;
                }
            }
        }

        url = showdown.helper.escapeCharacters(url, '*_', false);
        var result = '<a href="' + url + '"';

        if (title !== '' && title !== null) {
            title = title.replace(/"/g, '&quot;');
            title = showdown.helper.escapeCharacters(title, '*_', false);
            result += ' title="' + title + '"';
        }

        result += '>' + linkText + '</a>';

        return result;
    };

    // First, handle reference-style links: [link text] [id]
    /*
    text = text.replace(/
    (							// wrap whole match in $1
    \[
    (
    (?:
    \[[^\]]*\]		// allow brackets nested one level
    |
    [^\[]			// or anything else
    )*
    )
    \]
     [ ]?					// one optional space
    (?:\n[ ]*)?				// one optional newline followed by spaces
     \[
    (.*?)					// id = $3
    \]
    )()()()()					// pad remaining backreferences
    /g,_DoAnchors_callback);
    */
    text = text.replace(/(\[((?:\[[^\]]*]|[^\[\]])*)][ ]?(?:\n[ ]*)?\[(.*?)])()()()()/g, writeAnchorTag);

    //
    // Next, inline-style links: [link text](url "optional title")
    //

    /*
    text = text.replace(/
    (						// wrap whole match in $1
    \[
    (
    (?:
    \[[^\]]*\]	// allow brackets nested one level
    |
    [^\[\]]			// or anything else
    )
    )
    \]
    \(						// literal paren
    [ \t]*
    ()						// no id, so leave $3 empty
    <?(.*?)>?				// href = $4
    [ \t]*
    (						// $5
    (['"])				// quote char = $6
    (.*?)				// Title = $7
    \6					// matching quote
    [ \t]*				// ignore any spaces/tabs between closing quote and )
    )?						// title is optional
    \)
    )
    /g,writeAnchorTag);
    */
    text = text.replace(/(\[((?:\[[^\]]*]|[^\[\]])*)]\([ \t]*()<?(.*?(?:\(.*?\).*?)?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g, writeAnchorTag);

    //
    // Last, handle reference-style shortcuts: [link text]
    // These must come last in case you've also got [link test][1]
    // or [link test](/foo)
    //

    /*
    text = text.replace(/
    (                // wrap whole match in $1
    \[
    ([^\[\]]+)       // link text = $2; can't contain '[' or ']'
    \]
    )()()()()()      // pad rest of backreferences
    /g, writeAnchorTag);
    */
    text = text.replace(/(\[([^\[\]]+)])()()()()()/g, writeAnchorTag);

    text = globals.converter._dispatch('anchors.after', text, options, globals);
    return text;
});

showdown.subParser('autoLinks', function (text, options, globals) {
    'use strict';

    text = globals.converter._dispatch('autoLinks.before', text, options, globals);

    var simpleURLRegex = /\b(((https?|ftp|dict):\/\/|www\.)[^'">\s]+\.[^'">\s]+)(?=\s|$)(?!["<>])/gi,
        delimUrlRegex = /<(((https?|ftp|dict):\/\/|www\.)[^'">\s]+)>/gi,
        simpleMailRegex = /(?:^|[ \n\t])([A-Za-z0-9!#$%&'*+-/=?^_`\{|}~\.]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)(?:$|[ \n\t])/gi,
        delimMailRegex = /<(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi;

    text = text.replace(delimUrlRegex, replaceLink);
    text = text.replace(delimMailRegex, replaceMail);
    // simpleURLRegex  = /\b(((https?|ftp|dict):\/\/|www\.)[-.+~:?#@!$&'()*,;=[\]\w]+)\b/gi,
    // Email addresses: <address@domain.foo>

    if (options.simplifiedAutoLink) {
        text = text.replace(simpleURLRegex, replaceLink);
        text = text.replace(simpleMailRegex, replaceMail);
    }

    function replaceLink(wm, link) {
        var lnkTxt = link;
        if (/^www\./i.test(link)) {
            link = link.replace(/^www\./i, 'http://www.');
        }
        return '<a href="' + link + '">' + lnkTxt + '</a>';
    }

    function replaceMail(wholeMatch, m1) {
        var unescapedStr = showdown.subParser('unescapeSpecialChars')(m1);
        return showdown.subParser('encodeEmailAddress')(unescapedStr);
    }

    text = globals.converter._dispatch('autoLinks.after', text, options, globals);

    return text;
});

/**
 * These are all the transformations that form block-level
 * tags like paragraphs, headers, and list items.
 */
showdown.subParser('blockGamut', function (text, options, globals) {
    'use strict';

    text = globals.converter._dispatch('blockGamut.before', text, options, globals);

    // we parse blockquotes first so that we can have headings and hrs
    // inside blockquotes
    text = showdown.subParser('blockQuotes')(text, options, globals);
    text = showdown.subParser('headers')(text, options, globals);

    // Do Horizontal Rules:
    var key = showdown.subParser('hashBlock')('<hr />', options, globals);
    text = text.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm, key);
    text = text.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm, key);
    text = text.replace(/^[ ]{0,2}([ ]?_[ ]?){3,}[ \t]*$/gm, key);

    text = showdown.subParser('lists')(text, options, globals);
    text = showdown.subParser('codeBlocks')(text, options, globals);
    text = showdown.subParser('tables')(text, options, globals);

    // We already ran _HashHTMLBlocks() before, in Markdown(), but that
    // was to escape raw HTML in the original Markdown source. This time,
    // we're escaping the markup we've just created, so that we don't wrap
    // <p> tags around block-level tags.
    text = showdown.subParser('hashHTMLBlocks')(text, options, globals);
    text = showdown.subParser('paragraphs')(text, options, globals);

    text = globals.converter._dispatch('blockGamut.after', text, options, globals);

    return text;
});

showdown.subParser('blockQuotes', function (text, options, globals) {
    'use strict';

    text = globals.converter._dispatch('blockQuotes.before', text, options, globals);
    /*
    text = text.replace(/
    (								// Wrap whole match in $1
    (
    ^[ \t]*>[ \t]?			// '>' at the start of a line
    .+\n					// rest of the first line
    (.+\n)*					// subsequent consecutive lines
    \n*						// blanks
    )+
    )
    /gm, function(){...});
    */

    text = text.replace(/((^[ \t]{0,3}>[ \t]?.+\n(.+\n)*\n*)+)/gm, function (wholeMatch, m1) {
        var bq = m1;

        // attacklab: hack around Konqueror 3.5.4 bug:
        // "----------bug".replace(/^-/g,"") == "bug"
        bq = bq.replace(/^[ \t]*>[ \t]?/gm, '~0'); // trim one level of quoting

        // attacklab: clean up hack
        bq = bq.replace(/~0/g, '');

        bq = bq.replace(/^[ \t]+$/gm, ''); // trim whitespace-only lines
        bq = showdown.subParser('githubCodeBlocks')(bq, options, globals);
        bq = showdown.subParser('blockGamut')(bq, options, globals); // recurse

        bq = bq.replace(/(^|\n)/g, '$1  ');
        // These leading spaces screw with <pre> content, so we need to fix that:
        bq = bq.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function (wholeMatch, m1) {
            var pre = m1;
            // attacklab: hack around Konqueror 3.5.4 bug:
            pre = pre.replace(/^ {2}/mg, '~0');
            pre = pre.replace(/~0/g, '');
            return pre;
        });

        return showdown.subParser('hashBlock')('<blockquote>\n' + bq + '\n</blockquote>', options, globals);
    });

    text = globals.converter._dispatch('blockQuotes.after', text, options, globals);
    return text;
});

/**
 * Process Markdown `<pre><code>` blocks.
 */
showdown.subParser('codeBlocks', function (text, options, globals) {
    'use strict';

    text = globals.converter._dispatch('codeBlocks.before', text, options, globals);
    /*
    text = text.replace(text,
    /(?:\n\n|^)
    (								// $1 = the code block -- one or more lines, starting with a space/tab
    (?:
    (?:[ ]{4}|\t)			// Lines must start with a tab or a tab-width of spaces - attacklab: g_tab_width
    .*\n+
    )+
    )
    (\n*[ ]{0,3}[^ \t\n]|(?=~0))	// attacklab: g_tab_width
    /g,function(){...});
    */

    // attacklab: sentinel workarounds for lack of \A and \Z, safari\khtml bug
    text += '~0';

    var pattern = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g;
    text = text.replace(pattern, function (wholeMatch, m1, m2) {
        var codeblock = m1,
            nextChar = m2,
            end = '\n';

        codeblock = showdown.subParser('outdent')(codeblock);
        codeblock = showdown.subParser('encodeCode')(codeblock);
        codeblock = showdown.subParser('detab')(codeblock);
        codeblock = codeblock.replace(/^\n+/g, ''); // trim leading newlines
        codeblock = codeblock.replace(/\n+$/g, ''); // trim trailing newlines

        if (options.omitExtraWLInCodeBlocks) {
            end = '';
        }

        codeblock = '<pre><code>' + codeblock + end + '</code></pre>';

        return showdown.subParser('hashBlock')(codeblock, options, globals) + nextChar;
    });

    // attacklab: strip sentinel
    text = text.replace(/~0/, '');

    text = globals.converter._dispatch('codeBlocks.after', text, options, globals);
    return text;
});

/**
 *
 *   *  Backtick quotes are used for <code></code> spans.
 *
 *   *  You can use multiple backticks as the delimiters if you want to
 *     include literal backticks in the code span. So, this input:
 *
 *         Just type ``foo `bar` baz`` at the prompt.
 *
 *       Will translate to:
 *
 *         <p>Just type <code>foo `bar` baz</code> at the prompt.</p>
 *
 *    There's no arbitrary limit to the number of backticks you
 *    can use as delimters. If you need three consecutive backticks
 *    in your code, use four for delimiters, etc.
 *
 *  *  You can use spaces to get literal backticks at the edges:
 *
 *         ... type `` `bar` `` ...
 *
 *       Turns to:
 *
 *         ... type <code>`bar`</code> ...
 */
showdown.subParser('codeSpans', function (text, options, globals) {
    'use strict';

    text = globals.converter._dispatch('codeSpans.before', text, options, globals);

    /*
    text = text.replace(/
    (^|[^\\])					// Character before opening ` can't be a backslash
    (`+)						// $2 = Opening run of `
    (							// $3 = The code block
    [^\r]*?
    [^`]					// attacklab: work around lack of lookbehind
    )
    \2							// Matching closer
    (?!`)
    /gm, function(){...});
    */

    if (typeof text === 'undefined') {
        text = '';
    }
    text = text.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm, function (wholeMatch, m1, m2, m3) {
        var c = m3;
        c = c.replace(/^([ \t]*)/g, ''); // leading whitespace
        c = c.replace(/[ \t]*$/g, ''); // trailing whitespace
        c = showdown.subParser('encodeCode')(c);
        return m1 + '<code>' + c + '</code>';
    });

    text = globals.converter._dispatch('codeSpans.after', text, options, globals);
    return text;
});

/**
 * Convert all tabs to spaces
 */
showdown.subParser('detab', function (text) {
    'use strict';

    // expand first n-1 tabs

    text = text.replace(/\t(?=\t)/g, '    '); // g_tab_width

    // replace the nth with two sentinels
    text = text.replace(/\t/g, '~A~B');

    // use the sentinel to anchor our regex so it doesn't explode
    text = text.replace(/~B(.+?)~A/g, function (wholeMatch, m1) {
        var leadingText = m1,
            numSpaces = 4 - leadingText.length % 4; // g_tab_width

        // there *must* be a better way to do this:
        for (var i = 0; i < numSpaces; i++) {
            leadingText += ' ';
        }

        return leadingText;
    });

    // clean up sentinels
    text = text.replace(/~A/g, '    '); // g_tab_width
    text = text.replace(/~B/g, '');

    return text;
});

/**
 * Smart processing for ampersands and angle brackets that need to be encoded.
 */
showdown.subParser('encodeAmpsAndAngles', function (text) {
    'use strict';
    // Ampersand-encoding based entirely on Nat Irons's Amputator MT plugin:
    // http://bumppo.net/projects/amputator/

    text = text.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, '&amp;');

    // Encode naked <'s
    text = text.replace(/<(?![a-z\/?\$!])/gi, '&lt;');

    return text;
});

/**
 * Returns the string, with after processing the following backslash escape sequences.
 *
 * attacklab: The polite way to do this is with the new escapeCharacters() function:
 *
 *    text = escapeCharacters(text,"\\",true);
 *    text = escapeCharacters(text,"`*_{}[]()>#+-.!",true);
 *
 * ...but we're sidestepping its use of the (slow) RegExp constructor
 * as an optimization for Firefox.  This function gets called a LOT.
 */
showdown.subParser('encodeBackslashEscapes', function (text) {
    'use strict';

    text = text.replace(/\\(\\)/g, showdown.helper.escapeCharactersCallback);
    text = text.replace(/\\([`*_{}\[\]()>#+-.!])/g, showdown.helper.escapeCharactersCallback);
    return text;
});

/**
 * Encode/escape certain characters inside Markdown code runs.
 * The point is that in code, these characters are literals,
 * and lose their special Markdown meanings.
 */
showdown.subParser('encodeCode', function (text) {
    'use strict';

    // Encode all ampersands; HTML entities are not
    // entities within a Markdown code span.

    text = text.replace(/&/g, '&amp;');

    // Do the angle bracket song and dance:
    text = text.replace(/</g, '&lt;');
    text = text.replace(/>/g, '&gt;');

    // Now, escape characters that are magic in Markdown:
    text = showdown.helper.escapeCharacters(text, '*_{}[]\\', false);

    // jj the line above breaks this:
    // ---
    //* Item
    //   1. Subitem
    //            special char: *
    // ---

    return text;
});

/**
 *  Input: an email address, e.g. "foo@example.com"
 *
 *  Output: the email address as a mailto link, with each character
 *    of the address encoded as either a decimal or hex entity, in
 *    the hopes of foiling most address harvesting spam bots. E.g.:
 *
 *    <a href="&#x6D;&#97;&#105;&#108;&#x74;&#111;:&#102;&#111;&#111;&#64;&#101;
 *       x&#x61;&#109;&#x70;&#108;&#x65;&#x2E;&#99;&#111;&#109;">&#102;&#111;&#111;
 *       &#64;&#101;x&#x61;&#109;&#x70;&#108;&#x65;&#x2E;&#99;&#111;&#109;</a>
 *
 *  Based on a filter by Matthew Wickline, posted to the BBEdit-Talk
 *  mailing list: <http://tinyurl.com/yu7ue>
 *
 */
showdown.subParser('encodeEmailAddress', function (addr) {
    'use strict';

    var encode = [function (ch) {
        return '&#' + ch.charCodeAt(0) + ';';
    }, function (ch) {
        return '&#x' + ch.charCodeAt(0).toString(16) + ';';
    }, function (ch) {
        return ch;
    }];

    addr = 'mailto:' + addr;

    addr = addr.replace(/./g, function (ch) {
        if (ch === '@') {
            // this *must* be encoded. I insist.
            ch = encode[Math.floor(Math.random() * 2)](ch);
        } else if (ch !== ':') {
            // leave ':' alone (to spot mailto: later)
            var r = Math.random();
            // roughly 10% raw, 45% hex, 45% dec
            ch = r > 0.9 ? encode[2](ch) : r > 0.45 ? encode[1](ch) : encode[0](ch);
        }
        return ch;
    });

    addr = '<a href="' + addr + '">' + addr + '</a>';
    addr = addr.replace(/">.+:/g, '">'); // strip the mailto: from the visible part

    return addr;
});

/**
 * Within tags -- meaning between < and > -- encode [\ ` * _] so they
 * don't conflict with their use in Markdown for code, italics and strong.
 */
showdown.subParser('escapeSpecialCharsWithinTagAttributes', function (text) {
    'use strict';

    // Build a regex to find HTML tags and comments.  See Friedl's
    // "Mastering Regular Expressions", 2nd Ed., pp. 200-201.

    var regex = /(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;

    text = text.replace(regex, function (wholeMatch) {
        var tag = wholeMatch.replace(/(.)<\/?code>(?=.)/g, '$1`');
        tag = showdown.helper.escapeCharacters(tag, '\\`*_', false);
        return tag;
    });

    return text;
});

/**
 * Handle github codeblocks prior to running HashHTML so that
 * HTML contained within the codeblock gets escaped properly
 * Example:
 * ```ruby
 *     def hello_world(x)
 *       puts "Hello, #{x}"
 *     end
 * ```
 */
showdown.subParser('githubCodeBlocks', function (text, options, globals) {
    'use strict';

    // early exit if option is not enabled

    if (!options.ghCodeBlocks) {
        return text;
    }

    text = globals.converter._dispatch('githubCodeBlocks.before', text, options, globals);

    text += '~0';

    text = text.replace(/(?:^|\n)```(.*)\n([\s\S]*?)\n```/g, function (wholeMatch, language, codeblock) {
        var end = options.omitExtraWLInCodeBlocks ? '' : '\n';

        // First parse the github code block
        codeblock = showdown.subParser('encodeCode')(codeblock);
        codeblock = showdown.subParser('detab')(codeblock);
        codeblock = codeblock.replace(/^\n+/g, ''); // trim leading newlines
        codeblock = codeblock.replace(/\n+$/g, ''); // trim trailing whitespace

        codeblock = '<pre><code' + (language ? ' class="' + language + ' language-' + language + '"' : '') + '>' + codeblock + end + '</code></pre>';

        codeblock = showdown.subParser('hashBlock')(codeblock, options, globals);

        // Since GHCodeblocks can be false positives, we need to
        // store the primitive text and the parsed text in a global var,
        // and then return a token
        return '\n\n~G' + (globals.ghCodeBlocks.push({ text: wholeMatch, codeblock: codeblock }) - 1) + 'G\n\n';
    });

    // attacklab: strip sentinel
    text = text.replace(/~0/, '');

    return globals.converter._dispatch('githubCodeBlocks.after', text, options, globals);
});

showdown.subParser('hashBlock', function (text, options, globals) {
    'use strict';

    text = text.replace(/(^\n+|\n+$)/g, '');
    return '\n\n~K' + (globals.gHtmlBlocks.push(text) - 1) + 'K\n\n';
});

showdown.subParser('hashElement', function (text, options, globals) {
    'use strict';

    return function (wholeMatch, m1) {
        var blockText = m1;

        // Undo double lines
        blockText = blockText.replace(/\n\n/g, '\n');
        blockText = blockText.replace(/^\n/, '');

        // strip trailing blank lines
        blockText = blockText.replace(/\n+$/g, '');

        // Replace the element text with a marker ("~KxK" where x is its key)
        blockText = '\n\n~K' + (globals.gHtmlBlocks.push(blockText) - 1) + 'K\n\n';

        return blockText;
    };
});

showdown.subParser('hashHTMLBlocks', function (text, options, globals) {
    'use strict';

    var blockTags = ['pre', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'table', 'dl', 'ol', 'ul', 'script', 'noscript', 'form', 'fieldset', 'iframe', 'math', 'style', 'section', 'header', 'footer', 'nav', 'article', 'aside', 'address', 'audio', 'canvas', 'figure', 'hgroup', 'output', 'video', 'p'],
        repFunc = function repFunc(wholeMatch, match, left, right) {
        var txt = wholeMatch;
        // check if this html element is marked as markdown
        // if so, it's contents should be parsed as markdown
        if (left.search(/\bmarkdown\b/) !== -1) {
            txt = left + globals.converter.makeHtml(match) + right;
        }
        return '\n\n~K' + (globals.gHtmlBlocks.push(txt) - 1) + 'K\n\n';
    };

    for (var i = 0; i < blockTags.length; ++i) {
        text = showdown.helper.replaceRecursiveRegExp(text, repFunc, '^(?: |\\t){0,3}<' + blockTags[i] + '\\b[^>]*>', '</' + blockTags[i] + '>', 'gim');
    }

    // HR SPECIAL CASE
    text = text.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g, showdown.subParser('hashElement')(text, options, globals));

    // Special case for standalone HTML comments:
    text = text.replace(/(<!--[\s\S]*?-->)/g, showdown.subParser('hashElement')(text, options, globals));

    // PHP and ASP-style processor instructions (<?...?> and <%...%>)
    text = text.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g, showdown.subParser('hashElement')(text, options, globals));
    return text;
});

/**
 * Hash span elements that should not be parsed as markdown
 */
showdown.subParser('hashHTMLSpans', function (text, config, globals) {
    'use strict';

    var matches = showdown.helper.matchRecursiveRegExp(text, '<code\\b[^>]*>', '</code>', 'gi');

    for (var i = 0; i < matches.length; ++i) {
        text = text.replace(matches[i][0], '~L' + (globals.gHtmlSpans.push(matches[i][0]) - 1) + 'L');
    }
    return text;
});

/**
 * Unhash HTML spans
 */
showdown.subParser('unhashHTMLSpans', function (text, config, globals) {
    'use strict';

    for (var i = 0; i < globals.gHtmlSpans.length; ++i) {
        text = text.replace('~L' + i + 'L', globals.gHtmlSpans[i]);
    }

    return text;
});

/**
 * Hash span elements that should not be parsed as markdown
 */
showdown.subParser('hashPreCodeTags', function (text, config, globals) {
    'use strict';

    var repFunc = function repFunc(wholeMatch, match, left, right) {
        // encode html entities
        var codeblock = left + showdown.subParser('encodeCode')(match) + right;
        return '\n\n~G' + (globals.ghCodeBlocks.push({ text: wholeMatch, codeblock: codeblock }) - 1) + 'G\n\n';
    };

    text = showdown.helper.replaceRecursiveRegExp(text, repFunc, '^(?: |\\t){0,3}<pre\\b[^>]*>\\s*<code\\b[^>]*>', '^(?: |\\t){0,3}</code>\\s*</pre>', 'gim');
    return text;
});

showdown.subParser('headers', function (text, options, globals) {
    'use strict';

    text = globals.converter._dispatch('headers.before', text, options, globals);

    var prefixHeader = options.prefixHeaderId,
        headerLevelStart = isNaN(parseInt(options.headerLevelStart)) ? 1 : parseInt(options.headerLevelStart),


    // Set text-style headers:
    //	Header 1
    //	========
    //
    //	Header 2
    //	--------
    //
    setextRegexH1 = options.smoothLivePreview ? /^(.+)[ \t]*\n={2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n=+[ \t]*\n+/gm,
        setextRegexH2 = options.smoothLivePreview ? /^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n-+[ \t]*\n+/gm;

    text = text.replace(setextRegexH1, function (wholeMatch, m1) {

        var spanGamut = showdown.subParser('spanGamut')(m1, options, globals),
            hID = options.noHeaderId ? '' : ' id="' + headerId(m1) + '"',
            hLevel = headerLevelStart,
            hashBlock = '<h' + hLevel + hID + '>' + spanGamut + '</h' + hLevel + '>';
        return showdown.subParser('hashBlock')(hashBlock, options, globals);
    });

    text = text.replace(setextRegexH2, function (matchFound, m1) {
        var spanGamut = showdown.subParser('spanGamut')(m1, options, globals),
            hID = options.noHeaderId ? '' : ' id="' + headerId(m1) + '"',
            hLevel = headerLevelStart + 1,
            hashBlock = '<h' + hLevel + hID + '>' + spanGamut + '</h' + hLevel + '>';
        return showdown.subParser('hashBlock')(hashBlock, options, globals);
    });

    // atx-style headers:
    //  # Header 1
    //  ## Header 2
    //  ## Header 2 with closing hashes ##
    //  ...
    //  ###### Header 6
    //
    text = text.replace(/^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm, function (wholeMatch, m1, m2) {
        var span = showdown.subParser('spanGamut')(m2, options, globals),
            hID = options.noHeaderId ? '' : ' id="' + headerId(m2) + '"',
            hLevel = headerLevelStart - 1 + m1.length,
            header = '<h' + hLevel + hID + '>' + span + '</h' + hLevel + '>';

        return showdown.subParser('hashBlock')(header, options, globals);
    });

    function headerId(m) {
        var title,
            escapedId = m.replace(/[^\w]/g, '').toLowerCase();

        if (globals.hashLinkCounts[escapedId]) {
            title = escapedId + '-' + globals.hashLinkCounts[escapedId]++;
        } else {
            title = escapedId;
            globals.hashLinkCounts[escapedId] = 1;
        }

        // Prefix id to prevent causing inadvertent pre-existing style matches.
        if (prefixHeader === true) {
            prefixHeader = 'section';
        }

        if (showdown.helper.isString(prefixHeader)) {
            return prefixHeader + title;
        }
        return title;
    }

    text = globals.converter._dispatch('headers.after', text, options, globals);
    return text;
});

/**
 * Turn Markdown image shortcuts into <img> tags.
 */
showdown.subParser('images', function (text, options, globals) {
    'use strict';

    text = globals.converter._dispatch('images.before', text, options, globals);

    var inlineRegExp = /!\[(.*?)]\s?\([ \t]*()<?(\S+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(['"])(.*?)\6[ \t]*)?\)/g,
        referenceRegExp = /!\[([^\]]*?)] ?(?:\n *)?\[(.*?)]()()()()()/g;

    function writeImageTag(wholeMatch, altText, linkId, url, width, height, m5, title) {

        var gUrls = globals.gUrls,
            gTitles = globals.gTitles,
            gDims = globals.gDimensions;

        linkId = linkId.toLowerCase();

        if (!title) {
            title = '';
        }

        if (url === '' || url === null) {
            if (linkId === '' || linkId === null) {
                // lower-case and turn embedded newlines into spaces
                linkId = altText.toLowerCase().replace(/ ?\n/g, ' ');
            }
            url = '#' + linkId;

            if (!showdown.helper.isUndefined(gUrls[linkId])) {
                url = gUrls[linkId];
                if (!showdown.helper.isUndefined(gTitles[linkId])) {
                    title = gTitles[linkId];
                }
                if (!showdown.helper.isUndefined(gDims[linkId])) {
                    width = gDims[linkId].width;
                    height = gDims[linkId].height;
                }
            } else {
                return wholeMatch;
            }
        }

        altText = altText.replace(/"/g, '&quot;');
        altText = showdown.helper.escapeCharacters(altText, '*_', false);
        url = showdown.helper.escapeCharacters(url, '*_', false);
        var result = '<img src="' + url + '" alt="' + altText + '"';

        if (title) {
            title = title.replace(/"/g, '&quot;');
            title = showdown.helper.escapeCharacters(title, '*_', false);
            result += ' title="' + title + '"';
        }

        if (width && height) {
            width = width === '*' ? 'auto' : width;
            height = height === '*' ? 'auto' : height;

            result += ' width="' + width + '"';
            result += ' height="' + height + '"';
        }

        result += ' />';
        return result;
    }

    // First, handle reference-style labeled images: ![alt text][id]
    text = text.replace(referenceRegExp, writeImageTag);

    // Next, handle inline images:  ![alt text](url =<width>x<height> "optional title")
    text = text.replace(inlineRegExp, writeImageTag);

    text = globals.converter._dispatch('images.after', text, options, globals);
    return text;
});

showdown.subParser('italicsAndBold', function (text, options, globals) {
    'use strict';

    text = globals.converter._dispatch('italicsAndBold.before', text, options, globals);

    if (options.literalMidWordUnderscores) {
        // underscores
        // Since we are consuming a \s character, we need to add it
        text = text.replace(/(^|\s|>|\b)__(?=\S)([\s\S]+?)__(?=\b|<|\s|$)/gm, '$1<strong>$2</strong>');
        text = text.replace(/(^|\s|>|\b)_(?=\S)([\s\S]+?)_(?=\b|<|\s|$)/gm, '$1<em>$2</em>');
        // asterisks
        text = text.replace(/(\*\*)(?=\S)([^\r]*?\S[*]*)\1/g, '<strong>$2</strong>');
        text = text.replace(/(\*)(?=\S)([^\r]*?\S)\1/g, '<em>$2</em>');
    } else {
        // <strong> must go first:
        text = text.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g, '<strong>$2</strong>');
        text = text.replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g, '<em>$2</em>');
    }

    text = globals.converter._dispatch('italicsAndBold.after', text, options, globals);
    return text;
});

/**
 * Form HTML ordered (numbered) and unordered (bulleted) lists.
 */
showdown.subParser('lists', function (text, options, globals) {
    'use strict';

    text = globals.converter._dispatch('lists.before', text, options, globals);
    /**
    * Process the contents of a single ordered or unordered list, splitting it
    * into individual list items.
    * @param {string} listStr
    * @param {boolean} trimTrailing
    * @returns {string}
    */
    function processListItems(listStr, trimTrailing) {
        // The $g_list_level global keeps track of when we're inside a list.
        // Each time we enter a list, we increment it; when we leave a list,
        // we decrement. If it's zero, we're not in a list anymore.
        //
        // We do this because when we're not inside a list, we want to treat
        // something like this:
        //
        //    I recommend upgrading to version
        //    8. Oops, now this line is treated
        //    as a sub-list.
        //
        // As a single paragraph, despite the fact that the second line starts
        // with a digit-period-space sequence.
        //
        // Whereas when we're inside a list (or sub-list), that line will be
        // treated as the start of a sub-list. What a kludge, huh? This is
        // an aspect of Markdown's syntax that's hard to parse perfectly
        // without resorting to mind-reading. Perhaps the solution is to
        // change the syntax rules such that sub-lists must start with a
        // starting cardinal number; e.g. "1." or "a.".
        globals.gListLevel++;

        // trim trailing blank lines:
        listStr = listStr.replace(/\n{2,}$/, '\n');

        // attacklab: add sentinel to emulate \z
        listStr += '~0';

        var rgx = /(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm,
            isParagraphed = /\n[ \t]*\n(?!~0)/.test(listStr);

        listStr = listStr.replace(rgx, function (wholeMatch, m1, m2, m3, m4, taskbtn, checked) {
            checked = checked && checked.trim() !== '';
            var item = showdown.subParser('outdent')(m4, options, globals),
                bulletStyle = '';

            // Support for github tasklists
            if (taskbtn && options.tasklists) {
                bulletStyle = ' class="task-list-item" style="list-style-type: none;"';
                item = item.replace(/^[ \t]*\[(x|X| )?]/m, function () {
                    var otp = '<input type="checkbox" disabled style="margin: 0px 0.35em 0.25em -1.6em; vertical-align: middle;"';
                    if (checked) {
                        otp += ' checked';
                    }
                    otp += '>';
                    return otp;
                });
            }
            // m1 - Leading line or
            // Has a double return (multi paragraph) or
            // Has sublist
            if (m1 || item.search(/\n{2,}/) > -1) {
                item = showdown.subParser('githubCodeBlocks')(item, options, globals);
                item = showdown.subParser('blockGamut')(item, options, globals);
            } else {
                // Recursion for sub-lists:
                item = showdown.subParser('lists')(item, options, globals);
                item = item.replace(/\n$/, ''); // chomp(item)
                if (isParagraphed) {
                    item = showdown.subParser('paragraphs')(item, options, globals);
                } else {
                    item = showdown.subParser('spanGamut')(item, options, globals);
                }
            }
            item = '\n<li' + bulletStyle + '>' + item + '</li>\n';
            return item;
        });

        // attacklab: strip sentinel
        listStr = listStr.replace(/~0/g, '');

        globals.gListLevel--;

        if (trimTrailing) {
            listStr = listStr.replace(/\s+$/, '');
        }

        return listStr;
    }

    /**
    * Check and parse consecutive lists (better fix for issue #142)
    * @param {string} list
    * @param {string} listType
    * @param {boolean} trimTrailing
    * @returns {string}
    */
    function parseConsecutiveLists(list, listType, trimTrailing) {
        // check if we caught 2 or more consecutive lists by mistake
        // we use the counterRgx, meaning if listType is UL we look for UL and vice versa
        var counterRxg = listType === 'ul' ? /^ {0,2}\d+\.[ \t]/gm : /^ {0,2}[*+-][ \t]/gm,
            subLists = [],
            result = '';

        if (list.search(counterRxg) !== -1) {
            (function parseCL(txt) {
                var pos = txt.search(counterRxg);
                if (pos !== -1) {
                    // slice
                    result += '\n\n<' + listType + '>' + processListItems(txt.slice(0, pos), !!trimTrailing) + '</' + listType + '>\n\n';

                    // invert counterType and listType
                    listType = listType === 'ul' ? 'ol' : 'ul';
                    counterRxg = listType === 'ul' ? /^ {0,2}\d+\.[ \t]/gm : /^ {0,2}[*+-][ \t]/gm;

                    // recurse
                    parseCL(txt.slice(pos));
                } else {
                    result += '\n\n<' + listType + '>' + processListItems(txt, !!trimTrailing) + '</' + listType + '>\n\n';
                }
            })(list);
            for (var i = 0; i < subLists.length; ++i) {}
        } else {
            result = '\n\n<' + listType + '>' + processListItems(list, !!trimTrailing) + '</' + listType + '>\n\n';
        }

        return result;
    }

    // attacklab: add sentinel to hack around khtml/safari bug:
    // http://bugs.webkit.org/show_bug.cgi?id=11231
    text += '~0';

    // Re-usable pattern to match any entire ul or ol list:
    var wholeList = /^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;

    if (globals.gListLevel) {
        text = text.replace(wholeList, function (wholeMatch, list, m2) {
            var listType = m2.search(/[*+-]/g) > -1 ? 'ul' : 'ol';
            return parseConsecutiveLists(list, listType, true);
        });
    } else {
        wholeList = /(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;
        // wholeList = /(\n\n|^\n?)( {0,3}([*+-]|\d+\.)[ \t]+[\s\S]+?)(?=(~0)|(\n\n(?!\t| {2,}| {0,3}([*+-]|\d+\.)[ \t])))/g;
        text = text.replace(wholeList, function (wholeMatch, m1, list, m3) {

            var listType = m3.search(/[*+-]/g) > -1 ? 'ul' : 'ol';
            return parseConsecutiveLists(list, listType);
        });
    }

    // attacklab: strip sentinel
    text = text.replace(/~0/, '');

    text = globals.converter._dispatch('lists.after', text, options, globals);
    return text;
});

/**
 * Remove one level of line-leading tabs or spaces
 */
showdown.subParser('outdent', function (text) {
    'use strict';

    // attacklab: hack around Konqueror 3.5.4 bug:
    // "----------bug".replace(/^-/g,"") == "bug"

    text = text.replace(/^(\t|[ ]{1,4})/gm, '~0'); // attacklab: g_tab_width

    // attacklab: clean up hack
    text = text.replace(/~0/g, '');

    return text;
});

/**
 *
 */
showdown.subParser('paragraphs', function (text, options, globals) {
    'use strict';

    text = globals.converter._dispatch('paragraphs.before', text, options, globals);
    // Strip leading and trailing lines:
    text = text.replace(/^\n+/g, '');
    text = text.replace(/\n+$/g, '');

    var grafs = text.split(/\n{2,}/g),
        grafsOut = [],
        end = grafs.length; // Wrap <p> tags

    for (var i = 0; i < end; i++) {
        var str = grafs[i];
        // if this is an HTML marker, copy it
        if (str.search(/~(K|G)(\d+)\1/g) >= 0) {
            grafsOut.push(str);
        } else {
            str = showdown.subParser('spanGamut')(str, options, globals);
            str = str.replace(/^([ \t]*)/g, '<p>');
            str += '</p>';
            grafsOut.push(str);
        }
    }

    /** Unhashify HTML blocks */
    end = grafsOut.length;
    for (i = 0; i < end; i++) {
        var blockText = '',
            grafsOutIt = grafsOut[i],
            codeFlag = false;
        // if this is a marker for an html block...
        while (grafsOutIt.search(/~(K|G)(\d+)\1/) >= 0) {
            var delim = RegExp.$1,
                num = RegExp.$2;

            if (delim === 'K') {
                blockText = globals.gHtmlBlocks[num];
            } else {
                // we need to check if ghBlock is a false positive
                if (codeFlag) {
                    // use encoded version of all text
                    blockText = showdown.subParser('encodeCode')(globals.ghCodeBlocks[num].text);
                } else {
                    blockText = globals.ghCodeBlocks[num].codeblock;
                }
            }
            blockText = blockText.replace(/\$/g, '$$$$'); // Escape any dollar signs

            grafsOutIt = grafsOutIt.replace(/(\n\n)?~(K|G)\d+\2(\n\n)?/, blockText);
            // Check if grafsOutIt is a pre->code
            if (/^<pre\b[^>]*>\s*<code\b[^>]*>/.test(grafsOutIt)) {
                codeFlag = true;
            }
        }
        grafsOut[i] = grafsOutIt;
    }
    text = grafsOut.join('\n\n');
    // Strip leading and trailing lines:
    text = text.replace(/^\n+/g, '');
    text = text.replace(/\n+$/g, '');
    return globals.converter._dispatch('paragraphs.after', text, options, globals);
});

/**
 * Run extension
 */
showdown.subParser('runExtension', function (ext, text, options, globals) {
    'use strict';

    if (ext.filter) {
        text = ext.filter(text, globals.converter, options);
    } else if (ext.regex) {
        // TODO remove this when old extension loading mechanism is deprecated
        var re = ext.regex;
        if (!(re instanceof RegExp)) {
            re = new RegExp(re, 'g');
        }
        text = text.replace(re, ext.replace);
    }

    return text;
});

/**
 * These are all the transformations that occur *within* block-level
 * tags like paragraphs, headers, and list items.
 */
showdown.subParser('spanGamut', function (text, options, globals) {
    'use strict';

    text = globals.converter._dispatch('spanGamut.before', text, options, globals);
    text = showdown.subParser('codeSpans')(text, options, globals);
    text = showdown.subParser('escapeSpecialCharsWithinTagAttributes')(text, options, globals);
    text = showdown.subParser('encodeBackslashEscapes')(text, options, globals);

    // Process anchor and image tags. Images must come first,
    // because ![foo][f] looks like an anchor.
    text = showdown.subParser('images')(text, options, globals);
    text = showdown.subParser('anchors')(text, options, globals);

    // Make links out of things like `<http://example.com/>`
    // Must come after _DoAnchors(), because you can use < and >
    // delimiters in inline links like [this](<url>).
    text = showdown.subParser('autoLinks')(text, options, globals);
    text = showdown.subParser('encodeAmpsAndAngles')(text, options, globals);
    text = showdown.subParser('italicsAndBold')(text, options, globals);
    text = showdown.subParser('strikethrough')(text, options, globals);

    // Do hard breaks:
    text = text.replace(/  +\n/g, ' <br />\n');

    text = globals.converter._dispatch('spanGamut.after', text, options, globals);
    return text;
});

showdown.subParser('strikethrough', function (text, options, globals) {
    'use strict';

    if (options.strikethrough) {
        text = globals.converter._dispatch('strikethrough.before', text, options, globals);
        text = text.replace(/(?:~T){2}([\s\S]+?)(?:~T){2}/g, '<del>$1</del>');
        text = globals.converter._dispatch('strikethrough.after', text, options, globals);
    }

    return text;
});

/**
 * Strip any lines consisting only of spaces and tabs.
 * This makes subsequent regexs easier to write, because we can
 * match consecutive blank lines with /\n+/ instead of something
 * contorted like /[ \t]*\n+/
 */
showdown.subParser('stripBlankLines', function (text) {
    'use strict';

    return text.replace(/^[ \t]+$/mg, '');
});

/**
 * Strips link definitions from text, stores the URLs and titles in
 * hash references.
 * Link defs are in the form: ^[id]: url "optional title"
 *
 * ^[ ]{0,3}\[(.+)\]: // id = $1  attacklab: g_tab_width - 1
 * [ \t]*
 * \n?                  // maybe *one* newline
 * [ \t]*
 * <?(\S+?)>?          // url = $2
 * [ \t]*
 * \n?                // maybe one newline
 * [ \t]*
 * (?:
 * (\n*)              // any lines skipped = $3 attacklab: lookbehind removed
 * ["(]
 * (.+?)              // title = $4
 * [")]
 * [ \t]*
 * )?                 // title is optional
 * (?:\n+|$)
 * /gm,
 * function(){...});
 *
 */
showdown.subParser('stripLinkDefinitions', function (text, options, globals) {
    'use strict';

    var regex = /^ {0,3}\[(.+)]:[ \t]*\n?[ \t]*<?(\S+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=~0))/gm;

    // attacklab: sentinel workarounds for lack of \A and \Z, safari\khtml bug
    text += '~0';

    text = text.replace(regex, function (wholeMatch, linkId, url, width, height, blankLines, title) {
        linkId = linkId.toLowerCase();
        globals.gUrls[linkId] = showdown.subParser('encodeAmpsAndAngles')(url); // Link IDs are case-insensitive

        if (blankLines) {
            // Oops, found blank lines, so it's not a title.
            // Put back the parenthetical statement we stole.
            return blankLines + title;
        } else {
            if (title) {
                globals.gTitles[linkId] = title.replace(/"|'/g, '&quot;');
            }
            if (options.parseImgDimensions && width && height) {
                globals.gDimensions[linkId] = {
                    width: width,
                    height: height
                };
            }
        }
        // Completely remove the definition from the text
        return '';
    });

    // attacklab: strip sentinel
    text = text.replace(/~0/, '');

    return text;
});

showdown.subParser('tables', function (text, options, globals) {
    'use strict';

    if (!options.tables) {
        return text;
    }

    var tableRgx = /^[ \t]{0,3}\|?.+\|.+\n[ \t]{0,3}\|?[ \t]*:?[ \t]*(?:-|=){2,}[ \t]*:?[ \t]*\|[ \t]*:?[ \t]*(?:-|=){2,}[\s\S]+?(?:\n\n|~0)/gm;

    function parseStyles(sLine) {
        if (/^:[ \t]*--*$/.test(sLine)) {
            return ' style="text-align:left;"';
        } else if (/^--*[ \t]*:[ \t]*$/.test(sLine)) {
            return ' style="text-align:right;"';
        } else if (/^:[ \t]*--*[ \t]*:$/.test(sLine)) {
            return ' style="text-align:center;"';
        } else {
            return '';
        }
    }

    function parseHeaders(header, style) {
        var id = '';
        header = header.trim();
        if (options.tableHeaderId) {
            id = ' id="' + header.replace(/ /g, '_').toLowerCase() + '"';
        }
        header = showdown.subParser('spanGamut')(header, options, globals);

        return '<th' + id + style + '>' + header + '</th>\n';
    }

    function parseCells(cell, style) {
        var subText = showdown.subParser('spanGamut')(cell, options, globals);
        return '<td' + style + '>' + subText + '</td>\n';
    }

    function buildTable(headers, cells) {
        var tb = '<table>\n<thead>\n<tr>\n',
            tblLgn = headers.length;

        for (var i = 0; i < tblLgn; ++i) {
            tb += headers[i];
        }
        tb += '</tr>\n</thead>\n<tbody>\n';

        for (i = 0; i < cells.length; ++i) {
            tb += '<tr>\n';
            for (var ii = 0; ii < tblLgn; ++ii) {
                tb += cells[i][ii];
            }
            tb += '</tr>\n';
        }
        tb += '</tbody>\n</table>\n';
        return tb;
    }

    text = globals.converter._dispatch('tables.before', text, options, globals);

    text = text.replace(tableRgx, function (rawTable) {

        var i,
            tableLines = rawTable.split('\n');

        // strip wrong first and last column if wrapped tables are used
        for (i = 0; i < tableLines.length; ++i) {
            if (/^[ \t]{0,3}\|/.test(tableLines[i])) {
                tableLines[i] = tableLines[i].replace(/^[ \t]{0,3}\|/, '');
            }
            if (/\|[ \t]*$/.test(tableLines[i])) {
                tableLines[i] = tableLines[i].replace(/\|[ \t]*$/, '');
            }
        }

        var rawHeaders = tableLines[0].split('|').map(function (s) {
            return s.trim();
        }),
            rawStyles = tableLines[1].split('|').map(function (s) {
            return s.trim();
        }),
            rawCells = [],
            headers = [],
            styles = [],
            cells = [];

        tableLines.shift();
        tableLines.shift();

        for (i = 0; i < tableLines.length; ++i) {
            if (tableLines[i].trim() === '') {
                continue;
            }
            rawCells.push(tableLines[i].split('|').map(function (s) {
                return s.trim();
            }));
        }

        if (rawHeaders.length < rawStyles.length) {
            return rawTable;
        }

        for (i = 0; i < rawStyles.length; ++i) {
            styles.push(parseStyles(rawStyles[i]));
        }

        for (i = 0; i < rawHeaders.length; ++i) {
            if (showdown.helper.isUndefined(styles[i])) {
                styles[i] = '';
            }
            headers.push(parseHeaders(rawHeaders[i], styles[i]));
        }

        for (i = 0; i < rawCells.length; ++i) {
            var row = [];
            for (var ii = 0; ii < headers.length; ++ii) {
                if (showdown.helper.isUndefined(rawCells[i][ii])) {}
                row.push(parseCells(rawCells[i][ii], styles[ii]));
            }
            cells.push(row);
        }

        return buildTable(headers, cells);
    });

    text = globals.converter._dispatch('tables.after', text, options, globals);

    return text;
});

/**
 * Swap back in all the special characters we've hidden.
 */
showdown.subParser('unescapeSpecialChars', function (text) {
    'use strict';

    text = text.replace(/~E(\d+)E/g, function (wholeMatch, m1) {
        var charCodeToReplace = parseInt(m1);
        return String.fromCharCode(charCodeToReplace);
    });
    return text;
});
module.exports = showdown;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNob3dkb3duLmpzIl0sIm5hbWVzIjpbImdldERlZmF1bHRPcHRzIiwic2ltcGxlIiwiZGVmYXVsdE9wdGlvbnMiLCJvbWl0RXh0cmFXTEluQ29kZUJsb2NrcyIsImRlZmF1bHRWYWx1ZSIsImRlc2NyaWJlIiwidHlwZSIsIm5vSGVhZGVySWQiLCJwcmVmaXhIZWFkZXJJZCIsImhlYWRlckxldmVsU3RhcnQiLCJwYXJzZUltZ0RpbWVuc2lvbnMiLCJzaW1wbGlmaWVkQXV0b0xpbmsiLCJsaXRlcmFsTWlkV29yZFVuZGVyc2NvcmVzIiwic3RyaWtldGhyb3VnaCIsInRhYmxlcyIsInRhYmxlc0hlYWRlcklkIiwiZ2hDb2RlQmxvY2tzIiwidGFza2xpc3RzIiwic21vb3RoTGl2ZVByZXZpZXciLCJzbWFydEluZGVudGF0aW9uRml4IiwiZGVzY3JpcHRpb24iLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJyZXQiLCJvcHQiLCJoYXNPd25Qcm9wZXJ0eSIsInNob3dkb3duIiwicGFyc2VycyIsImV4dGVuc2lvbnMiLCJnbG9iYWxPcHRpb25zIiwiZmxhdm9yIiwiZ2l0aHViIiwidmFuaWxsYSIsImhlbHBlciIsInNldE9wdGlvbiIsImtleSIsInZhbHVlIiwiZ2V0T3B0aW9uIiwiZ2V0T3B0aW9ucyIsInJlc2V0T3B0aW9ucyIsInNldEZsYXZvciIsIm5hbWUiLCJwcmVzZXQiLCJvcHRpb24iLCJnZXREZWZhdWx0T3B0aW9ucyIsInN1YlBhcnNlciIsImZ1bmMiLCJpc1N0cmluZyIsIkVycm9yIiwiZXh0ZW5zaW9uIiwiZXh0Iiwic3RkRXh0TmFtZSIsImlzVW5kZWZpbmVkIiwiaXNBcnJheSIsInZhbGlkRXh0ZW5zaW9uIiwidmFsaWRhdGUiLCJ2YWxpZCIsImVycm9yIiwiZ2V0QWxsRXh0ZW5zaW9ucyIsInJlbW92ZUV4dGVuc2lvbiIsInJlc2V0RXh0ZW5zaW9ucyIsImVyck1zZyIsImkiLCJsZW5ndGgiLCJiYXNlTXNnIiwidG9Mb3dlckNhc2UiLCJsaXN0ZW5lcnMiLCJmaWx0ZXIiLCJyZWdleCIsImxuIiwiUmVnRXhwIiwicmVwbGFjZSIsInZhbGlkYXRlRXh0ZW5zaW9uIiwiY29uc29sZSIsIndhcm4iLCJhIiwiU3RyaW5nIiwiaXNGdW5jdGlvbiIsImdldFR5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJmb3JFYWNoIiwib2JqIiwiY2FsbGJhY2siLCJjb25zdHJ1Y3RvciIsIkFycmF5IiwicyIsImVzY2FwZUNoYXJhY3RlcnNDYWxsYmFjayIsIndob2xlTWF0Y2giLCJtMSIsImNoYXJDb2RlVG9Fc2NhcGUiLCJjaGFyQ29kZUF0IiwiZXNjYXBlQ2hhcmFjdGVycyIsInRleHQiLCJjaGFyc1RvRXNjYXBlIiwiYWZ0ZXJCYWNrc2xhc2giLCJyZWdleFN0cmluZyIsInJneEZpbmRNYXRjaFBvcyIsInN0ciIsImxlZnQiLCJyaWdodCIsImZsYWdzIiwiZiIsImciLCJpbmRleE9mIiwieCIsImwiLCJwb3MiLCJ0IiwibSIsInN0YXJ0IiwiZW5kIiwiZXhlYyIsInRlc3QiLCJsYXN0SW5kZXgiLCJpbmRleCIsIm1hdGNoIiwicHVzaCIsIm1hdGNoUmVjdXJzaXZlUmVnRXhwIiwibWF0Y2hQb3MiLCJyZXN1bHRzIiwic2xpY2UiLCJyZXBsYWNlUmVjdXJzaXZlUmVnRXhwIiwicmVwbGFjZW1lbnQiLCJyZXBTdHIiLCJmaW5hbFN0ciIsImxuZyIsImJpdHMiLCJqb2luIiwibXNnIiwiYWxlcnQiLCJsb2ciLCJDb252ZXJ0ZXIiLCJjb252ZXJ0ZXJPcHRpb25zIiwib3B0aW9ucyIsImxhbmdFeHRlbnNpb25zIiwib3V0cHV0TW9kaWZpZXJzIiwiX2NvbnN0cnVjdG9yIiwiZ09wdCIsIl9wYXJzZUV4dGVuc2lvbiIsImxlZ2FjeUV4dGVuc2lvbkxvYWRpbmciLCJ2YWxpZEV4dCIsImxpc3RlbiIsInJUcmltSW5wdXRUZXh0IiwicnNwIiwicmd4IiwiX2Rpc3BhdGNoIiwiZGlzcGF0Y2giLCJldnROYW1lIiwiZ2xvYmFscyIsImVpIiwiblRleHQiLCJtYWtlSHRtbCIsImdIdG1sQmxvY2tzIiwiZ0h0bWxNZEJsb2NrcyIsImdIdG1sU3BhbnMiLCJnVXJscyIsImdUaXRsZXMiLCJnRGltZW5zaW9ucyIsImdMaXN0TGV2ZWwiLCJoYXNoTGlua0NvdW50cyIsImNvbnZlcnRlciIsImFkZEV4dGVuc2lvbiIsInVzZUV4dGVuc2lvbiIsImV4dGVuc2lvbk5hbWUiLCJzcGxpY2UiLCJpaSIsImxhbmd1YWdlIiwib3V0cHV0Iiwid3JpdGVBbmNob3JUYWciLCJtMiIsIm0zIiwibTQiLCJtNSIsIm02IiwibTciLCJsaW5rVGV4dCIsImxpbmtJZCIsInVybCIsInRpdGxlIiwic2VhcmNoIiwicmVzdWx0Iiwic2ltcGxlVVJMUmVnZXgiLCJkZWxpbVVybFJlZ2V4Iiwic2ltcGxlTWFpbFJlZ2V4IiwiZGVsaW1NYWlsUmVnZXgiLCJyZXBsYWNlTGluayIsInJlcGxhY2VNYWlsIiwid20iLCJsaW5rIiwibG5rVHh0IiwidW5lc2NhcGVkU3RyIiwiYnEiLCJwcmUiLCJwYXR0ZXJuIiwiY29kZWJsb2NrIiwibmV4dENoYXIiLCJjIiwibGVhZGluZ1RleHQiLCJudW1TcGFjZXMiLCJhZGRyIiwiZW5jb2RlIiwiY2giLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJyIiwidGFnIiwiYmxvY2tUZXh0IiwiYmxvY2tUYWdzIiwicmVwRnVuYyIsInR4dCIsImNvbmZpZyIsIm1hdGNoZXMiLCJwcmVmaXhIZWFkZXIiLCJpc05hTiIsInBhcnNlSW50Iiwic2V0ZXh0UmVnZXhIMSIsInNldGV4dFJlZ2V4SDIiLCJzcGFuR2FtdXQiLCJoSUQiLCJoZWFkZXJJZCIsImhMZXZlbCIsImhhc2hCbG9jayIsIm1hdGNoRm91bmQiLCJzcGFuIiwiaGVhZGVyIiwiZXNjYXBlZElkIiwiaW5saW5lUmVnRXhwIiwicmVmZXJlbmNlUmVnRXhwIiwid3JpdGVJbWFnZVRhZyIsImFsdFRleHQiLCJ3aWR0aCIsImhlaWdodCIsImdEaW1zIiwicHJvY2Vzc0xpc3RJdGVtcyIsImxpc3RTdHIiLCJ0cmltVHJhaWxpbmciLCJpc1BhcmFncmFwaGVkIiwidGFza2J0biIsImNoZWNrZWQiLCJ0cmltIiwiaXRlbSIsImJ1bGxldFN0eWxlIiwib3RwIiwicGFyc2VDb25zZWN1dGl2ZUxpc3RzIiwibGlzdCIsImxpc3RUeXBlIiwiY291bnRlclJ4ZyIsInN1Ykxpc3RzIiwicGFyc2VDTCIsIndob2xlTGlzdCIsImdyYWZzIiwic3BsaXQiLCJncmFmc091dCIsImdyYWZzT3V0SXQiLCJjb2RlRmxhZyIsImRlbGltIiwiJDEiLCJudW0iLCIkMiIsInJlIiwiYmxhbmtMaW5lcyIsInRhYmxlUmd4IiwicGFyc2VTdHlsZXMiLCJzTGluZSIsInBhcnNlSGVhZGVycyIsInN0eWxlIiwiaWQiLCJ0YWJsZUhlYWRlcklkIiwicGFyc2VDZWxscyIsImNlbGwiLCJzdWJUZXh0IiwiYnVpbGRUYWJsZSIsImhlYWRlcnMiLCJjZWxscyIsInRiIiwidGJsTGduIiwicmF3VGFibGUiLCJ0YWJsZUxpbmVzIiwicmF3SGVhZGVycyIsIm1hcCIsInJhd1N0eWxlcyIsInJhd0NlbGxzIiwic3R5bGVzIiwic2hpZnQiLCJyb3ciLCJjaGFyQ29kZVRvUmVwbGFjZSIsImZyb21DaGFyQ29kZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7QUFjQSxTQUFTQSxjQUFULENBQXdCQyxNQUF4QixFQUFnQztBQUM1Qjs7QUFFQSxRQUFJQyxpQkFBaUI7QUFDakJDLGlDQUF5QjtBQUNyQkMsMEJBQWMsS0FETztBQUVyQkMsc0JBQVUsdURBRlc7QUFHckJDLGtCQUFNO0FBSGUsU0FEUjtBQU1qQkMsb0JBQVk7QUFDUkgsMEJBQWMsS0FETjtBQUVSQyxzQkFBVSxpQ0FGRjtBQUdSQyxrQkFBTTtBQUhFLFNBTks7QUFXakJFLHdCQUFnQjtBQUNaSiwwQkFBYyxLQURGO0FBRVpDLHNCQUFVLDBDQUZFO0FBR1pDLGtCQUFNO0FBSE0sU0FYQztBQWdCakJHLDBCQUFrQjtBQUNkTCwwQkFBYyxLQURBO0FBRWRDLHNC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QUEzRCxDQUFQOztBQUVBLFdBQU94RCxJQUFQO0FBQ0gsQ0FoSUQ7O0FBa0lBOzs7QUFHQW5FLFNBQVNtQixTQUFULENBQW1CLHNCQUFuQixFQUEyQyxVQUFVZ0QsSUFBVixFQUFnQjtBQUN2RDs7QUFFQUEsV0FBT0EsS0FBS3RCLE9BQUwsQ0FBYSxXQUFiLEVBQTBCLFVBQVVpQixVQUFWLEVBQXNCQyxFQUF0QixFQUEwQjtBQUN2RCxZQUFJc00sb0JBQW9CdkUsU0FBUy9ILEVBQVQsQ0FBeEI7QUFDQSxlQUFPYixPQUFPb04sWUFBUCxDQUFvQkQsaUJBQXBCLENBQVA7QUFDSCxLQUhNLENBQVA7QUFJQSxXQUFPbE0sSUFBUDtBQUNILENBUkQ7QUFTQW9NLE9BQU9DLE9BQVAsR0FBaUJ4USxRQUFqQiIsImZpbGUiOiJzaG93ZG93bi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKlxyXG4gKiBzaG93ZG93bjogaHR0cHM6Ly9naXRodWIuY29tL3Nob3dkb3duanMvc2hvd2Rvd25cclxuICpcclxuICogYXV0aG9yOiBEaSAo5b6u5L+h5bCP56iL5bqP5byA5Y+R5bel56iL5biIKVxyXG4gKiBvcmdhbml6YXRpb246IFdlQXBwRGV2KOW+ruS/oeWwj+eoi+W6j+W8gOWPkeiuuuWdmykoaHR0cDovL3dlYXBwZGV2LmNvbSlcclxuICogICAgICAgICAgICAgICDlnoLnm7Tlvq7kv6HlsI/nqIvluo/lvIDlj5HkuqTmtYHnpL7ljLpcclxuICpcclxuICogZ2l0aHVi5Zyw5Z2AOiBodHRwczovL2dpdGh1Yi5jb20vaWNpbmR5L3d4UGFyc2VcclxuICpcclxuICogZm9yOiDlvq7kv6HlsI/nqIvluo/lr4zmlofmnKzop6PmnpBcclxuICogZGV0YWlsIDogaHR0cDovL3dlYXBwZGV2LmNvbS90L3d4cGFyc2UtYWxwaGEwLTEtaHRtbC1tYXJrZG93bi8xODRcclxuICovXHJcblxyXG5mdW5jdGlvbiBnZXREZWZhdWx0T3B0cyhzaW1wbGUpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgb21pdEV4dHJhV0xJbkNvZGVCbG9ja3M6IHtcclxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcclxuICAgICAgICAgICAgZGVzY3JpYmU6ICdPbWl0IHRoZSBkZWZhdWx0IGV4dHJhIHdoaXRlbGluZSBhZGRlZCB0byBjb2RlIGJsb2NrcycsXHJcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbm9IZWFkZXJJZDoge1xyXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxyXG4gICAgICAgICAgICBkZXNjcmliZTogJ1R1cm4gb24vb2ZmIGdlbmVyYXRlZCBoZWFkZXIgaWQnLFxyXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHByZWZpeEhlYWRlcklkOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGRlc2NyaWJlOiAnU3BlY2lmeSBhIHByZWZpeCB0byBnZW5lcmF0ZWQgaGVhZGVyIGlkcycsXHJcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXHJcbiAgICAgICAgfSxcclxuICAgICAgICBoZWFkZXJMZXZlbFN0YXJ0OiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGRlc2NyaWJlOiAnVGhlIGhlYWRlciBibG9ja3MgbGV2ZWwgc3RhcnQnLFxyXG4gICAgICAgICAgICB0eXBlOiAnaW50ZWdlcidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBhcnNlSW1nRGltZW5zaW9uczoge1xyXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxyXG4gICAgICAgICAgICBkZXNjcmliZTogJ1R1cm4gb24vb2ZmIGltYWdlIGRpbWVuc2lvbiBwYXJzaW5nJyxcclxuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzaW1wbGlmaWVkQXV0b0xpbms6IHtcclxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcclxuICAgICAgICAgICAgZGVzY3JpYmU6ICdUdXJuIG9uL29mZiBHRk0gYXV0b2xpbmsgc3R5bGUnLFxyXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxpdGVyYWxNaWRXb3JkVW5kZXJzY29yZXM6IHtcclxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcclxuICAgICAgICAgICAgZGVzY3JpYmU6ICdQYXJzZSBtaWR3b3JkIHVuZGVyc2NvcmVzIGFzIGxpdGVyYWwgdW5kZXJzY29yZXMnLFxyXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHN0cmlrZXRocm91Z2g6IHtcclxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcclxuICAgICAgICAgICAgZGVzY3JpYmU6ICdUdXJuIG9uL29mZiBzdHJpa2V0aHJvdWdoIHN1cHBvcnQnLFxyXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRhYmxlczoge1xyXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxyXG4gICAgICAgICAgICBkZXNjcmliZTogJ1R1cm4gb24vb2ZmIHRhYmxlcyBzdXBwb3J0JyxcclxuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0YWJsZXNIZWFkZXJJZDoge1xyXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxyXG4gICAgICAgICAgICBkZXNjcmliZTogJ0FkZCBhbiBpZCB0byB0YWJsZSBoZWFkZXJzJyxcclxuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBnaENvZGVCbG9ja3M6IHtcclxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICBkZXNjcmliZTogJ1R1cm4gb24vb2ZmIEdGTSBmZW5jZWQgY29kZSBibG9ja3Mgc3VwcG9ydCcsXHJcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGFza2xpc3RzOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGRlc2NyaWJlOiAnVHVybiBvbi9vZmYgR0ZNIHRhc2tsaXN0IHN1cHBvcnQnLFxyXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNtb290aExpdmVQcmV2aWV3OiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGRlc2NyaWJlOiAnUHJldmVudHMgd2VpcmQgZWZmZWN0cyBpbiBsaXZlIHByZXZpZXdzIGR1ZSB0byBpbmNvbXBsZXRlIGlucHV0JyxcclxuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzbWFydEluZGVudGF0aW9uRml4OiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVHJpZXMgdG8gc21hcnRseSBmaXggaWRlbnRhdGlvbiBpbiBlczYgc3RyaW5ncycsXHJcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBpZiAoc2ltcGxlID09PSBmYWxzZSkge1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRlZmF1bHRPcHRpb25zKSk7XHJcbiAgICB9XHJcbiAgICB2YXIgcmV0ID0ge307XHJcbiAgICBmb3IgKHZhciBvcHQgaW4gZGVmYXVsdE9wdGlvbnMpIHtcclxuICAgICAgICBpZiAoZGVmYXVsdE9wdGlvbnMuaGFzT3duUHJvcGVydHkob3B0KSkge1xyXG4gICAgICAgICAgICByZXRbb3B0XSA9IGRlZmF1bHRPcHRpb25zW29wdF0uZGVmYXVsdFZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVkIGJ5IFRpdmllIG9uIDA2LTAxLTIwMTUuXHJcbiAqL1xyXG5cclxuLy8gUHJpdmF0ZSBwcm9wZXJ0aWVzXHJcbnZhciBzaG93ZG93biA9IHt9LFxyXG4gICAgcGFyc2VycyA9IHt9LFxyXG4gICAgZXh0ZW5zaW9ucyA9IHt9LFxyXG4gICAgZ2xvYmFsT3B0aW9ucyA9IGdldERlZmF1bHRPcHRzKHRydWUpLFxyXG4gICAgZmxhdm9yID0ge1xyXG4gICAgICAgIGdpdGh1Yjoge1xyXG4gICAgICAgICAgICBvbWl0RXh0cmFXTEluQ29kZUJsb2NrczogdHJ1ZSxcclxuICAgICAgICAgICAgcHJlZml4SGVhZGVySWQ6ICd1c2VyLWNvbnRlbnQtJyxcclxuICAgICAgICAgICAgc2ltcGxpZmllZEF1dG9MaW5rOiB0cnVlLFxyXG4gICAgICAgICAgICBsaXRlcmFsTWlkV29yZFVuZGVyc2NvcmVzOiB0cnVlLFxyXG4gICAgICAgICAgICBzdHJpa2V0aHJvdWdoOiB0cnVlLFxyXG4gICAgICAgICAgICB0YWJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgIHRhYmxlc0hlYWRlcklkOiB0cnVlLFxyXG4gICAgICAgICAgICBnaENvZGVCbG9ja3M6IHRydWUsXHJcbiAgICAgICAgICAgIHRhc2tsaXN0czogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdmFuaWxsYTogZ2V0RGVmYXVsdE9wdHModHJ1ZSlcclxuICAgIH07XHJcblxyXG4vKipcclxuICogaGVscGVyIG5hbWVzcGFjZVxyXG4gKiBAdHlwZSB7e319XHJcbiAqL1xyXG5zaG93ZG93bi5oZWxwZXIgPSB7fTtcclxuXHJcbi8qKlxyXG4gKiBUT0RPIExFR0FDWSBTVVBQT1JUIENPREVcclxuICogQHR5cGUge3t9fVxyXG4gKi9cclxuc2hvd2Rvd24uZXh0ZW5zaW9ucyA9IHt9O1xyXG5cclxuLyoqXHJcbiAqIFNldCBhIGdsb2JhbCBvcHRpb25cclxuICogQHN0YXRpY1xyXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5XHJcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcclxuICogQHJldHVybnMge3Nob3dkb3dufVxyXG4gKi9cclxuc2hvd2Rvd24uc2V0T3B0aW9uID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGdsb2JhbE9wdGlvbnNba2V5XSA9IHZhbHVlO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IGEgZ2xvYmFsIG9wdGlvblxyXG4gKiBAc3RhdGljXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcclxuICogQHJldHVybnMgeyp9XHJcbiAqL1xyXG5zaG93ZG93bi5nZXRPcHRpb24gPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICByZXR1cm4gZ2xvYmFsT3B0aW9uc1trZXldO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCB0aGUgZ2xvYmFsIG9wdGlvbnNcclxuICogQHN0YXRpY1xyXG4gKiBAcmV0dXJucyB7e319XHJcbiAqL1xyXG5zaG93ZG93bi5nZXRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgcmV0dXJuIGdsb2JhbE9wdGlvbnM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVzZXQgZ2xvYmFsIG9wdGlvbnMgdG8gdGhlIGRlZmF1bHQgdmFsdWVzXHJcbiAqIEBzdGF0aWNcclxuICovXHJcbnNob3dkb3duLnJlc2V0T3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGdsb2JhbE9wdGlvbnMgPSBnZXREZWZhdWx0T3B0cyh0cnVlKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgdGhlIGZsYXZvciBzaG93ZG93biBzaG91bGQgdXNlIGFzIGRlZmF1bHRcclxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcclxuICovXHJcbnNob3dkb3duLnNldEZsYXZvciA9IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBpZiAoZmxhdm9yLmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcbiAgICAgICAgdmFyIHByZXNldCA9IGZsYXZvcltuYW1lXTtcclxuICAgICAgICBmb3IgKHZhciBvcHRpb24gaW4gcHJlc2V0KSB7XHJcbiAgICAgICAgICAgIGlmIChwcmVzZXQuaGFzT3duUHJvcGVydHkob3B0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgZ2xvYmFsT3B0aW9uc1tvcHRpb25dID0gcHJlc2V0W29wdGlvbl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IHRoZSBkZWZhdWx0IG9wdGlvbnNcclxuICogQHN0YXRpY1xyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtzaW1wbGU9dHJ1ZV1cclxuICogQHJldHVybnMge3t9fVxyXG4gKi9cclxuc2hvd2Rvd24uZ2V0RGVmYXVsdE9wdGlvbnMgPSBmdW5jdGlvbiAoc2ltcGxlKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICByZXR1cm4gZ2V0RGVmYXVsdE9wdHMoc2ltcGxlKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgb3Igc2V0IGEgc3ViUGFyc2VyXHJcbiAqXHJcbiAqIHN1YlBhcnNlcihuYW1lKSAgICAgICAtIEdldCBhIHJlZ2lzdGVyZWQgc3ViUGFyc2VyXHJcbiAqIHN1YlBhcnNlcihuYW1lLCBmdW5jKSAtIFJlZ2lzdGVyIGEgc3ViUGFyc2VyXHJcbiAqIEBzdGF0aWNcclxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2Z1bmNdXHJcbiAqIEByZXR1cm5zIHsqfVxyXG4gKi9cclxuc2hvd2Rvd24uc3ViUGFyc2VyID0gZnVuY3Rpb24gKG5hbWUsIGZ1bmMpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGlmIChzaG93ZG93bi5oZWxwZXIuaXNTdHJpbmcobmFtZSkpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGZ1bmMgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHBhcnNlcnNbbmFtZV0gPSBmdW5jO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChwYXJzZXJzLmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2Vyc1tuYW1lXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKCdTdWJQYXJzZXIgbmFtZWQgJyArIG5hbWUgKyAnIG5vdCByZWdpc3RlcmVkIScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldHMgb3IgcmVnaXN0ZXJzIGFuIGV4dGVuc2lvblxyXG4gKiBAc3RhdGljXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXHJcbiAqIEBwYXJhbSB7b2JqZWN0fGZ1bmN0aW9uPX0gZXh0XHJcbiAqIEByZXR1cm5zIHsqfVxyXG4gKi9cclxuc2hvd2Rvd24uZXh0ZW5zaW9uID0gZnVuY3Rpb24gKG5hbWUsIGV4dCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGlmICghc2hvd2Rvd24uaGVscGVyLmlzU3RyaW5nKG5hbWUpKSB7XHJcbiAgICAgICAgdGhyb3cgRXJyb3IoJ0V4dGVuc2lvbiBcXCduYW1lXFwnIG11c3QgYmUgYSBzdHJpbmcnKTtcclxuICAgIH1cclxuXHJcbiAgICBuYW1lID0gc2hvd2Rvd24uaGVscGVyLnN0ZEV4dE5hbWUobmFtZSk7XHJcblxyXG4gICAgLy8gR2V0dGVyXHJcbiAgICBpZiAoc2hvd2Rvd24uaGVscGVyLmlzVW5kZWZpbmVkKGV4dCkpIHtcclxuICAgICAgICBpZiAoIWV4dGVuc2lvbnMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ0V4dGVuc2lvbiBuYW1lZCAnICsgbmFtZSArICcgaXMgbm90IHJlZ2lzdGVyZWQhJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBleHRlbnNpb25zW25hbWVdO1xyXG5cclxuICAgIC8vIFNldHRlclxyXG4gICAgfSBlbHNlIHtcclxuICAgIC8vIEV4cGFuZCBleHRlbnNpb24gaWYgaXQncyB3cmFwcGVkIGluIGEgZnVuY3Rpb25cclxuICAgICAgICBpZiAodHlwZW9mIGV4dCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBleHQgPSBleHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEVuc3VyZSBleHRlbnNpb24gaXMgYW4gYXJyYXlcclxuICAgICAgICBpZiAoIXNob3dkb3duLmhlbHBlci5pc0FycmF5KGV4dCkpIHtcclxuICAgICAgICAgICAgZXh0ID0gW2V4dF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdmFsaWRFeHRlbnNpb24gPSB2YWxpZGF0ZShleHQsIG5hbWUpO1xyXG5cclxuICAgICAgICBpZiAodmFsaWRFeHRlbnNpb24udmFsaWQpIHtcclxuICAgICAgICAgICAgZXh0ZW5zaW9uc1tuYW1lXSA9IGV4dDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcih2YWxpZEV4dGVuc2lvbi5lcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldHMgYWxsIGV4dGVuc2lvbnMgcmVnaXN0ZXJlZFxyXG4gKiBAcmV0dXJucyB7e319XHJcbiAqL1xyXG5zaG93ZG93bi5nZXRBbGxFeHRlbnNpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgcmV0dXJuIGV4dGVuc2lvbnM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIGFuIGV4dGVuc2lvblxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxyXG4gKi9cclxuc2hvd2Rvd24ucmVtb3ZlRXh0ZW5zaW9uID0gZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGRlbGV0ZSBleHRlbnNpb25zW25hbWVdO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZXMgYWxsIGV4dGVuc2lvbnNcclxuICovXHJcbnNob3dkb3duLnJlc2V0RXh0ZW5zaW9ucyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGV4dGVuc2lvbnMgPSB7fTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBWYWxpZGF0ZSBleHRlbnNpb25cclxuICogQHBhcmFtIHthcnJheX0gZXh0ZW5zaW9uXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXHJcbiAqIEByZXR1cm5zIHt7dmFsaWQ6IGJvb2xlYW4sIGVycm9yOiBzdHJpbmd9fVxyXG4gKi9cclxuZnVuY3Rpb24gdmFsaWRhdGUoZXh0ZW5zaW9uLCBuYW1lKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIGVyck1zZyA9IChuYW1lKSA/ICdFcnJvciBpbiAnICsgbmFtZSArICcgZXh0ZW5zaW9uLT4nIDogJ0Vycm9yIGluIHVubmFtZWQgZXh0ZW5zaW9uJyxcclxuICAgICAgICByZXQgPSB7XHJcbiAgICAgICAgICAgIHZhbGlkOiB0cnVlLFxyXG4gICAgICAgICAgICBlcnJvcjogJydcclxuICAgICAgICB9O1xyXG5cclxuICAgIGlmICghc2hvd2Rvd24uaGVscGVyLmlzQXJyYXkoZXh0ZW5zaW9uKSkge1xyXG4gICAgICAgIGV4dGVuc2lvbiA9IFtleHRlbnNpb25dO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXh0ZW5zaW9uLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgdmFyIGJhc2VNc2cgPSBlcnJNc2cgKyAnIHN1Yi1leHRlbnNpb24gJyArIGkgKyAnOiAnLFxyXG4gICAgICAgICAgICBleHQgPSBleHRlbnNpb25baV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiBleHQgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHJldC52YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXQuZXJyb3IgPSBiYXNlTXNnICsgJ211c3QgYmUgYW4gb2JqZWN0LCBidXQgJyArIHR5cGVvZiBleHQgKyAnIGdpdmVuJztcclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghc2hvd2Rvd24uaGVscGVyLmlzU3RyaW5nKGV4dC50eXBlKSkge1xyXG4gICAgICAgICAgICByZXQudmFsaWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgcmV0LmVycm9yID0gYmFzZU1zZyArICdwcm9wZXJ0eSBcInR5cGVcIiBtdXN0IGJlIGEgc3RyaW5nLCBidXQgJyArIHR5cGVvZiBleHQudHlwZSArICcgZ2l2ZW4nO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHR5cGUgPSBleHQudHlwZSA9IGV4dC50eXBlLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgICAgIC8vIG5vcm1hbGl6ZSBleHRlbnNpb24gdHlwZVxyXG4gICAgICAgIGlmICh0eXBlID09PSAnbGFuZ3VhZ2UnKSB7XHJcbiAgICAgICAgICAgIHR5cGUgPSBleHQudHlwZSA9ICdsYW5nJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlID09PSAnaHRtbCcpIHtcclxuICAgICAgICAgICAgdHlwZSA9IGV4dC50eXBlID0gJ291dHB1dCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZSAhPT0gJ2xhbmcnICYmIHR5cGUgIT09ICdvdXRwdXQnICYmIHR5cGUgIT09ICdsaXN0ZW5lcicpIHtcclxuICAgICAgICAgICAgcmV0LnZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldC5lcnJvciA9IGJhc2VNc2cgKyAndHlwZSAnICsgdHlwZSArICcgaXMgbm90IHJlY29nbml6ZWQuIFZhbGlkIHZhbHVlczogXCJsYW5nL2xhbmd1YWdlXCIsIFwib3V0cHV0L2h0bWxcIiBvciBcImxpc3RlbmVyXCInO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHR5cGUgPT09ICdsaXN0ZW5lcicpIHtcclxuICAgICAgICAgICAgaWYgKHNob3dkb3duLmhlbHBlci5pc1VuZGVmaW5lZChleHQubGlzdGVuZXJzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0LnZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICByZXQuZXJyb3IgPSBiYXNlTXNnICsgJy4gRXh0ZW5zaW9ucyBvZiB0eXBlIFwibGlzdGVuZXJcIiBtdXN0IGhhdmUgYSBwcm9wZXJ0eSBjYWxsZWQgXCJsaXN0ZW5lcnNcIic7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHNob3dkb3duLmhlbHBlci5pc1VuZGVmaW5lZChleHQuZmlsdGVyKSAmJiBzaG93ZG93bi5oZWxwZXIuaXNVbmRlZmluZWQoZXh0LnJlZ2V4KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0LnZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICByZXQuZXJyb3IgPSBiYXNlTXNnICsgdHlwZSArICcgZXh0ZW5zaW9ucyBtdXN0IGRlZmluZSBlaXRoZXIgYSBcInJlZ2V4XCIgcHJvcGVydHkgb3IgYSBcImZpbHRlclwiIG1ldGhvZCc7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXh0Lmxpc3RlbmVycykge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGV4dC5saXN0ZW5lcnMgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICByZXQudmFsaWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHJldC5lcnJvciA9IGJhc2VNc2cgKyAnXCJsaXN0ZW5lcnNcIiBwcm9wZXJ0eSBtdXN0IGJlIGFuIG9iamVjdCBidXQgJyArIHR5cGVvZiBleHQubGlzdGVuZXJzICsgJyBnaXZlbic7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGxuIGluIGV4dC5saXN0ZW5lcnMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChleHQubGlzdGVuZXJzLmhhc093blByb3BlcnR5KGxuKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZXh0Lmxpc3RlbmVyc1tsbl0gIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0LnZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldC5lcnJvciA9IGJhc2VNc2cgKyAnXCJsaXN0ZW5lcnNcIiBwcm9wZXJ0eSBtdXN0IGJlIGFuIGhhc2ggb2YgW2V2ZW50IG5hbWVdOiBbY2FsbGJhY2tdLiBsaXN0ZW5lcnMuJyArIGxuICtcclxuICAgICAgICAgICAgICAnIG11c3QgYmUgYSBmdW5jdGlvbiBidXQgJyArIHR5cGVvZiBleHQubGlzdGVuZXJzW2xuXSArICcgZ2l2ZW4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGV4dC5maWx0ZXIpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBleHQuZmlsdGVyICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICByZXQudmFsaWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHJldC5lcnJvciA9IGJhc2VNc2cgKyAnXCJmaWx0ZXJcIiBtdXN0IGJlIGEgZnVuY3Rpb24sIGJ1dCAnICsgdHlwZW9mIGV4dC5maWx0ZXIgKyAnIGdpdmVuJztcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGV4dC5yZWdleCkge1xyXG4gICAgICAgICAgICBpZiAoc2hvd2Rvd24uaGVscGVyLmlzU3RyaW5nKGV4dC5yZWdleCkpIHtcclxuICAgICAgICAgICAgICAgIGV4dC5yZWdleCA9IG5ldyBSZWdFeHAoZXh0LnJlZ2V4LCAnZycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghKGV4dC5yZWdleCBpbnN0YW5jZW9mIFJlZ0V4cCkpIHtcclxuICAgICAgICAgICAgICAgIHJldC52YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgcmV0LmVycm9yID0gYmFzZU1zZyArICdcInJlZ2V4XCIgcHJvcGVydHkgbXVzdCBlaXRoZXIgYmUgYSBzdHJpbmcgb3IgYSBSZWdFeHAgb2JqZWN0LCBidXQgJyArIHR5cGVvZiBleHQucmVnZXggKyAnIGdpdmVuJztcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNob3dkb3duLmhlbHBlci5pc1VuZGVmaW5lZChleHQucmVwbGFjZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldC52YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgcmV0LmVycm9yID0gYmFzZU1zZyArICdcInJlZ2V4XCIgZXh0ZW5zaW9ucyBtdXN0IGltcGxlbWVudCBhIHJlcGxhY2Ugc3RyaW5nIG9yIGZ1bmN0aW9uJztcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmV0O1xyXG59XHJcblxyXG4vKipcclxuICogVmFsaWRhdGUgZXh0ZW5zaW9uXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBleHRcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5zaG93ZG93bi52YWxpZGF0ZUV4dGVuc2lvbiA9IGZ1bmN0aW9uIChleHQpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgdmFsaWRhdGVFeHRlbnNpb24gPSB2YWxpZGF0ZShleHQsIG51bGwpO1xyXG4gICAgaWYgKCF2YWxpZGF0ZUV4dGVuc2lvbi52YWxpZCkge1xyXG4gICAgICAgIGNvbnNvbGUud2Fybih2YWxpZGF0ZUV4dGVuc2lvbi5lcnJvcik7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG4vKipcclxuICogc2hvd2Rvd25qcyBoZWxwZXIgZnVuY3Rpb25zXHJcbiAqL1xyXG5cclxuaWYgKCFzaG93ZG93bi5oYXNPd25Qcm9wZXJ0eSgnaGVscGVyJykpIHtcclxuICAgIHNob3dkb3duLmhlbHBlciA9IHt9O1xyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgdmFyIGlzIHN0cmluZ1xyXG4gKiBAc3RhdGljXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBhXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuc2hvd2Rvd24uaGVscGVyLmlzU3RyaW5nID0gZnVuY3Rpb24gaXNTdHJpbmcoYSkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgcmV0dXJuICh0eXBlb2YgYSA9PT0gJ3N0cmluZycgfHwgYSBpbnN0YW5jZW9mIFN0cmluZyk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgdmFyIGlzIGEgZnVuY3Rpb25cclxuICogQHN0YXRpY1xyXG4gKiBAcGFyYW0ge3N0cmluZ30gYVxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbnNob3dkb3duLmhlbHBlci5pc0Z1bmN0aW9uID0gZnVuY3Rpb24gaXNGdW5jdGlvbihhKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICB2YXIgZ2V0VHlwZSA9IHt9O1xyXG4gICAgcmV0dXJuIGEgJiYgZ2V0VHlwZS50b1N0cmluZy5jYWxsKGEpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEZvckVhY2ggaGVscGVyIGZ1bmN0aW9uXHJcbiAqIEBzdGF0aWNcclxuICogQHBhcmFtIHsqfSBvYmpcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcclxuICovXHJcbnNob3dkb3duLmhlbHBlci5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaChvYmosIGNhbGxiYWNrKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBpZiAodHlwZW9mIG9iai5mb3JFYWNoID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgb2JqLmZvckVhY2goY2FsbGJhY2spO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9iai5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhvYmpbaV0sIGksIG9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIGlzQXJyYXkgaGVscGVyIGZ1bmN0aW9uXHJcbiAqIEBzdGF0aWNcclxuICogQHBhcmFtIHsqfSBhXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuc2hvd2Rvd24uaGVscGVyLmlzQXJyYXkgPSBmdW5jdGlvbiBpc0FycmF5KGEpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIHJldHVybiBhLmNvbnN0cnVjdG9yID09PSBBcnJheTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiB2YWx1ZSBpcyB1bmRlZmluZWRcclxuICogQHN0YXRpY1xyXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cclxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYHVuZGVmaW5lZGAsIGVsc2UgYGZhbHNlYC5cclxuICovXHJcbnNob3dkb3duLmhlbHBlci5pc1VuZGVmaW5lZCA9IGZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbHVlKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTdGFuZGFyZGlkaXplIGV4dGVuc2lvbiBuYW1lXHJcbiAqIEBzdGF0aWNcclxuICogQHBhcmFtIHtzdHJpbmd9IHMgZXh0ZW5zaW9uIG5hbWVcclxuICogQHJldHVybnMge3N0cmluZ31cclxuICovXHJcbnNob3dkb3duLmhlbHBlci5zdGRFeHROYW1lID0gZnVuY3Rpb24gKHMpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIHJldHVybiBzLnJlcGxhY2UoL1tfLV18fFxccy9nLCAnJykudG9Mb3dlckNhc2UoKTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIGVzY2FwZUNoYXJhY3RlcnNDYWxsYmFjayh3aG9sZU1hdGNoLCBtMSkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgdmFyIGNoYXJDb2RlVG9Fc2NhcGUgPSBtMS5jaGFyQ29kZUF0KDApO1xyXG4gICAgcmV0dXJuICd+RScgKyBjaGFyQ29kZVRvRXNjYXBlICsgJ0UnO1xyXG59XHJcblxyXG4vKipcclxuICogQ2FsbGJhY2sgdXNlZCB0byBlc2NhcGUgY2hhcmFjdGVycyB3aGVuIHBhc3NpbmcgdGhyb3VnaCBTdHJpbmcucmVwbGFjZVxyXG4gKiBAc3RhdGljXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB3aG9sZU1hdGNoXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBtMVxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gKi9cclxuc2hvd2Rvd24uaGVscGVyLmVzY2FwZUNoYXJhY3RlcnNDYWxsYmFjayA9IGVzY2FwZUNoYXJhY3RlcnNDYWxsYmFjaztcclxuXHJcbi8qKlxyXG4gKiBFc2NhcGUgY2hhcmFjdGVycyBpbiBhIHN0cmluZ1xyXG4gKiBAc3RhdGljXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjaGFyc1RvRXNjYXBlXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWZ0ZXJCYWNrc2xhc2hcclxuICogQHJldHVybnMge1hNTHxzdHJpbmd8dm9pZHwqfVxyXG4gKi9cclxuc2hvd2Rvd24uaGVscGVyLmVzY2FwZUNoYXJhY3RlcnMgPSBmdW5jdGlvbiBlc2NhcGVDaGFyYWN0ZXJzKHRleHQsIGNoYXJzVG9Fc2NhcGUsIGFmdGVyQmFja3NsYXNoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICAvLyBGaXJzdCB3ZSBoYXZlIHRvIGVzY2FwZSB0aGUgZXNjYXBlIGNoYXJhY3RlcnMgc28gdGhhdFxyXG4gICAgLy8gd2UgY2FuIGJ1aWxkIGEgY2hhcmFjdGVyIGNsYXNzIG91dCBvZiB0aGVtXHJcbiAgICB2YXIgcmVnZXhTdHJpbmcgPSAnKFsnICsgY2hhcnNUb0VzY2FwZS5yZXBsYWNlKC8oW1xcW1xcXVxcXFxdKS9nLCAnXFxcXCQxJykgKyAnXSknO1xyXG5cclxuICAgIGlmIChhZnRlckJhY2tzbGFzaCkge1xyXG4gICAgICAgIHJlZ2V4U3RyaW5nID0gJ1xcXFxcXFxcJyArIHJlZ2V4U3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAocmVnZXhTdHJpbmcsICdnJyk7XHJcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKHJlZ2V4LCBlc2NhcGVDaGFyYWN0ZXJzQ2FsbGJhY2spO1xyXG5cclxuICAgIHJldHVybiB0ZXh0O1xyXG59O1xyXG5cclxudmFyIHJneEZpbmRNYXRjaFBvcyA9IGZ1bmN0aW9uIChzdHIsIGxlZnQsIHJpZ2h0LCBmbGFncykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgdmFyIGYgPSBmbGFncyB8fCAnJyxcclxuICAgICAgICBnID0gZi5pbmRleE9mKCdnJykgPiAtMSxcclxuICAgICAgICB4ID0gbmV3IFJlZ0V4cChsZWZ0ICsgJ3wnICsgcmlnaHQsICdnJyArIGYucmVwbGFjZSgvZy9nLCAnJykpLFxyXG4gICAgICAgIGwgPSBuZXcgUmVnRXhwKGxlZnQsIGYucmVwbGFjZSgvZy9nLCAnJykpLFxyXG4gICAgICAgIHBvcyA9IFtdLFxyXG4gICAgICAgIHQsIHMsIG0sIHN0YXJ0LCBlbmQ7XHJcblxyXG4gICAgZG8ge1xyXG4gICAgICAgIHQgPSAwO1xyXG4gICAgICAgIHdoaWxlICgobSA9IHguZXhlYyhzdHIpKSkge1xyXG4gICAgICAgICAgICBpZiAobC50ZXN0KG1bMF0pKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoISh0KyspKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcyA9IHgubGFzdEluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gcyAtIG1bMF0ubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHQpIHtcclxuICAgICAgICAgICAgICAgIGlmICghLS10KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW5kID0gbS5pbmRleCArIG1bMF0ubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvYmogPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IHtzdGFydDogc3RhcnQsIGVuZDogc30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoOiB7c3RhcnQ6IHMsIGVuZDogbS5pbmRleH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiB7c3RhcnQ6IG0uaW5kZXgsIGVuZDogZW5kfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2hvbGVNYXRjaDoge3N0YXJ0OiBzdGFydCwgZW5kOiBlbmR9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBwb3MucHVzaChvYmopO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcG9zO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gd2hpbGUgKHQgJiYgKHgubGFzdEluZGV4ID0gcykpO1xyXG5cclxuICAgIHJldHVybiBwb3M7XHJcbn07XHJcblxyXG4vKipcclxuICogbWF0Y2hSZWN1cnNpdmVSZWdFeHBcclxuICpcclxuICogKGMpIDIwMDcgU3RldmVuIExldml0aGFuIDxzdGV2ZW5sZXZpdGhhbi5jb20+XHJcbiAqIE1JVCBMaWNlbnNlXHJcbiAqXHJcbiAqIEFjY2VwdHMgYSBzdHJpbmcgdG8gc2VhcmNoLCBhIGxlZnQgYW5kIHJpZ2h0IGZvcm1hdCBkZWxpbWl0ZXJcclxuICogYXMgcmVnZXggcGF0dGVybnMsIGFuZCBvcHRpb25hbCByZWdleCBmbGFncy4gUmV0dXJucyBhbiBhcnJheVxyXG4gKiBvZiBtYXRjaGVzLCBhbGxvd2luZyBuZXN0ZWQgaW5zdGFuY2VzIG9mIGxlZnQvcmlnaHQgZGVsaW1pdGVycy5cclxuICogVXNlIHRoZSBcImdcIiBmbGFnIHRvIHJldHVybiBhbGwgbWF0Y2hlcywgb3RoZXJ3aXNlIG9ubHkgdGhlXHJcbiAqIGZpcnN0IGlzIHJldHVybmVkLiBCZSBjYXJlZnVsIHRvIGVuc3VyZSB0aGF0IHRoZSBsZWZ0IGFuZFxyXG4gKiByaWdodCBmb3JtYXQgZGVsaW1pdGVycyBwcm9kdWNlIG11dHVhbGx5IGV4Y2x1c2l2ZSBtYXRjaGVzLlxyXG4gKiBCYWNrcmVmZXJlbmNlcyBhcmUgbm90IHN1cHBvcnRlZCB3aXRoaW4gdGhlIHJpZ2h0IGRlbGltaXRlclxyXG4gKiBkdWUgdG8gaG93IGl0IGlzIGludGVybmFsbHkgY29tYmluZWQgd2l0aCB0aGUgbGVmdCBkZWxpbWl0ZXIuXHJcbiAqIFdoZW4gbWF0Y2hpbmcgc3RyaW5ncyB3aG9zZSBmb3JtYXQgZGVsaW1pdGVycyBhcmUgdW5iYWxhbmNlZFxyXG4gKiB0byB0aGUgbGVmdCBvciByaWdodCwgdGhlIG91dHB1dCBpcyBpbnRlbnRpb25hbGx5IGFzIGFcclxuICogY29udmVudGlvbmFsIHJlZ2V4IGxpYnJhcnkgd2l0aCByZWN1cnNpb24gc3VwcG9ydCB3b3VsZFxyXG4gKiBwcm9kdWNlLCBlLmcuIFwiPDx4PlwiIGFuZCBcIjx4Pj5cIiBib3RoIHByb2R1Y2UgW1wieFwiXSB3aGVuIHVzaW5nXHJcbiAqIFwiPFwiIGFuZCBcIj5cIiBhcyB0aGUgZGVsaW1pdGVycyAoYm90aCBzdHJpbmdzIGNvbnRhaW4gYSBzaW5nbGUsXHJcbiAqIGJhbGFuY2VkIGluc3RhbmNlIG9mIFwiPHg+XCIpLlxyXG4gKlxyXG4gKiBleGFtcGxlczpcclxuICogbWF0Y2hSZWN1cnNpdmVSZWdFeHAoXCJ0ZXN0XCIsIFwiXFxcXChcIiwgXCJcXFxcKVwiKVxyXG4gKiByZXR1cm5zOiBbXVxyXG4gKiBtYXRjaFJlY3Vyc2l2ZVJlZ0V4cChcIjx0PDxlPj48cz4+dDw+XCIsIFwiPFwiLCBcIj5cIiwgXCJnXCIpXHJcbiAqIHJldHVybnM6IFtcInQ8PGU+PjxzPlwiLCBcIlwiXVxyXG4gKiBtYXRjaFJlY3Vyc2l2ZVJlZ0V4cChcIjxkaXYgaWQ9XFxcInhcXFwiPnRlc3Q8L2Rpdj5cIiwgXCI8ZGl2XFxcXGJbXj5dKj5cIiwgXCI8L2Rpdj5cIiwgXCJnaVwiKVxyXG4gKiByZXR1cm5zOiBbXCJ0ZXN0XCJdXHJcbiAqL1xyXG5zaG93ZG93bi5oZWxwZXIubWF0Y2hSZWN1cnNpdmVSZWdFeHAgPSBmdW5jdGlvbiAoc3RyLCBsZWZ0LCByaWdodCwgZmxhZ3MpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgbWF0Y2hQb3MgPSByZ3hGaW5kTWF0Y2hQb3Moc3RyLCBsZWZ0LCByaWdodCwgZmxhZ3MpLFxyXG4gICAgICAgIHJlc3VsdHMgPSBbXTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1hdGNoUG9zLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgcmVzdWx0cy5wdXNoKFtcclxuICAgICAgICAgICAgc3RyLnNsaWNlKG1hdGNoUG9zW2ldLndob2xlTWF0Y2guc3RhcnQsIG1hdGNoUG9zW2ldLndob2xlTWF0Y2guZW5kKSxcclxuICAgICAgICAgICAgc3RyLnNsaWNlKG1hdGNoUG9zW2ldLm1hdGNoLnN0YXJ0LCBtYXRjaFBvc1tpXS5tYXRjaC5lbmQpLFxyXG4gICAgICAgICAgICBzdHIuc2xpY2UobWF0Y2hQb3NbaV0ubGVmdC5zdGFydCwgbWF0Y2hQb3NbaV0ubGVmdC5lbmQpLFxyXG4gICAgICAgICAgICBzdHIuc2xpY2UobWF0Y2hQb3NbaV0ucmlnaHQuc3RhcnQsIG1hdGNoUG9zW2ldLnJpZ2h0LmVuZClcclxuICAgICAgICBdKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHRzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcclxuICogQHBhcmFtIHtzdHJpbmd8ZnVuY3Rpb259IHJlcGxhY2VtZW50XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBsZWZ0XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSByaWdodFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZmxhZ3NcclxuICogQHJldHVybnMge3N0cmluZ31cclxuICovXHJcbnNob3dkb3duLmhlbHBlci5yZXBsYWNlUmVjdXJzaXZlUmVnRXhwID0gZnVuY3Rpb24gKHN0ciwgcmVwbGFjZW1lbnQsIGxlZnQsIHJpZ2h0LCBmbGFncykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGlmICghc2hvd2Rvd24uaGVscGVyLmlzRnVuY3Rpb24ocmVwbGFjZW1lbnQpKSB7XHJcbiAgICAgICAgdmFyIHJlcFN0ciA9IHJlcGxhY2VtZW50O1xyXG4gICAgICAgIHJlcGxhY2VtZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVwU3RyO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG1hdGNoUG9zID0gcmd4RmluZE1hdGNoUG9zKHN0ciwgbGVmdCwgcmlnaHQsIGZsYWdzKSxcclxuICAgICAgICBmaW5hbFN0ciA9IHN0cixcclxuICAgICAgICBsbmcgPSBtYXRjaFBvcy5sZW5ndGg7XHJcblxyXG4gICAgaWYgKGxuZyA+IDApIHtcclxuICAgICAgICB2YXIgYml0cyA9IFtdO1xyXG4gICAgICAgIGlmIChtYXRjaFBvc1swXS53aG9sZU1hdGNoLnN0YXJ0ICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGJpdHMucHVzaChzdHIuc2xpY2UoMCwgbWF0Y2hQb3NbMF0ud2hvbGVNYXRjaC5zdGFydCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxuZzsgKytpKSB7XHJcbiAgICAgICAgICAgIGJpdHMucHVzaChcclxuICAgICAgICAgICAgICAgIHJlcGxhY2VtZW50KFxyXG4gICAgICAgICAgICAgICAgICAgIHN0ci5zbGljZShtYXRjaFBvc1tpXS53aG9sZU1hdGNoLnN0YXJ0LCBtYXRjaFBvc1tpXS53aG9sZU1hdGNoLmVuZCksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RyLnNsaWNlKG1hdGNoUG9zW2ldLm1hdGNoLnN0YXJ0LCBtYXRjaFBvc1tpXS5tYXRjaC5lbmQpLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0ci5zbGljZShtYXRjaFBvc1tpXS5sZWZ0LnN0YXJ0LCBtYXRjaFBvc1tpXS5sZWZ0LmVuZCksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RyLnNsaWNlKG1hdGNoUG9zW2ldLnJpZ2h0LnN0YXJ0LCBtYXRjaFBvc1tpXS5yaWdodC5lbmQpXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGlmIChpIDwgbG5nIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgYml0cy5wdXNoKHN0ci5zbGljZShtYXRjaFBvc1tpXS53aG9sZU1hdGNoLmVuZCwgbWF0Y2hQb3NbaSArIDFdLndob2xlTWF0Y2guc3RhcnQpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobWF0Y2hQb3NbbG5nIC0gMV0ud2hvbGVNYXRjaC5lbmQgPCBzdHIubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGJpdHMucHVzaChzdHIuc2xpY2UobWF0Y2hQb3NbbG5nIC0gMV0ud2hvbGVNYXRjaC5lbmQpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxTdHIgPSBiaXRzLmpvaW4oJycpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZpbmFsU3RyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFBPTFlGSUxMU1xyXG4gKi9cclxuaWYgKHNob3dkb3duLmhlbHBlci5pc1VuZGVmaW5lZChjb25zb2xlKSkge1xyXG4gICAgY29uc29sZSA9IHtcclxuICAgICAgICB3YXJuOiBmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICAgICAgICd1c2Ugc3RyaWN0JztcclxuICAgICAgICAgICAgYWxlcnQobXNnKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxvZzogZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgICAgICAndXNlIHN0cmljdCc7XHJcbiAgICAgICAgICAgIGFsZXJ0KG1zZyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgICAgICAndXNlIHN0cmljdCc7XHJcbiAgICAgICAgICAgIHRocm93IG1zZztcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG4vKipcclxuICogQ3JlYXRlZCBieSBFc3RldmFvIG9uIDMxLTA1LTIwMTUuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIFNob3dkb3duIENvbnZlcnRlciBjbGFzc1xyXG4gKiBAY2xhc3NcclxuICogQHBhcmFtIHtvYmplY3R9IFtjb252ZXJ0ZXJPcHRpb25zXVxyXG4gKiBAcmV0dXJucyB7Q29udmVydGVyfVxyXG4gKi9cclxuc2hvd2Rvd24uQ29udmVydGVyID0gZnVuY3Rpb24gKGNvbnZlcnRlck9wdGlvbnMpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXJcclxuICAgICAgICAvKipcclxuICAgICAgICogT3B0aW9ucyB1c2VkIGJ5IHRoaXMgY29udmVydGVyXHJcbiAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAqIEB0eXBlIHt7fX1cclxuICAgICAgICovXHJcbiAgICAgICAgb3B0aW9ucyA9IHt9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICogTGFuZ3VhZ2UgZXh0ZW5zaW9ucyB1c2VkIGJ5IHRoaXMgY29udmVydGVyXHJcbiAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAqIEB0eXBlIHtBcnJheX1cclxuICAgICAgICovXHJcbiAgICAgICAgbGFuZ0V4dGVuc2lvbnMgPSBbXSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAqIE91dHB1dCBtb2RpZmllcnMgZXh0ZW5zaW9ucyB1c2VkIGJ5IHRoaXMgY29udmVydGVyXHJcbiAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAqIEB0eXBlIHtBcnJheX1cclxuICAgICAgICovXHJcbiAgICAgICAgb3V0cHV0TW9kaWZpZXJzID0gW10sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgKiBFdmVudCBsaXN0ZW5lcnNcclxuICAgICAgICogQHByaXZhdGVcclxuICAgICAgICogQHR5cGUge3t9fVxyXG4gICAgICAgKi9cclxuICAgICAgICBsaXN0ZW5lcnMgPSB7fTtcclxuXHJcbiAgICBfY29uc3RydWN0b3IoKTtcclxuXHJcbiAgICAvKipcclxuICAgKiBDb252ZXJ0ZXIgY29uc3RydWN0b3JcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqL1xyXG4gICAgZnVuY3Rpb24gX2NvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGNvbnZlcnRlck9wdGlvbnMgPSBjb252ZXJ0ZXJPcHRpb25zIHx8IHt9O1xyXG5cclxuICAgICAgICBmb3IgKHZhciBnT3B0IGluIGdsb2JhbE9wdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKGdsb2JhbE9wdGlvbnMuaGFzT3duUHJvcGVydHkoZ09wdCkpIHtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnNbZ09wdF0gPSBnbG9iYWxPcHRpb25zW2dPcHRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBNZXJnZSBvcHRpb25zXHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb252ZXJ0ZXJPcHRpb25zID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBvcHQgaW4gY29udmVydGVyT3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnZlcnRlck9wdGlvbnMuaGFzT3duUHJvcGVydHkob3B0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbb3B0XSA9IGNvbnZlcnRlck9wdGlvbnNbb3B0XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdDb252ZXJ0ZXIgZXhwZWN0cyB0aGUgcGFzc2VkIHBhcmFtZXRlciB0byBiZSBhbiBvYmplY3QsIGJ1dCAnICsgdHlwZW9mIGNvbnZlcnRlck9wdGlvbnMgK1xyXG4gICAgICAnIHdhcyBwYXNzZWQgaW5zdGVhZC4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvcHRpb25zLmV4dGVuc2lvbnMpIHtcclxuICAgICAgICAgICAgc2hvd2Rvd24uaGVscGVyLmZvckVhY2gob3B0aW9ucy5leHRlbnNpb25zLCBfcGFyc2VFeHRlbnNpb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgKiBQYXJzZSBleHRlbnNpb25cclxuICAgKiBAcGFyYW0geyp9IGV4dFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbbmFtZT0nJ11cclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqL1xyXG4gICAgZnVuY3Rpb24gX3BhcnNlRXh0ZW5zaW9uKGV4dCwgbmFtZSkge1xyXG5cclxuICAgICAgICBuYW1lID0gbmFtZSB8fCBudWxsO1xyXG4gICAgICAgIC8vIElmIGl0J3MgYSBzdHJpbmcsIHRoZSBleHRlbnNpb24gd2FzIHByZXZpb3VzbHkgbG9hZGVkXHJcbiAgICAgICAgaWYgKHNob3dkb3duLmhlbHBlci5pc1N0cmluZyhleHQpKSB7XHJcbiAgICAgICAgICAgIGV4dCA9IHNob3dkb3duLmhlbHBlci5zdGRFeHROYW1lKGV4dCk7XHJcbiAgICAgICAgICAgIG5hbWUgPSBleHQ7XHJcblxyXG4gICAgICAgICAgICAvLyBMRUdBQ1lfU1VQUE9SVCBDT0RFXHJcbiAgICAgICAgICAgIGlmIChzaG93ZG93bi5leHRlbnNpb25zW2V4dF0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignREVQUkVDQVRJT04gV0FSTklORzogJyArIGV4dCArICcgaXMgYW4gb2xkIGV4dGVuc2lvbiB0aGF0IHVzZXMgYSBkZXByZWNhdGVkIGxvYWRpbmcgbWV0aG9kLicgK1xyXG4gICAgICAgICAgJ1BsZWFzZSBpbmZvcm0gdGhlIGRldmVsb3BlciB0aGF0IHRoZSBleHRlbnNpb24gc2hvdWxkIGJlIHVwZGF0ZWQhJyk7XHJcbiAgICAgICAgICAgICAgICBsZWdhY3lFeHRlbnNpb25Mb2FkaW5nKHNob3dkb3duLmV4dGVuc2lvbnNbZXh0XSwgZXh0KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIC8vIEVORCBMRUdBQ1kgU1VQUE9SVCBDT0RFXHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzaG93ZG93bi5oZWxwZXIuaXNVbmRlZmluZWQoZXh0ZW5zaW9uc1tleHRdKSkge1xyXG4gICAgICAgICAgICAgICAgZXh0ID0gZXh0ZW5zaW9uc1tleHRdO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKCdFeHRlbnNpb24gXCInICsgZXh0ICsgJ1wiIGNvdWxkIG5vdCBiZSBsb2FkZWQuIEl0IHdhcyBlaXRoZXIgbm90IGZvdW5kIG9yIGlzIG5vdCBhIHZhbGlkIGV4dGVuc2lvbi4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBleHQgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgZXh0ID0gZXh0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXNob3dkb3duLmhlbHBlci5pc0FycmF5KGV4dCkpIHtcclxuICAgICAgICAgICAgZXh0ID0gW2V4dF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdmFsaWRFeHQgPSB2YWxpZGF0ZShleHQsIG5hbWUpO1xyXG4gICAgICAgIGlmICghdmFsaWRFeHQudmFsaWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IodmFsaWRFeHQuZXJyb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBleHQubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChleHRbaV0udHlwZSkge1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnbGFuZyc6XHJcbiAgICAgICAgICAgICAgICBsYW5nRXh0ZW5zaW9ucy5wdXNoKGV4dFtpXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ291dHB1dCc6XHJcbiAgICAgICAgICAgICAgICBvdXRwdXRNb2RpZmllcnMucHVzaChleHRbaV0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGV4dFtpXS5oYXNPd25Qcm9wZXJ0eShsaXN0ZW5lcnMpKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBsbiBpbiBleHRbaV0ubGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4dFtpXS5saXN0ZW5lcnMuaGFzT3duUHJvcGVydHkobG4pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RlbihsbiwgZXh0W2ldLmxpc3RlbmVyc1tsbl0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogTEVHQUNZX1NVUFBPUlRcclxuICAgKiBAcGFyYW0geyp9IGV4dFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXHJcbiAgICovXHJcbiAgICBmdW5jdGlvbiBsZWdhY3lFeHRlbnNpb25Mb2FkaW5nKGV4dCwgbmFtZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgZXh0ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGV4dCA9IGV4dChuZXcgc2hvd2Rvd24uQ29udmVydGVyKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXNob3dkb3duLmhlbHBlci5pc0FycmF5KGV4dCkpIHtcclxuICAgICAgICAgICAgZXh0ID0gW2V4dF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB2YWxpZCA9IHZhbGlkYXRlKGV4dCwgbmFtZSk7XHJcblxyXG4gICAgICAgIGlmICghdmFsaWQudmFsaWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IodmFsaWQuZXJyb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBleHQubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChleHRbaV0udHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdsYW5nJzpcclxuICAgICAgICAgICAgICAgIGxhbmdFeHRlbnNpb25zLnB1c2goZXh0W2ldKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdvdXRwdXQnOlxyXG4gICAgICAgICAgICAgICAgb3V0cHV0TW9kaWZpZXJzLnB1c2goZXh0W2ldKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0Oi8vIHNob3VsZCBuZXZlciByZWFjaCBoZXJlXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcignRXh0ZW5zaW9uIGxvYWRlciBlcnJvcjogVHlwZSB1bnJlY29nbml6ZWQhISEnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgKiBMaXN0ZW4gdG8gYW4gZXZlbnRcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXHJcbiAgICovXHJcbiAgICBmdW5jdGlvbiBsaXN0ZW4obmFtZSwgY2FsbGJhY2spIHtcclxuICAgICAgICBpZiAoIXNob3dkb3duLmhlbHBlci5pc1N0cmluZyhuYW1lKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcignSW52YWxpZCBhcmd1bWVudCBpbiBjb252ZXJ0ZXIubGlzdGVuKCkgbWV0aG9kOiBuYW1lIG11c3QgYmUgYSBzdHJpbmcsIGJ1dCAnICsgdHlwZW9mIG5hbWUgKyAnIGdpdmVuJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdJbnZhbGlkIGFyZ3VtZW50IGluIGNvbnZlcnRlci5saXN0ZW4oKSBtZXRob2Q6IGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbiwgYnV0ICcgKyB0eXBlb2YgY2FsbGJhY2sgKyAnIGdpdmVuJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWxpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xyXG4gICAgICAgICAgICBsaXN0ZW5lcnNbbmFtZV0gPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGlzdGVuZXJzW25hbWVdLnB1c2goY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJUcmltSW5wdXRUZXh0KHRleHQpIHtcclxuICAgICAgICB2YXIgcnNwID0gdGV4dC5tYXRjaCgvXlxccyovKVswXS5sZW5ndGgsXHJcbiAgICAgICAgICAgIHJneCA9IG5ldyBSZWdFeHAoJ15cXFxcc3swLCcgKyByc3AgKyAnfScsICdnbScpO1xyXG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2Uocmd4LCAnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogRGlzcGF0Y2ggYW4gZXZlbnRcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldnROYW1lIEV2ZW50IG5hbWVcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUZXh0XHJcbiAgICogQHBhcmFtIHt7fX0gb3B0aW9ucyBDb252ZXJ0ZXIgT3B0aW9uc1xyXG4gICAqIEBwYXJhbSB7e319IGdsb2JhbHNcclxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICAqL1xyXG4gICAgdGhpcy5fZGlzcGF0Y2ggPSBmdW5jdGlvbiBkaXNwYXRjaCAoZXZ0TmFtZSwgdGV4dCwgb3B0aW9ucywgZ2xvYmFscykge1xyXG4gICAgICAgIGlmIChsaXN0ZW5lcnMuaGFzT3duUHJvcGVydHkoZXZ0TmFtZSkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgZWkgPSAwOyBlaSA8IGxpc3RlbmVyc1tldnROYW1lXS5sZW5ndGg7ICsrZWkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuVGV4dCA9IGxpc3RlbmVyc1tldnROYW1lXVtlaV0oZXZ0TmFtZSwgdGV4dCwgdGhpcywgb3B0aW9ucywgZ2xvYmFscyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoblRleHQgJiYgdHlwZW9mIG5UZXh0ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQgPSBuVGV4dDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICogTGlzdGVuIHRvIGFuIGV2ZW50XHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gICAqIEByZXR1cm5zIHtzaG93ZG93bi5Db252ZXJ0ZXJ9XHJcbiAgICovXHJcbiAgICB0aGlzLmxpc3RlbiA9IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaykge1xyXG4gICAgICAgIGxpc3RlbihuYW1lLCBjYWxsYmFjayk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAqIENvbnZlcnRzIGEgbWFya2Rvd24gc3RyaW5nIGludG8gSFRNTFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XHJcbiAgICogQHJldHVybnMgeyp9XHJcbiAgICovXHJcbiAgICB0aGlzLm1ha2VIdG1sID0gZnVuY3Rpb24gKHRleHQpIHtcclxuICAgIC8vIGNoZWNrIGlmIHRleHQgaXMgbm90IGZhbHN5XHJcbiAgICAgICAgaWYgKCF0ZXh0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGdsb2JhbHMgPSB7XHJcbiAgICAgICAgICAgIGdIdG1sQmxvY2tzOiBbXSxcclxuICAgICAgICAgICAgZ0h0bWxNZEJsb2NrczogW10sXHJcbiAgICAgICAgICAgIGdIdG1sU3BhbnM6IFtdLFxyXG4gICAgICAgICAgICBnVXJsczoge30sXHJcbiAgICAgICAgICAgIGdUaXRsZXM6IHt9LFxyXG4gICAgICAgICAgICBnRGltZW5zaW9uczoge30sXHJcbiAgICAgICAgICAgIGdMaXN0TGV2ZWw6IDAsXHJcbiAgICAgICAgICAgIGhhc2hMaW5rQ291bnRzOiB7fSxcclxuICAgICAgICAgICAgbGFuZ0V4dGVuc2lvbnM6IGxhbmdFeHRlbnNpb25zLFxyXG4gICAgICAgICAgICBvdXRwdXRNb2RpZmllcnM6IG91dHB1dE1vZGlmaWVycyxcclxuICAgICAgICAgICAgY29udmVydGVyOiB0aGlzLFxyXG4gICAgICAgICAgICBnaENvZGVCbG9ja3M6IFtdXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gYXR0YWNrbGFiOiBSZXBsYWNlIH4gd2l0aCB+VFxyXG4gICAgICAgIC8vIFRoaXMgbGV0cyB1cyB1c2UgdGlsZGUgYXMgYW4gZXNjYXBlIGNoYXIgdG8gYXZvaWQgbWQ1IGhhc2hlc1xyXG4gICAgICAgIC8vIFRoZSBjaG9pY2Ugb2YgY2hhcmFjdGVyIGlzIGFyYml0cmFyeTsgYW55dGhpbmcgdGhhdCBpc24ndFxyXG4gICAgICAgIC8vIG1hZ2ljIGluIE1hcmtkb3duIHdpbGwgd29yay5cclxuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9+L2csICd+VCcpO1xyXG5cclxuICAgICAgICAvLyBhdHRhY2tsYWI6IFJlcGxhY2UgJCB3aXRoIH5EXHJcbiAgICAgICAgLy8gUmVnRXhwIGludGVycHJldHMgJCBhcyBhIHNwZWNpYWwgY2hhcmFjdGVyXHJcbiAgICAgICAgLy8gd2hlbiBpdCdzIGluIGEgcmVwbGFjZW1lbnQgc3RyaW5nXHJcbiAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXFwkL2csICd+RCcpO1xyXG5cclxuICAgICAgICAvLyBTdGFuZGFyZGl6ZSBsaW5lIGVuZGluZ3NcclxuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cXHJcXG4vZywgJ1xcbicpOyAvLyBET1MgdG8gVW5peFxyXG4gICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoL1xcci9nLCAnXFxuJyk7IC8vIE1hYyB0byBVbml4XHJcblxyXG4gICAgICAgIGlmIChvcHRpb25zLnNtYXJ0SW5kZW50YXRpb25GaXgpIHtcclxuICAgICAgICAgICAgdGV4dCA9IHJUcmltSW5wdXRUZXh0KHRleHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTWFrZSBzdXJlIHRleHQgYmVnaW5zIGFuZCBlbmRzIHdpdGggYSBjb3VwbGUgb2YgbmV3bGluZXM6XHJcbiAgICAgICAgLy8gdGV4dCA9ICdcXG5cXG4nICsgdGV4dCArICdcXG5cXG4nO1xyXG4gICAgICAgIHRleHQgPSB0ZXh0O1xyXG4gICAgICAgIC8vIGRldGFiXHJcbiAgICAgICAgdGV4dCA9IHNob3dkb3duLnN1YlBhcnNlcignZGV0YWInKSh0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKTtcclxuXHJcbiAgICAgICAgLy8gc3RyaXBCbGFua0xpbmVzXHJcbiAgICAgICAgdGV4dCA9IHNob3dkb3duLnN1YlBhcnNlcignc3RyaXBCbGFua0xpbmVzJykodGV4dCwgb3B0aW9ucywgZ2xvYmFscyk7XHJcblxyXG4gICAgICAgIC8vIHJ1biBsYW5ndWFnZUV4dGVuc2lvbnNcclxuICAgICAgICBzaG93ZG93bi5oZWxwZXIuZm9yRWFjaChsYW5nRXh0ZW5zaW9ucywgZnVuY3Rpb24gKGV4dCkge1xyXG4gICAgICAgICAgICB0ZXh0ID0gc2hvd2Rvd24uc3ViUGFyc2VyKCdydW5FeHRlbnNpb24nKShleHQsIHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBydW4gdGhlIHN1YiBwYXJzZXJzXHJcbiAgICAgICAgdGV4dCA9IHNob3dkb3duLnN1YlBhcnNlcignaGFzaFByZUNvZGVUYWdzJykodGV4dCwgb3B0aW9ucywgZ2xvYmFscyk7XHJcbiAgICAgICAgdGV4dCA9IHNob3dkb3duLnN1YlBhcnNlcignZ2l0aHViQ29kZUJsb2NrcycpKHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG4gICAgICAgIHRleHQgPSBzaG93ZG93bi5zdWJQYXJzZXIoJ2hhc2hIVE1MQmxvY2tzJykodGV4dCwgb3B0aW9ucywgZ2xvYmFscyk7XHJcbiAgICAgICAgdGV4dCA9IHNob3dkb3duLnN1YlBhcnNlcignaGFzaEhUTUxTcGFucycpKHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG4gICAgICAgIHRleHQgPSBzaG93ZG93bi5zdWJQYXJzZXIoJ3N0cmlwTGlua0RlZmluaXRpb25zJykodGV4dCwgb3B0aW9ucywgZ2xvYmFscyk7XHJcbiAgICAgICAgdGV4dCA9IHNob3dkb3duLnN1YlBhcnNlcignYmxvY2tHYW11dCcpKHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG4gICAgICAgIHRleHQgPSBzaG93ZG93bi5zdWJQYXJzZXIoJ3VuaGFzaEhUTUxTcGFucycpKHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG4gICAgICAgIHRleHQgPSBzaG93ZG93bi5zdWJQYXJzZXIoJ3VuZXNjYXBlU3BlY2lhbENoYXJzJykodGV4dCwgb3B0aW9ucywgZ2xvYmFscyk7XHJcblxyXG4gICAgICAgIC8vIGF0dGFja2xhYjogUmVzdG9yZSBkb2xsYXIgc2lnbnNcclxuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9+RC9nLCAnJCQnKTtcclxuXHJcbiAgICAgICAgLy8gYXR0YWNrbGFiOiBSZXN0b3JlIHRpbGRlc1xyXG4gICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoL35UL2csICd+Jyk7XHJcblxyXG4gICAgICAgIC8vIFJ1biBvdXRwdXQgbW9kaWZpZXJzXHJcbiAgICAgICAgc2hvd2Rvd24uaGVscGVyLmZvckVhY2gob3V0cHV0TW9kaWZpZXJzLCBmdW5jdGlvbiAoZXh0KSB7XHJcbiAgICAgICAgICAgIHRleHQgPSBzaG93ZG93bi5zdWJQYXJzZXIoJ3J1bkV4dGVuc2lvbicpKGV4dCwgdGV4dCwgb3B0aW9ucywgZ2xvYmFscyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRleHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAqIFNldCBhbiBvcHRpb24gb2YgdGhpcyBDb252ZXJ0ZXIgaW5zdGFuY2VcclxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XHJcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxyXG4gICAqL1xyXG4gICAgdGhpcy5zZXRPcHRpb24gPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgIG9wdGlvbnNba2V5XSA9IHZhbHVlO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgKiBHZXQgdGhlIG9wdGlvbiBvZiB0aGlzIENvbnZlcnRlciBpbnN0YW5jZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcclxuICAgKiBAcmV0dXJucyB7Kn1cclxuICAgKi9cclxuICAgIHRoaXMuZ2V0T3B0aW9uID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIHJldHVybiBvcHRpb25zW2tleV07XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAqIEdldCB0aGUgb3B0aW9ucyBvZiB0aGlzIENvbnZlcnRlciBpbnN0YW5jZVxyXG4gICAqIEByZXR1cm5zIHt7fX1cclxuICAgKi9cclxuICAgIHRoaXMuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gb3B0aW9ucztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICogQWRkIGV4dGVuc2lvbiB0byBUSElTIGNvbnZlcnRlclxyXG4gICAqIEBwYXJhbSB7e319IGV4dGVuc2lvblxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbbmFtZT1udWxsXVxyXG4gICAqL1xyXG4gICAgdGhpcy5hZGRFeHRlbnNpb24gPSBmdW5jdGlvbiAoZXh0ZW5zaW9uLCBuYW1lKSB7XHJcbiAgICAgICAgbmFtZSA9IG5hbWUgfHwgbnVsbDtcclxuICAgICAgICBfcGFyc2VFeHRlbnNpb24oZXh0ZW5zaW9uLCBuYW1lKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICogVXNlIGEgZ2xvYmFsIHJlZ2lzdGVyZWQgZXh0ZW5zaW9uIHdpdGggVEhJUyBjb252ZXJ0ZXJcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXh0ZW5zaW9uTmFtZSBOYW1lIG9mIHRoZSBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgZXh0ZW5zaW9uXHJcbiAgICovXHJcbiAgICB0aGlzLnVzZUV4dGVuc2lvbiA9IGZ1bmN0aW9uIChleHRlbnNpb25OYW1lKSB7XHJcbiAgICAgICAgX3BhcnNlRXh0ZW5zaW9uKGV4dGVuc2lvbk5hbWUpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgKiBTZXQgdGhlIGZsYXZvciBUSElTIGNvbnZlcnRlciBzaG91bGQgdXNlXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcclxuICAgKi9cclxuICAgIHRoaXMuc2V0Rmxhdm9yID0gZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICBpZiAoZmxhdm9yLmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcbiAgICAgICAgICAgIHZhciBwcmVzZXQgPSBmbGF2b3JbbmFtZV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIG9wdGlvbiBpbiBwcmVzZXQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcmVzZXQuaGFzT3duUHJvcGVydHkob3B0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbb3B0aW9uXSA9IHByZXNldFtvcHRpb25dO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgKiBSZW1vdmUgYW4gZXh0ZW5zaW9uIGZyb20gVEhJUyBjb252ZXJ0ZXIuXHJcbiAgICogTm90ZTogVGhpcyBpcyBhIGNvc3RseSBvcGVyYXRpb24uIEl0J3MgYmV0dGVyIHRvIGluaXRpYWxpemUgYSBuZXcgY29udmVydGVyXHJcbiAgICogYW5kIHNwZWNpZnkgdGhlIGV4dGVuc2lvbnMgeW91IHdpc2ggdG8gdXNlXHJcbiAgICogQHBhcmFtIHtBcnJheX0gZXh0ZW5zaW9uXHJcbiAgICovXHJcbiAgICB0aGlzLnJlbW92ZUV4dGVuc2lvbiA9IGZ1bmN0aW9uIChleHRlbnNpb24pIHtcclxuICAgICAgICBpZiAoIXNob3dkb3duLmhlbHBlci5pc0FycmF5KGV4dGVuc2lvbikpIHtcclxuICAgICAgICAgICAgZXh0ZW5zaW9uID0gW2V4dGVuc2lvbl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGEgPSAwOyBhIDwgZXh0ZW5zaW9uLmxlbmd0aDsgKythKSB7XHJcbiAgICAgICAgICAgIHZhciBleHQgPSBleHRlbnNpb25bYV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFuZ0V4dGVuc2lvbnMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGlmIChsYW5nRXh0ZW5zaW9uc1tpXSA9PT0gZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFuZ0V4dGVuc2lvbnNbaV0uc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBvdXRwdXRNb2RpZmllcnMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvdXRwdXRNb2RpZmllcnNbaWldID09PSBleHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRwdXRNb2RpZmllcnNbaWldLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICogR2V0IGFsbCBleHRlbnNpb24gb2YgVEhJUyBjb252ZXJ0ZXJcclxuICAgKiBAcmV0dXJucyB7e2xhbmd1YWdlOiBBcnJheSwgb3V0cHV0OiBBcnJheX19XHJcbiAgICovXHJcbiAgICB0aGlzLmdldEFsbEV4dGVuc2lvbnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbGFuZ3VhZ2U6IGxhbmdFeHRlbnNpb25zLFxyXG4gICAgICAgICAgICBvdXRwdXQ6IG91dHB1dE1vZGlmaWVyc1xyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFR1cm4gTWFya2Rvd24gbGluayBzaG9ydGN1dHMgaW50byBYSFRNTCA8YT4gdGFncy5cclxuICovXHJcbnNob3dkb3duLnN1YlBhcnNlcignYW5jaG9ycycsIGZ1bmN0aW9uICh0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdGV4dCA9IGdsb2JhbHMuY29udmVydGVyLl9kaXNwYXRjaCgnYW5jaG9ycy5iZWZvcmUnLCB0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKTtcclxuXHJcbiAgICB2YXIgd3JpdGVBbmNob3JUYWcgPSBmdW5jdGlvbiAod2hvbGVNYXRjaCwgbTEsIG0yLCBtMywgbTQsIG01LCBtNiwgbTcpIHtcclxuICAgICAgICBpZiAoc2hvd2Rvd24uaGVscGVyLmlzVW5kZWZpbmVkKG03KSkge1xyXG4gICAgICAgICAgICBtNyA9ICcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aG9sZU1hdGNoID0gbTE7XHJcbiAgICAgICAgdmFyIGxpbmtUZXh0ID0gbTIsXHJcbiAgICAgICAgICAgIGxpbmtJZCA9IG0zLnRvTG93ZXJDYXNlKCksXHJcbiAgICAgICAgICAgIHVybCA9IG00LFxyXG4gICAgICAgICAgICB0aXRsZSA9IG03O1xyXG5cclxuICAgICAgICBpZiAoIXVybCkge1xyXG4gICAgICAgICAgICBpZiAoIWxpbmtJZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gbG93ZXItY2FzZSBhbmQgdHVybiBlbWJlZGRlZCBuZXdsaW5lcyBpbnRvIHNwYWNlc1xyXG4gICAgICAgICAgICAgICAgbGlua0lkID0gbGlua1RleHQudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8gP1xcbi9nLCAnICcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHVybCA9ICcjJyArIGxpbmtJZDtcclxuXHJcbiAgICAgICAgICAgIGlmICghc2hvd2Rvd24uaGVscGVyLmlzVW5kZWZpbmVkKGdsb2JhbHMuZ1VybHNbbGlua0lkXSkpIHtcclxuICAgICAgICAgICAgICAgIHVybCA9IGdsb2JhbHMuZ1VybHNbbGlua0lkXTtcclxuICAgICAgICAgICAgICAgIGlmICghc2hvd2Rvd24uaGVscGVyLmlzVW5kZWZpbmVkKGdsb2JhbHMuZ1RpdGxlc1tsaW5rSWRdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlID0gZ2xvYmFscy5nVGl0bGVzW2xpbmtJZF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAod2hvbGVNYXRjaC5zZWFyY2goL1xcKFxccypcXCkkL20pID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIGV4cGxpY2l0IGVtcHR5IHVybFxyXG4gICAgICAgICAgICAgICAgICAgIHVybCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2hvbGVNYXRjaDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXJsID0gc2hvd2Rvd24uaGVscGVyLmVzY2FwZUNoYXJhY3RlcnModXJsLCAnKl8nLCBmYWxzZSk7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9ICc8YSBocmVmPVwiJyArIHVybCArICdcIic7XHJcblxyXG4gICAgICAgIGlmICh0aXRsZSAhPT0gJycgJiYgdGl0bGUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGl0bGUgPSB0aXRsZS5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyk7XHJcbiAgICAgICAgICAgIHRpdGxlID0gc2hvd2Rvd24uaGVscGVyLmVzY2FwZUNoYXJhY3RlcnModGl0bGUsICcqXycsIGZhbHNlKTtcclxuICAgICAgICAgICAgcmVzdWx0ICs9ICcgdGl0bGU9XCInICsgdGl0bGUgKyAnXCInO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzdWx0ICs9ICc+JyArIGxpbmtUZXh0ICsgJzwvYT4nO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBGaXJzdCwgaGFuZGxlIHJlZmVyZW5jZS1zdHlsZSBsaW5rczogW2xpbmsgdGV4dF0gW2lkXVxyXG4gICAgLypcclxuICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXHJcbiAgIChcdFx0XHRcdFx0XHRcdC8vIHdyYXAgd2hvbGUgbWF0Y2ggaW4gJDFcclxuICAgXFxbXHJcbiAgIChcclxuICAgKD86XHJcbiAgIFxcW1teXFxdXSpcXF1cdFx0Ly8gYWxsb3cgYnJhY2tldHMgbmVzdGVkIG9uZSBsZXZlbFxyXG4gICB8XHJcbiAgIFteXFxbXVx0XHRcdC8vIG9yIGFueXRoaW5nIGVsc2VcclxuICAgKSpcclxuICAgKVxyXG4gICBcXF1cclxuXHJcbiAgIFsgXT9cdFx0XHRcdFx0Ly8gb25lIG9wdGlvbmFsIHNwYWNlXHJcbiAgICg/OlxcblsgXSopP1x0XHRcdFx0Ly8gb25lIG9wdGlvbmFsIG5ld2xpbmUgZm9sbG93ZWQgYnkgc3BhY2VzXHJcblxyXG4gICBcXFtcclxuICAgKC4qPylcdFx0XHRcdFx0Ly8gaWQgPSAkM1xyXG4gICBcXF1cclxuICAgKSgpKCkoKSgpXHRcdFx0XHRcdC8vIHBhZCByZW1haW5pbmcgYmFja3JlZmVyZW5jZXNcclxuICAgL2csX0RvQW5jaG9yc19jYWxsYmFjayk7XHJcbiAgICovXHJcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC8oXFxbKCg/OlxcW1teXFxdXSpdfFteXFxbXFxdXSkqKV1bIF0/KD86XFxuWyBdKik/XFxbKC4qPyldKSgpKCkoKSgpL2csIHdyaXRlQW5jaG9yVGFnKTtcclxuXHJcbiAgICAvL1xyXG4gICAgLy8gTmV4dCwgaW5saW5lLXN0eWxlIGxpbmtzOiBbbGluayB0ZXh0XSh1cmwgXCJvcHRpb25hbCB0aXRsZVwiKVxyXG4gICAgLy9cclxuXHJcbiAgICAvKlxyXG4gICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cclxuICAgKFx0XHRcdFx0XHRcdC8vIHdyYXAgd2hvbGUgbWF0Y2ggaW4gJDFcclxuICAgXFxbXHJcbiAgIChcclxuICAgKD86XHJcbiAgIFxcW1teXFxdXSpcXF1cdC8vIGFsbG93IGJyYWNrZXRzIG5lc3RlZCBvbmUgbGV2ZWxcclxuICAgfFxyXG4gICBbXlxcW1xcXV1cdFx0XHQvLyBvciBhbnl0aGluZyBlbHNlXHJcbiAgIClcclxuICAgKVxyXG4gICBcXF1cclxuICAgXFwoXHRcdFx0XHRcdFx0Ly8gbGl0ZXJhbCBwYXJlblxyXG4gICBbIFxcdF0qXHJcbiAgICgpXHRcdFx0XHRcdFx0Ly8gbm8gaWQsIHNvIGxlYXZlICQzIGVtcHR5XHJcbiAgIDw/KC4qPyk+P1x0XHRcdFx0Ly8gaHJlZiA9ICQ0XHJcbiAgIFsgXFx0XSpcclxuICAgKFx0XHRcdFx0XHRcdC8vICQ1XHJcbiAgIChbJ1wiXSlcdFx0XHRcdC8vIHF1b3RlIGNoYXIgPSAkNlxyXG4gICAoLio/KVx0XHRcdFx0Ly8gVGl0bGUgPSAkN1xyXG4gICBcXDZcdFx0XHRcdFx0Ly8gbWF0Y2hpbmcgcXVvdGVcclxuICAgWyBcXHRdKlx0XHRcdFx0Ly8gaWdub3JlIGFueSBzcGFjZXMvdGFicyBiZXR3ZWVuIGNsb3NpbmcgcXVvdGUgYW5kIClcclxuICAgKT9cdFx0XHRcdFx0XHQvLyB0aXRsZSBpcyBvcHRpb25hbFxyXG4gICBcXClcclxuICAgKVxyXG4gICAvZyx3cml0ZUFuY2hvclRhZyk7XHJcbiAgICovXHJcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC8oXFxbKCg/OlxcW1teXFxdXSpdfFteXFxbXFxdXSkqKV1cXChbIFxcdF0qKCk8PyguKj8oPzpcXCguKj9cXCkuKj8pPyk+P1sgXFx0XSooKFsnXCJdKSguKj8pXFw2WyBcXHRdKik/XFwpKS9nLFxyXG4gICAgICAgIHdyaXRlQW5jaG9yVGFnKTtcclxuXHJcbiAgICAvL1xyXG4gICAgLy8gTGFzdCwgaGFuZGxlIHJlZmVyZW5jZS1zdHlsZSBzaG9ydGN1dHM6IFtsaW5rIHRleHRdXHJcbiAgICAvLyBUaGVzZSBtdXN0IGNvbWUgbGFzdCBpbiBjYXNlIHlvdSd2ZSBhbHNvIGdvdCBbbGluayB0ZXN0XVsxXVxyXG4gICAgLy8gb3IgW2xpbmsgdGVzdF0oL2ZvbylcclxuICAgIC8vXHJcblxyXG4gICAgLypcclxuICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXHJcbiAgICggICAgICAgICAgICAgICAgLy8gd3JhcCB3aG9sZSBtYXRjaCBpbiAkMVxyXG4gICBcXFtcclxuICAgKFteXFxbXFxdXSspICAgICAgIC8vIGxpbmsgdGV4dCA9ICQyOyBjYW4ndCBjb250YWluICdbJyBvciAnXSdcclxuICAgXFxdXHJcbiAgICkoKSgpKCkoKSgpICAgICAgLy8gcGFkIHJlc3Qgb2YgYmFja3JlZmVyZW5jZXNcclxuICAgL2csIHdyaXRlQW5jaG9yVGFnKTtcclxuICAgKi9cclxuICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoLyhcXFsoW15cXFtcXF1dKyldKSgpKCkoKSgpKCkvZywgd3JpdGVBbmNob3JUYWcpO1xyXG5cclxuICAgIHRleHQgPSBnbG9iYWxzLmNvbnZlcnRlci5fZGlzcGF0Y2goJ2FuY2hvcnMuYWZ0ZXInLCB0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKTtcclxuICAgIHJldHVybiB0ZXh0O1xyXG59KTtcclxuXHJcbnNob3dkb3duLnN1YlBhcnNlcignYXV0b0xpbmtzJywgZnVuY3Rpb24gKHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB0ZXh0ID0gZ2xvYmFscy5jb252ZXJ0ZXIuX2Rpc3BhdGNoKCdhdXRvTGlua3MuYmVmb3JlJywgdGV4dCwgb3B0aW9ucywgZ2xvYmFscyk7XHJcblxyXG4gICAgdmFyIHNpbXBsZVVSTFJlZ2V4ID0gL1xcYigoKGh0dHBzP3xmdHB8ZGljdCk6XFwvXFwvfHd3d1xcLilbXidcIj5cXHNdK1xcLlteJ1wiPlxcc10rKSg/PVxcc3wkKSg/IVtcIjw+XSkvZ2ksXHJcbiAgICAgICAgZGVsaW1VcmxSZWdleCA9IC88KCgoaHR0cHM/fGZ0cHxkaWN0KTpcXC9cXC98d3d3XFwuKVteJ1wiPlxcc10rKT4vZ2ksXHJcbiAgICAgICAgc2ltcGxlTWFpbFJlZ2V4ID0gLyg/Ol58WyBcXG5cXHRdKShbQS1aYS16MC05ISMkJSYnKistLz0/Xl9gXFx7fH1+XFwuXStAWy1hLXowLTldKyhcXC5bLWEtejAtOV0rKSpcXC5bYS16XSspKD86JHxbIFxcblxcdF0pL2dpLFxyXG4gICAgICAgIGRlbGltTWFpbFJlZ2V4ID0gLzwoPzptYWlsdG86KT8oWy0uXFx3XStAWy1hLXowLTldKyhcXC5bLWEtejAtOV0rKSpcXC5bYS16XSspPi9naTtcclxuXHJcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKGRlbGltVXJsUmVnZXgsIHJlcGxhY2VMaW5rKTtcclxuICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoZGVsaW1NYWlsUmVnZXgsIHJlcGxhY2VNYWlsKTtcclxuICAgIC8vIHNpbXBsZVVSTFJlZ2V4ICA9IC9cXGIoKChodHRwcz98ZnRwfGRpY3QpOlxcL1xcL3x3d3dcXC4pWy0uK346PyNAISQmJygpKiw7PVtcXF1cXHddKylcXGIvZ2ksXHJcbiAgICAvLyBFbWFpbCBhZGRyZXNzZXM6IDxhZGRyZXNzQGRvbWFpbi5mb28+XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuc2ltcGxpZmllZEF1dG9MaW5rKSB7XHJcbiAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZShzaW1wbGVVUkxSZWdleCwgcmVwbGFjZUxpbmspO1xyXG4gICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2Uoc2ltcGxlTWFpbFJlZ2V4LCByZXBsYWNlTWFpbCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVwbGFjZUxpbmsod20sIGxpbmspIHtcclxuICAgICAgICB2YXIgbG5rVHh0ID0gbGluaztcclxuICAgICAgICBpZiAoL153d3dcXC4vaS50ZXN0KGxpbmspKSB7XHJcbiAgICAgICAgICAgIGxpbmsgPSBsaW5rLnJlcGxhY2UoL153d3dcXC4vaSwgJ2h0dHA6Ly93d3cuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAnPGEgaHJlZj1cIicgKyBsaW5rICsgJ1wiPicgKyBsbmtUeHQgKyAnPC9hPic7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVwbGFjZU1haWwod2hvbGVNYXRjaCwgbTEpIHtcclxuICAgICAgICB2YXIgdW5lc2NhcGVkU3RyID0gc2hvd2Rvd24uc3ViUGFyc2VyKCd1bmVzY2FwZVNwZWNpYWxDaGFycycpKG0xKTtcclxuICAgICAgICByZXR1cm4gc2hvd2Rvd24uc3ViUGFyc2VyKCdlbmNvZGVFbWFpbEFkZHJlc3MnKSh1bmVzY2FwZWRTdHIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRleHQgPSBnbG9iYWxzLmNvbnZlcnRlci5fZGlzcGF0Y2goJ2F1dG9MaW5rcy5hZnRlcicsIHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG5cclxuICAgIHJldHVybiB0ZXh0O1xyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBUaGVzZSBhcmUgYWxsIHRoZSB0cmFuc2Zvcm1hdGlvbnMgdGhhdCBmb3JtIGJsb2NrLWxldmVsXHJcbiAqIHRhZ3MgbGlrZSBwYXJhZ3JhcGhzLCBoZWFkZXJzLCBhbmQgbGlzdCBpdGVtcy5cclxuICovXHJcbnNob3dkb3duLnN1YlBhcnNlcignYmxvY2tHYW11dCcsIGZ1bmN0aW9uICh0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdGV4dCA9IGdsb2JhbHMuY29udmVydGVyLl9kaXNwYXRjaCgnYmxvY2tHYW11dC5iZWZvcmUnLCB0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKTtcclxuXHJcbiAgICAvLyB3ZSBwYXJzZSBibG9ja3F1b3RlcyBmaXJzdCBzbyB0aGF0IHdlIGNhbiBoYXZlIGhlYWRpbmdzIGFuZCBocnNcclxuICAgIC8vIGluc2lkZSBibG9ja3F1b3Rlc1xyXG4gICAgdGV4dCA9IHNob3dkb3duLnN1YlBhcnNlcignYmxvY2tRdW90ZXMnKSh0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKTtcclxuICAgIHRleHQgPSBzaG93ZG93bi5zdWJQYXJzZXIoJ2hlYWRlcnMnKSh0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKTtcclxuXHJcbiAgICAvLyBEbyBIb3Jpem9udGFsIFJ1bGVzOlxyXG4gICAgdmFyIGtleSA9IHNob3dkb3duLnN1YlBhcnNlcignaGFzaEJsb2NrJykoJzxociAvPicsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG4gICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXlsgXXswLDJ9KFsgXT9cXCpbIF0/KXszLH1bIFxcdF0qJC9nbSwga2V5KTtcclxuICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoL15bIF17MCwyfShbIF0/XFwtWyBdPyl7Myx9WyBcXHRdKiQvZ20sIGtleSk7XHJcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9eWyBdezAsMn0oWyBdP19bIF0/KXszLH1bIFxcdF0qJC9nbSwga2V5KTtcclxuXHJcbiAgICB0ZXh0ID0gc2hvd2Rvd24uc3ViUGFyc2VyKCdsaXN0cycpKHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG4gICAgdGV4dCA9IHNob3dkb3duLnN1YlBhcnNlcignY29kZUJsb2NrcycpKHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG4gICAgdGV4dCA9IHNob3dkb3duLnN1YlBhcnNlcigndGFibGVzJykodGV4dCwgb3B0aW9ucywgZ2xvYmFscyk7XHJcblxyXG4gICAgLy8gV2UgYWxyZWFkeSByYW4gX0hhc2hIVE1MQmxvY2tzKCkgYmVmb3JlLCBpbiBNYXJrZG93bigpLCBidXQgdGhhdFxyXG4gICAgLy8gd2FzIHRvIGVzY2FwZSByYXcgSFRNTCBpbiB0aGUgb3JpZ2luYWwgTWFya2Rvd24gc291cmNlLiBUaGlzIHRpbWUsXHJcbiAgICAvLyB3ZSdyZSBlc2NhcGluZyB0aGUgbWFya3VwIHdlJ3ZlIGp1c3QgY3JlYXRlZCwgc28gdGhhdCB3ZSBkb24ndCB3cmFwXHJcbiAgICAvLyA8cD4gdGFncyBhcm91bmQgYmxvY2stbGV2ZWwgdGFncy5cclxuICAgIHRleHQgPSBzaG93ZG93bi5zdWJQYXJzZXIoJ2hhc2hIVE1MQmxvY2tzJykodGV4dCwgb3B0aW9ucywgZ2xvYmFscyk7XHJcbiAgICB0ZXh0ID0gc2hvd2Rvd24uc3ViUGFyc2VyKCdwYXJhZ3JhcGhzJykodGV4dCwgb3B0aW9ucywgZ2xvYmFscyk7XHJcblxyXG4gICAgdGV4dCA9IGdsb2JhbHMuY29udmVydGVyLl9kaXNwYXRjaCgnYmxvY2tHYW11dC5hZnRlcicsIHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG5cclxuICAgIHJldHVybiB0ZXh0O1xyXG59KTtcclxuXHJcbnNob3dkb3duLnN1YlBhcnNlcignYmxvY2tRdW90ZXMnLCBmdW5jdGlvbiAodGV4dCwgb3B0aW9ucywgZ2xvYmFscykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHRleHQgPSBnbG9iYWxzLmNvbnZlcnRlci5fZGlzcGF0Y2goJ2Jsb2NrUXVvdGVzLmJlZm9yZScsIHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG4gICAgLypcclxuICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXHJcbiAgIChcdFx0XHRcdFx0XHRcdFx0Ly8gV3JhcCB3aG9sZSBtYXRjaCBpbiAkMVxyXG4gICAoXHJcbiAgIF5bIFxcdF0qPlsgXFx0XT9cdFx0XHQvLyAnPicgYXQgdGhlIHN0YXJ0IG9mIGEgbGluZVxyXG4gICAuK1xcblx0XHRcdFx0XHQvLyByZXN0IG9mIHRoZSBmaXJzdCBsaW5lXHJcbiAgICguK1xcbikqXHRcdFx0XHRcdC8vIHN1YnNlcXVlbnQgY29uc2VjdXRpdmUgbGluZXNcclxuICAgXFxuKlx0XHRcdFx0XHRcdC8vIGJsYW5rc1xyXG4gICApK1xyXG4gICApXHJcbiAgIC9nbSwgZnVuY3Rpb24oKXsuLi59KTtcclxuICAgKi9cclxuXHJcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC8oKF5bIFxcdF17MCwzfT5bIFxcdF0/LitcXG4oLitcXG4pKlxcbiopKykvZ20sIGZ1bmN0aW9uICh3aG9sZU1hdGNoLCBtMSkge1xyXG4gICAgICAgIHZhciBicSA9IG0xO1xyXG5cclxuICAgICAgICAvLyBhdHRhY2tsYWI6IGhhY2sgYXJvdW5kIEtvbnF1ZXJvciAzLjUuNCBidWc6XHJcbiAgICAgICAgLy8gXCItLS0tLS0tLS0tYnVnXCIucmVwbGFjZSgvXi0vZyxcIlwiKSA9PSBcImJ1Z1wiXHJcbiAgICAgICAgYnEgPSBicS5yZXBsYWNlKC9eWyBcXHRdKj5bIFxcdF0/L2dtLCAnfjAnKTsgLy8gdHJpbSBvbmUgbGV2ZWwgb2YgcXVvdGluZ1xyXG5cclxuICAgICAgICAvLyBhdHRhY2tsYWI6IGNsZWFuIHVwIGhhY2tcclxuICAgICAgICBicSA9IGJxLnJlcGxhY2UoL34wL2csICcnKTtcclxuXHJcbiAgICAgICAgYnEgPSBicS5yZXBsYWNlKC9eWyBcXHRdKyQvZ20sICcnKTsgLy8gdHJpbSB3aGl0ZXNwYWNlLW9ubHkgbGluZXNcclxuICAgICAgICBicSA9IHNob3dkb3duLnN1YlBhcnNlcignZ2l0aHViQ29kZUJsb2NrcycpKGJxLCBvcHRpb25zLCBnbG9iYWxzKTtcclxuICAgICAgICBicSA9IHNob3dkb3duLnN1YlBhcnNlcignYmxvY2tHYW11dCcpKGJxLCBvcHRpb25zLCBnbG9iYWxzKTsgLy8gcmVjdXJzZVxyXG5cclxuICAgICAgICBicSA9IGJxLnJlcGxhY2UoLyhefFxcbikvZywgJyQxICAnKTtcclxuICAgICAgICAvLyBUaGVzZSBsZWFkaW5nIHNwYWNlcyBzY3JldyB3aXRoIDxwcmU+IGNvbnRlbnQsIHNvIHdlIG5lZWQgdG8gZml4IHRoYXQ6XHJcbiAgICAgICAgYnEgPSBicS5yZXBsYWNlKC8oXFxzKjxwcmU+W15cXHJdKz88XFwvcHJlPikvZ20sIGZ1bmN0aW9uICh3aG9sZU1hdGNoLCBtMSkge1xyXG4gICAgICAgICAgICB2YXIgcHJlID0gbTE7XHJcbiAgICAgICAgICAgIC8vIGF0dGFja2xhYjogaGFjayBhcm91bmQgS29ucXVlcm9yIDMuNS40IGJ1ZzpcclxuICAgICAgICAgICAgcHJlID0gcHJlLnJlcGxhY2UoL14gezJ9L21nLCAnfjAnKTtcclxuICAgICAgICAgICAgcHJlID0gcHJlLnJlcGxhY2UoL34wL2csICcnKTtcclxuICAgICAgICAgICAgcmV0dXJuIHByZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3dkb3duLnN1YlBhcnNlcignaGFzaEJsb2NrJykoJzxibG9ja3F1b3RlPlxcbicgKyBicSArICdcXG48L2Jsb2NrcXVvdGU+Jywgb3B0aW9ucywgZ2xvYmFscyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0ZXh0ID0gZ2xvYmFscy5jb252ZXJ0ZXIuX2Rpc3BhdGNoKCdibG9ja1F1b3Rlcy5hZnRlcicsIHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG4gICAgcmV0dXJuIHRleHQ7XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIFByb2Nlc3MgTWFya2Rvd24gYDxwcmU+PGNvZGU+YCBibG9ja3MuXHJcbiAqL1xyXG5zaG93ZG93bi5zdWJQYXJzZXIoJ2NvZGVCbG9ja3MnLCBmdW5jdGlvbiAodGV4dCwgb3B0aW9ucywgZ2xvYmFscykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHRleHQgPSBnbG9iYWxzLmNvbnZlcnRlci5fZGlzcGF0Y2goJ2NvZGVCbG9ja3MuYmVmb3JlJywgdGV4dCwgb3B0aW9ucywgZ2xvYmFscyk7XHJcbiAgICAvKlxyXG4gICB0ZXh0ID0gdGV4dC5yZXBsYWNlKHRleHQsXHJcbiAgIC8oPzpcXG5cXG58XilcclxuICAgKFx0XHRcdFx0XHRcdFx0XHQvLyAkMSA9IHRoZSBjb2RlIGJsb2NrIC0tIG9uZSBvciBtb3JlIGxpbmVzLCBzdGFydGluZyB3aXRoIGEgc3BhY2UvdGFiXHJcbiAgICg/OlxyXG4gICAoPzpbIF17NH18XFx0KVx0XHRcdC8vIExpbmVzIG11c3Qgc3RhcnQgd2l0aCBhIHRhYiBvciBhIHRhYi13aWR0aCBvZiBzcGFjZXMgLSBhdHRhY2tsYWI6IGdfdGFiX3dpZHRoXHJcbiAgIC4qXFxuK1xyXG4gICApK1xyXG4gICApXHJcbiAgIChcXG4qWyBdezAsM31bXiBcXHRcXG5dfCg/PX4wKSlcdC8vIGF0dGFja2xhYjogZ190YWJfd2lkdGhcclxuICAgL2csZnVuY3Rpb24oKXsuLi59KTtcclxuICAgKi9cclxuXHJcbiAgICAvLyBhdHRhY2tsYWI6IHNlbnRpbmVsIHdvcmthcm91bmRzIGZvciBsYWNrIG9mIFxcQSBhbmQgXFxaLCBzYWZhcmlcXGtodG1sIGJ1Z1xyXG4gICAgdGV4dCArPSAnfjAnO1xyXG5cclxuICAgIHZhciBwYXR0ZXJuID0gLyg/OlxcblxcbnxeKSgoPzooPzpbIF17NH18XFx0KS4qXFxuKykrKShcXG4qWyBdezAsM31bXiBcXHRcXG5dfCg/PX4wKSkvZztcclxuICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UocGF0dGVybiwgZnVuY3Rpb24gKHdob2xlTWF0Y2gsIG0xLCBtMikge1xyXG4gICAgICAgIHZhciBjb2RlYmxvY2sgPSBtMSxcclxuICAgICAgICAgICAgbmV4dENoYXIgPSBtMixcclxuICAgICAgICAgICAgZW5kID0gJ1xcbic7XHJcblxyXG4gICAgICAgIGNvZGVibG9jayA9IHNob3dkb3duLnN1YlBhcnNlcignb3V0ZGVudCcpKGNvZGVibG9jayk7XHJcbiAgICAgICAgY29kZWJsb2NrID0gc2hvd2Rvd24uc3ViUGFyc2VyKCdlbmNvZGVDb2RlJykoY29kZWJsb2NrKTtcclxuICAgICAgICBjb2RlYmxvY2sgPSBzaG93ZG93bi5zdWJQYXJzZXIoJ2RldGFiJykoY29kZWJsb2NrKTtcclxuICAgICAgICBjb2RlYmxvY2sgPSBjb2RlYmxvY2sucmVwbGFjZSgvXlxcbisvZywgJycpOyAvLyB0cmltIGxlYWRpbmcgbmV3bGluZXNcclxuICAgICAgICBjb2RlYmxvY2sgPSBjb2RlYmxvY2sucmVwbGFjZSgvXFxuKyQvZywgJycpOyAvLyB0cmltIHRyYWlsaW5nIG5ld2xpbmVzXHJcblxyXG4gICAgICAgIGlmIChvcHRpb25zLm9taXRFeHRyYVdMSW5Db2RlQmxvY2tzKSB7XHJcbiAgICAgICAgICAgIGVuZCA9ICcnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29kZWJsb2NrID0gJzxwcmU+PGNvZGU+JyArIGNvZGVibG9jayArIGVuZCArICc8L2NvZGU+PC9wcmU+JztcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3dkb3duLnN1YlBhcnNlcignaGFzaEJsb2NrJykoY29kZWJsb2NrLCBvcHRpb25zLCBnbG9iYWxzKSArIG5leHRDaGFyO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gYXR0YWNrbGFiOiBzdHJpcCBzZW50aW5lbFxyXG4gICAgdGV4dCA9IHRleHQucmVwbGFjZSgvfjAvLCAnJyk7XHJcblxyXG4gICAgdGV4dCA9IGdsb2JhbHMuY29udmVydGVyLl9kaXNwYXRjaCgnY29kZUJsb2Nrcy5hZnRlcicsIHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG4gICAgcmV0dXJuIHRleHQ7XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqXHJcbiAqICAgKiAgQmFja3RpY2sgcXVvdGVzIGFyZSB1c2VkIGZvciA8Y29kZT48L2NvZGU+IHNwYW5zLlxyXG4gKlxyXG4gKiAgICogIFlvdSBjYW4gdXNlIG11bHRpcGxlIGJhY2t0aWNrcyBhcyB0aGUgZGVsaW1pdGVycyBpZiB5b3Ugd2FudCB0b1xyXG4gKiAgICAgaW5jbHVkZSBsaXRlcmFsIGJhY2t0aWNrcyBpbiB0aGUgY29kZSBzcGFuLiBTbywgdGhpcyBpbnB1dDpcclxuICpcclxuICogICAgICAgICBKdXN0IHR5cGUgYGBmb28gYGJhcmAgYmF6YGAgYXQgdGhlIHByb21wdC5cclxuICpcclxuICogICAgICAgV2lsbCB0cmFuc2xhdGUgdG86XHJcbiAqXHJcbiAqICAgICAgICAgPHA+SnVzdCB0eXBlIDxjb2RlPmZvbyBgYmFyYCBiYXo8L2NvZGU+IGF0IHRoZSBwcm9tcHQuPC9wPlxyXG4gKlxyXG4gKiAgICBUaGVyZSdzIG5vIGFyYml0cmFyeSBsaW1pdCB0byB0aGUgbnVtYmVyIG9mIGJhY2t0aWNrcyB5b3VcclxuICogICAgY2FuIHVzZSBhcyBkZWxpbXRlcnMuIElmIHlvdSBuZWVkIHRocmVlIGNvbnNlY3V0aXZlIGJhY2t0aWNrc1xyXG4gKiAgICBpbiB5b3VyIGNvZGUsIHVzZSBmb3VyIGZvciBkZWxpbWl0ZXJzLCBldGMuXHJcbiAqXHJcbiAqICAqICBZb3UgY2FuIHVzZSBzcGFjZXMgdG8gZ2V0IGxpdGVyYWwgYmFja3RpY2tzIGF0IHRoZSBlZGdlczpcclxuICpcclxuICogICAgICAgICAuLi4gdHlwZSBgYCBgYmFyYCBgYCAuLi5cclxuICpcclxuICogICAgICAgVHVybnMgdG86XHJcbiAqXHJcbiAqICAgICAgICAgLi4uIHR5cGUgPGNvZGU+YGJhcmA8L2NvZGU+IC4uLlxyXG4gKi9cclxuc2hvd2Rvd24uc3ViUGFyc2VyKCdjb2RlU3BhbnMnLCBmdW5jdGlvbiAodGV4dCwgb3B0aW9ucywgZ2xvYmFscykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHRleHQgPSBnbG9iYWxzLmNvbnZlcnRlci5fZGlzcGF0Y2goJ2NvZGVTcGFucy5iZWZvcmUnLCB0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKTtcclxuXHJcbiAgICAvKlxyXG4gICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cclxuICAgKF58W15cXFxcXSlcdFx0XHRcdFx0Ly8gQ2hhcmFjdGVyIGJlZm9yZSBvcGVuaW5nIGAgY2FuJ3QgYmUgYSBiYWNrc2xhc2hcclxuICAgKGArKVx0XHRcdFx0XHRcdC8vICQyID0gT3BlbmluZyBydW4gb2YgYFxyXG4gICAoXHRcdFx0XHRcdFx0XHQvLyAkMyA9IFRoZSBjb2RlIGJsb2NrXHJcbiAgIFteXFxyXSo/XHJcbiAgIFteYF1cdFx0XHRcdFx0Ly8gYXR0YWNrbGFiOiB3b3JrIGFyb3VuZCBsYWNrIG9mIGxvb2tiZWhpbmRcclxuICAgKVxyXG4gICBcXDJcdFx0XHRcdFx0XHRcdC8vIE1hdGNoaW5nIGNsb3NlclxyXG4gICAoPyFgKVxyXG4gICAvZ20sIGZ1bmN0aW9uKCl7Li4ufSk7XHJcbiAgICovXHJcblxyXG4gICAgaWYgKHR5cGVvZiAodGV4dCkgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGV4dCA9ICcnO1xyXG4gICAgfVxyXG4gICAgdGV4dCA9IHRleHQucmVwbGFjZSgvKF58W15cXFxcXSkoYCspKFteXFxyXSo/W15gXSlcXDIoPyFgKS9nbSxcclxuICAgICAgICBmdW5jdGlvbiAod2hvbGVNYXRjaCwgbTEsIG0yLCBtMykge1xyXG4gICAgICAgICAgICB2YXIgYyA9IG0zO1xyXG4gICAgICAgICAgICBjID0gYy5yZXBsYWNlKC9eKFsgXFx0XSopL2csICcnKTtcdC8vIGxlYWRpbmcgd2hpdGVzcGFjZVxyXG4gICAgICAgICAgICBjID0gYy5yZXBsYWNlKC9bIFxcdF0qJC9nLCAnJyk7XHQvLyB0cmFpbGluZyB3aGl0ZXNwYWNlXHJcbiAgICAgICAgICAgIGMgPSBzaG93ZG93bi5zdWJQYXJzZXIoJ2VuY29kZUNvZGUnKShjKTtcclxuICAgICAgICAgICAgcmV0dXJuIG0xICsgJzxjb2RlPicgKyBjICsgJzwvY29kZT4nO1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgdGV4dCA9IGdsb2JhbHMuY29udmVydGVyLl9kaXNwYXRjaCgnY29kZVNwYW5zLmFmdGVyJywgdGV4dCwgb3B0aW9ucywgZ2xvYmFscyk7XHJcbiAgICByZXR1cm4gdGV4dDtcclxufSk7XHJcblxyXG4vKipcclxuICogQ29udmVydCBhbGwgdGFicyB0byBzcGFjZXNcclxuICovXHJcbnNob3dkb3duLnN1YlBhcnNlcignZGV0YWInLCBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIC8vIGV4cGFuZCBmaXJzdCBuLTEgdGFic1xyXG4gICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXFx0KD89XFx0KS9nLCAnICAgICcpOyAvLyBnX3RhYl93aWR0aFxyXG5cclxuICAgIC8vIHJlcGxhY2UgdGhlIG50aCB3aXRoIHR3byBzZW50aW5lbHNcclxuICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoL1xcdC9nLCAnfkF+QicpO1xyXG5cclxuICAgIC8vIHVzZSB0aGUgc2VudGluZWwgdG8gYW5jaG9yIG91ciByZWdleCBzbyBpdCBkb2Vzbid0IGV4cGxvZGVcclxuICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoL35CKC4rPyl+QS9nLCBmdW5jdGlvbiAod2hvbGVNYXRjaCwgbTEpIHtcclxuICAgICAgICB2YXIgbGVhZGluZ1RleHQgPSBtMSxcclxuICAgICAgICAgICAgbnVtU3BhY2VzID0gNCAtIGxlYWRpbmdUZXh0Lmxlbmd0aCAlIDQ7IC8vIGdfdGFiX3dpZHRoXHJcblxyXG4gICAgICAgIC8vIHRoZXJlICptdXN0KiBiZSBhIGJldHRlciB3YXkgdG8gZG8gdGhpczpcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bVNwYWNlczsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxlYWRpbmdUZXh0ICs9ICcgJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBsZWFkaW5nVGV4dDtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIGNsZWFuIHVwIHNlbnRpbmVsc1xyXG4gICAgdGV4dCA9IHRleHQucmVwbGFjZSgvfkEvZywgJyAgICAnKTsgLy8gZ190YWJfd2lkdGhcclxuICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoL35CL2csICcnKTtcclxuXHJcbiAgICByZXR1cm4gdGV4dDtcclxuXHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIFNtYXJ0IHByb2Nlc3NpbmcgZm9yIGFtcGVyc2FuZHMgYW5kIGFuZ2xlIGJyYWNrZXRzIHRoYXQgbmVlZCB0byBiZSBlbmNvZGVkLlxyXG4gKi9cclxuc2hvd2Rvd24uc3ViUGFyc2VyKCdlbmNvZGVBbXBzQW5kQW5nbGVzJywgZnVuY3Rpb24gKHRleHQpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIC8vIEFtcGVyc2FuZC1lbmNvZGluZyBiYXNlZCBlbnRpcmVseSBvbiBOYXQgSXJvbnMncyBBbXB1dGF0b3IgTVQgcGx1Z2luOlxyXG4gICAgLy8gaHR0cDovL2J1bXBwby5uZXQvcHJvamVjdHMvYW1wdXRhdG9yL1xyXG4gICAgdGV4dCA9IHRleHQucmVwbGFjZSgvJig/ISM/W3hYXT8oPzpbMC05YS1mQS1GXSt8XFx3Kyk7KS9nLCAnJmFtcDsnKTtcclxuXHJcbiAgICAvLyBFbmNvZGUgbmFrZWQgPCdzXHJcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC88KD8hW2EtelxcLz9cXCQhXSkvZ2ksICcmbHQ7Jyk7XHJcblxyXG4gICAgcmV0dXJuIHRleHQ7XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIHN0cmluZywgd2l0aCBhZnRlciBwcm9jZXNzaW5nIHRoZSBmb2xsb3dpbmcgYmFja3NsYXNoIGVzY2FwZSBzZXF1ZW5jZXMuXHJcbiAqXHJcbiAqIGF0dGFja2xhYjogVGhlIHBvbGl0ZSB3YXkgdG8gZG8gdGhpcyBpcyB3aXRoIHRoZSBuZXcgZXNjYXBlQ2hhcmFjdGVycygpIGZ1bmN0aW9uOlxyXG4gKlxyXG4gKiAgICB0ZXh0ID0gZXNjYXBlQ2hhcmFjdGVycyh0ZXh0LFwiXFxcXFwiLHRydWUpO1xyXG4gKiAgICB0ZXh0ID0gZXNjYXBlQ2hhcmFjdGVycyh0ZXh0LFwiYCpfe31bXSgpPiMrLS4hXCIsdHJ1ZSk7XHJcbiAqXHJcbiAqIC4uLmJ1dCB3ZSdyZSBzaWRlc3RlcHBpbmcgaXRzIHVzZSBvZiB0aGUgKHNsb3cpIFJlZ0V4cCBjb25zdHJ1Y3RvclxyXG4gKiBhcyBhbiBvcHRpbWl6YXRpb24gZm9yIEZpcmVmb3guICBUaGlzIGZ1bmN0aW9uIGdldHMgY2FsbGVkIGEgTE9ULlxyXG4gKi9cclxuc2hvd2Rvd24uc3ViUGFyc2VyKCdlbmNvZGVCYWNrc2xhc2hFc2NhcGVzJywgZnVuY3Rpb24gKHRleHQpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoL1xcXFwoXFxcXCkvZywgc2hvd2Rvd24uaGVscGVyLmVzY2FwZUNoYXJhY3RlcnNDYWxsYmFjayk7XHJcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cXFxcKFtgKl97fVxcW1xcXSgpPiMrLS4hXSkvZywgc2hvd2Rvd24uaGVscGVyLmVzY2FwZUNoYXJhY3RlcnNDYWxsYmFjayk7XHJcbiAgICByZXR1cm4gdGV4dDtcclxufSk7XHJcblxyXG4vKipcclxuICogRW5jb2RlL2VzY2FwZSBjZXJ0YWluIGNoYXJhY3RlcnMgaW5zaWRlIE1hcmtkb3duIGNvZGUgcnVucy5cclxuICogVGhlIHBvaW50IGlzIHRoYXQgaW4gY29kZSwgdGhlc2UgY2hhcmFjdGVycyBhcmUgbGl0ZXJhbHMsXHJcbiAqIGFuZCBsb3NlIHRoZWlyIHNwZWNpYWwgTWFya2Rvd24gbWVhbmluZ3MuXHJcbiAqL1xyXG5zaG93ZG93bi5zdWJQYXJzZXIoJ2VuY29kZUNvZGUnLCBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIC8vIEVuY29kZSBhbGwgYW1wZXJzYW5kczsgSFRNTCBlbnRpdGllcyBhcmUgbm90XHJcbiAgICAvLyBlbnRpdGllcyB3aXRoaW4gYSBNYXJrZG93biBjb2RlIHNwYW4uXHJcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC8mL2csICcmYW1wOycpO1xyXG5cclxuICAgIC8vIERvIHRoZSBhbmdsZSBicmFja2V0IHNvbmcgYW5kIGRhbmNlOlxyXG4gICAgdGV4dCA9IHRleHQucmVwbGFjZSgvPC9nLCAnJmx0OycpO1xyXG4gICAgdGV4dCA9IHRleHQucmVwbGFjZSgvPi9nLCAnJmd0OycpO1xyXG5cclxuICAgIC8vIE5vdywgZXNjYXBlIGNoYXJhY3RlcnMgdGhhdCBhcmUgbWFnaWMgaW4gTWFya2Rvd246XHJcbiAgICB0ZXh0ID0gc2hvd2Rvd24uaGVscGVyLmVzY2FwZUNoYXJhY3RlcnModGV4dCwgJypfe31bXVxcXFwnLCBmYWxzZSk7XHJcblxyXG4gICAgLy8gamogdGhlIGxpbmUgYWJvdmUgYnJlYWtzIHRoaXM6XHJcbiAgICAvLyAtLS1cclxuICAgIC8vKiBJdGVtXHJcbiAgICAvLyAgIDEuIFN1Yml0ZW1cclxuICAgIC8vICAgICAgICAgICAgc3BlY2lhbCBjaGFyOiAqXHJcbiAgICAvLyAtLS1cclxuXHJcbiAgICByZXR1cm4gdGV4dDtcclxufSk7XHJcblxyXG4vKipcclxuICogIElucHV0OiBhbiBlbWFpbCBhZGRyZXNzLCBlLmcuIFwiZm9vQGV4YW1wbGUuY29tXCJcclxuICpcclxuICogIE91dHB1dDogdGhlIGVtYWlsIGFkZHJlc3MgYXMgYSBtYWlsdG8gbGluaywgd2l0aCBlYWNoIGNoYXJhY3RlclxyXG4gKiAgICBvZiB0aGUgYWRkcmVzcyBlbmNvZGVkIGFzIGVpdGhlciBhIGRlY2ltYWwgb3IgaGV4IGVudGl0eSwgaW5cclxuICogICAgdGhlIGhvcGVzIG9mIGZvaWxpbmcgbW9zdCBhZGRyZXNzIGhhcnZlc3Rpbmcgc3BhbSBib3RzLiBFLmcuOlxyXG4gKlxyXG4gKiAgICA8YSBocmVmPVwiJiN4NkQ7JiM5NzsmIzEwNTsmIzEwODsmI3g3NDsmIzExMTs6JiMxMDI7JiMxMTE7JiMxMTE7JiM2NDsmIzEwMTtcclxuICogICAgICAgeCYjeDYxOyYjMTA5OyYjeDcwOyYjMTA4OyYjeDY1OyYjeDJFOyYjOTk7JiMxMTE7JiMxMDk7XCI+JiMxMDI7JiMxMTE7JiMxMTE7XHJcbiAqICAgICAgICYjNjQ7JiMxMDE7eCYjeDYxOyYjMTA5OyYjeDcwOyYjMTA4OyYjeDY1OyYjeDJFOyYjOTk7JiMxMTE7JiMxMDk7PC9hPlxyXG4gKlxyXG4gKiAgQmFzZWQgb24gYSBmaWx0ZXIgYnkgTWF0dGhldyBXaWNrbGluZSwgcG9zdGVkIHRvIHRoZSBCQkVkaXQtVGFsa1xyXG4gKiAgbWFpbGluZyBsaXN0OiA8aHR0cDovL3Rpbnl1cmwuY29tL3l1N3VlPlxyXG4gKlxyXG4gKi9cclxuc2hvd2Rvd24uc3ViUGFyc2VyKCdlbmNvZGVFbWFpbEFkZHJlc3MnLCBmdW5jdGlvbiAoYWRkcikge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBlbmNvZGUgPSBbXHJcbiAgICAgICAgZnVuY3Rpb24gKGNoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnJiMnICsgY2guY2hhckNvZGVBdCgwKSArICc7JztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZ1bmN0aW9uIChjaCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJyYjeCcgKyBjaC5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSArICc7JztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZ1bmN0aW9uIChjaCkge1xyXG4gICAgICAgICAgICByZXR1cm4gY2g7XHJcbiAgICAgICAgfVxyXG4gICAgXTtcclxuXHJcbiAgICBhZGRyID0gJ21haWx0bzonICsgYWRkcjtcclxuXHJcbiAgICBhZGRyID0gYWRkci5yZXBsYWNlKC8uL2csIGZ1bmN0aW9uIChjaCkge1xyXG4gICAgICAgIGlmIChjaCA9PT0gJ0AnKSB7XHJcbiAgICAgICAgICAgIC8vIHRoaXMgKm11c3QqIGJlIGVuY29kZWQuIEkgaW5zaXN0LlxyXG4gICAgICAgICAgICBjaCA9IGVuY29kZVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKV0oY2gpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY2ggIT09ICc6Jykge1xyXG4gICAgICAgICAgICAvLyBsZWF2ZSAnOicgYWxvbmUgKHRvIHNwb3QgbWFpbHRvOiBsYXRlcilcclxuICAgICAgICAgICAgdmFyIHIgPSBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgICAgICAvLyByb3VnaGx5IDEwJSByYXcsIDQ1JSBoZXgsIDQ1JSBkZWNcclxuICAgICAgICAgICAgY2ggPSAoXHJcbiAgICAgICAgICAgICAgICByID4gMC45ID8gZW5jb2RlWzJdKGNoKSA6IHIgPiAwLjQ1ID8gZW5jb2RlWzFdKGNoKSA6IGVuY29kZVswXShjaClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNoO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYWRkciA9ICc8YSBocmVmPVwiJyArIGFkZHIgKyAnXCI+JyArIGFkZHIgKyAnPC9hPic7XHJcbiAgICBhZGRyID0gYWRkci5yZXBsYWNlKC9cIj4uKzovZywgJ1wiPicpOyAvLyBzdHJpcCB0aGUgbWFpbHRvOiBmcm9tIHRoZSB2aXNpYmxlIHBhcnRcclxuXHJcbiAgICByZXR1cm4gYWRkcjtcclxufSk7XHJcblxyXG4vKipcclxuICogV2l0aGluIHRhZ3MgLS0gbWVhbmluZyBiZXR3ZWVuIDwgYW5kID4gLS0gZW5jb2RlIFtcXCBgICogX10gc28gdGhleVxyXG4gKiBkb24ndCBjb25mbGljdCB3aXRoIHRoZWlyIHVzZSBpbiBNYXJrZG93biBmb3IgY29kZSwgaXRhbGljcyBhbmQgc3Ryb25nLlxyXG4gKi9cclxuc2hvd2Rvd24uc3ViUGFyc2VyKCdlc2NhcGVTcGVjaWFsQ2hhcnNXaXRoaW5UYWdBdHRyaWJ1dGVzJywgZnVuY3Rpb24gKHRleHQpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAvLyBCdWlsZCBhIHJlZ2V4IHRvIGZpbmQgSFRNTCB0YWdzIGFuZCBjb21tZW50cy4gIFNlZSBGcmllZGwnc1xyXG4gICAgLy8gXCJNYXN0ZXJpbmcgUmVndWxhciBFeHByZXNzaW9uc1wiLCAybmQgRWQuLCBwcC4gMjAwLTIwMS5cclxuICAgIHZhciByZWdleCA9IC8oPFthLXpcXC8hJF0oXCJbXlwiXSpcInwnW14nXSonfFteJ1wiPl0pKj58PCEoLS0uKj8tLVxccyopKz4pL2dpO1xyXG5cclxuICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UocmVnZXgsIGZ1bmN0aW9uICh3aG9sZU1hdGNoKSB7XHJcbiAgICAgICAgdmFyIHRhZyA9IHdob2xlTWF0Y2gucmVwbGFjZSgvKC4pPFxcLz9jb2RlPig/PS4pL2csICckMWAnKTtcclxuICAgICAgICB0YWcgPSBzaG93ZG93bi5oZWxwZXIuZXNjYXBlQ2hhcmFjdGVycyh0YWcsICdcXFxcYCpfJywgZmFsc2UpO1xyXG4gICAgICAgIHJldHVybiB0YWc7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdGV4dDtcclxufSk7XHJcblxyXG4vKipcclxuICogSGFuZGxlIGdpdGh1YiBjb2RlYmxvY2tzIHByaW9yIHRvIHJ1bm5pbmcgSGFzaEhUTUwgc28gdGhhdFxyXG4gKiBIVE1MIGNvbnRhaW5lZCB3aXRoaW4gdGhlIGNvZGVibG9jayBnZXRzIGVzY2FwZWQgcHJvcGVybHlcclxuICogRXhhbXBsZTpcclxuICogYGBgcnVieVxyXG4gKiAgICAgZGVmIGhlbGxvX3dvcmxkKHgpXHJcbiAqICAgICAgIHB1dHMgXCJIZWxsbywgI3t4fVwiXHJcbiAqICAgICBlbmRcclxuICogYGBgXHJcbiAqL1xyXG5zaG93ZG93bi5zdWJQYXJzZXIoJ2dpdGh1YkNvZGVCbG9ja3MnLCBmdW5jdGlvbiAodGV4dCwgb3B0aW9ucywgZ2xvYmFscykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIC8vIGVhcmx5IGV4aXQgaWYgb3B0aW9uIGlzIG5vdCBlbmFibGVkXHJcbiAgICBpZiAoIW9wdGlvbnMuZ2hDb2RlQmxvY2tzKSB7XHJcbiAgICAgICAgcmV0dXJuIHRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdGV4dCA9IGdsb2JhbHMuY29udmVydGVyLl9kaXNwYXRjaCgnZ2l0aHViQ29kZUJsb2Nrcy5iZWZvcmUnLCB0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKTtcclxuXHJcbiAgICB0ZXh0ICs9ICd+MCc7XHJcblxyXG4gICAgdGV4dCA9IHRleHQucmVwbGFjZSgvKD86XnxcXG4pYGBgKC4qKVxcbihbXFxzXFxTXSo/KVxcbmBgYC9nLCBmdW5jdGlvbiAod2hvbGVNYXRjaCwgbGFuZ3VhZ2UsIGNvZGVibG9jaykge1xyXG4gICAgICAgIHZhciBlbmQgPSAob3B0aW9ucy5vbWl0RXh0cmFXTEluQ29kZUJsb2NrcykgPyAnJyA6ICdcXG4nO1xyXG5cclxuICAgICAgICAvLyBGaXJzdCBwYXJzZSB0aGUgZ2l0aHViIGNvZGUgYmxvY2tcclxuICAgICAgICBjb2RlYmxvY2sgPSBzaG93ZG93bi5zdWJQYXJzZXIoJ2VuY29kZUNvZGUnKShjb2RlYmxvY2spO1xyXG4gICAgICAgIGNvZGVibG9jayA9IHNob3dkb3duLnN1YlBhcnNlcignZGV0YWInKShjb2RlYmxvY2spO1xyXG4gICAgICAgIGNvZGVibG9jayA9IGNvZGVibG9jay5yZXBsYWNlKC9eXFxuKy9nLCAnJyk7IC8vIHRyaW0gbGVhZGluZyBuZXdsaW5lc1xyXG4gICAgICAgIGNvZGVibG9jayA9IGNvZGVibG9jay5yZXBsYWNlKC9cXG4rJC9nLCAnJyk7IC8vIHRyaW0gdHJhaWxpbmcgd2hpdGVzcGFjZVxyXG5cclxuICAgICAgICBjb2RlYmxvY2sgPSAnPHByZT48Y29kZScgKyAobGFuZ3VhZ2UgPyAnIGNsYXNzPVwiJyArIGxhbmd1YWdlICsgJyBsYW5ndWFnZS0nICsgbGFuZ3VhZ2UgKyAnXCInIDogJycpICsgJz4nICsgY29kZWJsb2NrICsgZW5kICsgJzwvY29kZT48L3ByZT4nO1xyXG5cclxuICAgICAgICBjb2RlYmxvY2sgPSBzaG93ZG93bi5zdWJQYXJzZXIoJ2hhc2hCbG9jaycpKGNvZGVibG9jaywgb3B0aW9ucywgZ2xvYmFscyk7XHJcblxyXG4gICAgICAgIC8vIFNpbmNlIEdIQ29kZWJsb2NrcyBjYW4gYmUgZmFsc2UgcG9zaXRpdmVzLCB3ZSBuZWVkIHRvXHJcbiAgICAgICAgLy8gc3RvcmUgdGhlIHByaW1pdGl2ZSB0ZXh0IGFuZCB0aGUgcGFyc2VkIHRleHQgaW4gYSBnbG9iYWwgdmFyLFxyXG4gICAgICAgIC8vIGFuZCB0aGVuIHJldHVybiBhIHRva2VuXHJcbiAgICAgICAgcmV0dXJuICdcXG5cXG5+RycgKyAoZ2xvYmFscy5naENvZGVCbG9ja3MucHVzaCh7dGV4dDogd2hvbGVNYXRjaCwgY29kZWJsb2NrOiBjb2RlYmxvY2t9KSAtIDEpICsgJ0dcXG5cXG4nO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gYXR0YWNrbGFiOiBzdHJpcCBzZW50aW5lbFxyXG4gICAgdGV4dCA9IHRleHQucmVwbGFjZSgvfjAvLCAnJyk7XHJcblxyXG4gICAgcmV0dXJuIGdsb2JhbHMuY29udmVydGVyLl9kaXNwYXRjaCgnZ2l0aHViQ29kZUJsb2Nrcy5hZnRlcicsIHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG59KTtcclxuXHJcbnNob3dkb3duLnN1YlBhcnNlcignaGFzaEJsb2NrJywgZnVuY3Rpb24gKHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoLyheXFxuK3xcXG4rJCkvZywgJycpO1xyXG4gICAgcmV0dXJuICdcXG5cXG5+SycgKyAoZ2xvYmFscy5nSHRtbEJsb2Nrcy5wdXNoKHRleHQpIC0gMSkgKyAnS1xcblxcbic7XHJcbn0pO1xyXG5cclxuc2hvd2Rvd24uc3ViUGFyc2VyKCdoYXNoRWxlbWVudCcsIGZ1bmN0aW9uICh0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh3aG9sZU1hdGNoLCBtMSkge1xyXG4gICAgICAgIHZhciBibG9ja1RleHQgPSBtMTtcclxuXHJcbiAgICAgICAgLy8gVW5kbyBkb3VibGUgbGluZXNcclxuICAgICAgICBibG9ja1RleHQgPSBibG9ja1RleHQucmVwbGFjZSgvXFxuXFxuL2csICdcXG4nKTtcclxuICAgICAgICBibG9ja1RleHQgPSBibG9ja1RleHQucmVwbGFjZSgvXlxcbi8sICcnKTtcclxuXHJcbiAgICAgICAgLy8gc3RyaXAgdHJhaWxpbmcgYmxhbmsgbGluZXNcclxuICAgICAgICBibG9ja1RleHQgPSBibG9ja1RleHQucmVwbGFjZSgvXFxuKyQvZywgJycpO1xyXG5cclxuICAgICAgICAvLyBSZXBsYWNlIHRoZSBlbGVtZW50IHRleHQgd2l0aCBhIG1hcmtlciAoXCJ+S3hLXCIgd2hlcmUgeCBpcyBpdHMga2V5KVxyXG4gICAgICAgIGJsb2NrVGV4dCA9ICdcXG5cXG5+SycgKyAoZ2xvYmFscy5nSHRtbEJsb2Nrcy5wdXNoKGJsb2NrVGV4dCkgLSAxKSArICdLXFxuXFxuJztcclxuXHJcbiAgICAgICAgcmV0dXJuIGJsb2NrVGV4dDtcclxuICAgIH07XHJcbn0pO1xyXG5cclxuc2hvd2Rvd24uc3ViUGFyc2VyKCdoYXNoSFRNTEJsb2NrcycsIGZ1bmN0aW9uICh0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIGJsb2NrVGFncyA9IFtcclxuICAgICAgICAgICAgJ3ByZScsXHJcbiAgICAgICAgICAgICdkaXYnLFxyXG4gICAgICAgICAgICAnaDEnLFxyXG4gICAgICAgICAgICAnaDInLFxyXG4gICAgICAgICAgICAnaDMnLFxyXG4gICAgICAgICAgICAnaDQnLFxyXG4gICAgICAgICAgICAnaDUnLFxyXG4gICAgICAgICAgICAnaDYnLFxyXG4gICAgICAgICAgICAnYmxvY2txdW90ZScsXHJcbiAgICAgICAgICAgICd0YWJsZScsXHJcbiAgICAgICAgICAgICdkbCcsXHJcbiAgICAgICAgICAgICdvbCcsXHJcbiAgICAgICAgICAgICd1bCcsXHJcbiAgICAgICAgICAgICdzY3JpcHQnLFxyXG4gICAgICAgICAgICAnbm9zY3JpcHQnLFxyXG4gICAgICAgICAgICAnZm9ybScsXHJcbiAgICAgICAgICAgICdmaWVsZHNldCcsXHJcbiAgICAgICAgICAgICdpZnJhbWUnLFxyXG4gICAgICAgICAgICAnbWF0aCcsXHJcbiAgICAgICAgICAgICdzdHlsZScsXHJcbiAgICAgICAgICAgICdzZWN0aW9uJyxcclxuICAgICAgICAgICAgJ2hlYWRlcicsXHJcbiAgICAgICAgICAgICdmb290ZXInLFxyXG4gICAgICAgICAgICAnbmF2JyxcclxuICAgICAgICAgICAgJ2FydGljbGUnLFxyXG4gICAgICAgICAgICAnYXNpZGUnLFxyXG4gICAgICAgICAgICAnYWRkcmVzcycsXHJcbiAgICAgICAgICAgICdhdWRpbycsXHJcbiAgICAgICAgICAgICdjYW52YXMnLFxyXG4gICAgICAgICAgICAnZmlndXJlJyxcclxuICAgICAgICAgICAgJ2hncm91cCcsXHJcbiAgICAgICAgICAgICdvdXRwdXQnLFxyXG4gICAgICAgICAgICAndmlkZW8nLFxyXG4gICAgICAgICAgICAncCdcclxuICAgICAgICBdLFxyXG4gICAgICAgIHJlcEZ1bmMgPSBmdW5jdGlvbiAod2hvbGVNYXRjaCwgbWF0Y2gsIGxlZnQsIHJpZ2h0KSB7XHJcbiAgICAgICAgICAgIHZhciB0eHQgPSB3aG9sZU1hdGNoO1xyXG4gICAgICAgICAgICAvLyBjaGVjayBpZiB0aGlzIGh0bWwgZWxlbWVudCBpcyBtYXJrZWQgYXMgbWFya2Rvd25cclxuICAgICAgICAgICAgLy8gaWYgc28sIGl0J3MgY29udGVudHMgc2hvdWxkIGJlIHBhcnNlZCBhcyBtYXJrZG93blxyXG4gICAgICAgICAgICBpZiAobGVmdC5zZWFyY2goL1xcYm1hcmtkb3duXFxiLykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0eHQgPSBsZWZ0ICsgZ2xvYmFscy5jb252ZXJ0ZXIubWFrZUh0bWwobWF0Y2gpICsgcmlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICdcXG5cXG5+SycgKyAoZ2xvYmFscy5nSHRtbEJsb2Nrcy5wdXNoKHR4dCkgLSAxKSArICdLXFxuXFxuJztcclxuICAgICAgICB9O1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmxvY2tUYWdzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgdGV4dCA9IHNob3dkb3duLmhlbHBlci5yZXBsYWNlUmVjdXJzaXZlUmVnRXhwKHRleHQsIHJlcEZ1bmMsICdeKD86IHxcXFxcdCl7MCwzfTwnICsgYmxvY2tUYWdzW2ldICsgJ1xcXFxiW14+XSo+JywgJzwvJyArIGJsb2NrVGFnc1tpXSArICc+JywgJ2dpbScpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEhSIFNQRUNJQUwgQ0FTRVxyXG4gICAgdGV4dCA9IHRleHQucmVwbGFjZSgvKFxcblsgXXswLDN9KDwoaHIpXFxiKFtePD5dKSo/XFwvPz4pWyBcXHRdKig/PVxcbnsyLH0pKS9nLFxyXG4gICAgICAgIHNob3dkb3duLnN1YlBhcnNlcignaGFzaEVsZW1lbnQnKSh0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKSk7XHJcblxyXG4gICAgLy8gU3BlY2lhbCBjYXNlIGZvciBzdGFuZGFsb25lIEhUTUwgY29tbWVudHM6XHJcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC8oPCEtLVtcXHNcXFNdKj8tLT4pL2csXHJcbiAgICAgICAgc2hvd2Rvd24uc3ViUGFyc2VyKCdoYXNoRWxlbWVudCcpKHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpKTtcclxuXHJcbiAgICAvLyBQSFAgYW5kIEFTUC1zdHlsZSBwcm9jZXNzb3IgaW5zdHJ1Y3Rpb25zICg8Py4uLj8+IGFuZCA8JS4uLiU+KVxyXG4gICAgdGV4dCA9IHRleHQucmVwbGFjZSgvKD86XFxuXFxuKShbIF17MCwzfSg/OjwoWz8lXSlbXlxccl0qP1xcMj4pWyBcXHRdKig/PVxcbnsyLH0pKS9nLFxyXG4gICAgICAgIHNob3dkb3duLnN1YlBhcnNlcignaGFzaEVsZW1lbnQnKSh0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKSk7XHJcbiAgICByZXR1cm4gdGV4dDtcclxufSk7XHJcblxyXG4vKipcclxuICogSGFzaCBzcGFuIGVsZW1lbnRzIHRoYXQgc2hvdWxkIG5vdCBiZSBwYXJzZWQgYXMgbWFya2Rvd25cclxuICovXHJcbnNob3dkb3duLnN1YlBhcnNlcignaGFzaEhUTUxTcGFucycsIGZ1bmN0aW9uICh0ZXh0LCBjb25maWcsIGdsb2JhbHMpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgbWF0Y2hlcyA9IHNob3dkb3duLmhlbHBlci5tYXRjaFJlY3Vyc2l2ZVJlZ0V4cCh0ZXh0LCAnPGNvZGVcXFxcYltePl0qPicsICc8L2NvZGU+JywgJ2dpJyk7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXRjaGVzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZShtYXRjaGVzW2ldWzBdLCAnfkwnICsgKGdsb2JhbHMuZ0h0bWxTcGFucy5wdXNoKG1hdGNoZXNbaV1bMF0pIC0gMSkgKyAnTCcpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRleHQ7XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIFVuaGFzaCBIVE1MIHNwYW5zXHJcbiAqL1xyXG5zaG93ZG93bi5zdWJQYXJzZXIoJ3VuaGFzaEhUTUxTcGFucycsIGZ1bmN0aW9uICh0ZXh0LCBjb25maWcsIGdsb2JhbHMpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGdsb2JhbHMuZ0h0bWxTcGFucy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoJ35MJyArIGkgKyAnTCcsIGdsb2JhbHMuZ0h0bWxTcGFuc1tpXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRleHQ7XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIEhhc2ggc3BhbiBlbGVtZW50cyB0aGF0IHNob3VsZCBub3QgYmUgcGFyc2VkIGFzIG1hcmtkb3duXHJcbiAqL1xyXG5zaG93ZG93bi5zdWJQYXJzZXIoJ2hhc2hQcmVDb2RlVGFncycsIGZ1bmN0aW9uICh0ZXh0LCBjb25maWcsIGdsb2JhbHMpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgcmVwRnVuYyA9IGZ1bmN0aW9uICh3aG9sZU1hdGNoLCBtYXRjaCwgbGVmdCwgcmlnaHQpIHtcclxuICAgIC8vIGVuY29kZSBodG1sIGVudGl0aWVzXHJcbiAgICAgICAgdmFyIGNvZGVibG9jayA9IGxlZnQgKyBzaG93ZG93bi5zdWJQYXJzZXIoJ2VuY29kZUNvZGUnKShtYXRjaCkgKyByaWdodDtcclxuICAgICAgICByZXR1cm4gJ1xcblxcbn5HJyArIChnbG9iYWxzLmdoQ29kZUJsb2Nrcy5wdXNoKHt0ZXh0OiB3aG9sZU1hdGNoLCBjb2RlYmxvY2s6IGNvZGVibG9ja30pIC0gMSkgKyAnR1xcblxcbic7XHJcbiAgICB9O1xyXG5cclxuICAgIHRleHQgPSBzaG93ZG93bi5oZWxwZXIucmVwbGFjZVJlY3Vyc2l2ZVJlZ0V4cCh0ZXh0LCByZXBGdW5jLCAnXig/OiB8XFxcXHQpezAsM308cHJlXFxcXGJbXj5dKj5cXFxccyo8Y29kZVxcXFxiW14+XSo+JywgJ14oPzogfFxcXFx0KXswLDN9PC9jb2RlPlxcXFxzKjwvcHJlPicsICdnaW0nKTtcclxuICAgIHJldHVybiB0ZXh0O1xyXG59KTtcclxuXHJcbnNob3dkb3duLnN1YlBhcnNlcignaGVhZGVycycsIGZ1bmN0aW9uICh0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdGV4dCA9IGdsb2JhbHMuY29udmVydGVyLl9kaXNwYXRjaCgnaGVhZGVycy5iZWZvcmUnLCB0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKTtcclxuXHJcbiAgICB2YXIgcHJlZml4SGVhZGVyID0gb3B0aW9ucy5wcmVmaXhIZWFkZXJJZCxcclxuICAgICAgICBoZWFkZXJMZXZlbFN0YXJ0ID0gKGlzTmFOKHBhcnNlSW50KG9wdGlvbnMuaGVhZGVyTGV2ZWxTdGFydCkpKSA/IDEgOiBwYXJzZUludChvcHRpb25zLmhlYWRlckxldmVsU3RhcnQpLFxyXG5cclxuICAgICAgICAvLyBTZXQgdGV4dC1zdHlsZSBoZWFkZXJzOlxyXG4gICAgICAgIC8vXHRIZWFkZXIgMVxyXG4gICAgICAgIC8vXHQ9PT09PT09PVxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy9cdEhlYWRlciAyXHJcbiAgICAgICAgLy9cdC0tLS0tLS0tXHJcbiAgICAgICAgLy9cclxuICAgICAgICBzZXRleHRSZWdleEgxID0gKG9wdGlvbnMuc21vb3RoTGl2ZVByZXZpZXcpID8gL14oLispWyBcXHRdKlxcbj17Mix9WyBcXHRdKlxcbisvZ20gOiAvXiguKylbIFxcdF0qXFxuPStbIFxcdF0qXFxuKy9nbSxcclxuICAgICAgICBzZXRleHRSZWdleEgyID0gKG9wdGlvbnMuc21vb3RoTGl2ZVByZXZpZXcpID8gL14oLispWyBcXHRdKlxcbi17Mix9WyBcXHRdKlxcbisvZ20gOiAvXiguKylbIFxcdF0qXFxuLStbIFxcdF0qXFxuKy9nbTtcclxuXHJcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKHNldGV4dFJlZ2V4SDEsIGZ1bmN0aW9uICh3aG9sZU1hdGNoLCBtMSkge1xyXG5cclxuICAgICAgICB2YXIgc3BhbkdhbXV0ID0gc2hvd2Rvd24uc3ViUGFyc2VyKCdzcGFuR2FtdXQnKShtMSwgb3B0aW9ucywgZ2xvYmFscyksXHJcbiAgICAgICAgICAgIGhJRCA9IChvcHRpb25zLm5vSGVhZGVySWQpID8gJycgOiAnIGlkPVwiJyArIGhlYWRlcklkKG0xKSArICdcIicsXHJcbiAgICAgICAgICAgIGhMZXZlbCA9IGhlYWRlckxldmVsU3RhcnQsXHJcbiAgICAgICAgICAgIGhhc2hCbG9jayA9ICc8aCcgKyBoTGV2ZWwgKyBoSUQgKyAnPicgKyBzcGFuR2FtdXQgKyAnPC9oJyArIGhMZXZlbCArICc+JztcclxuICAgICAgICByZXR1cm4gc2hvd2Rvd24uc3ViUGFyc2VyKCdoYXNoQmxvY2snKShoYXNoQmxvY2ssIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGV4dCA9IHRleHQucmVwbGFjZShzZXRleHRSZWdleEgyLCBmdW5jdGlvbiAobWF0Y2hGb3VuZCwgbTEpIHtcclxuICAgICAgICB2YXIgc3BhbkdhbXV0ID0gc2hvd2Rvd24uc3ViUGFyc2VyKCdzcGFuR2FtdXQnKShtMSwgb3B0aW9ucywgZ2xvYmFscyksXHJcbiAgICAgICAgICAgIGhJRCA9IChvcHRpb25zLm5vSGVhZGVySWQpID8gJycgOiAnIGlkPVwiJyArIGhlYWRlcklkKG0xKSArICdcIicsXHJcbiAgICAgICAgICAgIGhMZXZlbCA9IGhlYWRlckxldmVsU3RhcnQgKyAxLFxyXG4gICAgICAgICAgICBoYXNoQmxvY2sgPSAnPGgnICsgaExldmVsICsgaElEICsgJz4nICsgc3BhbkdhbXV0ICsgJzwvaCcgKyBoTGV2ZWwgKyAnPic7XHJcbiAgICAgICAgcmV0dXJuIHNob3dkb3duLnN1YlBhcnNlcignaGFzaEJsb2NrJykoaGFzaEJsb2NrLCBvcHRpb25zLCBnbG9iYWxzKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIGF0eC1zdHlsZSBoZWFkZXJzOlxyXG4gICAgLy8gICMgSGVhZGVyIDFcclxuICAgIC8vICAjIyBIZWFkZXIgMlxyXG4gICAgLy8gICMjIEhlYWRlciAyIHdpdGggY2xvc2luZyBoYXNoZXMgIyNcclxuICAgIC8vICAuLi5cclxuICAgIC8vICAjIyMjIyMgSGVhZGVyIDZcclxuICAgIC8vXHJcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9eKCN7MSw2fSlbIFxcdF0qKC4rPylbIFxcdF0qIypcXG4rL2dtLCBmdW5jdGlvbiAod2hvbGVNYXRjaCwgbTEsIG0yKSB7XHJcbiAgICAgICAgdmFyIHNwYW4gPSBzaG93ZG93bi5zdWJQYXJzZXIoJ3NwYW5HYW11dCcpKG0yLCBvcHRpb25zLCBnbG9iYWxzKSxcclxuICAgICAgICAgICAgaElEID0gKG9wdGlvbnMubm9IZWFkZXJJZCkgPyAnJyA6ICcgaWQ9XCInICsgaGVhZGVySWQobTIpICsgJ1wiJyxcclxuICAgICAgICAgICAgaExldmVsID0gaGVhZGVyTGV2ZWxTdGFydCAtIDEgKyBtMS5sZW5ndGgsXHJcbiAgICAgICAgICAgIGhlYWRlciA9ICc8aCcgKyBoTGV2ZWwgKyBoSUQgKyAnPicgKyBzcGFuICsgJzwvaCcgKyBoTGV2ZWwgKyAnPic7XHJcblxyXG4gICAgICAgIHJldHVybiBzaG93ZG93bi5zdWJQYXJzZXIoJ2hhc2hCbG9jaycpKGhlYWRlciwgb3B0aW9ucywgZ2xvYmFscyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiBoZWFkZXJJZChtKSB7XHJcbiAgICAgICAgdmFyIHRpdGxlLCBlc2NhcGVkSWQgPSBtLnJlcGxhY2UoL1teXFx3XS9nLCAnJykudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgaWYgKGdsb2JhbHMuaGFzaExpbmtDb3VudHNbZXNjYXBlZElkXSkge1xyXG4gICAgICAgICAgICB0aXRsZSA9IGVzY2FwZWRJZCArICctJyArIChnbG9iYWxzLmhhc2hMaW5rQ291bnRzW2VzY2FwZWRJZF0rKyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGl0bGUgPSBlc2NhcGVkSWQ7XHJcbiAgICAgICAgICAgIGdsb2JhbHMuaGFzaExpbmtDb3VudHNbZXNjYXBlZElkXSA9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBQcmVmaXggaWQgdG8gcHJldmVudCBjYXVzaW5nIGluYWR2ZXJ0ZW50IHByZS1leGlzdGluZyBzdHlsZSBtYXRjaGVzLlxyXG4gICAgICAgIGlmIChwcmVmaXhIZWFkZXIgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgcHJlZml4SGVhZGVyID0gJ3NlY3Rpb24nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNob3dkb3duLmhlbHBlci5pc1N0cmluZyhwcmVmaXhIZWFkZXIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwcmVmaXhIZWFkZXIgKyB0aXRsZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRpdGxlO1xyXG4gICAgfVxyXG5cclxuICAgIHRleHQgPSBnbG9iYWxzLmNvbnZlcnRlci5fZGlzcGF0Y2goJ2hlYWRlcnMuYWZ0ZXInLCB0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKTtcclxuICAgIHJldHVybiB0ZXh0O1xyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBUdXJuIE1hcmtkb3duIGltYWdlIHNob3J0Y3V0cyBpbnRvIDxpbWc+IHRhZ3MuXHJcbiAqL1xyXG5zaG93ZG93bi5zdWJQYXJzZXIoJ2ltYWdlcycsIGZ1bmN0aW9uICh0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdGV4dCA9IGdsb2JhbHMuY29udmVydGVyLl9kaXNwYXRjaCgnaW1hZ2VzLmJlZm9yZScsIHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG5cclxuICAgIHZhciBpbmxpbmVSZWdFeHAgPSAvIVxcWyguKj8pXVxccz9cXChbIFxcdF0qKCk8PyhcXFMrPyk+Pyg/OiA9KFsqXFxkXStbQS1aYS16JV17MCw0fSl4KFsqXFxkXStbQS1aYS16JV17MCw0fSkpP1sgXFx0XSooPzooWydcIl0pKC4qPylcXDZbIFxcdF0qKT9cXCkvZyxcclxuICAgICAgICByZWZlcmVuY2VSZWdFeHAgPSAvIVxcWyhbXlxcXV0qPyldID8oPzpcXG4gKik/XFxbKC4qPyldKCkoKSgpKCkoKS9nO1xyXG5cclxuICAgIGZ1bmN0aW9uIHdyaXRlSW1hZ2VUYWcgKHdob2xlTWF0Y2gsIGFsdFRleHQsIGxpbmtJZCwgdXJsLCB3aWR0aCwgaGVpZ2h0LCBtNSwgdGl0bGUpIHtcclxuXHJcbiAgICAgICAgdmFyIGdVcmxzID0gZ2xvYmFscy5nVXJscyxcclxuICAgICAgICAgICAgZ1RpdGxlcyA9IGdsb2JhbHMuZ1RpdGxlcyxcclxuICAgICAgICAgICAgZ0RpbXMgPSBnbG9iYWxzLmdEaW1lbnNpb25zO1xyXG5cclxuICAgICAgICBsaW5rSWQgPSBsaW5rSWQudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aXRsZSkge1xyXG4gICAgICAgICAgICB0aXRsZSA9ICcnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHVybCA9PT0gJycgfHwgdXJsID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChsaW5rSWQgPT09ICcnIHx8IGxpbmtJZCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgLy8gbG93ZXItY2FzZSBhbmQgdHVybiBlbWJlZGRlZCBuZXdsaW5lcyBpbnRvIHNwYWNlc1xyXG4gICAgICAgICAgICAgICAgbGlua0lkID0gYWx0VGV4dC50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLyA/XFxuL2csICcgJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdXJsID0gJyMnICsgbGlua0lkO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFzaG93ZG93bi5oZWxwZXIuaXNVbmRlZmluZWQoZ1VybHNbbGlua0lkXSkpIHtcclxuICAgICAgICAgICAgICAgIHVybCA9IGdVcmxzW2xpbmtJZF07XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNob3dkb3duLmhlbHBlci5pc1VuZGVmaW5lZChnVGl0bGVzW2xpbmtJZF0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgPSBnVGl0bGVzW2xpbmtJZF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNob3dkb3duLmhlbHBlci5pc1VuZGVmaW5lZChnRGltc1tsaW5rSWRdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoID0gZ0RpbXNbbGlua0lkXS53aWR0aDtcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSBnRGltc1tsaW5rSWRdLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB3aG9sZU1hdGNoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhbHRUZXh0ID0gYWx0VGV4dC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyk7XHJcbiAgICAgICAgYWx0VGV4dCA9IHNob3dkb3duLmhlbHBlci5lc2NhcGVDaGFyYWN0ZXJzKGFsdFRleHQsICcqXycsIGZhbHNlKTtcclxuICAgICAgICB1cmwgPSBzaG93ZG93bi5oZWxwZXIuZXNjYXBlQ2hhcmFjdGVycyh1cmwsICcqXycsIGZhbHNlKTtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gJzxpbWcgc3JjPVwiJyArIHVybCArICdcIiBhbHQ9XCInICsgYWx0VGV4dCArICdcIic7XHJcblxyXG4gICAgICAgIGlmICh0aXRsZSkge1xyXG4gICAgICAgICAgICB0aXRsZSA9IHRpdGxlLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKTtcclxuICAgICAgICAgICAgdGl0bGUgPSBzaG93ZG93bi5oZWxwZXIuZXNjYXBlQ2hhcmFjdGVycyh0aXRsZSwgJypfJywgZmFsc2UpO1xyXG4gICAgICAgICAgICByZXN1bHQgKz0gJyB0aXRsZT1cIicgKyB0aXRsZSArICdcIic7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAod2lkdGggJiYgaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHdpZHRoID0gKHdpZHRoID09PSAnKicpID8gJ2F1dG8nIDogd2lkdGg7XHJcbiAgICAgICAgICAgIGhlaWdodCA9IChoZWlnaHQgPT09ICcqJykgPyAnYXV0bycgOiBoZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICByZXN1bHQgKz0gJyB3aWR0aD1cIicgKyB3aWR0aCArICdcIic7XHJcbiAgICAgICAgICAgIHJlc3VsdCArPSAnIGhlaWdodD1cIicgKyBoZWlnaHQgKyAnXCInO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzdWx0ICs9ICcgLz4nO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRmlyc3QsIGhhbmRsZSByZWZlcmVuY2Utc3R5bGUgbGFiZWxlZCBpbWFnZXM6ICFbYWx0IHRleHRdW2lkXVxyXG4gICAgdGV4dCA9IHRleHQucmVwbGFjZShyZWZlcmVuY2VSZWdFeHAsIHdyaXRlSW1hZ2VUYWcpO1xyXG5cclxuICAgIC8vIE5leHQsIGhhbmRsZSBpbmxpbmUgaW1hZ2VzOiAgIVthbHQgdGV4dF0odXJsID08d2lkdGg+eDxoZWlnaHQ+IFwib3B0aW9uYWwgdGl0bGVcIilcclxuICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoaW5saW5lUmVnRXhwLCB3cml0ZUltYWdlVGFnKTtcclxuXHJcbiAgICB0ZXh0ID0gZ2xvYmFscy5jb252ZXJ0ZXIuX2Rpc3BhdGNoKCdpbWFnZXMuYWZ0ZXInLCB0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKTtcclxuICAgIHJldHVybiB0ZXh0O1xyXG59KTtcclxuXHJcbnNob3dkb3duLnN1YlBhcnNlcignaXRhbGljc0FuZEJvbGQnLCBmdW5jdGlvbiAodGV4dCwgb3B0aW9ucywgZ2xvYmFscykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHRleHQgPSBnbG9iYWxzLmNvbnZlcnRlci5fZGlzcGF0Y2goJ2l0YWxpY3NBbmRCb2xkLmJlZm9yZScsIHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG5cclxuICAgIGlmIChvcHRpb25zLmxpdGVyYWxNaWRXb3JkVW5kZXJzY29yZXMpIHtcclxuICAgIC8vIHVuZGVyc2NvcmVzXHJcbiAgICAvLyBTaW5jZSB3ZSBhcmUgY29uc3VtaW5nIGEgXFxzIGNoYXJhY3Rlciwgd2UgbmVlZCB0byBhZGQgaXRcclxuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC8oXnxcXHN8PnxcXGIpX18oPz1cXFMpKFtcXHNcXFNdKz8pX18oPz1cXGJ8PHxcXHN8JCkvZ20sICckMTxzdHJvbmc+JDI8L3N0cm9uZz4nKTtcclxuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC8oXnxcXHN8PnxcXGIpXyg/PVxcUykoW1xcc1xcU10rPylfKD89XFxifDx8XFxzfCQpL2dtLCAnJDE8ZW0+JDI8L2VtPicpO1xyXG4gICAgICAgIC8vIGFzdGVyaXNrc1xyXG4gICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoLyhcXCpcXCopKD89XFxTKShbXlxccl0qP1xcU1sqXSopXFwxL2csICc8c3Ryb25nPiQyPC9zdHJvbmc+Jyk7XHJcbiAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSgvKFxcKikoPz1cXFMpKFteXFxyXSo/XFxTKVxcMS9nLCAnPGVtPiQyPC9lbT4nKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgLy8gPHN0cm9uZz4gbXVzdCBnbyBmaXJzdDpcclxuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC8oXFwqXFwqfF9fKSg/PVxcUykoW15cXHJdKj9cXFNbKl9dKilcXDEvZywgJzxzdHJvbmc+JDI8L3N0cm9uZz4nKTtcclxuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC8oXFwqfF8pKD89XFxTKShbXlxccl0qP1xcUylcXDEvZywgJzxlbT4kMjwvZW0+Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGV4dCA9IGdsb2JhbHMuY29udmVydGVyLl9kaXNwYXRjaCgnaXRhbGljc0FuZEJvbGQuYWZ0ZXInLCB0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKTtcclxuICAgIHJldHVybiB0ZXh0O1xyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBGb3JtIEhUTUwgb3JkZXJlZCAobnVtYmVyZWQpIGFuZCB1bm9yZGVyZWQgKGJ1bGxldGVkKSBsaXN0cy5cclxuICovXHJcbnNob3dkb3duLnN1YlBhcnNlcignbGlzdHMnLCBmdW5jdGlvbiAodGV4dCwgb3B0aW9ucywgZ2xvYmFscykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHRleHQgPSBnbG9iYWxzLmNvbnZlcnRlci5fZGlzcGF0Y2goJ2xpc3RzLmJlZm9yZScsIHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG4gICAgLyoqXHJcbiAgICogUHJvY2VzcyB0aGUgY29udGVudHMgb2YgYSBzaW5nbGUgb3JkZXJlZCBvciB1bm9yZGVyZWQgbGlzdCwgc3BsaXR0aW5nIGl0XHJcbiAgICogaW50byBpbmRpdmlkdWFsIGxpc3QgaXRlbXMuXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxpc3RTdHJcclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHRyaW1UcmFpbGluZ1xyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICovXHJcbiAgICBmdW5jdGlvbiBwcm9jZXNzTGlzdEl0ZW1zIChsaXN0U3RyLCB0cmltVHJhaWxpbmcpIHtcclxuICAgIC8vIFRoZSAkZ19saXN0X2xldmVsIGdsb2JhbCBrZWVwcyB0cmFjayBvZiB3aGVuIHdlJ3JlIGluc2lkZSBhIGxpc3QuXHJcbiAgICAvLyBFYWNoIHRpbWUgd2UgZW50ZXIgYSBsaXN0LCB3ZSBpbmNyZW1lbnQgaXQ7IHdoZW4gd2UgbGVhdmUgYSBsaXN0LFxyXG4gICAgLy8gd2UgZGVjcmVtZW50LiBJZiBpdCdzIHplcm8sIHdlJ3JlIG5vdCBpbiBhIGxpc3QgYW55bW9yZS5cclxuICAgIC8vXHJcbiAgICAvLyBXZSBkbyB0aGlzIGJlY2F1c2Ugd2hlbiB3ZSdyZSBub3QgaW5zaWRlIGEgbGlzdCwgd2Ugd2FudCB0byB0cmVhdFxyXG4gICAgLy8gc29tZXRoaW5nIGxpa2UgdGhpczpcclxuICAgIC8vXHJcbiAgICAvLyAgICBJIHJlY29tbWVuZCB1cGdyYWRpbmcgdG8gdmVyc2lvblxyXG4gICAgLy8gICAgOC4gT29wcywgbm93IHRoaXMgbGluZSBpcyB0cmVhdGVkXHJcbiAgICAvLyAgICBhcyBhIHN1Yi1saXN0LlxyXG4gICAgLy9cclxuICAgIC8vIEFzIGEgc2luZ2xlIHBhcmFncmFwaCwgZGVzcGl0ZSB0aGUgZmFjdCB0aGF0IHRoZSBzZWNvbmQgbGluZSBzdGFydHNcclxuICAgIC8vIHdpdGggYSBkaWdpdC1wZXJpb2Qtc3BhY2Ugc2VxdWVuY2UuXHJcbiAgICAvL1xyXG4gICAgLy8gV2hlcmVhcyB3aGVuIHdlJ3JlIGluc2lkZSBhIGxpc3QgKG9yIHN1Yi1saXN0KSwgdGhhdCBsaW5lIHdpbGwgYmVcclxuICAgIC8vIHRyZWF0ZWQgYXMgdGhlIHN0YXJ0IG9mIGEgc3ViLWxpc3QuIFdoYXQgYSBrbHVkZ2UsIGh1aD8gVGhpcyBpc1xyXG4gICAgLy8gYW4gYXNwZWN0IG9mIE1hcmtkb3duJ3Mgc3ludGF4IHRoYXQncyBoYXJkIHRvIHBhcnNlIHBlcmZlY3RseVxyXG4gICAgLy8gd2l0aG91dCByZXNvcnRpbmcgdG8gbWluZC1yZWFkaW5nLiBQZXJoYXBzIHRoZSBzb2x1dGlvbiBpcyB0b1xyXG4gICAgLy8gY2hhbmdlIHRoZSBzeW50YXggcnVsZXMgc3VjaCB0aGF0IHN1Yi1saXN0cyBtdXN0IHN0YXJ0IHdpdGggYVxyXG4gICAgLy8gc3RhcnRpbmcgY2FyZGluYWwgbnVtYmVyOyBlLmcuIFwiMS5cIiBvciBcImEuXCIuXHJcbiAgICAgICAgZ2xvYmFscy5nTGlzdExldmVsKys7XHJcblxyXG4gICAgICAgIC8vIHRyaW0gdHJhaWxpbmcgYmxhbmsgbGluZXM6XHJcbiAgICAgICAgbGlzdFN0ciA9IGxpc3RTdHIucmVwbGFjZSgvXFxuezIsfSQvLCAnXFxuJyk7XHJcblxyXG4gICAgICAgIC8vIGF0dGFja2xhYjogYWRkIHNlbnRpbmVsIHRvIGVtdWxhdGUgXFx6XHJcbiAgICAgICAgbGlzdFN0ciArPSAnfjAnO1xyXG5cclxuICAgICAgICB2YXIgcmd4ID0gLyhcXG4pPyheWyBcXHRdKikoWyorLV18XFxkK1suXSlbIFxcdF0rKChcXFsoeHxYfCApP10pP1sgXFx0XSpbXlxccl0rPyhcXG57MSwyfSkpKD89XFxuKih+MHxcXDIoWyorLV18XFxkK1suXSlbIFxcdF0rKSkvZ20sXHJcbiAgICAgICAgICAgIGlzUGFyYWdyYXBoZWQgPSAoL1xcblsgXFx0XSpcXG4oPyF+MCkvLnRlc3QobGlzdFN0cikpO1xyXG5cclxuICAgICAgICBsaXN0U3RyID0gbGlzdFN0ci5yZXBsYWNlKHJneCwgZnVuY3Rpb24gKHdob2xlTWF0Y2gsIG0xLCBtMiwgbTMsIG00LCB0YXNrYnRuLCBjaGVja2VkKSB7XHJcbiAgICAgICAgICAgIGNoZWNrZWQgPSAoY2hlY2tlZCAmJiBjaGVja2VkLnRyaW0oKSAhPT0gJycpO1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHNob3dkb3duLnN1YlBhcnNlcignb3V0ZGVudCcpKG00LCBvcHRpb25zLCBnbG9iYWxzKSxcclxuICAgICAgICAgICAgICAgIGJ1bGxldFN0eWxlID0gJyc7XHJcblxyXG4gICAgICAgICAgICAvLyBTdXBwb3J0IGZvciBnaXRodWIgdGFza2xpc3RzXHJcbiAgICAgICAgICAgIGlmICh0YXNrYnRuICYmIG9wdGlvbnMudGFza2xpc3RzKSB7XHJcbiAgICAgICAgICAgICAgICBidWxsZXRTdHlsZSA9ICcgY2xhc3M9XCJ0YXNrLWxpc3QtaXRlbVwiIHN0eWxlPVwibGlzdC1zdHlsZS10eXBlOiBub25lO1wiJztcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSBpdGVtLnJlcGxhY2UoL15bIFxcdF0qXFxbKHh8WHwgKT9dL20sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgb3RwID0gJzxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBkaXNhYmxlZCBzdHlsZT1cIm1hcmdpbjogMHB4IDAuMzVlbSAwLjI1ZW0gLTEuNmVtOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1wiJztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdHAgKz0gJyBjaGVja2VkJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgb3RwICs9ICc+JztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3RwO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gbTEgLSBMZWFkaW5nIGxpbmUgb3JcclxuICAgICAgICAgICAgLy8gSGFzIGEgZG91YmxlIHJldHVybiAobXVsdGkgcGFyYWdyYXBoKSBvclxyXG4gICAgICAgICAgICAvLyBIYXMgc3VibGlzdFxyXG4gICAgICAgICAgICBpZiAobTEgfHwgKGl0ZW0uc2VhcmNoKC9cXG57Mix9LykgPiAtMSkpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSBzaG93ZG93bi5zdWJQYXJzZXIoJ2dpdGh1YkNvZGVCbG9ja3MnKShpdGVtLCBvcHRpb25zLCBnbG9iYWxzKTtcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSBzaG93ZG93bi5zdWJQYXJzZXIoJ2Jsb2NrR2FtdXQnKShpdGVtLCBvcHRpb25zLCBnbG9iYWxzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIFJlY3Vyc2lvbiBmb3Igc3ViLWxpc3RzOlxyXG4gICAgICAgICAgICAgICAgaXRlbSA9IHNob3dkb3duLnN1YlBhcnNlcignbGlzdHMnKShpdGVtLCBvcHRpb25zLCBnbG9iYWxzKTtcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSBpdGVtLnJlcGxhY2UoL1xcbiQvLCAnJyk7IC8vIGNob21wKGl0ZW0pXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNQYXJhZ3JhcGhlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0gPSBzaG93ZG93bi5zdWJQYXJzZXIoJ3BhcmFncmFwaHMnKShpdGVtLCBvcHRpb25zLCBnbG9iYWxzKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbSA9IHNob3dkb3duLnN1YlBhcnNlcignc3BhbkdhbXV0JykoaXRlbSwgb3B0aW9ucywgZ2xvYmFscyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaXRlbSA9ICdcXG48bGknICsgYnVsbGV0U3R5bGUgKyAnPicgKyBpdGVtICsgJzwvbGk+XFxuJztcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGF0dGFja2xhYjogc3RyaXAgc2VudGluZWxcclxuICAgICAgICBsaXN0U3RyID0gbGlzdFN0ci5yZXBsYWNlKC9+MC9nLCAnJyk7XHJcblxyXG4gICAgICAgIGdsb2JhbHMuZ0xpc3RMZXZlbC0tO1xyXG5cclxuICAgICAgICBpZiAodHJpbVRyYWlsaW5nKSB7XHJcbiAgICAgICAgICAgIGxpc3RTdHIgPSBsaXN0U3RyLnJlcGxhY2UoL1xccyskLywgJycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGxpc3RTdHI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogQ2hlY2sgYW5kIHBhcnNlIGNvbnNlY3V0aXZlIGxpc3RzIChiZXR0ZXIgZml4IGZvciBpc3N1ZSAjMTQyKVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsaXN0XHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxpc3RUeXBlXHJcbiAgICogQHBhcmFtIHtib29sZWFufSB0cmltVHJhaWxpbmdcclxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICAqL1xyXG4gICAgZnVuY3Rpb24gcGFyc2VDb25zZWN1dGl2ZUxpc3RzKGxpc3QsIGxpc3RUeXBlLCB0cmltVHJhaWxpbmcpIHtcclxuICAgIC8vIGNoZWNrIGlmIHdlIGNhdWdodCAyIG9yIG1vcmUgY29uc2VjdXRpdmUgbGlzdHMgYnkgbWlzdGFrZVxyXG4gICAgLy8gd2UgdXNlIHRoZSBjb3VudGVyUmd4LCBtZWFuaW5nIGlmIGxpc3RUeXBlIGlzIFVMIHdlIGxvb2sgZm9yIFVMIGFuZCB2aWNlIHZlcnNhXHJcbiAgICAgICAgdmFyIGNvdW50ZXJSeGcgPSAobGlzdFR5cGUgPT09ICd1bCcpID8gL14gezAsMn1cXGQrXFwuWyBcXHRdL2dtIDogL14gezAsMn1bKistXVsgXFx0XS9nbSxcclxuICAgICAgICAgICAgc3ViTGlzdHMgPSBbXSxcclxuICAgICAgICAgICAgcmVzdWx0ID0gJyc7XHJcblxyXG4gICAgICAgIGlmIChsaXN0LnNlYXJjaChjb3VudGVyUnhnKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgKGZ1bmN0aW9uIHBhcnNlQ0wodHh0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcG9zID0gdHh0LnNlYXJjaChjb3VudGVyUnhnKTtcclxuICAgICAgICAgICAgICAgIGlmIChwb3MgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2xpY2VcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gJ1xcblxcbjwnICsgbGlzdFR5cGUgKyAnPicgKyBwcm9jZXNzTGlzdEl0ZW1zKHR4dC5zbGljZSgwLCBwb3MpLCAhIXRyaW1UcmFpbGluZykgKyAnPC8nICsgbGlzdFR5cGUgKyAnPlxcblxcbic7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGludmVydCBjb3VudGVyVHlwZSBhbmQgbGlzdFR5cGVcclxuICAgICAgICAgICAgICAgICAgICBsaXN0VHlwZSA9IChsaXN0VHlwZSA9PT0gJ3VsJykgPyAnb2wnIDogJ3VsJztcclxuICAgICAgICAgICAgICAgICAgICBjb3VudGVyUnhnID0gKGxpc3RUeXBlID09PSAndWwnKSA/IC9eIHswLDJ9XFxkK1xcLlsgXFx0XS9nbSA6IC9eIHswLDJ9WyorLV1bIFxcdF0vZ207XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlY3Vyc2VcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUNMKHR4dC5zbGljZShwb3MpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9ICdcXG5cXG48JyArIGxpc3RUeXBlICsgJz4nICsgcHJvY2Vzc0xpc3RJdGVtcyh0eHQsICEhdHJpbVRyYWlsaW5nKSArICc8LycgKyBsaXN0VHlwZSArICc+XFxuXFxuJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkobGlzdCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3ViTGlzdHMubGVuZ3RoOyArK2kpIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXN1bHQgPSAnXFxuXFxuPCcgKyBsaXN0VHlwZSArICc+JyArIHByb2Nlc3NMaXN0SXRlbXMobGlzdCwgISF0cmltVHJhaWxpbmcpICsgJzwvJyArIGxpc3RUeXBlICsgJz5cXG5cXG4nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhdHRhY2tsYWI6IGFkZCBzZW50aW5lbCB0byBoYWNrIGFyb3VuZCBraHRtbC9zYWZhcmkgYnVnOlxyXG4gICAgLy8gaHR0cDovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTEyMzFcclxuICAgIHRleHQgKz0gJ34wJztcclxuXHJcbiAgICAvLyBSZS11c2FibGUgcGF0dGVybiB0byBtYXRjaCBhbnkgZW50aXJlIHVsIG9yIG9sIGxpc3Q6XHJcbiAgICB2YXIgd2hvbGVMaXN0ID0gL14oKFsgXXswLDN9KFsqKy1dfFxcZCtbLl0pWyBcXHRdKylbXlxccl0rPyh+MHxcXG57Mix9KD89XFxTKSg/IVsgXFx0XSooPzpbKistXXxcXGQrWy5dKVsgXFx0XSspKSkvZ207XHJcblxyXG4gICAgaWYgKGdsb2JhbHMuZ0xpc3RMZXZlbCkge1xyXG4gICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2Uod2hvbGVMaXN0LCBmdW5jdGlvbiAod2hvbGVNYXRjaCwgbGlzdCwgbTIpIHtcclxuICAgICAgICAgICAgdmFyIGxpc3RUeXBlID0gKG0yLnNlYXJjaCgvWyorLV0vZykgPiAtMSkgPyAndWwnIDogJ29sJztcclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlQ29uc2VjdXRpdmVMaXN0cyhsaXN0LCBsaXN0VHlwZSwgdHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHdob2xlTGlzdCA9IC8oXFxuXFxufF5cXG4/KSgoWyBdezAsM30oWyorLV18XFxkK1suXSlbIFxcdF0rKVteXFxyXSs/KH4wfFxcbnsyLH0oPz1cXFMpKD8hWyBcXHRdKig/OlsqKy1dfFxcZCtbLl0pWyBcXHRdKykpKS9nbTtcclxuICAgICAgICAvLyB3aG9sZUxpc3QgPSAvKFxcblxcbnxeXFxuPykoIHswLDN9KFsqKy1dfFxcZCtcXC4pWyBcXHRdK1tcXHNcXFNdKz8pKD89KH4wKXwoXFxuXFxuKD8hXFx0fCB7Mix9fCB7MCwzfShbKistXXxcXGQrXFwuKVsgXFx0XSkpKS9nO1xyXG4gICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2Uod2hvbGVMaXN0LCBmdW5jdGlvbiAod2hvbGVNYXRjaCwgbTEsIGxpc3QsIG0zKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgbGlzdFR5cGUgPSAobTMuc2VhcmNoKC9bKistXS9nKSA+IC0xKSA/ICd1bCcgOiAnb2wnO1xyXG4gICAgICAgICAgICByZXR1cm4gcGFyc2VDb25zZWN1dGl2ZUxpc3RzKGxpc3QsIGxpc3RUeXBlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhdHRhY2tsYWI6IHN0cmlwIHNlbnRpbmVsXHJcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9+MC8sICcnKTtcclxuXHJcbiAgICB0ZXh0ID0gZ2xvYmFscy5jb252ZXJ0ZXIuX2Rpc3BhdGNoKCdsaXN0cy5hZnRlcicsIHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG4gICAgcmV0dXJuIHRleHQ7XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSBvbmUgbGV2ZWwgb2YgbGluZS1sZWFkaW5nIHRhYnMgb3Igc3BhY2VzXHJcbiAqL1xyXG5zaG93ZG93bi5zdWJQYXJzZXIoJ291dGRlbnQnLCBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIC8vIGF0dGFja2xhYjogaGFjayBhcm91bmQgS29ucXVlcm9yIDMuNS40IGJ1ZzpcclxuICAgIC8vIFwiLS0tLS0tLS0tLWJ1Z1wiLnJlcGxhY2UoL14tL2csXCJcIikgPT0gXCJidWdcIlxyXG4gICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXihcXHR8WyBdezEsNH0pL2dtLCAnfjAnKTsgLy8gYXR0YWNrbGFiOiBnX3RhYl93aWR0aFxyXG5cclxuICAgIC8vIGF0dGFja2xhYjogY2xlYW4gdXAgaGFja1xyXG4gICAgdGV4dCA9IHRleHQucmVwbGFjZSgvfjAvZywgJycpO1xyXG5cclxuICAgIHJldHVybiB0ZXh0O1xyXG59KTtcclxuXHJcbi8qKlxyXG4gKlxyXG4gKi9cclxuc2hvd2Rvd24uc3ViUGFyc2VyKCdwYXJhZ3JhcGhzJywgZnVuY3Rpb24gKHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB0ZXh0ID0gZ2xvYmFscy5jb252ZXJ0ZXIuX2Rpc3BhdGNoKCdwYXJhZ3JhcGhzLmJlZm9yZScsIHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG4gICAgLy8gU3RyaXAgbGVhZGluZyBhbmQgdHJhaWxpbmcgbGluZXM6XHJcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9eXFxuKy9nLCAnJyk7XHJcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cXG4rJC9nLCAnJyk7XHJcblxyXG4gICAgdmFyIGdyYWZzID0gdGV4dC5zcGxpdCgvXFxuezIsfS9nKSxcclxuICAgICAgICBncmFmc091dCA9IFtdLFxyXG4gICAgICAgIGVuZCA9IGdyYWZzLmxlbmd0aDsgLy8gV3JhcCA8cD4gdGFnc1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW5kOyBpKyspIHtcclxuICAgICAgICB2YXIgc3RyID0gZ3JhZnNbaV07XHJcbiAgICAgICAgLy8gaWYgdGhpcyBpcyBhbiBIVE1MIG1hcmtlciwgY29weSBpdFxyXG4gICAgICAgIGlmIChzdHIuc2VhcmNoKC9+KEt8RykoXFxkKylcXDEvZykgPj0gMCkge1xyXG4gICAgICAgICAgICBncmFmc091dC5wdXNoKHN0cik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc3RyID0gc2hvd2Rvd24uc3ViUGFyc2VyKCdzcGFuR2FtdXQnKShzdHIsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvXihbIFxcdF0qKS9nLCAnPHA+Jyk7XHJcbiAgICAgICAgICAgIHN0ciArPSAnPC9wPic7XHJcbiAgICAgICAgICAgIGdyYWZzT3V0LnB1c2goc3RyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFVuaGFzaGlmeSBIVE1MIGJsb2NrcyAqL1xyXG4gICAgZW5kID0gZ3JhZnNPdXQubGVuZ3RoO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGVuZDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGJsb2NrVGV4dCA9ICcnLFxyXG4gICAgICAgICAgICBncmFmc091dEl0ID0gZ3JhZnNPdXRbaV0sXHJcbiAgICAgICAgICAgIGNvZGVGbGFnID0gZmFsc2U7XHJcbiAgICAgICAgLy8gaWYgdGhpcyBpcyBhIG1hcmtlciBmb3IgYW4gaHRtbCBibG9jay4uLlxyXG4gICAgICAgIHdoaWxlIChncmFmc091dEl0LnNlYXJjaCgvfihLfEcpKFxcZCspXFwxLykgPj0gMCkge1xyXG4gICAgICAgICAgICB2YXIgZGVsaW0gPSBSZWdFeHAuJDEsXHJcbiAgICAgICAgICAgICAgICBudW0gPSBSZWdFeHAuJDI7XHJcblxyXG4gICAgICAgICAgICBpZiAoZGVsaW0gPT09ICdLJykge1xyXG4gICAgICAgICAgICAgICAgYmxvY2tUZXh0ID0gZ2xvYmFscy5nSHRtbEJsb2Nrc1tudW1dO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gd2UgbmVlZCB0byBjaGVjayBpZiBnaEJsb2NrIGlzIGEgZmFsc2UgcG9zaXRpdmVcclxuICAgICAgICAgICAgICAgIGlmIChjb2RlRmxhZykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVzZSBlbmNvZGVkIHZlcnNpb24gb2YgYWxsIHRleHRcclxuICAgICAgICAgICAgICAgICAgICBibG9ja1RleHQgPSBzaG93ZG93bi5zdWJQYXJzZXIoJ2VuY29kZUNvZGUnKShnbG9iYWxzLmdoQ29kZUJsb2Nrc1tudW1dLnRleHQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBibG9ja1RleHQgPSBnbG9iYWxzLmdoQ29kZUJsb2Nrc1tudW1dLmNvZGVibG9jaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBibG9ja1RleHQgPSBibG9ja1RleHQucmVwbGFjZSgvXFwkL2csICckJCQkJyk7IC8vIEVzY2FwZSBhbnkgZG9sbGFyIHNpZ25zXHJcblxyXG4gICAgICAgICAgICBncmFmc091dEl0ID0gZ3JhZnNPdXRJdC5yZXBsYWNlKC8oXFxuXFxuKT9+KEt8RylcXGQrXFwyKFxcblxcbik/LywgYmxvY2tUZXh0KTtcclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgZ3JhZnNPdXRJdCBpcyBhIHByZS0+Y29kZVxyXG4gICAgICAgICAgICBpZiAoL148cHJlXFxiW14+XSo+XFxzKjxjb2RlXFxiW14+XSo+Ly50ZXN0KGdyYWZzT3V0SXQpKSB7XHJcbiAgICAgICAgICAgICAgICBjb2RlRmxhZyA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZ3JhZnNPdXRbaV0gPSBncmFmc091dEl0O1xyXG4gICAgfVxyXG4gICAgdGV4dCA9IGdyYWZzT3V0LmpvaW4oJ1xcblxcbicpO1xyXG4gICAgLy8gU3RyaXAgbGVhZGluZyBhbmQgdHJhaWxpbmcgbGluZXM6XHJcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9eXFxuKy9nLCAnJyk7XHJcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cXG4rJC9nLCAnJyk7XHJcbiAgICByZXR1cm4gZ2xvYmFscy5jb252ZXJ0ZXIuX2Rpc3BhdGNoKCdwYXJhZ3JhcGhzLmFmdGVyJywgdGV4dCwgb3B0aW9ucywgZ2xvYmFscyk7XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIFJ1biBleHRlbnNpb25cclxuICovXHJcbnNob3dkb3duLnN1YlBhcnNlcigncnVuRXh0ZW5zaW9uJywgZnVuY3Rpb24gKGV4dCwgdGV4dCwgb3B0aW9ucywgZ2xvYmFscykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGlmIChleHQuZmlsdGVyKSB7XHJcbiAgICAgICAgdGV4dCA9IGV4dC5maWx0ZXIodGV4dCwgZ2xvYmFscy5jb252ZXJ0ZXIsIG9wdGlvbnMpO1xyXG5cclxuICAgIH0gZWxzZSBpZiAoZXh0LnJlZ2V4KSB7XHJcbiAgICAvLyBUT0RPIHJlbW92ZSB0aGlzIHdoZW4gb2xkIGV4dGVuc2lvbiBsb2FkaW5nIG1lY2hhbmlzbSBpcyBkZXByZWNhdGVkXHJcbiAgICAgICAgdmFyIHJlID0gZXh0LnJlZ2V4O1xyXG4gICAgICAgIGlmICghKHJlIGluc3RhbmNlb2YgUmVnRXhwKSkge1xyXG4gICAgICAgICAgICByZSA9IG5ldyBSZWdFeHAocmUsICdnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UocmUsIGV4dC5yZXBsYWNlKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGV4dDtcclxufSk7XHJcblxyXG4vKipcclxuICogVGhlc2UgYXJlIGFsbCB0aGUgdHJhbnNmb3JtYXRpb25zIHRoYXQgb2NjdXIgKndpdGhpbiogYmxvY2stbGV2ZWxcclxuICogdGFncyBsaWtlIHBhcmFncmFwaHMsIGhlYWRlcnMsIGFuZCBsaXN0IGl0ZW1zLlxyXG4gKi9cclxuc2hvd2Rvd24uc3ViUGFyc2VyKCdzcGFuR2FtdXQnLCBmdW5jdGlvbiAodGV4dCwgb3B0aW9ucywgZ2xvYmFscykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHRleHQgPSBnbG9iYWxzLmNvbnZlcnRlci5fZGlzcGF0Y2goJ3NwYW5HYW11dC5iZWZvcmUnLCB0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKTtcclxuICAgIHRleHQgPSBzaG93ZG93bi5zdWJQYXJzZXIoJ2NvZGVTcGFucycpKHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG4gICAgdGV4dCA9IHNob3dkb3duLnN1YlBhcnNlcignZXNjYXBlU3BlY2lhbENoYXJzV2l0aGluVGFnQXR0cmlidXRlcycpKHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG4gICAgdGV4dCA9IHNob3dkb3duLnN1YlBhcnNlcignZW5jb2RlQmFja3NsYXNoRXNjYXBlcycpKHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG5cclxuICAgIC8vIFByb2Nlc3MgYW5jaG9yIGFuZCBpbWFnZSB0YWdzLiBJbWFnZXMgbXVzdCBjb21lIGZpcnN0LFxyXG4gICAgLy8gYmVjYXVzZSAhW2Zvb11bZl0gbG9va3MgbGlrZSBhbiBhbmNob3IuXHJcbiAgICB0ZXh0ID0gc2hvd2Rvd24uc3ViUGFyc2VyKCdpbWFnZXMnKSh0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKTtcclxuICAgIHRleHQgPSBzaG93ZG93bi5zdWJQYXJzZXIoJ2FuY2hvcnMnKSh0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKTtcclxuXHJcbiAgICAvLyBNYWtlIGxpbmtzIG91dCBvZiB0aGluZ3MgbGlrZSBgPGh0dHA6Ly9leGFtcGxlLmNvbS8+YFxyXG4gICAgLy8gTXVzdCBjb21lIGFmdGVyIF9Eb0FuY2hvcnMoKSwgYmVjYXVzZSB5b3UgY2FuIHVzZSA8IGFuZCA+XHJcbiAgICAvLyBkZWxpbWl0ZXJzIGluIGlubGluZSBsaW5rcyBsaWtlIFt0aGlzXSg8dXJsPikuXHJcbiAgICB0ZXh0ID0gc2hvd2Rvd24uc3ViUGFyc2VyKCdhdXRvTGlua3MnKSh0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKTtcclxuICAgIHRleHQgPSBzaG93ZG93bi5zdWJQYXJzZXIoJ2VuY29kZUFtcHNBbmRBbmdsZXMnKSh0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKTtcclxuICAgIHRleHQgPSBzaG93ZG93bi5zdWJQYXJzZXIoJ2l0YWxpY3NBbmRCb2xkJykodGV4dCwgb3B0aW9ucywgZ2xvYmFscyk7XHJcbiAgICB0ZXh0ID0gc2hvd2Rvd24uc3ViUGFyc2VyKCdzdHJpa2V0aHJvdWdoJykodGV4dCwgb3B0aW9ucywgZ2xvYmFscyk7XHJcblxyXG4gICAgLy8gRG8gaGFyZCBicmVha3M6XHJcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC8gICtcXG4vZywgJyA8YnIgLz5cXG4nKTtcclxuXHJcbiAgICB0ZXh0ID0gZ2xvYmFscy5jb252ZXJ0ZXIuX2Rpc3BhdGNoKCdzcGFuR2FtdXQuYWZ0ZXInLCB0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKTtcclxuICAgIHJldHVybiB0ZXh0O1xyXG59KTtcclxuXHJcbnNob3dkb3duLnN1YlBhcnNlcignc3RyaWtldGhyb3VnaCcsIGZ1bmN0aW9uICh0ZXh0LCBvcHRpb25zLCBnbG9iYWxzKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuc3RyaWtldGhyb3VnaCkge1xyXG4gICAgICAgIHRleHQgPSBnbG9iYWxzLmNvbnZlcnRlci5fZGlzcGF0Y2goJ3N0cmlrZXRocm91Z2guYmVmb3JlJywgdGV4dCwgb3B0aW9ucywgZ2xvYmFscyk7XHJcbiAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSgvKD86flQpezJ9KFtcXHNcXFNdKz8pKD86flQpezJ9L2csICc8ZGVsPiQxPC9kZWw+Jyk7XHJcbiAgICAgICAgdGV4dCA9IGdsb2JhbHMuY29udmVydGVyLl9kaXNwYXRjaCgnc3RyaWtldGhyb3VnaC5hZnRlcicsIHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0ZXh0O1xyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBTdHJpcCBhbnkgbGluZXMgY29uc2lzdGluZyBvbmx5IG9mIHNwYWNlcyBhbmQgdGFicy5cclxuICogVGhpcyBtYWtlcyBzdWJzZXF1ZW50IHJlZ2V4cyBlYXNpZXIgdG8gd3JpdGUsIGJlY2F1c2Ugd2UgY2FuXHJcbiAqIG1hdGNoIGNvbnNlY3V0aXZlIGJsYW5rIGxpbmVzIHdpdGggL1xcbisvIGluc3RlYWQgb2Ygc29tZXRoaW5nXHJcbiAqIGNvbnRvcnRlZCBsaWtlIC9bIFxcdF0qXFxuKy9cclxuICovXHJcbnNob3dkb3duLnN1YlBhcnNlcignc3RyaXBCbGFua0xpbmVzJywgZnVuY3Rpb24gKHRleHQpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL15bIFxcdF0rJC9tZywgJycpO1xyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBTdHJpcHMgbGluayBkZWZpbml0aW9ucyBmcm9tIHRleHQsIHN0b3JlcyB0aGUgVVJMcyBhbmQgdGl0bGVzIGluXHJcbiAqIGhhc2ggcmVmZXJlbmNlcy5cclxuICogTGluayBkZWZzIGFyZSBpbiB0aGUgZm9ybTogXltpZF06IHVybCBcIm9wdGlvbmFsIHRpdGxlXCJcclxuICpcclxuICogXlsgXXswLDN9XFxbKC4rKVxcXTogLy8gaWQgPSAkMSAgYXR0YWNrbGFiOiBnX3RhYl93aWR0aCAtIDFcclxuICogWyBcXHRdKlxyXG4gKiBcXG4/ICAgICAgICAgICAgICAgICAgLy8gbWF5YmUgKm9uZSogbmV3bGluZVxyXG4gKiBbIFxcdF0qXHJcbiAqIDw/KFxcUys/KT4/ICAgICAgICAgIC8vIHVybCA9ICQyXHJcbiAqIFsgXFx0XSpcclxuICogXFxuPyAgICAgICAgICAgICAgICAvLyBtYXliZSBvbmUgbmV3bGluZVxyXG4gKiBbIFxcdF0qXHJcbiAqICg/OlxyXG4gKiAoXFxuKikgICAgICAgICAgICAgIC8vIGFueSBsaW5lcyBza2lwcGVkID0gJDMgYXR0YWNrbGFiOiBsb29rYmVoaW5kIHJlbW92ZWRcclxuICogW1wiKF1cclxuICogKC4rPykgICAgICAgICAgICAgIC8vIHRpdGxlID0gJDRcclxuICogW1wiKV1cclxuICogWyBcXHRdKlxyXG4gKiApPyAgICAgICAgICAgICAgICAgLy8gdGl0bGUgaXMgb3B0aW9uYWxcclxuICogKD86XFxuK3wkKVxyXG4gKiAvZ20sXHJcbiAqIGZ1bmN0aW9uKCl7Li4ufSk7XHJcbiAqXHJcbiAqL1xyXG5zaG93ZG93bi5zdWJQYXJzZXIoJ3N0cmlwTGlua0RlZmluaXRpb25zJywgZnVuY3Rpb24gKHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgcmVnZXggPSAvXiB7MCwzfVxcWyguKyldOlsgXFx0XSpcXG4/WyBcXHRdKjw/KFxcUys/KT4/KD86ID0oWypcXGRdK1tBLVphLXolXXswLDR9KXgoWypcXGRdK1tBLVphLXolXXswLDR9KSk/WyBcXHRdKlxcbj9bIFxcdF0qKD86KFxcbiopW1wifCcoXSguKz8pW1wifCcpXVsgXFx0XSopPyg/Olxcbit8KD89fjApKS9nbTtcclxuXHJcbiAgICAvLyBhdHRhY2tsYWI6IHNlbnRpbmVsIHdvcmthcm91bmRzIGZvciBsYWNrIG9mIFxcQSBhbmQgXFxaLCBzYWZhcmlcXGtodG1sIGJ1Z1xyXG4gICAgdGV4dCArPSAnfjAnO1xyXG5cclxuICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UocmVnZXgsIGZ1bmN0aW9uICh3aG9sZU1hdGNoLCBsaW5rSWQsIHVybCwgd2lkdGgsIGhlaWdodCwgYmxhbmtMaW5lcywgdGl0bGUpIHtcclxuICAgICAgICBsaW5rSWQgPSBsaW5rSWQudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBnbG9iYWxzLmdVcmxzW2xpbmtJZF0gPSBzaG93ZG93bi5zdWJQYXJzZXIoJ2VuY29kZUFtcHNBbmRBbmdsZXMnKSh1cmwpOyAvLyBMaW5rIElEcyBhcmUgY2FzZS1pbnNlbnNpdGl2ZVxyXG5cclxuICAgICAgICBpZiAoYmxhbmtMaW5lcykge1xyXG4gICAgICAgICAgICAvLyBPb3BzLCBmb3VuZCBibGFuayBsaW5lcywgc28gaXQncyBub3QgYSB0aXRsZS5cclxuICAgICAgICAgICAgLy8gUHV0IGJhY2sgdGhlIHBhcmVudGhldGljYWwgc3RhdGVtZW50IHdlIHN0b2xlLlxyXG4gICAgICAgICAgICByZXR1cm4gYmxhbmtMaW5lcyArIHRpdGxlO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGl0bGUpIHtcclxuICAgICAgICAgICAgICAgIGdsb2JhbHMuZ1RpdGxlc1tsaW5rSWRdID0gdGl0bGUucmVwbGFjZSgvXCJ8Jy9nLCAnJnF1b3Q7Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMucGFyc2VJbWdEaW1lbnNpb25zICYmIHdpZHRoICYmIGhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgZ2xvYmFscy5nRGltZW5zaW9uc1tsaW5rSWRdID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBDb21wbGV0ZWx5IHJlbW92ZSB0aGUgZGVmaW5pdGlvbiBmcm9tIHRoZSB0ZXh0XHJcbiAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gYXR0YWNrbGFiOiBzdHJpcCBzZW50aW5lbFxyXG4gICAgdGV4dCA9IHRleHQucmVwbGFjZSgvfjAvLCAnJyk7XHJcblxyXG4gICAgcmV0dXJuIHRleHQ7XHJcbn0pO1xyXG5cclxuc2hvd2Rvd24uc3ViUGFyc2VyKCd0YWJsZXMnLCBmdW5jdGlvbiAodGV4dCwgb3B0aW9ucywgZ2xvYmFscykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGlmICghb3B0aW9ucy50YWJsZXMpIHtcclxuICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdGFibGVSZ3ggPSAvXlsgXFx0XXswLDN9XFx8Py4rXFx8LitcXG5bIFxcdF17MCwzfVxcfD9bIFxcdF0qOj9bIFxcdF0qKD86LXw9KXsyLH1bIFxcdF0qOj9bIFxcdF0qXFx8WyBcXHRdKjo/WyBcXHRdKig/Oi18PSl7Mix9W1xcc1xcU10rPyg/Olxcblxcbnx+MCkvZ207XHJcblxyXG4gICAgZnVuY3Rpb24gcGFyc2VTdHlsZXMoc0xpbmUpIHtcclxuICAgICAgICBpZiAoL146WyBcXHRdKi0tKiQvLnRlc3Qoc0xpbmUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnIHN0eWxlPVwidGV4dC1hbGlnbjpsZWZ0O1wiJztcclxuICAgICAgICB9IGVsc2UgaWYgKC9eLS0qWyBcXHRdKjpbIFxcdF0qJC8udGVzdChzTGluZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICcgc3R5bGU9XCJ0ZXh0LWFsaWduOnJpZ2h0O1wiJztcclxuICAgICAgICB9IGVsc2UgaWYgKC9eOlsgXFx0XSotLSpbIFxcdF0qOiQvLnRlc3Qoc0xpbmUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnIHN0eWxlPVwidGV4dC1hbGlnbjpjZW50ZXI7XCInO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcGFyc2VIZWFkZXJzKGhlYWRlciwgc3R5bGUpIHtcclxuICAgICAgICB2YXIgaWQgPSAnJztcclxuICAgICAgICBoZWFkZXIgPSBoZWFkZXIudHJpbSgpO1xyXG4gICAgICAgIGlmIChvcHRpb25zLnRhYmxlSGVhZGVySWQpIHtcclxuICAgICAgICAgICAgaWQgPSAnIGlkPVwiJyArIGhlYWRlci5yZXBsYWNlKC8gL2csICdfJykudG9Mb3dlckNhc2UoKSArICdcIic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGhlYWRlciA9IHNob3dkb3duLnN1YlBhcnNlcignc3BhbkdhbXV0JykoaGVhZGVyLCBvcHRpb25zLCBnbG9iYWxzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICc8dGgnICsgaWQgKyBzdHlsZSArICc+JyArIGhlYWRlciArICc8L3RoPlxcbic7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcGFyc2VDZWxscyhjZWxsLCBzdHlsZSkge1xyXG4gICAgICAgIHZhciBzdWJUZXh0ID0gc2hvd2Rvd24uc3ViUGFyc2VyKCdzcGFuR2FtdXQnKShjZWxsLCBvcHRpb25zLCBnbG9iYWxzKTtcclxuICAgICAgICByZXR1cm4gJzx0ZCcgKyBzdHlsZSArICc+JyArIHN1YlRleHQgKyAnPC90ZD5cXG4nO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGJ1aWxkVGFibGUoaGVhZGVycywgY2VsbHMpIHtcclxuICAgICAgICB2YXIgdGIgPSAnPHRhYmxlPlxcbjx0aGVhZD5cXG48dHI+XFxuJyxcclxuICAgICAgICAgICAgdGJsTGduID0gaGVhZGVycy5sZW5ndGg7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGJsTGduOyArK2kpIHtcclxuICAgICAgICAgICAgdGIgKz0gaGVhZGVyc1tpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGIgKz0gJzwvdHI+XFxuPC90aGVhZD5cXG48dGJvZHk+XFxuJztcclxuXHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNlbGxzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIHRiICs9ICc8dHI+XFxuJztcclxuICAgICAgICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IHRibExnbjsgKytpaSkge1xyXG4gICAgICAgICAgICAgICAgdGIgKz0gY2VsbHNbaV1baWldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRiICs9ICc8L3RyPlxcbic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRiICs9ICc8L3Rib2R5PlxcbjwvdGFibGU+XFxuJztcclxuICAgICAgICByZXR1cm4gdGI7XHJcbiAgICB9XHJcblxyXG4gICAgdGV4dCA9IGdsb2JhbHMuY29udmVydGVyLl9kaXNwYXRjaCgndGFibGVzLmJlZm9yZScsIHRleHQsIG9wdGlvbnMsIGdsb2JhbHMpO1xyXG5cclxuICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UodGFibGVSZ3gsIGZ1bmN0aW9uIChyYXdUYWJsZSkge1xyXG5cclxuICAgICAgICB2YXIgaSwgdGFibGVMaW5lcyA9IHJhd1RhYmxlLnNwbGl0KCdcXG4nKTtcclxuXHJcbiAgICAgICAgLy8gc3RyaXAgd3JvbmcgZmlyc3QgYW5kIGxhc3QgY29sdW1uIGlmIHdyYXBwZWQgdGFibGVzIGFyZSB1c2VkXHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRhYmxlTGluZXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgaWYgKC9eWyBcXHRdezAsM31cXHwvLnRlc3QodGFibGVMaW5lc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgIHRhYmxlTGluZXNbaV0gPSB0YWJsZUxpbmVzW2ldLnJlcGxhY2UoL15bIFxcdF17MCwzfVxcfC8sICcnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoL1xcfFsgXFx0XSokLy50ZXN0KHRhYmxlTGluZXNbaV0pKSB7XHJcbiAgICAgICAgICAgICAgICB0YWJsZUxpbmVzW2ldID0gdGFibGVMaW5lc1tpXS5yZXBsYWNlKC9cXHxbIFxcdF0qJC8sICcnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHJhd0hlYWRlcnMgPSB0YWJsZUxpbmVzWzBdLnNwbGl0KCd8JykubWFwKGZ1bmN0aW9uIChzKSB7IHJldHVybiBzLnRyaW0oKTsgfSksXHJcbiAgICAgICAgICAgIHJhd1N0eWxlcyA9IHRhYmxlTGluZXNbMV0uc3BsaXQoJ3wnKS5tYXAoZnVuY3Rpb24gKHMpIHsgcmV0dXJuIHMudHJpbSgpOyB9KSxcclxuICAgICAgICAgICAgcmF3Q2VsbHMgPSBbXSxcclxuICAgICAgICAgICAgaGVhZGVycyA9IFtdLFxyXG4gICAgICAgICAgICBzdHlsZXMgPSBbXSxcclxuICAgICAgICAgICAgY2VsbHMgPSBbXTtcclxuXHJcbiAgICAgICAgdGFibGVMaW5lcy5zaGlmdCgpO1xyXG4gICAgICAgIHRhYmxlTGluZXMuc2hpZnQoKTtcclxuXHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRhYmxlTGluZXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgaWYgKHRhYmxlTGluZXNbaV0udHJpbSgpID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmF3Q2VsbHMucHVzaChcclxuICAgICAgICAgICAgICAgIHRhYmxlTGluZXNbaV1cclxuICAgICAgICAgICAgICAgICAgICAuc3BsaXQoJ3wnKVxyXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHMudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocmF3SGVhZGVycy5sZW5ndGggPCByYXdTdHlsZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByYXdUYWJsZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCByYXdTdHlsZXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgc3R5bGVzLnB1c2gocGFyc2VTdHlsZXMocmF3U3R5bGVzW2ldKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcmF3SGVhZGVycy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBpZiAoc2hvd2Rvd24uaGVscGVyLmlzVW5kZWZpbmVkKHN0eWxlc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgIHN0eWxlc1tpXSA9ICcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGhlYWRlcnMucHVzaChwYXJzZUhlYWRlcnMocmF3SGVhZGVyc1tpXSwgc3R5bGVzW2ldKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcmF3Q2VsbHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIHJvdyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgaGVhZGVycy5sZW5ndGg7ICsraWkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzaG93ZG93bi5oZWxwZXIuaXNVbmRlZmluZWQocmF3Q2VsbHNbaV1baWldKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJvdy5wdXNoKHBhcnNlQ2VsbHMocmF3Q2VsbHNbaV1baWldLCBzdHlsZXNbaWldKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2VsbHMucHVzaChyb3cpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGJ1aWxkVGFibGUoaGVhZGVycywgY2VsbHMpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGV4dCA9IGdsb2JhbHMuY29udmVydGVyLl9kaXNwYXRjaCgndGFibGVzLmFmdGVyJywgdGV4dCwgb3B0aW9ucywgZ2xvYmFscyk7XHJcblxyXG4gICAgcmV0dXJuIHRleHQ7XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIFN3YXAgYmFjayBpbiBhbGwgdGhlIHNwZWNpYWwgY2hhcmFjdGVycyB3ZSd2ZSBoaWRkZW4uXHJcbiAqL1xyXG5zaG93ZG93bi5zdWJQYXJzZXIoJ3VuZXNjYXBlU3BlY2lhbENoYXJzJywgZnVuY3Rpb24gKHRleHQpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9+RShcXGQrKUUvZywgZnVuY3Rpb24gKHdob2xlTWF0Y2gsIG0xKSB7XHJcbiAgICAgICAgdmFyIGNoYXJDb2RlVG9SZXBsYWNlID0gcGFyc2VJbnQobTEpO1xyXG4gICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGNoYXJDb2RlVG9SZXBsYWNlKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRleHQ7XHJcbn0pO1xyXG5tb2R1bGUuZXhwb3J0cyA9IHNob3dkb3duO1xyXG4iXX0=