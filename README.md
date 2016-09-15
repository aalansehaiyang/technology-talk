## 技术心得

---

有人认为编程是一门技术活，要有一定的天赋，非天资聪慧者不能及也。其实不然，笔者虽是计算机专业出身，但工作年限并不长，对于技术这碗饭有一些心得体会，大多数人成为领域专家可能有些难度，但应付日常工作，甚至成为业务主力骨干，其实并不难。

**github.com很重要，里面汇集了全球工程师的智慧！**

下面列举工作了中常用的一些技术，以及如何培养架构能力。由于每个技术市面上基本都有对应的书籍资料，所以本文只是少篇幅列举工作中用到的核心知识点，更多是抛砖引玉，属于进阶型，不适用初学者。

### 基础知识
* 	[java](basic-knowledge/java.md)
*  	[spring](basic-knowledge/spring.md)
*  	[springboot](basic-knowledge/springboot.md)
*	[ibatis](basic-knowledge/ibatis.md)
*	[常用的设计模式](basic-knowledge/常用的设计模式.md)


### 数据库
目前使用最多还是mysql，虽然单机性能比不上oracle，但免费开源，单机成本低且借助于分布式集群，可以有强大的输出能力。

*	[连接池](data-base/数据库连接池.md)
* 	[并发锁机制](data-base/锁机制.md)
* 	[分库分表](data-base/分库分表.md)
* 	[id生成器](data-base/id生成器.md)
* 	[mysql中bigint、int、mediumint、smallint 和 tinyint的取值范围](data-base/bigint类型.md)
* 	[DAO层接口性能监控](data-base/DAO层接口性能监控.md)

### web容器/网络

*	[http协议](web/http协议.md)
*	[tomcat](http://tomcat.apache.org/)
*	Nginx


### 中间件

* [dubbo](middle-software/dubbo.md)
* [kafka](middle-software/kafka.md)
* [redis](open-source-framework/redis.md)
* [zookeeper](middle-software/zookeeper.md)
* [cobar](http://hualong.iteye.com/blog/2102798)
* Storm
* [Elasticsearch](middle-software/elasticsearch.md)



### 常用三方工具包

* [Google Guava](open-source-framework/Goole-Guava.md)
* [fastJson](open-source-framework/fastJson.md)
* [log4J](http://blog.csdn.net/itomge/article/details/17913607)
* [commons-codec](open-source-framework/commons-codec.md)
* [commons-lang3](open-source-framework/commons-lang3.md)
* [commons-io](open-source-framework/commons-io.md)
*  [Quartz](open-source-framework/Quartz.md)
* [HttpClient](open-source-framework/HttpClient.md)
* [Javassist](http://blog.csdn.net/itomge/article/details/7671294)



### 系统架构 

* [架构经验](system-architecture/架构经验.md)
* [编码前3000问](system-architecture/编码前3000问.md)
* [负载均衡之LVS](system-architecture/LVS.md)
* [CDN](system-architecture/CDN.md)
* [性能优化之Qps](system-architecture/性能优化之Qps.md)
* [cache相关](system-architecture/cache相关.md)
* [经典案例](system-architecture/经典案例.md)



### 运维

*	[快速排查线上问题](ops/online-question.md)
*	[linux常用命令](http://blog.csdn.net/itomge/article/details/8797114)


### 项目管理

* [程序员素养](project-management/程序员素养.md)
* [git常用命令](project-management/git常用命令.md)


### 其它

*	[HTTPS 抓包工具（charles）](http://blog.vetcafe.net/2013/12/charlesproxyiphonehttps.html)
*	[一致性hash算法](other/一致性hash.md)
*	[Lombok安装](http://www.blogjava.net/fancydeepin/archive/2012/07/12/382933.html)
*	[mysql数据库binlog的增量订阅&消费组件](https://github.com/alibaba/canal)
*	[分布式数据库同步系统](https://github.com/alibaba/otter)

