$(function () {
	
	//内容高度
	$('#main').css('height', $('body').height() - 60 - 230 - 49 + 'px');
	//历史消息
	$.ajax({
		type: 'GET',
		url: http+'/chat-room/public/app/index/historyMessage',
		data:{room_id:getUrlParam('room_id')},
		dataType:'jsonp',
		jsonpCallback: 'jsonp_callback',
		success: function(data){
			console.log(data);
			if(data.code == 1){
				$.each(data.data , function(k,v){
					say(null,{nickname:v.nickname,photo:v.photo},char_entity_change(v.message),null);
					
				});
			}
			
		},
		error: function(xhr, type){
			console.log(xhr.responseText);
			mui.toast('data error');
		}
	});
	$('#content').keyup(function () {
		$('#send').addClass('mui-btn-success');
		$('#send').removeClass('send');
		if ($('#content').val() == '') {
			$('#send').addClass('send');
			$('#send').removeClass('mui-btn-success');
		}

	});
	// 创建websocket
	var ws, client_list = {};
	ws = new WebSocket(websocket);
	ws.onopen = function () {
		var login_data = {
			type: 'login',
			client_name: {
				user_id: localStorage.user_id,
				nickname: localStorage.nickname,
				photo: localStorage.photo
			},
			room_id: getUrlParam('room_id')
		};
		console.log("websocket握手成功，发送登录数据:" + JSON.stringify(login_data));
		ws.send(JSON.stringify(login_data));
	};
	ws.onmessage = function (e) {
		console.log(e.data);
		var data = JSON.parse(e.data);
		switch (data['type']) {
			// 服务端ping客户端
			case 'ping':
				ws.send('{"type":"pong"}');
				break;
				// 登录 更新用户列表
			case 'login':
				//{"type":"login","client_id":xxx,"client_name":"xxx","client_list":"[...]","time":"xxx"}
				//say(data['client_id'], data['client_name'],  data['client_name']+' 加入了聊天室', data['time']);
				if (data['client_list']) {
					client_list = data['client_list'];
				} else {
					client_list[data['client_id']] = data['client_name'];
				}

				console.log(client_list);
				//localStorage.client_list = JSON.stringify(client_list);
				//flush_client_list();
				console.log(data['client_name'] + "登录成功");
				break;
				// 发言
			case 'say':
				//{"type":"say","from_client_id":xxx,"to_client_id":"all/client_id","content":"xxx","time":"xxx"}
				say(data['from_client_id'], data['from_client_name'], data['content'], data['time']);
				break;
				// 用户退出 更新用户列表
			case 'logout':
				//{"type":"logout","client_id":xxx,"time":"xxx"}
				//say(data['from_client_id'], data['from_client_name'], data['from_client_name']+' 退出了', data['time']);
				delete client_list[data['from_client_id']];
				//localStorage.client_list = JSON.stringify(client_list);
				//flush_client_list();	

		}
	};
	// 关闭 websocket
	ws.onclose = function () {
		mui.toast("连接已关闭...");
	};
	//发送消息
	$('#send').click(function () {
		if($('#content').val() == ''){
			return false;
		}
		var say_data = {
			type: 'say',
			to_client_id: 'all',
			to_client_name: {
				user_id: localStorage.user_id,
				nickname: localStorage.nickname,
				photo: localStorage.photo
			},
			content: $('#content').val()
		};
		ws.send(JSON.stringify(say_data));
		$('#content').val('');
		$('#content').focus();
		$('#add').css({
			'display': 'inline'
		});
		$('#send').addClass('send');
		$('#send').removeClass('mui-btn-success');
	});
	// 发言
	function say(from_client_id, from_client_name, content, time) {
		var html = '';
		html += '<div class="msg">';
		html += '<div class="msg_img"><img src="' + from_client_name.photo + '" /></div>';
		html += '<div class="msg_content">';
		html += '<div class="msg_nickname">' + from_client_name.nickname + '</div>';
		html += '<div class="msg_msg">' + content + '</div>';
		html += '</div>';
		html += '</div>';
		/*
		if(from_client_name == localStorage.user_id){
			html = '<div>'+content+'</div>';
		}
		*/
		$('#main').append(html);
		$('#main').scrollTop(document.getElementById('main').scrollHeight);
	}
	// 下注记录表
	$('#record').click(function(){
		$.ajax({
			type: 'GET',
			url: http+'/chat-room/public/app/index/getLiveId',
			data:{room_id:getUrlParam('room_id')},
			dataType:'jsonp',
			jsonpCallback: 'jsonp_callback',
			success: function(data){
				console.log(data);
				if(data.code == 1){
					location.href = 'currentRecord.html?live_id='+data.data;
				}
				
			},
			error: function(xhr, type){
				console.log(xhr.responseText);
				mui.toast('data error');
			}
		});
	});
	//成员列表
	$('#member_info').click(function () {
		location.href = 'member-info.html?room_id=' + getUrlParam('room_id');
	});
	//显示下注键盘
	$("#footer .up .throw1").on('click',function(){
		$("#footer").hide();
		$('.down').show();
		getScore();
	});
	//隐藏下注键盘
	$('.down .throw1').on('click',function(){
		$("#footer").show();
		$('.down').hide();
	});
	//获取身上分
	function getScore(){
		$.ajax({
			type: 'GET',
			url: http+'/chat-room/public/app/index/getScore',
			data:{user_id:localStorage.user_id},
			dataType:'jsonp',
			jsonpCallback: 'jsonp_callback',
			success: function(data){
				console.log(data);
				if(data.code == 1){
					$('#score').text(data.data);
				}
				
			},
			error: function(xhr, type){
				console.log(xhr.responseText);
				mui.toast('data error');
			}
		});
	}
	/* 下注键盘 */
	//闲
	$('#xian').click(function(){
		$('#type').text($('#xian').text());
		$('#xian').addClass('active').parent().siblings('li').children('a').removeClass('active');
	});
	//和
	$('#he').click(function(){
		$('#type').text($('#he').text());
		$('#he').addClass('active').parent().siblings('li').children('a').removeClass('active');
	});
	//庄
	$('#zhuang').click(function(){
		$('#type').text($('#zhuang').text());
		$('#zhuang').addClass('active').parent().siblings('li').children('a').removeClass('active');
	});
	//闲对
	$('#xiandui').click(function(){
		$('#type').text($('#xiandui').text());
		$('#xiandui').addClass('active').parent().siblings('li').children('a').removeClass('active');
	});
	//庄对
	$('#zhuangdui').click(function(){
		$('#type').text($('#zhuangdui').text());
		$('#zhuangdui').addClass('active').parent().siblings('li').children('a').removeClass('active');
	});
	//双对
	$('#shuangdui').click(function(){
		$('#type').text($('#shuangdui').text());
		$('#shuangdui').addClass('active').parent().siblings('li').children('a').removeClass('active');
	});
	//三宝
	$('#sanbao').click(function(){
		$('#type').text($('#sanbao').text());
		$('#sanbao').addClass('active').parent().siblings('li').children('a').removeClass('active');
	});
	$('#del').click(function(){
		$('#xiazhu_score').text(0);
	});
	//数字1
	$('#num1').click(function(){
		if($('#xiazhu_score').text() == 0){
			$('#xiazhu_score').text($('#num1').text());
		}else{
			$('#xiazhu_score').text($('#xiazhu_score').text() + $('#num1').text());
		}
	});
	//数字2
	$('#num2').click(function(){
		if($('#xiazhu_score').text() == 0){
			$('#xiazhu_score').text($('#num2').text());
		}else{
			$('#xiazhu_score').text($('#xiazhu_score').text() + $('#num2').text());
		}
	});
	//数字3
	$('#num3').click(function(){
		if($('#xiazhu_score').text() == 0){
			$('#xiazhu_score').text($('#num3').text());
		}else{
			$('#xiazhu_score').text($('#xiazhu_score').text() + $('#num3').text());
		}
	});
	//数字4
	$('#num4').click(function(){
		if($('#xiazhu_score').text() == 0){
			$('#xiazhu_score').text($('#num4').text());
		}else{
			$('#xiazhu_score').text($('#xiazhu_score').text() + $('#num4').text());
		}
	});
	//数字5
	$('#num5').click(function(){
		if($('#xiazhu_score').text() == 0){
			$('#xiazhu_score').text($('#num5').text());
		}else{
			$('#xiazhu_score').text($('#xiazhu_score').text() + $('#num5').text());
		}
	});
	//数字6
	$('#num6').click(function(){
		if($('#xiazhu_score').text() == 0){
			$('#xiazhu_score').text($('#num6').text());
		}else{
			$('#xiazhu_score').text($('#xiazhu_score').text() + $('#num6').text());
		}
	});
	//数字7
	$('#num7').click(function(){
		if($('#xiazhu_score').text() == 0){
			$('#xiazhu_score').text($('#num7').text());
		}else{
			$('#xiazhu_score').text($('#xiazhu_score').text() + $('#num7').text());
		}
	});
	//数字8
	$('#num8').click(function(){
		if($('#xiazhu_score').text() == 0){
			$('#xiazhu_score').text($('#num8').text());
		}else{
			$('#xiazhu_score').text($('#xiazhu_score').text() + $('#num8').text());
		}
	});
	//数字9
	$('#num9').click(function(){
		if($('#xiazhu_score').text() == 0){
			$('#xiazhu_score').text($('#num9').text());
		}else{
			$('#xiazhu_score').text($('#xiazhu_score').text() + $('#num9').text());
		}
	});
	//数字0
	$('#num0').click(function(){
		if($('#xiazhu_score').text() == 0){
			$('#xiazhu_score').text(0);
		}else{
			$('#xiazhu_score').text($('#xiazhu_score').text() + $('#num0').text());
		}
	});
	//下注
	$('#xiazhu').click(function(){
		if($('#score').text() == 0){
			mui.toast('身上分数不够');
			return false;
		}
		if($('#type').text() == 0){
			mui.toast('请选择下注类型');
			return false;
		}
		if($('#xiazhu_score').text() == 0){
			mui.toast('下注分数不能为空');
			return false;
		}
		var say_data = {
			type: 'say',
			to_client_id: 'all',
			to_client_name: {
				user_id: localStorage.user_id,
				nickname: localStorage.nickname,
				photo: localStorage.photo,
				xiazhu:{type:$('#type').text(),score:$('#xiazhu_score').text()}
			},
			content: $('#type').text()+' '+$('#xiazhu_score').text()
			
		};
		ws.send(JSON.stringify(say_data));
		mui.toast('下注成功');
	});
	
});

