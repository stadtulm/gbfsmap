import { Map } from "./map";

declare var TITLE;

//TODO check does not work
if (TITLE) {
	document.title = TITLE;
}

new Map()