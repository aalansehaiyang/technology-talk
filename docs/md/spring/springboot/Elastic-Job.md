---
title: Spring Boot 集成 Elastic-Job
---

# Spring Boot 集成 Elastic-Job

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学


`Spring Boot 作为主流微服务框架，拥有成熟的社区生态。市场应用广泛，为了方便大家，整理了一个基于spring boot的常用中间件快速集成入门系列手册，涉及RPC、缓存、消息队列、分库分表、注册中心、分布式配置等常用开源组件，大概有几十篇文章，陆续会开放出来，感兴趣同学可以关注&收藏`



## 简介

Elasticjob是一个开源的分布式调度解决方案。Elasticjob由两个相互独立的子项目Elastic-Job-Lite和Elastic-Job-Cloud组成。Elastic-Job-Lite定位为轻量级无中心化解决方案，使用jar包的形式提供分布式任务的协调服务；Elastic-Job-Cloud采用自研 Mesos Framework的解决方案，额外提供资源治理、应用分发以及进程隔离等功能。

Elastic-Job-Lite，它支持多种任务类型，支持任务分片，可以将任务拆分成多个子任务，像原先介绍的Quartz集群方案中可能存在的任务处理的单机极限问题，可以利用Elastic-Job-Lite解决，可以通过预先分配分片项参数，任务分片后，每个分片任务只处理跟自己相关的分片数据，这样就可以将单机处理的数据，分散成多机处理，缓解压力。Elastic-Job还支持分片级别的故障切换，具有容错性，一个分片任务故障后，可以被其他机器的任务接管，继续执行分片任务。

## 代码演示

### 外部依赖

在 pom.xml 文件中添加 Elastic-Job 依赖：

```
<dependency>
    <groupId>com.dangdang</groupId>
    <artifactId>elastic-job-lite-core</artifactId>
    <version>2.1.5</version>
</dependency>

<dependency>
    <groupId>com.dangdang</groupId>
    <artifactId>elastic-job-lite-spring</artifactId>
    <version>2.1.5</version>
    <exclusions>
        <exclusion>
            <groupId>org.apache.curator</groupId>
            <artifactId>curator-client</artifactId>
        </exclusion>
    </exclusions>
</dependency>

```

### 配置文件

在配置文件 `application.yaml` 中配置 Elastic-Job 的相关参数，具体内容如下：

```
elasticjob:
  zk: 127.0.0.1:2181
  namespace: ej
```

### Elastic-Job 配置类

```
@Bean
public CoordinatorRegistryCenter regCenter() {
    CoordinatorRegistryCenter regCenter = new ZookeeperRegistryCenter(new ZookeeperConfiguration(zk, nameSpace));
    regCenter.init();
    return regCenter;
}

private LiteJobConfiguration getLiteJobConfiguration(final Class<? extends SimpleJob> jobClass, final String cron) {
    return LiteJobConfiguration.newBuilder(
            new SimpleJobConfiguration(JobCoreConfiguration
                    .newBuilder(jobClass.getSimpleName(), cron, 1)
                    .shardingItemParameters("1=1")
                    .build(), jobClass.getCanonicalName()))
            .overwrite(true)
            .build();
}

@Bean(initMethod = "init")
public JobScheduler createBrandActivityJobSchedule(final UserCountJob userCountJob, CoordinatorRegistryCenter regCenter) {
    return new SpringJobScheduler(userCountJob, regCenter,
            getLiteJobConfiguration(userCountJob.getClass(),
                    // 每10秒执行一次
                    "*/10 * * * * ? *"), new TimeStatisticsListener());
}

```

### 编写 Job 任务

框架预留扩展接口`com.dangdang.ddframe.job.api.simple.SimpleJob`，定义业务类`UserCountJob`，然后在`execute()` 方法中实现我们的业务逻辑。

```
@Slf4j
@Component
public class UserCountJob implements SimpleJob {

    @Override
    public void execute(ShardingContext shardingContext) {
        // 分片上下文参数
        System.out.println("ShardingContext：" + JSON.toJSONString(shardingContext));
        long userCount = 1200;
        System.out.println(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()) + " 用户注册数：" + userCount);
    }
}
```

## Elastic-Job 控制台

控制台地址：

http://localhost:8899/#

* 配置 zookeeper 注册中心

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/13-2.jpg" width="800px">
</div>


* 客户端系统启动时，会自动上报 Job 任务

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/13-1.jpg" width="800px">
</div>




## 项目源码

```
https://github.com/aalansehaiyang/spring-boot-bulking  

模块：spring-boot-bulking-elasticjob
```

