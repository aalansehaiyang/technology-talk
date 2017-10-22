## super-diamond源码分析

---

#### 附录

* [源码](https://github.com/melin/super-diamond)
* [项目文档](https://www.oschina.net/p/super-diamond)

---
#### 源码笔记

#### 一、客户端部分
1.初始化xml配置

```
<bean name="bbsWebPropertiesConfiguration" class="com.github.diamond.client.PropertiesConfigurationFactoryBean">
        <constructor-arg index="0" value="${config.server.ip}" />
        <constructor-arg index="1" value="${config.server.port}" />
        <constructor-arg index="2" value="应用名" />
        <constructor-arg index="3" value="${profiles.active}" />
</bean>
```

初始化bbsWebPropertiesConfiguration时，与服务器建立连接com.github.diamond.client.PropertiesConfiguration.connectServer(String, int, String, String)

2.实例化对象，建立连接

* 本地封装Netty4Client对象，内部实现与netty与服务端的通信逻辑
* 如果已经建立连接，向服务端发送请求（应用启动时，需要加载最新的配置项）
* 响应，获取配置项
* 备份数据到本机文件
* 加载配置项到本机内存中
* 如果没有建立连接，直接使用本机备份预热到内存中
* 启动一个线程任务（一直运行）
   * 如果建立连接，client.receiveMessage()，从服务器端读信息，如果没有新消息，该方法会被阻塞
   * 否则，休眠1秒

```
protected void connectServer(String host, int port, final String projCode, final String profile) {
        final String clientMsg = "superdiamond," + projCode + "," + profile;
        try {
            client = new Netty4Client(host, port, new ClientChannelInitializer(), clientMsg);

            if (client.isConnected()) {
                client.sendMessage(clientMsg);
                String message = client.receiveMessage();

                if (message != null) {
                    String versionStr = message.substring(0, message.indexOf("\r\n"));
                    LOGGER.info("加载远程配置信息，项目编码：{}，Profile：{}, Version：{}", projCode, profile,
                        versionStr.split(" = ")[1]);

                    FileUtils.saveData(projCode, profile, message);
                    load(new StringReader(message), false);
                }
            } else {
                String message = FileUtils.readConfigFromLocal(projCode, profile);
                if (message != null) {
                    String versionStr = message.substring(0, message.indexOf("\r\n"));
                    LOGGER.info("加载本地备份配置信息，项目编码：{}，Profile：{}, Version：{}", projCode, profile,
                        versionStr.split(" = ")[1]);

                    load(new StringReader(message), false);
                } else
                    throw new ConfigurationRuntimeException(
                        "本地没有备份配置数据，PropertiesConfiguration 初始化失败。");
            }

            reloadExecutorService.submit(new Runnable() {
                private final String projCodeString = projCode;
                private final String profileString = profile;
                @Override
                public void run() {
                    while(reloadable) {
                        try {
                            if(client.isConnected()) {
                                String message = client.receiveMessage();
                                if(message != null) {
                                    String versionStr = message.substring(0, message.indexOf("\r\n"));
                                    LOGGER.info("==================== 重新加载配置信息，项目编码：{}，Profile：{}, Version：{}", projCodeString, profileString, versionStr.split(" = ")[1]);
                                    FileUtils.saveData(projCodeString, profileString, message);
                                    load(new StringReader(message), true);
                                }
                            } else {
                                TimeUnit.SECONDS.sleep(1);
                            }
                        } catch(Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
            });
        } catch (Exception e) {
            if (client != null) {
                client.close();
            }
            throw new ConfigurationRuntimeException(e.getMessage(), e);
        }
    }

```

3.初始化Netty4Client对象，内部主要是做心跳检测，保证Connection有效

```
public Netty4Client(String host, int port, ClientChannelInitializer channelInitializer, String reconnectMsg) throws Exception {
    	this.host = host;
		this.port = port;
		this.channelInitializer = channelInitializer;
		this.reconnectMsg = reconnectMsg;

		try {
            doOpen();
        } catch (Throwable t) {
            close();
            throw new Exception("Failed to start " + getClass().getSimpleName() + " " + NetUtils.getLocalAddress() 
                                        + " connect to the server " + host + ", cause: " + t.getMessage(), t);
        }
        try {
            connect();
                
            logger.info("Start " + getClass().getSimpleName() + " " + NetUtils.getLocalAddress() + " connect to the server " + host);
        } catch (Throwable t){
            throw new Exception("Failed to start " + getClass().getSimpleName() + " " + NetUtils.getLocalAddress() 
                    + " connect to the server " + host + ", cause: " + t.getMessage(), t);
        }
    }
```

实例化 io.netty.bootstrap.Bootstrap对象

```
  private void doOpen() throws Throwable {
    	bootstrap = new Bootstrap();
    	
    	bootstrap.option(ChannelOption.SO_KEEPALIVE, true);
    	bootstrap.option(ChannelOption.TCP_NODELAY, true);

    	bootstrap.group(group)
     	.channel(NioSocketChannel.class)
     	.handler(channelInitializer);
    }
```
##### connect内部做的事情

* 创建Runnable线程任务，职责往服务端发请求，由 ScheduledThreadPoolExecutor控制，每10秒发一次请求。心跳检测，保证Connection有效

```
private synchronized void initConnectStatusCheckCommand(){
        if(reconnectExecutorFuture == null || reconnectExecutorFuture.isCancelled()){
            Runnable connectStatusCheckCommand =  new Runnable() {
                public void run() {
                    try {
                        if (! isConnected()) {
                            connect();
                            if(isConnected()) {
	                            if(reconnectMsg != null) {
	                            	sendMessage(reconnectMsg);
	                            }
                            }
                        } else {
                            lastConnectedTime = System.currentTimeMillis();
                        }
                    } catch (Throwable t) { 
                        String errorMsg = "client reconnect to "+getRemoteAddress()+" find error . ";
                        if (System.currentTimeMillis() - lastConnectedTime > shutdown_timeout){
                            if (!reconnect_error_log_flag.get()){
                                reconnect_error_log_flag.set(true);
                                logger.error(errorMsg, t);
                                return ;
                            }
                        }
                        if ( reconnect_count.getAndIncrement() % reconnect_warning_period == 0){
                            logger.warn(errorMsg, t);
                        }
                    }
                }
            };
            reconnectExecutorFuture = reconnectExecutorService.scheduleWithFixedDelay(connectStatusCheckCommand, 2 * 1000, 10 * 1000, TimeUnit.MILLISECONDS);
        }
```

* 如果Channel还没有建立，先建立连接

```
private void doConnect() throws Throwable {
        long start = System.currentTimeMillis();
        future = bootstrap.connect(getConnectAddress());
        try{
            boolean ret = future.awaitUninterruptibly(getConnectTimeout(), TimeUnit.MILLISECONDS);
            
            if (ret && future.isSuccess()) {
                Channel newChannel = future.sync().channel();
                
                try {
                    // 关闭旧的连接
                    Channel oldChannel = Netty4Client.this.channel;
                    if (oldChannel != null) {
                        logger.info("Close old netty channel " + oldChannel + " on create new netty channel " + newChannel);
                        oldChannel.close();
                    }
                } finally {
                	Netty4Client.this.channel = newChannel;
                }
            } else if (future.cause() != null) {
                throw new Exception("client failed to connect to server "
                        + getRemoteAddress() + ", error message is:" + future.cause().getMessage(), future.cause());
            } else {
                throw new Exception("client failed to connect to server "
                        + getRemoteAddress() + " client-side timeout "
                        + getConnectTimeout() + "ms (elapsed: " + (System.currentTimeMillis() - start) + "ms) from netty client "
                        + NetUtils.getLocalHost());
            }
        }finally{
            if (! isConnected()) {
                future.cancel(true);
            }
        }
    }
```


#### 二、服务端部分

