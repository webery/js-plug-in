/**
 * 
 *jsp分页工具
 *weber 2015/1/11
 *JSP文件在前端显示之后，使用js进行分页处理，需要在显示分页的标签指定 currentPage， totalPages， pageSize等参数
 *需要客户端指定CSS样式
 *js会根据以上给定的参数进行分页，生成跳链的a标签
 */
/*dmeo

 //js
 window.onload = function() {
 jspPageHandle('jspPage', 'www.baidu.com');
 };

 //html
 <div id="jspPage" currentPage="1" totalPages="100" params="测试参数" >
 </div>
 */
//
/**
 * 
 * @param pageId
 *            显示分页标签的id
 * @param url
 *            跳链的路径
 */
function jspPageHandle(pageId, url) {
	var jspPageTool = new JspPageTool(pageId, url).createJspPage();
}

var JspPageTool = function(pageId, url) {
	this.pageId = pageId;
	this.url = url;
	this.pageInfo = {};

	return this;
}

// init the page info
JspPageTool.prototype.setPageInfo = function() {
	// get the page infos that stored when jsp was created
	var jspPage = document.getElementById(this.pageId);
	this.jspPage = jspPage;
	this.pageInfo.currentPage = parseInt(jspPage.getAttribute('currentPage'));
	this.pageInfo.totalPages = parseInt(jspPage.getAttribute('totalPages'));
	this.pageInfo.currentPage = this.pageInfo.totalPages < 1 ? 0
			: this.pageInfo.currentPage;
	this.pageInfo.pageSize = parseInt(jspPage.getAttribute('pageSize'));
	this.pageInfo.params = jspPage.getAttribute('params');
}

JspPageTool.prototype.createJspPage = function() {
	this.setPageInfo();
	this.view();
	// this.bind();
}

// no pageSize
// create the page-view
JspPageTool.prototype.view = function() {

	var _totalPages = this.pageInfo.totalPages;
	var _currentPage = this.pageInfo.currentPage;
	var _pageSize = this.pageInfo.pageSize;
	var _params = this.pageInfo.params;
	var hasParam = '';
	if (this.url.search(/\?/i) == -1) {
		hasParam = '?'
	}

	// _currentPage must <= than _totalPages
	/*
	 * if ((_currentPage < 1) || (_totalPages < 1) || (_currentPage >
	 * _totalPages)) { return false; }
	 */
	if ((_currentPage < 1) || (_totalPages < 1) || (_currentPage > _totalPages)) {

		p = document.createElement('p');
		p.innerHtml = '暂无记录!';
		this.jspPage.appendChild(p);
		return false;
	}

	var page_a = null;
	//
	if (_currentPage > 1) {
		page_a = document.createElement('a');
		page_a.innerHTML = '上一页';
		page_a.setAttribute('pageNum', _currentPage - 1);
		page_a.setAttribute('href', setParmsValue('pageNum', _currentPage - 1));
		this.jspPage.appendChild(page_a);
	}
	var leftGap = _currentPage - 1;
	var rightGap = _totalPages - _currentPage;
	var leftCount = 0;
	var rightCount = 0;

	// 1
	if (leftGap >= 5 && rightGap >= 5) {
		leftCount = 5;
		rightCount = 5;
	}// 2
	else if (leftGap < 5 && rightGap < 5) {
		leftCount = leftGap;
		rightCount = rightGap;
	}// 3
	else if ((leftGap < 5 && rightGap == 5) || (leftGap == 5 && rightGap < 5)) {
		leftCount = leftGap;
		rightCount = rightGap;
	}// 4
	else if ((leftGap < 5 && rightGap > 5) || (leftGap > 5 && rightGap < 5)) {

		var maxGap = 0;
		var minGap = 0;

		if (leftGap > rightGap) {
			maxGap = leftGap;
			minGap = rightGap;
		} else {
			maxGap = rightGap;
			minGap = leftGap;
		}

		var need = 5 - minGap;
		var supply = maxGap - 5;

		var finalAdd = need < supply ? need : supply;

		if (leftGap > rightGap) {
			leftCount = 5 + finalAdd;
			rightCount = rightGap;
		} else {
			rightCount = 5 + finalAdd;
			leftCount = leftGap;
		}

	}

	//
	for (var index = leftCount; index > 0; index--) {

		page_a = document.createElement('a');
		page_a.innerHTML = (_currentPage - index);
		page_a.setAttribute('pageNum', _currentPage - index);
		page_a.setAttribute('href', setParmsValue('pageNum', _currentPage - index));
		this.jspPage.appendChild(page_a);
	}
	//
	page_a = document.createElement('a');
	page_a.innerHTML = _currentPage;
	page_a.setAttribute('pageNum', _currentPage);
	page_a.setAttribute('href', setParmsValue('pageNum', _currentPage));
	this.jspPage.appendChild(page_a);

	//
	for (var index = 1; rightCount > 0; rightCount--) {

		page_a = document.createElement('a');
		page_a.innerHTML = (_currentPage + index);
		page_a.setAttribute('pageNum', _currentPage + index);
		page_a.setAttribute('href', setParmsValue('pageNum', _currentPage + index));
		this.jspPage.appendChild(page_a);
		index++;
	}

	//
	if (_currentPage < _totalPages) {

		page_a = document.createElement('a');
		page_a.innerHTML = '下一页';
		page_a.setAttribute('pageNum', _currentPage + 1);
		page_a.setAttribute('href', setParmsValue('pageNum', _currentPage + 1));
		this.jspPage.appendChild(page_a);
	}
}

