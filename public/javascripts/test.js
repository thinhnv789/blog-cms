var Demo = (function() {
    
        function output(node) {
            var existing = $('#result .croppie-result');
            if (existing.length > 0) {
                existing[0].parentNode.replaceChild(node, existing[0]);
            }
            else {
                $('#result')[0].appendChild(node);
            }
        }
    
        function popupResult(result) {
            var html;
            if (result.html) {
                html = result.html;
            }
            if (result.src) {
                html = '<img src="' + result.src + '" />';
            }
            swal({
                title: '',
                html: true,
                text: html,
                allowOutsideClick: true
            });
            setTimeout(function(){
                $('.sweet-alert').css('margin', function() {
                    var top = -1 * ($(this).height() / 2),
                        left = -1 * ($(this).width() / 2);
    
                    return top + 'px 0 0 ' + left + 'px';
                });
            }, 1);
        }
    
        function demoUpload() {
            var $uploadCrop;
    
            function readFile(input) {
                 if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    
                    reader.onload = function (e) {
                        $('.upload-demo').addClass('ready');
                        $uploadCrop.croppie('bind', {
                            url: e.target.result
                        }).then(function(){
                            console.log('jQuery bind complete');
                        });
                        
                    }
                    
                    reader.readAsDataURL(input.files[0]);
                    // Show popup image crop
                    $('.cropper-popup').click();
                }
                else {
                    swal("Sorry - you're browser doesn't support the FileReader API");
                }
            }
    
            $uploadCrop = $('#upload-demo').croppie({
                viewport: {
                    width: 100,
                    height: 100,
                    type: 'circle'
                },
                enableExif: true
            });
    
            $('#upload').on('change', function () { readFile(this); });
            $('.upload-result').on('click', function (ev) {
                $uploadCrop.croppie('result', {
                    type: 'canvas',
                    size: 'viewport'
                }).then(function (resp) {
                    popupResult({
                        src: resp
                    });
                });
            });
        }
     
    
        function init() {
            demoUpload();
        }
    
        return {
            init: init
        };
    })();
    
    