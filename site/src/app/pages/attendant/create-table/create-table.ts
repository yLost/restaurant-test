import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { createDemand } from "src/app/services/demands/DemandsService";

@Component({
    selector: "app-attendant-create-table",
    templateUrl: "./create-table.html",
    styleUrls: ["./create-table.scss"]
})
export default class App implements OnInit {

    inProcess: Boolean = false;

    @Output()
    close = new EventEmitter<any>();

    @Output()
    complete = new EventEmitter<any>();

    ngOnInit(): void {
    }

    async createDemand(): Promise<void> {
        this.inProcess = true;

        const tableInput = <HTMLInputElement>document.querySelector('input[name="table"]');
        if (tableInput) {
            if (tableInput['value'] != null) {
                const table = Number.parseInt(tableInput['value']);
                if (Number.isInteger(table)) {
                    const demandId = await createDemand(table);
                    if (demandId != null) {
                        this.inProcess = false;
                        return this.complete.emit(demandId);
                    }
                }
            }
        }

        this.inProcess = false;
    }
}