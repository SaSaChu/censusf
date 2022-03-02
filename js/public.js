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

	// 首次登入變更密碼
	var change02 = new bootstrap.Modal(document.getElementById('change02'), {
		keyboard: false
	})
	change02.show();

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
	//step4
	//前項僱用員工中，有無部分工時(part-time，PT)員工？
	$("input[id='_040104'").change(function() {
		if($(this).val() == 1) {
			$("input[id='_0401045").prop('readonly', false);
		} else {
			$("input[id='_0401045").val('');
			$("input[id='_0401045").prop('readonly', true);
		}
	})
	//step5
	//全年有無使用派遣人力？
	$("input[id='_050100'").change(function() {
		if($(this).val() == 1) {
			$("input[id='_050101").prop('readonly', false);
			$("input[id='_050102").prop('readonly', false);
			$("input[id='_050103").prop('readonly', false);
		} else {
			$("input[id='_050101").val('');
			$("input[id='_050102").val('');
			$("input[id='_050103").val('');
			$("input[id='_050101").prop('readonly', true);
			$("input[id='_050102").prop('readonly', true);
			$("input[id='_050103").prop('readonly', true);
		}
	})
	//全年有無經營勞動派遣業務？
	$("input[id='_050200'").change(function() {
		if($(this).val() == 1) {
			$("input[id='_050201").prop('readonly', false);
			$("input[id='_050202").prop('readonly', false);
			$("input[id='_050203").prop('readonly', false);
		} else {
			$("input[id='_050201").val('');
			$("input[id='_050202").val('');
			$("input[id='_050203").val('');
			$("input[id='_050201").prop('readonly', true);
			$("input[id='_050202").prop('readonly', true);
			$("input[id='_050203").prop('readonly', true);
		}
	})
	//step 6
	//step 6-2
	//有無透過網路進行產品或服務之銷售或接單？
	$("input[id='_060300'").change(function() {
		if($(this).val() == 1) {
			$("input[id='_060311").prop('readonly', false);
			$("input[id='_060320").prop('disabled', false);
			$("input[id='_060330").prop('disabled', false);
		} else {
			$("input[id='_060311").val('');
			$("input[id='_060320").prop('checked', false);
			$("input[id='_060330").prop('checked', false);
			$("input[id='_060311").prop('readonly', true);
			$("input[id='_060320").prop('disabled', true);
			$("input[id='_060330").prop('disabled', true);
		}
	})
	//step 6-3
	//有無採行下列措施，以加強資(通)訊安全？
	$("input[id='_060500'").change(function() {
		if($(this).val() == 1) {
			$("input[id='_060501").prop('disabled', false);
			$("input[id='_060502").prop('disabled', false);
			$("input[id='_060503").prop('disabled', false);
		} else {
			$("input[id='_060501").prop('checked', false);
			$("input[id='_060502").prop('checked', false);
			$("input[id='_060503").prop('checked', false);
			$("input[id='_060501").prop('disabled', true);
			$("input[id='_060502").prop('disabled', true);
			$("input[id='_060503").prop('disabled', true);
		}
	})
	//step 6-4
	//同時使用於基礎及生產服務等進階作業
	$("input[id='_060600'").change(function() {
		if($(this).val() == 2) {
			$("input[id='_060611").prop('disabled', false);
			$("input[id='_060612").prop('disabled', false);
			
		} else {
			$("input[id='_060611").prop('checked', false);
			$("input[id='_060612").prop('checked', false);
			$("input[id='_060611").prop('disabled', true);
			$("input[id='_060612").prop('disabled', true);
		}
	})	
	//step 6-5
	//有無運用下列技術？點選有時請勾選下列技術中有運用者(可複選)，並選擇至少一項之主要運用作業
	$("input[id='_060620']").on('click',function() {
		$("._060621").toggleClass('d-none');
		$("._060622").toggleClass('d-none');	
	})
	$("input[id='_060630']").on('click',function() {
		$("._060631").toggleClass('d-none');
		$("._060632").toggleClass('d-none');	
	})
	$("input[id='_060640']").on('click',function() {
		$("._060641").toggleClass('d-none');
		$("._060642").toggleClass('d-none');	
	})
	$("input[id='_060650']").on('click',function() {
		$("._060651").toggleClass('d-none');
		$("._060652").toggleClass('d-none');	
	})
	$("input[id='_060660']").on('click',function() {
		$("._060661").toggleClass('d-none');
		$("._060662").toggleClass('d-none');	
	})

	//step 8
	//全年有無跨國(境)服務交易、投資布局或外資持股？
	$("input[id='_080000']").change(function() {
		if($(this).val() == 1) {
			$("input[id='_080100']").prop('disabled', false);
			$("input[id='_080100']").change(function() {
				if($(this).val() == 1) {
					$("input[id='_080101']").prop('disabled', false);	
				}else {
					$("input[id='_080101']").prop('checked', false);		
					$("input[id='_080101']").prop('disabled', true);		
				}
			})	
			$("input[id='_080200']").prop('disabled', false);
			$("input[id='_080200']").change(function() {
				if($(this).val() == 1) {
					$("input[id='_080201']").prop('readonly', false);	
					$("input[id='_080202']").prop('readonly', false);	
				}else {
					$("input[id='_080201']").val('');		
					$("input[id='_080202']").val('');		
					$("input[id='_080201']").prop('readonly', true);		
					$("input[id='_080202']").prop('readonly', true);		
				}
			})	
			$("input[id='_080300']").prop('disabled', false);
			$("input[id='_080300']").change(function() {
				if($(this).val() == 1) {
					$("input[id='_080301']").prop('readonly', false);	
				}else {
					$("input[id='_080301']").val('');		
					$("input[id='_080301']").prop('readonly', true);		
				}
			})	
			$("input[id='_080400']").prop('disabled', false);
			$("input[id='_080400']").change(function() {
				if($(this).val() == 1) {
					$("input[id='_080401']").prop('readonly', false);	
				}else {
					$("input[id='_080401']").val('');		
					$("input[id='_080401']").prop('readonly', true);		
				}
			})	
			
		} else {
			$("input[id='_080100']").prop('disabled', true);
			$("input[id='_080100']").prop('checked', false);
			$("input[id='_080101']").prop('checked', false);		
			$("input[id='_080101']").prop('disabled', true);	

			$("input[id='_080200']").prop('disabled', true);
			$("input[id='_080200']").prop('checked', false);
			$("input[id='_080201']").val('');		
			$("input[id='_080202']").val('');		
			$("input[id='_080201']").prop('readonly', true);		
			$("input[id='_080202']").prop('readonly', true);

			$("input[id='_080300']").prop('disabled', true);
			$("input[id='_080300']").prop('checked', false);
			$("input[id='_080301']").val('');		
			$("input[id='_080301']").prop('readonly', true);			

			$("input[id='_080400']").prop('disabled', true);
			$("input[id='_080400']").prop('checked', false);
			$("input[id='_080401']").val('');		
			$("input[id='_080401']").prop('readonly', true);		
		}
	})	

	//step 9
	$("input[id='_090200']").change(function() {
		if($(this).val() == 1) {
			$("input[id='_090201']").prop('readonly', false)	
			$("input[id='_090202']").prop('readonly', false)	
		} else {
			$("input[id='_090201']").val('')
			$("input[id='_090202']").val('')
			$("input[id='_090201']").prop('readonly', true)	
			$("input[id='_090202']").prop('readonly', true)		
		}	
	})

	//step 10
	$("input[id='_100800']").click(function() {
		if ($("input[id='_100800']").is(":checked")){
			$("input[id='_100899']").prop('readonly', false)
		} else {
			$("input[id='_100899']").val('')
			$("input[id='_100899']").prop('readonly', true)
		}
	})

	//step 11
	$("input[id='_110200']").change(function() {
		if($(this).val() == 1) {
			$("input[id='_110201']").prop('readonly', false)
			$("input[id='_110202']").prop('readonly', false)
		}else {
			$("input[id='_110201']").val('')
			$("input[id='_110202']").val('')
			$("input[id='_110201']").prop('readonly', true)	
			$("input[id='_110202']").prop('readonly', true)	
		}
	})

	//step 14 附記欄
	$("input[id='_130400']").click(function() {
		if ($("input[id='_130400']").is(":checked")){
			$("input[id='_130410']").prop('disabled', false)
			$("input[id='_130411']").prop('readonly', false)
			$("input[id='_130412']").prop('disabled', false)
			$("input[id='_130421']").prop('disabled', false)
			$("input[id='_130424']").prop('disabled', false)
			$("input[id='_130430']").prop('disabled', false)
			
			// 110年全年營業收入
			$("input[id='_130421']").change(function() {
				if($(this).val() == 1) {
					$("input[id='_130422']").prop('readonly', false)
					$("input[id='_130423']").val('')
					$("input[id='_130423']").prop('readonly', true)
				} else if( $(this).val() == 3) {
					$("input[id='_130423']").prop('readonly', false)
					$("input[id='_130422']").val('')
					$("input[id='_130422']").prop('readonly', true)
				} else {
					$("input[id='_130422']").val('')
					$("input[id='_130422']").prop('readonly', true)
					$("input[id='_130423']").val('')
					$("input[id='_130423']").prop('readonly', true)
				}
			})
			// 110年全年薪資支出
			$("input[id='_130424']").change(function() {
				if($(this).val() == 1) {
					$("input[id='_130425']").prop('readonly', false)
					$("input[id='_130426']").val('')
					$("input[id='_130426']").prop('readonly', true)
				} else if( $(this).val() == 3) {
					$("input[id='_130426']").prop('readonly', false)
					$("input[id='_130425']").val('')
					$("input[id='_130425']").prop('readonly', true)
				} else {
					$("input[id='_130425']").val('')
					$("input[id='_130425']").prop('readonly', true)
					$("input[id='_130426']").val('')
					$("input[id='_130426']").prop('readonly', true)
				}
			})
			// 其他受影響項目
			$("input[id='_130430']").click(function() {
				if($(this).is(':checked')) {
					$("input[id='_130499']").prop('readonly', false)
				} else {
					$("input[id='_130499']").val('')
					$("input[id='_130499']").prop('readonly', true)	
				}
			})

			// 2. 其他特殊情形，請以文字說明
			$("input[id='_130500']").click(function() {
				if($(this).is(':checked')) {
					$("input[id='_130599']").prop('readonly', false)
				} else {
					$("input[id='_130599']").val('')
					$("input[id='_130599']").prop('readonly', true)	
				}
			})
		} else {
			$("input[id='_130410']").prop('checked', false)
			$("input[id='_130410']").prop('disabled', true)

			$("input[id='_130411']").val('')
			$("input[id='_130411']").prop('readonly', true)

			$("input[id='_130412']").prop('checked', false)
			$("input[id='_130412']").prop('disabled', true)
			
			$("input[id='_130421']").prop('checked', false)
			$("input[id='_130421']").prop('disabled', true)
			$("input[id='_130422']").val('')
			$("input[id='_130422']").prop('readonly', true)	
			$("input[id='_130423']").val('')
			$("input[id='_130423']").prop('readonly', true)

			$("input[id='_130424']").prop('checked', false)
			$("input[id='_130424']").prop('disabled', true)
			$("input[id='_130425']").val('')
			$("input[id='_130425']").prop('readonly', true)
			$("input[id='_130426']").val('')
			$("input[id='_130426']").prop('readonly', true)

			$("input[id='_130430']").prop('checked', false)	
			$("input[id='_130430']").prop('disabled', true)
			$("input[id='_130499']").val('')
			$("input[id='_130499']").prop('readonly', true)
		}
	})
	

	// 上一步
	$('.pre-btn').click(function() {
		let step = $(this).parents('.step-box').data('step');
		let pre = parseInt(step) - 1

		if(pre < 0) {
			pre = 0;
		} else if (pre === 2) {
			pre = 1;
		} else if (pre === 60) {
			pre = 5;
		} else if (pre === 6) {
			pre = 65
		}
		
		if(pre === 5) {
			$(`.w-menu[data-step="6"`).removeClass('on-step');
		} else {
			$(`.w-menu[data-step="${step}"`).removeClass('on-step');
		}
		
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
		let step = $(this).parents('.step-box').data('step'); 
		let next = parseInt(step) + 1;
		
		if(next === 2) {
			next = 3;
		} else if(next === 6) {
			next = 61
		} else if(next === 66) {
			next = 7
		}
		
		// 確認必填功能
		// let notFill = checkFillInput(step);	
		let notFill = 0;
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
			if(next == 61) {
				$(`.w-menu[data-step="6"]`).addClass('on-step');
			} else {
				$(`.w-menu[data-step="${next}"]`).addClass('on-step');
			}
			
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
