import { Component } from '@angular/core';
// import * as Sentry from "@sentry/browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  color = 'black';
  textValue = '';
  currentUser = '';

  changeColor(): void {
    const that = this;
    this.color = 'red';
    setTimeout(() => {
      that.color = 'black';
    }, 1500);
  }

  handleSubmit(): void {
    this.currentUser = this.textValue;
    // Sentry.configureScope(scope => {
    //   scope.setUser({email: this.currentUser});
    // });
  }

  malformed(): void {
    decodeURIComponent('%');
  }

  // ERRORS
  notAFunctionError(): void {
    // tslint:disable-next-line:only-arrow-functions
    const someArray = [{ func: () => {}}];
    someArray[1].func();
  }

  uriError(): void {
    decodeURIComponent('%');
  }

  syntaxError(): void {
    // tslint:disable-next-line:no-eval
    eval('foo bar');
  }

  rangeError(): void {
    throw new RangeError('Parameter must be between 1 and 100');
  }
}

