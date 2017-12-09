// main function
import { Regs, toObject } from './utils'
import Resolver from './resolver'

if (!$) throw new Error('Error! This script need Zepto or jQuery.');
if ($.Components) console.warn('Error! "$.Components" will be redefined.');

$.Components = {};  // 缓存
let resolver = new Resolver();


/*
* main function
* @param {Object} options: 参数
*        {String} url: 组件
*        {Object} value: 变量
*        {Function} callback: 回调
*/
$.fn.renderComponent = function (options = {}) {
    var $t = $(this),
        _url, _value, _callback;

    _url = options.url || $t.attr('r-url');
    _value = options.value || $t.attr('r-value');
    _callback = options.callback;

    if (!_url) return false;

    if (_value) _value = toObject(_value);
    var cache = $.Components[_url];    //

    if (!cache) {   // 第一次请求
        $.Components[_url] = {
            tasks: []
        };
    } else {   // 有缓存
        if (!cache.ajaxError) {    // 非请求错误
            if (!cache.content) {   // 还没有缓存，存tasks
                $.Components[_url].tasks.push({ dom: $t, options: options });
                return -1
            }

            // 有缓存
            let _attrCtn = '',
                attr = cache.attr.name;
            if (cache.content.cssArr && cache.content.cssArr.length) {  // 有私有style缓存
                let _result,
                    _privateCss;

                _result = resolver.renderPrivateCss(cache.content.cssArr, attr);
                _privateCss = _result[0];
                _attrCtn = _result[1];

                if (_privateCss) $('head').append('<style>' + resolver.renderVar(_privateCss, _value) + '<\/style>');
            }
            $t.attr(attr, _attrCtn).html(resolver.renderHtml(cache.content.html, _value));

            if (_callback) _callback($t);
            return 1
        }
    }

    // 请求组件
    $.ajax({
        url: _url,
        success: function (htmldata) {
            let urlArr = _url.split('/');
            let attr = 'r-' + urlArr[urlArr.length - 1].split('.')[0];
            _value['r-attr'] = attr;

            // css
            let result = resolver.fetchCss(htmldata),
                html = result[0],
                cacheHtml = result[0],
                css = result[1] + result[2],
                privateCss = resolver.renderPrivateCss(result[3], attr);

            let attrCtn = privateCss[1];
            css += privateCss[0];

            // html
            html = resolver.renderHtml(html, _value);

            // js
            let js = '';
            cacheHtml = cacheHtml.replace(Regs.js, '');
            html = html.replace(Regs.js, function (matches, jsdata) {
                if (jsdata) js = jsdata;
                return '';
            });

            if (css) $('head').append('<style>' + resolver.renderVar(css, _value) + '<\/style>');
            $t.attr(attr, attrCtn).html(html);
            if (js) $('body').append('<script>' + js + '<\/script>');

            $.Components[_url].content = {
                html: cacheHtml,
                cssArr: result[3]
            };
            $.Components[_url].attr = {
                name: attr,
                value: attrCtn
            };

            // callback
            if (_callback) _callback($t);

            // 组件渲染任务队列
            let tasks = $.Components[_url].tasks;
            if (tasks && tasks.length) {
                for (let i in tasks) {
                    tasks[i].dom.renderComponent(tasks[i].options);
                }

                $.Components[_url].tasks = [];
            }
        },
        error: function (err) {
            if ($.Components[_url].ajaxError) {
                console.log(`Warning! The component "${_url}" request failed.（${err.status}）`);
                return false;
            }
            if (~err.textStatus.indexOf('timeout') || err.readyState !== 4) {
                $.Components[_url].ajaxError = true;
                $t.renderComponent(options);
            }
        }
    });
};