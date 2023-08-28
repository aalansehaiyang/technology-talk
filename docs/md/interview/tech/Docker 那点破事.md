---
title: 第十八篇：Docker ！容器、虚拟机、镜像、分层
---

# Docker 那点破事！容器、虚拟机、镜像、分层

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学


## 什么是 Docker ？<br /><br />
答案：<br />1、Docker 是一个容器化平台，它包装你所有开发环境依赖成一个整体，像一个容器。保证项目开发，如开发、测试、发布等各生产环节都可以无缝工作在不同的平台<br />2、Docker 容器：将一个软件包装在一个完整的文件系统中，该文件系统包含运行所需的一切：代码，运行时，系统工具，系统库等。可以安装在服务器上的任何东西。<br />3、这保证软件总是运行在相同的运行环境，无需考虑基础环境配置的改变。

## Docker 的优点？<br /><br />
答案：<br />1、灵活：即使是最复杂的应用也可以集装箱化。<br />2、轻量级：容器利用并共享主机内核。<br />3、可互换：可以即时部署更新和升级。<br />4、便携式：可以在本地构建，部署到云，并在任何地方运行。<br />5、可扩展：可以增加并自动分发容器副本。<br />6、可堆叠：可以垂直和即时堆叠服务。

## Docker 应用场景有哪些？

答案：<br />1、Web 应用的自动化打包和发布。<br />2、自动化测试和持续集成、发布。<br />3、在服务型环境中部署和调整数据库或其他的后台应用

## Docker 与 虚拟机的区别？<br /><br />
答案：<br />1、虚拟机通过添加`Hypervisor层`（虚拟化中间层），虚拟出网卡、内存、CPU等虚拟硬件，再在其上建立虚拟机，每个虚拟机都有自己的系统内核。<br />2、Docker容器则是通过隔离（namesapce）的方式，将文件系统、进程、设备、网络等资源进行隔离，再对权限、CPU资源等进行控制（cgroup），最终让容器之间互不影响，容器无法影响宿主机。<br />与虚拟机相比，容器资源损耗要少。同样的宿主机下，能够建立容器的数量要比虚拟机多<br />但是，虚拟机的安全性要比容器稍好，而docker容器与宿主机共享内核、文件系统等资源，更有可能对其他容器、宿主机产生影响。

## Docker 三大核心是什么？

答案：<br />**1、镜像**<br />Docker的镜像是创建容器的基础，类似虚拟机的快照，可以理解为一个面向Docker容器引擎的只读模板。<br />通过镜像启动一个容器，一个镜像是一个可执行的包，其中包括运行应用程序所需要的所有内容包含代码，运行时间，库、环境变量、和配置文件。<br />Docker镜像也是一个压缩包，只是这个压缩包不只是可执行文件，环境部署脚本，它还包含了完整的操作系统。因为大部分的镜像都是基于某个操作系统来构建，所以很轻松的就可以构建本地和远端一样的环境，这也是Docker镜像的精髓。<br />**2、 容器**<br />Docker 容器是从镜像创建的运行实例，它可以被启动、停止和删除。所创建的每一个容器都是相互隔离、互不可见，以保证平台的安全性。可以把容器看做是一个简易版的linux环境（包括root用户权限、镜像空间、用户空间和网络空间等）和运行在其中的应用程序。<br />**3、仓库**<br />仓库注册服务器上往往存放着多个仓库，每个仓库中包含了多个镜像，每个镜像有不同标签（tag）。<br />仓库分为公开仓库（Public）和私有仓库（Private）两种形式。<br />最大的公开仓库是 Docker Hub：https://hub.docker.com，存放了数量庞大的镜像供用户下载。

## Docker 后台的标准运行过程是什么？

答案：<br />当利用 docker run 来创建容器时， Docker 在后台的标准运行过程是：

- 检查本地是否存在指定的镜像。当镜像不存在时，会从公有仓库下载；
- 利用镜像创建并启动一个容器；
- 分配一个文件系统给容器，在只读的镜像层外面挂载一层可读写层；
- 从宿主主机配置的网桥接口中桥接一个虚拟机接口到容器中；
- 分配一个地址池中的 IP 地址给容器；
- 执行用户指定的应用程序，执行完毕后容器被终止运行。

