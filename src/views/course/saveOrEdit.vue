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
                        @click="showChapterDialog('add')"
                        >添加章节</el-button
                    >
                </el-form-item>
                <el-form-item>
                    <ul>
                        <li v-for="item of chapters" :key="item.id">
                            <div>
                                {{ item.title }}
                                <div class="acts">
                                    <span style="color: #409EFF;" @click="showVideoDialog('add', { chapter: item })">添加小节</span>
                                    <span style="color: #409EFF;" @click="showChapterDialog('edit', item)">编辑</span>
                                    <span style="color: #F56C6C;" @click="deleteChapterById(item.id)"
                                        >删除</span
                                    >
                                </div>
                            </div>
                            <ul>
                                <li
                                    v-for="video of item.children"
                                    :key="video.id"
                                >
                                    <div>
                                        {{ video.title }}
                                        <div class="acts">
                                            <span style="color: #409EFF;" @click="showVideoDialog('edit', { video })">编辑</span>
                                            <span style="color: #F56C6C;" @click="deleteVideoById(video.id)"
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
            title="添加章节"
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
            title="添加小节"
            :visible.sync="isShowVideoDialog"
            width="40%"
        >
            <el-form :model="videoFormData" label-width="80px">
                <el-form-item label="标题">
                    <el-input size="small" v-model="videoFormData.title" />
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number size="small" :min="0" v-model="videoFormData.sort" />
                </el-form-item>
                <el-form-item size="small" label="是否免费">
                    <el-switch
                        v-model="videoFormData.isFree"
                        :active-value="1"
                        :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowVideoDialog = false" size="small"
                    >取 消</el-button
                >
                <el-button type="primary" @click="onVideoSubmit" size="small"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { 
    addCourse, addChapter, addVideo, getChaptersByCourseId, deleteChapterById, deleteVideoById,
    updateCourseInfo, getCourseInfoById, updateChapter, updateVideo
} from '../../api/course'
import { getTeachersAll } from '../../api/teacher'
import { getSubjectTreeNodes } from '../../api/subject'
import { uploadFile } from '../../api/oss'
import Tinymce from '../../components/Tinymce'

const defaultCourseFormData = {
    id: '1349180918987300865',
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
    title: '',
    sort: 0,
    courseId: ''
}

const defaultVideoFormData = {
    title: '',
    sort: 0,
    courseId: '',
    chapterId: '',
    isFree: 0
}

export default {
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
            videoFormData: {
                ...defaultVideoFormData
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
            isShowVideoDialog: false
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            this.getSubjectTreeNodes()
            this.getTeachers()
            if (this.formData.id) {
                this.getChaptersByCourseId(this.formData.id)
                this.getCourseInfoById(this.formData.id)
            }
        },
        
        // 上传封面
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

        // 去掉子节点的children
        transformTreeNodes(treeNodes) {
            function run(treeNodes) {
                const result = []
                for (const treeNode of treeNodes) {
                    if (treeNode.children && treeNode.children.length) {
                        run(treeNode.children)
                    }
                    else if (treeNode.children) {
                        delete treeNode.children
                    }
                }
            }
            run(treeNodes)
            return treeNodes
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
        async updateVideo(chapter) {
            const result = await updateVideo(chapter)
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
        onVideoSubmit() {
            if (this.videoFormData.id) {
                this.updateVideo(this.videoFormData)
            }
            else {
                this.addVideo(this.videoFormData)
            }
            this.$nextTick(() => {
                this.isShowChapterDialog = false
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
        async addVideo() {
            const result = await addVideo(this.videoFormData)
            if (result.code === 20000) {
                this.$message.success('添加成功')
                this.getChaptersByCourseId(this.formData.id)
                this.isShowVideoDialog = false
            }
        },

        // 显示添加章节模态框
        showChapterDialog(action='add', chapter) {
            this.isShowChapterDialog = true
            if (action === 'add') {
                this.chapterFormData = {
                    ...defaultChapterFormData,
                    courseId: this.formData.id
                }
            }
            else if (action === 'edit') {
                this.chapterFormData = {
                    ...chapter
                }
            }
        },

        // 显示添加小节模态框
        showVideoDialog(action='add', { chapter, video }) {
            this.isShowVideoDialog = true
            if (action === 'add') {
                this.videoFormData = {
                    ...defaultVideoFormData,
                    courseId: this.formData.id,
                    chapterId: chapter.id
                }
            }
            else if (action === 'edit') {
                this.videoFormData = {
                    ...video
                }
            }
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
        deleteVideoById(videoId) {
            this.$confirm('即将执行删除操作，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const result = await deleteVideoById(videoId)
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
                this.chapters = result.data.items
            }
        },

        async getCourseInfoById(id) {
            const result = await getCourseInfoById(id)
            if (result.code === 20000) {
                this.formData = result.data.item
                this.subjectClassification = [this.formData.subjectParentId, this.formData.subjectId]
            }
        },

        async getSubjectTreeNodes() {
             const result = await getSubjectTreeNodes()
            if (result.code === 20000) {
                this.subjectTreeNodes = this.transformTreeNodes(result.data.items)
            }
        },

        // 获取讲师
        async getTeachers() {
            const result = await getTeachersAll()
            if (result.code === 20000) {
                this.teachers = result.data.items
            }
        },
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