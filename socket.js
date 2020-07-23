var express = require('express');
var http = require('http');
var WebSocket = require('ws');

var qs = require('qs')

let db = require('./utils/db')
const uuid = require('node-uuid');


var app = express();
app.use(express.static(__dirname));

var server = http.createServer(app);
var wss = new WebSocket.Server({ server, path: '/wss' });


let connt = 0
let user_ws = {}
wss.on('connection', function(ws, req) {
    var userID = qs.parse(req.url.split('?')[1]).userId

    ws.userId = userID
    user_ws[userID] = ws

    ws.on('message', function(msg) {
        const data = JSON.parse(msg)

        if (data.type === 'private') {
            const creatuuid = uuid.v1().replace(/-/g, '')
            const sql = 'INSERT INTO personal_message_record(id,friends_id,send_user_id,receive_user_id,message) VALUES(?,?,?,?,?)'
            const value = [creatuuid, data.friendsId, data.userId, data.receive, data.text]
            db.query(sql, value, function(result, fields) {
                user_ws[data.receive].send(JSON.stringify({ message: data.text, name: data.name, send_user_id: ws.userId, type: data.type }))
                user_ws[data.userId].send(JSON.stringify({ message: data.text, name: data.name, send_user_id: ws.userId, type: data.type }))
            });
        } else if (data.type === 'group') {
            const creatuuid = uuid.v1().replace(/-/g, '')
            const sql = 'INSERT INTO group_message_record(id,send_user_id,message) VALUES(?,?,?)'
            const value = [creatuuid, data.userId, data.text]
            db.query(sql, value, function(result, fields) {
                for (var key in user_ws) {
                    user_ws[key].send(JSON.stringify({ message: data.text, name: data.name, send_user_id: ws.userId, type: data.type }))
                }
            });
        } else if (data.type === 'add') {
            user_ws[data.userId].send(JSON.stringify({ name: data.name, type: data.type }))
        }


    });

    ws.on("close", function(code, reason) {
        connt--
        console.log("关闭链接");
    });
});

server.listen(3001, function listening() {
    console.log('服务器启动成功！');
});