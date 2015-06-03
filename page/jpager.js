/**
 * 接口定义实现类Constructor. from：javascript设计模式 use：js中模拟接口的实现
 */
var Interface = function(name, methods) {
    if(arguments.length != 2) {
        throw new Error("Interface constructor called with " + arguments.length
          + "arguments, but expected exactly 2.");
    }
    this.name = name;
    this.methods = [];
    for(var i = 0, len = methods.length; i < len; i++) {
        if(typeof methods[i] !== 'string') {
            throw new Error("Interface constructor expects method names to be " 
              + "passed in as a string.");
        }
        this.methods.push(methods[i]);        
    }    
};
/**
 * 静态方法。校验object类对象是否实现了指定的方法
 * 
 * @param object
 */
Interface.ensureImplements = function(object) {
    if(arguments.length < 2) {
        throw new Error("Function Interface.ensureImplements called with " + 
          arguments.length  + "arguments, but expected at least 2.");
    }
    for(var i = 1, len = arguments.length; i < len; i++) {
        var interface = arguments[i];
        if(interface.constructor !== Interface) {
            throw new Error("Function Interface.ensureImplements expects arguments "   
              + "two and above to be instances of Interface.");
        }
        for(var j = 0, methodsLen = interface.methods.length; j < methodsLen; j++) {
            var method = interface.methods[j];
            if(!object[method] || typeof object[method] !== 'function') {
                throw new Error("Function Interface.ensureImplements: object " 
                  + "does not implement the " + interface.name 
                  + " interface. Method " + method + " was not found.");
            }
        }
    } 
};
/**
 * 分页接口
 */
var PageInterface = new Interface('PageInterface', ['showView', 'bind']);
/**
 * 分页目标对象实现接口
 */
var PageTargetInterface = new Interface('PageTargetInterface', ['showContent', 'getParams']);

/**
 * 模仿百度搜索的分页
 */
var BaiduPage = function(pageData, formatter) {

	this.pageData = pageData;
	this.formatter = formatter;
	this.pageData.totalPage = 0;
	var total = parseInt(pageData.total);
	var size = parseInt(pageData.size);
	if(total % size == 0) {
		this.pageData.totalPage = total / size;
	}
	else {
		this.pageData.totalPage = parseInt(total / size) + 1;
	}

	// return this; //this 变成了window对象
};
BaiduPage.prototype.showView = function() {

	// 清除上一页的分页信息
	this.pageUl = $(this.pageData.pageDom);
	this.pageUl.empty();
    
	var pageName = this.formatter.pageName;
	var sizeName = this.formatter.sizeName;
	var pageClass = this.pageData.pageClass;
	var _currentPage = this.pageData.page;//
	var _totalPage = this.pageData.totalPage;
	// _currentPage must <= than _totalPage
	if ((_currentPage < 1) || (_totalPage < 1) || (_currentPage > _totalPage)) {
		return false;
	}

	this.pageUl.attr('page-name', pageName);// 记录pageName
	this.pageUl.attr('page-dom', this.pageData.pageDom);// 记录pageName
	if (_totalPage < 1) {

		p = $("<p></p>");
		p.text('暂无记录!');
		p.appendTo(this.pageUl);

		return;
	}

	var li = null;
	var li_a = null;
	// 有前一页
	if (_currentPage > 1) {
		li = $("<li></li>");
		li_a = $("<a></a>");
		li_a.text("前一页");
		li.attr(pageName, _currentPage - 1);
		li_a.appendTo(li);
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
		li_a = $("<a></a>");
		li_a.text(_currentPage - index);
		li.attr(pageName, _currentPage - index);
		li_a.appendTo(li);
		li.appendTo(this.pageUl);
	}
	// 当前页
	li = $("<li></li>");
	li_a = $("<a></a>");
	li_a.text(_currentPage);
	li.attr(pageName, _currentPage);
    li_a.appendTo(li);
	li.addClass(pageClass);
	li.appendTo(this.pageUl);
	// 当前页右边显示
	for (var index = 1; rightCount > 0; rightCount--) {

		li = $("<li></li>");
		li_a = $("<a></a>");
		li_a.text(_currentPage + index);
		li.attr(pageName, _currentPage + index);
		li_a.appendTo(li);
		index++;
		li.appendTo(this.pageUl);
	}
	// 有下一页
	if (_currentPage < _totalPage) {
		li = $("<li></li>");
		li_a = $("<a></a>");
		li_a.text("后一页");
		li.attr(pageName, _currentPage + 1);
		li_a.appendTo(li);
		li.appendTo(this.pageUl);
	}

	return this;

};
/**
 * 事件绑定
 */
