## spring boot 笔记
---

#### 框架---模块---体系---生态

#### 简介

springboot是基于spring+java+web容器，微服务框架的杰出代表。微服务其实就是将服务粒度做小，使之可以独立承担对外服务的的职责。

##### 特征
* 遵循“约定胜于配置”的原则，使用spring boot只需要很少的配置，大部分时候可以使用默认配置
* 项目快速搭建，可以配置整合第三方框架
* 可完全不使用xml配置，借助java config
* 内嵌Servlet（如 Tomcat）容器，可以jar包运行
* 运行中的应用状态监控

**微服务优势：**

*	独立性。每个微服务都是一个独立的项目。可以独立对外提供服务，可以将研发人力资源很好的分摊，避免人力资源密集带来的沟通、协作成本。（低耦合原则）
*	稳定性。任何一个微服务的失败都将只影响自己或少量其他微服务，不会影响整个服务运行体系。

SpringApplication将一个典型的spring应用启动的流程“模板化”，默认模板化后执行流程就可以满足需求了，如果有特殊需求，SpringApplication在合适的流程节点开放了一系列不同类型的扩展点，我们可以通过这些扩展点对SpringBoot程序的启动和关闭过程进行扩展。

```

@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class,
                                  DataSourceTransactionManagerAutoConfiguration.class })
public class Main extends WebMvcConfigurationSupport {

public static void main(String[] args) {
        SpringApplication app = new SpringApplication(Main.class, "classpath*:/spring/*.xml");
        app.setShowBanner(false);
        app.run(args);
    }
}
```

**执行流程：**

1.如果我们使用的是SpringApplication的静态run方法，首先需要创建一个SpringApplication对象实例。

a）使用SpringFactoriesLoader在应用的classpath中查找并加载所有可用的ApplicationContextInitialize

b）使用SpringFactoriesLoader在应用的classpath中查找并加载所有可用的ApplicationListener

c）设置main方法的定义类

2.开始执行run方法的逻辑，首先遍历执行所有通过SpringFactoriesLoader加载到的SpringApplicationRunListener，调用它们的started()方法，告诉这些SpringApplicationRunListener，SpringBoot应用要开始执行了。

3.创建并配置当前SpringBoot应用将要使用的Environment

4.遍历并调用所有的SpringApplicationRunListener的environmentPrepared()方法，告诉它们，Springboot应用使用的Environment准备好了

5.确定SpringBoot应用创建什么类型的ApplicationContext，并创建完成，然后根据条件决定是否使用自定义的ShutdownHook，是否使用自定义的BeanNameGenerator，是否使用自定义的ResourceLoader，然后将准备好的Environment设置给创建好的ApplicationContext使用

6.ApplicationContext创建完成，SpringApplication调用之前加载的ApplicationContextInitialize的initialize方法对创建好的ApplicationContext进行进一步的处理

7.遍历所有SpringApplicationRunListener的contextPrepared()方法，通知它们，SpringBoot应用使用的ApplicationContext准备好了

8.将之前通过@EnableAutoConfiguration获取的所有配置以及其他形式的Ioc容器配置加载到已经你准备完毕的ApplicationContext

9.遍历所有的SpringApplicationRunListener的contextLoader()方法，告知ApplicationContext已装载完毕

10.调用ApplicationContext的refresh()方法，完成Ioc容器可用的最后一道工序

11.查找当前ApplicationContext中是否注册有CommandLineRunner，如果有，则遍历执行它们

12.遍历所有的SpringApplicationRunListener的finished()方法，告知，“初始化完成”

---

##### spring boot提供了很多“开箱即用”的依赖模块，以"spring-boot-starter-"开头，以解决不同场景问题。

1.SpringBoot应用将自动使用logback作为应用日志框架，

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-logging</artifactId>
</dependency>
```

2.得到一个直接可执行的web应用，当前项目下直接运行mvn spring-boot:run 就可以直接启动一个嵌入tomcat服务请求的web应用。

默认访问地址：http://localhost:8080

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```
如果想使用其它容器，可引入spring-boot-starter-jetty

另外可以修改server.port使用自己指定的端口

3.访问数据库依赖此模块。

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
```


4.负责web应用安全，配合spring-boot-starter-web使用


```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```


5.监控，了解应用的运行状态


```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

上面只是介绍一些常用的组件，sping社区还有很多其它优秀的组件，可以根据自己的业务情况研究自取。



