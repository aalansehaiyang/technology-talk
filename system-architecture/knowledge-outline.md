## 技术大纲

---


### 系统架构

* 前端浏览器地址的一个 http 请求到后端整个流程 [link](outline/1.md)
* 哪些设计模式可以增加系统的可扩展性
* 如果AB两个系统互相依赖，如何解除依赖？
* 什么场景应该拆分系统，什么场景应该合并系统？
* 常用的设计模式，23种  [link](https://github.com/aalansehaiyang/technology-talk/blob/master/basic-knowledge/%E5%B8%B8%E7%94%A8%E7%9A%84%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F.md)
* 如何构建高可用系统？ [link](https://mp.weixin.qq.com/s/TuOMlzXRtDJSCgYGMPbpjw)
* 性能优化：使用单例、使用Future模式、使用线程池、选择就绪、减少上下文切换、减少锁粒度、数据压缩、结果缓存
* Nginx负载均衡 [link](https://github.com/aalansehaiyang/technology-talk/blob/master/web/load-balance.md)
* 一个系统如何优雅关闭。signal信号捕捉 [link](https://github.com/aalansehaiyang/technology-talk/blob/master/basic-knowledge/java.md)





### 分布式系列

* 如何设计一个高并发的分布式系统？你会引入哪些开源框架？
* 缓存
	* 搭建Redis缓存高可用集群
	* 高并发下如何正确优雅的使用缓存
	* 设计缓存要注意什么
	* 本地缓存用过哪些框架？Guava
	* 分布式缓存：缓存一致性、缓存命中率、缓存冗余
	* 缓存和数据库，如何实现一致性？[link](https://mp.weixin.qq.com/s/-Kvj8TPVvZE-rbtult_ozA?from=groupmessage&isappinstalled=0)
* 分布式数据库
	* 怎样打造一个分布式数据库？什么时候需要分布式数据库、mycat、otter、HBase
* 网关框架了解过哪些？能为后端服务带来哪些好处？
* 如何保证消息幂等  [link](https://www.jianshu.com/p/8b77d4583bab?utm_campaign)
* 如何实现分布式Session
* 如何保证消息的一致性
* CDN实现原理 


### 微服务

* zookeeper之服务注册与订阅
* 使用Docker部署微服务
* 微服务架构--分布式事务解决方案
* 微服务划分的粒度
* 微服务的高可用怎么保证的？
* 什么场景应该拆分系统，什么场景应该合并系统


### 锁相关

* 死锁定义；如何避免死锁 [link](https://blog.csdn.net/ls5718/article/details/51896159)
* 乐观锁，悲观锁，使用场景？ [link](https://github.com/aalansehaiyang/technology-talk/blob/master/system-architecture/%E9%94%81%E6%9C%BA%E5%88%B6.md)
* 设计一个分布式锁 [link](https://github.com/aalansehaiyang/technology-talk/blob/master/system-architecture/architecture-experience.md)
* 常见的锁有哪些？ [link](https://github.com/aalansehaiyang/Lock-Learning)
* java读写锁，读写锁设计主要解决什么问题？ [link](http://ifeve.com/read-write-locks/)
* synchronized和 ReentrantLock 的区别？ [link](https://www.cnblogs.com/fanguangdexiaoyuer/p/5313653.html) [link](outline/2.md)
* 不用synchronized和lock，实现线程安全的单例模式？[link](https://blog.csdn.net/w372426096/article/details/80938895) 



### 框架

* java
	* 基础
		* String、StringBuffer与StringBuilder的区别
		* try catch finally，try里面有return，finally还执行吗？
		* 泛型中K T V E   [link](http://nannan408.iteye.com/blog/1825182)
		* Thread 和 Runnable区别？
		* 关键字 volatile、transient、final [link](https://www.cnblogs.com/ccfdod/p/6392343.html)
		* Object 的 equals方法重写了，hashCode 方法必须重写 [link](https://blog.csdn.net/u013679744/article/details/57074669/) [link](https://github.com/Snailclimb/JavaGuide/blob/master/%E9%9D%A2%E8%AF%95%E5%BF%85%E5%A4%87/%E6%9C%80%E6%9C%80%E6%9C%80%E5%B8%B8%E8%A7%81%E7%9A%84Java%E9%9D%A2%E8%AF%95%E9%A2%98%E6%80%BB%E7%BB%93/%E7%AC%AC%E4%B8%80%E5%91%A8%EF%BC%882018-8-7%EF%BC%89.md)
	* 集合
		* ThreadLocal 内部原理？
		* HashMap，为什么线程不安全 [link](https://mp.weixin.qq.com/s/RtfEPR2oclUAu0tXnYAn4Q)	
		* HashMap 怎么解决碰撞问题？
		* Concurrenthashmap 是怎么做到线程安全的？
	* 线程
		* 线程有哪些状态？ blocked 和 wait 有什么区别? [link](https://blog.csdn.net/longly_me/article/details/61414268) [link](https://www.cnblogs.com/lcplcpjava/p/6896904.html)
		* sleep() 和 wait() 的区别 [link](https://blog.csdn.net/xyh269/article/details/52613507)
		* JDK 中有哪几个线程池？拒绝策略？ [link](https://github.com/aalansehaiyang/technology-talk/blob/master/basic-knowledge/concurrent-class.md) [link](https://mp.weixin.qq.com/s/5dexEENTqJWXN_17c6Lz6A)
		* 如何保证线程安全问题？
		* JUC 常用的类 [link](https://github.com/aalansehaiyang/technology-talk/blob/master/basic-knowledge/concurrent-class.md) [link](https://mp.weixin.qq.com/s/K8y6wMNDLwsmU7EFRx7Dsw)
	* IO
		* BIO、NIO和AIO的区别，三种IO的用法与原理
	* JVM
		* JVM 内存结构 [link](https://github.com/aalansehaiyang/technology-talk/blob/master/basic-knowledge/java.md)
		* JVM如何加载字节码文件 
		* 双亲委派，Bootstrap ClassLoader、Extension ClassLoader、ApplicationClassLoader
		* 内存分配策略、垃圾收集器（G1）、GC算法、GC参数、对象存活的判定 
		* 什么情况会出现young GC，什么情况会出现Full GC
		* 怎样判断Full GC是否正常？ [link](https://mp.weixin.qq.com/s/TuOMlzXRtDJSCgYGMPbpjw)
		* 内存泄露原因？如何排查？ [link](https://github.com/aalansehaiyang/technology-talk/blob/master/ops/online-question.md)
		* OOM 出现的有哪些场景？ [link](https://mp.weixin.qq.com/s/34GVlaYDOdY1OQ9eZs-iXg) [link](outline/3.md)
		* 熟悉哪些jvm 命令，jstack、jmap、jstat? [link](https://blog.csdn.net/itomge/article/details/9904555)
		* jvm调优经验
	* 其它
		* 动态代理与Cglib实现的区别 [link](https://www.cnblogs.com/leifei/p/8263448.html)
		* 看过哪些JDK源码
		* JAVA并发编程艺术
		* java8的新特性 [link](https://github.com/biezhi/30-seconds-of-java8)
		* lambda表达式、Stream API
		* HotSpot 即时编译器、编译优化 [link](http://www.sohu.com/a/169704040_464084)
		* CPU缓存，L1，L2，L3和伪共享 [link](https://blog.csdn.net/zero__007/article/details/54089730)
		* Java 9，Reactive Streams [link](https://www.cnblogs.com/IcanFixIt/p/7245377.html)		
	

* spring
	* 为什么要使用Spring，Spring的优缺点有哪些
	* Spring的IOC容器初始化流程
	* Spring Bean 的生命周期 [link](https://blog.csdn.net/itomge/article/details/8656942)
	* Spring AOP实现原理
	* SpringMVC模式
	* Spring Boot 与 Spring 的区别 [link](https://mp.weixin.qq.com/s/lsJU_XFmI3dPpkWndrsAuw)
	* Spring cloud了解过哪些
	* Spring 5 响应式编程 [link](https://www.oschina.net/translate/reactive-programming-with-spring-5)
	

* mysql
	* 数据库主备搭建 [link](https://www.cnblogs.com/fan-yuan/p/7249249.html) [link](https://blog.csdn.net/zimu002/article/details/72843260)
	* 表级锁和行级锁对比 [link](https://mp.weixin.qq.com/s/ENQZii1xgxlsIbR-oMseKw)
	* 事务特性，有哪几种事务隔离级别 [link](https://mp.weixin.qq.com/s/ENQZii1xgxlsIbR-oMseKw)
	* 分布式事务，两阶段提交
	* 当MySQL单表记录数过大时，数据库的CRUD性能会明显下降，一些常见的优化措施 [link](https://mp.weixin.qq.com/s/ENQZii1xgxlsIbR-oMseKw)
	* SQL 优化的常见方法有哪些 [link](https://github.com/aalansehaiyang/technology-talk/blob/master/data-base/sql-optimize.md)
	* 如何查看执行计划，如何根据执行计划进行SQL优化 [link](https://blog.csdn.net/taojin12/article/details/81489234)
	* MyISAM与InnoDB区别 [link](https://www.cnblogs.com/lyl2016/p/5797519.html)


* redis
	* 为什么要用Redis，Redis有哪些优缺点？Redis如何实现扩容？ [link](https://mp.weixin.qq.com/s/FqMScRBFwdwF2n3QJkNLRA)
	* 10个redis常见问题 [link](https://mp.weixin.qq.com/s/Z4a8wbWvPDGFTkKJH0X9VQ)
		* Redis有哪些数据结构？
		* 使用过Redis分布式锁么，代码怎么写？
		* 假如Redis里面有1亿个key，其中有10w个key是以某个固定的已知的前缀开头的，如果将它们全部找出来？	
		* Redis如何做持久化的？
		* Pipeline有什么好处，为什么要用pipeline？
		* Redis的同步机制了解么？	
* kafka
	* Kafka的整体架构
* netty
	* Netty的一次请求过程
	* Netty核心精讲之Reactor线程模型

* dubbo
	* 底层原理
	* 支持哪些负载算法？默认哪种？
	* 怎么设置超时时间？

* tomcat
	* Tomcat 调优
	* Servlet线程安全问题 [link](https://blog.csdn.net/i_will_try/article/details/62215633)
	
* 其它

	* HttpClient 内部实现？ [link](https://www.jianshu.com/p/14c005e9287c)


### HTTP 协议

* OSI模型分为哪几层？
* TCP
	* TCP 和 UDP 的区别？TCP 数据传输过程中怎么做到可靠的？
	* TCP 三次握手、四次挥手过程 [link](https://github.com/aalansehaiyang/technology-talk/blob/master/web/tcp.md)
	* TCP拥塞控制 [link](https://www.cnblogs.com/hupp/p/4856134.html)
* http
	* Cookie和Session的区别
	* Http的状态码
	* HTTP 301 、302有啥区别
	* HTTP连接池实现原理
	* Http怎么处理长连接
*  谈谈对 Http 和 RPC 的理解？ [link](outline/4.md)

### OS系统

* centos7 的内存分配方式和6有啥不同 [link](https://www.cnblogs.com/Csir/p/6746667.html)
* linux
	* 常用的linux命令 [link](https://github.com/aalansehaiyang/technology-talk/blob/master/ops/linux-commands.md)
	* 缓冲区溢出
	* 分段和分页
	* 虚拟内存与主存
	* Linux 库函数与系统调用的关系与区别 [link](https://www.cnblogs.com/liwei0526vip/p/8998751.html)
	* 调度算法
	* select 、poll和epoll
* 进程和线程的区别 [link](https://mp.weixin.qq.com/s/xHOSVG5tGzj1RzpEutH_wg)
 

### 实战能力

* 有没有处理过线上问题？出现内存泄露，CPU利用率飙高，应用无响应时如何处理？
* 如果有几十亿的白名单，每天白天需要高并发查询，晚上需要更新一次，如何设计这个功能
* 双十一电商秒杀系统性能优化实战
* 电商网站，如何保证一件商品不被超卖
* 让您做一个电商平台，您如何设置一个在买家下订单后的”第60秒“发短信通知卖家发货，您需要考虑的是 像淘宝一样的大并发量的订单 [link](https://mp.weixin.qq.com/s/u4Azg27wPtdbVtoi38EAiA)


### 其它

* 一致性Hash算法 [link](https://github.com/aalansehaiyang/technology-talk/blob/master/other/%E4%B8%80%E8%87%B4%E6%80%A7hash.md)
* 看过哪些开源框架的源码
* 消息中间件是如何实现的，技术难点有哪些
* 工作案例。怎么提高研发效率。
* HttpClient 讲下里面的具体实现，（涉及了哪些东西）
* 那要你设计一个高性能的 Http ，你会怎么设计？
* 说出一个空间换时间的场景
* 怎么防止订单重复提交?
* ORM框架用过哪些？
* hibernate 和 IBatis 的区别？
* 抽象能力，乐高模式，怎么提高研发效率
* 什么情况用接口，什么情况用消息
* 加密与解密：MD5，SHA1、DES、AES、RSA、DSA [link](https://github.com/aalansehaiyang/sort-algorithm/blob/master/doc/encry.md)








