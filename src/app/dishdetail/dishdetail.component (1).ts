import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../service/dish.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[]; //almacenar el arreglo de ids
  prev: string;
  next: String;

  commentForm: FormGroup;
  comment: Comment;


  //you will now subscribe to the Angular Form observable named valueChanges and initiate form validation
  formErrors = {
    'comment': '',
    'author': ''
  };

  validationMessages = {
    'comment': {
      'required': 'Comment is required.',
      'minlength': 'Comment must be at least 2 characters long.',
      'maxlength': 'Comment cannot be more than 25 characters long.'
    },
    'author': {
      'required': 'Author name is required.',
      'minlength': 'Name must be at least 2 characters long.',
      'maxlength':  'Name cannot be more than 25 characters long.'
    },
  };

  @ViewChild('fform') commentFormDirective;

  constructor(private dishService: DishService, private location: Location, private route: ActivatedRoute, private fb: FormBuilder) {
    this.createForm();
   }

  ngOnInit(): void {
    this.dishService.getDishIds()
    .subscribe((dishIds) => this.dishIds = dishIds);
    this.route.params
    .pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id);});
    /*let id = this.route.snapshot.params['id']; //params forma de obtener los valores de parametro dentro de mi URL.
    //snapshot toma instantanea del servico de ruta y luego estamos obteniendo el parametro Observable*/
    
    /* Primera forma
    this.dish = this.dishService.getDish(id);*/
    /* Segunda forma
    this.dishService.getDish(id).then((dish) => this.dish = dish);*/
    /*Trecera forma
    this.dishService.getDish(id)
   .subscribe((dish) => this.dish = dish);*/

  }
// Metodo para obtener el id previo y siguiente al actual id
  setPrevNext(dishIds: string): void{
    const index = this.dishIds.indexOf(dishIds);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void{
    this.location.back();
  }

  //create reactive form 
  createForm(){
    this.commentForm = this.fb.group({ //define group form group
      rating: 5,
      comment: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      author: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)]]
    }); 

    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set form validation messages
  }


  onValueChanged(data?: any){
    if (!this.commentForm){  return; }
    const form = this.commentForm;
    for (const field in this.formErrors){
      if (this.formErrors.hasOwnProperty(field)){
        // clear previos error messages (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for (const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit(){
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    this.dish.comments.push(this.comment);
    console.log(this.comment);
    this.commentForm.reset({
      rating: 5,
      author: '',
      comment: '',
      date: ''
    });
    this.commentFormDirective.resetForm();
  }

}
