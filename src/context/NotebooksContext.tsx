import { ReactNode, createContext, useEffect, useMemo, useState } from 'react';
import { Notebook, NotebookStore } from '../stores/notebooks/notebook';
import { Identity } from './Web5Context';
import { NotebooksStore } from '../stores/notebooks/notebooks';
import { Page, PageStore } from '../stores/notebooks/page';
import { Section, SectionStore } from '../stores/notebooks/section';


export interface NotebookApi {
  notebooks: Notebook[];
  create: (title: string, description?: string) => Promise<Notebook>;
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

export interface SectionsApi {
  sections: Section[];
  addSection: (notebook: Notebook, page: Page, dataFormat: string, data: unknown) => Promise<Section>;
  // removeSection: (page: Page, id: string) => Promise<void>;
  selectSection: (notebook: Notebook, page: Page, id: string) => Promise<Section>;
  currentSection: Section | undefined;
}

interface NotebooksApi extends NotebookApi, PagesApi, SectionsApi {}

export const NotebooksContext = createContext<{ api?: NotebooksApi }>({});

export const NotebooksProvider = ({ children, identity }: { children: ReactNode, identity: Identity }) => {
  const [ notebooks, setNotebooks ] = useState<Notebook[]>([]);
  const [ pages, setPages ] = useState<Page[]>([]);
  const [ store, setStore ] = useState<NotebooksStore>();
  const [ notebookStore, setNotebook ] = useState<NotebookStore>();
  const [ pageStore, setPage ] = useState<PageStore>();
  const [ sections, setSections ] = useState<Section[]>([]);
  const [ sectionStore, setSection ] = useState<SectionStore>();

  useEffect(() => {
    const loadStore = async (identity: Identity) => {
      const store = await NotebooksStore.load(identity);
      setStore(store);
      setNotebooks(store.notebooks);
    }

    loadStore(identity);
  }, [ identity, store ]);

  const api = useMemo(() => {
    if (identity && store && notebooks)  {
      const create = async (title: string, description?: string): Promise<Notebook> => {
        const notebook = await store!.newNotebook(title, description)
        setNotebooks([...notebooks, notebook]);
        return notebook;
      }

      const remove = async (id: string) => {
        await store!.deleteNotebook(id)
        if (notebookStore?.notebook.id === id) {
          setNotebook(undefined);
          setPages([]);
          setPage(undefined);
          setSections([]);
          setSection(undefined);
        }
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
          setSections(firstPageStore.sections);
          if (firstPageStore.sections.length > 0) {
            const sectionStore = await SectionStore.load(identity, firstPageStore.sections.at(0)!);
            setSection(sectionStore);
          } else {
            setSection(undefined);
          }
        } else {
          setPage(undefined);
          setSections([]);
          setSection(undefined);
        }
      }

      const addPage = async (notebook: Notebook) => {
        if (notebookStore?.notebook.id !== notebook.id) {
          await selectNotebook(notebook.id);
        }
        const pageStore = await notebookStore!.addPage();
        setPage(pageStore);
        setPages([...pages, pageStore.page]);
        return pageStore.page;
      }

      const selectPage = async (notebook: Notebook, id: string) => {
        if (notebookStore?.notebook.id !== notebook.id) {
          await selectNotebook(notebook.id);
        }

        const pageStore = await notebookStore!.page(id);
        if (pageStore) {
          setPage(pageStore);
          setSections(pageStore.sections);
          if (pageStore.sections.length > 0) {
            const sectionStore = await SectionStore.load(identity, pageStore.sections.at(0)!);
            setSection(sectionStore); 
          } else {
            setSection(undefined);
          }

          return pageStore.page;
        }
        setPage(undefined);
        throw new Error(`page ${id} not found in notebook: ${notebook.id}`);
      }

      const selectSection = async (notebook:Notebook, page:Page, id:string) => {
        if(pageStore?.page.id !== page.id) {
          await selectPage(notebook, page.id);
        }
        const sectionStore = await pageStore!.section(id);
        if (sectionStore) {
          setSection(sectionStore);
          return sectionStore.section;
        }
        setSection(undefined);
        throw new Error(`section ${id} not found in page ${page.id} of notebook: ${notebook.id}`);
      }

      const addSection = async (notebook: Notebook, page: Page, dataFormat:string, data: unknown) => {
        if (pageStore?.page.id !== page.id) {
          await selectPage(notebook, page.id);
        }

        const section = await pageStore!.addSection(dataFormat, data);
        setSections([...sections, section]);
        return section;
      }

      return {
        notebooks,
        pages,
        sections,
        currentNotebook: notebookStore?.notebook,
        currentPage: pageStore?.page,
        currentSection: sectionStore?.section,
        create,
        remove,
        selectNotebook,
        addPage,
        selectPage,
        selectSection,
        addSection,
      }
    }
  }, [ store, notebooks, identity, notebookStore, pages, pageStore, sections, sectionStore ]);

  return (
    <NotebooksContext.Provider value={{ api }}>
      {children}
    </NotebooksContext.Provider>
  );
};