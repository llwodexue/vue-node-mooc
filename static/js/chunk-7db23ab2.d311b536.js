(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7db23ab2"],{2804:function(e,t,a){"use strict";a("aeae")},"47ca":function(e,t,a){},"751e":function(e,t,a){"use strict";a("47ca")},"9a8b":function(e,t,a){"use strict";var l=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-form",{ref:"postForm",staticClass:"form-container",attrs:{model:e.postForm,rules:e.rules}},[a("sticky",{attrs:{"sticky-top":84,"z-index":10,"class-name":"sub-navbar "+e.postForm.status}},[e.isEdit?e._e():a("el-button",{on:{click:e.showGuide}},[e._v("显示帮助")]),a("el-button",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticStyle:{"margin-left":"10px"},attrs:{type:"success"},on:{click:e.submitForm}},[e._v(" "+e._s(e.isEdit?"编辑电子书":"新增电子书")+" ")])],1),a("div",{staticClass:"detail-container"},[a("el-row",[a("warning"),a("el-col",{attrs:{span:24}},[a("ebook-upload",{attrs:{"file-list":e.fileList,disabled:e.isEdit},on:{onSuccess:e.onUploadSucess,onRemove:e.onUploadRemove}})],1)],1),a("el-row",[a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{prop:"title"}},[a("md-input",{attrs:{maxlength:100,name:"name",required:""},model:{value:e.postForm.title,callback:function(t){e.$set(e.postForm,"title",t)},expression:"postForm.title"}},[e._v(" 书名 ")])],1)],1)],1),a("el-row",[a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{prop:"author",label:"作者：","label-width":e.labelWidth}},[a("el-input",{attrs:{placeholder:"作者"},model:{value:e.postForm.author,callback:function(t){e.$set(e.postForm,"author",t)},expression:"postForm.author"}})],1)],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{prop:"publisher",label:"出版社：","label-width":e.labelWidth}},[a("el-input",{attrs:{placeholder:"出版社"},model:{value:e.postForm.publisher,callback:function(t){e.$set(e.postForm,"publisher",t)},expression:"postForm.publisher"}})],1)],1)],1),a("el-row",[a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{prop:"language",label:"语言：","label-width":e.labelWidth}},[a("el-input",{attrs:{placeholder:"语言"},model:{value:e.postForm.language,callback:function(t){e.$set(e.postForm,"language",t)},expression:"postForm.language"}})],1)],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{prop:"rootFile",label:"根文件：","label-width":e.labelWidth}},[a("el-input",{attrs:{placeholder:"根文件",disabled:""},model:{value:e.postForm.rootFile,callback:function(t){e.$set(e.postForm,"rootFile",t)},expression:"postForm.rootFile"}})],1)],1)],1),a("el-row",[a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{prop:"filePath",label:"文件路径：","label-width":e.labelWidth}},[a("el-input",{attrs:{placeholder:"文件路径",disabled:""},model:{value:e.postForm.filePath,callback:function(t){e.$set(e.postForm,"filePath",t)},expression:"postForm.filePath"}})],1)],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{prop:"unzipPath",label:"解压路径：","label-width":e.labelWidth}},[a("el-input",{attrs:{placeholder:"解压路径",disabled:""},model:{value:e.postForm.unzipPath,callback:function(t){e.$set(e.postForm,"unzipPath",t)},expression:"postForm.unzipPath"}})],1)],1)],1),a("el-row",[a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{prop:"coverPath",label:"封面路径：","label-width":e.labelWidth}},[a("el-input",{attrs:{placeholder:"封面路径",disabled:""},model:{value:e.postForm.coverPath,callback:function(t){e.$set(e.postForm,"coverPath",t)},expression:"postForm.coverPath"}})],1)],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{prop:"originalName",label:"文件名称：","label-width":e.labelWidth}},[a("el-input",{attrs:{placeholder:"文件名称",disabled:""},model:{value:e.postForm.originalName,callback:function(t){e.$set(e.postForm,"originalName",t)},expression:"postForm.originalName"}})],1)],1)],1),a("el-row",[a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{label:"封面：","label-width":e.labelWidth}},[e.postForm.cover?a("a",{attrs:{href:e.postForm.cover,target:"_blank"}},[a("img",{staticClass:"preview-img",attrs:{src:e.postForm.cover,alt:""}})]):a("span",[e._v("无")])])],1)],1),a("el-row",[a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{label:"目录：","label-width":e.labelWidth}},[e.contentsTree&&e.contentsTree.length>0?a("div",{staticClass:"contents-wrapper"},[a("el-tree",{attrs:{data:e.contentsTree},on:{"node-click":e.onContentClick}})],1):a("span",[e._v("无")])])],1)],1)],1)],1)},o=[],i=a("5530"),n=(a("b64b"),function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{style:{height:e.height+"px",zIndex:e.zIndex}},[a("div",{class:e.className,style:{top:e.isSticky?e.stickyTop+"px":"",zIndex:e.zIndex,position:e.position,width:e.width,height:e.height+"px"}},[e._t("default",[a("div",[e._v("sticky")])])],2)])}),s=[],r=(a("a9e3"),{name:"Sticky",props:{stickyTop:{type:Number,default:0},zIndex:{type:Number,default:1},className:{type:String,default:""}},data:function(){return{active:!1,position:"",width:void 0,height:void 0,isSticky:!1}},mounted:function(){this.height=this.$el.getBoundingClientRect().height,window.addEventListener("scroll",this.handleScroll),window.addEventListener("resize",this.handleResize)},activated:function(){this.handleScroll()},destroyed:function(){window.removeEventListener("scroll",this.handleScroll),window.removeEventListener("resize",this.handleResize)},methods:{sticky:function(){this.active||(this.position="fixed",this.active=!0,this.width=this.width+"px",this.isSticky=!0)},handleReset:function(){this.active&&this.reset()},reset:function(){this.position="",this.width="auto",this.active=!1,this.isSticky=!1},handleScroll:function(){var e=this.$el.getBoundingClientRect().width;this.width=e||"auto";var t=this.$el.getBoundingClientRect().top;t<this.stickyTop?this.sticky():this.handleReset()},handleResize:function(){this.isSticky&&(this.width=this.$el.getBoundingClientRect().width+"px")}}}),u=r,c=a("2877"),d=Object(c["a"])(u,n,s,!1,null,null,null),p=d.exports,m=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"upload-container"},[a("el-upload",{staticClass:"image-upload",attrs:{action:e.action,headers:e.headers,multiple:!1,limit:1,"before-upload":e.beforeUpload,"on-success":e.onSuccess,"on-error":e.onError,"on-remove":e.onRemove,"file-list":e.fileList,"on-exceed":e.onExceed,disabled:e.disabled,drag:"","show-file-list":"",accept:"application/epub+zip"}},[a("i",{staticClass:"el-icon-upload"}),0===e.fileList.length?a("div",{staticClass:"el-upload__text"},[e._v(" 请将电子书拖入或 "),a("em",[e._v("点击上传")])]):a("div",{staticClass:"el-upload__text"},[e._v("图书已上传")])])],1)},h=[],f=a("5f87"),b={name:"EbookUpload",props:{fileList:{type:Array,default:function(){return[]}},disabled:{type:Boolean,default:!1}},data:function(){return{action:"".concat("http://47.95.217.159:3003","/book/upload")}},computed:{headers:function(){return{Authorization:"Bearer ".concat(Object(f["a"])())}}},methods:{beforeUpload:function(e){this.$emit("beforeUpload",e)},onSuccess:function(e,t){var a=e.code,l=e.msg,o=e.data;0===a?(this.$message({message:l,type:"success",showClose:!0}),this.$emit("onSuccess",o)):(this.$message({message:l&&"上传失败，失败原因：".concat(l)||"上传失败",type:"error",showClose:!0}),this.$emit("onError",t))},onError:function(e){var t=e.message&&JSON.parse(e.message);this.$message({message:t.msg&&"上传失败，失败原因：".concat(t.msg)||"上传失败",type:"error",showClose:!0}),this.$emit("onError",e)},onRemove:function(){this.$message({message:"电子书删除成功",type:"success",showClose:!0}),this.$emit("onRemove")},onExceed:function(){this.$message({message:"每次只能上传一本电子书",type:"warning",showClose:!0})}}},v=b,g=Object(c["a"])(v,m,h,!1,null,null,null),w=g.exports,y=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"material-input__component",class:e.computedClasses},[a("div",{class:{iconClass:e.icon}},[e.icon?a("i",{staticClass:"el-input__icon material-input__icon",class:["el-icon-"+e.icon]}):e._e(),"email"===e.type?a("input",{directives:[{name:"model",rawName:"v-model",value:e.currentValue,expression:"currentValue"}],staticClass:"material-input",attrs:{name:e.name,placeholder:e.fillPlaceHolder,readonly:e.readonly,disabled:e.disabled,autocomplete:e.autoComplete,required:e.required,type:"email"},domProps:{value:e.currentValue},on:{focus:e.handleMdFocus,blur:e.handleMdBlur,input:[function(t){t.target.composing||(e.currentValue=t.target.value)},e.handleModelInput]}}):e._e(),"url"===e.type?a("input",{directives:[{name:"model",rawName:"v-model",value:e.currentValue,expression:"currentValue"}],staticClass:"material-input",attrs:{name:e.name,placeholder:e.fillPlaceHolder,readonly:e.readonly,disabled:e.disabled,autocomplete:e.autoComplete,required:e.required,type:"url"},domProps:{value:e.currentValue},on:{focus:e.handleMdFocus,blur:e.handleMdBlur,input:[function(t){t.target.composing||(e.currentValue=t.target.value)},e.handleModelInput]}}):e._e(),"number"===e.type?a("input",{directives:[{name:"model",rawName:"v-model",value:e.currentValue,expression:"currentValue"}],staticClass:"material-input",attrs:{name:e.name,placeholder:e.fillPlaceHolder,step:e.step,readonly:e.readonly,disabled:e.disabled,autocomplete:e.autoComplete,max:e.max,min:e.min,minlength:e.minlength,maxlength:e.maxlength,required:e.required,type:"number"},domProps:{value:e.currentValue},on:{focus:e.handleMdFocus,blur:e.handleMdBlur,input:[function(t){t.target.composing||(e.currentValue=t.target.value)},e.handleModelInput]}}):e._e(),"password"===e.type?a("input",{directives:[{name:"model",rawName:"v-model",value:e.currentValue,expression:"currentValue"}],staticClass:"material-input",attrs:{name:e.name,placeholder:e.fillPlaceHolder,readonly:e.readonly,disabled:e.disabled,autocomplete:e.autoComplete,max:e.max,min:e.min,required:e.required,type:"password"},domProps:{value:e.currentValue},on:{focus:e.handleMdFocus,blur:e.handleMdBlur,input:[function(t){t.target.composing||(e.currentValue=t.target.value)},e.handleModelInput]}}):e._e(),"tel"===e.type?a("input",{directives:[{name:"model",rawName:"v-model",value:e.currentValue,expression:"currentValue"}],staticClass:"material-input",attrs:{name:e.name,placeholder:e.fillPlaceHolder,readonly:e.readonly,disabled:e.disabled,autocomplete:e.autoComplete,required:e.required,type:"tel"},domProps:{value:e.currentValue},on:{focus:e.handleMdFocus,blur:e.handleMdBlur,input:[function(t){t.target.composing||(e.currentValue=t.target.value)},e.handleModelInput]}}):e._e(),"text"===e.type?a("input",{directives:[{name:"model",rawName:"v-model",value:e.currentValue,expression:"currentValue"}],staticClass:"material-input",attrs:{name:e.name,placeholder:e.fillPlaceHolder,readonly:e.readonly,disabled:e.disabled,autocomplete:e.autoComplete,minlength:e.minlength,maxlength:e.maxlength,required:e.required,type:"text"},domProps:{value:e.currentValue},on:{focus:e.handleMdFocus,blur:e.handleMdBlur,input:[function(t){t.target.composing||(e.currentValue=t.target.value)},e.handleModelInput]}}):e._e(),a("span",{staticClass:"material-input-bar"}),a("label",{staticClass:"material-label"},[e._t("default")],2)])])},F=[],x={name:"MdInput",props:{icon:String,name:String,type:{type:String,default:"text"},value:[String,Number],placeholder:String,readonly:Boolean,disabled:Boolean,min:String,max:String,step:String,minlength:Number,maxlength:Number,required:{type:Boolean,default:!0},autoComplete:{type:String,default:"off"},validateEvent:{type:Boolean,default:!0}},data:function(){return{currentValue:this.value,focus:!1,fillPlaceHolder:null}},computed:{computedClasses:function(){return{"material--active":this.focus,"material--disabled":this.disabled,"material--raised":Boolean(this.focus||this.currentValue)}}},watch:{value:function(e){this.currentValue=e}},methods:{handleModelInput:function(e){var t=e.target.value;this.$emit("input",t),"ElFormItem"===this.$parent.$options.componentName&&this.validateEvent&&this.$parent.$emit("el.form.change",[t]),this.$emit("change",t)},handleMdFocus:function(e){this.focus=!0,this.$emit("focus",e),this.placeholder&&""!==this.placeholder&&(this.fillPlaceHolder=this.placeholder)},handleMdBlur:function(e){this.focus=!1,this.$emit("blur",e),this.fillPlaceHolder=null,"ElFormItem"===this.$parent.$options.componentName&&this.validateEvent&&this.$parent.$emit("el.form.blur",[this.currentValue])}}},_=x,k=(a("751e"),Object(c["a"])(_,y,F,!1,null,"d18e8376",null)),$=k.exports,C=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},P=[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("aside",[e._v(" 上传电子书分为两步：上传电子书和新增电子书。首先需要上传epub电子书文件，服务器会对epub文件进行解析，解析成功后会将电子书的各字段填入表单，之后我们只需手动点击新增电子书即可完成电子书的保存。查看： "),a("a",{attrs:{href:"http://www.youbaobao.xyz/admin-docs/",target:"_blank"}},[e._v("课程官网")]),e._v(" 获取更多开发指引。 ")])}],E={},N=Object(c["a"])(E,C,P,!1,null,null,null),S=N.exports,V=a("b067"),M={title:"",author:"",publisher:"",language:"",rootFile:"",filePath:"",unzipPath:"",coverPath:"",cover:"",originalName:"",fileName:""},z={title:"标题",author:"作者",publisher:"出版社",language:"语言"},B={name:"Detail",components:{Sticky:p,Warning:S,EbookUpload:w,MdInput:$},props:{isEdit:Boolean},data:function(){var e=function(e,t,a){0===t.length?a(new Error(z[e.field]+"必须填写")):a()};return{loading:!1,postForm:{status:""},labelWidth:"120px",fileList:[],contentsTree:[],rules:{title:[{validator:e}],author:[{validator:e}],publisher:[{validator:e}],language:[{validator:e}]}}},created:function(){if(this.isEdit){var e=this.$route.params.fileName;this.getBookData(e)}},methods:{getBookData:function(e){var t=this;Object(V["c"])(e).then((function(e){t.setData(e.data)}))},submitForm:function(){var e=this,t=function(t){var a=t.msg;e.$notify({title:"操作成功",message:a,type:"success",duration:2e3})};this.loading=!0,this.$refs.postForm.validate((function(a,l){if(a){var o=Object.assign({},e.postForm);delete o.status,delete o.contentsTree,e.isEdit?Object(V["f"])(o).then((function(e){t(e)})).catch((function(){})):Object(V["a"])(o).then((function(a){t(a),e.setDefault()})).catch((function(){})),e.loading=!1}else{var i=l[Object.keys(l)[0]][0].message;e.$message({message:i,type:"error",showClose:!0}),e.loading=!1}}))},setData:function(e){var t=e.title,a=e.author,l=e.publisher,o=e.language,n=e.rootFile,s=e.cover,r=e.originalName,u=e.contents,c=e.coverPath,d=e.filePath,p=e.unzipPath,m=e.contentsTree,h=e.fileName;this.postForm=Object(i["a"])(Object(i["a"])({},this.postForm),{},{title:t,author:a,publisher:l,language:o,rootFile:n,filePath:d,unzipPath:p,coverPath:c,cover:s,contents:u,originalName:r,fileName:h}),this.contentsTree=m,this.fileList=[{name:r||h}]},setDefault:function(){this.postForm=Object.assign({},M),this.contentsTree=[],this.fileList=[],this.$refs.postForm.resetFields()},onContentClick:function(e){e.text&&window.open(e.text)},showGuide:function(){console.log("showGuide...")},onUploadSucess:function(e){this.setData(e)},onUploadRemove:function(){this.setDefault()}}},O=B,j=(a("2804"),Object(c["a"])(O,l,o,!1,null,"c845804a",null));t["a"]=j.exports},aeae:function(e,t,a){},b067:function(e,t,a){"use strict";a.d(t,"a",(function(){return o})),a.d(t,"c",(function(){return i})),a.d(t,"f",(function(){return n})),a.d(t,"d",(function(){return s})),a.d(t,"e",(function(){return r})),a.d(t,"b",(function(){return u}));var l=a("b775");function o(e){return Object(l["a"])({url:"/book/create",method:"post",data:e})}function i(e){return Object(l["a"])({url:"/book/get",method:"get",params:{fileName:e}})}function n(e){return Object(l["a"])({url:"/book/update",method:"post",data:e})}function s(){return Object(l["a"])({url:"/book/category",method:"get"})}function r(e){return Object(l["a"])({url:"/book/list",method:"get",params:e})}function u(e){return Object(l["a"])({url:"/book/delete",method:"get",params:{fileName:e}})}}}]);