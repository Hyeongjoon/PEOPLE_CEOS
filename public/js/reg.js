$(document).ready(function(){
	
	$('.input-group.date').datepicker({
		container: '#datepicker-container',
		endDate: "0d",
		orientation: "bottom right",
	    startView: 2,
	    autoclose: true,
	    format: 'yyyy-mm-dd',
	    defaultViewDate: { year: 1991, month: 01, day: 20 }
	});
	
		
	$('#sign_up').on('click' , function(){
		
		//$('#sign_up').button('loading'); //이거 나중에 해결할것
		


		var idRegExp =  /[a-z]|[0-9]/gi;
		var passRegExp = /^[a-zA-Z0-9!@#$%^&*()?_~]{6,15}$/;
		var nameRegExp = /^[\uac00-\ud7a3]{2,5}$/;
		var emailRegExp = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
		
		
		
		if((($("#input-id").val()).replace(idRegExp , ''))!=''||$("#input-id").val().length<6 ||$("#input-id").val().length>20){
			$("#reg-modal-title").text("아이디 오류");
			$("#reg-modal-content").text("아이디는  숫자와 영문자를 포함한 6자리 이상 20자리 이하만 사용가능합니다."); 
			$('#reg-modal').modal();
		} else if(!($("#inputPW").val()==$("#input-pw-confirm").val())){
			$("#reg-modal-title").text("비밀번호 오류");
			$("#reg-modal-content").text("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
			$('#reg-modal').modal(); 
		} else if(!passRegExp.test($("#inputPW").val())){
			$("#reg-modal-title").text("비밀번호 오류");
			$("#reg-modal-content").text("비밀번호는 숫자, 영문, 특수문자 만 사용할수 있으며 6~15자리를 사용해야 합니다.");
			$('#reg-modal').modal(); 
		} else if(!nameRegExp.test($("#input-name").val())){
			$("#reg-modal-title").text("이름 입력 오류");
			$("#reg-modal-content").text("올바른 이름을 입력해 주세요.");
			$('#reg-modal').modal(); 
		} else if(!emailRegExp.test($("#input-email").val())){
			$("#reg-modal-title").text("이메일 입력 오류");
			$("#reg-modal-content").text("올바른 이메일을 입력해 주세요.");
			$('#reg-modal').modal();
		} else if($("#input-phone1").val().length!=3||$("#input-phone2").val().length<3||$("#input-phone3").val().length<3
				||$("#input-phone2").val().length>4||$("#input-phone3").val().length>4){
			$("#reg-modal-title").text("휴대폰 번호 입력 오류");
			$("#reg-modal-content").text("올바른 휴대폰 번호를 입력해 주세요.");
			$('#reg-modal').modal();
		} else if(!$("#input-birthdate").val()){
			$("#reg-modal-title").text("생년월일 입력 오류");
			$("#reg-modal-content").text("생년월일을 선택해 주세요.");
			$('#reg-modal').modal();
		} else if(!$(":input:radio[name=gender-select]:checked").val()){
			$("#reg-modal-title").text("성별 입력 오류");
			$("#reg-modal-content").text("성별을 선택해 주세요.");
			$('#reg-modal').modal();
		} else{
			$.ajax({
				url: 'http://52.78.208.137/register',
				dataType: 'json',
				type: 'POST',
				data: {
						'id': $("#input-id").val(),
						'password' : $("#inputPW").val(),
						'passwordcon' : $("#input-pw-confirm").val(),
						'name' : $("#input-name").val(),
						'email' : $("#input-email").val(),
						'phone_number' :$("#input-phone1").val()+ $("#input-phone2").val()+$("#input-phone3").val(),
						'birth_date' :$("#input-birthdate").val(),
						'gender' : $(":input:radio[name=gender-select]:checked").val()
				},
				success: function(result) {
				if (result['result'] == true) {
					location.replace('/success_mail');
					} else if(result['result'] == 'exsitId'){
						$("#reg-modal-title").text("ID가 존재합니다.");
						$("#reg-modal-content").text("이미 가입된 ID 입니다. 다른 ID를 이용해 주세요.");
						$('#reg-modal').modal();	
					} else if(result['result'] == 'exsitEmail'){
						$("#reg-modal-title").text("Email이 존재합니다.");
						$("#reg-modal-content").text("이미 가입된 Email 입니다. 다른 Email를 이용해 주세요.");
						$('#reg-modal').modal();	
					} else{
						$("#reg-modal-title").text("내부 서버 오류");
						$("#reg-modal-content").text("알수 없는 오류 입니다. 잠시후에 다시 시도해주세요");
						$('#reg-modal').modal();	
					}
				}
			});
		}
	});
});
