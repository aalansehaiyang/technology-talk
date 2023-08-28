---
title: Redis + Lua 组合实现分布式限流
---

#  Redis + Lua 组合实现分布式限流

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学



随着互联网公司的高速发展，各种高并发流量业务对系统也产生了巨大冲击

特别是一些电商公司，经常搞一些大促活动，如：618活动、双十一活动。活动上线前会评估系统承载流量 QPS，并做对应的机器扩容。

什么事都有个 “但是”，毕竟评估带有主观推测性质。一旦超过了系统最大负载，会把系统冲垮。

针对这个问题，我们一般的解决策略就是`限流`

> 限流是保证系统高可用的重要手段！！！


## 常用的限流算法

1. 计数器限流

2. 滑动窗口

3. 漏桶限流

4. 令牌桶限流

详细介绍，可以看下之前写过一篇文章： 
[https://articles.zsxq.com/id_npaoxri6vgqk.html](https://articles.zsxq.com/id_npaoxri6vgqk.html)

## 单机版限流


单机限流可以借助 `Guava` 框架提供的令牌桶算法，借助 `RateLimiter` 类创建一个令牌桶限流器，几行代码就可以快速实现，框架已经帮我们封装好了。

但是，现在都是分布式架构，单机版限流只能保护单台机器，无法实现一个集群效果，应用场景比较窄。这里就不展开了

## 分布式限流

关于分布式限流器，市面也有很多解决方案，今天主要讲解下 `Redis` 实现方案

Redis 作为性能加速器，使用场景非常广泛，基于 Redis 实现限流，我们不需要额外引入其他框架，属于轻量方案，适用了中小型公司。

<div align="left">
    <img src="https://offercome.cn/images/arch/case/2-1.png" width="600px">
</div>

其中，一个请求过来后，我们要不要处理，通过一个`计数组件 `来控制，这个计数器维护在 Redis 中，涉及多次`读写` 操作，要求具有`原子性` ，我们希望一次请求的所有命令打包在一起执行，这里引入 Lua 。

Lua 是一种脚本语言，Redis 脚本使用 Lua 解释器来执行脚本。Redis 2.6 版本内嵌支持 Lua 环境，执行脚本的常用命令为 EVAL

**这里没用使用 Redis 自带事务，相比较而言，Lua 脚本有哪些优点？**

- 减少网络开销：使用Lua脚本，无需向Redis 发送多次请求，执行一次即可 ，减少网络传输
- 原子操作：Redis 将整个Lua脚本作为一个命令执行，原子，无需担心并发
- 复用：Lua脚本一旦执行，会永久保存 Redis 中，其他客户端可复用

## 代码实现

1、创建一个 Spring Boot 工程，在 pom.xml 文件中引入 依赖

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
</dependency>
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>21.0</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

2、创建 `RedisTemplate` 客户端实例

```
@Configuration
public class RedisConfig {
    @Bean
    JedisConnectionFactory jedisConnectionFactory() {
        return new JedisConnectionFactory();
    }

    @Bean
    public RedisTemplate<String, Serializable> limitRedisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Serializable> template = new RedisTemplate<>();
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.setConnectionFactory(redisConnectionFactory);
        return template;
    }
}

```

3、限流的 Lua 脚本，首先通过 `get` 命令查询 key 的值，如果超过设定的阈值，返回 0 ，表示限流生效。

否则，对key 的值计数 +1 ，首次操作需要设置过期时间，表示可以继续业务处理

```
local count
count = redis.call('get',KEYS[1])

if count and  tonumber(count) >= tonumber(ARGV[1]) then
    return 0;
end
    count = redis.call('incr',KEYS[1])

if tonumber(count) == 1 then
    redis.call('expire',KEYS[1],ARGV[2])
end

return 1;
```

4、 系统初始化时，会加载 Lua 脚本，创建 `DefaultRedisScript` bean 实例

```
@Autowired
private RedisTemplate<String, Serializable> limitRedisTemplate;
private DefaultRedisScript<Number> redisScript;

@PostConstruct
public void init() {

    redisScript = new DefaultRedisScript<>();
    redisScript.setResultType(Number.class);
    ClassPathResource classPathResource = new ClassPathResource(LIMIT_LUA_PATH);
    try {

        classPathResource.getInputStream();//探测资源是否存在
        redisScript.setScriptSource(new ResourceScriptSource(classPathResource));
    } catch (IOException e) {
        log.error("未找到文件：{}", LIMIT_LUA_PATH);
    }
}

```
5、为了开发方便，我们定义了限流注解，哪个方法需要配置限流，只需要在方法上引入这个注解，并配置规则即可

```
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface LimiterRule {

    String key();

    // 限流上限阈值
    int maxCount();

    // 过期时间
    int limitPeriod();

}

```
6、业务方法被拦截后的增强处理，借助 Spring 的 AOP 切面机制来实现限流

```
@Around("execution(public * *(..)) && @annotation(com.onyone.limit.annotation.LimiterRule)")
public Object limit(ProceedingJoinPoint pjp) {
    MethodSignature signature = (MethodSignature) pjp.getSignature();
    Method method = signature.getMethod();
    LimiterRule limiterRule = method.getAnnotation(LimiterRule.class);

    String key = limiterRule.key();
    int maxCount = limiterRule.maxCount();
    int limitPeriod = limiterRule.limitPeriod();

    key = key + System.currentTimeMillis() / 1000;

    ImmutableList<String> keys = ImmutableList.of(StringUtils.join(key));
    try {
        Number count = limitRedisTemplate.execute(redisScript, keys, maxCount, limitPeriod);
        System.out.println("limit script result ，count =" + count);
        if (count != null && count.intValue() == 1) {
            return pjp.proceed();
        } else {
            throw new RuntimeException("被限流啦........");
        }
    } catch (Throwable e) {
        if (e instanceof RuntimeException) {
            throw new RuntimeException(e.getLocalizedMessage());
        }
        throw new RuntimeException("服务器出现异常，请稍后再试");
    }

}

```
7、业务模拟方法，每秒只能处理 4个请求，多余的请求会拒绝处理。由于计数 key 维护在 Redis 中，我们为 key 设置了一个过期时间为 20 秒

```
/**
 * 限流规则：5秒内允许通过4个请求
 */
@LimiterRule(key = "create_order_service_", maxCount = 4, limitPeriod = 20)
@RequestMapping(value = "/create_order")
public String createOrder() {
    // 模拟创建订单的业务流程

    return "success";
}

```

## 压测验证


关于压测工具，我们使用的是 jmeter 。每秒限制 5 个并发请求，持续 4 轮，总共 20 次请求

<div align="left">
    <img src="https://offercome.cn/images/arch/case/2-8.png" width="600px">
</div>

配置 HTTP 请求接口信息，如：协议、IP、端口、路径、参数等信息

<div align="left">
    <img src="https://offercome.cn/images/arch/case/2-9.png" width="600px">
</div>

**压测结果（模拟）**

每次只有 4个 请求能处理成功，后续的请求失败，直到下一个计数器窗口开始，原来的计数清零，又能重新接收并处理请求

<div align="left">
    <img src="https://offercome.cn/images/arch/case/2-10.png" width="600px">
</div>


Spring Boot + AOP + Lua 实现限流是一种简单玩法，也比较实用，当然也可以使用阿里的开源框架 Sentinel，不过要安装一些配置，比这个要复杂些。

另外，本文演示用的是 `计数器限流` ，会有边界风险，生产环境建议大家使用 `滑动窗口` 方式，修改下 Lua 脚本，也不复杂。


## 代码地址
> https://github.com/aalansehaiyang/redis-limit-demo
