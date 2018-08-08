//抽象
(function (global, $, _, doc) {
    /**
      * size=>弹出框大小
      * cols=>easyui的列
      * eventsMap=>事件dom方法名映射
      * Eles=>dom封装
      * params=>注册方法集合
    */
    var App = function (size, cols, eventsMap, Eles, params) {

        var self = this;
        this.dlg = new MyAppDialog(size.width, size.height);
        // this.cols =
        this.cols = cols;
        this.Eles = Eles;
        this.eventsMap = eventsMap;


    }


    App.prototype = {
        constructor: App,
        initializeElements: function () {
            var eles = this.Eles;
            for (var name in eles) {
                if (eles.hasOwnProperty(name)) {
                    this[name] = $(eles[name]);
                }
            }
        },
        init: function () {
            this.initializeElements();
            this.bindEvent();
            this.loadGrid();
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
        _delegate: function (name, selector, func) {
            $(doc).on(name, selector, func);
        },
        initializeOrdinaryEvents: function (maps) {
            this._scanEventsMap(maps);
        },
        bindEvent: function () {
            this.initializeOrdinaryEvents(this.eventsMap);
        },
        then : function (params) {
            var self = this;
            $.each(params, function (index, item) {
                self[item.name] = params[item.name]
            })

            return self;
        }
    }

    global.App = App;

})(this, this.jQuery, this.ext, document)



//实现

$(function () {

    var app = new window.App(
        { width: 600, height: 437 },
        [[
            { field: "Id", title: 'Id', width: 10, hidden: true },
            { field: "ck", title: '', width: 20, checkbox: true },
            {
                field: "ImgUrl", title: '图片', sortable: true, width: 40, align: 'center', formatter: function (value, rec) {
                    if (value) {
                        return "<a href='#none' class='imgdetail'  data-id='" + rec.ImgUrl + "'><img src='" + value + "' width='30' height='30'></a>";
                    } else {
                        return '';
                    }
                }
            },
            { field: "GoodsCategoryName", title: '所属物品类别', sortable: true, width: 40, align: 'left' },
            { field: "GoodsName", title: '物品名称', sortable: true, width: 40, align: 'left' },
            { field: "Unit", title: '单位', sortable: true, width: 20, align: 'left' },
            {
                field: "IsDelete", title: '状态', sortable: true, width: 40, align: 'center', formatter: function (value, rec) {
                    if (value == 0) {
                        return "<div class='helper-font-16'><i title='可用' class='iconfont icon-duigou' style='color:green;'></i></div>";
                    }
                    if (value == 1) {
                        return "<div class='helper-font-16'><i title='停用' class='iconfont icon-cuo1' style='color:red;'></i></div>";
                    }
                }
            },
            { field: "CreateTime", title: '创建时间', sortable: true, width: 80, align: 'center' },
            {
                field: "IsDeleted", title: '操作', sortable: true, width: 40, align: 'center', formatter: function (value, rec) {
                    if (value == 0) {
                        return "<a href='#none' class='change' data-sign='lock'  data-value='2' class='btn btn-mini btn-default' data-id='" + rec.Id + "'>禁用</a>"
                    }
                    if (value == 1) {
                        return "<a href='#none' class='change' data-sign='open'  data-value='2' class='btn btn-mini btn-default' data-id='" + rec.Id + "'>启用</a>"
                    }
                }
            },
        ]],
        {
            'click #btnquery': 'query',
            'keydown #searchkey': 'search',                   
            'click #btnadd': 'add'
         
        },
        {
            $dg: "#datagrid",                  
            $searchkey: "#searchkey",                  
            $queryBtn: "#btnquery",
            $add: "#btnadd"
        }
    );

    //方法的注册
      app.then({

        ImgDetail: function (obj) {
            var imgurl = $(obj).attr("data-id");
            layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                area: '516px',
                skin: 'layui-layer-nobg', //没有背景色
                shadeClose: true,
                content: "<img src=" + imgurl + " width='516' />",
            });

        },

        ChangeIsDelete: function (obj, sign) {

            if (sign == "lock") {
                var message = "确认要禁用此物品吗？";
            }
            else {
                var message = "确认要启用此物品吗？";
            }
            var id = $(obj).attr("data-id");
            $.messager.confirm("提示", message, function (r) {
                if (r) {
                    $.ajax({
                        type: "post",
                        url: "/WeixinManage/Goods/ChangeIsDelete",
                        data: { id: id },
                        success: function (e) {
                            if (e.Ret == "0") {
                                $("#datagrid").datagrid("reload");
                            } else {
                                $.messager.alert(sysname, e.Msg, "error");
                            }
                        }
                    });
                }
            });

        },

        query: function (evt) {

            evt.preventDefault();
            var params = $("#datagrid").datagrid('options').queryParams;
            params.searchkey = $("#searchkey").val();
            $("#datagrid").datagrid("load");
        },

        loadGrid: function () {
            var self = this;
            //var $dg = $("#datagrid");
            this.$dg.datagrid({
                title: '物品列表',
                url: '/WeixinManage/Goods/GoodsListJson',
                fit: true,
                fitColumns: true,
                striped: true,
                nowrap: true,
                idField: 'Id',
                pagination: true,
                pageNumber: 1,
                pageSize: 20,
                pageList: [10, 20, 30, 45, 60, 75],
                rownumbers: true,
                singleSelect: false,
                loadMsg: "数据加载中...",
                queryParams: {
                    searchkey: "",
                },
                sortName: '',
                sortOrder: 'asc',
                columns: self.cols,
                onLoadSuccess: function () {
                    //多选时，加载完成后清除所有选中项（不然可能会有残留选中项）
                    self.$dg.datagrid("clearSelections");

                    //字符串拼接的dom的事件绑定
                    $('.change').on('click', function () {
                        self.ChangeIsDelete($(this),$(this).attr('data-sign'))
                    })
                    $('.imgdetail').on('click', function () {
                        self.ImgDetail($(this))
                    })
                },
                onDblClickRow: function (rowIndex, row) {
                    
                    self.dlg.setURL("编辑物品", "/WeixinManage/Goods/Edit/" + row.Id + "?" + Math.random());
                    //else
                    //    this.dlg.setURL("编辑物品", "/WeixinManage/Goods/Edit/" + row.Id + "?" + Math.random());

                    self.dlg.show();
                },
                onSelect: function (rowIndex, row) {
                    var selectedRows = self.$dg.datagrid("getSelections");
                    if (selectedRows.length == 0) {
                        $("#btndel").attr("disabled", true);
                    } else {
                        $("#btndel").attr("disabled", false);
                    }
                },
                onUnselect: function (rowIndex, row) {
                    var selectedRows = self.$dg.datagrid("getSelections");
                    if (selectedRows.length == 0) {
                        $("#btndel").attr("disabled", true);
                    } else {
                        $("#btndel").attr("disabled", false);
                    }
                }
            });

        },
        search: function (event) {
            if (event.keyCode == $.ui.keyCode.ENTER) {
                event.preventDefault();
                this.$queryBtn.click();
                return false;
            }
        },
        add: function (evt) {

            evt.preventDefault();
            this.dlg.setURL("新增物品", "/WeixinManage/Goods/Edit/0?" + Math.random());
            this.dlg.show();


        }
    //完成之后进行事件绑定等操作
    }).init();

})