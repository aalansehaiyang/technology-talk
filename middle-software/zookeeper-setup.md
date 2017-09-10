## zookeeper安装

---
ZooKeeper是Apache基金会的一个开源、分布式应用程序协调服务，是Google的Chubby一个开源的实现。它是一个为分布式应用提供一致性服务的软件，提供的功能包括：配置维护、域名服务、分布式同步、组服务等。它的目标就是封装好复杂易出错的关键服务，将简单易用的接口和性能高效、功能稳定的系统提供给用户。

### 集群模式（推荐首选）

##### 1.下载
ZooKeeper安装包可以在其官网下载页面下载，下载地址如下，为加快下载速度可以选择中国境内的镜像，选择稳定版本zookeeper-3.4.8.tar.gz安装包。

http://zookeeper.apache.org/releases.html#download

##### 2.解压并配置环境变量

下载后把安装包方放在目录/home/spark/work目录下，用下面命令解压缩ZooKeeper安装包，并把解压后的目录移动到/app/soft目录下：

```
$cd /home/spark/work/
$tar -zxf zookeeper-3.4.8.tar.gz
$mv zookeeper-3.4.8 /app/soft
$ll /app/soft
```
为了方便运行zkServer.sh脚本，在集群中的节点中，需要将ZooKeeper的bin路径加入到/etc/profile中，设置如下内容（分发到各节点后，在各节点上做同样设置）：

```
export ZOOKEEPER_HOME=/app/soft/zookeeper-3.4.8
export PATH=$PATH:$ZOOKEEPER_HOME/bin
```

设置完毕后使用如下命令使配置生效：

```
$source /etc/profile
```

##### 3.修改ZooKeeper的配置文件

在ZooKeeper的根目录下建立data和log目录用于存放工作数据和日志文件：

```
$mkdir /app/soft/zookeeper-3.4.8/data/
$mkdir /app/soft/zookeeper-3.4.8/log/
```
在ZooKeeper配置目录下默认情况下，不存在在zoo.cfg文件，需要复制一份，然后进行修改，命令如下：

```
$cd /app/soft/zookeeper-3.4.8/conf/
$cp zoo_sample.cfg zoo.cfg
$sudo vi zoo.cfg
```
修改zoo.cfg配置文件内容（仅列出重要配置）：

```
//用于存放ZooKeeper的数据和日志
dataDir=/app/soft/zookeeper-3.4.8/data
dataLogDir=/app/soft/zookeeper-3.4.8/log
 
//外部客户端连接端口号，在Kafka中将使用该端口号
clientPort=2181
 
//ZooKeeper集群相关配置信息
server.1=master:2888:3888
server.2=slave1:2888:3888
server.3=slave2:2888:3888
配置中server.A=B：C：D含义如下

* A为数字，表示这个是第几号服务器；
* B 表示该服务器的 ip 地址；
* C 表示该服务器与集群中的 Leader 服务器交换信息的端口；
* D 表示的是万一集群中的 Leader 服务器挂了，需要一个端口来重新进行选举，选出一个新的 Leader，而这个端口就是用来执行选举时服务器相互通信的端口。
如果是伪集群的配置方式，由于 B 都是一样，所以不同的 ZooKeeper 实例通信端口号不能一样，所以要给它们分配不同的端口号。
```

##### 4.分发ZooKeeper到各节点

使用scp命令到ZooKeeper分发到slave1和slave2节点上：

```
$cd /app/soft/
$scp -r zookeeper-3.4.8 spark@slave1:/app/soft
$scp -r zookeeper-3.4.8 spark@slave2:/app/soft
在dataDir目录下创建一个myid文件，然后分别在myid文件中按照zoo.cfg文件的server.A中A的数值，在不同机器上的该文件中填写相应的值，如master节点该值为1、slave1节点该值为2、slave2节点该值为3。

$cd /app/soft/zookeeper-3.4.8/data
$vi myid
```

##### 5.启动并验证

执行命令“zkServer.sh start”将会启动ZooKeeper。在此大家需要注意的是，不同节点上的ZooKeeper需要单独启动。

而执行命令“zkServer.sh stop”将会停止ZooKeeper。

使用命令“JPS”查看ZooKeeper是否成功启动，或执行命令“zkServer.sh status”查看ZooKeeper集群状态：

```
$zkServer.sh start
$zkServer.sh status
```
当第一个节点启动ZooKeeper时由于集群的其他节点未启动ZooKeeper，使用zkServer.sh status命令查看当前状态时会提示错误。但是随着后续节点的ZooKeeper的陆续启动，使用status查看状态时会显示当前节点的状态，本次master作为了follower。


### 单机模式

zk支持单机部署，只要启动一台zk机器，就可以提供正常服务

单机模式的部署步骤和集群模式的部署步骤基本一致，只是在zoo.cfg文件的配置上有些差异。

```
dataDir=/app/soft/zookeeper-3.4.8/data
dataLogDir=/app/soft/zookeeper-3.4.8/log
clientPort=2181
 
server.1=ip1:2888:3888
```

和集群模式唯区别就在机器列表上，只有server.1这一项。修改完这个文件后，就可以启动服务器了。

```
➜  zookeeper-3.4.8 telnet 127.0.0.1 2181                
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
stat
Zookeeper version: 3.4.8--1, built on 02/06/2016 03:18 GMT
Clients:
 /127.0.0.1:50446[0](queued=0,recved=1,sent=0)

Latency min/avg/max: 0/0/0
Received: 2
Sent: 1
Connections: 1
Outstanding: 0
Zxid: 0x0
Mode: standalone
Node count: 4
Connection closed by foreign host.

```

集群模式和单机模式下输出的服务器验证信息基本一致，只有Mode属性不一样。


### 伪集群模式

比如有一台物理机（10核16G内存），如果做为单机模式有点浪费，如果按照集群模式，需要借助硬件的虚拟化技术，把一台物理机转换成几台虚拟机。

伪集群，集群所有的机器都在一台机器上，但是还是以集群的特性对外提供服务。

```
dataDir=/app/soft/zookeeper-3.4.8/data
dataLogDir=/app/soft/zookeeper-3.4.8/log
clientPort=2181
 
server.1=ip1:2888:3888
server.2=ip1:2889:3889
server.3=ip1:2890:3890
```

ip地址相同，但后面的端口配置不一样。
