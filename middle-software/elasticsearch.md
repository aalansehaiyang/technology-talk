## Elasticsearch相关

---

**特性：**

* 分布式的实时文件存储，每个字段都被索引并可被搜索
* 分布式的实时分析搜索引擎
* 可以扩展到上百台服务器，处理PB级结构化或非结构化数据

安装非常简单，http://www.elasticsearch.org/download/ 下载最新版本的Elasticsearch，其中zip包可直接解压使用。

**如何启动：**

```
./bin/elasticsearch

如果想在后台以守护进程模式运行，添加-d参数

curl 'http://localhost:9200/?pretty' 输出status为200表示启动成功。
```
	
查询索引结构：

```
curl 'http://192.168.3.216:9200/forum/user_member/_mapping'
```

```
{
  "forum": {
    "mappings": {
      "user_member": {
        "_all": {
          "analyzer": "ik_max_word",
          "search_analyzer": "ik_smart"
        },
        "properties": {
          "follower": {
            "type": "long"
          },
          "id": {
            "type": "string"
          },
          "threads": {
            "type": "long"
          },
          "uid": {
            "type": "long"
          },
          "username": {
            "type": "string",
            "index": "not_analyzed",
            "term_vector": "with_positions_offsets",
            "include_in_all": false
          },
          "verify": {
            "type": "long"
          },
          "wcuid": {
            "type": "long"
          }
        }
      }
    }
  }
}
```

**使用步骤：**

* 	创建索引结构
* 	导入源数据build索引（可以采用api接口形式）
* 	多维度组合查询条件，搜索查询（可以采用api接口形式）


**应用场景：**

* 基本查询

	* 词条查询。仅匹配在给定字段中含有该词条的文档，而且是确切的、未经分析的词条。
	* 多词条查询。匹配那些在内容中含有某些词条的文档。可以通过设置minimum_match的值来说明想至少保证有多少个词同时被匹配上。
	* match_all查询。匹配索引中的所有的文件。
	* 常用词查询。考虑到查询条件的词越多，查询性能越低。所以将词分为两类：一类，是重要的词，出现的频率较低；另一类，是出现频率较高，如：”的”，但不那么重要的词。
	* match查询
	* multi_match查询。基本与match一样，不同的是它不是针对单个字段，而是针对多个字段的查询。
	* query_string查询
	* simple_query_string查询
	* 标识符查询
	* 前缀查询。配置与词条查询类似。如：查询所有的name字段以tom开始的文档。
	* fuzzy_like_this查询
	* fuzzy_like_this_field查询
	* fuzzy查询
	* 通配符查询。允许我们在查询值中使用*和？等通配符。如“cr\*me”，表示字段里以cr开头me结尾的文档。
	* more_like_this查询
	* more_like_this_field查询
	* 范围查询。查询某一个字段值在某一个范围里的文档，字段可以是数值型，也可以是基于字符串的。比如找到年龄在20到30之间的学生。
	* 最大分查询
	* 正则表达式查询
	
* 复合查询

	* 布尔查询
	* 加权查询
	* constant_score查询
	* 索引查询

* 过滤器。过滤器不影响评分，只是选择索引中的某个子集。过滤器很容易被缓存，从而进一步提高过滤查询的性能。另外过滤器提供了十几种不同类型，如：范围过滤器、脚本过滤器等等，可以根据不同场景选择合适的。
	
* 基于poi经纬度地理位置的查询

	* 基于距离的排序。按照与给定地点的距离来对结果排序。
	* 边界框过滤。搜索条件提供左上及右下的坐标，搜索被矩形框住的选定区域。
	* 距离的限制。把结果限定为离基准点一个选定的距离之内，比如把结果限定为离巴黎半径500公里以内。

	

**参考资料：**

《Elasticssearch服务器开发（第二版）》

https://github.com/elasticsearch-cn/elasticsearch-definitive-guide

http://es.xiaoleilu.com/010_Intro/10_Installing_ES.html

https://github.com/elasticsearch-cn

http://www.sojson.com/blog/91

http://edu.51cto.com/course/course_id-6423.html