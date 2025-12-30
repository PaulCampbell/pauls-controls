var h=document.createElement("template");h.innerHTML=`
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
`;var n=class extends HTMLElement{static get observedAttributes(){return["items","value","placeholder"]}constructor(){super(),this._items=[],this._filteredItems=[],this._highlightedIndex=-1,this._open=!1,this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(h.content.cloneNode(!0)),this._input=this.shadowRoot.querySelector("input"),this._suggestions=this.shadowRoot.querySelector(".suggestions"),this._handleInput=this._handleInput.bind(this),this._handleFocus=this._handleFocus.bind(this),this._handleBlur=this._handleBlur.bind(this),this._handleKeyDown=this._handleKeyDown.bind(this),this._handleSuggestionClick=this._handleSuggestionClick.bind(this),this._handleExternalPointerDown=this._handleExternalPointerDown.bind(this)}connectedCallback(){this._upgradeProperty("items"),this._upgradeProperty("value"),this._upgradeProperty("placeholder"),this._input.addEventListener("input",this._handleInput),this._input.addEventListener("focus",this._handleFocus),this._input.addEventListener("blur",this._handleBlur),this._input.addEventListener("keydown",this._handleKeyDown),this._suggestions.addEventListener("pointerdown",this._handleSuggestionClick),document.addEventListener("pointerdown",this._handleExternalPointerDown),this._applyPlaceholder(),this._updateFilteredItems(),this._renderSuggestions()}disconnectedCallback(){this._input.removeEventListener("input",this._handleInput),this._input.removeEventListener("focus",this._handleFocus),this._input.removeEventListener("blur",this._handleBlur),this._input.removeEventListener("keydown",this._handleKeyDown),this._suggestions.removeEventListener("pointerdown",this._handleSuggestionClick),document.removeEventListener("pointerdown",this._handleExternalPointerDown)}attributeChangedCallback(e,t,i){e==="items"&&(this.items=this._parseItems(i)),e==="value"&&(this.value=i??""),e==="placeholder"&&(this.placeholder=i??"")}get items(){return this._items}set items(e){let t=Array.isArray(e)?e.map(i=>`${i}`):[];this._items=t,this._updateFilteredItems(),this._renderSuggestions()}get value(){return this._input.value}set value(e){let t=e??"";this._input.value!==t&&(this._input.value=t),this._input.setCustomValidity(""),this._updateFilteredItems(),this._renderSuggestions()}get placeholder(){return this._placeholder||""}set placeholder(e){this._placeholder=e??"",this._applyPlaceholder()}get inputElement(){return this._input}focus(e){this._input.focus(e)}setCustomValidity(e){this._input.setCustomValidity(e)}reportValidity(){return this._input.reportValidity()}_upgradeProperty(e){if(Object.prototype.hasOwnProperty.call(this,e)){let t=this[e];delete this[e],this[e]=t}}_handleInput(e){let t=e.target.value;this._input.setCustomValidity(""),this._updateFilteredItems(t),this._open=!0,this._renderSuggestions(),this._emitValueChange(t,"input")}_handleFocus(){this._updateFilteredItems(this.value),this._open=!0,this._renderSuggestions()}_handleBlur(){setTimeout(()=>{this._open=!1,this._renderSuggestions()},100)}_handleKeyDown(e){if(this._filteredItems.length)switch(e.key){case"ArrowDown":e.preventDefault(),e.stopPropagation(),this._moveHighlight(1);break;case"ArrowUp":e.preventDefault(),e.stopPropagation(),this._moveHighlight(-1);break;case"Enter":this._highlightedIndex>=0&&(e.preventDefault(),e.stopImmediatePropagation(),this._selectHighlighted());break;case"Escape":this._open=!1,this._highlightedIndex=-1,this._renderSuggestions();break;default:break}}_handleSuggestionClick(e){let t=e.target;if(!(t instanceof HTMLElement))return;let i=t.dataset.value;i!=null&&(e.preventDefault(),this.value=i,this._emitValueChange(i,"selection"),this._open=!1,this._highlightedIndex=-1,this._renderSuggestions(),this.focus({preventScroll:!0}))}_handleExternalPointerDown(e){e.target===this||this.contains(e.target)||(this._open=!1,this._highlightedIndex=-1,this._renderSuggestions())}_moveHighlight(e){if(!this._filteredItems.length){this._highlightedIndex=-1,this._renderSuggestions();return}this._open=!0;let t=this._filteredItems.length;this._highlightedIndex=(this._highlightedIndex+e+t)%t,this._renderSuggestions()}_selectHighlighted(){if(this._highlightedIndex<0||this._highlightedIndex>=this._filteredItems.length)return;let e=this._filteredItems[this._highlightedIndex];this.value=e,this._emitValueChange(e,"selection"),this._open=!1,this._highlightedIndex=-1,this._renderSuggestions()}_emitValueChange(e,t="input"){this.dispatchEvent(new CustomEvent("valuechange",{detail:{value:e,cause:t},bubbles:!0,composed:!0}))}_updateFilteredItems(e=this.value){let t=(e??"").trim().toLowerCase();t?this._filteredItems=this._items.filter(i=>i.toLowerCase().includes(t)):this._filteredItems=[...this._items],this._filteredItems.includes(this.value)||(this._highlightedIndex=-1)}_renderSuggestions(){let e=this._open&&this._filteredItems.length>0;this.toggleAttribute("open",e),this._suggestions.innerHTML="",e&&this._filteredItems.forEach((t,i)=>{let s=document.createElement("div");s.className="suggestion",s.textContent=t,s.dataset.value=t,s.setAttribute("role","option"),s.setAttribute("aria-selected",i===this._highlightedIndex?"true":"false"),this._suggestions.appendChild(s)})}_parseItems(e){if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.map(i=>`${i}`):[]}catch{return[]}}_applyPlaceholder(){this._input.placeholder=this._placeholder||""}};customElements.get("auto-suggest")||customElements.define("auto-suggest",n);export{n as AutoSuggestElement};
