/* Licensed under the MIT License, Paris Kasidiaris <pariskasidiaris@gmail.com> */
function notificationCenter(options) {
	var element = document.createElement("ul");
	element.setAttribute("class", "njs-notification-center");
	document.body.appendChild(element);
	if ( typeof options == 'undefined' ) element.options = {};
	else element.options = options;
	element.notify = function(options) {
		var opt = {};
		for ( var attr in element.options ) opt[ attr ] = element.options[ attr ];
		for ( var attr in options ) opt[ attr ] = options[ attr ];
		var n = notification(opt);
		if ( n.DOCUMENT_NODE ) {
			if (!element.firstChild) element.appendChild(n);
			else element.insertBefore(n, element.firstChild);
		}
		n.show();
		return n;	
	}
	element.destroy = function() {
		return this.parentNode.removeChild( this );
	}
	return element;
}

function notification(options) {
	if ( window.webkitNotifications && !window.webkitNotifications.checkPermission() && options.desktopNotification !== false ) {
		var title = options.title , content = options.content , icon = null;
		if ( options.icon ) icon = options.icon;
		var notification = window.webkitNotifications.createNotification( icon , title , content );
		return notification;
	}
	if ( typeof options == "undefined") options = new Object();
	var element = document.createElement("li"), title = document.createElement("div"), content = document.createElement("div"), image = document.createElement("img"), closeButton = document.createElement("span");
	element.setAttribute("class", "njs-notification" );
	content.setAttribute("class", "njs-notification-content");
	if ( typeof options.title != "undefined") {
		var title = document.createElement("div");
		title.setAttribute("class", "njs-notification-title");
		title.textContent = options.title;
		title.style.fontWeight = "bold";
		element.appendChild(title);
	}
	content.innerHTML = options.content;
	element.appendChild(content);
	if ( options.icon ) {
		var icon = document.createElement( 'img' );
		icon.setAttribute( 'src' , options.icon );
		icon.setAttribute( 'class' , 'njs-notification-icon' );
		element.insertBefore( icon , element.firstChild );
	}
	element.show = function() {
		element.style.display = "block";
		if ( options.ondisplay ) options.ondisplay.call( this );
	}
	element.close = function() {
		element.style.display = "none";
		if ( options.onclose ) options.onclose.call( this );
	}
	element.onclick = function (e) {
		if ( options.onclick ) options.onclick.call( this , e );
	}
	element.destroy = function() {
		return this.parentNode.removeChild( this );
	}
	element.getTitle = function() {
		return title.textContent;
	}
	element.getContent = function() {
		return content.innerHTML;
	}
	closeButton.setAttribute("class", "njs-notification-close-button");
	closeButton.innerHTML = "&times;";
	closeButton.onmousedown = function() {
		console.log("Pressed!");
		//element.parentNode.removeChild(element);
		$(element).fadeOut(1000);
	}
	element.appendChild(closeButton);
	return element;
}
