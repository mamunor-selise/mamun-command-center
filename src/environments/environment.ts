declare const process: any;

export const environment = {
  production: false,
  openRouterApiKey: typeof process !== 'undefined' && process?.env ? (process.env['OPEN_ROUTER_API_KEY'] || '') : ''
};
