---
title: node学习经历
date: 2021-02-07
sticky: 2
categories:
	- node
---
::: tip
该文章仅为个人记录node的学习经历，内容基本上可以在官网上找到
:::

<!-- more -->

## 安装
在开始学习node之前，需要在官网上下载安装，具体的安装教程参考[廖雪峰官方网站](https://www.liaoxuefeng.com/wiki/1022910821149312/1023025597810528)
## 介绍
关于node的介绍，我就不写了，直接[传送门](http://nodejs.cn/learn/introduction-to-nodejs)
## 简单的node代码——hello word
记得大学第一次接触c++时，写的就是hello word，也忘了是看网上的教程还是老师教的。我也有点疑问，[为什么是hello word](https://zhidao.baidu.com/question/1900320957270641420.html)，但是管他呢，跟上就行:clown_face::clown_face::clown_face:

同样的，按着官网上的教程，开始我的第一个node代码——hello word
```js
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain;charset=utf-8');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
})
```
文件的命名自己决定，我就按照官网上命名成app.js，需要注意编码格式为utf-8，防止出现中文乱码，虽然举的例子不是中文。
>然后使用 node app.js 运行程序，访问 http://localhost:3000，你就会看到一个消息，写着“Hello World”。

>此代码首先引入了 Node.js http 模块。
>Node.js 具有出色的标准库，包括对网络的一流支持。
>http 的 createServer() 方法会创建新的 HTTP 服务器并返回它。
>服务器被设置为监听指定的端口和主机名。 当服务器就绪后，回调函数会被调用，在此示例中会通知我们服务器正在运行。
>每当接收到新的请求时，request 事件会被调用，并提供两个对象：一个请求（http.IncomingMessage 对象）和一个响应（http.ServerResponse 对象）。
>这两个对象对于处理 HTTP 调用至关重要。
>第一个对象提供了请求的详细信息。 在这个简单的示例中没有使用它，但是你可以访问请求头和请求数据。
>第二个对象用于返回数据给调用方。
## 记录学习
### 程序退出
1. 在控制台中使用ctrl+C将其关闭
2. 编程的形式：process.exit()
>这意味着任何待处理的回调、仍在发送中的任何网络请求、任何文件系统访问、或正在写入 stdout 或 stderr 的进程，所有这些都会被立即非正常地终止。
exit函数里面可以传一个整数，这个整数表示的是[退出码](http://nodejs.cn/api/process.html#process_exit_codes)；也可以设置process.exitCode属性
3. 发送 SIGTERM 信号，并使用进程的信号处理程序进行处理
简单的代码片段
```js
const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send('你好')
})

const server = app.listen(3000, () => console.log('服务器已就绪'))

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('进程已终止')
  })
})
```
::: tip
process是不需要’require‘，它是自动可用的
:::
>SIGKILL 是告诉进程要立即终止的信号，理想情况下，其行为类似于 process.exit()。
>SIGTERM 是告诉进程要正常终止的信号。它是从进程管理者（如 upstart 或 supervisord）等发出的信号。
可以从程序内部另一个函数中发送此信号:
```js
process.kill(process.pid, 'SIGTERM')
```
### 读取环境变量
process提供了dev属性，承载了在启动进程是设置的所有环境变量
```js
process.env.NODE_ENV // "development"
```
### 从命令行接受参数
当我们调用node程序的时候，可以传入任意数量的参数，参数可独立，也可具有键和值，如
```js
node app.js joe

// or

node app.js name=joe
```
传递的参数，我们可以通过process对象的argv属性，它是包含了所有命令行调用参数的数组，注意，是所有
>第一个参数是 node 命令的完整路径。
>第二个参数是正被执行的文件的完整路径。
>所有其他的参数从第三个位置开始。
```js
// 使用循环迭代所有的参数
process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`)
})

// 创建新的数组获取排除前两个参数的所有参数
const args = process.argv.slice(2)

// 参数没有索引名称
const args = process.argv.slice(2)
args[0]
```
### 从命令行接受输入
>从版本 7 开始，Node.js 提供了 [readline](http://nodejs.cn/api/readline.html) 模块来执行以下操作：每次一行地从可读流（例如 process.stdin 流，在 Node.js 程序执行期间该流就是终端输入）获取输入。
简单的代码示例：
```js
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

// question的第一个参数为input，按下回车，回调
readline.question(`你叫什么名字?`, name => {
  console.log(`你好 ${name}!`)
  readline.close()
})
```
可以使用[Inquirer.js 软件包](https://github.com/SBoudrias/Inquirer.js),提供了更完整，更抽象的解决方案
```js
// 安装
npm install inquirer

// 相关的示例代码
const inquirer = require('inquirer')

var questions = [
  {
    type: 'input',
    name: 'name',
    message: "你叫什么名字?"
  }
]

inquirer.prompt(questions).then(answers => {
  console.log(`你好 ${answers['name']}!`)
})
```
### 使用export
当我们想使用某个文件内的某个公开功能的时候，可以使用require导入，示例代码
```js
const library = require('./library')
```
>默认情况下，文件中定义的任何其他对象或变量都是私有的，不会公开给外界。
>这就是 [module](http://nodejs.cn/api/modules.html) 系统提供的 module.exports API 可以做的事。
node提供两种方式来公开文件的对象
1. 将对象赋值给 module.exports（这是模块系统提供的对象），这会使文件只导出该对象：
```js
const car = {
  brand: 'Ford',
  model: 'Fiesta'
}

module.exports = car
```
2. 将要导出的对象添加为exports属性，这种方式可以导出多个对象，函数和数据：
```js
/**
 * 导出
 */
const car = {
  brand: 'Ford',
  model: 'Fiesta'
}
exports.car = car

// or

exports.car = {
  brand: 'Ford',
  model: 'Fiesta'
}

/**
 * 导入
 */
const items = require('./items')
items.car

// or

const car = require('./items').car
```
### 搭建http服务器
引用一下官方简单的http服务器代码
```js
const http = require('http')

const port = 3000

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('你好世界\n')
})

