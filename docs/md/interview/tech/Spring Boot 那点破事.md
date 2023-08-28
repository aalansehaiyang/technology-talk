---
title: 第十一篇：Spring Boot ！starter组件、JPA、定时任务、全局异常
---

# Spring Boot 那点破事！starter组件、JPA、定时任务、全局异常

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学



## 什么是 **Spring Boot**？<br /><br />
答案：<br />Spring Boot 是 Spring 开源组织下的⼦项⽬，是 Spring 组件⼀站式解决⽅案，主要是简化了使⽤Spring 的难度，简省了繁重的配置，提供了各种启动器，开发者能快速上⼿。

## **Spring Boot 有哪些**优点？<br /><br />
答案：<br />1、容易上⼿，提升开发效率，为 Spring 开发提供⼀个更快、更⼴泛的⼊⻔体验。<br />2、开箱即⽤，远离繁琐的配置。<br />3、提供了⼀系列⼤型项⽬通⽤的⾮业务性功能，例如：内嵌服务器、安全管理、运⾏数据监控、运⾏状况检查和外部化配置等。<br />4、没有代码⽣成，也不需要XML配置。<br />5、避免⼤量的 Maven 导⼊和各种版本冲突。

## **什么是 JavaConfig？**

答案：<br />JavaConfig是Spring社区的产品，它提供了配置Spring IoC 容器的纯Java方法，有助于避免使用XML配置。<br />传统的Spring一般都是基本XML配置的，后来 Spring3.0 新增了许多 JavaConfig 注解，特别是SpringBoot，基本全部采用 JavaConfig。<br />比如：@Bean：bean的定义，相当于XML的<br /><bean id="orderMapper" class="cn.mybatis.mapper.OrderMapper" /> 

## Spring Boot Starter 自动配置原理？

答案：<br />1、Spring Boot 关于自动配置的源码在 spring-boot-autoconfigure-x.x.x.x.jar 中<br />2、@SpringBootApplication 中有一个注解@EnableAutoConfiguration，负责开启自动配置<br />3、通过SpringFactoriesLoader.loadFactoryNames() 扫描 META-INF/spring.factories配置文件中的自动配置类，是一组一组的key=value 键值对<br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666958841779-f0050d83-4bf5-4d57-9270-2c5a43d190b4.png#clientId=uedbfe36c-df9c-4&from=paste&id=ud9c79e8c&originHeight=1192&originWidth=2684&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc77880a0-5b50-4811-9f54-50bbd34b4d3&title=)<br />4、其中一个key是EnableAutoConfiguration类的全类名，而它的 value 是一个 xxxxAutoConfiguration 的类名的列表，它实际上是一个javaConfig 形式的 Spring 容器配置类，根据 @ConditionalOnClass注解条件，选择性的将这些自动配置类加载到Spring容器中。

**自动配置生效**<br />每一个XxxxAutoConfiguration 自动配置类都是在某些条件之下才会生效的，这些条件的限制在Spring Boot中以注解的形式体现，常见的条件注解有如下几项：

- @ConditionalOnBean：当容器里有指定的bean的条件下。
- @ConditionalOnMissingBean：当容器里不存在指定bean的条件下。
- @ConditionalOnClass：当类路径下有指定类的条件下。
- @ConditionalOnMissingClass：当类路径下不存在指定类的条件下。
- @ConditionalOnProperty：指定的属性是否有指定的值，比如@ConditionalOnProperties(prefix=”xxx.xxx”, value=”enable”, matchIfMissing=true)，代表当xxx.xxx为enable时条件的布尔值为true，如果没有设置的情况下也为true。

## **Spring-boot-starter-parent **有什么⽤** ?**

答案：<br />我们都知道，新创建⼀个 Spring Boot 项⽬，默认都是有 parent 的，这个 parent 就是 spring-boot<br />starter-parent <br />**spring-boot-starter-parent 主要作⽤：**<br />1、定义了 Java 编译版本为 1.8 <br />2、 使⽤ UTF-8 格式编码<br />3、继承⾃ spring-boot-dependencies，⾥边定义了依赖的版本，也正是因为继承了这个依赖，所以我们在引入 jar包依赖时不需要再指定jar版本号<br />4、执⾏打包操作的配置<br />5、⾃动化的资源过滤<br />6、⾃动化的插件配置<br />7、针对 application.properties 和 application.yml 的资源过滤，包括通过 profile 定义的不同环境的配置⽂件，例如 application-dev.properties 和 application-dev.yml

