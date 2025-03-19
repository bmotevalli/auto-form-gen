import { Component, signal } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { JsonFormsAngularMaterialModule } from '@jsonforms/angular-material';
import { angularMaterialRenderers } from '@jsonforms/angular-material';
import { JsonFormsAngularService } from '@jsonforms/angular';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    JsonFormsAngularMaterialModule,
    MatCardModule,
    MatButtonModule,
    JsonPipe,
  ],
  providers: [JsonFormsAngularService],
  templateUrl: './app.component.html',
  styles: [
    `
      mat-card {
        max-width: 600px;
        margin: 2rem auto;
        padding: 2rem;
      }
    `,
  ],
})
export class AppComponent {
  schema = signal<any | null>(null);
  uischema = signal<any | null>(null);
  currentData: any = {};
  submittedData = signal<any | null>(null);
  renderers = angularMaterialRenderers;

  constructor(
    private http: HttpClient,
    public jsonformsService: JsonFormsAngularService
  ) {
    this.http.get<any>('http://localhost:8000/schema').subscribe((schema) => {
      this.schema.set(schema);
      const uiSchema = this.generateUISchema(schema);
      this.uischema.set(uiSchema);

      // Initialize service store with empty data
      this.jsonformsService.init({
        core: {
          data: {},
          schema: schema,
          uischema: uiSchema,
          validationMode: 'ValidateAndShow',
        },
        renderers: this.renderers,
      });

      // Subscribe to changes from the service
      this.jsonformsService.$state.subscribe((state) => {
        if (state?.jsonforms?.core?.data) {
          this.currentData = state.jsonforms.core.data;
        }
      });
    });
  }

  generateUISchema(schema: any) {
    return {
      type: 'Group',
      label: 'Auto Form',
      elements: Object.keys(schema.properties).map((key) => ({
        type: 'Control',
        scope: `#/properties/${key}`,
      })),
    };
  }

  //@TODO DATA IS NOT GETTING BACK IN SUBMIT
  submit() {
    console.log('Submitted data:', this.currentData);
    this.submittedData.set(structuredClone(this.currentData));
  }
}
