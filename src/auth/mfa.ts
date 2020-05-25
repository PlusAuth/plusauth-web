import { HttpService } from '../http';

/**
 * @public
 */
export class MFAService extends HttpService {
  constructor( baseURL: string ) {
    super( baseURL );
  }

  public async validateCode( code: string, method: string ): Promise<any> {
    return this.http.post( `/signin/challenge/${ method }`, {
      code
    } );
  }
}
