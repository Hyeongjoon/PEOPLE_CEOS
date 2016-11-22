$(document).ready(function(){
$('#login').on('click' , function(){
		if($('#id').val().length==0||$('#pwd').val().length==0){
			$("#reg-modal-title").text("로그인 오류");
			$("#reg-modal-content").text("아이디나 비밀번호를 입력해 주세요!"); 
			$('#reg-modal').modal();
		} else{
			$.ajax({
				url: 'http://52.78.208.137/login',
				dataType: 'json',
				type: 'POST',
				data: {
						'id': $("#id").val(),
						'password' : $("#pwd").val(),
				},
				success: function(result) {
				if (result['result'] == true) {
						location.replace('/');
					} else {
						$("#reg-modal-title").text("로그인 오류");
						$("#reg-modal-content").text("아이디나 비밀번호가 틀렸습니다."); 
						$('#reg-modal').modal();
					}
				}
			});
		}
	});
});