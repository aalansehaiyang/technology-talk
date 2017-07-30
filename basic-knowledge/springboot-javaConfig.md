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