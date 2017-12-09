var path = require('path');
var webpack = require('webpack');
var myBanner = `
 基于Zepto || jQuery的组件
 $.fn.renderComponent
 @author: Micheal Wang
 @build time: 2017.12.05
 @github: https://github.com/MichealWayne/component/blob/master/step3/renderComponent.js
 @bolg: https://michealwayne.github.io/2017/12/04/%EF%BC%88Zepto-jQuery%EF%BC%893%E8%A1%8C%E4%BB%A3%E7%A0%81%E5%BC%80%E5%90%AF%E5%89%8D%E7%AB%AF%E7%BB%84%E4%BB%B6%E5%A4%8D%E7%94%A8%E4%B9%8B%E6%97%85%EF%BC%88%E4%BA%8C%EF%BC%89/
 
@param {Object} options: 调用参数
       {String} url: 组件路径 || DOM的r-url属性
       {Object} value: 变量 || DOM的r-value属性
       {Function} callback: 回调
@component usage：组件说明
    {{变量名}}：变量替换；
    {{r="列表变量名"}}...{{r-end}}：列表渲染；
    <style>...</style>: 影响主页面的css（可不加变量，only one）；
    <style private>...</style>：不影响主页面私有css（可加变量，only one）；
    <script>...</script>：组件js（只渲染一次）；
@cache explain: 缓存说明 $.Components
    key：组件标识（路径）；
        {Object} attr：组件属性
            {String} name: 组件名；
            {String} value: 组件标识（随机字符串）；
        {Object} content：组件内容
            {Array} cssArr：私有css数组；
            {String} html: html缓存；
        {Array} tasks: 任务队列；
        {Boolean || Undefined} ajaxError: 加载错误
`;

module.exports = {
	entry: {
        renderComponent: path.join(__dirname, 'js/index.js')
    },
	output: {
		path: path.join(__dirname),
		filename: '[name].js',
		publicPath: path.join(__dirname)
	},
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader', 
            query: { 
                presets: ['es2015'] 
            }
        }]
    },
    plugins: [
        new webpack.BannerPlugin(myBanner),
        new webpack.optimize.UglifyJsPlugin()
    ]
}