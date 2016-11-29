$(document).ready(function(){
	$('.donor-btn').on('click' , function(){
		$('#donor-modal').modal('show');
	});
	
	$('.detail-btn').on('click' , function(){
		$('#donor-detail-modal').modal('show');
	});
	
	$('.modal-donor-btn').on('click' , function(){
		$('#donor-detail-modal').modal('hide');
		$('#donor-modal').modal('show');
	});
	
	$('.comple-btn').on('click' , function(){
		$('#donor-comple-modal').modal('show');
	});
	
	$('.ing-btn').on('click' , function(){
		$("#donor-ing-modal").modal('show');
	});
	
	$('#donor-reg').on('click' , function(){
		$('#donor-reg-modal').modal('show');
	});
	
	$('#donor-reg-modal-btn').on('click' , function(){
		$('#donor-reg-modal').modal('hide');
		$('#donor-reg-final-modal').modal('show');
	});
	
	$('#incorrect-donor').on('click' , function(){
		$('#donor-incorrect-modal').modal('show');
		$('#donor-incorrect-modal').focus();
	});
	
	$('#success-donor').on('click' , function(){
		$('#donor-success-modal').modal('show');
		$('#donor-success-modal').focus();
	});
});

