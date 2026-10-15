/**
 * Classic Mun Bricks - Django Admin Multi-File Batch Image Upload with Append Support
 *
 * Ensures that subsequent file-picker selections APPEND to previously selected files
 * rather than replacing them, using the native DataTransfer API.
 * Provides a real-time list of queued files with thumbnails, sizes, and remove buttons.
 */
(function () {
  'use strict';

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function initBatchUploader() {
    const input = document.getElementById('id_images');
    if (!input || input.dataset.batchUploaderInitialized) {
      return;
    }
    input.dataset.batchUploaderInitialized = 'true';

    // Accumulated DataTransfer storage
    let dt = new DataTransfer();
    const objectUrls = [];

    function cleanupUrls() {
      while (objectUrls.length > 0) {
        URL.revokeObjectURL(objectUrls.pop());
      }
    }

    // Build the enhanced UI container
    const wrapper = document.createElement('div');
    wrapper.className = 'batch-upload-wrapper';

    // Dropzone card
    const dropzone = document.createElement('div');
    dropzone.className = 'batch-upload-dropzone';
    dropzone.innerHTML = `
      <span class="batch-upload-dropzone-icon">📷</span>
      <div class="batch-upload-dropzone-text">Click to choose project images or drag &amp; drop files here</div>
      <div class="batch-upload-dropzone-subtext">You can select multiple files at once, and reopen the picker anytime to append more.</div>
    `;

    // Queue preview container (hidden until files are selected)
    const queue = document.createElement('div');
    queue.className = 'batch-upload-queue';
    queue.style.display = 'none';

    const queueHeader = document.createElement('div');
    queueHeader.className = 'batch-upload-queue-header';
    queueHeader.innerHTML = `
      <div class="batch-upload-queue-count">
        <span>Pending Uploads</span>
        <span class="batch-upload-queue-badge" id="batch-upload-count-badge">0</span>
      </div>
      <button type="button" class="batch-upload-add-more-btn" id="batch-upload-add-more-btn">+ Add More Files</button>
    `;

    const fileList = document.createElement('ul');
    fileList.className = 'batch-upload-file-list';

    queue.appendChild(queueHeader);
    queue.appendChild(fileList);

    // Insert wrapper after the input
    input.parentNode.insertBefore(wrapper, input.nextSibling);
    wrapper.appendChild(dropzone);
    wrapper.appendChild(queue);

    // Style the native input so it sits neatly
    input.style.marginTop = '6px';
    input.style.marginBottom = '6px';

    function renderQueue() {
      cleanupUrls();
      fileList.innerHTML = '';

      const files = dt.files;
      const count = files.length;
      const badge = document.getElementById('batch-upload-count-badge');
      if (badge) {
        badge.textContent = count;
      }

      if (count === 0) {
        queue.style.display = 'none';
        return;
      }

      queue.style.display = 'block';

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const item = document.createElement('li');
        item.className = 'batch-upload-file-item';

        const info = document.createElement('div');
        info.className = 'batch-upload-file-info';

        // Thumbnail preview
        const img = document.createElement('img');
        img.className = 'batch-upload-thumbnail';
        if (file.type && file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file);
          objectUrls.push(url);
          img.src = url;
          img.alt = file.name;
        } else {
          img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"><rect width="44" height="44" fill="%23eee"/><text x="50%" y="50%" fill="%23888" font-size="10" text-anchor="middle" dy=".3em">FILE</text></svg>';
        }

        const namesWrap = document.createElement('div');
        namesWrap.className = 'batch-upload-file-names';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'batch-upload-filename';
        nameSpan.textContent = file.name;
        nameSpan.title = file.name;

        const sizeSpan = document.createElement('span');
        sizeSpan.className = 'batch-upload-filesize';
        sizeSpan.textContent = formatBytes(file.size);

        namesWrap.appendChild(nameSpan);
        namesWrap.appendChild(sizeSpan);

        info.appendChild(img);
        info.appendChild(namesWrap);

        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'batch-upload-remove-btn';
        removeBtn.innerHTML = '&times;';
        removeBtn.title = `Remove ${file.name}`;
        removeBtn.setAttribute('aria-label', `Remove ${file.name}`);

        const fileIndex = i;
        removeBtn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          removeFileAt(fileIndex);
        });

        item.appendChild(info);
        item.appendChild(removeBtn);
        fileList.appendChild(item);
      }
    }

    function removeFileAt(indexToRemove) {
      const newDt = new DataTransfer();
      const currentFiles = dt.files;
      for (let i = 0; i < currentFiles.length; i++) {
        if (i !== indexToRemove) {
          newDt.items.add(currentFiles[i]);
        }
      }
      dt = newDt;
      input.files = dt.files;
      renderQueue();
    }

    function addFiles(newFiles) {
      if (!newFiles || newFiles.length === 0) return;

      const existingSignatures = new Set();
      for (let i = 0; i < dt.files.length; i++) {
        const f = dt.files[i];
        existingSignatures.add(`${f.name}-${f.size}-${f.lastModified}`);
      }

      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        const signature = `${file.name}-${file.size}-${file.lastModified}`;
        if (!existingSignatures.has(signature)) {
          dt.items.add(file);
          existingSignatures.add(signature);
        }
      }

      // Sync with input
      input.files = dt.files;
      renderQueue();
    }

    // Intercept native input change: append instead of replace
    input.addEventListener('change', function () {
      if (input.files && input.files.length > 0) {
        addFiles(input.files);
      }
    });

    // Dropzone click triggers file picker
    dropzone.addEventListener('click', function (e) {
      input.click();
    });

    // Add More button click triggers file picker
    document.addEventListener('click', function (e) {
      if (e.target && e.target.id === 'batch-upload-add-more-btn') {
        e.preventDefault();
        input.click();
      }
    });

    // Drag and drop handlers on the dropzone
    ['dragenter', 'dragover'].forEach(function (eventName) {
      dropzone.addEventListener(eventName, function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('is-dragover');
      });
    });

    ['dragleave', 'drop'].forEach(function (eventName) {
      dropzone.addEventListener(eventName, function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('is-dragover');
      });
    });

    dropzone.addEventListener('drop', function (e) {
      if (e.dataTransfer && e.dataTransfer.files) {
        addFiles(e.dataTransfer.files);
      }
    });

    // Clean up on window unload
    window.addEventListener('beforeunload', cleanupUrls);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBatchUploader);
  } else {
    initBatchUploader();
  }
})();
