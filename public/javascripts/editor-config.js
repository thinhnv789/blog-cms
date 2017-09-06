$(document).ready(function() {
	$('#test-editor').froalaEditor({
		heightMin: 280,
		// Button show xs
		toolbarButtonsXS: ['bold', 'italic', 'underline', 'fontFamily', 'fontSize', '-', 'insertTable', 'insertImage', 'undo', 'redo'],
		// Set the image upload URL.
		imageUploadURL: '/media/upload_image',
		// Load all images from folder
		imageManagerLoadURL: '/media/load_images'
	});
});