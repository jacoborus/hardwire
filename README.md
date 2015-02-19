Hardwire
========

Scalable CMS framework for node.js. **NOT READY FOR PRODUCTION**

Built on top of:

- Express 4 - App core logic, routing, middleware
- Mongoose + node-validator - DB, ORM and validation
- Wiretree - Framework dependency injection and app structure
- Passport - Multiservice auth
- curlymail - SMTP mailer and mail template engine
- Jade - Template engine
- ¿?¿? - Handle errors and logs
- miniruler - Roles, levels and permissions
- node-filesaver + ¿?¿? - Files manager with collections



Requirements
------------

Node.js and a MongoDB instance

Installation
------------

```sh
mkdir myapp && cd myapp
npm init  # hardwire requires a package.json
npm install --save hardwire

# generate boilerplate
npm run hw-boilerplate

# open hw-conf.json and add your MongoDB settings
# and then initialize database
npm run hw-initdb
```


Run
---

```
npm start
```


Folder structure app
--------------------

- controllers
- models
- routes
- views
- public


Routing
-------


### General
```
GET		/					Home page
GET		/user/login			Login page
GET		/user/logout		Login page
```

### Administración
```
GET		/admin							Admin dashboard
// docs
GET		/admin/docs/:model				List/Search documents of model :model
GET		/admin/docs/:model/new			New doc view
POST	/admin/docs/:model				Create new doc
GET		/admin/docs/:model/:id			Read doc
GET		/admin/docs/:model/:id/edit		Edit doc view
PUT		/admin/docs/:model/:id			Update doc
DEL		/admin/docs/:model/:id			Destroy doc
// keyval
GET		/admin/keyval/:model/:id/edit	Edit doc view
PUT		/admin/keyval/:model/:id		Update doc
```


<br><br>

---

© 2014 Jacobo Tabernero - [jacoborus](https://github.com/jacoborus)

Released under [MIT License](https://raw.github.com/jacoborus/hardwire/master/LICENSE)
