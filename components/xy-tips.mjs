export default class XyTips extends HTMLElement {

    static get observedAttributes() { return ['color'] }

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
        <style>
        :host {
            display:inline-block;
            position: relative;
            overflow: visible;
        }
        
        :host::before,
        :host::after {
            display: block;
            position: absolute;
            z-index: 1;
            left: calc( var(--percent,.5) * 100% );
            bottom: 100%;
            transform: translate(-50%, -20px);
            opacity: 0;
            transition: transfrom .15s .15s,opacity .15s .15s;
            color: var(--color,rgba(0,0,0,0.75));
            visibility: hidden;
            pointer-events: none;
        }
        
        :host([tips]:not([tips='']))::before {
            content: attr(tips);
            border-radius: 3px;
            padding: 6px 10px;
            line-height: 18px;
            text-align: left;
            background-color: var(--color,rgba(0,0,0,0.75));
            color: #fff;
            font-size: 12px;
            font-style: normal;
            width: max-content;
            max-width: 200px;
        }
        
        :host([tips]:not([tips='']))::after {
            content: '';
        }
        :host::after {
            width: 0;
            height: 0;
            margin-bottom: -12px;
            overflow: hidden;
            border: 6px solid transparent;
            border-top-color: currentColor;
        }
        
        :host(:hover)::before,
        :host([show])::before,
        :host(:focus-within)::before,
        :host(:hover)::after,
        :host([show])::after,
        :host(:focus-within)::after {
            visibility: visible;
            transform: translate(-50%, -10px);
            opacity: 1;
        }
        
        /* right */
        :host([dir="right"])::before,
        :host([dir="right"])::after{
            left: 100%;
            top: 50%;
            bottom: auto;
            transform: translate(20px, -50%);
        }
        :host([dir="right"]):after {
            margin: 0;
            margin-left: -12px;
            border-color: transparent;
            border-right-color: currentColor;
        }
        :host([dir="right"]:hover)::before,
        :host([dir="right"]:focus-within)::before,
        :host([dir="right"]:hover)::after,
        :host([dir="right"]:focus-within)::after {
            visibility: visible;
            transform: translate(10px, -50%);
            opacity: 1;
        }
        
        /* bottom */
        :host([dir="down"])::before,
        :host([dir="down"])::after{
            left: 50%;
            top: 100%;
            bottom: auto;
            transform: translate(-50%, 20px);
        }
        :host([dir="down"])::after {
            margin: 0;
            margin-top: -12px;
            border-color: transparent;
            border-bottom-color: currentColor;
        }
        :host([dir="down"]:hover)::before,
        :host([dir="down"]:focus-within)::before,
        :host([dir="down"]:hover)::after,
        :host([dir="down"]:focus-within)::after {
            visibility: visible;
            transform: translate(-50%, 10px);
            opacity: 1;
        }
        
        /* left */
        :host([dir="left"])::before,
        :host([dir="left"])::after{
            left: auto;
            right: 100%;
            top: 50%;
            bottom: auto;
            transform: translate(-20px, -50%);
        }
        :host([dir="left"])::after{
            margin: 0;
            margin-right: -12px;
            border-color: transparent;
            border-left-color: currentColor;
        }
        :host([dir="left"]:hover)::before,
        :host([dir="left"]:focus-within)::before,
        :host([dir="left"]:hover)::after,
        :host([dir="left"]:focus-within)::after {
            visibility: visible;
            transform: translate(-10px, -50%);
            opacity: 1;
        }
        
        /* success */
        :host([type="success"]){
            --color:#52c41a;
        }
        /* error */
        :host([type="error"]){
            --color:#f5222d;
        }
        /* warn */
        :host([type="warn"]){
            --color:#faad14;
        }
        </style>
        <slot></slot>
        `
    }

    get color() {
        return this.getAttribute('color')||'';
    }

    get dir() {
        return this.getAttribute('dir')||'auto';
    }

    get tips() {
        return this.getAttribute('tips');
    }

    get show() {
        return this.getAttribute('show')!==null;
    }

    set color(value) {
        this.setAttribute('color', value);
    }

    set dir(value) {
        this.setAttribute('dir', value);
    }

    set tips(value) {
        this.setAttribute('tips', value);
    }

    set show(value) {
        if(value===null||value===false){
            this.removeAttribute('show');
        }else{
            this.setAttribute('show', '');
        }
    }
    
    connectedCallback() {
        if( this.dir === 'auto' ){
            const { left,top,width,height } = this.getBoundingClientRect();
            const w = document.body.scrollWidth;
            const h = document.body.scrollHeight;
            const TIP_SIZE = 50;
            if( top < TIP_SIZE ){
                this.dir = 'down';
            }
            if( h-top-height < TIP_SIZE ){
                this.dir = 'up';
            }
            if( left < TIP_SIZE ){
                this.dir = 'right';
            }
            if( w-left-width < TIP_SIZE ){
                this.dir = 'left';
            }
        }
    }

    attributeChangedCallback (name, oldValue, newValue) {
        if( name == 'color' && this.shadowRoot){
            this.style.setProperty('--color',newValue);
        }
    }
}

if(!customElements.get('xy-tips')){
    customElements.define('xy-tips', XyTips);
}