## 什么是Docker 数据卷？<br /><br />
答案：<br />数据卷是一个供容器使用的特殊目录，位于容器中。可将宿主机的目录挂载到数据卷上，对数据卷的修改操作立刻可见，并且更新数据不会影响镜像，从而实现数据在宿主机与容器之间的迁移。数据卷的使用类似于Linux下对目录进行的mount操作。<br />如果需要在容器之间共享一些数据，最简单的方法就是使用数据卷容器。数据卷容器是一个普通的容器，专门提供数据卷给其他容器挂载使用。<br />容器互联是通过容器的名称在容器间建立一条专门的网络通信隧道。简单点说，就是会在源容器和接收容器之间建立一条隧道，接收容器可以看到源容器指定的信息

## 什么是 Docker 镜像？

答案：<br />Docker image 是 Docker 容器的源。换言之，Docker images 用于创建 Docker 容器（containers）。镜像（Images）通过 Docker build 命令创建。<br />当 run 镜像时，它启动成一个 容器（container）进程。 做好的镜像由于可能非常庞大，常注册存储在诸如 registry.hub.docker.com 这样的公共平台上。<br />镜像常被分层设计，每层可单独成为一个小镜像，由多层小镜像再构成大镜像，这样碎片化的设计为了使镜像在互联网上共享时，最小化传输数据。

## 什么是 Docker 容器？<br /><br />
答案：<br />Docker 容器 包含其所有运行依赖环境，但与其它容器共享操作系统内核的应用，它运行在独立的主机操作系统用户空间进程中。<br />Docker 容器并不紧密依赖特定的基础平台：可运行在任何配置的计算机，任何平台以及任何云平台上。

## 什么是 Docker 中心 hub？<br /><br />
答案：<br />Docker hub 是云基础的 Docker 注册服务平台，它允许用户进行访问 Docker 中心资源库，创建自己的 Docker 镜像并测试，推送并存储创建好的 Docker 镜像，连接 Docker 云平台将已创建好的指定 Docker 镜像布署到本地主机等任务。它提供了一个查找发现 Docker 镜像，发布 Docker 镜像及控制变化升级的资源中心，成为用户组或团队协作开发中保证自动化开发流程的有效技术途径。

## Docker 容器存在的运行阶段？<br /><br />
答案：<br />1、运行中（Running）<br />2、已暂停（Paused）<br />3、重启中（Restarting）<br />4、已退出（Exited）

## 查看容器的运行状态？

答案：<br />docker ps –a，以列表形式输出运行在主机上的所有 Docker 容器及其运行状态。

## Dockerfile 配置文件中最常用的指令？<br /><br />
答案：<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/21503536/1668649371858-eab671c4-b34b-43cc-a9df-0fe405ed1bad.png#averageHue=%23272832&clientId=u5eeda804-cc6e-4&from=paste&height=559&id=uf4346b1c&name=image.png&originHeight=825&originWidth=740&originalType=binary&ratio=1&rotation=0&showTitle=false&size=167811&status=done&style=none&taskId=u40673c94-59f6-4dfb-a20a-578d00ea33f&title=&width=501)

## **Docker 如何部署 MySQL？**<br /><br />
答案：<br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666971830173-e6d8196c-46ca-4e05-bbe1-a211103a8088.png#averageHue=%23eff1f3&clientId=u6bfff2c9-cd29-4&from=paste&id=uefaab117&originHeight=656&originWidth=705&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u295276bd-d558-4d26-8474-f9ff3828006&title=)

## 如何查看Docker 容器的环境变量？<br /><br />
答案：<br />**1、方案一：**<br />使用 `docker inspect` 命令，不仅能查看环境变量，还能查看容器其它相关信息，非常丰富，以Json格式输出。<br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666971830191-eb7c63a5-2dcb-4960-acd3-c10e3be5f694.png#averageHue=%23585656&clientId=u6bfff2c9-cd29-4&from=paste&height=462&id=u40d7b28a&originHeight=555&originWidth=818&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua589ba50-e482-4d35-9c6f-db3fc639fcc&title=&width=681)

**2、方案二**<br />通过`Dockerfile`打包镜像的时候可以配置环境变量：
```
ENV SERVER_PORT 80
ENV APP_NAME pkslow
```

**3、方案三**<br />启动设置docker run --env，使用--env和-e是一样效果的，示例如下：
```
$ docker run -itd --name=centos -e SERVER_PORT=80 --env APP_NAME=pkslow centos:7b3d42726ca6cdddd7ae09d70e720d6db94ff030617c7ba5f58374ec43f8e8d68

$ docker exec centos env
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
HOSTNAME=b3d42726ca6c
SERVER_PORT=80
APP_NAME=pkslow
HOME=/root
```

