##  Spark SQL笔记
---

Spark SQL API为多种功能提供了函数，比如：选择列、过滤行、聚合列、合并数据以及其他数据处理。只需要寥寥数行代码即可实现功能。

支持多种数据源：

* 文件。文件可以位于HDFS、S3或者本地文件系统上。支持的文件格式，CSV、JSON、ORC、Avro

* NoSQL数据库。如：Hbase、Cassandra、Elastics Search、Druid

* 其他数据库。如：mysql、oracle等

Spark SQL与hive完全兼容。不仅支持HiveSQL，还可以访问Hive meta-store、UDF。Spark SQL不需要Hive环境，无论有没有Hive，都可以运行Spark SQL。它有内置的HiveQL解析器。

##### 性能提升：

* 减少磁盘IO。在读数据时，会有所选择，跳过没有被查询到的分区、行、列。
* 数据分区。把一个已分区的数据集切分成多个水平分片。数据根据单列或多列做分区。在一个已分区的数据集上做过滤条件可以减少浪费在那些从不使用的数据上产生的大量IO操作。
* 列存储。采用表格形式，可以用行和列来表示。使用列式存储，只读取查询用到的那几列数据。
* 内存中的列式缓存。
* 行跳过。比如Parquet和ORC这种序列化格式会存储一个行分组或者多行中每一列的最小值和最大值。根据这一信息，Spark SQL在读取数据时可以跳过某些行。
* 谓词下推。比如从关系型数据库读取数据，会先借助原生数据库的索引来过滤。因为原生的过滤要比在应用层执行过滤快得多。
* 查询优化。生成一个优化过的物理查询计划。分成了四个阶段：分析、逻辑优化、物理计划、代码生成。

##### 应用范围：

* ETL（Extract 抽取、 Transform 转换、Load 加载）

表示从数据源读数据、对数据做转换操作、将数据写到另一个数据源中的过程。

* 数据可视化

提供了统一的抽象，屏蔽了底层不同数据源的差异性。比如Spark SQL可以让在Parquet和PostreSQL的表间做连接操作。


* 分布式JDBC查询引擎

* 数据仓库

Spark SQL可用于创建一个开源的数据仓库解决方案。

##### API：

Spark SQL API由SQLContext、HiveContext、DataFrame三个关键抽象组成。

* SQLContext是Spark SQL库的入口点。只有有了SQLContext类实例，才能创建Spark SQL库提供的其他类的类实例。同样，只有有了SQLContext类实例，才能执行SQL查询。

* HiveContext是Spark SQL库的另一个入口点，继承自SQLContext，用于处理存储在Hive中的数据。

* DataFrame表示若干行的分布式数据，每一行有若干个有名字的列。提供各种方法用于处理、分析结构化数据（选择列、过滤行、聚合列、连接表、抽样数据以及其他一些常见的数据处理任务）。可以被当成一个临时表注册到应用上，在上面可以使用SQL来查询。


如何创建DataFrame：

* toDF。从RDD创建DataFrame，

* createDataFrame。SQLContext和HiveContext类都提供了一个名为createDataFrame的方法，用于从一个由行构成的RDD中创建DataFrame。方法有两个参数：行构成的RDD和一个数据格式。

* 从数据源创建DataFrame。SQLContext和HiveContext类都提供一个名为read的工厂方法，返回一个DataFrameReader类实例。它定义了从数据源读取数据的接口，它使得你可以为读取数据设置不同的选项。


DataFrame常用的API：

* 基本操作
	* cache
	* columns
	* dtypes
	* explain
	* persist
	* printSchema
	* registerTempTable
	* toDF
* 集成语言的查询所用的方法
	* agg
	* apply
	* cube
	* distinct
	* explode
	* filter
	* groupBy
	* intersect
	* join
	* limit
	* orderBy
	* sort
	* randomSplit
	* rollup
	* sample
	* selectExpr
	* withColumn
* RDD操作
	* map
	* flatMap
	* foreach
	* mapPartition
	* coalesce
	* repartition
	* 等等，常用的RDD操作
	* 如果需要使用DataFrame类中没有但是RDD类中有的方法，可以通过rdd方法
* 操作
	* collect
	* count
	* describe
	* first
	* show
	* take
* 输出操作
	* write。返回DataFrameWrite类实例，提供了多种用于将DataFrame内容保存至数据源的方法。
	
保存DataFrame：	

如果将DataFrame保存到关系型数据库、NoSQL数据存储以及其他各种文件格式的文件中，需要借助DataFrameWrite类，其内部定义将数据写入数据源的接口，可以指定存储格式、分区等属性。

```
比如：
jdbcDF.write.jdbc("jdbc:postgresql:dbserver", "schema.tablename", connectionProperties)
```

可以将DataFrame存储至任何Hadoop支持的存储系统中，包括本地文件系统、HDFS、Amazon S3，可以使用的格式包括Parquet、JSON、OCR、CSV。

《Spark大数据分析》P132

保存DataFrame时，如果目的路径和表已经存在，Spark SQL默认会抛出异常。可以能过mode方法来改变这一行为。mode方法只有一个参数。

* error。默认，如果目的路径或表存在，抛出异常
* append。如果目地路径或表存在，将数据追加到已有的数据中
* overwrite。如果存在，覆盖已有的数据
* ignore。如果存在，忽略此操作


##### 内置函数

即可用于DataFrame API，也可以用于SQL接口。前提需要引入一行代码

```
import org.apache.spark.sql.functions._
```
可以分为几类：聚合操作、集合操作、日期/时间、数学、字符串、窗口操作、其他选项。

* 聚合操作

内置的聚合操作函数包括approx_count_distinct、avg、count、countDistinct、first、last、max、min、sum、sumDistinct等

```
如：
peopleDF.select(min($"price"))
```

* 集合操作

集合操作函数作用于多列上，这些列包含一个多元素的集合，array_contains、explode、size、sort_array

* 日期/时间

对时间类型的值的列处理，又可以细分为转换（一种转换成另一种格式）、抽取（提取年、月、日等）、算术（如：加2天）、其他选项。

* 数学

提供一些内置的数学函数，比如，abs、sqrt、ceil、pow等

* 字符串

对一个字符串进行分割、大小写转换并删除首尾空白。

* 窗口


##### UDF、UDAF

spark sql允许用户自定义函数（UDF）和用户定义的聚合函数（UDAF）。UDF每次都在一行数据上进行指定的计算，返回一个值。UDAF则在多行构成的分组上进行指定的聚合操作。














