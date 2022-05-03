import { CounterVm } from './counter.types';
import { Component } from '@angular/core';
import { BehaviorSubject, map, merge, Observable, of, scan, startWith, Subject } from 'rxjs';

export const initialVm: CounterVm = { count: 0 };

@Component({
  selector: 'hs-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css'],
})
export class CounterComponent {

  public vm$: Observable<CounterVm>   //= of({count:0})
  //public vm$;
  // public incrSubj = new Subject<number>();
  // public decrSubj = new Subject<number>();
  public incrAction = new BehaviorSubject<number>(0);
  public decrAction = new BehaviorSubject<number>(0);

  constructor() {
    
    const incrChanges = this.incrAction.pipe(
      map((delta) => (vm: CounterVm) => ({ ...vm, count: vm.count + delta }))
    );
    const decrChanges = this.decrAction.pipe(
      map((delta) => (vm: CounterVm) => ({ ...vm, count: vm.count - delta }))
    );

    type VmReducer = (vm: CounterVm) => CounterVm;

    this.vm$ = merge(incrChanges, decrChanges).pipe(
     // startWith( () => ({ count: 0 })), // only need when subject
      scan( (prevVm: CounterVm, mutationFn: VmReducer): CounterVm => mutationFn(prevVm),initialVm)
    );
  }
}
