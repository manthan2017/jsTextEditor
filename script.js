$(function(){
	
//code goes here
	
	var number_counter = 0;
	var number_html = "";
	for (i = 0; i < $('#line_numbers').height()/19; i++){
		number_html += number_counter+"<br>";
		number_counter++;
	}		
	$('#line_numbers').html(number_html);
	
	
	var debug_code_snippet = 
});
