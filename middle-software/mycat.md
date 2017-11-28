## mycat
---

`Mycat是java编写的！！！`

### 一、问题

* 目前有哪些好的开源分布式数据框架？
* 引入成本如何？
* 是否支持分布式事务？
* 是否支持动态修改配置项？
* 集群性能如何?
* 社区是否活跃？内部源码？
* mycat如何搭建读写分离？
* mycat如何做到主从切换？
* 支持哪些分片算法？
* 查询多张分表，支持结果集合并，如果涉及翻页或排序，需要对合并后的结果做二次加工处理。



### 二、数据相关

分布式数据库特性：

* 透明性。用户不需要了解内部结构，表现就象一个传统的单处理机系统。
* 扩展性。通过横向扩展使集群的整体性能提升。
* 可靠性。不允许单点，如果一台机器坏了，则其他机器能接替它进行工作。

数据分片：

* 水平切分。按分表键，将表的行数据拆分到多个节点库中。逻辑上单表，物理上多表。
* 垂直切分。一个数据库由很多表组成，每个表对应不同的业务。垂直切分，将表进行分类分布到不同的节点上。类似电商按商品线、交易线、会员线、店铺线等拆分到不同的DB。

技术点：

* 支持多数据源
* 主库、备库切换
* 分库
* 分表
* 支持千亿级别大表
* 事务、分布式事务
* 读写分离
* 数据合并
* 在线扩容
* 数据迁移
* 系统监控

### 三、Mycat核心组件及配置


#### 核心组件

* 逻辑库（Schema）

数据库中间件被当成作一个或多个数据库集群构成的逻辑库。

* 逻辑表（table）

逻辑表可以分布在一个或多个分片库中，也可以不分片。

```
 <table name="t_user" dataNode="dn1,dn2" rule="sharding-by-mod2"/>
```
t_user分片表，数据按照规则被切分到dn1、dn2两个节点。

```
 <table name="t_node" primaryKey="id" autoIncrement="true" dataNode="dn1" />
```
t_node表，非分片表，只存在于节点dn1。

`primaryKey：逻辑表对应真实表的主键。对于分片规则使用非主键进行分表，如果使用主键查询会，会扫描所有分表，配置了该属性，mycat会缓存主键与dn的信息，避免所有表扫描，提升性能。但如果缓存没有命中，还是会把SQL发给所有的dn执行来获取数据。`

* 分片节点（dataNode）

```
 <dataNode name="dn1" dataHost="localhost1" database="mycat_node1"/>
 <dataNode name="dn2" dataHost="localhost1" database="mycat_node2"/>
```
一个大表被分到不同的分片数据库上，每个表分片所在的数据库就是分片节点

* 节点主机（dataHost）

```
<dataHost name="localhost1" writeType="0" switchType="1" slaveThreshold="100" balance="1" dbType="mysql" maxCon="10" minCon="1" dbDriver="native">
    <heartbeat>show status like 'wsrep%'</heartbeat>
    <writeHost host="hostM1" url="127.0.0.1:3306" user="root" password="root" >
    </writeHost>  
</dataHost>
```
同一台机器上可以有多个分片数据库。为了避免单节点主机并发数量的限制，尽量将读写压力高的分片节点均匀地放在不同的节点主机上。

`上面只列了几个核心参数，更多参数详细说明可参考《基于mycat中间件P22》`

#### 配置文件：

* server.xml

主要是配置系统信息，有两个重要标签 user、system

* schema.xml

主要是逻辑库、逻辑表、分片规则 、分片节点、数据源

* sequence

在分库分表的情况下，数据库的自增主键无法保证在集群中是全局唯一的主键，因此mycat提供了全局的sequence，并支持本地配置、数据库配置等多种实现方式。

* rule.xml 

分片规则的配置文件，分片规则的具体一些参数信息单独存放为文件，也在这个目录下，配置文件修改需要重启MyCAT。

* log4j.xml

日志存放在logs/log中，每天一个文件，日志的配置是在conf/log4j.xml中，根据自己的需要可以调整输出级别为debug，debug级别下，会输出更多的信息，方便排查问题。

autopartition-long.txt,partition-hash-int.txt,sequence_conf.properties， sequence_db_conf.properties 分片相关的id分片规则配置文件

* lib

MyCAT自身的jar包或依赖的jar包的存放目录。

* logs    

MyCAT日志的存放目录。日志存放在logs/log中，每天一个文件

#### 分片规则 

* 取模分片（常用的方式）

对分表键id按总的分表数求模计算，比如模为0，放在第1张表，模为1，放在第2张表。

* 枚举分片