BaiduPage.prototype.bind = function() {
	var that = this;
	this.pageUl.children('li').on('click', function() {
		var pageName = $(this).closest('ul').attr('page-name');//记录发送往服务器的请求页的名称
		var page = $(this).attr(pageName);
		var pageDom = $(this).closest('ul').attr('page-dom');//获取分页显示的节点
		loadCommonPageData(pageDom, page, pageName);
	});
};
/**
 * hash绑定 使用锚点分页
 */
BaiduPage.prototype.bindHash = function() {
	var that = this;
	this.pageUl.children('li').on('click', function() {
		var pageName = $(this).closest('ul').attr('page-name');
		var page = $(this).attr(pageName);
		updateHashItem(pageName, page);
	});
};

/**
 * 下拉加载更多
 */
var DropDown = function(pageData, formatter) {

	this.pageData = pageData;
	this.formatter = formatter;
	return this;
};
DropDown.prototype.showView = function() {

	var currentPage = this.pageData.page;// 当前数据从第0页开始算
	var totalPage = this.pageData.total;
	var pageName = this.formatter.page;
	var totalName = this.formatter.total;
	var sizeName = this.formatter.size;

	// 没有记录
	if (totalPage == "0") {
		this.P = $('<p></p>');
		this.P.text('暂无记录!');
		this.P.appendTo(this.dom);
		return this;
	}
	// 清除上一次的下拉标
	$(this.dom).empty();
	// 数据没有加载完
	if (currentPage < totalPage) {
		this.pageImg = $('<img />');
		this.pageImg.attr('src','/resources/images/dropDown_more.png');
		this.pageImg.attr(pageName, currentPage + 1);
		this.pageImg.attr('title', '加载更多');
	}// 否则(数据已经加载完毕)
	else {
		this.pageImg = $('<img />');
		this.pageImg.attr('src','/resources/images/dropDown_stop.png');
		this.pageImg.attr('pageNum', this.pageData.currentPage + 1);
		this.pageImg.attr('title', '无更多信息');
	}
	
	this.pageImg.appendTo(this.dom);

	return this;
};
DropDown.prototype.bind = function() {
};

//
var PageHandler = function(pageData, options, callBack) {
	this.init(pageData);
};

PageHandler.prototype.init = function(pageData) {
	/*
	 * //1.初始类型 var pageTypes = { 'bdPage':'BaiduPage', 'dropDown':'DropDown', };
	 * PageHandler.pageTypes = pageTypes; //2.初始化分页数据
	 */
};

PageHandler.pageTypes = {
	'bdPage': BaiduPage,
	'dropDown': DropDown,
};

PageHandler.create = function(pageType, pageData, formatter) {
	var constructor = PageHandler.pageTypes[pageType];
	constructor = constructor ? constructor : PageHandler.pageTypes['bdPage'];

	return new constructor(pageData, formatter);
}

/*
 * options{ type:分页类型 //method:请求方式post/get url:请求路径 totalName:记录总数的名称
 * pageName:返回后台的当前页的名称 sizeNme:返回后台的每页记录数名称 error:注入异常回调 } formatter:{
 * pageDom:分页显示的dom name:存储字段名称, page:当前页的字段, total:总的记录数, size:每一页显示记录数, }
 * 
 */
/**
 * 分页信息适配器 把分页信息统一格式,分页信息只指定格式的分页信息 pageData { page:当前页, size:每一页多少记录,
 * total:总的记录数, }
 */
var pageAdapter = function(jsonInfo, formatter) {

	var data = jsonInfo[formatter.name];
	var pageData = {};
	pageData.pageClass = formatter.pageClass;
	pageData.pageDom = formatter.pageDom;
	pageData.page = data[formatter.pageName];
	pageData.size = data[formatter.sizeName];
	pageData.total = data[formatter.totalName];

	return pageData;
};
/**
 * hash分页 根据锚点分页，也就是可以实现网页刷新的时候把访问记录记录下来，
 * 仅支持GET请求，应为需要把请求参数写到浏览器的地址栏
 * 因为使用锚点，所以一个网页仅支持使用一个分页
 */
var HashPageController = function(target, options, formatter) {

	if(arguments.length != 3) {
		return this;
	}
	// 判断target是否符合实例要求
	Interface.ensureImplements(target, PageTargetInterface);
	this.init(target, options, formatter);
	
	return this;
};

/**
 * 初始化
 * @param target 需要分页的目标对象
 * @param options 参数
 * @param formatter 分页格式信息
 */
HashPageController.prototype.init = function(target, options, formatter) {
	target.options = options;//把选择参数和分页格式信息记录到target
	target.formatter = formatter;
	this.target = target;
	this.options = options;
	HashPageController.target = target;//记录当前的目标对象
};
/**
 * 销毁当前的分页信息
 */
