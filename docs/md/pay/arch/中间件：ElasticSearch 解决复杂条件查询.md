---
title: 中间件：ElasticSearch 解决复杂条件查询
pay: https://articles.zsxq.com/id_x9wb069d6gfs.html
---

#  中间件：ElasticSearch 解决复杂条件查询

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学


关系型数据库日益成熟，既能满足持久化存储，也能满足一些常规化的条件查询。

如果数据量大了，我们可以通过分库分表 来解决，但如果涉及一些复杂的业务条件查询？

一种解决思路，按照查询条件 构建 B+ 树索引

当然，MySQL 最多只能使用一个条件索引来查询，然后剩余的条件只能在内存中逐行遍历并进行过滤。由于只能使用一个索引，会查询出大量冗余数据，导致大量 IO 操作，性能比较差。

<div align="left">
    <img src="https://offercome.cn/images/pay/arch/12-1.png" width="300px">
</div>

更麻烦的是，如果条件字段太多，每次查询条件字段又不固定（有的字段值可能为空），根本没法建索引，只能走全表扫描，速度肯定让人无法接受