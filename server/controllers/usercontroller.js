const mysql = require('mysql2');

let isLoggedIn = false;
let loggedIn = "";
let id=0;


const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:""
});

con.connect((error)=> {
    if(error) throw(error);
    console.log("connected")
});

exports.index = (req, res)=>{
    let data = req.query.cond;
    console.log(data);
    if(data)
        res.render('', {cond:data});
    else res.render('');
}

exports.logout = (req,res)=>{
    isLoggedIn = false;
    id=0;
    loggedIn=" ";
    res.redirect('/?cond=Successfully logged out');
}

exports.alogin = (req, res)=>{
    res.render('admin_login');
}

exports.aloginp = (req, res)=>{
    const data = req.body;
    console.log(data);
    con.query("SELECT * FROM ADMIN WHERE USERNAME=?;", [req.body.username],(err,result)=>{
        if(err) throw err;
        else console.log(res);
        if(result.length!=0)
        {
            for(r of result)
            {
                console.log("DEETTSSS\n",r);
                if(r.password==req.body.password){
                    loggedIn = req.body.username;
                    isLoggedIn = true;
                    id=r.adminid;
                    console.log((id));
                    console.log("Login success");
                    // console.log(r);
                    console.log("0");
                    return res.redirect('/admin_details')//, {name:req.body.username})
                }
                //else return res.render("admin_login", {cond:true});
            }
            console.log("1");
            return res.render("admin_login", {cond:true});
        }
        
        else {console.log("2");return res.render("admin_login", {cond:true});}
    })
}



exports.slogin = (req, res)=>{
    let data = req.query.cond;
    console.log(data);
    if(data)
        res.render('student_login', {cond:data});
    else res.render('student_login');
}

exports.sloginp = (req, res)=>{
    con.query("SELECT * FROM Student WHERE USERNAME=?;", [req.body.username],(err,result)=>{
        if(err) throw err;
        else console.log(result);
        if(result.length!=0)
        {
            for(r of result)
            {
                if(r.password==req.body.password){
                    loggedIn = req.body.username;
                    isLoggedIn = true;
                    id=r.studentid;
                    con.query("SELECT STUD_CITY FROM STUDENTDETAILS WHERE STUDENTID=?", [id], (err,res)=>{
                        city=res[0].STUD_CITY;
                        req.body.city=res[0].city;
                    })
                    
                    console.log("Login success");
                    return res.redirect('/student_details')//, {name:req.body.username})
                } 
            }
            return res.render("student_login", {cond:"Please check username and password"});
        }
        else res.render("student_login", {cond:"Please check username and password"});
    })
}

exports.adetails = (req, res)=>{
    if(isLoggedIn){
        con.query("select c.courseid, c.coursename, c.coursestartdate, c.courseendate from admincourse a, course c where a.courseid=c.courseid and a.adminid=? ORDER BY c.courseid;",
            [id],(err,result)=>{
                for(r of result){
                    let d = new Date(r.coursestartdate);
                    date=d.getFullYear()+"-"+(("0"+(d.getMonth()+1)).slice(-2))+"-"+(("0"+(d.getDate())).slice(-2));
                    console.log("DATE: "+date, typeof(date));
                    r.coursestartdate=date;
                    d = new Date(r.courseendate);
                    date=d.getFullYear()+"-"+(("0"+(d.getMonth()+1)).slice(-2))+"-"+(("0"+(d.getDate())).slice(-2))
                    console.log("DATE: "+date, typeof(date));
                    r.courseendate=date;
                }
                    con.query("select a.courseid, s.studentid, s.username from admincourse a, student s, enrollment e where adminid=? and a.courseid=e.courseid and e.studentid=s.studentid ORDER BY e.courseid, s.studentid;", [id],
                            (err, result1)=>{
                                if(err) throw err;
                                else{
                                    con.query(`select c.studentid, c.courseid, s.username from courserequest c, admincourse a, student s where a.adminid=${id} and a.courseid=c.courseid and c.studentid=s.studentid and status="PENDING" ORDER BY c.courseid, s.studentid;`,
                                     (err,result2)=>{
                                        console.log(result2);
                                        if(err) console.log(err);
                                        else
                                        {
                                            let data = req.query.cond;
                                            console.log(data);
                                            if(data)
                                                return res.render('admin_details', {name:loggedIn, courserows:result, studrows:result1, requestrows:result2, cond:data})
                                            else return res.render('admin_details', {name:loggedIn, courserows:result, studrows:result1, requestrows:result2})
                                        }  
                                     })
                                    }
                            })
            });
        // res.render('admin_details', {name:loggedIn})
    }
    else res.redirect('/?cond=Please login and try again')
}

