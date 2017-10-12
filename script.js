$(function(){
	
//code goes here
	
	var number_counter = 0;
	var number_html = "";
	for (i = 0; i < $('#line_numbers').height()/19; i++){
		number_html += number_counter+"<br>";
		number_counter++;
	}		
	$('#line_numbers').html(number_html);
	
	
	var debug_code_snippet = "While true {   } do () someftuff blahblahblah {}";
	
	$('#code_itself').html(debug_code_snippet); //this will be from database
	
	var code_html=$('#code_itself').html();
	
	function highlight_brackets(){
		for (i=0; i<code_html.length; i++){
			if (code_html[i] == "{"){
				var left_side = code_html.slice(0,i-1);
				var right_side = code_html.slice(i+1, code_html.length);
				var result = left_side + '<span class="red">{</span>' + right_side ;
				$('#code_itself').html(result);
				code_html=$('#code_itself').html();
			} else if (code_html[i] == "}"){
				var left_side = code_html.slice(0,i-1);
				var right_side = code_html.slice(i+1, code_html.length);
				var result = left_side + '<span class="red">}</span>' + right_side ;
				$('#code_itself').html(result);
				code_html=$('#code_itself').html();
			}
		}
	}
	highlight_brackets();
	
	$('#code_itself').on("keypress", function(){highlight_brackets()});
});
