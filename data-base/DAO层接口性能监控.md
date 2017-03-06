## DAO层接口性能监控

---

####简介：

笼统来讲讲，任何系统都可以抽象为数据+算法。而数据库作为数据的存储系统，其响应快慢直接影响着系统的整体性能。

目前很多大公司内部都有一些定制的监控系统，可以多维度采集数据，生成各种报表。

不过这样的系统维护成本比较高，甚至要专门的技术人员维护。如果是创业公司，可能不具备这种条件，不过我们可以通过一些简单方法，也能达到同样的效果。

比如通过Spring AOP机制，统计dao方法的调用时间，超过一定阈值，会打印到日志中。后面可以接入邮件系统，每天统计慢sql，了解系统的健康状况，**及时优化各种潜在的风险。**

**代码示例：**

```
@Aspect
@Component
public class DaoRTLogAspect {

    private static final Logger logger = LoggerFactory.getLogger("daoRTLog");

    @Pointcut("execution(public * com.onlyone.bbs.dal.dao..*.*(..))")
    public void daoLog() {
    }

    @Around("daoLog()")
    public Object profile(ProceedingJoinPoint pjp) throws Throwable {
        String method = pjp.getSignature().toString();
        Long _startTime = System.currentTimeMillis();
        try {
            return pjp.proceed();
        } finally {
            Long _wasteTime = System.currentTimeMillis() - _startTime;
            if (_wasteTime > 50) {
                StringBuilder sb = new StringBuilder();
                sb.append("method=").append(method).append(",wasteTime=").append(_wasteTime);
                logger.info(sb.toString());
            }
        }
    }

}


```