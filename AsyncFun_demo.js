const asyncFun = require('./AsyncFun')



//----------------例子
 // Promise体内代码 自行修改。 注意: 最好写上 resolve() 
 // 没写时.自动在代码最后加入resolve() ,解决报错问题，但不建议这样使用，因为会发生不同步的问题。

function fun1(){
	new Promise(function(resolve, reject) {
		setTimeout(function() {
			console.log('--1-----')
			resolve() //必写
		}, 1000) 
	})
}
asyncFun.run(fun1);
asyncFun.run(function(){
	new Promise(function(resolve, reject) {
		setTimeout(function() {
			console.log('---2----')
			//没有加resolve所以，跟下面的一起执行
		}, 1000) 
		//自动添加resolve的位置。
	})
});
asyncFun.run(`function(){//可以用字符串的方式添加
	new Promise(function(resolve, reject) {
		setTimeout(function() {
			console.log('---3----')
			resolve();//程序执行完的标志
		}, 1000) 
	})
}`);
asyncFun.run(fun1);
