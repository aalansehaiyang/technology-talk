### linux常用命令



### 目录

* [linux常用命令](http://blog.csdn.net/itomge/article/details/8797114)

---


####CPU相关信息* top* vmstat 1 / vmstat -s* mpstat 1 / mpstat -P ALL 1* sar/sar-f /var/log/sa/saXX* w* uptime* top -H和ps -efL/-Tel  显示线程
####内存相关信息 
* top* vmstat 1/vmstat -s * sar -r* cat /proc/meminfo 
* free -m


####IO相关信息
* tsar --traffic：显示网络带宽* netstat -an：显示连接(-n参数不反向解析域名) 
* iostat 1：每秒显示磁盘设备的各种tps* sar -b：磁盘状态历史记录