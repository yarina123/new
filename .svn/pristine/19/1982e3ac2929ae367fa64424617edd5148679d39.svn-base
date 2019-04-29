var http = 'http://122.14.196.167:81';
var websocket = 'ws://122.14.196.167:7272';
var http = 'http://localhost';
var websocket = 'ws://localhost:7272';

//用户未登陆跳转
//alert(isLogin());
//alert(localStorage.user_id);
if(localStorage.user_id == undefined && isLogin() == 1){
	location.href = 'login.html';
}
//用户是否登录，排除login和register页面
function isLogin(){
	var address = window.location.pathname;
	if(address.indexOf('login.html') > -1 || address.indexOf('register.html') > -1){
		return 0;
	}else{
		return 1;
	}
}
//获取url中的参数
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r != null) {
		return unescape(r[2]); 
	}
	return null; //返回参数值
}
//字符实体转换html
function char_entity_change(str){
	str = str.replace(/&lt;/g, '<');  
	str = str.replace(/&gt;/g, '>');  
	str = str.replace(/&quot;/g, '"');  
	str = str.replace(/&amp;/g, '&');  
	str = str.replace(/&#039;/g, "'");  
	return str;
}