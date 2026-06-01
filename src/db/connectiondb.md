# MongoDB + Mongoose Setup — Common Errors & Fixes

## Error #1: Using `=` Instead of `:` in Object Properties

### ❌ Wrong

```js
await mongoose.connect(process.env.MONGODB_URL, {
    dbName = DB_NAME
});
```

### Why It Fails

JavaScript object properties must use the `key: value` syntax.

### ✅ Correct

```js
await mongoose.connect(process.env.MONGODB_URL, {
    dbName: DB_NAME
});
```

---

## Error #2: Incorrect Environment Variable Name

### ❌ Wrong

```js
process.env.MONGODB
```

or

```js
process.env.MONGODB_URI
```

while the `.env` file contains:

```env
MONGODB_URL=your_connection_string
```

### Why It Fails

The environment variable name used in code must exactly match the variable name defined in the `.env` file.

### ✅ Correct

```js
process.env.MONGODB_URL
```

---

## Error #3: Incorrect `.env` File Path

### ❌ Wrong

```js
dotenv.config({
    path: "./env"
});
```

### Why It Fails

The file is usually named `.env`, not `env`.

### ✅ Correct

```js
dotenv.config({
    path: "./.env"
});
```

---

## Error #4: Missing File Extension in ES Modules

### ❌ Wrong

```js
import connectDb from "./db";
```

### Why It Fails

When using ES Modules (`"type": "module"`), Node.js requires explicit file paths.

### ✅ Correct

```js
import connectDb from "./db/index.js";
```

or

```js
import connectDb from "./db.js";
```

---

## Error #5: Not Exporting the Database Function

### ❌ Wrong

```js
const connectDb = async () => {
    // connection logic
};
```

### Why It Fails

The function cannot be imported into other files without exporting it.

### ✅ Correct

```js
export default connectDb;
```

---

## Error #6: Not Handling Database Connection Errors

### ❌ Wrong

```js
const connectionInstance = await mongoose.connect(
    process.env.MONGODB_URL
);
```

### Why It Fails

If MongoDB credentials are incorrect or the network fails, the application may crash without a meaningful error message.

### ✅ Correct

```js
try {
    const connectionInstance = await mongoose.connect(
        process.env.MONGODB_URL,
        {
            dbName: DB_NAME
        }
    );
} catch (error) {
    console.log(error);
    process.exit(1);
}
```

---

## Error #7: Not Specifying the Database Name

### ❌ Wrong

```js
await mongoose.connect(process.env.MONGODB_URL);
```

### Why It Can Cause Issues

MongoDB may connect to a default database instead of the intended project database.

### ✅ Correct

```js
await mongoose.connect(process.env.MONGODB_URL, {
    dbName: DB_NAME
});
```

---

# Final Correct Database Configuration

## `constants.js`

```js
export const DB_NAME = "videotube";
```

---

## `db/index.js`

```js
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            process.env.MONGODB_URL,
            {
                dbName: DB_NAME
            }
        );

        console.log(
            `MongoDB Connected Successfully: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.log(`MongoDB Connection Error: ${error}`);
        process.exit(1);
    }
};

export default connectDb;
```

---

## `src/index.js`

```js
import dotenv from "dotenv";
import connectDb from "./db/index.js";

dotenv.config({
    path: "./.env"
});

connectDb();
```

---

# Lessons Learned

* Use `:` instead of `=` inside JavaScript objects.
* Always load environment variables before using them.
* Ensure `.env` file names and paths are correct.
* Match environment variable names exactly.
* Include `.js` extensions when using ES Modules.
* Always wrap database connections inside `try/catch`.
* Export reusable functions properly.
* Specify `dbName` to avoid connecting to the wrong database.
* Log successful connections for easier debugging.
* Exit the process when a critical database connection error occurs.

---

# Project Structure

```text
project/
│
├── .env
├── package.json
│
├── src/
│   ├── constants.js
│   ├── index.js
│   │
│   └── db/
│       └── index.js
│
└── node_modules/
```
