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
            this.todoService.createTodo(
              {
                title: data.title,
                completed: false,
                type: "todo"
              }
              );
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
