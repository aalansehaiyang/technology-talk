## 命令行操作

---

* 通过客户端连接ZooKeeper的集群

```
/Users/onlyone/software/zookeeper/zookeeper-3.4.8/bin/zkCli.sh -server 192.168.0.14:2181
```

* help 打印命令行帮助

```
[zk: 192.168.0.24:2181(CONNECTED) 0] help
ZooKeeper -server host:port cmd args
	stat path [watch]
	set path data [version]
	ls path [watch]
	delquota [-n|-b] path
	ls2 path [watch]
	setAcl path acl
	setquota -n|-b val path
	history 
	redo cmdno
	printwatches on|off
	delete path [version]
	sync path
	listquota path
	rmr path
	get path [watch]
	create [-s] [-e] path data acl
	addauth scheme auth
	quit 
	getAcl path
	close 
	connect host:port
[zk: 192.168.0.24:2181(CONNECTED) 1] 
```

* 创建一个节点

```
create /node 'node value'
```

* ls，查看/目录内容

```
[zk: 192.168.0.24:2181(CONNECTED) 3] ls /
[node, zookeeper]
```


* 查看/node节点的数据信息

```
[zk: 192.168.0.24:2181(CONNECTED) 4] get /node
node value
cZxid = 0x100000002
ctime = Wed Oct 25 09:22:10 CST 2017
mZxid = 0x100000002
mtime = Wed Oct 25 09:22:10 CST 2017
pZxid = 0x100000002
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 10
numChildren = 0
[zk: 192.168.0.24:2181(CONNECTED) 5] 
```

* 修改/node节点的数据

```
[zk: 192.168.0.24:2181(CONNECTED) 23] set /node 'new value 1'
cZxid = 0x100000002
ctime = Wed Oct 25 09:22:10 CST 2017
mZxid = 0x100000003
mtime = Wed Oct 25 09:26:50 CST 2017
pZxid = 0x100000002
cversion = 0
dataVersion = 1
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 11
numChildren = 0
[zk: 192.168.0.24:2181(CONNECTED) 24] 
```


* 删除 /node 节点

```
[zk: 192.168.0.24:2181(CONNECTED) 25] delete /node
[zk: 192.168.0.24:2181(CONNECTED) 26] 
```

* quit,退出客户端连接

```
[zk: 192.168.0.24:2181(CONNECTED) 28] quit
Quitting...
2017-10-25 09:29:12,234 [myid:] - INFO  [main:ZooKeeper@684] - Session: 0x15f51069cb20000 closed
2017-10-25 09:29:12,237 [myid:] - INFO  [main-EventThread:ClientCnxn$EventThread@519] - EventThread shut down for session: 0x15f51069cb20000
➜  bin 
```