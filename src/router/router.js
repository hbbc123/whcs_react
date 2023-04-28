import React from "react";
import Index from "./view/index/Index";
import Plus from "./Plus";
function lazy(path) {
	const Comp = React.lazy(() => import(`${path}`));
	return (
		<React.Suspense fallback={<>加载中</>}>
			<Comp />
		</React.Suspense>
	);
}

export default [
	{
		path: "/ent",
		element: <Plus src={"./view/ent/Ent.js"} />,

		// path: '/home',
		// element: <Ent />,
		// children: [
		//     {
		//         path: 'ent',
		//         element: <Ent />
		//     },

		// ]
	},
	{
		path: "/home",
		element: <Plus src={"./view/index/Index.js"}/>,
		children: [
			{
				path: "head", //首页
				element: <Plus src={"./view/index/head/Head.js"} />,
			},
			{
				path: "tong", //党政/首页
				element: <Plus src={"./view/index/tong/Tong.js"} />,
			},
			{
				path: "tong_Punishment", //党政/处分首页
				element: <Plus src={"./view/index/tong/Punishment.js"} />,
			},
			{
				path: "tong_PunishmentX/:id/:tf", //党政/处分详情
				element: <Plus src={"./view/index/tong/PunishmentX.js"} />,
			},
			{
				path: "tong_PunishmentX_up/:id", //党政/处分修改，新增
				element: <Plus src={"./view/index/tong/PunishmentXup.js"} />,
			},
			{
				path: "Overview", //人事处/总览表
				element: <Plus src={"./view/index/teacher/Overview.js"} />,
			},
			{
				path: "Beforestudent", //人事处/教师管理
				element: <Plus src={"./view/index/teacher/Beforestudent.js"} />,
			},
			{
				path: "teacher", //人事处/历史教职工
				element: <Plus src={"./view/index/teacher/Teacher.js"} />,
			},
			{
				path: "teacherAdd", //人事处/添加教职工
				element: <Plus src={"./view/index/teacher/TeacherAdd.js"} />,
			},
			{
				path: "distribution", //教务处/分配班级
				element: <Plus src={"./view/index/educational/Distribution.js"} />,
			},
			{
				path: "class_arrange", //教务处/课表安排
				element: <Plus src={"./view/index/educational/Carrange.js"} />,
			},
			{
				path: "Course", //教务处/课程管理
				element: <Plus src={"./view/index/educational/Course.js"} />,
			},
			{
				path: "class_coach", //教务处/辅导员/班主任安排
				element: <Plus src={"./view/index/educational/Coach.js"} />,
			},
			{
				path: "class_punishment", //教务处/处分管理
				element: <Plus src={"./view/index/educational/Punishment.js"} />,
			},
			{
				path: "class_punishment_x/:id/:student_id/:tf", //教务处/处分管理/查看详情
				element: <Plus src={"./view/index/educational/PunishmentX.js"} />,
			},
			{
				path: "class_punishment/add", //教务处/处分管理/添加处分
				element: <Plus src={"./view/index/educational/Punishment_add.js"} />,
			},
			{
				path: "ClssManagement", //教务处/班级管理
				element: <Plus src={"./view/index/educational/ClssManagement.js"} />,
			},
			{
				path: "Register", //教务处/成绩录入
				element: <Plus src={"./view/index/educational/Register.js"} />,
			},
			{
				path: "Score", //教务处/成绩管理
				element: <Plus src={"./view/index/educational/Score.js"} />,
			},
			{
				path: "Selectclass", //教务处/选修课安排
				element: <Plus src={"./view/index/educational/Selectclass.js"} />,
			},
			{
				path: "Dormfen", //学工处/宿舍分配
				element: <Plus src={"./view/index/learning/Dormfen.js"} />,
			},
			{
				path: "Graduate", //学工处/毕业管理
				element: <Plus src={"./view/index/learning/Graduate.js"} />,
			},
			{
				path: "Beforestudent", //学工处/查看往届学生
				element: <Plus src={"./view/index/learning/Beforestudent.js"} />,
			},
			{
				path: "Management", //学工处/学生管理
				element: <Plus src={"./view/index/learning/Management.js"} />,
			},
			{
				path: "Leaveset", //学工处/请假设置
				element: <Plus src={"./view/index/learning/Leaveset.js"} />,
			},
			{
				path: "Dormxiu", //学工处/宿舍分配
				element: <Plus src={"./view/index/learning/Dormxiu.js"} />,
			},
			{
				path: "Member", //校团委/团员管理
				element: <Plus src={"./view/index/member/Member.js"} />,
			},
			{
				path: "book", //图书馆/图书总览表
				element: <Plus src={"./view/index/book/Book.js"} />,
			},
			{
				path: "book_Borrow", //图书馆/图书总览表
				element: <Plus src={"./view/index/book/Borrow.js"} />,
			},
			{
				path: "class", //班级管理/总览
				element: <Plus src={"./view/index/class/Class.js"} />,
			},
			{
				path: "class_day", //班级管理/课表查看
				element: <Plus src={"./view/index/class/ClassDay.js"} />,
			},
			{
				path: "Systemroot", //系统设置/权限设置
				element: <Plus src={"./view/index/system/Systemroot.js"} />,
			},
			{
				path: "Functionset", //系统设置/功能设置
				element: <Plus src={"./view/index/system/Functionset.js"} />,
			},
			{
				path: "my_punishment", //我的处分
				element: <Plus src={"./view/index/teacher/Mypunishment.js"} />,
			},
			{
				path: "my_class_day", //我的课程
				element: <Plus src={"./view/index/teacher/Myclassday.js"} />,
			},
			{
				path: "Moneyall", //财务处/审批  
				element: <Plus src={"./view/index/money/Moneyall.js"} />,
			},
			{
				path: "Moneyset", //财务处/经费设置  
				element: <Plus src={"./view/index/money/Moneyset.js"} />,
			},
			{
				path: "Moneyapply", //我的经费申请
				element: <Plus src={"./view/index/money/Moneyapply.js"} />,
			},
			{
				path: "Moneyadd", //我的经费申请Moneyadd
				element: <Plus src={"./view/index/money/Moneyadd.js"} />,
			},
			{
				path: "Moneywrite/:id", //经费查看
				element: <Plus src={"./view/index/money/Moneywrite.js"} />,
			},
            {
				path: "Studnet_class", //学生的班级
				element: <Plus src={"./view/index/student/Studnet_class.js"} />,
			},
			{
				path: "Studnet_class_day", //学生的课程
				element: <Plus src={"./view/index/student/Studnet_class_day.js"} />,
			},
			{
				path: "Student_select", //学生的选修课
				element: <Plus src={"./view/index/student/Student_select.js"} />,
			},
			{
				path: "Student_grade", //学生的成绩
				element: <Plus src={"./view/index/student/Student_grade.js"} />,
			},
            {
				path: "Student_punishment", //学生的处分
				element: <Plus src={"./view/index/student/Student_punishment.js"} />,
			}, 
            {
				path: "Student_book", //学生的借阅的书籍
				element: <Plus src={"./view/index/student/Student_book.js"} />,
			},
            {
				path: "Student_dorm", //报修
				element: <Plus src={"./view/index/student/Student_dorm.js"} />,
			},
            {
				path: "Dormwrite/:id/:tf", //报修详情
				element: <Plus src={"./view/index/learning/Dormwrite.js"} />,
			},
			{
				path: "Student_dormadd", //报修详情
				element: <Plus src={"./view/index/student/Student_dormadd.js"} />,
			},
			{
				path: "Leave", //请假申请
				element: <Plus src={"./view/index/leave/Leave.js"} />,
			},
			{
				path: "Leavelook/:id", //请假申请查看
				element: <Plus src={"./view/index/leave/Leavelook.js"} />,
			},
			{
				path: "Leaveadd", //请假申请  新增
				element: <Plus src={"./view/index/leave/Leaveadd.js"} />,
			},
			{
				path: "Leaveroot", //请假申请  审批
				element: <Plus src={"./view/index/leave/Leaveroot.js"} />,
			},
			{
				path: "Inform", //通知
				element: <Plus src={"./view/index/inform/Inform.js"} />,
			},
			
		],
	},
];
