### 1. 创建项目

1. ![image-20220729163305614](C:\Users\14747\AppData\Roaming\Typora\typora-user-images\image-20220729163305614.png)

2. npm i element-ui 配置组件库
3. 配置axios库 npm i axios --save

### 2. 项目托管github

#### 2.1github新建项目

2. `git remote add orign https://github.com/Reqidou/manage-projects.git`
3. `git push -u orign master`
4. git常用操作
  	1. git init
  	2. git add .
  	3. git commin -m ''
  	4. git push
  	5. git status

### 3.项目初始化

1. 数据库导入
2. 测试接口是否正常-使用登录接口测试，一切正常

### 4.登录功能

 1. git

      1. 创建分支
         - `git checkout -b login`
      2. 查看分支
         1. `git branch`

2. 创建login组件

 3. router配置Login组件并在App页面添加`router-view`占位。并在router进行重定向

 4. `assets/css/global.css`新建全局样式

 5. 安装less less-loader插件，使用less布局完成登陆外框设计

 6. 新建`plugin/element.js`文件，内部按需导入需要用到的饿了么组件，目的是为了增强性能

 7. main.js导入字体图标库，`iconfont icon-XX`或使用自带图标`el-icon-user/lock`实现

 8. 完成表单的数据绑定：外部v-model双向绑定，内部使用:model绑定input内容

 9. 表单验证：（element-ui）规则

      1. 表单外部使用:rules="obj"定义对象

      2. date数据定义对象，要求

      3. item子组件使用prop="obj.name"来绑定规则

 10. 表单重置

        1. 外部el-form添加ref属性，标记
        2. 给重置添加方法
        3. 使用`this.$refs.fn.resetFields()重置`

 11. 登陆验证

       1. 登陆前预验证
          
     1. 使用`this.$refs.fn.validate(() => {})登陆`
     
  2. axios封装出现的问题
     
                1. [(39条消息) axios 封装请求方法_不回头~的博客-CSDN博客_axios封装请求](https://blog.csdn.net/saienenen/article/details/115030205)
           2. [聊聊 Vue 中 axios 的封装 - 掘金 (juejin.cn)](https://juejin.cn/post/6844903969152565261)
     
  3. axiox封装问题的解决
     
                1. 如何封装aixos？ 或者说axios的配置表，最简单的那种？
                         1. 新建network文件，request.js文件。完成相关配置
                2. 函数序列化如何解决，还有请求头，模式的改写？
                         1. 请求头使用headers来完成（后续是加载request文件来填写的）
                         2. 模式使用method来编辑。
                    3. 发送post请求，会使发送过来的对象序列化.序列化使用qs插件，使用`data: qs.stringify({username, password})`完成
     
  4. 登陆消息提示（用到elementui组件提示）
     
                1. element.js导入：需要使用原型对象Vue.prototype.$message = Message
           2. 使用this.$message.access/err(res.meta.msg)
     
  5. 登陆存储token
     
        1.  登陆后会将token存储到客户端的sessionStorange
        
              `window.sessionStorage.setItem('token', res.data.token)`
        
              ​     1.1项目其他接口只有在登陆后才可以访问
        
              ​     1.2token在打开当前网站期间生效
        
        
     ​    2.通过编程式导航`this.$router.push`跳转到后台，路由地址是'/home'
     
  6. 主页的注册及路由的添加
     
  7. 路由导航守卫控制路由导航权限
     
  8. 退出登录功能
     
                1. home新建info类型button组件
                2. window.sessionStorage.clear()
           3. replace退出，防止返回键返回。更严谨
     
  9. git合并分支
     
                1. 跳转到主分支git checkout master
           2. 代码合并到主分支git merge login
     
  10. 子分支推送到git
          
       1. 切换到login分支
      
         2.  git push -u origin login

### 5.主页

#### 5.1 新建git分支

- git checkout -b home

#### 5.2 主体布局

##### 5.2.1主页header布局

#### 5.3 左侧菜单设计

##### 5.3.1 左侧菜单布局

​	- 官方复制样式； 注册组件； 修改样式

##### 5.3.2 获取数据请求

- 通过axios请求拦截器添加token

​		`	config.headers.Authorization = window.sessionStorage.getItem('token')`

 -  获取左侧菜单接口数据
    	-  新建menu文件，用于获取接口数据请求
     -  主页导入， 新建数组来存放左侧菜单数据
     -  使用async await来获取promise请求
     -  返回错误信息用`this.$message.error()`

##### 5.3.3左侧菜单UI绘制

- 遍历将数据传递到页面
- 定义对象，键为id，值为图标。
- unique-opened: 只能打开一个下拉列表
- border-right将右侧边框线改为0

 - 折叠与展开
   	- 使用collapse属性来实现折叠展开效果。需要关闭动画collapse-transition
      	- 设置它的宽度， 根据isCollapse判定宽度

##### 5.3.4 首页路由重定向

- 新建子组件Welcome页面

 - 路由绑定
   	- router home下子路由children[{}]完成
      	- router home内通过redirect完成重定向
      	- home.vue页面添加路由展位符

##### 5.3.5 左侧菜单改为路由链接

- el-menu组件打开router属性
- 二级菜单接收通过'/' + subItem.path来跳转

##### 5.3.6 左侧列表页

- home文件添加子组件
- 添加路径访问

 - 用户列表默认显示高亮（default-active）激活
    - 用户列表在点击时，给它的路径添加高亮。需要进行动态绑定。由于default-active属性需要绑定路径， 所以需要获取二级标题的path属性
      	- 二级标题添加点击事件，使用sessionStorage来存储它的路径。
      	- 创建时，获取它的sessionStorage，定义保存它的数值
      	- 点击时，需要将存储的路径进行切换。更改它的数值

##### 5.3.7 用户列表UI结构

 - 使用`el-breadcrumb`面包屑导航；`el-card`卡片视图；
    -  `el-row`行与`el-row`列结合使用。
      	- 内部使用input跟button框。
              	- 修改他们的属性，完成样式布局

##### 5.3.8获取用户列表数据

- get请求获取对象，获取请求数据
- 新建数组，存放用户跟总条数
- 引入table标签， 使用`:data`绑定数据源， 子标签使用label编辑标题， `prop`传入键展示数据
- table标签添加border边框， stripe添加背景颜色

##### 5.3.9 状态栏的显示效果

- 使用`template`组件，使用v-slot=scope插槽来获取数据。
- 内部使用`switch`组件，通过v-model来获取状态信息

##### 5.3.10 分配角色按钮

- 导入`template`组件，使用`v-slot=scope`插槽来获取数据
- 内部导入三个组件按钮
- 第三个组件外部使用`tooltip`包裹，目的是鼠标悬停的文字提示

##### 5.3.11 数据分页

 - 使用`pagination`组件来完成
   	- size-change：点击切换每页最高容量
      	- current-change: 点击切换页码
      	- current-page： 当前页码
      	- layout： 下部所存在的属性

##### 5.3.12 用户状态的修改

- 在组件switch添加点击事件

 - home页面添加新的方法，用来传递axios请求
   	- 使用put方法，由于是在Path修改。所以直接在外部获取它的值，内部拼接完成。
	- 状态判定，输出结果

##### 5.3.13 搜索功能的实现

 - input使用双向绑定，然后通过button的点击事件传递获取用户列表axios请求。
   	- 关键字存放在数组的query内部，用来匹配关键字
	- input可以使用`clearable`来清楚关键字，然后添加@clear请求，目的是清楚后发送一次获取用户请求。

##### 5.3.14 添加用户的功能

 - 添加模板
   	- 使用`dialog`组件，设置visible.sync="data.data = true",底部按钮使用同样方法，来更改组件库的显示状态
    - 内容主体
      	- 使用表单控件form, form-item.【rules绑定表单规则prop。 model绑定数组对象】
      	- form v-model绑定对象， 规则绑定表单绑定验证
      	- 每个item使用prop绑定规则。
      	- 每个input框使用双向绑定，绑定form的具体对象
 - 自定义添加规则
   	- data内部进行定义，使用（rule, value, callback）=>{}来定义规则，然后再规则下进行调用
- 点击其余区域，清空所有参数
    - form外部添加一个@close关闭时间，内部调用ref的resetFields
- 动态预处理参数验证
    - 确认按钮添加addUser事件，首先会判断参数是否填写完整，使用this.$refs.xxx.validate((valid) => {})
    - 构建post请求，使用判定它的输入状态，进行添加

##### 5.3.15修改用户的功能

 - 添加模板
   	- 使用dialog组件，设置`:visible.sync=""`控制框架显示状态。自定义属性，取消用来隐藏控件。
 - **获取点击用户信息**
   	- 通过edit按钮，来传递参数`scope.row.id`可以获取到本行的id，然后使用get请求，获取相关的用户对象。将用户对象传递到一个定义的数组里。完成数据的存储
 - 用户表单数据的绘制
   	- 使用form表单，双向绑定存储对象。 输入规则。
      	- 定义输入规则，邮箱跟手机号规则来完善数据。自定义验证规则使用validator来验证。`validator: checkNAME`
 - 关闭表单的重置方法
   	- 对话框添加@close事件，内部调用ref的resetFilds（）方法，用来重置它的内部数据
 - **修改用户数据**
    - 提交表单预处理事件
       - 确定按钮添加editUser方法，首先判断参数填入是否符合规范，使用this.$refs.editName.validate((valid)=>{})
    - 提交表单参数验证
       - 新建接口，请求更改信息。通过status判断是否修改成功
       - 关闭对话框， 刷新数据列表 ， 提示修改状态

##### 5.3.16 删除用户的功能

 - 使用`MessageBox`对话框
   	- 添加点击事件`removeUserId(scope.row.id)`传入id
      	- 使用自定义事件，原型添加confirm方法，完成样式框的文字填充及提示消息
      	- 通过异步来获取用户的最终操作，进行最终的删除操作
 - 删除操作
   	- 发送delete请求，传递id数值，判定状态码，完成用户的删除操作

##### 5.3.17提交代码到git

- 新建本地分支user git checkout -b user
- 添加 git add .
- 提交 git commit -m ''
- 远程添加仓库分支user git push -u origin user
- 切换到主分支 git checkout master
- 合并分支 git merge user
- 提交代码到远程仓库 git push

### 6.权限管理开发

#### 6.1 新建git分支

- git checkout -b rights 新建分支
- git push -u origin rights 上传分支到仓库

#### 6.2 权限列表的开发

##### 6.2.1 新建权限列表

- 新建power文件夹，rights文件夹新建rights文件
- 路由器进行子路由的创建**子路由不用加/**

##### 6.2.2 绘制主体结构及获取数据

- 使用面包屑， 卡片视图

 - 获取所有权限列表
   	- 使用put请求，获取列表数据，直接传入list即可
      	- 定义RightsList列表，获取数据
 - 卡片表格渲染
    - 使用`tabel>table-column`完成列的数值渲染。
      	- table使用:data=""传递数组
      	- column使用prop=“”获取数据
    - 商品等级渲染按钮，使用<template v-slot="scope">获取数据
      	- <el-tag scope.row.level>获取单行数据，使用v-if判定显示

#### 6.3 角色列表的开发

##### 6.3.1 新建页面及添加路由

- 新建roles文件夹，新建roless文件
- 路由器进行子路由的创建**子路由不用加/**

##### 6.3.2 绘制主体结构及获取数据

- 使用面包屑， 卡片视图，卡片视图内部防止button按钮

 - 获取所有用户列表
   	- 使用get请求，获取列表数据
    - 定义rolesList列表，获取数据
 - 卡片表格渲染
    - 使用`tabel>table-column`完成列的数值渲染
       - table使用:data=""传递数组
       - column使用prop=“”获取数据
    - 渲染按钮
       - 使用<template v-slot="scope">组件获取数据
 - 展开列
    - table第一层使用`table type="expand"`来绘制展开列
    - 下接[6.3.6 展开列](#6.3.6 展开列)

##### 6.3.3 添加角色

 - 组件绘制样式
    - 添加对话框Dialog完成文本， 底部的填充
      	- dialog控制显示隐藏效果，
    - 使用Form表单，添加角色的必要文本
       - 对话框关闭事件，对话框关闭使用ref获取表单的数据，进行重置`resetFields`
    - 对话框关闭事件： 对话框关闭的时候，使用ref获取form表单的数据，清空。
      	- form ：`:rules=“”添加规则 ` `:model=“”绑定对象`
      	- form-item:  prop添加规则
      	- inut： v-model=“model.name”
 - 添加角色交互请求
   	- 确定按钮添加addRole事件，通过双向绑定，将表格的数据发送请求
      	- 新建post请求，data接收数据，完成数据处理
      	- 验证状态码，返回提示信息
      	- 关闭对话框
      	- 刷新列表

##### 6.3.4 修改角色

 - 组件绘制样式
    - 添加对话框Dialog完成文本， 底部填充
      	- dialog控制整体样式
    - 使用form表单，添加角色文本
       - 对话框关闭事件，对话框关闭使用ref获取表单的数据，进行重置`resetFields`
    - 对话框关闭事件： 对话框关闭的时候，使用ref获取form表单的数据，清空。
       - form ：`:rules=“”添加规则 ` `:model=“”绑定对象`
       - form-item:  prop添加规则
       - **item规则名要跟input v-model绑定的名称一致**
       - input： v-model=“model.name”
 - 修改角色信息请求
    - 获取id用户信息
       - 通过点击编辑按钮，使用scope.row.id获取当前用户id信息
       - 通过后台调用，获取网络请求
       - 将数据传递到数组对象存储
    - 修改表单信息验证
       - 使用预验证this.$refs.form.validate(async valid => {})
       - 表单预处理
       - 通过网络请求，传递表格数据，根据id修改角色信息
       - 关闭对话框
       - 获取角色表单
       - 提示修改成功

##### 6.3.5 删除角色

 - 点击事件，根据id来构建对话框的搭建
   	- 使用自定义方法MessageBox方法弹窗，通过异步来获取返回结果
      	- 根据返回结果判定用户选择的按钮
	- 点击确认按钮，通过id获取网络请求，传递参数进行删除
	- 刷新角色列表

##### 6.3.6 展开列

- 使用template使用插槽，v-slot="scope"获取数据
- 内部使用pre包裹， 给数据添加格式

 - 数据渲染的分析
   	- 通过三层for循环获取每一层的children属性
 - 渲染数据(一级)
    - 使用row col组件，将数据划分成不同的区块，**每列有24个单位**
      使用v-for遍历第一层的children，使用tag优化显示布局
    - 给组件添加样式，顶线底线。
    - 添加图标
 - 渲染数据(二级三级)
    - 在分布的col内部，继续使用row， col划分区域
    - row进行遍历， 获取二级数据
    - 三级数据在内部tag标签获取数据

##### 6.3.7 删除角色的指定权限

- 三级标签添加closable属性，并调用close方法。传递整行数据，及获取权限的id
- 数据请求到后台，返回的过程中，为了避免页面重新刷新，所以进行赋值。
- 将当前数组的数据进行替换： role.children = res.data

##### 6.3.8 分配权限

- 导入dialog对话框，定义对话框的显示状态，及点击事件。
- 点击后，通过网络接口获取所有权限，并将数据传到列表内
- 使用Tree组件展示数据。`:data绑定数据列表， ：props绑定传入规则`

 - tree组件添加show-checked属性，添加复选框
	- node-key可以给树添加特定指向，这里指向id
	- default-expand-all 默认展开
 - :default-checked-keys 选中复选框
   	- 思路： 获取第三级的数据， 将他们的id存储到数组中，可以展示
    - 做法：
       -  分配权限展示事件，传递行数据
       - 在展开分配权限框使用递归的方法，获取所有三级节点的id，并传递到数组中
- 关闭对话框， 默认清空内部数据
    - 方法1：对话框定义close事件，defKeys=[]
    - 方法2： 使用默认的
- 保存勾选分配权限
    - 确定按钮添加点击事件，并给tree组件添加ref属性
    - 新建数组，用于存放所有选中的节点
        - 使用...表达式，获取tree中所有勾选的节点`getCheckedKeys`跟半节点`getHalfCheckedKeys`，并存放到新数组
        - 在点击展示分配框的时候，获取当前id，传到组件中
        - 通过网络请求， 将获取的id跟所有节点发送至后台
        - 获取表单，关闭对话框

##### 6.3.9 分配角色

 - 对话框的绘制及数据的获取
   	- 使用对话框， 控制它的显示隐藏。
      	- 分配角色按钮添加点击事件， 发送整行数据
    - 角色信息添加到新定义的对象列表中
       - 表单中获取列表的name及rolename
       - 使用option select选项框
          - select组件使用v-model绑定选中的id
          - option组件使用循环，获取列表的id，name并将name对应的id作为value传递
      	- 发送网络请求获取所有的角色列表，并存放到新定义的数组中
              	- 展示对话框
 - 发送请求，修改权限
   	- 判断v-model绑定的id是否赋值
      	- 发送网络请求，将用户id， 绑定的权限id传递。
      	- 关闭对话框
      	- 获取用户列表
 - 对话框关闭清除事件
    - 对话框添加@close事件
      	- 清除选中的id及被分配权限的用户信息

##### 6.3.10 git提交

- git add . 
- git commit -m ''
- git push
- 切换分支 git checkout master
- 合并分支 git merge rights
- git push

### 7 分类管理页的开发

#### 7.1 商品分类的开发

##### 7.1.1  git 分支 创建

- git checkout -b goods_cate
-  git push -u origin goods_cate

##### 7.1.2 商品分类路由组件

- 新建文件`goods/Cate`
- 添加子路由

##### 7.1.3 商品分类页的页面结构及数据获取

 - 页面制作
    - 卡片视图
       - row-col-button 按钮
       - tabel表格
         - 树形列表（2选1）
           - 表格使用自带树形结构`row-key="cat_id" :tree-props="{children: 'children'}"`
           - 使用vue-table-with-tree-grid，并在main导入并注册全局组件
             - :data=""绑定数据列表； 
             - :columns="" 必填项，否则报错，定义标签跟绑定属性
             - :selection-type="false" 关闭复选框
             - :expand-type="false" 关闭展开
             - show-index 展示索引；
             - index-text=“” 索引名称
             - borde 纵向边框线
             - show-row-hover： 鼠标悬停，是否高亮
           - 渲染模板定义完成有效、排序、操作三栏
             - columns内使用type:'template',template:''name"定义新的组件名称
             - 组件内通过`<template v-slot:isok="scope">`获取属性
       - pagination分页
         - handleSizeChange：改变每页数量
         - handleCurrentChange： 点击第几页跳转
 - 数据交互
    - 发送网络请求，传递参数，将获取的数组列表及条数存储
    - 绑定到tree跟pagination组件，获取相关数据

##### 7.1.4 添加分类

- 添加对话框，设置其属性

 - 添加form表单，参数验证，添加规则

 - 父级分类
   	- 获取二级父级分类数据，存放到数组
    - 使用cascader级联选择器，绑定数据
      	- options绑定获取的数据
      	- v-model双向绑定需要接收的对象
      	- props指定显示的标签，数值及分类名称
      
       - @change，点击选项发生改变
         	- 保存它的最后一个节点跟等级；
    
- 取消清除数据

    - dialog使用close方法， 内部使用resetFields(),级联标签使用setKey = 0， pid_level = 0.赋值清空

- 点击确认提交

##### 7.1.5 修改分类

	- 添加对话框， 添加form表单验证
 - 具体流程
   	- 用户点击编辑按钮，获取当前行的数据，并存储在数组
      	- 新建确认事件，使用网络请求，将分类id及name发送网络请求
      	- 控件验证规则
      	- 关闭对话框， 刷新列表

##### 7.1.6 删除分类

	- 	点击事件，根据id来构建对话框的搭建

- 使用自定义方法MessageBox方法弹窗，通过异步来获取返回结果
  	- 根据返回结果判定用户选择的按钮
- 点击确认按钮，通过id获取网络请求，传递参数进行删除
- 刷新角色列表

##### 7.1.7 git提交

	- git checkout goods_cate
	- git add .
	- git commit -m '完成商品分类'
	- git push
	- git checkout master
	- git merge goods_cate
	- git push

####  7.2.分类参数

##### 7.2.1 git分支创建

	- git checkout -b goods_params
	- git push -u origin goods_params

##### 7.2.2 参数管理路由组件

	- 注册页面，添加路由

##### 7.2.3 参数管理页面结构及数据获取

 - 面包屑组件

 - 卡片组件

    - 警告框

    - 分类区域

       - 级联选择器

          - 实现方法

             - 获取所有商品列表，存储到cataList数组中

             - 级联选择器，绑定相关的数据。 change事件获取v-model绑定的keys数组

                - **级联选择器的change事件发送网络请求，获取选择的参数列表**

                   - > **由于级联选择器选中数据，tabclick切换标签，都需要获取传递参数。并且最终根据属性传递到对应的数组存放。所以需要定义一个方法，在两者中运行即可。很好的一个方法**

       - Tabs标签页（新东西）

          - v-model绑定当前的页签名称

          - tab-click页面处理函数

             - **页面处理函数发送网络请求，获取选择的参数列表**

                - > **由于级联选择器选中数据，tabclick切换标签，都需要获取传递参数。并且最终根据属性传递到对应的数组存放。所以需要定义一个方法，在两者中运行即可。很好的一个方法**

      - 参数表格

        - table -> table-column -> template

      - 共用参数对话框

        - el-dialog -> el-form -> el-form-item -> el-input 

          - 添加参数：确定按钮使用方法，发送网络请求，修改结果
          - 修改参数： 
            - 点击编辑按钮，获取当前行的数据，通过网络请求传递数据，获取当前的数据并存放到数组中
            - 点击确认按钮，发送网络请求，传递表格数据，完成数据的修改
          - 删除参数：
            - 点击删除按钮，获取当前id，通过网络请求传递数据， 刷新数据， 取消对话框显示
      
      - 展开列的渲染
      
         - `template(v-slot=scope) -> el-tag scope.row.attr_vals`
         - new Tag
            - input/button
               - 需要给每个组件注册单独的显示隐藏事件，需要在getParams内，遍历数组，使用`this.$set(scope,'elekey', 'value')`实现
               - 文本框失去焦点鼠标enter，都会通过push添加到vals中，然后清空当前的文本并隐藏
               - 点击按钮，进入input，需要使用this.nextTick聚焦文本框
               - 文本框失去焦点，会使新的数组通过网络请求发送到后台
               - 删除tag标签也会使用上面的方法，重新加载数组，使用同一个网络请求
      
         ```js
         //获取参数列表数据
             async getParamsData() {
               if(this.selectedCateKeys.length !== 3) {
                 this.selectedCateKeys = []
                 this.manyTableData = []
                 this.onlyTableData = []
                 return
               }
               //  根据所选分类id和当前所处的activename发送请求
               const res = await getCategoriedList(this.cateId, this.activeName)
               if(res.meta.status !== 200) {
                 return this.$message.error('获取参数列表失败！')
               }
               // 字符串删除，形成数组
               res.data.forEach(item => {
                 //数组长度
                 item.attr_vals = item.attr_vals ? item.attr_vals = item.attr_vals.split(',') : []
                 //控制文本框显示隐藏效果
                 this.$set(item, "inputVisible", false)//动态绑定方法
                 // item.inputVisible = false
                 // 文本框输入的数值
                 this.$set(item, "inputValue", '')//动态绑定方法
                 // item.inputValue = ''
               })
               //判断数据是属于many还是only,存储在不同数组
               this.activeName === 'many' ? this.manyTableData = res.data : this.onlyTableData = res.data
               console.log(this.manyTableData, this.onlyTableData);
             },
         ```

##### 7.2.4 提交到git

	- git add .
	- git commit -m ''
	- git push
	- git checkout master
	- git merge goods_params
	- git push
#### 7.3 权限列表

##### 7.3.1 git新建分支

	- git checkout goods_list
	- git push -u origin master goods_list

##### 7.3.2 页面的创建及路由的编辑

##### 7.3.2 商品列表的模板与数据的获取

	- 面包屑导航
 - card卡片组件
    - row :gutter="20" > col :span=8  内置两个col
      	- input搜索框双向绑定query搜索，clearable可以清空搜索栏并使用clear获取数据；按钮添加点击获取数据。
    - form表格
      	- 数据获取：发送网络请求，将数组对象及total保存返回定义属性
       - 过滤器时间戳
         	- main给Vue添加新的过滤器，然后再内部使用<template>组件定义插槽，获取内部事件，使用过滤器写法进行转换
      	- 删除商品
       - [添加商品](#7.3.3添加商品)
    - pagination分页

##### 7.3.3添加商品

 - 面包屑导航
 - card组件
    - 消息提示 alert
    - 步骤条 steps
    - 表单form
       - 标签页 tabs  **tabs表单内部pane控件，只能跟tabs一起，所以需要外部放置form表单**
          - 为了防止表单没选择级联选择器分类，使用自带的`:before.leave`来防止跳转
          - 给tab添加click事件`tab-click`根据before.leave的跳转路径，使用网络请求获取不同的接口数据，并保存
             - 商品参数的获取与表单建立
                - 根据activeIndex，当为1，跳转到商品参数，需要根据级联选择器的id及many参数获取数据，存放到对应数组
                - 使用`el-form-item` 循环遍历manytable的数组，获取内部的attr_vals数组。
                   - 内部使用checkbox复选框，循环遍历attr_vals数组内部的数值绑定
             - 商品属性的获取与表单建立
                - 根据activeIndex，当为2，跳转商品属性，需要根据级联选择器的id及only参数获取数据，存放到对应数组
                - 使用`el-form-item` 循环遍历onlytable的数组，获取内部的attr_vals数组。
             - 商品图片的建立与数据请求
                - 使用upload组件，添加请求头获取token，其余详细看代码
                - 监听图片上传
                   - 使用`:on-success`发送事件，将得到的数据返回拼接得到一个对象，并push到addform的pics数组中
                - 移除图片
                   - 使用`:on-remove`发送事件，获取参数的临时路径，查找索引，并且使用splite删除
                - 预览图片
                   - 使用`:on-preview`，获取内部的url路径，保存到data中，添加dialog对话框，将图片地址绑定到img中
             - 商品内容的表单创建及数据获取
                - 下载`Vue-Quill-Editor`组件，并全局导入。
                - 使用基本组件样式，双向绑定addform的描述key，打印addform表单可得到所有的数值
             - 添加商品按钮
                - 预验证， 
                - cats数组转换字符串
                   - 深拷贝
                      - js` const newAddForm = JSON.parse(JSON.stringify(this.addForm))`
                      - 使用`lodash`插件
                - attrs商品参数数组，包含动态参数，静态属性
                   - addForm添加数组，存放合并信息
                   - 循环动态参数及静态参数列表，每循环一次，将新增的newinfo赋值到数组中，最终提交深拷贝的对象
                - 添加商品网路接口
                   - 重要的参数提交，需要将数组转换为字符串存储
    - 基本信息（tabs内部）
       - el-form-item 四个商品属性
       - cascader 级联选择器
          - 事件处理函数

##### 7.4 git提交

	- git add .
	- git commit -m ''
	- git push
	- git checkout master
	- git merge goods_list
	- git push

### 8. 订单管理开发

	#### 8.1 git分支创建
	
	- git checkout -b order
	- git push -u origin order

#### 8.2 页面的创建及路由的添加

#### 8.3 页面的布局及网络请求

	- bread面包屑
 - card卡片
   	- row > col` ：span` > input `button slot="append"`
    - table表格
      	- 数据的获取，使用queryInfo定义，发送网路请求，获取参数
      	- 布局还是以前那样，写一下就好
       - 操作
          - 修改地址对话框
            	- 导入省市县，使用cas级联选择器，并没有发送请求，因为没借口
          - 物流信息
            	- 同样的，接口被废弃，没办法获取物流信息。直接写假数据模拟
             - **Timeline时间线**
               	- 新版本直接使用，通过循环遍历假数据，绑定信息
    - pagization分页
      	- 数据获取，每次刷新它的size， page。并且重新提交参数

### 9. 数据统计

	#### 9.1 git新建分支
	
	- git checkout -b report
	- git push -u oringin report

#### 9.2页面创建及路由

#### 9.3 echarts组件的使用

 - 基础流程
   	- 1.导入echarts`imoort * as...` 
      	- 2.定义一个有宽高的标签`div style...`
   	- 3.mounted内：基于准备好的dom，初始化实例`var myChart = echarts.init(dom)`
   	- 4.准备数据配置项 `var option = {}`
   	- 5.使用指定的配置项和数据显示`myChart.setOption(option)`

### 10.项目优化

#### 10.1nprogress页面加载进度条

	- npm install nprogress --save
 - request文件导入npro
   	- request拦截器开启进度条
      	- response关闭进度条

#### 10.2 可以取消所有console.log的插件

	- npm install babel-plugin-transform-remove-console --save-dev
 - babel.config.js

```js
'plugins': [
    [
      'transform-remove-console',
    ]
  ]
```

#### 10.3 优化babel。config页面

```js
// 项目发布阶段用到的babel插件
const prodPlugins = []
if(process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  'plugins': [
    //发布产品的插件数组
    ...prodPlugins
  ]
}

```

#### 10.4 项目打包

​	- vue-cli-service build --report 简写就是npm run build

#### 10.5 通过vue.config.js修改webpack的默认配置

	- transpileDependencies通过链式编程，修改默认的webpack模式
	- configureWebpack通过操作对象，修改默认
	- 为10.6的一个方法

#### 10.6为开发模式与发布模式指定不同的打包入口

	- 开发模式：src/main-dev.js
	- 发布模式： src/main-prod.js

#### 10.7 externals加载外部CDN资源

		- publicPath: './' 解决加载空白问题













### #杂碎知识点

	- \>>>只能作用于css，在less、sass、scss中无法识别需要用/deep/
	- 

