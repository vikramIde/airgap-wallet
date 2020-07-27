import { Injectable } from '@angular/core'
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx'
import { SettingsKey, StorageProvider } from '../storage/storage'
import { generateGUID } from '../../utils/utils'

//Need to make these Dyamic based on buil command
let apiKey: string = 'ea39e4a1-c97d-49fa-a8ca-464be0aad487'
let environment: string = 'STAGING'
let transakBgColor: string = 'f36a3d'

export enum TransactionStatus {
  ORDER_CREATED = 'ORDER_CREATED',
  WAITING = 'ORDER_FAILED',
  CONFORMING = 'ORDER_CREATED',
  EXCHANGING = 'EXCHANGING',
  SENDING = 'SENDING',
  FINISHED = 'FINISHED',
  FAILED = 'FAILED'
}

export interface TransakOptions {
  defaultCryptoCurrency: string
  walletAddress: string
  fiatCurrency?: string
  fiatAmount?: string
  partnerOrderId: string
  partnerCustomerId: string
  status: string
}

@Injectable({
  providedIn: 'root'
})
export class TransakProvider implements TransakOptions {
  public apiKey: string
  public environment: string
  public defaultCryptoCurrency: string
  public walletAddress: string
  public themeColor: string
  public fiatCurrency: string
  public fiatAmount: string
  public hostURL: string
  public partnerOrderId: string
  public partnerCustomerId: string
  public status: string

  private transakorders: TransakOptions[] = []

  constructor(private readonly storageProvider: StorageProvider, private iab: InAppBrowser) {
    this.apiKey = apiKey
    this.environment = environment
    this.hostURL = window.location.origin
    this.themeColor = transakBgColor

    //Need to get this from user selection
    //When the feature is ready
    this.fiatCurrency = 'INR'
  }

  public async createOrder(toCurrency: string, address: string) {
    let userId = await this.storageProvider.get(SettingsKey.USER_ID)
    this.partnerOrderId = 'tsk_' + generateGUID()
    this.partnerCustomerId = userId
    this.defaultCryptoCurrency = toCurrency
    this.walletAddress = address
    this.status = 'ORDER_CREATED'
    //I need to check if this works or not
    let { partnerOrderId, partnerCustomerId, defaultCryptoCurrency, walletAddress, status } = this

    this.transakorders.push({
      partnerOrderId,
      partnerCustomerId,
      defaultCryptoCurrency,
      walletAddress,
      status
    })

    await this.persist()

    let url = await this.makeUrl()
    this.iab.create(url)
  }

  private async makeUrl() {
    let baseUrl = 'http://staging-global.transak.com/?'

    if (this.apiKey) baseUrl = baseUrl + 'apiKey=' + this.apiKey + '&'

    if (this.hostURL) baseUrl = baseUrl + 'hostURL=' + this.hostURL + '&'

    if (this.themeColor) baseUrl = baseUrl + 'themeColor=' + this.themeColor + '&'

    if (this.defaultCryptoCurrency) baseUrl = baseUrl + 'defaultCryptoCurrency=' + this.defaultCryptoCurrency + '&'

    if (this.fiatCurrency) baseUrl = baseUrl + 'fiatCurrency=' + this.fiatCurrency + '&'

    if (this.fiatAmount) baseUrl = baseUrl + 'fiatAmount=' + this.fiatAmount + '&'

    if (this.walletAddress) baseUrl = baseUrl + 'walletAddress=' + this.walletAddress + '&'

    if (this.partnerOrderId) baseUrl = baseUrl + 'partnerOrderId=' + this.partnerOrderId + '&'

    if (this.partnerCustomerId) baseUrl = baseUrl + 'partnerCustomerId=' + this.partnerCustomerId + '&'

    return baseUrl
  }

  private async persist(): Promise<void> {
    return this.storageProvider.set(SettingsKey.TRANSAK_ORDER, this.transakorders)
  }
}