// after view was created, some events may be binded to the tags
JspPageTool.prototype.bind = function() {
}

/*
 * function removeParam(url, pName) { url = url.search(/\?/i) == -1 ? url + '?' :
 * url; var p_index = url.search(pName); if(p_index != -1) {
 * lastIndexOf(searchvalue,fromindex); }
 * 
 * return url; }
 */

// url
// 设置URL参数的方法
function setParmsValue(parms, parmsValue) {
	var urlstrings = document.URL;
	var args = getUrlParms();
	var values = args[parms];
	var newUrl = null;
	// 如果参数不存在，则添加参数
	if (values == undefined) {
		var query = location.search.substring(1); // 获取查询串
		// 如果Url中已经有参数，则附加参数
		if (query) {
			urlstrings += ("&" + parms + "=" + parmsValue);
		} else {
			urlstrings += ("?" + parms + "=" + parmsValue); // 向Url中添加第一个参数
		}
		newUrl = urlstrings;
	} else {
		newUrl = updateParms(parms, parmsValue); // 修改参数
	}
	
	return newUrl;
}

// 修改URL参数，parms：参数名，parmsValue：参数值，return：修改后的URL
function updateParms(parms, parmsValue) {
	var newUrlParms = "";
	var newUrlBase = location.href.substring(0, location.href.indexOf("?") + 1); // 截取查询字符串前面的url
	var query = location.search.substring(1); // 获取查询串
	var pairs = query.split("&"); // 在逗号处断开
	for (var i = 0; i < pairs.length; i++) {
		var pos = pairs[i].indexOf('='); // 查找name=value
		if (pos == -1)
			continue; // 如果没有找到就跳过
		var argname = pairs[i].substring(0, pos); // 提取name
		var value = pairs[i].substring(pos + 1); // 提取value
		// 如果找到了要修改的参数
		if (findText(argname, parms)) {
			newUrlParms = newUrlParms + (argname + "=" + parmsValue + "&");
		} else {
			newUrlParms += (argname + "=" + value + "&");
		}
	}
	return newUrlBase + newUrlParms.substring(0, newUrlParms.length - 1);
}

// 辅助方法
function findText(urlString, keyWord) {
	return urlString.toLowerCase().indexOf(keyWord.toLowerCase()) != -1 ? true
			: false;
}

// 得到查询字符串参数集合
function getUrlParms() {
	var args = new Object();
	var query = location.search.substring(1); // 获取查询串
	var pairs = query.split("&"); // 在逗号处断开
	for (var i = 0; i < pairs.length; i++) {
		var pos = pairs[i].indexOf('='); // 查找name=value
		if (pos == -1)
			continue; // 如果没有找到就跳过
		var argname = pairs[i].substring(0, pos); // 提取name
		var value = pairs[i].substring(pos + 1); // 提取value
		args[argname] = unescape(value); // 存为属性
	}
	return args;
}