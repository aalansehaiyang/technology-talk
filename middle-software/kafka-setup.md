## 安装
---


1、首先安装 zookeeper
	
2、下载kafka

```
wget https://mirrors.cnnic.cn/apache/kafka/2.1.0/kafka_2.11-2.1.0.tgz
```	

解压：

tar zxf kafka_2.11-2.1.0.tgz

3、修改配置

```
cd kafka_2.11-2.1.0/config/
vim server.properties
```

kafka最为重要三个配置依次为：broker.id、log.dir、zookeeper.connect

参数详细说明：

https://blog.csdn.net/lizhitao/article/details/25667831 

	
4、启动

```
cd /Users/onlyone/software/kafka/kafka_2.11-2.1.0
bin/kafka-server-start.sh config/server.properties &
```

停止kafka

```
bin/kafka-server-stop.sh  
```

5、检测

```
➜  jps 
41505 QuorumPeerMain
66244 Jps
64472 Kafka
252 
```

* QuorumPeerMain为对应的zookeeper实例
* Kafka的进程ID为64472

6、测试

* 创建topic

```
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic test1

```
* 查看topic创建情况

```
bin/kafka-topics.sh --list --zookeeper localhost:2181
```

```
bin/kafka-topics.sh --describe --zookeeper localhost:2181
```

运行结果：

```
Topic:test1	PartitionCount:1	ReplicationFactor:1	Configs:
	Topic: test1	Partition: 0	Leader: 1	Replicas: 1	Isr: 1
```
参数解析：https://www.cnblogs.com/shengulong/p/9013282.html

* 启动生产端 producer，并发送消息

```
bin/kafka-console-producer.sh --broker-list 192.168.0.14:9092 --topic test1

注意：首次，topic不存在时，会自动创建

上面命令是在控制台输入要发送的消息，“回车”单条消息结束。

echo '{"name":"Steve", "title":"Captain America"}' | bin/kafka-console-producer.sh --broker-list 192.168.0.14:9092 --topic test1


将发送的消息放在执行命令中。

```

* 启动消费端 consumer，可以看到刚才发送的消息列表

```
bin/kafka-console-consumer.sh --bootstrap-server 192.168.0.14:9092 --topic test1 --from-beginning  
```


