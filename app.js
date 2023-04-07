const express = require("express");
const path = require("path");
const checksum_lib = require("./Paytm/checksum");
const config = require("./Paytm/config");
var mysql = require("mysql");
const jsonToTable = require("json-to-table");
const path2 = __dirname + "/views/";
const app = express();
// const json2html = require('node-json2html');
const port = 8000;
const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
var mysql = require("mysql");
var connection = require("./database");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const bodyParser = require("body-parser");
app.use(
	session({ secret: "terraform123", saveUninitialized: true, resave: true })
);

// ENDPOINTS
require("express-dynamic-helpers-patch")(app);
app.dynamicHelpers({
	session: function (req, res) {
		return req.session;
	},
});
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
	next();
});
app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
	})
);

// EXPRESS SPECIFIC STUFF
// app.use("/static", express.static("static")); // For serving static files
app.use(express.static(__dirname + "/assets")); // For serving static files


app.use(express.urlencoded());
app.use(bodyParser.json());
// PUG SPECIFIC STUFF
app.set("view engine", "ejs"); // Set the template engine as pug
app.set("views", path.join(__dirname, "views"));

// Function to generate OTP
function generateOTP() {
	// Declare a digits variable
	// which stores all digits
	var digits = "0123456789";
	let OTP = "";
	for (let i = 0; i < 4; i++) {
		OTP += digits[Math.floor(Math.random() * 10)];
	}
	return OTP;
}
function isAuthenticated(req, res, next) {
	if (req.session && req.session.username) {
		next();
	} else {
		res.redirect(302, '/login');
	}
}

var passChange = {
	"@": "x",
	"=": "p",
	"'": "z",
	"#": "a",
	$: "s",
	"%": "t",
	"^": "y",
	"&": "u",
	"(": "i",
	")": "q",
	"-": "p",
	"+": "v",
	"<": "m",
	">": "n",
	",": "b",
	".": "c",
	"?": "g",
	"/": "o",
};

let secrateKey = "secrateKey";
const crypto = require("crypto");

function hashPassword(password) {
	const hash = crypto.createHash('sha256');
	hash.update(password);
	return hash.digest("hex");
}
/*function encrypt1(text) {
  encryptalgo = crypto.createCipher("aes192", secrateKey);
  let encrypted = encryptalgo.update(text, "utf8", "hex");
  encrypted += encryptalgo.final("hex");
  return encrypted;
}

function decrypt1(encrypted) {
  decryptalgo = crypto.createDecipher("aes192", secrateKey);
  let decrypted = decryptalgo.update(encrypted, "hex", "utf8");
  decrypted += decryptalgo.final("utf8");
  return decrypted;
}
*/
/////////////////////////////////////////////////////////////////////////

// ENDPOINTS
require("express-dynamic-helpers-patch")(app);
app.dynamicHelpers({
	session: function (req, res) {
		return req.session;
	},
});

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
	next();
});
app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
	})
);


//starting otp service-final

// const accountSid = 'ACeca2a4f6bba192bd3604722a9c9e8c4d'; 
// const authToken = 'ad1c0ef572325b6a1699e28cf1e88676'; 
// const client = require('twilio')(accountSid, authToken); 
// console.log("entering twiliio")
// client.messages 
//       .create({ 
//          body: otp1,  
//          messagingServiceSid: 'MG6ea432d1051520a226cd06d0a7475ac6',      
//          to: '+919558771737' 
//        }) 
//   .then(function (res) {
//     console.log("message has sent!");
//   })
//   .catch(function (err) {
//     console.log(err);
//   });
// new integration

app.get("/wronginput", (req, res) => {
	res.sendFile(path2 + "wrongotp.html");
});

app.get("/otp", (req, res) => {
	// const params = {}
	res.sendFile(path2 + "otp.html");
});
app.get("/quiz", isAuthenticated, (req, res) => {
	// const params = {}
	res.render(path2 + "quiz.ejs", { username: req.session.username, logged_in: true });
});

app.get("/", (req, res) => {
	let username = ''
	let logged_in = false
	if (req.session && req.session.username) {
		username = req.session.username;
		logged_in = true
	}

	// res.status(200).render("index.pug", params);
	res.status(200).render("index.ejs", { username: username, logged_in: logged_in });
});

app.get("/new1", (req, res) => {
	// const params = {}
	// res.status(200).render('index1.pug', params);
	var username = req.session.username;
	// console.log(username)
	res.render("index1", { username: username });
});

app.get("/login", (req, res) => {
	// res.sendFile(path2 + "login_new.html");
	res.render(path2 + "login_new.ejs");
});

