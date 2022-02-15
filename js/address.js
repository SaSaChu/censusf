$(function() {
	$('#btnConfirm').click(function() {
		let address;
		let B071 = $("#B071").val();
		let B072 = $('#B072').val();
		let B073 = $('#B073').val();
		let B0745 = $('#B0745').val();
		let B0768 = $('#B0768').val();
		let B079 = $('#B079').val()
		if(B079) {
			B079 = B079 + '號之';
		}
		let B07A = $('#B07A').val();
		if(B07A) {
			B07A = B07A + '號之';
		}
		let B07B = $('#B07B').val(); 
		if(B07B) {
			B07B = B07B + '號之';
		}
		let B07C = $('#B07C').val(); 
		if(B07C) {
			B07C = B07C + '號之';
		}
		let B07D = $('#B07D').val(); 
		if(B07D) {
			B07D = B07D + '號';
		}
		let B07E = $('#B07E').val(); 
		if(B07E) {
			B07E = B07E + '樓之';
		}
		let B07F = $('#B07F').val(); 
		if(B07F) {
			B07F = B07F + '樓';
		}
		let B07G = $('#B07G').val(); 
		if(B07G) {
			B07G = B07G + '室';
		}
		let B07H = $('#B07H').val(); 
		if(B07H) {
			B07H = B07H;
		}

		address = B071 + B072 + B073 + B0745 + B0768 + B079 + B07A + B07B + B07C + B07D + B07E + B07F + B07G + B07H
		localStorage.setItem('address', JSON.stringify(address));
		location.href="page.html";
	})
});