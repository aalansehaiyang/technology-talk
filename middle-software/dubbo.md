## dubbo相关

---

随着互联网的发展，网站应用的规模不断扩大，常规的垂直应用架构已无法应对，分布式服务架构以及流动计算架构势在必行，亟需一个治理系统确保架构有条不紊的演进。

![image](../img/dubbo-1.jpg)


* 单一应用架构

	当网站流量很小时，只需一个应用，将所有功能都部署在一起，以减少部署节点和成本。
此时，用于简化增删改查工作量的 数据访问框架(ORM) 是关键。

* 垂直应用架构
	当访问量逐渐增大，单一应用增加机器带来的加速度越来越小，将应用拆成互不相干的几个应用，以提升效率。
此时，用于加速前端页面开发的 Web框架(MVC) 是关键。

* 分布式服务架构 

	当垂直应用越来越多，应用之间交互不可避免，将核心业务抽取出来，作为独立的服务，逐渐形成稳定的服务中心，使前端应用能更快速的响应多变的市场需求。
此时，用于提高业务复用及整合的 分布式服务框架(RPC) 是关键。
* 流动计算架构

	当服务越来越多，容量的评估，小服务资源的浪费等问题逐渐显现，此时需增加一个调度中心基于访问压力实时管理集群容量，提高集群利用率。
此时，用于提高机器利用率的 资源调度和治理中心(SOA) 是关键。


<br/>

参考资料：

[http://www.oschina.net/search?q=dubbo&scope=project&fromerr=OSwWxF3l](http://www.oschina.net/search?q=dubbo&scope=project&fromerr=OSwWxF3l)

[https://github.com/alibaba/dubbo](https://github.com/alibaba/dubbo)

[http://dubbo.io/User+Guide-zh.htm](http://dubbo.io/User+Guide-zh.htm)