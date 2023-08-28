---
title: 第十篇：Spring ！IOC、AOP、生命周期、动态代理、设计模式
---

# Spring 那点破事！IOC、AOP、生命周期、动态代理、设计模式

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学


## **什么是 Spring?**

答案：<br />Spring 是个 java 企业级应用的开源开发框架。Spring 主要用来开发 Java 应用，但是有些扩展是针对构建 J2EE 平台的 web 应用。Spring 框架目标是简化 Java 企业级应用开发，并通过 POJO 为基础的编程模型促进良好的编程习惯。

## Spring 框架的好处？

答案 ：<br />1、轻量：Spring 是轻量的，基本的版本大约2MB<br />2、控制反转：Spring 通过控制反转实现了松散耦合，对象们给出它们的依赖，而不是创建或查找依赖的对象们<br />3、面向切面的编程(AOP)：Spring支持面向切面的编程，并且把应用业务逻辑和系统服务分开<br />4、容器：Spring 包含并管理应用中对象的生命周期和配置<br />5、MVC框架：Spring的WEB框架是个精心设计的框架，是Web框架的一个很好的替代品<br />6、事务管理：Spring 提供一个持续的事务管理接口，可以扩展到上至本地事务下至全局事务（JTA）<br />7、异常处理：Spring 提供方便的API把具体技术相关的异常（比如由JDBC，Hibernate or JDO抛出的）转化为一致的unchecked 异常。

## **用到哪些设计模式?**

答案：<br />**1、工厂模式**: 比如通过 BeanFactory 和 ApplicationContext 来生产 Bean 对象<br />**2、代理模式**: AOP 的实现方式就是通过代理来实现，Spring主要是使用 JDK 动态代理和 CGLIB 代理<br />**3、单例模式**: Spring 中的 Bean 默认都是单例的<br />**4、模板模式**: Spring 中 jdbcTemplate 等以 Template 结尾的对数据库操作的类，都会使用到模板方法设计模式，一些通用的功能<br />**5、包装器模式**: 我们的项目需要连接多个数据库，而且不同的客户在每次访问中根据需要会去访问不同的数据库。这种模式让我们可以根据客户的需求能够动态切换不同的数据源<br />**6、观察者模式**: Spring 事件驱动模型观察者模式的<br />**7、适配器模式**: Spring AOP 的增强或通知(Advice)使用到了适配器模式

## **哪些核心模块?**

答案：<br />

<div align="left">
    <img src="http://offercome.cn/images/article/interview/interview/10-1.png" width="600px">
</div>

- **Spring Core**：Spring核心，它是框架最基础的部分，提供IOC和依赖注入DI特性
- **Spring Context**：Spring上下文容器，它是 BeanFactory 功能加强的一个子接口
- **Spring Web**：它提供Web应用开发的支持
- **Spring MVC**：它针对Web应用中MVC思想的实现
- **Spring DAO**：提供对JDBC抽象层，简化了JDBC编码，同时，编码更具有健壮性
- **Spring ORM**：它支持用于流行的ORM框架的整合，比如：Spring + Hibernate、Spring + iBatis、Spring + JDO的整合等
- **Spring AOP**：即面向切面编程，它提供了与AOP联盟兼容的编程实现

## Bean 的作用域?

答案：<br />1、singleton : 唯一 bean 实例，Spring 中的 bean 默认都是单例的。<br />2、prototype : 每次请求都会创建一个新的 bean 实例。<br />3、request : 每一次HTTP请求都会产生一个新的bean，该bean仅在当前 HTTP request 内有效。<br />4、session : ：在一个HTTP Session中，一个Bean定义对应一个实例。该作用域仅在基于web的 Spring ApplicationContext情形下有效。<br />5、global-session： 全局session作用域，仅仅在基于portlet的web应用中才有意义，Spring5已经没有了。Portlet是能够生成语义代码(例如：HTML)片段的小型Java Web插件。它们基于portlet容器，可以像servlet一样处理HTTP请求。但是，与 servlet 不同，每个 portlet 都有不同的会话

## BeanFactory 和 FactoryBean 区别?<br /><br />
答案：<br />1、BeanFactory 是 Bean 的⼯⼚， ApplicationContext 的⽗类，IOC 容器的核⼼，负责⽣产和管理 Bean 对象。<br />2、FactoryBean 也称为创建 Bean 的 Bean，可以通过实现 FactoryBean 接⼝定制实例化 Bean 的逻辑，通过代理⼀个 Bean 对象，对⽅法前后做⼀些操作。

