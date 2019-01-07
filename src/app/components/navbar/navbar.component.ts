import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  curView: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe( (val) => {
      if (val instanceof NavigationEnd) {
        const segments = this.router.parseUrl(val.url).root.children.primary.segments;
        if (segments.length > 2) {
          this.curView = segments[segments.length - 2].path;
        } else {
          this.curView = segments[segments.length - 1].path;
        }

      }
    });
  }

}
