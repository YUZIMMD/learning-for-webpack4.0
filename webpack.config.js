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
  },
  //减少resolve的解析，配置别名
  resolve: {
    /**
     * alias: 别名的配置
     *
     * extensions: 自动解析确定的扩展,
     *    比如 import 'xxx/theme.css' 可以在extensions 中添加 '.css'， 引入方式则为 import 'xxx/theme'
     *    @default ['.wasm', '.mjs', '.js', '.json']
     *
     * modules 告诉 webpack 解析模块时应该搜索的目录
     *   如果你想要添加一个目录到模块搜索目录，此目录优先于 node_modules/ 搜索
     *   这样配置在某种程度上可以简化模块的查找，提升构建速度 @default node_modules 优先
     */
    alias: {
      '@': path.resolve(__dirname, 'src'),
      tool$: path.resolve(__dirname, 'src/utils/tool.js') // 给定对象的键后的末尾添加 $，以表示精准匹配
    },
    extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  }
}
