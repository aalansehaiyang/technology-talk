## 事务

---

### 事务特性

原子性、一致性、隔离性、持久性，这四个属性通常称为ACID特性。

* 原子性（atomicity）。一个事务是一个不可分割的工作单位，事务中包括的诸操作要么都做，要么都不做。
* 一致性（consistency）。事务必须是使数据库从一个一致性状态变到另一个一致性状态。一致性与原子性是密切相关的。
* 隔离性（isolation）。一个事务的执行不能被其他事务干扰。即一个事务内部的操作及使用的数据对并发的其他事务是隔离的，并发执行的各个事务之间不能互相干扰。
* 持久性（durability）。持久性也称永久性（permanence），指一个事务一旦提交，它对数据库中数据的改变就应该是永久性的。接下来的其他操作或故障不应该对其有任何影响。


### 分布式事务

* [分布式事务](分布式事务.md)
* [分布式系统常见的事务处理机制](https://mp.weixin.qq.com/s/ja0VRPkfHL9dtOP_PxwxKw)
* [微服务架构下处理分布式事务的典型方案](https://mp.weixin.qq.com/s/RKwvfKXIHrrkuCqOGZ4CPw)
* [解决分布式系统事务一致性的几种方案对比](https://mp.weixin.qq.com/s/kzmTKKH-t6tpJ97fa6TYPg)
* [多库多事务降低数据不一致概率](https://mp.weixin.qq.com/s/FvB-hOBT13SMfZko5iagAg)
* [蚂蚁技术专家：一篇文章带你学习分布式事务](https://mp.weixin.qq.com/s/abjDjGGz5RUoCNCdnoxOjQ)

#### 开源框架

* [tcc-transaction是TCC型事务java实现](https://github.com/changmingxie/tcc-transaction)
* [TCC分布式事务的实现原理](https://mp.weixin.qq.com/s/K0PCZmdXyJYwyuEPW8bvFg)
* [分布式事务 TCC-Transaction 源码分析 —— Dubbo 支持](https://mp.weixin.qq.com/s/WRH8C3MYSFghFopBKmshJw)
* [分布式事务 TCC-Transaction 源码分析 —— 项目实战](https://mp.weixin.qq.com/s/vPr4yMUzurtVkW3BGXit5g)
* [GTS来了！阿里微服务架构下的分布式事务解决方案](https://mp.weixin.qq.com/s/bUtu2nTs0bybnTvk-iLt6Q)
* [Atomikos](https://yq.aliyun.com/articles/39054)
* [微服务架构下分布式事务解决方案 —— 阿里GTS](https://mp.weixin.qq.com/s/BWrGw5dkRfR7gws2XY8vHQ)
* [ByteJTA是一个兼容JTA规范的基于XA/2PC的分布式事务管理器](https://github.com/liuyangming/ByteJTA)
