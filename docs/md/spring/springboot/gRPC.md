---
title: Spring Boot 集成 gRPC
---

# Spring Boot 集成 gRPC

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学


`Spring Boot 作为主流微服务框架，拥有成熟的社区生态。市场应用广泛，为了方便大家，整理了一个基于spring boot的常用中间件快速集成入门系列手册，涉及RPC、缓存、消息队列、分库分表、注册中心、分布式配置等常用开源组件，大概有几十篇文章，陆续会开放出来，感兴趣同学可以关注&收藏`



## 简介

在 gRPC 里，客户端应用可以像调用本地对象一样直接调用另一台不同的机器上服务端应用的方法，使得我们能够更容易地创建分布式应用和服务。

gRPC 基于 HTTP/2 标准设计，带来诸如双向流、流控、头部压缩、单 TCP 连接上的多复用请求等。这些特性使得其在移动设备上表现更好，更省电和节省空间占用。

> 目前有非常多优秀的开源项目采用 gRPC 作为通信方式，例如说 Kubernetes、SkyWalking、istio 等等。甚至说，Dubbo 自 2.7.5 版本之后，开始提供对 gRPC 协议的支持

**gRPC 主要提供了新增两种 RPC 调用方式：**

* 普通 RPC 调用方式，即请求 - 响应模式。
* 基于 HTTP/2.0 的 streaming 调用方式。

gRPC 服务调用支持同步和异步方式，同时也支持普通的 RPC 和 streaming 模式，可以最大程度满足业务的需求。

streaming 模式，可以充分利用 HTTP/2.0 协议的多路复用功能，实现在一条 HTTP 链路上并行双向传输数据，有效的解决了 HTTP/1.X 的数据单向传输问题，在大幅减少 HTTP 连接的情况下，充分利用单条链路的性能，可以媲美传统的 RPC 私有长连接协议：更少的链路、更高的性能。

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/23-4.jpg" width="800px">
</div>

gRPC 的网络 I/O 通信基于 Netty 构建，服务调用底层统一使用异步方式，同步调用是在异步的基础上做了上层封装。因此，gRPC 的异步化是比较彻底的，对于提升 I/O 密集型业务的吞吐量和可靠性有很大的帮助。

netty采用多路复用的 Reactor 线程模型：基于 Linux 的 epoll 和 Selector，一个 I/O 线程可以并行处理成百上千条链路，解决了传统同步 I/O 通信线程膨胀的问题。NIO 解决的是通信层面的异步问题，跟服务调用的异步没有必然关系。

## 应用场景

公司早期，为了满足业务快速迭代，技术选型随意，经常遇到多种语言开发，比如：java、python、php、.net 等搭建了不同的业务系统。现在考虑平台化技术升级，一些基础功能需要收拢统一，建设若干微服务中心（如：用户中心、权限中心）。基于此背景，如何做技术选型，我们可以考虑使用gRPC。


## gRPC实现步骤

* 定义一个服务，指定其能够被远程调用的方法（包含参数、返回类型）
* 在服务端实现这个接口，并运行一个 gRPC 服务器来处理客户端请求
* 在客户端实现一个存根 Stub ，用于发起远程方法调用

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/23-2.jpg" width="800px">
</div>

> gRPC 客户端和服务端可以在多种语言与环境中运行和交互！我们可以很容易地用 Java 创建一个 gRPC 服务端，用 Java、Go、Python、Ruby 来创建 gRPC 客户端来访问它。


## 代码演示


### 外部依赖

在 pom.xml 中添加以下依赖项：

```
<dependency>
    <groupId>io.grpc</groupId>
    <artifactId>grpc-netty</artifactId>
    <version>${grpc.version}</version>
</dependency>
<dependency>
    <groupId>io.grpc</groupId>
    <artifactId>grpc-protobuf</artifactId>
    <version>${grpc.version}</version>
</dependency>
<dependency>
    <groupId>io.grpc</groupId>
    <artifactId>grpc-stub</artifactId>
    <version>${grpc.version}</version>
</dependency>
```

* 引入 `grpc-protobuf` 依赖，使用 Protobuf 作为序列化库。
* 引入 `grpc-stub` 依赖，使用 gRPC Stub 作为客户端。


添加maven依赖

```
<build>
    <extensions>
        <extension>
            <groupId>kr.motd.maven</groupId>
            <artifactId>os-maven-plugin</artifactId>
            <version>1.5.0.Final</version>
        </extension>
    </extensions>
    <plugins>
        <plugin>
            <groupId>org.xolstice.maven.plugins</groupId>
            <artifactId>protobuf-maven-plugin</artifactId>
            <version>0.5.1</version>
            <configuration>
                <protocArtifact>com.google.protobuf:protoc:3.5.1-1:exe:${os.detected.classifier}</protocArtifact>
                <pluginId>grpc-java</pluginId>
                <pluginArtifact>io.grpc:protoc-gen-grpc-java:1.15.0:exe:${os.detected.classifier}</pluginArtifact>
            </configuration>
            <executions>
                <execution>
                    <goals>
                        <goal>compile</goal>
                        <goal>compile-custom</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

* 引入 `os-maven-plugin` 插件，从 OS 系统中获取参数。因为需要通过它从 OS 系统中获取 `os.detected.classifier` 参数。
* 引入 `protobuf-maven-plugin` 插件，实现将`proto` 目录下的`protobuf` 文件，生成`Service` 和 `Message` 类。

### 定义proto接口规范

```
service UserService {
    rpc query (UserRequest) returns (UserResponse);
}

