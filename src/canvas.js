import React, {Component} from 'react';
import {v4} from 'uuid';
import Pusher from 'pusher-js';

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.endPaintEvent = this.endPaintEvent.bind(this);

        this.pusher = new Pusher('acce4c6966a40fbe3d47', {
            cluster: 'us2',
        });
    }

    isPainting = false;
    // Colores distintos para usuario e invitado
    userStrokeStyle = '#EE92C2';
    guestStrokeStyle = '#F0C987';
    line = [];
    // v4 cre un id único para poder diferencia entre usuario e invitado ya que no hay autenticación
    userId = v4();
    prevPos = {offsetX: 0, offsetY: 0};

    onMouseDown({nativeEvent}) {
        const {offsetX, offsetY} = nativeEvent;
        this.isPainting = true;
        this.prevPos = {offsetX, offsetY};
    }

    onMouseMove({nativeEvent}) {
        if (this.isPainting) {
            const {offsetX, offsetY} = nativeEvent;
            const offSetData = {offsetX, offsetY};

            const positionData = {
                start: {...this.prevPos},
                stop: {...offSetData},
            };

            // Add the position to the line array
            this.line = this.line.concat(positionData);
            this.paint(this.prevPos, offSetData, this.userStrokeStyle);
            this.sendPaintData();
        }
    }

    endPaintEvent() {
        if (this.isPainting) {
            this.isPainting = false;
        }
    }

    paint(prevPos, currPos, strokeStyle) {
        const {offsetX, offsetY} = currPos;
        const {offsetX: x, offsetY: y} = prevPos;
        this.ctx.beginPath();
        this.ctx.strokeStyle = strokeStyle;

        this.ctx.moveTo(x, y);

        this.ctx.lineTo(offsetX, offsetY);

        this.ctx.stroke();
        this.prevPos = {offsetX, offsetY};
    }

    async sendPaintData() {
        const body = {
            line: this.line,
            userId: this.userId,
        };
        await fetch('http://localhost:4000/paint', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json',
            },
        });

        this.line = [];
    }

    componentDidMount() {
        this.canvas.width = 1000;
        this.canvas.height = 800;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 5;

        const channel = this.pusher.subscribe('painting');
        channel.bind('draw', (data) => {
            const { userId, line } = data;
            if (userId !== this.userId) {
                line.forEach((position) => {
                    this.paint(position.start, position.stop, this.guestStrokeStyle);
                });
            }
        });
    }

    render() {
        return (
            <canvas
                ref={(ref) => (this.canvas = ref)}
                style={{background: 'black'}}
                onMouseDown={this.onMouseDown}
                onMouseLeave={this.endPaintEvent}
                onMouseUp={this.endPaintEvent}
                onMouseMove={this.onMouseMove}
            />
        );
    }
}

export default Canvas;