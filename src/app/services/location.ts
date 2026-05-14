import { Injectable } from '@angular/core';
import { Geolocation, PermissionStatus, Position } from '@capacitor/geolocation';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class LocationService {

  constructor(private firestore: Firestore) {}

  async ensurePermissions(): Promise<PermissionStatus> {
    const perm = await Geolocation.checkPermissions();
    if (perm.location === 'granted' || perm.coarseLocation === 'granted') return perm;
    return Geolocation.requestPermissions();
  }

  async getCurrentPosition(): Promise<Position> {
    return Geolocation.getCurrentPosition({ enableHighAccuracy: true });
  }

  async guardarUbicacionActual(userId: string) {
    try {
      const pos = await this.getCurrentPosition();
      const datos = {
        usuario: userId,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        timestamp: serverTimestamp()
      };
      const colRef = collection(this.firestore, 'historial_ubicaciones');
      return await addDoc(colRef, datos);
    } catch (error) {
      console.error('Error al guardar:', error);
      throw error;
    }
  }
}