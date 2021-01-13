<template>
    <div class="app-container">
        <el-card>
            <div slot="header">
                <span>讲师表单</span>
                <el-button style="float: right; padding: 3px 0" type="text"
                    @click="() => {
                        $router.push({
                            path: '/personnel/teacher/index'
                        })
                    }"
                >返回</el-button>
            </div>
            <el-form style="width: 50%;" ref="form" :model="formData" label-width="80px">
                <el-form-item label="讲师名称">
                    <el-input size="small" v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="讲师头衔">
                    <el-select size="small" v-model="formData.level" placeholder="请选择">
                        <el-option label="高级讲师" :value="1"></el-option>
                        <el-option label="首席讲师" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="讲师资历">
                    <el-input size="small" v-model="formData.career"></el-input>
                </el-form-item>
                <el-form-item label="讲师排序">
                    <el-input-number size="small" v-model="formData.sort" controls-position="right" :min="0"/>
                </el-form-item>
                <el-form-item label="讲师简介">
                    <el-input size="small" type="textarea" rows="2" v-model="formData.intro"></el-input>
                </el-form-item>
                <el-form-item label="讲师头像">
                    <el-upload
                        size="small"
                        :action="'#'"
                        :http-request="uploadAvatar"
                        :show-file-list="false">
                        <el-image
                            v-if="formData.avatar"
                            style="width: 100px; height: 100px; border-radius: 50%; box-shadow: 0 0 5px #ccc;"
                            :src="formData.avatar"
                            fit="cover"></el-image>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div class="el-upload__text"><em>点击上传/更换</em></div>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="onSubmit">保存</el-button>
                    <!-- <el-button size="small">取消</el-button> -->
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { getTeacherById, saveTeacher, updateTeacher } from '../../api/teacher'
import { uploadFile } from '../../api/oss'

const defaultFormData = {
    name: '',
    level: 1,
    career: '',
    sort: 0,
    intro: '',
    avatar: '',
    id: ''
}
export default {
    data() {
        return {
            formData: {}
        };
    },
    watch: {
        $route() {
            this.init()
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            const { id } = this.$route.params
            if (id) {
                this.getById(id)
            }
            else {
                this.formData = { ...defaultFormData }
            }
        },
        onSubmit() {
            if (this.formData.id) {
                this.update()
            }
            else {
                this.save()
            }
        },
        async getById(id) {
            const result = await getTeacherById(id)
            if(result.code === 20000) {
                this.formData = result.data.item
            }
        },
        async save() {
            const result = await saveTeacher(this.formData)
            if(result.code === 20000) {
                this.$message.success('保存成功')
                this.$router.push({ path: '/personnel/teacher/index' })
            }
        },
        async update() {
            const result = await updateTeacher(this.formData)
            if(result.code === 20000) {
                this.$message.success('更新成功')
                this.$router.push({ path: '/personnel/teacher/index' })
            }
        },
        async uploadAvatar({ file }) {
            const formData = new FormData();
            formData.append('file', file)
            const result = await uploadFile(formData)
            if (result.code === 20000) {
                this.formData.avatar = result.data.url
                this.$message.success('上传成功')
            }
        },
    }
};
</script>