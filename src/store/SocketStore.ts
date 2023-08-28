import {makeAutoObservable} from "mobx";
import {Player} from "../models/Player";
import {Colors} from "../models/Colors";
import {io, Socket} from "socket.io-client";

class Store {

    public socket : Socket | undefined;
    private events : {eventName : string, callback : any}[] = [];

    constructor() {
        makeAutoObservable(this)
    }

    createSocket() {
        this.socket = io(process.env.BACKEND_URL as string);

        for (const event of this.events) {
            this.socket.on(event.eventName, event.callback)
        }
    }

    addListener(eventName : string, callback : any) {
        if (this.socket === undefined && !this.events.find(event => event.eventName === eventName)){
            this.events.push({eventName, callback})
        }
        else if (this.socket) {
            this.socket.on(eventName, callback)
        }
    }
}

export default new Store()