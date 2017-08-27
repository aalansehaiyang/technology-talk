##  Spark Streaming 笔记
---
Spark Streaming是一个库，它使得Spark能够处理实时数据流。它运行在Spark之上，并提供了用于处理数据流的高阶API。它将Spark变成了一个分布式流数据处理框架。

StreamingContext是Spark Streaming库的入口。

var ssc = new StreamingContext(sparkConf, Seconds(5))，其中第二个参数指定每一批的大小，以时间为单位。数据流根据这个时间间隔分割成批，每一批数据都被当成一个RDD来处理。每一批的大小可以低至500毫秒。

ssc.checkpoint("path-to-checkpoint-directory")，会让Spark Streaming定期创建检查点数据，生产环境，最好是HDFS存储系统，有很好的容错。

ssc.start() ，开始启动流式计算

ssc.awaitTermination()，如果应用是多线程的，并且调用start方法的是其他线程，而不是主线程，必须使用awaitTermination方法，以避免主线程过早退出。start方法是一个阻塞方法，直到流式计算结束或停止，这个方法才返回。

DStream（离散数据流）是处理数据流的主要抽象。其本质还是RDD，Spark Streaming将在DStream上的操作转换成底层RDD上的操作。所以它具有RDD的关键特征：不可变，分区并且容错。

创建Dstream，可以从一个数据流来源创建，也可以通过现有的DStream执行转换操作得到。

* socketTextStream：从TCP套接字连接接收数据流的DStream
* textFileStream：监控hadoop的文件系统上是否有新文件创建，如果有，就作为文本文件读取新文件内容。必须是mv命令移动过来。
* actorStream：创建一个使用用户自己实现的Akka actor接收器的DStream
* 高级源：一些外部三方库提供的工具类方法

处理数据流，包含两类：转换和输出。转换细分为：基本转换、聚合转换、键值对转换、特殊转换。DStream也是惰性操作。如果一个DStream上没有任何输出操作，即使调用了转换操作，Spark Streaming也不会对数据做任何处理。

* 基本转换
	* map
	* flatMap
	* filter
	* repartition
	* union
* 聚合转换
	* count
	* reduce
	* countByValue
* 键值对转换
	* cogroup
	* join
	* groupByKey	
	* reduceByKey
* 特殊转换
	* transform
	* updateStateByKey
	
输出操作

* saveAsTestFiles
* saveAsObjectFiles
* saveAsHadoopFiles
* saveAsNewAPIHadoopFiles
* print，在控制台上显示
* foreachRDD，逐个遍历元素，保存至数据库中



