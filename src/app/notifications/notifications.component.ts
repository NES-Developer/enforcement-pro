import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { chevronForward, listCircle } from 'ionicons/icons';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {

  @ViewChild(IonModal, { static: false })
  modal!: IonModal;
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string = '';

  constructor() {
    addIcons({ chevronForward, listCircle });
  }

  ngOnInit() {}

  refresh() {
    window.location.reload();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
}
