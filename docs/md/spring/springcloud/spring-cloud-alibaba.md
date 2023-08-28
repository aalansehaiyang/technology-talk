---
title: 【万字长文】创业公司就应该技术选型 Spring Cloud Alibaba ， 开箱即用
---

# 【万字长文】创业公司就应该技术选型 Spring Cloud Alibaba ， 开箱即用

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学

---

大家好，我是Tom哥~

## 前言

互联网时代，面对复杂业务，讲究 **分而治之**。将一个大的单体系统拆分为若干个微服务，保证每个系统的职责单一，可以垂直深度扩展。

但是一个个独立的微服务像一座座孤岛，如何将他们串联起来，才能发挥最大价值。

<div align="left">
    <img src="https://offercome.cn/images/spring/springcloud/5-1.jpg" width="600px">
</div>

这时，我们就要提微服务的生态圈。

那么微服务生态圈都有哪些模块？他们的作用分别是什么？

* **服务的注册、发现**。生产者启动时，会将自己的信息注册上报，这样调用方只需连接注册中心，根据一定的负载算法，就可以与服务提供方建立连接，从而实现应用间的解耦。
* **服务调用**。通过多种协议（如：HTTP等）实现目标服务的真正调用。
* **负载均衡**。主要是提供多种负载算法，满足不同业务场景下的集群多实例的选择机制
* **服务的稳定性**。提供了服务熔断、限流、降级
* **分布式配置中心**。应用的配置项统一管理，修改后能动态生效
* **消息队列**。非核心逻辑从同步流程抽离，解耦，异步化处理，缩短RT时间
* **网关**。将一些通用的处理逻辑，如：限流、鉴权、黑白名单、灰度等抽取到一个单独的、前置化系统统一处理。
* **监控**。监控系统的健康状况
* **分布式链路追踪**。查看接口的调用链路，为性能优化、排查问题提供输入
* **自动化部署**。持续集成，快速部署应用。

围绕这些功能模块，`Spring Cloud Alibaba` 为我们提供了微服务化开发的一站式解决方案，我们只需要少量的`Spring 注解` 和 `yaml配置`，便可以快速构建出一套微服务系统。真的是创业者的福音。

**那么这套生态规范都提供了哪些技术框架呢？**

<div align="left">
    <img src="https://offercome.cn/images/spring/springcloud/5-2.jpg" width="600px">
</div>


## Spring Boot（服务基座）

Spring Boot 是Spring框架的扩展，提供更加 `丰富的注解`，根据 **约定胜于配置** 原则，与市场主流的开源框架打通， 设计了 `Starter` 和 `AutoConfiguration` 机制，简化配置流程，通过简单的jar包引入，快速具备组件集成能力。大大提高了程序员的开发效率。

**特点：**

* 提供了丰富的注解，不要在XML文件中定义各种繁琐的bean配置
* 内嵌 Web容器，如：Tomcat（默认）、Jetty、Undertow 
* 集成了主流开源框架，根据项目依赖自动配置

## Nacos（注册中心、分布式配置中心）

Nacos 是阿里巴巴的开源的项目，全称 Naming Configuration Service ，专注于服务发现和配置管理领域。

Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理。功能齐全，可以替换之前的 `Spring Cloud Netflix Eureka`、`Spring Cloud Config`、`Spring Cloud Bus`，野心巨大。

客户端语言方面目前支持 Java，go 、python、 C# 和 C++等主流语言

> 开源地址：https://github.com/alibaba/nacos

Nacos 有一个控制台，可以帮助用户管理服务，监控服务状态、应用的配置管理。

**集群化部署：**

由于 `Nacos` 是单节点，无论做为`注册中心`还是`分布式配置中心`，一旦服务器挂了，作为底层服务引发的麻烦还是非常大的。如何保证其高可用？

Nacos 官方提供的集群部署架构图：

<div align="left">
    <img src="https://offercome.cn/images/spring/springcloud/5-3.jpg" width="600px">
</div>

> https://nacos.io/zh-cn/docs/cluster-mode-quick-start.html

在nacos的解压目录`nacos/conf`目录下，有配置文件`cluster.conf`，每行配置成 ip:port。（一般配置3个或3个以上节点）

```
# ip:port
200.8.9.16:8848
200.8.9.17:8848
200.8.9.18:8848
```
**这样保证客户端只需要写一次，由Leader节点将数据同步到其他节点，保证各个节点的数据一致性**

