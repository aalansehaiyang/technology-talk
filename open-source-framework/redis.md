## redis缓存

---

### 附录

*	[安装、主从复制](redis-master-slave.md)
*	[redis缓存与memcache的区别](redis缓存与memcache的区别.md)
*	[redis原生命令api](http://www.runoob.com/redis/redis-sorted-sets.html)
*	[redis 命令参考](http://doc.redisfans.com/index.html)
*	[Redis 教程](http://www.runoob.com/redis/redis-pub-sub.html)
* redis cluster
	* [Redis 集群教程](http://www.redis.cn/topics/cluster-tutorial.html)
	* [Redis Cluster集群搭建](https://www.cnblogs.com/lykxqhh/p/5690923.html)


客户端：

* Jedis
	* [github源码](https://github.com/xetorthio/jedis)
* Redic
	* Redis缓存客户端，支持读写分离和分片。
	* [源码](https://gitee.com/robertleepeak/redic)
* Codis
	* 在应用层和缓存服务器中间增加一个代理层，根据分片规则来路由请求。
	* [Codis集群的搭建与使用](http://www.cnblogs.com/xuanzhi201111/p/4425194.html)


资料收集：

* [redis为什么是单线程？](http://blog.csdn.net/world6/article/details/79381682)
* [Redis为什么这么快？一文深入了解Redis内存模型！](https://mp.weixin.qq.com/s/m-RdJQdG-qW-BLquorhMlQ)
* [3台机器轻松搭建一个高可用Redis服务架构](https://mp.weixin.qq.com/s/vxJCG0Nk4csbZ1axLy0bfQ)
* [Redis 内存为什么不宜过大](https://mp.weixin.qq.com/s/fpupqLp-wjR8fQvYSQhVLg)
* [史上最全Redis高可用技术解决方案大全](https://mp.weixin.qq.com/s/BoLsVKYyu8yRXZbxd1uuQw)

业务应用：

* [同程凤凰缓存系统基于Redis的设计与实践](https://mp.weixin.qq.com/s/2FEbkas_m1WnYUqjVpMkWw)
* [携程开源其Redis多数据中心解决方案XPipe](http://mp.weixin.qq.com/s/YhrJprLWjoZa2tU3qY8XZw)

前沿：

* [redis不同版本新特性](redis-new-feature.md)


---
redis采用C编写，redis服务器是核心业务采用单线程模式，无锁竞争且基于内存操作，执行效率非常高。

如果开启备份机制，会fork子线程来处理。

```
用的比较多的redis客户端jedis：
https://github.com/xetorthio/jedis
```

### 核心逻辑：

```
 protected Connection sendCommand(final Command cmd, final byte[]... args) {
	try {
		//建立连接，包装RedisOutputStream和RedisInputStream
	    connect();
	    //发送执行命令
	    Protocol.sendCommand(outputStream, cmd, args);
	    lastAccessTime = System.currentTimeMillis();
	    pipelinedCommands++;
	    return this;
	} catch (JedisConnectionException ex) {
		System.err.println(ex.getMessage());
	    // Any other exceptions related to connection?
	    broken = true;
	    throw ex;
	}
    }

```

Command内提供了多种redis操作命令。

```
 public static enum Command {
	PING, SET, GET, QUIT, EXISTS, DEL, TYPE, FLUSHDB, KEYS, RANDOMKEY, RENAME, RENAMENX, RENAMEX, DBSIZE, EXPIRE, EXPIREAT, TTL, SELECT, MOVE, FLUSHALL, GETSET, MGET, SETNX, SETEX, MSET, MSETNX, DECRBY, DECR, INCRBY, INCR, APPEND, SUBSTR, HSET, HGET, HSETNX, HMSET, HMGET, HINCRBY, HEXISTS, HDEL, HLEN, HKEYS, HVALS, HGETALL, RPUSH, LPUSH, LLEN, LRANGE, LTRIM, LINDEX, LSET, LREM, LPOP, RPOP, RPOPLPUSH, SADD, SMEMBERS, SREM, SPOP, SMOVE, SCARD, SISMEMBER, SINTER, SINTERSTORE, SUNION, SUNIONSTORE, SDIFF, SDIFFSTORE, SRANDMEMBER, ZADD, ZRANGE, ZREM, ZINCRBY, ZRANK, ZREVRANK, ZREVRANGE, ZCARD, ZSCORE, MULTI, DISCARD, EXEC, WATCH, UNWATCH, SORT, BLPOP, BRPOP, AUTH, SUBSCRIBE, PUBLISH, UNSUBSCRIBE, PSUBSCRIBE, PUNSUBSCRIBE, PUBSUB, ZCOUNT, ZRANGEBYSCORE, ZREVRANGEBYSCORE, ZREMRANGEBYRANK, ZREMRANGEBYSCORE, ZUNIONSTORE, ZINTERSTORE, ZLEXCOUNT, ZRANGEBYLEX, ZREMRANGEBYLEX, SAVE, BGSAVE, BGREWRITEAOF, LASTSAVE, SHUTDOWN, INFO, MONITOR, SLAVEOF, CONFIG, STRLEN, SYNC, LPUSHX, PERSIST, RPUSHX, ECHO, LINSERT, DEBUG, BRPOPLPUSH, SETBIT, GETBIT, BITPOS, SETRANGE, GETRANGE, EVAL, EVALSHA, SCRIPT, SLOWLOG, OBJECT, BITCOUNT, BITOP, SENTINEL, DUMP, RESTORE, PEXPIRE, PEXPIREAT, PTTL, INCRBYFLOAT, PSETEX, CLIENT, TIME, MIGRATE, HINCRBYFLOAT, SCAN, HSCAN, SSCAN, ZSCAN, WAIT, CLUSTER, ASKING, PFADD, PFCOUNT, PFMERGE;
```


```
 public String set(final String key, final String value, final String nxxx,
	    final String expx, final long time) {
	checkIsInMulti();
	client.set(key, value, nxxx, expx, time);
	//返回结果
	return client.getStatusCodeReply();
    }
```


### 不同类型长度限制：

* string 最大512M
* List 最大长度 （2的32次方-1）,有序可重复
* Sets 最大长度 （2的32次方-1），不允许重复，自动去重
* Sorted sets，同上，支持按score排序
* Hashes kv对数（2的32次方-1）

### 内部方法详解：

#### 1.String

* 	String setBin(String key, byte[] value) 

 	按字节数组关联到key下
 	
*	byte[] getBin(String key) 

	根据key查找对应下的字节数组
	
* 	 String set(String key, String value)  

	将字符串值value关联到key
	
*	 String get(String key)

	返回key所关联的字符串值,如果key不存在则返回null

*	long setnx(String key, String value)

	将字符串值value关联到key，如果key已存在则不做任何改变。返回1表示key不存在，第一次设置；返回0表示key已经存在
	
*	String setex(String key, int seconds, String value)

	将值value关联到key，并将key的生命周期设为seconds(以秒为单位)。如果key 已经存在，SETEX命令将覆写旧值。 

*	long append(String key, String value)

	如果key已经存在并且是一个字符串，APPEND命令将value追加到key原来的值之后<BR>
    如果key不存在，APPEND就简单地将给定key设为value，同 SET key value

*	long strlen(String key) throws RedisException;

	获取key所对应的value字符串长度
	
*	long incr(String key) 

	将key中储存的数字值加1,如果key不存在,以0为key的初始值,然后执行INCR操作。线程安全
	
*	long incrBy(String key, long n)

	将key中储存的数字值加n,如果key不存在,以0为key的初始值,然后执行INCRBY操作
	
*	long decr(String key)

	将key中储存的数字值减1,如果key不存在,以0为key的初始值,然后执行DECR操作。
	
*	long decrBy(String key, long n)

	将key中储存的数字值减n,如果key不存在,以0为key的初始值,然后执行DECRBY操		
*	String getSet(String key, String value) 

	设置key为当前值，并返回旧的值
*   String set(String key, String value, String nxxx, String expx, long time) throws RedisException;

```
将字符串值value关联到key:
nxxx：必须是NX或者XX，NX表示不存在则设置否则不做操作；XX表示存在才设置否则不做操作
expx：过期时间单位必须是EX或PX，EX表示单位是“秒”，PX表示单位是“毫秒”
time：过期时间，前一个参数是"EX"的话单位为“秒”，是"PX"的话单位为“毫秒”

@return 操作成功的话返回字符串OK，否则返回null

ps：从Redis 2.6.12 版本开始支持

```


### 2.List

Redis lists基于Linked Lists实现。这意味着即使在一个list中有数百万个元素，在头部或尾部添加一个元素的操作，其时间复杂度也是常数级别的。用LPUSH 命令在十个元素的list头部添加新元素，和在千万元素list头部添加新元素的速度相同

*	long lpush(String key, String value) 

	将值value插入到列表key的表头。 如果key不存在，一个空列表会被创建并执行LPUSH操作
	
*	long lpushBin(String key, byte[] value)
	
	同上
	
*	long rpush(String key, String value) 

	将值value插入到列表key的表尾。 如果key不存在，一个空列表会被创建并执行RPUSH操作
	
*	long rpushBin(String key, byte[] value) 

	同上
	
*	String lpop(String key)

	移除并返回列表key的头元素
	
*	byte[] lpopBin(String key)

	同上
	
*	String rpop(String key)

	移除并返回列表key的尾元素
	
*	byte[] rpopBin(String key)

	同上
	
*	long llen(String key) 

	计算列表长度
	
*	List<String> lrange(String key, long start, long end) 

	返回列表key中指定区间内的元素，[start,end]，区间为0开始
	
*	String ltrim(String key, int start, int end)

	列表只保留指定区间内的元素，不在指定区间之内的元素都将被删除
	
*	long lrem(final String key, final long count, final String value)

 	根据参数count的值，移除列表中与参数value相等的元素<BR>
    count的值可以是以下几种：<BR>
    count > 0: 从表头开始向表尾搜索，移除与value相等的元素，数量为count <BR>
    count < 0: 从表尾开始向表头搜索，移除与value相等的元素，数量为count的绝对值 <BR>
    count = 0: 移除表中所有与value相等的值 <BR>


#### 3.Set

*	long sadd(String key, String member)

	将member单个元素加入到集合key当中
	
*	long sadd(String key, String... members)

	将members元素数组加入到集合key当中
	
*	long srem(String key, String member)

	移除集合中的member元素
	
*	long scard(String key)

	集合中元素的数量
	
*	Set<String> smembers(String key)

	返回set中的所有元素
	

#### 4.sorted set

*	long zadd(String key, double score, String member)

	将member元素及其score值加入到有序集key当中
	
*	double zincrby(String key, double score, String member)

	对member元素增加score值
	
*	long zrem(String key, String member)

	移除有序集合key中的成员member，如果member不是有序集中的成员，不做任何操作
	
*	long zremrangeByScore(String key, double start, double end)

	删除的有序集合保存在key的最小值和最大值(含)之间的分数的所有元素
	
*	long zcard(String key)

	集合长度
	
*	long zcount(String key, double min, double max)

	有序集key中，score值在min和max之间的成员数量

*	double zscore(String key, String member)

	有序集key中，成员member的score值
	
*	long zrank(String key, String member)

	返回有序集key中成员member的排名。其中有序集成员按score值递增(从小到大)顺序排列<BR>
    排名以0为底，也就是说，score值最小的成员排名为0

	
*	Set\<String> zrange(String key, int start, int end)

	返回索引区间之间的元素，最小元素索引号为0，[start,end]
	
*	Set\<String> zrangeByScore(String key, double min, double max)

	返回分数之间的元素,[min,max]
	
*	Set\<String> zrangeByScore(String key, double min, double max, int offset, int count)

	分数由小到大的顺序，取[min,max]之间的数据，offset表示取数据的开始位置（O：表示最小分数的那个位置），最多返回count个结果

	
*	long zrevrank(String key, String member) 

	返回有序集key中成员member的排名。其中有序集成员按score值递减(从大到小)排序<BR>
    排名以0为底，也就是说，score值最大的成员排名为0

*	Set\<String> zrevrange(String key, int start, int end)

	返回索引区间之间的元素，最大元素索引号为0,[start,end]

*  Set\<Tuple> zrevrangeByScoreWithScores(String key, double max,
                                          double min, int offset, int count)
   
   分数按大到小的顺序，取[min,max]之间的数据，offset表示取数据的开始位置（O：表示最大分数的那个位置），最多返回count个结果，Tuple包含分数、value值等信息。                       
                                   
                                                                

#### 5.Hash

*	long hset(String key, String field, String value)

	 将哈希表key中的域field的值设为value,如果key不存在，一个新的哈希表被创建并进行HSET操作。
	 
*	long hsetBin(String key, String field, byte[] value)

	同上
	
*	long hsetnx(String key, String field, String value)

	将哈希表key中的域field的值设为value，如果key已经存在，不做任何处理
	
*	String hmset(String key, Map<String, String> hash)

	同时将多个field - value(域-值)对设置到哈希表key中
	
*	String hget(String key, String field)

	返回哈希表key中给定域field的值
	
*	byte[] hgetBin(String key, String field) 

	同上
	
*	Map<String, String> hgetAll(String key)

	返回哈希表key中，所有的域和值
	
*	List<String> hmget(String key, String... fields)

	返回哈希表key中，一个或多个给定域的值，一一对应的<BR>
    如果给定的域不存在于哈希表，那么返回一个null.
    
*	long hlen(String key)

	返回Hash表中的元素个数
	
*	Set<String> hkeys(String key)

	返回Hash表中的keys
	
*	List<String> hvals(String key)

	返回Hash表中的values
	
*	boolean hexists(String key, String field) 

	哈希表key中，给定域field是否存在
	
*	long hdel(String key, String field)

	删除哈希表key中的一个指定域
	
*	long hincrBy(String key, String field, long value)

	对哈希中的某个key对应的值增加计数，线程安全。<br>
	如果field不存在，初始值为0<br>

### lua 脚本

如果一次业务请求需要执行多条命令，可以借助lua脚本批量提交执行

```
// key：缓存键值； seconds：过期时间
public static String luaScript(String key, long seconds) {
	return "local currIncr = redis.call('INCR', '" + key + "') "
			+ "if tonumber(currIncr) == 1 "
			+ "then "
			+ "redis.call('EXPIRE', '" + key + "', " + seconds + ") "
			+ "end "
			+ "return currIncr";
}

//寻找目标节点
Node target = redisClient.getNodeByKey(key);

//执行lua脚本命令
Long count = (Long) redisClient.eval(target, luaScript方法返回的字符串命令);
```
	
### 参考资料

 
http://zhangtielei.com/posts/server.html

https://www.zhihu.com/question/19764056

http://www.redis.cn/

http://ifeve.com/category/redis/