//starting otp service-final end 
var otp1 = generateOTP();
console.log("OTP", otp1);
app.post('/login', function (request, response) {
	var username = request.body.uname;
	var password = hashPassword(request.body.psw);
	var otp = request.body.otp;
	console.log(username)
	console.log(password)
	if (username && password) {
		const query = 'SELECT * FROM userdata WHERE username = ? AND password = ?';
		connection.query(query, [username, password], function (error, results, fields) {
			if (results.length > 0) {
				const rquery = "SELECT role FROM userdata WHERE username = ?";

				connection.query(rquery, [username], function (err, rows, fields) {
					if (err) {
						console.error(err.message);
						return;
					}

					let roleValue;
					rows.forEach(function (row) {
						Object.keys(row).forEach(function (key) {
							const t1 = row[key];
							roleValue = t1;
						});
					});

					console.log(roleValue);
					if (otp1 == otp) {
						if (roleValue === "customerservice") {
							request.session.username = username;
							response.redirect('/cust');
						} else if (roleValue === "receptionist") {
							request.session.username = username;
							response.redirect('/recp');
						} else {
							console.log("invalid value");
						}
					}
					else {
						response.redirect("/wronginput");
					}
				});
			} else {
				response.send("Incorrect username and/or password");
			}
		}
		);
	} else {
		response.send("Please enter username and password");
	}

});

app.get("/reg", (req, res) => {
	res.render(path2 + "reg_new.ejs");
});
app.post("/reg", function (request, response) {
	var username = request.body.uname;
	var password = request.body.psw;
	var age = request.body.age;
	var address = request.body.address;
	var role = request.body.role;
	var mno = request.body.mno;
	console.log(role);

	for (var i = 0; i <= password.length; i++) {
		console.log(password[i]);
		for (var key in passChange) {
			var value = passChange[key];
			if (password[i] == key) {
				password = password.replace(password[i], value);
			}
		}
	}
	console.log("before condition",password,username);
	if (username && password) {
		console.log(username,password);
		connection.getConnection(function (err) {
			if (err) throw err;
			console.log("Connected!");
			var sql = "INSERT INTO userdata (username, password, age, address, mno, role) VALUES (?, ?, ?, ?, ?, ?)";
			var username = request.body.uname;
			var password = hashPassword(request.body.psw);
			var age = request.body.age;
			var address = request.body.address;
			var mno = request.body.mno;
			var role = request.body.role;

			connection.query(sql, [username, password, age, address, mno, role], function (error, results, fields) {
				if (error) {
					console.log("Error inserting data into the table!");
					console.log(error);
				} else {
					console.log("Data inserted successfully!");
				}
			});
			if (role == "customerservice") {
				request.session.username = username;
				response.redirect("/cust");
			} else if (role == "receptionist") {
				request.session.username = username;
				response.redirect("/recp");
			}
			// const query1 = "SELECT role FROM userdata";
			// connection.query(query1, function (err, rows, fields) {
			//     if (err) {
			//       console.error(err.message);
			//       return;
			//     }

			//     rows.forEach(function(row) {
			//       Object.keys(row).forEach(function(key) {
			//         const encrypted = row[key];
			//         const decrypted = decrypt1(encrypted);
			//         console.log(decrypted);
			//       });
			//     });
			//   });
			// request.session.username = (username);
			// response.redirect('/new1');

			response.end();
		});
	} else {
		response.send("Please enter Username and Password!");
		response.end();
	}
});
app.get("/cust", isAuthenticated, (req, res) => {
	res.render(path2 + "customer.ejs", { username: req.session.username, logged_in: true });
});
app.get("/recp", isAuthenticated, (req, res) => {
	res.render(path2 + "receptionist.ejs", { username: req.session.username, logged_in: true });
});

app.get("/cvideos", isAuthenticated, (req, res) => {
	res.render(path2 + "cust_videos.ejs", { username: req.session.username, logged_in: true });
});
app.get("/rvideos", isAuthenticated, (req, res) => {
	res.render(path2 + "reg_videos.ejs", { username: req.session.username, logged_in: true });
});

// new integration
// app.post("/saveProgress", (req, res) => {
//   // console.log("response is::::::::::::::::::::")
//   // console.log("Response is :::::::::::::::::::", res)
//   // console.log("response is::::::::::::::::::::")
//   const userId = req.session.username;
//   const videoId = req.query.videoId;
//   const progress = req.query.progress;
//   const sql =
//     "INSERT INTO video_progress (username,video_id, progress) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE progress = ?";
//   const values = [userId, videoId, progress];
//   connection.query(sql, values, (error, results, fields) => {
//     if (error) {
//       console.error(error);
//       res.sendStatus(500);
//     } else {
//       res.sendStatus(200);
//     }
//   });
// });					

//new integration
//changing the saveprogress endpoint 

app.post("/resetProgress", (req, res) => {
	const videoId = req.body.videoId;
	const userId = req.session.username;

	connection.query(
		`UPDATE video_progress SET progress = 0, progress_locked = 0 WHERE username = '${userId}' AND video_id = '${videoId}'`,
		(error, results, fields) => {
			if (error) {
				console.error(error);
				res.sendStatus(500);
			} else {
				res.sendStatus(200);
			}
		}
	);
});

