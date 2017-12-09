// resolver
import { Regs, getRandomAttr } from './utils'
import Scaner from './scaner'

let scaner = new Scaner();

export default class Resolver {
    // 变量替换
    // @param {String} data: 要替换变量的字符串；
    // @parar {Object} varobj: 变量对象
    renderVar (data, varobj) {
        if (!varobj) return false;

        return data.replace(Regs.variable, (matches, param) => {
            let _param = param.trim();
            return varobj[_param] || '';
        });
    }

    // 渲染列表
    // @param {String} data: 替换列表的字符串
    // @parar {Object} varobj: 变量对象
    renderList (data, varobj) {
        if (!Regs.list.test(data)) return data;

        let _listKeys = [];
        let getListHtml = (key, html) => {  // key列表数组变量，html原html
            let _reg = new RegExp('{{r-for="' + key + '"}}([\\s\\S*]+?){{r-end}}');

            return html.replace(_reg, (matches, modulehtml) => {
                let _resultHtml = '';
                for (let i = 0; i < varobj[key].length; i++) {
                    _resultHtml += modulehtml.replace(Regs.variable, (_matches, arritem) => {
                        arritem = arritem.trim();
                        return (typeof varobj[key][i] == 'object' ? varobj[key][i][arritem] : varobj[key][i]) || ''
                    });
                }

                return _resultHtml;
            });
        }

        // get keys
        data.replace(Regs.list, (matches, key) => {
            _listKeys.push(key);
        });

        for (let i in _listKeys) {
            data = getListHtml(_listKeys[i], data);
        }

        return data;
    }

    // 提取css
    fetchCss (html) {
        let css = '',
            cssPrivate = '';

        // 公有style
        html = html.replace(Regs.css, (matches, cssdata) => {
            if (cssdata) css = cssdata;
            return '';
        });

        // 私有style
        let privateVarBool = false,
            privateVarArr = [];     // 是否有组件变量
        if (Regs.variable.test(html)) privateVarBool = true;

        html = html.replace(Regs.cssPrivate, (matches, cssdata) => {
            if (cssdata) {
                scaner.doCssScan({
                    data: cssdata,
                    handleStyle: (result) => {
                        let _selector = ('[{{r-attr}}] ' + result.selector).replace(',', ',[{{r-attr}}] ');

                        // push 私有style
                        if (privateVarBool && (Regs.variable.test(result.selector) || Regs.variable.test(result.content))) {
                            privateVarArr.push({ selector: _selector, content: result.content });
                            _selector = '';
                        } else {
                            cssPrivate += (_selector + '{' + result.content + '}');
                        }
                    }
                });
            }

            return  ''
        });

        return [html, css, cssPrivate, privateVarArr];
    }

    // 解析私有style数组
    renderPrivateCss (arr, attr) {
        if (!arr.length || !attr) return ''

        let css = '',
            _ctn = getRandomAttr();
        for (let i in arr) {
            css += arr[i].selector.replace(/{{r-attr}}/g, `${attr}="${_ctn}"`) + 
                    '{' + 
                        arr[i].content +
                    '\n}';
        }

        return [css, _ctn];
    }

    // 解析html
    renderHtml (html, varobj) {
        let _html = this.renderList(html, varobj);
        return this.renderVar(_html, varobj)
    }
}