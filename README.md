# autoxjs-demo
autoxjs 调试项目 具体功能为钉钉自动打卡测试

## 准备工作
1. autoxjs 开源地址 `https://github.com/kkevsekk1/AutoX`
2. vscode 调试 需要安装 `Auto.js-Autox.js-VSCodeExt`插件
3. 准备一台安卓手机, 安装`autoxjs`, apk下载地址 `https://github.com/kkevsekk1/AutoX/releases`

## 开始使用
1. autoxjs 自动化工作是基于手机的无障碍服务
2. 接口文档: `http://doc.autoxjs.com/`
3. vscode 安装完成上述插件之后, 可以通过 `ctrl+shift+p`输入`auto`查看提供的功能

## 工作流程
1. `ctrl+shift+p`->`autojs`开启服务
2. 打开手机的`Autox.js`应用
3. 打开`Autox.js菜单栏`->`无障碍服务`->`悬浮窗`->`连接电脑`
4. 编写js代码
5. F5 运行

## 问题总结
1. 如果设置定时运行脚本, 无法准时运行, 请打开 `允许后台运行`, 然后尝试在`Autoxjs`app内切换定时任务调度器进行调试