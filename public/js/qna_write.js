$(document).ready(function(){
	$('#qna_register').on('click' , function(){
		if($('#input-title').val().trim().length==0){
			$('#common-modal-title').text('입력 오류');
			$('#common-modal-content').text('제목을 입력해 주세요');
			$('#common-modal').modal('show');
		} else if($('#input-content').val().trim().length==0){
			$('#common-modal-title').text('입력 오류');
			$('#common-modal-content').text('내용을 입력해 주세요');
			$('#common-modal').modal('show');
		} else{
			$.ajax({url: 'http://52.78.208.137/commu/register',
				dataType: 'json',
				type: 'POST',
				data: {
						'title': $('#input-title').val().trim(),
						'content': $('#input-content').val().trim()
				},
				success: function(result) {
					if(result==false || result == undefined){
						$('#common-modal-title').text('글 등록 오류');
						$('#common-modal-content').text('내부 서버오류 잠시후에 시도해주세요');
						$('#common-modal').modal('show');
					} else {
						location.replace("/commu");
					}
				}
			});
		}
	});
});
