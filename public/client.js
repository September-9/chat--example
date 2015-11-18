$(function(){
	var socket=io.connect();
	var usermsg={};
	function usernameSubmit(){
		var username=$('#username').val();
		usermsg.uname=username;
		if(username==''){
			alert('用户名不能为空!')
		}else{
			$('#username').val('');
			$('#loginbox').hide();
			$('#chatbox').show();
			$('#showname').html(username);
			init(username);
		}
	}
		
	$('.btn').click(function(){
		usernameSubmit();
	});

	$('#username').bind('keydown',function(event){
		if(event.keyCode==13){
			usernameSubmit();
		}
	});
	function scrollTo(){
		window.scrollTo(0,document.getElementById('messages').clientHeight);
	}
	function mesSubmit(){
		var content=$('#m').val();
		if(content == ''){
			alert('发送的信息不能为空！');
		}else{
			var nameDiv='<span>'+usermsg.uname+'</span>';
			var megDiv='<i>'+content+'</i>';
			var oP=document.createElement('p');
			oP.className='me';
			oP.innerHTML=nameDiv+megDiv;
			$('#messages').append(oP);
			$('#m').val('').focus();
			usermsg.msg=content;
		}
		socket.emit('message',usermsg);
		scrollTo();
	}

	$('.send').click(function(){
		mesSubmit();
	});
	$('#m').bind('keydown',function(event){
		if(event.keyCode==13){
			mesSubmit();
			return false;
			event.preventDefault();
		}
	});
	$('.logout').click(function(){
		location.reload();
	});
	function getUid(){
		var oDate=new Date();
		return oDate.getTime()+""+Math.floor(Math.random()*100);
	}
	function updateSysMeg(o,action){
		var user=o.user;
		var section=document.createElement('section');
		var html=(action=='login')?'加入了聊天':'退出了聊天';
		//var username=(action=='login')?o.user.username:o.user;
		section.innerHTML='<div class="tips"><span>'+o.user.username+'</span>'+html+'</div>';
		$('#messages').append(section);
		scrollTo();
		$('.ucount').html('当前共有<i>'+o.user.count+'</i>人在线');
	}
	function init(username){
		var uid=getUid();
		var username=username;

		socket.emit('login',{userid:uid,username:username});
		socket.on('login',function(o){
			updateSysMeg(o,'login');
		});

		socket.emit('disconnect',{userid:uid,username:username});
		socket.on('logout',function(o){
			updateSysMeg(o,'logout');
		});
		
		socket.on('message', function(usermsg){
			console.log(usermsg);
			var nameDiv='<span>'+usermsg.uname+'</span>';
			var megDiv='<i>'+usermsg.msg+'</i>';
			var oP=document.createElement('p');
			oP.innerHTML=nameDiv+megDiv;
			$('#messages').append(oP);
			scrollTo();
		});

	}
	
});