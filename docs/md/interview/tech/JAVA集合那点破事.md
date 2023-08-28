---
title: 第二篇：JAVA 集合！集合、扩容、数组、链表
---

# JAVA 集合那点破事！集合、扩容、数组、链表

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学


## 常见的集合有哪些？


答案： 

Java集合类主要由两个根接口Collection和Map派生出来的，Collection派生出了三个子接口：List、Set、Queue（Java5 新增的队列），因此Java集合大致也可分成List、Set、Queue、Map 四种接口。

> Collection 是一个接口；Collections 是一个工具类；Map 不是 Collection 的子接口


## 线程安全的集合？

答案：

**1、线程安全**

- Hashtable：比HashMap 多了个线程安全。
- ConcurrentHashMap: 是一种高效但是线程安全的集合。
- Vector：比Arraylist多了个同步化机制。
- Stack：栈，也是线程安全的，继承于Vector。

**2、线性不安全**

- HashMap
- Arraylist
- LinkedList
- HashSet
- TreeSet
- TreeMap


## ArrayList 与 LinkedList 区别？


答案： 

1、是否保证线程安全： ArrayList 和 LinkedList 都不保证线程安全 

2、底层数据结构： Arraylist 底层使用的是Object数组；LinkedList 底层使用的是双向循环链表

3、插入和删除是否受元素位置的影响： ArrayList 采用数组存储，所以插入和删除元素的时间复杂度受元素位置的影响。 比如：执行 add(E e) 方法的时候， ArrayList 会默认在将指定的元素追加到此列表的末尾，这种情况时间复杂度就是O(1)。但是如果要在指定位置 i 插入和删除元素的话（ add(int index, E element) ）时间复杂度就为 O(n-i)。因为在进行上述操作的时候集合中第 i 和第 i 个元素之后的(n-i)个元素都要执行向后位/向前移一位的操作。 LinkedList 采用链表存储，所以插入，删除元素时间复杂度不受元素位置的影响，都是近似 O（1）而数组为近似 O（n） 

4、是否支持快速随机访问： LinkedList 不支持高效的随机元素访问，而ArrayList 实现了RandomAccess 接口，所以有随机访问功能。快速随机访问就是通过元素的序号快速获取元素对象( get(int index) 方法) 

5、内存空间占用： ArrayList 的空间浪费主要体现在list列表的结尾会预留一定的容量空间，而LinkedList的空间花费则体现在它的每一个元素都需要消耗比ArrayList更多的空间（因为要存放直接后继和直接前驱以及数据）


## ArrayList 与 Vector 区别？

答案： 

1、Vector是线程安全的，ArrayList 不是线程安全的。其中，Vector在关键性的方法前面都加了synchronized 关键字，来保证线程的安全性。如果有多个线程会访问到集合，那最好是使用 Vector，因为不需要我们自己再去考虑和编写线程安全的代码。 

2、ArrayList 在底层数组不够用时在原来的基础上扩展 0.5倍，Vector是扩展 1 倍，这样ArrayList 就有利于节约内存空间


## ArrayList 的扩容机制？

答案： 

ArrayList扩容的本质就是计算出新的扩容数组的size后实例化，并将原有数组内容复制到新数组中去。 默认情况下，新的容量会是原容量的1.5倍。


## HashMap 底层数据结构？

答案：

1、JDK1.7 ，由“数组+链表”组成，数组是 HashMap 的主体，链表则是主要为了解决哈希冲突而存在的。 

2、JDK1.8 ，由“数组+链表+红黑树”组成。当链表过长，则会严重影响 HashMap 的性能，红黑树搜索时间复杂度是 O(logn)，而链表是 O(n)。因此，JDK1.8 对数据结构做了进一步的优化，引入了红黑树，链表和红黑树在达到一定条件会进行转换：

- 当链表超过 8 且数据总量超过 64 才会转红黑树。
- 将链表转换成红黑树前会判断，如果当前数组的长度小于 64，那么会选择先进行数组扩容，而不 是转换为红黑树，以减少搜索时间。

<div align="left">
    <img src="https://offercome.cn/images/article/interview/java/java-list-1.jpg" width="800px">
</div>


## 解决 hash 冲突的办法有哪些？


答案：
 
开放定址法（再散列法）、再哈希法、链地址法（拉链法）、建立公共溢出区。HashMap中采用的是 链地址法 


## 为什么在解决 hash 冲突的时候，不直接用红黑树？而选择先用链表，再转红黑树?

答案：

因为红黑树需要进行左旋，右旋，变色这些操作来保持平衡，而单链表不需要。当元素小于 8 个的时候，此时查询，链表结构能保证查询性能。当元素大于 8 个时， 红黑树搜索时间复杂度是 O(logn)，而链表是 O(n)，此时需要红黑树来加快查询速度，但是新增节点的效率变慢了。
因此，如果一开始就用红黑树结构，元素太少，新增效率又比较慢，无疑是浪费性能。


## HashMap 默认负载因子是多少？为什么是 0.75，不是 0.6 或者 0.8 ？


答案：

HashMap 的默认构造函数：
 
```
int threshold; // 容纳键值对的最大值
final float loadFactor; // 负载因子
int modCount;
int size;
```

