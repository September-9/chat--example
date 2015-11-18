var express=require('express');
var app=express();
var cookieParser = require('cookie-parser');
var http=require('http').Server(app);
var io=require('socket.io')(http);
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser());
var users={};
app.get('/',function(req,res){
	res.sendFile(__dirname +'/index.html');	
});

app.use(express.static('public'));

var userlist = {};
app.post('/login',function(req,res){
	res.cookie('user',req.body.name);
	res.redirect('/');
});

io.on('connection',function(socket){
	console.log('a user connected');
	
	socket.on('login',function(obj){
		socket.name=obj.username;
		if(!userlist[obj.username]){
			userlist[obj.username]=obj.username;
		}
		io.emit('login',{user:obj});
		//console.log(userlist);
		console.log(obj.username+'加入了聊天');
	});

	socket.on('disconnect',function(){
		if(userlist[socket.name]){
			delete userlist[socket.name];
		}
		socket.broadcast.emit('logout',{user:socket.name});
		console.log(socket.name+'退出了聊天');
	});

	socket.on('message',function(obj){
		socket.broadcast.emit('message',obj);
		console.log(obj);
		console.log(obj.uname+'说:'+obj.msg);
	});
});

http.listen(3000,function(){
	console.log('listening on *:3000');
});