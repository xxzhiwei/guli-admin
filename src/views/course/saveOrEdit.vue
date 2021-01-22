<template>
    <div class="app-container">
        <h2 style="text-align: center">新增课程</h2>
        <el-steps :active="active" align-center style="margin-bottom: 30px">
            <el-step title="课程基本信息"></el-step>
            <el-step title="课程大纲"></el-step>
            <el-step title="课程保存"></el-step>
        </el-steps>

        <el-form ref="form" :model="formData" label-width="80px">
            <template v-if="active === 1">
                <el-form-item label="课程名称">
                    <el-input size="small" v-model="formData.title"></el-input>
                </el-form-item>
                <el-form-item label="课程讲师">
                    <el-select
                        size="small"
                        v-model="formData.teacherId"
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
                <el-form-item label="课程价格">
                    <el-input-number
                        size="small"
                        v-model="formData.price"
                        controls-position="right"
                        :min="0"
                    />
                </el-form-item>
                <el-form-item label="课程课时">
                    <el-input-number
                        size="small"
                        v-model="formData.lessonNum"
                        controls-position="right"
                        :min="0"
                    />
                </el-form-item>

                <el-form-item label="课程封面">
                    <el-upload
                        size="small"
                        :action="'#'"
                        :http-request="uploadFile"
                        :show-file-list="false"
                    >
                        <el-image
                            v-if="formData.cover"
                            style="
                                width: 100px;
                                height: 100px;
                                border-radius: 10px;
                            "
                            :src="formData.cover"
                            fit="cover"
                        ></el-image>
                        <div
                            v-else
                            style="
                                width: 100px;
                                height: 100px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                border: 1px solid #ccc;
                                border-radius: 10px;
                            "
                        >
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </div>
                        <div>
                            <el-button size="small" type="primary"
                                >点击上传/更换</el-button
                            >
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="课程描述">
                    <tinymce
                        :height="300"
                        id="tinymce"
                        v-model="formData.description"
                    ></tinymce>
                </el-form-item>
            </template>
            <template v-if="active === 2">
                <el-form-item style="margin-bottom: 0">
                    <el-button
                        type="primary"
                        size="small"
                        @click="showChapterDialog()"
                        >添加章节</el-button
                    >
                </el-form-item>
                <el-form-item>
                    <ul>
                        <li v-for="item of chapters" :key="item.id">
                            <div>
                                {{ item.title }}
                                <div class="acts">
                                    <span style="color: #409EFF;" @click="showChapterPartDialog({ chapter: item })">添加小节</span>
                                    <span style="color: #409EFF;" @click="showChapterDialog(item)">编辑</span>
                                    <span style="color: #F56C6C;" @click="deleteChapterById(item.id)"
                                        >删除</span
                                    >
                                </div>
                            </div>
                            <ul>
                                <li
                                    v-for="chapterPart of item.children"
                                    :key="chapterPart.id"
                                >
                                    <div>
                                        {{ chapterPart.title }}
                                        <div class="acts">
                                            <span style="color: #409EFF;" @click="showChapterPartDialog({ chapterPart })">编辑</span>
                                            <span style="color: #F56C6C;" @click="deleteChapterPartById(chapterPart.id)"
                                                >删除</span
                                            >
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </el-form-item>
            </template>
            <template v-if="active === 3">
                <div>3</div>
            </template>
            <el-form-item>
                <el-button size="small" type="primary" @click="prevStep"
                    >上一步</el-button
                >
                <el-button
                    size="small"
                    type="primary"
                    @click="nextStep"
                    v-if="active !== 3"
                    >下一步</el-button
                >
                <el-button size="small" type="primary" @click="updateCourse" v-else
                    >保存</el-button
                >
            </el-form-item>
        </el-form>

        <el-dialog
            :title="chapterFormData.id ? '编辑章节' : '添加章节'"
            :visible.sync="isShowChapterDialog"
            width="40%"
        >
            <el-form :model="chapterFormData" label-width="80px">
                <el-form-item label="标题">
                    <el-input size="small" v-model="chapterFormData.title" />
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number size="small" :min="0" v-model="chapterFormData.sort" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowChapterDialog = false" size="small"
                    >取 消</el-button
                >
                <el-button type="primary" @click="onChapterSubmit" size="small"
                    >确 定</el-button
                >
            </div>
        </el-dialog>

        <el-dialog
            :title="chapterPartFormData.id ? '编辑小节' : '添加小节'"
            :visible.sync="isShowChapterPartDialog"
            width="40%"
        >
            <el-form :model="chapterPartFormData" label-width="80px">
                <el-form-item label="标题">
                    <el-input size="small" v-model="chapterPartFormData.title" />
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number size="small" :min="0" v-model="chapterPartFormData.sort" />
                </el-form-item>
                <el-form-item label="是否免费">
                    <el-switch size="small"
                        v-model="chapterPartFormData.isFree"
                        :active-value="1"
                        :inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item label="上传视频">
                    <el-upload
                        class="upload-demo"
                        action="#"
                        :http-request="uploadVideo"
                        :on-exceed="handleUploadExceed"
                        :limit="2"
                        :on-remove="onRemove"
                        :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowChapterPartDialog = false" size="small"
                    >取 消</el-button
                >
                <el-button type="primary" @click="onChapterPartSubmit" size="small"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { 
    addCourse,
    updateCourseInfo, getCourseInfoById
} from '../../api/course'

