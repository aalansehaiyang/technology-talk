## ab性能压测

---

##### ab命令原理 
Apache的ab命令模拟多线程并发请求，测试服务器负载压力，也可以测试nginx、lighthttp、IIS等其它Web服务器的压力。 

ab命令对发出负载的计算机要求很低，既不会占用很多CPU，也不会占用太多的内存，但却会给目标服务器造成巨大的负载，因此是某些DDOS攻击之必备良药，老少皆宜。自己使用也须谨慎。否则一次上太多的负载，造成目标服务器直接因内存耗光死机，而不得不硬重启，得不偿失。

##### 采用linux的ab命令执行web接口性能测试

Mac OS X中配置Apache

参考 http://www.cnblogs.com/snandy/archive/2012/11/13/2765381.html

##### mac中应该是自带了Apache

终端查看mac版本

more /System/Library/CoreServices/SystemVersion.plist

显示：

```
<key>ProductVersion</key>
<string>10.9.3</string>
```
Apache启动

```
sudo apachectl start
```
打开Safari浏览器地址栏输入 “http://localhost”，可以看到内容为“It works!”的页面。表示启动成功。

##### 下载安装httpd-2.4.10

下载链接：http://httpd.apache.org/download.cgi

##### 使用ab进行web接口性能测试

终端进入到httpd-2.4.10/support目录

cd /Users/onlyone/software/httpd-2.4.27

ab -r -n 200 -c 10 http://localhost:8092/data/get1

-n：请求数

-c：并发数

注意：压测时如果报错：

```
Benchmarking localhost (be patient)
socket: Too many open files in system (23)
Total of 327 requests completed
```
mac或linux系统有文件限制，结果文件数超过最大限制，导致程序异常。

 ulimit -a  
 
```
-t: cpu time (seconds)              unlimited
-f: file size (blocks)              unlimited
-d: data seg size (kbytes)          unlimited
-s: stack size (kbytes)             8192
-c: core file size (blocks)         0
-v: address space (kbytes)          unlimited
-l: locked-in-memory size (kbytes)  unlimited
-u: processes                       709
-n: file descriptors                327  (文件数)
```
 
 调整文件系统值
 
 ```
 ulimit -n 8192 
 
 ```
 
##### ab压测结果分析
 
```
This is ApacheBench, Version 2.3 <$Revision: 655654 $> 
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/ 
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking 192.168.0.10 (be patient) 
Completed 100 requests 
Completed 200 requests 
Completed 300 requests 
Completed 400 requests 
Completed 500 requests 
Completed 600 requests 
Completed 700 requests 
Completed 800 requests 
Finished 800 requests


Server Software:        Microsoft-HTTPAPI/2.0 
Server Hostname:        192.168.0.10 
Server Port:            80

Document Path:          / 
Document Length:        315 bytes       HTTP响应数据的正文长度

Concurrency Level:      800 
Time taken for tests:   0.914 seconds    所有这些请求处理完成所花费的时间 
Complete requests:      800             完成请求数 
Failed requests:        0                失败请求数 
Write errors:           0                
Non-2xx responses:      800 
Total transferred:      393600 bytes     网络总传输量 
HTML transferred:       252000 bytes     HTML内容传输量 
Requests per second:    875.22 [#/sec] (mean) 吞吐量-每秒请求数 
Time per request:       914.052 [ms] (mean)  服务器收到请求，响应页面要花费的时间 
Time per request:       1.143 [ms] (mean, across all concurrent requests) 并发的每个请求平均消耗时间 
Transfer rate:          420.52 [Kbytes/sec] received 平均每秒网络上的流量，可以帮助排除是否存在网络流量过大导致响应时间延长的问题


网络上消耗的时间的分解： 
Connection Times (ms) 
              min  mean[+/-sd] median   max 
Connect:        0    1   0.5      1       3 
Processing:   245  534 125.2    570     682 
Waiting:       11  386 189.1    409     669 
Total:        246  535 125.0    571     684

整个场景中所有请求的响应情况。在场景中每个请求都有一个响应时间 
其中 50％ 的用户响应时间小于 571 毫秒 
80 ％ 的用户响应时间小于 652 毫秒 
最大的响应时间小于 684 毫秒 
Percentage of the requests served within a certain time (ms) 
  50%    571 
  66%    627 
  75%    646 
  80%    652 
  90%    666 
  95%    677 
  98%    681 
  99%    682 
100%    684 (longest request)
```
 