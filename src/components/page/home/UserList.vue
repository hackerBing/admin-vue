<template>
    <section>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-user-solid"></i>用户列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="key" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button icon="add" @click="handleCreate">添加</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" v-loading="loading">
                <el-table-column prop="username" label="用户名">
                </el-table-column>
                <!--            <el-table-column prop="role_name" label="角色" >
                </el-table-column> -->
                <el-table-column prop="realname" label="真实姓名">
                </el-table-column>
                <!--               <el-table-column  label="用户头像" >
                    <template slot-scope="scope">
                        <el-image :src="scope.row.avatar" v-if="scope.row.avatar">
                        </el-image>
                    </template>
                </el-table-column> -->
                <el-table-column prop="email" label="邮箱地址">
                </el-table-column>
                <el-table-column prop="mobile" label="手机号">
                </el-table-column>
                <el-table-column prop="updated_at" label="注册日期" sortable :formatter="dateFormatter">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handlePwd(scope.$index, scope.row)">密码</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="sizes, prev, pager, next" :total="pagination.total" :current-page.sync="pagination.currentPage" :page-size="pagination.pageSize" :page-sizes="pagination.pageSizes">
                </el-pagination>
            </div>
        </div>
        <!-- 创建弹出框 -->
     <!--    <user-create-dialog :createVisible="createVisible" @closeCreateDialog="closeCreateDialog" @refreshList="getData">
        </user-create-dialog> -->
        <!-- 编辑弹出框 -->
        <!--        <user-edit-dialog
                :editVisible="editVisible"
                :form="editForm"
                @closeEditDialog="closeEditDialog"
                @refreshList="getData"
        >
        </user-edit-dialog> -->
        <!--  修改密码 -->
        <el-dialog title="修改密码" :visible.sync="upPwdVisible" width="300px" center>
            <el-form ref="upPwdForm" :model="upPwdForm" :rules="upPwdFormRules">
                <el-form-item label="新密码">
                    <el-input v-model="upPwdForm.password"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="upPwdVisible = false">取 消</el-button>
                <el-button type="primary" @click="upUserPwd">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="修改用户" :visible.sync="editVisible" :before-close="closeEditDialog" :refreshList="getData" width="40%">
            <el-form ref="form" :model="editForm" :rules="rules" label-width="80px">
                <!--             <el-form-item label="角色" prop="role_id">
                    <el-select v-model="roleSelect" placeholder="请选角色" :clearable="true" >
                        <el-option  v-for="(name, index) in roles"
                                    :key="index"
                                    :label="name "
                                    :value="index"
                        ></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="editForm.status">
                        <el-radio :label=1>正常</el-radio>
                        <el-radio :label=2>禁止</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="真实姓名" prop="realname">
                    <el-input v-model="editForm.realname"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeEditDialog">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加弹出框 -->
        <el-dialog title="添加用户" :visible.sync="createVisible" :before-close="closeCreateDialog" width="40%">
            <el-form ref="form" :model="form" :rules="rulesForm" label-width="80px">
             <!--    <el-form-item label="角色" prop="role_id">
                    <el-select v-model="form.role_id" placeholder="请选角色">
                        <el-option v-for="(name, index) in roles" :key="index" :label="name" :value="index"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="repeat_password">
                    <el-input v-model="form.repeat_password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="form.status">
                        <el-radio :label=1>正常</el-radio>
                        <el-radio :label=2>禁止</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="真实姓名" prop="realname">
                    <el-input v-model="form.realname"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="form.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeCreateDialog">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>
<script>
// import { deleteUser, getUserLists, upUserPwd } from '@/api/modules/system'
import moment from 'moment'

