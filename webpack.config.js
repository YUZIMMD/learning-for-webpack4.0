const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 指定打包入口
  entry: './src/index.js',

  // 打包出口
  output: {
    path: path.resolve(__dirname, 'dist'), // 解析路径为 ./dist
    filename: 'bundle.js'
  },
  plugins:[
      new HtmlWebpackPlugin({
          filename:'index.html',//配置输出文件名和路径
          template:'./public/index.html',//配置要被编译的html文件
          hash:true,
          //压缩=》production模式使用
          minify:{
              removeAttributeQuotes:true,//删除双引号
              collapseInlineTagWhitespace:true//折叠html为一行
          }
      })
  ],
  module:{
      rules:[
          {
              test:/\.css$/,
              include:[path.resolve(__dirname,'src')],
              use:['style-loader','css-loader']
          }
        ]
  }
}
