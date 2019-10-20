$(function () {

    //初始化fullpage组件
    $(".container").fullpage({
        //配置参数
        sectionsColor: ["#fadd67", "#84a2d4", "#ef674d", "#ffeedd", "#d04759", "#84d9ed", "#8ac060"],
        //禁用内容垂直居中，让内容顶部对齐
        verticalCentered: false,
        //导航菜单显示 设置指示器 点容器
        navigation: true,
        // 监听完全进入某一屏幕的事件 调用回调函数
        afterLoad: function (link, index) {
            //index序号 从一开始 当前屏的序号
            //console.log(index);
            // 怎么去实现进入之后的动画 给大容器添加一个类 在这个类下面可以给需要做动画的元素添加动画属性
            $(".section").eq(index - 1).addClass("now");
        },
        // onLeave 离开某一页面时出发的事件
        onLeave: function (index, nextIndex, direction) {
            if (index == 2 && nextIndex == 3) {
                //第二页到第三页
                $('.section').eq(index - 1).addClass("leaved");
            } else if (index == 3 && nextIndex == 4) {
                $('.section').eq(index - 1).addClass("leaved");
            } else if (index == 5 && nextIndex == 6) {
                $('.section').eq(index - 1).addClass("leaved");
                $('.screen-06 .box').addClass('show');
            } else if (index == 6 && nextIndex == 7){
                //第六页到第七页
                $('.screen-07 .star img').each(function (index,ele) { 
                    $(ele).delay(index*500).fadeIn();
                 });
            }
        },
        // 组件初始化完毕或者插件内容渲染完毕，调用的回掉函数
        /*console.log(this);*/
        /*this没有api方法*/

        /*jquery插件初始的时候封装这个方法*/
        /*1.回想jquery插件的封装 $.fn.fullpage = function(){} */
        /*2.jquery本身没有的方法通过$.fn的方式追加方法  认为是插件方法*/
        /*3.例如：$.fn.src = function(){ return this.attr('src') } this 你选择谁this（jquery对象）执行谁 */
        /*点击更多切换下一页*/
        afterRender: function () {
            $(".more").on("click", function () {
                $.fn.fullpage.moveSectionDown();
            });

            //当第四屏的购物车动画结束之后 再来执行收货地址的动画
            $('.screen-04 .cart').on("transitionend", function () {
                $('.screen-04 .address').fadeIn(500).find("img:last").fadeIn(2000);
            });

            //第八屏动画
            // 1.让手跟着鼠标移动
            //2.点击按钮重来一次
            $(".screen-08").on('mousemove',function (e) { 
                $(this).find(".hand").css({
                    left:e.pageX-660,
                    top:e.pageY-40
                });
             }).find('.again').on('click',function () { 
                 /*2.点击再来一次重置动画跳回第一页*/
                /*动画怎么怎么进行的？*/
                /*2.1 加now  类*/
                /*2.2 加leaved  类*/
                /*2.3 加show 类*/
                $('.now,.leaved,.show').removeClass('now').removeClass('leaved').removeClass('show');
                /*2.4 加css属性  后果：加一个style属性*/
                /*2.5 用jquery方法  show() fadeIn() 后果：加一个style属性*/
                $('.content [style]').removeAttr('style');
                $.fn.fullpage.moveTo(1);
             });
        },
        //页面切换的时间 默认是700毫秒
        scrollingSpeed: 1000


    });
});
