# PC演示项目

## 简介
通用开发的SPA项目

JS部分：

- 基础库： 
    * DOM操作: [jquery](http://api.jquery.com)
    * 模块加载器: [esl](https://github.com/ecomfe/esl)
- MVC框架：
    * 开发工具: [edp](https://github.com/ecomfe/edp)
    * framework: [er](https://github.com/ecomfe/er)
    * 模板: [etpl](https://github.com/ecomfe/etpl) 

样式库：

使用 [LESS](http://lesscss.net/)，和基于`less`的工具库 [est](https://github.com/ecomfe/est) 提高开发效率


## 环境准备

1. 安装[node](http://nodejs.org/download/)；
1. 安装开发工具；

    npm install -g edp edp-build


## 开发调试

    edp ws start

访问url: 

    http://localhost:8118/


## 测试&上线构建
构建编译的命令：

    edp build -f
