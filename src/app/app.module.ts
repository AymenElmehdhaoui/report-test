import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule, Injectable,
  Inject,
  InjectionToken,
  ErrorHandler} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {Router, RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {environment} from '../environments/environment.prod';
import * as Rollbar from 'rollbar'; // When using Typescript < 3.6.0.

import * as Sentry from '@sentry/angular';
import {Integrations} from '@sentry/tracing';

Sentry.init({
  dsn: 'https://6b052d08c82d4ac4bf89800b7b1daa56@o920720.ingest.sentry.io/5867398',
  release: environment.release,
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: ['localhost', 'https://yourserver.io/api'],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});



const rollbarConfig = {
  accessToken: '8e28f14cca054fd2bb50c267a9981130',
  captureUncaught: true,
  captureUnhandledRejections: true,
};

export const RollbarService = new InjectionToken<Rollbar>('RollbarService');

@Injectable()
export class ServiceErrorHandler implements ErrorHandler {
  constructor(@Inject(RollbarService) private rollbar: Rollbar) {}

  handleError(err: any): void {
    console.log('handleError');
    this.rollbar.error(err.originalError || err);
    Sentry.captureException(err.originalError || err);
  }
}

export function rollbarFactory(): Rollbar {
  return new Rollbar(rollbarConfig);
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule, RouterModule.forRoot([
    {path: '', component: AppComponent},
  ])],
  providers: [
    { provide: ErrorHandler, useClass: ServiceErrorHandler },

    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {
      },
      deps: [Sentry.TraceService],
      multi: true,
    },

    { provide: RollbarService, useFactory: rollbarFactory }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
