$(function(){
	
//code goes here
	$('#code_itself').css("overflow-y", "auto");
	$('#line_numbers').css("overflow-y", "auto");
	$('#line_numbers').css("overflow-y", "hidden");
	$('#line_numbers').css("overflow-x", "hidden");
$('#code_itself').on("scroll", function(){$('#line_numbers').scrollTop($(this).scrollTop())});
	
	
	//Snippets downloader
	var current_user_snippets;
	var current_snippet_number;
	function chooser_reload(){
		$.ajax({
			url: 'http://proj-319-p11.cs.iastate.edu:3000/users/' + 'user1',
			type: 'GET',
			contentType: "application/json",
			cache: false,
			success: function(result){
				$('#chooser').html("");
				current_user_snippets = result;
				for (let i=0; i<result["snippet_number"]; i++){
					//current_user_snippets_array.push(result["snippet"+ i]);
					$('#chooser').append('<div class="mini_snippet" id="snippet' + i +'">' + result["snippet"+ i + "_name"] + '<br>' + result["snippet"+ i + "_preview"] + '</div>');
					$('#snippet'+i).on("click", function(){
						$('#code_itself').html(result["snippet"+ i]);
						current_snippet_number = i;
					});	
				}
			}
		});
	}
	
	chooser_reload();


				
	//Saving snipepts
	$('#save').on('click', function(){
		//var snip_prev = 'snippet'+current_snippet_number+'_preview'+" ";
		//var snip_code = 'snippet'+current_snippet_number+" ";
		var package_object = {};
		package_object['snippet'+current_snippet_number+'_preview'+""] = $('#code_itself').html().slice(0,100)+'';
		package_object['snippet'+current_snippet_number+""] =$('#code_itself').html()+'';
		var json_package = JSON.stringify(package_object);
		console.log(json_package);
		$.ajax({
			url: 'http://proj-319-p11.cs.iastate.edu:3000/users/' + 'user1',
			type: 'PATCH',
			contentType: "application/json",
			cache: false,
			beforeSend: function(){
				console.log(json_package);
			},
			data: json_package,
			success: function(result){
				console.log("saved");
				chooser_reload();
			}
		});
	});
	
	
	
	var number_counter = 0;
	var number_html = "";
	for (i = 0; i < $('#line_numbers').height()/2; i++){
		number_html += number_counter+"<br>";
		number_counter++;
	}		
	$('#line_numbers').html(number_html);
	
	
	var debug_code_snippet = "Choose a snippet from the left";
	
	$('#code_itself').html(debug_code_snippet); 
	
	var code_html;
	
	function highlight_brackets(){
		let result;
		code_html=$('#code_itself').html();
		result=code_html;
		for (let i=0; i<code_html.length; i++){
			if (code_html[i] == "{"){  
				let left_side = code_html.slice(0,i-1);
				let right_side = code_html.slice(i+1, code_html.length);
				result = left_side + '<span class="red">{</span>' + right_side ;
				$('#code_itself').html(result);
				code_html=$('#code_itself').html();
			} 
			if (code_html[i] == "}"){
				let left_side = code_html.slice(0,i-1);
				let right_side = code_html.slice(i+1, code_html.length);
				result = left_side + '<span class="red">}</span>' + right_side ;
				$('#code_itself').html(result);
				code_html=$('#code_itself').html();
			}
		}
		
	}
	
	
	function highlight_functions(){
		let result;
		code_html=$('#code_itself').html();
		result=code_html;
		for (let i=0; i<code_html.length; i++){
			if (code_html.slice(i,i+8) == "function"){  
				let left_side = code_html.slice(0,i-1);
				let right_side = code_html.slice(i+8, code_html.length);
				result = left_side + '<span class="red">function</span>' + right_side ;
				$('#code_itself').html(result);
				code_html=$('#code_itself').html();
			}
		}
	}
	
	function highligh_let(){
		let result;
		code_html=$('#code_itself').html();
		result=code_html;
		for (let i=0; i<code_html.length; i++){
			if (code_html.slice(i,i+3) == "function"){  
				let left_side = code_html.slice(0,i-1);
				let right_side = code_html.slice(i+8, code_html.length);
				result = left_side + '<span class="red">function</span>' + right_side ;
				$('#code_itself').html(result);
				code_html=$('#code_itself').html();
			}
		}
	}
	
	//I know it pushes the curser to the beggining of the line, but it CAN'T BE FIXED! D:
	//$('#code_itself').keyup(function(e){if (e.keyCode == 32){highlight_brackets();}});
	$('#syntax').on('click', function(){highlight_brackets();highlight_brackets();highlight_functions()});
});
