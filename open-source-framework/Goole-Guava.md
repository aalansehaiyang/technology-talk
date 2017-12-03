## Google Guava

---

* [Guava 源码](https://github.com/google/guava/wiki/CachesExplained#population)


---
### pom依赖

```
<dependency>
  	<groupId>com.google.guava</groupId>
  	<artifactId>guava</artifactId>
  	<version>13.0.1</version>
</dependency>

```

### 一、缓存相关
如果服务上要使用本地缓存，可以考虑使用guava框架。Guava Cache与ConcurrentMap很相似，但也不完全一样。最基本的区别是ConcurrentMap会一直保存所有添加的元素，直到显式地移除。相对地，Guava Cache为了限制内存占用，通常都设定为自动回收元素。在某些场景下，尽管LoadingCache 不回收元素，它也是很有用的，因为它会自动加载缓存。

#### Guava Cache适用于：

* 你愿意消耗一些内存空间来提升速度。
* 你预料到某些键会被查询一次以上。
* 缓存中存放的数据总量不会超出内存容量。

```
 private Cache<String, UserAuthTokenRecord> localCache = CacheBuilder.newBuilder().maximumSize(200000)
            .initialCapacity(100000).expireAfterWrite(30, TimeUnit.SECONDS).<String, UserAuthTokenRecord>build();
            
```

### 缓存回收

* ##### 基本容量的回收

  1）设置了初始值和最大容量上限，如果逼近容量上限，就会触发回收机制。
  
* ##### 定时回收

	1）expireAfterAccess(long, TimeUnit)：缓存项在给定时间内没有被读/写访问，则回收。请注意这种缓存的回收顺序和基于大小回收一样。
	
	2）expireAfterWrite(long, TimeUnit)：缓存项在给定时间内没有被写访问（创建或覆盖），则回收。如果认为缓存数据总是在固定时候后变得陈旧不可用，这种回收方式是可取的。

* ##### 基于引用的回收

### 二、常用的工具类

##### 1.创建一个集合
com.google.common.collect.Lists.newArrayList(E... elements)

##### 2.创建指定容量大小的集合

注：避免使用过程中，容量不足引发的扩容带来的性能损耗。

com.google.common.collect.Lists.newArrayListWithCapacity(int)

创建指定大小的的List；

com.google.common.collect.Maps.newHashMapWithExpectedSize(int)

创建指定大小的的Map；

##### 3.连接器[Joiner]

用分隔符把字符串序列连接起来也可能会遇上不必要的麻烦。如果字符串序列中含有null，那连接操作会更难。Fluent风格的Joiner让连接字符串更简单。

```
Joiner joiner = Joiner.on("; ").skipNulls();
return joiner.join("Harry", null, "Ron", "Hermione");
```

上述代码返回”Harry; Ron; Hermione”。另外，useForNull(String)方法可以给定某个字符串来替换null，而不像skipNulls()方法是直接忽略null。

Joiner也可以用来连接对象类型，在这种情况下，它会把对象的toString()值连接起来。

```
Joiner.on(",").join(Arrays.asList(1, 5, 7)); // returns "1,5,7"
```

警告：joiner实例总是不可变的。用来定义joiner目标语义的配置方法总会返回一个新的joiner实例。这使得joiner实例都是线程安全的，你可以将其定义为static final常量。

##### 4.拆分器[Splitter]

JDK内建的字符串拆分工具有一些古怪的特性。比如，String.split悄悄丢弃了尾部的分隔符。 问题：”,a,,b,”.split(“,”)返回？

“”, “a”, “”, “b”, “”

null, “a”, null, “b”, null

“a”, null, “b”

“a”, “b”


以上都不对，””, “a”, “”, “b”。只有尾部的空字符串被忽略了。 Splitter使用令人放心的、直白的流畅API模式对这些混乱的特性作了完全的掌控。

```
Splitter.on(',')
        .trimResults()
        .omitEmptyStrings()
        .split("foo,bar,,   qux");
```

上述代码返回Iterable<String>，其中包含”foo”、”bar”和”qux”。Splitter可以被设置为按照任何模式、字符、字符串或字符匹配器拆分。

**拆分器工厂**

|方法|	描述|	范例|
|------------- |------------- |------------- |
|Splitter.on(char)|	按单个字符拆分|	Splitter.on(‘;’)|
|Splitter.on(CharMatcher)	|按字符匹配器拆分	|Splitter.on(CharMatcher.BREAKING_WHITESPACE)|
|Splitter.on(String)|	按字符串拆分	|Splitter.on(“,   “)|
|Splitter.on(Pattern)Splitter.onPattern(String)|	按正则表达式拆分	|Splitter.onPattern(“\r?\n”)|
|Splitter.fixedLength(int)	|按固定长度拆分；最后一段可能比给定长度短，但不会为空。	|Splitter.fixedLength(3)|

**拆分器修饰符**

|方法|	描述|
|-------------|-------------|
|omitEmptyStrings()	|从结果中自动忽略空字符串|
|trimResults()	|移除结果字符串的前导空白和尾部空白|
|trimResults(CharMatcher)|	给定匹配器，移除结果字符串的前导匹配字符和尾部匹配字符|
|limit(int)|	限制拆分出的字符串数量|

如果你想要拆分器返回List，只要使用Lists.newArrayList(splitter.split(string))或类似方法。 警告：splitter实例总是不可变的。用来定义splitter目标语义的配置方法总会返回一个新的splitter实例。这使得splitter实例都是线程安全的，你可以将其定义为static final常量。



<br><br>
#### 参考资料：

[http://ifeve.com/google-guava-cachesexplained/](http://ifeve.com/google-guava-cachesexplained)

