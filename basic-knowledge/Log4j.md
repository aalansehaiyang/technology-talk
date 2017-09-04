## java日志

---

#### 一、Log4

Log4j是Apache的一个开源项目，它允许开发者以任意间隔输出日志信息.。主要分为两部分：一是appender，是输出日志的方式；二是logger，是具体日志输出器

**1.Appender**

　　其中，Log4j提供的appender有以下几种：
　　

* org.apache.log4j.ConsoleAppender（输出到控制台）
* org.apache.log4j.FileAppender（输出到文件）
* org.apache.log4j.DailyRollingFileAppender（每天产生一个日志文件）
* org.apache.log4j.RollingFileAppender（文件到达指定大小的时候产生一个新的文件）
* org.apache.log4j.WriterAppender（将日志信息以流格式发送到任意指定的地方）

例如：

```
<appender name=" ConsoleAppenderA"class="org.apache.log4j.ConsoleAppender">
        <param name="target" value="System.out"/>
        <layout class="org.apache.log4j.PatternLayout">
            <param name="ConversionPattern"value="%-5p %x %c{2} -%m%n"/>
        </layout>
</appender>

<appender name="BUSINESSERRORAPPENDER" class="com.alibaba.common.logging.spi.log4j.DailyRollingFileAppender">
        <param name="file" value="${luna_loggingRoot}/usr/common/business-error.log"/>
        <param name="append" value="true"/>
        <param name="encoding" value="GBK"/>
        <layout class="org.apache.log4j.PatternLayout">
            <param name="ConversionPattern" value="%d %-5p %c{2} - %m%n"/>
        </layout>
    </appender>
    
     <appender name="cacheFile" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <File>${LOG_HOME}/redis-cache.log</File>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${LOG_HOME}/redis-cache-%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>100MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
        </rollingPolicy>
        <encoder>
            <Pattern>%date{ISO8601} %-5level [%thread] %logger{32} - %message%n</Pattern>
        </encoder>
    </appender>
```

**其中，Log4j提供的layout有以下几种：**

* org.apache.log4j.HTMLLayout（以HTML表格形式布局）
* org.apache.log4j.PatternLayout（可以灵活地指定布局模式）
* org.apache.log4j.SimpleLayout（包含日志信息的级别和信息字符串）
* org.apache.log4j.TTCCLayout（包含日志产生的时间、线程、类别等等信息）



**格式化日志信息Log4J采用类似C语言中的printf函数的打印格式格式化日志信息，打印参数如下：**

* %m 输出代码中指定的消息
* %p 输出优先级，即DEBUG，INFO，WARN，ERROR，FATAL
* %r 输出自应用启动到输出该log信息耗费的毫秒数
* %c 输出所属的类目，通常就是所在类的全名
* %t 输出产生该日志事件的线程名
* %n 输出一个回车换行符，Windows平台为“rn”，Unix平台为“n”
* %d 输出日志时间点的日期或时间，默认格式为ISO8601，也可以在其后指定格式，比如：%d{yyyy MMM ddHH:mm:ss,SSS}，输出类似：2002年10月18日 22：10：28，921
* %l 输出日志事件的发生位置，包括类目名、发生的线程，以及在代码中的行数。

**2.Logger**

Log4j中有一个根日志器

```
<root>
   <level value="$luna_loggingLevel"/>
   <appender-ref ref="PROJECT"/>
   <appender-ref ref="EXCEPTION_LOG"/>
</root>
```


默认时系统中其他所有非根logger都会继承根日志器，logger如果有level属性就会覆盖继承日志器（比如根日志器)的level属性。而appender会叠加，即本logger的配置的appender加上继承日志器上的appender。

```
<logger name="com.alibaba.service.VelocityService">
        <level value="INFO"/>
        <appender-ref ref="ConsoleAppenderA"/>
</logger>
```

根据继承原则得到这个logger的level是INFO，appender是ConsoleAppenderA、PROJECT、EXCEPTION_LOG。
也可以使logger不继承其他logger，使用additivity="false"

```
<logger name="com.alibaba.china.pylon.enhancedmit.domain.Handler" additivity="false">
	    <level value="info"/>
	    <appender-ref ref="enhancedMITAppender"/>
</logger>
```

其中，level 是日志记录的优先级，分为OFF、FATAL、ERROR、WARN、INFO、DEBUG、ALL或者自定义的级别。

Log4j常用的四个级别，优先级从高到低分别是ERROR、WARN、INFO、DEBUG。通过在这里定义的级别，您可以控制到应用程序中相应级别的日志信息的开关。**比如在这里定义了INFO级别，只有等于及高于这个级别的才会处理，而DEBUG级别的日志信息将不会被打印出来。**

ALL：打印所有的日志，OFF：关闭所有的日志输出。 
appender-ref属性即使用logger引用之前配置过的appender。


**在程序中怎么创建logger，并调用呢？**

```
Logger logger =Logger.getLogger(VelocityService.class.getName());　
或
Logger logger =LogFactory.getLog(VelocityService.class);
logger.debug("Justtesting a log message with priority set to DEBUG");
logger.info("Just testinga log message with priority set to INFO");
logger.warn("Just testinga log message with priority set to WARN");
logger.error("Justtesting a log message with priority set to ERROR");
logger.fatal("Justtesting a log message with priority set to FATAL");
```
 
另外，logger对name的前缀默认也有继承性，例：

```
<logger name="com.alibaba.service" additivity="false">
     <level value="INFO"/>
     <appender-ref ref="ConsoleAppenderA"/>
</logger>

<logger name="com.alibaba.service.VelocityService">
    <level value="INFO"/>
    <appender-ref ref="FileAppenderA"/>
 </logger>
 ````
 
根据继承原则名为com.alibaba.service.VelocityService的logger的appender是FileAppenderA和ConsoleAppenderA，level的为INFO。


#### 二、SLF4J

Log4J （Simple Logging Facade for Java）使用普遍，但是框架较重，引入了很多无用的包，相比SLF4J就灵活很多。SLF4J很好地解耦了API和实现，例如，你可以强制使用SLF4J的API，而保持生产环境中用了几年的旧的Log4J.properties文件。

例如：

```
Logger.debug("Hello " + name);
```

由于字符串拼接的问题（注：上述语句会先拼接字符串，再根据当前级别是否低于debug决定是否输出本条日志，即使不输出日志，字符串拼接操作也会执行），许多公司强制使用下面的语句，这样只有当前处于DEBUG级别时才会执行字符串拼接：

```
if (logger.isDebugEnabled()) {
    LOGGER.debug(“Hello ” + name);
}
```

它避免了字符串拼接问题，但有点太繁琐了是不是？相对地，SLF4J提供下面这样简单的语法:

```
LOGGER.debug("Hello {}", name);
```

它的形式类似第一条示例，而又没有字符串拼接问题，也不像第二条那样繁琐。

**pom依赖：**

```
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>jcl-over-slf4j</artifactId>
            <version>1.7.7</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>log4j-over-slf4j</artifactId>
            <version>1.7.7</version>
        </dependency>
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-core</artifactId>
            <version>1.1.2</version>
        </dependency>
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-classic</artifactId>
            <version>1.1.2</version>
        </dependency>
```

**参考资料：**


http://ifeve.com/java-slf4j-think/

https://www.slf4j.org/