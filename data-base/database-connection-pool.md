## 数据库连接池

---

### SQL生命周期：

1. 应用服务器与数据库服务器建立一个连接
2. 数据库进程拿到请求sql
3. 解析并生成执行计划，执行
4. 读取数据到内存并进行逻辑处理
5. 通过步骤一的连接，发送结果到客户端
6. 关掉连接，释放资源


其中的连接在里面发挥着重大作用，但频繁的创建和销毁，非常浪费系统资源。由于数据库更适合长连接，也就有个连接池，能对连接复用，维护连接对象、分配、管理、释放，也可以避免创建大量的连接对DB引发的各种问题；另外通过请求排队，也缓解对DB的冲击。



连接池在初始化时创建MIN个连接。如果有业务请求，而此时没有空闲的管道，如果没有达到MAX连接数，无需等待，会申请创建一个新的连接。如果已经达到MAX，只能排队等待，等待的时间取决于block-timeout，如果超过等待时间没有拿到连接，抛拿不到连接的异常。

		

### 推荐开源框架：

Druid首先是一个数据库连接池，但它不仅仅是一个数据库连接池，它还包含一个ProxyDriver，一系列内置的JDBC组件库，一个SQL Parser。

[https://mp.weixin.qq.com/s/SRB0yruUIdmG9z8lXnJ-Ag](https://mp.weixin.qq.com/s/SRB0yruUIdmG9z8lXnJ-Ag)

**附加功能**：

* 监控，比如打印每一条sql详情，统计慢sql
* 统计，sql调用次数、时间等
* 安全，比如防御SQL注入攻击，数据库密码加密等
* 支持spring boot

```
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.0.9</version>
</dependency>
````

```
 <bean id="bbsShardingDataSource" class="com.alibaba.druid.pool.DruidDataSource" init-method="init" destroy-method="close"
          p:url="${jdbc.bbs.sharding.url}"
          p:username="${jdbc.bbs.sharding.username}"
          p:password="${jdbc.bbs.sharding.password}"
          p:initialSize="1"
          p:minIdle="1"
          p:maxActive="20"
          p:maxWait="60000"
          p:timeBetweenEvictionRunsMillis="60000"
          p:minEvictableIdleTimeMillis="300000"
          p:validationQuery="SELECT 'x'"
          p:testWhileIdle="true"
          p:testOnBorrow="false"
          p:testOnReturn="false"
          p:poolPreparedStatements="false"
          p:maxPoolPreparedStatementPerConnectionSize="20"
          p:connectionProperties="config.decrypt=true"
          p:filters="stat,config">
    </bean>

```



接口文档注释：

http://tool.oschina.net/apidocs/apidoc?api=druid0.26


### 其它

* [数据库连接池极简教程](https://mp.weixin.qq.com/s/tLysIX9KChNioJ-fMMimxw)

* [阿里巴巴开源项目 Druid 负责人温少访谈](http://www.iteye.com/magazines/90)


