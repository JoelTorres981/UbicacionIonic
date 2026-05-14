import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';

// 1. Importaciones de Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideIonicAngular(),
    provideRouter(routes),
    
    // 2. Inicializar Firebase
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    
    // 3. Inicializar Firestore (Base de datos)
    provideFirestore(() => getFirestore()),
  ],
};