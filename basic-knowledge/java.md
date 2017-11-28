## java相关

---

### 一、基础


* 基本语法

	基本数据类型；运算符；表达式；选择与循环语句；类与对象（普通类、抽象类、接口、枚举、Annotation、内部类）；继承与实现；异常；package与jar包；序列化与反序列化；正则表达式；重载与覆盖；
* 数组

	一维数组；二维数组。。。
* 集合
	
	Collection接口；Set相关；List相关；Map相关
* 线程

	Thread；Runnable；Callable；线程状态；优先级；
* IO

	File类；字节流（InputStream、OutputStream）；字符流（Reader、Writer）；转换流（OutputStreamWriter、InputStreamReader）；压缩流；

* 网络
	
	TCP编程；UDP编程
* 泛型
* 反射

	提供api方法取得类的结构；调用类的方法；动态代理

#####  源码分析

* List
	* [ArrayList](https://mp.weixin.qq.com/s/g1E3GQU1JJzpAxV4zwRKgg) 
	* [LinkedList](https://mp.weixin.qq.com/s/oA0D1BjzBi7z0Xuvt4O-PQ) 
	* [CopyOnWriteArrayList](https://mp.weixin.qq.com/s/riVaKy4IR2uRGZzKMLVtAQ)
* Map
	* [HashMap](https://mp.weixin.qq.com/s/SyKckwLfV2ypJOzTFA7R_g)
	* [LinkedHashMap](https://mp.weixin.qq.com/s/m2XfI2A2jJqFLAI_iNZI-g)
	* [ConcurrentHashMap(上)](https://mp.weixin.qq.com/s/1GJ4Vd2iHgyvjMFLv7sO2A)
	* [ConcurrentHashMap(下)](https://mp.weixin.qq.com/s/rPa30_MslGTz56UTxE0WAA)


### 二、进阶

* 	[java关键字](java修饰词.md)
* 	[正则表达式](regex.md)
* 	[常见锁](java-lock.md)
* 	[常用java类库](常用java类.md)
*	[java的System.getProperty()方法使用](http://blog.csdn.net/itomge/article/details/9098207)
* 	[jdk并发包里常用的类](concurrent-class.md)
* 	[java8函数编程（lambda表达式）](java8-stream.md)
* 	[java的线程状态](java的线程状态.md)
* 	[ThreadLocal原理机制](ThreadLocal原理机制.md)
* 	[HashMap的扩容机制](HashMap的扩容机制.md)
* 	[Exception](java-exception.md)
* 	[各种坑](各种坑.md)
* 	[IO类型](java-io.md)

* ###### NIO
	* 	[NIO](NIO.md)
	* 	[深度解读 Tomcat 中的 NIO 模型](https://mp.weixin.qq.com/s/Nk7gcwsgBhgMWTRkgAFpRA)
	* [epoll 浅析以及 nio 中的 Selector](https://mp.weixin.qq.com/s/RmONdyXuJZa8WyJCu2j7WA)
	* [Linux IO模式及 select、poll、epoll详解](https://segmentfault.com/a/1190000003063859)

* ###### 多线程
	* [Java 多线程知识汇总(1)](https://mp.weixin.qq.com/s/D3TIYMaCSGtY5Dv38vMHpA)
	* [Java 多线程知识汇总(2)](https://mp.weixin.qq.com/s/e9avHfZtfiQ4v3fhVHIcAA)
	* [Java 多线程知识汇总(3)](https://mp.weixin.qq.com/s/s6UvYe1CP8zigR7E6mK9Og)

* ###### 示例
	* [JAVA集合框架中的常用集合及其特点、适用场景、实现原理简介](https://mp.weixin.qq.com/s/FRF-c2t_Un1Krw29yuxyaw)

* ###### netty	
	* [Netty 长连接服务](https://www.dozer.cc/2014/12/netty-long-connection.html)


### 三、JVM虚拟机

*  	[内存模型](jvm内存结构.md)
* 	[类加载器](类加载器.md)
*  	[垃圾回收](java-gc.md)
* ###### jvm调优
	*   [jvm参数](jvm-param.md)
	*  	[jvm自带命令](https://mp.weixin.qq.com/s/QNr8somjodyvU9dRAQG2oA)
	* 	[如何优化Java GC](https://mp.weixin.qq.com/s/ydkEkh_Uc1paftJLKIsm0w)


### 四、java 新特性

*   [Java 的版本历史与特性](https://mp.weixin.qq.com/s/wcF14v11QaS21UFczqGbVg)
*   [JavaEE 7 正式发布](http://www.iteye.com/news/27980)
*   [Java 8-从持久代到metaspace](https://mp.weixin.qq.com/s/w_Uqi5PBkWCqh7qHq6XaKw)
*   [Java 8的新特性—终极版](https://mp.weixin.qq.com/s/CWNIRk9xGu2XSbrWELTKNg)
* 	[Java 9 中的新特性](https://mp.weixin.qq.com/s/YalBtZ_dZayMec8aprk6Xw)

### 五、其它
* 	[随机数生成 --- NativePRNGNonBlocking ](http://hongjiang.info/java8-nativeprng-blocking/)
* 	[随机token 生成代码](java-random.md)
* 	[HashMap扩容、散列碰撞](https://yq.aliyun.com/articles/225660?spm=5176.100238.spm-cont-list.1.LYRwKV)
* 	[一台Java服务器跑多少个线程](https://mp.weixin.qq.com/s/lQkPltX3yS3bGb9EbxHGAg)