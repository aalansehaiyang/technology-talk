##  Spark 安装、启动
---

#### 下载安装

下载地址：

http://spark.apache.org/

根据需要选择安装包，spark-2.1.1-bin-hadoop2.7.tgz

然后解压，并在 vi ~/.bash_profile配置环境变量

```
SPARK_HOME=/Users/onlyone/software/spark-2.1.1-bin-hadoop2.7
```

#### 启动

* 启动Master，Master会记录并分配系统资源。

并提供界面查看系统的运行情况 ： http://172.16.104.120:8080/

```
./sbin/start-master.sh
```

* 启动工作节点，它将会执行Spark作业

```
./bin/spark-class org.apache.spark.deploy.worker.Worker spark://onlyonedeMacBook-Pro.local:7077 & 
```
* 如果想停止所有的进程

```
 ./sbin/stop-all.sh  
```


#### 运行任务

将工程导出jar文件，并保存在$SPARK_HOME根目录下

终端执行下面命令，提交任务：

```
./bin/spark-submit --class com.data.spark.StudentAvgScore  --master spark://onlyonedeMacBook-Pro.local:7077 spark-core-1.0-SNAPSHOT.jar
```

运行结果：

```
//若干spark系统日志
。。。。。
zhangsan的平均分：85.5
lihua的平均分：85.0
xiaoming的平均分：93.0
wangwu的平均分：76.5
```