import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './setup.js';
import '../src/upload-input.js';

describe('<upload-input>', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('upload-input');
    document.body.append(element);
  });

  afterEach(() => {
    element?.remove();
  });

  it('populates the preview with placeholder when set', async () => {
    const withPlaceholder = document.createElement('upload-input');
    withPlaceholder.setAttribute('placeholder', './placeholder.png');
    document.body.append(withPlaceholder);

    const previewImage = withPlaceholder.shadowRoot.querySelector('.upload-preview-image');
    expect(previewImage?.getAttribute('src')).toBe('./placeholder.png');

    withPlaceholder.remove();
  });

  it('clearing returns to placeholder preview', () => {
    element.setAttribute('placeholder', './placeholder.png');

    const previewImage = element.shadowRoot.querySelector('.upload-preview-image');
    expect(previewImage?.getAttribute('src')).toBe('./placeholder.png');

    element.clear();

    expect(previewImage?.getAttribute('src')).toBe('./placeholder.png');
  });

  it('removing placeholder empties the preview', () => {
    element.setAttribute('placeholder', './placeholder.png');

    const previewImage = element.shadowRoot.querySelector('.upload-preview-image');
    expect(previewImage?.getAttribute('src')).toBe('./placeholder.png');

    element.removeAttribute('placeholder');

    expect(previewImage?.getAttribute('src') || '').toBe('');
  });

  it('uses buttonText when provided before connecting', () => {
    const withButtonText = document.createElement('upload-input');
    withButtonText.buttonText = 'Pick a file';
    document.body.append(withButtonText);

    const button = withButtonText.shadowRoot.querySelector('.upload-button');
    expect(button?.textContent).toBe('Pick a file');

    withButtonText.remove();
  });

  it('updates the button label when buttonText changes', () => {
    const button = element.shadowRoot.querySelector('.upload-button');
    expect(button?.textContent).toBe('Choose Image');

    element.buttonText = 'Upload photo';
    expect(button?.textContent).toBe('Upload photo');
  });
});
