
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
    // var myModal = document.getElementById('staticBackdrop')
    // var myInput = document.getElementById('myInput')

    // myModal.addEventListener('hidden.bs.modal', function () {
    //   myInput.focus()
    // });

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
		// let B07Z = $("#B07Z").val();		

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

	//單位級別
	$("input[id='_340000']").change(function(){
		let _340000 = "" + $(this).val();
		$('.w-menu').removeClass('pass-step')
		if (_340000 == "1" || _340000 == "8") {
			$("#_360000").prop("readOnly", true);
		} else if (_340000 == "2") {
			$("#_360000").prop("readOnly", false);
			$(".w-menu[data-question^='6'],.w-menu[data-question^='7'],.w-menu[data-question^='8'],.w-menu[data-question^='9'],.w-menu[data-question^='10'],.w-menu[data-question^='11'],.w-menu[data-question^='12'],.w-menu[data-question^='13']").addClass('pass-step')
			// $(".w-menu[data-question=").addClass('pass-step')
		} else {
			$("#_360000").prop("readOnly", true);
			$(".w-menu[data-question^='6'],.w-menu[data-question^='7'],.w-menu[data-question^='8'],.w-menu[data-question^='9'],.w-menu[data-question^='10'],.w-menu[data-question^='11'],.w-menu[data-question^='12'],.w-menu[data-question^='13']").addClass('pass-step')
		}
	});
	// $("#_340000").change(function() {
	// 	let value = ['1', '2', '3', '8' ]
	// 	console.log($(this).checked);
	// 	if(this.checked) {
	// 		console.log($(this).val());
	// 	}		
	// })
});
