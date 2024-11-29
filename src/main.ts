
import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component'; // Update the path as needed

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()] // Use provideHttpClient() for standalone components
});
