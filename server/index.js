const express = require("express");
const app = express();
const http = require("http");
const mailSender = require("./utils/mailSender");
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
)

app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp",
	})
)
//cloudinary connection
cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);


//def route

app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: 'Your server is up and running....'
	});
});

const server = http.createServer(async (req, res) => {
	if (req.method === "POST" && req.url === "/send-email") {
		let body = "";

		// Collect data from the request body
		req.on("data", (chunk) => {
			body += chunk;
		});

		req.on("end", async () => {
			try {
				const { email, title, message } = JSON.parse(body);

				// Ensure all required fields are present
				if (!email || !title || !message) {
					res.writeHead(400, { "Content-Type": "application/json" });
					return res.end(
						JSON.stringify({ success: false, message: "Missing fields." })
					);
				}

				// Send the email
				await mailSender(email, title, `<p>${message}</p>`);

				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify({
						success: true,
						message: "Email sent successfully!",
					})
				);
			} catch (error) {
				console.error("Error:", error.message);
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify({
						success: false,
						message: "Failed to send email.",
						error: error.message,
					})
				);
			}
		});
	} else {
		res.writeHead(404, { "Content-Type": "text/plain" });
		res.end("Route Not Found.");
	}
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})


// for routes testing
// https://documenter.getpostman.com/view/24441701/2s93kz6REm