exports.sdetails = (req, res)=>{
    if(isLoggedIn){
        // console.log(loggedIn,req.body);
        con.query("select e.courseid, c.coursename from enrollment e, course c where studentid=? and c.courseid=e.courseid order by 1;", [id],
            (err, result)=>{
                con.query("select * from course where courseid not in (select courseid from enrollment where studentid=?) order by 1;",
                [id], (err, result2)=>{
                        console.log(result2);
                        for(r of result2)
                            r.studentid=id;
                        let data = req.query.cond;
                        console.log(data);
                        if(data)
                            return res.render('student_details',{name:loggedIn, city:city, courserows:result, availrows:result2, cond:data});
                        else return res.render('student_details',{name:loggedIn, city:city, courserows:result, availrows:result2});
                        
                    });
                    
            });
    }   
    else res.redirect('/?cond=Please login and try again');
}


exports.ssignup = (req, res)=>{
    res.render('student_signup');
}

exports.ssignupp = (req, res)=>{
    console.log(req.body);
    con.beginTransaction();
    con.query("INSERT INTO STUDENT VALUES(?,?,?);", [req.body.usn, req.body.username, req.body.password], (err,result1)=>{
        if(err) throw err;
        else{
            con.query("INSERT INTO STUDENTDETAILS VALUES(?,?,?,?);", [Number(req.body.usn), req.body.email, Number(req.body.number), req.body.city], (err,result2)=>{
                if(err) {
                    con.rollback()
                    throw err;
                }
                else{
                    console.log(result1, result2);
                    con.commit();
                    return res.redirect("student_login?cond=Signup Successful")
                }
            })
        }
    })
    // return res.render('student_signup');
}

exports.aprofile = (req, res)=>{
    if(isLoggedIn){
        con.query("SELECT a.adminid, a.username, b.admin_email, b.admin_phone FROM admin a, admindetails b where a.adminid=? and a.adminid=b.adminid",
            [id], (err, result)=>{
                console.log(result);
                return res.render('admin_profile', {name:result[0].username, id:result[0].adminid, phone:result[0].admin_phone, email:result[0].admin_email});
            })
        }
    else res.redirect('/?cond=Please login and try again');
}

exports.sprofile = (req, res)=>{
    if(isLoggedIn){
        con.query("SELECT s.username, s1.stud_email, s1.stud_phone FROM student s, studentdetails s1 where s.studentid=? and s.studentid=s1.studentid",
            [id], (err, result)=>{
                console.log(result);
                return res.render('student_profile', {name:result[0].username, phone:result[0].stud_phone, email:result[0].stud_email, id:id});
            })
        }
    else res.redirect('/?cond=Please login and try again');
}

exports.enroll = (req,res)=>{
    if(isLoggedIn){
        const data=req.query;
        console.log(data)
        con.beginTransaction()
        con.query("SELECT status FROM COURSEREQUEST WHERE studentid=? and courseid=?;", [Number(req.query.studentid), Number(req.query.courseid)],
            (err,result)=>{
                if(result.length!=0)
                {
                     return res.redirect('/student_details?cond=Already submited')
                }    
                con.query("INSERT INTO COURSEREQUEST VALUES(?,?,?);", [Number(req.query.studentid), Number(req.query.courseid), "Pending"],
                    (err, result)=>{
                        if(err) {
                            con.rollback();
                            res.redirect('/student_details?cond=Submitted Unuccessfully')
                        }
                        else {
                            con.commit();
                            res.redirect('/student_details?cond=Submitted Successfully');
                        }
                    })
         
            }
            )}
        else res.redirect('/?cond=Please login and try again');
}

exports.accept = (req,res)=>{
    if(isLoggedIn){
        const data=req.query;
        console.log(data);
        con.beginTransaction();
        con.query("INSERT INTO ENROLLMENT VALUES(?,?);",[Number(req.query.studentid),Number(req.query.courseid)], (err,result)=>{
            if(err){
                con.rollback();
                throw err;
            }
            else{
                console.log(result);
                con.query(`update courserequest set status="Approved" where studentid=? and courseid=?;`,[Number(req.query.studentid),Number(req.query.courseid)], (err,result)=>{
                    if(err){
                        con.rollback();
                        throw err;
                    }
                    else{
                        con.commit();
                        res.redirect('/admin_details?cond=Enrolled Student');
                    }
                });
            }
        })
    }
    else res.redirect('/?cond=Please login and try again');
}

