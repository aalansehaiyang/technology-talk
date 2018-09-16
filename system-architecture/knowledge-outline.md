## 技术大纲

---

### 系统架构

* 前端浏览器地址的一个 http 请求到后端整个流程
* 常用的设计模式
* 哪些设计模式可以增加系统的可扩展性
* 如果AB两个系统互相依赖，如何解除依赖？
* 什么场景应该拆分系统，什么场景应该合并系统？
* 常用的设计模式 [link](https://github.com/aalansehaiyang/technology-talk/blob/master/basic-knowledge/%E5%B8%B8%E7%94%A8%E7%9A%84%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F.md)


### 分布式系列

* 如何设计一个高并发的分布式系统？你会引入哪些开源框架？
* 搭建Redis缓存高可用集群
* 高并发下如何正确优雅的使用缓存
* 本地缓存用过哪些框架？Guava
* 网关框架了解过哪些？能为后端服务带来哪些好处？
* 如何保证消息幂等  [link](https://www.jianshu.com/p/8b77d4583bab?utm_campaign)
* 如何实现分布式Session
* 如何保证消息的一致性
* 负载均衡
* CDN实现原理


### 微服务

* zookeeper之服务注册与订阅
* 使用Docker部署微服务
* 微服务架构--分布式事务解决方案
* 微服务划分的粒度
* 微服务的高可用怎么保证的？


### 性能调优

* 深入理解JVM虚拟机；jvm调优经验
* 内存泄露原因？如何排查？
* 线上服务 CPU 很高该怎么解决？
* 怎么提升系统的QPS和吞吐量
* Tomcat 调优

### 锁相关

* 死锁定义；如何避免死锁 [link](https://blog.csdn.net/ls5718/article/details/51896159)
* synchronized和 ReentrantLock 的区别？
* java读写锁，读写锁设计主要解决什么问题？
* 乐观锁，悲观锁，使用场景？
* 设计一个分布式锁
* 常见的锁有哪些？ [link](https://github.com/aalansehaiyang/Lock-Learning)

### 框架

* java
	* String、StringBuffer与StringBuilder的区别
	* 关键字 volatile、transient、final
	* Object 的 equals方法重写了，hashCode 方法必须重写 [link](https://blog.csdn.net/u013679744/article/details/57074669/) [link](https://github.com/Snailclimb/JavaGuide/blob/master/%E9%9D%A2%E8%AF%95%E5%BF%85%E5%A4%87/%E6%9C%80%E6%9C%80%E6%9C%80%E5%B8%B8%E8%A7%81%E7%9A%84Java%E9%9D%A2%E8%AF%95%E9%A2%98%E6%80%BB%E7%BB%93/%E7%AC%AC%E4%B8%80%E5%91%A8%EF%BC%882018-8-7%EF%BC%89.md)
	* HashMap，为什么线程不安全 [link](https://mp.weixin.qq.com/s/RtfEPR2oclUAu0tXnYAn4Q)
	* HashMap 怎么解决碰撞问题？
	* Concurrenthashmap 是怎么做到线程安全的？
	* 线程有哪些状态？ BLOCKED和WAITING有什么区别? [link](https://blog.csdn.net/longly_me/article/details/61414268) [link](https://www.cnblogs.com/lcplcpjava/p/6896904.html)
	* JDK 中有哪几个线程池？拒绝策略？ [link](https://github.com/aalansehaiyang/technology-talk/blob/master/basic-knowledge/concurrent-class.md) [link](https://mp.weixin.qq.com/s/5dexEENTqJWXN_17c6Lz6A)
	* 如何保证线程安全问题？
	* JVM如何加载字节码文件
	* 双亲委派，Bootstrap ClassLoader、Extension ClassLoader、ApplicationClassLoader
	* JVM GC 算法
	* 什么情况会出现young GC，什么情况会出现Full GC
	* JVM内存模型
	* 熟悉哪些jvm 命令，jstack、jmap、jstat?
	* OOM 出现的有哪些场景？
	* JUC 常用的类 [link](https://github.com/aalansehaiyang/technology-talk/blob/master/basic-knowledge/concurrent-class.md) [link](https://mp.weixin.qq.com/s/K8y6wMNDLwsmU7EFRx7Dsw)
	* JAVA并发编程艺术
	* java8的新特性
	* NIO

* spring
	* 为什么要使用Spring，Spring的优缺点有哪些
	* Spring的IOC容器初始化流程
	* Spring Bean 的生命周期 [link](https://blog.csdn.net/itomge/article/details/8656942)
	* Spring AOP实现原理
	* SpringMVC模式
	* Spring Boot 与 Spring 的区别
	* Spring cloud了解过哪些
	

* mysql
	* 表级锁和行级锁对比 [link](https://mp.weixin.qq.com/s/ENQZii1xgxlsIbR-oMseKw)
	* MySQL 事务特性，有哪几种事务隔离级别 [link](https://mp.weixin.qq.com/s/ENQZii1xgxlsIbR-oMseKw)
	* 分布式事务，两阶段提交
	* SQL 优化的常见方法有哪些
	* 当MySQL单表记录数过大时，数据库的CRUD性能会明显下降，一些常见的优化措施 [link](https://mp.weixin.qq.com/s/ENQZii1xgxlsIbR-oMseKw)

* kafka
	* Kafka的整体架构
* netty
	* Netty的一次请求过程
	* Netty核心精讲之Reactor线程模型

* dubbo
	* 底层原理
	* 支持哪些负载算法？默认哪种？
	* 怎么设置超时时间？


### HTTP 协议

* OSI模型分为哪几层？
* TCP
	* TCP 和 UDP 的区别？TCP 数据传输过程中怎么做到可靠的？
	* TCP 三次握手、四次挥手过程
	* TCP拥塞控制 [link](https://www.cnblogs.com/hupp/p/4856134.html)
* http
	* Cookie和Session的区别
	* Http的状态码
	* HTTP 301 、302有啥区别
	* HTTP连接池实现原理
	* Http怎么处理长连接


### OS系统

* centos7 的内存分配方式和6有啥不同 [link](https://www.cnblogs.com/Csir/p/6746667.html)
* 常用的linux命令 [link](https://github.com/aalansehaiyang/technology-talk/blob/master/ops/linux-commands.md)
* Linux 库函数与系统调用的关系与区别 [link](https://www.cnblogs.com/liwei0526vip/p/8998751.html)
* 进程和线程的区别 [link](https://mp.weixin.qq.com/s/xHOSVG5tGzj1RzpEutH_wg)
 

### 实战能力

* 有没有处理过线上问题？出现内存泄露，CPU利用率飙高，应用无响应时如何处理的
* 如果有几十亿的白名单，每天白天需要高并发查询，晚上需要更新一次，如何设计这个功能
* 双十一电商秒杀系统性能优化实战
* 电商网站，如何保证一件商品不被超卖



### 其它

* 一致性Hash算法
* 看过哪些开源框架的源码
* 为什么要用Redis，Redis有哪些优缺点？Redis如何实现扩容？
* 消息中间件是如何实现的，技术难点有哪些
* 工作案例。怎么提高研发效率。
* HttpClient 讲下里面的具体实现，（涉及了哪些东西）
* 那要你设计一个高性能的 Http ，你会怎么设计？
* 说出一个空间换时间的场景
* 怎么防止订单重复提交?
* ORM框架用过哪些？
* hibernate 和 IBatis 的区别？
* 




