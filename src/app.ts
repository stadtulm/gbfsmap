import { Map } from "./map";

declare var TITLE;

if (TITLE) {
	document.title = TITLE;
}

new Map()