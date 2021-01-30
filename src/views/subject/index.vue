<template>
    <div class="app-container">
        <el-card style="margin-bottom: 20px">
            <el-form :inline="true" class="x-el-form">
                <el-form-item
                    label="课程名称"
                    class="x-form-item-margin-bottom-0px"
                >
                    <el-input
                        clearable
                        size="small"
                        v-model="listQuery.name"
                        placeholder="请输入"
                    ></el-input>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card>
            <div style="margin-bottom: 10px; display: flex">
                <div style="flex: 1">
                    <div>数据列表</div>
                </div>
                <div>
                    <el-button
                        type="primary"
                        icon="el-icon-edit-outline"
                        size="mini" @click="showImportSubject"
                        >导入课程
                    </el-button>
                </div>
            </div>
            <el-tree
                ref="tree"
                :data="list"
                :props="defaultProps"
                :filter-node-method="filterNode"
                default-expand-all
            />
        </el-card>

        <el-dialog
            ref="upload"
            title="导入课程分类"
            :visible.sync="isImportSubject"
            width="30%">
            <el-upload
                action="#"
                :http-request="uploadFile"
                :limit="1"
                :show-file-list="false"
                :accept="'.xlsx'">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传xlsx文件</div>
            </el-upload>
        </el-dialog>
    </div>
</template>

<script>
import { getSubjectTreeNodes, addSubject } from "../../api/subject";
export default {
    data() {
        return {
            listLoading: false,
            listQuery: {
                name: ""
            },
            list: [],
            defaultProps: {
                children: 'children',
                label: 'title'
            },
            isImportSubject: false
        };
    },
    filters: {
        dateFilter(dateStr) {
            return dateStr.replace(/(\d{4}-\d{2}-\d{2}).*/, "$1");
        },
    },
    created() {
        this.init();
    },
    watch: {
        'listQuery.name'(val) {
            this.$refs.tree.filter(val);
        }
    },
    methods: {
        init() {
            this.getList();
        },
        async getList() {
            this.listLoading = true;
            const result = await getSubjectTreeNodes();
            if (result.code === 20000) {
                const { records } = result.data;
                this.list = records;
            }
            this.listLoading = false;
        },
        // deleteById(id) {
        //     this.$confirm("确认删除该记录, 是否继续?", "提示", {
        //         confirmButtonText: "确定",
        //         cancelButtonText: "取消",
        //         type: "warning",
        //     })
        //         .then(async () => {
        //             const result = await deleteTeacherById(id)
        //             if (result.code === 20000) {
        //                 this.$message.success('操作成功')
        //                 this.getList()
        //             }
        //         })
        //         .catch(() => {
        //             // this.$message({
        //             //     type: "info",
        //             //     message: "已取消删除",
        //             // });
        //         });
        // },
        filterNode(value, data) {
            if (!value) return true;
            return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
        },
        showImportSubject() {
            this.isImportSubject = true
        },
        async uploadFile({ file }) {
            const formData = new FormData()
            formData.append('file', file)
            const result = await addSubject(formData)
            if (result.code === 20000) {
                this.isImportSubject = false
                this.$message.success('上传成功')
                this.$refs.upload.clearFiles()
                this.getList()
            }
        }
    },
};
</script>