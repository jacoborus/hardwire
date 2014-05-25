Hardwire
========

Scalable CMS framework for node.js. **NOT READY FOR PRODUCTION**

Installation
------------

```
npm install git@bitbucket.org:jacoborus/hardwire.git
```

Usage
-----

Create your controllers, models, routes and views in their respective folders and call Hardwire:

```
require('hardwire')( __dirname );
```


Routing
-------


### General
```
GET		/							Home page
GET		/login						Login page
```

### Administración
```
GET		/admin							Admin dashboard

GET		/admin/docs/:model				List/Search documents of model :model
GET		/admin/docs/:model/new			New doc view
POST	/admin/docs/:model				Create new doc
GET		/admin/docs/:model/:id			Read doc
GET		/admin/docs/:model/:id/editar	Edit doc view
POST	/admin/docs/:model/:id			Update doc
DEL		/admin/docs/:model/:id			Destroy doc
```

Dependencies
------------

### Server

- [hardwire](https://github.com/jacoborus/hardwire)
- [safename](https://github.com/jacoborus/safename)

### Client

**bower** (app/bower.json)

- [submitter](https://github.com/jacoborus/submitter)
- [nanobar](https://github.com/jacoborus/nanobar)


<br><br>

---

© 2014 Jacobo Tabernero - [jacoborus](https://github.com/jacoborus)

Released under [MIT License](https://raw.github.com/jacoborus/hardwire/master/LICENSE)