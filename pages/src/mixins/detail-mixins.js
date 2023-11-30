export default {
  data() {
    return {
      detailType: 'dialog',
      detailVisible: false,
      detailForm: {}
    }
  },

  methods: {
    // 表格新增
    addOperation() {
      this.detailVisible = true
    },
    // 表格修改
    updateOperation(rows) {
      this.detailVisible = true
      this.$nextTick(() => {
        this.detailForm = JSON.parse(JSON.stringify(rows[0]))
      })
    },
    // 表格详情
    detailOperation(rows) {
      this.detailVisible = true
      this.$nextTick(() => {
        this.detailForm = JSON.parse(JSON.stringify(rows[0]))
      })
    }
  }
}
