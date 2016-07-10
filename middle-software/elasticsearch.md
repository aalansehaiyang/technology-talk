## Elasticsearch相关

---

**特性：**

* 分布式的实时文件存储，每个字段都被索引并可被搜索
* 分布式的实时分析搜索引擎
* 可以扩展到上百台服务器，处理PB级结构化或非结构化数据

安装非常简单，http://www.elasticsearch.org/download/ 下载最新版本的Elasticsearch，其中zip包可直接解压使用。

**启动：**

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

	

**参考资料：**

http://es.xiaoleilu.com/010_Intro/10_Installing_ES.html

https://github.com/elasticsearch-cn

http://www.sojson.com/blog/91

http://edu.51cto.com/course/course_id-6423.html