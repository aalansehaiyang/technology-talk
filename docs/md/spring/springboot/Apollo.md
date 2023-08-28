---
title: 分布式配置中心选型，为什么选择 Apollo？
---

# 分布式配置中心选型，为什么选择 Apollo？

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学


`Spring Boot 作为主流微服务框架，拥有成熟的社区生态。市场应用广泛，为了方便大家，整理了一个基于spring boot的常用中间件快速集成入门系列手册，涉及RPC、缓存、消息队列、分库分表、注册中心、分布式配置等常用开源组件，大概有几十篇文章，陆续会开放出来，感兴趣同学可以关注&收藏`


## 简介

关于配置的常规方案是将配置信息抽离写入 `xml`、`properties`文件中，然后随着应用一块打包发布。如果有开发、测试、预发、生产等多套环境，则通过配置各自独立的文件以区分不同的环境。**具备一定的扩展性，但每次配置参数变更都要重新发布应用，灵活性较差。**

例如：淘宝每年都要举办双十一活动，带来上千亿的GMV，流量非常大。为了系统的稳定性，通常会做各种演练演习、压测，制定上千个降级预案。如果遇到突发情况，要打开哪个开关，启动对应的紧急处理措施。如果按上面的玩法，每次都要走一次发布流程，一个集群上千台服务器，发布完了，半个小时也没了，这的损失多少钱。

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/11-2.jpg" width="500px">
</div>

**资损先不算了，但是你的年度考核 3.25 肯定是没得跑了，年终奖泡汤，赢取白富美，走上人生巅峰。。。。兄弟醒醒。。。**

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/11-4.jpg" width="600px">
</div>

学学人家德芙，能不能搞个丝滑般的 `Features` ，不用走发布流程，也能动态感知配置变更

**此时我们需要一个中间件框架，分布式配置中心。**


### 框架选型

工作这么多年，大大小小，各种开源的分布式配置框架有下面几个：

1、Apollo

> 2016年5月，携程开源的配置管理中心，具备规范的权限、流程治理等特性。

2、Spring cloud config

> 2014年9月开源，Spring Cloud 生态组件，可以和Spring Cloud体系无缝整合。

3、disconf

> 2014年7月百度开源的配置管理中心，同样具备配置的管理能力，不过目前已经不维护了，最近的一次提交是两年前了。

4、Nacos

> 2018年6月，阿里开源的配置中心，也可以做DNS和RPC的服务发现。

5、Diamond

> Diamond 出自淘宝，开源地址 【https://github.com/takeseem/diamond】 目前已经维护了，这里就不展开了。其他几个框架的功能特性做下比较：

|功能特性|重要性|spring-cloud-config| Apollo  |disconf |Nacos
|---|---|---|---|---|----|
|静态配置管理|	高	|基于file|	支持	|支持|支持
|动态配置管理	|高	|支持|	支持	|支持|支持
|统一管理	|高|	无，需要github|	支持	|支持|支持
|多环境	|中|	无，需要github	|支持|	支持|支持
|本地配置缓存|	高	|无	|支持	|支持|	支持	
|配置锁	|中	|支持|	不支持|	不支持|	不支持
|配置校验|	中|	无|	无	|无	|无	
|配置生效时间	|	高|重启生效，或手动refresh生效|实时|实时|实时
|配置更新推送	|高	|需要手工触发|	支持|	支持|支持
|配置定时拉取	|高|	无	|支持|	配置更新目前依赖事件驱动， client重启或者server端推送操|支持
|用户权限管理	|中	|无，需要github	|支持	|支持|支持
|授权、审核、审计|	中|	无，需要github	|支持|	无|支持
|配置版本管理	|高	|Git做版本管理|界面上直接提供发布历史和回滚按钮|操作记录有落数据库，但无查询接口	|界面操作，支持回滚|
|配置合规检测	|高	|不支持	|支持（但还需完善）	||支持|
|实例配置监控|	高	|需要结合spring admin|	支持|支持，可以查看每个配置在哪些机器上加载|支持
|灰度发布|	中	|不支持	|支持|	不支持部分更新|支持
|告警通知	|中	|不支持|	支持，邮件方式告警|	支持，邮件方式告警|支持