对于上层的SLB，我们可以采用 `Nginx` 或者 `OpenResty`，在 upstream 模块里配置 Nacos 的集群IP 地址列表，实现负载均衡功能。

另外，借助Nginx的心跳检测，当某台 Nacos 服务挂掉后，SLB 会自动屏蔽，将流量切换到其他 Nacos 实例。

当然 `OpenResty` 也可能成为单点故障，为了保证高可用，我们需要借助 `Keepalived` 

<div align="left">
    <img src="https://offercome.cn/images/spring/springcloud/5-4.jpg" width="600px">
</div>

客户端请求 VIP，然后请求打到了 OpenResty，由 OpenResty 转发给具体的某个 Nacos 节点。

>OpenResty 只有一个节点提供服务，另一个暂停状态，如果 master 节点宕机，那 backup 接替继续工作。从而解决了单点故障问题。

Keepalived 作为一种高性能的服务器高可用或热备解决方案，用来防止服务器单点故障的发生。市面资料很多，下文链接是《Keepalived+Nginx部署方案》具体操作步骤

> https://help.fanruan.com/finereport/doc-view-2905.html


## RestTemplate + Ribbon （远程调用）

Spring Cloud Ribbon 基于 Netflix Ribbon 封装的负载均衡框架。内部集成了多种负载算法，如：随机、轮询等。

与注册中心打通，能自动获取服务提供者的地址列表。结合自身的负载算法，选择一个目标实例发起服务调用。

> Ribbon 也提供了扩展接口，支持自定义负载均衡算法。

```
public class CustomRule extends AbstractLoadBalancerRule {
    private AtomicInteger count = new AtomicInteger(0);
    @Override
    public Server choose(Object key) { 
        return choose(getLoadBalancer(), key);
    }

    private Server choose(ILoadBalancer loadBalancer, Object key) {
        List<Server> allServers = loadBalancer.getAllServers(); 
        int requestNumber = count.incrementAndGet(); 
        if (requestNumber >= Integer.MAX_VALUE) { 
            count = new AtomicInteger(0); 
        }
        if (null != allServers) {
            int size = allServers.size();
            if (size > 0) {
                int index = requestNumber % size;                 
                Server server = allServers.get(index);
                if (null == server || !server.isAlive()) { 
                    return null;
                }
                return server;
            }
        }
        return null;
    }
}
```

**缺点：**

调用方每次发起远程服务调用时，都需要填写`远程目标地址`，还要配置各种参数，非常麻烦，不是很方便

```
// 注册到Nacos的应用名称
private final String SERVER_URL = "http://nacos-provider-demo"; 
@Resource
private RestTemplate restTemplate;

@RequestMapping("/hello") 
public String hello() {
	// 远程服务调用
   return restTemplate.getForObject(SERVER_URL + "/hello", String.class);
}
```

## OpenFeign（远程调用）

RestTemplate + Ribbon 每次发起远程服务调用时，都需要填写`远程目标地址`，还要配置各种参数，非常麻烦。

Feign 是一个轻量级的 Restful HTTP 客户端，**内嵌了 Ribbon 作为客户端的负载均衡**。面向接口编程，使用时只需要定义一个接口并加上`@FeignClient`注解，非常方便。

OpenFeign 是 `Feign` 的增强版。对 Feign 进一步封装，支持 Spring MVC 的标准注解和HttpMessageConverts

**依赖包：**

```
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

```
@FeignClient(value = "${provider.name}") 
public interface OrderService {

