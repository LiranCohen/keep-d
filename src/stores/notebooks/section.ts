import { Record } from "@web5/api";
import { Identity } from "../../context/Web5Context";
import { notebook } from "../../protocols/notebook/notebook";
import { Page } from "./page";

export class Section {
  constructor(private _record: Record, private _data: unknown) {}

  static async create(identity: Identity, parent: Page, dataFormat: string, data: unknown): Promise<Section> {

    const { status, record } = await identity.web5.dwn.records.create({
      message: {
        parentContextId : parent.record.contextId,
        schema          : `${notebook.uri}/schemas/section`,
        protocol        : notebook.uri,
        dataFormat      : dataFormat,
        protocolPath    : 'notebook/page/section'
      },
      data: { data }, 
    });

    if (status.code !== 202) {
      throw new Error(`(${status.code}) - ${status.detail}`);
    }

    return new Section(record!, data);
  }

  get record() {
    return this._record;
  }

  get updated(): string {
    return this.record.dateModified;
  }

  get created(): string {
    return this.record.dateCreated;
  }

  get data(): unknown {
    return (this._data as { data: unknown }).data;
  }

  get dataFormat(): string {
    return this._record.dataFormat;
  }

  get notebookId(): string {
    return this._record.parentId;
  }

  get id (): string {
    return this._record.id;
  }
}

export class SectionStore {
  private constructor(private identity: Identity, private _section: Section) {}
  static async load(identity:Identity, section: Record | Section): Promise<SectionStore> {
    const _section = 'record' in section ? section : new Section(section,  await section.data.json());
    return new SectionStore(identity, _section);
  }

  get section() {
    return this._section;
  }
}