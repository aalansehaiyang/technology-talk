---
title: Spring Boot 集成 Mybatis
---

# Spring Boot 集成 Mybatis

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学

`Spring Boot 作为主流微服务框架，拥有成熟的社区生态。市场应用广泛，为了方便大家，整理了一个基于spring boot的常用中间件快速集成入门系列手册，涉及RPC、缓存、消息队列、分库分表、注册中心、分布式配置等常用开源组件，大概有几十篇文章，陆续会开放出来，感兴趣同学可以关注&收藏`


## 1、简介

MyBatis 是一款优秀的持久层框架，它支持自定义 SQL、存储过程以及高级映射。MyBatis 免除了几乎所有的 JDBC 代码以及设置参数和获取结果集的工作。MyBatis 可以通过简单的**xml 文件 或注解**来配置和映射原始类型、接口和 Java POJO（Plain Old Java Objects，普通老式 Java 对象）为数据库中的记录。

与其他的ORM框架不同，mybatis没有将java对象与数据库表关联起来，而是将java方法与sql语句关联。允许用户充分利用数据库的各种功能。

与JDBC相比，mybatis简化了代码，sql语句在一行代码中就能执行。mybatis支持声明式缓存，当一条sql被标记为`可缓存`后，首次执行sql从数据库查询的数据会被存储到一个高速缓存中，后面再执行这条语句就会从高速缓存中读取结果，而不是再次查询数据库。Mybatis除了基于默认的HashMap的缓存实现，还支持OSCache、Ehcache、Memcached等扩展缓存。

## 2、依赖集成

**首先添加mybatis 的spring boot start组件，引入pom依赖**

```
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>1.3.0</version>
</dependency>
```

**包依赖关系：**

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/1-1.jpg" width="800px">
</div>


通过IDEA的maven插件可以查看到pom的依赖关系，Spring Boot 2默认数据库连接池选择了HikariCP。

HiKariCP是数据库连接池的一个后起之秀，号称性能最好，可以完美地PK掉其他连接池，是一个高性能的JDBC连接池，基于BoneCP做了不少的改进和优化。但代码体积比较小，只有130kb。

**HikariCP与Druid相比哪个更好？**

Druid是阿里巴巴开源的“为监控而生的数据库连接池！”。 性能测试过程略低于HikariCP，但是提供了强大的监控和扩展功能。支持psCache。


> 更多的内容比较可以参考：
> <br/> https://github.com/brettwooldridge/HikariCP/issues/232


**另外的数据库驱动需要我们自己手动引入，具体的pom依赖**

```
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```

## 3、代码演示

**配置数据源**

数据源在 `application.yaml` 文件中的配置前缀为 `spring.datasource`，hikari连接池的配置通过`spring.datasource.hikari`进行配置，具体配置如下：

```
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://127.0.0.1:3306/ds0?characterEncoding=utf-8
    username: root
    password: 111111
    # Hikari config
    type: com.zaxxer.hikari.HikariDataSource
    hikari:
      minimum-idle: 10
      maximum-pool-size: 200
      idle-timeout: 60000
      pool-name: MarketingHikariCP
      max-lifetime: 1800000
      connection-timeout: 2000
      connection-test-query: select 1
```

> 数据库驱动早期使用 com.mysql.jdbc.Driver已经标记为过时，现在请使用com.mysql.cj.jdbc.Driver。

**mybatis 相关配置**

mybatis的配置比较少，主要是 `实体类、*Mapper接口、*Mapper.xml、mybatis的一些框架扩展配置`

增删改查数据库的sql语句的XML文件，我们放在`resources `下的`mappers`文件夹中，编译后就是类路径下的`mappers`文件夹中，所以需要在`application.yaml`进行如下配置

```
mybatis:
  config-location: classpath:config/mybatis-config.xml
```

对应的`User.xml`文件内容：

```
<mapper namespace="com.weiguanjishu.domain.mapper.UserMapper">

    <resultMap id="userResultMap" type="com.weiguanjishu.domain.model.User">
        <result column="id" property="id"/>
        <result column="user_name" property="userName"/>
        <result column="age" property="age"/>
        <result column="address" property="address"/>
    </resultMap>

    <!-- 插入用户 -->
    <insert id="addUser" parameterType="com.weiguanjishu.domain.model.User">

        <selectKey resultType="java.lang.Long" keyProperty="id" order="AFTER">
            SELECT LAST_INSERT_ID()
        </selectKey>

        insert into user (user_name,age,address )
        VALUES ( #{userName}, #{age}, #{address} )
    </insert>

省略内容。。。

```

如果你想要打印每次请求的`SQL语句`，只需要声明Mapper接口包的日志级别为`DEBUG `就可以了

```
logging:
  level:
    com.weiguanjishu.domain.mapper: debug
```

## 4、sql 注解方式

sql语句除了放在xml文件中，mybatis也支持注解方式，将SQL语句直接写在接口上，如：` @Insert 、@Update 、 @Delete 、@Select 、 @Results` 等。

@Select、@Insert、@Update以及@Delete四个注解分别对应XML中的select、insert、update以及delete标签，@Results注解类似于XML中的ResultMap映射文件。

```
@Mapper
public interface PromotionShopMapper {

    String PROMOTION_SHOP_RESULT_MAP = "promotionShopResultMap";

    @Insert({
            "insert into promotion_shop (promotion_id,shop_id,shop_type,create_time,update_time,is_deleted) ",
            "values (#{promotionId},#{shopId},#{shopType},now(),now(),0)"
    })
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(PromotionShopDO record);

    @Select("select * from promotion_shop where promotion_id = #{promotionId} and is_deleted = 0")
    @Results(id = PROMOTION_SHOP_RESULT_MAP, value = {
            @Result(column = "id", property = "id"),
            @Result(column = "promotion_id", property = "promotionId"),
            @Result(column = "shop_id", property = "shopId"),
            @Result(column = "shop_type", property = "shopType"),
            @Result(column = "create_time", property = "createTime"),
            @Result(column = "update_time", property = "updateTime"),
            @Result(column = "is_deleted", property = "isDeleted")
    })
    List<PromotionShopDO> queryByPromotionId(@Param("promotionId") long promotionId);

    @Insert("<script>"
            + "insert into promotion_shop"
            + " ("
            + " promotion_id,shop_id,shop_type,create_time,update_time,is_deleted"
            + " )"
            + " values"
            + " <foreach collection='list' item='record' index='index' separator=','> "
            + " (#{record.promotionId},#{record.shopId},#{record.shopType},now(),now(), 0)"
            + " </foreach>"
            + " </script>")
    int insertBatch(@Param("list") List<PromotionShopDO> list);

}
```

优点：直观，效率高。

缺点：当sql有变化时需要重新编译代码，一般情况不建议使用注解方式。




## 5、项目源码

```
https://github.com/aalansehaiyang/spring-boot-bulking  

模块：spring-boot-bulking-mybatis
```
