import { lociDetails } from "./loci-details";
import { debounceTime } from "rxjs/operators";
export var CustomEvents;
(function (CustomEvents) {
    function create(eventTypeArr) {
        const eventObj = {};
        for (let ei = 0, el = eventTypeArr.length; ei < el; ei++) {
            const eventType = eventTypeArr[ei];
            let event;
            if (typeof MouseEvent == "function") {
                // current standard
                event = new MouseEvent(eventType, {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                });
            }
            else if (typeof document.createEvent == "function") {
                // older standard
                event = document.createEvent("MouseEvents");
                event.initEvent(eventType, true /* bubbles */, true /* cancelable */);
            }
            eventObj[eventType] = event;
        }
        return eventObj;
    }
    function dispatchCustomEvent(event, eventData, targetElement) {
        if (typeof eventData !== "undefined") {
            eventData["residueNumber"] = eventData.seq_id;
            event["eventData"] = eventData;
            event.eventData.residueNumber = eventData.seq_id;
            targetElement.dispatchEvent(event);
        }
    }
    function add(plugin, targetElement) {
        const pdbevents = create([
            "PDB.molstar.click",
            "PDB.molstar.mouseover",
            "PDB.molstar.mouseout",
        ]);
        plugin.behaviors.interaction.click.subscribe((e) => {
            if (e.button === 1 &&
                e.current &&
                e.current.loci.kind !== "empty-loci") {
                const evData = lociDetails(e.current.loci);
                if (evData)
                    dispatchCustomEvent(pdbevents["PDB.molstar.click"], evData, targetElement);
            }
        });
        plugin.behaviors.interaction.hover
            .pipe(debounceTime(100))
            .subscribe((e) => {
            if (e.current &&
                e.current.loci &&
                e.current.loci.kind !== "empty-loci") {
                const evData = lociDetails(e.current.loci);
                if (evData)
                    dispatchCustomEvent(pdbevents["PDB.molstar.mouseover"], evData, targetElement);
            }
            if (e.current &&
                e.current.loci &&
                e.current.loci.kind === "empty-loci") {
                dispatchCustomEvent(pdbevents["PDB.molstar.mouseout"], {}, targetElement);
            }
        });
    }
    CustomEvents.add = add;
})(CustomEvents || (CustomEvents = {}));
