 
# Xenon Media Server v2 🚀

[![Node.js](https://img.shields.io/badge/node-v18-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/express-5.1.0-blue)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/mongodb-6.20.0-green)](https://www.mongodb.com/)

A **MERN backend** server for the Xenon Media application, handling authentication, user management, posts, friendships, and password reset functionality.  
Built with **Node.js, Express, MongoDB**, and **JWT-based authentication**.



## 📂 Project Structure
 
backend/
│
├── src/
│   ├── config/               # Configuration files
│   │   ├── config.js         # App config (PORT, JWT secret, etc.)
│   │   └── db.js             # MongoDB connection
│   │
│   ├── middlewares/          # Express middlewares
│   │   ├── verifyAdmin.js
│   │   └── verifyUser.js
│   │
│   ├── modules/              # App modules
│   │   ├── auth/             # Authentication
│   │   │   ├── authController.js
│   │   │   ├── authRoutes.js
│   │   │   └── authServices.js
│   │   │
│   │   ├── friend/           # Friend management
│   │   │   ├── friendModel.js
│   │   │   ├── friendRoutes.js
│   │   │   ├── friendServices.js
│   │   │   └── friendController.js
│   │   │
│   │   ├── password/         # Password reset
│   │   │   ├── passRoutes.js
│   │   │   ├── passServices.js
│   │   │   └── passController.js
│   │   │
│   │   ├── post/             # Post management
│   │   │   ├── postModel.js
│   │   │   ├── postRoutes.js
│   │   │   ├── postServices.js
│   │   │   └── postController.js
│   │   │
│   │   └── user/             # User management
│   │       ├── userModel.js
│   │       ├── userRoutes.js
│   │       ├── userServices.js
│   │       └── userController.js
│   │
│   └── utils/                # Utility functions
│       ├── createToken.js
│       ├── sendEmail.js
│       ├── verifyToken.js
│       └── emailTemplates/
│           └── passwordResetTemplate.js
│
├── .env                      # Environment variables
├── app.js                     # Express app & routes
├── server.js                  # Entry point
├── package.json               # Project dependencies & scripts
└── package-lock.json





## ⚡ Features

- **JWT Authentication** (access + refresh tokens)
- **User management** (profile, social links, location updates)
- **Password reset** via email with token/OTP
- **Friend system** (request, confirm, cancel)
- **Posts** (create, fetch, delete)
- **Role-based access control** (User/Admin)
- **File uploads** support with Multer and Sharp
- **Secure cookies** for refresh tokens
- Clean REST API design

---

## 🛠 Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd xenon-media-server-v2
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

---

## 🚀 Running the Server

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

Server runs on the port defined in `.env` (default `5000`).

---

## 🔗 API Endpoints

### **Auth**

| Method | Endpoint        | Description          |
| ------ | --------------- | -------------------- |
| POST   | `/auth/signup`  | Register a new user  |
| POST   | `/auth/login`   | Login user           |
| POST   | `/auth/logout`  | Logout user          |
| GET    | `/auth/refresh` | Refresh access token |

### **User**

| Method | Endpoint               | Description                |
| ------ | ---------------------- | -------------------------- |
| PUT    | `/user/profile/update` | Update profile (protected) |

### **Friend**

| Method | Endpoint          | Description            |
| ------ | ----------------- | ---------------------- |
| POST   | `/friend/request` | Send friend request    |
| PUT    | `/friend/confirm` | Confirm friend request |
| DELETE | `/friend/cancel`  | Cancel friend request  |

### **Post**

| Method | Endpoint       | Description      |
| ------ | -------------- | ---------------- |
| POST   | `/post/create` | Create new post  |
| GET    | `/post/:id`    | Fetch post by ID |
| DELETE | `/post/:id`    | Delete post      |

### **Password**

| Method | Endpoint           | Description               |
| ------ | ------------------ | ------------------------- |
| POST   | `/password/forgot` | Request password reset    |
| POST   | `/password/reset`  | Reset password with token |

---

## 🧰 Dependencies

* [Express](https://expressjs.com/)
* [Mongoose](https://mongoosejs.com/)
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
* [bcrypt](https://www.npmjs.com/package/bcrypt)
* [cookie-parser](https://www.npmjs.com/package/cookie-parser)
* [cors](https://www.npmjs.com/package/cors)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [nodemailer](https://nodemailer.com/)
* [multer](https://www.npmjs.com/package/multer)
* [sharp](https://www.npmjs.com/package/sharp)
* [axios](https://www.npmjs.com/package/axios)

---

## ⚡ Notes

* All **protected routes** require JWT authentication.
* Handles **partial updates** for user profile — sending only fields to update.
* Image uploads (profile/cover) handled separately via Multer.
* Designed to work with a **React frontend**.

---

## 📄 License

ISC

---

```

This version:  

- Adds **badges** for Node, Express, MongoDB  
- Uses **tables for endpoints** (easy to read)  
- Notes **partial updates and protected routes**  
- Separates features, installation, and API docs clearly  

---

If you want, I can also add a **“Frontend request examples” section** with **JSON payloads and sample responses** for each endpoint — it makes it very developer-friendly.  

Do you want me to do that?
```