exports.reject = (req,res)=>{
    if(isLoggedIn){
        const data=req.query;
        console.log(data);
        con.beginTransaction();
        con.query(`update courserequest set status="Rejected" where studentid=? and courseid=?;`,[Number(req.query.studentid),Number(req.query.courseid)], (err,result)=>{
            if(err){
                con.rollback();
                throw err;
            }
            else{
                con.commit();
                res.redirect('/admin_details?cond=Rejected Student');
            }
        })
    }
    else res.redirect('/?cond=Please login and try again');
}

exports.updateProfile = (req, res) => {
    if (isLoggedIn) {
        con.beginTransaction();
        const studentId = id; // Fetching studentId from the request body
        const { name, email, phone } = req.body; // Destructuring name, email, phone from req.body

        console.log('Received studentId:', studentId);
        console.log('Received name:', name);
        console.log('Received email:', email);
        console.log('Received phone:', phone);

        con.query(
            'UPDATE student SET username = ? WHERE studentid = ?',
            [name, studentId],
            (err1, result1) => {
                if (err1) {
                    con.rollback();
                    console.error('Error updating student name:', err1);
                    return res.status(500).json({ error: 'Error updating student name' });
                }
                con.query(
                    'UPDATE studentdetails SET stud_email = ?, stud_phone = ? WHERE studentid = ?',
                    [email, phone, studentId],
                    (err2, result2) => {
                        if (err2) {
                            con.rollback();
                            console.error('Error updating student details:', err2);
                            return res.status(500).json({ error: 'Error updating student details' });
                        }
                        loggedIn=name;
                        con.commit();
                        return res.status(200).json({ message: 'Profile updated successfully' });
                    }
                );
            }
        );
    } else {
        res.redirect('/?cond=Please login and try again');
    }
}

exports.updateAdminProfile = (req, res) => {
    if (isLoggedIn) {
        con.beginTransaction();
        const AdminId = id; // Fetching studentId from the request body
        const { name, email, phone } = req.body; // Destructuring name, email, phone from req.body

        console.log('Received Admin:', AdminId);
        console.log('Received name:', name);
        console.log('Received email:', email);
        console.log('Received phone:', phone);

        con.query(
            'UPDATE admin SET username = ? WHERE adminid = ?',
            [name, AdminId],
            (err1, result1) => {
                if (err1) {
                    con.rollback();
                    console.error('Error updating student name:', err1);
                    return res.status(500).json({ error: 'Error updating student name' });
                }
                con.query(
                    'UPDATE admindetails SET admin_email = ?, admin_phone = ? WHERE adminid = ?',
                    [email, phone, AdminId],
                    (err2, result2) => {
                        if (err2) {
                            con.rollback();
                            console.error('Error updating student details:', err2);
                            return res.status(500).json({ error: 'Error updating student details' });
                        }
                        loggedIn=name;
                        con.commit();
                        return res.status(200).json({ message: 'Profile updated successfully' });
                    }
                );
            }
        );
    } else {
        res.redirect('/?cond=Please login and try again');
    }
}

exports.acourse = (req, res) => {
    if(isLoggedIn){
        let data = req.query.cond;
        console.log(data);
        if(data)
            res.render('add_course', {cond:data});
        else res.render('add_course');
    
    }
    else res.redirect('/?cond=Please login and try again')
}

exports.acoursep = (req, res) => {
    if(isLoggedIn){
        data = req.body;
        console.log(data);
        con.beginTransaction();
        con.query("INSERT INTO COURSE(coursename, coursestartdate, courseendate) VALUES(?,?,?)", [data.coursename, data.startdate, data.enddate], (err, result)=>{
            if(err)
            {
                con.rollback();
                res.redirect('/add_course?cond=Unsuccessful')
            }
            else{
                con.query("INSERT INTO ADMINCOURSE VALUES(?,?)", [id, result.insertId], (err, result)=>{
                    if(err)
                    {
                        con.rollback();
                        res.redirect('/add_course?cond=Unsuccessful')
                    }
                    else {
                        con.commit()
                        res.redirect('/add_course?cond=Successful')
                    }
                })
            }
        })
    }
    else res.redirect('/?cond=Please login and try again')
}