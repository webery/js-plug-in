/**
 * 分页工具类
 */

///* get web root */
//function getRootPath_page() {
//	var curWwwPath = window.document.location.href;// 获取主机地址之后的目录，如：http://localhost:8080/ysw/resources/pages/testUser.jsp
//	var pathName = window.document.location.pathname;
//	var pos = curWwwPath.indexOf(pathName);
//	var localhostPaht = curWwwPath.substring(0, pos); // 获取主机地址，如：//
//	// http://localhost:8080
//	var projectName = pathName
//			.substring(0, pathName.substr(1).indexOf('/') + 1)
//			+ "/"; // 获取带"/"的项目名，如：/ysw/
//	var rootPath = localhostPaht + '/';
//	return rootPath;
//}
/** ********************************************************************** */

var PageTool = function(pageData, dom, callBack) {

	this.pageImg = null;
	this.dom = null;// 存放分页数据的元素(一般为div)
	// 分页数据的信息
	this.pageData = {
		defaultPage : "1",// 当前页(1)
		totalPage : "10",// 最大页数(总页数10)
		currentPage : "6",// 当前页(6)
		pageSize : "10",// 每页最大显示记录条数(20)
		currentSize : "0"// 当前页的记录条数
	};

	if (pageData) {
		this.setPageData(pageData);
	}

	if (dom) {
		this.setDom(dom);
	}

	if (callBack) {
		this.setCallBack(callBack);
	}

}

/**
 * 初始化分页信息数
 */
PageTool.prototype.setPageData = function(pageData) {

	this.pageData = {
		// defaultPage : pageData.defaultPage ? pageData.defaultPage : 1,
		totalPage : pageData.paginator.totalPages ? pageData.paginator.totalPages
				: 1,
		currentPage : pageData.paginator.page ? pageData.paginator.page : 1,// 从第0页开始
		pageSize : pageData.paginator.limit ? pageData.paginator.limit : 10,
		currentSize : pageData.paginator.size ? pageData.paginator.size : 0

	};

}

/**
 * 设置回调函数
 */
PageTool.prototype.setCallBack = function(callBack) {
	this.callBack = callBack;
}

PageTool.prototype.setDom = function(dom) {
	this.dom = dom;
}

/**
 * 显示正常分页信息(需要每次全部清除上一次分页信息的记录)
 */
PageTool.prototype.show = function() {

	// 清除上一页的分页信息
	$(this.dom).empty();

	this.pageUl = $(this.dom);
	var _currentPage = this.pageData.currentPage;// 当前数据从第0页开始算
	var _totalPage = this.pageData.totalPage;

	// _currentPage must <= than _totalPage
	if ((_currentPage < 1) || (_totalPage < 1) || (_currentPage > _totalPage)) {
		return false;
	}

	if (_totalPage < 1) {

		p = $("<p></p>");
		p.text('暂无记录!');
		p.appendTo(this.pageUl);

		return;
	}

	var li = null;
	// 有前一页
	if (_currentPage > 1) {
		li = $("<li></li>");
		li.html('<a href="#">前一页</a>');
		li.attr('page', _currentPage - 1);
		li.appendTo(this.pageUl);
	}
	var leftGap = _currentPage - 1;
	var rightGap = _totalPage - _currentPage;
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
	// 当前页左边显示
	for (var index = leftCount; index > 0; index--) {

		li = $("<li></li>");
		li.html('<a href="#">' + (_currentPage - index) + '</a>');
		li.attr('page', _currentPage - index);
		li.appendTo(this.pageUl);
	}
	// 当前页
	
	li = $("<li></li>");
	li.html('<span>' + _currentPage + '<span class="sr-only">(current)</span></span>');
	li.attr('page', _currentPage);
	li.appendTo(this.pageUl);
	li.attr('class', 'active');
	//li.css('background-color', '#FFDC94');
	// 当前页右边显示
	for (var index = 1; rightCount > 0; rightCount--) {

		li = $("<li></li>");
		li.html('<a href="#">' + (_currentPage + index) + '</a>');
		li.attr('page', _currentPage + index);
		index++;
		li.appendTo(this.pageUl);
	}
	// 有下一页
	if (_currentPage < _totalPage) {
		li = $("<li></li>");
		li.html('<a href="#">后一页</a>');
		li.attr('page', _currentPage + 1);
		li.appendTo(this.pageUl);

	}
	this.pageUl.appendTo(this.dom);
};

/**
 * 显示下拉点击加载更多的信息
 */
