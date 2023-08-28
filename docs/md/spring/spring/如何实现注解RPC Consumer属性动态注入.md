---
title: 如何实现注解 RPC Consumer属性动态注入
---

# 如何实现注解 RPC Consumer属性动态注入

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学


---

分布式系统架构时代，RPC框架你一定不会陌生。目前主流的RPC框架有 dubbo、thrift、motan、grpc等。

消费端（RPC Consumer）通常只有服务接口定义，接口的业务逻辑实现部署在生产端（RPC Provider），服务调用一般是采用动态代理方式，通过Proxy创建一个代理类，借助增强方式完成网络的远程调用，获取执行结果。

## 两个关键点

1、如何实现一个通用的代理类？

2、如何在消费端动态注入接口的代理对象？


## 如何实现一个通用的代理类？

目前动态代理的实现方案有很多种，如JDK 动态代理、Cglib、Javassist、ASM、Byte Buddy等

JDK 动态代理的代理类是运行时通过字节码生成的，我们通过Proxy.newProxyInstance方法获取的接口实现类就是这个字节码生成的代理类

定义代理类`RpcInvocationHandler`，继承`InvocationHandler`接口，并重写invoke()方法。

```
public class RpcInvocationHandler implements InvocationHandler {

    private final String serviceVersion;
    private final long timeout;

    public RpcInvocationHandler(String serviceVersion, long timeout) {
        this.serviceVersion = serviceVersion;
        this.timeout = timeout;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) {
        // todo
        // 1、封装RpcProtocol对象
        // 2、对象编码
        // 3、发送请求到服务端
        // 4、获取返回结果

        // 模拟生成一个订单号
        Long orderId = Long.valueOf(new Random().nextInt(100));

        String s = String.format("【RpcInvocationHandler】 调用方法：%s , 参数：%s ,订单id：%d", method.getName(), JSON.toJSONString(args), orderId);
        System.out.println(s);
        return orderId;
    }
```

## 如何在消费端动态注入接口的代理对象？

构造一个自定义Bean，并对该Bean下执行的所有方法拦截，增加额外处理逻辑。


<div align="left">
    <img src="https://offercome.cn/images/spring/spring/1-1.jpg" width="600px">
</div>

> `OrderService`是一个订单接口类，client端没有该接口的实现类。


定义注解`@RpcReference`，用于描述代理类的参数信息。

```
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@Autowired
public @interface RpcReference {
    String serviceVersion() default "1.0";
    long timeout() default 5000;
}
```

Spring 的 FactoryBean 接口可以帮助我们实现自定义的 Bean，FactoryBean 是一种特殊的工厂 Bean，通过 getObject() 方法返回对象，而并不是 FactoryBean 本身。

```
public class RpcReferenceBean implements FactoryBean<Object> {

    private Class<?> interfaceClass;

    private String serviceVersion;

    private long timeout;

    private Object object;

    @Override
    public Object getObject() throws Exception {
        return object;
    }

    @Override
    public Class<?> getObjectType() {
        return interfaceClass;
    }

    public void init() throws Exception {
        object = Proxy.newProxyInstance(
                interfaceClass.getClassLoader(),
                new Class<?>[]{interfaceClass},
                new RpcInvocationHandler(serviceVersion, timeout));
    }
}
```

但是 `RpcReferenceBean`如何被spring容器识别并加载呢？需要借助Spring的其他扩展点：

1、`BeanFactoryPostProcessor`，在Spring 容器加载 Bean 的定义之后以及 Bean 实例化之前执行，方便用户对 Bean 的配置元数据进行二次修改。

2、`ApplicationContextAware`，通过它Spring容器会自动把上下文环境对象调用ApplicationContextAware接口中的setApplicationContext方法。通过ApplicationContext可以查找Spring容器中的Bean对象。

3、`BeanClassLoaderAware`, 获取 Bean 的类加载器


```
public class RpcConsumerPostProcessor implements ApplicationContextAware, BeanClassLoaderAware, BeanFactoryPostProcessor {

    private ApplicationContext applicationContext;
    private ClassLoader classLoader;
    private final Map<String, BeanDefinition> rpcBeanDefinitions = new LinkedHashMap<>();

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    @Override
    public void setBeanClassLoader(ClassLoader classLoader) {
        this.classLoader = classLoader;
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        for (String beanDefinitionName : beanFactory.getBeanDefinitionNames()) {
            BeanDefinition beanDefinition = beanFactory.getBeanDefinition(beanDefinitionName);
            String beanClassName = beanDefinition.getBeanClassName();
            if (beanClassName != null) {
                Class<?> clazz = ClassUtils.resolveClassName(beanClassName, this.classLoader);
                ReflectionUtils.doWithFields(clazz, this::parseRpcReference);
            }
        }

        // 自定义bean注册到容器中
        BeanDefinitionRegistry registry = (BeanDefinitionRegistry) beanFactory;
        this.rpcBeanDefinitions.forEach((beanName, beanDefinition) -> {
            if (applicationContext.containsBean(beanName)) {
                throw new IllegalArgumentException("spring context already has a bean named " + beanName);
            }
            registry.registerBeanDefinition(beanName, beanDefinition);
            System.out.println(String.format("registered RpcReferenceBean %s success!", beanName));
        });
    }

    private void parseRpcReference(Field field) {
        RpcReference annotation = AnnotationUtils.getAnnotation(field, RpcReference.class);
        if (annotation != null) {
            // 创建RpcReferenceBean类的Bean定义
            BeanDefinitionBuilder beanDefinitionBuilder = BeanDefinitionBuilder.genericBeanDefinition(RpcReferenceBean.class);
            beanDefinitionBuilder.setInitMethodName("init");
            beanDefinitionBuilder.addPropertyValue("interfaceClass", field.getType());
            beanDefinitionBuilder.addPropertyValue("serviceVersion", annotation.serviceVersion());
            beanDefinitionBuilder.addPropertyValue("timeout", annotation.timeout());

            BeanDefinition beanDefinition = beanDefinitionBuilder.getBeanDefinition();
            rpcBeanDefinitions.put(field.getName(), beanDefinition);
        }
    }

}
```

`RpcConsumerPostProcessor` 从 beanFactory 中获取所有 Bean 的定义信息，然后对每个Bean下的field检测，如果field被声明了`@RpcReference`注解，通过`BeanDefinitionBuilder`重新构造
`RpcReferenceBean`的定义，并为成员变量赋值。

最后借助`BeanDefinitionRegistry`将新定义的Bean重新注册到Spring容器中。由容器来实例化Bean对象，并完成IOC依赖注入


## 项目源码

https://github.com/aalansehaiyang/spring-boot-example/tree/master/spring-rpc-reference
