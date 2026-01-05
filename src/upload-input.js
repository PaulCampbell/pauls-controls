import { upgradeProperty } from './component-utils.js';

export function createUploadInput({ placeholder = '', buttonText = 'Choose Image' } = {}) {
  const container = document.createElement('div');
  container.className = 'upload-input-container';

  let placeholderSrc = placeholder ?? '';
  let uploadButtonText = buttonText ?? 'Choose Image';
  
  // Create preview area
  const preview = document.createElement('div');
  preview.className = 'upload-preview';
  preview.setAttribute('data-empty', 'true');
  
  const previewImage = document.createElement('img');
  previewImage.className = 'upload-preview-image';
  preview.appendChild(previewImage);
  
  const placeholderText = document.createElement('div');
  placeholderText.className = 'upload-placeholder';
  placeholderText.textContent = 'Preview';
  preview.appendChild(placeholderText);
  
  // Create file input wrapper
  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'upload-input-wrapper';
  
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.className = 'upload-input';
  
  const uploadButton = document.createElement('button');
  uploadButton.type = 'button';
  uploadButton.className = 'upload-button';
  uploadButton.textContent = uploadButtonText;
  
  inputWrapper.appendChild(fileInput);
  inputWrapper.appendChild(uploadButton);
  
  // Assemble container
  container.appendChild(preview);
  container.appendChild(inputWrapper);
  
  // Handle file selection
  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      preview.setAttribute('data-empty', 'false');
      container.dispatchEvent(new CustomEvent('image-loaded', {
        detail: { file, dataUrl: e.target.result }
      }));
    };
    reader.readAsDataURL(file);
  }

  function applyPlaceholderIfNeeded() {
    if (fileInput.files && fileInput.files.length > 0) {
      return;
    }

    if (placeholderSrc) {
      previewImage.src = placeholderSrc;
      preview.setAttribute('data-empty', 'false');
      return;
    }

    previewImage.src = '';
    preview.setAttribute('data-empty', 'true');
  }
  
  // File input change handler
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
      return;
    }

    applyPlaceholderIfNeeded();
  });
  
  // Button click handler
  uploadButton.addEventListener('click', () => {
    fileInput.click();
  });
  
  // Drag and drop handlers
  let dragCounter = 0;
  
  container.addEventListener('dragenter', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter++;
    container.classList.add('drag-over');
  });
  
  container.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter--;
    if (dragCounter === 0) {
      container.classList.remove('drag-over');
    }
  });
  
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  
  container.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter = 0;
    container.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleFile(file);
        // Update the file input (for form submission compatibility)
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInput.files = dt.files;
      }
    }
  });

  applyPlaceholderIfNeeded();
  
  // Public API
  return {
    element: container,
    getFile: () => fileInput.files[0],
    setPlaceholder: (src) => {
      placeholderSrc = src ?? '';
      applyPlaceholderIfNeeded();
    },
    setButtonText: (text) => {
      uploadButtonText = text ?? 'Choose Image';
      uploadButton.textContent = uploadButtonText;
    },
    clear: () => {
      fileInput.value = '';
      applyPlaceholderIfNeeded();
    }
  };
}

// Web Component wrapper
export class UploadInput extends HTMLElement {
  static get observedAttributes() {
    return ['placeholder'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this._placeholder = '';
    this._buttonText = 'Choose Image';
    this._component = null;
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === 'placeholder') {
      this.placeholder = newValue ?? '';
    }
  }
  
  connectedCallback() {
    upgradeProperty(this, 'placeholder');
    upgradeProperty(this, 'buttonText');

    const component = createUploadInput({
      placeholder: this.placeholder,
      buttonText: this.buttonText,
    });
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
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
    `;
    
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(component.element);
    this._component = component;
    
    // Forward custom events
    component.element.addEventListener('image-loaded', (e) => {
      this.dispatchEvent(new CustomEvent('image-loaded', {
        detail: e.detail
      }));
    });
  }

  get placeholder() {
    return this._placeholder || '';
  }

  set placeholder(value) {
    this._placeholder = value ?? '';
    this._component?.setPlaceholder?.(this._placeholder);
  }

  get buttonText() {
    return this._buttonText || 'Choose Image';
  }

  set buttonText(value) {
    this._buttonText = value ?? 'Choose Image';
    this._component?.setButtonText?.(this._buttonText);
  }
  
  getFile() {
    return this._component?.getFile();
  }
  
  clear() {
    this._component?.clear();
  }
}

customElements.define('upload-input', UploadInput);
