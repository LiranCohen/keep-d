import { ReactNode, createContext, useEffect, useMemo, useState } from 'react';
import { Notebook, NotebookStore } from '../stores/notebooks/notebook';
import { Identity } from './Web5Context';
import { NotebooksStore } from '../stores/notebooks/notebooks';
import { Page, PageStore } from '../stores/notebooks/page';


export interface NotebookApi {
  notebooks: Notebook[];
  create: (title: string) => Promise<Notebook>;
  remove: (id: string) => Promise<void>;
  selectNotebook: (id: string) => Promise<void>;
  currentNotebook: Notebook | undefined;
}

export interface PagesApi {
  pages: Page[];
  addPage: (notebook: Notebook) => Promise<Page>;
  selectPage: (notebook: Notebook, id: string) => Promise<Page>;
  currentPage: Page | undefined;
}

interface NotebooksApi extends NotebookApi, PagesApi {}

export const NotebooksContext = createContext<{ api?: NotebooksApi }>({});

export const NotebooksProvider = ({ children, identity }: { children: ReactNode, identity?: Identity }) => {
  const [ notebooks, setNotebooks ] = useState<Notebook[]>([]);
  const [ pages, setPages ] = useState<Page[]>([]);
  const [ store, setStore ] = useState<NotebooksStore>();
  const [ notebookStore, setNotebook ] = useState<NotebookStore>();
  const [ pageStore, setPage ] = useState<PageStore>();

  useEffect(() => {
    const loadStore = async (identity: Identity) => {
      const store = await NotebooksStore.load(identity);
      setStore(store);
      setNotebooks(store.notebooks);
    }

    if(!store && identity) {
      loadStore(identity);
    }
  }, [ identity, store]);

  const api = useMemo(() => {
    if (identity && store && notebooks)  {
      const create = async (title: string): Promise<Notebook> => {
        const notebook = await store!.newNotebook(title)
        setNotebooks([...notebooks, notebook]);
        return notebook;
      }

      const remove = async (id: string) => {
        await store!.deleteNotebook(id)
        setNotebooks(notebooks.filter(notebook => notebook.id !== id));
      }

      const selectNotebook = async (id: string) => {
        const notebook = notebooks.find(book => book.id ===id);
        let notebookStore: NotebookStore
        if (notebook) {
          notebookStore = await NotebookStore.load(identity, notebook);
        } else {
          notebookStore = await store!.getNotebook(id);
          setNotebooks([...notebooks, notebookStore.notebook]);
        }
        setNotebook(notebookStore);
        setPages(notebookStore.pages);

        // auto select first page, TODO remember place per notebook
        const firstPage = notebookStore.pages.at(0);
        if (firstPage) {
          const firstPageStore = await PageStore.load(identity, firstPage);
          setPage(firstPageStore);
        } else {
          setPage(undefined);
        }
      }

      const addPage = async (notebook: Notebook) => {
        if (notebookStore?.notebook.id !== notebook.id) {
          await selectNotebook(notebook.id);
        }
        const pageStore = await notebookStore!.addPage();
        setPage(pageStore);
        return pageStore.page;
      }

      const selectPage = async (notebook: Notebook, id: string) => {
        if (notebookStore?.notebook.id !== notebook.id) {
          await selectNotebook(notebook.id);
        }
        const pageStore = await notebookStore!.page(id);
        if (pageStore) {
          setPage(pageStore);
          return pageStore!.page;
        }
        setPage(undefined);
        throw new Error(`page ${id} not found in notebook: ${notebook.id}`);
      }

      return {
        notebooks,
        pages,
        currentNotebook: notebookStore?.notebook,
        currentPage: pageStore?.page,
        create,
        remove,
        selectNotebook,
        addPage,
        selectPage,
      }
    }
  }, [ store, notebooks, identity, notebookStore, pages, pageStore ]);

  return (
    <NotebooksContext.Provider value={{ api }}>
      {children}
    </NotebooksContext.Provider>
  );
};