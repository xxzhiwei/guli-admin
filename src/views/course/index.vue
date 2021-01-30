<template>
    <div class="app-container course">
        <el-card style="margin-bottom: 20px">
            <el-form :inline="true" class="x-el-form">
                <el-row>
                    <el-form-item
                        label="课程名称"
                        class="x-form-item-margin-bottom-0px"
                    >
                        <el-input
                            clearable
                            size="small"
                            v-model="listQuery.title"
                            placeholder="请输入"
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="课程讲师">
                        <el-select
                            size="small"
                            v-model="listQuery.teacherId"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in teachers"
                                :key="item.value"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="课程分类">
                        <el-cascader
                            size="small"
                            v-model="subjectClassification"
                            placeholder="请选择"
                            :options="subjectTreeNodes"
                            :props="cascaderProps"
                            @change="subjectChange"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item class="x-form-item-margin-bottom-0px">
                        <el-button
                            size="small"
                            type="primary"
                            @click="getList()"
                            >查询</el-button
                        >
                    </el-form-item>

                    <el-row>
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
                                style="width: 194px"
                            >
                            </el-date-picker>
                            <span style="margin: 0 10px">-</span>
                            <el-date-picker
                                size="small"
                                v-model="listQuery.end"
                                clearable
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="截止日期"
                                style="width: 194px"
                            >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="课程价格">
                            <div style="display: flex">
                                <el-input
                                    size="small"
                                    v-model="listQuery.minPrice"
                                    placeholder="请输入"
                                />
                                <span style="margin: 0 10px">-</span>
                                <el-input
                                    size="small"
                                    v-model="listQuery.maxPrice"
                                    placeholder="请输入"
                                />
                            </div>
                        </el-form-item>
                    </el-row>
                </el-row>
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
                                    path: '/course/save',
                                });
                            }
                        "
                        >添加课程
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
                <el-table-column
                    prop="title"
                    label="名称"
                    width="110"
                    show-overflow-tooltip
                />
                <el-table-column
                    label="分类"
                    prop="subjectName"
                    width="110"
                    show-overflow-tooltip
                />
                <el-table-column
                    label="子分类"
                    prop="subjectParentName"
                    width="110"
                    show-overflow-tooltip
                />
                <el-table-column
                    label="讲师"
                    prop="teacherName"
                    width="110"
                    show-overflow-tooltip
                />
                <el-table-column
                    label="封面"
                    prop="cover"
                    width="auto"
                    show-overflow-tooltip
                />

                <el-table-column
                    label="浏览数量"
                    prop="viewCount"
                    width="110"
                    show-overflow-tooltip
                />
                <el-table-column
                    label="价格"
                    prop="price"
                    width="110"
                    show-overflow-tooltip
                />
                <el-table-column
                    label="购买人数"
                    prop="buyCount"
                    width="110"
                    show-overflow-tooltip
                />
                <el-table-column prop="gmtCreate" label="添加时间" width="110">
                    <template slot-scope="{ row }">
                        <span>{{ row.gmtCreate | dateFilter }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="110">
                    <template slot-scope="{ row }">
                        <span :class="isPublished(row.status) ? 'c-success' : ''">{{ row.status | statusFilter }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    align="center"
                    label="操作"
                    width="140"
                >
                    <template slot-scope="{ row }">
                        <el-button v-if="isPublished(row.status)" type="text" size="small" @click="putOffShelves(row)">下架</el-button>
                        <el-button v-else type="text" size="small" @click="putOnShelves(row)">上架</el-button>
                        <el-button
                            type="text"
                            size="small"
                            @click="
                                () => {
                                    $router.push({
                                        path: `/course/edit/${row.id}`,
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
import { getCourses, updateCourseInfo, deleteCourseById } from "../../api/course";
import { courseMixin } from "./mixin";

export default {
    mixins: [courseMixin],
    data() {
        return {
            listLoading: false,
            listQuery: {
                title: "",
                begin: "",
                end: "",
                current: 1,
                size: 10,
                teacherId: "",
                maxPrice: "",
                minPrice: "",
                subjectId: "",
                subjectParentId: "",
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
        statusFilter(status) {
            return {
                'Draft': '未发布',
                'Normal': '已发布'
            }[status]
        }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.getList();
            this.getTeachers();
            this.getSubjectTreeNodes();
        },

        // 监听课程分类
        subjectChange(v) {
            if (v && v.length) {
                const [subjectParentId, subjectId] = v;
                this.listQuery.subjectId = subjectId;
                this.listQuery.subjectParentId = subjectParentId;
            }
        },

        async getList(current = 1) {
            this.listLoading = true;
            this.listQuery.current = current;
            const result = await getCourses(this.listQuery);
            if (result.code === 20000) {
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
            this.$confirm("确认删除该记录，是否继续？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    const result = await deleteCourseById(id);
                    if (result.code === 20000) {
                        this.$message.success("操作成功");
                        this.getList();
                    }
                    else {
                        this.$message.error("操作失败");
                    }
                })
                .catch(() => {});
        },

        isPublished(status) {
            return status === 'Normal'
        },

        // 上架课程
        putOnShelves(row) {
            this.$confirm("确认上架该视频，是否继续？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "info",
            })
                .then(async () => {
                     const params = {
                        ...row,
                        status: 'Normal'
                    }
                    const result = await this.updateCourseInfo(params);
                    if (result.code === 20000) {
                        this.$message.success("上架成功");
                        this.getList();
                    }
                })
                .catch(() => {});
        },

        // 下架课程
        putOffShelves(row) {
            this.$confirm("确认下架该视频，是否继续？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    const params = {
                        ...row,
                        status: 'Draft'
                    }
                    const result = await this.updateCourseInfo(params);
                    if (result.code === 20000) {
                        this.$message.success("下架成功");
                        this.getList();
                    }
                })
                .catch(() => {});
        },

        // 更新课程信息
        async updateCourseInfo(params) {
            return await updateCourseInfo(params)
        }
    },
};
</script>

<style lang="scss" scoped>
</style>