HashPageController.destroy = function() {
	HashPageController.target = null;
};
/**
 * 请求对调方法，放调用ajax成功后将调用该方法
 * @param jsonInfo
 */
HashPageController.prototype.callbackHandler = function(jsonInfo) {
		// 1.显示内容
		var target = HashPageController.target;
		var options = target.options;
		var formatter = target.formatter;
		target.showContent(jsonInfo);//调用目标方法，渲染数据
		var pageData = pageAdapter(jsonInfo, formatter);//格式化分数据
		// 2.显示分页
		PageHandler.create(options.type, pageData, {
			pageName:options.pageName,
			sizeName:options.sizeName,
		}).showView().bindHash();
};
/**
 * ajax请求失败调用
 * @param XMLHttpRequest
 * @param textStatus
 * @param errorThrown
 */
HashPageController.prototype.exceptionHandler = function(XMLHttpRequest, textStatus, errorThrown) {
	alert("服务器忙!请稍候尝试!");
};
/*
 * 
 * 默认加载，当用户刷新浏览器的时候，根据锚点数据执行的操作
 * 
 */
HashPageController.defaultLoad = function(target, options, formatter) {
	var hashPageCtrl = new HashPageController(target, options, formatter);
	hashPageCtrl.start(1, 10, auto = true);
}

/**
 * 开始执行加载
 * @param page 要加载的页
 * @param size 煤业多少记录
 * @param auto 是否自动加载，也就是是否根据锚点数据夹杂
 */
HashPageController.prototype.start = function(page, size, auto) {

	var pageName = options.pageName;
	var sizeName = options.sizeName;
	var params = null;
	if(auto) {
		params = getHashObject();
		params = params ? params : {};
		var re = /^[0-9]*[1-9][0-9]*$/;
		var _page = params[pageName];
		var _size = params[sizeName];
		params[pageName] = re.test(_page) ? _page : 1;
		params[sizeName] = re.test(_size) ? _size : 10;
		params['auto'] = new Date();
	}
	else {
		params = this.target.getParams();
		params = params ? params : {};
		params[pageName] = page;
		params[sizeName] = size;
	}
	params.url = this.options.url;
	
	setHashObject(params, ['method']);
};

//
HashPageController.prototype.startLoad = function(url, params) {

	loadPageData(url, 'GET' , params, this);
};

/**
 * 默认的加载方式
 * url:请求路径
 * method：请求方法
 * data：请求数据
 * controller：回调控制器
 */
var loadPageData = function (url, method, data, controller) {

	ajaxAction({url:url, method:method}, data, controller);
};

/* hash */
/*
 * 修改hash中某一个值
 */
var updateHashItem = function(key, value) {
	var originalHash = (!window.location.hash) ? null : window.location.hash;
	if(originalHash == null) {
		return null;
	}
	var params = getHashObject();
	params = params ? params : {};
	params[key] = value;
	setHashObject(params);
};

/**
 * 使用对象设置锚点的值
 * @param params
 */
function setHashObject(params) {

	var fragment = '';
	for(var key in params) {
		fragment += key + '=' + params[key] + '&';
	}
	window.location.hash = '#' + fragment;
}

// 获取hash的object形式
function getHashObject() {

	var params = new Object();// store the parameters in fragment
	var originalHash = (!window.location.hash) ? null : window.location.hash;
	if(originalHash == null) {
		return null;
	}
	
	// split the Fragment with '&', and store key-value to the params object;
	var pairs = originalHash.substring(1).split('&');
	for (var i = 0; i < pairs.length; i++) {
		var pos = pairs[i].indexOf('=');
		if (pos == -1){
			continue;
		}
		var key = pairs[i].substring(0, pos);
		var value = pairs[i].substring(pos + 1);
		params[key] = unescape(value);
	}
	return params;
}
// 解析hash
var hashPageHandler = function() {
	// 解析分页的hash数据
	var hash = getHashObject();
	hash = hash ? hash : {};
	var url = hash.url;// 把当前路径作为默认URL
	if(!url) {
		return false;
	}
	
	var options = HashPageController.target.options;
	var pageName = options.pageName;
	var sizeName = options.sizeName;
	hash[pageName] = hash[pageName] ? hash[pageName] : 1;
	hash[pageName] = hash[pageName] ? hash[pageName] : 10;
	var params = hash;
	params.url = undefined;

	var hashPageCtrl = new HashPageController();
	hashPageCtrl.startLoad(url, params);
};
/* hash */

/**
 * 监听锚点变化事件,锚点变化则加载相应的数据
 */
$(window).bind('hashchange', function() {
	hashPageHandler();
});