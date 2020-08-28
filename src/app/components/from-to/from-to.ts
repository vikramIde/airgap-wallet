import { Component, Input } from '@angular/core'
import { IAirGapTransaction } from '@bobo-wallet/coin-lib'
import { NetworkType } from '@bobo-wallet/coin-lib/dist/utils/ProtocolNetwork'

@Component({
  selector: 'from-to',
  templateUrl: 'from-to.html',
  styleUrls: ['./from-to.scss']
})
export class FromToComponent {
  @Input()
  public transaction: IAirGapTransaction

  public displayRawData: boolean = false

  public readonly networkType: typeof NetworkType = NetworkType
}
