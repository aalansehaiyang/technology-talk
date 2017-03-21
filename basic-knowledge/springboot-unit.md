## eclipse中如何跑spring boot的单元测试
---


1、首先引入对应的pom依赖

```
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-configuration-processor</artifactId>
   <optional>true</optional>
</dependency>
```

```
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath*:spring/bbs*.xml"})
public class AbstractTest {

}

public class AdServiceTest extends AbstractTest {

    @Autowired
    AdService adService;

    @Test
    public void test() {
        AdParam adParam = new AdParam();
        adParam.setAdPositionId(16005);
        adParam.setNum(20);
        List<AdModel> adModels = adService.queryAdList(adParam);
        System.out.println(JSON.toJSONString(adModels));
    }
}

```

**参考资料：**

http://412887952-qq-com.iteye.com/blog/2307104