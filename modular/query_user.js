let express = require('express');
let app = express.Router();
let db = require('../utils/db')
const uuid = require('node-uuid');
var bodyParser = require('body-parser');

var urlencodeParser = bodyParser.urlencoded({ extended: false })



app.get('/friendsList', function(req, res) {
    db.query('select u.userId,u.`name`,f.friends_id FROM user as u INNER JOIN friends as f ON (u.userId=f.passive_user_id OR u.userId=f.active_user_id) WHERE (f.passive_user_id=? OR f.active_user_id=?) AND u.userId != ?', [req.query.userId, req.query.userId, req.query.userId], function(result, fields) {
        res.json({
            code: 200,
            data: result,
            message: '查询成功'
        });
    });
});


app.get('/searchUser', function(req, res) {
    db.query('select * FROM user WHERE username=?', [req.query.username], function(result, fields) {
        res.json({
            code: 200,
            data: result,
            message: '查询成功'
        });
    });
});


app.post('/addFriends', urlencodeParser, function(req, res) {

    const creatuuid = uuid.v1().replace(/-/g, '')
    console.log(req.body)
    db.query('INSERT INTO friends(friends_id,active_user_id,passive_user_id) VALUES(?,?,?)', [creatuuid, req.body.active_id, req.body.passive_id], function(result, fields) {
        res.json({
            code: 200,
            data: '',
            message: '好友添加成功'
        });
    });
});


module.exports = app;