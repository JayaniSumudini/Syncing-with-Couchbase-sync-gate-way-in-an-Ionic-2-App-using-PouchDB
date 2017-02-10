#Jayani sumudini (jayanisumudini@gmail.com)
How to use this Project:

#Syncing-with-Couchbase-sync-gate-way-in-an-Ionic-2-App-using-PouchDB

## Getting Started

1)clone project
```
git clone https://github.com/JayaniSumudini/Syncing-with-Couchbase-sync-gate-way-in-an-Ionic-2-App-using-PouchDB.git
```
2)
```
npm install pouchdb --save
```
3)
```
npm install @types/pouchdb --save --save-exact
```
4)
```
install couchbase sync gateway 
```
5)edit serviceconfig.json file
```
{
  "log":["CRUD+", "REST+", "Changes+", "Attach+" , "HTTP+"],
      "interface":":4984",
    "adminInterface":":4985",
  "CORS": {
    "Origin":["http://localhost:8000", "http://localhost:8100"],
	"Access-Control-Allow-Origin": ["*"],
    "LoginOrigin":["http://localhost:8000", "http://localhost:8100"],
	"Headers":["Content-Type","Access-Control-Allow-Origin"],
    "MaxAge": 1728000
  },
  "databases": {
    "todo": {
      "server":"walrus:data",
            "sync":`
                function (doc) {
                    channel (doc.channels);
                }`,
            "users": {
                "GUEST": {
                    "disabled": false,
                    "admin_channels": ["*"]
                }``
            },
			"event_handlers": {
				"document_changed": [{
					"handler": "webhook",
					"url": "http://localhost:8080/microService",
					"filter": "function(doc) {if (doc.type == 'todo' ){return true;}return false;}"
				}]
          }
    }
  }
}
```
5)
```
ionic serve
```
6)start couchbase sync gateway
