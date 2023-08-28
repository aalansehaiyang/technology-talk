---
title: 第三篇：JAVA 并发！JUC、死锁、CAS、线程池
---

# JAVA 并发！JUC、死锁、CAS、线程池

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学


## 并行与并发的区别？

答案：

从操作系统的角度来看，线程是CPU分配的最小单位。

1、并行就是同一时刻，两个线程都在执行。要求有两个CPU去分别执行两个线程。

2、并发就是同一时刻，只有一个执行，但是一个时间段内，两个线程都执行了。并发的实现依赖于CPU切换线程，因为切换的时间特别短，所以基本对于用户是无感知的。


## 什么是进程？线程？


答案：

1、进程：进程是代码在数据集合上的一次运行活动，是操作系统进行资源分配和调度的基本单位。

2、线程：线程是进程的一个执行路径，一个进程中至少有一个线程，进程中的多个线程共享进程的资源，线程是处理器任务调度和执行的基本单位。

**资源开销：**

每个进程都有独立的代码和数据空间（程序上下文），程序之间的切换会有较大的开销；线程可以看做轻量级的进程，同一类线程共享代码和数据空间，每个线程都有自己独立的运行栈和程序计数器（PC），线程之间切换的开销小。

**包含关系：**

如果一个进程内有多个线程，则执行过程不是一条线的，而是多条线（线程）共同完成的；线程是进程的一部分，所以线程又被称为轻量级进程。

**内存分配：**

同一进程的线程共享本进程的地址空间和资源，而进程之间的地址空间和资源是相互独立的

**影响关系：**

一个进程崩溃后，在保护模式下不会影响其他进程。但是一个线程崩溃整个进程都死掉。所以多进程要比多线程健壮。

**执行过程：**

每个独立的进程有程序运行的入口， 顺序执行序列和程序出口。但是线程不能独立执行，必须依存在应用程序中，由应用程序提供多个线程执行控制，两者均可并发执行

## 线程有几种创建方式？

答案：

Java中创建线程主要有三种方式，分别为继承Thread类、实现Runnable接口、实现Callable接口。

* 1、继承Thread类，重写run()方法，调用start()方法启动线程
* 2、实现 Runnable 接口，重写run()方法，最后通过Thread包装并启动 new Thread(task).start();
* 3、实现Callable接口，重写call()方法，这种方式可以通过 FutureTask 获取任务执行的返回值

## Runnable 和 Callable 区别？


答案： 

* 1、Callable 重写的方法是call()，Runnable 重写的方法是run()。 
* 2、Callable的任务执行后有返回值，而 Runnable 任务无返回值 
* 3、Call方法会抛出异常，run方法不可以 
* 4、运行Callable任务可以拿到一个Future对象，表示异步计算的结果。它提供了检查计算是否完成的方法，以等待计算的完成，并检索计算的结果。通过Future对象可以了解任务执行情况，可取消任务的执行，还可获取执行结果


## 为什么调用 start() 方法时会执行 run() 方法，那怎么不直接调用 run() 方法？


答案：

JVM 执行 start 方法，会先创建一条线程，由创建出来的新线程去执行thread的run方法，这才起到多线程的效果。
如果直接调用Thread的run()方法，那么run方法还是运行在主线程中，相当于顺序执行，就起不到多线程的效果。



## 线程有哪些常用的调度方法？

答案：

**1、线程等待与通知**

在Object类中有一些函数可以用于线程的等待与通知。

**线程等待的方法：**

- wait()：当一个线程A调用一个共享变量的 wait()方法时， 线程A会被阻塞挂起， 发生下面几种情况才会返回 ：
   - （1） 线程A调用了共享对象 notify()或者 notifyAll()方法；
   - （2）其他线程调用了线程A的 interrupt() 方法，线程A抛出InterruptedException异常返回。
