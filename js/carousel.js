

(function($){
	var Carousel = function(valueoptions){
		var self = this;
		var strDom = '<span class = "carousel-btn carousel-prev-btn"></span>'+
			'<span class = "carousel-btn carousel-next-btn"></span>';
		self.options = $.parseJSON($(valueoptions).find(".js-carousel").attr("data-settings"));
		self.obj = $(valueoptions).find(".js-carousel");
		this.carouselul = self.obj.find(".carousel-ul");
		this.carouselli = this.carouselul.find(".carousel-li");
		this.obj.append(strDom);//增加按钮控件
		this.carouselbtn = self.obj.find(".carousel-btn");
		this.defaults = {
			Height:Math.floor(0.5 * $(window).height()),//表示整个展示图片的区域高度
			Width:$(window).width(),///表示整个展示图片的区域宽度
			picHeight: Math.floor(0.5 * $(window).height()) ,//表示要图片展示的高度
			picWidth: Math.floor(0.5 * $(window).width()),//表示图片要展示的宽度
			scale:0.9,//表示相邻层次之间缩放倍数关系
			autoSpeed:2000,//表示自动播放的时间间隔(ms)
			autoDir:"left",//表示自动播放的方向
			changeSpeed:500,//表示图片改变位置的速率
			opacity:0.5,//表示相邻层次之间的透明倍数
			align:'middle',//表示图片展示的水平位置
			btntype:"hide"//表示按键显示方式
		};
		this.isOdd = false;
		this.isPress = true;
		this.prevBtn = self.obj.find(".carousel-prev-btn");
		this.nextBtn = self.obj.find(".carousel-next-btn");
		self.options = $.extend({}, self.defaults, self.options);

		self.initSizeInfo();
		self.initBtnType();
		self.setImgRange();

		self.timer = null;

		this.nextBtn.click(function(){
			if(self.isPress)
			self.imgRotateAminate("right");
		});

		this.prevBtn.click(function(){
			if(self.isPress)
			self.imgRotateAminate("left");
		});

		self.setAutoPlay();

		self.carouselbtn.hover(function(){
			self.resetAutoPlay();
		},function(){
			self.setAutoPlay();
		});
	};

	Carousel.prototype = {
		setImgRange:function(){//设置图片基本位置
			var self = this,
				imgRange = this.imgMaxRange,//设置z-index
				lefts = this.initleft,//第一帧的左坐标
				leftGapWidth = this.leftImgSize ? this.btnWidth / this.leftImgSize : 0,//第一帧左边的图片个数
				rightGapWidth = this.rightImgSize ? this.btnWidth / this.rightImgSize : 0,//第一帧右边的图片个数
				level = 0,//层数等级
				rightopacitylevel = 1,//右边初始透明数
				rightscale = 1,//右边缩放程度
				leftopacitylevel = Math.pow(self.options.opacity, self.leftImgSize),//左边初始透明数
				leftscale = Math.pow(self.options.scale, self.leftImgSize);//左边缩放程度



			this.liData.each(function(i){
				if(i <= self.rightImgSize){//设置右边的图片位置
					level = i;
					$(this).css({
						zIndex: i == 0 ? self.imgMaxRange + 3 : self.imgMaxRange - i + 1,
						left: lefts + level * rightGapWidth + self.options.picWidth * (1 - rightscale),
						opacity: rightopacitylevel,
						width: self.options.picWidth * rightscale,
						height: self.options.picHeight * rightscale,
						top: self.getTopPosition(self.options.picHeight * rightscale)
					});

					rightopacitylevel = rightopacitylevel * self.options.opacity;
					rightscale = rightscale * self.options.scale;
				}
				else{//设置左边的图片位置
					level = i - self.rightImgSize - 1;
					if(self.isOdd && i == self.rightImgSize + 1){//当为偶数时
						$(this).css({
							zIndex:0,
							left:self.initleft + self.options.picWidth * 0.5,
							width:0,
							height:0,
							top:self.getTopPosition(0)
						});
						return;
					}
					if(self.isOdd) level --;
					$(this).css({
						zIndex:i - self.imgMaxRange + 2,
						left: lefts - self.leftImgSize * leftGapWidth + level * leftGapWidth,
						opacity: leftopacitylevel,
						width:self.options.picWidth * leftscale,
						height:self.options.picHeight * leftscale,
						top:self.getTopPosition(self.options.picHeight * leftscale)
					});

					leftopacitylevel /= self.options.opacity;
					leftscale /= self.options.scale;
				}
			});

		},
		initSizeInfo:function(){//初始化
			//设计框架css样式
			var self = this;
			self.obj.css({
				width:self.options.Width,
				height:self.options.Height
			});
			self.carouselul.css({
				width:self.options.Width,
				height:self.options.Height
			});
			self.carouselli.css({
				width:self.options.picWidth,
				height:self.options.picHeight
			});

			self.btnWidth = (self.options.Width - self.options.picWidth) / 2;

			self.carouselbtn.css({
				width:self.btnWidth
			});

			self.liData = self.carouselli;

			self.imgSize = self.liData.size();//获取图片的数量	

			if(self.imgSize % 2 == 0) self.isOdd = true;//为偶数时设置
			
			self.leftImgSize = Math.floor(self.imgSize / 2);

			self.rightImgSize = self.imgSize - self.leftImgSize - 1;

			

			if(self.isOdd) self.leftImgSize --;//为偶数时调整左右个数

			self.imgMaxRange = Math.ceil(self.imgSize / 2);

			self.initleft = self.btnWidth;
		},

		getTopPosition:function(height){//得到图片展示的高度
			if(this.options.align === "middle"){
				return (this.options.Height - height) / 2;
			}
			else if(this.options.align === "top"){
				return 0;
			}
			else if(this.options.align === "bottom"){
				return this.options.Height - height;
			}
			else{
				return (this.options.Width - height) / 2;
			}
		},
		initBtnType:function(){//得到按键显示的方式
			var self = this;
			if(this.options.btntype === "show"){
				this.prevBtn.addClass('carousel-prev-btn-show');
				this.nextBtn.addClass('carousel-next-btn-show');
			}
			else{
				self.prevBtn.hover(function(){
					self.prevBtn.addClass('carousel-prev-btn-show');
				}, function(){
					self.prevBtn.removeClass('carousel-prev-btn-show');
				});
				self.nextBtn.hover(function(){
					self.nextBtn.addClass('carousel-next-btn-show');
				}, function(){
					self.nextBtn.removeClass('carousel-next-btn-show');
				});
			}
		},
		imgRotateAminate:function(type){//进行滚动
			this.isPress = false;
			var zIndexData = []; //用于消除zIndex动画产生的视觉差异
			var self = this;
			if(type === "right"){
				zIndexData.length = 0;//清空数组
				this.liData.each(function(){
					var _this = $(this),
						nextObj = _this.prev().get(0) ? _this.prev() : self.liData.last(),
						Width = nextObj.css("width"),
						Height = nextObj.css("height"),
						Opacity = nextObj.css("opacity"),
						Left = nextObj.css("left"),
						zIndex = nextObj.css("zIndex"),
						Top = nextObj.css("top");
						zIndexData.push(zIndex);//将数据加入数组
					$(this).animate({
						//zIndex:zIndex,
						width:Width,
						height:Height,
						opacity:Opacity,
						left:Left,
						top:Top
					}, self.options.changeSpeed,function(){
						self.isPress = true;

					});
				});
			}
			else if(type === "left"){
				zIndexData.length = 0;
				this.liData.each(function(){
					var _this = $(this),
						nextObj = _this.next().get(0) ? _this.next() : self.liData.first(),
						Width = nextObj.css("width"),
						Height = nextObj.css("height"),
						Opacity = nextObj.css("opacity"),
						Left = nextObj.css("left"),
						zIndex = nextObj.css("zIndex"),
						Top = nextObj.css("top");
						zIndexData.push(zIndex);//将数据加入数组
					$(this).animate({
						//zIndex:zIndex,
						width:Width,
						height:Height,
						opacity:Opacity,
						left:Left,
						top:Top
					}, self.options.changeSpeed, function(){
						self.isPress = true;
					});
				});
			}

			//对于zIndex进行瞬间调整
			this.liData.each(function(i){
				$(this).css({
					zIndex:zIndexData[i]
				});
			});
		},
		setAutoPlay:function(){//设置自动播放
			var self = this;
			self.timer = setInterval(function(){
				if(self.isPress)
				self.imgRotateAminate(self.options.autoDir);
			}, self.options.autoSpeed);
		},
		resetAutoPlay:function(){//重置自动播放
			clearInterval(this.timer);
		}
	};

	window['Carousel'] = Carousel;
})(jQuery);