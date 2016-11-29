$(document).ready(function(){
	$('#rdc-reg').on('click' , function(){
		$(':input:radio[id="kind"]').prop('checked' , false);
		$(':input:radio[id="kind2"]').prop('checked' , false);
		$('#rdc-reg-input-modal').modal('show');
		
	});
		
	$('#modal-date-picker-container').datepicker({
		container: '#modal-date-picker-container',
		endDate: "0d",
		orientation: "bottom right",
	    startView: 0,
	    autoclose: true,
	    format: 'yyyy-mm-dd',
	});
	
	$('#find_origin').on('click' , function(){
		$('#find-origin-modal #find_origin_content tr:not(:first)').remove();
		$('#find-origin-modal').modal('show');
	});
	
	$('#find_origin_btn').on('click' , function(){
		if($('#find-origin-modal #find_origin').val().length == 0){
			$("#common-modal-title").text("입력 오류");
			$("#common-modal-content").text("조금이라도 적어라 이자식아"); 
			$("#common-modal").modal('show');
		}else{
			$.ajax({url: 'http://52.78.208.137/rdc/find_origin',
				dataType: 'json',
				type: 'POST',
				data: {
						'origin_name': $("#find-origin-modal #find_origin").val(),
				},
				success: function(result) {
					$('#find-origin-modal #find_origin').val('');
					$('#find-origin-modal #find_origin_content tr:not(:first)').remove();
					if(result==false){
						$("#common-modal-title").text("결과 없음");
						$("#common-modal-content").text("찾으시는 혈액원은 존재하지 않습니다."); 
						$("#common-modal").modal('show');
					} else{
						for(var i = 0 ; i < result.length ; i++){
						 $('#find-origin-modal #find_origin_content > tbody:last').append('<tr><td scope="row">'+(i+1)+'</td><td>' + result[i].origin_name + '</td><td>'+result[i].origin_num+'</td><td><input type="radio" name="bdc-pass-radio" id="" value="'+result[i].oid+'%&!'+result[i].origin_name+'"></td></tr>');
						}
					}
				}
			});
		}
	});
	$('#origin-find-submit-btn').on('click' , function(){
		if($(':input:radio[name=bdc-pass-radio]:checked').val()==null){
		$("#common-modal-title").text("선택 오류");
		$("#common-modal-content").text("혈액원을 선택해 주세요"); 
		$("#common-modal").modal('show');
		} else {
			var result = $(':input:radio[name=bdc-pass-radio]:checked').val().split('%&!');
			$('#rdc-reg-input-modal #origin').val(result[1]);
			$('#rdc-reg-input-modal #origin_id').val(result[0]);
			$('#find-origin-modal').modal('hide');
		}
	});
	
	$('#bdc-reg-input-modal-btn').on('click' , function(){
		var regExp = /^[0-9]+$/;
		if($('#rdc-reg-input-modal #bd_date').val() == ''){
			$("#common-modal-title").text("선택 오류");
			$("#common-modal-content").text("헌혈날짜를 선택해 주세요"); 
			$("#common-modal").modal('show');
		} else if($('#rdc-reg-input-modal #origin').val() == ''){
			$("#common-modal-title").text("선택 오류");
			$("#common-modal-content").text("혈액원을 선택해 주세요"); 
			$("#common-modal").modal('show');
		} else if($('#rdc-reg-input-modal #origin_id').val() == ''){
			$("#common-modal-title").text("선택 오류");
			$("#common-modal-content").text("혈액원을 선택해 주세요"); 
			$("#common-modal").modal('show');
		} else if($('input:radio[name=bdc_type]:checked').val()==null){
			$("#common-modal-title").text("선택 오류");
			$("#common-modal-content").text("헌혈종류를 선택해 주세요"); 
			$("#common-modal").modal('show');
		} else if($('#rdc-reg-input-modal #origin_id').val() == ''){
			$("#common-modal-title").text("입력 오류");
			$("#common-modal-content").text("증서번호를 입력해 주세요"); 
			$("#common-modal").modal('show');
		}else if(!regExp.test($('#rdc-reg-input-modal #bdc_num').val())){
			$("#common-modal-title").text("입력 오류");
			$("#common-modal-content").text("증서번호에는 숫자만 입력 가능합니다."); 
			$("#common-modal").modal('show');
		} else{
			$('#rdc-reg-modal').modal('show');
		}
	});
	
	$('#bdc_reg_submit').on('click' , function(){
		$.ajax({url: 'http://52.78.208.137/rdc/register',
			dataType: 'json',
			type: 'POST',
			data: {
					'kind': $('input:radio[name=bdc_type]:checked').val(),
					'bd_date': $('#rdc-reg-input-modal #bd_date').val(),
					'bdc_num' : $('#rdc-reg-input-modal #bdc_num').val(),
					'or_id' : $('#rdc-reg-input-modal #origin_id').val(),
					'agree' : 1
			},
			success: function(result) {
				$('#rdc-reg-input-modal').modal('hide');
				$('#rdc-reg-modal').modal('hide');
				if(result==false){
					$("#reload-modal-title").text("등록 오류");
					$("#reload-modal-content").text("헌혈증 등록중 오류가 발생했습니다 잠시후 시도해 주세요."); 
					$("#reload-modal").modal('show');
				} else {
					$("#reload-modal-title").text("등록 완료");
					$("#reload-modal-content").text("헌혈증 등록이 완료 됐습니다."); 
					$("#reload-modal").modal('show');
				}
			}
		});
		
	});
	
	$('#bdc_not_reg_submit').on('click' , function(){
		$.ajax({url: 'http://52.78.208.137/rdc/register',
			dataType: 'json',
			type: 'POST',
			data: {
					'kind': $('input:radio[name=bdc_type]:checked').val(),
					'bd_date': $('#rdc-reg-input-modal #bd_date').val(),
					'bdc_num' : $('#rdc-reg-input-modal #bdc_num').val(),
					'or_id' : $('#rdc-reg-input-modal #origin_id').val(),
					'agree' : 0
			},
			success: function(result) {
				$('#rdc-reg-input-modal').modal('hide');
				$('#rdc-reg-modal').modal('hide');
				if(result==false){
					$("#reload-modal-title").text("등록 오류");
					$("#reload-modal-content").text("헌혈증 등록중 오류가 발생했습니다 잠시후 시도해 주세요."); 
					$("#reload-modal").modal('show');
				} else {
					$("#reload-modal-title").text("등록 완료");
					$("#reload-modal-content").text("헌혈증 등록이 완료 됐습니다."); 
					$("#reload-modal").modal('show');
				}
			}
		});
	});
	
	$('#rdc-pass-modal #find-people').on('click' , function(){
		if($('#rdc-pass-modal #find-input-name').val().length==0){
			$("#common-modal-title").text("입력 오류");
			$("#common-modal-content").text("입력오류 한글자라도 적어라"); 
			$("#common-modal").modal('show');
		} else{
			$.ajax({url: 'http://52.78.208.137/rdc/find_people',
				dataType: 'json',
				type: 'POST',
				data: {
						'name': $("#rdc-pass-modal #find-input-name").val(),
				},
				success: function(result) {
					$('#rdc-pass-modal #find-input-name').val('');
					$('#rdc-pass-modal #find-people-content tr:not(:first)').remove();
					if(result==false){
						$("#common-modal-title").text("결과 없음");
						$("#common-modal-content").text("찾으시는 사람은 존재하지 않습니다."); 
						$("#common-modal").modal('show');
					} else{
						for(var i = 0 ; i < result.length ; i++){
						 $('#rdc-pass-modal #find-people-content > tbody:last').append('<tr><td scope="row">'+result[i].name+'</td><td>'+ result[i].phone_number + '</td><td><input type="radio" name="find-people-radio" id="" value="'+result[i].uid+'"></td></tr>');
						}
					}
				}
			});
		}
	});

	$('#bdc-pass-modal-btn').on('click' , function(){
		if($(':input:radio[name=find-people-radio]:checked').val()==null){
			$("#common-modal-title").text("선택 오류");
			$("#common-modal-content").text("전달할 사람을 선택해주세요"); 
			$("#common-modal").modal('show');
		} else if($('#rdc-pass-modal #modal-bid').val()==null){
			$("#common-modal-title").text("내부 오류");
			$("#common-modal-content").text("헌혈증 다시 선택해주세요"); 
			$("#common-modal").modal('show');
		} else{
			$('#rdc-pass-confirm-modal').modal('show');
		}
	});
	
	$('#bdc-pass-submit').on('click' , function(){
		$.ajax({url: 'http://52.78.208.137/rdc/trans_register',
			dataType: 'json',
			type: 'POST',
			data: {
					'bdc_id': $('#rdc-pass-modal #modal-bid').val(),
					'to_id' : $(':input:radio[name=find-people-radio]:checked').val()
			},
			success: function(result) {
				$('#rdc-pass-modal').modal('hide');
				$('#rdc-pass-confirm-modal').modal('hide');
				if(result==false){
					$("#reload-modal-title").text("전달 하기 오류");
					$("#reload-modal-content").text("전달하기 중 오류가 발생했습니다 잠시후 시도해 주세요."); 
					$("#reload-modal").modal('show');
				} else{
					$("#reload-modal-title").text("전달 하기 완료");
					$("#reload-modal-content").text("전달하기가 완료 됐습니다."); 
					$("#reload-modal").modal('show');
				}
			}
		});
	});
	$('#cancel-trans-btn').on('click' , function(){
		$.ajax({url: 'http://52.78.208.137/rdc/trans_cancel',
			dataType: 'json',
			type: 'POST',
			data: {
					'bdc_id': $('#cancel-modal #cancel-modal-bid').val()
			},
			success: function(result) {
				$('#cancel-modal').modal('hide');
				if(result==false){
					$("#reload-modal-title").text("전달 취소 오류");
					$("#reload-modal-content").text("전달하기 취소 중 오류가 발생했습니다 잠시후 시도해 주세요."); 
					$("#reload-modal").modal('show');
				} else{
					$("#reload-modal-title").text("전달 취소 완료");
					$("#reload-modal-content").text("전달하기 취소가 완료 됐습니다."); 
					$("#reload-modal").modal('show');
				}
			}
		});
	});
	
	$('#pass-ok-trans-btn').on('click' , function(){
		$.ajax({url: 'http://52.78.208.137/rdc/pass_ok',
			dataType: 'json',
			type: 'POST',
			data: {
					'bdc_id': $('#pass-ok-modal #pass-ok-modal-bid').val(),
					'from_id' : $('#pass-ok-modal #pass-ok-modal-from-id').val()
			},
			success: function(result) {
				$('#pass-ok-modal').modal('hide');
				if(result==false){
					$("#reload-modal-title").text("전달 받기 오류");
					$("#reload-modal-content").text("전달 받기 중 오류가 발생했습니다 잠시후 시도해 주세요."); 
					$("#reload-modal").modal('show');
				} else{
					$("#reload-modal-title").text("전달 받기 완료");
					$("#reload-modal-content").text("전달 받기가 완료 됐습니다."); 
					$("#reload-modal").modal('show');
				}
			}
		});
	});
	
	$('#pass-cancel-trans-btn').on('click' , function(){
		$.ajax({url: 'http://52.78.208.137/rdc/pass_cancel',
			dataType: 'json',
			type: 'POST',
			data: {
					'bdc_id': $('#pass-cancel-modal #pass-cancel-modal-bid').val(),
					'from_id' : $('#pass-cancel-modal #pass-cancel-modal-from-id').val()
			},
			success: function(result) {
				$('#pass-cancel-modal').modal('hide');
				if(result==false){
					$("#reload-modal-title").text("전달 거절 오류");
					$("#reload-modal-content").text("전달 거절 중 오류가 발생했습니다 잠시후 시도해 주세요."); 
					$("#reload-modal").modal('show');
				} else{
					$("#reload-modal-title").text("전달 거절 완료");
					$("#reload-modal-content").text("전달 거절이 완료 됐습니다."); 
					$("#reload-modal").modal('show');
				}
			}
		});
	});
});

function use(bid){
	
}

function pass(bid){
	$('#rdc-pass-modal').modal('show');
	$('#rdc-pass-modal #modal-bid').val(bid);
}

function cancle(bid){
	$('#cancel-modal').modal('show');
	$('#cancel-modal #cancel-modal-bid').val(bid);
}

function passOk(bid , fromId){
	$('#pass-ok-modal #pass-ok-modal-bid').val(bid);
	$('#pass-ok-modal #pass-ok-modal-from-id').val(fromId);
	$('#pass-ok-modal').modal('show');
}

function passCancel(bid , fromId){
	$('#pass-cancel-modal #pass-cancel-modal-bid').val(bid);
	$('#pass-cancel-modal #pass-cancel-modal-from-id').val(fromId);
	$('#pass-cancel-modal').modal('show');
}