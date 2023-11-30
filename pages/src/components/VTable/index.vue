<template>
  <el-table
    ref="tableRef"
    v-loading="loading"
    :height="maxHeight"
    :data="tableData"
    :stripe="stripe"
    fit
    v-bind="$attrs"
    v-on="$listeners"
    @row-dblclick="rowDbClick"
    @selection-change="selectionChange"
  >
    <el-table-column v-if="showCheckbox" type="selection" align="center" width="45" />
    <template v-for="item in tableHeader">
      <el-table-column
        v-if="item.visible && !item.hidden"
        :key="item.field"
        :prop="item.field"
        :label="item.label || ''"
        :min-width="item.minWidth || item.width || '80px'"
        :align="item.align || 'center'"
        :header-align="item.headerAlign || 'center'"
        v-bind="item.itemAttr || {}"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <span v-if="item.type === 'slot'">
            <slot :name="item.field" :row="row" :field="item.field" :label="item.label" :value="row[item.field]" />
          </span>
          <span v-else>
            {{ item.format ? item.format(row[item.field], row, item.field) : row[item.field] }}
          </span>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script>
export default {
  name: 'VTable',

  props: {
    loading: {
      type: Boolean,
      default: false
    },
    // 列表数据
    tableData: {
      type: Array,
      default: () => []
    },
    // 表格表头配置项
    tableHeader: {
      type: Array,
      default: () => []
    },
    // 是否展示复选框
    showCheckbox: {
      type: Boolean,
      default: true
    },
    // 表格高度
    // maxHeight: {
    //   type: [String, Number],
    //   default: document.body.clientHeight
    // },
    // 表格斑马纹
    stripe: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      selectList: [],
      maxHeight: document.body.clientHeight
    }
  },

  methods: {
    // 当某一行被双击时会触发该事件
    rowDbClick(row) {
      this.$emit('row-dblclick', row)
    },
    // 当选择项发生变化时会触发该事件
    selectionChange(selection) {
      this.selectList = selection
      this.$emit('selection-change', selection)
    },
    // 表格勾选切换
    toggleRowSelection(row) {
      this.$refs.tableRef.clearSelection()
      this.$refs.tableRef.toggleRowSelection(row, true)
    },
    clearSelection() {
      this.$refs.tableRef.clearSelection()
    }
  }
}
</script>