message UserRequest {
    string name = 1;

}
message UserResponse {
    string name = 1;
    int32 age = 2;
    string address = 3;
}
```

点击 IDEA 的「compile」按钮，编译 `spring-boot-bulking-grpc-proto` 项目，并同时执行 `protobuf-maven-plugin` 插件进行生成。结果如下图所示：

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/23-3.jpg" width="800px">
</div>

### 服务端实现

定义注解类，用于扫描Grpc相关接口服务

```
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface GrpcService {
}
```

接口实现类

```
@GrpcService
public class UserService extends UserServiceGrpc.UserServiceImplBase {

    @Override
    public void query(UserRequest request, StreamObserver<UserResponse> responseObserver) {
        System.out.println(" UserService 接收到的参数，name：" + request.getName());

        UserResponse response = UserResponse.newBuilder().setName("微观技术").setAge(30).setAddress("上海").build();
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

}
```

启动grpc server端，监听9091端口，并添加proto定义的接口实现类

```
@Component
public class ServiceManager {
    private Server server;
    private int grpcServerPort = 9091;
    public void loadService(Map<String, Object> grpcServiceBeanMap) throws IOException, InterruptedException {
        ServerBuilder serverBuilder = ServerBuilder.forPort(grpcServerPort);
        // 采用注解扫描方式，添加服务
        for (Object bean : grpcServiceBeanMap.values()) {
            serverBuilder.addService((BindableService) bean);
            System.out.println(bean.getClass().getSimpleName() + " is regist in Spring Boot！");

        }
        server = serverBuilder.build().start();

        System.out.println("grpc server is started at " + grpcServerPort);

        // 增加一个钩子，当JVM进程退出时，Server 关闭
        Runtime.getRuntime().addShutdownHook(new Thread() {
            @Override
            public void run() {
                System.err.println("*** shutting down gRPC server since JVM is shutting down");
                if (server != null) {
                    server.shutdown();
                }
                System.err.println("*** server shut down！！！！");
            }
        });
        server.awaitTermination();
    }
}
```

Server 端启动成功

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/23-1.jpg" width="800px">
</div>

### 客户端调用

定义接口的Stub实例，用于发起远程服务调用

```
@Configuration
public class GrpcServiceConfig {
    @Bean
    public ManagedChannel getChannel() {
        ManagedChannel channel = ManagedChannelBuilder.forAddress("localhost", 9091)
                .usePlaintext()
                .build();
        return channel;
    }
    @Bean
    public HelloServiceGrpc.HelloServiceBlockingStub getStub1(ManagedChannel channel) {
        return HelloServiceGrpc.newBlockingStub(channel);
    }
    @Bean
    public UserServiceGrpc.UserServiceBlockingStub getStub2(ManagedChannel channel) {
        return UserServiceGrpc.newBlockingStub(channel);
    }
}
```

Restful接口调用，访问：`http://localhost:8098/query`

```
@RequestMapping("/query")
public String query() {
    UserRequest request = UserRequest.newBuilder()
            .setName("微观技术")
            .build();
    UserResponse userResponse = userServiceBlockingStub.query(request);
    String result = String.format("name:%s  , age:%s , address:%s ", userResponse.getName(), userResponse.getAge(), userResponse.getAddress());
    System.out.println(result);
    return result;
}
```

## 开箱即用 Starter 组件

gRPC 社区暂时没有提供 Spring Boot Starter 库，以简化我们对 gRPC 的配置。不过国内有大神已经开源了一个。

> 地址：https://github.com/yidongnan/grpc-spring-boot-starter

### 特性

* 在 spring boot 应用中，通过 `@GrpcService` 自动配置并运行一个嵌入式的 gRPC 服务
* 使用 `@GrpcClient` 自动创建和管理你的  gRPC Channels 和 stubs
* 支持 `Spring Cloud` (向 Consul 或 Eureka 或 Nacos 注册服务并获取gRPC服务信息）
* 支持 `Spring Sleuth` 进行链路跟踪(需要单独引入 brave-instrumentation-grpc)
* 支持对 server、client 分别设置全局拦截器或单个的拦截器
* 支持 `Spring-Security`
* 支持metric (基于 micrometer / actuator )
* 也适用于 (non-shaded) grpc-netty

## 项目源码

```
https://github.com/aalansehaiyang/spring-boot-bulking  

三个模块：
spring-boot-bulking-grpc-proto
spring-boot-bulking-grpc-client
spring-boot-bulking-grpc-server
```
