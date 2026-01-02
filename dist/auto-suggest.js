var _=Object.defineProperty;var p=(i,t,e)=>t in i?_(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var o=(i,t,e)=>p(i,typeof t!="symbol"?t+"":t,e);var l=(i,t)=>{if(!(!i||!t)&&Object.prototype.hasOwnProperty.call(i,t)){let e=i[t];delete i[t],i[t]=e}},a=(i,t,e,s={bubbles:!0,composed:!0})=>{if(!i||!t)return!1;let n={detail:e,bubbles:s?.bubbles!==!1,composed:s?.composed!==!1};return i.dispatchEvent(new CustomEvent(t,n))},d=(i,{fallback:t=null,warnLabel:e=null}={})=>{if(!i)return t;try{return JSON.parse(i)}catch(s){return e&&console.warn(e,s),t}};var u=document.createElement("template");u.innerHTML=`
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
`;var h=class extends HTMLElement{static get observedAttributes(){return["items","value","placeholder","id"]}constructor(){if(super(),this._items=[],this._filteredItems=[],this._highlightedIndex=-1,this._open=!1,this._internals=null,typeof this.attachInternals=="function")try{this._internals=this.attachInternals()}catch{this._internals=null}this._labelClickHandlers=new Map,this._lastAssociatedLabelFor=null,this.attachShadow({mode:"open",delegatesFocus:!0}),this.shadowRoot.appendChild(u.content.cloneNode(!0)),this._input=this.shadowRoot.querySelector("input"),this._suggestions=this.shadowRoot.querySelector(".suggestions"),this._applyInputId(),this._handleInput=this._handleInput.bind(this),this._handleFocus=this._handleFocus.bind(this),this._handleBlur=this._handleBlur.bind(this),this._handleKeyDown=this._handleKeyDown.bind(this),this._handleSuggestionClick=this._handleSuggestionClick.bind(this),this._handleExternalPointerDown=this._handleExternalPointerDown.bind(this),this._handleHostFocus=this._handleHostFocus.bind(this)}connectedCallback(){l(this,"items"),l(this,"value"),l(this,"placeholder"),l(this,"id"),this.hasAttribute("tabindex")||(this.tabIndex=0),this._input.addEventListener("input",this._handleInput),this._input.addEventListener("focus",this._handleFocus),this._input.addEventListener("blur",this._handleBlur),this._input.addEventListener("keydown",this._handleKeyDown),this._suggestions.addEventListener("pointerdown",this._handleSuggestionClick),document.addEventListener("pointerdown",this._handleExternalPointerDown),this.addEventListener("focus",this._handleHostFocus),this._syncAssociatedLabels(!0),this._applyInputId(),this._applyPlaceholder(),this._updateFilteredItems(),this._renderSuggestions()}disconnectedCallback(){this._input.removeEventListener("input",this._handleInput),this._input.removeEventListener("focus",this._handleFocus),this._input.removeEventListener("blur",this._handleBlur),this._input.removeEventListener("keydown",this._handleKeyDown),this._suggestions.removeEventListener("pointerdown",this._handleSuggestionClick),document.removeEventListener("pointerdown",this._handleExternalPointerDown),this.removeEventListener("focus",this._handleHostFocus),this._disconnectAssociatedLabels()}attributeChangedCallback(t,e,s){t==="items"&&(this.items=this._parseItems(s)),t==="value"&&(this.value=s??""),t==="placeholder"&&(this.placeholder=s??""),t==="id"&&(this._syncAssociatedLabels(),this._applyInputId())}get items(){return this._items}set items(t){let e=Array.isArray(t)?t.map(s=>`${s}`):[];this._items=e,this._updateFilteredItems(),this._renderSuggestions()}get value(){return this._input.value}set value(t){let e=t??"";this._input.value!==e&&(this._input.value=e),this._input.setCustomValidity(""),this._updateFilteredItems(),this._renderSuggestions()}get placeholder(){return this._placeholder||""}set placeholder(t){this._placeholder=t??"",this._applyPlaceholder()}get inputElement(){return this._input}focus(t){this._input.focus(t)}setCustomValidity(t){this._input.setCustomValidity(t)}reportValidity(){return this._input.reportValidity()}_handleInput(t){let e=t.target.value;this._input.setCustomValidity(""),this._updateFilteredItems(e),this._open=!0,this._renderSuggestions(),this._emitValueChange(e,"input")}_handleFocus(){this._updateFilteredItems(this.value),this._open=!0,this._renderSuggestions()}_handleBlur(){setTimeout(()=>{this._open=!1,this._renderSuggestions()},100)}_handleKeyDown(t){if(this._filteredItems.length)switch(t.key){case"ArrowDown":t.preventDefault(),t.stopPropagation(),this._moveHighlight(1);break;case"ArrowUp":t.preventDefault(),t.stopPropagation(),this._moveHighlight(-1);break;case"Enter":this._highlightedIndex>=0&&(t.preventDefault(),t.stopImmediatePropagation(),this._selectHighlighted());break;case"Escape":this._open=!1,this._highlightedIndex=-1,this._renderSuggestions();break;default:break}}_handleSuggestionClick(t){let e=t.target;if(!(e instanceof HTMLElement))return;let s=e.dataset.value;s!=null&&(t.preventDefault(),this.value=s,this._emitValueChange(s,"selection"),this._open=!1,this._highlightedIndex=-1,this._renderSuggestions(),this.focus({preventScroll:!0}))}_handleExternalPointerDown(t){t.target===this||this.contains(t.target)||(this._open=!1,this._highlightedIndex=-1,this._renderSuggestions())}_moveHighlight(t){if(!this._filteredItems.length){this._highlightedIndex=-1,this._renderSuggestions();return}this._open=!0;let e=this._filteredItems.length;this._highlightedIndex=(this._highlightedIndex+t+e)%e,this._renderSuggestions()}_selectHighlighted(){if(this._highlightedIndex<0||this._highlightedIndex>=this._filteredItems.length)return;let t=this._filteredItems[this._highlightedIndex];this.value=t,this._emitValueChange(t,"selection"),this._open=!1,this._highlightedIndex=-1,this._renderSuggestions()}_emitValueChange(t,e="input"){a(this,"valuechange",{value:t,cause:e})}_updateFilteredItems(t=this.value){let e=(t??"").trim().toLowerCase();e?this._filteredItems=this._items.filter(s=>s.toLowerCase().includes(e)):this._filteredItems=[...this._items],this._filteredItems.includes(this.value)||(this._highlightedIndex=-1)}_renderSuggestions(){let t=this._open&&this._filteredItems.length>0;this.toggleAttribute("open",t),this._suggestions.innerHTML="",t&&this._filteredItems.forEach((e,s)=>{let n=document.createElement("div");n.className="suggestion",n.textContent=e,n.dataset.value=e,n.setAttribute("role","option"),n.setAttribute("aria-selected",s===this._highlightedIndex?"true":"false"),this._suggestions.appendChild(n)})}_parseItems(t){let e=d(t,{fallback:[]});return Array.isArray(e)?e.map(s=>`${s}`):[]}_applyPlaceholder(){this._input.placeholder=this._placeholder||""}_applyInputId(){let t=this.id;t?this._input.id=t:this._input.removeAttribute("id")}_disconnectAssociatedLabels(){for(let[t,e]of this._labelClickHandlers.entries())t.removeEventListener("click",e);this._labelClickHandlers.clear(),this._lastAssociatedLabelFor=null}_handleHostFocus(){this._input.focus({preventScroll:!0})}_syncAssociatedLabels(t=!1){let e=this.id;if(!e){this._disconnectAssociatedLabels();return}if(!t&&e===this._lastAssociatedLabelFor)return;this._disconnectAssociatedLabels(),this._lastAssociatedLabelFor=e;let s=new Set;try{if(typeof this._internals?.labels?.values=="function")for(let r of this._internals.labels)s.add(r);let n=globalThis.CSS?.escape?globalThis.CSS.escape:r=>`${r}`;for(let r of document.querySelectorAll(`label[for="${n(e)}"]`))s.add(r)}catch{}for(let n of s){if(!(n instanceof HTMLElement))continue;let r=c=>{c.preventDefault(),this.focus({preventScroll:!0})};n.addEventListener("click",r),this._labelClickHandlers.set(n,r)}}};o(h,"formAssociated",!0);customElements.get("auto-suggest")||customElements.define("auto-suggest",h);export{h as AutoSuggestElement};
