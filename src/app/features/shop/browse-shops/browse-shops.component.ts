import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ShopService } from '../../../core/services/shop.service';
import { Shop } from '../../../core/models/shop.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-browse-shops',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './browse-shops.component.html',
  styleUrls: ['./browse-shops.component.scss']
})
export class BrowseShopsComponent implements OnInit {
  shops$: Observable<Shop[]>;

  constructor(private shopService: ShopService) {
    this.shops$ = this.shopService.getShops();
  }

  ngOnInit(): void {}
}
