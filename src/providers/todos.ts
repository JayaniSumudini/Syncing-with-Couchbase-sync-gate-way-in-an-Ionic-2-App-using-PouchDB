import { Injectable,EventEmitter } from '@angular/core';
import * as PouchDB from "pouchdb";

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
 Generated class for the Todos provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class Todos{
  // data: any;
  db: any;
  private readonly remote: string ;

  private isInstantiated: boolean;
  private readonly SYNC_GATEWAY_URL = 'http://localhost:4984/todo';
  private readonly localDbName: string = 'todos';
  private listener: EventEmitter<any> = new EventEmitter();




  constructor() {

    // this.db = new PouchDB(this.localDbName);
    // this.db.setMaxListeners(20);
    this.remote = this.SYNC_GATEWAY_URL;
    // var xhr = new XMLHttpRequest();
    // xhr.open("get", "http://localhost:4984/todo/", true);
    // xhr.setRequestHeader('Content-Type', 'application/json');
    //
    // xhr.onreadystatechange = () => {  //instead of onreadystatechange
    //   //do something
    //   let options = {
    //     live: true,
    //     retry: true,
    //     continuous: true,
    //   };
    //   this.db.sync(this.remote, options);
    //
    //   console.log("Sync success");
    // };
    // xhr.withCredentials = true;
    // xhr.send(JSON.stringify({"name": "jayani", "password": "password"}));

    if(!this.isInstantiated) {
      this.db = new PouchDB(this.localDbName);
      this.isInstantiated = true;
    }

  }


  // getTodos() {
  //   if (this.data) {
  //     return Promise.resolve(this.data);
  //   }
  //
  //   return new Promise(resolve => {
  //
  //     this.db.allDocs({
  //
  //       include_docs: true
  //
  //     }).then((result) => {
  //
  //       this.data = [];
  //
  //       let docs = result.rows.map((row) => {
  //         this.data.push(row.doc);
  //       });
  //
  //       resolve(this.data);
  //
  //       this.db.changes({
  //         live: true,
  //         since: 'now',
  //         include_docs: true
  //       }).on('change', (change) => {
  //         this.handleChange(change);
  //       });
  //
  //     }).catch((error) => {
  //
  //       console.log(error);
  //
  //     });
  //
  //   });
  // }

  // createTodo(todo){
  //   this.db.post(todo);
  // }
  //
  // updateTodo(todo){
  //   this.db.put(todo).catch((err) => {
  //     console.log(err);
  //   });
  //   console.log("####################");
  // }
  //
  // deleteTodo(todo){
  //   // this.db.remove(todo).catch((err) => {
  //   //   console.log(err);
  //   // });
  //   return this.db.remove(todo);
  // }
  //
  // handleChange(change){
  //   console.log("change" , change);
  //   let changedDoc = null;
  //   let changedIndex = null;
  //
  //   this.data.forEach((doc, index) => {
  //
  //     if(doc._id === change.id){
  //       changedDoc = doc;
  //       changedIndex = index;
  //     }
  //
  //   });
  //
  //   //A document was deleted
  //   if(change.deleted){
  //     this.data.splice(changedIndex, 1);
  //     console.log("deleted");
  //   }
  //   else {
  //
  //     //A document was updated
  //     if(changedDoc){
  //       this.data[changedIndex] = change.doc;
  //       console.log("updated");
  //
  //     }
  //
  //     //A document was added
  //     else {
  //       this.data.push(change.doc);
  //       console.log("added");
  //
  //     }
  //
  //   }
  //
  //   return this.data;
  // }
  //
  // checkboxChanged(todo){
  //   this.db.put(todo).catch((err) => {
  //     console.log(err);
  //   });
  //
  // }
  public fetch() {
    return this.db.allDocs({include_docs: true});
  }

  public get(id: string) {
    return this.db.get(id);
  }
  public put(document: any, id: string) {
    document._id = id;
    return this.get(id).then(result => {
      document._rev = result._rev;
      return this.db.put(document);
    }, error => {
      if(error.status == "404") {
        return this.db.put(document);
      } else {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }
    });
  }


  public sync() {
    var xhr = new XMLHttpRequest();
    xhr.open("get", "http://localhost:4984/todo/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.withCredentials = true;
    this.db.sync(this.remote, {
      live: true,
      retry: true,
      continuous: true,
    }).on('change', change => {
      this.listener.emit(change);
    }).on('error', error => {
      console.error(JSON.stringify(error));
    });
    console.log("Sync success");
  }

  public getChangeListener() {
    return this.listener;
  }

}
