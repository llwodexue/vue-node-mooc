## 基本用法

[Element-UI 入门](http://www.youbaobao.xyz/admin-docs/guide/base/element.html)

- 初始化项目并安装 ElementUI

```bash
# 初始化项目
vue create element-test
# 切换目录运行
cd element-test
npm run serve
# 安装element-ui
npm i element-ui -S
```

- 全局引入

```js
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
```

- 按需引入

  参考官网做法即可：[按需引入](https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru)

```bash
# 项目打包
npm run build
# 查看dist js文件大小 1.1M左右
ll dist/js
# -rw-r--r-- 1 xxx 197609 118697  9月 27 11:10 chunk-vendors.123827f3.js
```

- 插件引用

```bash
vue add element
```

## 表单基本用法

1. `el-form` 容器，通过 `v-model` 绑定数据
2. `el-form-item` 容器，通过 `label` 绑定标签
3. 表单组件通过 `v-model` 绑定 `model` 中的数据

```html
<template>
  <div id="app">
    <el-form inline :model="data">
      <el-form-item label="审批人">
        <el-input v-model="data.user" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="data.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      data: {
        user: '',
        region: '区域二'
      }
    }
  },
  methods: {
    onSubmit() {
      console.log(this.data)
    }
  }
}
</script>
```

## 表单校验用法

### 基础用法

1. 定义校验规则

```js
data() {
  const userValidator = (rule, value, callback) => {
    if (value.length > 3) {
      callback()
    } else {
      callback(new Error('用户名长度必须大于3'))
    }
  }
  return {
    data: {
      user: 'sam',
      region: '区域二'
    },
    rules: {
      user: [
        { required: true, trigger: 'change', message: '用户名必须录入' },
        { validator: userValidator, trigger: 'change' }
      ]
    }
  }
},
methods: {
  onSubmit() {
    this.$refs.form.validate((isValid, errors) => {
      console.log(isValid, errors)
    })
  }
}
```

2. 指定 `el-form-item` 的 `prop` 属性（在使用 `validate`、`resetFields` 方法的情况下，该属性必填）

```html
<el-form inline :model="data" :rules="rules" ref="form">
  <el-form-item label="审批人" prop="user">
    <el-input v-model="data.user" placeholder="审批人" clearable></el-input>
  </el-form-item>
</el-form>
```

### 动态添加校验规则

- `rules` 删除一个校验规则，现在只包含一个校验规则

```js
data() {
  return {
    data: {
      user: '',
      region: '',
    },
    rules: {
      user: [
        { required: true, trigger: 'change', message: '用户名必须录入' }
      ],
    },
  }
},
```

- 动态添加 `rules`

  表单中添加新的校验规则会立即进行校验，是因为这个属性 `validate-on-rule-change` 默认为 true，改为 false 即可
  
   `<el-form inline :model="data" :rules="rules" ref="form" validate-on-rule-change="false">`

```js
addRule() {
  const userValidator = (rule, value, callback) => {
    if (value.length > 3) {
      /* this.inputError = ''
      this.inputValidateStatus = '' */
      callback()
    } else {
      callback(new Error('用户名长度必须大于3'))
    }
  }
  const newRule = [...this.rules.user, { validator: userValidator, trigger: 'change' }]
  this.rules = Object.assign({}, this.rules, { user: newRule })
},
```

注意：新增新规则必须重新生成一个新的 `rules` 对象，因为 `watch` 只能监听 `rules`，而监听不到内部的变化

- 使用 `this.rules = Object.assign({}. this.rules, { user: newRule })`
- 不能使用 `this.rules.user.push(newRule)`

### 手动控制校验状态

> - validate-status：验证状态，枚举值，共四种：
>   - success：验证成功
>   - error：验证失败
>   - validating：验证中
>   - （空）：未验证
> - error：自定义错误提示

1. 在 `data` 中新增 `error` 和 `status` 变量

2. 设置 `status-icon` 属性

   ```html
   <el-form inline :model="data" :rules="rules" ref="form" validate-on-rule-change="false" status-icon>
   ```

3. 设置 `el-form-item` 属性

   ```js
   <el-form-item label="审批人" prop="user" :error="error" :validate-status="status">
   ```

4. 新增按钮

   ```html
   <el-button type="success" @click="showSuccess">校验成功</el-button>
   <el-button type="danger" @click="showError">校验失败</el-button>
   <el-button type="warning" @click="showValidating">校验中</el-button>
   ```

5. 在 `methods` 中定义 `status` 和  `error` 的方法

   ```js
   showError() {
     this.status = 'error'
     this.error = '用户名输入有误'
   },
   showSuccess() {
     this.status = 'success'
     this.error = ''
   },
   showValidating() {
     this.status = 'validating'
     this.error = ''
   },
   ```

### 表单属性

- `label-position`：标签位置 `left`、`right`、`top`。如果设置为 `left`、`right` 则需要设置 `label-width`
- `label-width`：标签宽度
- `label-suffix`：标签后缀，一般会设置个冒号 `：`
- `inline`：行内表单
- `disabled`：设置整个 `form` 的表单组件全部 `disabled`，优先级低于表单组件自身的 `disabled`
- `status-icon`：输入框右侧显示校验反馈图标
- `validate-on-rule-change`：是否在 `rules` 属性改变后立即触发一次验证

**disbabled**

- 直接看 `element-ui\packages\form\src\form.vue` 

  看里面是没有对 `disabled` 进行处理，而是用 `provide` 将自身传递给了后代

```js
provide() {
  return {
    elForm: this
  };
},
```

- 之后去看 `element-ui\packages\input\src\input.vue` 

  找到  `:disabled="inputDisabled"`  ，这里先判断自身是否有 `disabled` 属性，再判断祖先是否含有（自身的优先级高一些）。这里使用了 `inject` 去接收 `elForm` 和 `elFormItem`

```js
inject: {
  elForm: {
    default: ''
  },
  elFormItem: {
    default: ''
  }
},
computed: {
  inputDisabled() {
    return this.disabled || (this.elForm || {}).disabled;
  },
}
```

**size**

- 先去看 `element-ui\packages\input\src\input.vue` 

  找到 `inputSize ? 'el-input--' + inputSize : '',` ，会先找到 `_elFormItemSize`，之后会去找 `elFormItem` 里的 elFormItemSize

```js
computed: {
  _elFormItemSize() {
    return (this.elFormItem || {}).elFormItemSize;
  },
  inputSize() {
    return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
  },
}
```

- 之后去看 `element-ui\packages\form\src\form-item.vue` 

  它也是通过 `provide` 将自身传递给后代

```js
provide() {
  return {
    elFormItem: this
  };
},
```

这里去找 `elFormItemSize`，最后发现它是直接找 `this.elForm.size`

```js
computed: {
  _formSize() {
    return this.elForm.size;
  },
  elFormItemSize() {
    return this.size || this._formSize;
  },
}
```

## ElementUI form 源码

### 入口

`element-ui\src\index.js` 是 ElementUI 的入口文件

- `Vue.use(Element)` 调用 ElementUI 入口的 `install` 方法，会加载全部组件

  所有组件在存在 `components` 数组中

```js
const install = function(Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
  // 全局引入时不需要写这些
  Vue.prototype.$loading = Loading.service;
  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
  Vue.prototype.$notify = Notification;
  Vue.prototype.$message = Message;
};
```

按需加载相当于手动调用 `Vue.component(xxx.name, xxx)`

### from.vue

`el-form` 中容器功能是通过插槽来实现的，自身属性只有两个 `labelPosition`、`inline`，其余全部向下传递

```html
<template>
  <form class="el-form" :class="[
    labelPosition ? 'el-form--label-' + labelPosition : '',
    { 'el-form--inline': inline }
  ]">
    <slot></slot>
  </form>
</template>
```

`watch` 主要监听 `rules` 的变化，对 `rules` 进行变更会去判断 `validateOnRuleChange` 是否启用，启用则执行一次

```js
watch: {
  rules() {
    // remove then add event listeners on form-item after form rules change
    this.fields.forEach(field => {
      field.removeValidateEvents();
      field.addValidateEvents();
    });

    if (this.validateOnRuleChange) {
      this.validate(() => {});
    }
  }
},
```

- `from` 里的  `validate` 对整个表单进行验证

```js
validate(callback) {
  // 判断有没有表单数据
  if (!this.model) {
    console.warn('[Element Warn][Form]model is required for validate to work!');
    return;
  }

  let promise;
  // if no callback, return promise
  if (typeof callback !== 'function' && window.Promise) {
    promise = new window.Promise((resolve, reject) => {
      callback = function(valid) {
        valid ? resolve(valid) : reject(valid);
      };
    });
  }

  let valid = true;
  let count = 0;
  // 如果需要验证的fields为空，调用验证时立刻返回callback
  if (this.fields.length === 0 && callback) {
    callback(true);
  }
  let invalidFields = {};
  // 依次遍历所有field，一个一个验证
  this.fields.forEach(field => {
    // 执行form-item里的validate方法
    field.validate('', (message, field) => {
      if (message) {
        valid = false;
      }
      invalidFields = objectAssign({}, invalidFields, field);
      // 如果有错误会调用callback
      if (typeof callback === 'function' && ++count === this.fields.length) {
        callback(valid, invalidFields);
      }
    });
  });

  if (promise) {
    return promise;
  }
},
```

### form-item.vue

- `is-no-asterisk` -> `hide-required-asterisk` 是否隐藏必填字段的标签旁边的红色星号

```html
<template>
  <div class="el-form-item" :class="[{
      'el-form-item--feedback': elForm && elForm.statusIcon,
      'is-error': validateState === 'error',
      'is-validating': validateState === 'validating',
      'is-success': validateState === 'success',
      'is-required': isRequired || required,
      'is-no-asterisk': elForm && elForm.hideRequiredAsterisk
    },
    sizeClass ? 'el-form-item--' + sizeClass : ''
  ]">
    <label-wrap
      :is-auto-width="labelStyle && labelStyle.width === 'auto'"
      :update-all="form.labelWidth === 'auto'">
      <label :for="labelFor" class="el-form-item__label" :style="labelStyle" v-if="label || $slots.label">
        <slot name="label">{{label + form.labelSuffix}}</slot>
      </label>
    </label-wrap>
    <div class="el-form-item__content" :style="contentStyle">
      <slot></slot>
      <transition name="el-zoom-in-top">
        <slot
          v-if="validateState === 'error' && showMessage && form.showMessage"
          name="error"
          :error="validateMessage">
          <div
            class="el-form-item__error"
            :class="{
              'el-form-item__error--inline': typeof inlineMessage === 'boolean'
                ? inlineMessage
                : (elForm && elForm.inlineMessage || false)
            }"
          >
            {{validateMessage}}
          </div>
        </slot>
      </transition>
    </div>
  </div>
</template>
```

当表单验证有误时，文字出现是有动画的，使用的是 Vue 的 `transition` 组件的动画

- `transition` 组件里面有个 `slot` 插槽（具名插槽 `name="error"`），这里允许我们自己对错误提示文本的样式进行自定义修改

```scss
$--md-fade-transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1), opacity 300ms cubic-bezier(0.23, 1, 0.32, 1) !default;

.el-zoom-in-top-enter-active,
.el-zoom-in-top-leave-active {
  opacity: 1;
  transform: scaleY(1);
  transition: $--md-fade-transition;
  transform-origin: center top;
}
.el-zoom-in-top-enter,
.el-zoom-in-top-leave-active {
  opacity: 0;
  transform: scaleY(0);
}
```

- 之前自定义 `error`，它会立即展示出来效果（在 `created` 会执行一次）

```js
watch: {
  error: {
    immediate: true,
    handler(value) {
      this.validateMessage = value;
      this.validateState = value ? 'error' : '';
    }
  },
  validateStatus(value) {
    this.validateState = value;
  }
},
```

- `from-item` 里的 `validate` 对每一项进行验证

```js
validate(trigger, callback = noop) {
  this.validateDisabled = false;
  const rules = this.getFilteredRule(trigger);
  // 没有验证规则，直接返回true
  if ((!rules || rules.length === 0) && this.required === undefined) {
    callback();
    return true;
  }
  // 状态改为验证中
  this.validateState = 'validating';

  const descriptor = {};
  // 匹配async-validator第三方库需要的格式，做的处理
  if (rules && rules.length > 0) {
    rules.forEach(rule => {
      delete rule.trigger;
    });
  }
  descriptor[this.prop] = rules;

  // 对rulues进行验证，使用async-validator第三方库
  const validator = new AsyncValidator(descriptor);
  const model = {};
  // async-validator需要验证的数据
  model[this.prop] = this.fieldValue;
  // 验证
  validator.validate(model, { firstFields: true }, (errors, invalidFields) => {
    this.validateState = !errors ? 'success' : 'error';
    this.validateMessage = errors ? errors[0].message : '';
    // 执行回调
    callback(this.validateMessage, invalidFields);
    // form组件发布validate事件
    this.elForm && this.elForm.$emit('validate', this.prop, !errors, this.validateMessage || null);
  });
},
```

### async-validator

Element 表单校验主要使用了 [async-validator](https://github.com/yiminghe/async-validator) 这个库

![](https://gitee.com/lilyn/pic/raw/master/js-img/%E8%A1%A8%E5%8D%95%E6%BA%90%E7%A0%811.png)

这个插件基本流程如下：

- 按照 `rule` 的规则生成 `rules`，并指定每个字段的规范
- 根据 `rules` 生成验证器 `const validator = new Validator(rules)`
- 对验证器进行验证 `validator.validate(source, [options], callback)`
- 匹配 `source` 中的字段对应规则，全部通过或出错调用 `callback`

```js
import Validator from 'async-validator'

// 规则描述
const rules = {
  name: { type: 'string', require: true },
}
// 根据规则生成验证器
const validator = new Validator(rules)
// 要验证的数据源
const source = {
  name: 'bird',
}
// 验证后的回调函数
function callBack(errors, fields) {
  if (errors) {
    // 验证不通过，errors是一个数组，记录那些不通过的错误信息
    // fields 是所有数据源的字段名，即source中的name
  }
  // 验证通过后的逻辑
}
// 验证数据源是否符合规则（如果验证时有一个不通过，终止验证下个规则[一个字段多个规则情况]）
validator.validate(source, { firstFields: true }, callBack)
```

**Rules**

- 函数方式：`{ name(rule, value, callback, sources, options) }`
- 对象方式：`{ name: { type: 'string', required: true } }`
- 数组方式：`{ name: [{ type: 'string' }, { required: true }] }`

**Rules 默认规则**

- `type`：要验证的数据类型

  - `string`：必须是 String 类型
  - `number`：必须是 Number 类型
  - `boolean`：必须是 Boolean 类型
  - `method`：必须是 Function 类型
  - `regexp`：必须是 RegExp 类型
  - `array`：必须是 Array.isArray 通过的数组
  - `object`：必须是 Array.isArray 不通过的类型的 Object 类型
  - `date`：必须是 Date 对象的实例
  - `integer`：必须是 Number 类型的正整数
  - `float`：必须是 Number 类型的浮点数
  - `enum`：预先定义 enum，值必须是 enum 某个值
  - `url`：必须符合链接格式
  - `hex`：必须是 16 进制
  - `email`：必须符合邮件格式
  - `any`：任意数据类型

- `required`：是否必填

- `pattern`：使用正则来验证 `pattern: '[^ \x22]+'`（前后空格不匹配）

- `min`：数据长度的最小值（数据类型必须是 `string`、`array`）

- `max`：数据长度的最大值（数据类型必须是 `string`、`array`）

- `len`：数据长度必须等于这个值（数据类型必须是 `string`、`array`）

- `enum`：数据的值必须等于这个枚举数组中的某个元素

- `transform`：钩子函数，在开始验证之前对数据预先处理 `transform(value) { return value.trim() }`

- `message`：报错提示信息，可以是字符串或标签 `message: () => this.$t('name')`（不过这种变化不是实时的，想要实时的需要放在 computed 里面）

- `validator`：自定义验证函数以及报错信息 `validator(rule, value, callback)`

- deep rules 深度验证处理 object 或 array 类型，使用 `fields` 或 `defaultField`

  ```js
  const url = ['http://www.xx.com', 'http://www.xx.cn']
  const rules1 = {
    urls: {
      type: 'array',
      require: true,
      defaultField: { type: url },
    },
  }
  
  const obj = {
    name: 'bird',
    age: 12,
    addr: 'xxx',
  }
  const rules2 = {
    ids: {
      type: 'object',
      require: true,
      fields: {
        name: { type: 'string', require: true },
        age: { type: 'number', require: true, transform: Number },
        addr: { type: 'string', require: true },
      },
    },
  }
  ```

