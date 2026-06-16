import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer-links',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer-links.component.html',
  styleUrl: './footer-links.component.scss'
})
export class FooterLinksComponent {
  @Input({ required: true }) section!: { title: string, links: { text: string, url: string }[] };
}