import { uploadVideo } from '../../api/video'
import { 
    getChaptersByCourseId, deleteChapterById, addChapter, updateChapter,
    updateChapterPart, addChapterPart, deleteChapterPartById
} from '../../api/chapter'
import { courseMixin } from './mixin'

import { getTeachersAll } from '../../api/teacher'
import { getSubjectTreeNodes } from '../../api/subject'
import { uploadFile } from '../../api/oss'
import Tinymce from '../../components/Tinymce'

const defaultCourseFormData = {
    id: '',
    teacherId: '',
    subjectId: '',
    subjectParentId: '',
    title: '',
    price: '',
    lessonNum: '',
    cover: '',
    description: ''
}

const defaultChapterFormData = {
    id: '',
    title: '',
    sort: 0,
    courseId: ''
}

const defaultChapterPartFormData = {
    id: '',
    title: '',
    sort: 0,
    courseId: '',
    chapterId: '',
    isFree: 0,
    videoOriginalName: '',
    videoSourceId: ''
}

export default {
    mixins: [courseMixin],
    components: {
        Tinymce
    },
    data() {
        return {
            formData: {
                ...defaultCourseFormData
            },
            chapterFormData: {
                ...defaultChapterFormData
            },
            chapterPartFormData: {
                ...defaultChapterPartFormData
            },
            subjectClassification: [],
            subjectTreeNodes: [],
            teachers: [],
            cascaderProps: {
                value: "id",
                label: "title"
            },
            active: 1,
            chapters: [],
            isShowChapterDialog: false,
            isShowChapterPartDialog: false,
            fileList: [],
        }
    },
    created() {
        this.init()
    },
    methods: {
        //上传视频成功调用的方法
        onRemove(file, fileList) {
            //上传视频id赋值
            // this.video.videoSourceId = response.data.videoId
            // //上传视频名称赋值
            // this.video.videoOriginalName = file.name
            console.log(file, fileList);
        },
        init() {
            const { id } = this.$route.params
            this.getSubjectTreeNodes()
            this.getTeachers()
            if (id) {
                this.getChaptersByCourseId(id)
                this.getCourseInfoById(id)
            }
            this.formData.id = id
        },
        
        // 上传课程封面
        async uploadFile({ file }) {
            const formData = new FormData();
            // 「file」对应后端接收字段名字
            formData.append('file', file)
            const result = await uploadFile(formData)
            if (result.code === 20000) {
                this.formData.cover = result.data.url
                this.$message.success('上传成功')
            }
        },

        // 监听课程分类
        subjectChange(v) {
            if (v && v.length) {
                const [subjectParentId, subjectId] = v
                this.formData.subjectId = subjectId
                this.formData.subjectParentId = subjectParentId
            }
        },

        // 更新课程
        async updateCourse(courseInfo) {
            const result = await updateCourseInfo(courseInfo)
            if (result.code !== 20000) {
                this.$message.error('更新课程信息失败')
            }
        },

        // 更新章节
        async updateChapter(chapter) {
            const result = await updateChapter(chapter)
            if (result.code === 20000) {
                this.$message.success('更新成功')
                this.getChaptersByCourseId(this.formData.id)
            }
        },

        // 更新小节
        async updateChapterPart(chapter) {
            const result = await updateChapterPart(chapter)
            if (result.code === 20000) {
                this.$message.success('更新成功')
                this.getChaptersByCourseId(this.formData.id)
            }
        },

        // 课程提交
        onCourseSubmit() {
            if (this.formData.id) {
                this.updateCourse(this.formData)
            }
            else {
                this.addCourse(this.formData)
            }
        },

        // 章节提交（通过模态框添加或编辑的(下同)
        onChapterSubmit() {
            if (this.chapterFormData.id) {
                this.updateChapter(this.chapterFormData)
            }
            else {
                this.addChapter(this.chapterFormData)
            }
            this.$nextTick(() => {
                this.isShowChapterDialog = false
            })
        },

        // 小节提交
        onChapterPartSubmit() {
            if (this.chapterPartFormData.id) {
                this.updateChapterPart(this.chapterPartFormData)
            }
            else {
                this.addChapterPart(this.chapterPartFormData)
            }
            this.$nextTick(() => {
                this.isShowChapterPartDialog = false
            })
        },

        // 上一步
        prevStep() {
            if (this.active > 1) {
                this.active--
            }
        },

        // 下一步：无id执行添加，否则执行更新
        nextStep() {
            if (this.active < 3) {
                this.active++
                this.onCourseSubmit()
            }
        },

        // 添加课程
        async addCourse(courseInfo) {
            const result = await addCourse(courseInfo)
            if (result.code === 20000) {
                this.formData.id = result.data.id
                this.$message.success('添加课程成功')
            }
        },

        // 添加课程章节
        async addChapter() {
            const result = await addChapter(this.chapterFormData)
            if (result.code === 20000) {
                this.$message.success('添加成功')
                this.getChaptersByCourseId(this.formData.id)
                this.isShowChapterDialog = false
            }
        },

        // 添加小节
        async addChapterPart() {
            const result = await addChapterPart(this.chapterPartFormData)
            if (result.code === 20000) {
                this.$message.success('添加成功')
                this.getChaptersByCourseId(this.formData.id)
                this.isShowChapterPartDialog = false
            }
        },

        // 显示添加章节模态框
        showChapterDialog(chapter) {
            this.isShowChapterDialog = true
            if (chapter) {
                this.chapterFormData = {
                    ...chapter
                }
            }
            else {
                this.chapterFormData = {
                    ...defaultChapterFormData,
                    courseId: this.formData.id
                }
            }
        },

        // 显示添加小节模态框
        showChapterPartDialog({ chapter, chapterPart }) {
            this.isShowChapterPartDialog = true
            this.fileList = []
            if (chapter) {
                this.chapterPartFormData = {
                    ...defaultChapterPartFormData,
                    courseId: this.formData.id,
                    chapterId: chapter.id
                }
            }
            else if (chapterPart) {
                this.chapterPartFormData = {
                    ...chapterPart
                }
                if (chapterPart.videoSourceId) {
                    this.fileList.push({
                        name: chapterPart.videoOriginalName,
                        videoSourceId: chapterPart.videoSourceId
                    })
                }
            }
            console.log(this.chapterPartFormData);
        },

        // 删除章节（有小节的情况下不可删除
        deleteChapterById(chapterId) {
            if (this.chapters.find(item => item.id === chapterId).children.length) {
                return this.$message.error('该章节存在视频，不可执行删除操作')
            }
            this.$confirm('即将执行删除操作，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const result = await deleteChapterById(chapterId)
                if (result.code === 20000) {
                    this.$message.success('删除成功')
                    this.getChaptersByCourseId(this.formData.id)
                }
            }).catch(() => {});
        },

        // 删除小节(ps：小节就是视频)
        deleteChapterPartById(id) {
            this.$confirm('即将执行删除操作，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const result = await deleteChapterPartById(id)
                if (result.code === 20000) {
                    this.$message.success('删除成功')
                    this.getChaptersByCourseId(this.formData.id)
                }
            }).catch(() => {});
        },

        // 获取课程章节
        async getChaptersByCourseId(courseId) {
            const result = await getChaptersByCourseId(courseId)
            if (result.code === 20000) {
                this.chapters = result.data.records
            }
        },

        // 获取课程信息
        async getCourseInfoById(id) {
            const result = await getCourseInfoById(id)
            if (result.code === 20000) {
                this.formData = result.data.record
                this.subjectClassification = [this.formData.subjectParentId, this.formData.subjectId]
            }
        },

        // 上传章节视频
        async uploadVideo({ file }) {
            const formData = new FormData();
            // 「file」对应后端接收字段名字
            formData.append('file', file)
            const result = await uploadVideo(formData)
            if (result.code === 20000) {
                this.chapterPartFormData.videoSourceId = result.data.videoId
                this.chapterPartFormData.videoOriginalName = file.name
                this.$message.success('上传成功')
            }
        },

        handleUploadExceed() {
            this.$message.warning("每个小节只能有一个视频，请先删除上传的视频在操作")
        }
    }
}
</script>

<style lang="scss" scoped>
.acts {
    display: inline-block;
    margin-left: 10px;
    span:not(:last-child) {
        margin-right: 5px;
    }
    span {
        cursor: pointer;
    }
}
</style>