---
title: 小程序技术导航
date: 2021-02-06
sticky: 1
categories: 
	- applet
---
## 小程序更新
>小程序每次冷启动时，都会检查是否有更新版本，如果发现有新版本，将会异步下载新版本的代码包，并同时用客户端本地的包进行启动，即新版本的小程序需要等下一次冷启动才会应用上。
微信小程序有版本更新时，进入到小程序里面会自动更新，这种更新用户是无法感知到的。

弹框的形式提示更新：使用到的[更新管理器](https://developers.weixin.qq.com/miniprogram/dev/api/base/update/wx.getUpdateManager.html),
操作流程：
1. 判断当前的微信版本是否可以使用更新管理器，可以，继续，否则提示更新；
2. 弹框提示更新，点击确定，继续，否则自行处理
3. 监听更新回调，成功，重启；失败，提示自行处理
```js
module.exports = {
  /**
   * 检测小程序版本更新
   */
  autoUpdate: function () {
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      //1. 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(res => {
        if (res.hasUpdate) {
          //检测到新版本，需要更新，给出提示
          wx.showModal({
            title: '更新提示',
            content: '检测到新版本，是否下载新版本并重启小程序？',
            success: temp => {
              if (temp.confirm) {
                //2. 用户确定下载更新小程序，小程序下载及更新静默进行
                this.downLoadAndUpdate(updateManager)
              } else if (temp.cancel) {
                //用户点击取消按钮的处理，如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                wx.showModal({
                  title: '温馨提示~',
                  content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                  showCancel: false, //隐藏取消按钮
                  confirmText: "确定更新", //只保留确定更新按钮
                  success: res => {
                    if (res.confirm) {
                      //下载新版本，并重新应用
                      this.downLoadAndUpdate(updateManager)
                    }
                  }
                })
              }
            }
          })
        }
      })
      return
    }
    /**
     * 用户的微信版本过低，提示更新
     */
    wx.showModal({
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    })
  },

  /**
   * 下载小程序新版本并重启应用
   */
  downLoadAndUpdate: function (updateManager) {
    wx.showLoading({
      title: '正在更新版本'
    })
    //1. 新版本下载成功，重启小程序
    updateManager.onUpdateReady(function () {
      wx.hideLoading()
      // 重启
      updateManager.applyUpdate()
    })
    //2. 新版本下载提示，提示手动重启
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '已经有新版本了哟~',
        content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
      })
    })
  },
}
```

## 地图坐标点转换
在一次项目中，客户提出一个问题
::: danger
我的位置在地图上显示的不对啊
:::
经过测试才发现，确实不对，而原因就出现小程序和后端使用的地图不一样。小程序使用的是自家地图（腾讯地图），而后端使用的是百度地图，这是造成位置显示不一样的原因。
::: tip
百度地图的使用BD09坐标，腾讯使用的是GCJ02坐标（中国正常坐标）

需要注意的是，小程序的map组件使用的经纬度是火星坐标系(GCJ02)，调用 wx.getLocation 接口需要指定 type 为 GCJ02
:::
所以需要将坐标点进行转换一下，代码如下：
```js
module.exports = {
  /**
   * 百度地图坐标点转换为腾讯地图(高德地图坐标点) e.g: (11.11, 111.11)
   * @param coordinate
   * @returns {Object}
   */
  convertTecentMap(lng, lat) {
    if (lng == '' && lat == '') {
      return {
        lng: '',
        lat: ''
      }
    }
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0
    var x = lng - 0.0065
    var y = lat - 0.006
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
    var qqlng = z * Math.cos(theta)
    var qqlat = z * Math.sin(theta)
    return {
      lng: qqlng,
      lat: qqlat
    }
  },

  /**
   * 腾讯地图坐标点(百度地图坐标点)转换为百度地图坐标点 e.g: (11.11, 111.11)
   * @param coordinate
   * @returns {Object}
   */
  convertBaiDuMap(lng, lat) {
    if (lng == '' && lat == '') {
      return {
        lng: '',
        lat: ''
      }
    }
    let pi = 3.14159265358979324 * 3000.0 / 180.0;
    let x = lng;
    let y = lat;
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * pi);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * pi);
    lng = z * Math.cos(theta) + 0.0065;
    lat = z * Math.sin(theta) + 0.006;
    return {
      lng: lng,
      lat: lat
    };
  }
};
```

## 复制文本到剪贴板
一次项目中遇到这种需求，要求实现点击文本复制到用户的剪贴板。解决这种需求也简单，小程序提供了相关的api，[传送门](https://developers.weixin.qq.com/miniprogram/dev/api/device/clipboard/wx.setClipboardData.html)
但是使用过程中需要注意一点：
::: tip
调用成功后，会弹出 toast 提示"内容已复制"，持续 1.5s
:::
也就是说成功之后必然会弹出提示框，而且内容必然是“内容已复制”，有没有觉得脑壳疼:smirk::smirk::smirk:

那么，如果我们要自己设置提示内容，应该怎么做？
1. 回调成功之后使用[wx.showToast](https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showToast.html)
```js
wx.setClipboardData({
	data: data,
	success(res) {
		wx.showToast({
			title: '订单号已复制'
		})
		// wx.getClipboardData({
		// 	success(res) {
		// 		console.log('复制到的单号==>', res.data) // data
		// 	}
		// })
	}
})
```
这种解决办法就是成功复制之后瞬间让官方的提示消失，显示自己的提示。很显然 ，有两种问题：
::: danger
1. 会显示两种提示，只是第一种提示瞬间消失，拼的就是手机的渲染性能
2. 无法让icon消失，因为icon消失很容易看出提示内容闪过，造成不好的体验
3. 某些用户群体无法使用这个api，需要另外处理（思路2）
:::
2. 不使用官方提供的接口，直接将要复制的内容文本用[\<text\>标签](https://developers.weixin.qq.com/miniprogram/dev/component/text.html)，设置user-select为true
用户自己手动长按复制，很显然，我实在没招了:sunglasses::sunglasses::sunglasses:

## js实现模糊搜索
有一次项目客户提出搜索功能，能够自动筛选相关联的数据。没错，就是很普通的模糊搜索，但是不同的是，这个功能在当时的项目中很简单，也没必要，后端不想写接口，我也不想调，
就自己直接在js中判断刷选。
```js
let searchRegex = new RegExp(this.result, 'i')
let searchList = []
list.forEach(item => {
	if (searchRegex.test(item.SIMNAME)) {
		searchList.push(item)
	}
})
```
很简单的一个小功能，接下来就是输入内容触发
```js
/**
 * 搜索内容
 * @param {Object} e
 */
input(e) {
	this.result = e.detail
	// 输入内容间隔200ms开始自动搜索
	if (this.timer) {
		clearTimeout(this.timer)
	}
	this.timer = setTimeout(() => {
		this.search()
	}, 200)
},
```

## 订阅消息
使用小程序的订阅消息，可以先了解一下[官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/subscribe-message.html)
根据步骤，我们小程序端需要完成的是步骤二，即询问用户，获取下发权限。完成这步操作，可以使用官方提供的[消息订阅接口](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/subscribe-message/wx.requestSubscribeMessage.html)

使用该api，需要一个模板id的参数，而这个参数就是在步骤一获取（在微信公众平台里面的订阅消息一栏配置）。使用起来很简单，但是还是有一些坑存在，这里记录一下：
::: danger
点击下方的总是之后不能够随心所欲的推送消息给用户
:::
关于这个问题，在社区里面已经有大佬解答了，[传送门](https://developers.weixin.qq.com/community/develop/article/doc/0006ac060e4e80183bc9654b856013)

这里直接摘抄重点，方便以后自己浏览
>2.8.2 版本开始，用户发生点击行为或者发起支付回调后，才可以调起订阅消息界面。

>「用户发生点击行为或者发起支付回调后，才可以调起订阅消息界面。」这就意味着你需要在用户主动点击某个组件是触发调用wx.requestSubscribeMessage方法再次订阅，订阅后，你才可以「为所欲为」推送一次模板消息，注意只能一次。下次再想推送时，需要用户再次点击触发wx.requestSubscribeMessage。

::: tip 解决办法
1. 使用永久性订阅消息
2. 使用服务号的模板消息替代
>比较常用的是使用公众号服务号的模板消息代替小程序的订阅消息功能，公众号的模板消息功能限制就比订阅号好多了，基本上可以「为所欲为」的推送。但是这个方案有个致命的运营成本：必须要用户关注公众号，还有小程序要跟公众号同一主体并绑定在开放平台下。同时开发成本有所增加，要采用unionId机制来打通小程序跟公众号的openId。
:::
在使用的过程中应该还会遇到一些问题，可以将报错信息打印出来，一一解决

## 骨架屏
小程序使用骨架屏，有几种简单实现的方法:
1. 如果小程序项目是使用外部的UI框架，可以尝试查找相关文档是否存在对应的骨架屏组件
2. 直接使用[骨架屏组件](https://developers.weixin.qq.com/community/develop/doc/00044a55f941000254687a3b85c006),网上还有很多种类似的骨架屏组件，我只是选择了其中一个
3. 直接使用微信小程序自带的[骨架屏](https://developers.weixin.qq.com/miniprogram/dev/devtools/skeleton.html)，操作很简单，点击生成即可。但是会有一点麻烦，比如这个页面做了修改，就要重新再生成一次，直接替换倒也没什么，但是如果生成的骨架屏界面稍微做了修改，重新生成的话就要重新修改。

## 购物车小球
[传送门](./购物车小球.md)

## 优化透明渐变导航栏
[传送门](./优化透明渐变导航栏.md)

## 滑动日历
[传送门](./滑动日历.md)

## 下载保存文件到本地
[传送门](./下载保存文件到本地.md)

## 小程序海报生成工具
[传送门](!https://developers.weixin.qq.com/community/develop/article/doc/000e222d9bcc305c5739c718d56813)