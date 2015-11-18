var app=require('express')();
var http=require('http').Server(app);
var io=require('socket.io')(http);

app.get('/',function(req,res){
	res.sendfile(__dirname +'/index.html');
});

var onlineUsers={};//在线用户
var onlineCount=0;//当前在线人数

io.on('connection',function(socket){//添加一个连接监听器
	console.log('a user connected');

	//监听新用户加入
	socket.on('login',function(obj){
		socket.name=obj.userid;
		if(!onlineUsers.hasOwnProperty(obj.userid)){
			onlineUsers[obj.userid]=obj.username;
			onlineCount++;//在线人数+1
		}
		//向所有客户端广播用户加入
		io.emit('login',{onlineUsers:onlineUsers,onlineCount:onlineCount,user:obj});
		console.log(obj.username+'加入聊天室');
	});
	//监听用户退出
	socket.on('disconnect',function(){
		//将退出的用户从在线列表中删除
		if(onlineUsers.hasOwnProperty(socket.name)){
			//退出用户信息
			var obj={userid:socket.name,username:onlineUsers[socket.name]};
			//删除
			delete onlineUsers[socket.name];
			onlineCount--;

			io.emit('logout',onlineUsers:onlineUsers,onlineCount:onlineUsers:onlineCount,user:obj);
			console.log(obj.username+'退出聊天室');
		}
	});

	//监听用户发布聊天内容
	socket.io('message',function(obj){
		io.emit('message',obj);
		console.log(obj.username+'说:'+obj.content);
	});
	
http.listen(3000,function(){
	console.log('listening on *:3000');
});
