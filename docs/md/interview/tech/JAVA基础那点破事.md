---
title: 第一篇：JAVA 基础！反射、泛型、IO模型、重载、非阻塞
---

# JAVA 基础那点破事！反射、泛型、IO模型、重载、非阻塞

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学

## JAVA 语言特点？


答案：

1、跨平台。JAVA 的 class 文件是运行在虚拟机上的，虚拟机在不同平台有不同版本，所以说 JAVA 是跨平台的，“一次编写，到处运行（Write Once，Run any Where）”

2、面向对象。具有封装、继承、多态特点

3、支持多线程。C++ 语言没有内置的多线程机制，因此必须调用操作系统的多线程功能来进行多线程 程序设计，而 Java 语言却提供了多线程支持；

4、网络编程方便。Java 语言诞生本身就是为简化网络编程设计的，因此 Java 语言不仅支 持网络编程而且很方便



## 面向对象和面向过程的区别？

答案：

**1、面向过程：**

- 优点：性能比面向对象高，因为类调用时需要实例化，开销比较大，比较消耗资源，比如单片机、嵌 入式开发、Linux/Unix等一般采用面向过程开发，性能是最重要的因素。
- 缺点：没有面向对象易维护、易复用、易扩展。

**2、面向对象：**

- 优点：易维护、易复用、易扩展，由于面向对象有封装、继承、多态性的特性，可以设计出低耦合 的系统，使系统更加灵活、更加易于维护。
- 缺点：性能比面向过程低。


## JAVA 支持哪些数据类型？

答案：

- 1、**基本数据类型（8个）**
   - 整数型：byte、short、int、long
   - 浮点型：float、double
   - 字符型：char 
   - 布尔型：boolean 
- 2、**引用数据类型（3个）**
   - 类、接口、数组

<div align="left">
    <img src="http://offercome.cn/images/article/interview/java/java-basic-1.jpg" width="800px">
</div>


## 接口和抽象类有什么区别？

答案

1. 接口是抽象类的变体，接口中所有的方法都是抽象的。而抽象类是声明方法的存在而不去实现它的类。

2. 接口可以多继承，抽象类不行。

3. 接口定义方法，不能实现，默认是 public abstract，而抽象类可以实现部分方法。

4. 接口中基本数据类型为 public static final 并且需要给出初始值，而抽类象不是的。

   

## 重载和重写什么区别？

答案：

**1、重写：**

- 参数列表必须完全与被重写的方法相同，否则不能称其为重写而是重载.
- 返回的类型必须一直与被重写的方法的返回类型相同，否则不能称其为重写而是重载。
- 访问修饰符的限制一定要大于被重写方法的访问修饰符
- 重写方法一定不能抛出新的检查异常或者比被重写方法申明更加宽泛的检查型异常。

**2、重载：**

- 必须具有**不同的参数列表**；
- 可以有不同的返回类型，只要参数列表不同就可以了；
- 可以有**不同的访问修饰符**；
- 可以抛出**不同的异常**；



## 构造器是否可被重写（override）？

答案： 

构造器不能被继承，因此不能被重写，但可以被重载。每一个类必须有自己的构造函数，负责构造自己 这部分的构造。子类不会覆盖父类的构造函数，相反必须一开始调用父类的构造函数


## JDK、JRE、JVM 三者有什么关系？

答案：

1、JDK（全称 Java Development Kit），拥有 JRE 所拥有的一切，还有编译器（javac）和工具（如 javadoc 和 jdb）。能独立创建、编译、运行程序。
> JDK = JRE + java开发工具（javac.exe/java.exe/jar.exe)

2、JRE（全称 Java Runtime Environment），包括 Java 虚拟机（JVM），Java 类库，java 命令和其他的一些基础构件。能运行已编译好的程序，但不能创建程序
> JRE = JVM + java核心类库

3、JVM （全称 Java Virtual Machine），java虚拟机。


## 什么是字节码?

答案：

Java之所以可以“`一次编译，到处运行`”，一是因为 JVM 针对各种操作系统、平台都进行了定制。二是因为无论在什么平台，都可以编译成固定格式的字节码（.class文件）供JVM使用。因此，也可以看出字节码对于Java生态的重要性。 

字节码文件由十六进制值组成，而JVM以两个十六进制值为一组，即以字节为单位进行读取。在Java中一般是用`javac命令`编译源代码为字节码文件。

Java语言通过字节码的方式，在一定程度上解决了传统解释型语言执行效率低的问题，同时又保留了`解释型语言`可移植的特点。所以Java程序运行时比较高效，而且，由于字节码并不专对一种特定的机器， 因此，Java程序无须重新编译便可在多种不同的计算机上运行。