## **BeanFactory 和 ApplicationContext 区别 ?**<br /><br />
答案：<br />1、BeanFactory 可以理解为含有 bean 集合的工厂类。BeanFactory 包含了种 bean 的定义，以便在接收到客户端请求时将对应的 bean 实例化。 BeanFactory 还能在实例化对象的时生成协作类之间的关系。此举将 bean 自身与 bean 客户端的配置中解放出来。BeanFactory 还包含了 bean 生命周期的控制，调用客户端的初始化方法（initialization methods）和销毁方法（destruction methods）。<br />2、application context 如同 bean factory 一样具有 bean 定义、bean 关联关系的设置，根据请求分发 bean 的功能。但ApplicationContext 在此基础上还提供了其他的功能：

- 支持国际化的文本消息
- 统一的资源文件读取方式
- 监听器中注册 bean 的事件

## 什么是 XMLBeanFactory？<br /><br />
答案：<br />XmlBeanFactory 根据 XML 文件中的定义加载 beans。该容器从 XML 文件读取配置元数据并用它去创建一个完全配置的系统或应用。

## @Repository、@Service、@Compent、@Controller它们有什么区别?<br /><br />
答案：<br />这四个注解的本质都是一样的，都是将被该注解标识的对象放入 Spring 容器当中，只是为了在使用上区分不同的应用分层

- @Repository: 对应持久层即 Dao 层，主要用于数据库相关操作
- @Service: 对应服务层，主要涉及一些复杂的逻辑，需要用到 Dao层
- @Controller: 对应 Spring MVC 控制层，主要用户接受用户请求并调用 Service 层返回数据给前端页面
- @Component: 其他不属于以上三层的统一使用该注解

## @Autowired 和 @Resource 有什么区别?<br /><br />
答案：

- **@Resource 是 Java 自己的注解**，@Resource 有两个属性是比较重要的，分是 name 和 type；Spring 将 @Resource 注解的 name 属性解析为 bean 的名字，而 type 属性则解析为 bean 的类型。所以如果使用 name 属性，则使用 byName 的自动注入策略，而使用 type 属性时则使用 byType 自动注入策略。如果既不指定 name 也不指定 type 属性，这时将通过反射机制使用 byName 自动注入策略。
- **@Autowired 是spring 的注解**，是 spring2.5 版本引入的，Autowired 只根据 type 进行注入，不会去匹配 name。如果涉及到 type 无法辨别注入对象时，那需要依赖 @Qualifier 或 @Primary 注解一起来修饰。

## **IOC 是什么?**

答案：<br /> IOC 负责创建对象，管理对象（通过依赖注入（DI），并且管理这些对象的整个生命周期。它的核心思想就是控制反转。<br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666951886771-5b90c215-baf1-47f3-b92d-38c1b56acc25.png#clientId=u88a40f25-8c08-4&from=paste&height=242&id=u3fb25988&originHeight=336&originWidth=410&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1a7c6d6f-01ef-4b86-a1f1-5fdc3705a8c&title=&width=295)

## 控制反转是什么?<br /><br />
答案：<br />控制反转就是说，把对象的控制权交给了 spring，由 spring 容器进行管理，我们不进行任何操作

## **为什么需要控制反转?**

答案：<br />我们想象一下，没有控制反转的时候，我们需要自己去创建对象，配置对象，还要人工去处理对象与对象之间的各种复杂的依赖关系，当一个工程的代码量很大时，这种关系的维护是非常令人头痛的，所以就有了控制反转这个概念，将对象的创建、配置等一系列操作交给 Spring 去管理，不需要⼈⼯来管理对象之间复杂的依赖关系。

## **IOC 容器有哪些?**<br /><br />
答案：<br />Spring 主要提供了两种 IOC 容器，一种是 BeanFactory，还有一种是 ApplicationContext<br />它们的区别，BeanFactory 只提供了最基本的实例化对象和拿对象的功能，而 ApplicationContext 是继承了 BeanFactory 所派生出来的产物，是其子类，它的作用更加的强大，比如支持注解注入、国际化等功能

## **DI 是什么?**

答案：<br />DI 就是依赖注入，其实和 IOC 大致相同，只不过是同一个概念使用了不同的角度去阐述<br />DI 所描述的重点是在于依赖，我们说了 IOC 的核心功能就是在于在程序运行时动态的向某个对象提供其他的依赖对象，而这个功能就是依靠 DI 去完成的，比如我们需要注入一个对象 A，而这个对象 A 依赖一个对象 B，那么我们就需要把这个对象 B 注入到对象 A 中，这就是依赖注入。<br />控制反转是一种思想，依赖注入是实现方式！<br />**Spring 有三种注入方式:**

- 接口注入
- 构造器函数注入
- setter 注入

