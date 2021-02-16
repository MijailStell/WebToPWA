import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

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
  loading: boolean = false;

  constructor(private loaderService: LoaderService){}

  ngOnInit() {
    this.isLoading$ = this.loaderService.getIsLoading$();
    this.isLoading$
    .pipe(delay(0))
    .subscribe((loading) => {
      this.loading = loading;
    });
  }

}
