import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isLoading$: Observable<boolean>;

  constructor(private loaderService: LoaderService){}

  ngOnInit() {
    this.isLoading$ = this.loaderService.getIsLoading$();
  }

}
