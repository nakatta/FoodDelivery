const User = require('../models/user.model')

module.exports = {
    // show trang đăng nhập
    login: (req, res) => {
        const status = req.session.status
        if (status != undefined) req.session.status = undefined
        res.render('page/login',{
            title: 'Login',
            status: status
        })
    },

    // show trang đăng ký
    register: (req, res) => {
        const status = req.session.status
        if (status != undefined) req.session.status = undefined
        res.render('page/register',{
            title: 'Register', 
            status: status,
        })
    },

    // Xử lý đăng nhập
    loginPost: async (req, res) => {
        var userReq = req.body;
        if (userReq.email == 'admin@gmail.com' && userReq.password == '123') {
            req.session.status = "Logged in successfully"
            res.cookie('user_id', userReq.email, {
                signed: true
            });
            res.redirect("/admin");
        } else {
            var user = await User.findOne(userReq);

            if (user) {
                req.session.status = "Logged in successfully"
                res.cookie('user_id', user.fullname, {
                    signed: true
                });
                res.redirect("/");
            } else {
                req.session.status = "Login failed"
                res.redirect("/login");
            }
        }

    },

    // xử lý đăng ký
    registerPost: async (req, res) => {
        var user = req.body;
        if (user.email == 'admin@gmail.com' || user.email == 'admin@gmail.com' && user.password == '123') {
            req.session.status = "Registration failed"
            res.redirect("/login/register");
        } else {
            if (/@gmail\.com$/.test(user.email)) {

                var checkuser = await User.findOne({email: user.email});
                if (checkuser == null) {
                    await new User(user).save()
                    req.session.status = "Sign Up Success"
                    res.redirect("/login");
                } else {
                    req.session.status = "Registration failed"
                    res.redirect("/login/register");
                }
            } else {
                req.session.status = "Registration failed"
                res.redirect("/login/register");
            }
        }
    },

    logout: (req, res) => {
        req.session.destroy();
		res.clearCookie('user_id');
		res.redirect("/login")
	},


}
