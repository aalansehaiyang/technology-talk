---
title: 数据库连接池为什么首选 Druid 
---

# 数据库连接池为什么首选 Druid ？

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学


`Spring Boot 作为主流微服务框架，拥有成熟的社区生态。市场应用广泛，为了方便大家，整理了一个基于spring boot的常用中间件快速集成入门系列手册，涉及RPC、缓存、消息队列、分库分表、注册中心、分布式配置等常用开源组件，大概有几十篇文章，陆续会开放出来，感兴趣同学可以关注&收藏`


## 1、简介

Druid是阿里巴巴的一个开源项目，**号称为监控而生的数据库连接池，在功能、性能、扩展性方面都超过其他**，例如 DBCP、C3P0、BoneCP、Proxool、JBoss、DataSource 等连接池，而且Druid已经在阿里巴巴部署了超过600个应用，通过了极为严格的考验，这才收获了大家的青睐！

**Druid是一个JDBC组件，包含三个部分：**

* DruidDriver 代理Driver，能够提供基于Filter－Chain模式的插件体系。
* DruidDataSource 高效管理的数据库连接池。
* SQLParser SQL语法分析


**强大的监控特性**

Druid内置了一个功能强大的`StatFilter`插件可以监控数据库访问性能，可以清楚知道连接池和SQL的工作情况。

监控SQL的执行时间、ResultSet持有时间、返回行数、更新行数、错误次数、错误堆栈信息。

SQL执行的耗时区间分布。什么是耗时区间分布呢？比如说，某个SQL执行了1000次，其中0-1毫秒区间50次，1-10毫秒800次，10-100毫秒100次，100-1000毫秒30次，1-10秒15次，10秒以上5次。通过耗时区间分布，能够非常清楚知道SQL的执行耗时情况。

监控连接池的物理连接创建和销毁次数、逻辑连接的申请和关闭次数、非空等待次数、PSCache命中率等。


**数据库密码加密**

直接把数据库密码写在配置文件中，容易导致安全问题。`DruidDriver`和`DruidDataSource`都支持`PasswordCallback`。

**SQLParser**

SQL Parser是Druid的一个重要组成部分，它提供了MySql、Oracle、Postgresql、SQL-92的SQL的完整支持，这是一个手写的高性能SQL Parser，支持Visitor模式，使得分析SQL的抽象语法树很方便。简单SQL语句用时10微秒以内，复杂SQL用时30微秒。

通过Druid提供的SQL Parser可以在JDBC层拦截SQL做相应处理，比如防御SQL注入（WallFilter）、合并统计没有参数化的SQL(StatFilter的mergeSql)、SQL格式化、分库分表。


## 2、依赖集成

在pom.xml中引入druid官方提供的Spring Boot Starter组件

```
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>1.1.21</version>
</dependency>
```

application.yaml 配置文件配置数据库信息、以及Druid的连接池

```
spring:
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    druid:
      driver-class-name: com.mysql.cj.jdbc.Driver
      url: jdbc:mysql://127.0.0.1:3306/ds0?characterEncoding=utf-8&useSSL=false
      username: root
      password: 111111
      initial-size: 5
      min-idle: 5
      max-active: 20
      max-wait: 60000
      time-between-eviction-runs-millis: 60000
      min-evictable-idle-time-millis: 300000
      validation-query: SELECT 'x'
      test-while-idle: true
      test-on-borrow: false
      test-on-return: false
      pool-prepared-statements: false
      max-pool-prepared-statement-per-connection-size: -1
      use-global-data-source-stat: true
      connection-properties: druid.stat.mergeSql=true;druid.stat.slowSqlMillis=5000
      filters: stat,wall,log4j

```

## 3、Druid 配置详解

|  配置  | 缺省值  |说明|
|  ----  | ----  |----|
| name	| | 如果存在多个数据源，监控的时候可以通过名字来区分开来。如果没有配置，将会生成一个名字，格式是：”DataSource-“ + System.identityHashCode(this)| 
| url	| |连接数据库的url，不同数据库不一样| 
| username| |连接数据库的用户名|
| password| | 连接数据库的密码。如果你不希望密码直接写在配置文件中，可以使用ConfigFilter| 
| driverClassName| | 	根据url自动识别	，这一项可配可不配，如果不配置druid会根据url自动识别dbType，然后选择相应的driverClassName| 
| initialSize| 	0	| 初始化时建立物理连接的个数。初始化发生在显示调用init方法，或者第一次getConnection时| 
| maxActive	| 8	| 最大连接池数| 
| minIdle	| | 最小连接池数| 
| maxWait	| | 获取连接时最大等待时间，单位毫秒。配置了maxWait之后，缺省启用公平锁，并发效率会有所下降，如果需要可以通过配置useUnfairLock属性为true使用非公平锁。| 
| poolPreparedStatements| 	false	| 是否缓存preparedStatement，也就是PSCache。PSCache对支持游标的数据库性能提升巨大，比如说oracle。在mysql下建议关闭。| 
| maxPoolPreparedStatementPerConnectionSize| -1| 要启用PSCache，必须配置大于0，当大于0时，poolPreparedStatements自动触发修改为true。在Druid中，不会存在Oracle下PSCache占用内存过多的问题，可以把这个数值配置大一些，比如说100| 
| validationQuery	| | 用来检测连接是否有效的sql，要求是一个查询语句，常用select ‘x’。如果validationQuery为null，testOnBorrow、testOnReturn、testWhileIdle都不会起作用。| 
| validationQueryTimeout	| | 单位：秒，检测连接是否有效的超时时间。底层调用jdbc Statement对象的void setQueryTimeout(int seconds)方法| 
| testOnBorrow	| true	| 申请连接时执行validationQuery检测连接是否有效，做了这个配置会降低性能。| 
| testOnReturn| 	false	| 归还连接时执行validationQuery检测连接是否有效，做了这个配置会降低性能。| 
| testWhileIdle	| false	| 建议配置为true，不影响性能，并且保证安全性。申请连接的时候检测，如果空闲时间大于timeBetweenEvictionRunsMillis，执行validationQuery检测连接是否有效。| 
| keepAlive| 	false （1.0.28）| 	连接池中的minIdle数量以内的连接，空闲时间超过minEvictableIdleTimeMillis，则会执行keepAlive操作。| 
| timeBetweenEvictionRunsMillis	| 1分钟（1.0.14）| 	有两个含义：1) Destroy线程会检测连接的间隔时间，如果连接空闲时间大于等于minEvictableIdleTimeMillis则关闭物理连接。2) testWhileIdle的判断依据，详细看testWhileIdle属性的说明| 
| numTestsPerEvictionRun	| 30分钟（1.0.14）| 不再使用，一个DruidDataSource只支持一个EvictionRun| 
| minEvictableIdleTimeMillis	| | 连接保持空闲而不被驱逐的最小时间| 
| connectionInitSqls	| | 物理连接初始化的时候执行的sql| 
| exceptionSorter| 	根据dbType自动识别 | 	当数据库抛出一些不可恢复的异常时，抛弃连接| 
| filters	| | 属性类型是字符串，通过别名的方式配置扩展插件，常用的插件有：监控统计用的filter:stat， 日志用的filter:log4j ， 防御sql注入的filter:wall| 
| proxyFilters	| | 类型是List，如果同时配置了filters和proxyFilters，是组合关系，并非替换关系| 

