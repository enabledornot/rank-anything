import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';

interface List {
  _id: string;
  title: string;
  description: string;
  items: string[];
}

interface ListsResponse {
  lists: List[];
}

interface ModifyListsResponse {
  list: List;
}

@Component({
  imports: [],
  selector: 'app-lists',
  styleUrl: './lists.scss',
  templateUrl: './lists.html',
})

export class Lists implements OnInit {
  private http = inject(HttpClient);

  lists = signal<List[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  editorVisible = signal(false);
  editedList = signal<List | null>(null);

  deleteConfirmVisible = signal(false);
  deleteConfirmListId = signal<string | null>(null);
  deleteConfirmListName = signal<string | null>(null);

  openEditor(listId?: string): void {
    if (listId) {
      this.http.get<ModifyListsResponse>(`/api/lists/${listId}`).subscribe({
        next: ({ list }) => {
          this.editedList.set(list);
          this.editorVisible.set(true);
        },
        error: () => {
          console.log('fetch error');
        }
      })
    }
    else {
      this.http.post<ModifyListsResponse>('/api/lists', {}).subscribe({
        next: ({ list }) => {
          this.editedList.set(list);
          this.editorVisible.set(true);
        },
        error: () => {
          console.log('edit error');
        }
      })
    }
  }

  closeEditor(): void {
    this.editorVisible.set(false);
    this.editedList.set(null);
    this.loadLists();
  }

  updateEditor(field: 'title' | 'description', value: string): void {
    const list = this.editedList();
    if (!list) return;
    this.editedList.set({ ...list, [field]: value });
  }

  saveEditor(): void {
    const list = this.editedList();
    if(list) {
      this.http.patch<ListsResponse>(`/api/lists/${list._id}`,this.editedList()).subscribe({
        next: ( {} ) => {

        },
        error: () => {
          console.log('list save error');
        }
      })
    }
    this.closeEditor();
  }

  deleteList(listId: string, listName: string): void {
    this.deleteConfirmListId.set(listId);
    this.deleteConfirmListName.set(listName);
    this.deleteConfirmVisible.set(true);
  }

  deleteConfirm(listId: string) {
    this.http.delete<ListsResponse>(`/api/lists/${listId}`).subscribe({
      next: ( {} ) => {
        this.closeDeleteConfirm();
        this.loadLists();
      },
      error: () => {
        console.log('list delete error');
        this.closeDeleteConfirm();
      }
    })
  }

  closeDeleteConfirm(): void {
    this.deleteConfirmVisible.set(false);
    this.deleteConfirmListId.set(null);
    this.deleteConfirmListName.set(null);
  }

  loadLists(): void {
    this.loading.set(true);
    this.http.get<ListsResponse>('/api/lists/user').subscribe({
      next: ( {lists} ) => {
        this.lists.set(lists);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load lists');
        this.loading.set(false);
      },
    });
    
  }

  ngOnInit(): void {
    this.loadLists();
  }
}