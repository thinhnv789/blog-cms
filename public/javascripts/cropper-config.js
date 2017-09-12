function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#image-temp').attr('src', e.target.result)
        };
        reader.readAsDataURL(input.files[0]);
        setTimeout(initCropper, 1000);
    }
}
function initCropper(){
    var image = document.getElementById('image-temp');
    var cropper = new Cropper(image, {
      aspectRatio: 1 / 1,
      minContainerWidth: 600,
      minContainerHeight: 400,
      crop: function(e) {
        console.log(e.detail.x);
        console.log(e.detail.y);
      }
    });

    // On crop button clicked
    // document.getElementById('crop_button').addEventListener('click', function(){
    //     var imgurl =  cropper.getCroppedCanvas().toDataURL();
    //     var img = document.createElement("img");
    //     img.src = imgurl;
    //     document.getElementById("cropped_result").appendChild(img);

    //     /* ---------------- SEND IMAGE TO THE SERVER-------------------------

    //         cropper.getCroppedCanvas().toBlob(function (blob) {
    //               var formData = new FormData();
    //               formData.append('croppedImage', blob);
    //               // Use `jQuery.ajax` method
    //               $.ajax('/path/to/upload', {
    //                 method: "POST",
    //                 data: formData,
    //                 processData: false,
    //                 contentType: false,
    //                 success: function () {
    //                   console.log('Upload success');
    //                 },
    //                 error: function () {
    //                   console.log('Upload error');
    //                 }
    //               });
    //         });
    //     ----------------------------------------------------*/
    // })
}

$(function () {
	$('.image-cropper').magnificPopup({
		type: 'inline',
		preloader: false,
		modal: true
	});
	$(document).on('click', '.popup-modal-dismiss', function (e) {
		e.preventDefault();
		$.magnificPopup.close();
	});
});