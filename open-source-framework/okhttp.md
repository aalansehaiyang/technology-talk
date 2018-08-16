## okhttp

---


* [源代码](https://github.com/square/okhttp)

----

### OKHttp的配置Cookie持久化

```
public  static String httpPost(String url,String json) {
    String res = "";
    OkHttpClient okHttpClient = new OkHttpClient().newBuilder().cookieJar(new CookieJar() {
        private final HashMap<String, List<Cookie>> cookieStore = new HashMap<>();
        @Override
        public void saveFromResponse(HttpUrl httpUrl, List<Cookie> cookies) {
            cookieStore.put(httpUrl.host(), cookies);
        }
        @Override
        public List<Cookie> loadForRequest(HttpUrl httpUrl) {
            List<Cookie> cookies = cookieStore.get(httpUrl.host());
            return cookies != null ? cookies : new ArrayList<Cookie>();
        }
    }).connectTimeout(5, TimeUnit.SECONDS)
            .readTimeout(5, TimeUnit.SECONDS).writeTimeout(5, TimeUnit.SECONDS).build();         
    RequestBody requestBody = RequestBody.create(JSON, json);
    //创建一个请求对象
    Request request = new Request.Builder()
            .url(url)
            .post(requestBody)
            .build();
    //发送请求获取响应
    try {
        Response response=okHttpClient.newCall(request).execute();
        res = response.body().string();
    } catch (IOException e) {
        e.printStackTrace();
    }
    return res;
}
```