import { userService } from './users';
import { clientService } from './clients';
import { tenantService } from './tenants';
import { roleGroupService } from './roleGroups';
import { roleService } from './roles';
import { apiService } from './apis';
import { viewService } from './views';
import { templateService } from './templates';
import { hookService } from './hooks';
import { federatedService } from './connections';
import { versionService } from './version';
import {createHttpClientInstance} from "./utils/http";
import {generateTenantUrl} from "./utils/generate_tenant_url";
import request from './utils/better-fetch/index';

export default class PlusAuthClient {
  constructor ({http, clientID, clientSecret, tenantID, scope, apiVersion = '1'}) {
    this.$options = {
      tenantID,
      clientID,
      clientSecret,
      apiVersion,
      scope
    }
    this.$http = http || createHttpClientInstance(this.$options);
    this.users = userService(this.$http);
    this.clients = clientService(this.$http);
    this.tenants = tenantService(this.$http);
    this.roleGroups = roleGroupService(this.$http);
    this.roles = roleService(this.$http);
    this.apis = apiService(this.$http);
    this.views = viewService(this.$http);
    this.hooks = hookService(this.$http);
    this.templates = templateService(this.$http);
    this.federated = federatedService(this.$http);
    this.version = versionService(this.$http);
  }

  async init(){
    await this.refreshToken()
  }

  async refreshToken(){
    try{
      const { access_token, expires_in } = await this.getAccessToken()
      this.$options.accessToken = access_token
      setTimeout(this.refreshToken.bind(this), expires_in * 10)
    }catch (e) {
      console.error(e)
    }
  }

  async getAccessToken(){
    const { access_token, expires_in } = await request(  {
      requestType: 'form',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
        .post(generateTenantUrl(this.$options.tenantID) + '/oauth/token', {
              client_id: this.$options.clientID,
              client_secret: this.$options.clientSecret,
              grant_type: 'client_credentials',
              audience: generateTenantUrl(this.$options.tenantID) + '/api/v'+this.$options.apiVersion+'/',
              scope: this.$options.scope || this.$options.tenantID
            }
        )
    return { access_token, expires_in }
  }
}
