
$(function() {

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
	$(".btn-clock-restart").click(function(){
		clearInterval(timeinterval);
		run_clock('clockdiv');
	})

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
	$("#btnConfirm").click(function(){
		let B071 = $("#B071").val();
		let B072 = $("#B072").val();
		let B073 = $("#B073").val();
		let B0745 = $("#B0745").val();
		let B0768 = $("#B0768").val();
		let B079 = $("#B079").val();
		let B07A = $("#B07A").val();
		let B07B = $("#B07B").val();
		let B07C = $("#B07C").val();
		let B07D = $("#B07D").val();
		let B07E = $("#B07E").val();
		let B07F = $("#B07F").val();
		let B07G = $("#B07G").val();
		let B07H = $("#B07H").val();
		let address = B071 + B072 + B073 + B0745 + B0768 + B079 + B07A + B07B + B07C + B07D + B07E + B07F + B07G + B07H 
		$("#B07Z").val(address);
		$("#staticBackdrop").modal('hide');
	})

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

	//基本資料：單位級別
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

	//step3: 110年生產之產品或經營、服務之項目
	$("select[id='_030101']").change(function() {
		$('._030101').each(function(){
			$(this).addClass('d-none');
		})
		if($(this).val() == 1) {
			$('._030101-2').each(function(){
				$('._030101-1').removeClass('d-none');
			});
			$("#_030210").prop("required", true);
		} else if ($(this).val() == 2) {
			$('._030101-2').each(function(){
				$(this).removeClass('d-none');
			});
		} else if ($(this).val() == 3) {
			$('._030101-3').each(function(){
				$(this).removeClass('d-none');
			});
		} else if ($(this).val() == 4) {
			$('._030101-4').each(function(){
				$(this).removeClass('d-none');
			});
		} else if ($(this).val() == 5) {
			$('._030101-5').each(function(){
				$(this).removeClass('d-none');
			});
		} else if ($(this).val() == 6) {
			$('._030101-6').each(function(){
				$(this).removeClass('d-none');
			});
		}
		
	})
	// step3: 最主要經營方式
	$("select[id='_030210']").change(function() {
		if($(this).val() == 2) {
			$('#_030216').prop('readonly', true);
		}
	})

	// 確認基本資料有無填寫
	$('#next-btn').click(function() {
		let notFill = checkFillInput();
		if(notFill.length) {
			$('#next').modal('show');
			var nextModal = document.getElementById('next')	
			nextModal.addEventListener('shown.bs.modal', function () {
				let input = {
					"UNIT" : "單位名稱",
					"B06" : "負責人姓名",
					"B061" : "聯絡人姓名",
					"B062" : "聯絡人電話",
					"B063" : "填表人姓名",
					"B064" : "填表人電話",
					"B07Z" : "實際營業地址",
					"B07Z_BR" : "實際營業地址",
					"_340000" : "單位級別",
				}
				
				let element = ''
				notFill.forEach((e,i) => {	
					if((i) % 2 == 0 ) {
						element += `<p class="popup-list-r" title="${i+=1}">${input[e]}必須填寫</p>`  ;	
					} else {
						element += `<p class="popup-list-r text-danger" title="${i+=1}">${input[e]}必須填寫</p>`  ;
					}
					
				})
				
				$('#next').find('.modal-body').empty().html(element);
			});
		} else {
			// $('#next').modal('hide');
			window.location.href = "/step01.html";
		}
	})

	// 確認項目一、二必填資料
	$('#next-btn-1').click(function() {
		let notFill = checkFillInput();
		let year = $("#_010100").val();
		let month = $("#_010200").val();

		if(year < 0 || year > 110 && year) {
			notFill.push("_010100-1");
		}

		if(month > 12 || month < 1 && month) {
			notFill.push("_010200-1");
		}

		if(notFill.length) {
			$('#next').modal('show');
			var nextModal = document.getElementById('next')	
			nextModal.addEventListener('shown.bs.modal', function () {
				let input = {
					"_000000" : "請點選問項一【組織別】(1、2、3、4、5)",
					"_010100" : "實際開業年必須填寫",
					"_010100-1" : "【實際開業年月】之年份應為民國110年之前；若為民國前開業，請填民國1年",
					"_010200" : "實際開業月必須填寫",
					"_010200-1":"【實際開業年月】之月份應為1月~12月",
				}
				
				let element = ''
				notFill.forEach((e,i) => {	
					if((i) % 2 == 0 ) {
						element += `<p class="popup-list-r" title="${i+=1}">${input[e]}</p>`  ;	
					} else {
						element += `<p class="popup-list-r text-danger" title="${i+=1}">${input[e]}</p>`  ;
					}
					
				})
				
				$('#next').find('.modal-body').empty().html(element);
			});
		} else {
			window.location.href = "/step03.html";
		}
	})

	// 確認項目三必填資料
	$('#next-btn-3').click(function() {
		let notFill = checkFillInput();
		console.log(notFill);
		if(notFill.length) {
			$('#next').modal('show');
			var nextModal = document.getElementById('next')	
			nextModal.addEventListener('shown.bs.modal', function () {
				let input = {
					"_030101" : "請點選問項一【組織別】(1、2、3、4、5)",
					"_030210" : "請選擇問項二【以上最主要經營方式為】",
				}
				
				let element = ''
				notFill.forEach((e,i) => {	
					if((i) % 2 == 0 ) {
						element += `<p class="popup-list-r" title="${i+=1}">${input[e]}</p>`  ;	
					} else {
						element += `<p class="popup-list-r text-danger" title="${i+=1}">${input[e]}</p>`  ;
					}
					
				})
				
				$('#next').find('.modal-body').empty().html(element);
			});
		} else {
			// window.location.href = "/step03.html";
		}
	})

	displayQuestion()

	// 確認必填欄位
	function checkFillInput() {
		let notFill = [];

		$('form').find('input[required], select[required]').each(function(){
			if($(this).is(":radio")) {
				if(!$("input[type='radio']:checked").val()){
					notFill.push($(this).attr('id'))
				}
			} else {
				if(!$(this).val()) {
					notFill.push($(this).attr('id'))
				}
			}

		});

		return notFill;
	}

	// 顯示或隱藏題目
	function displayQuestion() {
		let question = JSON.parse(localStorage.getItem("question"))	
		if(question) {
			question.forEach(e => {
				$(".w-menu[data-question^='"+e+"']").addClass('pass-step')	;
			});
		} else {
			if($("input[id='_340000']").val() == "1" || $("input[id='_340000']").val() == "8") {
				$('.w-menu').removeClass('pass-step')
			}
		}		
	}
});
