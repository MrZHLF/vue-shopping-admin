<template>
  <div
    class="bg-white px-3"
    style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;"
  >
    <el-tabs v-model="preUrl">
      <el-tab-pane label="管理员列表" name="manager">
        <div class="d-flex align-items-center">
          <el-button type="primary" size="mini" @click="openDialog('manager')"
            >添加管理员</el-button
          >
          <div class="ml-auto d-flex">
            <el-input
              size="mini"
              placeholder="请输入用户名"
              v-model="keyword"
              style="width:200px;"
            ></el-input>
            <el-button type="info" size="mini" class="ml-2" @click="getList"
              >搜索</el-button
            >
          </div>
        </div>
        <el-table border class="mt-3" :data="managerList" style="width: 100%">
          <el-table-column align="center" label="用户头像">
            <template slot-scope="scope">
              <el-avatar size="large" :src="scope.row.avatar"></el-avatar>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="用户名"
            prop="username"
          ></el-table-column>
          <el-table-column align="center" label="所属管理员">
            <template slot-scope="scope">
              {{ scope.row.role.name }}
            </template>
          </el-table-column>
          <el-table-column prop="status" align="center" label="状态">
            <template slot-scope="scope">
              <el-button
                :type="scope.row.status ? 'success' : 'danger'"
                plain
                @click="changeStatus(scope.row)"
                >{{ scope.row.status ? "启用" : "禁用" }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="openDialog('manager', scope.row)"
                >修改</el-button
              >
              <el-button type="text" size="mini" @click="deleteItem(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="角色列表" name="role">
        <div class="d-flex align-items-center">
          <el-button type="primary" size="mini">添加角色</el-button>
        </div>
        <el-table border class="mt-3" :data="groupList" style="width: 100%">
          <el-table-column
            align="center"
            label="角色名称"
            prop="name"
          ></el-table-column>
          <el-table-column prop="status" align="center" label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="250">
            <template slot-scope="scope">
              <el-button type="text" size="mini">修改</el-button>
              <el-button type="text" size="mini">配置权限</el-button>
              <el-button type="text" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="权限列表" name="rule">
        <el-tree
          :data="data"
          :props="defaultProps"
          @node-click="handleNodeClick"
          default-expand-all
          :expand-on-click-node="false"
          draggable
          @node-drop="nodeDrop"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <div>
              <el-input
                v-if="data.editStatus"
                v-model="data.label"
                size="mini"
              ></el-input>
              <span v-else>{{ node.label }}</span>
            </div>
            <span>
              <el-button
                :type="data.status ? 'primary' : 'danger'"
                size="mini"
                @click.stop="showOrHide(data)"
                >{{ data.status ? "显示" : "隐藏" }}</el-button
              >
              <el-button type="success" size="mini" @click="append(data)"
                >增加</el-button
              >
              <el-button
                :type="data.editStatus ? 'default' : 'warning'"
                size="mini"
                @click="edit(data)"
                >{{ data.editStatus ? "完成" : "修改" }}</el-button
              >
              <el-button type="danger" size="mini" @click="remove(node, data)"
                >删除</el-button
              >
            </span>
          </span>
        </el-tree>
      </el-tab-pane>
      <el-footer
        class="border-top d-flex align-items-center px-0 position-fixed bg-white"
        style="bottom: 0;left: 200px;right: 0;z-index: 100;"
        v-if="preUrl != 'rule'"
      >
        <div style="flex: 1;" class="p-2">
          <el-pagination
            :current-page="page.current"
            :page-sizes="page.sizes"
            :page-size="page.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </el-footer>
    </el-tabs>
    <el-dialog title="标题" :visible.sync="dialogVisble">
      <el-form ref="form" :model="form.manager" label-width="80px">
        <el-form-item label="用户名" prop="username"
          ><el-input
            v-model="form.manager.username"
            placeholder="用户名"
            size="mini"
            style="width: 25%;"
          ></el-input
        ></el-form-item>
        <el-form-item label="密码" prop="password"
          ><el-input
            v-model="form.manager.password"
            placeholder="密码"
            size="mini"
            style="width: 25%;"
          ></el-input
        ></el-form-item>
        <el-form-item label="头像">
          <div>
            <span
              v-if="!form.manager.avatar"
              class="btn btn-light border mr-2"
              @click="chooseImage"
              ><i class="el-icon-plus"></i
            ></span>
            <img
              v-else
              :src="form.manager.avatar"
              class="rounded"
              style="width: 45px;height: 45px;cursor: pointer;"
              @click="chooseImage"
            />
          </div>
        </el-form-item>
        <el-form-item label="所属角色">
          <el-select
            v-model="form.manager.role_id"
            placeholder="请选择所属角色"
            size="mini"
          >
            <el-option
              v-for="(item, index) in roleOptions"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.manager.status" size="mini">
            <el-radio :label="1" border>启用</el-radio>
            <el-radio :label="0" border>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import common from "@/common/mixins/common.js";
export default {
  mixins: [common],
  inject: ["app", "layout"],
  data() {
    return {
      keyword: "",
      preUrl: "manager",
      managerList: [],
      groupList: [
        {
          id: 10,
          name: "超级管理员",
          status: 1
        }
      ],
      data: [
        {
          id: 1,
          label: "一级 1",
          status: 1,
          editStatus: false,
          children: [
            {
              id: 2,
              label: "二级 1-1",
              status: 1,
              editStatus: false,
              children: [
                {
                  id: 3,
                  label: "三级 1-1-1",
                  status: 1,
                  editStatus: false
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      dialogVisble: false,
      dialogType: "manager",
      form: {
        manager: {
          username: "",
          password: "",
          avatar: "",
          role_id: "",
          status: ""
        }
      },
      roleOptions: [],
      dialogId: 0
    };
  },
  methods: {
    openDialog(type, item = false) {
      // 确认类型
      this.dialogType = type;
      switch (type) {
        case "manager":
          if (!item) {
            // 添加
            (this.form.manager = {
              username: "",
              password: "",
              avatar: "",
              role_id: "",
              status: ""
            }),
              (this.dialogId = 0);
          } else {
            // 编辑
            (this.form.manager = {
              username: item.username,
              password: item.password,
              avatar: item.avatar,
              role_id: item.role_id,
              status: item.status
            }),
              (this.dialogId = item.id);
          }
          break;
        default:
          break;
      }

      // 打开弹出框
      this.dialogVisble = true;
    },
    getListUrl() {
      //处理url以及参数
      if (this.preUrl == "manager") {
        return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&keyword=${this.keyword}`;
      }
    },
    getListResult(e) {
      // 从mixins接受的数据
      this.managerList = e.list;
      this.roleOptions = e.role;
      console.log(e);
    },
    submit() {
      this.addOrEdit(this.form.manager, this.dialogId);
      this.getList();
      this.dialogVisble = false;
    },
    handleNodeClick(data) {
      console.log(data);
    },
    // 显示/隐藏
    showOrHide(data) {
      data.status = data.status ? 0 : 1;
    },
    // 编辑|提交
    edit(data) {
      data.editStatus = !data.editStatus;
    },
    // 删除
    remove(node, data) {
      this.$confirm("此操作将删除该分类, 是否继续?", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let parent = node.parent;
        let children = parent.data.children || parent.data;
        let index = children.findIndex(v => {
          return v.id === data.id;
        });
        children.splice(index, 1);
      });
    },
    // 增加子分类
    append(data) {
      let newObj = {
        id: 2,
        label: "二级 1-1",
        status: 1,
        editStatus: true,
        children: []
      };
      data.children.push(newObj);
    },
    // 拖拽
    nodeDrop(...options) {
      console.log(options[0].data);
      console.log(options[1].data);
    },
    chooseImage() {
      this.app.chooseImage(res => {
        this.form.manager.avatar = res[0].url;
      }, 1);
    }
  }
};
</script>

<style></style>
