<template>
  <div class="app-container">
    <div v-show="showSearch" class="table-search">
      <el-form ref="queryRef" :model="listQuery" :inline="true">
        <el-form-item label="书名">
          <el-input
            v-model="listQuery.title"
            placeholder="请输入书名"
            clearable
            style="width: 180px"
            @keyup.enter.native="handleFilter"
            @clear="handleFilter"
          />
        </el-form-item>
        <el-form-item label="作者">
          <el-input
            v-model="listQuery.author"
            placeholder="请输入作者"
            style="width: 180px"
            clearable
            @keyup.enter.native="handleFilter"
            @clear="handleFilter"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select
            v-model="listQuery.category"
            placeholder="请选择分类"
            style="width: 180px"
            clearable
            @change="handleFilter"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.value"
              :label="item.label + '(' + item.num + ')'"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-waves type="primary" icon="el-icon-search" style="margin-left: 10px" @click="handleFilter">
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-container">
      <div class="btn-container">
        <div class="btn">
          <el-button type="primary" icon="el-icon-plus" @click="handleCreate">新增</el-button>
          <el-checkbox v-model="showCover" style="margin-left: 20px">显示封面</el-checkbox>
        </div>
        <RightToolbar :show-search.sync="showSearch" :columns.sync="columns" @queryTable="getList" />
      </div>
      <VTable
        ref="tableRef"
        :loading="listLoading"
        :table-data="list"
        border
        highlight-current-row
        :table-header="columns"
        :default-sort="defaultSort"
        :show-checkbox="false"
        @sort-change="sortChange"
      >
        <template #titleWrapper="{ row: { titleWrapper } }">
          <span v-html="titleWrapper" />
        </template>
        <template #authorWrapper="{ row: { authorWrapper } }">
          <span v-html="authorWrapper" />
        </template>
        <template #cover="{ row: { cover } }">
          <a :href="cover" target="_blank">
            <img :src="cover" alt="" style="width: 120px; height: 180px" />
          </a>
        </template>
        <template #operator="{ row }">
          <el-button plain type="success" icon="el-icon-edit" @click="handleUpdate(row)">编辑</el-button>
          <el-button plain type="danger" icon="el-icon-delete" @click="handleDelete(row)">删除</el-button>
        </template>
      </VTable>

      <Pagination :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" :total="total" @pagination="refresh" />
    </div>
  </div>
</template>

<script>
import { getCategory, listBook, deleteBook } from '@/api/book'
import VTable from '@/components/VTable'
import { columns } from '../config/list'

export default {
  name: 'List',
  components: {
    VTable
  },
  data() {
    return {
      listLoading: false,
      listQuery: {},
      list: [],
      categoryList: [],
      showCover: false,
      total: 0,
      defaultSort: {},
      showSearch: true,
      columns
    }
  },
  watch: {
    showCover(val) {
      const idx = this.columns.findIndex(v => v.field === 'cover')
      if (idx !== -1) {
        console.log(val, idx, this.columns[idx])
        this.$set(this.columns, idx, Object.assign(this.columns[idx], { visible: val }))
        this.columns[idx].visible = val
      }
    }
  },
  created() {
    this.parseQuery()
  },
  mounted() {
    this.getList()
    this.getCategoryList()
  },
  beforeRouteUpdate(to, from, next) {
    if (to.path === from.path) {
      const newQuery = Object.assign({}, to.query)
      const oldQuery = Object.assign({}, from.query)
      if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
        this.getList()
      }
    }
    next()
  },
  methods: {
    parseQuery() {
      const query = Object.assign({}, this.$route.query)
      let sort = '+id'
      const listQuery = {
        page: 1,
        pageSize: 20,
        sort: '+id'
      }
      if (query) {
        query.page && (query.page = +query.page)
        query.pageSize && (query.pageSize = +query.pageSize)
        query.sort && (sort = query.sort)
      }
      const sortSymbol = sort[0]
      const sortColumn = sort.slice(1, sort.length)
      this.defaultSort = {
        prop: sortColumn,
        order: sortSymbol === '+' ? 'ascending' : 'descending'
      }
      this.listQuery = { ...listQuery, ...query }
    },
    wrapperKeyword(k, v) {
      function highlight(value) {
        return `<span style="color: #1890ff">${value}</span>`
      }
      if (!this.listQuery[k]) {
        return v
      } else {
        return v.replace(new RegExp(this.listQuery[k], 'ig'), v => highlight(v))
      }
    },
    getList() {
      this.listLoading = true
      listBook(this.listQuery).then(res => {
        const { list, count } = res.data
        this.list = list
        this.total = count
        this.listLoading = false
        this.list.forEach(book => {
          book.titleWrapper = this.wrapperKeyword('title', book.title)
          book.authorWrapper = this.wrapperKeyword('author', book.author)
        })
      })
    },
    getCategoryList() {
      getCategory().then(res => {
        this.categoryList = res.data
      })
    },
    sortChange(data) {
      console.log(data)
      const { prop, order } = data
      this.sortBy(prop, order)
    },
    sortBy(prop, order) {
      if (order === 'ascending') {
        this.listQuery.sort = `+${prop}`
      } else {
        this.listQuery.sort = `-${prop}`
      }
      this.handleFilter()
    },
    refresh() {
      this.$router.push({
        path: '/book/list',
        query: this.listQuery
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.refresh()
    },
    handleCreate() {
      this.$router.push('/book/create')
    },
    handleUpdate(row) {
      this.$router.push(`/book/edit/${row.fileName}`)
    },
    handleDelete(row) {
      this.$modal
        .confirm('此操作将永久删除该电子书，是否继续')
        .then(() => {
          deleteBook(row.fileName).then(res => {
            this.$modal.notify(res.msg || '删除成功')
            this.handleFilter()
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.filter-item {
  margin-right: 20px;
}
</style>
