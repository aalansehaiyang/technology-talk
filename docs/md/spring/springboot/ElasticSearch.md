---
title: Spring Boot 集成 ElasticSearch
---

# Spring Boot 集成 ElasticSearch

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学


`Spring Boot 作为主流微服务框架，拥有成熟的社区生态。市场应用广泛，为了方便大家，整理了一个基于spring boot的常用中间件快速集成入门系列手册，涉及RPC、缓存、消息队列、分库分表、注册中心、分布式配置等常用开源组件，大概有几十篇文章，陆续会开放出来，感兴趣同学可以关注&收藏`


<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/8-5.jpg" width="600px">
</div>


## 1、ElasticSearch 简介

Elasticsearch 是 Java 开发的，基于 Lucene 的搜索引擎。它提供了一个分布式多用户能力的全文搜索引擎，基于RESTful Web接口。Elasticsearch 可以快速有效地存储，搜索和分析大量数据，而且在处理半结构化数据（即自然语言）时特别有用。


**应用集成Elasticsearch有4种方式：**

* REST Client
* Jest
* Spring Data
* Spring Data Elasticsearch Repositories


> 本文主要介绍一下用Spring Data Elasticsearch Repositories 是如何使用的。
> <br/> 该方式与spring boot高度集成，日常开发时较方便，只需要简单的配置即可开箱使用。

## 2、启动 Elasticsearch

为了便于测试，我们使用 Docker 镜像方式快速部署一个单节点的 `Elasticsearch`实例，容器启动时并绑定宿主机的`9200和9300`端口

### 拉取镜像

```
docker pull elasticsearch:7.4.2
```

### 查看镜像

```
docker images
```

### 创建宿主机挂载目录

```
mkdir -p /mydata/elasticsearch/config/
mkdir -p /mydata/elasticsearch/data/
echo "http.host: 0.0.0.0">>/mydata/elasticsearch/config/elasticsearch.yml
```

### 运行容器

```
docker run --name elasticsearch -p 9200:9200 -p 9300:9300 \
-e ES_JAVA_OPS="-Xms256m -Xmx256m" \
-v /mydata/elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml \
-v /mydata/elasticsearch/data:/usr/share/elasticsearch/data \
-v /mydata/elasticsearch/plugins:/usr/share/elasticsearch/plugins \
-d elasticsearch:7.4.2
```

参数说明：

> -p 9200:9200 将容器的9200端口映射到主机的9200端口;
> <br/> --name elasticsearch 给当前启动的容器取名叫 elasticsearch
> <br/> -v /mydata/elasticsearch/data:/usr/share/elasticsearch/data 将数据文件夹挂载到主机;
> <br/> -v /mydata/elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml 将配置文件挂载到主机;
> <br/> -d 以后台方式运行(daemon)
> <br/> -e ES_JAVA_OPS="-Xms256m -Xmx256m" 测试时限定内存小一点

### 查看容器进程

```
docker ps -a
```


## 3、项目集成

按照Spring Boot的惯例，我们不必在上下文中提供任何bean来启用对`Elasticsearch`的支持。我们只需要在pom.xml中添加以下依赖项：

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
</dependency>
```

> 由于spring-boot-starter-parent指定的版本号是 2.2.1.RELEASE，所以上面引入的两个 starter 组件会被强制一样的版本号，便于统一化管理。而底层引入的 spring-data-elasticsearch 是3.2.1.RELEASE

在配置文件 `application.yml` 中配置 ES 的相关参数，应用程序尝试在 `localhost` 上与 `Elasticsearch `连接，具体内容如下：

```
spring:
  application:
    name: spring-boot-bulking-elasticsearch
  elasticsearch:
    rest:
      uris: 127.0.0.1:9200
      read-timeout: 5s
```

**Spring Boot 操作 ES 数据有三种方式：**

* 实现 ElasticsearchRepository 接口
* 引入 ElasticsearchRestTemplate
* 引入 ElasticsearchOperations


使用Spring Data Elasticsearch Repositories操作 `Elasticsearch`，定义实体类，并设置对应的索引名

```
@Document(indexName = "order", type = "biz1", shards = 2)
public class OrderModel {

    @Id
    private Long orderId;
    private Double amount;
    private Long buyerUid;
    private String shippingAddress;
}
```

常用注解说明：

> @Document：表示映射到Elasticsearch文档上的领域对象
> <br/>  @Id：表示是文档的id，文档可以认为是mysql中表行的概念
> <br/> @Filed：文档中字段的类型、是否建立倒排索引、是否进行存储

OrderModel表示订单的索引模型，一个OrderModel对象表示一条ES索引记录。如果用关系数据库做参照，`Index`相当于表，`Document`相当于记录

然后，需要自己定义一个业务接口 `OrderRepository`，并继承扩展接口 `ElasticsearchRepository`

```
public interface OrderRepository extends ElasticsearchRepository<OrderModel, Long> {
}
```

`ElasticsearchRepository` 是 `Spring boot Elasticsearch` 框架预留的扩展接口，内部的类依赖关系如下图所示：

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/8-1.jpg" width="700px">
</div>

`ElasticsearchRepository` 接口内提供常用的操作ES的方法，如：新增、修改、删除、各种维度条件查询及分页等，详细方法内容如下：

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/8-2.jpg" width="800px">
</div>

> save() 方法是创建索引，如果索引document已经存在，后面的 `save` 方法则是对之前的数据覆盖。也就是说新增和修改都可以通过 `save` 方法 实现。

**最后，通过编写单元测试类来验证方法功能**

```
@Test
public void test1() {

    OrderModel orderModel = OrderModel.builder()
            .orderId(1L)
            .amount(25.5)
            .buyerUid(13201L)
            .shippingAddress("上海")
            .build();

    orderModel = orderRepository.save(orderModel);
    System.out.println(orderModel);
}

@Test
public void test2() {
    BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery();
    NativeSearchQueryBuilder searchQueryBuilder = new NativeSearchQueryBuilder()
            .withQuery(boolQueryBuilder);
    List<OrderModel> orderDocumentList = orderRepository.search(searchQueryBuilder.build()).getContent();
    System.out.println(JSON.toJSONString(orderDocumentList));
}
```
> 使用这个OrderRepository 来操作 ES 中的 OrderModel 数据。我们这里并没有手动创建OrderModel 对应的索引，由 elasticsearch 默认生成。


## 4、kibana 可视化控制台

安装 kibana，比较简单，这里就不在累述了。先下载kibana安装包，再解压

```
# bin目录下，执行启动脚本

./kibana
```

浏览器访问：https://localhost:5601/app/kibana#/dev_tools/console?_g=()

可以看到刚才执行单元测试，创建的索引记录。

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/8-3.jpg" width="800px">
</div>


## 5、项目源码

```
https://github.com/aalansehaiyang/spring-boot-bulking  

模块：spring-boot-bulking-elasticsearch
```
