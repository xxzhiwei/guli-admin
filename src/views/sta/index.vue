<template>
  <div class="app-container">
    <!--表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-select v-model="dataQuery.type" clearable placeholder="请选择">
          <el-option label="学员登录数统计" value="login_num" />
          <el-option label="学员注册数统计" value="register_num" />
          <el-option label="课程播放数统计" value="video_view_num" />
          <el-option label="每日课程数统计" value="course_num" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="dataQuery.begin"
          type="date"
          placeholder="选择开始日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dataQuery.end"
          type="date"
          placeholder="选择截止日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-button
        :disabled="btnDisabled"
        type="primary"
        icon="el-icon-search"
        @click="showChart()"
        >查询</el-button
      >
    </el-form>

    <div class="chart-container">
      <div id="chart" class="chart" style="height: 500px; width: 100%" />
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts';
import moment from 'moment'

const now = new Date();

const startDate = moment(now.getTime() - 24 * 60 * 60 * 1000 * 14).format(
    "YYYY-MM-DD"
);
const endDate = moment(now.getTime()).format(
    "YYYY-MM-DD"
);

// import staApi from "@/api/sta";
import { getDailyStatistics, createDailyStatistics } from "@/api/statistics";

export default {
  data() {
    return {
      btnDisabled: false,
      xData: [],
      yData: [],
      dataQuery: {
        type: "login_num",
        begin: startDate,
        end: endDate,
      },
    };
  },
  mounted() {
      this.init()
  },
  methods: {
      init() {
          this.showChart()
      },
    async getDailyStatistics(params) {
      return await getDailyStatistics(params);
    },
    async showChart() {
      const result = await this.getDailyStatistics(this.dataQuery);
      if (result.success) {
          this.yData = result.data.numDataList;
          this.xData = result.data.date_calculatedList;
          this.setChart();
      }
    },
    async createDailyStatistics(day) {
        const result = await createDailyStatistics({ day })
        if (result.success) {
            this.$message.success(`生成${day}日统计成功`)
        }
    },
    setChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById("chart"));

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: "数据统计",
        },
        tooltip: {
          trigger: "axis",
        },
        dataZoom: [
          {
            show: true,
            height: 30,
            xAxisIndex: [0],
            bottom: 30,
            start: 10,
            end: 80,
            handleIcon:
              "path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
            handleSize: "110%",
            handleStyle: {
              color: "#d3dee5",
            },
            textStyle: {
              color: "#fff",
            },
            borderColor: "#90979c",
          },
          {
            type: "inside",
            show: true,
            height: 15,
            start: 1,
            end: 35,
          },
        ],
        // x轴是类目轴（离散数据）,必须通过data设置类目数据
        xAxis: {
          type: "category",
          data: this.xData,
        },
        // y轴是数据轴（连续数据）
        yAxis: {
          type: "value",
        },
        // 系列列表。每个系列通过 type 决定自己的图表类型
        series: [
          {
            // 系列中的数据内容数组
            data: this.yData,
            // 折线图
            type: "line",
          },
        ],
      };

      this.chart.setOption(option);
    },
  },
};
</script>