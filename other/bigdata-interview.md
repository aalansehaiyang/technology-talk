## 大数据面试题

---

* [https://mp.weixin.qq.com/s/3g3pd29Ju6MB0dOAOXkCtg](https://mp.weixin.qq.com/s/3g3pd29Ju6MB0dOAOXkCtg)

---

### Hadoop部分

* hadoop的map-reduce的实现原理？

```
首先map task会从本地文件系统读取数据，转换成key-value形式的键值对集合，使用的是hadoop内置的数据类型，比如longwritable、text等，将键值对集合输入mapper进行业务处理过程，将其转换成需要的key-value在输出之后会进行一个partition分区操作，默认使用的是hashpartitioner，可以通过重写hashpartitioner的getpartition方法来自定义分区规则，之后会对key进行进行sort排序，grouping分组操作将相同key的value合并分组输出，在这里可以使用自定义的数据类型，重写WritableComparator的Comparator方法来自定义排序规则，重写RawComparator的compara方法来自定义分组规则。

之后进行一个combiner归约操作，其实就是一个本地段的reduce预处理，以减小后面shuffle和reduce的工作量，reduce task会通过网络将各个数据收集进行reduce处理，最后将数据保存或者显示，结束整个job
```


* hadoop和spark的都是并行计算，那么他们有什么相同和区别

```
两者都是用mr模型来进行并行计算，hadoop的一个作业称为job，job里面分为map task和reduce task，每个task都是在自己的进程中运行的，当task结束时，进程也会结束

spark用户提交的任务成为application，一个application对应一个sparkcontext，app中存在多个job，每触发一次action操作就会产生一个job

这些job可以并行或串行执行，每个job中有多个stage，stage是shuffle过程中DAGSchaduler通过RDD之间的依赖关系划分job而来的，每个stage里面有多个task，组成taskset有TaskSchaduler分发到各个executor中执行，executor的生命周期是和app一样的，即使没有job运行也是存在的，所以task可以快速启动读取内存进行计算

hadoop的job只有map和reduce操作，表达能力比较欠缺而且在mr过程中会重复的读写hdfs，造成大量的io操作，多个job需要自己管理关系

spark的迭代计算都是在内存中进行的，API中提供了大量的RDD操作如join，groupby等，而且通过DAG图可以实现良好的容错
```

* 工作中，map-reduce程序运行的时候会有什么比较常见的问题？如何解决？

```
比如说作业中大部分都完成了，但是总有几个reduce一直在运行。这是因为这几个reduce中的处理的数据要远远大于其他的reduce，可能是因为对键值对任务划分的不均匀造成的数据倾斜。

解决的方法可以在分区的时候重新定义分区规则对于value数据很多的key可以进行拆分、均匀打散等处理，或者是在map端的combiner中进行数据预处理的操作
```
*  hadoop的TextInputFormat作用是什么，如何自定义实现

```
InputFormat会在map操作之前对数据进行两方面的预处理 
1.是getSplits，返回的是InputSplit数组，对数据进行split分片，每片交给map操作一次 
2.是getRecordReader，返回的是RecordReader对象，对每个split分片进行转换为key-value键值对格式传递给map

常用的InputFormat是TextInputFormat，使用的是LineRecordReader对每个分片进行键值对的转换，以行偏移量作为键，行内容作为值

自定义类继承InputFormat接口，重写createRecordReader和isSplitable方法 
在createRecordReader中可以自定义分隔符
```
* 为什么要用flume导入hdfs，hdfs的构架是怎样的

```
flume可以实时的导入数据到hdfs中，当hdfs上的文件达到一个指定大小的时候会形成一个文件，或者超过指定时间的话也形成一个文件

文件都是存储在datanode上面的，namenode记录着datanode的元数据信息，而namenode的元数据信息是存在内存中的，所以当文件切片很小或者很多的时候会卡死
```

* 简单说一下hadoop和spark的shuffle过程

```
hadoop：map端保存分片数据，通过网络收集到reduce端 
spark：spark的shuffle是在DAGSchedular划分Stage的时候产生的，TaskSchedule要分发Stage到各个worker的executor

减少shuffle可以提高性能
```

### Hbase部分

* hbase由哪几部分组成
* hbase 插入一条数据，内部是如何处理的？

```
1. 首先，Client通过访问ZK来请求目标数据的地址。
2. ZK中保存了-ROOT-表的地址，所以ZK通过访问-ROOT-表来请求数据地址。
3. 同样，-ROOT-表中保存的是.META.的信息，通过访问.META.表来获取具体的RS。
4. .META.表查询到具体RS信息后返回具体RS地址给Client。
5. Client端获取到目标地址后，然后直接向该地址发送数据请求。
```
* hbase某台机器宕机了，会不会丢失数据，为什么？

```
HBase的RegionServer宕机超过一定时间后，HMaster会将其所管理的region重新分布到其他活动的RegionServer上，由于数据和日志都持久在HDFS中，该操作不会导致数据丢失。所以数据的一致性和安全性是有保障的。
但是重新分配的region需要根据日志（LogFile）恢复原RegionServer中的内存MemoryStore表，这会导致宕机的region在这段时间内无法对外提供服务。
而一旦重分布，宕机的节点重新启动后就相当于一个新的RegionServer加入集群，为了平衡，需要再次将某些region分布到该server。 
因此，Region Server的内存表memstore如何在节点间做到更高的可用，是HBase的一个较大的挑战。
```
* rowkey的设计原则

* hbase 过滤器有哪些？你常用哪个？什么功能？

```
Hbase的过滤器有：RowFilter、PrefixFilter、KeyOnlyFilter、RandomRowFilter、InclusiveStopFilter、FirstKeyOnlyFilter、ColumnPrefixFilter、ValueFilter、ColumnCountGetFilter、SingleColumnValueFilter、SingleColumnValueExcludeFilter、WhileMatchFilter、FilterList 

比较常用的过滤器有：RowFilter 用来对rowkey进行过滤的。
http://blog.csdn.net/xugen12/article/details/44747465
```

* hbase 中cell的结构

cell中的数据是没有类型的，全部是字节码形式存贮。
 
* hbase 中region 太大问题

Hbase的region会自动split


### Hive部分

* Hive中存放是什么？ 

表。 存的是和hdfs的映射关系，hive是逻辑上的数据仓库，实际操作的都是hdfs上的文件，HQL就是用sql语法来写的mr程序。

* Hive与关系型数据库的关系？ 

没有关系，hive是数据仓库，不能和数据库一样进行实时的CURD操作。 是一次写入多次读取的操作，可以看成是ETL工具。

### Spark 部分

* spark有哪些组件？ 

```
（1）master：管理集群和节点，不参与计算。 
（2）worker：计算节点，进程本身不参与计算，和master汇报。 
（3）Driver：运行程序的main方法，创建spark context对象。 一个驱动程序可以在spark集群上启动一个或多个作业。
（4）spark context：控制整个application的生命周期，包括dagsheduler和task scheduler等组件。 
（5）client：用户提交程序的入口。
```
* spark工作机制？ 

用户在client端提交作业后，会由Driver运行main方法并创建spark context上下文。 
执行add算子，形成dag图输入dagscheduler，按照add之间的依赖关系划分stage输入task scheduler。 
task scheduler会将stage划分为task set分发到各个节点的executor中执行。

* spark的优化怎么做？ 

```
通过spark-env文件、程序中sparkconf和set property设置。 
（1）计算量大，形成的lineage过大应该给已经缓存了的rdd添加checkpoint，以减少容错带来的开销。 
（2）小分区合并，过小的分区造成过多的切换任务开销，使用repartition。
```
* spark sql比hive快至少10倍，原因是什么？

* mr 和 spark 区别，怎么理解 spark-rdd

```
Mr 是文件方式的分布式计算框架，是将中间结果和最终结果记录在文件中，map 和 reduce的数据分发也是在文件中。
spark 是内存迭代式的计算框架，计算的中间结果可以缓存内存，也可以缓存硬盘，但是不是每一步计算都需要缓存的。
Spark-rdd 是一个数据的分区记录集合，是利用内存来计算的，spark之所以快是因为有内存的模式 
```

* Spark程序的性能和调优方面有什么需要注意的

```
首先，对于大部分数据处理应用程序，磁盘I/O都是影响应用程序执行速度的决定性因素。Spark可以让用户在内存中创建数据，请尽量利用这一特性。将数据缓存在内存中可以让应用程序提速100倍以上。当然这也意味着最好使用具有大量内存的计算机搭建Spark集群。

其次，请避免需要进行数据重排（Data shuffling）的操作。跨越网络进行数据重排是一种开销很高的操作，在编写数据处理逻辑时一定要注意这一点。有时候相同的逻辑也可以通过更高效的操作实现，例如不要使用groupByKey操作，而是可以使用reduceByKey操作。

第三，优化数据中的分区数量。如果数据尚未分区，就无法充分利用Spark在并行数据处理方面的优势。例如，假设有一个100内核的Spark集群，但如果数据只有2个分区，此时将无法充分运用所有计算能力。

第四，通过共置的数据节点和计算节点可以获得更好的性能。举例来说，如果数据在HDFS中，请在同一个HDFS集群中安装Spark。Spark会在距离数据尽可能近的位置处理这些数据。例如，它首先会尝试在数据所在计算机上执行任务。如果该计算机无法执行任务，随后会尝试使用同一机机柜的其他计算机。如果依然不可行，最后才会选择使用任意一台计算机。请尽量将磁盘和网络I/O降至最低。
```
* Spark会取代Hadoop吗？为什么？

```
不会。今天的Hadoop代表了多个产品组成的生态系统，Spark也是这个生态系统的成员。就算最核心的Hadoop也包含三个组件：一个集群管理器，一个分布式计算框架，以及一个分布式文件系统。其中集群管理器是YARN，计算框架是MapReduce，分布式文件系统是HDFS。Spark是Hadoop MapReduce组件的继任者。

很多人在使用Spark作业取代原有的MapReduce作业，或在Spark中编写新的作业。因此可以说Spark会取代MapReduce，但无法取代Hadoop。

另外有个重要的事情需要注意，Spark可以配合Hadoop使用，但也可以在不具备Hadoop的情况下使用。例如，可以使用Mesos或独立集群管理器替代YARN，同理也可以使用S3或其他数据源代替HDFS。因此使用Spark并非必须要同时使用Hadoop。
```
* 为什么有人使用Spark代替MapReduce？

```
相比MapReduce，Spark可以提供更多优势。

首先，Spark比MapReduce速度快很多。取决于具体应用，可能会比MapReduce快100倍。Spark如此之快的一个原因在于其先进的作业执行引擎。Spark作业可以划分为任意数量的阶段（Stage），而MapReduce作业只能分为两个阶段。另外Spark可以让应用程序将数据缓存在内存中。缓存机制可极大改进应用程序性能。磁盘I/O会大幅影响数据处理应用程序的执行速度，Spark则能将磁盘I/O降至最低。

其次，Spark很易用。Spark提供了丰富的API和超过80种操作，MapReduce只能提供两种操作：Map和Reduce。Spark API可以通过Scala、Python、Java和R四种语言使用。相比在MapReduce中编写的作业，相同数据处理作业使用Scala/Spark编写时代码量可以减少5-10倍。因此Spark也能大幅提高开发者的生产力。

第三，Spark针对不同类型的数据处理任务提供了统一的工具。该产品内置了用于批处理、交互式分析、机器学习、流处理，以及图表分析的集成库，用户不再需要学习多种工具。也不需要将代码和数据复制到多个位置。另外从运营的角度来说，一个集群的管理，无疑要比针对不同类型作业创建多个专用集群管理起来更简单。
```
* 如何解决数据倾斜问题？

* Spark Streaming和Storm有何区别？ 

一个实时毫秒一个准实时亚秒，不过storm的吞吐率比较低。

* mllib支持的算法？ 

大体分为四大类，分类、聚类、回归、协同过滤。



### 案例


* 给定a、b两个文件，各存放50亿个url，每个url各占64字节，内存限制是4G，让你找出a、b文件共同的url?

```
每个url大小为64 bytes，那么可以估计每个文件的大小为50G×64=320G，远远大于内存限制的4G，所以不可能将其完全加载到内存中处理，可以采用分治的思想来解决。

　　Step1：遍历文件a，对每个url求取hash(url)%1000，然后根据所取得的值将url分别存储到1000个小文件(记为a0,a1,...,a999，每个小文件约300M);

　　Step2:遍历文件b，采取和a相同的方式将url分别存储到1000个小文件(记为b0,b1,...,b999);

　　巧妙之处：这样处理后，所有可能相同的url都被保存在对应的小文件(a0vsb0,a1vsb1,...,a999vsb999)中，不对应的小文件不可能有相同的url。然后我们只要求出这个1000对小文件中相同的url即可。

　　Step3：求每对小文件ai和bi中相同的url时，可以把ai的url存储到hash_set/hash_map中。然后遍历bi的每个url，看其是否在刚才构建的hash_set中，如果是，那么就是共同的url，存到文件里面就可以了。
```

* 有一个1G大小的一个文件，里面每一行是一个词，词的大小不超过16字节，内存限制大小是1M，要求返回频数最高的100个词。

```
Step1：顺序读文件中，对于每个词x，取hash(x)%5000，然后按照该值存到5000个小文件(记为f0,f1,...,f4999)中，这样每个文件大概是200k左右，如果其中的有的文件超过了1M大小，还可以按照类似的方法继续往下分，直到分解得到的小文件的大小都不超过1M;

Step2：对每个小文件，统计每个文件中出现的词以及相应的频率(可以采用trie树/hash_map等)，并取出出现频率最大的100个词(可以用含100个结点的最小堆)，并把100词及相应的频率存入文件，这样又得到了5000个文件;

Step3：把这5000个文件进行归并(类似与归并排序);
```

* 现有海量日志数据保存在一个超级大的文件中，该文件无法直接读入内存，要求从中提取某天出访问百度次数最多的那个IP

```
问题解法同上，算法思想：分而治之+Hash

1)IP地址最多有2^32=4G种取值情况，所以不能完全加载到内存中处理;

2)可以考虑采用“分而治之”的思想，按照IP地址的Hash(IP)%1024值，把海量IP日志分别存储到1024个小文件中。这样，每个小文件最多包含4MB个IP地址;

3)对于每一个小文件，可以构建一个IP为key，出现次数为value的Hashmap，同时记录当前出现次数最多的那个IP地址;

4)可以得到1024个小文件中的出现次数最多的IP，再依据常规的排序算法得到总体上出现次数最多的IP;

```


#### 参考：

* https://github.com/devuser/spark-notes