function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#image-preview').attr('src', e.target.result)
        };
        reader.readAsDataURL(input.files[0]);
        setTimeout(initCropper, 200);
    }
}
function initCropper(){
    var image = document.getElementById('image-preview');
    var cropper = new Cropper(image, {
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

    cropper.setData({
        width: 320,
        height: 180
    })

    // Show popup image crop
    $('.cropper-popup').click();

    // On crop button clicked
    document.getElementById('submitCrop').addEventListener('click', function(){
        var imgurl =  cropper.getCroppedCanvas().toDataURL();
        console.log('cropper', cropper)
        // var img = document.getElementById('image-preview');
        // img.src = imgurl;
        $('#image-preview').attr('src', imgurl)
        // document.getElementById("cropped_result").appendChild(img);

        /* ---------------- SEND IMAGE TO THE SERVER------------------------- */
        cropper.getCroppedCanvas().toBlob(function (blob) {
            var formData = new FormData();
            formData.append('croppedImage', blob);
            // Use `jQuery.ajax` method
            $.ajax('/media/upload-image', {
              method: "POST",
              data: formData,
              processData: false,
              contentType: false,
              success: function (res) {
                var imageCropped = '<img class="image-cropped-preview" src="' + res + '"/>';
                $(imageCropped).insertAfter( $('#choose-image') );
                $('#choose-image').hide();
                $.magnificPopup.close();
              },
              error: function () {
                console.log('Upload error');
              }
            });
        });
        /* ----------------------------------------------------*/
    })
}

$(function () {
	$('.cropper-popup').magnificPopup({
		type: 'inline',
		preloader: false,
		modal: true
	});
	$(document).on('click', '.popup-modal-dismiss', function (e) {
		e.preventDefault();
		$.magnificPopup.close();
	});
});