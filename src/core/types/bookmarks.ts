// Bookmark stores a saved ayah entry with optional folder assignment.
export interface Bookmark {
  id: string;
  surah: number;
  ayah: number;
  surahName: string;
  text: string;
  folderId?: string;
  createdAt: number;
}

// Folder groups bookmarks under a user-defined name.
export interface Folder {
  id: string;
  name: string;
  createdAt: number;
}

// BookmarkDraft represents the bookmark payload before persistence fields are added.
export type BookmarkDraft = Omit<Bookmark, 'id' | 'createdAt'>;
