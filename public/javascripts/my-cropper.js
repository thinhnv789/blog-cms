(function ($) { 
  /*
 * myClass
 */
  this.myCropper = function(options){
  
    /*
    * Variables accessible
    * in the class
    */
    var config = {
        selector  : '#choose-image'
    };
    /*
    * Can access this.method
    * inside other methods using
    * root.method()
    */
    var root = this;
    /*
    * Constructor
    */
    this.construct = function(options){
        $.extend(config , options);
        initHtml(config.selector);
        console.log('config', config);
    };

    /*
    * Public method
    * Can be called outside class
    */
    this.myPublicMethod = function(){
        console.log(config.selector);
        myPrivateMethod();
    };

    /*
    * Init html
    */ 
    var initHtml = function(selector) {
      var html = '<a class="cropper-popup" href="#cropper-modal"></a>';
      html += '<div class="cropper-popup-block mfp-hide" id="cropper-modal">';
      html += '<div class="cropper-block image_container">';
      html += '<div class="toolbar"><button class="toolbar-button" id="crop"><i class="fa fa-crop"></i></button><button class="toolbar-button" id="zoomIn"><i class="fa fa-search-plus"></i></button><button class="toolbar-button" id="zoomOut"><i class="fa fa-search-minus"></i></button><button class="toolbar-button" id="rotateLeft"><i class="fa fa-rotate-left"></i></button><button class="toolbar-button" id="rotateRight"><i class="fa fa-rotate-right"></i></button><button class="toolbar-button" id="submitCrop"><i class="fa fa-check"></i></button></div><img id="image-preview" src="#" alt="your image">';
      html += '<div id="fountainG" style="display: none;"><div id="fountainG_1" class="fountainG"></div><div id="fountainG_2" class="fountainG"></div><div id="fountainG_3" class="fountainG"></div><div id="fountainG_4" class="fountainG"></div><div id="fountainG_5" class="fountainG"></div><div id="fountainG_6" class="fountainG"></div><div id="fountainG_7" class="fountainG"></div><div id="fountainG_8" class="fountainG"></div></div>';
      html += '</div></div>';
      $(html).insertAfter(selector);
      $('.cropper-popup').magnificPopup({
        type: 'inline',
        preloader: false,
        modal: true
      });
      $(selector).change(function() {
        readURL(this);
      })

      // On crop button clicked
      document.getElementById('submitCrop').addEventListener('click', function(){
        /**
         * Show loading when uploading image and hide toolbars
         */
        $('#fountainG').show();
        $('.toolbar').hide();

        var imgurl =  this.cropper.getCroppedCanvas().toDataURL();
        // var img = document.getElementById('image-preview');
        // img.src = imgurl;
        $('#image-preview').attr('src', imgurl)
        // document.getElementById("cropped_result").appendChild(img);
        /* ---------------- SEND IMAGE TO THE SERVER------------------------- */
        this.cropper.getCroppedCanvas().toBlob(function (blob) {
          var formData = new FormData();
          formData.append('croppedImage', blob);
          formData.append('uploadDir', config.uploadDir);
          formData.append('prefixFileName', config.prefixFileName);
          formData.append('thumbWidth', config.thumbWidth);
          formData.append('thumbHeight', config.thumbHeight);
          // Use `jQuery.ajax` method
          $.ajax('/media/upload-image', {
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            // contentType: 'application/x-www-form-urlencoded',
            success: function (res) {
              var res = JSON.parse(res);
              console.log('res', res);
              // Image preview item
              var imageCropped = '<div class="preview-item">';
              imageCropped += '<span class="btn btn-danger btn-xs remove-image" filename='+ res.fileName +'><i class="fa fa-trash"></i></span>';
              imageCropped += '<img class="image-cropped-preview" src="' + res.path + '"/>';
              imageCropped += '</div>';
              // All images preview
              var imagesPreview = document.getElementById('images-preview');
              if (imagesPreview) {
                imagesPreview.innerHTML += imageCropped;
              } else {
                imagePreview = '<div id="images-preview" class="images-preview">';
                imagePreview += imageCropped;
                imagePreview += '</div>';
                // Insert image preview after input
                $(imagePreview).insertAfter( $(config.selector) );
              }

              // Add input value filename in order to post form
              var ipName = $(config.selector).attr('name');
              var inputImgEl = document.getElementById(ipName + 'filename');
              if (inputImgEl) {
                var inputImgVal = inputImgEl.value;
                inputImgVal += ',' + res.fileName;
                inputImgEl.value = inputImgVal;
              } else {
                inputImgEl = '<input type="hidden" id="' + ipName + 'filename' + '" name="' + ipName + '" value="' + res.fileName + '">';
              }
              // Insert input with filename after input file
              $(inputImgEl).insertAfter( $(config.selector) );
              // Hide label browse image
              if (!config.multiple) {
                $(config.selector).attr('disabled', true);
                $(config.selector).prev().hide();
                $(config.selector).hide();
              }

              $('#fountainG').hide();
              $('.toolbar').show();
              $.magnificPopup.close();
            },
            error: function () {
              console.log('Upload error');
            }
          });
        });
        /* ----------------------------------------------------*/
      }.bind(this));

      $(document).on('click', '.remove-image', function() {
        $(this).parent().remove();
        var fileDelete = $(this).attr('filename');
        var ipName = $(config.selector).attr('name');
        var inputImgEl = document.getElementById(ipName + 'filename');
        if (!config.multiple) {
          inputImgEl.remove();
        } else {
          var inputImgVal = inputImgEl.value, i, newVal=[];
          inputImgVal = inputImgVal.replace(','+fileDelete, '');
          inputImgVal = inputImgVal.replace(','+fileDelete + ',', '');
          inputImgVal = inputImgVal.replace(fileDelete, '');
          inputImgEl.value = inputImgVal;
        }
        $('.custom-file-upload').show();
        $(config.selector).val('').attr('disabled', false);
      });
    }

    /**
     * Event on input change
     */
    var readURL = function(input) {
      console.log('read url');
      if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
              $('#image-preview').attr('src', e.target.result)
          };
          reader.readAsDataURL(input.files[0]);
          setTimeout(initCropper, 200);
      }
    }

    var initCropper = function(){
      var image = document.getElementById('image-preview');
      // Destroy cropper before init
      if (this.cropper) {
        this.cropper.destroy();
      }
      this.cropper = new Cropper(image, config.clientOptions);

      // Show popup image crop
      $('.cropper-popup').click();
    }

    /*
    * Private method
    * Can only be called inside class
    */
    var myPrivateMethod = function() {
        console.log('accessed private method');
    };
    /*
    * Pass options when class instantiated
    */
    this.construct(options);
  };

}(jQuery));