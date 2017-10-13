$(function(){
	
//code goes here
	$('#code_itself').css("overflow-y", "auto");
	$('#line_numbers').css("overflow-y", "auto");
	$('#line_numbers').css("overflow-y", "hidden");
	$('#line_numbers').css("overflow-x", "hidden");
	$('#code_itself').on("scroll", function(){$('#line_numbers').scrollTop($(this).scrollTop())});
	
	
	//Snippets downloader
	var snippets_from_server;
	var current_snippet_number;
	var snippet_is_new = false;
	function chooser_reload(){
		$.ajax({
			url: 'http://proj-319-p11.cs.iastate.edu:3000/users/' + 'user1',
			type: 'GET',
			contentType: "application/json",
			cache: false,
			success: function(result){
				$('#chooser').html("");
				snippets_from_server = result;
				console.log(snippets_from_server);
				for (let i=0; i<result["snippet_number"]; i++){
					//current_user_snippets_array.push(result["snippet"+ i]);
					$('#chooser').append('<div class="mini_snippet" id="snippet' + i +'">' + result["snippet"+ i + "_name"] + '<br>' + result["snippet"+ i + "_preview"] + '</div>');
					$('#snippet'+i).on("click", function(){
						$('#code_itself').html(result["snippet"+ i]);
						$('#snippet_name').html(result["snippet"+ i+"_name"]);
						current_snippet_number = i;
					});	
				}
			}
		});
	}
	
	chooser_reload();


				
	//Saving snipepts
	$('#save').on('click', function(){
		if (snippet_is_new == false){
			var package_object = {};
			package_object['snippet'+current_snippet_number+'_preview'+""] = $('#code_itself').html().slice(0,100)+'';
			package_object['snippet'+current_snippet_number+""] =$('#code_itself').html()+'';
			package_object['snippet'+current_snippet_number+'_name'] =$('#snippet_name').html()+'';
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
		} else {
			current_snippet_number=snippets_from_server['snippet_number'];
			snippets_from_server['snippet'+current_snippet_number+'_preview'+""] = $('#code_itself').html().slice(0,100)+'';
			snippets_from_server['snippet'+current_snippet_number+""] =$('#code_itself').html()+'';
			snippets_from_server['snippet'+current_snippet_number+'_name'] =$('#snippet_name').html()+'';
			snippets_from_server['snippet_number'] =current_snippet_number+1;
			var json_package = JSON.stringify(snippets_from_server);
			console.log(json_package);
			$.ajax({
				url: 'http://proj-319-p11.cs.iastate.edu:3000/users/' + 'user1',
				type: 'DELETE',
				contentType: "application/json",
				cache: false,
				data: json_package,
				success: function(){
					$.ajax({
						url: 'http://proj-319-p11.cs.iastate.edu:3000/users/',
						type: 'POST',
						contentType: "application/json",
						cache: false,
						data: json_package,
						success: function(){
							chooser_reload();
							alert("Saved!");
						}
					});
				}
			});
			snippet_is_new = false;
		}
	});
	

		
	//creating new snippet
	$('#new').on('click', function(){
		snippet_is_new = true;
		$('#code_itself').html('');
		$('#snippet_name').html("NewSnippet"+snippets_from_server["snippet_number"]+1);
	});
	
	
	var number_counter = 1;
	var number_html = "";
	for (i = 0; i < $('#line_numbers').height()/2; i++){
		number_html += number_counter+"<br>";
		number_counter++;
	}		
	$('#line_numbers').html(number_html);
	
	
	var debug_code_snippet = "Choose a snippet from the left";
	
	$('#code_itself').html(debug_code_snippet); 

	var code_html=$('#code_itself').html();
	/*
	function highlight_brackets(){
		let result;
		code_html=$('#code_itself').html();
		result=code_html;
		for (let i=0; i<code_html.length; i++){
			if (code_html[i] == "{"){  
				let left_side = code_html.slice(0,i);
				let right_side = code_html.slice(i+1, code_html.length);
				result = left_side + ' <span class="red">{</span>' + right_side ;
				$('#code_itself').html(result);
				code_html=$('#code_itself').html();
				i+=26;
			} 
			if (code_html[i] == "}"){
				let left_side = code_html.slice(0,i);
				let right_side = code_html.slice(i+1, code_html.length);
				result = left_side + '<span class="red">}</span>' + right_side ;
				$('#code_itself').html(result);
				code_html=$('#code_itself').html();
				i+=26;
			}
		}
		
	}
	
	
	function highlight_functions(){
		let result;
		code_html=$('#code_itself').html();
		result=code_html;
		for (let i=0; i<code_html.length; i++){
			if (code_html.slice(i,i+8) == "function"){  
				let left_side = code_html.slice(0,i);
				let right_side = code_html.slice(i+8, code_html.length);
				result = left_side + '<span class="red">function</span>' + right_side ;
				$('#code_itself').html(result);
				code_html=$('#code_itself').html();
				i+=32;
			}
		}
	}
	
	function highlight_let(){
		let result;
		code_html=$('#code_itself').html();
		result=code_html;
		for (let i=0; i<code_html.length; i++){
			if (code_html.slice(i,i+3) == "let"){ 
				let left_side = code_html.substr(0,i);
				let right_side = code_html.slice(i+3);
				result = left_side + '<span class="red">let</span>' + right_side;
				$('#code_itself').html(result);
				code_html=$('#code_itself').html();
				i+=28;
			}
		}
	};
	*/
	
	function highlight_string(str){
		let result;
		code_html=$('#code_itself').html();
		result = code_html;
		for (let i = 0; i<code_html.length; i++){
			if (code_html.slice(i,i+str.length) == str){
				let left_side = code_html.substr(0,i);
				let right_side = code_html.slice(i+str.length);
				result = left_side + '<span class="red">' + str + '</span>' + right_side;
				$('#code_itself').html(result);
				code_html=$('#code_itself').html();
				//console.log(('<span class="red">' + str + '</span>').length);
				i+=('<span class="red">' + str + '</span>').length;
			}
		}
	};
	
	/*
	function highlight_off_let(){
		let result;
		code_html=$('#code_itself').html();
		result=code_html;
		for (let i=0; i<code_html.length; i++){
			if (code_html.slice(i,i+28) == '<span class="red">let</span>'){
				let left_side = code_html.substr(0,i);
				let right_side = code_html.slice(i+28);
				result = left_side + 'let' + right_side ;
				$('#code_itself').html(result);
				code_html=$('#code_itself').html();
			}
		}
	};
	
	function highlight_off_function(){
		let result;
		code_html=$('#code_itself').html();
		result=code_html;
		for (let i=0; i<code_html.length; i++){
			if (code_html.slice(i,i+33) == '<span class="red">function</span>'){
				let left_side = code_html.substr(0,i);
				let right_side = code_html.slice(i+33);
				result = left_side + 'function' + right_side ;
				$('#code_itself').html(result);
				code_html=$('#code_itself').html();
			}
		}
	};
	
	function highlight_off_brackets(){
		let result;
		code_html=$('#code_itself').html();
		result=code_html;
		for (let i=0; i<code_html.length; i++){
			if (code_html.slice(i,i+28) == '<span class="red">let</span>'){
				let left_side = code_html.substr(0,i);
				let right_side = code_html.slice(i+28);
				result = left_side + 'let' + right_side ;
				$('#code_itself').html(result);
				code_html=$('#code_itself').html();
			}
		}
	};
	*/
	
	function highlight_off_string(str,str_class){
		let result;
		code_html=$('#code_itself').html();
		result=code_html;
		for (let i=0; i<code_html.length; i++){
			if (code_html.slice(i,i+22+str_class.length+str.length) == ('<span class="'+str_class+'">'+str+'</span>')){
				let left_side = code_html.substr(0,i);
				let right_side = code_html.slice(i+22+str_class.length+str.length);
				result = left_side + str + right_side ;
				$('#code_itself').html(result);
				code_html=$('#code_itself').html();
			}
		}
	}
	
		
	
	//I know it pushes the curser to the beggining of the line, but it CAN'T BE FIXED! D:
	//$('#code_itself').keyup(function(e){if (e.keyCode == 32){highlight_brackets();}});
	var syntax_on = 0;
	$('#syntax').on('click', function(){
		if (syntax_on == 0){
			/*
			highlight_brackets();
			highlight_brackets();
			highlight_functions();
			highlight_let();
			*/
			highlight_string("let");
			highlight_string("function");
			highlight_string("{");
			highlight_string("}");
			syntax_on++;
		} else {		
		/*
			highlight_off_let();
			highlight_off_function();
			//highlight_brackets();
			*/
			highlight_off_string("let","red");
			highlight_off_string("function","red");
			highlight_off_string("}","red");
			highlight_off_string("{","red");
			syntax_on--;
		}
	});
	
	
});