**4、方案四**<br />把配置信息放在文件env.list里，
```
$ cat env.list 
VAR1=www
VAR2=pkslow.com
VAR3=www.pkslow.com
```
启动容器时传入文件
```
$ docker run -itd --name=centos --env-file env.list centos:7
1ef776e2ca2e4d3f8cdb816d3a059206fc9381db58d7290ef69301472f9b4186

$ docker exec centos env
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
HOSTNAME=1ef776e2ca2e
VAR1=www
VAR2=pkslow.com
VAR3=www.pkslow.com
HOME=/root
```
如果想把宿主上的所有环境变量都传入到容器里，可以这样操作
```
$ env > env.list
$ docker run -itd --name=centos --env-file env.list centos:7
```

## 本地的镜像文件都存放在哪里？<br /><br />
答案：<br />Docker 相关的本地资源存放在/var/lib/docker/目录下，其中container目录存放容器信息，graph目录存放镜像信息，aufs目录下存放具体的镜像底层文件。

## 容器退出后，通过docker ps 命令查看不到，数据会丢失么？<br /><br />
答案：<br />容器退出后会处于终止（exited）状态，此时可以通过 docker ps -a 查看，其中数据不会丢失，可以通过docker start 来启动，只有删除容器才会清除数据。

## 如何停止所有正在运行的容器？<br /><br />
答案：<br />使用docker kill $(sudo docker ps -q)

## 如何清理批量后台停止的容器？<br /><br />
答案：<br />使用 docker rm $（sudo docker ps -a -q）

## 如何临时退出一个正在交互的容器的终端，而不终止它？

答案：<br />按Ctrl+p，后按Ctrl+q，如果按Ctrl+c会使容器内的应用进程终止，进而会使容器终止。

## 如何查看容器日志信息？<br /><br />
答案：<br />使用`docker logs`，后面跟容器的名称或者ID信息

## 可以在一个容器中同时运行多个应用进程吗？<br /><br />
答案：<br />一般不推荐在同一个容器内运行多个应用进程，如果有类似需求，可以通过额外的进程管理机制，比如`supervisord`来管理所运行的进程

## 如何控制容器占用系统资源（CPU，内存）的份额？


答案：<br />使用docker create命令创建容器或使用docker run 创建并运行容器的时候，可以使用 -c|–cpu-shares[=0]参数来调整同期使用CPU的权重，使用-m|–memory参数来调整容器使用内存的大小。

## DevOps 有哪些优势？<br /><br />
答案：<br />1、持续的软件交付能力<br />2、修复问题变得简单<br />3、更快得解决问题

## 如何使用 Docker 技术创建与环境无关的容器系统？<br /><br />
答案：<br />1、存储卷（Volumes）<br />2、环境变量（Environment variable）注入<br />3、只读（Read-only）文件系统

## Dockerfile 配置文件中的 COPY 和 ADD 指令有什么不同？

答案：<br />虽然 ADD 和 COPY 功能相似，推荐 COPY <br />那是因为 COPY 比 ADD 更直观易懂。 COPY 只是将本地文件拷入容器这么简单，而 ADD 有一些其它特性功能（诸如，本地归档解压和支持远程网址访问等），这些特性在指令本身体现并不明显。因此，有必要使用 ADD 指令的最好例子是需要在本地自动解压归档文件到容器中的情况，如 ADD rootfs.tar.xz 

## Docker 应用流程？

答案：<br />1、开始，所有都有赖于 `Dockerfile` 配置文件。Dockerfile 配置文件就是创建 Docker image (镜像) 的源代码。<br />2、一旦 Dockerfile 配置好了，通过 `Docker build `命令并生成 image（镜像） ，镜像就是 Dockerfile 配置文件中 `源代码` 的 `编译版本`。<br />3、生成镜像 ，就可以在 registry（注册中心） 发布它。镜像类似 git 的资源库 ，你可以推送你的镜像，也可取回库中的镜像<br />4、可以使用 镜像 去启动运行 containers（容器）。运行中的容器在许多方面，与虚拟机非常相似，但容器的运行不需要依赖虚拟管理软件的运行。

## Docker Image 和 Docker Layer 区别？

答案：<br />1、Image ：一个 Docker Image 是由一系列 Docker 只读层（read-only Layer） 创建出来的。<br />2、Layer： 在 Dockerfile 配置文件中完成的一条配置指令，即表示一个 Docker 层（Layer）。<br />如下 Dockerfile 文件包含 4 条指令，每条指令创建一个层（Layer）。
```
FROM ubuntu:15.04
RUN make /app
COPY . /app
CMD python /app/app.py
```
注意：每层只对其前一层进行某些进化
