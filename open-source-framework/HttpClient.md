## HttpClient

---

* [apache官网](http://hc.apache.org/httpcomponents-client-4.5.x/index.html)
* [httpcomponents-client-4.5.x的接口文档](http://hc.apache.org/httpcomponents-client-4.5.x/httpclient/apidocs/index.html)
* [一些github代码案例](https://github.com/aalansehaiyang/httpclient-example)

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


**pom依赖：**

```
 <dependency>
    <groupId>com.squareup.okhttp</groupId>
    <artifactId>okhttp</artifactId>
    <version>2.5.0</version>
</dependency>

<dependency>
	 <groupId>org.apache.httpcomponents</groupId>
	 <artifactId>httpclient</artifactId>
	 <version>4.5.3</version>
</dependency>
```


**代码案例：**

```
// http协议通讯工具类

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

public class HttpServer {

    public static HttpClient createHttpClient(int maxTotal, int maxPerRoute, int socketTimeout, int connectTimeout,
                                              int connectionRequestTimeout) {
        RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(socketTimeout).setConnectTimeout(connectTimeout).setConnectionRequestTimeout(connectionRequestTimeout).build();
        PoolingHttpClientConnectionManager cm = new PoolingHttpClientConnectionManager();
        cm.setMaxTotal(maxTotal);
        cm.setDefaultMaxPerRoute(maxPerRoute);
        CloseableHttpClient httpClient = HttpClients.custom().setConnectionManager(cm).setDefaultRequestConfig(defaultRequestConfig).build();
        return httpClient;
    }

    /**
     * 发送post请求
     * 
     * @param url 请求地址
     * @param params 请求参数
     * @param encoding 编码
     */
    public static String sendPost(HttpClient httpClient, String url, Map<String, String> params, String cookie,
                                  Charset encoding) {
        String resp = "";
        HttpPost httpPost = new HttpPost(url);
        if (params != null && params.size() > 0) {
            List<NameValuePair> formParams = new ArrayList<NameValuePair>();
            Iterator<Map.Entry<String, String>> itr = params.entrySet().iterator();
            while (itr.hasNext()) {
                Map.Entry<String, String> entry = itr.next();
                formParams.add(new BasicNameValuePair(entry.getKey(), entry.getValue()));
            }
            UrlEncodedFormEntity postEntity = new UrlEncodedFormEntity(formParams, encoding);
            httpPost.setEntity(postEntity);
        }

        httpPost.setHeader("Cookie", cookie);
        CloseableHttpResponse response = null;
        try {
            response = (CloseableHttpResponse) httpClient.execute(httpPost);
            resp = EntityUtils.toString(response.getEntity(), encoding);

            // String setCookie = response.getFirstHeader("Set-Cookie").getValue();
            // System.out.println("setCookie=" + setCookie);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (response != null) {
                try {
                    response.close();
                } catch (IOException e) {
                    // log
                    e.printStackTrace();
                }
            }
        }
        return resp;
    }
}

```

```
//测试类，访问HZ某网站

HttpClient httpClient = HttpServer.createHttpClient(10, 10, 4000, 4000, 4000);

//请求cookie,为了与验证码绑定（注意：分号要是英文格式）
String cookie = "cust_type=2;JSESSIONID=1042CD46231F265585CE3D8D105741CD;_gscu_1827457641=573266013u4vos16";
//验证码
String code = "1674"; 

String url = "http://www.hzgjj.gov.cn:8080/WebAccounts/userLogin.do";
Map<String, String> params = new HashMap<>();
params.put("cust_no", "用户名");
params.put("password", "密码");
params.put("validate_code", code);
params.put("user_type", "3");
params.put("cust_type", "2");

String result = HttpServer.sendPost(httpClient, url, params, cookie, null);
```



参考资料：

http://hc.apache.org/status.html

http://blog.csdn.net/wangpeng047/article/details/19624529

https://www.ibm.com/developerworks/cn/opensource/os-httpclient/

https://hc.apache.org/httpcomponents-client-ga/