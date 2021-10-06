import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { HelpService } from '../services/help.service';

@Directive({
  selector: '[appHelp]',
  inputs: ['sequenceid', 'markdown']
})
export class HelpDirective implements OnDestroy, OnInit {
  @Input() sequenceid: string = "";
  @Input() markdown: string = "";
  private id: number = 0;

  constructor(private el: ElementRef, private helpservice: HelpService) { 
   
  }

  ngOnInit(): void {
    this.id = this.helpservice.nextId;
    this.helpservice.addHelp(this.id, this.sequenceid, this.markdown, this.el)
  }

  ngOnDestroy(): void {
    this.helpservice.removeHelp(this.id)
  }

}
