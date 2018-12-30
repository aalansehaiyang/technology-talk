## Redis安装及主从复制

---


### 一、安装

##### 下载安装包

https://redis.io/download

##### 解压

```
tar zxvf redis-4.0.2.tar.gz
```
##### 编译源程序

```
cd redis-4.0.2-6379
make 
```

##### 服务启动

```
cd src
./redis-server &
```

##### 查看一下启动的Redis实例

```
ps -ef|grep redis
```

##### 客户端shell

```
cd src
./redis-cli 
```

#### 配置参数(redis.conf)

```
   daemonize：如需要在后台运行，把该项的值改为yes

　　pdifile：把pid文件放在/var/run/redis.pid，可以配置到其他地址

　　bind：指定redis只接收来自该IP的请求，如果不设置，那么将处理所有请求，在生产环节中最好设置该项

　　port：监听端口，默认为6379

　　timeout：设置客户端连接时的超时时间，单位为秒

　　loglevel：等级分为4级，debug，revbose，notice和warning。生产环境下一般开启notice

　　logfile：配置log文件地址，默认使用标准输出，即打印在命令行终端的端口上

　　database：设置数据库的个数，默认使用的数据库是0

　　save：设置redis进行数据库镜像的频率

　　rdbcompression：在进行镜像备份时，是否进行压缩

　　dbfilename：镜像备份文件的文件名

　　dir：数据库镜像备份的文件放置的路径

　　slaveof：设置该数据库为其他数据库的从数据库

　　masterauth：当主数据库连接需要密码验证时，在这里设定

　　requirepass：设置客户端连接后进行任何其他指定前需要使用的密码

　　maxclients：限制同时连接的客户端数量

　　maxmemory：设置redis能够使用的最大内存

　　appendonly：开启appendonly模式后，redis会把每一次所接收到的写操作都追加到appendonly.aof文件中，当redis重新启动时，会从该文件恢复出之前的状态

　　appendfsync：设置appendonly.aof文件进行同步的频率

　　vm_enabled：是否开启虚拟内存支持

　　vm_swap_file：设置虚拟内存的交换文件的路径

　　vm_max_momery：设置开启虚拟内存后，redis将使用的最大物理内存的大小，默认为0

　　vm_page_size：设置虚拟内存页的大小

　　vm_pages：设置交换文件的总的page数量

　　vm_max_thrrads：设置vm IO同时使用的线程数量 

```


### 二、主从复制

* [主从复制原理](https://yq.aliyun.com/articles/79223?spm=5176.8091938.0.0.TKdCyN)

> 单机启动三个实例，一主两从。创建三个目录，分别是6379、6380、6381，创建conf、log、db三个目录，并拷贝redis.conf到对应的conf目录下


* （master）修改6379/conf 目录下的redis.conf 配置

```
daemonize yes　　　　　　　　　　　　　　　　　　　　 <== daemon进程运行
pidfile /Users/onlyone/software/redis/6379/redis.pid   <== 进程id存放文件
port 6379                                　　　　<== 端口
logfile /Users/onlyone/software/redis/6379/log/redis.log   　　　　<== 日志目录
dir /Users/onlyone/software/redis/6379/db/                 　　　　<== db目录
```

* （slave） 修改6380/conf 目录下的redis.conf 配置

```
daemonize yes　　　　　　　　　　　　　　　　　　　　 <== daemon进程运行
pidfile /Users/onlyone/software/redis/6380/redis.pid     <== 进程id存放文件
port 6380                               　　　　<== 端口
logfile /Users/onlyone/software/redis/6380/log/redis.log   　　　　<== 日志目录
dir /Users/onlyone/software/redis/6380/db/                 　　　　<== db目录
slaveof 127.0.0.1 6379      <== master机器
```

* （slave） 修改6381/conf 目录下的redis.conf 配置

```
daemonize yes　　　　　　　　　　　　　　　　　　　　 <== daemon进程运行
pidfile /Users/onlyone/software/redis/6381/redis.pid   <== 进程id存放文件
port 6381                               　　　　<== 端口
logfile /Users/onlyone/software/redis/6381/log/redis.log   　　　　<== 日志目录
dir /Users/onlyone/software/redis/6381/db/                 　　　　<== db目录
slaveof 127.0.0.1 6379      <== master机器
```



启动实例

```
./redis-server  /Users/onlyone/software/redis/6379/conf/redis.conf & 
./redis-server  /Users/onlyone/software/redis/6380/conf/redis.conf & 
./redis-server  /Users/onlyone/software/redis/6381/conf/redis.conf & 
```

查看进程信息

```
ps -ef|grep redis

501 32933     1   0 10:24上午 ??         0:00.25 ./redis-server 127.0.0.1:6380 
501 32986     1   0 10:27上午 ??         0:00.09 ./redis-server 127.0.0.1:6381 
501 32880 12633   0 10:22上午 ttys000    0:00.43 ./redis-server *:6379
```

查看master节点信息

```
./redis-cli -p 6379 "info"


。。。省略。。。
\# Replication
role:master
connected_slaves:2
slave0:ip=127.0.0.1,port=6380,state=online,offset=518,lag=1
slave1:ip=127.0.0.1,port=6381,state=online,offset=518,lag=1
master_replid:38605ae9c8d326685b9d114b31efffc405b54129
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:518
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:518
。。。省略。。。

```

查看slave（6380）节点信息

```
./redis-cli -p 6380 "info"


。。。省略。。。
\# Replication
role:slave
master_host:127.0.0.1
master_port:6379
master_link_status:up
master_last_io_seconds_ago:10
master_sync_in_progress:0
slave_repl_offset:658
slave_priority:100
slave_read_only:1
connected_slaves:0
master_replid:38605ae9c8d326685b9d114b31efffc405b54129
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:658
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:658
。。。省略。。。

```

主库写数据

```
➜  src ./redis-cli -p 6379
127.0.0.1:6379> set name tom
OK
127.0.0.1:6379> get name
"tom"
127.0.0.1:6379> 
```

查看从库同步数据

```
➜  src ./redis-cli -p 6380
127.0.0.1:6380> get name
"tom"
127.0.0.1:6380> 
```