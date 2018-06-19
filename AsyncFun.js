const scheduler = require('./dgt-scheduler')

//异步代码变同步代码
var AsyncFun = (function(){
	var task = [];
	var isRun = false;
	var data = {}; //从外部传来的变量。 如果出现未定义变量时，请在这里传参。 AsyncFun.data.xxxx

	var process = function (){
		if(task.length ===0) return;
		isRun = true;
		scheduler.add(function*() {
			
			if(task.length !==0){	
				var str = task[0].toString();
				var l = str.indexOf('{') +1
				var r = str.lastIndexOf('}')
				var code = str.substring(l, r);
				if(code.indexOf('resolve(') == -1){//代码中注释时出错，注释的代码也会被找到。 并执行以下语句，所以出错。
					code = code.substring(0, code.lastIndexOf('}'))
					code+= '\n resolve();})'; 
				} 
				// console.log(code)
				yield scheduler.waitPromise(eval(code));
				task.shift();
			}

			// console.log('----------')
			if(task.length !== 0 ) process();
			else isRun = false;
		})
	}
	var run = function (fn){
		if(typeof fn == undefined) return;
		else task.push(fn)
		if(task.length !==0 && !isRun){		
			process()
		}
	}
	var clear = function(){
		task = [];
	}

    return{
        run: run,
        clear: clear,
        data: data
    }
})();

module.exports = AsyncFun;


//----------------例子
 // Promise体内代码 自行修改。 注意: 最好写上 resolve() 
 // 没写时.自动在代码最后加入resolve() ,解决报错问题，但不建议这样使用，因为会发生不同步的问题。

// function fun1(){
// 	new Promise(function(resolve, reject) {
// 		setTimeout(function() {
// 			console.log('--1-----')
// 			resolve() //必写
// 		}, 1000) 
// 	})
// }
// AsyncFun.run(fun1);
// AsyncFun.run(function(){
// 	new Promise(function(resolve, reject) {
// 		setTimeout(function() {
// 			console.log('---2----')
// 			//没有加resolve所以，跟下面的一起执行
// 		}, 1000) 
// 		//自动添加resolve的位置。
// 	})
// });
// AsyncFun.run(`function(){//可以用字符串的方式添加
// 	new Promise(function(resolve, reject) {
// 		setTimeout(function() {
// 			console.log('---3----')
// 			resolve();//程序执行完的标志
// 		}, 1000) 
// 	})
// }`);
// AsyncFun.run(fun1);
