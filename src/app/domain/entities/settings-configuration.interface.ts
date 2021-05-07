export interface Settings {
  environment: string;
  webSubdomain: string;
  servicesSubdomain: string;
  cookieName: string;
  authCaptcha: string;
  basicAuthToken: string;
}

export const SettingsPrototype : Settings = {
  environment: '',
  webSubdomain: '',
  servicesSubdomain: '',
  cookieName: '',
  authCaptcha: '',
  basicAuthToken: ''
}
