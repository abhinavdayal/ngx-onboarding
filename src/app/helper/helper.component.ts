import { Component, HostListener, OnInit } from '@angular/core';
import { HelpService } from '../services/help.service';

@Component({
  selector: 'app-helper',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.scss']
})
export class HelperComponent implements OnInit {

  helpon = false;
  scrolling = 0;
  top: number = 0;
  left: number = 0;
  right: number = 0;
  bottom: number = 0;
  height: number = 0;
  calloutHeight = 150;
  calloutWidth = 250;
  width: number = 0;
  helpcontent: string = '';
  scrollx = 0;
  scrolly = 0;
  seq = 0;
  helptop = 0;
  buffer = 100;
  gap = 10;

  @HostListener('window:resize', ['$event'])
  handleResize(event: any) {
    if (this.helpon) this.goToNext();
  }

  private get scrollDone() {

    if(this.scrolling>0) 
      return window.scrollY >= this.scrolly || window.scrollY+window.innerHeight>=document.body.offsetHeight
    else 
      return window.scrollY <= this.scrolly || window.scrollY == 0
  }

  @HostListener('window:scroll', ['$event'])
  preventScroll(event: any) {
    //console.log(event)
    if (this.helpon) {
      if (this.scrolling) {
        let sbHeight = window.innerHeight * (window.innerHeight / document.body.offsetHeight);
        //scrolling 150 567 1089 1650 718.74
        //console.log("scrolling", this.scrolly, window.scrollY, window.innerHeight, document.body.offsetHeight, sbHeight)
        if (this.scrollDone) {
          console.log("done")
          this.scrolly = window.scrollY;
          this.scrolling = 0;
          this.showHelp();
        }
      } else {
        window.scrollTo(this.scrollx, this.scrolly);
        event.stopPropagation();
        event.preventDefault();
        return false;
      }
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
    this.goToNext();
  }

  private showHelp() {
    let H = this.helpservice.helpsequence[this.seq];
    let e = H.el.nativeElement;

    let t = e.offsetTop;
    //console.log("top = ", t, "ScrollY= ", this.scrolly, "height = ", window.innerHeight)

    // now based on the position, decide where to show help (top, left, bottom, right)

    // if bottom > help content height, then show on bottom
    // if top > help content height, then show on top
    // if left > left ...
    // if no space, may be you need to scroll further
    let sbHeight = window.innerHeight * (window.innerHeight / document.body.offsetHeight);
    /*
    If element top is beyond the screen
     */
    this.height = e.clientHeight + 2*this.gap;
    this.width = e.clientWidth + 2*this.gap;
    this.top = Math.max(0, e.offsetTop - this.scrolly - this.gap);
    this.left = Math.max(0, e.offsetLeft - this.gap);
    this.right = Math.max(0, document.body.offsetWidth - (this.left + this.width));
    this.bottom = Math.max(0, window.innerHeight - (this.top + this.height)) ;
    this.helptop = this.bottom>this.calloutHeight? this.top+this.height+20 : this.top-this.calloutHeight-20;
    
    this.helpcontent = H.markdown;
    //8 1081 1833 -9 79 17
    //console.log(this.left, this.top, this.right, this.bottom, this.width, this.height)
  }

  private goToNext() {
    let H = this.helpservice.helpsequence[this.seq];
    let e = H.el.nativeElement;
    let t = e.offsetTop;
    //console.log("top = ", t, "ScrollY= ", this.scrolly, "height = ", window.innerHeight)
    if (t - this.scrolly < 0 || t - this.scrolly > window.innerHeight) {
      this.scrolly = e.offsetTop - this.buffer;
      this.scrolling = this.scrolly>window.scrollY? 1 : -1;
      //console.log(this.scrolling)
      //this.scrolly += this.scrolling*this.buffer;
      this.resetOverlay();
      window.scroll({ left: this.scrollx, top: this.scrolly, behavior: "smooth" });
    } else {
      this.showHelp()
    }
  }

  resetOverlay() {
    this.top = 0;
    this.left = 0
    this.bottom = window.innerHeight;
    this.right = window.innerWidth;
    this.width = 0;
    this.height = 0;
  }

  next() {
    this.seq++
    this.goToNext();
  }

  prev() {
    this.seq--;
    this.goToNext();
  }

  cancel() {
    this.seq = 0;
    this.helpon = false;
  }

}
