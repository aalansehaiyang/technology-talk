## Guava
----


如果服务上要使用本地缓存，可以考虑使用guava框架。Guava Cache与ConcurrentMap很相似，但也不完全一样。最基本的区别是ConcurrentMap会一直保存所有添加的元素，直到显式地移除。相对地，Guava Cache为了限制内存占用，通常都设定为自动回收元素。在某些场景下，尽管LoadingCache 不回收元素，它也是很有用的，因为它会自动加载缓存。

#### Guava Cache适用于：

* 你愿意消耗一些内存空间来提升速度。
* 你预料到某些键会被查询一次以上。
* 缓存中存放的数据总量不会超出内存容量。

代码示例：

```

import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.google.common.cache.RemovalListener;
import com.google.common.cache.RemovalNotification;

/**
 * @author onlyone
 */
public class TT {

    public static void main(String[] args) throws ExecutionException, InterruptedException {

        LoadingCache<Integer, String> localCache = CacheBuilder.newBuilder()
        // 设置并发级别为8，并发级别是指可以同时写缓存的线程数
        .concurrencyLevel(8)
        // 最大容量
        .maximumSize(200000)
        // 初始容量
        .initialCapacity(100000)
        // 写入后5秒过期
        .expireAfterWrite(5, TimeUnit.SECONDS)
        // 统计缓存的命中率
        .recordStats()
        // 设置缓存移除通知
        .removalListener(new RemovalListener<Integer, String>() {

            @Override
            public void onRemoval(RemovalNotification<Integer, String> notification) {
                System.out.println(notification.getKey() + " was removed,cause is " + notification.getCause());
            }
        }).build(new CacheLoader<Integer, String>() {

            // 在缓存不存在时，通过CacheLoader自动加载缓存
            @Override
            public String load(Integer key) throws Exception {
                System.out.println("load data:" + key);
                return key + "对应的 value";
            }

        });

        // ------------

        for (int i = 1; i <= 10; i++) {
            System.out.println("key:" + i + ",value:" + localCache.get(i));
            System.out.println("key:" + i + ",value:" + localCache.get(i));
            // 休眠2s
            Thread.sleep(2000);

            // 打印缓存中的命中情况
            System.out.println("cache status:");
            System.out.println(localCache.stats().toString());
        }

    }

}     
           
```

响应结果：

```
load data:1
key:1,value:1对应的 value
key:1,value:1对应的 value
cache status:
CacheStats{hitCount=1, missCount=1, loadSuccessCount=1, loadExceptionCount=0, totalLoadTime=1061305, evictionCount=0}
load data:2
key:2,value:2对应的 value
key:2,value:2对应的 value
cache status:
CacheStats{hitCount=2, missCount=2, loadSuccessCount=2, loadExceptionCount=0, totalLoadTime=1125724, evictionCount=0}
load data:3
key:3,value:3对应的 value
key:3,value:3对应的 value
cache status:
CacheStats{hitCount=3, missCount=3, loadSuccessCount=3, loadExceptionCount=0, totalLoadTime=1184002, evictionCount=0}
load data:4
key:4,value:4对应的 value
key:4,value:4对应的 value
cache status:
CacheStats{hitCount=4, missCount=4, loadSuccessCount=4, loadExceptionCount=0, totalLoadTime=1288529, evictionCount=0}
load data:5
key:5,value:5对应的 value
key:5,value:5对应的 value
cache status:
CacheStats{hitCount=5, missCount=5, loadSuccessCount=5, loadExceptionCount=0, totalLoadTime=1340360, evictionCount=0}
load data:6
key:6,value:6对应的 value
key:6,value:6对应的 value
cache status:
CacheStats{hitCount=6, missCount=6, loadSuccessCount=6, loadExceptionCount=0, totalLoadTime=1395073, evictionCount=0}
load data:7
key:7,value:7对应的 value
key:7,value:7对应的 value
cache status:
CacheStats{hitCount=7, missCount=7, loadSuccessCount=7, loadExceptionCount=0, totalLoadTime=1446730, evictionCount=0}
load data:8
key:8,value:8对应的 value
key:8,value:8对应的 value
cache status:
CacheStats{hitCount=8, missCount=8, loadSuccessCount=8, loadExceptionCount=0, totalLoadTime=1498473, evictionCount=0}
2 was removed,cause is EXPIRED
load data:9
key:9,value:9对应的 value
key:9,value:9对应的 value
cache status:
CacheStats{hitCount=9, missCount=9, loadSuccessCount=9, loadExceptionCount=0, totalLoadTime=1553158, evictionCount=1}
1 was removed,cause is EXPIRED
load data:10
key:10,value:10对应的 value
key:10,value:10对应的 value
cache status:
CacheStats{hitCount=10, missCount=10, loadSuccessCount=10, loadExceptionCount=0, totalLoadTime=1599422, evictionCount=2}

```

### 缓存回收

#### 被动删除

* ##### 基本容量的回收

  1）设置了初始值和最大容量上限，如果逼近容量上限，就会触发回收机制。
  
* ##### 定时回收

	1）expireAfterAccess(long, TimeUnit)：缓存项在给定时间内没有被读/写访问，则回收。请注意这种缓存的回收顺序和基于大小回收一样。
	
	2）expireAfterWrite(long, TimeUnit)：缓存项在给定时间内没有被写访问（创建或覆盖），则回收。如果认为缓存数据总是在固定时候后变得陈旧不可用，这种回收方式是可取的。

* ##### 基于引用的回收

	基于java的垃圾回收机制，判断缓存的数据引用的关系，如果没有被引用，则将该数据删除

#### 主动删除

* 单个清除：Cache.invalidate(key)
* 批量清除：Cache.invalidateAll(keys)
* 清除所有缓存项：Cache.invalidateAll()



### 更多资料：

https://www.cnblogs.com/gaojy/p/7245319.html