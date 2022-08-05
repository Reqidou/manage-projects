<template>
  <div>
    <!-- 面包屑组件 -->
    <Breadcrumb name1="权限管理" name2="权限列表" />
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" border stripe="">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="商品等级" prop="level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/common/Breadcrumb';
import { getRights } from '@/network/rights'
export default {
  components: { Breadcrumb },
  data() {
    return {
      rightsList: []  //权限列表

    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const res = await getRights('list')
      if(res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rightsList = res.data
      console.log(this.rightsList);
    }
  }
}
</script>

<style lang="less" scoped>

</style>