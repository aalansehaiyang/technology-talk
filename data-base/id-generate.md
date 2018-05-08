## id生成器

---

### 资料

* [分布式ID生成器](https://mp.weixin.qq.com/s/qO84jWhQ5O2mPafsHrh2bA)
* [通用的ID产生器--Vesta](https://gitee.com/robertleepeak/vesta-id-generator)
* [twitter的全局唯一ID生成器---snowflake](https://github.com/twitter/snowflake)

---
如果单表，可以借助于mysql自带的id生成器每次自增+1的方式来生成主键id。

如果分库分表，需要提前在外部生成id，然后将记录插入到对应的分表中。


**其实原理很简单，只需实现一个id批量生成查询器即可，大概步骤：**

a）本地引入一个client二方包，当有记录要插入数据库表时，调用nextId方法生成一个id，由于是提前分配的，大多数情况下从本地cache取，如果分配完了，需要从服务器再次申请。


```
 private final ConcurrentHashMap<CacheKey, CachedRange> cache = new ConcurrentHashMap<CacheKey, CachedRange>();
 
 CacheKey：业务场景
 CachedRange：当前批次可用的id区间范围
 ```
 
 ```
  public long nextId(String app, String key) {
        synchronized (this){
            CacheKey cacheKey = new CacheKey(app, key);
            CachedRange cachedRange = this.cache.get(cacheKey);
            if (cachedRange == null || cachedRange.range.getEnd() < cachedRange.pos) {
                IDRange range = this.service.getNextRange(app, key, this.size);
                cachedRange = new CachedRange(range, range.getStart()) ;
            }
            long pos = cachedRange.pos;
            cachedRange.pos += 1;
            this.cache.put(cacheKey, cachedRange);
            return pos;
        }
    }
    
size：表示一次获取id的区间长度
    
```

b）初始化时或者分配的区间段用完，此时需要从远程服务器申请


```
获取一个可用的IDRange, 结果为闭区间[a, b]

public IDRange getNextRange(String app, String key, int size) {

        synchronized (this) {
            IDRange result = new IDRange();
            IDRange range = this.get4Update(app, key, size * this.PRE_ALOCATE_BATCH_NUM);
            result.setApp(app);
            result.setKey(key);
            result.setStart(range.getStart());
            result.setEnd(range.getEnd());

            this.logger.info("return range: {}", result);
            return result;
        }
    }
```

```
// 数据库查询

 @Transactional(value="crtTransactionManager", propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
    public IDRange get4Update(String app, String key, int size) {
        Map<String, String> params = new HashMap<String, String>();
        params.put("app", app);
        params.put("key", key);
        SqlSession sqlSession = this.commonSqlSessionTemplate.getSqlSessionFactory()
                .openSession();
        UniversalId universalId = sqlSession.selectOne("select4Update", params);
        if (universalId == null) {
            return null;
        }

        IDRange range = new IDRange();
        range.setApp(app);
        range.setKey(key);
        range.setStart(universalId.getValue() + 1);
        range.setEnd(universalId.getValue() + size - 1);

        universalId.setValue(universalId.getValue() + size);
        sqlSession.update("updateValue", universalId);
        return range;
    }
```

