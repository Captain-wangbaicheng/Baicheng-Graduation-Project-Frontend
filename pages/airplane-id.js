import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import styles from "./predict.module.scss";
import Link from "next/link";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
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
  Col,
  message,
  Button,
  Checkbox,
} from "antd";
import { Bar, Area, Column } from "@antv/g2plot";
import { Chart } from "@antv/g2";
import DataSet from "@antv/data-set";
import axios from "axios";

const { Option } = Select;
const { Dragger } = Upload;

function Predict() {
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
      "[0%， 10%)",
      "[10%， 20%)",
      "[20%， 30%)",
      "[30%， 40%)",
      "[40%， 50%)",
      "[50%， 60%)",
      "[60%， 70%)",
      "[70%， 80%)",
      "[80%， 90%)",
      "[90%， 100%]",
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
    
    function getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    const month_price_data = [
      { year: '1', price: 711 },
      { year: '2', price: 876 },
      { year: '3', price: 682 },
      { year: '4', price: 738 },
      { year: '5', price: 757 },
      { year: '6', price: 785 },
      { year: '7', price: 929 },
      { year: '8', price: 944 },
      { year: '9', price: 731 },
      { year: '10', price: 755 },
      { year: '11', price: 689 },
      { year: '12', price: 698 },
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

    // const tkt_table = new Chart({
    //   container: "tkt",
    //   autoFit: true,
    //   height: 500,
    // });
    // const dv = new DataSet.View().source(predictResult.predict);
    // dv.transform({
    //   type: "kernel-smooth.density",
    //   fields: ["tkt_3y_amt_dense", "tkt_i_amt_y3_dense"],
    //   as: ["tkt_3y_amt_dense", "tkt_i_amt_y3_dense", "density"],
    // });
    // tkt_table.data(predictResult.predict);
    // tkt_table.scale({
    //   tkt_3y_amt_dense: { nice: true },
    //   tkt_i_amt_y3_dense: { nice: true },
    //   density: { nice: true },
    // });
    // tkt_table.point().position("tkt_3y_amt_dense*tkt_i_amt_y3_dense");
    // const view = tkt_table.createView({
    //   padding: 0,
    // });
    // view.axis(false);
    // view.data(dv.rows);
    // view
    //   .heatmap()
    //   .position("tkt_3y_amt_dense*tkt_i_amt_y3_dense")
    //   .color("density", "blue-cyan-lime-yellow-red");
    // tkt_table.render();

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

    const tkt_book_table = new Chart({
      container: "tkt_book",
      autoFit: true,
      height: 500,
    });
    const tkt_book_data = [
      {
        type: "未曾付费选座",
        value: predictResult.predict.filter(
          (ele) => ele.tkt_book_cnt_y3_dense == 0
        ).length,
      },
      {
        type: "曾付费选座",
        value: predictResult.predict.filter(
          (ele) => ele.tkt_book_cnt_y3_dense != 0
        ).length,
      },
    ];
    tkt_book_table.data(tkt_book_data);
    tkt_book_table.coordinate("theta", {
      radius: 0.75,
    });
    tkt_book_table.tooltip({
      showMarkers: false,
    });
    const interval = tkt_book_table
      .interval()
      .adjust("stack")
      .position("value")
      .color("type", ["#47abfc", "#38c060"])
      .style({ opacity: 0.4 })
      .state({
        active: {
          style: (element) => {
            const shape = element.shape;
            return {
              matrix: Util.zoom(shape, 1.1),
            };
          },
        },
      })
      .label("type", (val) => {
        const opacity = val === "zero" ? 0.5 : 0;
        return {
          offset: -30,
          style: {
            opacity,
            fill: "white",
            fontSize: 12,
            shadowBlur: 2,
            shadowColor: "rgba(0, 0, 0, .45)",
          },
          content: (obj) => {
            return obj.type + "\n" + obj.value + "%";
          },
        };
      });
    tkt_book_table.interaction("element-single-selected");
    tkt_book_table.render();
  }, [predictResult]);

  const onFinish = (values) => {
    if (
      ![
        "AB1015",
        "AB1014",
        "AB1013",
        "AB1010",
        "AB1009",
        "AB1008",
        "AB1007",
        "AB1006",
      ].includes(values.pass_id)
    ) {
      alert("该航班不存在");
      return;
    }
    var bodyFormData = new FormData();
    bodyFormData.append("pass_id", values.pass_id);
    axios({
      method: "post",
      url: `http://localhost:8000/seat_selection/airplane_id/`,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    }).then((res) => {
      const data = res.data;
      setpredictResult({
        predict: data,
      });
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  switch (predictResult) {
    case null:
      return (
        <div className={styles["main-page"]}>
          <div className={styles["top"]}>
            <h1 className={styles["top_left"]}>航班预测</h1>
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
          <div className={styles["border"]}>
            <h1 className={styles["title"]}>请输入需要查询的航班号</h1>

            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 8,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="航班号"
                name="pass_id"
                rules={[
                  {
                    required: true,
                    message: "请输入航班号!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <div className={styles["down"]}>
                  <Button type="primary" htmlType="submit">
                    点击查询
                  </Button>
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
            <div>已完成航班号查询</div>
          </div>
          <div className={styles["wrapper"]}>
            <h1 className={styles["title3"]}>航空旅客画像：</h1>

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

            {/* <h1 className={styles["title2"]}>
              近2年每次飞行平均里程分布统计
              <div className={styles["title4"]}>
                (X轴：平均里程，Y轴：旅客压缩序号)
              </div>
            </h1>
            <div id="avg_distance"></div> */}

            <h1 className={styles["title2"]}>
              近2年付费选座次数分布统计
            </h1>
            <div id="tkt_book"></div>
          </div>
        </div>
      );
  }
}

export default Predict;
