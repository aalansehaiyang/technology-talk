## commons-codec

---

commons-codec是Apache下面的用来处理常用的编码方法的工具类包，例如DES、SHA1、MD5、Base64，URL，Soundx等等。 不仅是编码，也可用于解码。


### pom依赖

```
<dependency>
  <groupId>commons-codec</groupId>
  <artifactId>commons-codec</artifactId>
  <version>1.9</version>
</dependency>
```


#### 常用工具类：
*	DigestUtils工具类

	提供了多种编码方式的静态方法，用于对String、byte[]、InputStream等类型的数据编码。
		
**案例场景：**

电子商务平台，买家对一件商品下单后，为了便于后面的纠纷处理，需要对下单那一时刻的商品信息备份（因为卖家随时会修改自己的宝贝信息），命名为快照。如果为每一个订单都保存一次商品详情显然不现实，DigestUtils可以很好解决这个问题。每次对整个商品详情数据编码得到一个32字符摘要，作为唯一id并关联到用户订单，并保存到数据库中。可以有效对快照去重，节省资源空间。
	
```
import org.apache.commons.codec.digest.DigestUtils;

public class DigestTest {

    public static void encodeStr(String data) {
        String encodeS = DigestUtils.md5Hex(data);
        System.out.println(encodeS);
    }

    public static void main(String[] args) {
        String data = "网销投连险是保险公司的一款保险产品，在互联网金融上还是很常见的。" + "比如京东天天盈，网易有钱零钱++。这些保险削弱了保险的保障功能，降低成本，从而提高保险的理财功能提高理财收益。"
                      + "投连险基本和银行结构性理财产品一样，信息披露度不高，但是有保险公司兜底，不至于整个平台跑路。"
                      + "投资投连险可以想象为投资一个起点低的银行理财产品吧。网销投连险一般都受益在4-6%，不承诺保本。"
                      + "经常爆出保险公司的保障型长期投连险出现投资亏损新闻，但是网销短期投连险投资型投连险目前没有出现亏损，基本也能按照预期收益兑付。"
                      + "网销投连险安全性和收益性都比较居中，短期产品危险系数不高，但是在债券违约的大环境下，长期产品安全性没有太大保障。" + "不过好在保险公司没有跑路风险，至少不会把本金损失殆尽啊。";

        encodeStr(data);
    }
}

```

**运行结果：**

```
9901d04398f5b2adc0049c8c751e7411
```##### 参考资料：

http://commons.apache.org/proper/commons-codec/userguide.html

https://commons.apache.org/proper/commons-codec/apidocs/index.html

