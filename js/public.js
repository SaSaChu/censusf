$(function() {
	// 倒數計時器
	var time_in_minutes = 15;
	var timeinterval;
    function time_remaining(deadline){
		var t = Date.parse(deadline) - Date.parse(new Date());
		var seconds = Math.floor( (t / 1000) % 60 );
		var minutes = Math.floor( (t / 1000 / 60) % 60 );
		var hours = Math.floor( (t / (1000 * 60 * 60)) % 24 );
		var days = Math.floor( t / (1000 * 60 * 60 * 24) );
		return {'total':t, 'days':days, 'hours':hours, 'minutes':minutes, 'seconds':seconds};
    }

    function run_clock(id){
		var current_time = Date.parse(new Date());
    	var deadline = new Date(current_time + time_in_minutes * 60 * 1000);
      	var clock = document.getElementById(id);

		function update_clock(){

			var t = time_remaining(deadline);
			clock.innerHTML = '<span class="text-secondary">剩餘連線時間:</span> ' + 
			((t.minutes < 10)? '0' + t.minutes : t.minutes) + ': ' + 
			((t.seconds < 10)? '0' + t.seconds : t.seconds);
			if(t.total<=0){ clearInterval(timeinterval); }
		}

		update_clock(); // run function once at first to avoid delay
		
		timeinterval = setInterval(update_clock, 1000);
	  	
    }

    run_clock('clockdiv');

	// 時間重新計算
	$(".btn-clock-restart").click(function() {
		clearInterval(timeinterval);
		run_clock('clockdiv');
	})

	// 右側&手機menu
	$('.w-menu:not(.pass-step)').click(function() {
		let step = $(this).data('step');
		$(this).addClass('on-step');
		$(`.step-box`).addClass('d-none');
		$(`.step-box[data-step="${step}"`).removeClass('d-none');	
	})

	$('.m-menu:not(.pass-step)').click(function() {
		$('.offcanvas').find('.btn').click();
		let step = $(this).data('step');
		if(step === 0) {
			$('.bg-title-1').removeClass('d-none')
			$('.bg-title-3').addClass('d-none')
		} else if (step === 3){
			$('.bg-title-1').addClass('d-none')
			$('.bg-title-3').removeClass('d-none')
		} else {
			$('.bg-title-1,.bg-title-3').addClass('d-none')
		}
		$(this).addClass('on-step');
		$(`.step-box`).addClass('d-none');
		$(`.step-box[data-step="${step}"`).removeClass('d-none');	

	})

	// 基本資料 start 

    // 同聯絡人姓名
    $("input[id='B067']").change(function() {
		if(this.checked) {
			let B061 = $('#B061').val();
			let B062 = $('#B062').val(); 

			if(B061 && B062) {
				$('#B063').val(B061).prop('readonly', true);
				$('#B064').val(B062).prop('readonly', true);
			} else {
				alert('請確認聯絡人姓名、聯絡人電話是否填寫')
			}
		} else {
			$('#B063').val('').prop('readonly', false);
			$('#B064').val('').prop('readonly', false);	
		}      
    })

	// 修改地址
	let address = JSON.parse(localStorage.getItem("address"))
	if(address) {
		$("#B07Z").val(address);	
	}
	// $("#btnConfirm").click(function(){
	// 	let B071 = $("#B071").val();
	// 	let B072 = $("#B072").val();
	// 	let B073 = $("#B073").val();
	// 	let B0745 = $("#B0745").val();
	// 	let B0768 = $("#B0768").val();
	// 	let B079 = $("#B079").val();
	// 	let B07A = $("#B07A").val();
	// 	let B07B = $("#B07B").val();
	// 	let B07C = $("#B07C").val();
	// 	let B07D = $("#B07D").val();
	// 	let B07E = $("#B07E").val();
	// 	let B07F = $("#B07F").val();
	// 	let B07G = $("#B07G").val();
	// 	let B07H = $("#B07H").val();
	// 	let address = B071 + B072 + B073 + B0745 + B0768 + B079 + B07A + B07B + B07C + B07D + B07E + B07F + B07G + B07H 
	// 	$("#B07Z").val(address);
	// 	$("#staticBackdrop").modal('hide');
	// })

	// 同實際營業地址
	$("input[id='BR']").change(function() {
		if(this.checked) {
			let B07Z = $("#B07Z").val();
			$("#B07Z_BR").val(B07Z).prop('readonly', true);
		} else {
			$("#B07Z_BR").prop('readonly', false);	
		}
	})

	// 確實無統一編號
	$("input[id='_130200']").change(function() {
		if(this.checked) {
			$("#_350000").val('').prop('readonly', true);	
		} else {
			$("#_350000").prop('readonly', false);
		}
	})

	// 單位級別
	$("input[id='_340000']").change(function(){
		let _340000 = "" + $(this).val();
		let question = [6, 7, 8, 9, 10, 11, 12, 13];
		if (_340000 == "1" || _340000 == "8") {
			$("#_360000").val('').prop("readOnly", true);
			localStorage.clear();
		} else if (_340000 == "2") {
			$("#_360000").prop("readOnly", false);
			localStorage.setItem('question', JSON.stringify(question));
		} else {
			$("#_360000").val('').prop("readOnly", true);
			localStorage.setItem('question', JSON.stringify(question));
		}

		displayQuestion()
	});

	// 基本資料 end

	// 項目三 start
	//110年生產之產品或經營、服務之項目 主要經營項目是否屬於下列行業
	$("select[id='_030101']").change(function() {
		let question;
		$('._030101').each(function(){
			$(this).addClass('d-none');
		})
		if($(this).val() == 1) {
			question = [10, 13];

			$('._030101-1').each(function(){
				$('._030101-1').removeClass('d-none');
			});
			$("#_030210").prop("required", true);
		} else if ($(this).val() == 2) {
			question = [10, 11, 13];

			$('._030101-2').each(function(){
				$(this).removeClass('d-none');
			});
			$("#_030210").prop("required", false);
		} else if ($(this).val() == 3) {
			question = [12, 13];

			$('._030101-3').each(function(){
				$(this).removeClass('d-none');
			});
			$("#_030210").prop("required", true);
		} else if ($(this).val() == 4) {
			question = [10, 11 ,12];
			
			$('._030101-4').each(function(){
				$(this).removeClass('d-none');
			});
			$("#_030210").prop("required", false);
		} else if ($(this).val() == 5) {
			question = [10, 11 ,12, 13];
			$('._030101-5').each(function(){
				$(this).removeClass('d-none');
			});
			$("#_030210").prop("required", false);
		} else if ($(this).val() == 6) {
			question = [10, 11 ,12, 13];
			
			$('._030101-6').each(function(){
				$(this).removeClass('d-none');
			});
			$("#_030210").prop("required", false);
		}
		localStorage.setItem('question', JSON.stringify(question));
		displayQuestion();
	})

	//1. 製造業 最主要經營方式
	$("select[id='_030210']").change(function() {
		if($(this).val() == 2) {
			$('#_030216').prop('disabled', true);
			$('#_030216').attr('placeholder', '');
		}
	})

	//3. 有行商品買賣、仲介或貿易代理 銷售給一般家庭民眾的比率
	$("select[id='_030231']").change(function() {
		if($(this).val() == 1) {
			$('._030232').removeClass('d-none')
			$('._030233').addClass('d-none')
		} else if ($(this).val() == 2) {
			$('._030232').addClass('d-none')
			$('._030233').removeClass('d-none')	
		}
	})

	//4.運輸業 運輸業主要營運方式
	$("select[id='_030241']").change(function() {
		if($(this).val() == 3) {
			$('._030242').removeClass('d-none')
			$('._030243').addClass('d-none')
		} else {
			$('._030242').addClass('d-none')
			$('._030243').removeClass('d-none')	
		}
	})

	//5.租賃業 主要租賃項目
	$("select[id='_030251']").change(function() {
		let question = [10, 11, 12, 13]
		if($(this).val() == 1 || $(this).val() == 4 || $(this).val() == 5) {
			$('._030253').addClass('d-none')
			localStorage.setItem('question', JSON.stringify(question));
			displayQuestion()	
		} else if ( $(this).val() == 2 || $(this).val() == 3) {
			$('._030253').removeClass('d-none')	
		}
		$("select[id='_030253']").val('請選擇');
	})

	//5.租賃業 是否附駕駛
	$("select[id='_030253']").change(function() {
		let question = [];
		if($(this).val() == 1 && $("select[id='_030251']").val() == 2) {
			question = [10, 11, 13]
		} else if ($(this).val() == 1 && $("select[id='_030251']").val() == 3) {
			question = [10, 11, 12]
		}
		localStorage.setItem('question', JSON.stringify(question));
		displayQuestion()
	})

	//次要經營項目
	$("select[id='_030301']").change(function() {
		$('._030301').each(function(){
			$(this).addClass('d-none');
		})
		if($(this).val() == 1) {
			$('._030301-1').each(function(){
				$('._030301-1').removeClass('d-none');
			});
		}

		if($(this).val() == 2) {
			$('._030301-2').each(function(){
				$('._030301-2').removeClass('d-none');
			});
		}
	});


	// 項目三 end

	// 上一步
	$('.pre-btn').click(function() {
		let step = $(this).data('step');
		let pre;

		if(step === 3) {
			pre = parseInt(step) - 2; 	
		} else {
			pre = parseInt(step) - 1;	
		}
		
		$(`.w-menu[data-step="${step}"`).removeClass('on-step');
		$(`.step-box[data-step="${step}"]`).addClass('d-none');
		$(`.step-box[data-step="${pre}"`).removeClass('d-none');

		if(pre === 0) {
			$('.bg-title-1').removeClass('d-none')
			$('.bg-title-3').addClass('d-none')
		} else if (pre === 3){
			$('.bg-title-1').addClass('d-none')
			$('.bg-title-3').removeClass('d-none')
		} else {
			$('.bg-title-1,.bg-title-3').addClass('d-none')
		}
	})

	// 下一步確認必填欄位
	// 確認各題目資料有無填寫

	// 下一步確認必填欄位
	$('.next-btn').click(function() {
		let step = $(this).data('step');
		let next = step === 1 ? 3 : parseInt(step) + 1;
		let notFill = checkFillInput(step);	
		if(notFill.length) {
			$('#next').modal('show');
			var nextModal = document.getElementById('next')
			nextModal.addEventListener('shown.bs.modal', function () {
				let element = ''
				notFill.forEach((e,i) => {	
					if((i) % 2 == 0 ) {
						element += `<p class="popup-list-r" title="${i+=1}">${ERRORCODE[e]}必須填寫</p>`  ;	
					} else {
						element += `<p class="popup-list-r text-danger" title="${i+=1}">${ERRORCODE[e]}必須填寫</p>`  ;
					}
					
				})
				
				$('#next').find('.modal-body').empty().html(element);
			});
		} else {
			$(`.step-box[data-step="${step}"`).addClass('d-none');
			$(`.step-box[data-step="${next}"`).removeClass('d-none');
			$(`.w-menu[data-step="${next}"]`).addClass('on-step');
			
			if(next === 0) {
				$('.bg-title-1').removeClass('d-none')
				$('.bg-title-3').addClass('d-none')
			} else if (next === 3){
				$('.bg-title-1').addClass('d-none')
				$('.bg-title-3').removeClass('d-none')
			} else {
				$('.bg-title-1,.bg-title-3').addClass('d-none')
			}
		}
	})

	displayQuestion()
	
	// 確認必填欄位
	function checkFillInput(step) {
		let notFill = [];	
		
		$(`.step-box[data-step="${step}"]`).find('input[required], select[required]').each(function(){
			if($(this).is(":radio")) {
				if(!$("input[id='" + $(this).attr('id') + "']:checked").val()){
					notFill.push($(this).attr('id'))
				}
			} else {
				if(!$(this).val()) {
					notFill.push($(this).attr('id'))
				}
			}

		});

		if(step === 0) {
			if(!$('input[id="_350000"]').val()) {
				if(!$('input[id="_130200"]:checked').val()) {
					notFill.push($('#_350000').attr('id'));	
				}
			}
		}

		if(step === 1) {
			let year = $("#_010100").val();
			let month = $("#_010200").val();
			if(year < 0 || year > 110 && year) {
				notFill.push("_010100-1");
			}
	
			if(month > 12 || month < 1 && month) {
				notFill.push("_010200-1");
			}
		}	

		return notFill;
	}

	// 顯示或隱藏題目
	function displayQuestion() {
		let question = JSON.parse(localStorage.getItem("question"))	
		if(question) {	
			if($("select[id='_030251']").val() == 2 || $("select[id='_030251']").val() == 3) {
				$('.w-menu').removeClass('pass-step')
			}
			question.forEach(e => {
				$(".w-menu[data-step^='"+e+"']").addClass('pass-step')	;
			});
		} else {
			if($("input[id='_340000']").val() == "1" || $("input[id='_340000']").val() == "8") {
				$('.w-menu').removeClass('pass-step')
			}
		}		
	}
});