export default {
    name: "UserList",

    data() {
        return {
            loading: true,
            tableData: [],
            key: '',
            pagination: {
                'total': 0,
                'pageSize': 5,
                'currentPage': 1,
                'pageSizes': [5, 20, 30]
            },
            createVisible: false,
            editVisible: false,
            delVisible: false,
            upPwdVisible: false,
            editForm: {
                id: '',
                status: 1,
                username: '',
                realname: '',
                email: '',
                mobile: ''
            },
            upPwdForm: {
                id: '',
                password: ''
            },
            upPwdFormRules: {
                'password': [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            },
            idx: -1,


            form: {
                status: 1,
                username: '',
                role_id: '',
                password: '',
                repeat_password: '',
                realname: '',
                email: '',
                mobile: ''
            },



            // 编辑用户
            rules: {
                // role_id: [
                //     { required: true, message: '请选择角色', trigger: 'blur' }
                // ],
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                realname: [
                    { required: true, message: '请输入真实姓名', trigger: 'blur' }
                ],
                mobile: [{
                    pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
                    message: '手机号格式不对',
                    trigger: 'blur'
                }]
            },

            rulesForm: {
                    role_id: [
                        { required: true, message: '请选择角色', trigger: 'blur' }
                    ],
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' },
                        { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
                    ],
                    repeat_password: [
                        { required: true, message: '确认密码不能为空', trigger: 'blur' },
                        { validator: this.checkPass, trigger: 'blur' }
                    ],
                    realname: [
                        { required: true, message: '请输入真实姓名', trigger: 'blur' }
                    ],
                    mobile: [
                        {
                            pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
                            message: '手机号格式不对',
                            trigger: 'blur'
                        }
                    ]
                }
        }
    },
    created() {
        this.getData();
    },
    computed: {},
    methods: {
        // 添加用户
        handleCreate() {
            this.createVisible = true
        },
        closeCreateDialog() {
            this.createVisible = false
        },
        closeEditDialog() {
            this.editVisible = false
        },
        search() {
            this.getData()
        },
        upUserPwd() {
            //修改密码
            this.$service({
                url: 'api/editHomeUserPass',
                method: "POST",
                data: this.upPwdForm,
            }).then(res => {
                if (res.code == this.$_GLOBAL.API_CODE.SUCCESS) {

                    this.$message.success({
                        message: '修改密码成功',
                        type: 'success',
                    })
                    this.upPwdForm.id = '';
                    this.upPwdForm.password = '';

                    // this.$message.success(res.msg)
                }
                this.upPwdVisible = false

            })
            // upUserPwd(this.upPwdForm).then(res => {
            //     if(res.code == this.$_GLOBAL.API_CODE.SUCCESS){
            //         this.$message.success(res.msg)
            //     }
            //     this.upPwdVisible = false
            // })
        },
        // 分页导航
        handleCurrentChange(val) {
            this.pagination.currentPage = val;
            this.getData();
        },
        handleSizeChange(val) {
            this.pagination.pageSize = val;
            this.getData();
        },
        // 分页，不需要后台传总数
        resetTotalSize() {
            let size = this.pagination.pageSize * this.pagination.currentPage;
            let tableLen = this.tableData.length;
            if (tableLen == 0) {
                this.pagination.total = size
            } else if (tableLen > 0 && tableLen < this.pagination.pageSize) {
                this.pagination.total = size - 1;
            } else {
                this.pagination.total = size + 1;
            }
        },
        // 获取数据
        getData() {


            this.loading = true

            var param = {
                key: this.key,
                pageSize: this.pagination.pageSize,
                page: this.pagination.currentPage
            }

            this.$service({
                url: 'api/getHomeUserList',
                method: "POST",
                data: param,
            }).then(res => {
                console.log(res);
                this.loading = false

                this.tableData = res.data.data
                console.log(this.tableData);
                // this.handleCurrentChange(res.data.length);
                // console.log(res.data.length);
                console.log(res.data.total);
                this.pagination.total = res.data.total;
                // this.resetTotalSize(this.pagination.total);
            })
        },
        dateFormatter(row, column) {
            return row.updated_at;
            return moment(row.updated_at).format('YYYY-MM-DD')
        },
        handlePwd(index, row) {
            this.idx = index;
            let item = this.tableData[index];
            this.upPwdForm.id = item.id
            this.upPwdVisible = true;
        },
        handleEdit(index, row) {
            this.idx = index;
            let item = this.tableData[index];
            this.editForm = {
                id: item.id,
                status: item.status,
                username: item.username,
                // role_id: item.role_id ? item.role_id : '',
                realname: item.realname,
                email: item.email,
                mobile: item.mobile,
            };
            this.editVisible = true;
        },
        handleDelete(index, row) {
            this.idx = index;
            this.delVisible = true;
        },
        // 确定删除
        deleteRow() {
            let item = this.tableData[this.idx];


            this.$service({
                url: 'api/deleteHomeUserList',
                method: "POST",
                data: { id: item.id },
            }).then(res => {

                this.$message.success({
                    message: '删除成功',
                    type: 'success',
                })
                this.delVisible = false;
                this.tableData.splice(this.idx, 1);
                this.getData()
            })




        },


        // 编辑用户
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {

                    this.$service({
                        url: 'api/editHomeUserList',
                        method: "POST",
                        data: this.editForm,
                    }).then(res => {

                        this.$message.success({
                            message: '修改用户成功',
                            type: 'success',
                        })
                        this.closeEditDialog();

                        this.$emit('refreshList')
                        this.getData()
                    })


                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
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

.del-dialog-cnt {
    font-size: 16px;
    text-align: center
}

.table {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #ff0000;
}

.mr10 {
    margin-right: 10px;
}
</style>