import './xy-tips.mjs';

export default class XySlider extends HTMLElement {

    static get observedAttributes() { return ['value','min','max','step','disabled','showtips'] }

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
        <style>
        :host{ box-sizing:border-box; display:flex; padding:0 5px;}
        :host([disabled]){ opacity:.8; --themeColor:#999; cursor:not-allowed; }
        :host([disabled]) input[type="range"]{ pointer-events:none; }
        #slider-con{ display:flex; padding:5px 0; width:100%; }
        ::-moz-focus-inner,::-moz-focus-outer{border:0;outline : 0;}
        :host([showtips]){
            pointer-events:all;
        }
        input[type="range"]{
            pointer-events:all;
            margin:0 -5px;
            width:calc( 100% + 10px );
            -webkit-appearance: none;
            outline : 0;
            background: rgba(0,0,0,.1);
            height: 2px;
            border-radius:2px;
        }
        input[type="range"]::-webkit-slider-runnable-track{
            display: flex;
            align-items: center;
            position: relative;
            height: 2px;
            border-radius:2px;
            background:linear-gradient(to right, var(--themeColor,dodgerblue) calc(100% * var(--percent)), transparent 0% )
        }
        input[type="range"]::-moz-range-progress {
            display: flex;
            align-items: center;
            position: relative;
            height: 2px;
            border-radius:2px;
            outline : 0;
            background:var(--themeColor,dodgerblue)
        }
        input[type="range"]::-webkit-slider-thumb{
            -webkit-appearance: none;
            border:2px solid var(--themeColor,dodgerblue);
            position: relative;
            width:10px;
            height:10px;
            border-radius: 50%;
            background:var(--themeColor,dodgerblue);
            transition:.2s cubic-bezier(.12, .4, .29, 1.46);
        }
        input[type="range"]::-moz-range-thumb{
            box-sizing:border-box;
            pointer-events:none;
            border:2px solid var(--themeColor,dodgerblue);
            position: relative;
            width:10px;
            height:10px;
            border-radius: 50%;
            background:var(--themeColor,dodgerblue);
            transition:.2s cubic-bezier(.12, .4, .29, 1.46);
        }
        input[type="range"]::-webkit-slider-thumb:active,
        input[type="range"]:focus::-webkit-slider-thumb{
            transform:scale(1.2);
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            background: #fff;
        }
        input[type="range"]::-moz-range-thumb:active,
        input[type="range"]:focus::-moz-range-thumb{
            transform:scale(1.2);
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            background: #fff;
        }
        </style>
        <xy-tips id='slider-con' dir="top" style="--percent:${(this.value-this.min)/(this.max-this.min)}" tips="${this.showtips&&!this.disabled?this.value:''}"><input id='slider' value=${this.value} min=${this.min} max=${this.max} step=${this.step} ${this.disabled?"disabled":""} type='range'></xy-tips>
        `
    } 
    
    connectedCallback() {
        const _this = this;
        this.slider = this.shadowRoot.getElementById('slider');
        this.sliderCon = this.shadowRoot.getElementById('slider-con');
        this.slider.addEventListener('input',function(ev){
            _this.value = this.value;
            _this._oninput = true;
        })
        this.slider.addEventListener('change',function(ev){
            _this.value = this.value;
            _this._oninput = false;
            _this.dispatchEvent(new CustomEvent('change',{
                detail:{
                    value:this.value
                }
            }));
        })
    }

    get value() {
        return this.getAttribute('value')||0;
    }

    get min() {
        return this.getAttribute('min')||0;
    }

    get max() {
        return this.getAttribute('max')||100;
    }

    get disabled() {
        return this.getAttribute('disabled')!==null;
    }

    get showtips() {
        return this.getAttribute('showtips')!==null;
    }

    set disabled(value) {
        if(value===null||value===false){
            this.removeAttribute('disabled');
        }else{
            this.setAttribute('disabled', '');
        }
    }

    set showtips(value) {
        if(value===null||value===false){
            this.removeAttribute('showtips');
        }else{
            this.setAttribute('showtips', '');
        }
    }

    get step() {
        return this.getAttribute('step')||1;
    }

    set value(value) {
        this.setAttribute('value', value);
    }

    set min(value) {
        this.setAttribute('min', value);
    }

    set max(value) {
        this.setAttribute('max', value);
    }

    set step(value) {
        this.setAttribute('step', value);
    }

    attributeChangedCallback (name, oldValue, newValue) {
        if(this.sliderCon){
            this.sliderCon.style.setProperty('--percent',(this.value-this.min)/(this.max-this.min));
            if( this.showtips&&!this.disabled){
                this.sliderCon.tips = newValue;
            }else{
                this.sliderCon.tips = '';
            }
        }
        if( this.slider && oldValue!==newValue && !this._oninput){
            if(name == 'disabled'){
                if(newValue!==null){
                    this.slider.setAttribute('disabled', 'disabled');
                }else{
                    this.slider.removeAttribute('disabled');
                }
            }else{
                this.slider[name] = newValue;
                this[name] = newValue;
            }
            this.dispatchEvent(new CustomEvent('change',{
                detail:{
                    value:this.value
                }
            }));
        }
    }
    
}

if(!customElements.get('xy-slider')){
    customElements.define('xy-slider', XySlider);
}