let express = require('express');
let app = express.Router();
let db = require('../utils/db')
const uuid = require('node-uuid');
var bodyParser = require('body-parser');

var urlencodeParser = bodyParser.urlencoded({ extended: false })


app.post('/login', urlencodeParser, function(req, res) {
    if (!!req.body.username && !!req.body.password) {
        db.query('select * from user where username=?', [req.body.username], function(result, fields) {
            if (req.body.password === result[0].password) {
                res.json({
                    code: 200,
                    data: { name: result[0].name, userId: result[0].userId },
                    message: '登录成功'
                });
            } else {
                res.json({
                    code: 500,
                    data: [],
                    message: '登录失败'
                });
            }
        });
    } else {
        res.json({
            code: 300,
            data: [],
            message: '用户名和密码不能为空'
        });
    }
});

app.post('/reg', urlencodeParser, function(req, res) {
    const creatuuid = uuid.v1().replace(/-/g, '')
    var addSql = 'INSERT INTO user(userId,username,password,name) VALUES(?,?,?,?)';
    var addSqlParams = [creatuuid, req.body.username, req.body.password, req.body.name];


    if (!!req.body.username && !!req.body.password) {
        db.query('select * from user where username=?', [req.body.username], function(result, fields) {
            if (result.length === 0) {
                db.query(addSql, addSqlParams, function(result, fields) {
                    console.log('添加成功')
                    res.json({
                        code: 200,
                        data: { name: req.body.name, userId: creatuuid },
                        message: '注册成功！'
                    });
                })
            } else {
                res.json({
                    code: 500,
                    data: [],
                    message: '用户名已存在'
                });
            }
        });
    } else {

        res.json({
            code: 300,
            data: [],
            message: '用户名和密码不能为空'
        });
    }



})


module.exports = app;