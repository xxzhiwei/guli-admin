<template>
    <div class="app-container">
        <el-card style="margin-bottom: 20px">
            <el-form :inline="true" class="x-el-form">
                <el-form-item
                    label="讲师名称"
                    class="x-form-item-margin-bottom-0px"
                >
                    <el-input
                        clearable
                        size="small"
                        v-model="listQuery.name"
                        placeholder="请输入"
                    ></el-input>
                </el-form-item>

                <el-form-item
                    label="讲师头衔"
                    class="x-form-item-margin-bottom-0px"
                >
                    <el-select
                        size="small"
                        clearable
                        v-model="listQuery.level"
                        placeholder="请选择"
                    >
                        <el-option :label="'高级讲师'" :value="1"></el-option>
                        <el-option :label="'首席讲师'" :value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                    label="添加时间"
                    class="x-form-item-margin-bottom-0px"
                >
                    <el-date-picker
                        size="small"
                        v-model="listQuery.begin"
                        clearable
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="开始日期"
                    >
                    </el-date-picker>
                    <el-date-picker
                        size="small"
                        style="margin-left: 10px"
                        v-model="listQuery.end"
                        clearable
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="截止日期"
                    >
                    </el-date-picker>
                </el-form-item>

                <el-form-item class="x-form-item-margin-bottom-0px">
                    <el-button size="small" type="primary" @click="getList()"
                        >查询</el-button
                    >
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
                        size="mini"
                        @click="
                            () => {
                                $router.push({
                                    path: '/teacher/save',
                                });
                            }
                        "
                        >添加讲师
                    </el-button>
                </div>
            </div>
            <el-table
                v-loading="listLoading"
                :data="list"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row
                size="small"
            >
                <el-table-column label="序号" width="70" align="center">
                    <template slot-scope="{ $index }">
                        <!-- 用分页反推 -->
                        {{
                            (listQuery.current - 1) * listQuery.size +
                            $index +
                            1
                        }}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名" width="110" />
                <el-table-column label="头衔" width="110">
                    <template slot-scope="{ row }">
                        <span>{{ row.level | levelFilter }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="资历"
                    prop="career"
                    width="200"
                    show-overflow-tooltip
                />
                <el-table-column prop="intro" label="简介" width="auto">
                    <template slot-scope="{ row }">
                        <div
                            style="
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            "
                        >
                            <el-popover
                                placement="top-start"
                                title="讲师简介"
                                width="400"
                                :content="row.intro"
                                trigger="hover"
                            >
                                <span slot="reference">{{ row.intro }}</span>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="gmtCreate" label="添加时间" width="110">
                    <template slot-scope="{ row }">
                        <span>{{ row.gmtCreate | dateFilter }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" width="110" />
                <el-table-column fixed="right" label="操作" width="110">
                    <template slot-scope="{ row }">
                        <el-button
                            type="text"
                            size="small"
                            @click="
                                () => {
                                    $router.push({
                                        path: `/teacher/edit/${row.id}`,
                                    });
                                }
                            "
                            >编辑</el-button
                        >
                        <el-button
                            type="text"
                            size="small"
                            style="color: #f56c6c"
                            @click="deleteById(row.id)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                :page-size="listQuery.size"
                :current-page="listQuery.current"
                style="text-align: right; padding: 20px 0"
                layout="total, sizes, prev, pager, next"
                :page-sizes="[5, 10, 20, 40]"
                :total="total"
                @size-change="sizeChange"
                @current-change="getList"
            ></el-pagination>
        </el-card>
    </div>
</template>

<script>
import { getTeachers, deleteTeacherById } from "../../api/teacher";
export default {
    data() {
        return {
            listLoading: false,
            listQuery: {
                name: "",
                level: "",
                begin: "",
                end: "",
                current: 1,
                size: 10
            },
            list: [],
            total: 0,
        };
    },
    filters: {
        levelFilter(level) {
            return {
                1: "高级讲师",
                2: "首席讲师",
            }[level];
        },
        dateFilter(dateStr) {
            return dateStr.replace(/(\d{4}-\d{2}-\d{2}).*/, "$1");
        },
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.getList();
        },
        async getList(current = 1) {
            this.listLoading = true;
            this.listQuery.current = current;
            const result = await getTeachers(this.listQuery);
            if (result.success) {
                const { records, total } = result.data;
                this.list = records;
                this.total = total;
            }
            this.listLoading = false;
        },
        sizeChange(size) {
            this.listQuery.size = size;
            this.getList();
        },
        deleteById(id) {
            this.$confirm("确认删除该记录, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    const result = await deleteTeacherById(id)
                    if (result.code === 20000) {
                        this.$message.success('操作成功')
                        this.getList()
                    }
                })
                .catch(() => {
                    // this.$message({
                    //     type: "info",
                    //     message: "已取消删除",
                    // });
                });
        },
    },
};
</script>