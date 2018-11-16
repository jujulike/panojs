# krpano接口封装    

pano.js封装了krpano的常用功能，并进行了一定的扩展。    

### 使用方法      

```javascript
//Vue中使用,在main.js中
import Pano from 'path/pano.js';
Vue.prototype.krpano = new Pano();

//或者通过script引入
<script src="path/pano.min.js" />
...
var krpano = new Pano();   //实例化
```

pano.js封装了**version、currentscene**工具函数，**get、gethotspot、getlayer**的GET函数集合，**set、sethotspot、setlayer**的SET函数集合，**tweenhotspot、tweenlayer**的TWEEN动画函数集合，**addlayer、addhotspot**的创建函数集合，**removelayer、removehotspot**的移除函数集合。    

### API说明       

- **version**：返回krpano版本信息         

  ```js
  krpano.version(); //pre-10
  ```

- **currentscene(str)**：获取当前场景参数，str：参数名称    

  ```js
  currentscene('name')  //scene_scene1  返回当前场景名称  
  ```

- **get(str)**：获取单一参数值。如全局变量，或者某个元素的具体参数 ，str：参数名称，如view.fov，或hotspotp[spot1].ath    

  ```js
  krpano.get('view.fov')  //120  
  ```

- **gethotspot(obj,[type])  **: 获取热点hotspot属性，obj为json对象格式,type为可选参数，表示数据返回类型，object为返回json对象，array为返回数组，默认返回json对象，obj格式如下：        

  ```js
  var obj={
      name:'spot1',  //string类型
      list:['scale','url']
  }
  //demo
  krpano.gethotspot(obj)  // {scale:0.5,url:'skin/xxx.png'}
  krpano.gethotspot(obj,'array')  //[0.5,'skin/xxx.png']
  ```

- **getlayer(obj,[type])**：获取layer参数。参数同gethotspot(obj,[type])    

  ```js
  var obj={
      name:'laeyr1',  //string类型
      list:['type','bgcolor']
  }
  //demo
  krpano.getlayer(obj)  // {type:'container',bgcolor:'0x000000'}
  krpano.getlayer(obj,'array')  //['container','0x000000']
  ```

- **set(key,value)**：设置全局属性    

  ```js
  krpano.set('view.hlootat',90)  //设置视角为90° 
  ```

- **sethotspot(obj)**：设置热点属性，可以同时为一个热点设置多个属性或者为多个热点设置属性    

  ```js
  var obj1 = {
      name:'spot1',  //string类型，设置一个热点
      list:{scale:0.5,alpha:0.5}
  }
  var obj2 = {
      name:['spot1','spot2'],  //array类型，设置多个热点
      list:{scale:0.5,alpha:0.5}
  }
  krpano.sethotspot(obj1);
  krpano.sethotspot(obj2);
  ```

- **setlayer(obj)**：设置layer属性，参数用法同sethotspot(obj)       

- **tweenhotspot(obj,[time],[tweentype])**：热点动画。可以为一个热点设置动画或者同时为多个热点设置动画 ,time动画时间，可选，默认为0.5s，tweentype动画类型，可选，默认为easeOutInQuad

  ```js
  var obj = {
      name:'spot1',  //name为数组时，设置多个热点，['spot1','spot2']
      varible:{rotate:10,alpha:0.5}，
  }
  krpano.sethotspot(obj,0.5,'easeOutInQuad');
  ```

- **tweenlayer(obj,[time],[tweentype])**：layer动画，用法同tweenhotspot   

- **createhotspot(obj)**：创建热点。   

  ```js
  var obj = {
      name:'spot1',
      list:{style:'style1',ath:12.365,atv:-12.023,distorted:true}
  }
  krpano.createhotspot(obj);
  ```

- **createlayer(obj)**：创建layer。用法同createhotspot     

- **removehotspot(name)**：移除热点    

  ```
  krpano.removehotspot('spot1');
  ```

- **removelayer(name)**：移除layer    

- **loadscene(scenename,[vars],[flags],[blend])**：加载场景    

  ```js
  /**
  scenename:场景名称
  vars:自定义设置变量（ps:一直没发现这个变量有啥用，抄一下官网）
  flags:加载模式，可选，默认为MERGE，选值请参考官网
  blend：融合模式，可选，默认为BLEND(0.5),选值请参考官网
  **/
  krpano.loadscene('scene1');
  ```


