$(document).ready(function(){
	$('#login').on('click' , function(){
		if($('#id').val().length==0||$('#pwd').val().length==0){
			$("#index-modal-title").text("로그인 오류");
			$("#index-modal-content").text("아이디나 비밀번호를 입력해 주세요!"); 
			$('#index-modal').modal();
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
						$(".log-form").hide();
						$("#user-name").text($('#id').val());
						$(".user-form").show();
						
						
					} else {
						$("#index-modal-title").text("로그인 오류");
						$("#index-modal-content").text("아이디나 비밀번호가 틀렸습니다."); 
						$('#index-modal').modal();
					}
				}
			});
		}
	});
	$('#logout').on('click' , function(){
		location.replace('/logout');
	});
	
});
