<template>
  <div class="top-right-btn" :style="style">
    <el-row>
      <el-tooltip
        v-if="search"
        class="item"
        effect="dark"
        :content="showSearch ? '隐藏搜索' : '显示搜索'"
        placement="top"
      >
        <el-button size="mini" circle icon="el-icon-search" @click="toggleSearch" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
        <el-button size="mini" circle icon="el-icon-refresh" @click="refresh" />
      </el-tooltip>
      <el-tooltip v-if="columns" class="item" effect="dark" content="显隐列" placement="top">
        <el-button size="mini" circle icon="el-icon-menu" @click="showColumn" />
      </el-tooltip>
    </el-row>
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-transfer v-model="value" :titles="['显示', '隐藏']" :data="columns" @change="dataChange"></el-transfer>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'RightToolbar',
  props: {
    showSearch: {
      type: Boolean,
      default: true
    },
    columns: {
      type: Array
    },
    search: {
      type: Boolean,
      default: true
    },
    gutter: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      // 显隐数据
      value: [],
      // 弹出层标题
      title: '显示/隐藏',
      // 是否显示弹出层
      open: false,
      cols: []
    }
  },
  computed: {
    style() {
      const ret = {}
      if (this.gutter) {
        ret.marginRight = `${this.gutter / 2}px`
      }
      return ret
    }
  },
  created() {
    // 显隐列初始默认隐藏列
    this.cols = this.columns.map((i, idx) => {
      i.key = idx
      return i
    })
    for (const item in this.cols) {
      if (this.cols[item].visible === false) {
        this.value.push(parseInt(item))
      }
    }
  },
  methods: {
    // 搜索
    toggleSearch() {
      this.$emit('update:showSearch', !this.showSearch)
    },
    // 刷新
    refresh() {
      this.$emit('queryTable')
    },
    // 右侧列表元素变化
    dataChange(data) {
      for (const item in this.cols) {
        const key = this.cols[item].key
        this.cols[item].visible = !data.includes(key)
      }
    },
    // 打开显隐列dialog
    showColumn() {
      this.open = true
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-transfer__button) {
  border-radius: 50%;
  display: block;
  margin-left: 0px;
  padding: 8px;
}
:deep(.el-transfer__button:first-child) {
  margin-bottom: 10px;
}
.my-el-transfer {
  text-align: center;
}
</style>
