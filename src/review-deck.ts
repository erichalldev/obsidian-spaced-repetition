import { App, FuzzySuggestModal, TFile } from "obsidian";

import { SchedNote } from "src/main";
import { t } from "src/lang/helpers";

export class ReviewDeck {
    public deckName: string;
    public newNotes: TFile[] = [];
    public scheduledNotes: SchedNote[] = [];
    public activeFolders: Set<string>;
    public dueNotesCount = 0;

    constructor(name: string, activeFolders: Set<string> | undefined = undefined) {
        this.deckName = name;
        if (activeFolders !== undefined) {
            this.activeFolders = activeFolders;
        }
        else {
            this.activeFolders = new Set([this.deckName, t("TODAY")]);
        }

    }

    public sortNotes(pageranks: Record<string, number>): void {
        // sort new notes by importance
        this.newNotes = this.newNotes.sort(
            (a: TFile, b: TFile) => a.stat.ctime - b.stat.ctime
        );

        // sort scheduled notes by date & within those days, sort them by importance
        this.scheduledNotes = this.scheduledNotes.sort((a: SchedNote, b: SchedNote) => {
            return  a.dueUnix - b.dueUnix;
        });
    }
}

export class ReviewDeckSelectionModal extends FuzzySuggestModal<string> {
    public deckKeys: string[] = [];
    public submitCallback: (deckKey: string) => void;

    constructor(app: App, deckKeys: string[]) {
        super(app);
        this.deckKeys = deckKeys;
    }

    getItems(): string[] {
        return this.deckKeys;
    }

    getItemText(item: string): string {
        return item;
    }

    onChooseItem(deckKey: string, _: MouseEvent | KeyboardEvent): void {
        this.close();
        this.submitCallback(deckKey);
    }
}
