## MongoDB

### CRUD Part I - CREATE
The interactions with the database happen in handler functions. These functions are executed when some event happens (e.g. someone hits an endpoint on your API). We’ll follow the same approach in these exercises. The `done()` function is a callback that tells us that we can proceed after completing an asynchronous operation such as inserting, searching, updating, or deleting. It's following the Node convention, and should be called as `done(null, data)` on success, or done(err) on error.

```js
/* Example */

const someFunc = function(done) {
  //... do something (risky) ...
  if (error) return done(error);
  done(null, result);
};

```

### Create and Save a Record of a Model
This is a common pattern; all the following CRUD methods take a callback function like this as the last argument.

```js
/* Example */

// ...
person.save(function(err, data) {
  //   ...do your stuff here...
});
```


### Create Many Records with model.create()
Sometimes you need to create many instances of your models, e.g. when seeding a database with initial data.
`Model.create()` takes an array of objects like `[{name: 'John', ...}, {...}, ...]` as the first argument, and saves them all in the db.


### Use model.find() to Search Your Database
In its simplest usage, `Model.find()` accepts a query document (a JSON object) as the first argument, then a callback.
It returns an array of matches. It supports an extremely wide range of search options.


### Use model.findOne() to Return a Single Matching Document from Your Database
`Model.findOne()` behaves like `Model.find()`, but it returns only one document (not an array), even if there are multiple items.
It is especially useful when searching by properties that you have declared as unique.

### Use model.findById() to Search Your Database By _id
When saving a document, MongoDB automatically adds the field `_id`, and set it to a unique alphanumeric key.
Searching by `_id` is an extremely frequent operation, so Mongoose provides a dedicated method for it.


### Perform Classic Updates by Running Find, Edit, then Save
In the good old days, this was what you needed to do if you wanted to edit a document, and be able to use it somehow (e.g. sending it back in a server response).
Mongoose has a dedicated updating method: `Model.update()`.
It is bound to the low-level mongo driver. It can bulk-edit many documents matching certain criteria, but it doesn’t send back the updated document, only a 'status' message.
Furthermore, it makes model validations difficult, because it just directly calls the mongo driver.

### Perform New Updates on a Document Using model.findOneAndUpdate()
Recent versions of Mongoose have methods to simplify documents updating.
Some more advanced features (i.e. pre/post hooks, validation) behave differently with this approach, so the classic method is still useful in many situations.
`findByIdAndUpdate()` can be used when searching by id.
You need to pass the options document { new: true } as the 3rd argument to findOneAndUpdate() to return the updated document.
By default, these methods return the unmodified object.


### Delete One Document Using model.findByIdAndRemove
`findByIdAndRemove` and `findOneAndRemove` are like the previous update methods.
They pass the removed document to the db. As usual, use the function argument `personId` as the search key.

### Delete Many Documents with model.remove()
Model.remove() is useful to delete all the documents matching given criteria.

### Chain Search Query Helpers to Narrow Search Results
If you don’t pass the callback as the last argument to Model.find() (or to the other search methods), the query is not executed.
You can store the query in a variable for later use.
This kind of object enables you to build up a query using chaining syntax.
The actual db search is executed when you finally chain the method `.exec()`.
You always need to pass your callback to this last method. There are many query helpers, here we'll use the most commonly used.



## Notes
In Gitpod use the following command to get your public URL

```bash
$ gp url <port>

# Example for port 3000
$ gp url 3000

```
### Fixing the "Missing `done()` argument" error

Restarting the node server with `npm start` and then clicking the `I've completed this challenge` does the trick 90% of the time.
