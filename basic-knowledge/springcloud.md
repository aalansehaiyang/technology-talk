## Spring Cloud

---

几大模块：服务发现（Eureka），断路器（Hystrix），智能路由（Zuul），客户端负载均衡（Ribbon）

### 一、手册

* [源码](https://github.com/spring-cloud/spring-cloud-netflix)
* [中文社区](http://bbs.springcloud.com.cn/)
* [推荐博客](http://www.ityouknow.com/springcloud/2016/12/30/springcloud-collect.html)
* [Spring Cloud 构建微服务示例](https://github.com/aalansehaiyang/spring-cloud-example)
* [spring Cloud 核心组件](https://github.com/ityouknow/spring-cloud-examples)

	* [注册中心Eureka](http://www.ityouknow.com/springcloud/2017/05/10/springcloud-eureka.html)
		* 生产中我们可能需要三台或者大于三台的注册中心来保证服务的稳定性，配置的原理其实都一样，将注册中心分别指向其它的注册中心
	* [服务注册与发现](http://blog.didispace.com/springcloud6/)
	* [熔断器Hystrix](http://www.ityouknow.com/springcloud/2017/05/16/springcloud-hystrix.html)
	* [智能路由Zuul](https://mp.weixin.qq.com/s/5PQ9iyPfYCEcJ5W7q0T2oQ)
		* 通过一个API网关根据请求的url，路由到相应的服务
		

### 二、闲谈

* [Spring Cloud在国内中小型公司能用起来吗？](https://mp.weixin.qq.com/s/vnWXpH5pv-FAzLZfbgTGvg)

#### 三、坑

* [注册中心备份节点 unavailable-replicas问题](http://www.ccblog.cn/95.htm)