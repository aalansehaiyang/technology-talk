## Hbase

---

附录：

[Hbase安装](http://blog.csdn.net/itomge/article/details/9970833)

-----

HBase是一个开源的非关系型分布式数据库（NoSQL），基于谷歌的BigTable建模，是一个高可靠性、高性能、高伸缩的分布式存储系统，使用HBase技术可在廉价PC Server上搭建起大规模结构化存储集群。

HBase最初是以Hadoop子项目的形式进行开发建设，底层依赖于HDFS组件作为其存储系统，直到2010年5月才正式成为Apache的顶级项目独立发展。

##### 传统关系型数据库的特征：

* 数据按行存储
* 没有索引的查询使用大量的I/O
* 建立索引和物化视图需要大量的资源

Hbase通过行键（Rowkey）检索数据，仅支持单行事务，单表可以有百亿行、百万列，数据矩阵横向和纵向两个维度所支持的数据量级都很有弹性。

#####  组成部分：

* 客户端client

客户端使用HBase的RPC机制与HMaster和RegionServer进行通信，客户端支持java接口、Thrift、Rest等多种形式

* 协调服务组件ZooKeeper

负责管理HBase中多个HMaster的选举、服务器之间状态同步

* 主节点HMaster

在HBase中可以启动多个HMaster，通过选举机制保证只有一个Master正常运行并提供服务。HMaster主要负责Tabel和Region的管理工作。

```
管理用户对Table的增、删、改、查操作
管理RegionServer的负载均衡，调整Region分布
在Region分裂后，负责新Region的分配
在RegionServer死机后，负责失效的RegionServer上的Region迁移
```

* Region节点HRegionServer

负责响应用户的I/O请求，向HDFS文件系统读写数据，是HBase最核心模块。内部管理了一系列HRegion对象，每个Region由多个Hstore组成，每个Hstore对应了Table中的一个列族的存储。可以看出每个列族其实就是一个存储单元，因为最好将共同I/O特性的列放在一个列族中，保证高效读写。

HStore由两部分组成，MemStore和StoreFile。用户写入的数据首先会放入MemStore，当满了后会缓冲成一个StoreFile。


##### 使用场景

* 存储大量的数据（PB级别）
* 写吞吐量大，瞬间写入量很大
* 优雅数据扩展，动态扩展整个存储系统容量
* 数据格式无限制，支持半结构化和非结构化的数据
* 业务场景简单，不需要全部的关系型数据库的特征，如交叉列、交叉表、事务、连接等

##### 操作

* Get

get（）方法默认一次取回该行全部列的数据，我们也可以限定只取回某个列族的列的数据，或者进一步限定只取回某些列的数据

* Put

如果RowKey是新的表示插入，否则表示更新

* Scan

与get方法类似，可以指定startRow参数来定义扫描读取HBase表的起始行键，同时可选stopRow参数来限定读取到何处停止。

* Delete

删除数据。与关系型数据库的delete操作不同，HBase的Delete操作可以指定删除某个列族或者某个列，或者指定某个时间戳，删除比这个时间早的数据。

##### RowKey的设计

HBase只能在RowKey上建立索引。非RowKey的访问，只能全表扫描。

RowKey是以字典顺序由小到大的排序。

RowKey尽量散列，可以保证数据都不在一个Region上，从而避免读写的压力集中在个别Region。

RowKey的长度尽量短。









	
	