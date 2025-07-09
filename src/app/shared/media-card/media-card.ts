import {Component, Input} from '@angular/core';
import {Media} from '../../models/media.interface';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-media-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './media-card.html',
  styleUrl: './media-card.scss'
})
export class MediaCardComponent {
  @Input() media!: Media;

  imageUrlBase = 'https://image.tmdb.org/t/p/w500';

  constructor() { }

  getPosterUrl(posterPath: string | null): string {
    return posterPath ? `${this.imageUrlBase}${posterPath}` : 'assets/placeholder.jpg';
  }
}
