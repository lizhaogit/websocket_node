let express = require('express');
let app = express.Router();
let db = require('../utils/db')
const uuid = require('node-uuid');
var bodyParser = require('body-parser');

var urlencodeParser = bodyParser.urlencoded({ extended: false })

// 查询私人的聊天记录
app.get('/getPersonalMessage', function(req, res) {
    const sql = 'select b.send_user_id ,a.name,b.date,b.friends_id,b.message FROM user as a INNER JOIN personal_message_record as b ON a.userId=b.send_user_id WHERE b.friends_id=? order by date asc'
    const value = [req.query.friendsId]

    db.query(sql, value, function(result, fields) {
        res.json({
            code: 200,
            data: result,
            message: '消息查询成功'
        });
    });
});


// 查询群组的聊天记录
app.get('/getGroupMessage', function(req, res) {
    const sql = 'select b.send_user_id ,a.name,b.date,b.message FROM user as a INNER JOIN group_message_record as b ON a.userId=b.send_user_id order by date asc'
    const value = []

    db.query(sql, value, function(result, fields) {
        res.json({
            code: 200,
            data: result,
            message: '消息查询成功'
        });
    });
});

module.exports = app;