import { ElementRef, Injectable } from '@angular/core';

export class HelpEntity {
  id: any;
  sequence: string = '';
  markdown: string = '';
  el: ElementRef;

  constructor(id: any, seq: string, m: string, el: ElementRef) {
    this.id = id;
    this.sequence = seq;
    this.markdown = m;
    this.el = el;
  }
}

@Injectable({
  providedIn: 'root'
})
export class HelpService {
  helpsequence: Array<HelpEntity> = [];
  nextid = 0;
  constructor() { }

  addHelp(id: any, s: string, m: string, el: ElementRef) {
    //TODO: add in sequence (sorted order of s)
    this.helpsequence.push(new HelpEntity(id, s, m, el))
  }

  removeHelp(id: any) {
    let i =  this.helpsequence.findIndex(x=>x.id==id)
    if(i>=0) this.helpsequence.splice(i, 1)
  }

  get nextId(): number {
    this.nextid++;
    return this.nextid;
  }
}
