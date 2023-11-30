export default {
  data() {
    return {
      isLoading: false,
      pagination: {
        pgNum: 1,
        pgSize: 15
      }
    }
  },

  methods: {
    // 列表查询
    getList(formData) {
      this.pagination.pgNum = 1
      // 存储当前检索项
      this.searchParams = this.slotForm ? { ...formData, ...this.slotForm } : formData
      this.getSearchApi()
    },
    /**
     * 表格相关事件
     * type - add/update/detail/delete
     */
    tableOperation({ type, rows }) {
      // 存储当前操作类型和选中项
      this.operationType = type
      this.roleSelectList = rows
      const operationFun = this[`${type}Operation`]
      operationFun && operationFun(rows)
    },
    // 表格删除
    deleteOperation(rows) {
      const tip = this.$tip()
      this.$modal
        .confirm(tip)
        .then(() => {
          this.getDeleteAPi(rows)
        })
        .catch(() => {})
    },
    /**
     * 接口
     */
    getSearchApi() {
      console.error('请重写方法 getSearchApi')
    },
    getDeleteAPi() {
      console.error('请重写方法 getDeleteAPi')
    }
  }
}
