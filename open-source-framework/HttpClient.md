## HttpClient

---

**简介：**

HttpClient是Apache Jakarta Common下的子项目，用来提供高效的、最新的、功能丰富的支持HTTP协议的客户端编程工具包，并且它支持HTTP协议最新的版本和建议

**特性：**

*	基于标准的java语言。实现了Http1.0和Http1.1
*	以可扩展的面向对象的结构实现了Http全部的方法（GET, POST, PUT, DELETE, HEAD, OPTIONS, and TRACE）。
*	支持HTTPS协议
*	连接管理器支持多线程应用。支持设置最大连接数，同时支持设置每个主机的最大连接数，发现并关闭过期的连接。
*	自动处理Set-Cookie中的Cookie。
*	Request的输出流可以避免流中内容直接缓冲到socket服务器。
*	Response的输入流可以有效的从socket服务器直接读取相应内容。
*	在http1.0和http1.1中利用KeepAlive保持持久连接。
*	直接获取服务器发送的response 响应状态和 headers。
*	设置连接超时的能力。



**下载地址：**

```
https://github.com/huainiu/commons-httpclient-3.1 
（里面有源代码、examples、test、apidocs）
```

**pom依赖：**

```
<dependency>
	<groupId>commons-httpclient</groupId>
	<artifactId>commons-httpclient</artifactId>
	<version>3.1</version>
</dependency>
```


**代码案例：**

```
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.MultiThreadedHttpConnectionManager;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.cookie.CookiePolicy;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;

/**
 * httpclient测试类
 * 
 * @author onlyone
 */
public class HttpClientTest {

    private static HttpClient client    = null;
    private int               max_bytes = 10240;
    protected String          encoding  = "utf-8";

    static {
        MultiThreadedHttpConnectionManager connectionManager = new MultiThreadedHttpConnectionManager();
        connectionManager.getParams().setConnectionTimeout(4 * 1000);
        connectionManager.getParams().setSoTimeout(4 * 1000);
        connectionManager.getParams().setDefaultMaxConnectionsPerHost(32);
        connectionManager.getParams().setMaxTotalConnections(128);
        connectionManager.getParams().setStaleCheckingEnabled(true);
        client = new HttpClient(connectionManager);
    }

    public String doPost(String actionUrl, Map<String, String> params) throws Exception {
        NameValuePair[] np = null;
        if (params != null) {
            np = new NameValuePair[params.size()];
            int i = 0;
            for (String s : params.keySet()) {
                np[i] = new NameValuePair(s, params.get(s));
                i++;
            }
        }

        PostMethod method = new PostMethod(actionUrl);
        String responseStr = "";
        try {
            setHeaders(method);
            method.setRequestBody(np);
            client.executeMethod(method);
            responseStr = readInputStream(method.getResponseBodyAsStream());
        } catch (Exception ex) { // java.net.SocketTimeoutException
            throw new Exception(ex);
        } finally {
            method.releaseConnection();
        }
        return responseStr;
    }

    protected void setHeaders(HttpMethod method) {
        method.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;");
        method.setRequestHeader("Accept-Language", "zh-cn");
        method.setRequestHeader("User-Agent",
                                "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9.0.3) Gecko/2008092417 Firefox/3.0.3");
        // method.setRequestHeader("Accept-Charset", encoding);
        // method.setRequestHeader("Keep-Alive", "300");
        method.setRequestHeader("Connection", "Keep-Alive");
        method.setRequestHeader("Cache-Control", "no-cache");
    }

    private String readInputStream(InputStream is) throws IOException {
        return readInputStream(is, null);
    }

    /**
     * 将输入流按照特定的编码转换成字符串
     *
     * @param is 输入流
     * @return 字符串
     * @throws IOException
     */
    private String readInputStream(InputStream is, String encode) throws IOException {
        byte[] b = new byte[max_bytes];
        StringBuilder builder = new StringBuilder();
        int bytesRead = 0;
        while (true) {
            bytesRead = is.read(b, 0, max_bytes);
            if (bytesRead == -1) {
                return builder.toString();
            }
            builder.append(new String(b, 0, bytesRead, encode == null ? encoding : encode));
        }
    }

    public String doGet(String url) throws Exception {
        String responseStr = "";
        GetMethod method = new GetMethod(url);
        try {
            client.executeMethod(method);
            responseStr = readInputStream(method.getResponseBodyAsStream(), null);
        } catch (Exception ex) {
            throw new Exception(ex);
        } finally {
            method.releaseConnection();
        }
        return responseStr;
    }

```




参考资料：

http://hc.apache.org/status.html

http://blog.csdn.net/wangpeng047/article/details/19624529

https://www.ibm.com/developerworks/cn/opensource/os-httpclient/

https://hc.apache.org/httpcomponents-client-ga/