配置文件中配置可能的枚举id，指定数据分布到不同的物理节点上。本规则适用于按省份或县区来拆分数据。

* 范围分片

按分片字段的某个范围放入对应分片。比如0~1kw，放在第1张表，1kw~2kw，放在第2张表

* 范围求模算法

范围分片+取模分片的组合。先根据id找到对应的分片组，分片组内使用求模可以保证组内的数据分布比较均匀。事先规定好分片的数量，数据扩容时按分片组扩容，原有的分片组的数据不需要迁移。由于分片组的数据分布比较均匀，所以分片组内可以避免热点数据问题。
0~1kw=5 //表示该组有5个分片节点

* 固定分片hash算法

* 取模范围算法

* 字符串hash求模范围算法

与取模算法类似，该算法支持数字、符号、字母取模。截取长度为prefixLength的子串，再对子串中每个字符的ascii码求和得出sum，然后对sum进行求模运算。

* 一致性hash算法

有效解决分布式数据的扩容问题。`每个真实的数据库节点会被映射为N倍虚拟节点，默认是160倍`

* 按日期（天）分片

从开始时间算起，每隔sPartionDay天，对应一个数据分区。

* 按月单小时算法
* 自然月分片算法
* 日期范围hash算法

先根据日期的范围分组，再根据时间hash分到每组下对应的分片。



### 四、mycat优势

* 对Cobar代码进行了重构，使用NIO重构了网络模块，并优化了Buffer内核，增强了聚合、join等基本特性
* 支持绝大部分数据库，如oracle、mysql、sqlserver、db2、MongoDB 等，成为通用数据库中间件
* 支持透明的读写分离机制，减轻写库压力，提高数据库的并发查询能力
* 大表水平分片方式支持100亿级的数据存储
* 内建数据库集群故障切换机制，实现了自动切换
* 提供reload命令，例如更新了schema.xml文件后，不用重启即可进行配置文件更新。



### 五、源码分析

mycat前身Amoeba、Cobar。

[github 源码](https://github.com/MyCATApache/Mycat-Server)

Mycat核心是拦截用户发过来SQL语句，做一些分析，例如SQL解析、分片分析、路由分析、读写分离分析、缓存分析等，然后将SQL语句发往后端的真实数据库，并将返回的结果做适当处理，最终返回给用户。

**架构剖析**

* NIO架构

NIOAcceptor负责处理Accept事件，服务端接收客户端的连接事件，NIOAcceptor调用NIOReactor.postRegister进行注册

|事件名|对应值|
|----|----|
|服务端接收客户端连接事件|Selection.OP_ACCEPT|
|客户端连接服务端事件|Selection.OP_CONNECT|
|读事件|Selection.OP_READ|
|写事件|Selection.OP_WRITE|

* 多线程架构

维护一个线程池 NameableExecutor，继承自ThreadPoolExecutor。mycat内部有两大线程池：timerExectuor和businessExecutor。

```
timerExectuor：
定时更新任务、处理器定时检查任务，数据节点定时心跳检测，主要是后勤工作。

businessExecutor:
处理业务请求，比如执行SQL语句，SQL拦截，数据合并，查询结果
```
* 内存管理及缓存架构

缓冲区采用java.io.ByteBuffer，缓冲区分为直接缓冲区（操作系统内存）和非直接缓冲区（JVM内存）。


* 连接池

* 分布式事务

* sql路由实现

* 跨库join实现

* 数据汇聚、数据排序


### 六、Mycat安装

如何安装？

[https://github.com/MyCATApache/Mycat-Server](https://github.com/MyCATApache/Mycat-Server)

`下载文件直接解压。执行./mycat start 启动`

```
./mycat start 启动
./mycat stop 停止
./mycat console 前台运行
./mycat restart 重启服务
./mycat pause 暂停
./mycat status 查看启动状态
```

### 七、Mycat实战

* [入门指南、开发指南、生产部署、设计文档](https://github.com/MyCATApache/Mycat-doc)

#### 1.搭建读写分离

主数据提供写操作，从数据库提供读操作，有效减轻单台数据库的压力，主数据库进行写操作后，数据及时同步到所读的数据库，尽可能保证两边数据一致。

```
主（M1）<----> 备(M2)
|
|
从(S1)
```

* balance为0。不开启读写分离，所有的读全发送到M1
* balance为1。所有的读发送到S1和M2
* balance为2。所有的读发送到M1、M2和S1
* balance为3。所有的读发送到S1


#### 2.搭建主备切换

#### 3.mycat+percona+haproxy+keepalived

#### 4.mha+keepalived
