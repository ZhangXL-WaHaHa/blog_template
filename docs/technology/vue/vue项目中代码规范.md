---
title: vue项目中代码规范
date: 2021-04-09
categories:
 - standard
 - vue
---
::: tip
文章记录当前我会经常出现的不规范情况，并不能囊括所有。详情的代码风格指南，可以在vue.js官网上查看，[传送门](https://v3.cn.vuejs.org/style-guide)
:::

## 列表渲染携带key值
这种错误一般都不会犯，但是会出现这一种情况，在vue2.0的时候，template标签上使用列表渲染，携带key值会报错，遇到这种问题，一般就是将key去掉，
相应的，我们在template的子节点上加上对应的key值即可。而在vue3.0，template标签上可以直接携带key值
```js
<template v-for="item in list">
  <div :key="item.id">...</div>
  <span :key="item.id">...</span>
</template>
```

## Attribute的排列顺序
一个元素中包含多个Attribute，大多数情况下我们会将每一个的Attribute撰写成多行，即每个Attribute一行，但是比较容易忽视的一点是Attribute的排列顺序，
这种会报一个warning的错误，可能我们不会去case一个warning，但在此还是记录一下：
::: 元素Attribute的排列顺序
> 定义(is) > 列表渲染 > 条件渲染 > 渲染修饰符（v-pre v-once） > id > 唯一的Attribute(key ref) > 双向绑定 > 普通的绑定或未绑定的attribute > 事件 > 内容（v-html v-text）
:::

::: 组件选项默认顺序
> 全局感知（name） > 模板依赖（components directives） > 组合（extends mixins provide/inject） > 接口(inheritAttrs props emits) > 组合式API(setup) > 本地状态（data computed）> 事件（watch 钩子函数） > 非响应式的property（methods） > 渲染（template render）
:::

## 关于scoped元素的使用
为了避免父组件的样式污染到子组件，我们便会在style标签添加scoped属性，但是需要注意到的一点是，在使用scoped属性的时候，我们尽量避免
使用元素选择器
> 为了给样式设置作用域，Vue 会为元素添加一个独一无二的 attribute，例如 data-v-f3f3eg9。然后修改选择器，使得在匹配选择器的元素中，只有带这个 attribute 才会真正生效 (比如 button[data-v-f3f3eg9])。

> 问题在于大量的元素和 attribute 组合的选择器 (比如 button[data-v-f3f3eg9]) 会比类和 attribute 组合的选择器慢，所以应该尽可能选用类选择器。