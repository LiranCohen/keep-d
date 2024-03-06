import { Page, PageStore } from './page';
import { notebook, notebook as notebookProtocol } from '../../protocols/notebook/notebook';
import { Identity } from '../../context/Web5Context';
import { Record } from '@web5/api';

export interface notebookData {
  title: string;
  description?: string;
}

export class Notebook {
  constructor(private _record: Record, private _data: notebookData) {
    if (_record.protocol !== notebook.uri || _record.protocolPath !== 'notebook') {
      throw new Error('invalid record');
    }
  }

  static async get(identity: Identity, id: string): Promise<Notebook> {
    const { record, status } = await identity.web5.dwn.records.read({ message: { filter: { recordId: id }} });
    if (status.code !== 200) {
      throw new Error(`(${status.code}) - ${status.detail}`);
    }

    const data = await record!.data.json();
    return new Notebook(record!, data);
  }

  static async create(identity: Identity, title: string, description?: string): Promise<Notebook> {
    const { status, record } = await identity.web5.dwn.records.create({
      message: {
        schema       : `${notebook.uri}/schemas/notebook`,
        protocol     : notebook.uri,
        dataFormat   : 'application/json',
        protocolPath : 'notebook'
      },
      data: { title, description }
    });

    if (status.code !== 202) {
      throw new Error(`(${status.code}) - ${status.detail}`);
    }

    return new Notebook(record!, { title, description });
  }

  async update(title: string, description?: string): Promise<void> {
    const data: notebookData = { title, description };

    const { status } = await this._record.update({
      data: new TextEncoder().encode(JSON.stringify(data))
    });

    if (status.code !== 202) {
      throw new Error(`(${status.code}) - ${status.detail}`);
    }

    // only set after successful update
    this._data = data;
  }

  async delete(identity: Identity): Promise<void> {
    await identity.web5.dwn.records.delete({ message: { recordId: this.id }});
  }

  get record(): Record {
    return this._record;
  }

  get updated(): string {
    return this.record.dateModified;
  }

  get created(): string {
    return this.record.dateCreated;
  }
  
  get id(): string {
    return this._record.id;
  }

  get title(): string {
    return this._data.title;
  }

  get description(): string | undefined  {
    return this._data.description;
  }
}

export class NotebookStore {
  private _pages: Map<string, Page>;

  private constructor(private identity: Identity, private _notebook: Notebook, ...pages: Page[]) {
    this._pages = new Map(pages.map(page => [page.id, page]));
  }

  static async load(identity:Identity, notebook: Record | Notebook): Promise<NotebookStore> {
    const _notebook = 'record' in notebook ? notebook : new Notebook(notebook, await notebook.data.json());
    const { status, records } = await identity.web5.dwn.records.query({
      message: { filter: {
        protocol     : notebookProtocol.uri,
        protocolPath : 'notebook/page',
        parentId     : notebook.id,
      }}
    });

    if (status.code !== 200) {
      throw new Error(`(${status.code}) - ${status.detail}`);
    }

    const pages = records!.map(record => new Page(record, {}));
    return new NotebookStore(identity, _notebook, ...pages);
  }

  async page(id: string): Promise<PageStore | undefined> {
    const page = this._pages.get(id);
    if (page) {
      return PageStore.load(this.identity, page);
    }
  }

  async addPage(): Promise<PageStore> {
    const page = await Page.create(this.identity, this._notebook);
    this._pages.set(page.id, page);
    return PageStore.load(this.identity, page);
  }

  get pages(): Page[] {
    return [...this._pages.values()];
  }

  get notebook(): Notebook {
    return this._notebook;
  }

  get pagesCount() {
    return this._pages.size;
  }
}