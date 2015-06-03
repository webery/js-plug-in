<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
	+ request.getServerName() + ":" + request.getServerPort()
			+ path;
%>
<div class="panel panel-default">
	<div class="panel-heading">
		<form class="form-inline">
			<div class="form-group">
				<label class="sr-only" for="name"></label> <input type="text"
					class="form-control" name="search-user" id="search-user"
					maxlength="20" placeholder="课程名称">
			</div>
			<div class="form-group">
				<a id="btn-q-user" class="btn btn-primary">查詢</a>
			</div>
		</form>
	</div>
	<div class="panel-body"></div>
	<div class="table-responsive">
		<table class="table table-bordered table-hover">
			<thead>
				<tr>
					<th>工号</th>
					<th>名字</th>
					<th>职称</th>
					<th>学院</th>
					<th>专业</th>
					<th>详情</th>
				</tr>
			</thead>
			<tbody id="user-content">
			</tbody>
		</table>
	</div>
	<div class="panel-footer">
		<nav>
			<ul id="user-page" class="pagination">
			</ul>
		</nav>
	</div>
</div>

<!-- 弹窗 -->
<div id="user-detail">
	<div class="modal fade" id="userModal" tabindex="-1" role="dialog"
		aria-labelledby="exampleModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
					<h4 class="modal-title">教师详情</h4>
				</div>
				<div class="modal-body">
					<form id="user-form" class="form-horizontal">
						<div class="form-group">
							<label for="id" class="col-sm-2 control-label">工号</label>
							<div class="col-sm-4">
								<input type="text" class="form-control" name="id" id="user-id"
									pattern="[A-Za-z0-9]{5,15}" maxlength="10"
									placeholder="5-15个数字或字母" required>
							</div>
						</div>
						<div class="form-group">
							<label for="name" class="col-sm-2 control-label">姓名</label>
							<div class="col-sm-4">
								<input type="text" class="form-control" id="user-name"
									name="name" maxlength="20" placeholder="1-20个字" required>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-2 control-label" for="user-college">学院</label>
							<div class="col-sm-3">
								<select name="college.id" id="user-college" class="form-control">
									<option></option>
								</select>
							</div>
							<label for="major" class="col-sm-2 control-label">专业</label>
							<div class="col-sm-3">
								<select name="major.id" id="user-major" class="form-control">
									<option></option>
								</select>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-2 control-label" for="user-teacherTitle">职称</label>
							<div class="col-sm-3">
								<select name="teacherTitle.id" id="user-teacherTitle"
									class="form-control"><option></option>
								</select>
							</div>
							<label for="user-workload" class="col-sm-2 control-label">标准工作量</label>
							<div class="col-sm-2">
								<input type="text" class="form-control" name="workload"
									id="user-workload" maxlength="3" pattern="^[1-9]\d*(\.\d+)?$"
									placeholder="大于0" required>
							</div>
						</div>
						<div class="form-group">
							<label for="user-price" class="col-sm-2 control-label">单位工作量工资</label>
							<div class="col-sm-2">
								<input type="text" class="form-control" name="price"
									id="user-price" maxlength="3" pattern="^[1-9]\d*(\.\d+)?$"
									placeholder="大于0" required>
							</div>
						</div>
						<div class="form-group">
							<label for="user-remark" class="col-sm-2 control-label">备注</label>
							<div class="col-sm-offset-2 col-sm-10">
								<textarea class="form-control" id="user-remark" name="remark"
									placeholder="0-100个字" maxlength="100" rows="3"
									style="resize: none"></textarea>
							</div>
						</div>
						<div class="form-group">
							<div class="col-sm-offset-2 col-sm-10">
								<button type="submit" id="user-submit" class="btn btn-primary">保存</button>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- 弹窗结束 -->