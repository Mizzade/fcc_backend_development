# NPM - Node Package Manager

### pacakge.json
It stores information about your project.
It consists of a single JSON object where information is stored in key-value pairs.
There are only two required fields: `name` and `version`

You can create the `package.json` file from the terminal using the `npm init` command.
Using npm init with the `-y` flag will generate the file without having it ask any questions,
```bash
npm init -y
```

#### important fields
- `author`: specifies who created the project.
- `description`: a short, but informative description about your project
- `keywords`: describe your project using related keywords
- `license`: inform users of what they are allowed to do with your project.
- `version`: A required field. It describes the current version of the project
- `dependencies`: In this section, packages your project requires are stored in the format `"package-name" : "version"`.

Example
```json
...
"author": "Jon Doe",
"description": "A project that does something awesome",
"keywords": [ "descriptive", "related", "words" ],
"license": "MIT",
...
```

## Semantic Versioning
Semantic Versioning (SemVer) is an industry standard for software versioning aiming to make it easier to manage dependencies.

Example
```
"package": "MAJOR.MINOR.PATCH"
```
- The MAJOR version should increment when you make incompatible API changes.
- The MINOR version should increment when you add functionality in a backwards-compatible manner.
- The PATCH version should increment when you make backwards-compatible bug fixes.

This means that PATCHes are bug fixes and MINORs add new features but neither of them break what worked before. Finally, MAJORs add changes that won’t work with earlier versions.


### Tilde character
To allow an npm dependency to update to the latest PATCH version, you can prefix the dependency’s version with the tilde (~) character. Here's an example of how to allow updates to any 1.3.x version.

```
"package": "~1.3.8"
```

### Caret character
The caret (^) allows npm to install future updates as well. The difference is that the caret will allow both MINOR updates and PATCHes.
```
"package": "^1.3.8"
```

### Removing pacakges
If you want to remove an external package that you no longer need just remove the corresponding key-value pair for that package from your dependencies.
