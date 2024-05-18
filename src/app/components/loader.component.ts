import { Component, inject } from '@angular/core';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  template: `
    @if (isLoading()) {
      <div class="loader">
        <h2>Loading...</h2>
        <img
          src="./assets/fish.gif"
          alt="Glitchy 3D scan of a fish as loader"
          height="500px"
          width="500px"
        />
      </div>
    }
  `,
  styles: `
    .loader {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 50px;
      justify-content: flex-start;
      align-items: center;
      height: 90vh;
    }
  `,
})
export default class LoaderComponent {
  private readonly loader = inject(StateService);
  isLoading = this.loader.isLoading;
}
