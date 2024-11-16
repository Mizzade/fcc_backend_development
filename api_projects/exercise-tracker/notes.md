# Exercise Tracker

You can omit installing body-parser since express now can do it by itself.
So instead of writing
```js
import bodyParser from 'body-parser'
...
app.use(bodyParser.urlencoded({ extended: false }));
```

just use this
```js
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
```

### Gitpod
You can get your URL in gitpod with
```bash
$ gp url <port>

# Example for port 3000
$ gp url 3000
# => https://3000-freecodecam-boilerplate-wx35sc3vva7.ws-eu116.gitpod.io
```

### Curl
You can use curl to test the implementation of GET routes on Gitpod like this.
Use the command above to find out your `<gitpod_url>`.

```bash
$ curl -X GET "<gitpod_url>/api/users"
```

or

```bash
$ curl -X GET "<gitpod_url/api/users/<id>/logs"
```
