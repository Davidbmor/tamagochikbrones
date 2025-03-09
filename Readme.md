# Descripcion del código

El código se explica a partir de cuando un jugador se envia al cliente.

```javascript
// En Gameservice.ts
public addPlayer(player: Player): boolean {
        const genRanHex = (size: Number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

        const room: Room = RoomService.getInstance().addPlayer(player);

        ServerService.getInstance().sendMessage(room.name, Messages.NEW_PLAYER,
            {
                id: "player" + genRanHex(20),
                x: player.x,
                y: player.y,
                state: player.state,
                direction: player.direction,
                visibility: player.visibility
            }
         );
```
En este momento se esta enviando la informacion del jugador al cliente , por otro lado desde el `BoardBuilder.ts` se esta enviando la informacion de los elementos iniciales del tablero además del tablero:

```javascript
// En BoardBuilder.ts
  constructor() {
        this.board = {
            bush:5,
            size: 10,
            elements: []
        }
        const map : Array<number[]> = [
            [1,0,0,0,0,0,0,0,0,1],
            [0,0,0,0,0,0,5,0,0,0],
            [0,5,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,5,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,5,0],
            [0,0,5,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,5,0,0],
            [1,0,0,0,0,0,0,0,0,1]
        ]
        
        for(let i = 0; i < this.board.size; i++)
            for(let j = 0; j < this.board.size; j++)
                if(map[i][j] !== 0) {
                    this.board.elements.push({x : i, y : j , type : map[i][j]})
                }
```

Desde el lado del cliente se reciben los mensajes en `Gameservice.ts` y hace uso de una cola para gestionar los mensajes:

```javascript
checkScheduler() {
        if (!this.#queue.isEmpty()) {
            if (this.#parallel == null) {
                this.#parallel = setInterval(
                    async ()=>{
                        const action = this.#queue.getMessage();
                        if (action != undefined) {
                            await this.#actionsList[action.type] (action.content);
                        } else {
                            this.stopScheduler();
                        }
                    }
                );
            }
        }
    }
```

LLegada de un jugador al cliente :

```javascript
// GameService.js
  async do_newPlayer (payload) {
        console.log("ha llegado un jugador nuevo");
        console.log(payload);
        this.#players.push(payload);
        this.#ui.getPlayerInfo(payload);
    }
```


LLegada del tablero al cliente:

```javascript
// GameService.js
  async do_newBoard(payload) {
        this.#board.build(payload );  
        this.#board.assingPlayerPosition(this.#players);
        console.log("PLAYERS CON POSICIONES ASIGNADAS");
        console.log(this.#players);
        this.#ui.drawBoard(this.#board.map);
    }
```

En este método una vez esta creado el tablero se asigna la posición de los jugadores en el tablero y se dibuja el tablero en el cliente.

```javascript
//Método para asignar posicion 
 assingPlayerPosition(players) {
     
        const availableCorners = [...this.#corners];
        players.forEach(jugadores => {
            if (availableCorners.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableCorners.length);
                const corner = availableCorners.splice(randomIndex, 1)[0];
                jugadores.x = corner.x;
                jugadores.y = corner.y;
            }
        });
    }
```

```javascript
//Método para dibujar el tablero
UIv1.drawBoard = (board) => {

    console.log("dsadasd");
    console.log(board);
    if (board !== undefined) {
        console.log(board);
        const base = document.getElementById(UIv1.uiElements.board);
        base.innerHTML = '';
        
        base.style.gridTemplateColumns = `repeat(${board.length}, 100px)`;
        base.style.gridTemplateRows = `repeat(${board.length}, 100px)`;
        board.forEach(element => element.forEach((element) => {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            if (element === 5) tile.classList.add("bush");
            if (element === 1) tile.classList.add("player");
            base.appendChild(tile);
            anime({
                targets: tile,
                opacity: [0, 1],
                duration: (Math.random() * 8000) + 1000,
                easing: 'easeInOutQuad'
            });
        }));
    }
}
```

Una vez el tablero se genera visualmente aparecen los botones en la interfaz con el siguiente método:

