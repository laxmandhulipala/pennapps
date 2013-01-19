window.onload = function(){
	new App();
}

var App = function(){
    this.registerEvents();
}

App.prototype.registerEvents = function(){
    console.log("register events");
    this.registerRegister();
    this.registerLogin();
}

App.prototype.registerRegister = function(){
    $('#register').click(function(e){
	    console.log("button tap");
	    var username = $('#regUsername').val();
	    var password = $('#regPassword').val();
	    console.log("registering ", username);
	    e.preventDefault(); 
	    this.ajaxFormJSON(  {
		    username: username,
			password: password
			},
		'/register',
		function success(data){
		    setTimeout(function() {
		    	$("#registerForm").hide();
		    },5);
		},
    function error(xhr, status, err){
        alert(JSON.stringify(err));
    });
	}.bind(this));
}
    
App.prototype.ajaxFormJSON = function(json, url, onSuccess, onError){
    var data = new FormData();
    for (var key in json){
        data.append(key, json[key]);
    }

    $.ajax({
		url: url,
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		type: 'POST',
		success: onSuccess,
		error: onError
	});
}
    
App.prototype.registerLogin = function(){
    $('#login').click(function(e) {
	    var username = $('#loginUsername').val();
	    var password = $('#loginPassword').val();
	    
	    var data = new FormData();
	    data.append('username', username);
	    data.append('password', password);
	    e.preventDefault();
	    
	    this.ajaxFormJSON({
		    username: username,
		    password: password
	       },
		'/login',
                function success(data){
                    if (data === 'success'){
                    	console.log("success, now log in");
                        window.location = '/static/index.html';
                    }
                    else {
                        alert(JSON.stringify(data));
                    }
                },
                function error(xhr, status, err){
                    alert(JSON.stringify(err));
                });
	}.bind(this));
}
