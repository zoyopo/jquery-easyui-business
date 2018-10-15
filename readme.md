### 场景

> 项目中存在很多代码，比如事件绑定，变量使用，都是重复书写的，使用这种方式，将一些通用的方法抽象出来，以便复用,这是只涉及到jquery的通用场景，可以使用其他jquery插件进行扩展。

> 同时，每个页面对应的一些处理细节，使用构造函数进行配置的初始化。




### 如何使用(quick start)

```
   var app = new window.onlyJqApp(
     // an Object about event bind to DOM element and related fn 
     //一个关于事件绑到DOM元素上和对于的方法
     
        {          
            'click #cart-btn': 'showMatchList'         
        },

      // an object tansfering dom Object to jq Object
      // 一个将dom对象转化成jq对象的键值对
      
        {
           
            $body: 'body'
         
        },
      // a global data store
      // 当前页面全局公共数据
      
        {          
           
            AddedClothes: [

            ]
           
        },
        // a fn name Array,they run after dom has rendered
        // dom渲染结束立即执行的方法
        
        ["loadData","closeTips"]
    )

  $(function () {
   
     app.then(
       // an Object to register fn above
       
       {
       // e=> event ,JqObject=>bind dom's JqObject
         showMatchList:function(e,JqObject){
         e.preventDefault();
         e.stopPropagation();
          // to do someting

         },
         loadData(){
         // get data from data store above
          var addedClothes= this.data.AddedClothes;     
          ....
          ....
          // use fn in the register array
          this.closeTips();
         },
         closeTips(){
         
         }
       }
     ).init();
   }
  )

```




### 感谢

  感谢我的同事的帮助。
