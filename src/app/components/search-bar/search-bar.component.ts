import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  @Output() searchTextChanged = new EventEmitter<string>();
  @Input() placeholder: string = 'Sin texto'
  
  search = (text$: Observable<string>) =>
    text$.pipe(
      distinctUntilChanged(),
      map((term) => {
        this.searchTextChanged.emit(term.toLowerCase());
        return [];
      })
    );
}
