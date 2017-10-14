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
		$('#snippet_name').html("NewSnippet"+(snippets_from_server["snippet_number"]+1));
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
	
	function highlight_string(str,str_class){
		let result;
		code_html=$('#code_itself').html();
		result = code_html;
		for (let i = 0; i<code_html.length; i++){
			if (code_html.slice(i,i+str.length) == str){
				if ((code_html[i+str.length]==" ")||(code_html[i+str.length]==".")){
					let left_side = code_html.slice(0,i);
					let right_side = code_html.slice(i+str.length);
					result = left_side + '<span class="'+str_class+'">' + str + '</span>' + right_side;
					$('#code_itself').html(result);
					code_html=$('#code_itself').html();
					//console.log(('<span class="red">' + str + '</span>').length);
					i+=('<span class="red">' + str + '</span>').length;
				} 
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
				let left_side = code_html.slice(0,i);
				let right_side = code_html.slice(i+22+str_class.length+str.length);
				result = left_side + str + right_side ;
				$('#code_itself').html(result);
				code_html=$('#code_itself').html();
			}
		}
	}
	
		
	

	
	var current_language = 'PHP';
	var syntax_on = 0;
	
	$('#color_chooser').on('click', function(){syntax_on=0});
	
	$('#syntax').on('click', function(){
		if (current_language == 'JavaScript'){
			if (syntax_on == 0){
				/*
				highlight_brackets();
				highlight_brackets();
				highlight_functions();
				highlight_let();
				*/
				highlight_string("abstract","red");
				highlight_string("break","red");
				highlight_string("char","red");
				highlight_string("debugger","red");
				highlight_string("double","red");
				highlight_string("export","red");
				highlight_string("finally","red");
				highlight_string("goto","red");
				highlight_string("let","red");
				highlight_string("null","red");
				highlight_string("public","red");
				highlight_string("super","red");
				highlight_string("throw","red");
				highlight_string("try","red");
				highlight_string("volatile","red");
				highlight_string("arguments","red");
				highlight_string("byte","red");
				highlight_string("default","red");
				highlight_string("else","red");
				highlight_string("extends","red");
				highlight_string("float","red");
				highlight_string("instanceof","red");
				highlight_string("long","red");
				highlight_string("package","red");
				highlight_string("return","red");
				highlight_string("switch","red");
				highlight_string("throws","red");
				highlight_string("typeof","red");
				highlight_string("while","grn");
				highlight_string("await","red");
				highlight_string("case","red");
				highlight_string("const","red");
				highlight_string("delete","red");
				highlight_string("enum","red");
				highlight_string("false","red");
				highlight_string("for","grn");
				highlight_string("implements","red");
				highlight_string("int","red");
				highlight_string("native","red");
				highlight_string("private","red");
				highlight_string("short","red");
				highlight_string("synchronized","red");
				highlight_string("transient","red");
				highlight_string("boolean","red");
				highlight_string("catch","red");
				highlight_string("continue","red");
				highlight_string("eval","red");
				highlight_string("final","red");
				highlight_string("function","red");
				highlight_string("import","red");
				highlight_string("interface","red");
				highlight_string("new","red");
				highlight_string("protected","red");
				highlight_string("static","red");
				highlight_string("this","red");
				highlight_string("true","red");
				highlight_string("void","red");
				highlight_string("yield","red");
				syntax_on++;
			} else {		
				/*
				highlight_off_let();
				highlight_off_function();
				//highlight_brackets();
				*/
				highlight_off_string("abstract","red");
				highlight_off_string("break","red");
				highlight_off_string("char","red");
				highlight_off_string("debugger","red");
				highlight_off_string("double","red");
				highlight_off_string("export","red");
				highlight_off_string("finally","red");
				highlight_off_string("goto","red");
				highlight_off_string("let","red");
				highlight_off_string("null","red");
				highlight_off_string("public","red");
				highlight_off_string("super","red");
				highlight_off_string("throw","red");
				highlight_off_string("try","red");
				highlight_off_string("volatile","red");
				highlight_off_string("arguments","red");
				highlight_off_string("byte","red");
				highlight_off_string("default","red");
				highlight_off_string("else","red");
				highlight_off_string("extends","red");
				highlight_off_string("float","red");
				highlight_off_string("instanceof","red");
				highlight_off_string("long","red");
				highlight_off_string("package","red");
				highlight_off_string("return","red");
				highlight_off_string("switch","red");
				highlight_off_string("throws","red");
				highlight_off_string("typeof","red");
				highlight_off_string("while","grn");
				highlight_off_string("await","red");
				highlight_off_string("case","red");
				highlight_off_string("const","red");
				highlight_off_string("delete","red");
				highlight_off_string("enum","red");
				highlight_off_string("false","red");
				highlight_off_string("for","grn");
				highlight_off_string("implements","red");
				highlight_off_string("int","red");
				highlight_off_string("native","red");
				highlight_off_string("private","red");
				highlight_off_string("short","red");
				highlight_off_string("synchronized","red");
				highlight_off_string("transient","red");
				highlight_off_string("boolean","red");
				highlight_off_string("catch","red");
				highlight_off_string("continue","red");
				highlight_off_string("eval","red");
				highlight_off_string("final","red");
				highlight_off_string("function","red");
				highlight_off_string("import","red");
				highlight_off_string("interface","red");
				highlight_off_string("new","red");
				highlight_off_string("protected","red");
				highlight_off_string("static","red");
				highlight_off_string("this","red");
				highlight_off_string("true","red");
				highlight_off_string("void","red");
				highlight_off_string("yield","red");
				syntax_on--;
			}
		} else if (current_language == 'Java'){
			if (syntax_on == 0){
				highlight_string("abstract","red");
				highlight_string("assert","red");
				highlight_string("boolean","red");
				highlight_string("break","red");
				highlight_string("byte","red");
				highlight_string("case","red");
				highlight_string("catch","red");
				highlight_string("char","red");
				highlight_string("continue","red");
				highlight_string("default","red");
				highlight_string("double","red");
				highlight_string("else","red");
				highlight_string("enum","red");
				highlight_string("extends","red");
				highlight_string("final","red");
				highlight_string("finally","red");
				highlight_string("float","red");
				highlight_string("for","grn");
				highlight_string("implements","red");
				highlight_string("import","red");
				highlight_string("instanceof","red");
				highlight_string("int","red");
				highlight_string("interface","red");
				highlight_string("long","red");
				highlight_string("native","red");
				highlight_string("new","red");
				highlight_string("package","red");
				highlight_string("private","red");
				highlight_string("protected","red");
				highlight_string("public","red");;
				highlight_string("return","red");
				highlight_string("short","red");
				highlight_string("static","red");
				highlight_string("strictfp","red");
				highlight_string("super","red");
				highlight_string("switch","red");
				highlight_string("synchronized","red");
				highlight_string("this","red");
				highlight_string("throw","red");
				highlight_string("throws","red");
				highlight_string("transient","red");
				highlight_string("try","red");
				highlight_string("void","red");
				highlight_string("volatile","red");
				highlight_string("while","green");
				syntax_on++;
			} else {
				highlight_off_string("abstract","red");
				highlight_off_string("assert","red");
				highlight_off_string("boolean","red");
				highlight_off_string("break","red");
				highlight_off_string("byte","red");
				highlight_off_string("case","red");
				highlight_off_string("catch","red");
				highlight_off_string("char","red");
				highlight_off_string("continue","red");
				highlight_off_string("default","red");
				highlight_off_string("double","red");
				highlight_off_string("else","red");
				highlight_off_string("enum","red");
				highlight_off_string("extends","red");
				highlight_off_string("final","red");
				highlight_off_string("finally","red");
				highlight_off_string("float","red");
				highlight_off_string("for","grn");
				highlight_off_string("implements","red");
				highlight_off_string("import","red");
				highlight_off_string("instanceof","red");
				highlight_off_string("int","red");
				highlight_off_string("interface","red");
				highlight_off_string("long","red");
				highlight_off_string("native","red");
				highlight_off_string("new","red");
				highlight_off_string("package","red");
				highlight_off_string("private","red");
				highlight_off_string("protected","red");
				highlight_off_string("public","red");;
				highlight_off_string("return","red");
				highlight_off_string("short","red");
				highlight_off_string("static","red");
				highlight_off_string("strictfp","red");
				highlight_off_string("super","red");
				highlight_off_string("switch","red");
				highlight_off_string("synchronized","red");
				highlight_off_string("this","red");
				highlight_off_string("throw","red");
				highlight_off_string("throws","red");
				highlight_off_string("transient","red");
				highlight_off_string("try","red");
				highlight_off_string("void","red");
				highlight_off_string("volatile","red");
				highlight_off_string("while","green");
				syntax_on--;
			}
			
		} else if (current_language == 'PHP'){
			if (syntax_on == 0){
				highlight_string("<?php","red");
				highlight_string("echo","red");
				highlight_string("break","red");
				highlight_string("clone","red");
				highlight_string("die","red");
				highlight_string("empty","red");
				highlight_string("endswitch","red");
				highlight_string("final","red");
				highlight_string("global","red");
				highlight_string("include_once","red");
				highlight_string("list","red");
				highlight_string("private","red");
				highlight_string("return","red");
				highlight_string("try","red");
				highlight_string("xor","red");
				highlight_string("abstract","red");
				highlight_string("callable","red");
				highlight_string("const","red");
				highlight_string("enddeclare","red");
				highlight_string("endwhile","grn");
				highlight_string("finally","red");
				highlight_string("goto","red");
				highlight_string("instanceof","red");
				highlight_string("namespace","red");
				highlight_string("protected","red");
				highlight_string("static","red");
				highlight_string("unset","red");
				highlight_string("yield","red");
				highlight_string("and","red");
				highlight_string("case","red");
				highlight_string("continue","red");
				highlight_string("echo","red");
				highlight_string("endfor","grn");
				highlight_string("eval","red");
				highlight_string("for","grn");
				highlight_string("if","red");
				highlight_string("insteadof","red");
				highlight_string("new","red");
				highlight_string("public","red");
				highlight_string("switch","red");
				highlight_string("array()","red");
				highlight_string("catch","red");
				highlight_string("declare","red");
				highlight_string("else","red");
				highlight_string("endforeach","grn");
				highlight_string("exit","red");
				highlight_string("foreach","grn");
				highlight_string("implements","red");
				highlight_string("interface","red");
				highlight_string("require","red");
				highlight_string("throw","red");
				highlight_string("var","red");
				highlight_string("default","red");
				highlight_string("elseif","red");
				highlight_string("endif","red");
				highlight_string("extends","red");
				highlight_string("function","red");
				highlight_string("include","red");
				highlight_string("isset","red");
				highlight_string("print","red");
				highlight_string("require_once","red");
				highlight_string("trait","red");
				highlight_string("while","grn");
				syntax_on++;
			} else {
				highlight_off_string("<?php","red");
				highlight_off_string("echo","red");
				highlight_off_string("break","red");
				highlight_off_string("clone","red");
				highlight_off_string("die","red");
				highlight_off_string("empty","red");
				highlight_off_string("endswitch","red");
				highlight_off_string("final","red");
				highlight_off_string("global","red");
				highlight_off_string("include_once","red");
				highlight_off_string("list","red");
				highlight_off_string("private","red");
				highlight_off_string("return","red");
				highlight_off_string("try","red");
				highlight_off_string("xor","red");
				highlight_off_string("abstract","red");
				highlight_off_string("callable","red");
				highlight_off_string("const","red");
				highlight_off_string("enddeclare","red");
				highlight_off_string("endwhile","grn");
				highlight_off_string("finally","red");
				highlight_off_string("goto","red");
				highlight_off_string("instanceof","red");
				highlight_off_string("namespace","red");
				highlight_off_string("protected","red");
				highlight_off_string("static","red");
				highlight_off_string("unset","red");
				highlight_off_string("yield","red");
				highlight_off_string("and","red");
				highlight_off_string("case","red");
				highlight_off_string("continue","red");
				highlight_off_string("echo","red");
				highlight_off_string("endfor","grn");
				highlight_off_string("eval","red");
				highlight_off_string("for","grn");
				highlight_off_string("if","red");
				highlight_off_string("insteadof","red");
				highlight_off_string("new","red");
				highlight_off_string("public","red");
				highlight_off_string("switch","red");
				highlight_off_string("array()","red");
				highlight_off_string("catch","red");
				highlight_off_string("declare","red");
				highlight_off_string("else","red");
				highlight_off_string("endforeach","grn");
				highlight_off_string("exit","red");
				highlight_off_string("foreach","grn");
				highlight_off_string("implements","red");
				highlight_off_string("interface","red");
				highlight_off_string("require","red");
				highlight_off_string("throw","red");
				highlight_off_string("var","red");
				highlight_off_string("as","red");
				highlight_off_string("default","red");
				highlight_off_string("elseif","red");
				highlight_off_string("endif","red");
				highlight_off_string("extends","red");
				highlight_off_string("function","red");
				highlight_off_string("include","red");
				highlight_off_string("isset","red");
				highlight_off_string("print","red");
				highlight_off_string("require_once","red");
				highlight_off_string("trait","red");
				highlight_off_string("while","grn");
				syntax_on--;
			}
			
		} 
	});
	
	$(document).on('change', '#select_language', function(e) {
		current_language = this.options[e.target.selectedIndex].text;
	});
	
});
