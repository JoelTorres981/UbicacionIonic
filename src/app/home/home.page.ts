import { Component, OnInit, signal } from '@angular/core';
import { 
  IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, 
  IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonNote,
  ToastController
} from '@ionic/angular/standalone';
import { NgIf } from '@angular/common';
import { LocationService } from '../services/location';
import { Browser } from '@capacitor/browser';
import { addIcons } from 'ionicons';
import { cloudUploadOutline, mapOutline, checkmarkCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonButton, IonIcon, IonNote, NgIf
  ],
  templateUrl: './home.page.html'
})
export class HomePage implements OnInit {
  latitude = signal<number | null>(null);
  longitude = signal<number | null>(null);
  errorMsg = signal<string | null>(null);

  constructor(
    private loc: LocationService,
    private toastController: ToastController 
  ) {
    addIcons({ cloudUploadOutline, mapOutline, checkmarkCircleOutline });
  }

  async ngOnInit() {
    await this.loc.ensurePermissions();
    await this.obtenerUbicacionActual();
  }

  // Función para mostrar el mensaje
  async mostrarMensaje(mensaje: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom',
      color: color,
      buttons: [{ icon: 'checkmark-circle-outline', role: 'cancel' }]
    });
    await toast.present();
  }

  // Acción del Botón: Guardar en Firebase
  async soloRegistrarEnFirebase() {
    try {
      // 1. Mensaje de "Guardando..."
      await this.mostrarMensaje('Guardando ubicación en la nube...', 'tertiary');

      await this.loc.guardarUbicacionActual('usuario_demo');

      // 2. Mensaje de "Éxito"
      await this.mostrarMensaje('¡Ubicación guardada con éxito!', 'success');
      
    } catch (e) {
      this.errorMsg.set('Error al guardar en la nube');
      await this.mostrarMensaje('Hubo un error al guardar', 'danger');
    }
  }

  // Acción del Botón: Guardar en Supabase
  async soloRegistrarEnSupabase() {
    try {
      await this.mostrarMensaje('Guardando ubicación en Supabase...', 'secondary');
      await this.loc.guardarEnSupabase('usuario_demo');
      await this.mostrarMensaje('¡Ubicación guardada en Supabase con éxito!', 'success');
    } catch (e) {
      this.errorMsg.set('Error al guardar en Supabase');
      await this.mostrarMensaje('Hubo un error al guardar en Supabase', 'danger');
    }
  }

  async soloAbrirEnMaps() {
    const lat = this.latitude();
    const lng = this.longitude();
    if (lat && lng) {
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      await Browser.open({ url });
    }
  }

  async obtenerUbicacionActual() {
    const pos = await this.loc.getCurrentPosition();
    this.latitude.set(pos.coords.latitude);
    this.longitude.set(pos.coords.longitude);
  }
}