## **AOP 是什么?**<br /><br />
答案：<br />AOP 意为：**面向切面编程，通过预编译方式和运行期间动态代理实现程序功能的统一维护的一种技术**。<br />AOP 是 OOP(面向对象编程) 的延续，是 Spring 框架中的一个重要内容，是函数式编程的一种衍生范型。利用 AOP 可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各部分之间的耦合度降低，提高程序的可重用性，同时提高了开发的效率。<br />**AOP 实现主要分为两类:**

- **静态 AOP 实现**， AOP 框架**在编译阶段**对程序源代码进行修改，生成了静态的 AOP 代理类（生成的 *.class 文件已经被改掉了，需要使用特定的编译器），比如 AspectJ
- **动态 AOP 实现**， AOP 框架**在运行阶段**对动态生成代理对象（在内存中以 JDK 动态代理，或 CGlib 动态地生成 AOP 代理类），如 SpringAOP

Spring 中 AOP 的实现是**通过动态代理实现的**，如果是实现了接口就会使用 JDK 动态代理，否则就使用 CGLIB 代理。<br />**有 5 种通知类型:**

- **@Before**:在目标方法调用前去通知
- **@AfterReturning**:在目标方法返回或异常后调用
- **@AfterThrowing**:在目标方法返回后调用
- **@After**:在目标方法异常后调用
- **@Around**:将目标方法封装起来，自己确定调用时机

## **动态代理和静态代理有什么区别?**

答案：<br />**静态代理**

- 由程序员创建或由特定工具自动生成源代码，再对其编译。在程序运行前，代理类的.class文件就已经存在了
- 静态代理通常只代理一个类
- 静态代理事先知道要代理的是什么

**动态代理**

- 在程序运行时，运用反射机制动态创建而成
- 动态代理是代理一个接口下的多个实现类
- 动态代理不知道要代理什么东西，只有在运行时才知道

## **JDK 动态代理和 CGLIB 代理有什么区别？**<br /><br />
答案：<br />1、JDK 动态代理时业务类必须要实现某个接口，它是基于反射的机制实现的，生成一个接口的代理子类，通过重写方法，实现对代码的增强。<br />2、CGLIB 动态代理是使用字节码处理框架 ASM，其原理是通过字节码技术为一个类创建子类，然后重写父类的方法，实现对代码的增强。

## **Spring AOP 和 AspectJ AOP 有什么区别？**<br /><br />
答案：<br />Spring AOP 是运行时增强，是通过**动态代理实现**的<br />AspectJ AOP 是编译时增强，需要特殊的编译器才可以完成，是通过**修改代码来实现**的，支持**三种织入方式**

- **编译时织入**: 就是在编译字节码的时候织入相关代理类
- **编译后织入**: 编译完初始类后发现需要 AOP 增强，然后织入相关代码
- **类加载时织入**: 在加载器加载类的时候织入

