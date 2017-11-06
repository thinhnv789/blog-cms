function CropperEditor(config) {
    this.config = config;

    this.init = function() {
        /**
         * Selector input file
         */
        this.selector = document.getElementById(this.config.selector);
        /**
         * Init popup cropper editor
         */
        this.initImageCrop(this.selector);
    }

    /**
     * Function init popup
     */
    this.initImageCrop = function(selector) {
        if (selector) {
            selector.addEventListener('change', function(e) {
                this.readURL(e.target);
            }.bind(this));
        }
    }

    /**
     * Event on input change
     */
    this.readURL = function(input) {
       
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var parentEl, popup, popupOverlay,
                    popupContainer, popupContent, imageCrop,
                    toolbar, cropBtn, zoomInBtn, zoomOutBtn,
                    rotateLef, rotateRight, submitCrop;
                
                popup = document.createElement('div');
                popup.className = 'cropper-editor-popup';

                popupOverlay = document.createElement('div');
                popupOverlay.className = 'cropper-editor-popup-overlay';

                popupContainer = document.createElement('div');
                popupContainer.className = 'cropper-editor-popup-container';

                popupContent = document.createElement('div');
                popupContent.className = 'cropper-editor-popup-content';

                /**
                 * Toolbar buttons
                 */
                toolbar = document.createElement('div');
                toolbar.className = 'cropper-editor-toolbar';

                var toolbars = this.config.toolbars;
                if (toolbars) {
                    /**
                     * Button crop
                     */
                    if (toolbars.crop) {
                        var icon = document.createElement('i');
                        icon.className = 'fa fa-crop';

                        cropBtn = document.createElement('button');
                        cropBtn.id = 'crop';
                        cropBtn.className = 'toolbar-button';

                        cropBtn.appendChild(icon);
                        toolbar.appendChild(cropBtn);
                    }
                    /**
                     * Button zoomIn
                     */
                    if (toolbars.zoomIn) {
                        var icon = document.createElement('i');
                        icon.className = 'fa fa-search-plus';

                        zoomInBtn = document.createElement('button');
                        zoomInBtn.id = 'zoomIn';
                        zoomInBtn.className = 'toolbar-button';

                        zoomInBtn.appendChild(icon);
                        toolbar.appendChild(zoomInBtn);
                    }
                    /**
                     * Button zoomIn
                     */
                    if (toolbars.zoomOut) {
                        var icon = document.createElement('i');
                        icon.className = 'fa fa-search-minus';

                        zoomOutBtn = document.createElement('button');
                        zoomOutBtn.id = 'zoomOut';
                        zoomOutBtn.className = 'toolbar-button';

                        zoomOutBtn.appendChild(icon);
                        toolbar.appendChild(zoomOutBtn);
                    }
                }

                /**
                 * Button submit: always exist
                 */
                var icon = document.createElement('i');
                icon.className = 'fa fa-check';

                submitCrop = document.createElement('button');
                submitCrop.id = 'submitCrop';
                submitCrop.className = 'toolbar-button';
                submitCrop.onclick = function() {
                    this.submitCrop();
                }.bind(this);

                submitCrop.appendChild(icon);
                toolbar.appendChild(submitCrop);

                imageCrop = document.createElement('img');
                imageCrop.id = 'image-crop'
                imageCrop.src = e.target.result;

                /**
                 * 
                 */
                popup.appendChild(popupOverlay);
                popup.appendChild(popupContainer);
                popupContainer.appendChild(popupContent);
                popupContent.appendChild(toolbar);
                popupContent.appendChild(imageCrop);

                parentEl = this.selector.parentNode;
                parentEl.insertBefore(popup, this.selector);
            }.bind(this);
            reader.readAsDataURL(input.files[0]);
            /**
             * Init cropper
             */
            setTimeout(function() {
                this.initCropper(this.config.clientOptions);
            }.bind(this), 200);
        }
    }

    /**
     * Init cropper using cropperjs lib
     */
    this.initCropper = function(config) {
        var imageCrop = document.getElementById('image-crop');
        // Destroy cropper before init
        if (this.cropper) {
          this.cropper.destroy();
        }
        this.cropper = new Cropper(imageCrop, config);
    }.bind(this);

    /**
     * Get data cropped and submit to server store
     */
    this.submitCrop = function() {
        this.cropper.getCroppedCanvas().toBlob(function (blob) {
            var formData = new FormData();
            formData.append('croppedImage', blob);
            formData.append('uploadDir', config.uploadDir);
            formData.append('prefixFileName', config.prefixFileName);
            formData.append('thumbWidth', config.thumbWidth);
            formData.append('thumbHeight', config.thumbHeight);
           
            /**
             * Post data form to server using http
             */
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/media/upload-image', true);
            xhr.onload = function () {
                // do something to response
                var data = JSON.parse(this.responseText);
                console.log('response', data.path);
            };
            xhr.send(formData);
            // $.ajax('/media/upload-image', {
            //   method: "POST",
            //   data: formData,
            //   processData: false,
            //   contentType: false,
            //   success: function (res) {
            //     var res = JSON.parse(res);
            //     console.log('res', res);
            //     // Image preview item
            //     var imageCropped = '<div class="preview-item">';
            //     imageCropped += '<span class="btn btn-danger btn-xs remove-image" filename='+ res.fileName +'><i class="fa fa-trash"></i></span>';
            //     imageCropped += '<img class="image-cropped-preview" src="' + res.path + '"/>';
            //     imageCropped += '</div>';
            //     // All images preview
            //     var imagesPreview = document.getElementById('images-preview');
            //     if (imagesPreview) {
            //       imagesPreview.innerHTML += imageCropped;
            //     } else {
            //       imagePreview = '<div id="images-preview" class="images-preview">';
            //       imagePreview += imageCropped;
            //       imagePreview += '</div>';
            //       // Insert image preview after input
            //       $(imagePreview).insertAfter( $(config.selector) );
            //     }
  
            //     // Add input value filename in order to post form
            //     var ipName = $(config.selector).attr('name');
            //     var inputImgEl = document.getElementById(ipName + 'filename');
            //     if (inputImgEl) {
            //       var inputImgVal = inputImgEl.value;
            //       inputImgVal += ',' + res.fileName;
            //       inputImgEl.value = inputImgVal;
            //     } else {
            //       inputImgEl = '<input type="hidden" id="' + ipName + 'filename' + '" name="' + ipName + '" value="' + res.fileName + '">';
            //     }
            //     // Insert input with filename after input file
            //     $(inputImgEl).insertAfter( $(config.selector) );
            //     // Hide label browse image
            //     if (!config.multiple) {
            //       $(config.selector).attr('disabled', true);
            //       $(config.selector).prev().hide();
            //       $(config.selector).hide();
            //     }
  
            //     $('#fountainG').hide();
            //     $('.toolbar').show();
            //     $.magnificPopup.close();
            //   },
            //   error: function () {
            //     console.log('Upload error');
            //   }
            // });
          });
    }
}