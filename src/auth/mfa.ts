import {HttpService} from "../http";

export class MFAService extends HttpService {
    constructor(baseURL: string) {
        super(baseURL);
    }

    public async validateCode(code: string, method: string) {
        return this.http.post('/signin/challenge/' + method, {
            code
        });
    }

}
