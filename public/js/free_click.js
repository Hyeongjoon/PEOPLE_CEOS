function reply(fid, writer, writerName , re_num) {
	if ($('#reply_reg_content').val().trim().length==0) {
		$('#common-modal-title').text('댓글 작성 오류');
		$('#common-modal-content').text('댓글 내용을 입력해 주세요');
		$('#common-modal').modal('show');
	} else {
		$.ajax({
			url : 'http://52.78.208.137/commu/free_reply',
			dataType : 'json',
			type : 'POST',
			data : {
				'fid' : fid,
				'writer' : writer,
				'content' : $('#reply_reg_content').val().trim()
			},
			success : function(result) {
				if(result==false){
					$('#common-modal-title').text('내부 서버오류');
					$('#common-modal-content').text('내부 서버 오류입니다. 잠시후에 시도해주세요');
					$('#common-modal').modal('show');
				}else{
					var d = new Date();
					var date;
					if(d.getDate()<10){
						date='0'+d.getDate();
					} else {
						date = d.getDate();
					}
					 $('#reply_table > tbody:last').append('<tr><th scope="row" class="text-center">'+(re_num+1)+'</th><td>' + $('#reply_reg_content').val().trim() + '</td><td>'+writerName+'</td><td>'+d.getFullYear()+'.'+(d.getMonth()+1)+'.'+date+'</td><td><button type="button" class="btn btn-default" onclick="deletReply('+result.frid+','+fid+')">X</button></td></tr>');
				}
			}
		});
	}
}

function deletReply(frid , fid){ //오타임........
	$.ajax({
		url : 'http://52.78.208.137/commu/free_delete_reply',
		dataType : 'json',
		type : 'POST',
		data : {
			'frid' : frid,
			'fid' : fid
		},
		success : function(result) {
			if(result==false){
				$('#common-modal-title').text('내부 서버오류');
				$('#common-modal-content').text('내부 서버 오류입니다. 잠시후에 시도해주세요');
				$('#common-modal').modal('show');
			}else{
				window.location.reload(true);
			}
		}
	});
}

function deletion(fid){
	$.ajax({
		url : 'http://52.78.208.137/commu/free_delete',
		dataType : 'json',
		type : 'POST',
		data : {
			'fid' : fid
		},
		success : function(result) {
			if(result==false){
				$('#common-modal-title').text('내부 서버오류');
				$('#common-modal-content').text('내부 서버 오류입니다. 잠시후에 시도해주세요');
				$('#common-modal').modal('show');
			}else{
				location.replace('/commu?tab=1' );
			}
		}
	});
}