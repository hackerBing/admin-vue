<template>
    <section>

        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-user"></i> 在线用户</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="key" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <!-- <el-button icon="add" @click="handleCreate">添加</el-button> -->
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" v-loading="loading">
                <el-table-column prop="username" label="用户名" >
                </el-table-column>
                <el-table-column prop="realname" label="角色" >
                </el-table-column>
                <el-table-column prop="realname" label="真实姓名" >
                </el-table-column>
                <el-table-column  label="用户头像" >
                    <template slot-scope="scope">
                        <el-image :src="scope.row.avatar" v-if="scope.row.avatar">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱地址" >
                </el-table-column>
                <el-table-column prop="mobile" label="手机号" >
                </el-table-column>
                <el-table-column prop="create_time" label="日期" sortable  :formatter="dateFormatter">
                </el-table-column>
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">退出登录</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background
                   @current-change="handleCurrentChange"
                   @size-change="handleSizeChange"
                   layout="sizes, prev, pager, next"
                   :total="pagination.total"
                   :current-page.sync="pagination.currentPage"
                   :page-size="pagination.pageSize"
                   :page-sizes="pagination.pageSizes"
                >
                </el-pagination>
            </div>
        </div>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
    import { getHomeOnlineUserList } from '@/api/home/user'
    import moment from 'moment'
    export default {
        name: "OnlineUser",
 
        data() {
            return {
                loading: true,
                tableData: [],
                key: '',
                pagination:{
                    'total': 0,
                    'pageSize': 10,
                    'currentPage': 1,
                    'pageSizes': [10, 20, 30]
                },
                delVisible: false,

                idx: -1
            }
        },
        created() {
            // this.getData();
            this.getDataList();
        },
        computed: {
        },
        methods: {

            search() {
                this.getData()
            },

            // 分页导航
            handleCurrentChange(val) {
                this.pagination.currentPage= val;
                this.getDataList();
            },
            handleSizeChange(val){
                this.pagination.pageSize= val;
                this.getDataList();
            },
            // 分页，不需要后台传总数
            resetTotalSize(countList){
                let size = this.pagination.pageSize * this.pagination.currentPage;
                let tableLen = this.tableData.length;
                if(tableLen == 0){
                    this.pagination.total = size
                }else if(tableLen > 0 && tableLen < this.pagination.pageSize){
                    this.pagination.total = size - 1;
                }else{
                    this.pagination.total = size + 1;
                }
            },


            //获取在线用户列表
            getDataList()
            {   
                this.loading = true

                var param  = {
                    key: this.key,
                    pageSize: this.pagination.pageSize,
                    currentPage: this.pagination.currentPage 
                }

                this.$service({
                    url: 'api/getHomeOnlineUserList',
                    method: "POST",
                    data: param,
                }).then(res =>{
                    console.log(res);
                    this.loading = false

                    this.tableData = res.data.data
                    console.log(this.tableData);
                    // this.handleCurrentChange(res.data.length);
                    // console.log(res.data.length);
                    this.resetTotalSize(res.data.countList);
                })

            },
            dateFormatter(row, column) {
                return moment(row.updated_at).format('YYYY-MM-DD')
            },

            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            // 确定删除
            deleteRow(){

                let item = this.tableData[this.idx];
                var param  = {
                    id: item.id
                }

                this.$service({
                    url: 'api/logoutHomeOnlineUser',
                    method: "POST",
                    data: param,
                }).then(res =>{
                    console.log(res);

                    this.delVisible = false;
                    this.tableData.splice(this.idx, 1);

                    this.getDataList();
                    this.resetTotalSize(res.data.countList);
                    this.$message({
                      showClose: true,
                      message: res.message,
                      type: 'success'
                    });
                })

                // console.log(item);
                // return ;
         
            }
        }
    }
</script>

<style lang="scss" scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
</style>
