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
  private readonly SYNC_GATEWAY_URL = 'http://localhost:4984/todo';

  constructor(public navCtrl: NavController,
              public todoService: Todos,
              public alertCtrl: AlertController,
              public changeDetectorRef: ChangeDetectorRef,
              private zone: NgZone) {

  }

  public ionViewDidEnter() {
    this.todoService.sync();
    this.todoService.getChangeListener().subscribe(data => {
      for(let i = 0; i < data.change.docs.length; i++) {
        this.zone.run(() => {
          this.todos.push(data.change.docs[i]);
        });
      }
    });
    this.todoService.fetch().then(result => {
      this.todos = [];
      for(let i = 0; i < result.rows.length; i++) {
        this.todos.push(result.rows[i].doc);
      }
    }, error => {
      console.error(error);
    });
  }

  public insert() {
    let prompt = this.alertCtrl.create({
      title: 'Todo Items',
      message: "Add a new item to the todo list",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {}
        },
        {
          text: 'Save',
          handler: data => {
            this.todoService.put({
              type: "todo",
              title: data.title ,
              completed: false
            }, Uuid.v4());
          }
        }
      ]
    });
    prompt.present();
  }

  // ionViewDidLoad() {
  //   this.todoService.getTodos().then((data) => {
  //
  //     this.todos = data;
  //     console.log("ionViewDidLoad" , this.todos);
  //   });
  //
  // }
  //
  //
  //
  // createTodo() {
  //
  //   let prompt = this.alertCtrl.create({
  //     title: 'Add',
  //     message: 'What do you need to do?',
  //     inputs: [
  //       {
  //         name: 'title'
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel'
  //       },
  //       {
  //         text: 'Save',
  //         handler: data => {
  //           this.todoService.createTodo(
  //             {
  //               title: data.title,
  //               completed: false,
  //               type: "todo"
  //             }
  //             );
  //         }
  //       }
  //     ]
  //   });
  //
  //   prompt.present();
  //
  // }
  //
  //
  //
  // updateTodo(todo) {
  //
  //   let prompt = this.alertCtrl.create({
  //     title: 'Edit',
  //     message: 'Change your mind?',
  //     inputs: [
  //       {
  //         name: 'title'
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel'
  //       },
  //       {
  //         text: 'Save',
  //         handler: data => {
  //           this.todoService.updateTodo({
  //             _id: todo._id,
  //             _rev: todo._rev,
  //             title: data.title,
  //             completed: todo.completed
  //           });
  //         }
  //       }
  //     ]
  //   });
  //
  //   prompt.present();
  // }
  //
  deleteTodo(todo) {
    // // this.todoService.deleteTodo(todo);
    // this.todoService.deleteTodo(todo);
    // this.todoService.sync();
  }
  //
  // checkboxChanged(todo) {
  //   console.log("before home todo" , this.todos);
  //   // this.todoService.checkboxChanged(todo);
  //
  //   this.todoService.checkboxChanged({
  //     _id: todo._id,
  //     _rev: todo._rev,
  //     title: todo.title,
  //     completed: todo.completed
  //   });
  //   console.log("after home todo" , this.todos);
  //
  //   // try {
  //   //   this.changeDetectorRef.detectChanges();
  //   //   console.log("wewfrwfwefwfwfwfewgfefe");
  //   // } catch (err) {
  //   //   console.log(err);
  //   // }
  //   // this.todoService.getTodos().then((data) => {
  //   //   this.todos = data;
  //   // });
  // }

}
