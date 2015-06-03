
var applyNames = '';
//var applyNames="/web";

var Mtypeof = function(source){
	var typeofString = Object.prototype.toString.call(source);
	return typeofString.substring(typeofString.lastIndexOf("\ ")+1,typeofString.lastIndexOf("\]"));
}
var MdataConvert = function(objData,objName){
	var data = arguments[0]?objData:{};
	var prefix = arguments[1]?objName:"";
	var output = {};
	switch (Mtypeof(data)) {
		case "Object":
			prefix = prefix.length>0?(prefix+"."):"";
			for(var key in data){
				if(Mtypeof(data[key]) == "String")
				output[prefix+key] = data[key];
				else
				$.extend(output, MdataConvert(data[key],prefix+key));
			}
			break;
		case "Array":
			for(var i=0;i<data.length;i++){
				if(Mtypeof(data[i]) == "String")
				output[prefix+"["+i+"]"] = data[i];
				else
				$.extend(output, MdataConvert(data[i],prefix+"["+i+"]"));
			}
			break;
		default:
			output[prefix] = data.toString();
			break;
	}
	return output;
}
var ajaxError = {
	"ajaxError_100":"-继续。",
	"ajaxError_101":"-切换协议。",
	"ajaxError_200":"-确定。客户端请求已成功。",
	"ajaxError_201":"-已创建。",
	"ajaxError_202":"-已接受。",
	"ajaxError_203":"-非权威性信息。",
	"ajaxError_204":"-无内容。",
	"ajaxError_205":"-重置内容。",
	"ajaxError_206":"-部分内容。",
	"ajaxError_301":"-对象已永久移走，即永久重定向。",
	"ajaxError_302":"-对象已临时移动。",
	"ajaxError_304":"-未修改。",
	"ajaxError_307":"-临时重定向。",
	"ajaxError_401":"-访问被拒绝。IIS定义了许多不同的401错误，它们指明更为具体的错误原因。这些具体的错误代码在浏览器中显示，但不在IIS日志中显示：",
	"ajaxError_401.1":"-登录失败。",
	"ajaxError_401.2":"-服务器配置导致登录失败。",
	"ajaxError_401.3":"-由于ACL对资源的限制而未获得授权。",
	"ajaxError_401.4":"-筛选器授权失败。",
	"ajaxError_401.5":"-ISAPI/CGI应用程序授权失败。",
	"ajaxError_401.7":"–访问被Web服务器上的URL授权策略拒绝。这个错误代码为IIS6.0所专用。",
	"ajaxError_403":"-禁止访问：IIS定义了许多不同的403错误，它们指明更为具体的错误原因：",
	"ajaxError_403.1":"-执行访问被禁止。",
	"ajaxError_403.2":"-读访问被禁止。",
	"ajaxError_403.3":"-写访问被禁止。",
	"ajaxError_403.4":"-要求SSL。",
	"ajaxError_403.5":"-要求SSL128。",
	"ajaxError_403.6":"-IP地址被拒绝。",
	"ajaxError_403.7":"-要求客户端证书。",
	"ajaxError_403.8":"-站点访问被拒绝。",
	"ajaxError_403.9":"-用户数过多。",
	"ajaxError_403.10":"-配置无效。",
	"ajaxError_403.11":"-密码更改。",
	"ajaxError_403.12":"-拒绝访问映射表。",
	"ajaxError_403.13":"-客户端证书被吊销。",
	"ajaxError_403.14":"-拒绝目录列表。",
	"ajaxError_403.15":"-超出客户端访问许可。",
	"ajaxError_403.16":"-客户端证书不受信任或无效。",
	"ajaxError_403.17":"-客户端证书已过期或尚未生效。",
	"ajaxError_403.18":"-在当前的应用程序池中不能执行所请求的URL。这个错误代码为IIS6.0所专用。",
	"ajaxError_403.19":"-不能为这个应用程序池中的客户端执行CGI。这个错误代码为IIS6.0所专用。",
	"ajaxError_403.20":"-Passport登录失败。这个错误代码为IIS6.0所专用。",
	"ajaxError_404":"-未找到。",
	"ajaxError_404.0":"-（无）–没有找到文件或目录。",
	"ajaxError_404.1":"-无法在所请求的端口上访问Web站点。",
	"ajaxError_404.2":"-Web服务扩展锁定策略阻止本请求。",
	"ajaxError_404.3":"-MIME映射策略阻止本请求。",
	"ajaxError_405":"-用来访问本页面的HTTP谓词不被允许（方法不被允许）",
	"ajaxError_406":"-客户端浏览器不接受所请求页面的MIME类型。",
	"ajaxError_407":"-要求进行代理身份验证。",
	"ajaxError_412":"-前提条件失败。",
	"ajaxError_413":"–请求实体太大。",
	"ajaxError_414":"-请求URI太长。",
	"ajaxError_415":"–不支持的媒体类型。",
	"ajaxError_416":"–所请求的范围无法满足。",
	"ajaxError_417":"–执行失败。",
	"ajaxError_423":"–锁定的错误。",
	"ajaxError_500":"-内部服务器错误。",
	"ajaxError_500.12":"-应用程序正忙于在Web服务器上重新启动。",
	"ajaxError_500.13":"-Web服务器太忙。",
	"ajaxError_500.15":"-不允许直接请求Global.asa。",
	"ajaxError_500.16":"–UNC授权凭据不正确。这个错误代码为IIS6.0所专用。",
	"ajaxError_500.18":"–URL授权存储不能打开。这个错误代码为IIS6.0所专用。",
	"ajaxError_500.100":"-内部ASP错误。",
	"ajaxError_501":"-页眉值指定了未实现的配置。",
	"ajaxError_502":"-Web服务器用作网关或代理服务器时收到了无效响应。",
	"ajaxError_502.1":"-CGI应用程序超时。",
	"ajaxError_502.2":"-CGI应用程序出错。application.",
	"ajaxError_503":"-服务不可用。这个错误代码为IIS6.0所专用。",
	"ajaxError_504":"-网关超时。",
	"ajaxError_505":"-HTTP版本不受支持。",
	"ajaxError_110":"-重新启动标记答复。",
	"ajaxError_120":"-服务已就绪，在nnn分钟后开始。",
	"ajaxError_125":"-数据连接已打开，正在开始传输。",
	"ajaxError_150":"-文件状态正常，准备打开数据连接。",
	"ajaxError_202":"-未执行命令，站点上的命令过多。",
	"ajaxError_211":"-系统状态，或系统帮助答复。",
	"ajaxError_212":"-目录状态。",
	"ajaxError_213":"-文件状态。",
	"ajaxError_214":"-帮助消息。",
	"ajaxError_215":"-NAME系统类型，其中，NAME是AssignedNumbers文档中所列的正式系统名称。",
	"ajaxError_220":"-服务就绪，可以执行新用户的请求。",
	"ajaxError_221":"-服务关闭控制连接。如果适当，请注销。",
	"ajaxError_225":"-数据连接打开，没有进行中的传输。",
	"ajaxError_226":"-关闭数据连接。请求的文件操作已成功（例如，传输文件或放弃文件）。",
	"ajaxError_227":"-进入被动模式(h1,h2,h3,h4,p1,p2)。",
	"ajaxError_230":"-用户已登录，继续进行。",
	"ajaxError_250":"-请求的文件操作正确，已完成。",
	"ajaxError_257":"-已创建“PATHNAME”。",
	"ajaxError_332":"-需要登录帐户。",
	"ajaxError_350":"-请求的文件操作正在等待进一步的信息。",
	"ajaxError_425":"-无法打开数据连接。",
	"ajaxError_426":"-Connectionclosed;transferaborted.",
	"ajaxError_450":"-未执行请求的文件操作。文件不可用（例如，文件繁忙）。",
	"ajaxError_451":"-请求的操作异常终止：正在处理本地错误。",
	"ajaxError_452":"-未执行请求的操作。系统存储空间不够。",
	"ajaxError_501":"-在参数中有语法错误。",
	"ajaxError_502":"-未执行命令。",
	"ajaxError_503":"-错误的命令序列。",
	"ajaxError_504":"-未执行该参数的命令。",
	"ajaxError_530":"-未登录。",
	"ajaxError_532":"-存储文件需要帐户。",
	"ajaxError_550":"-未执行请求的操作。文件不可用（例如，未找到文件，没有访问权限）。",
	"ajaxError_551":"-请求的操作异常终止：未知的页面类型。",
	"ajaxError_552":"-请求的文件操作异常终止：超出存储分配（对于当前目录或数据集）。",
	"ajaxError_553":"-未执行请求的操作。不允许的文件名。",
	"ajaxError_150":"-FTP使用两个端口：21用于发送命令，20用于发送数据。状态代码150表示服务器准备在端口20上打开新连接，发送一些数据。",
	"ajaxError_226":"-命令在端口20上打开数据连接以执行操作，如传输文件。该操作成功完成，数据连接已关闭。",
	"ajaxError_230":"-客户端发送正确的密码后，显示该状态代码。它表示用户已成功登录。",
	"ajaxError_331":"-客户端发送用户名后，显示该状态代码。无论所提供的用户名是否为系统中的有效帐户，都将显示该状态代码。",
	"ajaxError_426":"-命令打开数据连接以执行操作，但该操作已被取消，数据连接已关闭。",
	"ajaxError_530":"-该状态代码表示用户无法登录，因为用户名和密码组合无效。如果使用某个用户帐户登录，可能键入错误的用户名或密码，也可能选择只允许匿名访问。如果使用匿名帐户登录，IIS的配置可能拒绝匿名访问。",
	"ajaxError_550":"-命令未被执行，因为指定的文件不可用。例如，要GET的文件并不存在，或试图将文件PUT到您没有写入权限的目录。"
};
var ajaxAction=function(options,paramData,callbackObj){
	var params = MdataConvert(paramData);
	$.ajax({
		url:applyNames+options.url,
		contentType:"application/x-www-form-urlencoded; charset=UTF-8",
		type:options.method,
		dataType:"json",
		data:params,
		success:function(msg){
			callbackObj.callbackHandler(msg);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			callbackObj.exceptionHandler(XMLHttpRequest, textStatus, errorThrown);
			var errorShow = "";
			switch(XMLHttpRequest.status.toString().slice(0,1)){
				case "1":
					errorShow += "信息提示\n";
					break;
				case "2":
					errorShow += "成功接受了请求\n";
					break;
				case "3":
					errorShow += "请重定向\n";
					break;
				case "4":
					errorShow += "未提供有效的身份验证信息\n";
					break;
				case "5":
					errorShow += "服务器由于遇到错误而不能完成该请求\n";
					break;
				default:
					errorShow += "未知\n";
					break;
			}
			
			errorShow += ajaxError.hasOwnProperty("ajaxError_"+XMLHttpRequest.status.toString())?ajaxError["ajaxError_"+XMLHttpRequest.status.toString()]:"";
			console.group(XMLHttpRequest.status.toString() +"  ("+textStatus+")");
			console.group("传递值");
			console.error("%oObject",params);
			console.groupEnd();
			console.group("前台报错");
			console.error(errorShow);
			console.groupEnd();
			console.group("后台返回");
			console.error(XMLHttpRequest.responseText);
			console.groupEnd();
			console.groupEnd();
		}
	});
};