import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RepoArticlesService } from '../../services/articles.repo';
import { User } from '../../entities/user';
import { Subscription } from 'rxjs';
import { StateService, State } from '../../services/state.service';

@Component({
  selector: 'app-update-article',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="article-create-container">
      <div class="article-create-header__container">
        <h2 class="article-create-header">Edit Article.</h2>
      </div>

      <form
        [formGroup]="form"
        (ngSubmit)="submit()"
        class="article-create-form"
      >
        <label for="title" class="article-create-label">Title</label>
        <input
          type="text"
          id="title"
          formControlName="title"
          class="article-create-input"
        />
        <label for="subtitle" class="article-create-label">Subtitle</label>
        <input
          type="text"
          id="subtitle"
          formControlName="subtitle"
          class="article-create-input"
        />
        <label for="content" class="article-create-label">Content</label>
        <textarea
          id="content"
          formControlName="content"
          class="article-create-input"
        ></textarea>
        <label for="avatar" class="article-create-label">
          <span>Update Image</span>
          <input
            type="file"
            id="avatar"
            class="article-create-avatar"
            #avatar
            (change)="onFileChange()"
          />
        </label>
        <button
          type="submit"
          [disabled]="form.invalid"
          class="article-create-button"
        >
          Update
        </button>
      </form>
    </div>
  `,
  styles: `
    .article-create-container {
      display: flex;
      flex-direction: column;
      align-items: center;

      padding: 25px 46px;
      gap: 28px;
      height: 85vh;
    }
    .article-create-form {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      width: 80vw;
    }

    .article-create-header__container {
      display: flex;
      padding: 20px;
      width: 100vw;
      justify-content: start;
      align-content: flex-start;
    }

    .article-create-header {
      font-size: 24px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px;
      color: #1c1a1c;
      margin-left: 10px;
    }

    .article-create-label {
      align-self: start;
      font-size: 16px;
      font-style: normal;
      font-weight: 200;
      line-height: 16px;
      color: #9d95a0;
    }
    .article-create-input {
      padding: 8px 16px;
      align-self: start;
      border-bottom: 1px solid #9d95a0;
      width: 80vw;
      border-top: none;
      border-inline: none;
      height: 34px;
      font-size: 16px;
    }
    .article-create-button {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 4px 16px;
      gap: 8px;

      width: 128px;
      height: 39px;
      background: #1c1a1c;
      border-radius: 6px;
      font-style: normal;
      font-weight: 400;
      font-size: 20px;
      line-height: 40px;
      color: #ffffff;
      margin-top: 40px;
    }
    .article-create-button:disabled {
      background: #9d95a0;
      border: none;
    }
    .article-create-avatar {
      display: none;
    }
  `,
})
export default class UpdateArticleComponent implements OnInit {
  currentUser!: User;
  subscription!: Subscription;
  fb = inject(FormBuilder);
  repo = inject(RepoArticlesService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  stateService = inject(StateService);
  state!: State;
  form: FormGroup;
  articleId!: string;
  @ViewChild('avatar') avatar!: ElementRef;

  constructor() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      subtitle: [''],
      content: ['', Validators.required],
      avatar: [null],
    });
  }

  ngOnInit() {
    this.articleId = this.route.snapshot.params['id'];
    this.stateService.getState().subscribe((state) => {
      this.currentUser = state.currentUser as User;
      this.state = state;
      const article = state.articles.find((a) => a.id === this.articleId);
      if (article) {
        this.form.patchValue({
          title: article.title,
          subtitle: article.subtitle,
          content: article.content,
          avatar: article.avatar, // Note: this might need adjusting for handling file
        });
      }
    });
  }

  async onFileChange() {
    const htmlElement: HTMLInputElement = this.avatar.nativeElement;
    const file = htmlElement.files![0];
    await this.form.patchValue({ avatar: file });
  }

  submit() {
    const fd = new FormData();
    fd.append('title', this.form.value.title);
    fd.append('subtitle', this.form.value.subtitle);
    fd.append('content', this.form.value.content);

    if (this.form.value.avatar) {
      fd.append('avatar', this.form.value.avatar);
    }

    fd.append('authorId', this.currentUser.id);
    fd.append('maker', this.currentUser.name);

    this.repo.update(this.articleId, fd).subscribe(() => {
      this.router.navigate(['/articles']);
    });
  }
}
