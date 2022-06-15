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
  Steps,
  BackTop
} from "antd";
import { Bar, Area, Column, Pie, measureTextWidth } from "@antv/g2plot";
import { Chart } from "@antv/g2";
import DataSet from "@antv/data-set";
import Image from "next/image";
import { ExportToCsv } from "export-to-csv";

const { Option } = Select;
const { Dragger } = Upload;
const { Step } = Steps;


function Predict() {
  const [predictResult, setpredictResult] = useState(null);
  useEffect(() => {
    if (predictResult == null) return;
    
  }, [predictResult]);


  switch (predictResult) {
    case null:
      return (
        <div className={styles["result-display"]}>
          <BackTop />
          <strong className="site-back-top-basic">  </strong>
          <div className={styles["top-h"]}>
            <h1 className={styles["top_left-h"]}>预测算法可视化展示</h1>
            <div className={styles["top_right-h"]}>
                <Link href={"http://localhost:3000/"}>
                    <Button className={styles["button1-h"]}>系统首页</Button>
                </Link>
                <Link href={'http://localhost:3000/algorithm'}>
                <Button className={styles["button1-h"]} >预测算法可视化展示</Button>
                </Link>
                <Link href={"http://localhost:3000/predict"}>
                    <Button className={styles["button1-h"]}>付费选座预测</Button>
                </Link>
                <Link href={"http://localhost:3000/history"}>
                <Button className={styles["button1-h"]}>历史数据可视化展示</Button>
                </Link>
                <Link href={"http://localhost:3000/airplane-id"}>
                    <Button className={styles["button1-h"]}>航班查询</Button>
                </Link>
            </div>
          </div>

          <div className={styles["container"]}>
            <p className={styles["description"]}>
              &ensp;受到级联结构和一些模型融合算法的启发，本课题提出了一种基于集成学习的航空旅客偏好预测算法（Ensemble learning based on cascaded training, ELBCT）。
            </p>
            <div className={styles["steps"]}>
              <Steps progressDot current={6}>
                <Step title="1. 原始数据集情况"  />
                <Step title="2. 数据预处理与特征选择"  />
                <Step title="3. 级联训练算法"  />
                <Step title="4. 分类器贪心融合算法"  />
                <Step title="5. 贝叶斯优化算法调整超参数"  />
                <Step title="6. 实验结果与分析"  />
              </Steps>
            </div>

            <div className={styles["arrow"]}>
              <Image src="/arrow_down.svg" alt="me" width="64" height="84" />
            </div>
            

            <h1 className={styles["title-algo"]}>1. 原始数据集情况</h1>
            <table className={styles["table"]} border="2">
              <tr className={styles["header"]}>
                  <th>样本总数</th>
                  <th>信息数据全为0的旅客样本数</th>
                  <th>未付费选座样本数</th>
                  <th>付费选座样本数</th>
              </tr>
              <tr>
                  <td>23432</td>
                  <td>153</td>
                  <td>21957</td>
                  <td>1475</td>
              </tr>
              <tr className={styles["header"]}>
                  <th>特征总数</th>
                  <th>信息数据为0比例达80%的旅客样本数</th>
                  <th>0值比例达95%特征数</th>
                  <th>旅客男女比例</th>
              </tr>
              <tr>
                  <td>657</td>
                  <td>7232</td>
                  <td>340</td>
                  <td>1.25</td>
              </tr>
            </table>

            <div className={styles["arrow"]}>
              <Image src="/arrow_down.svg" alt="me" width="64" height="84" />
            </div>

            <h1 className={styles["title-algo"]}>2. 数据预处理与特征选择</h1>
            <p className={styles["description"]}>
              &ensp;首先，在数据预处理时删除含缺失值、无效值比例过大的特征。<br/>
              &emsp;&emsp;由于是否付费选座的行为具有随机性，并且原因具有多样性，因此是否付费选座旅客之间的特征差异容易被支持向量机、BP神经网络等模型的软阈值忽略。为了提升预测模型对这些特征差异的敏感性，使用AdaBoost算法选择主要特征。同时，AdaBoost算法不断调整每个样本点的权重，给予错分样本更高权重，使后续能选择出更关注错分样本的特征。<br/>
              &emsp;&emsp;共同使用这两种方式从而解决维度爆炸问题，降低特征维度。
            </p>

            <div className={styles["arrow"]}>
              <Image src="/arrow_down.svg" alt="me" width="64" height="84" />
            </div>

            <h1 className={styles["title-algo"]}>3. 级联训练算法</h1>
            <p className={styles["description"]}>
              &ensp;在提出的ELBCT算法中，作为欠采样方法的级联训练算法从负样本集合（未付费）中随机采样出一个与正样本集合（付费）数量相等的样本集合，再与正样本集合结合形成初步训练集。接着，通过在每次迭代训练中删除部分被正确划分的负样本，从而让整体数据集逐渐平衡。随着不断删除容易分类的负样本，剩余的负样本与正样本特征也逐渐相似。这样做有效解决了样本不平衡问题，迫使模型更关注难分类的样本，而且避免了欠采样方法导致的信息缺失问题，从而提升模型预测效果。<br/>
              &emsp;&emsp;同时，在每轮迭代训练过程中都将产生一个性能不同的分类器。又由于实验时采用多种学习算法模型训练（XGBoost、RandomForest、CatBoost、Light GBM四种），所以完成级联训练后，将产生多个种类且性能不同的分类器。这些分类器将用于后续分类器贪心融合过程。级联训练算法具体流程如下图所示。
            </p>
            <h1 className={styles["title-algo"]}>级联训练算法流程图</h1>
            <Image src="/cascaded_training.svg" alt="me" width="800" height="700" />

            <div className={styles["arrow"]}>
              <Image src="/arrow_down.svg" alt="me" width="64" height="84" />
            </div>

            <h1 className={styles["title-algo"]}>4. 分类器贪心融合算法</h1>
            <p className={styles["description"]}>
              &ensp;分类器贪心融合时，首先从所有分类器中根据 AUC指标筛选出性能最优的分类器M<sub>max</sub>，然后遍历搜索与该分类器Jaccard距离最大的其他分类器M<sub>d</sub>，计算两个分类器融合后的二分类预测结果与预测概率。采用AUC指标衡量分类器融合效果，通过判断融合后分类器E的AUC是否提升，决定是否对分类器M<sub>max</sub>和分类器M<sub>d</sub>进行融合。若AUC提升则融合，否则抛弃分类器M<sub>d</sub>。<br/>
              &emsp;&emsp;接着继续从剩余分类器集合中筛选出与当前结果Jaccard距离最大的分类器进行融合操作，直到所有的分类器都被筛选完。算法具体流程如下图所示。
            </p>
            <h1 className={styles["title-algo"]}>分类器贪心融合算法流程图</h1>
            <Image src="/Ensemble learning.svg" alt="me" width="700" height="550" />

            <div className={styles["arrow"]}>
              <Image src="/arrow_down.svg" alt="me" width="64" height="84" />
            </div>

            <h1 className={styles["title-algo"]}>5. 贝叶斯优化算法调整超参数</h1>
            <p className={styles["description"]}>
              &ensp;对于模型内超参数的调优，本课题采用十折交叉验证以及贝叶斯优化算法。该方法相对于其他调参方法更加稳定、高效。<br/>
              &emsp;&emsp;本课题提出的ELBCT模型内超参数N，意义是从之前级联训练后得到的分类器中提取N个。超参数N用于设置融合过程的分类器数量，降低模型融合的复杂度。为了确定最合适的N，输出不同N下经贝叶斯优化算法调参后的最终预测模型在测试集上的AUC，以便了解参数N不同取值下的模型性能，详见下图。
            </p>
            <h1 className={styles["title-algo"]}>不同N下测试集AUC值折线图</h1>
            <div className={styles["space"]}>
              <Image src="/N-AUC.png" alt="me" width="500" height="300" />
            </div>
            <p className={styles["description"]}>
              &ensp;从中可以看出,当N的值为15时，融合后的预测模型在测试集上效果达到最佳。同时也可以发现，当N的值为5～10和16～22时，模型的效果有所降低，这可能是由于ELBCT模型是依据贪心算法对模型进行了融合，模型仅考虑当前融合该模型会有显著的提升，导致局部地方模型的整体效果有所下降。<br/>
              &emsp;&emsp;此外，实验中使用的XGBoost、Random&ensp;Forest、CatBoost、Light GBM四类集成学习算法经贝叶斯优化算法调参后最终结果如下表所示。
            </p>
            <h1 className={styles["title-algo"]}>优化后模型超参值</h1>
            <table className={styles["table"]} border="2">
              <tr className={styles["header"]}>
                  <th>Parameter / Model</th>
                  <th>XGBoost</th>
                  <th>Random Forest</th>
                  <th>CatBoost</th>
                  <th>Light GBM</th>
              </tr>
              <tr>
                  <th className={styles["header"]}>max_depth</th>
                  <td>5</td>
                  <td>39</td>
                  <td>9</td>
                  <td>9</td>
              </tr>
              <tr>
                  <th className={styles["header"]}>min_samples_split</th>
                  <td>——</td>
                  <td>80</td>
                  <td>——</td>
                  <td>——</td>
              </tr>
              <tr>
                  <th className={styles["header"]}>n_estimators</th>
                  <td>77</td>
                  <td>598</td>
                  <td>——</td>
                  <td>102</td>
              </tr>
              <tr>
                  <th className={styles["header"]}>min_child_weights</th>
                  <td>8</td>
                  <td>——</td>
                  <td>——</td>
                  <td>——</td>
              </tr>
              <tr>
                  <th className={styles["header"]}>learning_rate</th>
                  <td>——</td>
                  <td>——</td>
                  <td>0.012</td>
                  <td>0.034</td>
              </tr>
              <tr>
                  <th className={styles["header"]}>num_leaves</th>
                  <td>——</td>
                  <td>——</td>
                  <td>——</td>
                  <td>34</td>
              </tr>
              <tr>
                  <th className={styles["header"]}>iterations</th>
                  <td>——</td>
                  <td>——</td>
                  <td>904</td>
                  <td>——</td>
              </tr>
              <tr>
                  <th className={styles["header"]}>max_features</th>
                  <td>——</td>
                  <td>0.7</td>
                  <td>——</td>
                  <td>——</td>
              </tr>
            </table>

            <div className={styles["arrow"]}>
              <Image src="/arrow_down.svg" alt="me" width="64" height="84" />
            </div>

            <h1 className={styles["title-algo"]}>6. 实验结果与分析</h1>
            <p className={styles["description"]}>
              &ensp;本课题提出的ELBCT模型与Logistics Regression、XGBoost、Random Forest、CatBoost、Light GBM、Stacking共6种算法的性能对比情况如下表所示。结果均经过十折交叉验证后取平均而得。
            </p>
            <h1 className={styles["title-algo"]}>模型性能对比情况</h1>
            <table className={styles["table2"]} border="2">
              <tr className={styles["header"]}>
                  <th>Indicator/ Model</th>
                  <th>Logistics Regression</th>
                  <th>XGBoost</th>
                  <th>Random Forest</th>
                  <th>CatBoost</th>
                  <th>Light GBM</th>
                  <th>Stacking</th>
                  <th>ELBCT</th>
              </tr>
              <tr>
                  <th className={styles["header"]}>AUC</th>
                  <td>0.6014</td>
                  <td>0.8032</td>
                  <td>0.8027</td>
                  <td>0.7921</td>
                  <td>0.7733</td>
                  <td>0.8254</td>
                  <td>0.8383</td>
              </tr>
              <tr>
                  <th className={styles["header"]}>Recall</th>
                  <td>0.7167</td>
                  <td>0.6228</td>
                  <td>0.6528</td>
                  <td>0.6569</td>
                  <td>0.7262</td>
                  <td>0.6303</td>
                  <td>0.7714</td>
              </tr>
              <tr>
                  <th className={styles["header"]}>Time (s)</th>
                  <td>138.2</td>
                  <td>185.1</td>
                  <td>155.5</td>
                  <td>163.1</td>
                  <td>162.4</td>
                  <td>180.7</td>
                  <td>233.2</td>
              </tr>
            </table>
            <p className={styles["description"]}>
              &ensp;ELBCT算法明显提升了预测结果的Recall指标，与其他6种算法相比，提升了7.63%～23.86%。在AUC指标上，ELBCT算法相比于Logistic Regression算法提升了39.39%，原因在于ELBCT算法对多种分类器的结果进行组合，相比于单一分类器，泛化性能更高；相比于XGBoost、Random Forest、CatBoost、Light GBM四种传统的集成分类器，ELBCT算法在AUC指标上分别提升了4.37%、4.43%、5.85%、8.41%，原因在于ELBCT算法采用多种学习算法训练得到分类器，同时采用贪心融合策略，整合性能优异且差异性大的分类器，从而获得了鲁棒性更强的模型。<br/>
              &emsp;&emsp;Stacking模型与ELBCT模型均作为融合多种分类器的模型，两者在融合分类器种数变化时Recall的对比情况如下图所示。
            </p>
            <h1 className={styles["title-algo"]}>Stacking与ELBCT在融合分类器种数变化时性能对比</h1>
            <div className={styles["space"]}>
              <Image src="/stacking-ELBCT.jpg" alt="me" width="550" height="400" />
            </div>
            <p className={styles["description"]}>
              &ensp;由上图可知，在Recall指标上，ELBCT模型在融合分类器种数为1、2、3、4时，相比于Stacking模型分别提升了20.24%、2.25%、9.30%、22.39%，原因在于Stacking模型融合时每种分类器仅有一个。ELBCT模型不仅融合多种分类器，而且融合的分类器数量多于Stacking模型，在融合过程中会选择性能优异且差异性大的分类器，使得最终预测模型的泛化能力更强。
            </p>

          </div>
            
        </div>
      );
  }
}

export default Predict;
