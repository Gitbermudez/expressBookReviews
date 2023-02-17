const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express()

app.use(express.json())

let user = []

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))


//Write the authenication mechanism here
app.use("/customer/auth/*", function auth(req,res,next){
	const username = req.body.username;
	const password = req.body.password;
	
	if (!username || !password) {
		return res.status(404).json({message: "Error logging in"});
	}
	
	if (authenticatedUser (username, password)) {
		let accessToken = jwt.sign({
			data: password
		}, 'access', {expiresIn: 60 * 60});
		
		req.session.autorization = {
			accessToken, username
		}
	return res.status(200).send("User success login");
		} else
		{
			return res.status(208).json({message: "Invalid Lagin. Check username and password "});
		}
    });
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
