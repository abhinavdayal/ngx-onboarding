import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sparkline',
  templateUrl: './sparkline.component.html',
  styleUrls: ['./sparkline.component.scss']
})
export class SparklineComponent implements AfterViewInit {
  @ViewChild("canvas") canvas !: ElementRef;
  @Input() data: Array<number> = [20, 10, 60, 74, 95, 48, 82, 53, 67, 23, 74, 20, 10, 60, 74, 95, 48, 82, 53, 67, 23, 74];
  @Input() width = 200;
  @Input() height = 50;
  @Input() strokewidth = 2;
  @Input() strokecolor = "#33f";
  @Input() pointradius = 3;
  private xstep = 10;

  constructor() { }

  private getxy(i: number): { x: number, y: number } {
    let x = i * this.xstep + this.pointradius;
    let y = (1 - this.data[i] / 100) * (this.height - 2*this.pointradius) + this.pointradius
    return { x: x, y: y }
  }

  drawSparkline() {
    let ctx = (this.canvas.nativeElement as HTMLCanvasElement).getContext("2d")
    if (ctx) {
      ctx.beginPath()
      this.data.forEach((v, i) => {
        let p = this.getxy(i);
        if (i == 0) ctx?.moveTo(p.x, p.y)
        else ctx?.lineTo(p.x, p.y)
      })
      ctx.strokeStyle = this.strokecolor;
      ctx.lineWidth = this.strokewidth;
      ctx.stroke();
      let p = this.getxy(this.data.length-1);
      ctx.fillStyle = "black"
      ctx.font = '12px sans-serif';
      ctx.fillText(this.data[this.data.length-1].toString()+'%', p.x+this.pointradius, p.y+this.pointradius);
    }
  }

  drawReferenceLine(v: number, message: string, color: string = "brown") {
    let ctx = (this.canvas.nativeElement as HTMLCanvasElement).getContext("2d")
    let y = (1 - v / 100) * (this.height-2*this.pointradius) + this.pointradius;
    if(ctx) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1;
      ctx.lineTo(this.width, y)
      ctx.strokeStyle = color;
      ctx.stroke()
      ctx.font = '10px sans-serif';
      let text = ctx.measureText(message);
      ctx.fillStyle = color;
      ctx.fillText(message, this.width-text.width-5, y + (v<20? -5 : 10));
    }
  }

  drawPoint(i: number, color: string, radius = 3) {
    let ctx = (this.canvas.nativeElement as HTMLCanvasElement).getContext("2d")
    if (ctx) {
      ctx.beginPath()
      let p = this.getxy(i);
      ctx.arc(p.x, p.y, radius, 0, Math.PI*2)
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      console.log(this.canvas);
      this.xstep = (this.width - this.pointradius*2) / this.data.length;
      this.drawSparkline();
      this.drawPoint(this.data.length-1, "black", this.pointradius)
      this.drawPoint(this.data.findIndex(x=>x==Math.min(...this.data)), "red", this.pointradius)
      this.drawPoint(this.data.findIndex(x=>x==Math.max(...this.data)), "green", this.pointradius)
      this.drawReferenceLine(0, "Global Performance")
    }, 10)
  }
}
