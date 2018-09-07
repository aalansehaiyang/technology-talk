## fastJson相关

---
### pom依赖

```
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.1.41</version>
</dependency>

```

### 一、介绍

fastjson是阿里的一个开源二方库，用于对象和json串之间的转换，是目前Java语言中最快的JSON库。接口简单易用，已经被广泛使用在缓存序列化、协议交互、Web输出、Android客户端等多种应用场景。


### 二、常用的工具类

*	对象转换为字符串

```
com.alibaba.fastjson.JSON.toJSONString(Object)
```

*	字符串反序列化为Object

```
com.alibaba.fastjson.JSON.parseObject(String, Class<ForumCache>)

例子：https://github.com/alibaba/fastjson/wiki/Samples-DataBind
```
	
*	将字符串反序化为List \<T>

```
<ForumCache> List<ForumCache> com.alibaba.fastjson.JSONArray.parseArray(String text, Class<ForumCache> clazz)
```

### 三、手册

* [Fastjson的常用API使用例子](https://www.w3cschool.cn/fastjson/fastjson-jsonpath.html)
* [源码 Fork分支](https://github.com/aalansehaiyang/fastjson)
* [SerializerFeature详解](https://blog.csdn.net/u010246789/article/details/52539576)





