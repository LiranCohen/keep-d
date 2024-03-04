import { Section } from './section';
import { Record } from '@web5/api';
import { notebook } from '../../protocols/notebook/notebook';
import { Identity } from '../../context/Web5Context';
import { Notebook } from './notebook';

export type pageData = {}

export class Page {
  constructor(private _record: Record, private _data: pageData) {
    if (_record.protocol !== notebook.uri || _record.protocolPath !== 'notebook/page') {
      throw new Error('invalid record');
    }
  }

  static async create(identity: Identity, parent: Notebook): Promise<Page> {

    const { status, record } = await identity.web5.dwn.records.create({
      message: {
        parentId     : parent.id,
        contextId    : parent.record.contextId,
        schema       : `${notebook.uri}/schemas/page`,
        protocol     : notebook.uri,
        dataFormat   : 'application/json',
        protocolPath : 'notebook/page'
      },
      data: { page: {} }
    });

    if (status.code !== 202) {
      throw new Error(`(${status.code}) - ${status.detail}`);
    }

    return new Page(record!, { page: {} });
  }

  get notebookId(): string {
    return this._record.parentId;
  }

  get record(): Record {
    return this._record;
  }

  get id (): string {
    return this._record.id;
  }
}

export class PageStore {
  _sections: Section[] = [];

  private constructor(private identity: Identity, private _page: Page, ...sections: Section[]) {
    this._sections = sections;
  }

  static async load(identity:Identity, page: Record | Page): Promise<PageStore> {
    const _page = 'record' in page ? page : new Page(page, {});
    const { status, records } = await identity.web5.dwn.records.query({
      message: { filter: {
        protocol     : notebook.uri,
        protocolPath : 'notebook/page/section',
        parentId     : _page.id,
      }}
    });

    if (status.code !== 200) {
      throw new Error(`(${status.code}) - ${status.detail}`);
    }

    const sections = records!.map(record => new Section(record, {}));
    return new PageStore(identity, _page, ...sections);
  }

  async addSection() {
    const section = await Section.create(this.identity, this._page);
    this._sections.push(section);
  }

  get page() {
    return this._page;
  }

  get sectionsCount() {
    return this._sections.length;
  }
}