## 常用java类

---

#### 1.jvm虚拟机注册一个勾子，当虚拟机要关闭时，会执行预先注册的线程任务。

```
Runtime.getRuntime().addShutdownHook(new Thread() {

            public void run() {
                try {
                    logger.info("## stop the canal client");
                    clientTest.stop();
                } catch (Throwable e) {
                    logger.warn("##something goes wrong when stopping canal:\n{}", ExceptionUtils.getFullStackTrace(e));
                } finally {
                    logger.info("## canal client is down.");
                }
            }

        });
 ```
 
####2. 在