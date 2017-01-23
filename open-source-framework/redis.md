## redis缓存

---

###目录：

*	[redis缓存与memcache的区别](redis缓存与memcache的区别.md)
*	[redis原生命令api](http://www.runoob.com/redis/redis-sorted-sets.html)


---

```
用的比较多的redis客户端jedis：
https://github.com/xetorthio/jedis
```

####核心逻辑：

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


####不同类型长度限制：

* string 最大512M
* List 最大长度 （2的32次方-1）,有序可重复
* Sets 最大长度 （2的32次方-1），不允许重复，自动去重
* Sorted sets，同上，支持按score排序
* Hashes kv对数（2的32次方-1）

#### 内部方法详解：

###### 1.String

* 	String setBin(String key, byte[] value) 

 	按字节数组关联到key下
 	
*	byte[] getBin(String key) 

	根据key查找对应下的字节数组
	
* 	 String set(String key, String value)  

	将字符串值value关联到key
	
*	 String get(String key)

	返回key所关联的字符串值,如果key不存在则返回null

*	long setnx(String key, String value)

	将字符串值value关联到key，如果key已存在则不做任何改变
	
*	String setex(String key, int seconds, String value)

	将值value关联到key，并将key的生命周期设为seconds(以秒为单位)。

*	long append(String key, String value)

	如果key已经存在并且是一个字符串，APPEND命令将value追加到key原来的值之后<BR>
    如果key不存在，APPEND就简单地将给定key设为value，同 SET key value

*	long incr(String key) 

	将key中储存的数字值加1,如果key不存在,以0为key的初始值,然后执行INCR操作。线程安全
	
*	long incrBy(String key, long n)

	将key中储存的数字值加n,如果key不存在,以0为key的初始值,然后执行INCRBY操作
	
*	long decr(String key)

	将key中储存的数字值减1,如果key不存在,以0为key的初始值,然后执行DECR操作。
	
*	long decrBy(String key, long n)

	将key中储存的数字值减n,如果key不存在,以0为key的初始值,然后执行DECRBY操		
*	String getSet(String key, String value) 

	设置新值，并返回旧的值

###### 2.List

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


###### 3.Set

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
	

###### 4.sorted set

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

	
*	Set<String> zrange(String key, int start, int end)

	返回索引区间之间的元素，最小元素索引号为0，[start,end]
	
*	Set<String> zrangeByScore(String key, double min, double max)

	返回分数之间的元素,[min,max]
	
*	long zrevrank(String key, String member) 

	返回有序集key中成员member的排名。其中有序集成员按score值递减(从大到小)排序<BR>
    排名以0为底，也就是说，score值最大的成员排名为0

*	Set<String> zrevrange(String key, int start, int end)

	返回索引区间之间的元素，最大元素索引号为0,[start,end]


###### 5.Hash

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

	
	
**参考资料：**

http://www.redis.cn/

http://ifeve.com/category/redis/