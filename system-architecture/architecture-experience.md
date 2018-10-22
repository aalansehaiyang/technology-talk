## 架构经验

---

### 架构相关

*   [架构思想](架构思想.md)
*	[大型网站技术架构](大型网站技术架构.md)
*	[各大互联网公司架构演进之路汇总](http://blog.fulin.org/2016/03/summary-of-architectures/)
*	[中小型研发团队架构落地实践18篇，含案例、代码](https://mp.weixin.qq.com/s/AbUGOWN27FEUPWgDQkF_Dw)
* [高可用系统架构](https://mp.weixin.qq.com/s/5vVXBXkd-Ilh7zk5G6Wxcg)
* [看京东系统架构师如何让笨重的架构变得灵巧](https://mp.weixin.qq.com/s/-wIC6yPifSEfT_Yybi4pTg)
* 	前后端分离
	* [互联网分层架构，为啥要前后端分离](https://mp.weixin.qq.com/s/Nhyo969WnEwyCWpr34ECcA)
	* [前后端API交互如何保证数据安全性？](https://mp.weixin.qq.com/s/On98tXDEpnx1n7sqgZYWzA)
* 	网关	
	* [Gateway](Gateway.md)
	* [微服务网关Zuul迁移到Spring Cloud Gateway](https://mp.weixin.qq.com/s/Qnxec7w26AX6jRl0KRHVHg)

---
### 微服务

*	[微服务介绍](microservice-introduce.md)
*	[SOA与微服务](SOA与微服务.md)
* 	[如何设计高可用的微服务架构？](https://mp.weixin.qq.com/s/W3Vn0EgCjWpjJ365Pv30iw)
* 	[微服务的4大设计原则和19个解决方案](https://mp.weixin.qq.com/s/YfXjkMX-eQFmEzjG6Lwvrw)
* 	[微服务后如何做一次系统梳理](https://mp.weixin.qq.com/s/ZxVQ7PvK89XVBYhNUoMnMg)
*   [微服务架构技术栈选型手册](https://mp.weixin.qq.com/s/zFJokAv8lSQejGFTGJTJeQ)
* [微服务2.0技术栈选型手册](https://mp.weixin.qq.com/s/OloZhn2pwfIrOQit_8jefA)
* [微服务架构在千万级别日调用量、亿级别海量数据场景下的应用实践](https://mp.weixin.qq.com/s/fqOOkMMPwXTNG8PHJ_yUAw)
*   分布式事务
	* [technology-talk](https://github.com/aalansehaiyang/technology-talk/blob/master/data-base/transaction.md)
*   注册中心
	* [几种服务注册与发现组件的原理与比较](https://mp.weixin.qq.com/s/Kawfps7C1pGRMq1eBgiZKw)
*  Spring Cloud
	* [苏宁数据中台基于Spring Cloud微服务架构实践](https://mp.weixin.qq.com/s/Xh-C79U35lsIsow_TL41dQ)
*	Service Mesh	
	* [Service Mesh：重塑微服务市场](https://mp.weixin.qq.com/s/XCUg4nVXJ9Q-mccYAyvc5Q)
	
	
---
### 数据库

*	[数据库架构](数据库架构.md)
*	[无限容量数据库架构设计](https://mp.weixin.qq.com/s/ad4tpM6cdi9r6vgfbaTzxg)
*	[100亿数据1万属性数据架构设计](https://mp.weixin.qq.com/s/3O3kPSwV-tAeYdy2ZRACpg)
*	[数据库表垂直拆分](https://mp.weixin.qq.com/s/ezD0CWHAr0RteC9yrwqyZA)
*	[分布式MySQL集群方案的探索与思考](https://mp.weixin.qq.com/s/2G5z9Ra8DJOP_1Co3cHcqA)
*	中间件
	* [为什么要引入数据库中间件](https://mp.weixin.qq.com/s/lHrMS-GdKsZYhaOf59magQ)
*	分库分表
	* [关于分库分表](https://mp.weixin.qq.com/s/eOaVRyCTKHeAWG4UXcGjQQ)
	* [也谈分库分表在实际应用的实践](https://mp.weixin.qq.com/s/Wn_Ox3617uUkzIJJJoUrjw)
	* [不停机分库分表迁移](https://mp.weixin.qq.com/s/oK94W71MAdNKXLxHl5dpPQ)
	* [如何不停机完成单表拆分](split-table.md)
* [InnoDB，5项最佳实践，知其所以然？](https://mp.weixin.qq.com/s/JEJcgD36dpKgbUi7xo6DzA)

---
### 缓存

* 	[cache相关](cache相关.md)
*	[cache经验总结](cache-summary.md)
*	[缓存架构之防雪崩设计](缓存架构之防雪崩设计.md)
*	[大型web系统数据缓存设计](https://mp.weixin.qq.com/s/Imn4FuXv2hw3uocgZsBlOg)
*	[cache常见的陷阱与坑](https://github.com/oldratlee/cache-practice)
*	[缓存穿透、缓存并发、热点缓存之最佳招式](https://mp.weixin.qq.com/s/62KJ2mSTGoUTPsq0RjU7lg)
*	[再谈缓存的穿透、数据一致性和最终一致性问题](https://mp.weixin.qq.com/s/kYXabyZhVthF-9rR0Uv4lQ)
*	[分布式缓存的25个优秀实践与线上案例](https://mp.weixin.qq.com/s/foQZSZ0xx0YYPHGawshc3g)
*	[缓存在大型分布式系统中的最佳应用](https://mp.weixin.qq.com/s/f-K0lPjBPcYFK0hbZJF99Q)
*	数据迁移	
	* [分布式缓存的迁移方案](https://mp.weixin.qq.com/s/8WtbAaNRdaJvRWcVG5K5rQ)
* [数据库和缓存双写一致性方案解析](https://mp.weixin.qq.com/s/xHOZ5Nr4LQwpQoRwoTDxZA)
* [缓存架构，一篇足够？](https://mp.weixin.qq.com/s/4J3oM1j5hcLq4w4TdSEMPg)
* [你应该知道的Java缓存进化史](https://mp.weixin.qq.com/s/DV5eSZtShs2twGe0UwzPuA)

---
### MQ消息

* 	[消息中间件选型分析](https://mp.weixin.qq.com/s/Zwd1USlOCkQvsG96eSwvpg)
*	[MQ消息可达性+幂等性+延时性架构设计](https://mp.weixin.qq.com/s/8oX7u8XcLL80_nNdN-UkvQ)
*	[一网打尽消息队列在大型分布式系统中的实战精髓](https://mp.weixin.qq.com/s/Kpkr-vGUC9Po19iRPKfLfA)


---
### 稳定性

* 系统容量
	* 	[如何进行容量设计](https://mp.weixin.qq.com/s/wxSN47UNtEG_4vEl5lw31g)
* 限流
	* [如何设计API的限流](如何设计API的限流.md)
	* [分布式限流](https://mp.weixin.qq.com/s/VXu82MgWwn993n8fSlaNtg)
	* [探索常见的几种限流策略和实现](https://mp.weixin.qq.com/s/GEu7UVO7s_HX88T_DmBmnQ)
	* [阿里巴巴宣布开源限流降级中间件——Sentinel](https://mp.weixin.qq.com/s/s-4JeeATl9NpkxUIeBHvSw?utm_source=tuicool&utm_medium=referral) 
	* [限流降级神器，带你解读阿里巴巴开源 Sentinel （二）资源调用链](https://mp.weixin.qq.com/s/q3QUySAw4owaXYlfgQ15SA)
	* [限流降级神器-哨兵(sentinel)原理分析](https://mp.weixin.qq.com/s/g2hyp9CquEAvTe8QmPO-3g)
	* [从构建分布式秒杀系统聊聊限流特技](https://blog.52itstyle.com/archives/2982/)
	* [限流系统如何发现系统的热点](https://mp.weixin.qq.com/s/wRKiEKT_Qe05Ie8XWgkaXQ)
* 降级	
* 熔断
	* [熔断设计]()
* 容灾
* 隔离
	* [隔离设计](isolate.md)
* 幂等
	* [幂等性设计](idempotent.md)
* 重试
	* [重试设计](re-try.md)
* 异地双活


---
### 流量相关

* [流量调度](flow-dispatch.md)


---
### 高并发

* 	[究竟啥才是互联网架构“高并发”](https://mp.weixin.qq.com/s/th2PyARAdLOLElieQjNSSA)

---
### 安全

*	[接口鉴权（数字签名）](数字签名.md)

	
---
### 数据一致性
* 	[并发与幂等性](https://my.oschina.net/wangen2009/blog/1560975)

---
### 锁相关

* 	[乐观锁&悲观锁](锁机制.md)
* 分布式锁
	* [基于 redis分布式锁（推荐）](分布式锁.md)
	* [基于 redis 的分布式锁到底安全吗?](https://mp.weixin.qq.com/s/ctbcwV4hzdB2MwGqQAA0_A)
	* [基于 zookeeper实现的分布式锁](lock-zk.md)
	* [基于数据库实现分布式锁（不推荐）](lock-db.md)
* [我们该使用哪种分布式锁？](https://mp.weixin.qq.com/s/0wmVSfrkFq7BfpUvydr-ug)
* [从构建分布式秒杀系统聊聊分布式锁](https://mp.weixin.qq.com/s/-mziYuTMjECKpTLKZBumbw)

---
### 性能优化

* 	[性能优化之QPS](性能优化之Qps.md)
*	[系统性能优化常用手段](http://blog.csdn.net/itomge/article/details/21649489)
*	[web性能优化14法则](http://blog.csdn.net/itomge/article/details/8712102)
*	[从代码层面优化系统性能的解决方案](https://mp.weixin.qq.com/s/gtxDbgo_esY4kD_LNoyfPQ)

---
### WEB 系统

*	[分布式 session](https://mp.weixin.qq.com/s/iTdHyODJ12RvTbe6MILg6Q)

---
### 技术选型

*	[技术选型时的思考及注意事项](https://mp.weixin.qq.com/s/KUiHS4Jg7pqunEA3X6RQPw)

---
### 架构汇总

*	[架构师之路2016年精选50篇](https://mp.weixin.qq.com/s/OlFKpcnBOgcPZmjvdzCCiA)
*	[架构师之路2017半年精选40篇](https://mp.weixin.qq.com/s/8RM6U8UqWTDp29DB_hiYVQ)
*	[架构师之路，季度精选40篇](https://mp.weixin.qq.com/s/vLebPT-58Jw-Q7afhkgHSg)
*	[架构师之路17年精选80篇](https://mp.weixin.qq.com/s/CIPosICgva9haqstMDIHag)
*	[阿里巴巴十年Java架构师分享](https://maimai.cn/article/detail?fid=282107496&from=headline&share_user=http://i9.taou.com/maimai/p/3621/990_45_u1AK5tPDEjhwhh-a160)
*	[芋道源码的周八（2018.03.04）](https://mp.weixin.qq.com/s/VlJjfJHcedO5sIdGaHCoxg)
*	[芋道源码的周八（2018.03.18）](https://mp.weixin.qq.com/s/QqcY-9Y7miheTcu65ZEY4A?from=groupmessage&isappinstalled=0)

---
### 思考

*	[架构师的职责与思考](架构师的职责与思考.md)
*	[好的架构是逐步演化过来的](http://mp.weixin.qq.com/s/KsFVTqDhYcO3Jws6oOoa4g)
*	[技术不应成为业务的工具](http://mp.weixin.qq.com/s?__biz=MjM5MDE0Mjc4MA==&mid=2650993402&idx=1&sn=f79a2e2cd75bf7ca539149addb6e7c21)
* [创业公司如何打造高效的研发体系？](http://mp.weixin.qq.com/s/iGTJy98Fj_qT0gBMHxzH1g)
* [那么贵的技术会议，真的能学到东西吗？](https://mp.weixin.qq.com/s/pf-2pw0W4vKch7IDGTyzBw)
