export default class XySwitch extends HTMLElement {

    static get observedAttributes() { return ['disabled','checked'] }

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
        <style>
        :host{ 
            display:inline-block; 
            -webkit-tap-highlight-color: transparent;
        }
        :host([disabled]){ 
            pointer-events: none; 
            opacity:.6; 
        }
        :host([disabled]) label{ 
            pointer-events: all;  
            cursor: not-allowed; 
        }
        #switch{
            position:absolute;
            clip:rect(0,0,0,0);
        }
        :host(:focus-within) label::after,:host(:active) ::after{ 
            background:var(--themeColor,dodgerblue);
        }
        :host(:focus-within) label{ 
            box-shadow: 0 0 10px rgba(0,0,0,0.1); 
        }
        label{
            box-sizing:border-box;
            cursor:pointer;
            display:flex;
            width:44px;
            height:22px;
            padding:2px;
            border-radius:22px;
            background:#ddd;
            transition:.3s;
        }
        label::before{
            content:'';
            flex:0;
            transition:.2s cubic-bezier(.12, .4, .29, 1.46);
        }
        label::after{
            content:'';
            width:6px;
            height:6px;
            border-radius:20px;
            border:6px solid #fff;
            background:#fff;
            transition:.3s;
            box-shadow: 0 2px 4px 0 rgba(0,35,11,0.2);
        }
        label:active::after{
            padding:0 5px;
        }
        #switch:checked+label{
            background:var(--themeColor,dodgerblue);
        }
        #switch:checked+label::before{
            flex:1;
        }
        </style>
        <input type="checkbox" id="switch"><label for="switch"></label>
        `
    }

    get disabled() {
        return this.getAttribute('disabled')!==null;
    }

    get checked() {
        return this.getAttribute('checked')!==null;
    }

    get name() {
        return this.getAttribute('name');
    }

    set disabled(value) {
        if(value===null||value===false){
            this.removeAttribute('disabled');
        }else{
            this.setAttribute('disabled', '');
        }
    }

    set checked(value) {
        if(value===null||value===false){
            this.removeAttribute('checked');
        }else{
            this.setAttribute('checked', '');
        }
    }
    
    connectedCallback() {
        this.switch = this.shadowRoot.getElementById('switch');
        this.disabled = this.disabled;
        this.checked = this.checked;
        this.switch.addEventListener('change',(ev)=>{
            this.checked = ev.target.checked;
        })
        this.switch.addEventListener('keydown', (ev) => {
            switch (ev.keyCode) {
                case 13://Enter
                    this.checked = !this.checked;
                    break;
                default:
                    break;
            }
        })
    }

    attributeChangedCallback (name, oldValue, newValue) {
        if( name == 'disabled' && this.switch){
            if(newValue!==null){
                this.switch.setAttribute('disabled', 'disabled');
            }else{
                this.switch.removeAttribute('disabled');
            }
        }
        if( name == 'checked' && this.switch){
            if(newValue!==null){
                this.switch.checked = true;
            }else{
                this.switch.checked = false;
            }
            if (oldValue !== newValue) {
                this.dispatchEvent(new CustomEvent('change', {
                    detail: {
                        checked: this.checked
                    }
                }));
            }
        }
    }
}

if(!customElements.get('xy-switch')){
    customElements.define('xy-switch', XySwitch);
}
