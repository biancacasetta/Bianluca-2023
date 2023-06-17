import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-modo-anonimo',
  templateUrl: './modo-anonimo.component.html',
  styleUrls: ['./modo-anonimo.component.scss'],
})
export class ModoAnonimoComponent implements OnInit {

  //@ts-ignore
  formAnonimo:FormGroup;
  spinner:boolean = false;

  constructor(private formBuilder: FormBuilder)
  {
    this.formAnonimo = this.formBuilder.group({
      nombre: ['', [Validators.required]]});
  }

  ngOnInit() {}

}
