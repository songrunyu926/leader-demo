  /*
    Promise构造
    Promise.prototype.then
        promise实例所持有的值 要给对应回调的第一个参数
        then方法返回的promise所持有的值 跟onResolve,onReject的返回值有关
            onResolve,onReject 返回一个值(非Promise)  返回的新的Promise实例的值就是该返回值
            onResolve,onReject 返回一个Promise        返回的新的Promise实例的值 跟当前返回的这个Promise值保持一致
            onResolve,onReject 执行时报错             返回的新的Promise实例的值是失败的原因
    Promise.prototype.catch
            当失败状态的promise没有对应的onReject  我们就默认创建一个onReject=function(errMSg){throw new Error(errMSg)}
            当成功状态的promise没有对应的onResolve  我们就默认创建一个onResolve=function(val){return val}
*/

(function (w) {
    var PENDING = "pending" // promise实例的初始化状态
    var RESOLVED = "resolved" // promise实例的成功状态
    var REJECTED = "rejected" // promise实例的失败状态
//啦啦啦啦啦啦啦啦啦啦啦啦
    function MyPromise(exec) {
        var that = this; //劫持this
        this.state = PENDING;
        this.value = undefined;
        this.callBacks = [];

        function resolve(value) {
            that.state = RESOLVED
            that.value = value
            // 等promise状态确定时 将callBacks中的回调塞到异步队列中
            that.callBacks.forEach(function (item) {
                setTimeout(function () {
                    item.onResolve()
                },0)
            })
        }
        function reject(errMsg) {
            that.state = REJECTED
            that.value = errMsg
            // 等promise状态确定时 将callBacks中的回调塞到异步队列中
            that.callBacks.forEach(function (item) {
                setTimeout(function () {
                    item.onReject()
                },0)
            })
        }

        try {
            exec(resolve,reject)
        }catch (e) {
            reject(e.message)
        }

        return this;
    }

    MyPromise.prototype.then = function(onResolve,onReject){
        var that = this;
        return new MyPromise(function (resolve,reject) {

            if(typeof onResolve !== "function"){
                onResolve = function (val) {
                    return val
                }
            }

            if(typeof onReject !== "function"){
                onReject = function (errMsg) {
                    throw new Error(errMsg)
                }
            }


            // 拿到onResolve 或 onReject的返回结果  根据这个返回结果来确定then返回的promise的状态
            function handleResult(callBack) {
               try{
                   // 实现了值的传递
                   var result = callBack(that.value);
                   if(result instanceof MyPromise){
                       result.then(function (val) {
                           resolve(val)
                       },function (errMsg) {
                           reject(errMsg)
                       })
                      //...
                   }else{
                       resolve(result)
                   }
               }catch (e) {
                   reject(e.message)
               }
            }

            if(that.state === PENDING){
                // 当前promise实例在调用then方法的时候 状态没有确定
                that.callBacks.push({
                    onResolve:function () {
                        handleResult(onResolve)
                    },
                    onReject:function () {
                        handleResult(onReject)
                    }
                })
            }else if(that.state === RESOLVED){
                // 当前promise实例在调用then方法的时候 状态已经确定为成功
                setTimeout(function () {
                    handleResult(onResolve)
                    // onResolve()
                },0)
            }else if(that.state === REJECTED){
                // 当前promise实例在调用then方法的时候 状态已经确定为失败
                setTimeout(function () {
                    handleResult(onReject)
                    // onReject()
                },0)
            }
        })
    }

    MyPromise.prototype.catch = function(onReject){
        return this.then(null,onReject)
    }

    w.MyPromise = MyPromise;
})(window)