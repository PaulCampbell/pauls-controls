var f=(a,o)=>{if(!(!a||!o)&&Object.prototype.hasOwnProperty.call(a,o)){let t=a[o];delete a[o],a[o]=t}};function C({placeholder:a="",buttonText:o="Choose Image"}={}){let t=document.createElement("div");t.className="upload-input-container";let d=a??"",m=o??"Choose Image",n=document.createElement("div");n.className="upload-preview",n.setAttribute("data-empty","true");let p=document.createElement("img");p.className="upload-preview-image",n.appendChild(p);let g=document.createElement("div");g.className="upload-placeholder",g.textContent="Preview",n.appendChild(g);let c=document.createElement("div");c.className="upload-input-wrapper";let r=document.createElement("input");r.type="file",r.accept="image/*",r.className="upload-input";let i=document.createElement("button");i.type="button",i.className="upload-button",i.textContent=m,c.appendChild(r),c.appendChild(i),t.appendChild(n),t.appendChild(c);function v(e){if(!e||!e.type.startsWith("image/"))return;let l=new FileReader;l.onload=s=>{p.src=s.target.result,n.setAttribute("data-empty","false"),t.dispatchEvent(new CustomEvent("image-loaded",{detail:{file:e,dataUrl:s.target.result}}))},l.readAsDataURL(e)}function u(){if(!(r.files&&r.files.length>0)){if(d){p.src=d,n.setAttribute("data-empty","false");return}p.src="",n.setAttribute("data-empty","true")}}r.addEventListener("change",e=>{let l=e.target.files[0];if(l){v(l);return}u()}),i.addEventListener("click",()=>{r.click()});let h=0;return t.addEventListener("dragenter",e=>{e.preventDefault(),e.stopPropagation(),h++,t.classList.add("drag-over")}),t.addEventListener("dragleave",e=>{e.preventDefault(),e.stopPropagation(),h--,h===0&&t.classList.remove("drag-over")}),t.addEventListener("dragover",e=>{e.preventDefault(),e.stopPropagation()}),t.addEventListener("drop",e=>{e.preventDefault(),e.stopPropagation(),h=0,t.classList.remove("drag-over");let l=e.dataTransfer.files;if(l.length>0){let s=l[0];if(s.type.startsWith("image/")){v(s);let x=new DataTransfer;x.items.add(s),r.files=x.files}}}),u(),{element:t,getFile:()=>r.files[0],setPlaceholder:e=>{d=e??"",u()},setButtonText:e=>{m=e??"Choose Image",i.textContent=m},clear:()=>{r.value="",u()}}}var b=class extends HTMLElement{static get observedAttributes(){return["placeholder"]}constructor(){super(),this.attachShadow({mode:"open"}),this._placeholder="",this._buttonText="Choose Image",this._component=null}attributeChangedCallback(o,t,d){o==="placeholder"&&(this.placeholder=d??"")}connectedCallback(){f(this,"placeholder"),f(this,"buttonText");let o=C({placeholder:this.placeholder,buttonText:this.buttonText}),t=document.createElement("style");t.textContent=`
      .upload-input-container {
        display: flex;
        gap: 1rem;
        align-items: center;
        padding: 1rem;
        border: 2px dashed #ccc;
        border-radius: 8px;
        transition: border-color 0.3s;
      }
      
      .upload-input-container.drag-over {
        border-color: #4CAF50;
        background-color: #f0f8f0;
      }
      
      .upload-preview {
        position: relative;
        width: 150px;
        height: 150px;
        border: 1px solid #ddd;
        border-radius: 4px;
        overflow: hidden;
        background-color: #f5f5f5;
        flex-shrink: 0;
      }
      
      .upload-preview-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: none;
      }
      
      .upload-preview[data-empty="false"] .upload-preview-image {
        display: block;
      }
      
      .upload-placeholder {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #999;
        font-size: 14px;
        pointer-events: none;
      }
      
      .upload-preview[data-empty="false"] .upload-placeholder {
        display: none;
      }
      
      .upload-input-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .upload-input {
        display: none;
      }
      
      .upload-button {
        padding: 0.75rem 1.5rem;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.3s;
      }
      
      .upload-button:hover {
        background-color: #45a049;
      }
      
      .upload-button:active {
        background-color: #3d8b40;
      }
    `,this.shadowRoot.appendChild(t),this.shadowRoot.appendChild(o.element),this._component=o,o.element.addEventListener("image-loaded",d=>{this.dispatchEvent(new CustomEvent("image-loaded",{detail:d.detail}))})}get placeholder(){return this._placeholder||""}set placeholder(o){this._placeholder=o??"",this._component?.setPlaceholder?.(this._placeholder)}get buttonText(){return this._buttonText||"Choose Image"}set buttonText(o){this._buttonText=o??"Choose Image",this._component?.setButtonText?.(this._buttonText)}getFile(){return this._component?.getFile()}clear(){this._component?.clear()}};customElements.define("upload-input",b);export{b as UploadInput,C as createUploadInput};
