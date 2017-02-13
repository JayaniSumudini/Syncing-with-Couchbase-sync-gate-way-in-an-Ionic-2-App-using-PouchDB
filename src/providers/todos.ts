import {Injectable, EventEmitter} from "@angular/core";
import * as PouchDB from "pouchdb";
import "rxjs/add/operator/map";

/**
Created by Jayani Sumudini
**/
@Injectable()
export class Todos {
  data: any;
  db: any;
  private remoteDb: any;
  public syncHandler: any;
  private readonly remoteDbName: string = 'http://localhost:5050/todo';
  private readonly SYNC_GATEWAY_URL = 'http://localhost:4984/todo';
  private readonly localDbName: string = 'todos';
  private listener: EventEmitter<any> = new EventEmitter();

  constructor() {

    this.db = new PouchDB(this.localDbName);
    this.db.setMaxListeners(20);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5050/createSession/todo", true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = () => {
      //Start synchronization only when the authentication is successful
      if (xhr.readyState == 4 && xhr.status == 200) {
        const sessionDetails = JSON.parse(xhr.responseText);
        console.log('New SG session, starting sync!');
        const ajaxOpts = {
          ajax: {headers: {"sync-gateway-auth-token": sessionDetails.SyncGatewaySessionValue}}
        };
        this.remoteDb = new PouchDB(this.remoteDbName, ajaxOpts);

        this.syncHandler = this.db.sync(this.remoteDb, {
          live: true,
          retry: true,
          continuous: true
        });

      }
    };

    xhr.withCredentials = true;
    xhr.send(JSON.stringify({"name": "jayani", "password": "jayani123"}));

  }


  getTodos() {
    // alert("A");
    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.db.allDocs({include_docs: true}).then((result) => {
        this.data = [];

        let docs = result.rows.map((row) => this.data.push(row.doc));
        resolve(this.data);

      }).catch((error) => {
        console.log(error);
      });
    });
  }

  createTodo(todo) {
    this.db.put(todo);
  }

  updateTodo(todo) {
    this.db.put(todo);
  }

  deleteTodo(todo) {
    this.db.remove(todo);
  }

  public getChangeListener() {
    console.log("change listner");
    return this.listener;
  }

}
