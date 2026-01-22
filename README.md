# 🚀 Xenon Media v2 – Backend API

A scalable, modular, and production‑ready backend API for a social media–style application built with **Node.js, Express, MongoDB, and JWT authentication**.

This project follows a **clean service‑controller architecture**, supports authentication, posts, comments, likes, saved posts, password reset via email, and admin features.

---

## 🧱 Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB + Mongoose**
* **JWT (Access & Refresh Tokens)**
* **bcryptjs** (password hashing)
* **Nodemailer** (email service)
* **RESTful API architecture**

---


## 📁 Project Folder Structure

```
node_modules/
src/
├─ configs/
│  ├─ db.js
│  └─ config.js
│
├─ middlewares/
│  ├─ verifyAdmin.js
│  └─ verifyUser.js
│
├─ modules/
│  ├─ auth/
│  │  ├─ authRoutes.js
│  │  ├─ authControllers.js
│  │  └─ authServices.js
│  │
│  ├─ password/
│  │  ├─ passwordRoutes.js
│  │  ├─ passwordControllers.js
│  │  └─ passwordServices.js
│  │
│  ├─ users/
│  │  ├─ usersModel.js
│  │  ├─ usersRoutes.js
│  │  ├─ usersControllers.js
│  │  └─ usersServices.js
│  │
│  ├─ admin/
│  │  ├─ adminRoutes.js
│  │  ├─ adminControllers.js
│  │  └─ adminServices.js
│  │
│  └─ posts/
│     ├─ postModel.js
│     ├─ commentModel.js
│     ├─ postRoutes.js
│     ├─ postControllers.js
│     └─ postServices.js
│
├─ utils/
│  ├─ sendEmail.js
│  ├─ fetchPosts.js
│  ├─ shuffleArray.js
│  ├─ verifyToken.js
│  ├─ verifyPassResetToken.js
│  ├─ createTokens.js
│  └─ emailTemplates/
│     └─ passwordResetTemplate.js
│
├── .env
├── app.js
├── package-lock.json
├── package.json
└── server.js
```

---

## 🔐 Authentication Routes

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| POST   | `/api/v2/auth/signup`  | Register a new user  |
| POST   | `/api/v2/auth/signin`  | Login user           |
| POST   | `/api/v2/auth/logout`  | Logout user          |
| POST   | `/api/v2/auth/refresh` | Refresh access token |

---

## 🔑 Password Reset Routes

| Method | Endpoint                                     | Description                  |
| ------ | -------------------------------------------- | ---------------------------- |
| POST   | `/api/v2/password/request-reset`             | Request password reset email |
| GET    | `/api/v2/password/verify-reset-token?token=` | Verify reset token           |
| POST   | `/api/v2/password/reset-password?token=`     | Reset password               |

---

## 👤 User Routes

| Method | Endpoint                      | Description                         |
| ------ | ----------------------------- | ----------------------------------- |
| GET    | `/api/v2/users`               | Get all users (search, role filter) |
| GET    | `/api/v2/users/profile`       | Get logged‑in user profile          |
| PATCH  | `/api/v2/users/profile`       | Update profile                      |
| DELETE | `/api/v2/users/profile`       | Delete profile                      |
| PATCH  | `/api/v2/users/active-status` | Update active status                |

---

## 📝 Post Routes

| Method | Endpoint                     | Description                      |
| ------ | ---------------------------- | -------------------------------- |
| GET    | `/api/v2/posts`              | Get all posts (search supported) |
| GET    | `/api/v2/posts/me`           | Get my posts                     |
| GET    | `/api/v2/posts/user/:userId` | Get any user posts               |
| GET    | `/api/v2/posts/me/saved`     | Get my saved posts               |
| GET    | `/api/v2/posts/:postId`      | Get single post                  |
| POST   | `/api/v2/posts`              | Create post                      |
| PATCH  | `/api/v2/posts/:postId`      | Update post                      |
| DELETE | `/api/v2/posts/:postId`      | Delete post                      |
| PATCH  | `/api/v2/posts/:postId/like` | Like or unlike post              |
| PATCH  | `/api/v2/posts/:postId/save` | Save or unsave post              |

---

## 💬 Comment Routes

| Method | Endpoint                           | Description            |
| ------ | ---------------------------------- | ---------------------- |
| GET    | `/api/v2/posts/:postId/comments`   | Get comments of a post |
| POST   | `/api/v2/posts/:postId/comment`    | Create a comment       |
| PATCH  | `/api/v2/posts/:postId/:commentId` | Update a comment       |
| DELETE | `/api/v2/posts/:postId/:commentId` | Delete a comment       |


---

## 👑 Admin 

> Only accessible by admin users

| Method | Endpoint | Description |
|--------|----------|-------------|
| PATCH | `/api/v2/admin/make/{{userId}}` | Promote a user to admin |
| PATCH | `/api/v2/admin/remove/{{userId}}` | Remove admin role from a user |
| DELETE | `/api/v2/admin/users/{{userId}}` | Delete any user |
| DELETE | `/api/v2/admin/posts/{{postId}}` | Delete any post |
| DELETE | `/api/v2/admin/posts/{{postId}}/{{commentId}}` | Delete any comment |

---


## 🧠 Design Decisions

* Comments are stored in a **separate collection** (not embedded)
* Posts do **not store comment arrays** → improves performance
* Comments are fetched dynamically using `postId`
* JWT is used instead of DB‑stored reset tokens
* Controllers are thin, logic lives in services

---

## ⚙️ Environment Variables

``` 
PORT=5000
MONGO_URI=your_mongo_connection
JWT_SECRET=your_jwt_secret
ACCESS_TOKEN_EXPIRESIN=your_access_expiresin
REFRESH_TOKEN_EXPIRESIN=your_refresh_expiresin
FRONTEND_URL=http://localhost:3000
EMAIL_USER=example@email.com
EMAIL_PASS=your_email_password
```

---

## 🧪 Status

✅ Actively developed
✅ Clean architecture
✅ Scalable & production‑ready

---

## ✨ Author

**Sujoy Das**
Backend Developer | MERN Stack Enthusiast

---

If you like this project, don’t forget to ⭐ the repository!
