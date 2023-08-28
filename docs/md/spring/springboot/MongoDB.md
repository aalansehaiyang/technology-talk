---
title: Spring Boot 集成 MongoDB
---

# Spring Boot 集成 MongoDB

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学


`Spring Boot 作为主流微服务框架，拥有成熟的社区生态。市场应用广泛，为了方便大家，整理了一个基于spring boot的常用中间件快速集成入门系列手册，涉及RPC、缓存、消息队列、分库分表、注册中心、分布式配置等常用开源组件，大概有几十篇文章，陆续会开放出来，感兴趣同学可以关注&收藏`



## 简介

MongoDB 是一个基于分布式文件存储的数据库，由 C++ 语言编写，旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。

MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。

MongoDB 最大的特点就是无 Schema 限制，灵活度很高。数据格式是 BSON，BSON 是一种类似 JSON 的二进制形式的存储格式，简称 Binary JSON 它和 JSON 一样，支持内嵌的文档对象和数组对象。

### 与关系型数据库概念比较

| Mysql | MongoDB |
|----|---|
|Database（数据库）	|Database（数据库）|
|Table（表）	|Collection（集合）|
|Row（行）	| Document（文档）|
|Column（列）|	Field（字段）|

MongoDB是一个独立的服务器。如MySQL或PostreSQL一样，MongoDB提供监听端口以便接入。它提供了用于查询，创建，更新和删除的工具。从理论上讲，你使用它的工作方式相同：连接，执行任务并关闭连接；

它是基于文档的，而不是基于表格的。MongoDB 将数据存储为一个文档，数据结构由键值(key=>value)对组成。MongoDB 文档类似于 JSON 对象。字段值可以包含其他文档，数组及文档数组；

它是非结构化的。MongoDB没有很多查询语句。在大多数情况下，只需给它一个数组指定你想要的信息，然后它会给你返回文档的数组。如果你想运行一些非常复杂的查询(如Map-Reduce操作)，可以向MongoDB传递JavaScript，其内部的JavaScript引擎可以解析这个脚本；

高性能、易部署、易使用，存储数据非常方便；
支持完全索引，包含内部对象；
它具有强大的主流开发语言支持，如C#、C++、Java、PHP、Perl、Python、Ruby。

### 优点

* 文档结构的存储方式，能够更便捷的获取数据；
* 内置GridFS，支持大容量的存储；
* 内置Sharding，分片简单；
* 海量数据下，性能优越；
* 支持复制集、主备、互为主备、自动分片等特性。

### 缺点

* 不支持事务操作；
* 磁盘空间占用比较大；
* MongoDB没有如MySQL那样成熟的维护工具；
* 无法进行关联表查询，不适用于关系多的数据；
* 复杂聚合操作通过map reduce创建，速度慢；
* 模式自由，自由灵活的文件存储格式带来的数据错误。

## 代码演示

### 外部依赖

Spring Boot 已经为 MongoDB 封装了starter组件，只需在 pom.xml 文件中添加jar版本依赖即可：

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>

```

### 配置文件

在配置文件 application.yaml 中配置 MongoDB 的相关参数，具体内容如下：

```
spring:
  application:
    name: spring-boot-bulking-mongo
  # 数据源配置
  data:
    mongodb:
      #主机地址
      host: 127.0.0.1
      #数据库名称
      database: tomge
      #端口号
      port: 27017

```

工程结构如图所示：

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/18-1.jpg" width="700px">
</div>

### 定义实体对象

```
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    @Id
    private Long id;
    private String name;
    private Integer age;
    @Field("locs")
    private Collection<Address> addresses = new LinkedHashSet<Address>();
}
```

> @Id 主键 不可重复，自带索引，可以在定义的列名上标注，需要自己生成并维护不重复的约束。如果自己不设置@Id主键，mongo会自动生成一个唯一主键，并且插入时效率远高于自己设置主键。在实际业务中不建议自己设置主键，应交给mongo自己生成，自己可以设置一个业务id，如int型字段，用自己设置的业务id来维护相关联的表。
> <br/> @Field 代表一个字段，可以不加，不加的话默认以参数名为列名。

### 数据访问层 UserRepository

```
public interface UserRepository extends MongoRepository<User, String> {

    User findByName(String name);

    /**
     * 小于：$lt
     * 小于或等于：$lte
     * 大于：$gt
     * 大于或等于：$gte
     * 不等于：$ne
     * 属于：$in
     */
    @Query("{'age': { '$lt' : ?0}}")
    List<User> withQueryFindByAge(Integer age);
}

```

`UserRepository` 接口继承 `MongoRepository `，默认提供很多实现，比如 CRUD 和列表查询参数相关的实现。`MongoRepository` 接口默认实现如下：

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/18-2.jpg" width="700px">
</div>

## 操作演示


运行工程，浏览器访问地址：

http://localhost:9071/queryByAge?age=27

```
[
  {
    "id": 112,
    "name": "TomGE",
    "age": 26,
    "addresses": [
      {
        "number": 1,
        "addressName": "上海"
      },
      {
        "number": 2,
        "addressName": "杭州"
      },
      {
        "number": 3,
        "addressName": "广州"
      },
      {
        "number": 4,
        "addressName": "苏州"
      }
    ]
  }
]
```

Navicat Premium 验证数据

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/18-3.jpg" width="700px">
</div>

也支持命令行的方式验证数据

```
# 进入mongon 容器实例
docker exec -it mongo mongo admin

#  显示库列表
show dbs

# 使用某个数据库
use tomge

# 显示所有表
show collections

# 如果存在 user 表，格式化显示 user 表内容：
db.user.find().pretty()

```
<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/18-4.jpg" width="500px">
</div>

## 项目源码

```
https://github.com/aalansehaiyang/spring-boot-bulking  

模块：spring-boot-bulking-mongo
```

## 参考资料

* [https://www.jianshu.com/p/157f9060753c](https://www.jianshu.com/p/157f9060753c)