app.post("/saveProgress", (req, res) => {
	const userId = req.session.username;
	const { videoId, watchedPercentage } = req.body;

	// new integration
	// Check if the progress is already 100%
	connection.query(
		`SELECT progress_locked FROM video_progress WHERE username = '${userId}' AND video_id = '${videoId}'`,
		(error, results, fields) => {
			if (error) {
				console.error(error);
				res.sendStatus(500);
			} else {
				if (results.length > 0 && results[0].progress_locked) {
					// The progress is already locked at 100%
					res.sendStatus(403);
				} else {
					// The progress is not yet locked at 100%
					const sql =
						"INSERT INTO video_progress (username,video_id, progress) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE progress  = ?";
					const values = [
						userId,
						videoId,
						watchedPercentage,
						watchedPercentage,
					];
					connection.query(sql, values, (error, results, fields) => {
						if (error) {
							console.error(error);
							res.sendStatus(500);
						} else {

							//new integration
							// Check if the progress has reached 100%
							connection.query(
								`SELECT progress FROM video_progress WHERE username = '${userId}' AND video_id = '${videoId}'`,
								(error, results, fields) => {
									if (error) {
										console.error(error);
										res.sendStatus(500);
									} else {
										if (results.length > 0 && results[0].progress === 100) {
											// Lock the progress at 100%
											connection.query(
												`UPDATE video_progress SET progress_locked = 1 WHERE username = '${userId}' AND video_id = '${videoId}'`,
												(error, results, fields) => {
													if (error) {
														console.error(error);
														res.sendStatus(500);
													} else {
														res.sendStatus(200);
													}
												}
											);
										} else {
											res.sendStatus(200);
										}
									}
								}
							);
						}
					});
				}
			}
		}
	);
});

app.get("/disp", (request, response) => {
	connection.getConnection(function (err) {
		if (err) throw err;
		console.log("Connected!");
		// var sql = `DELETE FROM userdata WHERE user_id=${id}`;
		var sql = `select * from userdata`;
		connection.query(sql, function (err, result) {
			if (err) throw err;
			let template = {
				"<>": "div",
				html: "${user_id} ${username} ${Address} ${Age} ${password}",
			};
			let html = json2html.render(result, template);
			response.send(result);
			console.log(html);
		});
	});
});
app.get("/getProgress", (req, res) => {
	const videoId = req.query.videoId;
	const userId = req.session.username;
	console.log("videoid:", videoId);
	console.log("username:", userId);
	console.log("entered");
	// Query the progress of the user for the given video
	connection.query(
		`SELECT progress FROM video_progress WHERE username = '${userId}' AND video_id = '${videoId}'`,
		(error, results, fields) => {
			if (error) {
				res.status(500).send(error.message);
				console.log(error.message);
			} else {
				if (results.length > 0) {
					const progress = results[0].progress;
					res.status(200).json({ watchedPercentage: progress });
					console.log(progress);
				} else {
					res.status(404).send("User progress not found");
					console.log("error");
				}
			}
		}
	);
});
app.get("/getProgress", (req, res) => {
	const userId = req.session.username;
	console.log("username:", userId);
	console.log("entered");

	// Query the video ids for the user
	connection.query(
		`SELECT DISTINCT video_id FROM video_progress WHERE username = '${userId}'`,
		(error, results, fields) => {
			if (error) {
				res.status(500).send(error.message);
				console.log(error.message);
			} else {
				// If there are no videos for this user, send a 404 response
				if (results.length === 0) {
					res.status(404).send("User has no videos");
					console.log("User has no videos");
					return;
				}

				let completedVideos = 0;

				// Check progress for each video id
				results.forEach((result) => {
					const videoId = result.video_id;

					connection.query(
						`SELECT progress FROM video_progress WHERE username = '${userId}' AND video_id = '${videoId}'`,
						(error, results, fields) => {
							if (error) {
								console.log(error.message);
							} else {
								if (results.length >= 0 && results[0].progress === 100) {
									completedVideos++;
									if (completedVideos === results.length) {
										// If all videos are completed, generate the certificate
										console.log(
											"All videos completed. Generating certificate."
										);
										// code to generate certificate here...
										res.status(200).send("Certificate generated!");
									}
								}
							}
						}
					);
				});
			}
		}
	);
});

app.get("/logout", function (req, res) {
	req.session.destroy(function (err) {
		if (err) {
			console.error(err);
		} else {
			res.redirect("/login");
		}
	});
});
app.get("/aboutus", (request, res) => {
	res.sendFile(path2 + "aboutus.html");
});

app.listen(port, () => {
	console.log(`The application started successfully on port ${port}`);
});

// app.post("/saveProgress", (req, res) => {
//   // console.log("response is::::::::::::::::::::")
//   // console.log("Response is :::::::::::::::::::", res)
//   // console.log("response is::::::::::::::::::::")
//   const userId = req.session.username;
//   const videoId = req.query.videoId;
//   const progress = req.query.progress;
//   const sql =
//     "INSERT INTO video_progress (username,video_id, progress) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE progress = ?";
//   const values = [userId, videoId, progress];
//   connection.query(sql, values, (error, results, fields) => {
//     if (error) {
//       console.error(error);
//       res.sendStatus(500);
//     } else {
//       res.sendStatus(200);
//     }
//   });
// });