## Spring Boot 常用 Starter 有哪些？<br /><br />
答案：<br />1、 spring-boot-starter-web ：嵌入 Tomcat 和 web 开发需要的 servlet 和 jsp 支持<br />2、 spring-boot-starter-data-jpa ：数据库支持<br />3、 spring-boot-starter-data-Redis ：Redis 支持<br />4、 mybatis-spring-boot-starter ：第三方 mybatis 集成 starter<br />5、druid-spring-boot-starter ：数据库的连接池
> 官方包装的start组件：https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-starters

更多内容：[一文读懂Spring Boot各模块组件依赖关系](https://mp.weixin.qq.com/s/7DgpAA--uuOaWbvJWwfM9w)

## Spring Boot 常用注解有哪些？<br /><br />
答案：<br />1、@SpringBootApplication ： 是一个组合注解（组合注解可以自定义，包含所有引入注解功能）。定义在main方法入口类处，用于启动spring boot项目<br />2、@EnableAutoConfiguration ： 让spring boot容器根据类路径中的jar包依赖当前项目进行自动配置，文件在src/main/resources的META-INF/spring.factories<br />3、@Value ： application.properties定义属性，直接使用@Value注入即可<br />4、@ConfigurationProperties(prefix="person") ：可以新建一个properties文件，ConfigurationProperties的属性prefix指定properties的配置的前缀，通过location指定properties文件的位置<br />5、@RestController ： 组合@Controller和@ResponseBody，当你开发一个和页面交互数据的控制时，比如bbs-web的api接口需要此注解<br />更多内容： [Spring boot常用注解收集](https://mp.weixin.qq.com/s/_hk_alSB0evyv80nw-mPsg)

## **Spring Boot**配置加载顺序？<br /><br />
答案：<br />1、properties⽂件；<br />2、YAML⽂件；<br />3、系统环境变量；<br />4、命令⾏参数；

## **Spring Boot 的**运⾏⽅式？

答案：<br />1、直接执⾏ main ⽅法运⾏<br />2、⽤ Maven / Gradle 插件运⾏<br />3、打包⽤命令或者放到容器中运⾏

## Spring Boot 需要独立的容器运行吗?

答案：<br />不需要，内置了 Tomcat/ Jetty 等容器

## 什么是**YAML**？

答案：<br />YAML 是⼀种⼈类可读的数据序列化语⾔。它通常⽤于配置⽂件。与属性⽂件相⽐，如果我们想要在配置⽂件中添加复杂的属性，YAML ⽂件就更加结构化，⽽且更少混淆。可以看出 YAML 具有分层配置数据。

## **bootstrap.properties **和** application.properties **有何区别** ?**<br /><br />
答案：<br />单纯做 Spring Boot 开发，可能不太容易遇到 bootstrap.properties 配置⽂件，但是在结合 Spring Cloud 时，这个配置就会经常遇到了，特别是在需要加载⼀些远程配置⽂件的时侯。<br />**spring boot 核⼼的两个配置⽂件：**<br />1、bootstrap (. yml 或者 . properties)：boostrap 由⽗ ApplicationContext 加载的，⽐ applicaton优先加载，配置在应⽤程序上下⽂的引导阶段⽣效。⼀般来说我们在 Spring Cloud Config 或者Nacos 中会⽤到它。且 boostrap ⾥⾯的属性不能被覆盖；<br />2、application (. yml 或者 . properties)： 由ApplicatonContext 加载，⽤于 spring boot 项⽬的⾃动<br />化配置。

## SpringBoot 有哪几种读取配置的方式？<br /><br />
答案：<br />SpringBoot 可以通过 `@PropertySource`、`@Value`、`@Environment`、`@ConfigurationProperties` 来绑定变量。

## 如何在⾃定义端⼝上运⾏** Spring Boot **应⽤程序？<br /><br />
答案：<br />可以在application.properties 中指定端⼝，如：server.port = 8090

## 什么是 **Spring Data ?**<br /><br />
答案：<br />Spring Data 是 Spring 的⼀个⼦项⽬。⽤于简化数据库访问，⽀持NoSQL 和 关系数据存储。其主要⽬标是使数据库的访问变得⽅便快捷。Spring Data 具有如下特点：<br />**SpringData 项⽬⽀持 NoSQL 存储：**<br />1、MongoDB （⽂档数据库）<br />2、 Neo4j（图形数据库）<br />3、Redis（键/值存储）<br />4、Hbase（列族数据库）

## 什么是 Spring Data JPA？

答案：<br />SpringData JPA ，全称Java Persistence API。是 Spring Data 框架下的一个基于JPA标准操作数据的模块。简化操作持久层的代码，只需要编写接口就可以。<br />JPA 和 Mybatis 作用是相同的，都是持久层框架。

## 什么是 **Spring Batch**？<br /><br />
答案：<br />Spring Boot Batch 提供可重⽤的函数，这些函数在处理⼤量记录时⾮常重要，包括⽇志/跟踪，事务管理，作业处理统计信息，作业重新启动，跳过和资源管理。<br />还提供了更先进的技术服务和功能，通过优化和分区技术，可以实现极⾼批量和⾼性能批处理作业。简单以及复杂的⼤批量批处理作业可以⾼度可扩展的⽅式利⽤框架处理重要⼤量的信息。

## Spring Boot 打成的 jar 和普通的 jar 有什么区别 ?

答案：<br />Spring Boot的项目终止以jar包的形式进行打包，这种jar包可以通过可以通过命令（java -jar xxx.jar）来运行的，这种jar包不能被其他项目所依赖，即使被依赖了也不能直接使用其中的类。<br />普通的jar包，解压后直接就是包名，包里就是我们的代码，而 Spring Boot 打包成的可执行 jar 解压后，在 \BOOT-INF\classes 目录下才是我们的代码，因此无法被直接引用。如果非要引用，可以在 pom.xml 文件中增加配置，将 Spring Boot 项目打包成两个 jar ，一个可执行，一个可引用。

```
<build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <executions>
                    <execution>
                        <goals>
                            <!--可以把依赖的包都打包到生成的Jar包中 -->
                            <goal>repackage</goal>
                        </goals>
                        <!--可以生成不含依赖包的不可执行Jar包 -->
                        <configuration>
                            <classifier>exec</classifier>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
```
一次打包生成两个jar包，其中XXX.jar 可作为其它工程的依赖，XXX-exec.jar可被执行<br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666958841844-0d2d5146-ff70-44b9-bc71-cc642babed14.png#clientId=uedbfe36c-df9c-4&from=paste&id=u1c885b29&originHeight=98&originWidth=934&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u82605cac-ca44-4baa-8ca9-75eb348bc35&title=)

## 开启 **Spring Boot**特性有哪⼏种⽅式？

答案：<br />1、继承 spring-boot-starter-parent 项⽬<br />2、添加 spring-boot-dependencies jar包依赖

## **Spring Boot 统一参数校验**？

答案：<br />使用` @Validated`注解配合参数校验注解， 比如：`@NotEmpty`、 `@NotNull `对参数进行校验。然后对抛出的异常`ControllerAdvice`进行捕获然后调整输出数据。
```
 <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
 </dependency>
```


## **Spring Boot 全局**异常处理？

答案：<br />Spring 提供了⼀种注解实现 @RestControllerAdvice，让代码更优雅。<br />@RestControllerAdvice是一个应用于Controller层的切面注解，它一般配合@ExceptionHandler注解一起使用，作为一个系统的全局异常处理。

## **Spring Boot 统一结果返回**？

答案：<br />将响应结果定义为一个统一的标准格式，一般要包括状态码、描述信息、返回数据。
```
code ：响应状态码
message ：响应结果描述
data：返回的数据
```


## **Spring Boot **如何实现定时任务** ?**

答案：<br />定时任务很常见，Spring Boot 对于定时任务的⽀持有两种⽅式：<br />1、使用 Spring 中的 @Scheduled 注解<br />2、使⽤第三⽅框架 Quartz <br />使⽤ Spring 中的 @Scheduled 的⽅式主要通过 @Scheduled 注解来实现。<br />使⽤ Quartz ，则按照 Quartz 的⽅式，定义 Job 和 Trigger 即可。

## **Spring Boot**如何实现异步调用？<br /><br />
答案：<br />SpringBoot中使用异步调用很简单，只需要在方法上添加@Async注解即可实现方法的异步调用。<br />注意：需要在启动类加上@EnableAsync使异步调用@Async注解生效。

## **SpringBoot 实现分页和排序?**

答案：<br />使用Spring Boot 实现分页非常简单。使用Spring Data JPA将可分页的 org.springframework.data.domain.Pageable 传递给存储库方法

## **如何在 Spring Boot 启动的时候运行一些特定的代码？**<br /><br />
答案：<br />可以实现接口 ApplicationRunner 或者 CommandLineRunner，这两个接口实现方式一样，它们都只提供了一个 run 方法

## **如何实现 SpringBoot 应用程序的安全性?**<br /><br />
答案 ：<br />为了实现Spring Boot的安全性，我们使用 spring-boot-starter-security依赖项，并且必须添加安全配置。它只需要很少的代码。配置类将必须扩展WebSecurityConfigurerAdapter并覆盖其方法。

## **Spring Security **和** Shiro **各⾃的优缺点** ?**

答案：<br />由于 Spring Boot 官⽅提供了⼤量的⾮常⽅便的开箱即⽤的 Starter ，包括 Spring Security 的 Starter，使得在 Spring Boot 中使⽤ Spring Security 变得更加容易，甚⾄只需要添加⼀个依赖就可以保护所有的接⼝。<br />如果是 Spring Boot 项⽬，⼀般选择 Spring Security 。当然这只是⼀个建议的组合，单纯从技术上来说，⽆论怎么组合，都是没有问题的。Shiro 和 Spring Security 相⽐，主要有如下⼀些特点：<br />1、Spring Security 是⼀个重量级的安全管理框架；Shiro 则是⼀个轻量级的安全管理框架<br />2、Spring Security 概念复杂，配置繁琐；Shiro 概念简单、配置简单<br />3、Spring Security 功能强⼤；Shiro 功能简单

## **如何集成 SpringBoot 和 ActiveMQ？**

答案：<br />对于集成Spring Boot和ActiveMQ，我们使用spring-boot-starter-activemq 依赖关系。只需要很少的配置，并且不需要样板代码。

## **RequestMapping 和 GetMapping 有什么区别?**<br /><br />
答案：<br />RequestMapping 具有类属性的，可以进行 GET,POST,PUT 或者其它的注释中具有的请求方法。<br />GetMapping 是 GET 请求方法中的一个特例，它只是 ResquestMapping 的一个延伸，目的是为了提高清晰度。

## SpringBoot可以兼容老Spring项目吗?<br /><br />
答案：<br />可以兼容，使用 `@ImportResource` 注解导入老 Spring 项目配置文件。

## **保护 SpringBoot 应用有哪些方法?**

答案：

- 在生产中使用HTTPS 使用Snyk检查你的依赖关系
- 升级到最新版本
- 启用CSRF保护
- 使用内容安全策略防止XSS攻击

## **Spring Boot 支持哪些日志框架？**

答案：<br />Spring Boot 支持 Java Util Logging、 Log4j2、 Logback ，如果你使用 Starters 启动器，Spring Boot 将使用 Logback 作为默认日志框架。

## SpringBoot、Spring MVC 和 Spring 有什么区别？

答案：<br />**1、 Spring**<br />Spring最重要的特征是依赖注入。所有 Spring Modules 不是依赖注入就是 IOC 控制反转。当我们恰当的使用 DI 或者是 IOC 的时候，我们可以开发松耦合应用。<br />**2、 Spring MVC**<br />Spring MVC 提供了一种分离式的方法来开发 Web 应用。通过像 DispatcherServlet，ModelAndView 和 ViewResolver 等一些简单的概念，开发 Web 应用将会变的非常简单。<br />**3、 Spring Boot**<br />Spring 和 SpringMVC 的问题在于需要配置大量的参数。SpringBoot 通过一个自动配置来解决这个问题。为了更快的构建产品，SpringBoot 提供了一些非功能性特征。

## **SpringBoot 2.X 有什么新特性?**

答案：<br />1、配置变更<br />2、JDK 版本升级<br />3、第三方类库升级<br />4、响应式 Spring 编程支持<br />5、HTTP/2 支持<br />6、配置属性绑定<br />7、更多改进与加强…
