Hardwire
========

**IN EARLY DEVELOPMENT. NOT READY FOR PRODUCTION**

Scalable CMS framework for node.js.

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

### Admin API
```
GET		/admin							Admin dashboard
// collection docs
GET		/admin/collection/:model				List/Search documents of model :model
GET		/admin/collection/:model/new			New doc view
POST	/admin/collection/:model				Create new doc
GET		/admin/collection/:model/:id			Read doc
GET		/admin/collection/:model/:id/edit		Edit doc view
PUT		/admin/collection/:model/:id			Update doc
DEL		/admin/collection/:model/:id			Destroy doc
// single docs
GET		/admin/single/:model/:id/edit	Edit doc view
PUT		/admin/single/:model/:id		Update doc
```


<br><br>

---

© 2015 Jacobo Tabernero - [jacoborus](https://github.com/jacoborus)

Released under [MIT License](https://raw.github.com/jacoborus/hardwire/master/LICENSE)
