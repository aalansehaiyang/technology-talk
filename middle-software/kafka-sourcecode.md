## 笔记

---

### 核心概念

* 消息

	最基本的数据单元
	
* Topic、分区、Log

* 保留策略

	* 根据消息保留的时间，超过指定时间，就可以被删除
	* 根据Topic存储的数据大小
	
* Broker

* 副本

 	每个分区至少有一个副本，对消息进行了冗余备份，灾备
 

* ISR集合

	副本集合，表示的是目前“可用”且消息量与Leader相差不多的副本集合，这是整个副本集合的一个子集。

* Cluster、Controller

* 生产者
* 消费者
	
	从Topic中拉取消息，并对消息进行消费。某个消费者消费到Partition的哪个位置（offset）的相关信息，由Consumer自己维护的。
	
* Consumer Group	

	多个Consumer可以组成一个Group，保证其订阅的Topic的每个分区可以被分配给此Consumer Group中的一个消费者处理。
	
	


	