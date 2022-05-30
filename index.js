const express = require('express');
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const loginRouter = require('./routers/login.router')
const adminRouter = require('./routers/admin.router')
const homeRouter = require('./routers/home.router')




require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;

app.use(cookieParser("mySecretKey"))
app.use(fileUpload())
app.set('view engine', 'ejs');
app.use((req, res, next) => {
    if (req.signedCookies.user_id) {
        res.locals.user = req.signedCookies.user_id
    }
    next()
},)

app.use(morgan('dev'));
app.use('/assets', express.static(__dirname + '/public'));
app.use(expressLayouts);


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(
    session({
        secret: 'mySecretKey',
    })
);

const checkAdmin = (req, res, next) => {
    if (req.signedCookies.user_id != 'admin@gmail.com') {
        req.session.status = "Please Login With Admin Account"
        res.redirect("/login")
    }
    next()
}


app.use("/", homeRouter)
app.use("/login", loginRouter)
app.use("/admin",checkAdmin,adminRouter)

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connect DB Success"))
    .catch((err) => console.error(err));
