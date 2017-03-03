/*
data-settings='{
	"picHeight": 270,//表示要图片展示的高度
	"picWidth": 640,//表示图片要展示的宽度
	"Height":500,//表示整个展示图片的区域高度
	"Width":1000,//表示整个展示图片的区域宽度
	"scale":0.8,//表示相邻层次之间缩放倍数关系
	"changeSpeed":500,//表示图片改变位置的速率
	"autoDir":"right",//表示自动播放的方向
	"autoSpeed":2000,//表示自动播放的时间间隔(ms)
	"opacity": 0.7,//表示相邻层次之间的透明倍数
	"align":"middle",//表示图片展示的水平位置
	"btntype":"show"//表示按键显示方式
}'


如下类型的标签序列：
<div class = "js-carousel"
		data-settings='{
			"picHeight": 270,
			"picWidth": 640,
			"Height":500,
			"Width":1000,
			"scale":0.8,
			"changeSpeed":500,
			"autoDir":"right",
			"autoSpeed":2000,
			"opacity": 0.7,
			"align":"middle",
			"btntype":"hide"
		}'
	>
	<ul class = "carousel-ul">
		<li class = "carousel-li">
			<img src>
		</li>
	</ul>
	</div>

外用一个div容器包裹如上代码：
new Carousel(包裹容器的类名)即可调用实现
 */