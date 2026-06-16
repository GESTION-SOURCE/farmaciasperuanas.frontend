import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterLinksComponent } from './components/footer-links/footer-links.component';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, FooterLinksComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  footerSections = [
    {
      title: 'Categorías',
      links: [
        { text: 'Dermocosmética', url: '/' },
        { text: 'Farmacia', url: '/' },
        { text: 'Bienestar', url: '/' },
        { text: 'Infantil', url: '/' },
        { text: 'Fotoprotección', url: '/' },
        { text: 'Inkaclub', url: '/' }
      ]
    },
    {
      title: 'Nosotros',
      links: [
        { text: 'Conócenos', url: '/' },
        { text: 'Nuestra visión', url: '/' },
        { text: 'Nuestra misión', url: '/' },
        { text: 'Trabaja con nosotros', url: '/' },
        { text: 'Políticas de privacidad', url: '/' }
      ]
    },
    {
      title: 'Ayuda',
      links: [
        { text: 'Preguntas frecuentes', url: '/' },
        { text: 'Términos y condiciones', url: '/' },
        { text: 'Cambios y devoluciones', url: '/' },
        { text: 'Zonas de reparto', url: '/' }
      ]
    }
  ];
}