PageTool.prototype.show_dropDown = function() {

	// 没有记录
	if (this.pageData.totalPage == "0") {
		this.P = $('<p></p>');
		this.P.text('暂无记录!');
		this.P.appendTo(this.dom);
		return;
	}
	// 清除上一次的下拉标
	$(this.dom).empty();
	// 数据没有加载完
	if (this.pageData.currentPage < this.pageData.totalPage) {
		this.pageImg = $('<img />');
		this.pageImg.attr('src', '/resources/images/dropDown_more.png');
		this.pageImg.attr('page', this.pageData.currentPage + 1);
		this.pageImg.attr('title', '加载更多');
	}// 否则(数据已经加载完毕)
	else {
		this.pageImg = $('<img />');
		this.pageImg.attr('src', '/resources/images/dropDown_stop.png');
		this.pageImg.attr('page', this.pageData.currentPage + 1);
		this.pageImg.attr('title', '无更多信息');
	}

	this.pageImg.appendTo(this.dom);
};

/**
 * 
 */
PageTool.prototype.bind = function() {

	var that = this;
	this.pageUl.children("li").on("click", function() {
		that.callBack($(this).attr("page"));
	});
}

/**
 * bind_dropDown必须在show_dropDown之后调用
 */
PageTool.prototype.bind_dropDown = function() {

	// 如果已经加载完成,就不需要给下拉空间添加点击事件
	if (this.pageData.currentPage >= this.pageData.totalPage) {
		return;
	}
	var that = this;// 需要改成代理
	this.pageImg.on("click", function() {
		that.callBack($(this).attr("page"));
	});
}

var AjaxPageParser = function(targetObject, showType) {

	this.targetObject = null;
	this.showType = null;
	this.page = '1';

	if (targetObject) {
		this.setTargetObject(targetObject);
	}

	if (showType) {
		this.setShowType(showType);
	}

	/**
	 * 解析ajax返回的数据
	 */
	this.callbackHandler = function(jsonInfo) {

		// 将分页信息解析出来
		var pageInfo = jsonInfo;
		$.each(jsonInfo, function(index, data) {

			if (typeof (data.pageList) != 'undefined') {
				pageInfo = data;
				return false;
			}

		});

		// 1.判断是否需要清除(加载第一页的时候全部清空)
		if (showType == 'page') {
			$(this.targetObject.pageContainer).empty();
		} else if (this.page == '1') {
			$(this.targetObject.pageContainer).empty();
		}

		// 2.解析数据
		this.targetObject.pageInfoParser(jsonInfo);

		// 3.分页处理
		var pageTool = new PageTool(pageInfo, this.targetObject.dom,
				this.pageCallBack);
		// 3.1传统分页
		if (showType == 'page') {

			pageTool.show();
			// 分页按钮注册事件
			pageTool.bind();

		}// 3.2下拉显示
		else if (showType == 'dropDown') {
			pageTool.show_dropDown();
			// 分页按钮注册事件
			pageTool.bind_dropDown();

		}// 暂无该功能
		else {
		}

	}// this.callbackHandler

	this.exceptionHandler = function(XMLHttpRequest, textStatus, errorThrown) {
		alert("服务器忙!请稍候尝试!");
	}

	var that = this;
	this.pageCallBack = function(page, paramData, url) {

		that.page = page;
		var data = null;

		if (typeof (paramData) != 'undefined' && paramData != null) {
			data = paramData;

		} else if (that.targetObject.paramData != null) {
			data = that.targetObject.paramData;
		} else {
		}

		data = data ? data : {};
		data.page = page;

		that.targetObject.url = url ? url : that.targetObject.url;
		//
		// changeCurrentUrl(that.targetObject.url, data);
		// var loading = new Loading();
		// loading.startLoading();
		try {
			ajaxAction({
				url : that.targetObject.url,
				method : 'GET'
			}, data, that);
			// loading.stopLoading();
		} catch (exception) {

		} finally {
			// loading.stopLoading();
		}

	}// this.pageCallBack
}

AjaxPageParser.prototype.setTargetObject = function(targetObject) {
	this.targetObject = targetObject;
}

AjaxPageParser.prototype.setShowType = function(showType) {
	this.showType = showType ? showType : 'page';
}

AjaxPageParser.prototype.ShowAndbind = function() {

	// get the currentPage & totalPage stored when jsp file to html from the dom
	var currentPage = $(this.targetObject.dom).attr('currentPage');
	var totalPage = $(this.targetObject.dom).attr('totalPage');
	if (typeof (currentPage) == 'undefined' || isNaN(parseInt(currentPage))
			|| typeof (totalPage) == 'undefined' || isNaN(parseInt(totalPage))) {
		return false; // no number(page size must be number, if there are
		// no-number chars, it will refuse the operation)
	}
	if (totalPage < 1) {
		return false;
	}

	// set these values to PageTool
	var pageData = {
		pages : parseInt(totalPage),
		page : parseInt(currentPage),
		pageSize : '15',// ""字符串
		size : '1'
	};
	var pageTool = new PageTool(pageData, this.targetObject.dom,
			this.pageCallBack);
	// 3.1传统分页
	if (this.showType == 'page') {

		pageTool.show();
		pageTool.bind();

	}// 3.2下拉显示
	else if (this.showType == 'dropDown') {
		pageTool.show_dropDown();
		pageTool.bind_dropDown();

	}// 暂无该功能
	else {
	}
}
/* url tool */