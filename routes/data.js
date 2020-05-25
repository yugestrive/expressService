import fs from 'fs'
import path from 'path'

import express from 'express'
import Mock from 'mockjs'

const router = express.Router();


const DATA_PATH = path.join(__dirname, '..', 'data')

function writeErrSend(res, data) {
    return res.send({
        code: 110,
        msg: '读取文件失败!',
        data: data
    })
}

function successSend(res, data) {
    return res.send({
        code: 0,
        msg: '请求成功!',
        data: data
    })
} 

function nullSend(res, msg) {
    return res.send({
        code: 120,
        msg: msg,
        data: []
    })
}

// 读取文件
router.get('/read', function(req, res, next) {
    var type = req.param('type') || ''
    const filename = `${type}.json`
    var filePath = path.join(DATA_PATH, filename)
    console.log('type:', type)
    fs.readFile(filePath, function(err, data) {
        if(err)  writeErrSend(res, err)
        var COUNT = 50
        var obj = []
        try {
            obj = JSON.parse(data.toString())
        } catch(e) {
            obj = []
        }
        if (obj.length > COUNT) obj = obj.slice(0, COUNT)
        successSend(res, obj)
    })
})

// 数据存储模块
router.get('/write', (req, res, next) => {
    var type = req.param('type') || ''
    var url = req.param('url') || ''
    var title = req.param('title') || ''
    var img = req.param('img') || ''

    if(!type || !url || !title || !img) nullSend(res, '传入字段为空!')
    // 读取文件
    const filename = `${type}.json`
    var filePath = path.join(DATA_PATH, filename)
    fs.readFile(filePath, function(err, data) {
        if(err) writeErrSend(res, err)
        var arr = JSON.parse(data.toString())
        var obj = {
            img: img,
            url: url,
            title: title,
            createTime: new Date().getTime()
        }
        arr.unshift(obj)
        // 写入文件
        var newData = JSON.stringify(arr)
        fs.writeFile(filePath, newData, function(err, data) {
            if(err) writeErrSend(res, err)
            successSend(res, data)
        })
    })
})

// 存储服务接口
router.post('write_config', function(req, res, next) {
    // TODO: 后期进行提交数据的验证
    // 防xss攻击， xss npm i xss
    // require('xss')
    // xss校验 var str = xss(name)
    var data = req.body.data
    var newData = JSON.stringify(JSON.parse(data))
    fs.writeFile(path.join(DATA_PATH, 'config.json'), newData, function(err, data) {
        if (err) writeErrSend(res, err)
        successSend(res, data)
    })

})

// 登录接口
router.post('/login', function(req, res, next) {
    // 获取拿到的用户名， 密码
    var userName = req.body.userName
    var passWord = req.body.passWord
    // 对用户名、密码进行校验， xss攻击、判空
    // 密码加密 md5(passWord + '随机数')
    // 加密过后，可以写入json文件
    if (userName === 'admin' && passWord === '123456') {
        req.session.user = { userName: userName }
        successSend()
    }
    return res.send({
        code: 0,
        msg: '登陆失败!'
    })

})

export default router