## zookeeper安装

---
ZooKeeper是Apache基金会的一个开源、分布式应用程序协调服务，是Google的Chubby一个开源的实现。它是一个为分布式应用提供一致性服务的软件，提供的功能包括：配置维护、域名服务、分布式同步、组服务等。它的目标就是封装好复杂易出错的关键服务，将简单易用的接口和性能高效、功能稳定的系统提供给用户。

### 一、集群模式（首选推荐，一般用于生产环境）

##### 1.下载
ZooKeeper安装包可以在其官网下载页面下载，下载地址如下，为加快下载速度可以选择中国境内的镜像，选择稳定版本zookeeper-3.4.8.tar.gz安装包。

http://zookeeper.apache.org/releases.html#download

##### 2.解压并配置环境变量

下载后把安装包方放在目录/Users/onlyone/software/zookeeper目录下，并解压

```
$cd /Users/onlyone/software/zookeeper
$tar -zxvf zookeeper-3.4.8.tar.gz

```
将ZooKeeper的bin路径加入到/Users/onlyone/.bash_profile中，设置如下内容（分发到各节点后，在各节点上做同样设置）：

```
export ZOOKEEPER_HOME=/Users/onlyone/software/zookeeper/zookeeper-3.4.8
export PATH=$PATH:$ZOOKEEPER_HOME/bin
```

设置完毕后使用如下命令使配置生效：

```
$source .bash_profile
```

##### 3.修改ZooKeeper的配置文件

在ZooKeeper的根目录下建立data和log目录用于存放工作数据和日志文件：

```
$mkdir /Users/onlyone/software/zookeeper/zookeeper-3.4.8/data/
$mkdir /Users/onlyone/software/zookeeper/zookeeper-3.4.8/log/
```
在ZooKeeper配置目录下默认情况下，不存在在zoo.cfg文件，需要复制一份，然后进行修改，命令如下：

```
$cd /Users/onlyone/software/zookeeper/zookeeper-3.4.8/conf/
$cp zoo_sample.cfg zoo.cfg
$sudo vi zoo.cfg
```
修改zoo.cfg配置文件内容（仅列出重要配置）：

```
//用于存放ZooKeeper的数据和日志
dataDir=/Users/onlyone/software/zookeeper/zookeeper-3.4.8/data
dataLogDir=/Users/onlyone/software/zookeeper/zookeeper-3.4.8/log
 
//外部客户端连接端口号，在Kafka中将使用该端口号
clientPort=2181
 
//ZooKeeper集群相关配置信息
server.1=ip1:2888:3888
server.2=ip2:2888:3888
server.3=ip3:2888:3888
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


### 二、单机模式

zk支持单机部署，只要启动一台zk机器，就可以提供正常服务

单机模式的部署步骤和集群模式的部署步骤基本一致，只是在zoo.cfg文件的配置上有些差异。

进入目录中的conf目录，有一个zoo_sample.cfg文件，将其重命名为zoo.cfg，然后打开，在最后添加

```
dataDir=/Users/onlyone/software/zookeeper/zookeeper-3.4.8/data
dataLogDir=/Users/onlyone/software/zookeeper/zookeeper-3.4.8/log
clientPort=2181
```

启动

```
/Users/onlyone/software/zookeeper/zookeeper-3.4.8/bin/zkServer.sh start 
```

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


### 三、伪集群模式（一般用于测试环境）

比如有一台物理机（10核16G内存），如果做为单机模式有点浪费，如果按照集群模式，需要借助硬件的虚拟化技术，把一台物理机转换成几台虚拟机。

伪集群，集群所有的机器都在一台机器上，但是还是以集群的特性对外提供服务。

创建环境目录

```
mkdir /Users/onlyone/software/zookeeper/zk-cluster/zk1
mkdir /Users/onlyone/software/zookeeper/zk-cluster/zk2
mkdir /Users/onlyone/software/zookeeper/zk-cluster/zk3


