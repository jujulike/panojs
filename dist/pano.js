class Pano {
    //初始化pano
    constructor(pano) {
        if (pano) {
            this.pano = pano;
            return;
        };
        let __pano = document.getElementById("krpanoSWFObject");
        if (__pano) {
            this.pano = __pano;
        } else {
            this.pano = null;
            console.error('undefined krpanoAPI')
        }
    }
    //获取版本信息
    version() {
        return this.pano.get("version");
    }
    currentscene(str) {
        str = `scene[get(xml.scene)].${str}`
        return this.get(str);
    }
    /**
     * get方法
     * @get 获取单个属性或全局属性,如view.fov
     * @gethotspot 获取hotspot属性，obj：传入对象，type[可选]：结果返回类型，可以是JSON对象或数组，默认为JSON对象，obj形如：
     * obj:{
     *      name:'spot1',  //名称，必须
     *      list:['scale','url']  //获取属性列表(array),必须
     * }
     * @getlayer 获取layer属性，参数同gethotspot
     */
    get(str) {
        if (this._getType(str) == 'string') {
            return this.pano.get(str);
        }
    }
    gethotspot(obj, type = 'object') {
        if (!this._rightObject(obj, 'get')) {
            return;
        }
        if (type == 'object') {
            return this._returnObject(obj, 'hotspot');
        };
        if (type == 'array') {
            return this._returnArray(obj, 'hotspot');
        }
    }
    getlayer(obj, type = 'object') {
        if (!this._rightObject(obj, 'get')) {
            return;
        }
        if (type == 'object') {
            return this._returnObject(obj, 'layer');
        };
        if (type == 'array') {
            return this._returnArray(obj, 'layer');
        }
    }
    /**
     * 
     * set 设置全局属性，只能设置一个属性，key：属性名称，value：属性值 
     * sethotspot 设置hotspot属性，可一次设置多个属性，obj：传入的对象参数,形如：
     * obj：｛
     *          name:'spot1',  //名称，必须
     *          list:{scale:1,alpha:0.5}  //设置属性列表(object),必须
     *      ｝ 
     * setlayer 设置layers属性
     */
    set(key, value) {
        if (this._getType(key) == 'string') {
            this.pano.set(key, value);
        }
    }
    sethotspot(obj) {
        this._setAttributes(obj, 'hotspot');
    }
    setlayer(obj) {
        this._setAttributes(obj, 'layer');
    }
    /**
     * tweenhotspot,tweenlayer 动画
     * obj = {
     *    name:'spot1'/['spot1'.'spot2'],  //元素名称，可选string类型或数组，当对多个元素操作动画时，可选择数组类型，【必须】
     *    varible:{alpha:0.5,rotate:100}   //tween动画变量，键值形式，【必须】
     *  }
     * time：动画完成时间,以秒为单位，默认0.5s，可选；
     * tweentype:动画类型，可选，默认default；
     * 
     */
    tweenhotspot(obj = { time: 0.5, tweentype: 'easeOutInQuad',callback:null }) {
        this._tweenAnimation(obj, 'hotspot');
    }
    tweenlayer(obj = { time: 0.5, tweentype: 'easeOutInQuad',callback:null}) {
        this._tweenAnimation(obj, 'layer');
    }
    /**
     * 创建hotspot/layer
     * obj:{
     *     name:'spot1',
     *     list:[scale:0.5,style:'style1',alpha:0.5]
     *  }
     */
    createhotspot(obj) {
        this.pano.call("addhotspot(" + obj.name + ")");
        this.sethotspot(obj);
    }
    createlayer(obj) {
        this.pano.call("addlayer(" + obj.name + ")");
        this.setlayer(obj);
    }
    removehotspot(name) {
        this.pano.call("removehotspot(" + name + ")")
    }
    removelayer(name) {
        this.pano.call("removelayer(" + name + ")");
    }
    //loadscene 加载场景
    loadscene(scenename, vars = null, flags = 'MERGE', blend = 'BLEND(0.5)') {
        this.pano.call("loadscene(" + scenename + "," + vars + "," + flags + "," + blend + ")")
    }

    /**
     * 属性私有函数集
     */
    //以对象格式返回热点属性
    _returnObject(obj, type) {
        let _obj = {};
        obj.list.map(element => {
            let value = `${type}[${obj.name}].${element}`;
            _obj[element] = this.pano.get(value);
        });
        return _obj;
    }
    //以数组格式返回热点属性
    _returnArray(obj, type) {
        return obj.list.map(element => {
            let value = `${type}[${obj.name}].${element}`;
            return this.pano.get(value);
        });
    }
    //设置属性，一次设置多个属性
    _setAttributes(obj, type) {
        let list = obj.list;
        if (this._getType(obj.name) == 'string') {
            for (let key in list) {
                if (key == 'style') {
                    let loadstyle = `${type}[${obj.name}].loadstyle(${list[key]})`;
                    this.pano.call(loadstyle);
                } else {
                    let attr = `${type}[${obj.name}].${key}`;
                    this.pano.set(attr, list[key]);
                }

            }
        }
        else if(this._getType(obj.name) == 'array'){
            for(let key in list){
                obj.name.map(element=>{
                    if(key == 'style'){
                        let loadstyle = `${type}[${element}].loadstyle(${list[key]})`;
                        this.pano.call(loadstyle);
                    }
                    else{
                        let attr = `${type}[${element}].${key}`;
                        this.pano.set(attr, list[key]); 
                    }
                });
            }
        }
    }
    //私有函数，动画
    _tweenAnimation(obj,type){
        let varible = obj.varible;

        if(this._getType(obj.name) == 'string'){
            let keyarry = Object.keys(varible),
                valuearray = keyarry.map(element=>varible[element]),
                value = valuearray.join('|');

                keyarry = keyarry.map(element=>`${type}[${obj.name}].${element}`);
                let attr = keyarry.join('|');

            this.pano.call("tween(" + attr + "," + value + "," + obj.time + "," + obj.tweentype + ","+obj.callback()+")");
        }
        else if(this._getType(obj.name) == 'array'){
            for (let key in varible) {
                obj.name.map(element => {
                    let attr = `${type}[${element}].${key}`;
                    let value = varible[key];
                    this.pano.call("tween(" + attr + "," + value + "," + obj.time + "," + obj.tweentype + ")");
                });
            }
            if(obj.callback) setTimeout(obj.callback(),obj.time);
            
        }
    }
    /**
     * 工具私有函数集
     */
    //私有函数，判断参数类型
    _getType(v) {
        return v === undefined ? 'undefined' : v === null ? 'null' : v.constructor.name.toLowerCase()
    }
    //私有函数，用于检测obj参数
    _rightObject(obj, type) {
        if (this._getType(obj) !== 'object') {
            console.error('unknown type');
            return false;
        };
        if (this._getType(obj.name) !== 'string') {
            console.error('obj.name must be string type');
            return false;
        }
        if (type == 'get') {
            if (this._getType(obj.list) !== 'array') {
                console.error('get: the obj.list must be array type');
                return false;
            };
        } else if (type == 'set') {
            if (this._getType(obj.list) !== 'object') {
                console.error('set: the obj.list must be object type');
                return false;
            };
        }
        return true;
    }
}

export default Pano;