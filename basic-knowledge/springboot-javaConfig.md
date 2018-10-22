## springboot-javaConfig
---

* @SpringBootApplication

```
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@Configuration
@EnableAutoConfiguration
@ComponentScan
public @interface SpringBootApplication {

	/**
	 * Exclude specific auto-configuration classes such that they will never be applied.
	 * @return the classes to exclude
	 */
	Class<?>[] exclude() default {};

}
```
定义在main方法入口类处，用于启动sping boot应用项目

* @EnableAutoConfiguration

让spring boot根据类路径中的jar包依赖当前项目进行自动配置

在src/main/resources的META-INF/spring.factories

```
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.admin.SpringApplicationAdminJmxAutoConfiguration,\
org.springframework.boot.autoconfigure.aop.AopAutoConfiguration

若有多个自动配置，用“，”隔开
```

* @ImportResource

加载xml配置，一般是放在启动main类上

```
@ImportResource("classpath*:/spring/*.xml")  单个

@ImportResource({"classpath*:/spring/1.xml","classpath*:/spring/2.xml"})   多个

```

* @Value

application.properties定义属性，直接使用@Value注入即可

```
public class A{
	 @Value("${push.start:0}")    如果缺失，默认值为0
     private Long  id;
}
```

* @ConfigurationProperties(prefix="person")

可以新建一个properties文件，ConfigurationProperties的属性prefix指定properties的配置的前缀，通过location指定properties文件的位置

```
@ConfigurationProperties(prefix="person")
public class PersonProperties {
	
	private String name ;
	private int age;
}
```

* @EnableConfigurationProperties

用 @EnableConfigurationProperties注解使 @ConfigurationProperties生效，并从IOC容器中获取bean。

https://blog.csdn.net/u010502101/article/details/78758330


* @RestController

组合@Controller和@ResponseBody，当你开发一个和页面交互数据的控制时，比如bbs-web的api接口需要此注解

* @RequestMapping("/api2/copper")

用来映射web请求（访问路径和参数）、处理类和方法，可以注解在类或方法上。注解在方法上的路径会继承注解在类上的路径。

produces属性：定制返回的response的媒体类型和字符集，或需返回值是json对象

```
@RequestMapping(value="/api2/copper",produces="application/json;charset=UTF-8",method = RequestMethod.POST)
```

* @RequestParam 

获取request请求的参数值

```
 public List<CopperVO> getOpList(HttpServletRequest request,
                                    @RequestParam(value = "pageIndex", required = false) Integer pageIndex,
                                    @RequestParam(value = "pageSize", required = false) Integer pageSize) {
 
  }
```

* @ResponseBody

支持将返回值放在response体内，而不是返回一个页面。比如Ajax接口，可以用此注解返回数据而不是页面。此注解可以放置在返回值前或方法前。

```
另一个玩法，可以不用@ResponseBody。
继承FastJsonHttpMessageConverter类并对writeInternal方法扩展，在spring响应结果时，再次拦截、加工结果
// stringResult：json返回结果
//HttpOutputMessage outputMessage

 byte[] payload = stringResult.getBytes();
 outputMessage.getHeaders().setContentType(META_TYPE);
 outputMessage.getHeaders().setContentLength(payload.length);
 outputMessage.getBody().write(payload);
 outputMessage.getBody().flush();
```

* @Bean(name="bean的名字",initMethod="初始化时调用方法名字",destroyMethod="close")

定义在方法上，在容器内初始化一个bean实例类。

```
@Bean(destroyMethod="close")
@ConditionalOnMissingBean
public PersonService registryService() {
		return new PersonService();
	}
```

* @Service  用于标注业务层组件

* @Controller用于标注控制层组件（如struts中的action）

* @Repository用于标注数据访问组件，即DAO组件

* @Component泛指组件，当组件不好归类的时候，我们可以使用这个注解进行标注。

* @PostConstruct

spring容器初始化时，要执行该方法


```
@PostConstruct  
public void init() {   
}   
```

* @PathVariable  用来获得请求url中的动态参数

```
@Controller  
public class TestController {  

     @RequestMapping(value="/user/{userId}/roles/{roleId}",method = RequestMethod.GET)  
     public String getLogin(@PathVariable("userId") String userId,  
         @PathVariable("roleId") String roleId){
           
         System.out.println("User Id : " + userId);  
         System.out.println("Role Id : " + roleId);  
         return "hello";  
     
     }  
}
```

