Hardwire
========

Scalable CMS framework for node.js. **NOT READY FOR PRODUCTION**

Built on top of:

- Express 4 - App core logic, routing, middleware
- Mongoose + node-validator - DB, ORM and validation
- Wiretree - Framework dependency injection and app structure
- Passport - Multiservice auth
- Nodemailer + Hogan - SMTP mailer and mail template engine
- Jade - Template engine
- ¿?¿? - Handle errors and logs
- ¿?¿? - Roles, levels and permissions
- node-filesaver + ¿?¿? - Files collections manager


Installation
------------

```
npm install git@github.com:jacoborus/hardwire.git
```

Usage
-----

Create your controllers, models, routes and views in their respective folders and call Hardwire:

```
require('hardwire')( __dirname );
```

Folder structure app
--------------------

- controllers
- models
- routes
- views
- public
- setup
- plugins


Routing
-------


### General
```
GET		/					Home page
GET		/login				Login page
GET		/logout				Login page
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

Client dependencies
-------------------

**[bower](http://bower.io/)** (app/bower.json)

- [submitter](https://github.com/jacoborus/submitter)
- [nanobar](https://github.com/jacoborus/nanobar)


<br><br>

---

© 2014 Jacobo Tabernero - [jacoborus](https://github.com/jacoborus)

Released under [MIT License](https://raw.github.com/jacoborus/hardwire/master/LICENSE)