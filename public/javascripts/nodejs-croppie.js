var NodejsCroppie = (function() {
    function showPopup() {
      // Show popup image crop
      $('#show-croppie-modal').click();
    }

    function demoUpload() {
        var $uploadCrop;

        function readFile(input) {
             if (input.files && input.files[0]) {
                var reader = new FileReader();
                
                reader.onload = function (e) {
                    // $('.upload-demo').addClass('ready');
                    $uploadCrop.croppie('bind', {
                        url: e.target.result
                    }).then(function(){
                        showPopup();
                    });
                    
                }
                
                reader.readAsDataURL(input.files[0]);

                /**
                 * Show popup crop image
                 */
                $('.croppie-popup').removeClass('popup-hidden');
            } else {
                console.log("Sorry - you're browser doesn't support the FileReader API");
            }
        }

        $uploadCrop = $('#upload-demo').croppie({
            viewport: {
                width: 300,
                height: 300,
                type: 'square'
            },
            boundary: { width: 400, height: 400 },
            enableExif: true
        });

        $('#upload').on('change', function () { readFile(this); });

        /**
         * Click submit
         */
        $('#submitCrop').on('click', function (e) {
            /**
             * Upload image to server
             */
            $uploadCrop.croppie('result', {
                type: 'blob',
                size: 'viewport'
            }).then(function(blob) {
                var formData = new FormData();
                formData.append('croppedImage', blob);
                formData.append('uploadDir', '/media/images/slider/');
                formData.append('prefixFileName', 'test');
                formData.append('thumbWidth', 300);
                formData.append('thumbHeight', 300);
                // Use `jQuery.ajax` method
                $.ajax('/media/upload-image', {
                  method: "POST",
                  data: formData,
                  processData: false,
                  contentType: false,
                  success: function (res) {
                      
                  }
                })
            })
        })
    }

    function init() {
        demoUpload();
    }

    return {
        init: init
    };
})();
    
    