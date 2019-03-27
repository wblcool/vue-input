Vue.component("input-number", {
    template: `
    <div class='input-number'>
    <input 
        type='text' 
        :value='currentValue' 
        @keyup='keyboardHandle'
        @change='handleChange'> 
    <button 
        @click='handleDown' 
        :disabled='currentValue <= min'>-</button> 
    <button 
        @click='handleUp'
        :disabled='currentValue >= max'>+</button>    
    </div>`,
    props: {
        max: {
            type: Number,
            default: Infinity
        },
        min: {
            type: Number,
            default: -Infinity
        },
        value: {
            type: Number,
            default: 0
        }
    },
    data: function(){
        console.log("执行1");
        return {
            currentValue: this.value
        }
    },
    watch: {
        currentValue: function(val){
            this.$emit("input", val);//用来改变父级value的值，同步变化，外部也可使用这个值了
            this.$emit("on-change", val);//其他可能会使用的地方
        },
        value: function(val){
            this.updateValue(val);//在父级改变值的时候也需要进行验证
        }
    },
    methods: {
        updateValue: function(val){//验证最大最小范围内
           
            if(val > this.max) val = this.max;
            if(val < this.min) val = this.min;
            this.currentValue = val;
        },
        handleDown: function(){//减少
            if(this.currentValue <= this.min) return;
            this.currentValue -= 1;
        },
        handleUp: function(){//增加
            if(this.currentValue >= this.max) return;
            this.currentValue += 1;
        },
        handleChange: function(event){//change事件，也可以改成input，此时不在有效范围内的值都不可输入

            var val = event.target.value.trim();
            var max = this.max;
            var min = this.min;

            if(isValueNumber(val)){
              
                val = Number(val);
               
                this.currentValue = val;
                
                if(val > max){
                    this.currentValue = max;
                }else if(val < min){
                    this.currentValue = min;
                }
            }else{
                event.target.value = this.currentValue;//不在范围内使用当前值
            }
        },
        keyboardHandle: function(event){
            console.log("event", event);
            //up
            if(event.keyCode == 38){
                this.handleUp();
            }else if(event.keyCode == 40){
                this.handleDown();
            }
            
        }
    },
    mounted: function(){//挂载时检查初始化的值,也可以把这步放在data中
        console.log("执行2");
        this.updateValue(this.value);
    }
});

function isValueNumber(value){
    return (/(^-?[0-9]+\.{1}\d+$)|(^-?[1-9]*$)|(^-?0{1}$)/).test(value + "");//正负数包括小数或者正负0，或者正负整数
}

