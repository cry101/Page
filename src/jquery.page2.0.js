/* 
 *page plugin 2.0   2017-04-28 by cary
 */
/**
 * 将插件封装在一个闭包里面，防止外部代码污染  冲突
 */
(function ($) {
    /**
     * 定义一个插件 Plugin
     */
    var Page,
        privateMethod;  //插件的私有方法，也可以看做是插件的工具方法集

    /**
     * 这里是插件的主体部分
     * 这里是一个自运行的单例模式。
     * 这里之所以用一个 Plugin 的单例模式 包含一个 Plugin的类，主要是为了封装性，更好的划分代码块
     * 同时 也 方便区分私有方法及公共方法
     * PS：但有时私有方法为了方便还是写在了Plugin类里，这时建议私有方法前加上"_"
     */
    Page = (function () {

        /**
         * 插件实例化部分，初始化时调用的代码可以放这里
         * @param element 传入jq对象的选择器，如 $("#J_plugin").plugin() ,其中 $("#J_plugin") 即是 element
         * @param options 插件的一些参数神马的
         * @constructor
         */
        function Plugin(element, options) {
            //将dom jquery对象赋值给插件，方便后续调用
            this.$element = $(element);

            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.settings = $.extend({}, $.fn.page.defaults, options);
            //如果将参数设置在dom的自定义属性里，也可以这样写
            //this.settings = $.extend({}, $.fn.plugin.defaults, this.$element.data(), options);

            var opts = this.settings;
            var obj = this.$element;
            var _this = this;
            //初始化调用一下
            var obj = this.$element;
            var l = opts.totalPages;
            var n = opts.liNums;
            var active = opts.activeClass;
            var initPage = opts.initPage;
            var str = '';
            var str1 = '<li><a href="javascript:" class="' + active + '">1</a></li>';
            if (l > 1 && l < n + 1) {
                for (i = 2; i < l + 1; i++) {
                    str += '<li><a href="javascript:">' + i + '</a></li>';
                }
            } else if (l > n) {
                for (i = 2; i < n + 1; i++) {
                    str += '<li><a href="javascript:">' + i + '</a></li>';
                }
            }
            var dataHtml = '';
            if (opts.hasNext) {
                dataHtml += '<div class="next fr">' + opts.next + '</div>';
            }
            if (opts.hasLastPage) {
                dataHtml += '<div class="last fr">' + opts.lastPage + '</div>';
            }
            dataHtml += '<ul class="pagingUl">' + str1 + str + '</ul>';
            if (opts.hasFirstPage) {
                dataHtml += '<div class="first fr">' + opts.firstPage + '</div>';
            }
            if (opts.hasPrv) {
                dataHtml += '<div class="prv fr">' + opts.prv + '</div>';
            }

            obj.html(dataHtml).off('click');//防止插件重复调用时，重复绑定事件
            this.setPage(initPage);
            obj.on('click', '.next', function () {
                var pageshow = parseInt(obj.find('.' + active).html());
                var nums, flag;
                var a = n % 2;
                if (a == 0) {
                    //偶数
                    nums = n;
                    flag = true;
                } else if (a == 1) {
                    //奇数
                    nums = (n + 1);
                    flag = false;
                }
                if (pageshow >= l) {
                    return;
                } else if (pageshow > 0 && pageshow < nums / 2) {
                    //最前几项
                    $('.' + active).removeClass(active).parent().next().find('a').addClass(active);
                } else if ((pageshow > l - nums / 2 && pageshow < l && flag == false) || (pageshow > l - nums / 2 - 1 && pageshow < l && flag == true)) {
                    //最后几项
                    $('.' + active).removeClass(active).parent().next().find('a').addClass(active);
                } else {
                    $('.' + active).removeClass(active).parent().next().find('a').addClass(active);
                    _this._fpageShow(pageshow + 1);
                }
                opts.callBack(pageshow + 1);
            });
            obj.on('click', '.prv', function () {
                var pageshow = parseInt(obj.find('.' + active).html());
                var nums = _this._odevity(n);
                if (pageshow <= 1) {
                    return;
                } else if ((pageshow > 1 && pageshow <= nums / 2) || (pageshow -1 > l - nums / 2 && pageshow < l + 1)) {
                    //最前几项或最后几项
                    $('.' + active).removeClass(active).parent().prev().find('a').addClass(active);
                } else {
                    $('.' + active).removeClass(active).parent().prev().find('a').addClass(active);
	                _this._fpageShow(pageshow -1);
                }
                opts.callBack(pageshow - 1);
            });

            obj.on('click', '.first', function () {
                var activepage = parseInt(obj.find('.' + active).html());
                if (activepage <= 1) {
                    return
                }//当前第一页
                opts.callBack(1);
                _this._fpagePrv(0);
            });
            obj.on('click', '.last', function () {
                var activepage = parseInt(obj.find('.' + active).html());
                if (activepage >= l) {
                    return;
                }//当前最后一页
                opts.callBack(l);
                if (l > n) {
                    _this._fpageNext(n - 1);
                } else {
                    _this._fpageNext(l - 1);
                }
            });

            obj.on('click', 'li', function () {
                var $this = $(this);
                var pageshow = parseInt($this.find('a').html());
                var nums = _this._odevity(n);
                opts.callBack(pageshow);
                if (l > n) {
                    if (pageshow > l - nums / 2 && pageshow < l + 1) {
                        //最后几项
                        _this._fpageNext((n - 1) - (l - pageshow));
                    } else if (pageshow > 0 && pageshow < nums / 2) {
                        //最前几项
                        _this._fpagePrv(pageshow - 1);
                    } else {
                        _this._fpageShow(pageshow);
                    }
                } else {
                    $('.' + active).removeClass(active);
                    $this.find('a').addClass(active);
                }
            });

            //});
            
        }


        /**
         * 将插件所有函数放在prototype的大对象里
         * 插件的公共方法，相当于接口函数，用于给外部调用
         * @type {{}}
         */
        Plugin.prototype = {
            init: function () {
                var opts = this.settings;
                console.log(opts)
                
            },
            _fpageShow : function (activePage) {
                var obj = this.$element;
                var n = this.settings.liNums;
                var nums = this._odevity(n);
                var active = this.settings.activeClass;
                var pageStart = activePage - (nums / 2 - 1);
                var str1 = '';
                for (i = 0; i < n; i++) {
                    str1 += '<li><a href="javascript:" class="">' + (pageStart + i) + '</a></li>'
                }
                obj.find('ul').html(str1);
                obj.find('ul li').eq(nums / 2 - 1).find('a').addClass(active);
            },
            _fpagePrv : function (index) {
                var obj = this.$element;
                var n = this.settings.liNums;
                var l = this.settings.totalPages;
                var active = this.settings.activeClass;
                var str1 = '';
                if (l > n - 1) {
                    for (var i = 0; i < n; i++) {
                        str1 += '<li><a href="javascript:" class="">' + (i + 1) + '</a></li>'
                    }
                } else {
                    for (i = 0; i < l; i++) {
                        str1 += '<li><a href="javascript:" class="">' + (i + 1) + '</a></li>'
                    }
                }
                obj.find('ul').html(str1);
                obj.find('ul li').eq(index).find('a').addClass(active);
            },
            _fpageNext : function (index) {
                var obj = this.$element;
                var n = this.settings.liNums;
                var l = this.settings.totalPages;
                var active = this.settings.activeClass;
                var str1 = '';
                if (l > n - 1) {
                    for (i = l - (n - 1); i < l + 1; i++) {
                        str1 += '<li><a href="javascript:" class="">' + i + '</a></li>'
                    }
                    obj.find('ul').html(str1);
                    obj.find('ul li').eq(index).find('a').addClass(active);
                } else {
                    for (i = 0; i < l; i++) {
                        str1 += '<li><a href="javascript:" class="">' + (i + 1) + '</a></li>'
                    }
                    obj.find('ul').html(str1);
                    obj.find('ul li').eq(index).find('a').addClass(active);
                }
            },
            _odevity : function (n) {
                var a = n % 2;
                if (a == 0) {
                    //偶数
                    return n;
                } else if (a == 1) {
                    //奇数
                    return (n + 1);
                }
            },
            /*设置当前页 $("#page").page('setPage',13)*/
            setPage : function(index){
                var n = this.settings.liNums;
                var l = this.settings.totalPages;
                var a = (this._odevity(n))/2;
                if(index<a){
                    this._fpagePrv(index-1)
                }else if(index>(l-a)){
                    this._fpageNext((n - 1) - (l - index))
                }else{
                    this._fpageShow(index)
                }
                
            }
        };

        /*
        * 插件的私有方法
        */
        


        return Plugin;

    })();

    /**
     * 这里是将Plugin对象 转为jq插件的形式进行调用
     * 定义一个插件 plugin
     */
    $.fn.page = function (options,n) {
        return this.each(function () {
            var $me = $(this),
                instance = $me.data('page');
            if (!instance) {
                //将实例化后的插件缓存在dom结构里（内存里）
                $me.data('page', new Page(this, options));
            }

            /**
             * 优雅处： 如果插件的参数是一个字符串，则 调用 插件的 字符串方法。
             * 如 $('#id').plugin('doSomething') 则实际调用的是 $('#id).plugin.doSomething();
             * doSomething是刚才定义的接口。
             * 这种方法 在 juqery ui 的插件里 很常见。
             */
            if ($.type(options) === 'string') instance[options](n);
        });
    };

    /**
     * 插件的默认值
     */
    $.fn.page.defaults = {
        totalPages: 9,//总页数
        liNums: 5,//分页的数字按钮数(建议取奇数)
        initPage : 1,//初始页数
        activeClass: 'active',//active类
        firstPage: '首页',//首页按钮名称
        lastPage: '末页',//末页按钮名称
        prv: '«',//前一页按钮名称
        next: '»',//后一页按钮名称
        hasFirstPage: true,//是否有首页按钮
        hasLastPage: true,//是否有末页按钮
        hasPrv: true,//是否有前一页按钮
        hasNext: true,//是否有后一页按钮
        callBack: function (page) {
            //回掉，page选中页数
        }
    };

    /**
     * 优雅处： 通过data-xxx 的方式 实例化插件。
     * 这样的话 在页面上就不需要显示调用了。
     * 可以查看bootstrap 里面的JS插件写法
     */
    $(function () {
        return new Page($('[data-page]'));
    });
})(jQuery);

