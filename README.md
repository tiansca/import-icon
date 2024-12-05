# import icon

引入svg图标所需要的js和css文件

[English document](https://github.com/tiansca/import-icon/blob/main/README.EN.md)

## 安装
npm安装：
```shell
npm install import-icon
```



## 使用
在项目根目录新建一个配置文件icon.config.json

### 参数
1. baseUrl: 图标库地址
2. localPath: 保存图标文件的本地相对路径，若为空，则不下载图标文件，直接引入线上文件
3. cssIcons: 需要引入的css图标库名称
4. jsIcons: 需要引入的js图标库名称
5. htmlPath: index.html文件的相对路径

```json
{
  "baseUrl": "https://icon.tiansc.top/api/fonts/",
  "localPath": "public/",
  "cssIcons": [],
  "jsIcons": ["dibicon"],
  "htmlPath": "index.html"
}
```

配置package.json，新增命令
```json
{
  "scripts": {
    "icon": "import-icon"
  }
}
```

执行npm命令

```shell
npm run icon
```