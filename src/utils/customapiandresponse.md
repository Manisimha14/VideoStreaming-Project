# Custom ApiError & CustomApiResponse Notes

## Why Do We Need a Custom ApiError?

JavaScript already provides a built-in `Error` class:

```js
const error = new Error("User not found");
```

This gives us:

```js
{
    name: "Error",
    message: "User not found",
    stack: "..."
}
```

### Limitation

The default `Error` object does **not** provide:

```js
statusCode
success
errors
data
```

However, in backend APIs we often need:

```js
{
    success: false,
    statusCode: 404,
    message: "User not found"
}
```

To achieve this, we create a custom error class.

---

# Understanding ApiError

Example:

```js
class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);

        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;
    }
}
```

---

## What Does `extends Error` Mean?

```js
class ApiError extends Error
```

means:

> ApiError inherits everything from JavaScript's Error class.

Inheritance structure:

```text
Error
  ↑
ApiError
```

---

## What Does `super(message)` Do?

```js
super(message);
```

This initializes the parent `Error` class.

Without it:

```js
class ApiError extends Error {
    constructor(message) {
        this.message = message;
    }
}
```

JavaScript throws:

```text
Must call super constructor before using 'this'
```

because the parent class was never initialized.

---

## What Comes From Error?

After:

```js
super(message);
```

the object already has:

```js
message
name
stack
```

---

## What Do We Add Ourselves?

Everything else:

```js
this.statusCode = statusCode;
this.success = false;
this.errors = errors;
```

These are custom properties.

---

# Your Question

## "Does the original Error class provide statusCode?"

No.

Example:

```js
const error = new Error("User not found");

console.log(error.statusCode);
```

Output:

```js
undefined
```

The Error class knows nothing about HTTP APIs.

That's why backend developers create ApiError.

---

# Why Is `data = null` Used?

Many developers keep API responses consistent.

Success:

```js
{
    success: true,
    data: user,
    message: "User fetched"
}
```

Error:

```js
{
    success: false,
    data: null,
    message: "User not found"
}
```

`data = null` means:

> There is intentionally no data.

It is not mandatory.

You can remove it if you want.

---

# Async Handler Discussion

Your Original Version

```js
const asynchandeler= (requestfn)=>{
    async ()=>{
        try {
            await requestfn(req,res,next)
        } catch (error) {
            res.status(error.code || 500).json({
                success:false,
                message:error.message
            })
        }
    }
}
```

---

## Mistake #1

You never returned the inner function.

Your code:

```js
(requestfn)=>{
    async ()=>{
        ...
    }
}
```

Correct:

```js
(requestfn)=>{
    return async (req,res,next)=>{
        ...
    }
}
```

or

```js
(requestfn)=>
    async (req,res,next)=>{
        ...
    }
```

---

## Mistake #2

`req`, `res`, and `next` were not defined.

Your code:

```js
async ()=>{
```

Correct:

```js
async (req,res,next)=>{
```

---

## Mistake #3

`res` inside catch block was undefined.

Because it was never received as a parameter.

---

## Correct Version

```js
const asyncHandler = (requestFn) =>
    async (req, res, next) => {
        try {
            await requestFn(req, res, next);
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message
            });
        }
    };
```

---

# What Does Async Handler Actually Do?

It wraps another async function inside a try-catch.

Without asyncHandler:

```js
try {
    ...
} catch(error) {
    ...
}
```

must be written in every route.

With asyncHandler:

```js
asyncHandler(async (req,res)=>{
    ...
})
```

The wrapper handles errors automatically.

---

# CustomApiResponse

Your Code

```js
class customapiresponse{
    constructor(statuscode,message="success",data){
        this.statuscode=statuscode;
        this.message=message;
        this.data=data;
        this.success=statuscode <400
    }
}

export {customapiresponse}
```

---

# What It Does

Creates a standard success response.

Example:

```js
new customapiresponse(
    200,
    "User fetched successfully",
    user
)
```

Produces:

```js
{
    statuscode: 200,
    message: "User fetched successfully",
    data: user,
    success: true
}
```

---

# Why `success = statuscode < 400`?

HTTP Status Codes:

```text
100-199 -> Informational
200-299 -> Success
300-399 -> Redirection
400-499 -> Client Error
500-599 -> Server Error
```

Therefore:

```js
statuscode < 400
```

means:

```js
success = true
```

and

```js
statuscode >= 400
```

means:

```js
success = false
```

---

# Improvements I Suggested

### Class Name

Your version:

```js
class customapiresponse
```

Recommended:

```js
class CustomApiResponse
```

Reason:

Class names usually start with a capital letter.

---

### Property Name

Your version:

```js
statuscode
```

Recommended:

```js
statusCode
```

Reason:

JavaScript convention uses camelCase.

---

# Final Understanding

## ApiError

Used when something fails.

Example:

```js
throw new ApiError(
    404,
    "User not found"
);
```

Response:

```js
{
    success: false,
    statusCode: 404,
    message: "User not found"
}
```

---

## CustomApiResponse

Used when everything succeeds.

Example:

```js
new CustomApiResponse(
    200,
    "User fetched successfully",
    user
);
```

Response:

```js
{
    success: true,
    statusCode: 200,
    message: "User fetched successfully",
    data: user
}
```

---

# Simple Memory Trick

```text
ApiError
    ↓
Used for failures

CustomApiResponse
    ↓
Used for successful responses

asyncHandler
    ↓
Automatically catches errors from async functions
```