echo "1" > /Users/onlyone/software/zookeeper/zk-cluster/zk1/data/myid
echo "2" > /Users/onlyone/software/zookeeper/zk-cluster/zk2/data/myid
echo "3" > /Users/onlyone/software/zookeeper/zk-cluster/zk3/data/myid

```
分别修改配置文件

修改：dataDir、dataLogDir、clientPort

增加：集群的实例，server.X，”X”表示每个目录中的myid的值

```
vi /Users/onlyone/software/zookeeper/zk-cluster/zk1/conf/zoo.cfg

tickTime=2000
initLimit=10
syncLimit=5
dataDir=/Users/onlyone/software/zookeeper/zk-cluster/zk1/data
dataLogDir=/Users/onlyone/software/zookeeper/zk-cluster/zk1/log
clientPort=2181
server.1=192.168.0.14:2888:3888
server.2=192.168.0.14:2889:3889
server.3=192.168.0.14:2890:3890


vi /Users/onlyone/software/zookeeper/zk-cluster/zk2/conf/zoo.cfg

tickTime=2000
initLimit=10
syncLimit=5
dataDir=/Users/onlyone/software/zookeeper/zk-cluster/zk2/data
dataLogDir=/Users/onlyone/software/zookeeper/zk-cluster/zk2/log
clientPort=2182
server.1=192.168.0.14:2888:3888
server.2=192.168.0.14:2889:3889
server.3=192.168.0.14:2890:3890

vi /Users/onlyone/software/zookeeper/zk-cluster/zk3/conf/zoo.cfg

tickTime=2000
initLimit=10
syncLimit=5
dataDir=/Users/onlyone/software/zookeeper/zk-cluster/zk3/data
dataLogDir=/Users/onlyone/software/zookeeper/zk-cluster/zk3/log
clientPort=2183
server.1=192.168.0.14:2888:3888
server.2=192.168.0.14:2889:3889
server.3=192.168.0.14:2890:3890
```
注意：本地启动，要注意更改ip


3个节点配置完成，然后启动集群

```
/Users/onlyone/software/zookeeper/zookeeper-3.4.8/bin/zkServer.sh start /Users/onlyone/software/zookeeper/zk-cluster/zk1/conf/zoo.cfg

/Users/onlyone/software/zookeeper/zookeeper-3.4.8/bin/zkServer.sh start /Users/onlyone/software/zookeeper/zk-cluster/zk2/conf/zoo.cfg

/Users/onlyone/software/zookeeper/zookeeper-3.4.8/bin/zkServer.sh start /Users/onlyone/software/zookeeper/zk-cluster/zk3/conf/zoo.cfg
```
查看节点状态

```
➜  bin /Users/onlyone/software/zookeeper/zookeeper-3.4.8/bin/zkServer.sh status /Users/onlyone/software/zookeeper/zk-cluster/zk1/conf/zoo.cfg
ZooKeeper JMX enabled by default
Using config: /Users/onlyone/software/zookeeper/zk-cluster/zk1/conf/zoo.cfg
Mode: follower
➜  bin /Users/onlyone/software/zookeeper/zookeeper-3.4.8/bin/zkServer.sh status /Users/onlyone/software/zookeeper/zk-cluster/zk2/conf/zoo.cfg
ZooKeeper JMX enabled by default
Using config: /Users/onlyone/software/zookeeper/zk-cluster/zk2/conf/zoo.cfg
Mode: leader
➜  bin /Users/onlyone/software/zookeeper/zookeeper-3.4.8/bin/zkServer.sh status /Users/onlyone/software/zookeeper/zk-cluster/zk3/conf/zoo.cfg
ZooKeeper JMX enabled by default
Using config: /Users/onlyone/software/zookeeper/zk-cluster/zk3/conf/zoo.cfg
Mode: follower 
```
可以看出zk2是leader，zk1和zk3是follower

