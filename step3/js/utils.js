// utils

// 正则
let Regs = {
    variable: /{{(\S*)}}/g,
    list: /{{r-for="(\w*)"}}/g,
    css: /<style>(([\s\S])*?)<\/style>/,
    cssPrivate: /<style\s+private>(([\s\S])*?)<\/style>/,
    js: /<script>(([\s\S])*?)<\/script>/
};

// 去除两边空格
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};

// 删除多个空格、tab、换行
// @return {String} worked string
let removeSpaceAndLinebreak = (str) => {
    return str.replace(/(^\s*)|(\s*$)/g, '').replace(/\s\s/g, '').replace(/<\/?.+?>/g, '').replace(/[\r\n\t]/g, '');
};

// 随机8位字符串
// @return {String} string
let getRandomAttr = () => {
    return Math.random().toString(36).substr(2, 8);
};

// 转为Object（字符串）
let toObject = (item) => {
    if (typeof item === 'object') return item
    if (typeof item === 'string') {
        let result;

        try {
            result = JSON.parse(item);
        } catch(e) {
            eval('result=' + item);
        }
        return result;
    }
};

module.exports = { 
    Regs, 
    removeSpaceAndLinebreak, 
    getRandomAttr, 
    toObject 
};