export default {
  data() {
    return {
      preUrl: '',
      page: {
        current: 1,
        sizes: [10, 20, 50, 100],
        size: 10,
        total: 0,
      },
      multipleSelection: [], //多选
      loading: true
    }
  },
  filters: {
    numToString(value) {
      return value.toString()
    },
  },
  created() {
    this.getList()
  },
  computed: {
    ids() {
      return this.multipleSelection.map((item) => {
        return item.id
      })
    },
  },
  methods: {

    showLoading() {
      if (this.loading) {
        this.layout.showLoading()
      }
    },
    hideLoading() {
      if (this.loading) {
        this.layout.hideLoading()
      }
    },

    /**
     * @param {data} Array 返回的数据
     * @param {getListResult} function 方便其他页面调用
     * @default 处理mixins 公共数据，赋值
     */
    getListResult(data) {
      // 处理返回的结果
    },
    getListUrl() {
      //处理url以及参数
      return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}`
    },
    getList() {
      if (this.preUrl == '') return
      this.showLoading()
      let url = this.getListUrl()
      this.axios
        .get(url, {
          token: true,
        })
        .then((res) => {
          let data = res.data.data
          this.getListResult(data)
          this.page.total = data.totalCount
          this.hideLoading()
        })
        .catch((err) => {
          this.hideLoading()
        })
    },
    addOrEdit(data, id = 0) {
      this.showLoading()
      let msg = id > 0 ? '修改' : '增加'
      let url =
        id > 0 ? '/admin/' + this.preUrl + '/' + id : '/admin/' + this.preUrl
      this.axios
        .post(url, data, {
          token: true,
        })
        .then((res) => {
          this.$message({
            message: msg + '成功',
            type: 'success',
          })
          this.getList()
          this.hideLoading()
        })
        .catch((err) => {
          this.hideLoading()
        })
    },
    // 批量删除url
    deleteAllUrl() {
      return '/admin/' + this.preUrl + '/delete_all'
    },
    // 批量删除
    deleteAll() {
      if (this.ids.length === 0) {
        return this.$message({
          message: '请先选中需要删除的信息',
          type: 'error',
        })
      }
      this.$confirm('是否要删除选中规格?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.showLoading()
        let url = this.deleteAllUrl()
        this.axios
          .post(
            url, {
              ids: this.ids,
            }, {
              token: true,
            }
          )
          .then((res) => {
            this.multipleSelection = []
            this.$message({
              message: '删除成功',
              type: 'success',
            })
            this.getList()
            this.hideLoading()
          })
          .catch((err) => {
            this.hideLoading()
          })
      })
    },
    changeStatus(item) {
      // 修改状态
      this.showLoading()
      let status = item.status === 1 ? 0 : 1
      let msg = item.status === 1 ? '启用' : '禁用'
      this.axios
        .post(
          `/admin/${this.preUrl}/${item.id}/update_status`, {
            status: status,
          }, {
            token: true,
          }
        )
        .then((res) => {
          item.status = status
          this.$message({
            message: msg + '成功',
            type: 'success',
          })
          this.hideLoading()
        })
        .catch((err) => {
          this.hideLoading()
        })
      item.status = !item.status
    },

    deleteItem(item) {
      // 删除商品规格
      this.$confirm('此操作将永久删除该规格, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.showLoading()
        this.axios
          .post(
            '/admin/' + this.preUrl + '/' + item.id + '/delete', {}, {
              token: true,
            }
          )
          .then((res) => {
            this.getList()
            this.hideLoading()
            this.$message({
              message: '删除成功',
              type: 'success',
            })
          })
          .catch((err) => {
            this.hideLoading()
          })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.page.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.getList()
    },
  },
}