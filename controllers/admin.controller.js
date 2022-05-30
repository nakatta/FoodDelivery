const User = require('../models/user.model')
const Food = require('../models/food.model')
const Order = require('../models/order.model')

module.exports = {
    // Show doashboard
    index: async (req, res) => {
        const status = req.session.status
        if (status != undefined) req.session.status = undefined
        const numUser = await (await User.find()).length;
        const numFood = await (await Food.find()).length;
        const numOrder = await (await Order.find()).length;

        res.render('pageAdmin/home',{
            title: 'Admin | Home',
            status: status,
            user: res.locals.user,
            numFood: numFood,
            numOrder: numOrder,
            numUser: numUser,
        })
    },

    // show user
    user: async (req, res) => {
        const status = req.session.status
        if (status != undefined) req.session.status = undefined
        const users = await User.find();
        res.render('pageAdmin/users',{
            title: 'Admin | User',
            status: status,
            user: res.locals.user,
            users: users
        })
    },

    //add user
    addUser: async (req, res) => {
        const userReq = req.body;
        var checkuser = await User.findOne({email: userReq.email});
        if (checkuser == null) {
			await new User(userReq).save()
            req.session.status = "More success"
		} else {
            req.session.status = "Add Failure. Email exists"
		}

        res.redirect("/admin/users");
    },

    // edit user
    editUser: async (req, res) => {
        const filter = { _id: req.body.edit };
        const update = {
            fullname: req.body.fullname,
            email: req.body.email,
            password: req.body.password,
        };
        var checkuser = await User.findOne({email: req.body.email});
        
        if (checkuser == null) {
            let doc = await User.updateOne(filter, update);
            if (doc.ok == 1) {
                req.session.status = "Successfully Repaired"
            } else {
                req.session.status = "Fix Failure."
            }
		} else {
            req.session.status = "Add Failure. Email exists"
		}

        res.redirect("/admin/users");
    },

    //delete user
    deleteUser: async (req, res) => {
        const _id = req.params.id;
        const doc = await User.deleteOne({ _id: _id });
        if (doc.ok == 1) {
            res.send(true);
        } else {
            res.send(false);
        }
    }, 

    //show food
    food: async (req, res) => {
        const status = req.session.status
        if (status != undefined) req.session.status = undefined
        const foods = await Food.find();
        res.render('pageAdmin/foods',{
            title: 'Admin | Food',
            status: status,
            user: res.locals.user,
            foods: foods
        })
    },

    //add food
    addFood: (req, res) => {
        let img = req.files.image
        img.mv("./public/images/"+img.name, async (err) =>{
            if (err) throw err;

            const food = {
                name: req.body.name,
                image: img.name,
                price: req.body.price,
            }

            await new Food(food).save()
            req.session.status = "More success"
            res.redirect("/admin/foods")
        })
    },

    //edit food
    editFood: async (req, res) => {
        const filter = { _id: req.body.edit };
        var update = {}
        if (req.files == null) {
            update.name = req.body.name
            update.image = req.body.img,
                update.price = req.body.price
        } else {
            let img = req.files.image
            const err = await img.mv("./public/images/" + img.name)
            if (err) return err
            update.name = req.body.name
            update.image = img.name
            update.price = req.body.price
        }

        let doc = await Food.updateOne(filter, update);
        if (doc.ok == 1) {
            req.session.status = "Successfully Repaired"
        } else {
            req.session.status = "Fix Failure."
        }
        res.redirect("/admin/foods")
    },

    //delete food
    deleteFood: async (req, res) => {
        const _id = req.params.id;
        const doc = await Food.deleteOne({ _id: _id });
        if (doc.ok == 1) {
            res.send(true);
        } else {
            res.send(false);
        }
    },

    //show orders
    orders: async (req, res) => {
        const status = req.session.status
        if (status != undefined) req.session.status = undefined
        const orders = await Order.find();
        res.render('pageAdmin/order',{
            title: 'Admin | Order',
            status: status,
            user: res.locals.user,
            orders: orders
        })
    },

    //delete order
    deleteOrder: async (req, res) => {
        const _id = req.params.id;
        const doc = await Order.deleteOne({ _id: _id });
        if (doc.ok == 1) {
            res.send(true);
        } else {
            res.send(false);
        }
    },
}
