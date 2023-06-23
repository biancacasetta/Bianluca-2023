import { Injectable, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import {
  PushNotifications,
  Token,
  PushNotificationSchema,
  ActionPerformed
} from '@capacitor/push-notifications';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { getMessaging, getToken } from "firebase/messaging";
import { FirebaseService } from './firebase.service';
import { deleteField } from 'firebase/firestore';

import { LocalNotifications } from '@capacitor/local-notifications';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseCloudMessagingService {

  constructor(
    private router: Router,
    private angularFirestore: AngularFirestore,
    private authService: AuthService,
    private firestore: FirebaseService,
    private http: HttpClient
  ) { }

  public async initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }

    // getMessaging().
  }

  sendPushNotification(body: any): Observable<any> {

    // return this.http.post<Observable<any>>('https://fcm.googleapis.com/v1/projects/bianluca-pps/messages:send', body, {
    //   headers: {
    //     // Authorization: `Bearer ${getAccessToken()}`,
    //     Authorization: `Bearer ya29.c.b0Aaekm1IjfCNS3BKkizv96Ddrh3MR-cBP5PEhg2BnOtOB9TQXGGrL-oQn8E-N8-uz0lVQrHqmev1Ar8Bca1TDQya87yo-5JYc0gZmZfJv63Ccsa_7BGdwtYNS0JWmB0-s-vqBr6uc_6tRqsPWqvfAH-Hx2N-t4Jj2xE254GT3crzwgaFh8pEIlunYsTMhWJH15z9QCKVlmbPBafHMIn2XbLd5I1SmgdacHuNeFhzl3oIu2WE4prlAff0NEOr3MNbb9Fcc9rdLK2kPIBdr1Oo0a9rm3I8IZMUWx476LyKDXW7U81MPAnrrihgkeiua79qNriZhfcjVvQT339A6F-pmmyzpm_i-fVkxsiQQnBmXlr-7l_XM-lmop7VtSIlWvllipJt9QteqsdFpUU9m_QO6Z866fsJhV7QBljRMXRzlouk0q4Yaygcn24Xjhft1euZk3ISYmUjf4vSIyXkaVfi2dS-SRlWysX0qIvsYaaMIzf1cyJBjzFMBW850ymMr-hYM5ZriYvyX5zJbV1_pQ53Z-Xy12xv6tqWXqZOt3oawqS356ntjuWzjebjvvF5mq6f6rQ3rI36Zmo0nWnmao2fowibeabX7yYcyJin85Fn8QUI8eQFwVoQfZq8oBqubqSU7X0s64qOQyXvROexw9rkUlRkXcnwJVhJSpmZzstX898izVY1Ime30Uyyk4M6O18SSaidUB7QOQoYM46S0Vjc0XIh-FS3t39l7Y1UVO8s36rm_lBjScvtq7g802hxM3J932jyVeO9Q9_rcucQ4s4WrBhxb5lS_br6p-Sh2tdouv6BtsI1Rm1sa9bikipspcu06_W2W_0Yx7ouQyZ39og8qlgcOlUS8IkhFOwRnjqrrm1a-oR5_gz0QWgZ17iQ-9_OqQyXWUVX-kis7RRW4J25R8qW-kdsv2bW34dcgVzXhRYa-1f6b8w1feJ2Rk3lFj-tw__c1jiyg-gOBBoOyVQncO541caeJx7td7iuwcQ3ZolMF0zzzi5e9X_3`,
    //     'Content-Type': 'application/json',
    //   },
    // });

    return this.http.post<Observable<any>>('https://fcm.googleapis.com/fcm/send', body, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: "key=AAAAHLQlBJw:APA91bG_8qHdJPv03YZj6kKCVhzubhVBOVz-VwHt9YPbEraMbnCHIAEsFxXNIF2dvQq6b5zFfwg9T05YhPbiR0Xn-H0ZPx9_t1167W9YP63LlJOpVuBMs6BC-ZjwJGz2k9q7avPE2GKj",

        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      },
    });
  }

  sendCocineroPushNotification() {
    this.firestore.obtenerColeccion('usuarios-aceptados').subscribe((res) => {
      const usuarios = res.filter(usuario => usuario.perfil === 'cocinero' && usuario.fcmToken);

      usuarios.forEach(usuario => {

        const body = {
          registration_ids: [usuario.fcmToken],
          notification: {
            body: 'Hay nuevos platos para preparar',
            title: 'Nuevo pedido'
          }
        }

        this.sendPushNotification(body).subscribe(
          response => {
            console.log('Exito', response);
          },
          error => {
            console.error('Error', error);
          }
        );
      });
    });
  }

  sendBartenderPushNotification() {
    this.firestore.obtenerColeccion('usuarios-aceptados').subscribe((res) => {
      const usuarios = res.filter(usuario => usuario.perfil === 'bartender' && usuario.fcmToken);

      usuarios.forEach(usuario => {

        const body = {
          registration_ids: [usuario.fcmToken],
          notification: {
            notification: {
              body: 'Hay bebidas para preparar',
              title: 'Nuevo pedido'
            }
          }
        }

        this.sendPushNotification(body).subscribe(
          response => {
            console.log('Exito', response);
          },
          error => {
            console.error('Error', error);
          }
        );
      });
    });
  }

  pedidoEnPreparacionPushNotification() {
    throw new Error('Method not implemented.');
  }

  nuevoPedidoPushNotification() {
    this.firestore.obtenerColeccion('usuarios-aceptados').subscribe((res) => {
      const usuarios = res.filter(usuario => usuario.perfil === 'mozo' && usuario.fcmToken);

      usuarios.forEach(usuario => {

        const body = {
          registration_ids: [usuario.fcmToken],
          notification: {
            body: 'Un cliente ha realizado un pedido',
            title: 'Nuevo pedido'
          }
        }

        this.sendPushNotification(body).subscribe(
          response => {
            console.log('Exito', response);
          },
          error => {
            console.error('Error', error);
          }
        );
      });
    });
  }

  nuevoMensajePushNotification(nombreUsuario: string, mensaje: string, dirigidoA: string) {
    this.firestore.obtenerColeccion('usuarios-aceptados').subscribe((res) => {
      let usuarios = [];
      if (dirigidoA === 'mozo') {
        usuarios = res.filter(usuario => usuario.perfil === 'mozo' && usuario.fcmToken);
      }
      else {
        usuarios = res.filter(usuario => usuario.id === dirigidoA && usuario.fcmToken);
      }

      usuarios.forEach(usuario => {

        const body = {
          registration_ids: [usuario.fcmToken],
          notification: {
            body: mensaje,
            title: 'Mensaje de: ' + nombreUsuario
          }
        }

        this.sendPushNotification(body).subscribe(
          response => {
            console.log('Exito', response);
          },
          error => {
            console.error('Error', error);
          }
        );
      });
    });
  }

  clienteEnListaDeEsperaPushNotification() {
    this.firestore.obtenerColeccion('usuarios-aceptados').subscribe((res) => {
      const usuarios = res.filter(usuario => usuario.perfil === 'metre' && usuario.fcmToken);

      usuarios.forEach(usuario => {

        const body = {
          registration_ids: [usuario.fcmToken],
          notification: {
            body: 'Un cliente está esperando una mesa',
            title: 'Lista de espera'
          }
        }

        this.sendPushNotification(body).subscribe(
          response => {
            console.log('Exito', response);
          },
          error => {
            console.error('Error', error);
          }
        );
      });
    });
  }

  nuevoClientePushNotification() {
    this.firestore.obtenerColeccion('usuarios-aceptados').subscribe((res) => {
      const usuarios = res.filter(usuario => (usuario.perfil === 'dueño' || usuario.perfil === 'supervisor') && usuario.fcmToken);

      usuarios.forEach(usuario => {

        const body = {
          registration_ids: [usuario.fcmToken],
          notification: {
            body: 'Un nuevo cliente está esperando aprobación',
            title: 'Hay un nuevo cliente'
          }
        }

        this.sendPushNotification(body).subscribe(
          response => {
            console.log('Exito', response);
          },
          error => {
            console.error('Error', error);
          }
        );
      });
    });
  }

  async deleteUsersWithToken(token: string) {
    // borro los campos token de los usuarios con el mismo token recién ingresado
    this.firestore.obtenerColeccion('usuarios-aceptados').subscribe((res) => {

      const usuariosConMismoToken = res.filter(usuario => usuario.fcmToken && usuario.fcmToken === token);

      usuariosConMismoToken.forEach(async usuario => {
        try {
          const userRef = await this.angularFirestore.collection('usuarios-aceptados').doc(usuario!['id']);
          userRef.update({
            fcmToken: deleteField()
          });
        } catch (e: any) {
          alert(e.message);
        }
      });
    });
  }

  private registerPush() {

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      async (token: Token) => {
        // alert('Push registration success, token: ' + token.value);

        // this.deleteUsersWithToken(token.value);

        // guardar el token del dispositivo del usuario
        try {
          const correoUsuario = this.authService.obtenerEmailUsuarioLogueado();
          if (correoUsuario) {
            const usuario = await this.authService.obtenerUsuarioPorEmail2(correoUsuario);
            const userRef = await this.angularFirestore.collection('usuarios-aceptados').doc(usuario!['id']);
            userRef.update({
              fcmToken: token.value
            });
          }
        }
        catch (e: any) {
          alert(e.message);
        }
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        // alert('Push received: ' + JSON.stringify(notification));
        console.log('Push received: ' + JSON.stringify(notification));

        LocalNotifications.schedule({
          notifications: [
            {
              title: notification.title || '',
              body: notification.body || '',
              id: new Date().getMilliseconds(),
              extra: {
                data: notification.data,
              },
            },
          ],
        });
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        if (data.redirectUrl) {
          this.router.navigateByUrl(`/${data.redirectUrl}`);
        }
      }
    );
  }
}
