## 调优

---

### 一、SQL技巧

* insert ignore 

insert ignore 与insert into的区别就是insert ignore 会忽略数据库中已经存在的数据，如果数据库没有数据，就插入新的数据，如果有数据的话就跳过这条数据。这样就可以保留数据库中已经存在数据，达到在间隙中插入数据的目的。

* replace into

replace into 跟 insert 功能类似，不同点在于：replace into 首先尝试插入数据到表中， 1. 如果发现表中已经有此行数据（根据主键或者唯一索引判断）则先删除此行数据，然后插入新的数据。 2. 否则，直接插入新数据。

* ON DUPLICATE KEY UPDATE

批量插入数据 。自动解决索引冲突。

http://blog.csdn.net/u010003835/article/details/54381080

### 二、数据库调优

* [MySQL 大表优化方案](https://mp.weixin.qq.com/s/BMQC2oJlhLoeBDtveXgHpw)

单表优化（字段、索引、查询SQL、引擎、系统参数），读写分离，缓存，表分区，垂直拆分，水平拆分


* 