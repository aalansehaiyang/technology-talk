###JDK内置工具补充

---

####1.查看正在运行的JVM的参数

```
jcmd 24684 VM.flags
```

返回结果：

```
-XX:CICompilerCount=3 -XX:ErrorFile=/data/program/java_error.log -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/data/program/java.hprof -XX:InitialHeapSize=130023424 -XX:+ManagementServer -XX:MaxHeapSize=2063597568 -XX:MaxNewSize=687865856 -XX:MinHeapDeltaBytes=524288 -XX:NewSize=42991616 -XX:OldSize=87031808 -XX:+PrintGC -XX:+PrintGCDateStamps -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseParallelGC
```


