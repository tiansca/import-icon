#!/usr/bin/env node
import fs from 'fs';
import path from "path";
import http from 'http'
import https from 'https'
// import config from './icon.config.json'
import { packageDirectory } from 'pkg-dir';
const __dirname = await packageDirectory()

let baseUrl = ''
let localPath = ''
let cssArr = []
let svgArr = []
let htmlPath = ''
let assetBasePath = ''
// 创建目录
function makeDir(dirPath) {
  return new Promise((resolve, reject) => {
    const pathTmp =  path.join(__dirname, dirPath)
    if (!fs.existsSync(pathTmp)) {
      console.log('pathTmp', pathTmp)
      if (!fs.mkdirSync(pathTmp)) {
        return resolve('创建失败');
      } else {
        return resolve();
      }
    } else {
      // deleteFolderFiles(dirPath)
    }
    resolve();
  })

}

/**
 *
 * @param {*} url  网络文件url地址
 * @param {*} fileName  文件名
 * @param {*} dir 下载到的目录
 */
async function getFileByUrl(url, fileName, dir) {
  return new Promise((resolve, reject) => {
    console.log("------------------------------------------------");
    console.log(`开始下载文件：${url}`);
    // const stream = fs.createWriteStream(path.join(dir, fileName));
    // request(url)
    //   .pipe(stream)
    //   .on("close", function (err) {
    //     console.log("文件" + fileName + "下载完毕");
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve();
    //     }
    //   });
    const get = url.indexOf('https') !== -1 ? https.get : http.get;
    get(url, (response) => {
      //data 存储图片数据，是二进制流
      var data = "";
      // 一定要设置encode，否则即使在pic/downImg/中有1.jpg,也是无法显示的
      response.setEncoding("binary")
      // 当数据到达时会触发data事件
      response.on('data', function (chunk) {
        data += chunk;
      });
      // 当数据接收完毕之后，会触发end事件
      response.on("end", function () {
        //写入文件
        fs.writeFile(path.join(__dirname, dir, fileName), data, 'binary', (err) => {
          if (err) {
            console.log('写入文件错误')
            reject(err);
          } else {
            console.log('写入文件成功')
            resolve()
          }
        })
      });
    }).on("error", function (err) {
      console.log('读取错误')
      reject(err || '读取错误');
    });
  });
}

// 向html中插入link标签
// @param {*} el  link标签字符串
function insertTag(el, target) {
  return new Promise((resolve, reject) => {
    // 读取html文件
    fs.readFile(htmlPath, "utf-8", function (err, dataStr) {
      if (err) return console.log("读取html文件失败", err);
      console.log('read file success!')
      if (dataStr.indexOf(el) !== -1) {
        console.log("link标签已存在");
        resolve("link标签已存在")
      } else {
        // 插入标签
        const index = dataStr.indexOf(target);
        if (index === -1) {
          console.log(`没有找到${target}标签`);
          resolve('`没有找到${target}标签`');
        } else {
          const newContent =
            dataStr.slice(0, index) + "    " + el + "\n" + dataStr.slice(index);
          fs.writeFile(htmlPath, newContent, function (err) {
            if (err) console.log("html write error!");
            console.log("html write success!");
            resolve();
          });
        }
      }
    });
  })
}

async function updateIconFile(name) {
  if (localPath) {
    // 创建目录
    const dir = path.join(localPath, name)
    await makeDir(dir);
    // 文件地址 url: `${baseUrl}${name}/${name}.css`,
    const typeArr = ["css", "eot", "woff2", "woff", "ttf", "svg"];
    const asyncTask = [];
    // 下载文件
    for (const type of typeArr) {
      const task = getFileByUrl(
        `${baseUrl}${name}/${name}.${type}`,
        `${name}.${type}`,
        dir
      );
      asyncTask.push(task);
    }
    await Promise.all(asyncTask);
    let filePath = path.join("/", localPath.replace("public", ""), name, `${name}.css`)
    if (assetBasePath !== "/") {
      filePath = assetBasePath + filePath
      // 将//或者\\替换为/
      filePath = filePath.replace(/\/\/|\\\\|\/\\|\\\//g, "/")
    }
    // 在index.html中插入link标签
    await insertTag(
      `<link rel="stylesheet" type="text/css" href="${filePath}">`,
      "</head>"
    );
  } else {
    // 插入线上css
    await insertTag(
      `<link rel="stylesheet" type="text/css" href="${baseUrl}${name}/${name}.css">`,
      "</head>"
    );
  }
}

// js部分
async function updateIconJs(name) {
  if (localPath) {
    // 创建目录
    const dir = path.join(localPath, name)
    console.log('dir', dir)
    await makeDir(dir);
    // 文件地址 url: `${baseUrl}${name}/${name}.css`,
    const typeArr = ["js"];
    const asyncTask = [];
    // 下载文件
    for (const type of typeArr) {
      const task = getFileByUrl(
        `${baseUrl}${name}/${name}.${type}`,
        `${name}.${type}`,
        dir
      );
      asyncTask.push(task);
    }
    await Promise.all(asyncTask);
    // 在index.html中插入link标签
    let filePath = path.join('/', localPath.replace("public", ""), name, `${name}.js`)
    if (assetBasePath !== "/") {
      filePath = assetBasePath + filePath
      console.log(filePath)
      // 将//或者\\替换为/
      filePath = filePath.replace(/\/\/|\\\\|\/\\|\\\//g, "/")
    }
    await insertTag(
      `<script rel="stylesheet" type="text/javascript" src="${filePath}"></script>`,
      "</body>"
    );
  } else {
    await insertTag(
      `<script rel="stylesheet" type="text/javascript" src="${baseUrl}${name}/${name}.js"></script>`,
      "</body>"
    );
  }

}

async function getConfig() {
  // 项目根目录
  const rootPath = await packageDirectory()
  const configPath = path.join(rootPath, 'icon.config.json')
  // 判断是否存在
  if (!fs.existsSync(configPath)) {
    console.log('请配置icon.config.js')
    // 创建配置文件
    const template = `
{
  "baseUrl": "",
  "localPath": "public/",
  "cssIcons": [],
  "jsIcons": [],
  "htmlPath": "index.html",
  "assetBasePath": "/"
}
    `
    fs.writeFileSync(configPath, template)
  }
  console.log('rootPath', rootPath)
  // 读取icon.config.js文件
  const data = fs.readFileSync(configPath, 'utf-8')
  // const data = await import('file://' + configPath)
  console.log('data', data)
  const config = JSON.parse(data)
  baseUrl = config.baseUrl
  localPath = config.localPath
  cssArr = config.cssIcons
  svgArr = config.jsIcons
  htmlPath = config.htmlPath
  assetBasePath = config.assetBasePath || '/'
  if (!baseUrl || (!cssArr && !svgArr) || !htmlPath) {
    console.log('请配置icon.config.js')
    throw new Error('请配置icon.config.js')
  }
}

async function doTask() {
  // 获取配置文件
  await getConfig()
  // 遍历图标字体库
  for (const item of cssArr) {
    await updateIconFile(item);
  }

// 遍历图标字体库
  for (const item of svgArr) {
    await updateIconJs(item);
  }
}
doTask();