Nacos配置文件支持比较多的格式，支持yaml、text、json、xml、html、Properties，apollo只支持xml、text、Properties的格式，没有兼容spring boot中比较通用的yaml配置。虽然 Nacos支持多格式的配置文件，但是解析上没有Apollo做的好，Apollo虽然支持的配置格式较少，不过会进行解析，使每个配置看起来比较直观，修改的时候比较直观，可以对单个进行修改。

Apollo用户管理以及权限管理做的比较好和全面，适合做部门或者公司级的配置中心。Nacos比较简洁，权限这块偏弱。Apollo 的社区生态活跃，github最近一次提交是在2021年4月11日，另外使用的公司特别多，常见的坑基本都被踩完了。


<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/11-5.jpg" width="700px">
</div>


当然Nacos作为后起之秀，又有阿里做背书，目前市场活跃度也非常高，大家可以结合自家情况选择，如果稳妥可以选择Apollo

## Apollo 介绍

Apollo（阿波罗）是携程框架部门研发的分布式配置中心，能够集中化管理应用不同环境、不同集群的配置，配置修改后能够实时推送到应用端，并且具备规范的权限、流程治理等特性，适用于微服务配置管理场景。

Apollo包括服务端和客户端两部分：

服务端基于`Spring Boot`和`Spring Cloud`开发，打包后可以直接运行，不需要额外安装`Tomcat`等应用容器。

Java客户端不依赖任何框架，能够运行于所有Java运行时环境，同时对`Spring`、`Spring Boot`环境也有较好的支持。

> 开源地址： https://github.com/ctripcorp/apollo


## 特性

基于配置的特殊性，Apollo在设计之初就立志于成为一个有治理能力的配置发布平台，目前提供了以下的特性：

* 统一管理不同环境、不同集群的配置
* 配置修改实时生效（热发布）
* 版本发布管理
* 灰度发布
* 权限管理、发布审核、操作审计
* 客户端配置信息监控
* 提供Java和.Net原生客户端
* 提供开放平台API
* 部署简单


## 代码演示

### 外部依赖

在 pom.xml 文件中添加 Apollo 依赖：

```
<dependency>
    <groupId>com.ctrip.framework.apollo</groupId>
    <artifactId>apollo-client</artifactId>
    <version>1.4.0</version>
</dependency>
```

### 配置文件

在配置文件 application.yaml 中配置 Pulsar 的相关参数，具体内容如下：

```
apollo:
  meta: http://127.0.0.1:8080
  bootstrap:
    enabled: true
app:
  id: spring-boot-bulking-apollo
```

### 实时动态感知配置变更

```
@Component
public class ApolloConfig {

    private static final String USER_TIMEOUT = "user.timeout";

    @PostConstruct
    public void init() {
        Config config = ConfigService.getAppConfig();
        config.addChangeListener(changeEvent -> {
            ConfigChange configChange = changeEvent.getChange(USER_TIMEOUT);
            PropertyChangeType changeType = configChange.getChangeType();
            if (PropertyChangeType.ADDED.equals(changeType) || PropertyChangeType.MODIFIED
                    .equals(changeType)) {
                System.out.println(String.format("动态刷新的新值。key:%s  ， 值：%s", USER_TIMEOUT, configChange.getNewValue()));
            }
        }, Sets.newHashSet(USER_TIMEOUT));

        String userTimeoutValue = config.getProperty(USER_TIMEOUT, null);
        System.out.println(String.format("首次拉取。key:%s  ， 值：%s", USER_TIMEOUT, userTimeoutValue));
    }
}

```

## 管理后台

### 控制台地址

http://localhost:8070/config.html?#/appid=spring-boot-bulking-apollo

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/11-1.jpg" width="700px">
</div>

控制台多次修改`user.timeout`的值，客户端系统能实时接收到配置变更。

```
首次拉取。key:user.timeout  ， 值：1000
动态刷新的新值。key:user.timeout  ， 值：500
动态刷新的新值。key:user.timeout  ， 值：1000
动态刷新的新值。key:user.timeout  ， 值：500
动态刷新的新值。key:user.timeout  ， 值：1000
```

## 项目源码

```
https://github.com/aalansehaiyang/spring-boot-bulking  

模块：spring-boot-bulking-apollo
```

