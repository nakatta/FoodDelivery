const User = require('../models/user.model')
const Food = require('../models/food.model')
const Order = require('../models/order.model')

const randomFood = (limit,list) => {
    const array = [];
    const arr = [];

    while (true) {
        if (array.length == limit) break
        var n = Math.floor(Math.random() * list.length)
        if (arr.indexOf(n) != -1) continue;
        array.push(list[n]) 
        arr.push(n)
    }

    return array;
}


module.exports = {

    index: async (req, res) => {
        const status = req.session.status
        if (status != undefined) req.session.status = undefined
        const foodAll = await Food.find().exec();
        const foods = randomFood(6,foodAll)
        res.render("page/home", {
            title: "Home",
            status: status,
            user: res.locals.user,
            foods: foods,
        })
    },

    foods: async (req, res) => {
        const status = req.session.status
        if (status != undefined) req.session.status = undefined
        const foods = await Food.find().exec();
        res.render("page/foods", {
            title: "Foods",
            status: status,
            user: res.locals.user,
            foods: foods,
        })
    },


    //show cart
    carts: (req, res) => {
        const status = req.session.status
        if (status != undefined) req.session.status = undefined
        const carts = req.session.cart;
        res.render("page/cart", {
            title: "Carts",
            status: status,
            user: res.locals.user,
            carts: carts,
        })
    },

    //add cart
    addCart: async (req, res) => {
        var id = req.params.id
        const carts = req.session.cart 
        var length = 0

        if(id == 1) {
            if (carts) {
                length = carts.length
            } else {
                req.session.cart = []
            }
        } else {
            let check = false
            for(var i = 0; i < carts.length; i++) {
                if (carts[i]._id == id) {
                    carts[i].qty++
                    check = true
                    break;
                }
            }

            if (!check) {
                const food = await Food.findOne({ _id: id })
                const cart = {...food._doc , qty: 1}
                carts.push(cart)
            }
            req.session.cart = carts
            length = carts.length
        }
        res.send(length + '')
    },
    
    //edit cart
    editCart: (req, res) => {
        const id = req.params.id
        const status = req.params.status
        const carts = req.session.cart
        const result = {
            sumQty: 0,
            qty: 0,
            subTotal:0,
            total:0
        }
        for(var i = 0; i < carts.length; i++) {
            if (carts[i]._id == id) {
                if(status == 'plus') {
                    carts[i].qty++
                    result.qty = carts[i].qty
                    result.subTotal += carts[i].qty*carts[i].price;
                } else if(status == 'minus') {
                    carts[i].qty--
                    result.qty = carts[i].qty
                    if (carts[i].qty == 0) {
                        carts.splice(i, 1);
                    } else {
                        result.subTotal += carts[i].qty*carts[i].price;
                    }
                } else if(status == 'delete') {
                    carts.splice(i, 1);
                }
                continue
            }
            result.subTotal += carts[i].qty*carts[i].price;
        }
        result.sumQty = carts.length
        result.total =  Math.round((result.subTotal*0.95 + 20)*1000)/1000
        res.send(result);
    },

    //show order 
    order: async (req, res) => {
        const status = req.session.status
        if (status != undefined) req.session.status = undefined
        if(res.locals.user) {
            const carts = req.session.cart;
            if (carts) {
                if (carts.length > 0) {
                    res.render("page/order", {
                        title: "Order",
                        status: status,
                        user: res.locals.user,
                        carts: carts,
                    })
                } else {
                    req.session.status = "Shopping Cart Empty. Please Add To Cart."
                    res.redirect("/")
                }
            } else {
                req.session.status = "Shopping Cart Empty. Please Add To Cart."
                res.redirect("/")
            }
        } else {
            req.session.status = "Please Login Before Ordering."
            res.redirect("/login")
        }
    },

    //xứ lý order
    orderPost: async (req, res) => {
        const order = req.body
        order.details = req.session.cart
        await new Order(order).save()
        req.session.cart = []
        req.session.status = "Order Success"
        res.redirect("/")
    }
}