	// 调用服务提供者的 /create_order 接口
	@RequestMapping(value = "/create_order",method = RequestMethod.GET) 
	public String createOrder();
```

其中，`@FeignClient(value = "${provider.name}")` 定义了服务提供方的工程名，底层自动打通了注册中心，会拿到 `artifactId` 对应的IP列表，根据一定的负载均衡算法，可以将请求打到目标服务器上。

OpenFeign 默认等待接口返回数据的时间是 1 秒，超过这个时间就会报错。如果想调整这个时间，可以修改配置项 ` feign.client.config.default.readTimeout`


## Dubbo Spring Cloud（远程调用）

`RestTemplate + Ribbon` 和 `OpenFeign` 都是基于HTTP协议调用远程接口。而 `Dubbo Spring Cloud` 是基于 TCP 协议来调用远程接口。相比 HTTP 的大量的请求头，TCP 更轻量级。

Dubbo Spring Cloud = Spring Cloud  + Dubbo

**特性：**

* 支持多种注册中心，用于服务的注册、发现
* 内置多种负载均衡策略
* 服务粒度是`面向接口`，支持 TCP 轻量级协议
* 容易扩展，采用 微内核 + 插件 的设计原则，扩展点更强

**依赖包：**

```
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-dubbo</artifactId>
</dependency>
```

注意：虽然是将 Dubbo 集成到了 Spring Cloud，增加了一些 `注解` 和 `yaml` 配置项，开发更方便，但大部分调用玩法还是遵守 Dubbo 框架那一套。

**几个重要的配置项：**

* dubbo.scan.base-packages  # dubbo 服务扫描基准包，上报注册服务
* dubbo.protocol.name: dubbo   # 支持的协议
* dubbo.protocol.port: -1  # dubbo 协议端口（ -1 表示自增端口，从 20880 开始）
* dubbo.registry.address  # 注册中心地址


## Spring Cloud Gateway（网关）

分布式时代，一个复杂的系统被拆分为若干个微服务系统，每个系统都配置独立的域名肯定不合适。为了解决这个问题，网关便诞生了。

网关充当反向代理的角色，作为流量的第一入口，承载了很多基础的、公共的模块功能，如：流控、鉴权、监控、路由转发等。

<div align="left">
    <img src="https://offercome.cn/images/spring/springcloud/5-5.jpg" width="600px">
</div>

Spring Cloud 生态早期的网关是 Netflix 公司的Zuul，后来Zuul社区停止了维护。官方后来推出了 Spring Cloud Gateway，**其底层是基于 WebFlux 框架**，而WebFlux框架的底层采用高性能通讯框架 Netty，性能是 Zuul 的 1.6 倍。

**核心组件：**

1、路由。

内部主要是负责转发规则。

2、断言（Predicate）

如果返回为true，当前路由才有效，才会路由到具体的服务。官方提供了很多`内置路由断言`，如果满足不了你的诉求，也可以`自定义路由断言工厂`。

所有的路由断言工厂都是继承自 `AbstractRoutePredicateFactory`，自定义类的命名也有固定规则，`“配置名”+RoutePredicateFactory`。这样，在yaml配置时，只需要写`前面定义的配置名`即可。

3、过滤器（Filter）

主要是请求、响应之间增加一些自定义的逻辑。按作用范围分为：全局和局部。全局是作用于所有的路由；而局部只是作用于某一个路由。

跟上面的断言类似，除了官方提供的过滤器，也支持自定义。

**局部过滤器**：继承自 `AbstractGatewayFilterFactory`，自定义类的命名也有固定规则，`“配置名”+GatewayFilterFactory`。这样，在yaml配置时，只需要写`前面定义的配置名`即可。

**全局过滤器**：实现`GlobalFilter`,`Ordered` 两个接口，实现逻辑跟上面的局部过滤器类似。这里就不展开了。其中的 `Ordered` 接口主要是负责优先级，数值越小，优先级越高。


**依赖包：**

```
<dependency>
	<groupId>org.springframework.cloud</groupId>
	<artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

**yaml 的配置示例：**

```
spring:
  cloud:
    gateway:
      routes:  #路由，可配置多个
        - id: user_route  # 路由id 唯一即可，默认是UUID
          uri: lb://user-server-sample # 匹配成功后提供的服务的地址
          order: 1 # 路由优先级，数值越小优先级越高，默认0
          predicates:
            - Path=/user/**  # 断言，路径匹配进行路由
         #  - User=0, 1000   # 自定义路由断言工厂  只允许查询id为0 - 1000之间的用户
         #  - Method=POST    # 表示需要POST方式请求
         #  - Query=id, \d+  # 参数名id，正则表达式为\d+（一个或多个数字）
          filters:
            - AddRequestHeader=X-Request-token, 12345678  #为原始请求加上请求头及值
          	
```

当然，服务提供方的地址可能经常变化，为了动态感知，我们引入 Nacos 注册中心，用于服务的注册、发现，统一管理服务的IP地址。网关路由转发时，只需从 Nacos 动态获取即可。



## Sentinel（熔断、限流、降级）

Sentinel 是阿里开源的流控框架，提供了简单易用的控制台，比 `Hystrix`支持的范围更广。

集成简单，只需要少量配置，即可快速接入，支持如：gRPC、Dubbo、Spring Cloud 等

**同类竞品框架：** 

* Hystrix 框架已经停止维护；
* Resilience4j 一种轻量级容错库，专为 Java 8 和函数式编程而设计。通过装饰器的方式，以使用断路器，速率限制器，重试或隔板来增强任何功能接口，lambda 表达式或方法引用。

**流控规则：**

页面元素介绍：

* 资源名：唯一即可
* 针对来源：对调用者限流，填写应用名称（Spring.application.name的值），只针对某个服务限流
* 阈值类型
	* QPS：每秒接收的请求数
	* 线程数：能使用的业务线程数
* 流控模式
	* 直接：达到条件后，直接执行某个流控效果
	* 关联：如果访问关联接口B达到了阈值，则让接口A返回失败
	* 链路：记录从入口资源的流量，达到条件也只限流入口资源
* 流控效果
	* 快速失败：直接返回失败结果
	* Warm Up：预热，开始有一个缓冲期，初始值 = 阈值/ codeFactor(默认 3)，然后慢慢达到设置的阈值
	* 排队等待：让请求以均匀的速度通过，如果请求超过阈值就等待，如果等待超时则返回失败

**降级规则：**

* RT
* 异常数
* 异常比例

**系统规则：**

流控规则和降级规则是针对某个资源来说的，而系统规则是针对整个应用的，粒度更大，当前所有的接口服务都会应用这个系统规则。

**授权规则：**

根据调用方判断调用的接口资源是否被允许，如：黑名单、白名单机制

**热点规则：**

将粒度进一步细化，可以针对方法的参数做规则控制，为每个参数设置单独的阈值，也可以多个参数组合。从而实现单个方法的热点流量，按业务需求进一步控制。

**@SentinelResource注解**

`@SentinelResource` 注解可以根据实际情况定制化功能，跟 `Hystrix` 的 `@HystrixCommand` 注解功能类似。达到阈值后，系统的默认提示是一段英文，很不友好，所以我们要`自定义兜底方法`。

```
// 资源名称为handle1 
@RequestMapping("/handle1")
@SentinelResource(value = "handle1", blockHandler = "blockHandlerTestHandler")
public String handle1(String params) { 
    // 业务逻辑处理
    return "success";
}

// 接口方法 handle1 的 兜底方法
public String blockHandlerTestHandler(String params, BlockException blockException) {
    return "兜底返回";
}
```

注意：`@SentinelResource`注解中，除了`blockHandler`字段外，还有`fallback`字段

* `blockHandler`：主观层面，如果被限流，则调用该方法，进行兜底处理
* `fallback`：对业务的异常兜底，比如，执行过程中抛了各种`Exception`，则调用该方法，进行兜底处理

通过上面两层兜底，可以让`Sentinel` 框架更加人性化，体验更好。

**集群流控：**

单机限流很容易做，但是互联网很多应用都是集群部署，毕竟其下游还挂载着 mysql、或者其他微服务，为了防止对下游的大流量冲击，采用集群流控。防止单机的流量不均匀， 理想下 QPS = 单机阈值 * 节点数



## Seata（分布式事务）

事务的原子性和持久性可以确保在一个事务内，更新多条数据，要么都成功，要么都失败。在一个系统内部，我们可以使用数据库事务来保证数据一致性。那如果一笔交易，涉及到跨多个系统、多个数据库的时候，用单一的数据库事务就没办法解决了，此时需要引入分布式事务

Seata 是一款开源的分布式事务解决方案，致力于提供高性能和简单易用的分布式事务服务。Seata 将为用户提供了 AT、TCC、SAGA 和 XA 事务模式，默认 AT 模式 ，为用户打造一站式的分布式解决方案。

**优点：**

* 对业务无侵入：即减少技术架构上的微服务化所带来的分布式事务问题对业务的侵入
* 高性能：减少分布式事务解决方案所带来的性能消耗

<div align="left">
    <img src="https://offercome.cn/images/spring/springcloud/5-6.jpg" width="600px">
</div>

**Seata有3个基本组成部分**：

* 事务管理器（TM）：定义全局事务的范围：开始全局事务，提交或回滚全局事务。

* 事务协调器（TC）：维护全局事务和分支事务的状态，驱动全局提交或回滚。

* 资源管理器（RM）：管理正在处理的分支事务的资源，与TC对话以注册分支事务并报告分支事务的状态，并驱动分支事务的提交或回滚。

**运行流程**：

* TM 向 TC 申请开启一个全局事务，全局事务创建成功并生成一个全局唯一的 XID
* XID 在微服务调用链路的上下文中传播
* RM 向 TC 注册分支事务，TC 返回分支事务ID ，并将其纳入 XID 对应全局事务的管辖
* RM 执行本地业务表操作，并记录 `undo_log` 日志，提交本地事务
* 当所有的 RM 都执行完后，TM 向 TC 发起针对 XID 的全局提交或回滚决议
* TC 调度 XID 下管辖的全部分支事务完成提交或回滚请求。如果提交，删除 `undo_log` 日志就可以了。如果是回滚，根据 `undo_log` 表记录逆向回滚本地事务，把数据还原，最后再删除 `undo_log` 日志。

**关于 Seata 之前写过很多文章，这里就不展开了，感兴趣可以看看**

* [业务无侵入框架Seata， 解决分布式事务问题](https://mp.weixin.qq.com/s/cBX8G1Dpmue1m7GfMtYl7A)
* [深度剖析 Seata TCC 模式【图解 + 源码分析】](https://mp.weixin.qq.com/s/lYtG-TC1nWaUeZ1gfUifRA)
* [七种分布式事务的解决方案，一次讲给你听](https://mp.weixin.qq.com/s/GQcJMhjWCwaY5_IeM0oWvg)


## Spring Cloud Stream （异步消息）

Spring Cloud Stream 是统一消息中间件编程模型的框架，屏蔽了底层消息中间件的差异。支持的MQ 框架有 `RabbitMQ`、`Kafka`、`RocketMQ` 等

**常用注解：**

* @Input：标记为输入信道，消费消息
* @Output：标记为输出信道，生产消息
* @StreamListener：监听某个队列，接收消息，处理自身的业务逻辑
* @EnableBinding：绑定通道

**依赖包：**

```
<dependency>
	<groupId>com.alibaba.cloud</groupId>
	<artifactId>spring-cloud-starter-stream-rocketmq</artifactId>
</dependency>
```

**绑定通道：**

```
@SpringBootApplication
@EnableBinding({CustomSource.class})
public class StreamProduceApplication {
	public static void main(String[] args) {
		SpringApplication.run(StreamProduceApplication.class, args);
	}
}
```

**定义输出信道：**

```
public interface CustomSource {
    @Output("output1")
    MessageChannel output1();
}
```

**yaml 配置：**

```
spring:
  cloud:
    stream:
      rocketmq:
        binder:
          name-server: 127.0.0.1:9876 # rocketMq服务地址
        bindings:
          output1:
            producer:
              transactional: true    # 事务
              group: myTxProducerGroup    # 事务分组
      bindings:
        output1:
          destination: test-transaction-topic # 主题
          content-type: application/json # 数据类型
```

**发送消息：**

```
@Service
public class SendMessageService {
    @Resource
    private CustomSource customSource;

    public String sendMessage() { //发送简单字符串消息的方法
        String message = "字符串测试消息";
        // 发送消息
		customSource.output1().send(MessageBuilder.withPayload(message).build());         
		return "发送成功！";
    }
}
```


## SkyWalking（分布式链路追踪）

SkyWalking 是 一款 APM（应用性能监控）系统，专为微服务、云原生架构、容器（Docker、k8s、Mesos）而设计。通过探针收集应用的指标，进行分布式链路追踪，**感知服务间的调用链路关系**。

**特性：**

* 支持告警
* 采用探针技术，**代码零侵入**
* 轻量高效，不需要大数据平台
* 多个语言自动探针。包括 Java，.NET Core 和 Node.JS。
* 强大的可视化后台

<div align="left">
    <img src="https://offercome.cn/images/spring/springcloud/5-7.jpg" width="600px">
</div>

* 上部分 Agent ：负责从应用中，收集链路信息，发送给 SkyWalking OAP 服务器。目前支持 SkyWalking、Zikpin、Jaeger 等提供的 Tracing 数据信息。而我们目前采用的是，SkyWalking Agent 收集 SkyWalking Tracing 数据，传递给服务器。
* 下部分 SkyWalking OAP ：负责接收 Agent 发送的 Tracing 数据信息，然后进行分析(Analysis Core) ，存储到外部存储器( Storage )，最终提供查询( Query )功能。
* 右部分 Storage ：Tracing 数据存储。目前支持 ES、MySQL、Sharding Sphere、TiDB、H2 多种存储器。**而我们目前采用的是 ES** ，主要考虑是 SkyWalking 开发团队自己的生产环境采用 ES 为主。
* 左部分 SkyWalking UI ：负责提供控台，查看链路等等。


SkyWalking 部署起来还是很简单的，apache官网直接下载并解压即可。

> https://skywalking.apache.org/

SkyWalking 快速入门手册：

> https://skywalking.apache.org/zh/2020-04-19-skywalking-quick-start/



## XXL-JOB（分布式任务调度）

关于定时任务，相信大家都不陌生。但是单节点的定时任务有很多不足：

* 不支持集群，如果同时部署多个节点，会竞争数据，造成数据重复
* 如果是单节点，宕机后，任务无法自动感知、重启
* 不支持任务失败重试
* 不支持执行时间的动态调整
* 无报警机制
* 无任务数据统计功能
* 不支持数据分片

无论是集群化，还是周边的生态建设，都不完备。 而 XXL-JOB，可以完美解决这些问题。

XXL-JOB 是一款分布式任务调度框架，依赖的组件少（仅依赖 Java 和 MySQL），开箱即用。并提供了可视化界面，统计任务数据，动态修改任务执行时间，内置邮件报警，支持任务分片和任务失败重试。

**核心模块：**

1、调度中心

本身不执行业务逻辑，只负责向执行器发送调度命令。

2、执行器

接收调度中心的请求，并执行业务逻辑。

**依赖包：**

```
<dependency>
	<groupId>com.xuxueli</groupId>
	<artifactId>xxl-job-core</artifactId>
	<version>2.2.0</version>
</dependency>
```

**yaml 配置：**

```
server:
  port: 8082  #程序端口
xxl:
  job:
    admin:
      addresses: http://127.0.0.1:8002/xxl-job-admin  # 调度中心地址，多个用逗号分开
    accessToken:  # 调度中心和执行器通信的token，如果设置，两边要一样
    executor:
      appname: xxl-job-executor-sample  #执行器名称
      address:   # 执行器地址，默认使用xxl.job.executor.address配置项，如果为空，则使用xxl.job.executor.ip + xxl.job.executor.port
      ip:   # 执行器IP
      port: 9989  #执行器端口，与调度中心通信的端口
      logpath: D:/work/Spring-Cloud-Alibaba/sample/logs # 日志保存路径
      logretentiondays: 30 # 日志保留天数
```

**XxlJobSpringExecutor 初始化：**

```
@Bean
public XxlJobSpringExecutor xxlJobExecutor() { // XXL-JOB执行器初始化
    XxlJobSpringExecutor xxlJobSpringExecutor = new XxlJobSpringExecutor();
    xxlJobSpringExecutor.setAdminAddresses(adminAddresses);
    xxlJobSpringExecutor.setAppname(appname);
    xxlJobSpringExecutor.setAddress(address);
    xxlJobSpringExecutor.setIp(ip);
    xxlJobSpringExecutor.setPort(port);
    xxlJobSpringExecutor.setAccessToken(accessToken);
    xxlJobSpringExecutor.setLogPath(logPath);
    xxlJobSpringExecutor.setLogRetentionDays(logRetentionDays);
    return xxlJobSpringExecutor;
}
```

我们可以采用 `BEAN` 模式， 使用 `@XxlJob` 注解描述代码。优点：适用于一些复杂的业务场景。

也可以采用 `GLUE` 模式，将 `执行代码` 托管到调度中心在线维护。优点：简单快捷，不需要单独的业务工程。

如果要处理的数据量较大时，我们可以采用`分片`处理机制，将任务均摊到每个节点，从而减轻单个节点的压力。

```
shardingVO.getIndex() # 当前执行器的分片序号（从0开始）
shardingVO.getTotal() # 总分片数，执行器集群的数量

# dataSource 待处理的所有原始数据
for (Integer val : dataSource) { // 遍历代理
    if (val % shardingVO.getTotal() == shardingVO.getIndex()) { // 取余
        //TODO 归属于当前分片处理
    } 
}  
```

XXL-JOB 快速入门手册：

> https://www.xuxueli.com/xxl-job/


## 巨人肩膀

《Spring Cloud Alibaba 微服务实战》


## 参考资料

* [Keepalived+Nginx部署方案](https://help.fanruan.com/finereport/doc-view-2905.html)






