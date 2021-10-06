import { Component, HostListener, OnInit } from '@angular/core';
import { HelpService } from '../services/help.service';

@Component({
  selector: 'app-helper',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.scss']
})
export class HelperComponent implements OnInit {

  helpon = false;
  top: number = 0;
  left: number = 0;
  right: number = 0;
  bottom: number = 0;
  height: number = 0;
  width: number = 0;
  helpcontent: string = '';
  scrollx = 0;
  scrolly = 0;
  seq = 0;
  
  @HostListener('window:resize', ['$event'])
  handleResize(event: any) {
    if(this.helpon) this.showCurrentHelp();
  }

  @HostListener('window:scroll', ['$event'])
  preventScroll(event: MouseEvent) {
    console.log("scroll event")
    if(this.helpon) {
      window.scrollTo(this.scrollx, this.scrolly);
      event.stopPropagation();
      event.preventDefault();
      return false;
    }
    return true;
  }
  

  constructor(public helpservice: HelpService) { }

  ngOnInit(): void {
  }

  show() {
    this.helpon = true;
    this.scrollx = window.pageXOffset || document.documentElement.scrollLeft;
    this.scrolly = window.pageYOffset || document.documentElement.scrollTop;
    this.showCurrentHelp();
  }

  private showCurrentHelp() {
    let H = this.helpservice.helpsequence[this.seq];
    let e = H.el.nativeElement;
    //let t = e.offsetTop;
    // this.scrolly = e.offsetTop;
    // this.scrollx = e.offsetLeft;
    // window.scroll(this.scrollx, this.scrolly);
    this.top = e.offsetTop;
    this.bottom = window.innerHeight - (this.top + e.clientHeight);
    this.left = e.offsetLeft;
    this.right = window.innerWidth - (this.left + e.clientWidth);
    this.height = e.clientHeight;
    this.width = e.clientWidth;
    this.helpcontent = H.markdown;

    console.log(this.left, this.top, this.right, this.bottom, this.width, this.height)
  }

  next() {
    this.seq++
    this.showCurrentHelp();
  }

  prev() {
    this.seq--;
    this.showCurrentHelp();
  }

  cancel() {
    this.seq = 0;
    this.helpon = false;
  }

}