![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666951886741-a78837d2-05e5-4c20-9357-cd0c257b8df9.png#clientId=u88a40f25-8c08-4&from=paste&height=254&id=u1a863886&originHeight=411&originWidth=1003&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ueaf03ddc-2fc7-419e-b804-6c39e444528&title=&width=620)

| **主要区别** | **Spring AOP** | **AspecjtJ AOP** |
| --- | --- | --- |
| 增强方式 | 运行时增强 | 编译时增强 |
| 实现方式 | 动态代理 | 修改代码 |
| 编译器 | javac | 特殊的编译器 ajc |
| 效率 | 较低(运行时反射损耗性能) | 较高 |
| 织入方式 | 运行时 | 编译时、编译后、类加载时 |


## **Bean 生命周期?**<br /><br />
答案：<br />SpringBean 生命周期大致分为4个阶段：<br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666951886771-67e29e93-ea6b-4d1f-b40d-c34099d6f5e0.png#clientId=u88a40f25-8c08-4&from=paste&id=uccf9e7b9&originHeight=148&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub256b39b-07eb-4a70-9e64-750c8312621&title=)<br />**1、实例化**，实例化该 Bean 对象<br />**2、填充属性**，给该 Bean 的全局变量字段 赋值<br />**3、初始化**

- 如果实现了 Aware 接口，会通过其接口获取容器资源
- 如果实现了 BeanPostProcessor 接口，则会回调该接口的前置和后置处理增强
- 如果配置了 init-method 方法，会执行该方法

**4、销毁**

- 如果实现了 DisposableBean 接口，则会回调该接口的 destroy 方法
- 如果配置了 destroy-method 方法，则会执行 destroy-method 配置的方法

## Bean 生命周期扩展方式？

答案：<br />1、 InitializingBean 和 DisposableBean 回调接口<br />2、针对特殊行为的其他 Aware 接口<br />3、实现 BeanPostProcessor 接口，则会回调该接口的前置和后置处理增强<br />4、Bean 配置文件中的 init()方法和 destroy()方法<br />5、@PostConstruct 和 @PreDestroy 注解方式

## **Spring 怎么解决循环依赖?**<br /><br />
答案：<br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666951886783-c369e4a3-6744-4205-80eb-60ab96990f8f.png#clientId=u88a40f25-8c08-4&from=paste&id=uc7dc9c85&originHeight=222&originWidth=528&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u57319298-ed70-41b6-9ca5-cc8247173c0&title=)<br />循环依赖就是说两个对象相互依赖，形成了一个环形的调用链路<br />Spring 使用三级缓存去解决循环依赖，其**核心逻辑就是把实例化和初始化的步骤分开，然后放入缓存中**，供另一个对象调用

- **第一级缓存**：用来保存实例化、初始化都完成的对象
- **第二级缓存**：用来保存实例化完成，但是未初始化完成的对象
- **第三级缓存**：用来保存一个对象工厂，提供一个匿名内部类，用于创建二级缓存中的对象

当 A、B 两个类发生循环引用时 大致流程

- 1.A 完成实例化后，去**创建一个对象工厂，并放入三级缓存**当中
   - 如果 A 被 AOP 代理，那么通过这个工厂获取到的就是 A 代理后的对象
   - 如果 A 没有被 AOP 代理，那么这个工厂获取到的就是 A 实例化的对象
- 2.A 进行属性注入时，去**创建 B**
- 3.B 进行属性注入，需要 A ，则**从三级缓存中去取 A 工厂代理对象**并注入，然后删除三级缓存中的 A 工厂，将 A 对象放入二级缓存
- 4.B 完成后续属性注入，直到初始化结束，将 B 放入一级缓存
- 5.**A 从一级缓存中取到 B 并且注入 B，** 直到完成后续操作，将 A 从二级缓存删除并且放入一级缓存，循环依赖结束

Spring 解决循环依赖有两个前提条件：

- 1.**不全是构造器方式**的循环依赖 (否则无法分离初始化和实例化)
- 2.**必须是单例 **(否则无法保证是同一对象)

## **为什么要使用三级缓存，二级缓存不能解决吗?**<br /><br />
答案：<br />三级缓存的功能是只有发生循环依赖的时候，才去提前生成代理对象，否则只会**创建一个工厂并将其放入到三级缓存**中，但是不会去通过这个工厂去真正创建对象。<br />如果使用二级缓存解决循环依赖，意味着所有 Bean 在实例化后就要完成 AOP 代理，这样**违背了 Spring 设计的原则**，Spring 在设计之初就是在 Bean 生命周期的最后一步来完成 AOP 代理，而不是在实例化后就立马进行 AOP 代理。

## **事务隔离级别有哪些?**

答案：

- DEFAULT：采用 DB 默认的事务隔离级别
- READ_UNCOMMITTED：读未提交
- READ_COMMITTED：读已提交
- REPEATABLE_READ：可重复读
- SERIALIZABLE：串行化

## **事务的传播规则?**<br /><br />
答案：<br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666951887309-98247c4a-5b14-4fcd-9295-fc01b5091b93.png#clientId=u88a40f25-8c08-4&from=paste&id=u3966664c&originHeight=574&originWidth=890&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u42e43404-c7ba-4a16-b6f5-adb40fbfa38&title=)<br />**1、propagation_required**<br />  如果当前没有事务，就创建⼀个新事务；如果当前存在事务，则加⼊该事务。这也是通常我们的默认选择。<br />2、**propagation_supports**<br />  ⽀持当前事务，如果当前存在事务，就加⼊该事务，如果当前不存在事务，就以⾮事务执⾏。<br />**3、propagation_mandatory**<br />  ⽀持当前事务，如果当前存在事务，就加⼊该事务，如果当前不存在事务，就抛出异常。<br />**4、propagation_nested**<br />  如果当前方法正有一个事务在运行中，则该方法应该**运行在一个嵌套事务**中，被嵌套的事务可以独立于被封装的事务中进行提交或者回滚。如果封装事务存在，并且外层事务抛出异常回滚，那么内层事务必须回滚，反之，内层事务并不影响外层事务。如果封装事务不存在，则同propagation_required的一样<br />**5、propagation_never**<br />  以⾮事务⽅式执⾏，如果当前存在事务，则抛出异常。<br />6、**propagation_requires_new**<br />  不管当前是否存在事务，都创建一个新的事务。<br />**7、propagation_not_supported**<br />  以非事务方式执行。**如果有一个事务正在运行，他将在运行期被挂起，直到这个事务提交或者回滚才恢复执行**

## **Spring 支持哪些 ORM？**<br /><br />
答案：<br />1、Hibernate<br />2、myBatis<br />3、JPA (Java Persistence API)<br />4、TopLink<br />5、JDO (Java Data Objects)<br />6、OJB



