import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './components/footer/footer';
import { Navbar } from './components/navbar/navbar';
import { Topbar } from './components/topbar/topbar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, Footer, Navbar, Topbar],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {

}
