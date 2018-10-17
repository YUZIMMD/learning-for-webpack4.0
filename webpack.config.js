const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = {
  // 指定打包入口
  entry: './src/index.js',

  // 打包出口
  output: {
    path: path.resolve(__dirname, 'dist'), // 解析路径为 ./dist
    filename: '[name].[hash:8].js'
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
      }),
      new MiniCssExtractPlugin({
          filename:'[name].[hash:8].css',
          chunkFilename:'[name].[hash:8].css'
      }),
      new CleanWebpackPlugin(['dist'])
  ],
  module:{
    rules: [
        // ...
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: [require('autoprefixer')] // 添加css中的浏览器前缀
              }
            },
            'less-loader'
          ]
        },
        {
            test: /\.(png|jpg|gif)$/,
            use: [
              {
                loader: 'url-loader',
                options: {
                  outputPath: 'images/', //输出到images文件夹
                  limit: 500 //是把小于500B的文件打成Base64的格式，写入JS
                }
              }
            ]
        },
        {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader'
            }
          }
      ]
  },
  //提取公共部分代码
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          // 抽离自己写的公共代码
          chunks: 'initial',
          name: 'common', // 打包后的文件名，任意命名
          minChunks: 2, //最小引用2次
          minSize: 0 // 只要超出0字节就生成一个新包
        },
        styles: {
          name: 'styles', // 抽离公用样式
          test: /\.css$/,
          chunks: 'all',
          minChunks: 2,
          enforce: true
        },
        vendor: {
          // 抽离第三方插件
          test: /node_modules/, // 指定是node_modules下的第三方包
          chunks: 'initial',
          name: 'vendor', // 打包后的文件名，任意命名
          // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
          priority: 10
        }
      }
    }
  }
}
