var _=Object.defineProperty;var g=(i,e,t)=>e in i?_(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var h=(i,e,t)=>g(i,typeof e!="symbol"?e+"":e,t);var l=(i,e)=>{if(!(!i||!e)&&Object.prototype.hasOwnProperty.call(i,e)){let t=i[e];delete i[e],i[e]=t}},a=(i,e,t,s={bubbles:!0,composed:!0})=>{if(!i||!e)return!1;let n={detail:t,bubbles:s?.bubbles!==!1,composed:s?.composed!==!1};return i.dispatchEvent(new CustomEvent(e,n))},d=(i,{fallback:e=null,warnLabel:t=null}={})=>{if(!i)return e;try{return JSON.parse(i)}catch(s){return t&&console.warn(t,s),e}};var u=document.createElement("template");u.innerHTML=`
  <style>
    :host {
      display: inline-block;
      position: relative;
      font: inherit;
      color: inherit;
    }

    input {
      width: 100%;
      box-sizing: border-box;
      font: inherit;
      padding: 0.1rem 0.3rem;
      border: 1px solid #94a3b8;
      border-radius: 4px;
      background: rgba(15, 23, 42, 0.9);
      color: #f8fafc;
    }

    .suggestions {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      max-height: 200px;
      overflow-y: auto;
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid #1e293b;
      border-radius: 6px;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.45);
      padding: 0.25rem 0;
      display: none;
      z-index: 10;
    }

    :host([open]) .suggestions {
      display: block;
    }

    .suggestion {
      padding: 0.3rem 0.6rem;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 0.95rem;
      color: #f8fafc;
    }

    .suggestion[aria-selected='true'],
    .suggestion:hover {
      background: #0ea5e9;
      color: #0b1120;
    }
  </style>
  <div class="wrapper">
    <input type="text" autocomplete="off" spellcheck="false" />
    <div class="suggestions" role="listbox"></div>
  </div>
`;var o=class extends HTMLElement{static get observedAttributes(){return["items","value","placeholder","id"]}constructor(){if(super(),this._items=[],this._filteredItems=[],this._highlightedIndex=-1,this._open=!1,this._internals=null,typeof this.attachInternals=="function")try{this._internals=this.attachInternals()}catch{this._internals=null}this._labelClickHandlers=new Map,this._lastAssociatedLabelFor=null,this.attachShadow({mode:"open",delegatesFocus:!0}),this.shadowRoot.appendChild(u.content.cloneNode(!0)),this._input=this.shadowRoot.querySelector("input"),this._suggestions=this.shadowRoot.querySelector(".suggestions"),this._handleInput=this._handleInput.bind(this),this._handleFocus=this._handleFocus.bind(this),this._handleBlur=this._handleBlur.bind(this),this._handleKeyDown=this._handleKeyDown.bind(this),this._handleSuggestionClick=this._handleSuggestionClick.bind(this),this._handleExternalPointerDown=this._handleExternalPointerDown.bind(this),this._handleHostFocus=this._handleHostFocus.bind(this)}connectedCallback(){l(this,"items"),l(this,"value"),l(this,"placeholder"),l(this,"id"),this.hasAttribute("tabindex")||(this.tabIndex=0),this._input.addEventListener("input",this._handleInput),this._input.addEventListener("focus",this._handleFocus),this._input.addEventListener("blur",this._handleBlur),this._input.addEventListener("keydown",this._handleKeyDown),this._suggestions.addEventListener("pointerdown",this._handleSuggestionClick),document.addEventListener("pointerdown",this._handleExternalPointerDown),this.addEventListener("focus",this._handleHostFocus),this._syncAssociatedLabels(!0),this._applyPlaceholder(),this._updateFilteredItems(),this._renderSuggestions()}disconnectedCallback(){this._input.removeEventListener("input",this._handleInput),this._input.removeEventListener("focus",this._handleFocus),this._input.removeEventListener("blur",this._handleBlur),this._input.removeEventListener("keydown",this._handleKeyDown),this._suggestions.removeEventListener("pointerdown",this._handleSuggestionClick),document.removeEventListener("pointerdown",this._handleExternalPointerDown),this.removeEventListener("focus",this._handleHostFocus),this._disconnectAssociatedLabels()}attributeChangedCallback(e,t,s){e==="items"&&(this.items=this._parseItems(s)),e==="value"&&(this.value=s??""),e==="placeholder"&&(this.placeholder=s??""),e==="id"&&this._syncAssociatedLabels()}get items(){return this._items}set items(e){let t=Array.isArray(e)?e.map(s=>`${s}`):[];this._items=t,this._updateFilteredItems(),this._renderSuggestions()}get value(){return this._input.value}set value(e){let t=e??"";this._input.value!==t&&(this._input.value=t),this._input.setCustomValidity(""),this._updateFilteredItems(),this._renderSuggestions()}get placeholder(){return this._placeholder||""}set placeholder(e){this._placeholder=e??"",this._applyPlaceholder()}get inputElement(){return this._input}focus(e){this._input.focus(e)}setCustomValidity(e){this._input.setCustomValidity(e)}reportValidity(){return this._input.reportValidity()}_handleInput(e){let t=e.target.value;this._input.setCustomValidity(""),this._updateFilteredItems(t),this._open=!0,this._renderSuggestions(),this._emitValueChange(t,"input")}_handleFocus(){this._updateFilteredItems(this.value),this._open=!0,this._renderSuggestions()}_handleBlur(){setTimeout(()=>{this._open=!1,this._renderSuggestions()},100)}_handleKeyDown(e){if(this._filteredItems.length)switch(e.key){case"ArrowDown":e.preventDefault(),e.stopPropagation(),this._moveHighlight(1);break;case"ArrowUp":e.preventDefault(),e.stopPropagation(),this._moveHighlight(-1);break;case"Enter":this._highlightedIndex>=0&&(e.preventDefault(),e.stopImmediatePropagation(),this._selectHighlighted());break;case"Escape":this._open=!1,this._highlightedIndex=-1,this._renderSuggestions();break;default:break}}_handleSuggestionClick(e){let t=e.target;if(!(t instanceof HTMLElement))return;let s=t.dataset.value;s!=null&&(e.preventDefault(),this.value=s,this._emitValueChange(s,"selection"),this._open=!1,this._highlightedIndex=-1,this._renderSuggestions(),this.focus({preventScroll:!0}))}_handleExternalPointerDown(e){e.target===this||this.contains(e.target)||(this._open=!1,this._highlightedIndex=-1,this._renderSuggestions())}_moveHighlight(e){if(!this._filteredItems.length){this._highlightedIndex=-1,this._renderSuggestions();return}this._open=!0;let t=this._filteredItems.length;this._highlightedIndex=(this._highlightedIndex+e+t)%t,this._renderSuggestions()}_selectHighlighted(){if(this._highlightedIndex<0||this._highlightedIndex>=this._filteredItems.length)return;let e=this._filteredItems[this._highlightedIndex];this.value=e,this._emitValueChange(e,"selection"),this._open=!1,this._highlightedIndex=-1,this._renderSuggestions()}_emitValueChange(e,t="input"){a(this,"valuechange",{value:e,cause:t})}_updateFilteredItems(e=this.value){let t=(e??"").trim().toLowerCase();t?this._filteredItems=this._items.filter(s=>s.toLowerCase().includes(t)):this._filteredItems=[...this._items],this._filteredItems.includes(this.value)||(this._highlightedIndex=-1)}_renderSuggestions(){let e=this._open&&this._filteredItems.length>0;this.toggleAttribute("open",e),this._suggestions.innerHTML="",e&&this._filteredItems.forEach((t,s)=>{let n=document.createElement("div");n.className="suggestion",n.textContent=t,n.dataset.value=t,n.setAttribute("role","option"),n.setAttribute("aria-selected",s===this._highlightedIndex?"true":"false"),this._suggestions.appendChild(n)})}_parseItems(e){let t=d(e,{fallback:[]});return Array.isArray(t)?t.map(s=>`${s}`):[]}_applyPlaceholder(){this._input.placeholder=this._placeholder||""}_disconnectAssociatedLabels(){for(let[e,t]of this._labelClickHandlers.entries())e.removeEventListener("click",t);this._labelClickHandlers.clear(),this._lastAssociatedLabelFor=null}_handleHostFocus(){this._input.focus({preventScroll:!0})}_syncAssociatedLabels(e=!1){let t=this.id;if(!t){this._disconnectAssociatedLabels();return}if(!e&&t===this._lastAssociatedLabelFor)return;this._disconnectAssociatedLabels(),this._lastAssociatedLabelFor=t;let s=new Set;try{if(typeof this._internals?.labels?.values=="function")for(let r of this._internals.labels)s.add(r);let n=globalThis.CSS?.escape?globalThis.CSS.escape:r=>`${r}`;for(let r of document.querySelectorAll(`label[for="${n(t)}"]`))s.add(r)}catch{}for(let n of s){if(!(n instanceof HTMLElement))continue;let r=c=>{c.preventDefault(),this.focus({preventScroll:!0})};n.addEventListener("click",r),this._labelClickHandlers.set(n,r)}}};h(o,"formAssociated",!0);customElements.get("auto-suggest")||customElements.define("auto-suggest",o);export{o as AutoSuggestElement};
