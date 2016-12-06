// import { Injectable } from "@angular/core";
// import { Observable } from "rxjs";
// import * as io from "socket.io-client";

// declare var CONFIG: any;

// @Injectable()
// export class SocketService {
//     private host: string = CONFIG.API_URL;
//     private method: any;
//     socket: SocketIOClient.Socket;

//     constructor() { }

//     get(resource: string, method?: any): Observable<any> {
//         this.method = method;
//         this.socket = io.connect(this.host);
//         this.socket.on("connection", (res) => this.connect(res));
//         this.socket.on("disconnect", () => this.disconnect());
//         this.socket.on("users-result", data=>console.log('users response is: ', data))
//         this.socket.on("error", (error: string) => {
//             console.log(`ERROR: "${error}" (${this.host})`);
//         })
//         this.socket.emit(`${resource}::`+ method, (err, message) => console.log('found: ', message));
        
//         // Return observable which follows "create" and "remove" signals from socket stream
//         return Observable.create((observer: any) => {
//             this.socket.on("create", (item: any) => observer.next({ action: "create", item: item }));
//             this.socket.on("remove", (item: any) => observer.next({ action: "remove", item: item }));
//             return () => this.socket.close();
//         });
//     }
    
//     // Create signal
//     create(resource: string, data: any) {
//         this.socket.emit(resource, data);
//     }

//     remove(resource: string, data: any) {
//         this.socket.emit(`${resource}::remove`, null, { resource: data });
//     }

//     // Handle connection opening
//     private connect(data: any) {
//         // this.socket.on("connect", (res) => console.log(`Connected to "${this.host}"` + ' res: ' + res));
//         // this.socket.on('connection', data => console.log('connection data: ', data));
//         // this.socket.emit('admin connection', { data: 'testing' });
//         console.log(`connected to: ${this.host}` + ' and server data: ', data)
//     }

//     // Handle connection closing
//     private disconnect() {
//         console.log(`Disconnected from "${this.host}"`);
//     }
// }