```javascript
UIv1.showButtons = () => {
    const base = document.getElementById("buttons-container");
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons-container");

    const rotateButton = document.createElement("button");
    rotateButton.appendChild(document.createTextNode("Girar"));
    rotateButton.onclick = () => {
        ConnectionHandler.socket.emit("message", {
            type: "ROTATE",
            content: "rota"
        });

    };

    const moveButton = document.createElement("button");
    moveButton.appendChild(document.createTextNode("Avanzar"));
    moveButton.onclick = () => {
          ConnectionHandler.socket.emit("message", {
            type: "MOVE",
            content: "Muevo"
        });

    };

    const killButton = document.createElement("button");
    killButton.appendChild(document.createTextNode("Matar"));
    killButton.onclick = () => {
          ConnectionHandler.socket.emit("message", {
            type: "KILL",
            content: "Mato"
        });

    };

    buttonsContainer.appendChild(rotateButton);
    buttonsContainer.appendChild(moveButton);
    buttonsContainer.appendChild(killButton);
    base.appendChild(buttonsContainer);
}
```

El servidor esta preparado para recibir mensages desde el cliente por medio de la clase ConnectionHandler.js

```javascript
export const ConnectionHandler = {
    connected: false,
    socket: null,
    url: null,
    controller: null,

    init: (url, controller, onConnectedCallBack, onDisconnectedCallBack) => {
        ConnectionHandler.controller = controller;
        ConnectionHandler.socket = io(url);

        const socket  = ConnectionHandler.socket;

        socket.onAny((message, payload) => {
            console.log("Esta llegando: ");
            console.log(payload);
            console.log(payload.type);
            console.log(payload.content);

          });

        socket.on("connect", (data) => {
            socket.on("connectionStatus", (data) => {
                ConnectionHandler.connected = true;
                console.log(data);
                onConnectedCallBack();
            });
            socket.on("message", (payload) => {
                ConnectionHandler.controller.actionController(payload);
      
            })
            socket.on("disconnect", () => {
                ConnectionHandler.connected = false;
                onDisconnectedCallBack();
            });
        })
    }
}
```


## Objetivos logrados 

| Objetivo                                                                 | Estado     |
|--------------------------------------------------------------------------|------------|
| Implementación de un tablero de tamaño NxN correctamente generado.       | Logrado    |
| Configuración inicial de los jugadores en las esquinas del tablero.      | Logrado    |
| Configuración del servidor para manejar conexiones de clientes vía WebSockets. | Logrado    |
| Envío y recepción de mensajes de manera eficiente entre cliente y servidor. | Logrado    |
| Diseño de una interfaz intuitiva para la interacción del jugador.        | Logrado    |
| Representación visual dinámica del tablero y los jugadores según datos del servidor. | Logrado    |
| Adaptabilidad del cliente a posibles rediseños o mejoras futuras.        | Logrado    |
| Implementación de salas para gestionar partidas independientes.          | Logrado    |
| Uso adecuado de clases, objetos JSON y patrones de diseño.               | Logrado    |
| Código modular y bien estructurado que facilite la escalabilidad.        | Logrado    |

## Objetivos no logrados 

| Objetivo                                                                 | Estado     |
|--------------------------------------------------------------------------|------------|
| Implementación de ataques entre jugadores con reglas de distancia.       | No logrado |
| Implementación de casillas de escondite con normas de posicionamiento adecuadas. | No logrado |
| Manejo de desconexiones y reconexiones de jugadores sin afectar la partida. | No logrado |
| Implementación de eventos de juego: desplazamiento, rotación y disparo.  | No logrado |
| Control centralizado del estado del juego en el servidor.                | No logrado |
| Compartición eficiente de datos del mapa entre todos los clientes.       | No logrado |
| Manejo de finalización de partidas y asignación de ganadores.            | No logrado |
| Refactorización del cliente para adaptarlo a Angular.                    | No logrado |
| Implementación de servicios y componentes en Angular para la gestión del juego. | No logrado |

No he sido capaz de distinguir la informacion de un jugador a otro para poder tratarla de forma individual y que en el caso de que le diese a girar girarse un jugador, cuando le daba a girar desde cualquier jugador los datos que trataba siempre eran los del mismo jugador 
