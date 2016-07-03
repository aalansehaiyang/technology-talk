## Elasticsearch相关

---

**特性：**

* 分布式的实时文件存储，每个字段都被索引并可被搜索
* 分布式的实时分析搜索引擎
* 可以扩展到上百台服务器，处理PB级结构化或非结构化数据

安装非常简单，elasticsearch.org/download 下载最新版本的Elasticsearch，其中zip包可直接解压使用。

**启动：**

```
./bin/elasticsearch

如果想在后台以守护进程模式运行，添加-d参数

curl 'http://localhost:9200/?pretty' 输出status为200表示启动成功。
```
	
	
	

**参考资料：**

http://es.xiaoleilu.com/010_Intro/10_Installing_ES.html