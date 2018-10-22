## 重试
---

**重试： 这个故障是暂时的，不是永久的，我们才会去重试。**

设计重试时，一定要结合业务场景，定义出什么情况下需要重试。（比如：调用超时）

**一些错误最好不要重试，如：**

* 没有权限
* 非法请求数据
* 数据格式不正确

### 设计要点

* 要确定什么样的错误才需要重试
* 重试的时间和重试的次数
* 超时重试次数，或是一段时间，那么重试就没有意义了。此后对于新来的请求，就没有必要再进行重试了。此时新来的请求直接返回错误即可。
* 重试要考虑被调用方是否支持幂等设计
* 可以借助框架，如 Spring Annotation，不用侵入业务代码
* 对于有事务相关的操作。我们可能会希望能重试成功，而不至于走业务补偿那样的复杂的回退流程。对此，我们可能需要一个比较长的时间来做重试，但是我们需要保存住请求的上下文，这可能对程序的运行有比较大的开销，因此，有一些设计会先把这样的上下文暂存在本机或是数据库中，然后腾出资源来去做别的事，过一会再回来把之前的请求从存储中捞出来重试。


### 重试的策略

要有最大值，经过一段时间的重试后，没有必要再重试了。重试可能加重网络负担。

Exponential Backoff （指数策略）

如：第一次等 200ms；第二次等400ms；第三次等800ms

### Spring 重试策略

https://github.com/spring-projects/spring-retry

以AOP的方式通过Annotation的方式使用。

```
@Service
public interface MyService {
    @Retryable(
      value = { SQLException.class }, 
      maxAttempts = 2,
      backoff = @Backoff(delay = 5000))
    void retryService(String sql) throws SQLException;
    ...
}

```

配置 @Retryable 注解，只对 SQLException 的异常进行重试，重试两次，每次延时 5000ms。相关的细节可以看相应的文档。我在这里，只想让你看一下 Spring 有哪些重试的策略。


```
RetryTemplate template = new RetryTemplate();

TimeoutRetryPolicy policy = new TimeoutRetryPolicy();
policy.setTimeout(30000L);

template.setRetryPolicy(policy);

Foo result = template.execute(new RetryCallback<Foo>() {

    public Foo doWithRetry(RetryContext context) {
        // Do stuff that might fail, e.g. webservice operation
        return result;
    }

});
```
* NeverRetryPolicy：只允许调用 RetryCallback 一次，不允许重试。

* AlwaysRetryPolicy：允许无限重试，直到成功，此方式逻辑不当会导致死循环。

* SimpleRetryPolicy：固定次数重试策略，默认重试最大次数为 3 次，RetryTemplate 默认使用的策略。

* TimeoutRetryPolicy：超时时间重试策略，默认超时时间为 1 秒，在指定的超时时间内允许重试。

* CircuitBreakerRetryPolicy：有熔断功能的重试策略，需设置 3 个参数 openTimeout、resetTimeout 和 delegate；关于熔断，会在后面描述。

* CompositeRetryPolicy：组合重试策略。有两种组合方式，乐观组合重试策略是指只要有一个策略允许重试即可以，悲观组合重试策略是指只要有一个策略不允许重试即不可以。但不管哪种组合方式，组合中的每一策略都会执行。





