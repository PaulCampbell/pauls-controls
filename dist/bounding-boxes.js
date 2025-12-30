var q=Object.defineProperty;var J=(a,t,e)=>t in a?q(a,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[t]=e;var Y=(a,t,e)=>J(a,typeof t!="symbol"?t+"":t,e);var w=(a,t)=>{if(!(!a||!t)&&Object.prototype.hasOwnProperty.call(a,t)){let e=a[t];delete a[t],a[t]=e}},E=(a,t,e,i={bubbles:!0,composed:!0})=>{if(!a||!t)return!1;let s={detail:e,bubbles:i?.bubbles!==!1,composed:i?.composed!==!1};return a.dispatchEvent(new CustomEvent(t,s))},I=(a,{fallback:t=null,warnLabel:e=null}={})=>{if(!a)return t;try{return JSON.parse(a)}catch(i){return e&&console.warn(e,i),t}},O=(a,{trim:t=!0,removeEmpty:e=!0}={})=>{if(!Array.isArray(a))return[];let i=a.map(s=>{if(s==null)return"";let n=String(s);return t?n.trim():n});return e?i.filter(s=>s.length>0):i};var U=document.createElement("template");U.innerHTML=`
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
`;var P=class extends HTMLElement{static get observedAttributes(){return["items","value","placeholder","id"]}constructor(){if(super(),this._items=[],this._filteredItems=[],this._highlightedIndex=-1,this._open=!1,this._internals=null,typeof this.attachInternals=="function")try{this._internals=this.attachInternals()}catch{this._internals=null}this._labelClickHandlers=new Map,this._lastAssociatedLabelFor=null,this.attachShadow({mode:"open",delegatesFocus:!0}),this.shadowRoot.appendChild(U.content.cloneNode(!0)),this._input=this.shadowRoot.querySelector("input"),this._suggestions=this.shadowRoot.querySelector(".suggestions"),this._handleInput=this._handleInput.bind(this),this._handleFocus=this._handleFocus.bind(this),this._handleBlur=this._handleBlur.bind(this),this._handleKeyDown=this._handleKeyDown.bind(this),this._handleSuggestionClick=this._handleSuggestionClick.bind(this),this._handleExternalPointerDown=this._handleExternalPointerDown.bind(this),this._handleHostFocus=this._handleHostFocus.bind(this)}connectedCallback(){w(this,"items"),w(this,"value"),w(this,"placeholder"),w(this,"id"),this.hasAttribute("tabindex")||(this.tabIndex=0),this._input.addEventListener("input",this._handleInput),this._input.addEventListener("focus",this._handleFocus),this._input.addEventListener("blur",this._handleBlur),this._input.addEventListener("keydown",this._handleKeyDown),this._suggestions.addEventListener("pointerdown",this._handleSuggestionClick),document.addEventListener("pointerdown",this._handleExternalPointerDown),this.addEventListener("focus",this._handleHostFocus),this._syncAssociatedLabels(!0),this._applyPlaceholder(),this._updateFilteredItems(),this._renderSuggestions()}disconnectedCallback(){this._input.removeEventListener("input",this._handleInput),this._input.removeEventListener("focus",this._handleFocus),this._input.removeEventListener("blur",this._handleBlur),this._input.removeEventListener("keydown",this._handleKeyDown),this._suggestions.removeEventListener("pointerdown",this._handleSuggestionClick),document.removeEventListener("pointerdown",this._handleExternalPointerDown),this.removeEventListener("focus",this._handleHostFocus),this._disconnectAssociatedLabels()}attributeChangedCallback(t,e,i){t==="items"&&(this.items=this._parseItems(i)),t==="value"&&(this.value=i??""),t==="placeholder"&&(this.placeholder=i??""),t==="id"&&this._syncAssociatedLabels()}get items(){return this._items}set items(t){let e=Array.isArray(t)?t.map(i=>`${i}`):[];this._items=e,this._updateFilteredItems(),this._renderSuggestions()}get value(){return this._input.value}set value(t){let e=t??"";this._input.value!==e&&(this._input.value=e),this._input.setCustomValidity(""),this._updateFilteredItems(),this._renderSuggestions()}get placeholder(){return this._placeholder||""}set placeholder(t){this._placeholder=t??"",this._applyPlaceholder()}get inputElement(){return this._input}focus(t){this._input.focus(t)}setCustomValidity(t){this._input.setCustomValidity(t)}reportValidity(){return this._input.reportValidity()}_handleInput(t){let e=t.target.value;this._input.setCustomValidity(""),this._updateFilteredItems(e),this._open=!0,this._renderSuggestions(),this._emitValueChange(e,"input")}_handleFocus(){this._updateFilteredItems(this.value),this._open=!0,this._renderSuggestions()}_handleBlur(){setTimeout(()=>{this._open=!1,this._renderSuggestions()},100)}_handleKeyDown(t){if(this._filteredItems.length)switch(t.key){case"ArrowDown":t.preventDefault(),t.stopPropagation(),this._moveHighlight(1);break;case"ArrowUp":t.preventDefault(),t.stopPropagation(),this._moveHighlight(-1);break;case"Enter":this._highlightedIndex>=0&&(t.preventDefault(),t.stopImmediatePropagation(),this._selectHighlighted());break;case"Escape":this._open=!1,this._highlightedIndex=-1,this._renderSuggestions();break;default:break}}_handleSuggestionClick(t){let e=t.target;if(!(e instanceof HTMLElement))return;let i=e.dataset.value;i!=null&&(t.preventDefault(),this.value=i,this._emitValueChange(i,"selection"),this._open=!1,this._highlightedIndex=-1,this._renderSuggestions(),this.focus({preventScroll:!0}))}_handleExternalPointerDown(t){t.target===this||this.contains(t.target)||(this._open=!1,this._highlightedIndex=-1,this._renderSuggestions())}_moveHighlight(t){if(!this._filteredItems.length){this._highlightedIndex=-1,this._renderSuggestions();return}this._open=!0;let e=this._filteredItems.length;this._highlightedIndex=(this._highlightedIndex+t+e)%e,this._renderSuggestions()}_selectHighlighted(){if(this._highlightedIndex<0||this._highlightedIndex>=this._filteredItems.length)return;let t=this._filteredItems[this._highlightedIndex];this.value=t,this._emitValueChange(t,"selection"),this._open=!1,this._highlightedIndex=-1,this._renderSuggestions()}_emitValueChange(t,e="input"){E(this,"valuechange",{value:t,cause:e})}_updateFilteredItems(t=this.value){let e=(t??"").trim().toLowerCase();e?this._filteredItems=this._items.filter(i=>i.toLowerCase().includes(e)):this._filteredItems=[...this._items],this._filteredItems.includes(this.value)||(this._highlightedIndex=-1)}_renderSuggestions(){let t=this._open&&this._filteredItems.length>0;this.toggleAttribute("open",t),this._suggestions.innerHTML="",t&&this._filteredItems.forEach((e,i)=>{let s=document.createElement("div");s.className="suggestion",s.textContent=e,s.dataset.value=e,s.setAttribute("role","option"),s.setAttribute("aria-selected",i===this._highlightedIndex?"true":"false"),this._suggestions.appendChild(s)})}_parseItems(t){let e=I(t,{fallback:[]});return Array.isArray(e)?e.map(i=>`${i}`):[]}_applyPlaceholder(){this._input.placeholder=this._placeholder||""}_disconnectAssociatedLabels(){for(let[t,e]of this._labelClickHandlers.entries())t.removeEventListener("click",e);this._labelClickHandlers.clear(),this._lastAssociatedLabelFor=null}_handleHostFocus(){this._input.focus({preventScroll:!0})}_syncAssociatedLabels(t=!1){let e=this.id;if(!e){this._disconnectAssociatedLabels();return}if(!t&&e===this._lastAssociatedLabelFor)return;this._disconnectAssociatedLabels(),this._lastAssociatedLabelFor=e;let i=new Set;try{if(typeof this._internals?.labels?.values=="function")for(let n of this._internals.labels)i.add(n);let s=globalThis.CSS?.escape?globalThis.CSS.escape:n=>`${n}`;for(let n of document.querySelectorAll(`label[for="${s(e)}"]`))i.add(n)}catch{}for(let s of i){if(!(s instanceof HTMLElement))continue;let n=r=>{r.preventDefault(),this.focus({preventScroll:!0})};s.addEventListener("click",n),this._labelClickHandlers.set(s,n)}}};Y(P,"formAssociated",!0);customElements.get("auto-suggest")||customElements.define("auto-suggest",P);var z=["#f97316","#ef4444","#eab308","#22c55e","#0ea5e9","#a855f7"],V="#00ff88",W=document.createElement("template"),$=a=>{if(typeof a!="string")return null;let t=a.replace("#","");if(t.length!==3&&t.length!==6)return null;let e=t.length===3?t.split("").map(s=>s+s).join(""):t,i=parseInt(e,16);return Number.isNaN(i)?null:{r:i>>16&255,g:i>>8&255,b:i&255}},K=(a,t)=>{let e=$(a);if(!e)return a;let i=Math.min(Math.max(t,0),1);return`rgba(${e.r}, ${e.g}, ${e.b}, ${i})`},j=a=>{let t=$(a);if(!t)return"#111827";let e=s=>{let n=s/255;return n<=.03928?n/12.92:((n+.055)/1.055)**2.4};return .2126*e(t.r)+.7152*e(t.g)+.0722*e(t.b)>.55?"#111827":"#ffffff"};W.innerHTML=`
	<style>
		:host {
			display: inline-block;
			position: relative;
			font-family: sans-serif;
		}

		figure {
			margin: 0;
			position: relative;
			width: 100%;
		}

		canvas {
			display: block;
			width: 100%;
			height: auto;
		}

		.add-button {
			position: absolute;
			top: 0.5rem;
			left: 0.5rem;
			padding: 0.35rem 0.45rem;
			border: 0;
			border-radius: 999px;
			background: #22c55e;
			color: #ffffff;
			font-size: 1.25rem;
			cursor: pointer;
			box-shadow: 0 6px 20px rgba(15, 23, 42, 0.35);
		}

		.add-button[aria-pressed='true'] {
			background: #16a34a;
			box-shadow: 0 0 0 5px rgba(138, 183, 155, 0.6);
		}

		.overlay {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			pointer-events: none;
		}

		.overlay-controls {
			position: absolute;
			display: flex;
			align-items: flex-start;
			gap: 0.5rem;
			pointer-events: auto;
			border-radius: 6px;
			padding: 0.35rem 0.45rem;
		}

		.overlay-controls-buttons {
			display: flex;
			flex-direction: column;
			gap: 0.35rem;
		}

		.overlay-controls-label {
			display: flex;
			align-items: center;
			min-width: 7.5rem;
		}

		.overlay-controls-label auto-suggest {
			width: 100%;
		}

		.overlay-controls-label input[type="text"] {
			width: 100%;
		}

		.overlay-controls button,
		.overlay-controls input[type="text"] {
			font: inherit;
		}

		.overlay-controls button {
			width: 2.1rem;
			height: 2.1rem;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 0;
			border: 0px ;
			background: rgba(226, 232, 240, 0);
			color: #0f172a;
			border-radius: 4px;
			cursor: pointer;
			font-size: 1.5rem;
		}

		.overlay-controls input[type="text"] {
			min-width: 6rem;
			padding: 0.1rem 0.3rem;
			border: 1px solid #94a3b8;
			background: rgba(15, 23, 42, 0.9);
			color: #f8fafc;
            left: -5px;
		}
	</style>
	<figure>
		<canvas aria-label="Bounding boxes viewer"></canvas>
		<button class="add-button" type="button" title="Add tag" aria-label="Add tag" aria-pressed="false">\u2795</button>
		<div class="overlay"></div>
	</figure>
`;var T=class extends HTMLElement{static get observedAttributes(){return["src","boxes","autosuggestitems"]}constructor(){super(),this._boxes=[],this._image=null,this._ctx=null,this._layoutCache=[],this._activeIndex=null,this._labelDraft="",this._isUpdatingBoxesAttribute=!1,this._autosuggestItems=[],this._isUpdatingAutosuggestAttribute=!1,this._skipNextAutosuggestSave=!1,this._isAddMode=!1,this._draftBox=null,this._pendingNewBoxIndex=null,this._activePointerId=null,this._activeLabelInput=null,typeof ResizeObserver=="function"?this._resizeObserver=new ResizeObserver(()=>{this._draw()}):this._resizeObserver=null,this._handlePointerDown=this._handlePointerDown.bind(this),this._handleSaveClick=this._handleSaveClick.bind(this),this._handleCancelClick=this._handleCancelClick.bind(this),this._handleDeleteClick=this._handleDeleteClick.bind(this),this._handleLabelInput=this._handleLabelInput.bind(this),this._handleAddButtonClick=this._handleAddButtonClick.bind(this),this._handleAddPointerMove=this._handleAddPointerMove.bind(this),this._handleAddPointerUp=this._handleAddPointerUp.bind(this),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(W.content.cloneNode(!0)),this._canvas=this.shadowRoot.querySelector("canvas"),this._overlay=this.shadowRoot.querySelector(".overlay"),this._addButton=this.shadowRoot.querySelector(".add-button")}connectedCallback(){this._ctx||(this._ctx=this._canvas.getContext("2d")),this.isConnected&&this._resizeObserver&&this._resizeObserver.observe(this),this._canvas.addEventListener("pointerdown",this._handlePointerDown),this._overlay&&this._overlay.addEventListener("pointerdown",this._handlePointerDown),this._addButton&&this._addButton.addEventListener("click",this._handleAddButtonClick),this.hasAttribute("boxes")&&this._setBoxesFromAttribute(this.getAttribute("boxes")),this.hasAttribute("autosuggestitems")&&this._setAutosuggestItemsFromAttribute(this.getAttribute("autosuggestitems")),this.hasAttribute("src")&&this._loadImage(this.getAttribute("src"))}disconnectedCallback(){this._resizeObserver&&this._resizeObserver.unobserve(this),this._canvas.removeEventListener("pointerdown",this._handlePointerDown),this._overlay&&this._overlay.removeEventListener("pointerdown",this._handlePointerDown),this._addButton&&this._addButton.removeEventListener("click",this._handleAddButtonClick),this._exitAddMode({redraw:!1})}attributeChangedCallback(t,e,i){t==="src"&&this._loadImage(i),t==="boxes"&&this._setBoxesFromAttribute(i),t==="autosuggestitems"&&this._setAutosuggestItemsFromAttribute(i)}set boxes(t){if(!Array.isArray(t)){console.warn("`boxes` must be an array.");return}this._boxes=t,this._activeIndex=null,this._labelDraft="",this._pendingNewBoxIndex=null,this._exitAddMode({redraw:!1}),this._draw()}get boxes(){return this._boxes}_setAutosuggestItemsFromAttribute(t){if(this._isUpdatingAutosuggestAttribute)return;if(!t){this._autosuggestItems=[],this._renderActiveOverlay();return}let e=I(t,{fallback:[],warnLabel:"Unable to parse `autosuggestitems` attribute. Expecting valid JSON."});this._autosuggestItems=O(e),this._renderActiveOverlay()}set autosuggestItems(t){if(!Array.isArray(t)){console.warn("`autosuggestItems` must be an array.");return}let e=O(t);this._autosuggestItems=e,this._isUpdatingAutosuggestAttribute||(this._isUpdatingAutosuggestAttribute=!0,e.length===0?this.removeAttribute("autosuggestitems"):this.setAttribute("autosuggestitems",JSON.stringify(e)),this._isUpdatingAutosuggestAttribute=!1),this._renderActiveOverlay()}get autosuggestItems(){return Array.isArray(this._autosuggestItems)?[...this._autosuggestItems]:[]}_setBoxesFromAttribute(t){if(this._isUpdatingBoxesAttribute)return;if(!t){this.boxes=[];return}let e=I(t,{fallback:[],warnLabel:"Unable to parse `boxes` attribute. Expecting valid JSON."});this.boxes=Array.isArray(e)?e:[]}async _loadImage(t){if(!t){this._image=null,this._clear();return}let e=new Image;e.decoding="async",e.src=t;try{await e.decode(),this._image=e,this._draw()}catch(i){console.error("Unable to load image for <bounding-boxes> component.",i),this._image=null,this._clear()}}_draw(){if(!this._ctx)return;if(!this._image){this._clear();return}let{naturalWidth:t,naturalHeight:e}=this._image;if(!t||!e){this._clear();return}(this._canvas.width!==t||this._canvas.height!==e)&&(this._canvas.width=t,this._canvas.height=e),this._ctx.drawImage(this._image,0,0,t,e),this._drawBoxes(t,e),this._renderActiveOverlay()}_clear(){this._ctx&&(this._ctx.clearRect(0,0,this._canvas.width,this._canvas.height),this._layoutCache=[],this._draftBox=null,this._renderActiveOverlay())}_drawBoxes(t,e){this._layoutCache=[];let i=this._getDisplayScale(),s=4,n=16,r=8,c=6,l=i.canvasToCss(s),h=i.canvasToCss(n),f=i.canvasToCss(r),u=i.canvasToCss(c),_=z.length||1,g=[];if(!Array.isArray(this._boxes)||this._boxes.length===0){this._layoutCache=g,this._drawDraftBox(l);return}for(let d=0;d<this._boxes.length;d+=1){let p=this._boxes[d],{xPosition:b,yPosition:v,width:m,height:x}=p,o=typeof p.label=="string"?p.label:"";if(typeof b!="number"||typeof v!="number"||typeof m!="number"||typeof x!="number")continue;let y=z[d%_]||V,C=y,A=K(y,.8),S=j(y),B=this._activeIndex===d,R=this._pendingNewBoxIndex===d,M=Math.abs(m)*t,D=Math.abs(x)*e,L=(b-m/2)*t,k=(v-x/2)*e;B&&(this._ctx.fillStyle="rgba(0, 0, 0, 0.3)",this._ctx.fillRect(L,k,M,D)),this._ctx.save(),R&&this._ctx.setLineDash([8,6]),this._ctx.strokeStyle=C,this._ctx.lineWidth=l,this._ctx.strokeRect(L,k,M,D),this._ctx.restore(),this._ctx.font=`${h}px sans-serif`,this._ctx.textBaseline="top";let X=this._ctx.measureText(o).width+f*2,N=h+u*2,F=L,H=Math.max(k-N,0);!B&&o&&(this._ctx.fillStyle=A,this._ctx.fillRect(F,H,X,N),this._ctx.fillStyle=S,this._ctx.fillText(o,F+f,H+u)),g.push({index:d,boxRect:{x:L,y:k,width:M,height:D},labelRect:o||B?{x:F,y:H,width:Math.max(X,f*2+h*.6),height:Math.max(N,h+u*2)}:null,labelTextColor:S,labelPadding:{x:f,y:u},fontSize:h,label:o,strokeStyle:C,lineWidth:l,isActive:B,isPending:R})}this._layoutCache=g,this._drawDraftBox(l)}_drawDraftBox(t){if(!this._ctx||!this._draftBox||!this._isAddMode)return;let{startX:e,startY:i,currentX:s,currentY:n}=this._draftBox,r=Math.abs(s-e),c=Math.abs(n-i);if(r<1&&c<1)return;let l=Math.min(e,s),h=Math.min(i,n);this._ctx.save(),this._ctx.strokeStyle=V,this._ctx.lineWidth=t,this._ctx.setLineDash([8,6]),this._ctx.strokeRect(l,h,r,c),this._ctx.restore()}_renderActiveOverlay(){if(!this._overlay||(this._overlay.textContent="",this._overlay.style.pointerEvents="none",this._activeLabelInput=null,typeof this._activeIndex!="number"))return;let t=this._layoutCache.find(o=>o.index===this._activeIndex);if(!t)return;this._overlay.style.pointerEvents="auto";let e=this._canvas.width||1,i=this._canvas.height||1,s=this._overlay.getBoundingClientRect(),n=s.width||this._canvas.clientWidth||e,r=s.height||this._canvas.clientHeight||i,c=n/e||1,l=r/i||1,h=t.boxRect.x*c-5,f=t.boxRect.y*l-32,u=document.createElement("div");u.className="overlay-controls",u.style.top=`${Math.max(0,f)}px`,u.style.left=`${Math.max(0,h)}px`;let _=document.createElement("auto-suggest");_.placeholder="Label",_.items=this.autosuggestItems,_.value=this._labelDraft??t.label??"",_.addEventListener("valuechange",o=>{this._labelDraft=o.detail?.value??"",this._activeLabelInput&&this._activeLabelInput.setCustomValidity(""),o.detail?.cause==="selection"&&(this._skipNextAutosuggestSave=!0,queueMicrotask(()=>{this._skipNextAutosuggestSave=!1}))});let g=document.createElement("button");g.type="button",g.title="Delete bounding box",g.textContent="\u{1F6AE}",g.setAttribute("aria-label","Delete bounding box"),g.addEventListener("click",this._handleDeleteClick);let d=document.createElement("button");d.type="button",d.title="Save label",d.textContent="\u2705",d.setAttribute("aria-label","Save label"),d.addEventListener("click",this._handleSaveClick);let p=document.createElement("button");p.type="button",p.textContent="\u274C",p.title="Cancel editing",p.addEventListener("click",this._handleCancelClick);let b=document.createElement("div");b.className="overlay-controls-buttons",b.append(d,g,p);let v=document.createElement("div");v.className="overlay-controls-label",v.append(_);let m=o=>{if(!o.defaultPrevented){if(o.key==="Enter"){if(this._skipNextAutosuggestSave){this._skipNextAutosuggestSave=!1;return}o.preventDefault(),this._handleSaveClick();return}o.key==="Escape"&&(o.preventDefault(),this._handleCancelClick())}},x=()=>{let o=_.inputElement;o&&(o.addEventListener("input",this._handleLabelInput),o.addEventListener("keydown",m),o.setCustomValidity(""),this._activeLabelInput=o)};this._activeLabelInput=null,typeof queueMicrotask=="function"?queueMicrotask(x):Promise.resolve().then(x),u.append(b,v),this._overlay.appendChild(u),requestAnimationFrame(()=>{let y=b.getBoundingClientRect().width||g.getBoundingClientRect().width||0,C=Math.max(0,h-y-8);u.style.left=`${C}px`;try{_.focus({preventScroll:!0})}catch{_.focus()}let A=_.inputElement;A&&typeof A.select=="function"&&A.select()})}_handlePointerDown(t){if(t.target&&t.target.closest(".overlay-controls"))return;if(this._isAddMode){this._handleAddPointerDown(t);return}if(typeof t.button=="number"&&t.button!==0||!Array.isArray(this._boxes)||this._boxes.length===0)return;let{canvasX:e,canvasY:i}=this._getCanvasCoordinates(t),s=r=>r&&e>=r.x&&e<=r.x+r.width&&i>=r.y&&i<=r.y+r.height,n=null;for(let r=this._layoutCache.length-1;r>=0;r-=1){let c=this._layoutCache[r];if(s(c.labelRect)){n=c.index;break}if(s(c.boxRect)){n=c.index;break}}typeof n=="number"?(t.preventDefault(),this._activateBox(n)):typeof this._activeIndex=="number"&&this._deactivateActiveBox()}_handleAddPointerDown(t){if(t.target&&t.target.closest(".overlay-controls")||typeof t.button=="number"&&t.button!==0||!this._isAddMode||this._pendingNewBoxIndex!==null)return;let{canvasX:e,canvasY:i}=this._getCanvasCoordinates(t);if(this._draftBox={startX:e,startY:i,currentX:e,currentY:i},this._activePointerId=t.pointerId,this._canvas&&typeof this._canvas.setPointerCapture=="function")try{this._canvas.setPointerCapture(t.pointerId)}catch{}this._canvas&&(this._canvas.addEventListener("pointermove",this._handleAddPointerMove),this._canvas.addEventListener("pointerup",this._handleAddPointerUp),this._canvas.addEventListener("pointercancel",this._handleAddPointerUp)),this._draw()}_handleAddPointerMove(t){if(!this._draftBox||t.pointerId!==this._activePointerId)return;let{canvasX:e,canvasY:i}=this._getCanvasCoordinates(t);this._draftBox={...this._draftBox,currentX:e,currentY:i},this._draw()}_handleAddPointerUp(t){if(t.pointerId!==this._activePointerId)return;if(this._activePointerId=null,this._canvas&&typeof this._canvas.releasePointerCapture=="function")try{this._canvas.releasePointerCapture(t.pointerId)}catch{}if(this._canvas&&(this._canvas.removeEventListener("pointermove",this._handleAddPointerMove),this._canvas.removeEventListener("pointerup",this._handleAddPointerUp),this._canvas.removeEventListener("pointercancel",this._handleAddPointerUp)),!this._draftBox)return;if(t.type==="pointercancel"){this._draftBox=null,this._draw();return}let{startX:e,startY:i}=this._draftBox,{canvasX:s,canvasY:n}=this._getCanvasCoordinates(t),r=Math.min(e,s),c=Math.min(i,n),l=Math.abs(s-e),h=Math.abs(n-i);if(this._draftBox=null,l<4||h<4){this._draw();return}let f=this._canvas.width||1,u=this._canvas.height||1,_=Math.min(Math.max(l/f,0),1),g=Math.min(Math.max(h/u,0),1),d=Math.min(Math.max((r+l/2)/f,0),1),p=Math.min(Math.max((c+h/2)/u,0),1),b={xPosition:d,yPosition:p,width:_,height:g,label:""};this._boxes=[...this._boxes,b],this._pendingNewBoxIndex=this._boxes.length-1,this._activeIndex=this._pendingNewBoxIndex,this._labelDraft="",this._draw()}_handleAddButtonClick(t){t.preventDefault(),t.stopPropagation(),this._isAddMode?this._exitAddMode():this._enterAddMode()}_enterAddMode(){this._isAddMode||(this._isAddMode=!0,this._draftBox=null,this._pendingNewBoxIndex=null,this._activePointerId=null,this._addButton&&this._addButton.setAttribute("aria-pressed","true"),this._setCanvasCursor("copy"),this._deactivateActiveBox({redraw:!1}),this._draw())}_exitAddMode(t={}){let{redraw:e=!0}=t;if(!this._isAddMode){e&&this._draw();return}if(this._canvas&&this._activePointerId!==null){try{this._canvas.releasePointerCapture(this._activePointerId)}catch{}this._canvas.removeEventListener("pointermove",this._handleAddPointerMove),this._canvas.removeEventListener("pointerup",this._handleAddPointerUp),this._canvas.removeEventListener("pointercancel",this._handleAddPointerUp),this._activePointerId=null}this._pendingNewBoxIndex!==null&&(this._boxes=this._boxes.filter((i,s)=>s!==this._pendingNewBoxIndex)),this._deactivateActiveBox({redraw:!1}),this._isAddMode=!1,this._draftBox=null,this._pendingNewBoxIndex=null,this._addButton&&this._addButton.setAttribute("aria-pressed","false"),this._setCanvasCursor("default"),this._activeLabelInput=null,e?this._draw():this._renderActiveOverlay()}_setCanvasCursor(t){let e=t==="copy"?"copy":"default";this._canvas&&(this._canvas.style.cursor=e),this._overlay&&(this._overlay.style.cursor="default")}_getCanvasCoordinates(t){if(!this._canvas)return{canvasX:0,canvasY:0,scaleX:1,scaleY:1};let e=this._canvas.getBoundingClientRect(),i=this._canvas.width/(e.width||1),s=this._canvas.height/(e.height||1);return{canvasX:(t.clientX-e.left)*i,canvasY:(t.clientY-e.top)*s,scaleX:i,scaleY:s}}_handleLabelInput(t){t?.target?.setCustomValidity&&t.target.setCustomValidity(""),this._labelDraft=t.target.value}_handleSaveClick(){if(typeof this._activeIndex!="number")return;let t=this._boxes[this._activeIndex];if(!t)return;let e=(this._labelDraft??"").trim();if(!e){if(this._activeLabelInput){this._activeLabelInput.setCustomValidity("Label is required"),typeof this._activeLabelInput.reportValidity=="function"&&this._activeLabelInput.reportValidity();try{this._activeLabelInput.focus({preventScroll:!0})}catch{typeof this._activeLabelInput.focus=="function"&&this._activeLabelInput.focus()}}return}let i=e;this._boxes[this._activeIndex]={...t,label:i},this._labelDraft=i,this._updateBoxesAttribute(),this._dispatchBoxesChanged(),this._pendingNewBoxIndex===this._activeIndex?(this._pendingNewBoxIndex=null,this._deactivateActiveBox({redraw:!1}),this._exitAddMode({redraw:!1}),this._draw()):this._deactivateActiveBox()}_handleCancelClick(){if(typeof this._activeIndex!="number"){this._deactivateActiveBox();return}if(this._pendingNewBoxIndex===this._activeIndex){this._boxes=this._boxes.filter((e,i)=>i!==this._activeIndex),this._pendingNewBoxIndex=null,this._deactivateActiveBox({redraw:!1}),this._exitAddMode({redraw:!1}),this._draw();return}this._deactivateActiveBox()}_handleDeleteClick(){if(typeof this._activeIndex!="number")return;let t=this._pendingNewBoxIndex===this._activeIndex;if(this._boxes=this._boxes.filter((e,i)=>i!==this._activeIndex),t){this._pendingNewBoxIndex=null,this._deactivateActiveBox({redraw:!1}),this._exitAddMode({redraw:!1}),this._draw();return}this._deactivateActiveBox({redraw:!1}),this._updateBoxesAttribute(),this._dispatchBoxesChanged(),this._draw()}_activateBox(t){if(t<0||t>=this._boxes.length)return;this._activeIndex=t;let e=this._boxes[t];this._labelDraft=typeof e.label=="string"?e.label:"",this._draw()}_deactivateActiveBox(t={redraw:!0}){this._activeIndex=null,this._labelDraft="",this._activeLabelInput=null,t.redraw!==!1&&this._draw()}_updateBoxesAttribute(){if(this.isConnected){this._isUpdatingBoxesAttribute=!0;try{this.setAttribute("boxes",JSON.stringify(this._boxes))}catch(t){console.warn("Unable to serialise boxes attribute.",t)}finally{this._isUpdatingBoxesAttribute=!1}}}_dispatchBoxesChanged(){E(this,"boxeschange",{boxes:this._boxes.map(t=>({...t}))})}_getDisplayScale(){let t=this._canvas.width||1,e=this._canvas.height||1,i=this._canvas.getBoundingClientRect(),s=i.width||this._canvas.clientWidth||t,n=i.height||this._canvas.clientHeight||e,r=s/t||1,c=n/e||1,l=Math.min(r,c)||1;return{canvasToCss:h=>!isFinite(l)||l===0?h:Math.max(h/l,1)}}};customElements.get("bounding-boxes")||customElements.define("bounding-boxes",T);export{T as BoundingBoxesElement};
