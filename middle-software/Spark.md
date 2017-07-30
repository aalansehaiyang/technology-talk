## Spark

---

##### 附录

* [Spark Streaming中流式计算的困境与解决之道](http://mp.weixin.qq.com/s/URJg23Pz0rkFFAjWCdYB1w)

---

##### 名词

* RDD(Resilient Distributed Datasets)，弹性分布式数据集。生成只有两种途径：一种来自内存集合和外部存储系统；另一种是通过转换操作来自于其他RDD，比如map、filter、join等。
* Spark Core：基于RDD提供了丰富的操作接口，利用DAG进行统一的任务规划，使的Spark能够更加灵活的处理类似MapReduce的批处理作业
* Spark SQL/ Shark：兼容Hive的接口HQL，提供比Hive高出数10~100倍的查询速度的分布式SQL引擎
* Spark Streaming：将流式计算分解成一系列的短小的批处理作业
* GraphX：基于Spark的图计算框架
* MLlib：迭代式运算，MLlib是构建在Spark上的机器学习算法库，目前支持常用的分类算法、聚类算法、推荐算法。

#### 大数据处理分为三种情况
* 复杂的批量数据处理，时间跨度为数十分钟到数小时
* 基于历史数据的交互式查询，时间跨度为数十秒到数分钟
* 基于实时数据流的数据处理，通常时间跨度为数百毫秒到数秒

