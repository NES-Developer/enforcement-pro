import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-loader', 
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  loading$ = new BehaviorSubject<boolean>(true);

  constructor() {}

  ngOnInit() {
    // Simulate a delay to remove the loader after loading is complete
    setTimeout(() => {
      this.loading$.next(false); // Update loading state to false after some condition
    }, 3000); // Adjust loader delay as needed
  }
}
