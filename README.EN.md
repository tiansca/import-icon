# import icon

This project is used to introduce the required JS and CSS files for SVG icons

[中文文档](https://github.com/tiansca/import-icon/blob/main/README.md)

## install
npm install：
```shell
npm install import-icon
```



## use
Create a new configuration file named 'icon.config.json' in the root directory of the project

### params
1. baseUrl: Icon Library Address 
2. Local relative path for saving icon files, if empty, do not download the icon file, directly into the online file 
3. cssIcons: The name of the CSS icon library that needs to be introduced 
4. jsIcons: The name of the JS Icon Library you need to import 
5. htmlPath: The relative path of the index.html file
6. assetBasePath: The base path for introducing icon libraries (script or link tags) defaults to "/"

```json
{
  "baseUrl": "https://icon.tiansc.top/api/fonts/",
  "localPath": "public/",
  "cssIcons": [],
  "jsIcons": ["dibicon"],
  "htmlPath": "index.html",
  "assetBasePath": "/"
}
```

Modify the configuration file and add commands
```json
{
  "scripts": {
    "icon": "import-icon"
  }
}
```


Execute npm command
```shell
npm run icon
```