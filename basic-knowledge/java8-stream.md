### java8函数编程
---

###常用写法

* 集合--》取元素的一个属性--》去重---》组装成List--》返回

```
List<LikeDO> likeDOs=new ArrayList<LikeDO>();
 //add一系列元素 
 //得到收藏贴子的tid列表
List<Long> likeTidList = likeDOs.stream().map(LikeDO::getTid)
                .distinct().collect(Collectors.toList());
 
 ```
 
 * 集合--》按表达式过滤--》遍历、每个元系处理--》放入预先定义的集合中
 
 ```
 
  Map<String, StkProduct> newStockName2Product = Maps.newConcurrentMap();
        stockProducts.stream().filter(stkProduct -> stkProduct.enabled).forEach(stkProduct -> {
            String newName = BCConvert.bj2qj(StringUtils.replace(stkProduct.name, " ", ""));
            newStockName2Product.put(newName, stkProduct);
        });
  ```
  
 ```
 
 Set<String> qjStockNames;
 qjStockNames.stream().filter(name -> !acAutomaton.getKey2link().containsKey(name)).forEach(name -> {
            String value = "";
            StkProduct stkProduct = stockNameQj2Product.get(name);
            if (stkProduct != null) {
                value = stkProduct.name;
            }
            acAutomaton.getKey2link().put(name, value);
        });
 ```
 
 * DO模型---》Model模型
 
 ```
 List<AdDO> adDOList;
 adDOList.stream().map(adDo -> convertAdModel(adDo))
                .collect(Collectors.toList());
 
 ```
  