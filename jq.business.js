//抽象
(function (global, $, _, doc) {
    /**
      * size=>弹出框大小
      * cols=>easyui的列
      * eventsMap=>事件dom方法名映射
      * Eles=>dom封装
      * params=>注册方法集合
      * data 存储的变量
      *f 需要立即执行的数组
    */
    var App = function (eventsMap, Eles,data,f,size, cols) {

        var self = this;
        this.dlg = size == null ? "" : new MyAppDialog(size.width, size.height);
        // this.cols =
        this.cols = cols==null?"": cols;
        this.Eles = Eles;
        this.eventsMap = eventsMap;
        this.data = data == null ? "" : data;
        this.fArray = f;
       // f.call(this);
    }


    App.prototype = {
        constructor: App,
        //jq对象的封装
        initializeElements: function () {
            var eles = this.Eles;
            for (var name in eles) {
                if (eles.hasOwnProperty(name)) {
                    this[name] = $(eles[name]);
                }
            }
        },
        init: function () {
            var self = this;
           
            this.initializeElements();
            this.bindEvent();
            //this.loadGrid();
           $(this.fArray).each(function (index, item) {
                self[item]();
            })
        },

        _scanEventsMap: function (maps) {
            var delegateEventSplitter = /^(\S+)\s*(.*)$/;
            var bind = this._delegate;
            for (var keys in maps) {
                if (maps.hasOwnProperty(keys)) {
                    var matchs = keys.match(delegateEventSplitter);
                    if (typeof maps[keys] === 'string') {

                        maps[keys] = this[maps[keys]].bind(this); //改变this的指向
                    }
                    bind(matchs[1], matchs[2], maps[keys]);
                }
            }
        },
        //事件绑定，默认委托在dom对象上
        _delegate: function (name, selector, func) {
            $(doc).on(name, selector, function (e) {
                func.apply(null,[e,$(this)])
            });
        },
       
        initializeOrdinaryEvents: function (maps) {
            this._scanEventsMap(maps);
        },
         //循环进行事件与dom的绑定
        bindEvent: function () {
            this.initializeOrdinaryEvents(this.eventsMap);
        },
        //具体事件业务方法的注册
        then: function (params) {
            var self = this;
            $.each(params, function (index, item) {
                self[item.name] = params[item.name]
            })

            return self;
        }
    }
    //组合继承
    //普通只使用jquery的页面
    //继承属性
    var onlyJqApp=function(eventsMap, Eles,data,f){

        App.apply(this,[eventsMap, Eles,data,f]);
    }
    //继承方法
    onlyJqApp.prototype=new App();


   //对window暴露构造函数
    global.App = App;
    global.onlyJqApp=onlyJqApp;

})(this, this.jQuery, this.ext, document)
