
var Target = function() {
}

Target.prototype.showContent = function(jsonPageInfo) {
	$.each(jsonPageInfo.list, function(index, user) {
		
	    var html = '<tr>'
		        + '<td>' + user.id +'</td>'
				+ '<td>' + user.name +'</td>'
		    '</tr>';
		$('#user-content').append(html);
	});
};

Target.prototype.getParams = function(jsonPageInfo) {

		return {
			name:'test'
		};
};
	