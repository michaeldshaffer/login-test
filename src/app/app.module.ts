import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule }    from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SelfregisterComponent } from './selfregister/selfregister.component';
import { requestInterceptor } from './interceptors/request-interceptor'
import { responseInterceptor } from './interceptors/response-interceptor'
import { fakeBackendProvider } from './backend/fake-backend';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    SelfregisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    requestInterceptor,
    responseInterceptor,
    fakeBackendProvider// provider used to create fake backend, remove when in "production"
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