- wait(long timeout) ：这个方法相比 wait() 方法多了一个超时参数，它的不同之处在于，如果线程A调用共享对象的wait(long timeout)方法后，没有在指定的 timeout ms时间内被其它线程唤醒，那么这个方法还是会因为超时而返回。
- wait(long timeout, int nanos)，其内部调用的是 wait(long timout）函数。

**唤醒线程方法：**

- notify() : 一个线程A调用共享对象的 notify() 方法后，会唤醒一个在这个共享变量上调用 wait 系列方法后被挂起的线程。一个共享变量上可能会有多个线程在等待，具体唤醒哪个等待的线程是随机的。
- notifyAll() ：不同于在共享变量上调用 notify() 函数会唤醒被阻塞到该共享变量上的一个线程，notifyAll()方法则会唤醒所有在该共享变量上由于调用 wait 系列方法而被挂起的线程。

Thread类也提供了一个方法用于等待的方法：

- join()：如果一个线程A执行了thread.join()语句，其含义是：当前线程A等待thread线程终止之后才 从`thread.join()`返回。

**2、线程休眠**

- sleep(long millis) :Thread类中的静态方法，当一个执行中的线程A调用了Thread 的sleep方法后，线程A会暂时让出指定时间的执行权，但是线程A所拥有的监视器资源，比如锁还是持有不让出的。指定的睡眠时间到了后该函数会正常返回，接着参与 CPU 的调度，获取到 CPU 资源后就可以继续运行。

**3、让出优先权**

- yield() ：Thread类中的静态方法，当一个线程调用 yield 方法时，实际就是在暗示线程调度器当前线程请求让出自己的CPU 。

**4、线程中断**

Java 中的线程中断是一种线程间的协作模式，通过设置线程的中断标志并不能直接终止该线程的执行，而是被中断的线程根据中断状态自行处理。

- void interrupt() ：中断线程，例如，当线程A运行时，线程B可以调用线程 interrupt() 方法来设置线程的中断标志为true 并立即返回。设置标志仅仅是设置标志，线程A实际并没有被中断， 会继续往下执行。
- boolean isInterrupted() 方法：检测当前线程是否被中断。
- boolean interrupted() 方法：检测当前线程是否被中断，与 isInterrupted 不同的是，该方法如果发现当前线程被中断，则会清除中断标志。



## 线程有几种状态？

答案：
Java 线程有六种状态：

<div align="left">
    <img src="https://offercome.cn/images/article/interview/java/3-1.png" width="800px">
</div>


| **状态** | **说明** |
| --- | --- |
| NEW | 初始状态：线程被创建，但还没有调用start()方法 |
| RUNNABLE | 运行状态：Java线程将操作系统中的就绪和运行两种状态笼统的称作“运行” |
| BLOCKED | 阻塞状态：表示线程阻塞于锁 |
| WAITING | 等待状态：表示线程进入等待状态，进入该状态表示当前线程需要等待其他线程做出一些特定动作（通知或中断） |
| TIME_WAITING | 超时等待状态：该状态不同于 WAITIND，它是可以在指定的时间自行返回的 |
| TERMINATED | 终止状态：表示当前线程已经执行完毕 |



## sleep() 方法和 wait() 方法比较?


答案： 

**1、区别**

- sleep方法：是Thread类的静态方法，当前线程将睡眠n毫秒，线程进入阻塞状态。当睡眠时间到了，会解除阻塞，进入可运行状态，等待CPU的到来。睡眠不释放锁（如果有的话）。
- wait方法：是Object的方法，必须与synchronized 关键字一起使用，线程进入阻塞状态，当notify或者notifyall被调用后，会解除阻塞。但是，只有重新占用互斥锁之后才会进入可运行状态。睡眠时，会释放互斥锁。
- sleep 方法没有释放锁，而 wait 方法释放了锁 。
- sleep 通常被用于暂停执行；Wait 通常被用于线程间交互/通信
- sleep() 方法执行完成后，线程会自动苏醒。或者可以使用 wait(long timeout)超时后线程会自动苏 醒。wait() 方法被调用后，线程不会自动苏醒，需要别的线程调用同一个对象上的 notify() 或者notifyAll() 方法

**2、相同**

- 两者都可以暂停线程的执行

## 什么是线程上下文切换？

答案：

使用多线程的目的是为了充分利用CPU，但是我们知道，并发其实是一个CPU来处理多个线程。

为了让用户感觉多个线程是在同时执行的， CPU 资源的分配采用了时间片轮转也就是给每个线程分配一个时间片，线程在时间片内占用 CPU 执行任务。当线程使用完时间片后，就会处于就绪状态并让出 CPU 让其他线程占用，这就是上下文切换。

<div align="left">
    <img src="https://offercome.cn/images/article/interview/java/3-2.png" width="800px">
</div>


## 守护线程？

答案：

Java中的线程分为两类，分别为 daemon 线程（守护线程）和 user 线程（用户线程）。

在JVM 启动时会调用 main 函数，main函数所在的线程就是一个用户线程。其实在 JVM 内部同时还启动了很多守护线程， 如：垃圾回收线程。
那么守护线程和用户线程有什么区别呢？区别之一是当最后一个非守护线程束时， JVM 会正常退出，而不管当前是否存在守护线程，也就是说守护线程是否结束并不影响 JVM 退出。


## 线程间有哪些通信方式？

答案：

**1、volatile和synchronized关键字**

关键字volatile可以用来修饰字段（成员变量），就是告知程序任何对该变量的访问均需要从共享内存中获取，而对它的改变必须同步刷新回共享内存，它能保证所有线程对变量访问的可见性。

关键字synchronized可以修饰方法或者以同步块的形式来进行使用，它主要确保多个线程在同一个时刻，只能有一个线程处于方法或者同步块中，它保证了线程对变量访问的可见性和排他性。

**2、等待/通知机制**

可以通过Java内置的等待/通知机制（wait()/notify()）实现一个线程修改一个对象的值，而另一个线程感知到了变化，然后进行相应的操作。

**3、管道输入/输出流**

管道输入/输出流和普通的文件输入/输出流或者网络输入/输出流不同之处在于，它主要用于线程之间的数据传输，而传输的媒介为内存。

管道输入/输出流主要包括了如下4种具体实现：PipedOutputStream、PipedInputStream、 PipedReader和PipedWriter，前两种面向字节，而后两种面向字符。

**4、使用Thread.join()**

如果一个线程A执行了thread.join()语句，其含义是：当前线程A等待thread线程终止之后才从thread.join()返回。线程Thread除了提供join()方法之外，还提供了 join(long millis) 和 join(long millis,int nanos) 两个具备超时特性的方法。

**5、使用ThreadLocal**

ThreadLocal，即线程变量，是一个以ThreadLocal对象为键、任意对象为值的存储结构。这个结构被附带在线程上，也就是说一个线程可以根据一个ThreadLocal对象查询到绑定在这个线程上的一个值。

可以通过 set(T) 方法来设置一个值，在当前线程下再通过get()方法获取到原先设置的值。


## 原子性、可见性、有序性的理解？

答案：

原子性、有序性、可见性是并发编程中非常重要的基础概念，JMM的很多技术都是围绕着这三大特性展开。

**1、原子性**：原子性指的是一个操作是不可分割、不可中断的，要么全部执行并且执行的过程不会被任何因素打断，要么就全都不执行。

**2、可见性**：可见性指的是一个线程修改了某一个共享变量的值时，其它线程能够立即知道这个修改。

**3、有序性**：有序性指的是对于一个线程的执行代码，从前往后依次执行，单线程下可以认为程序是有序的，但是并发时有可能会发生指令重排。


## 什么是指令重排？

答案：

在执行程序时，为了提高性能，编译器和处理器常常会对指令做重排序。重排序分3种类型。

1、编译器优化的重排序。编译器在不改变单线程程序语义的前提下，可以重新安排语句的执行顺序。

2、指令级并行的重排序。现代处理器采用了指令级并行技术（Instruction-Level Parallelism，ILP）来将多条指令重叠执行。如果不存在数据依赖性，处理器可以改变语句对应 机器指令的执行顺序。

3、内存系统的重排序。由于处理器使用缓存和读/写缓冲区，这使得加载和存储操作看上去可能是在乱序执行。


## happens-before定义？

答案

1、如果一个操作happens-before另一个操作，那么第一个操作的执行结果将对第二个操作可见，而且第一个操作的执行顺序排在第二个操作之前。

2、两个操作之间存在happens-before关系，并不意味着Java平台的具体实现必须要按照 happens-before关系指定的顺序来执行。如果重排序之后的执行结果，与按happens-before关系来执行的结果一致，那么这种重排序并不非法


## happens-before六大规则？

答案：

**1、程序顺序规则**：一个线程中的每个操作，happens-before于该线程中的任意后续操作。

**2、监视器锁规则**：对一个锁的解锁，happens-before于随后对这个锁的加锁。

**3、volatile变量规则**：对一个volatile域的写，happens-before于任意后续对这个volatile域的读。

**4、传递性**：如果A happens-before B，且B happens-before C，那么A happens-before C。

**5、start()规则**：如果线程A执行操作ThreadB.start()（启动线程B），那么A线程的 ThreadB.start()操作happens-before于线程B中的任意操作。

**6、join()规则**：如果线程A执行操作ThreadB.join()并成功返回，那么线程B中的任意操作 happens-before于线程A从ThreadB.join()操作成功返回。



## volatile 实现原理？


答案：

volatile有两个作用，保证**可见性**和**有序性**。
相比synchronized的加锁方式来解决共享变量的内存可见性问题，volatile 就是更轻量的选择，它没有上下文切换的额外开销成本。
volatile可以确保对某个变量的更新对其他线程马上可见，一个变量被声明为volatile 时，线程在写入变量时不会把值缓存在寄存器或者其他地方，而是会把值刷新回主内存，当其它线程读取该共享变量 ，会从主内存重新获取最新值，而不是使用当前线程的本地内存中的值。


## synchronized 如何使用？


答案：
synchronized主要有三种用法：

**1、修饰实例方法:** 作用于当前对象实例加锁，进入同步代码前要获得 **当前对象实例的锁**
```
synchronized void method() {
  //业务代码
}
```

**2、修饰静态方法**：也就是给当前类加锁，会作⽤于类的所有对象实例 ，进⼊同步代码前要获得当前 class 的锁。
如果⼀个线程 A 调⽤⼀个实例对象的⾮静态 synchronized ⽅法，⽽线程 B 需要调⽤这个实例对象所属类的静态 synchronized ⽅法，是允许的，不会发⽣互斥现象。因为访问静态 synchronized ⽅法占⽤的锁是当前类的锁，⽽访问⾮静态 synchronized ⽅法占⽤的锁是当前实例对象锁。
```
synchronized void staic method() {
 //业务代码
}
```

**3、修饰代码块** ：指定加锁对象，对给定对象/类加锁。synchronized(this|object) 表示进⼊同步代码库前要获得给定对象的锁。synchronized(类.class) 表示进⼊同步代码前要获得 当前 **class** 的锁
```
synchronized(this) {
 //业务代码
}
```


## synchronized 底层原理？

答案：

java提供的原子性内置锁，也被称为监视器锁。使用synchronized之后，会在编译之后在同步的代码块前后加上monitorenter和monitorexit字节码指令，依赖操作系统底层互斥锁实现。其中 monitorenter 指令指向同步代码块的开始位置，monitorexit 指令则指明同步代码块的结束位置。
当执行 monitorenter 指令时，线程试图获取锁，也就是获取 monitor( monitor对象存在于每个Java对象的对象头中，synchronized 锁便是通过这种方式获取锁的，也是为什么 Java 中任意对象可以作为锁的原因 ) 的持有权。

 其内部包含一个计数器，当计数器为0则可以成功获取，获取后将锁计数器设为1也就是加1。相应的在执行 monitorexit 指令后，将锁计数器设为0，表明锁被释放。如果获取对象锁失败，那当前线程就要阻塞等待，直到锁被另外一个线程释放为止。

内部处理过程（内部有两个队列 waitSet 和 entryList）：

- 1、当多个线程进入同步代码块时，首先进入entryList
- 2、有一个线程获取到monitor锁后，就赋值给当前线程，并且计数器+1
- 3、如果线程调用wait方法，将释放锁，当前线程置为null，计数器-1，同时进入waitSet等待被唤醒，调用notify或者notifyAll之后又会进入entryList竞争锁
- 4、如果线程执行完毕，同样释放锁，计数器-1，当前线程置为null

<div align="left">
    <img src="https://offercome.cn/images/article/interview/java/3-3.png" width="800px">
</div>


## synchronized 锁升级过程？


答案：
在 Java1.6 之前的版本中，synchronized 属于重量级锁，效率低下，锁是 cpu 一个总量级的资源，每次获取锁都要和 cpu 申请，非常消耗性能。

在 jdk1.6 之后 Java 官方对从 JVM 层面对 synchronized 较大优化，所以现在的 synchronized 锁效率也优化得很不错了，Jdk1.6 之后，为了减少获得锁和释放锁所带来的性能消耗，引入了偏向锁和轻量级锁，增加了锁升级的过程，无锁->偏向锁->自旋锁->重量级锁

**synchronized 锁升级原理**：

在锁对象的对象头里面有一个 threadid 字段，在第一次访问的时候threadid 为空，jvm 让其持有偏向锁，并将 threadid 设置为其线程 id。再次进入的时候会先判断threadid 是否与其线程 id 一致，如果一致则可以直接使用此对象，如果不一致，则升级偏向锁为轻量级锁，通过自旋循环一定次数来获取锁，执行一定次数之后，如果还没有正常获取到要使用的对象，此时就会把锁从轻量级升级为重量级锁，此过程就构成了 synchronized 锁的升级。 

<div align="left">
    <img src="https://offercome.cn/images/article/interview/java/3-4.png" width="800px">
</div>

**锁的升级的目的**：锁升级是为了减低了锁带来的性能消耗。在 Java 6 之后优化 synchronized 的实现方 式，使用了偏向锁升级为轻量级锁再升级到重量级锁的方式，从而减低了锁带来的性能消耗。


## synchronized 优化有哪些？


答案：
Java的开发团队一直在对synchronized优化，其中最大的一次优化就是在jdk6的时候，新增了两个锁状态，通过锁消除、锁粗化、自旋锁等方法使用各种场景，给synchronized性能带来了很大的提升。

**1、锁膨胀** 上面讲到锁有四种状态，并且会因实际情况进行膨胀升级，其膨胀方向是：无锁——>偏向锁——>轻量级锁——>重量级锁，并且膨胀方向不可逆。

**1.1 偏向锁**
一句话总结它的作用：减少统一线程获取锁的代价。在大多数情况下，锁不存在多线程竞争，总是由同一线程多次获得，那么此时就是偏向锁。
核心思想：如果一个线程获得了锁，那么锁就进入偏向模式，此时** Mark Word **的结构也就变为偏向锁结构，当该线程再次请求锁时，无需再做任何同步操作，即获取锁的过程只需要检查 **Mark Word **的锁标记位为偏向锁以及当前线程ID等于 **Mark Word **的ThreadID即可，这样就省去了大量有关锁申请的 操作。

**1.2 轻量级锁**
轻量级锁是由偏向锁升级而来，当存在第二个线程申请同一个锁对象时，偏向锁就会立即升级为轻量级锁。注意这里的第二个线程只是申请锁，不存在两个线程同时竞争锁，可以是一前一后地交替执行同步块。

**1.3 重量级锁**
重量级锁是由轻量级锁升级而来，当同一时间有多个线程竞争锁时，锁就会被升级成重量级锁，此时其申请锁带来的开销也就变大。重量级锁一般使用场景会在追求吞吐量，同步块或者同步方法执行时间较长的场景。

**2、锁消除**
消除锁是虚拟机另外一种锁的优化，这种优化更彻底，在JIT编译时，对运行上下文进行扫描，去除不可能存在竞争的锁。比如下面代码的method1和method2的执行效率是一样的，因为object锁是私有变量，不存在所得竞争关系。

<div align="left">
    <img src="https://offercome.cn/images/article/interview/java/3-6.png" width="800px">
</div>

**3、锁粗化**

锁粗化是虚拟机对另一种极端情况的优化处理，通过扩大锁的范围，避免反复加锁和释放锁。比如下面method3 经过锁粗化优化之后就和 method4 执行效率一样了。

<div align="left">
    <img src="https://offercome.cn/images/article/interview/java/3-7.png" width="800px">
</div>

**4、自旋锁与自适应自旋锁**

轻量级锁失败后，虚拟机为了避免线程真实地在操作系统层面挂起，还会进行一项称为自旋锁的优化手段。

**自旋锁**：许多情况下，共享数据的锁定状态持续时间较短，切换线程不值得，通过让线程执行循环等待锁的释放，不让出CPU。如果得到锁，就顺利进入临界区。如果还不能获得锁，那就会将线程在操作系 统层面挂起，这就是自旋锁的优化方式。但是它也存在缺点：如果锁被其他线程长时间占用，一直不释放CPU，会带来许多的性能开销。

**自适应自旋锁**：这种相当于是对上面自旋锁优化方式的进一步优化，它的自旋的次数不再固定，其自旋 的次数由前一次在同一个锁上的自旋时间及锁的拥有者的状态来决定，这就解决了自旋锁带来的缺点。

**为什么要引入偏向锁和轻量级锁？为什么重量级锁开销大？**

重量级锁底层依赖于系统的同步函数来实现，在 linux 中使用 pthread_mutex_t（互斥锁）来实现。这些底层的同步函数操作会涉及到：操作系统用户态和内核态的切换、进程的上下文切换，而这些操作都是比较耗时的，因此重量级锁操作的开销比较大。而在很多情况下，可能获取锁时只有一个线程，或者是多个线程交替获取锁，在这种情况下，使用重量级锁就不划算了，因此引入了偏向锁和轻量级锁来降低没有并发竞争时的锁开销。



## synchronized 和 ReentrantLock 的区别？

答案：

- ReentrantLock 实现了Lock接口。synchronized是系统关键字
- ReentrantLock需要手动指定锁范围。synchronized 支持同步块、同步方法
- 都具有可重入性
- 默认都是非公平锁。但 ReentrantLock 还支持公平模式，但性能会急剧下降
- ReentrantLock 需要显示的获取锁、释放锁
- ReentrantLock 支持多种方式获取锁。
   - lock()：阻塞模式来获取锁
   - lockInterruptibly：阻塞式获取锁，支持中断
   - tryLock()：非阻塞模式尝试获取锁
   - tryLock(long timeout, TimeUnit unit)：同上，支持超时设置
- ReentrantLock 可以同时绑定多个Condition条件对象。


## 什么是 AQS ？


答案：
AbstractQueuedSynchronizer 抽象同步队列，简称 AQS ，它是Java并发包的基础，并发包中的锁就是基于 AQS 实现的。

- AQS是基于一个FIFO的双向队列，其内部定义了一个节点类Node，Node 节点内部的 SHARED 用来标记该线程是获取共享资源时被阻挂起后放入AQS 队列的， EXCLUSIVE 用来标记线程是 取独占资源时被挂起后放入AQS 队列
- AQS 使用一个 volatile 修饰的 int 类型的成员变量 state 来表示同步状态，修改同步状态成功即为获得锁，volatile 保证了变量在多线程之间的可见性，修改 State 值时通过 CAS 机制来保证修改的原子性
- 获取state的方式分为两种，独占方式和共享方式，一个线程使用独占方式获取了资源，其它线程就会在获取失败后被阻塞。一个线程使用共享方式获取了资源，另外一个线程还可以通过CAS的方式进行获取。
- 如果共享资源被占用，需要一定的阻塞等待唤醒机制来保证锁的分配，AQS 中会将竞争共享资源失败的线程添加到一个变体的 CLH 队列中。

<div align="left">
    <img src="https://offercome.cn/images/article/interview/java/3-8.png" width="800px">
</div>

先简单了解一下CLH：Craig、Landin and Hagersten 队列，是 **单向链表实现的队列**。申请线程只在本地变量上自旋，**它不断轮询前驱的状态**，如果发现 **前驱节点释放了锁就结束自旋**


AQS 中的队列是 CLH 变体的虚拟双向队列，通过将每条请求共享资源的线程封装成一个节点来实现锁的分配：

<div align="left">
    <img src="https://offercome.cn/images/article/interview/java/3-9.png" width="800px">
</div>

AQS 中的 CLH 变体等待队列拥有以下特性：

- AQS 中队列是个双向链表，也是 FIFO 先进先出的特性
- 通过 Head、Tail 头尾两个节点来组成队列结构，通过 volatile 修饰保证可见性
- Head 指向节点为已获得锁的节点，是一个虚拟节点，节点本身不持有具体线程
- 获取不到同步状态，会将节点进行自旋获取锁，自旋一定次数失败后会将线程阻塞，相对于 CLH 队列性能较好


## ReentrantLock 实现原理？


答案：

ReentrantLock 是可重入的独占锁，只能有一个线程可以获取该锁，其它获取该锁的线程会被阻塞而被放入该锁的阻塞队列里面。

看看ReentrantLock的加锁操作：

```java
 // 创建非公平锁
    ReentrantLock lock = new ReentrantLock();
    // 获取锁操作
    lock.lock();
    try {
        // 执行代码逻辑
    } catch (Exception ex) {
        // ...
    } finally {
        // 解锁操作
        lock.unlock();
    }
```
new ReentrantLock()构造函数默认创建的是非公平锁 NonfairSync。

**公平锁 FairSync**

1、公平锁是指多个线程按照申请锁的顺序来获取锁，线程直接进入队列中排队，队列中的第一个线程才能获得锁
2、公平锁的优点是等待锁的线程不会饿死。缺点是整体吞吐效率相对非公平锁要低，等待队列中除第一个线程以外的所有线程都会阻塞，CPU 唤醒阻塞线程的开销比非公平锁大

**非公平锁 NonfairSync**

1、非公平锁是多个线程加锁时直接尝试获取锁，获取不到才会到等待队列的队尾等待。但如果此时锁刚好可用，那么这个线程可以无需阻塞直接获取到锁
2、非公平锁的优点是可以减少唤起线程的开销，整体的吞吐效率高，因为线程有几率不阻塞直接获得锁，CPU 不必唤醒所有线程。缺点是处于等待队列中的线程可能会饿死，或者等很久才会获得锁

**默认创建的对象lock()的时候：**

1、如果锁当前没有被其它线程占用，并且当前线程之前没有获取过该锁，则当前线程会获取到该锁，然后设置当前锁的拥有者为当前线程，并设置 AQS 的状态值为1 ，然后直接返回。如果当前线程之前己经获取过该锁，则这次只是简单地把 AQS 的状态值加1后返回。
2、如果该锁已经被其他线程持有，非公平锁会尝试去获取锁，获取失败的话，则调用该方法线程会被放入 AQS 队列阻塞挂起。


## ReentrantLock 如何实现公平锁？


答案：

new ReentrantLock() 构造函数默认创建的是非公平锁 NonfairSync

```
public ReentrantLock() {
    sync = new NonfairSync();
}
```

同时也可以在创建锁构造函数中传入具体参数创建 公平锁 FairSync

```
ReentrantLock lock = new ReentrantLock(true);
// true 代表公平锁，false 代表非公平锁
public ReentrantLock(boolean fair) {
    sync = fair ? new FairSync() : new NonfairSync();
}
```

FairSync、NonfairSync 代表公平锁和非公平锁，两者都是 ReentrantLock 静态内部类，只不过实现不同锁语义。


##  非公平锁和公平锁的区别？

答案：

1、非公平锁在调用 lock 后，首先就会调用 CAS 进行一次抢锁，如果这个时候恰巧锁没有被占用，那么直接就获取到锁返回了。

2、非公平锁在 CAS 失败后，和公平锁一样都会进入到 tryAcquire 方法，在 tryAcquire 方法中，如果发现锁这个时候被释放了（state == 0），非公平锁会直接 CAS 抢锁，但是公平锁会判断等待队列是否有线程处于等待状态，如果有则不去抢锁，乖乖排到后面。


## 什么是 ReadWriteLock？


答案：

ReentrantLock 某些时候有局限，如果使用ReentrantLock，可能本身是为了防止线程A在写数据，线程B在读数据造成的数据不一致，但这样，如果线程C在读数据、线程D也在读数据，读数据是不会改变数据的，没有必要加锁，但是还是加锁了，降低了程序的性能。
因为这个，才诞生了读写锁ReadWriteLock。ReadWriteLock是一个读写锁接口，ReentrantReadWriteLock是ReadWriteLock接口的一个具体实现，实现了读写的分离，读锁是共享的，写锁是独占的，读和读之间不会互斥，读和写、写和读、写和写之间才会互斥，提升了读写的性能


## 什么是 CAS?

答案：

CAS叫做Compare And Swap，⽐较并交换，主要是通过处理器的指令来保证操作的原⼦性。是一种无锁的非阻塞算法的实现。

**CAS 指令包含 3 个参数**：共享变量的内存地址 A、预期的值 B 和要修改的新值 C。

只有当内存中地址 A 处的值等于 B 时，才能将内存中地址 A 处的值更新为新值 C。作为一条 CPU 指令，CAS 指令本身是能够保证原子性 。

- 更多内容，[CAS原理分析，解决银行转账ABA难题](https://mp.weixin.qq.com/s?__biz=Mzg2NzYyNjQzNg==&mid=2247484878&idx=1&sn=fdecdb6611c433d9ed3d80e899f8f9d4&scene=21#wechat_redirect)



## CAS 有什么风险？

答案：

**1、ABA 问题**

并发环境下，假设初始条件是A，去修改数据时，发现是A就会执行修改。但是看到的虽然是A，中间可能发生了A变B，B又变回A的情况。此时A已经非彼A，数据即使成功修改，也可能有问题。

**怎么解决ABA问题？**

- 加版本号

每次修改变量，都在这个变量的版本号上加1，这样，刚刚A->B->A，虽然A的值没变，但是它的版本号已经变了，再判断版本号就会发现此时的A已经被改过了。参考乐观锁的版本号，这种做法可以给数据带上了一种实效性的检验。
Java提供了AtomicStampReference类，它的compareAndSet方法首先检查当前的对象引用值是否等于预期引用，并且当前印戳（Stamp）标志是否等于预期标志，如果全部相等，则以原子方式将引用值和印戳标志的值更新为给定的更新值。

**2、循环时间长开销**

自旋CAS，如果一直循环执行，一直不成功，会给 CPU 带来非常大的执行开销。

**怎么解决循环性能开销问题？**

在Java中，很多使用自旋CAS的地方，会有一个自旋次数的限制，超过一定次数，就停止自旋。

**3、只能保证一个变量的原子操作**

CAS 保证的是对一个变量执行操作的原子性，如果对多个变量操作时，CAS 目前无法直接保证操作的原子性。

**怎么解决只能保证一个变量的原子操作问题？**

- 可以考虑改用锁来保证操作的原子性
- 可以考虑合并多个变量，将多个变量封装成一个对象，通过AtomicReference来保证原子性。


## JUC 并发包用过哪些线程安全的类？

答案：

- ConcurrentHashMap
- CountDownLatch、CyclicBarrier
- Semaphore
- BlockingQueue
- ThreadPoolExecutor
- ReentrantLock、ReentrantReadWriteLock
- CompletableFuture


## ThreadLocal 是什么？


答案：
ThreadLocal，也就是线程本地变量。如果你创建了一个ThreadLocal变量，那么访问这个变量的每个线程都会有这个变量的一个本地拷贝，多个线程操作这个变量的时候，实际是操作自己本地内存里面的变量，从而起到线程隔离的作用，避免了线程安全问题。

## ThreadLocal 实现原理？

答案：

- Thread类有一个类型为 ThreadLocal.ThreadLocalMap 的实例变量 threadLocals，即每个线程都有一个属于自己的ThreadLocalMap。
- ThreadLocalMap内部维护着Entry数组，每个Entry代表一个完整的对象，key是ThreadLocal本 身，value是ThreadLocal的泛型值。
- 每个线程在往ThreadLocal里设置值的时候，都是往自己的ThreadLocalMap里存，读也是以某个 ThreadLocal作为引用，在自己的map里找对应的key，从而实现了线程隔离。

**ThreadLocal 内存结构图：**

<div align="left">
    <img src="https://offercome.cn/images/article/interview/java/3-10.png" width="800px">
</div>

由结构图是可以看出：

- Thread对象中持有一个ThreadLocal.ThreadLocalMap的成员变量。
- ThreadLocalMap内部维护了Entry数组，每个Entry代表一个完整的对象，key是ThreadLocal本身，value是ThreadLocal的泛型值。


## Java 有哪些原子性的方法？

答案：
1、循环原子类，例如 AtomicInteger，实现i++原子操作
2、JUC 包下的锁，如 ReentrantLock ，对i++操作加锁 lock.lock() 来实现原子性
3、使用 synchronized，对 i++ 操作加锁



## 原子操作类有哪些？


答案：

当程序更新一个变量时，如果多线程同时更新这个变量，可能得到期望之外的值，比如变量i=1，A线程更新i+1，B线程也更新i+1，经过两个线程操作之后可能i不等于3，而是等于2。因为A和B线程在更新变量i的时候拿到的i都是1，这就是线程不安全的更新操作，**一般我们会使用synchronized来解决这个问题，synchronized会保证多线程不会同时更新变量i。**

其实除此之外，还有更轻量级的选择，Java从JDK 1.5开始提供了`java.util.concurrent.atomic`包，这个包中的原子操作类提供了一种用法简单、性能高效、线程安全地更新一个变量的方式。

因为变量的类型有很多种，所以在Atomic包里一共提供了13个类，属于4种类型的原子更新方式，分别是基本类型、原子更新数组、原子更新引用和原子更新属性（字段）。

`Atomic 包里的类基本都是使用Unsafe实现的包装类。`


1、**原子的方式更新基本类型**，Atomic包提供了以下3个类：

- AtomicBoolean：原子更新布尔类型。
- AtomicInteger：原子更新整型。
- AtomicLong：原子更新长整型。

**2、原子的方式更新数组里的某个元素**，Atomic包提供了以下4个类：

- AtomicIntegerArray：原子更新整型数组里的元素。
- AtomicLongArray：原子更新长整型数组里的元素。
- AtomicReferenceArray：原子更新引用类型数组里的元素。

**3、引用类型**。原子更新基本类型的AtomicInteger，只能更新一个变量，如果要原子更新多个变量，就需要使用这个原子更新引用类型提供的类。Atomic包提供了以下3个类：

- AtomicReference：原子更新引用类型。
- AtomicReferenceFieldUpdater：原子更新引用类型里的字段。
- AtomicMarkableReference：原子更新带有标记位的引用类型。可以原子更新一个布尔类型的标记位和引用类型。构造方法是AtomicMarkableReference（V initialRef，boolean initialMark）。

**4、字段更新**。如果需原子地更新某个类里的某个字段时，就需要使用原子更新字段类，Atomic包提供了以下3个类进行原子字段更新：

- AtomicIntegerFieldUpdater：原子更新整型的字段的更新器。
- AtomicLongFieldUpdater：原子更新长整型字段的更新器。
- AtomicStampedReference：原子更新带有版本号的引用类型。该类将整数值与引用关联起来，可用于原子的更新数据和数据的版本号，可以解决使用CAS进行原子更新时可能出现的 ABA问题。


## AtomicInteger 实现原理？


答案：
一句话概括：**使用CAS实现**。

以 AtomicInteger 的添加方法为例：

```
  public final int getAndIncrement() {
        return unsafe.getAndAddInt(this, valueOffset, 1);
    }
```
通过Unsafe类的实例来进行添加操作，来看看具体的CAS操作：
```
    public final int getAndAddInt(Object var1, long var2, int var4) {
        int var5;
        do {
            var5 = this.getIntVolatile(var1, var2);
        } while(!this.compareAndSwapInt(var1, var2, var5, var5 + var4));

        return var5;
    }
```
compareAndSwapInt 是一个native方法，基于CAS来操作int类型变量。其它的原子操作类基本都是大同小异。


## 死锁的条件？


答案：

1、互斥条件：该资源任意一个时刻只由一个线程占用。

2、请求与保持条件：一个进程因请求资源而阻塞时，对已获得的资源保持不放。

3、环路等待：若干进程之间形成一种头尾相接的循环等待资源关系

4、不可剥夺：线程已获得的资源在末使用完之前不能被其他线程强行剥夺，只有自己使用完毕后才释 放资源。


## 如何避免死锁?

答案： 

只要破坏产生死锁的四个条件中的其中一个就可以了

## 死锁如何排查？


答案：
可以使用jdk自带的命令行工具，基本就可以看到死锁的信息
1、使用 jps 查找运行的 Java 进程id：jps -l
2、使用 jstack 查看线程堆栈信息：jstack -l 进程id


## 什么是 CountDownLatch？


答案：

1、协调子线程结束动作，等待所有子线程运行结束

例如：我们很多人喜欢玩的王者荣耀，开黑的时候，得等所有人都上线之后，才能开打。

2、协调子线程开始动作，统一各线程动作开始的时机

**3、核心方法**

- await()：等待latch 为0；
- boolean await(long timeout, TimeUnit unit)：等待latch减为0，但是可以设置超时时间。比如有玩家超时未确认，那就重新匹配，总不能为了某个玩家等到天荒地老。
- countDown()：latch数量减1；
- getCount()：获取当前的latch数量。


## 什么是 CyclicBarrier？

答案：

CyclicBarrier的字面意思：可循环使用（Cyclic）的屏障（Barrier）。它要做的事情是，让一 组线程到达一个屏障（也可以叫同步点）时被阻塞，直到最后一个线程到达屏障时，屏障才会开门，所有被屏障拦截的线程才会继续运行。

它和CountDownLatch类似，都可以协调多线程的结束动作，在它们结束后都可以执行特定动作，但是为什么要有CyclicBarrier，因为CyclicBarrier可以重复利用。

<div align="left">
    <img src="https://offercome.cn/images/article/interview/java/3-11.png" width="800px">
</div>


## CountDownLatch 和 CyclicBarrier 区别？


答案：

| **CyclicBarrier** | **CountDownLatch** |
| --- | --- |
| CyclicBarrier是可重用的，其中的线程会等待所有的线程完成任务。届时，屏障将被拆除，并可以选择性地做一些特定的动作。 | CountDownLatch是一次性的，不同的线程在同一个计数器上工作，直到计数器为0. |
| CyclicBarrier面向的是线程数 | CountDownLatch面向的是任务数 |
| 在使用CyclicBarrier时，你必须在构造中指定参与协作的线程数，这些线程必须调用await()方法 | 使用CountDownLatch时，则必须要指定任务数，至于这些任务由哪些线程完成无关紧要 |
| CyclicBarrier可以在所有的线程释放后重新使用 | CountDownLatch在计数器为0时不能再使用 |
| 在CyclicBarrier中，如果某个线程遇到了中断、超时等问题时，则处于await的线程都会出现问题 | 在CountDownLatch中，如果某个线程出现问题，其他线程不受影响 |



## 什么是 Semaphore？


答案：

Semaphore（信号量）是用来控制同时访问特定资源的线程数量，它通过协调各个线程，以保证合理的使用公共资源。

它可以用于做流量控制，特别是公用资源有限的应用场景，比如数据库连接。

Semaphore的构造方法Semaphore（int permits）接受一个整型的数字，表示可用的许可证数量。Semaphore（10）表示允许10个线程获取许可证，也就是最大并发数是10。Semaphore的用法也很简单，首先线程使用 Semaphore的acquire()方法获取一个许可证，使用完之后调用release()方法归还许可证，还可以用tryAcquire()方法尝试获取许可证。

## 什么是 Exchanger？


答案：

Exchanger（交换者）是一个用于线程间协作的工具类。Exchanger用于进行线程间的数据交换。它提供一个同步点，在这个同步点，两个线程可以交换彼此的数据。

这两个线程通过 exchange方法交换数据，如果第一个线程先执行exchange()方法，它会一直等待第二个线程也执行exchange方法，当两个线程都到达同步点时，这两个线程就可以交换数据，将本线程生产出来的数据传递给对方。

假如两个线程有一个没有执行exchange()方法，则会一直等待，如果担心有特殊情况发生，避免一直等待，可以使用exchange(V x, long timeOut, TimeUnit unit)设置最大等待时长。


## ThreadPoolExecutor 核心参数？

答案：

线程池有七大参数，需要重点关注corePoolSize、maximumPoolSize、workQueue、handler这四个。

1、corePoolSize

此值是用来初始化线程池中核心线程数，当线程池中线程池数< corePoolSize时，系统默认是添加一个任务创建一个线程。当线程数 = corePoolSize时，新任务会追加到workQueue中。

2、maximumPoolSize

maximumPoolSize表示允许的最大线程数 = (非核心线程数+核心线程数)，当BlockingQueue也满了，但线程池中总线程数 < maximumPoolSize时候就会再次创建新的线程。

3、keepAliveTime

非核心线程 =(maximumPoolSize - corePoolSize ) ，非核心线程闲置下来不干活最多存活时间。

4、unit

线程池中非核心线程保持存活的时间的单位

- TimeUnit.DAYS; 天
- TimeUnit.HOURS; 小时
- TimeUnit.MINUTES; 分钟
- TimeUnit.SECONDS; 秒
- TimeUnit.MILLISECONDS; 毫秒
- TimeUnit.MICROSECONDS; 微秒
- TimeUnit.NANOSECONDS; 纳秒

5、workQueue

线程池等待队列，维护着等待执行的Runnable对象。当运行当线程数= corePoolSize时，新的任务会被添加到workQueue中，如果workQueue也满了则尝试用非核心线程执行任务，等待队列应该尽量用有界的。

6、threadFactory

创建一个新线程时使用的工厂，可以用来设定线程名、是否为daemon线程等等。

7、handler

corePoolSize、workQueue、maximumPoolSize都不可用的时候执行的拒绝策略。

**参数关联关系：**

- 判断线程池中的线程数，是否大于设置的核心线程数
- 如果没有，创建新线程来执行任务，直到达到核心线程数
- 此时进来的任务，放入队列，等待线程空闲时执行任务
- 如果队列已经满了，判断是否达到了线程池设置的最大线程数
- 如果已经达到了最大线程数，则执行指定的拒绝策略

其他：

- 更多内容，参考 [史上最全ThreadPoolExecutor梳理（上篇）](https://mp.weixin.qq.com/s?__biz=Mzg2NzYyNjQzNg==&mid=2247484808&idx=1&sn=13a9422ddf4e082b6e1e058debb91b62&scene=21#wechat_redirect)
- 更多内容，参考 [史上最全ThreadPoolExecutor梳理（下篇）](https://mp.weixin.qq.com/s?__biz=Mzg2NzYyNjQzNg==&mid=2247484808&idx=2&sn=2c54ec628da625b89cab0b6cf461f425&scene=21#wechat_redirect)


## 线程池 拒绝策略？

答案：

* 1、AbortPolicy：直接丢弃任务，抛出异常，这是默认策略
* 2、CallerRunsPolicy：只用调用者所在的线程来处理任务
* 3、DiscardOldestPolicy：丢弃等待队列中最旧的任务，并执行当前任务
* 4、DiscardPolicy：直接丢弃任务，也不抛出异常
* 5、使用RejectedExecutionHandler接口，自定义实现


## 线程池 有哪几种工作队列？

答案：

* 1、ArrayBlockingQueue：用数组实现的有界阻塞队列，按FIFO排序。
* 2、LinkedBlockingQueue：基于链表结构的阻塞队列，按FIFO排序任务，容量可以选择进行设置，不设置的话，将是一个无边界的阻塞队列，最大长度为Integer.MAX_VALUE，吞吐量通常要高于ArrayBlockingQuene；newFixedThreadPool线程池使用了这个队列
* 3、DelayQueue：是一个任务定时周期的延迟执行的队列。根据指定的执行时间从小到大排序，否则根据插入到队列的先后排序。newScheduledThreadPool线程池使用了这个队列。
* 4、PriorityBlockingQueue：有优先级的无界阻塞队列
* 5、SynchronousQueue：无元素存储的阻塞队列，每个插入操作必须等到另一个线程调用移除操作，否则插入操作一直处于阻塞状态，吞吐量通常要高于LinkedBlockingQuene，newCachedThreadPool线程池使用了这个队列。


## 线程池 execute 和 submit 有什么区别？


答案：
1、execute 用于提交不需要返回值的任务

```
threadsPool.execute(new Runnable() { 
    @Override public void run() { 
        // TODO Auto-generated method stub } 
    });
```

2、submit()方法用于提交有返回值的任务。线程池会返回一个future类型的对象，通过这个 future对象可以判断任务是否执行成功，并且可以通过future的get()方法来获取返回值

```
Future<Object> future = executor.submit(harReturnValuetask); 
try { 
    Object s = future.get(); 
} catch (InterruptedException e) { 
    // 处理中断异常 
} catch (ExecutionException e) { 
    // 处理无法执行任务异常 
} finally { 
    // 关闭线程池 
    executor.shutdown();
}
```


## 线程池怎么关闭？

答案：
通过调用线程池的`shutdown`或`shutdownNow`方法来关闭线程池。它们的原理是遍历线程池中的工作线程，然后逐个调用线程的interrupt方法来中断线程，所以无法响应中断的任务可能永远无法终止。

**shutdown() 将线程池状态置为shutdown，并不会立即停止**：

* 1、停止接收外部submit的任务
* 2、内部正在跑的任务和队列里等待的任务，会执行完
* 3、等到第二步完成后，才真正停止

**shutdownNow() 将线程池状态置为stop。一般会立即停止，事实上不一定**：

* 1、和shutdown()一样，先停止接收外部提交的任务
* 2、忽略队列里等待的任务
* 3、尝试将正在跑的任务interrupt中断
* 4、返回未执行的任务列表

**shutdown 和 shutdownnow 简单来说区别如下：**

* 1、shutdownNow()能立即停止线程池，正在跑的和正在等待的任务都停下了。这样做立即生效，但是风险也比较大。
* 2、shutdown()只是关闭了提交通道，用submit()是无效的；而内部的任务该怎么跑还是怎么跑，跑完再彻底停止线程池。


## 线程池的线程数如何配置？

答案：
线程在Java中属于稀缺资源，线程池不是越大越好也不是越小越好。任务分为计算密集型、IO密集型、混合型。

**1、计算密集型**

大部分都在用CPU跟内存，加密，逻辑操作业务处理等。计算密集型一般推荐线程池不要过大，一般是CPU数 + 1，+1是因为可能存在**页缺失**(就是可能存在有些数据在硬盘中需要多来一个线程将数据读入内存)。如果线程池数太大，可能会频繁的进行线程上下文切换跟任务调度。获得当前CPU核数代码如下：

```
Runtime.getRuntime().availableProcessors();
```

**2、IO密集型**

数据库链接，网络通讯传输等。线程数适当大一点，机器的CPU核数*2

**3、混合型**

可以考虑根据情况将它拆分成CPU密集型和IO密集型任务，如果执行时间相差不大，拆分可以提升吞吐量，反之没有必要。


## 常见的线程池？


答案：

通过工具类`Excutors`创建出来

* 1、newFixedThreadPool (固定数目线程的线程池)
* 2、newCachedThreadPool (可缓存线程的线程池)
* 3、newSingleThreadExecutor (单线程的线程池)
* 4、newScheduledThreadPool (定时及周期执行的线程池)


## newSingleThreadExecutor 原理？


答案：

```
public static ExecutorService newSingleThreadExecutor(ThreadFactory threadFactory) {
        return new FinalizableDelegatedExecutorService
            (new ThreadPoolExecutor(1, 1,
                                    0L, TimeUnit.MILLISECONDS,
                                    new LinkedBlockingQueue<Runnable>(),
                                    threadFactory));
    }
```
**线程池特点**

- 核心线程数为1
- 最大线程数也为1
- 阻塞队列是无界队列LinkedBlockingQueue，可能会导致OOM
- keepAliveTime为0

**工作流程：**

- 提交任务
- 线程池是否有一个线程在，如果没有，新建线程执行任务
- 如果有，将任务加到阻塞队列
- 当前的唯一线程，从队列取任务，执行完一个，再继续取，一个线程执行任务


## newFixedThreadPool 原理？

答案：

```
public static ExecutorService newFixedThreadPool(int nThreads, ThreadFactory threadFactory) {
        return new ThreadPoolExecutor(nThreads, nThreads,
                                      0L, TimeUnit.MILLISECONDS,
                                      new LinkedBlockingQueue<Runnable>(),
                                      threadFactory);
    }
```

**线程池特点：**

- 核心线程数和最大线程数大小一样
- 没有所谓的非空闲时间，即keepAliveTime为0
- 阻塞队列为无界队列LinkedBlockingQueue，可能会导致OOM

**工作流程：**

- 提交任务
- 如果线程数少于核心线程，创建核心线程执行任务
- 如果线程数等于核心线程，把任务添加到LinkedBlockingQueue阻塞队列
- 如果线程执行完任务，去阻塞队列取任务，继续执行。


##  newCachedThreadPool 原理？


答案：

```
public static ExecutorService newCachedThreadPool(ThreadFactory threadFactory) {
        return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                      60L, TimeUnit.SECONDS,
                                      new SynchronousQueue<Runnable>(),
                                      threadFactory);
    }
```
**线程池特点：**

- 核心线程数为0
- 最大线程数为Integer.MAX_VALUE，即无限大，可能会因为无限创建线程，导致OOM
- 阻塞队列是 SynchronousQueue
- 非核心线程空闲存活时间为60秒

当提交任务的速度大于处理任务的速度时，每次提交一个任务，就必然会创建一个线程。极端情况下会创建过多的线程，耗尽 CPU 和内存资源。由于空闲 60 秒的线程会被终止，长时间保持空闲的 CachedThreadPool 不会占用任何资源。

**工作流程：**

- 提交任务
- 因为没有核心线程，所以任务直接加到SynchronousQueue队列。
- 判断是否有空闲线程，如果有，就去取出任务执行。
- 如果没有空闲线程，就新建一个线程执行。
- 执行完任务的线程，还可以存活60秒，如果在这期间，接到任务，可以继续活下去；否则，被销毁。


## newScheduledThreadPool 原理？

答案：

```
public ScheduledThreadPoolExecutor(int corePoolSize) {
        super(corePoolSize, Integer.MAX_VALUE, 0, NANOSECONDS,
              new DelayedWorkQueue());
    }
```

**线程池特点**

- 最大线程数为Integer.MAX_VALUE，也有OOM的风险
- 阻塞队列是 DelayedWorkQueue
- keepAliveTime为 0
- scheduleAtFixedRate() ：按某种速率周期执行
- scheduleWithFixedDelay()：在某个延迟后执行

**工作机制**

- 线程从DelayQueue中获取已到期的 ScheduledFutureTask（DelayQueue.take()）。到期任务是指ScheduledFutureTask的time大于等于当前时间。
- 线程执行这个ScheduledFutureTask。
- 线程修改 ScheduledFutureTask 的 time 变量为下次将要被执行的时间。
- 线程把这个修改 time 之后的ScheduledFutureTask 放回 DelayQueue 中（DelayQueue.add()）。


## 线程池如何动态修改参数？

答案：
线程池提供了几个 setter 方法来设置线程池的参数。

<div align="left">
    <img src="https://offercome.cn/images/article/interview/java/3-12.png" width="800px">
</div>