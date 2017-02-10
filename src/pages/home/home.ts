import {Component,ChangeDetectorRef,NgZone} from "@angular/core";
import {NavController, AlertController} from "ionic-angular";
import {Todos} from "../../providers/todos";
import * as Uuid from "uuid";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  todos: any;

  constructor(public navCtrl: NavController,
              public todoService: Todos,
              public alertCtrl: AlertController,
              public changeDetectorRef: ChangeDetectorRef) {

    const db = this.todoService.db;
    db.changes({
      live: true,
      since: 'now',
      include_docs: true
    }).on('change', (change) => {
      this.onChange(change);
    });
  }

  public onChange(change:any){
    console.log("CHANGE",change.doc);
    console.log("BEFORE",this.todos);

    let newElement = true;
    this.todos = this.todos.map((todo:any) => {
      if (todo._id === change.doc._id){
        todo = change.doc;
        newElement = false;
      }
      return todo;
    });


    if (newElement === true) {
      this.todos.push(change.doc);
    }

    this.changeDetectorRef.detectChanges();
  }
  ionViewDidLoad() {
    this.todoService.getTodos().then((data) => {
      this.todos = data;
      console.log("ionViewDidLoad" , this.todos);
    });
  }

  createTodo() {
    let prompt = this.alertCtrl.create({
      title: 'Add',
      message: 'What do you need to do?',
      inputs: [
        {
          name: 'title'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            setTimeout(() => {
              this.todoService.createTodo({
                  _id: new Date(),
                  title: "1 : " + data.title,
                  completed: false,
                  type: "todo"
                });
            }, 10);

            setTimeout(() => {
              this.todoService.createTodo({
                  _id: new Date(),
                  title: "2 : " + data.title,
                  completed: false,
                  type: "todo"
                });
            }, 1000);
            setTimeout(() => {
              this.todoService.createTodo({
                  _id: new Date(),
                  title: "3 : " + data.title,
                  completed: false,
                  type: "todo"
                });
            }, 2000);
          }
        }
      ]
    });

    prompt.present();

  }

  updateTodo(todo) {
    console.log("todo.id", todo._id);
    let prompt = this.alertCtrl.create({
      title: 'Edit',
      message: 'Change your mind?',
      inputs: [
        {
          name: 'title'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.todoService.updateTodo({
              _id: todo._id,
              _rev: todo._rev,
              title: data.title,
              type: "todo",
              completed: todo.completed
            });
          }
        }
      ]
    });

    prompt.present();

  }
  deleteTodo(todo) {
    this.todoService.deleteTodo(todo);
  }
  // checkboxChanged(todo) {
  //   console.log("before home todo" , this.todos);
  //
  //   this.todoService.checkboxChanged({
  //     _id: todo._id,
  //     _rev: todo._rev,
  //     title: todo.title,
  //     type: "todo",
  //     completed: todo.completed
  //   });
  //   console.log("after home todo" , this.todos);
  //
  // }

}
