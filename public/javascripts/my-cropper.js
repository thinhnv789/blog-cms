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
      html += '<div class="cropper-popup-block mfp-hide" id="cropper-modal"><div class="cropper-block image_container" style="width: 600px; height: 400px; margin: auto;"><div class="toolbar"><button class="toolbar-button" id="crop"><i class="fa fa-crop"></i></button><button class="toolbar-button" id="zoomIn"><i class="fa fa-search-plus"></i></button><button class="toolbar-button" id="zoomOut"><i class="fa fa-search-minus"></i></button><button class="toolbar-button" id="rotateLeft"><i class="fa fa-rotate-left"></i></button><button class="toolbar-button" id="rotateRight"><i class="fa fa-rotate-right"></i></button><button class="toolbar-button" id="submitCrop"><i class="fa fa-check"></i></button></div><img id="image-preview" src="#" alt="your image"></div></div>';
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
        console.log('cropper2', this.cropper)
        var imgurl =  this.cropper.getCroppedCanvas().toDataURL();
        // var img = document.getElementById('image-preview');
        // img.src = imgurl;
        $('#image-preview').attr('src', imgurl)
        // document.getElementById("cropped_result").appendChild(img);
        /* ---------------- SEND IMAGE TO THE SERVER------------------------- */
        this.cropper.getCroppedCanvas().toBlob(function (blob) {
          var formData = new FormData();
          formData.append('croppedImage', blob);
          formData.append('uploadDir', '/media/images/');
          formData.append('prefixFileName', 'post');
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
              imageCropped += '<span class="btn btn-danger btn-xs remove-image"><i class="fa fa-trash"></i></span>';
              imageCropped += '<img class="image-cropped-preview" src="' + res.path + '"/>';
              imageCropped += '</div>';
              // All images preview
              var imagePreview = '<div class="images-preview">';
              imagePreview += imageCropped;
              imagePreview += '</div>';
              $(config.selector).attr('disabled', true);//.val(res.fileName);
              // Add input value filename in order to post form
              var ipName = $(config.selector).attr('name');
              var inputImgEl = document.getElementById(ipName + 'filename');
              if (inputImgEl) {
                console.log('exist', inputImgEl);
              } else {
                console.log('not exits');
                inputImgEl = '<input type="hidden" id="' + ipName + 'filename' + '" name="' + ipName + '" value="' + res.fileName + '">';
              }
              // Insert image preview after input
              $(imagePreview).insertAfter( $(config.selector) );
              // Insert input with filename after input file
              $(inputImgEl).insertAfter( $(config.selector) );
              // Hide label browse image
              $(config.selector).prev().hide();
              $(config.selector).hide();
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
        console.log('remove');
        $(this).parent().remove();
        var ipName = $(config.selector).attr('name');
        var inputImgEl = document.getElementById(ipName + 'filename');
        inputImgEl.remove();
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
      this.cropper = new Cropper(image, {
      //   aspectRatio: 1 / 1,
        viewMode: 1,
        cropBoxResizable: false,
        minContainerWidth: 600,
        minContainerHeight: 400,
        crop: function(e) {
          console.log(e.detail.x);
          console.log(e.detail.y);
        }
      });

      this.cropper.setData({
          width: 320,
          height: 180
      })

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