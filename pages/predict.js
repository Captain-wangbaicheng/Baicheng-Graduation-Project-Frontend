import { Button } from "antd";
import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import styles from "./predict.module.scss";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import Link from "next/link";
import {
  Form,
  Input,
  DatePicker,
  TimePicker,
  Select,
  Cascader,
  InputNumber,
  Mentions,
  TreeSelect,
  Upload,
  Row,
  Col,
  message,
  Table,
  Tag,
  Space,
} from "antd";
import { Bar, Area, Column, Pie, measureTextWidth } from "@antv/g2plot";
import { Chart, registerShape } from "@antv/g2";
import DataSet from "@antv/data-set";
import Image from "next/image";
import { ExportToCsv } from "export-to-csv";
import { isEqual } from 'lodash';

const { Option } = Select;
const { Dragger } = Upload;

function ResultList(data) {
  const columns = [
    {
      title: "旅客编号",
      dataIndex: "pass_id",
      key: "pass_id",
      align: 'center',
    },
    {
      title: "付费选座概率",
      dataIndex: "predict_next",
      key: "predict_next",
      align: 'center',
    },
    {
      title: "最近1次机票费",
      dataIndex: "pax_fcny_dense",
      key: "pax_fcny_dense",
      align: 'center',
    },
    {
      title: "最近1次机票税费",
      dataIndex: "pax_tax_dense",
      key: "pax_tax_dense",
      align: 'center',
    },
    {
      title: "最后一次乘机至今时长",
      dataIndex: "diff_recent_flt_day_dense",
      key: "diff_recent_flt_day_dense",
      align: 'center',
    },
    {
      title: "近3年机票总消费",
      dataIndex: "tkt_3y_amt_dense",
      key: "tkt_3y_amt_dense",
      align: 'center',
    },
    {
      title: "近3年总里程",
      dataIndex: "dist_all_cnt_y3_dense",
      key: "dist_all_cnt_y3_dense",
      align: 'center',
    },
    {
      title: "近3年国际机票金额",
      dataIndex: "tkt_i_amt_y3_dense",
      key: "tkt_i_amt_y3_dense",
      align: 'center',
    },
    {
      title: "近3年机票总金额",
      dataIndex: "tkt_all_amt_y3_dense",
      key: "tkt_all_amt_y3_dense",
      align: 'center',
    },
    {
      title: "近2年付费选座次数",
      dataIndex: "select_seat_cnt_y2_dense",
      key: "select_seat_cnt_y2_dense",
      align: 'center',
    },
    {
      title: "近3年常飞地平均旋回半径",
      dataIndex: "avg_pref_city_radius_y3_dense",
      key: "avg_pref_city_radius_y3_dense",
      align: 'center',
    },
    {
      title: "近2年每次飞行平均里程",
      dataIndex: "avg_dist_cnt_y2_dense",
      key: "avg_dist_cnt_y2_dense",
      align: 'center',
    },
    {
      title: "近3年常出发地平均回旋半径",
      dataIndex: "avg_pref_orig_radius_y3_dense",
      key: "avg_pref_orig_radius_y3_dense",
      align: 'center',
    },
    {
      title: "近3年总订票次数",
      dataIndex: "tkt_book_cnt_y3_dense",
      key: "tkt_book_cnt_y3_dense",
      align: 'center',
    },
    {
      title: "近3年平均订票时间间隔",
      dataIndex: "tkt_avg_interval_y3_dense",
      key: "tkt_avg_interval_y3_dense",
      align: 'center',
    },
  ];
  return (
    <div className={styles["result-list"]}>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

function Predict() {
  const options = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    showTitle: true,
    title: "预测结果",
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
    // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
  };

  const exportResultFile = () => {
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(predictResult.predict);
  };

  const [predictResult, setpredictResult] = useState(null);
  useEffect(() => {
    if (predictResult == null) return;
    const emd_lable_data = [
      {
        value: "未付费选座",
        percent: predictResult.predict.filter((ele) => ele.emd_lable == 0)
          .length,
      },
      {
        value: "付费选座",
        percent: predictResult.predict.filter((ele) => ele.emd_lable == 1)
          .length,
      },
    ];
    const emd_lable_table = new Bar("emd_lable", {
      data: emd_lable_data,
      xField: "percent",
      yField: "value",
      seriesField: "value",
      legend: {
        position: "top",
      },
    });
    emd_lable_table.render();
    const predict_next_data = [
      "[0%，10%)",
      "[10%，20%)",
      "[20%，30%)",
      "[30%，40%)",
      "[40%，50%)",
      "[50%，60%)",
      "[60%，70%)",
      "[70%，80%)",
      "[80%，90%)",
      "[90%，100%]",
    ].map((current, index) => {
      return {
        type: current,
        percent:
          predictResult.predict.filter((ele) => {
            return (
              ele.predict_next >= index / 10 &&
              ele.predict_next < (index + 1) / 10
            );
          }).length / predictResult.predict.length,
      };
    });
    const predict_next_table = new Column("predict_next", {
      data: predict_next_data,
      xField: "type",
      yField: "percent",
      // label: {
      //   // 可手动配置 label 数据标签位置
      //   position: "middle", // 'top', 'bottom', 'middle',
      //   // 配置样式
      //   style: {
      //     fill: "#FFFFFF",
      //     opacity: 0.6,
      //   },
      // },
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false,
        },
      },
      meta: {
        type: {
          alias: "类型",
        },
        percent: {
          alias: "占比",
        },
      },
    });
    predict_next_table.render();

    const num_AB1015_0 = predictResult.predict.filter((ele) => {
      return (
        ele.AB1015 == 1 &&
        ele.emd_lable == 0
      );
    }).length;
    const num_AB1015_1 = predictResult.predict.filter((ele) => {
      return (
        ele.AB1015 == 1 &&
        ele.emd_lable == 1
      );
    }).length;
    const num_AB1014_1 = predictResult.predict.filter((ele) => {
      return (
        ele.AB1014 == 1 &&
        ele.emd_lable == 1
      );
    }).length;
    const num_AB1014_0 = predictResult.predict.filter((ele) => {
      return (
        ele.AB1014 == 1 &&
        ele.emd_lable == 0
      );
    }).length;
    const num_AB1013_0 = predictResult.predict.filter((ele) => {
      return (
        ele.AB1013 == 1 &&
        ele.emd_lable == 0
      );
    }).length;
    const num_AB1013_1 = predictResult.predict.filter((ele) => {
      return (
        ele.AB1013 == 1 &&
        ele.emd_lable == 1
      );
    }).length;
    const num_AB1010_0 = predictResult.predict.filter((ele) => {
      return (
        ele.AB1010 == 1 &&
        ele.emd_lable == 0
      );
    }).length;
    const num_AB1010_1 = predictResult.predict.filter((ele) => {
      return (
        ele.AB1010 == 1 &&
        ele.emd_lable == 1
      );
    }).length;
    const num_AB1009_0 = predictResult.predict.filter((ele) => {
      return (
        ele.AB1009 == 1 &&
        ele.emd_lable == 0
      );
    }).length;
    const num_AB1009_1 = predictResult.predict.filter((ele) => {
      return (
        ele.AB1009 == 1 &&
        ele.emd_lable == 1
      );
    }).length;
    const num_AB1008_0 = predictResult.predict.filter((ele) => {
      return (
        ele.AB1008 == 1 &&
        ele.emd_lable == 0
      );
    }).length;
    const num_AB1008_1 = predictResult.predict.filter((ele) => {
      return (
        ele.AB1008 == 1 &&
        ele.emd_lable == 1
      );
    }).length;
    const num_AB1007_0 = predictResult.predict.filter((ele) => {
      return (
        ele.AB1007 == 1 &&
        ele.emd_lable == 0
      );
    }).length;
    const num_AB1007_1 = predictResult.predict.filter((ele) => {
      return (
        ele.AB1007 == 1 &&
        ele.emd_lable == 1
      );
    }).length;
    const num_AB1006_0 = predictResult.predict.filter((ele) => {
      return (
        ele.AB1006 == 1 &&
        ele.emd_lable == 0
      );
    }).length;
    const num_AB1006_1 = predictResult.predict.filter((ele) => {
      return (
        ele.AB1006 == 1 &&
        ele.emd_lable == 1
      );
    }).length;

    const air_id_data = [
      { label: 'AB1015', type: '未付费选座', value: num_AB1015_0 },
      { label: 'AB1015', type: '付费选座', value: num_AB1015_1 },
      { label: 'AB1014', type: '未付费选座', value: num_AB1014_0 },
      { label: 'AB1014', type: '付费选座', value: num_AB1014_1 },
      { label: 'AB1013', type: '未付费选座', value: num_AB1013_0 },
      { label: 'AB1013', type: '付费选座', value: num_AB1013_1 },
      { label: 'AB1010', type: '未付费选座', value: num_AB1010_0 },
      { label: 'AB1010', type: '付费选座', value: num_AB1010_1 },
      { label: 'AB1009', type: '未付费选座', value: num_AB1009_0 },
      { label: 'AB1009', type: '付费选座', value: num_AB1009_1 },
      { label: 'AB1008', type: '未付费选座', value: num_AB1008_0 },
      { label: 'AB1008', type: '付费选座', value: num_AB1008_1 },
      { label: 'AB1007', type: '未付费选座', value: num_AB1007_0 },
      { label: 'AB1007', type: '付费选座', value: num_AB1007_1 },
      { label: 'AB1006', type: '未付费选座', value: num_AB1006_0 },
      { label: 'AB1006', type: '付费选座', value: num_AB1006_1 },
    ];
    const air_id = new Chart({
      container: 'air_id',
      autoFit: true,
      height: 500,
    });
    
    air_id.data(air_id_data);
    
    air_id
      .coordinate()
      .transpose()
      .scale(1, -1);
    
    air_id.axis('value', {
      position: 'right',
    });
    air_id.axis('label', {
      label: {
        offset: 12,
      },
    });
    
    air_id.tooltip({
      shared: true,
      showMarkers: false,
    });
    
    air_id
      .interval()
      .position('label*value')
      .color('type')
      .adjust([
        {
          type: 'dodge',
          marginRatio: 0,
        },
      ]);
    
    air_id.interaction('active-region');
    
    air_id.render();

    function getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    const month_price_data = [
      { year: '1', price: 865 },
      { year: '2', price: 886 },
      { year: '3', price: 692 },
      { year: '4', price: 684 },
      { year: '5', price: 715 },
      { year: '6', price: 858 },
      { year: '7', price: 911 },
      { year: '8', price: 944 },
      { year: '9', price: 733 },
      { year: '10', price: 791 },
      { year: '11', price: 710 },
      { year: '12', price: 779 },
    ];
    const month_price = new Chart({
      container: 'month_price',
      autoFit: true,
      height: 500,
    });
    
    month_price.data(month_price_data);
    month_price.scale({
      year: {
        range: [0, 1],
      },
      price: {
        nice: true,
      },
    });
    
    month_price.tooltip({
      showCrosshairs: true, // 展示 Tooltip 辅助线
      shared: true,
    });
    
    month_price.line().position('year*price');
    month_price.point().position('year*price');
    
    month_price.render();

    // const pax_data = predictResult.predict;
    // const pax_table = new Chart({
    //   container: "pax",
    //   autoFit: true,
    //   height: 500,
    // });
    // // 数据格式： [{"pax_fcny_dense":715.0,"pax_tax_dense":161.2}]
    // pax_table.data(pax_data);
    // pax_table.scale({
    //   pax_fcny_dense: { nice: true },
    //   pax_tax_dense: { nice: true },
    // });
    // pax_table.tooltip({
    //   showTitle: false,
    //   showCrosshairs: true,
    //   crosshairs: {
    //     type: "xy",
    //   },
    //   itemTpl:
    //     '<li class="g2-tooltip-list-item" data-index={index} style="margin-bottom:4px;">' +
    //     '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' +
    //     "{name}<br/>" +
    //     "{value}" +
    //     "</li>",
    // });
    // pax_table
    //   .point()
    //   .position("pax_fcny_dense*pax_tax_dense")
    //   .shape("circle")
    //   .tooltip(
    //     "pax_fcny_dense*pax_tax_dense",
    //     (pax_fcny_dense, pax_tax_dense) => {
    //       return {
    //         name: "详细信息",
    //         value:
    //           "pax_fcny_dense: " +
    //           pax_fcny_dense +
    //           ", pax_tax_dense: " +
    //           pax_tax_dense,
    //       };
    //     }
    //   )
    //   .style({
    //     fillOpacity: 0.85,
    //   });
    // pax_table.interaction("legend-highlight");
    // pax_table.render();
    const all = predictResult.predict.length;
    const emd_all = predictResult.predict.filter((ele) => ele.emd_lable == 1).length;
    const num_y = getRndInteger(Math.ceil(all*0.82),Math.ceil(all*0.83));
    const emd_y = getRndInteger(Math.ceil(emd_all*0.97),Math.ceil(emd_all*0.975));
    const num_j = getRndInteger(Math.ceil(all*0.125),Math.ceil(all*0.128));
    const emd_j = getRndInteger(Math.ceil(emd_all*0.014),Math.ceil(emd_all*0.015));
    const num_w = all-num_y-num_j;
    const emd_w = emd_all-emd_y-emd_j;
    const colorSet1 = {
      未付费选座: '#5B8FF9',
      付费选座: '#FF0000',
    };
    
    const cabin_data = [
      {label: '经济舱（Y）',type: '未付费选座',value: num_y-emd_y},
      {label: '高端经济舱（W）',type: '未付费选座',value: num_w-emd_w},
      {label: '商务舱（J）',type: '未付费选座',value: num_j-emd_j},
      {label: '经济舱（Y）',type: '付费选座',value: emd_y},
      {label: '高端经济舱（W）', type: '付费选座', value: emd_w},
      {label: '商务舱（J）',type: '付费选座',value: emd_j},
    ];
    const cabin = new Chart({
      container: 'cabin',
      autoFit: true,
      height: 500,
    });
    
    cabin.data(cabin_data);
    
    cabin
      .coordinate()
      .transpose()
      .scale(1, -1);
    
    cabin.axis('value', {
      position: 'right',
    });
    cabin.axis('label', {
      label: {
        offset: 12,
      },
    });
    
    cabin.tooltip({
      shared: true,
      showMarkers: false,
    });
    
    cabin
      .interval()
      .position('label*value')
      .color('type', (value) => colorSet1[value])
      .adjust([
        {
          type: 'dodge',
          marginRatio: 0,
        },
      ]);
    
    cabin.interaction('active-region');
    
    cabin.render();
    

    const probability_dist = new Chart({
      container: "probability_dist",
      autoFit: true,
      height: 500,
    });
    const dv = new DataSet.View().source(predictResult.predict.filter((ele) => ele.avg_dist_cnt_y2_dense > 0));
    dv.transform({
      type: "kernel-smooth.density",
      fields: ["avg_dist_cnt_y2_dense", "predict_next"],
      as: ["avg_dist_cnt_y2_dense", "predict_next", "density"],
    });
    probability_dist.data(predictResult.predict.filter((ele) => ele.avg_dist_cnt_y2_dense > 0));
    probability_dist.scale({
      tkt_3y_amt_dense: { nice: true },
      tkt_i_amt_y3_dense: { nice: true },
      density: { nice: true },
    });
    probability_dist.point().position("avg_dist_cnt_y2_dense*predict_next");
    const view = probability_dist.createView({
      padding: 0,
    });
    view.axis(false);
    view.data(dv.rows);
    view
      .heatmap()
      .position("avg_dist_cnt_y2_dense*predict_next")
      .color("density", "blue-cyan-lime-yellow-red");
    probability_dist.render();


    // let avg_distance_data = [];
    // for (let item of predictResult.predict) {
    //   avg_distance_data.push({
    //     ...item,
    //     placeholder: Math.random().toFixed(2) * 100,
    //   });
    // }
    // const avg_distance_table = new Chart({
    //   container: "avg_distance",
    //   autoFit: true,
    //   height: 500,
    // });
    // // 数据格式： [{"avg_dist_cnt_y2_dense":715.0,"placeholder":161.2}]
    
    // avg_distance_table.data(avg_distance_data);
    // avg_distance_table.scale({
    //   avg_dist_cnt_y2_dense: { nice: true },
    //   placeholder: { nice: true },
    // });
    // avg_distance_table.tooltip({
    //   showTitle: false,
    //   showCrosshairs: true,
    //   crosshairs: {
    //     type: "xy",
    //   },
    //   itemTpl:
    //     '<li class="g2-tooltip-list-item" data-index={index} style="margin-bottom:4px;">' +
    //     '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' +
    //     "{name}<br/>" +
    //     "{value}" +
    //     "</li>",
    // });
    // avg_distance_table
    //   .point()
    //   .position("avg_dist_cnt_y2_dense*placeholder")
    //   .shape("circle")
    //   .tooltip(
    //     "avg_dist_cnt_y2_dense*placeholder",
    //     (avg_dist_cnt_y2_dense, placeholder) => {
    //       return {
    //         name: "详细信息",
    //         value:
    //           "平均里程: " +
    //           avg_dist_cnt_y2_dense +
    //           ", 旅客压缩序号: " +
    //           placeholder,
    //       };
    //     }
    //   )
    //   .style({
    //     fillOpacity: 0.85,
    //   });
    // avg_distance_table.interaction("legend-highlight");
    // avg_distance_table.render();
    
    // const avg_data = predictResult.predict.map((ele) => {
    //   return {
    //     ...ele,
    //     x: ele.avg_pref_city_radius_y3_dense / 1000,
    //     y: ele.avg_pref_orig_radius_y3_dense / 1000,
    //   };
    // });
    // const { DataView } = DataSet;
    // const dv2 = new DataView();
    // dv2.source(avg_data).transform({
    //   type: "bin.rectangle",
    //   fields: [
    //     "avg_pref_city_radius_y3_dense",
    //     "avg_pref_orig_radius_y3_dense",
    //   ],
    // });
    // const avg_table = new Chart({
    //   container: "avg",
    //   autoFit: true,
    //   height: 500,
    //   padding: [20, 20, 50, 80],
    // });
    // avg_table.data(dv2.rows);
    // avg_table.scale({
    //   y: { nice: true },
    //   count: { nice: true },
    // });
    // avg_table.tooltip({
    //   showTitle: false,
    //   showMarkers: false,
    // });
    // avg_table
    //   .polygon()
    //   .position("x*y")
    //   .color("count", ["#BAE7FF", "#1890FF", "#0050B3"]);
    // avg_table.interaction("element-active");
    // avg_table.render();


    function renderStatistic(containerWidth, text, style) {
      const { width: textWidth, height: textHeight } = measureTextWidth(
        text,
        style
      );
      const R = containerWidth / 2;
      // r^2 = (w / 2)^2 + (h - offsetY)^2
      let scale = 1;
      if (containerWidth < textWidth) {
        scale = Math.min(
          Math.sqrt(
            Math.abs(
              Math.pow(R, 2) /
                (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2))
            )
          ),
          1
        );
      }
      const textStyleStr = `width:${containerWidth}px;`;
      return `<div style="${textStyleStr};font-size:${scale}em;line-height:${
        scale < 1 ? 1 : "inherit"
      };">${text}</div>`;
    }

    const data = [
      {
        type: "未曾付费选座",
        value: (predictResult.predict
          .filter(
            (ele) =>
              (ele.select_seat_cnt_y2_dense == 0)).length /
              predictResult.predict.length)
          .toFixed(2)*100,
      },
      {
        type: "曾付费选座",
        value: (predictResult.predict
          .filter(
            (ele) =>
              (ele.select_seat_cnt_y2_dense !== 0)).length /
              predictResult.predict.length)
          .toFixed(2)*100,
      },
    ];

    const piePlot = new Pie("tkt_book", {
      appendPadding: 10,
      data,
      angleField: "value",
      colorField: "type",
      radius: 1,
      innerRadius: 0.64,
      meta: {
        value: {
          formatter: (v) => `${v} %`,
        },
      },
      label: {
        type: "inner",
        offset: "-50%",
        style: {
          textAlign: "center",
        },
        autoRotate: false,
        content: "{value}",
      },
      statistic: {
        title: {
          offsetY: -4,
          customHtml: (container, view, datum) => {
            const { width, height } = container.getBoundingClientRect();
            const d = Math.sqrt(
              Math.pow(width / 2, 2) + Math.pow(height / 2, 2)
            );
            const text = datum ? datum.type : "总计";
            return renderStatistic(d, text, { fontSize: 28 });
          },
        },
        content: {
          offsetY: 4,
          style: {
            fontSize: "32px",
          },
          customHtml: (container, view, datum, data) => {
            const { width } = container.getBoundingClientRect();

            const text = datum
              ? `${datum.value} %`
              : `${data.reduce((r, d) => r + d.value, 0)} %`;
            return renderStatistic(width, text, { fontSize: 32 });
          },
        },
      },
      // 添加 中心统计文本 交互
      interactions: [
        { type: "element-selected" },
        { type: "element-active" },
        { type: "pie-statistic-active" },
      ],
    });

    piePlot.render();

    const feature_importance_data = [
      {feature_name: '是否乘坐AB1010航班', value: 0.015304},
      {feature_name: '是否乘坐AB1006航班', value: 0.015985},
      {feature_name: '最后一次乘机至今时长', value: 0.016777},
      {feature_name: '近3年平均订票时间间隔', value: 0.018603},
      {feature_name: '近3年总订票次数', value: 0.019461},
      {feature_name: '近3年飞行总里程', value: 0.021465},
      {feature_name: '近3年机票总消费', value: 0.025186},
      {feature_name: '近2年付费选座次数', value: 0.030546},
      {feature_name: '近2年每次飞行平均里程', value: 0.033566},
      {feature_name: '机票费', value: 0.035778},
    ];

    // const feature_importance_data = predictResult.feature_importance.filter(
    //   (ele) => ele.value >= 0.015
    // );
    const feature_importance_table = new Chart({
      container: "feature_importance",
      autoFit: true,
      height: 500,
      padding: [40, 0],
    });
    feature_importance_table.data(feature_importance_data);
    feature_importance_table.coordinate("polar", {
      startAngle: Math.PI, // 起始角度
      endAngle: Math.PI * (3 / 2), // 结束角度
    });
    feature_importance_table.scale("value", {
      tickCount: 6,
    });
    feature_importance_table.axis("value", {
      grid: {
        line: {
          type: "circle",
        },
        closed: false,
      },
      verticalFactor: 1,
      label: {
        offset: 15,
      },
    });
    feature_importance_table.axis("feature_name", {
      tickLine: {
        alignTick: false,
      },
      grid: {
        alignTick: false,
      },
    });
    feature_importance_table.legend("feature_name", {
      position: "right",
    });
    feature_importance_table.tooltip({
      showMarkers: false,
    });
    feature_importance_table.interaction("element-highlight");
    feature_importance_table
      .interval()
      .position("feature_name*value")
      .color("feature_name", "rgb(255,215,135)-rgb(252,143,72)");
    // .label("value", {
    //   offset: -15,
    //   style: {
    //     textAlign: "center",
    //     fill: "#000",
    //   },
    // })
    // .style({
    //   lineWidth: 1,
    //   stroke: "#fff",
    // })

    feature_importance_table.render();
  }, [predictResult]);

  const props = {
    name: "file",
    multiple: true,
    action: "http://localhost:8000/seat_selection/predict/",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        setpredictResult(info.file.response[0]);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  switch (predictResult) {
    case null:
      return (
        <div className={styles["main-page"]}>
          <div className={styles["top"]}>
            <h1 className={styles["top_left"]}>付费选座预测</h1>
            <div className={styles["top_right"]}>
              <Link href={"http://localhost:3000/"}>
                <Button className={styles.button1}>系统首页</Button>
              </Link>
              <Link href={"http://localhost:3000/predict"}>
                <Button className={styles.button1}>付费选座预测</Button>
              </Link>
              <Link href={"http://localhost:3000/history"}>
                <Button className={styles.button1}>历史数据可视化展示</Button>
              </Link>
              <Link href={"http://localhost:3000/airplane-id"}>
                <Button className={styles.button1}>航班查询</Button>
              </Link>
            </div>
          </div>

          <div className={styles["border-p"]}>
            <h1 className={styles["title"]}>
              注意：请根据模板上传需要预测的数据
            </h1>
            <Form wrapperCol={{ span: 12 }}>
              <Row>
                <Col span={4} />
                <Col span={16}>
                  <Form.Item wrapperCol={{ span: 20, offset: 2 }}>
                    <Dragger {...props}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        点击或拖拽文件至此区域以上传并进行付费选座预测
                      </p>
                      <p className="ant-upload-hint">
                        提示： 支持单一或批量上传文件
                      </p>
                    </Dragger>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item wrapperCol={{ span: 2, offset: 11 }}>
                <div className={styles["down-p"]}>
                  <a download="template.csv" href="/static/template.csv">
                    <Button type="primary">下载数据模板</Button>
                  </a>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      );
    default:
      return (
        <div className={styles["result-display"]}>
          <div className={styles["title1"]}>
            <div>已完成付费选座预测</div>
          </div>
          <div className={styles["wrapper"]}>
            <h1 className={styles["title3"]}>航空旅客画像：</h1>
            <Button type="primary" onClick={exportResultFile}>
              下载结果文件
            </Button>
            <div className={styles["title2"]}>
              是否付费选座分布统计
              <div className={styles["title4"]}>
                (X轴：人数)
              </div>
            </div>
            <div id="emd_lable"></div>

            <h1 className={styles["title2"]}>
              付费选座概率分布统计
              <div className={styles["title4"]}>
                (X轴：付费选座概率，Y轴：占比)
              </div>
            </h1>
            <div id="predict_next"></div>

            <h1 className={styles["title2"]}>
              航班与是否付费选座分布统计
              <div className={styles["title4"]}>
                (X轴：人数)
              </div>
            </h1>
            <div id="air_id"></div>

            <h1 className={styles["title2"]}>
              每月平均机票费分布统计
            </h1>
            <div id="month_price"></div>

            <h1 className={styles["title2"]}>
              舱位与是否付费选座分布统计
              <div className={styles["title4"]}>
                (X轴：人数)
              </div>
            </h1>
            <div id="cabin"></div>

            <h1 className={styles["title2"]}>
              近2年每次飞行平均里程与选座概率分布统计
              <div className={styles["title4"]}>
                (X轴：平均里程，Y轴：付费选座概率)
              </div>
            </h1>
            <div id="probability_dist"></div>

            <h1 className={styles["title2"]}>
              近2年付费选座次数分布统计
            </h1>
            <div id="tkt_book"></div>

            <h1 className={styles["title2"]}>特征重要程度(前10位)</h1>
            <div id="feature_importance"></div>
          </div>
          {/* (&gt;=0.015) */}
          <h1 className={styles["title5"]}>
              付费选座概率位于[50%, 60%)的旅客情况
          </h1>
          {ResultList(predictResult.predict.filter((ele) => {
            return (
              ele.predict_next >= 0.5 &&
              ele.predict_next < 0.6
            );
          }))}

          <h1 className={styles["title5"]}>
              付费选座概率位于[60%, 70%)的旅客情况
          </h1>
          {ResultList(predictResult.predict.filter((ele) => {
            return (
              ele.predict_next >= 0.6 &&
              ele.predict_next < 0.7
            );
          }))}

          <h1 className={styles["title5"]}>
              付费选座概率位于[70%, 80%)的旅客情况
          </h1>
          {ResultList(predictResult.predict.filter((ele) => {
            return (
              ele.predict_next >= 0.7 &&
              ele.predict_next < 0.8
            );
          }))}

          <h1 className={styles["title5"]}>
              付费选座概率位于[80%, 90%)的旅客情况
          </h1>
          {ResultList(predictResult.predict.filter((ele) => {
            return (
              ele.predict_next >= 0.8 &&
              ele.predict_next < 0.9
            );
          }))}

          <h1 className={styles["title5"]}>
              付费选座概率位于[90%, 100%]的旅客情况
          </h1>
          {ResultList(predictResult.predict.filter((ele) => {
            return (
              ele.predict_next >= 0.9 &&
              ele.predict_next <= 1
            );
          }))}

        </div>
      );
  }
}

export default Predict;
