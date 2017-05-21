## Quartz
---
### 简介：

* 开源的任务调度框架，提供了强大的调度机制
* 接口扩展性好，接入简单
* 支持调度运行环境的持久化机制

### 基础结构：

* Job

   是一个接口，内部只有一个方法  public void execute(JobExecutionContext context) throws JobExecutionException，开发者在方法体内实现自己的业务逻辑，JobExecutionContext提供了调度上下文的各种信息。

* JobDetail

  描述Job的实现类及其他静态信息，如Job名称、描述、关联监听器等信息，运行时通过newInstance()的反射机制实例化Job
  
* Trigger

  描述触发Job执行的时间规则，主要有SimpleTrigger和CronTrigger两个子类。当仅需触发一次或以固定时间间隔周期执行，SimpleTrigger是最合适的。如果是定义各种复杂的时间规则，CronTrigger比较合适。
  
* Scheduler

  表示Quartz的独立运行容器，Trigger和JobDetail可以注册到Scheduler中，两者在Scheduler中有各自的组和名称。一个Job可以对应多个Trigger，而一个Trigger只能对应一个Job。

**常用的时间表达式：**

|表达式|说明|
|---|---|
|0 0 12 * * ？|每天12：00运行|
|0 15 10 ？ * *|每天10：15运行|
|0 15 10 * * ？|每天10：15运行|
|0 15 10 * * ？ *|每天10：15运行|
|0 15 10 * * ? 2016|在2016年每天10：15 |
|0 * 14 * * ？| 每天14点到15点之间每分钟运行一次，开始14：00，结束于14：59|
|0 0/5 14 * * ?|每天14点到15点之间每5分钟运行一次，开始于14：00，结束于14：55 |
|0 0/5 14,18 * * ？| 每天14点到15点之前每5分钟运行一次，另外每天18点到19点每5分钟也运行一次|
|0 0-5 14 * * ？|每天14：00到14：05，每分钟运行一次|
|0 15 10 ？ * MON-FRI|每周一、二、三、四、五的10：15分运行|
|0 15 10 15 * ？|每月15日10：15运行|
|0 15 10 L * ?|每月最后一天的10：15运行|

```
说明：

第一位：秒
第二位：分
第三位：时
第四位：日
第五位：月
第六位：星期
第七位：年（可选）

符号：
（*） 表示对应时间域的每一个时刻，比如* 在分钟字段时，表示每一分钟
（？）只有在日期和星期字段中使用，无特殊含义，相当于点位符
（-） 表示范围，比如小时字段中使用9-11，表示9点到11点，即9、10、11
（，）表示一个列表值，比如星期字段中使用“MON,WEN,FRI”表示星期一、星期三和星期五
（/）x/y表示一个等步长序列，x为起始值，y为步长，比如0/15表示0、15、30、45
（L）只在日期和星期字段中使用，L在日期字段，表示这个月份的最后一天，比如一月的31号；如果用在星期中，表示星期六。

```




### pom依赖

```
<dependency>
	<groupId>org.quartz-scheduler</groupId>
	<artifactId>quartz</artifactId>
	<version>2.2.1</version>
</dependency>
```

### 代码示例：

##### 1. 调度工厂配置，里面注册了所有的trigger触发器

```
<bean class="org.springframework.scheduling.quartz.SchedulerFactoryBean">
		<property name="triggers">
			<list>
				<ref bean="hotPostsCollectTrigger" />
			</list>
		</property>
</bean>
```

**SchedulerFactoryBean特点：**

* 以Bean风格的方式为Scheduler提供配置信息
* 让Scheduler与Spring容器的生命周期建立关联
* 通过属性配置部分或全部代替Quartz自身的配置文件

##### 2. trigger触发器，包含具体的任务和触发时间规则

```
<bean id="hotPostsCollectTrigger"
		class="org.springframework.scheduling.quartz.CronTriggerFactoryBean">
		<property name="jobDetail" ref="hotPostsCollectJobDetail" />
		<property name="cronExpression" value="0 30 23 * * ?" />
</bean>
```

##### 3. 编写自己业务的jobdetail类，实现job接口

```
<bean id="hotPostsCollectJob" class="com.onlyone.bbs.task.job.HotPostsCollectJob" />
<bean id="hotPostsCollectJobDetail"	class="org.springframework.scheduling.quartz.MethodInvokingJobDetailFactoryBean">
		<property name="targetObject" ref="hotPostsCollectJob" />
		<property name="targetMethod" value="doHandle" />
		<property name="concurrent" value="false" />
</bean>
```

```
public class HotPostsCollectJob implements Job {

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        // 框架默认的接口
    }

	//也可以自己定义方法，此时需要在JobDetail调用时用targetMethod指定
    public void doHandle() {
    
    }
}
```