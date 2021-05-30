---
title: 关于一些js的操作
date: 2021-02-07
sticky: 3
categories:
	- js
---
::: tip
本文记录自己在完成某种需求的而使用到的某些js操作
:::

<!-- more -->

## 上滚和下滚
这是在一次项目中提出的某个需求，需要实现点击按钮，列表页上滚和下滚
### 上滚
```js
document.getElementById('id').scrollTop -= 50
```
### 下滚
```js
document.getElementById('id').scrollTop += 50
```
既然上滚和下滚已经解决了，再一想，好像自动滚动也可以了
```js
/**
 * 自动上滚 
 */
this.timer = setInterval(() => {
  const preScrollTop = document.getElementById('id').scrollTop
  document.getElementById('id').scrollTop -= 2

  if (document.getElementById('id').scrollTop === preScrollTop) {
    clearInterval(this.timer)
  }
})

/**
 * 自动下滚
 */
this.timer = setInterval(() => {
  const preScrollTop = document.getElementById('id').scrollTop
  document.getElementById('id').scrollTop += 2

  if (document.getElementById('id').scrollTop === preScrollTop) {
    clearInterval(this.timer)
  }
})
```
再来给他一个停止滚动操作
```js
clearInterval(this.timer)
```

## 去除首尾空格
```js
let value = e.detail.value.textarea.replace(/(^\s*)|(\s*$)/g, '')
```

## 空值合并操作符
[传送门](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)
>空值合并操作符（??）是一个逻辑操作符，当左侧的操作数为 null 或者 undefined 时，返回其右侧操作数，否则返回左侧操作数。
```js
const nullValue = null;
const emptyText = ""; // 空字符串，是一个假值，Boolean("") === false
const someNumber = 42;

const valA = nullValue ?? "valA 的默认值";
const valB = emptyText ?? "valB 的默认值";
const valC = someNumber ?? 0;

console.log(valA); // "valA 的默认值"
console.log(valB); // ""（空字符串虽然是假值，但不是 null 或者 undefined）
console.log(valC); // 42
```

## 手机号校验规则
```js
/**
 * 校验手机号是否正确
 * @param {Object} phone
 */
validatePhone(phone) {
    if (!phone) {
        return '手机号不能为空'
    }
	
	const regex = /^1[3456789]\d{9}$/
	const matchResult = phone.match(regex)
	if (matchResult === null) {
	    return '手机号格式不正确'
	}
    return ''
}
```

## 身份证号校验
```js
/**
 * 校验身份证号是否正确
 * @param {Object} code
 */
IdCodeValid(code) {
    //身份证号合法性验证  
    //支持15位和18位身份证号  
    //支持地址编码、出生日期、校验位验证  
    var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
    };
    var row = true;
    var msg = "验证成功";

    if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(code)) {
        row = false,
            msg = "身份证号格式错误";
    } else if (!city[code.substr(0, 2)]) {
        row = false,
            msg = "身份证号地址编码错误";
    } else {
        //18位身份证需要验证最后一位校验位  
        if (code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)  
            //加权因子  
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位  
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            if (parity[sum % 11] != code[17].toUpperCase()) {
                row = false,
                    msg = "身份证号校验位错误";
            }
        }
    }
    return row;
}
```

