import {Component, ChangeDetectorRef} from "@angular/core";
import {NavController, AlertController} from "ionic-angular";
import {Todos} from "../../providers/todos";


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

  public onChange(change: any) {
    console.log("CHANGE", change.doc);
    console.log("before", this.todos);

    let newElement = true;
    let changedDoc = null;
    let changedIndex = null;
    this.todos = this.todos.map((todo, index) => {
      if (todo._id === change.doc._id) {
        todo = change.doc;
        newElement = false;
        changedDoc = todo;
        changedIndex = index;
      }
      return todo;
    });
    if (change.deleted) {
      this.todos.splice(changedIndex, 1);
    }

    if (newElement === true) {
      this.todos.push(change.doc);
    }

    this.changeDetectorRef.detectChanges();
    console.log("AFTER", this.todos);
  }

  ionViewDidLoad() {
    this.todoService.getTodos().then((data) => {
      this.todos = data;
      console.log("ionViewDidLoad", this.todos);
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
            }, 100);
            setTimeout(() => {
              this.todoService.createTodo({
                _id: new Date(),
                title: "3 : " + data.title,
                completed: false,
                type: "todo"
              });
            }, 250);
            setTimeout(() => {
              this.todoService.createTodo({
                _id: new Date(),
                title: "4 : " + data.title,
                completed: false,
                type: "todo"
              });
            }, 500);
            setTimeout(() => {
              this.todoService.createTodo({
                _id: new Date(),
                title: "5 : " + data.title,
                completed: false,
                type: "todo"
              });
            }, 750);
            setTimeout(() => {
              this.todoService.createTodo({
                _id: new Date(),
                title: "6 : " + data.title,
                completed: false,
                type: "todo"
              });
            }, 1000);
            setTimeout(() => {
              this.todoService.createTodo({
                _id: new Date(),
                title: "7 : " + data.title,
                completed: false,
                type: "todo"
              });
            }, 1250);
            setTimeout(() => {
              this.todoService.createTodo({
                _id: new Date(),
                title: "8 : " + data.title,
                completed: false,
                type: "todo"
              });
            }, 1500);
            setTimeout(() => {
              this.todoService.createTodo({
                _id: new Date(),
                title: "9 : " + data.title,
                completed: false,
                type: "todo"
              });
            }, 1750);
            setTimeout(() => {
              this.todoService.createTodo({
                _id: new Date(),
                title: "10 : " + data.title,
                completed: false,
                type: "todo"
              });
            }, 2000);
            setTimeout(() => {
              this.todoService.createTodo({
                _id: new Date(),
                title: "11 : " + data.title,
                completed: false,
                type: "todo"
              });
            }, 2250);
            setTimeout(() => {
              this.todoService.createTodo({
                _id: new Date(),
                title: "12 : " + data.title,
                completed: false,
                type: "todo"
              });
            }, 2500);
            setTimeout(() => {
              this.todoService.createTodo({
                _id: new Date(),
                title: "13 : " + data.title,
                completed: false,
                type: "todo"
              });
            }, 2750);
            setTimeout(() => {
              this.todoService.createTodo({
                _id: new Date(),
                title: "14 : " + data.title,
                completed: false,
                type: "todo"
              });
            }, 3000);
            setTimeout(() => {
              this.todoService.createTodo({
                _id: new Date(),
                title: "15 : " + data.title,
                completed: false,
                type: "todo"
              });
            }, 3250);
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


}
