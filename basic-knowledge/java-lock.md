## 锁
---

并发 (Concurrency)：一个处理器“同时”处理多个任务
并行 (Parallelism)：多个处理器 “同时”处理多个任务

#### 常见锁类型：

1.互斥锁（Mutex）

* 同步块 synchronized block

* 对象锁 object.lock()

* 可重入锁

可重入锁，也叫做递归锁，指的是同一线程外层函数获得锁之后 ，内层递归函数仍然有获取该锁的代码，但不受影响。ReentrantLock 和synchronized 都是 可重入锁。

在lock函数内，应验证线程是否为已经获得锁的线程。当unlock（）第一次调用时，实际上不应释放锁。（采用计数进行统计）

可重入锁最大的特点是避免死锁。

```
public class Test implements Runnable{

	public synchronized void get(){
		System.out.println(Thread.currentThread().getId());
		set();
	}

	public synchronized void set(){
		System.out.println(Thread.currentThread().getId());
	}

	@Override
	public void run() {
		get();
	}
	public static void main(String[] args) {
		Test ss=new Test();
		new Thread(ss).start();
		new Thread(ss).start();
		new Thread(ss).start();
	}
}

返回结果：

9
9
11
11
10
10

```

```
public class Test implements Runnable {
	ReentrantLock lock = new ReentrantLock();

	public void get() {
		lock.lock();
		System.out.println(Thread.currentThread().getId());
		set();
		lock.unlock();
	}

	public void set() {
		lock.lock();
		System.out.println(Thread.currentThread().getId());
		lock.unlock();
	}

	@Override
	public void run() {
		get();
	}

	public static void main(String[] args) {
		Test ss = new Test();
		new Thread(ss).start();
		new Thread(ss).start();
		new Thread(ss).start();
	}
}
```

2.信号量（Semaphore）

* 公平和非公平

3.乐观锁（CAS）

* ABA问题：无锁堆栈实现
