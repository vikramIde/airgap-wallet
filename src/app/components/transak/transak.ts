import { Component } from '@angular/core'
import transakSDK from '@transak/transak-sdk'
import { AlertController, ModalController } from '@ionic/angular'

@Component({
  selector: 'transak',
  templateUrl: 'transak.html',
  styleUrls: ['./transak.scss']
})
export class TransakComponent {
  constructor(public alertCtrl: AlertController, public modalController: ModalController) {
    this.launchTransak()
  }

  public launchTransak(): void {
    let transak = new transakSDK({
      apiKey: 'ea39e4a1-c97d-49fa-a8ca-464be0aad487', // Your API Key
      environment: 'STAGING', // STAGING/PRODUCTION
      defaultCryptoCurrency: 'ETH',
      walletAddress: '', // Your customer wallet address
      themeColor: '000000', // App theme color in hex
      fiatCurrency: '', // INR/GBP
      redirectURL: '',
      hostURL: window.location.origin,
      widgetHeight: '500px',
      widgetWidth: '100%'
    })

    transak.init()
    // To get all the events
    transak.on(transak.ALL_EVENTS, data => {
      console.log(data)
    })
    // This will trigger when the user marks payment is made.
    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, orderData => {
      console.log(orderData)
      transak.close()
    })
  }
}