## 访问修饰符 public、private、protected？

答案：

Java中，可以使用访问控制符来保护对类、变量、方法和构造方法的访问。Java 支持 4 种不同的访问权 限。 

1、default (即默认，什么也不写）: 在同一包内可见，不使用任何修饰符。使用对象：类、接口、变量、方法。 2、private : 在同一类内可见。使用对象：变量、方法。注意：不能修饰类（外部类） 

3、public : 对所有类可见。使用对象：类、接口、变量、方法 

4、protected : 对同一包内的类和所有子类可见。使用对象：变量、方法。注意：不能修饰类（外部类）


## break 、continue 、return 作用？

答案： 

1、break 跳出总上一层循环，不再执行循环(结束当前的循环体) 

2、continue 跳出本次循环，继续执行下次循环(结束正在执行的循环 进入下一个循环条件) 

3、return 程序返回，不再执行下面的代码(结束当前的方法，直接返回) 


## JAVA 创建对象有哪些方式？


答案：

1、new关键字
```
Person p1 = new Person();
```

2、Class.newInstance
```
Person p1 = Person.class.newInstance();
```

3、Constructor.newInstance
```
Constructor<Person> constructor = Person.class.getConstructor();
Person p1 = constructor.newInstance();
```

4、clone
```
Person p1 = new Person();
Person p2 = p1.clone();
```

5、反序列化
```
Person p1 = new Person();
byte[] bytes = SerializationUtils.serialize(p1);
Person p2 = (Person)SerializationUtils.deserialize(bytes);
```

## 值传递和引用传递的区别？

答案：

**1、值传递：**

指的是在方法调用时，传递的参数是按值的拷贝传递，传递的是值的拷贝，也就是说传递后就 互不相关了。

**2、引用传递：**

指的是在方法调用时，传递的参数是按引用进行传递，其实传递的是引用的地址，也就是变 量所对应的内存空间的地址。也就是说传递前和传递后都指向同一个引用（同一个内存空间）
> 基本类型作为参数被传递时肯定是值传递；引用类型作为参数被传递时也是值传递，只不过“值”为对应的引用


## == 和 equals 有什么区别？

答案：

1、== ：如果是基本数据类型，比较两个值是否相等；如果是对象，比较两个对象的引用是否相等，指向同一块内存区域

2、equals：用于对象之间，比较两个对象的值是否相等。


## hashCode() 的作用？

答案：

hashCode() 的作用是生成哈希码，也称为散列码，返回一个 int 整数。
哈希码用来确定该对象在哈希表中的索引位置。hashCode() 定义在JDK的Object.java中，每个类中都包含这个方法。
散列表存储的是键值对(key-value)，它的特点：能根据“键”快速的检索出对应的“值”。这其中就利用到了散列码，可以快速找到所需要的对象。


## 为什么要有 hashCode?

答案： 

以`HashSet 如何检查重复`为例子来说明为什么要有 hashCode。

当你把对象加入 HashSet 时，HashSet 会先计算对象的 hashcode 值来判断对象加入的位置，同时也会与其他已经加入的对象的 hashcode 值作比较，如果没有相符的hashcode，HashSet会假设对象没有重复出现。

但是如果发现有相同 hashcode 值的对象，这时会调用 equals()方法来检查 hashcode 相等的对象是否真的相同。如果两者相同，HashSet 就不会让其添加成功。如果不同的话，就会重新散列到其他位置。这样我们就大大减少了 equals 的次数，大大提高执行速度


## hashCode()、equals() 的关系?

答案：

- 如果两个对象 equals，Java 运行时环境会认为他们的 hashCode 一定相等。
- 如果两个对象不 equals，他们的 hashCode 有可能相等。
- 如果两个对象 hashCode 相等，他们不一定 equals。
- 如果两个对象 hashCode 不相等，他们一定不 equals


**重要规范：**

- 如果重写 equals() 方法，有必要重写 hashcode()方法，确保通过 equals()方法判断结果为true 的两个对象具有相等的 hashcode() 方法返回值。简单来说：“如果两个对象相同，那么他们的 hashCode 应该相等”。
- 如果 equals() 方法返回 false，即两个对象“不相同”，并不要求对这两个对象调用hashCode() 方法得到两个不相同的数。简单来说：“如果两个对象不相同，他们的 hashCode 可能相同”


## String 有哪些特性?

答案： 

1、不变性：String 是只读字符串，是一个典型的 immutable 对象，对它进行任何操作，其实都是创建一个新的对象，再把引用指向该对象。不变模式的主要作用在于当一个对象需要被多线程共享并频繁访问时，可以保证数据的一致性； 

2、常量池优化：String 对象创建之后，会在字符串常量池中进行缓存，如果下次创建同样的对象时，会直接返回缓存的引用 

3、final：使用 final 来定义 String 类，表示 String 类不能被继承，提高了系统的安全性。


## String、StringBuffer、StringBuilder 区别？

答案

1、String。采用 `final`修饰，对象不可变，线程安全。如果对一个已经存在的String对象修改，会重新创建一个新对象，并把值放进去。

2、StringBuffer，采用 `synchronized` 关键字修饰，线程安全

3、StringBuilder，非线程安全，但效率会更高些，适用于单线程。


## HashMap 用 String 做 key 有什么好处？

答案： 

HashMap 通过 key 的 hashcode 来确定 value 的存储位置，因为字符串是不可变的，所以当创建字符串后，它的 hashcode 被缓存下来，不需要再次计算，所以相比于其他对象更快。


## Integer 和 int 有什么区别?

答案：

- Integer是int的包装类；int是基本数据类型；
- Integer变量必须实例化后才能使用；int变量不需要；
- Integer实际是对象的引用，指向此new的Integer对象；int是直接存储数据值 ；
- Integer的默认值是null；int的默认值是0


- final 变量：被修饰的变量不可变，不可变分为 引用不可变 和 对象不可变 ，final 指的是 引用不可变 ，final 修饰的变量必须初始化，通常称被修饰的变量为常量 。
- final 方法：被修饰的方法不允许被覆盖，子类可以使用该方法。
- final 类：被修饰的类不能被继承，所有方法不能被重写。 

2、finally 作为异常处理的一部分，它只能在 try/catch 语句中，并且附带一个语句块表示这段语句最终 一定被执行（无论是否抛出异常），经常被用在释放资源。

3、finalize 是在 java.lang.Object 里定义的方法，也就是说每一个对象都有这么个方法，这个方法在 gc 启动，该对象被回收的时候被调用。

 一个对象的 finalize 方法只会被调用一次，finalize 被调用不一定会立即回收该对象，所以有可能调用 finalize 后，该对象又不需要被回收了，然后到了真正要被回收的时候，因为前面调用过一次，所以不会 再次调用 finalize 了，进而产生问题，因此不推荐使用 finalize 方法。


## try-catch-finally，如果 catch 中 return了，还会执行finally吗？

答案：

当然啦，会在return之前执行。


## 能否在 static 环境中访问非static变量？

答案： 

static 变量在Java中是属于类的，它在所有的实例中的值是一样的。当类被Java虚拟机载入的时候，会对static 变量进行初始化。如果你的代码尝试不用实例来访问非static的变量，编译器会报错，因为这些变量还没有被创建出来，还没有跟任何实例关联上。




## final、finally、finalize的区别？

答案：

1、final 用于修饰变量、方法和类。

## static 静态方法里面能不能引用静态资源？

答案：

可以，因为都是类初始化的时候加载的。

## 非静态方法里面能不能引用静态资源？

答案： 

可以，非静态方法就是实例方法，那是new之后才产生的，那么属于类的内容它都认识。


## Error 和 Exception 区别？


答案：

JAVA 标准库内建了一些通用的异常，这些类以`Throwable`为顶层父类。

Throwable又派生出 Error类 和 Exception 类 。

**1、错误：** Error 属于程序无法处理的错误 ，我们没办法通过 catch 来进行捕获。例如，系统崩溃，内存不足，堆栈溢出等，编译器不会对这类错误进行检测，一旦这类错误发生，通常应用程序会被终止，仅靠应用程序本身无法恢复。

**2、异常：** Exception以及他的子类，代表程序运行时发送的各种不期望发生的事件。可以被Java异常处理机制使用，是异常处理的核心。 Exception 又可以分为运行时异常 (RuntimeException，又叫非受检查异常) 和非运行时异常 (又叫受检查异常) 。

> 非受检查异常和受检查异常之间的区别：
> <br/>是否强制要求调用者必须处理此异常，如果强制要求调用者必须进行处理，那么就使用受检查异常，否则就选择非受检查异常



## 什么是非受检查异常？

答案：

非受检查异常：包括 `RuntimeException` 类及其子类，表示 JVM 在运行期间可能出现的异常。 Java 编译器不会检查运行时异常。例如： NullPointException(空指针) 、 NumberFormatException（字符串转换为数字） 、 IndexOutOfBoundsException(数组越界) 、 ClassCastException(类转换异常) 、ArrayStoreException(数据存储异常，操作数组时类型不一致) 等。

## 什么是 受检查异常？

答案：

受检查异常：是Exception 中除 RuntimeException 及其子类之外的异常。 Java 编译器会检查受检查异常。
常见的受检查异常有：`IO 相关的异常`、 `ClassNotFoundException` 、 `SQLException` 等。


## 常见异常有哪些？

答案：

- java.lang.IllegalAccessError：违法访问错误。当一个应用试图访问、修改某个类的域（Field）或者调用其方法，但是又违反域或方法的可见性声明，则抛出该异常。
- java.lang.InstantiationError：实例化错误。当一个应用试图通过Java的new操作符构造一个抽象类或者接口时抛出该异常.
- java.lang.OutOfMemoryError：内存不足错误。当可用内存不足以让Java虚拟机分配给一个对象时抛出该错误。
- java.lang.StackOverflowError：堆栈溢出错误。当一个应用递归调用的层次太深而导致堆栈溢出或者陷入死循环时抛出该错误。
- java.lang.ClassCastException：类造型异常。假设有类A和B（A不是B的父类或子类），O是A的实例，那么当强制将O构造为类B的实例时抛出该异常。该异常经常被称为强制类型转换异常。
- java.lang.ClassNotFoundException：找不到类异常。当应用试图根据字符串形式的类名构造类，而在遍历CLASSPAH之后找不到对应名称的class文件时，抛出该异常。
- java.lang.ArithmeticException：算术条件异常。譬如：整数除零等。
- java.lang.ArrayIndexOutOfBoundsException：数组索引越界异常。当对数组的索引值为负数或大于等于数组大小时抛出。
- java.lang.IndexOutOfBoundsException：索引越界异常。当访问某个序列的索引值小于0或大于等于序列大小时，抛出该异常。
- java.lang.InstantiationException：实例化异常。当试图通过newInstance()方法创建某个类的实例，而该类是一个抽象类或接口时，抛出该异常。
- java.lang.NoSuchFieldException：属性不存在异常。当访问某个类的不存在的属性时抛出该异常。
- java.lang.NoSuchMethodException：方法不存在异常。当访问某个类的不存在的方法时抛出该常。
- java.lang.NullPointerException：空指针异常。当应用试图在要求使用对象的地方使用了null时，抛出该异常。譬如：调用null对象的实例方法、访问null对象的属性、计算null对象的长度、使用throw语句抛出null等等。
- java.lang.NumberFormatException：数字格式异常。当试图将一个String转换为指定的数字类型，而该字符串确不满足数字类型要求的格式时，抛出该异常。
- java.lang.StringIndexOutOfBoundsException：字符串索引越界异常。当使用索引值访问某个字符串中的字符，而该索引值小于0或大于等于序列大小时，抛出该异常


## 什么是反射？

答案： 

反射是在运行状态中，对于任意一个类，都能够知道这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意一个方法和属性；这种动态获取的信息以及动态调用对象的方法的功能称为 Java 语言的反射机制。




## 反射的优缺点？

答案： 

**1、优点：**

能够运行时动态获取类的实例，提高灵活性；可与动态编译结合

```
Class.forName('com.mysql.jdbc.Driver.class');  // 加载MySQL的驱动类。
```

**2、缺点：**

使用反射性能较低，需要解析字节码，将内存中的对象进行解析。其解决方案是：通过 `setAccessible(true)`，关闭JDK的安全检查来提升反射速度；多次创建一个类的实例时，有缓存会快很多；ReflflectASM工具类，通过字节码生成的方式加快反射速度。


## 如何获取反射中的 Class 对象？

答案：

1、Class.forName(“类的路径”)；当你知道该类的全路径名时，你可以使用该方法获取 Class 类对象。
```
Class clz = Class.forName("java.lang.String");
```

2、类名.class。这种方法只适合在编译前就知道操作的 Class。
```
Class clz = String.class;
```

3、对象名.getClass()
```
String str = new String("Hello");
Class clz = str.getClass();
```

4、如果是基本类型的包装类，可以调用包装类的Type属性来获得该包装类的Class对象。


## 反射 API 有几类？

答案： 

反射 API 用来生成 JVM 中的类、接口或则对象的信息。

* Class 类：反射的核心类，可以获取类的属性，方法等信息。
* Field 类：Java.lang.reflec 包中的类，表示类的成员变量，可以用来获取和设置类中的属性值。
* Method 类：Java.lang.reflec 包中的类，表示类的方法，它可以用来获取类中的方法信息或者执行方法。
* Constructor 类：Java.lang.reflec 包中的类，表示类的构造方法。


## 为什么引入反射？

 答案
 ： 
1、反射让开发人员可以通过外部类的全路径名创建对象，并使用这些类，实现一些扩展的功能。 

2、反射让开发人员可以枚举出类的全部成员，包括构造函数、属性、方法。以帮助开发者写出正确的代码。

3、测试时可以利用反射 API 访问类的私有成员，以保证测试代码覆盖率


## 什么是泛型 ?

答案： 泛型是 JDK1.5 的一个新特性，泛型就是将类型参数化，其在编译时才确定具体的参数。这种参数类型可以用在类、接口和方法的创建中，分别称为泛型类、泛型接口、泛型方法

泛型是一种语法糖。泛型只存在于编译阶段，而不存在于运行阶段。在编译后的 class 文件中，是没有泛型这个概念的。


## 泛型的优点？

答案：

1、类型安全

- 泛型的主要目标是提高 Java 程序的类型安全
- 编译时期就可以检查出因 Java 类型不正确导致的 ClassCastException 异常
- 符合越早出错代价越小原则

2、消除强制类型转换

- 泛型的一个附带好处是，使用时直接得到目标类型，消除许多强制类型转换
- 所得即所需，这使得代码更加可读，并且减少了出错机会

3、潜在的性能收益

- 由于泛型的实现方式，支持泛型（几乎）不需要 JVM 或类文件更改
- 所有工作都在编译器中完成
- 编译器生成的代码跟不使用泛型（和强制类型转换）时所写的代码几乎一致，只是更能确保类型安全而已



## 什么是限定通配符和非限定通配符 ? 

答案：

```
1、限定通配符

对类型进行了限制。有两种限定通配符，一种是 <? extends T>  它通过确保类型必须是T的子类来设定类型的上界。另一种是 <? super T> 它通过确保类型必须是T的父类来设定类型的下界。泛型类型必须用限定内的类型来进行初始化，否则会导致编译错误。 

2、非限定通配符 ？

可以用任意类型来替代。如 List<?> 的意思是这个集合是一个可以持有任意类型的集合，它可以是 List<A> ，也可以是 List<B> ，或者 List<C> 等等。
```

## 序列化、反序列化是什么？

答案：

1、序列化：序列化是把对象转换成有序字节流，以便在网络上传输或者保存在本地文件中。核心作用是对象状态的保存与重建。我们都知道，Java对象是保存在JVM的堆内存中的，也就是说，如果JVM堆不存在了，那么对象也就跟着消失了。 
而序列化提供了一种方案，可以让你在即使JVM停机的情况下也能把对象保存下来的方案。就像我们平时用的U盘一样。把Java对象序列化成可存储或传输的形式（如二进制流），比如保存在文件中。这样，当再次需要这个对象的时候，从文件中读取出二进制流，再从二进制流中反序列化出对象。 

2、反序列化：客户端从文件中或网络上获得序列化后的对象字节流，根据字节流中所保存的对象状态及描述信息，通过反序列化重建对象。


## 什么是 serialVersionUID ？

答案：

serialVersionUID 用来表明类的不同版本间的兼容性。
 Java 的序列化机制是通过在运行时判断类的 serialVersionUID 来验证版本一致性的。在进行反序列化时，JVM会把传来的字节流中的 serialVersionUID 与本地相应实体（类）的serialVersionUID进行比较，如果相同就认为是一致的，可以进行反序列化，否则就会出现序列化版本不一致的异常。


## 为什么要显示指定 serialVersionUID 值?

答案：

如果不显示指定serialVersionUID，JVM在序列化时会根据属性自动生成一个serialVersionUID, 然后与属性一起序列化， 再进行持久化或网络传输。在反序列化时，JVM会再根据属性自动生成一个新版serialVersionUID，然后将这个新版serialVersionUID与序列化时生成的旧版 serialVersionUID 进行比较，如果相同则反序列化成功，否则报错。

如果显示指定了，JVM在序列化和反序列化时仍然都会生成一个serialVersionUID，但值为我们显示指定的值，这样在反序列化时新旧版本的serialVersionUID就一致了。 

在实际开发中，不显示指定serialVersionUID的情况会导致什么问题? 如果我们的类写完后不再修改，那当然不会有问题，但这在实际开发中是不可能的，我们的类会不断迭代， 一旦类被修改了， 那旧对象反序列化就会报错。所以在实际开发中， 我们都会显示指定一个serialVersionUID，值是多少无所谓， 只要不变就行。


## serialVersionUID 什么时候修改？

答案：
《阿里巴巴Java开发手册》中有以下规定：

<div align="left">
    <img src="https://offercome.cn/images/article/interview/java/java-basic-2.jpg" width="800px">
</div>


## 有些字段不想序列化？

答案：
 对于不想进行序列化的变量，使用 transient 关键字修饰。


## 进程和线程的区别？

答案：

1、进程：是一个程序的执行流程，是系统进行资源分配和调度的基本单位，作用是程序能够并发执行提高资源利用率。因为进程的创建、销毁、切换产生大量的时间和空间的开销，所以进程的数量不能太多

2、线程：是比进程更小的能独立运行的基本单位，他是进程的一个实体，可以减少程序并发执行时的时间和空间开销，使得操作系统具有更好的并发性。多个线程可以共享进程的系统资源。线程基本不拥有系统资源，只有一些运行时必不可少的资源，比如程序计数器、寄存器和栈，进程则占有堆。


## AQS （AbstractQueuedSynchronizer 抽象队列同步器 ）的原理？

答案：

AQS内部维护一个state状态位，尝试加锁的时候通过CAS(CompareAndSwap)修改值，如果成功设置为 1，并且把当前线程ID赋值，则代表加锁成功。
一旦获取到锁，其他的线程将会被阻塞进入阻塞队列自旋，获得锁的线程释放锁的时候将会唤醒阻塞队列中的线程，释放锁的时候则会把state重新置为0，同时当前线程ID置为空。


## Java 都用过哪些锁？


答案：

- 乐观锁、悲观锁
- 分布式锁
- 独占锁、共享锁
- 互斥锁
- 读写锁
- 公平锁、非公平锁
- 可重入锁
- 自旋锁
- 分段锁
- 锁升级（无锁|偏向锁|轻量级锁|重量级锁）
- 锁优化技术（锁粗化、锁消除）
- 更多详细内容，[一文全面梳理各种锁机制](https://mp.weixin.qq.com/s?__biz=Mzg2NzYyNjQzNg==&mid=2247484801&idx=1&sn=66bb92c8b3a5f3617d2a8eea0a526cf5&scene=21#wechat_redirect)


## HashMap 原理？


答案：

内部由数组和链表组成，非线程安全。JDK1.7和1.8的主要区别在于头插和尾插方式的修改，头插容易导致HashMap链表死循环，并且1.8之后加入红黑树对性能有提升。

- put插入：key 计算hash值，取模，找到数组位置，如果数组中没有元素直接存入，反之，则判断key是否相同，key相同就覆盖，否则就会插入到链表的尾部。如果链表的⻓度超过8且数据总量超过64，则会转换成红黑树。最后判断元素个数是否超过默认的⻓度（16）*负载因子（0.75），也就是12，超过则进行扩容。
- get查询：计算出hash值，然后去数组查询，是红黑树就去红黑树查，链表就遍历链表查询就可以了。

红黑树的时间复杂度 O(logn)；链表的时间复杂度 O(n)，当链表过长时，红黑树能大大提高查询性能。


## HashMap 线程不安全体现在哪里？

答案：

HashMap 1.7 中扩容时，因为采用的是头插法，所以会可能会有循环链表产生，导致数据有问题，在 1.8 版本已修复，改为了尾插法
在任意版本的 HashMap 中，如果在插入数据时多个线程命中了同一个槽，可能会有数据覆盖的情况发生，导致线程不安全。


## ConcurrentHashMap 如何保证线程安全的？

答案：
ConcurrentHashmap在JDK1.7和1.8的版本改动比较大。

- 1.7 使用Segment + HashEntry 分段锁的方式实现，Segment继承于ReentrantLock，HashEntry存储键值对数据。
- 1.8 采用数组+ 链表 + 红黑树。锁设计上抛弃了Segment分段锁，采用 CAS + synchronized 实现。


## ArrayList 和 LinkedList 区别？

答案：

**1、Arraylist**

- 非线程安全
- 底层采用数组存储
- 插入、删除元素，时间复杂度受位置影响。默认是添加在列表的末尾，如果在位置 k 插入或删除一个元素，需要将k后面的元素后移或前移一位。
- 支持随机访问，根据索引下标序号，可以快速定位元素
- 需要连续的内存空间，中间不能有碎片

**2、LinkedList**

- 非线程安全
- 底层采用双向循环链表存储
- 插入、删除元素，时间复杂度不受位置影响，只需要更改位置 k的前后指针地址，时间复杂度为 O(1)
- 不支持高效的随机访问
- 不需要连续的内存空间


## 什么是 ReentrantLock ？

答案：
java
ReentrantLock 意为可重入锁，其底层使用 AQS 实现。有两种模式，一种是公平锁，一种是非公平锁。

- 公平模式下等待线程入队列后会严格按照队列顺序去执行
- 非公平模式下等待线程入队列后有可能会出现插队情况



**公平锁：**

<div align="left">
    <img src="https://offercome.cn/images/article/interview/java/java-basic-3.jpg" width="800px">
</div>


- 第一步：**获取状态的 state 的值**
   - 如果 state=0 即代表锁没有被其它线程占用，执行第二步。
   - 如果 state!=0 则代表锁正在被其它线程占用，执行第三步。
- 第二步：**判断队列中是否有线程在排队等待**
   - 如果不存在则直接将锁的所有者设置成当前线程，且更新状态 state 。
   - 如果存在就入队。
- 第三步：**判断锁的所有者是不是当前线程**
   - 如果是则更新状态 state 的值。
   - 如果不是，线程进入队列排队等待。



**非公平锁：**

<div align="left">
    <img src="https://offercome.cn/images/article/interview/java/java-basic-4.jpg" width="800px">
</div>

- 获取状态的 state 的值
   - 如果 state=0 即代表锁没有被其它线程占用，则设置当前锁的持有者为当前线程，该操作用 CAS 完成。
   - 如果不为0或者设置失败，代表锁被占用进行下一步。
- 此时**获取 state 的值**
   - 如果是，则给state+1，获取锁
   - 如果不是，则进入队列等待
   - 如果是0，代表刚好线程释放了锁，此时将锁的持有者设为自己
   - 如果不是0，则查看线程持有者是不是自己

## **volatile 原理?**


答案：

- **保证内存可见性**
   - 可见性是指线程之间的可见性，一个线程修改的状态对另一个线程是可见的。也就是一个线程修改的结果，另一个线程马上就能看到。
   - CPU 会根据缓存一致性协议，强制线程重新从主内存加载最新的值到自己的工作内存中，而不是直接用 CPU 缓存中的值。
- **禁止指令重排序**
   - CPU 是和缓存做交互的，但是由于 CPU 运行效率太高，所以会不等待当前命令返回结果从而继续执行下一个命令，就会有乱序执行的情况发生


## ThreadLocal 原理?

答案：

ThreadLocal有一个静态内部类ThreadLocalMap，ThreadLocalMap又包含了一个Entry数组，Entry本身是一个弱引用，他的key是指向ThreadLocal的弱引用，Entry具备保存key -- value键值对的能力。
在使用完之后调用remove方法删除Entry对象，避免出现内存泄露。


## 什么是工作内存、主内存？


答案：

- 工作内存：寄存器、CPU缓存（L1、L2、L3）
- 主内存：主要是指物理内存


## IO 流分为几种？


答案：

<div align="left">
    <img src="https://offercome.cn/images/article/interview/java/java-basic-5.jpg" width="800px">
</div>


## 字符流与字节流的区别？


答案：

- 读写的时候，字节流是按字节读写，字符流按字符读写。
- 字节流适合所有类型文件的数据传输，因为计算机字节（Byte）是电脑中表示信息含义的最小单位。字符流只能够处理纯文本数据，其他类型数据不行，但是字符流处理文本要比字节流处理文本要方便。
- 在读写文件需要对内容按行处理，比如比较特定字符，处理某一行数据的时候一般会选择字符流。
- 只是读写文件，和文件内容无关时，一般选择字节流。


## 线程有哪些状态？是如何转换？

答案：
New、Runnable、Running、Blocked、Waiting、Timed Waiting、Terminated

<div align="left">
    <img src="https://offercome.cn/images/article/interview/java/java-basic-6.jpg" width="800px">
</div>


## 怎么保证线程安全？

答案：

- synchronized 关键字
   - 可以用于代码块，方法（静态方法，同步锁是当前字节码对象；实例方法，同步锁是实例对象）
- lock锁机制

```
Lock lock = new ReentrantLock();
lock. lock();
try {
    System. out. println("获得锁");
} catch (Exception e) {
   
} finally {
    System. out. println("释放锁");
    lock. unlock();
}
```


## IO 模型有哪五种？

答案：

1、同步阻塞IO。当 应用B 发起读取数据申请时，如果内核数据没有准备好，应用B会一直处于等待数据状态，直到内核把数据准备好了交给应用B才结束。

2、非阻塞IO。当应用B发起读取数据申请时，如果内核数据没有准备好会即刻告诉应用B，不会让B在这里等待。

3、IO复用模型。进程通过将一个或多个fd传递给select，阻塞在select操作上，select帮我们侦测多个fd是否准备就绪，当有fd准备就绪时，select返回数据可读状态，应用程序再调用recvfrom读取数据。

4、信号IO。信号驱动IO不是用循环请求询问的方式去监控数据就绪状态，而是在调用sigaction时候建立一个SIGIO的信号联系，当内核数据准备好之后再通过SIGIO信号通知线程数据准备好后的可读状态，当线程收到可读状态的信号后，此时再向内核发起recvfrom读取数据的请求，因为信号驱动IO的模型下应用线程在发出信号监控后即可返回，不会阻塞，所以这样的方式下，一个应用线程也可以同时监控多个fd。

5、异步IO。解决了应用程序需要先后查看数据是否就绪、发送接收数据请求两个阶段的模式，在异步IO的模式下，只需要向内核发送一次请求就可以完成状态查询和数据拷贝的所有操作。


## 阻塞IO 和 非阻塞IO 区别？

答案：

如果数据没有就绪，在查看数据是否就绪的这个阶段是一直等待？还是直接返回一个标志信息。


## JMM 是什么？

答案：
<div align="left">
    <img src="https://offercome.cn/images/article/interview/java/java-basic-7.jpg" width="800px">
</div>

JMM 就是 Java内存模型(java memory model)。因为在不同的硬件生产商和不同的操作系统下，内存的访问有一定的差异，所以会造成相同的代码运行在不同的系统上会出现各种问题。所以java内存模型(JMM)屏蔽掉各种硬件和操作系统的内存访问差异，以实现让java程序在各种平台下都能达到一致的并发效果。

Java内存模型规定所有的变量都存储在主内存中，包括实例变量，静态变量，但是不包括局部变量和方法参数。每个线程都有自己的工作内存，线程的工作内存保存了该线程用到的变量和主内存的副本拷贝，线程对变量的操作都在工作内存中进行。线程不能直接读写主内存中的变量。

每个线程的工作内存都是独立的，线程操作数据只能在工作内存中进行，然后刷回到主存。这是 Java 内存模型定义的线程基本工作方式。


## 什么是单例模式懒汉式？


答案：

```
// 懒汉式
public class Singleton {
    // 延迟加载保证多线程安全
    Private volatile static Singleton singleton;
    private Singleton(){}
    public static Singleton getInstance(){
        if(singleton == null){
            synchronized(Singleton.class){
                if(singleton == null){
                    singleton = new Singleton();
                }
            }
        }
        return singleton;
    }
}
```

- 使用 volatile 是**防止指令重排序，保证对象可见**，防止读到半初始化状态的对象
- 第一层if(singleton == null) 是为了防止有多个线程同时创建
- synchronized 是加锁防止多个线程同时进入该方法创建对象
- 第二层if(singleton == null) 是防止有多个线程同时等待锁，一个执行完了后面一个又继续执行的情况



## 深拷贝、浅拷贝是什么？


答案：

- 浅拷贝并不是真的拷贝，只是**复制指向某个对象的指针**，而不复制对象本身，新旧对象还是共享同一块内存。
- 深拷贝会另外**创造一个一模一样的对象**，新对象跟原对象不共享内存，修改新对象不会影响到原对象。


## 一个对象的内存布局是怎么样的?


答案：

<div align="left">
    <img src="https://offercome.cn/images/article/interview/java/java-basic-8.jpg" width="800px">
</div>

**1、对象头**: 对象头又分为 **MarkWord** 和 **Class Pointer ** 两部分。

- **MarkWord**: 包含一系列的标记位，比如对象的hashcode、分代年龄、轻量级锁指针、重量级锁指针、GC标记、偏向锁线程ID、偏向锁时间戳
- **ClassPointer**: 用来指向对象对应的 Class 对象（其对应的元数据对象）的内存地址。在 32 位系统占 4 字节，在 64 位系统中占 8 字节。

**2、Length **: 只在数组对象中存在，用来记录数组的长度，占用 4 字节

**3、Instance data**: 对象实际数据，对象实际数据包括了对象的所有成员变量，其大小由各个成员变量的大小决定。(这里不包括静态成员变量，因为其是在方法区维护的)

**4、Padding**: Java 对象占用空间是 8 字节对齐的，即所有 Java 对象占用 bytes 数必须是 8 的倍数，因为当我们从磁盘中取一个数据时，不会说我想取一个字节就是一个字节，都是按照一块儿一块儿来取的，这一块大小是 8 个字节，所以为了完整，padding 的作用就是补充字节，**保证对象是 8 字节的整数倍**

