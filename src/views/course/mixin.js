import { getTeachers } from '../../api/teacher'
import { getSubjectTreeNodes } from '../../api/subject'

export const courseMixin = {
    data() {
        return {
            subjectClassification: [],
            subjectTreeNodes: [],
            teachers: [],
            cascaderProps: {
                value: "id",
                label: "title"
            },
        }
    },
    methods: {

        // 去掉子节点的children
        transformTreeNodes(treeNodes) {
            function run(treeNodes) {
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

        async getSubjectTreeNodes() {
            const result = await getSubjectTreeNodes()
            if (result.code === 20000) {
                this.subjectTreeNodes = this.transformTreeNodes(result.data.records)
            }
        },

        // 获取讲师
        async getTeachers() {
            const result = await getTeachers({ all: '1' })
            if (result.code === 20000) {
                this.teachers = result.data.records
            }
        },
    }
}