server.listen(port, () => {
  console.log(`服务器运行在 http://${hostname}:${port}/`)
})
```
这里引用了[http模块](http://nodejs.cn/api/http.html)，端口指定为3000,设置statusCode属性为200表示响应成功
### 发送http请求
执行get请求
```js
const https = require('https')
const options = {
  hostname: 'nodejs.cn',
  port: 443,
  path: '/todos',
  method: 'GET'
}
const req = https.request(options, res => {
  console.log(`状态码: ${res.statusCode}`)

  res.on('data', d => {
    process.stdout.write(d)
  })
})
req.on('error', error => {
  console.error(error)
})
req.end()
```
执行其他请求（post/put/delete）
```js
const https = require('https')

const data = JSON.stringify({
  todo: '做点事情'
})

const options = {
  hostname: 'nodejs.cn',
  port: 443,
  path: '/todos',
  method: 'POST/PUT/DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}

const req = https.request(options, res => {
  console.log(`状态码: ${res.statusCode}`)

  res.on('data', d => {
    process.stdout.write(d)
  })
})

req.on('error', error => {
  console.error(error)
})

req.write(data)
req.end()
```

## 完整的node小程序项目
[github项目](https://github.com/heyushuo/mpvue-shop-node)

[有关小程序登录后端逻辑流程](https://github.com/BeijiYang/MinaJwtLoginLogout)

[有关koa对于异常处理的简单介绍](https://juejin.cn/post/6847902223138029581)

[koa中错误处理](https://www.cnblogs.com/zhanghaoblog/p/11707422.html)

## node代码部署到服务器上
[传送门](https://www.cnblogs.com/neromaycry/p/7072872.html)

## node项目接入七牛云存储资料
[代码相关](https://blog.csdn.net/liyi_mowu/article/details/86543622)

[eggjs结合七牛云对象存储实现文件上传功能](https://blog.csdn.net/twodogya/article/details/104724214?utm_medium=distribute.pc_relevant.none-task-blog-baidujs_title-0&spm=1001.2101.3001.4242)

[文档相关](https://developer.qiniu.com/kodo/1289/nodejs)

[关于node接入SDK以及文件上传的相关流程及代码](https://developer.qiniu.com/kodo/3828/node-js-v6)

[防止恶意文件上传的最佳实践](https://developer.qiniu.com/kodo/6323/prevent-malicious-file-upload-best-practices)

## koa中文文档
[传送门](https://koa.bootcss.com/)

## WebContainers
::: tip
[在浏览器本地运行node.js](https://segmentfault.com/a/1190000040050241)
:::

## node + koa 解决跨域问题
```js
app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*")
  ctx.set("Access-Control-Allow-Headers", "authorization")
  await next()
})
```
