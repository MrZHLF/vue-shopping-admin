<template>
  <div
    class="bg-white px-3"
    style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="管理员列表" name="second">
        <div class="d-flex align-items-center">
          <el-button type="primary" size="mini">添加管理员</el-button>
          <div class="ml-auto d-flex">
            <el-input
              size="mini"
              placeholder="请输入用户名"
              v-model="keyword"
              style="width:200px;"
            ></el-input>
            <el-button type="info" size="mini" class="ml-2">搜索</el-button>
          </div>
        </div>
        <el-table border class="mt-3" :data="managerList" style="width: 100%">
          <el-table-column align="center" label="用户头像">
            <template slot-scope="scope">
              <el-avatar size="large" :src="scope.row.avatar"></el-avatar>
            </template>
          </el-table-column>
          <el-table-column align="center" label="用户名" prop="username">
          </el-table-column>
          <el-table-column
            align="center"
            width="250"
            label="手机号"
            prop="phone"
          >
          </el-table-column>
          <el-table-column prop="email" align="center" label="邮箱">
          </el-table-column>
          <el-table-column align="center" label="所属管理员">
            <template slot-scope="scope">
              {{ scope.row.group.name }}
            </template>
          </el-table-column>
          <el-table-column prop="status" align="center" label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="text" size="mini">修改</el-button>
              <el-button type="text" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="角色列表" name="third">
        <div class="d-flex align-items-center">
          <el-button type="primary" size="mini">添加角色</el-button>
        </div>
        <el-table border class="mt-3" :data="groupList" style="width: 100%">
          <el-table-column align="center" label="角色名称" prop="name">
          </el-table-column>
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
      <el-tab-pane label="权限列表" name="auth">
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
              >
                {{ data.status ? "显示" : "隐藏" }}
              </el-button>
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
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: "",
      activeName: "second",
      managerList: [
        {
          id: 10,
          username: "用户名",
          avatar:
            "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4100987808,2324741924&fm=27&gp=0.jpg",
          phone: "15648897641",
          email: "15648897641@163.com",
          group_id: 1,
          group: {
            id: 1,
            name: "管理员"
          },
          status: 1
        }
      ],
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
      }
    };
  },
  methods: {
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
    }
  }
};
</script>

<style></style>
