import { Notebook, NotebookStore } from './notebook';
import { Identity } from '../../context/Web5Context';
import { notebook } from '../../protocols/notebook/notebook';

export class NotebooksStore {
  _notebooks: NotebookStore[]

  private constructor(private identity: Identity, ...notebooks: NotebookStore[]) {
    this._notebooks = notebooks;
  }

  private static async loadProtocol(identity: Identity):Promise<void> {
    const { status, protocols } = await identity.web5.dwn.protocols.query({
      message: { filter: { protocol: notebook.uri }}
    });

    if (status.code !== 200) {
      throw new Error(`(${status.code}) - ${status.detail}`);
    }

    if (protocols.length !== 1) {
      // install protocol, maybe prompt first?
      const { status } = await identity.web5.dwn.protocols.configure({
        message: { definition: notebook.definition }
      });
      if (status.code !== 202) {
        throw new Error(`(${status.code}) - ${status.detail}`);
      }
    }
  }

  static async load(identity: Identity): Promise<NotebooksStore> {
    await this.loadProtocol(identity);

    const notebooksRecords = await identity.web5.dwn.records.query({
      message: { filter: {
        protocol: notebook.uri,
        protocolPath: 'notebook'
      }}
    });

    if (!notebooksRecords.records) {
      return new NotebooksStore(identity);
    }

    const notebooks = await Promise.all(notebooksRecords.records.map(record => NotebookStore.load(identity, record)));
    return new NotebooksStore(identity, ...notebooks);
  }

  async getNotebook(id: string): Promise<NotebookStore> {
    const store = this._notebooks.find(store => store.notebook.id === id);
    if (store === undefined) {
      const notebook = await Notebook.get(this.identity, id);
      const store = await NotebookStore.load(this.identity, notebook);
      this._notebooks = [
        store,
        ...this._notebooks,
      ];
      return store; 
    }

    return store;
  }

  async newNotebook(title: string): Promise<Notebook> {
    const notebook = await Notebook.create(this.identity, title);
    const notebookStore = await NotebookStore.load(this.identity, notebook);
    this._notebooks = [
      notebookStore,
      ...this._notebooks,
    ];
    return notebook;
  }

  async deleteNotebook(id: string): Promise<void> {
    const store = await this.getNotebook(id);
    await store.notebook.delete(this.identity);
    this._notebooks = this._notebooks.filter(store => store.notebook.id !== id);
  }
  
  get notebooks(): Notebook[] {
    return this._notebooks.map(store => store.notebook);
  }

  get notebookCount() {
    return this._notebooks.length;
  }
}