Druid提供以下几种Filter信息：


|别名	|Filter类名|
|---|---
|default|	com.alibaba.druid.filter.stat.StatFilter|
|stat	| com.alibaba.druid.filter.stat.StatFilter|
|mergeStat|	com.alibaba.druid.filter.stat.MergeStatFilter|
|encoding	|com.alibaba.druid.filter.encoding.EncodingConvertFilter|
|log4j	|com.alibaba.druid.filter.logging.Log4jFilter|
|log4j2|	com.alibaba.druid.filter.logging.Log4j2Filter|
|slf4j	|com.alibaba.druid.filter.logging.Slf4jLogFilter|
|commonlogging	|com.alibaba.druid.filter.logging.CommonsLogFilter
|wall	|com.alibaba.druid.wall.WallFilter|


## 4、Druid 监控

支持多种形式，本文列举的是java类创建Bean实例方式。

```
@Bean
public ServletRegistrationBean druidServlet() {
    logger.info("init Druid Servlet Configuration ");
    ServletRegistrationBean servletRegistrationBean = new ServletRegistrationBean();
    servletRegistrationBean.setServlet(new StatViewServlet());
    servletRegistrationBean.addUrlMappings("/druid/*");
    Map<String, String> initParameters = new HashMap<String, String>();
    initParameters.put("loginUsername", "admin");// 用户名
    initParameters.put("loginPassword", "admin");// 密码
    initParameters.put("resetEnable", "false");// 禁用HTML页面上的“Reset All”功能
    initParameters.put("allow", ""); // IP白名单 (没有配置或者为空，则允许所有访问)
    //initParameters.put("deny", "192.168.20.38");// IP黑名单 (存在共同时，deny优先于allow)
    servletRegistrationBean.setInitParameters(initParameters);
    return servletRegistrationBean;
}

@Bean
public FilterRegistrationBean filterRegistrationBean() {
    FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean();
    filterRegistrationBean.setFilter(new WebStatFilter());
    filterRegistrationBean.addUrlPatterns("/*");
    filterRegistrationBean.addInitParameter("exclusions", "*.js,*.gif,*.jpg,*.png,*.css,*.ico,/druid/*");
    return filterRegistrationBean;
}
```

也可以采用另一种方式，在`application.properties`中添加Druid的监控配置

```
# druid连接池监控
spring.datasource.druid.stat-view-servlet.login-username=admin
spring.datasource.druid.stat-view-servlet.login-password=admin

# 配置 StatFilter
spring.datasource.druid.filter.stat.log-slow-sql=true
spring.datasource.druid.filter.stat.slow-sql-millis=2000

# 排除一些静态资源，以提高效率
spring.datasource.druid.web-stat-filter.exclusions=*.js,*.gif,*.jpg,*.png,*.css,*.ico,/druid/*
```

配置完成后， 并完成相关的数据库操作配置， 启动Spring Boot应用程序。

访问Druid监控后台页面： `http://127.0.0.1:8090/druid/sql.html` ，

首先进入登录页，账号和密码在上面的配置项中

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/2-1.jpg" width="800px">
</div>

输入用户名：admin，密码：admin，可以看到详细的监控页面

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/2-3.jpg" width="800px">
</div>

首页会展示项目使用的 JDK 版本、数据库驱动、JVM 相关统计信息。根据上面的菜单可以看出 Druid 的功能非常强大，支持数据源、SQL 监控、SQL 防火墙、URI 监控等很多功能。

我们这里重点介绍一下 SQL 监控，具体的展示信息如下：

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/2-2.jpg" width="800px">
</div>

这里的 SQL 监控会将项目中具体执行的 SQL 打印出来，展示此 SQL 执行了多少次、每次返回多少数据、执行的时间分布是什么。这些功能非常的实用，方便我们在实际生产中查找出慢 SQL，最后对 SQL 进行调优。


## 5、项目源码

```
https://github.com/aalansehaiyang/spring-boot-bulking  

模块：spring-boot-bulking-druid
```
