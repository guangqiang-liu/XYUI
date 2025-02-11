import './xy-button.mjs';

class XyDialog extends HTMLElement {

    static get observedAttributes() { return ['open','header','oktext','canceltext','loading','type'] }

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
        <style>
        :host{
            position:fixed;
            display:flex;
            left:0;
            top:0;
            right:0;
            bottom:0;
            z-index:-1;
            background:rgba(0,0,0,.3);
            visibility:hidden;
            opacity:0;
            transition:.3s;
            z-index:10;
        }
        :host([open]){
            opacity:1;
            visibility:visible;
        }
        .dialog {
            display:flex;
            position:relative;
            min-width: 400px;
            margin:auto;
            box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12);
            box-sizing: border-box;
            max-width: calc(100vw - 20px);
            max-height: calc(100vh - 20px);
            border-radius: 3px;
            background-color: #fff;
            transform:scale(0);
            transition:.3s transform cubic-bezier(.645, .045, .355, 1);
        }
        .dialog-contnet{
            display:flex;
            padding:0 20px;
            flex:1;
            flex-direction:column;
        }
        :host([open]) .dialog{
            transform:scale(1);
        }
        .dialog-header {
            line-height: 30px;
            padding: 15px 30px 0 0;
            font-weight: 700;
            font-size: 14px;
            color: #4c5161;
            user-select: none;
            cursor: default;
        }
        .dialog-body {
            flex: 1;
            overflow: auto;
            min-height: 50px;
            padding: 10px 0;
        }
        .dialog-footer {
            padding: 3px 0 20px 0;
            margin-top: -3px;
            text-align: right;
        }
        .btn-close{
            position:absolute;
            right:10px;
            top:10px;
        }
        .dialog-footer xy-button {
            margin-left:10px;
        }
        .dialog-type{
            display:flex;
            margin: 15px -10px 0 20px;
            width:30px;
            height:30px;
            font-size:24px;
        }
        :host(:not([type])) .dialog-type{
            display:none;
        }
        </style>
        <div class="dialog">
            <xy-icon id="dialog-type" class="dialog-type"></xy-icon>
            <div class="dialog-contnet">
                <div class="dialog-header" id="header">${this.header}</div>
                <xy-button class="btn-close" id="btn-close" type="flat" icon="close"></xy-button>
                <div class="dialog-body">
                    <slot></slot>
                </div>
                <div class="dialog-footer">
                    <xy-button id="btn-cancel">${this.canceltext}</xy-button>
                    <xy-button id="btn-submit" type="primary">${this.oktext}</xy-button>
                </div>
            </div>
        </div>
        `
    }

    get open() {
        return this.getAttribute('open')!==null;
    }

    get header() {
        return this.getAttribute('header')||'dialog';
    }

    get type() {
        return this.getAttribute('type');
    }

    get oktext() {
        return this.getAttribute('oktext')||'ok';
    }

    get canceltext() {
        return this.getAttribute('canceltext')||'cancel';
    }

    get loading() {
        return this.getAttribute('loading')!==null;
    }

    set color(value) {
        this.setAttribute('color', value);
    }

    set header(value) {
        this.setAttribute('header', value);
    }

    set type(value) {
        this.setAttribute('type', value);
    }

    set oktext(value) {
        this.setAttribute('oktext', value);
    }

    set canceltext(value) {
        this.setAttribute('canceltext', value);
    }

    set open(value) {
        if(value===null||value===false){
            this.removeAttribute('open');
        }else{
            this.setAttribute('open', '');
            this.loading && (this.loading = false);
        }
    }

    set loading(value) {
        if(value===null||value===false){
            this.removeAttribute('loading');
        }else{
            this.setAttribute('loading', '');
        }
    }

    typeMap(type) {
        let name = '';
        let color = '';
        switch (type) {
            case 'info':
                name = 'info-circle';
                color = '#1890ff';
                break;
            case 'success':
                name = 'check-circle';
                color = '#52c41a';
                break;
            case 'error':
                name = 'close-circle';
                color = '#f5222d';
                break;
            case 'warning':
                name = 'warning-circle';
                color = '#faad14';
                break;
            case 'confirm':
                name = 'question-circle';
                color = '#faad14';
                break;
            default:
                break;
        }
        return {
            name:name,
            color:color
        }
    }
    
    connectedCallback() {
        this.remove = false;
        this.headers = this.shadowRoot.getElementById('header');
        this.btnClose = this.shadowRoot.getElementById('btn-close');
        this.btnCancel = this.shadowRoot.getElementById('btn-cancel');
        this.btnSubmit = this.shadowRoot.getElementById('btn-submit');
        this.dialogType = this.shadowRoot.getElementById('dialog-type');
        this.width = document.documentElement.clientWidth;
        this.shadowRoot.addEventListener('transitionend',(ev)=>{
            if(ev.propertyName === 'transform' && this.open){
                this.btnSubmit.focus();
            }
        })
        this.shadowRoot.addEventListener('transitionend',(ev)=>{
            if(ev.propertyName === 'transform' && !this.open){
                if( this.remove ){
                    document.body.removeChild(this);
                }
                this.dispatchEvent(new CustomEvent('close'));
            }
        })
        this.btnClose.addEventListener('click',()=>{
            this.open = false;
        })
        this.btnCancel.addEventListener('click',async ()=>{
            this.dispatchEvent(new CustomEvent('cancel'));
            this.open = false;
        })
        this.btnSubmit.addEventListener('click',()=>{
            this.dispatchEvent(new CustomEvent('submit'));
            if(!this.loading){
                this.open = false;
            }
        })
        window.addEventListener('resize',()=>{
            this.width = document.documentElement.clientWidth;
        })
    }

    attributeChangedCallback (name, oldValue, newValue) {
        if( name == 'open' && this.shadowRoot){
            if(newValue!==null){
                this.btnActive = document.activeElement;
                document.body.style.overflow = 'hidden';
                document.body.style.paddingRight = (document.documentElement.clientWidth - this.width)+'px';
            }else{
                this.btnActive.focus();
                document.body.style.overflow = 'auto';
                document.body.style.paddingRight = '0px';
            }
        }
        if( name == 'loading' && this.shadowRoot){
            if(newValue!==null){
                this.btnSubmit.loading = true;
            }else{
                this.btnSubmit.loading = false;
            }
        }
        if( name == 'header' && this.headers){
            if(newValue!==null){
                this.headers.innerHTML = newValue;
            }
        }
        if( name == 'oktext' && this.btnSubmit){
            if(newValue!==null){
                this.btnSubmit.innerHTML = newValue;
            }
        }
        if( name == 'canceltext' && this.btnCancel){
            if(newValue!==null){
                this.btnCancel.innerHTML = newValue;
            }
        }
        if( name == 'type' && this.dialogType){
            if(newValue!==null){
                this.dialogType.name = this.typeMap(newValue).name;
                this.dialogType.color = this.typeMap(newValue).color;
            }
        }
    }
}

if(!customElements.get('xy-dialog')){
    customElements.define('xy-dialog', XyDialog);
}

export default {

    alert: function() {
        const dialog = new XyDialog();
        document.body.appendChild(dialog);
        dialog.btnCancel.parentNode.removeChild(dialog.btnCancel);
        dialog.remove = true;
        if( typeof arguments[0] === 'object' ){
            const { header, oktext, content, ok} = arguments[0];
            dialog.header = header||'Alert';
            dialog.oktext = oktext||'确 定';
            dialog.onsubmit = ok||null;
            dialog.innerText = content||'';
        }else{
            dialog.header = 'Alert';
            dialog.oktext = '确 定';
            dialog.innerText = arguments[0]||'';
        }
        dialog.open = true;
        return dialog;
    },

    info: function() {
        const dialog = new XyDialog();
        document.body.appendChild(dialog);
        dialog.btnCancel.parentNode.removeChild(dialog.btnCancel);
        dialog.type = 'info';
        dialog.remove = true;
        if( typeof arguments[0] === 'object' ){
            const { header, oktext, content, ok} = arguments[0];
            dialog.header = header||'Info';
            dialog.oktext = oktext||'知道了';
            dialog.onsubmit = ok||null;
            dialog.innerText = content||'';
        }else{
            dialog.header = 'Info';
            dialog.oktext = '知道了';
            dialog.innerText = arguments[0]||'';
        }
        dialog.open = true;
        return dialog;
    },

    success: function() {
        const dialog = new XyDialog();
        document.body.appendChild(dialog);
        dialog.btnCancel.parentNode.removeChild(dialog.btnCancel);
        dialog.type = 'success';
        dialog.remove = true;
        if( typeof arguments[0] === 'object' ){
            const { header, oktext, content, ok} = arguments[0];
            dialog.header = header||'Success';
            dialog.oktext = oktext||'知道了';
            dialog.onsubmit = ok||null;
            dialog.innerText = content||'';
        }else{
            dialog.header = 'Success';
            dialog.oktext = '知道了';
            dialog.innerText = arguments[0]||'';
        }
        dialog.open = true;
        return dialog;
    },

    error: function() {
        const dialog = new XyDialog();
        document.body.appendChild(dialog);
        dialog.btnCancel.parentNode.removeChild(dialog.btnCancel);
        dialog.type = 'error';
        dialog.remove = true;
        if( typeof arguments[0] === 'object' ){
            const { header, oktext, content, ok} = arguments[0];
            dialog.header = header||'Error';
            dialog.oktext = oktext||'知道了';
            dialog.onsubmit = ok||null;
            dialog.innerText = content||'';
        }else{
            dialog.header = 'Error';
            dialog.oktext = '知道了';
            dialog.innerText = arguments[0]||'';
        }
        dialog.open = true;
        return dialog;
    },

    warning: function() {
        const dialog = new XyDialog();
        document.body.appendChild(dialog);
        dialog.btnCancel.parentNode.removeChild(dialog.btnCancel);
        dialog.type = 'warning';
        dialog.remove = true;
        if( typeof arguments[0] === 'object' ){
            const { header, oktext, content, ok} = arguments[0];
            dialog.header = header||'Warning';
            dialog.oktext = oktext||'知道了';
            dialog.onsubmit = ok||null;
            dialog.innerText = content||'';
        }else{
            dialog.header = 'Warning';
            dialog.oktext = '知道了';
            dialog.innerText = arguments[0]||'';
        }
        dialog.open = true;
        return dialog;
    },

    confirm: function(text,ok,cancel) {
        //const dialog = document.createElement('xy-dialog');
        const dialog = new XyDialog();
        document.body.appendChild(dialog);
        dialog.remove = true;
        if( typeof arguments[0] === 'object' ){
            const { type, header, content, oktext, canceltext, ok, cancel} = arguments[0];
            dialog.type = type||'confirm';
            dialog.header = header||'Confirm';
            dialog.oktext = oktext||'确 定';
            dialog.canceltext = canceltext||'取 消';
            dialog.innerText = content||'';
            dialog.onsubmit = ok||null;
            dialog.oncancel = oncancel||null;
        }else{
            dialog.type = 'confirm';
            dialog.header = 'Confirm';
            dialog.oktext = '确 定';
            dialog.canceltext = '取 消';
            dialog.innerText = arguments[0]||'';
            dialog.onsubmit = arguments[1]||null;
            dialog.oncancel = arguments[2]||null;
        }
        dialog.open = true;
        return dialog;
    }
}