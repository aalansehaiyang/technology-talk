## commons-io

---

#### 封装了一些常用工具类方法，用于IO的各种操作:

* Utility class ，提供一些静态方法来满足一些常用的业务场景
* Input ， InputStream 和 Reader 实现
* Output ， OutputStream 和 Writer 实现
* Filters ， 多种文件过滤器实现（定义了 IOFileFilter接口，同时继承了 FileFilter 和 FilenameFilter 接口）
* comparator包， 文件比较，提供了多种 java.util.Comparator<File> 实现


#### pom依赖

```
 <dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
    <version>2.4</version>
</dependency>

```
#### 常用工具类

* IOUtils 

  提供各种静态方法，用于处理读，写和、拷贝，这些方法基于InputStream、OutputStream、Reader 和 Writer
  
  ```
  InputStream in = new URL( "http://commons.apache.org" ).openStream();
try {
    System.out.println( IOUtils.toString( in ) );
} finally {
    IOUtils.closeQuietly(in);
}
  ```
  
* FileUtils

    提供各种静态方法，基于File对象工作，包括读、写、拷贝、比较文件
  
  ```
  File file = new File("/commons/io/project.properties");
List lines = FileUtils.readLines(file, "UTF-8");
  ```

* LineIterator

  提供灵活的方式操作基于行的文件。通过FileUtils 或 IOUtils中的静态方法，可以直接创建一个实例
  
  ```
  LineIterator it = FileUtils.lineIterator(file, "UTF-8");
try {
    while (it.hasNext()) {
        String line = it.nextLine();
        /// do something with line
    }
} finally {
    LineIterator.closeQuietly(it);
}
  ```

##### 参考资料：

http://ifeve.com/commons-io/