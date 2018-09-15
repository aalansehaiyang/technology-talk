## 技术大纲

---

### 系统架构

* 常用的设计模式
* 哪些设计模式可以增加系统的可扩展性
* 如果AB两个系统互相依赖，如何解除依赖？
* 什么场景应该拆分系统，什么场景应该合并系统？
* 

### 分布式系列

* 搭建Redis缓存高可用集群
* 锁、分布式锁
* 网关框架哪些？能为后端服务带来哪些好处？
* 分布式事务，两阶段提交
* 如何实现分布式锁
* 如何实现分布式Session
* 如何保证消息的一致性
* 负载均衡
* CDN实现原理
* 

### 高并发

* JAVA并发编程艺术
* 高并发下如何正确优雅的使用缓存
* 如何设计一个高并发系统？从上到下


### 微服务

* zookeeper之服务注册与订阅
* 使用Docker部署微服务
* 微服务架构--分布式事务解决方案
* 微服务划分的粒度
* 微服务的高可用怎么保证的？

### 性能调优

* Netty核心精讲之Reactor线程模型
* 深入理解JVM虚拟机
* 线上服务 CPU 很高该怎么解决？
* SQL 优化的常见方法有哪些
* 当MySQL单表记录数过大时，数据库的CRUD性能会明显下降，一些常见的优化措施 [link](https://mp.weixin.qq.com/s/ENQZii1xgxlsIbR-oMseKw)
* 怎么提升系统的QPS和吞吐量


### 框架

* java
	* Object 的 equals方法重写了，hashCode 方法必须重写 [link](https://blog.csdn.net/u013679744/article/details/57074669/) [link](https://github.com/Snailclimb/JavaGuide/blob/master/%E9%9D%A2%E8%AF%95%E5%BF%85%E5%A4%87/%E6%9C%80%E6%9C%80%E6%9C%80%E5%B8%B8%E8%A7%81%E7%9A%84Java%E9%9D%A2%E8%AF%95%E9%A2%98%E6%80%BB%E7%BB%93/%E7%AC%AC%E4%B8%80%E5%91%A8%EF%BC%882018-8-7%EF%BC%89.md)
	* JDK 中有哪几个线程池？
	* Concurrenthashmap 是怎么做到线程安全的？
	* 线程有哪些状态？ BLOCKED和WAITING有什么区别? [link](https://blog.csdn.net/longly_me/article/details/61414268) [link](https://www.cnblogs.com/lcplcpjava/p/6896904.html)
	* 如何保证线程安全问题？
	* synchronized和lock 的区别？
	* java读写锁，读写锁设计主要解决什么问题？
	* 如何避免死锁
	* JVM如何加载字节码文件
	* JVM GC 算法
	* 什么情况会出现Full GC，什么情况会出现yong GC
	* JVM内存模型
	* JUC 常用的类

* spring
	* 为什么要使用Spring，Spring的优缺点有哪些
	* Spring的IOC容器初始化流程
	* Spring Bean 的生命周期 [link](https://blog.csdn.net/itomge/article/details/8656942)
	* Spring AOP实现原理

* mysql
	* 表级锁和行级锁对比 [link](https://mp.weixin.qq.com/s/ENQZii1xgxlsIbR-oMseKw)
	* MySQL 事务特性，有哪几种事务隔离级别 [link](https://mp.weixin.qq.com/s/ENQZii1xgxlsIbR-oMseKw)

### HTTP 协议

* OSI模型分为哪几层？
* TCP 和 UDP 的区别？TCP 数据传输过程中怎么做到可靠的？
* Cookie和Session的区别
* 前端浏览器地址的一个 http 请求到后端整个流程
* HTTP连接池实现原理

### 实战能力

* 有没有处理过线上问题？出现内存泄露，CPU利用率飙高，应用无响应时如何处理的
* 如果有几十亿的白名单，每天白天需要高并发查询，晚上需要更新一次，如何设计这个功能
* 电商网站，如何保证一件商品不被超卖


### 项目

* 双十一电商秒杀系统性能优化实战

### 其它

* 一致性Hash算法
* 看过哪些开源框架的源码
* 为什么要用Redis，Redis有哪些优缺点？Redis如何实现扩容？
* 消息中间件是如何实现的，技术难点有哪些
* 工作案例。怎么提高研发效率。