Node[] table的初始化长度length (默认值是16)，Load factor为负载因子 (默认值是0.75)，threshold是HashMap 所能容纳键值对的最大值。threshold = length * Load factor。也就是说，在数组定义好长度之后，负载因子越大，所能容纳的键值对个数越多。 
默认的loadFactor是0.75，0.75 是对空间和时间效率的一个平衡选择，一般不要修改，除非在时间和空间比较特殊的情况下 ： 

- 如果内存空间很多而又对时间效率要求很高，可以降低负载因子Load factor的值 。
- 相反，如果内存空间紧张而对时间效率要求不高，可以增加负载因子loadFactor的值，这个值可以 大于1


## HashMap 的 put 方法流程？

答案： 

以JDK1.8为例，简要流程如下：

1、首先根据 key 的值计算 hash 值，找到该元素在数组中存储的下标；

2、如果数组是空的，则调用 resize 进行初始化；

3、如果没有哈希冲突直接放在对应的数组下标里；

4、如果冲突了，且 key 已经存在，就覆盖掉 value；

5、如果冲突后，发现该节点是红黑树，就将这个节点挂在树上；

6、如果冲突后是链表，判断该链表是否大于 8 ，如果大于 8 并且数组容量小于 64，就进行扩容；如果链表节点大于 8 并且数组的容量大于 64，则将这个结构转换为红黑树；否则，链表插入键值对，若key 存在，就覆盖掉 value。


## HashMap 扩容方式？

答案： 

HashMap 在容量超过负载因子所定义的容量之后，就会扩容。Java 里的数组是无法自动扩容的，方法是将 HashMap 的大小扩大为原来数组的两倍，并将原来的对象放入新的数组中。


## HashMap 为什么线程不安全？

答案： 

1、多线程下扩容死循环。JDK1.7中的 HashMap 使用头插法插入元素，在多线程的环境下，扩容的时候有可能导致环形链表的出现，形成死循环。因此，JDK1.8使用尾插法插入元素，在扩容时会保持链表元素原本的顺序，不会出现环形链表的问题。

2、多线程的put可能导致元素的丢失。多线程同时执行 put 操作，如果计算出来的索引位置是相同的，那会造成前一个 key 被后一个 key 覆盖，从而导致元素的丢失。此问题在JDK 1.7和 JDK 1.8 中都存在。

3、put和get并发时，可能导致get为null。线程1执行put时，因为元素个数超出threshold而导致rehash，线程2此时执行get，有可能导致这个问题。此问题在JDK 1.7和 JDK 1.8 中都存在。


## ConcurrentHashMap 实现原理是？


答案：

1、JDK1.7中的 ConcurrentHashMap 是由 Segment 数组结构和HashEntry 数组结构组成，即 ConcurrentHashMap 把哈希桶切分成小数组（Segment ），每个小数组有 n 个 HashEntry 组成。

其中，Segment 继承 ReentrantLock，所以 Segment 是一种可重入锁，扮演锁的角色；HashEntry 用于存储键值对数据。

<div align="left">
    <img src="https://offercome.cn/images/article/interview/java/java-list-2.jpg" width="800px">
</div>

首先将数据分为一段一段的存储，然后给每一段数据配一把锁，当一个线程占用锁访问其中一个段数据 时，其他段的数据也能被其他线程访问，能够实现真正的并发访问。

2、JDK1.8 中的ConcurrentHashMap 选择了与 HashMap 相同的数组+链表+红黑树结构；在锁的实现上，抛弃了原有的 Segment 分段锁，采用 CAS + synchronized 实现更加低粒度的锁。
将锁的级别控制在了更细粒度的哈希桶元素级别，也就是说只需要锁住这个链表头结点（红黑树的根节点），就不会影响其他的哈希桶元素的读写，大大提高了并发度。 

<div align="left">
    <img src="https://offercome.cn/images/article/interview/java/java-list-3.jpg" width="800px">
</div>


## JDK1.7 与 JDK1.8 ConcurrentHashMap 区别？

答案：

1、数据结构：取消了`Segment`分段锁的数据结构，取而代之的是 `数组+链表+红黑树` 结构。

2、保证线程安全机制：JDK1.7采用Segment的分段锁机制实现线程安全，其中`segment`继承自`ReentrantLock`。JDK1.8 采用`CAS+Synchronized`保证线程安全。

3、锁的粒度：原来是对需要进行数据操作的Segment加锁，现调整为对每个数组元素加锁（Node）。

4、链表转化为红黑树：定位结点的hash算法简化会带来弊端，Hash冲突加剧，因此在链表节点数量大于8时，会将链表转化为红黑树进行存储。

5、查询时间复杂度：从原来的遍历链表O(n)，变成遍历红黑树O(logN)。


## ConcurrentHashMap 和 Hashtable 哪个效率更高？

答案： 

ConcurrentHashMap 效率要高于Hashtable，因为Hashtable给整个哈希表加了一把大锁从而实现线程安全。

而ConcurrentHashMap 的锁粒度更低，在JDK1.7中采用分段锁实现线程安全，在JDK1.8 中采用 CAS+Synchronized 实现线程安全。

