# Node & Express.js

## Express.js
To create a new express instance, require the package and start a new instance:
```js
let express = require('express');
let app = express();
```

#### Route resolution
Express evaluates routes from top to bottom, and executes the handler for the first match.


### Routes
Let’s serve our first string! In Express, routes takes the following structure:
```
app.METHOD(PATH, HANDLER).
```
- `METHOD` is an http method in lowercase.
- `PATH` is a relative path on the server (it can be a string, or even a regular expression).
- `HANDLER` is a function that Express calls when the route is matched. Handlers take the form `function(req, res) {...}`, where req is the request object, and res is the response object. For example, the handler

```js
function(req, res) {
  res.send('Response String');
}
```

will serve the string 'Response String'.


### Serve an HTML file
You can respond to requests with a file using the `res.sendFile(path)` method.
Behind the scenes, this method will set the appropriate headers to instruct your browser on how to handle the file you want to send, according to its type.
Then it will read and send the file.
This method needs an absolute file path.
We recommend you to use the Node global `variable __dirname` to calculate the path like this:

```js
absolutePath = __dirname + '/relativePath/file.ext'
```

### Serve Static Assets
An HTML server usually has one or more directories that are accessible by the user.
You can place there the static assets needed by your application (stylesheets, scripts, images).

In Express, you can put in place this functionality using the middleware `express.static(path)`, where the path parameter is the absolute path of the folder containing the assets.

Middleware are functions that intercept route handlers, adding some kind of information.
A middleware needs to be mounted using the method `app.use(path, middlewareFunction)`.
The first path argument is optional. If you don’t pass it, the middleware will be executed for all requests.

### Serve JSON on a Specific Route
While an HTML server serves HTML, an API serves data.
A REST (REpresentational State Transfer) API allows data exchange in a simple way, without the need for clients to know any detail about the server.
The client only needs to know where the resource is (the URL), and the action it wants to perform on it (the verb).
The `GET` verb is used when you are fetching some information, without modifying anything.
These days, the preferred data format for moving information around the web is `JSON`.
Simply put, JSON is a convenient way to represent a JavaScript object as a string, so it can be easily transmitted.

### Use the .env File
The `.env` file is a hidden file that is used to pass environment variables to your application.
This file is secret, no one but you can access it, and it can be used to store data that you want to keep private or hidden.
For example, you can store API keys from external services or your database URI.
You can also use it to store configuration options.
By setting configuration options, you can change the behavior of your application, without the need to rewrite some code.

The environment variables are accessible from the app as `process.env.VAR_NAME`.
The `process.env` object is a global Node object, and variables are passed as strings.
By convention, the variable names are all uppercase, with words separated by an underscore.
The `.env` is a shell file, so you don’t need to wrap names or values in quotes.
It is also important to note that there cannot be space around the equals sign when you are assigning values to your variables, e.g. VAR_NAME=value.
Usually, you will put each variable definition on a separate line.

### Implement a Root-Level Request Logger Middleware
Middleware functions are functions that take 3 arguments:
- the request object,
- the response object,
- and the next function in the application’s request-response cycle.

These functions execute some code that can have side effects on the app, and usually add information to the request or response objects. They can also end the cycle by sending a response when some condition is met.
If they don’t send the response when they are done, they start the execution of the next function in the stack.
This triggers calling the 3rd argument, next().

Look at the following example:

```js
function(req, res, next) {
  console.log("I'm a middleware...");
  next();
}
```

Let’s suppose you mounted this function on a route.
When a request matches the route, it displays the string “I’m a middleware…”, then it executes the next function in the stack.

### Chain Middleware to Create a Time Server
Middleware can be mounted at a specific route using `app.METHOD(path, middlewareFunction)`.
Middleware can also be chained within a route definition.

Look at the following example:

```js
app.get('/user', function(req, res, next) {
  req.user = getTheUserSync();  // Hypothetical synchronous operation
  next();
}, function(req, res) {
  res.send(req.user);
});

```

This approach is useful to split the server operations into smaller units.
That leads to a better app structure, and the possibility to reuse code in different places.
This approach can also be used to perform some validation on the data.
At each point of the middleware stack you can block the execution of the current chain and pass control to functions specifically designed to handle errors.
Or you can pass control to the next matching route, to handle special cases.

### Get Route Parameter Input from the Client
When building an API, we have to allow users to communicate to us what they want to get from our service.
For example, if the client is requesting information about a user stored in the database, they need a way to let us know which user they're interested in.
One possible way to achieve this result is by using route parameters.
Route parameters are named segments of the URL, delimited by slashes (/).
Each segment captures the value of the part of the URL which matches its position.
The captured values can be found in the req.params object.

```
route_path: '/user/:userId/book/:bookId'
actual_request_URL: '/user/546/book/6754'
req.params: {userId: '546', bookId: '6754'}
```

### Get Query Parameter Input from the Client
Another common way to get input from the client is by encoding the data after the route path, using a query string.
The query string is delimited by a question mark (?), and includes `field=value` couples.
Each couple is separated by an ampersand (&).
Express can parse the data from the query string, and populate the object `req.query`.
Some characters, like the percent (%), cannot be in URLs and have to be encoded in a different format before you can send them.
If you use the API from JavaScript, you can use specific methods to encode/decode these characters.

```
route_path: '/library'
actual_request_URL: '/library?userId=546&bookId=6754'
req.query: {userId: '546', bookId: '6754'}
```

### Use body-parser to Parse POST Requests
Besides `GET`, there is another common HTTP verb, it is `POST`.
`POST` is the default method used to send client data with HTML forms.
In REST convention, `POST` is used to send data to create new items in the database (a new user, or a new blog post).
You don’t have a database in this project, but you are going to learn how to handle `POST` requests anyway.

In these kind of requests, the data doesn’t appear in the URL, it is hidden in the request body.
The body is a part of the HTTP request, also called the payload.
Even though the data is not visible in the URL, this does not mean that it is private.
To see why, look at the raw content of an HTTP POST request:

```
POST /path/subpath HTTP/1.0
From: john@example.com
User-Agent: someBrowser/1.0
Content-Type: application/x-www-form-urlencoded
Content-Length: 20

name=John+Doe&age=25
```

As you can see, the body is encoded like the query string. This is the default format used by HTML forms.
With Ajax, you can also use JSON to handle data having a more complex structure.
There is also another type of encoding: `multipart/form-data`.
This one is used to upload binary files.


