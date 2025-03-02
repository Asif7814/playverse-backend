###### Project Status: 🚧 WIP

# Project: PlayVerse Backend

PlayVerse is a mobile game tracker app designed to help gamers organize and enhance their gaming experience. Whether you’re exploring new titles or revisiting old favorites, PlayVerse makes it easy to keep track of the games you’ve played, monitor playtime, and dive deeper into your gaming stats.

---

## Features

### 1. Game Tracking

Add and organize games in your personal library to easily keep track of what you’re playing.

### 2. Explore New Games

Discover new titles tailored to your interests and explore trending games.

### 3. AI Chat Assistant

Get personalized game recommendations, compare games, and engage in conversations to help you decide what to play next.

---

## Technologies Used

- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB, Redis
- **Authentication**: JWT, OAuth
- **Testing**: Jest

---

## Installation

1. **Clone the repository:**

    ```bash
    git clone git@github.com:playverse-backend.git playverse-backend
    ```

2. **Navigate to the project directory:**

    ```bash
    cd playverse-backend
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Set up environment variables:**

- Create a .env file in the root directory filling out all of the variables as shown
  in the .env.example file

5. **Run the application:**

    ```bash
    npm run dev
    ```

---

## API Endpoints

### User Authentication

#### POST /auth/users/register

- @desc: Create user and send verification email
- @access: PUBLIC

#### POST /auth/users/verify

- @desc: Verify user using OTP, activate account with verified status, and send
  access token and refresh token
- @access: PUBLIC

#### POST /auth/users/login

- @desc: Login user and send access token and refresh token
- @access: PUBLIC

#### POST /auth/users/logout

- @desc: Logout user by clearing refresh token from redis
- @access: PRIVATE

#### POST /auth/users/refresh-token

- @desc: Refresh user access token using refresh token and set new refresh token
- @access: PRIVATE

#### POST /auth/users/forgot-password

- @desc: Send password reset instructions to user email
- @access: PUBLIC

#### POST /auth/users/verify-otp

- @desc: Verify an OTP and send back a reset token
- @access: PUBLIC

#### POST /auth/users/reset-password

- @desc: Reset user password using reset token
- @access: PUBLIC

#### POST /auth/users/update-password

- @desc: Update user password
- @access: PRIVATE

#### POST /auth/users/update-email

- @desc: Request email update
- @access: PRIVATE

#### POST /auth/users/replace-email

- @desc: Verify using OTP and replace email
- @access: PRIVATE

#### POST /auth/users/request-account-deactivation

- @desc: Request account deactivation
- @access: PRIVATE

#### POST /auth/users/deactivate-account

- @desc: Deactivate account using OTP
- @access: PRIVATE

#### POST /auth/users/request-account-reactivation

- @desc: Request account reactivation
- @access: PUBLIC

#### POST /auth/users/reactivate-account

- @desc: Reactivate account using OTP
- @access: PUBLIC

### Games

#### GET /api/games

- @desc: Get all games by various filters
- @access: PRIVATE

#### GET /api/games/search

- @desc: Search for games by their title
- @access: PRIVATE

#### GET /api/games/:id

- @desc: Get an individual game's details by the game id
- @access: PRIVATE

### Games in User's Library

#### POST /api/userGames

- @desc: Add a game to the user's library
- @access: PRIVATE

#### GET /api/userGames

- @desc: Get all games from the user's library
- @access: PRIVATE

#### GET /api/userGames/search

- @desc: Get all games from the user's library that match the search query
- @access: PRIVATE

#### GET /api/userGames/:id

- @desc: Get an individual game by its id from the user's library
- @access: PRIVATE

#### PATCH /api/userGames/:id

- @desc: Update a part of an individual game from the user's library
- @access: PRIVATE

#### DELETE /api/userGames/:id

- @desc: Delete an individual game from the user's library
- @access: PRIVATE

---

## Contact

For any questions, suggestions, or feedback, feel free to reach out:

- **Email**: [ashadullah.asif@outlook.com](mailto:ashadullah.asif@outlook.com)
- **LinkedIn**: [Asif Ashadullah](https://www.linkedin.com/in/asifashadullah)
- **GitHub**: [Asif7814](https://github.com/Asif7814)

You can also check out my other projects and contributions on GitHub. I’m always open to collaboration and new ideas!
