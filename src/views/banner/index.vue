<template>
    <div class="app-container">
        <el-card style="margin-bottom: 20px">
            <el-form :inline="true" class="x-el-form">
                <el-form-item
                    label="Banner名称"
                    class="x-form-item-margin-bottom-0px"
                >
                    <el-input
                        clearable
                        size="small"
                        v-model="listQuery.title"
                        placeholder="请输入"
                    ></el-input>
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
                        size="mini" @click="showBannerDialog()"
                        >添加Banner
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
                <el-table-column prop="title" label="名称" min-width="110" width="auto" />
                <el-table-column
                    label="链接"
                    prop="linkUrl"
                    width="200"
                    show-overflow-tooltip
                />
                <el-table-column
                    label="图片"
                    prop="imageUrl"
                    width="200"
                    show-overflow-tooltip
                />
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
                            size="small" @click="showBannerDialog(row)"
                            >编辑</el-button
                        >
                        <el-button
                            type="text"
                            size="small"
                            style="color: #f56c6c"
                            @click="deleteBannerById(row.id)"
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

        <el-dialog
            :title="bannerFormData.id ? '编辑Banner' : '添加Banner'"
            :visible.sync="isShowBannerDialog"
            width="40%"
        >
            <el-form :model="bannerFormData" label-width="80px">
                <el-form-item label="名称">
                    <el-input
                        size="small"
                        v-model="bannerFormData.title"
                    />
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number
                        size="small"
                        :min="0"
                        v-model="bannerFormData.sort"
                    />
                </el-form-item>
                <el-form-item label="链接">
                    <el-input
                        size="small"
                        v-model="bannerFormData.linkUrl"
                    />
                </el-form-item>
                <el-form-item label="图片">
                    <el-upload
                        size="small"
                        :action="'#'"
                        :http-request="uploadImage"
                        :show-file-list="false">
                        <div></div>
                        <el-image
                            v-if="bannerFormData.imageUrl"
                            style="width: 100px; height: 100px; box-shadow: 0 0 5px #ccc;"
                            :src="bannerFormData.imageUrl"
                            fit="cover"></el-image>
                        <div v-else style="width: 100px; height: 100px; box-shadow: 0 0 5px #ccc;" class="d-f f-ai-c f-jc-c">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </div>
                        <div class="el-upload__text"><em>点击上传/更换</em></div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowBannerDialog = false" size="small"
                    >取 消</el-button
                >
                <el-button
                    type="primary"
                    @click="onBannerSubmit"
                    size="small"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getBanners, addBanner, updateBanner, deleteBannerById } from "../../api/banner";
import { uploadFile } from "../../api/oss"

const defaultBannerFormData = {
    id: '',
    title: '',
    sort: 0,
    linkUrl: '',
    imageUrl: ''
}
export default {
    data() {
        return {
            listLoading: false,
            listQuery: {
                title: "",
                begin: "",
                end: "",
                current: 1,
                size: 10,
            },
            list: [],
            total: 0,
            isShowBannerDialog: false,
            bannerFormData: {}

        };
    },
    filters: {
        dateFilter(dateStr) {
            return dateStr.replace(/(\d{4}-\d{2}-\d{2}).*/, "$1");
        },
    },
    created() {
        this.init();
        console.log(this.bannerFormData);
    },
    methods: {
        init() {
            this.getList();
        },

        async getList(current = 1) {
            this.listLoading = true;
            this.listQuery.current = current;
            const result = await getBanners(this.listQuery);
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

        // 删除banner
        deleteBannerById(bannerId) {
            this.$confirm("确认删除该记录, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    const result = await deleteBannerById(bannerId)
                    if (result.code === 20000) {
                        this.$message.success('操作成功')
                        this.getList()
                    }
                })
                .catch(() => {});
        },

        // 添加banner
        async addBanner(params) {
            const result = await addBanner(params)
            if (result.code === 20000) {
                this.getList()
                this.isShowBannerDialog = false
                this.$message.success("添加Banner成功");
            }
        },

        // 更新banner
        async updateBanner(params) {
            const result = await updateBanner(params)
            if (result.code === 20000) {
                this.getList()
                this.isShowBannerDialog = false
                this.$message.success("更新Banner成功");
            }
        },
        
        // banner提交
        onBannerSubmit() {
            if (this.bannerFormData.id) {
                this.updateBanner(this.bannerFormData)
            }
            else {
                this.addBanner(this.bannerFormData)
            }
        },

        // 显示banner Dialog
        showBannerDialog(banner) {
            this.isShowBannerDialog = true
            // 编辑
            if (banner) {
                this.bannerFormData = {...banner}
            }
            // 添加
            else {
                this.bannerFormData = {...defaultBannerFormData}
            }
        },

        // 上传图片
        async uploadImage({ file }) {
            const formData = new FormData();
            formData.append('file', file)
            const result = await uploadFile(formData)
            if (result.code === 20000) {
                this.bannerFormData.imageUrl = result.data.url
                this.$message.success('上传成功')
            }
        },
    },
};
</script>