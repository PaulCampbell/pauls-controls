function g(){let t=document.createElement("div");t.className="upload-input-container";let a=document.createElement("div");a.className="upload-preview",a.setAttribute("data-empty","true");let r=document.createElement("img");r.className="upload-preview-image",a.appendChild(r);let i=document.createElement("div");i.className="upload-placeholder",i.textContent="Preview",a.appendChild(i);let p=document.createElement("div");p.className="upload-input-wrapper";let o=document.createElement("input");o.type="file",o.accept="image/*",o.className="upload-input";let l=document.createElement("button");l.type="button",l.className="upload-button",l.textContent="Choose Image",p.appendChild(o),p.appendChild(l),t.appendChild(a),t.appendChild(p);function u(e){if(!e||!e.type.startsWith("image/"))return;let n=new FileReader;n.onload=d=>{r.src=d.target.result,a.setAttribute("data-empty","false"),t.dispatchEvent(new CustomEvent("image-loaded",{detail:{file:e,dataUrl:d.target.result}}))},n.readAsDataURL(e)}o.addEventListener("change",e=>{let n=e.target.files[0];n&&u(n)}),l.addEventListener("click",()=>{o.click()});let s=0;return t.addEventListener("dragenter",e=>{e.preventDefault(),e.stopPropagation(),s++,t.classList.add("drag-over")}),t.addEventListener("dragleave",e=>{e.preventDefault(),e.stopPropagation(),s--,s===0&&t.classList.remove("drag-over")}),t.addEventListener("dragover",e=>{e.preventDefault(),e.stopPropagation()}),t.addEventListener("drop",e=>{e.preventDefault(),e.stopPropagation(),s=0,t.classList.remove("drag-over");let n=e.dataTransfer.files;if(n.length>0){let d=n[0];if(d.type.startsWith("image/")){u(d);let m=new DataTransfer;m.items.add(d),o.files=m.files}}}),{element:t,getFile:()=>o.files[0],clear:()=>{o.value="",r.src="",a.setAttribute("data-empty","true")}}}var c=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){let a=g(),r=document.createElement("style");r.textContent=`
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
    `,this.shadowRoot.appendChild(r),this.shadowRoot.appendChild(a.element),this._component=a,a.element.addEventListener("image-loaded",i=>{this.dispatchEvent(new CustomEvent("image-loaded",{detail:i.detail}))})}getFile(){return this._component?.getFile()}clear(){this._component?.clear()}};customElements.define("upload-input",c);export{c as UploadInput,g as createUploadInput};