* @ComponentScan  注解会告知Spring扫描指定的包来初始化Spring 

```
@ComponentScan(basePackages = "com.bbs.xx")
```

* @EnableZuulProxy

路由网关的主要目的是为了让所有的微服务对外只有一个接口，我们只需访问一个网关地址，即可由网关将所有的请求代理到不同的服务中。Spring Cloud是通过Zuul来实现的，支持自动路由映射到在Eureka Server上注册的服务。Spring Cloud提供了注解@EnableZuulProxy来启用路由代理。

* Autowired

在默认情况下使用 @Autowired 注释进行自动注入时，Spring 容器中匹配的候选 Bean 数目必须有且仅有一个。当找不到一个匹配的 Bean 时，Spring 容器将抛出 BeanCreationException 异常，并指出必须至少拥有一个匹配的 Bean。

当不能确定 Spring 容器中一定拥有某个类的 Bean 时，可以在需要自动注入该类 Bean 的地方可以使用 @Autowired(required = false)，这等于告诉 Spring：在找不到匹配 Bean 时也不报错

[@Autowired注解注入map、list与@Qualifier](https://blog.csdn.net/ethunsex/article/details/66475792)


* @Configuration

```
@Configuration("name")//表示这是一个配置信息类,可以给这个配置类也起一个名称
@ComponentScan("spring4")//类似于xml中的<context:component-scan base-package="spring4"/>
public class Config {

    @Autowired//自动注入，如果容器中有多个符合的bean时，需要进一步明确
    @Qualifier("compent")//进一步指明注入bean名称为compent的bean
    private Compent compent;

    @Bean//类似于xml中的<bean id="newbean" class="spring4.Compent"/>
    public Compent newbean(){
        return new Compent();
    }   
}

```
* @Import(Config1.class)

导入Config1配置类里实例化的bean

```
@Configuration
public class CDConfig {

    @Bean   // 将SgtPeppers注册为 SpringContext中的bean
    public CompactDisc compactDisc() {
        return new CompactDisc();  // CompactDisc类型的
    }
}



@Configuration
@Import(CDConfig.class)  //导入CDConfig的配置
public class CDPlayerConfig {

    @Bean(name = "cDPlayer")
    public CDPlayer cdPlayer(CompactDisc compactDisc) {  
         // 这里会注入CompactDisc类型的bean
         // 这里注入的这个bean是CDConfig.class中的CompactDisc类型的那个bean
        return new CDPlayer(compactDisc);
    }
}
```

* @Order

@Order(1)，值越小优先级超高，越先运行

* @ConditionalOnExpression

```
@Configuration
@ConditionalOnExpression("${enabled:false}")
public class BigpipeConfiguration {
    @Bean
    public OrderMessageMonitor orderMessageMonitor(ConfigContext configContext) {
        return new OrderMessageMonitor(configContext);
    }
}
```

开关为true的时候才实例化bean

* @ConditionalOnProperty

这个注解能够控制某个 @Configuration 是否生效。具体操作是通过其两个属性name以及havingValue来实现的，其中name用来从application.properties中读取某个属性值，如果该值为空，则返回false;如果值不为空，则将该值与havingValue指定的值进行比较，如果一样则返回true;否则返回false。如果返回值为false，则该configuration不生效；为true则生效。

https://blog.csdn.net/dalangzhonghangxing/article/details/78420057

* @ConditionalOnClass

该注解的参数对应的类在class path中，否则不解析该注解修饰的配置类

```
@Configuration
@ConditionalOnClass({Gson.class})
public class GsonAutoConfiguration {
    public GsonAutoConfiguration() {
    }

    @Bean
    @ConditionalOnMissingBean
    public Gson gson() {
        return new Gson();
    }
}

```

* ConditionalOnBean


```
@Configuration
@ConditionalOnBean({LoadBalancerClient.class})
@EnableConfigurationProperties({LoadBalancerRetryProperties.class})
public class LoadBalancerAutoConfiguration {
。。。

}
```
只有 LoadBalancerClient类创建的bean对象在容器中存在时，才会执行LoadBalancerAutoConfiguration中的配置类


* @ConditionalOnMisssingClass({ApplicationManager.class})

如果存在它修饰的类的bean，则不需要再创建这个bean；


* @ConditionOnMissingBean(name = "example")

表示如果name为“example”的bean存在，该注解修饰的代码块不执行。
