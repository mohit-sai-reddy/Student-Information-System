create table admin(adminid int primary key, username varchar(255), password varchar(255));

create table admindetails(adminid int, admin_email varchar(50), admin_phone bigint(10), admin_city varchar(50),foreign key(adminid) references admin(adminid));

create table student(studentid int primary key, username varchar(255), password varchar(255));

create table studentdetails(studentid int, stud_email varchar(50), stud_phone bigint(10), stud_city varchar(50), foreign key(studentid) references student(studentid));

create table course(courseid int AUTO_INCREMENT primary key, coursename varchar(50), coursestartdate date, courseendate date);

ALTER TABLE COURSE AUTO_INCREMENT=100;

create table enrollment(studentid int, courseid int, FOREIGN KEY(studentid) references student(studentid), foreign key(courseid) references course(courseid));

create table admincourse(adminid int, courseid int, foreign key(adminid) references admin(adminid), foreign key (courseid) references course(courseid));

create table courserequest(studentid int, courseid int, status varchar(10), foreign key(studentid) references student(studentid), foreign key(courseid) references course(courseid));